import os from "os";
import path from "path";
import fs from "fs";
import { execSync } from "child_process";

import { sleep } from "radash";
import archiver from "archiver";

import type { Context } from "..";
import type { BoltOptions } from "../types";
import { log } from "../log";
import { removeIfExists, safeCreate, tmpDir } from "../lib/utils";
import { copyFiles } from "./copy-files";

export async function handleZXP(options: BoltOptions, context: Context) {
	if (!context.isPackage) return;

	const distDir = path.join(__dirname, options.dev.outDir);
	const zxpDir = path.join(__dirname, options.dev.outDir, "zxp");
	const zipDir = path.join(__dirname, options.dev.outDir, "zip");

	const zxpPath = await signZXP(options, distDir, zxpDir, tmpDir);

	if (!context.isMetaPackage) return;

	await metaPackage(
		options,
		zipDir,
		zxpPath,
		options.dev.root,
		options.bundle?.zipAssets
	);
}

async function signZXP(
	config: BoltOptions,
	input: string,
	zxpDir: string,
	tmpDir: string
) {
	const name = config.extension.id;
	const data = config.zxp;

	const output = path.join(zxpDir, `${name}.zxp`);
	const certPath = path.join(tmpDir, `${name}-cert  `);

	const zxpCmd = os.platform() == "win32" ? `ZXPSignCmd` : `./ZXPSignCmd`;
	const cwdDir = path.join(__dirname, "..", "bin");

	const signPrepStr = `${zxpCmd} -selfSignedCert ${data.country} ${data.province} ${data.org} ${name} ${data.password} "${certPath}"`;
	const signStr = `${zxpCmd} -sign "${input}" "${output}" "${certPath}" ${data.password} -tsa ${data.tsa}`;

	removeIfExists(output);
	safeCreate(zxpDir);

	console.log({ signPrepStr });
	execSync(signPrepStr, { cwd: cwdDir, encoding: "utf-8" });
	console.log({ signStr });

	const jsx = path.join(input, "jsx");

	let waits = 1;
	while (!fs.existsSync(jsx) || fs.readdirSync(jsx).length === 0) {
		console.log(`waiting for ExtendScript to finish... ${100 * waits++}ms`);
		await sleep(100);
	}

	execSync(signStr, { cwd: cwdDir, encoding: "utf-8" });
	// TODO: replace with log.info()
	resultLog("built zxp", true, output);

	return output;
}

async function metaPackage(
	config: BoltOptions,
	dest: string,
	zxp: string,
	src: string,
	assets?: string[]
) {
	const tmpDir = path.join(dest, "tmp");
	log.info({ dest, zxp, src, assets });

	fs.mkdirSync(tmpDir, { recursive: true });
	fs.copyFileSync(zxp, path.join(tmpDir, path.basename(zxp)));

	if (assets) copyFiles({ src, dest: tmpDir, assets });

	const zipName = `${config.extension.displayName}_${config.extension.version}`;
	const zip = await createZip(tmpDir, dest, zipName);

	resultLog("built zip", true, zip);
	fs.rmSync(tmpDir, { recursive: true });

	return zip;
}

function createZip(src: string, dst: string, name: string): Promise<string> {
	return new Promise((resolve, reject) => {
		const archive = archiver("zip");

		const zipDest = path.join(dst, `${name}.zip`);
		const output = fs.createWriteStream(zipDest);

		output.on("close", () => resolve(zipDest));
		archive.on("error", (err) => reject(err.message));

		archive.pipe(output);
		archive.directory(src, false);
		archive.finalize();
	});
}

function resultLog(str: string, succeeded: boolean, info?: string) {
	const res = succeeded ? "succeeded √" : "failed ×";
	// const color = succeeded ? conColors.cyan : conColors.red;
	const color = "";
	console.log(`${color}${str} → ${res} ${(info && ":") || ""} ${info || ""}`);
	if (!succeeded) throw info;
}
