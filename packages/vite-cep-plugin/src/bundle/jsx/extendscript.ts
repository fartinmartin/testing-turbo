import path from "path";
import fs from "fs";

import nodeResolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";
import { rollup, watch } from "rollup";

import type { OutputOptions, RollupOptions } from "rollup";
import type { Context } from "../..";
import type { BoltOptions } from "../../types";
import { jsxInclude, jsxBin, jsxPonyfill } from ".";
import { log } from "../../lib/log";

export async function handleExtendScript(
	options: BoltOptions,
	Context: Context
) {
	const config = getConfig(options, Context);

	if (Context.isBuild) {
		await build(config);
	} else {
		watchRollup(options, config);
	}
}

function getConfig(options: BoltOptions, { isPackage }: Context) {
	const { extensions, babelOptions, includes, ponyfills, rollupOverrides } =
		options.extendscript;
	const _extensions = [".js", ".ts", ".tsx", ...extensions];

	const config: RollupOptions = {
		input: path.resolve(options.extendscript.root, "index.ts"),
		treeshake: true,

		output: {
			file: path.join(
				options.dev.output.root,
				options.dev.output.cep,
				"host",
				"index.js"
			),
			sourcemap: isPackage ? options.zxp.sourceMap : options.build?.sourceMap,
		},

		plugins: [
			json(),

			nodeResolve({
				extensions: _extensions,
			}),

			babel({
				exclude: /node_modules/,
				babelrc: false,
				babelHelpers: "inline",
				presets: ["@babel/preset-env", "@babel/preset-typescript"],
				plugins: [
					"@babel/plugin-syntax-dynamic-import",
					"@babel/plugin-proposal-class-properties",
				],
				...babelOptions,
				extensions: _extensions,
			}),

			jsxPonyfill(ponyfills),

			jsxInclude({
				iife: includes.iife ?? true,
				globalThis: includes.globalThis ?? "thisObj",
			}),

			jsxBin(isPackage ? options.zxp.jsxBin : options.build?.jsxBin),
		],
		...(rollupOverrides ?? {}),
	};

	return config;
}

async function build(config: RollupOptions) {
	// rollup isn't able to resolve `src/host/aeft.ts` eg
	const bundle = await rollup(config);
	await bundle.write(config.output as OutputOptions);
	await bundle.close();
}

async function watchRollup(options: BoltOptions, config: RollupOptions) {
	const watcher = watch(config);

	watcher.on("event", ({ result }: any) => {
		if (!result) return;
		triggerHMR(options);
		result.close();
	});

	watcher.close();
}

function triggerHMR({ panels, dev }: BoltOptions) {
	// no built-in way to trigger Vite's HMR reload from outside the root folder
	// workaround will read and save index.html file for each panel to triggger reload
	log.info("ExtendScript Change");

	panels.map((panel) => {
		const tmpPath = path.join(
			dev.output.root,
			dev.panels,
			panel.root,
			"index.html"
		);
		console.log(tmpPath);
		if (fs.existsSync(tmpPath)) {
			const txt = fs.readFileSync(tmpPath, { encoding: "utf-8" });
			fs.writeFileSync(tmpPath, txt, { encoding: "utf-8" });
		}
	});
}
