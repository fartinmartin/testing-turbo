import type { ConfigEnv, Plugin } from "vite";
import { assign } from "radash";

import type { BoltOptions } from "./types/bolt";
import * as Bundle from "./bundle";
import * as Config from "./config";
import { log } from "./lib";

export * from "./types";

// flags for dev (there's probably a better way to go about this, but here we are)
const LOG_HOOK_NAME = false;
const LOG_ALL_LEVELS = false;

export function bolt(options: BoltOptions): Plugin {
	let context: Context;

	return {
		name: "bolt-cep",

		/**
		 * [vite] config(): modify vite config before it's resolved.
		 *
		 * here we merge `bolt.config.ts` and/or options provided to the `bolt` vite plugin
		 * with the user's vite config while also enforcing some `bolt-cep` requirements.
		 */
		config: async function (config, env) {
			if (LOG_HOOK_NAME) console.log("[01] [config]");
			context = setContext(env);

			const optionsFromConfigFile = await Config.loadConfigFile();
			const newOptions = assign(options, optionsFromConfigFile);
			if (!LOG_ALL_LEVELS && newOptions.dev.logLevels) log.setLevels(newOptions.dev.logLevels); // prettier-ignore

			Config.warnOverriddenOptions(options, newOptions);
			options = Config.extendOptions(newOptions);

			const newConfig = Config.extendConfig(config, options);
			Config.warnOverriddenConfig(config, newConfig);

			return newConfig;
		},

		/**
		 * [vite] configResolved(): called after the vite config is resolved.
		 *
		 * in development, we need to write an `index.html` file for each panel in
		 * out project's `outDir` [because if we don't... (TODO)]
		 */
		configResolved: function (config) {
			if (LOG_HOOK_NAME) console.log("[02] [configResolved]");
			// if (config.isProduction) return; // TODO: is this accurate?? do we only perform the next line in dev??
			// is this where we want to handle this? not at the end? (mainly asking in re: to the conosle output, maybe that can be a separate function)
			const panels = Config.createDevIndexHtmls(config, options);
			context.panelPaths = panels;
		},

		/**
		 * [vite] configureServer(): hook for configuring the dev server.
		 *
		 * used to grab instance of dev server (in order to print accurate port numbers)
		 */
		configureServer: function (server) {
			if (LOG_HOOK_NAME) console.log("[03] [dev-only] [configureServer]");
			Config.logHtml(server, context);
		},

		/**
		 * [rollup] generateBundle(): called immediately before the files are written
		 *
		 * here we create `.debug` and `manifest.xml` files and make symlink to
		 * adobe's extension folder
		 */
		generateBundle: function () {
			if (LOG_HOOK_NAME) console.log("[03] [generateBundle]");
			Bundle.handleManifest.call(this, options);
			Bundle.handleDebug.call(this, options);
			Bundle.handleSymlink.call(this, options);
		},

		/**
		 * [vite] transformIndexHtml(): for transforming HTML entry point files
		 *
		 * (TODO...)
		 */
		transformIndexHtml: function (html, _context) {
			if (LOG_HOOK_NAME) console.log("[04] [transformIndexHtml]");
			// update asset paths from vite's default `assets/[asset.ext]` to out outDir path? why doesn't vite do this?
			// - css
			// update context with found packages imported with `require()`
			return html;
		},

		/**
		 * [rollup] writeBundle(): called only once all files have been written.
		 *
		 * here we handle post-build actions/the bundle options passed by user such
		 * as copying modules, files, zipping assets, etc. importantly, this is also
		 * where we trigger the extendscript build
		 */
		writeBundle: {
			sequential: true,
			handler: async function (_options, _bunddle) {
				if (LOG_HOOK_NAME) console.log("[05] [writeBundle]");
				await Bundle.handleExtendScript(options, context); // could use [vite] handleHotUpdate() hook maybe?
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
	panelPaths?: any[];
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
