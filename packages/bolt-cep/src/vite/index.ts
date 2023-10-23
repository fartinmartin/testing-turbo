import type { Plugin } from "vite";
import { createConfigHook } from "./config";
import { createWriteBundleHook } from "./bundle";
import { ExtendScriptConfig } from "./bundle/extendscript";

// lots stolen from sveltekit
// https://github.com/sveltejs/kit/blob/master/packages/kit/src/exports/vite/index.js

export interface BoltOptions {
	vite: {};
	cep: { panels: { mainPath: string }[] };
	extendscript: ExtendScriptConfig;
}

export type Flags = {
	isBuild: boolean;
};

export default function bolt(options: BoltOptions): Plugin {
	const flags: Flags = { isBuild: false };

	return {
		name: "bolt-cep",

		/**
		 * Build the Bolt-provided Vite config to be merged with the user's vite.config.js file.
		 * @see https://vitejs.dev/guide/api-plugin.html#config
		 */
		config: createConfigHook(options, flags),

		/**
		 * Vite builds a single bundle. We need three bundles: our React/Svelte/Vue
		 * app (client), the server (the uh.. server), and ExtendScript (host). The
		 * user's package.json scripts will invoke the Vite CLI to execute the
		 * server build. We then use this hook to kick off builds for the client and
		 * host.
		 */
		writeBundle: {
			sequential: true,
			handler: createWriteBundleHook(options, flags),
		},

		/**
		 * Stores the final config.
		 */
		configResolved(config) {},
	};
}
