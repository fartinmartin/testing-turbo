import path from "path";

import JoyCon from "joycon";
import { bundleRequire } from "bundle-require";

export async function loadConfigFile(cwd: string = process.cwd()) {
	const configJoycon = new JoyCon();

	const configPath = await configJoycon.resolve({
		files: ["bolt.config.ts"],
		cwd,
		stopDir: path.parse(cwd).root,
	});

	if (!configPath) return {};

	const config = await bundleRequire({ filepath: configPath });
	return config.mod.tsup || config.mod.default || config.mod || {};
}
