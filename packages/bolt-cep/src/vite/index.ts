import path from "path";
import { ConfigEnv, type Plugin } from "vite";
import { objectify, assign } from "radash";

import { loadConfigFile } from "./config/load";
import {
	handleExtendScript,
	handleCopyModules,
	handleCopyFiles,
	handleZXP,
} from "./bundle";
import type { BoltOptions } from "./types/bolt";
import { createDevIndexHtmls } from "./config/resolved";
import { warnOverriddenConfig } from "./config/warn";

export * from "./types";

export function bolt(options: BoltOptions): Plugin {
	let context: Context;

	return {
		name: "bolt-cep",

		/**
		 * config(): modify vite config before it's resolved.
		 *
		 * here we merge `bolt.config.ts` and/or options provided to the `bolt` vite plugin
		 * with the user's vite config while also enforcing some `bolt-cep` requirements.
		 */
		config: async function (config, env) {
			context = setContext(env);

			const optionsFromConfigFile = await loadConfigFile();
			const newOptions = assign(options, optionsFromConfigFile);
			// TODO: warnOverriddenOptions(options, newOptions);
			options = newOptions;
			// TODO: merge `options` (BoltOptions) with `config` (UserConfig) (where there is overlap) below is lame attempt at that
			// TODO: this should handle `options.panels`

			const { dev: { root, panels } } = options; // prettier-ignore
			const input = objectify(
				options.panels,
				(panel) => panel.root,
				(panel) => path.resolve(root, panels, panel.root, "index.html")
			);

			const overrides = {
				clearScreen: options.dev.clearScreen,
				build: {
					outDir: options.dev.outDir,
					emptyOutDir: true,
					rollupOptions: { input },
				},
				preview: { port: options.dev.ports.preview },
				server: { port: options.dev.ports.server },
				root: options.dev.root,
				target: options.dev.target,
				resolve: {
					alias: { "@esTypes": path.resolve(__dirname, "src") },
				},
			};

			const newConfig = assign(config, overrides);
			warnOverriddenConfig(config, newConfig);

			return newConfig;
		},

		/**
		 * configResolved(): called after the vite config is resolved.
		 *
		 * in development, we need to write an `index.html` file for each panel in
		 * out project's `outDir` [because if we don't... (TODO)]
		 */
		configResolved: function (config) {
			if (config.isProduction) return;
			createDevIndexHtmls(config, options);
		},

		/**
		 * transformIndexHtml(): for transforming HTML entry point files
		 *
		 * (TODO...)
		 */
		transformIndexHtml: function (html, _context) {
			// update asset paths from vite's default `assets/[asset.ext]` to out outDir path? why doesn't vite do this?
			// - css
			// update context with found packages imported with `require()`
			return html;
		},

		/**
		 * generateBundle(): called immediately before the files are written
		 *
		 * here we make symlink to adobe's extension folder
		 */
		generateBundle: function () {
			handleManifest();
			handleDebug();
			handleSymlink();
		},

		/**
		 * writeBundle(): called only once all files have been written.
		 *
		 * here we handle post-build actions/the bundle options passed by user such
		 * as copying modules, files, zipping assets, etc. importantly, this is also
		 * where we trigger the extendscript build
		 */
		writeBundle: {
			sequential: true,
			handler: async function (_options, _bunddle) {
				await handleExtendScript(options, context);
				await handleCopyModules(options, context);
				await handleCopyFiles(options, context);
				await handleZXP(options, context);
			},
		},
	};
}

export type Context = {
	isBuild: boolean;
	isProduction: boolean;
	debugReact: boolean;
	isMetaPackage: boolean;
	isPackage: boolean;
	isServe: boolean;
	action: string | undefined;
	packages: string[];
};

function setContext(env: ConfigEnv): Context {
	const isMetaPackage = process.env.ZIP_PACKAGE === "true";
	return {
		isBuild: env.command === "build",
		isProduction: process.env.NODE_ENV === "production",
		isServe: process.env.SERVE_PANEL === "true",
		// what is the difference between `isBuild`, `isProduction`, and `isServe` exactly?
		debugReact: process.env.DEBUG_REACT === "true",
		isMetaPackage,
		isPackage: process.env.ZXP_PACKAGE === "true" || isMetaPackage,
		action: process.env.ACTION,
		packages: [],
	};
}
