import path from "path";
import { ConfigEnv, type Plugin } from "vite";
import { objectify, assign } from "radash";

import { loadConfigFile } from "./config/load";
import { handleExtendScript } from "./bundle";
import type { BoltOptions } from "./types/bolt";
import { createDevIndexHtmls } from "./config/resolved";
import { warnOverriddenConfig } from "./config/warn";

// lots stolen from sveltekit
// https://github.com/sveltejs/kit/blob/master/packages/kit/src/exports/vite/index.js

export * from "./types";

export function bolt(options: BoltOptions): Plugin {
	let flags: Flags;

	return {
		name: "bolt-cep",

		/**
		 * config(): modify vite config before it's resolved.
		 *
		 * here we merge `bolt.config.ts` and/or options provided to the `bolt` vite plugin
		 * with the user's vite config while also enforcing some `bolt-cep` requirements.
		 */
		config: async function (config, env) {
			flags = setFlags(env);

			const optionsFromConfigFile = await loadConfigFile();
			const newOptions = assign(options, optionsFromConfigFile);
			// TODO: warnOverriddenOptions(options, newOptions);
			options = newOptions;
			// TODO: merge `options` (BoltOptions) with `config` (UserConfig) (where there is overlap) below is lame attempt at that

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
		 * in development, (TODO...)
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
			return html;
		},

		/**
		 * writeBundle(): called only once all files have been written.
		 *
		 * here we handle host-related code, (TODO...)
		 */
		writeBundle: {
			sequential: true,
			handler: async function (_options, _bunddle) {
				await handleExtendScript(options, flags);
			},
		},
	};
}

export type Flags = {
	isBuild: boolean;
	isProduction: boolean;
	debugReact: boolean;
	isMetaPackage: boolean;
	isPackage: boolean;
	isServe: boolean;
	action: string | undefined;
};

function setFlags(env: ConfigEnv): Flags {
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
	};
}
