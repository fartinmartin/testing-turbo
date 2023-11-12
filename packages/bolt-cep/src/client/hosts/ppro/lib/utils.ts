import { fs } from "../../../node";

export const readDirSafe = (dir: string) =>
	fs.existsSync(dir) ? fs.readdirSync(dir) : [];
