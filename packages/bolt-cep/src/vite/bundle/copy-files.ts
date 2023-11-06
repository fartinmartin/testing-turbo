import path from "path";
import fs from "fs-extra";

import type { Context } from "..";
import type { BoltOptions } from "../types";
import { log } from "../log";

export async function handleCopyFiles(options: BoltOptions, context: Context) {
	if (!options.bundle?.copyAssets) return;

	copyFiles({
		src: path.join(process.cwd(), options.dev.root),
		dest: path.join(process.cwd(), options.dev.outDir),
		assets: options.bundle?.copyAssets ?? [],
	});
}

interface CopyFilesArgs {
	src: string;
	dest: string;
	assets: string[];
}

export function copyFiles({ src, dest, assets }: CopyFilesArgs) {
	log.info(`Copying ${assets.length} Assets`);

	assets.map((asset: string) => {
		const fullSrcPath = path.join(src, asset);

		if (asset.indexOf("/*") === asset.length - 2) {
			// flatten folder
			const folder = asset.substring(0, asset.length - 2);
			const files = fs.readdirSync(path.join(src, folder));

			files.map((file) => {
				const fullSrcPath = path.join(src, folder, file);
				const fullDstPath = path.join(dest, file);

				log.info(`COPY ${fullSrcPath} to ${fullDstPath}`);

				fs.ensureDirSync(path.dirname(fullDstPath));
				fs.copySync(fullSrcPath, fullDstPath);
			});
		} else {
			const fullDstPath = path.join(dest, asset);

			log.info(`COPY ${fullSrcPath} to ${fullDstPath}`);

			fs.ensureDirSync(path.dirname(fullDstPath));
			fs.copySync(fullSrcPath, fullDstPath);
		}
	});
}
