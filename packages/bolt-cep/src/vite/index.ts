import { ConfigEnv, type Plugin } from "vite";
import { assign } from "radash";

import type { BoltOptions } from "./types/bolt";
import * as Bundle from "./bundle";
import * as Config from "./config";

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

			const optionsFromConfigFile = await Config.loadConfigFile();
			const newOptions = assign(options, optionsFromConfigFile);
			// TODO: warnOverriddenOptions(options, newOptions);
			options = Config.extendOptions(newOptions);

			const newConfig = Config.extendConfig(config, options);
			Config.warnOverriddenConfig(config, newConfig);

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
			Config.createDevIndexHtmls(config, options);
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
			Bundle.handleManifest.call(this, options);
			Bundle.handleDebug.call(this, options);
			Bundle.handleSymlink.call(this, options);
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
				await Bundle.handleExtendScript(options, context);
				await Bundle.handleCopyModules(options, context);
				await Bundle.handleCopyFiles(options, context);
				await Bundle.handleZXP(options, context);
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
