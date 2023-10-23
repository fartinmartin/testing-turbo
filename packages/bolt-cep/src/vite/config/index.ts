import type { Plugin, UserConfig, ConfigEnv } from "vite";
import type { BoltOptions, Flags } from "..";
import { defaultConfig } from "./default";

export function createConfigHook(
	options: BoltOptions,
	flags: Flags
): Plugin["config"] {
	const config: Plugin["config"] = (config: UserConfig, env: ConfigEnv) => {
		flags.isBuild = env.command === "build";

		defaultConfig;

		const newConfig = {};

		warnOverriddenConfig(config, newConfig);

		return newConfig;
	};

	return config;
}

function warnOverriddenConfig(config: UserConfig, resolvedConfig: UserConfig) {
	const overridden: string[] = []; // TODO: implement this check

	if (overridden.length > 0) {
		const keys = overridden.map((key) => `\n  - ${key}`).join("");
		console.error(
			`The following Vite config options will be overridden by Bolt CEP: ${keys}`
		);
	}
}
