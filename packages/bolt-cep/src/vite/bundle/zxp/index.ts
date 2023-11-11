import path from "path";

import type { Context } from "../..";
import type { BoltOptions } from "../../types";
import { tmpDir } from "../../lib/utils";
import { signZXP } from "./sign";
import { metaPackage } from "./metaPackage";

export async function handleZXP(options: BoltOptions, context: Context) {
	if (!context.isPackage) return;

	const distDir = path.join(__dirname, options.dev.output.root);
	const zxpDir = path.join(distDir, options.dev.output.zxp);
	const zipDir = path.join(distDir, options.dev.output.zip);

	const zxpPath = await signZXP(options, distDir, zxpDir, tmpDir);

	if (!context.isMetaPackage) return;

	await metaPackage(
		options,
		zipDir,
		zxpPath,
		options.dev.input.root,
		options.bundle?.zipAssets
	);
}

export function resultLog(str: string, succeeded: boolean, info?: string) {
	const res = succeeded ? "succeeded √" : "failed ×";
	// const color = succeeded ? conColors.cyan : conColors.red;
	const color = "";
	console.log(`${color}${str} → ${res} ${(info && ":") || ""} ${info || ""}`);
	if (!succeeded) throw info;
}
