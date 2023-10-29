import * as path from "path";
import * as fs from "fs-extra";
import { tmpDir } from "../../lib/tmp-dir";

const jsxbin = require("jsxbin");

export const jsxBin = (jsxBinMode?: "off" | "copy" | "replace") => {
	return {
		name: "extendscript-jsxbin",
		generateBundle: async function (output: any, bundle: any) {
			if (jsxBinMode === "copy" || jsxBinMode === "replace") {
				const esFile = Object.keys(bundle).pop();
				if (esFile) {
					// console.log("GENERATE JSXBIN");
					const srcFilePathTmp = path.join(tmpDir, esFile);
					const esFileBin = esFile.replace("js", "jsxbin");
					const dstFilePathTmp = path.join(tmpDir, esFileBin);
					const tmpSrc = fs.writeFileSync(srcFilePathTmp, bundle[esFile].code, {
						encoding: "utf-8",
					});
					await jsxbin(srcFilePathTmp, dstFilePathTmp);
					const output = fs.readFileSync(dstFilePathTmp, { encoding: "utf-8" });
					const jsxBinFile = {
						type: "asset",
						source: output,
						name: "JSXBIN",
						fileName: esFileBin,
					};
					//@ts-ignore
					this.emitFile(jsxBinFile);
					console.log(`JSXBIN Created: ${esFileBin}`);
					if (jsxBinMode === "replace") {
						delete bundle[esFile];
					}
				}
			}
		},
	};
};
