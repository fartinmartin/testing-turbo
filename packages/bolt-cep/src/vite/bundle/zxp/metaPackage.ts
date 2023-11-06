import path from "path";
import fs from "fs";
import type { BoltOptions } from "../../types";
import { log, createZip } from "../../lib";
import { copyFiles } from "../copy/copy-files";
import { resultLog } from ".";

export async function metaPackage(
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
