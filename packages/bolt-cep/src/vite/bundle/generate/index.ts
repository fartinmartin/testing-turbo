import path from "path";
import { EmittedFile, PluginContext } from "rollup";
import type { BoltOptions } from "../../types";
import * as Templates from "@vite/templates";
import { log, ccExtensionDir, makeSymlink } from "@vite/lib";

export function handleDebug(this: PluginContext, options: BoltOptions) {
	const xml = Templates.debugTemplate(options);

	const debugFile = {
		type: "asset",
		source: xml,
		name: "CEP Debug File",
		fileName: path.join(".debug"),
	} satisfies EmittedFile;

	this.emitFile(debugFile);
	log.info("debug file created");
}

export function handleManifest(this: PluginContext, options: BoltOptions) {
	const xml = Templates.manifestTemplate(options);

	const manifestFile = {
		type: "asset",
		source: xml,
		name: "CEP Manifest File",
		fileName: path.join("CSXS", "manifest.xml"),
	} satisfies EmittedFile;

	this.emitFile(manifestFile);
	log.info("manifest file created");
}

export function handleSymlink(this: PluginContext, options: BoltOptions) {
	const symlinkPath =
		options.dev.symlink === "global"
			? ccExtensionDir.global
			: ccExtensionDir.local;

	try {
		const res = makeSymlink(
			path.join(options.dev.output.root, options.dev.output.cep),
			path.join(symlinkPath, options.extension.id)
		);
	} catch (e) {
		console.warn(e);
	} finally {
		console.log("");
	}
}
