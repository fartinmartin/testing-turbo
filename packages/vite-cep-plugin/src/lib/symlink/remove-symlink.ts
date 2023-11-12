import * as fs from "fs-extra";
import { log } from "../../lib";
import { symlinkExists } from "./symlink-exists";

export const removeSymlink = (dist: string, dest: string) => {
	try {
		if (symlinkExists(dest)) {
			fs.unlinkSync(dest);
			log.info("symlink removed successfully");
			return "removed";
		} else {
			log.info("no symlink exists");
			return "none";
		}
	} catch (e) {
		log.error(
			"symlink removal failed. Try removing with 'sudo yarn delsymlink'"
		);
		return "error";
	}
};
