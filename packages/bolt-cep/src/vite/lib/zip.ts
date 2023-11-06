import path from "path";
import fs from "fs";
import archiver from "archiver";

export function createZip(
	src: string,
	dst: string,
	name: string
): Promise<string> {
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
