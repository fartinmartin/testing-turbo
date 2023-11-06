import path from "path";
import fs from "fs-extra";

export const tmpDir = path.join(__dirname, ".tmp");
fs.ensureDirSync(tmpDir);

export const removeIfExists = (dir: string) => {
	try {
		fs.existsSync(dir) && fs.removeSync(dir);
		return [true, "Removed"];
	} catch (e) {
		return [false, e];
	}
};

export const safeCreate = (dir: string) => {
	try {
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir);
			return [true, "Created"];
		}
		return [true, "Already Exists"];
	} catch (e) {
		return [false, e];
	}
};
