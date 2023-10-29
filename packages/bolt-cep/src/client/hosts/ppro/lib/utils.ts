import { fs } from "@client/node";

export const readDirSafe = (dir: string) =>
	fs.existsSync(dir) ? fs.readdirSync(dir) : [];
