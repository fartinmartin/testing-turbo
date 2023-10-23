import path from "path";
import fs from "fs";

import type { BoltOptions, Flags } from "..";
import type { OutputOptions, RollupOptions } from "rollup";
import type { RollupBabelInputPluginOptions } from "@rollup/plugin-babel";

import { rollup, watch } from "rollup";

export interface ExtendScriptConfig {
	extenstions: string[];
	babel: RollupBabelInputPluginOptions;
	ponyfills: Ponyfill[];
	jsxbin: "off" | "copy" | "replace";
	includes: {
		iife: boolean;
		globalThis: string;
	};
}

interface Ponyfill {
	find: string;
	replace: string;
	inject: string;
}

export async function handleExtendScript(
	options: BoltOptions,
	{ isBuild }: Flags
) {
	const config = getConfig(options);

	if (isBuild) {
		await build(config);
	} else {
		watchRollup(options, config);
	}
}

function getConfig(options: BoltOptions) {
	return {} as RollupOptions;
}

async function watchRollup(options: BoltOptions, config: RollupOptions) {
	const watcher = watch(config);

	watcher.on("event", ({ result }: any) => {
		if (!result) return;
		triggerHMR(options); // TODO: double check that this is necessary
		result.close();
	});

	watcher.close();
}

async function build(config: RollupOptions) {
	const bundle = await rollup(config);
	await bundle.write(config.output as OutputOptions);
	await bundle.close();
}

function triggerHMR({ cep }: BoltOptions) {
	// No built-in way to trigger Vite's HMR reload from outside the root folder
	// Workaround will read and save index.html file for each panel to triggger reload
	console.log("ExtendScript Change");

	cep.panels.map((panel) => {
		const tmpPath = path.join(process.cwd(), "src", "js", panel.mainPath);
		if (fs.existsSync(tmpPath)) {
			const txt = fs.readFileSync(tmpPath, { encoding: "utf-8" });
			fs.writeFileSync(tmpPath, txt, { encoding: "utf-8" });
		}
	});
}
