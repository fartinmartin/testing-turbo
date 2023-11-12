import path from "path";
import type { UserConfig } from "vite";
import { objectify, assign } from "radash";

import type { BoltOptions } from "../types/bolt";

// TODO: merge `options` (BoltOptions) with `config` (UserConfig) (where there is overlap) below is lame attempt at that
export function extendConfig(config: UserConfig, options: BoltOptions) {
	const { dev: { input, output, panels } } = options; // prettier-ignore

	const inDir = path.join(input.root, input.client);
	const outDir = path.join(process.cwd(), output.root, output.cep);

	const inputs = objectify(
		options.panels,
		(panel) => panel.root,
		(panel) => path.resolve(inDir, panels, panel.root, "index.html")
	);

	const overrides = {
		clearScreen: options.dev.clearScreen,
		build: {
			outDir,
			emptyOutDir: true,
			rollupOptions: { input: inputs },
		},
		preview: { port: options.dev.ports.preview },
		server: { port: options.dev.ports.server },
		root: inDir,
		target: options.dev.target,
		resolve: {
			alias: { "@esTypes": path.resolve(__dirname, "src") },
		},
	};

	return assign(config, overrides);
}

export function extendOptions(options: BoltOptions) {
	// TODO: this should handle default values, including `options.panels` options, and return a new BoltOptionsExtended type (where all values are present)

	return options;
}
