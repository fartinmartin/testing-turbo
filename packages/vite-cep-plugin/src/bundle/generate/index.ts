import path from "path";
import { EmittedFile, PluginContext } from "rollup";
import type { BoltOptions } from "../../types";
import * as Templates from "../../templates";
import { log, ccExtensionDir, makeSymlink } from "../../lib";

export function createDebug(this: PluginContext, options: BoltOptions) {
	const xml = Templates.debugTemplate(options);

	const debugFile = {
		type: "asset",
		source: xml,
		name: "CEP Debug File",
		fileName: path.join(".debug"),
	} satisfies EmittedFile;

	const res = this.emitFile(debugFile);
	log.info(`file created: .debug`);
}

export function createManifest(this: PluginContext, options: BoltOptions) {
	const xml = Templates.manifestTemplate(options);

	const manifestFile = {
		type: "asset",
		source: xml,
		name: "CEP Manifest File",
		fileName: path.join("CSXS", "manifest.xml"),
	} satisfies EmittedFile;

	const res = this.emitFile(manifestFile);
	log.info(`file created: manifest.xml`);
}

export function createSymlink(this: PluginContext, options: BoltOptions) {
	const symlinkPath =
		options.dev.symlink === "global"
			? ccExtensionDir.global
			: ccExtensionDir.local;

	try {
		const res = makeSymlink(
			path.join(options.dev.output.root, options.dev.output.cep),
			path.join(symlinkPath, options.extension.id)
		);
		log.info(`symlink: ${res}`);
	} catch (e) {
		console.warn(e);
	} finally {
		console.log("");
	}
}
