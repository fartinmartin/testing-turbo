import type { ConfigEnv, Plugin } from "vite";
import { assign } from "radash";

import type { BoltOptions } from "./types/bolt";
import * as Bundle from "./bundle";
import * as Config from "./config";
import * as HTML from "./html";
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
			if (config.isProduction) return;
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
			if (context.panelPaths) Config.logPanelPaths(server, context); // since `configureServer` is a dev hook, context will have `panelPaths` from `configResolved`, this if check is just for readability
		},

		/**
		 * [rollup] generateBundle(): called immediately before the files are
		 * written
		 *
		 * here we create `.debug` and `manifest.xml` files and make symlink to
		 * adobe's extension folder. we also use this hook to parse all `require`s
		 * in order to copy these modules to `cep/node_modules`.
		 *
		 * finally, we also want to fix asset paths in all of the css and js assets
		 * in our bundle (see `transformIndexHtml` for more complete explanation and
		 * second half of this story, aka `index.html` transform)
		 */
		generateBundle: function (_options, bundle) {
			if (LOG_HOOK_NAME) console.log("[03] [generateBundle]");
			Bundle.createManifest.call(this, options);
			Bundle.createDebug.call(this, options);
			Bundle.createSymlink.call(this, options);

			context.packages = Bundle.getRequires(bundle);
			// Bundle.fixJS();

			// Bundle.fixAssetPathsJS();
			// Bundle.fixAssetPathsCSS();
		},

		/**
		 * [vite] transformIndexHtml(): for transforming HTML entry point files
		 *
		 * vite bundles relative to the `UserConfig.outDir`, but we are combining
		 * our outDir with other (`host`) outputs in our `cep` folder. this means
		 * our file paths will be out of sync.
		 */
		transformIndexHtml: function (html, _context) {
			if (LOG_HOOK_NAME) console.log("[04] [transformIndexHtml]");
			// TODO: injectRequire
			// TODO: remove favicon?
			// TODO: return early if dev?
			// THEN: fix asset paths, remove type="module"/rel="module" attributes
			HTML.transformHtml(html, _context, options);
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
