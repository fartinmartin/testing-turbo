import type { UserConfig } from "vite";

const enforcedConfig = {
	clearScreen: false,
	build: { outDir: "", emptyOutDir: true, rollupOptions: { input: {} } },
	preview: { port: 0 },
	server: { port: 0 },
	root: "",
	target: "chrome74",
};

export function warnOverriddenConfig(
	config: UserConfig,
	resolvedConfig: UserConfig
) {
	const overridden = findOverriddenConfig(
		config,
		resolvedConfig,
		enforcedConfig,
		"",
		[]
	);

	if (overridden.length > 0) {
		const keys = overridden.map((key) => `\n  - ${key}`).join("");
		console.error(
			`The following Vite config options will be overridden by Bolt CEP: ${keys}`
		);
	}
}
function findOverriddenConfig(
	config: Record<string, any>,
	resolvedConfig: Record<string, any>,
	enforcedConfig: Record<string, any>,
	path: string,
	out: string[]
): string[] {
	if (config == null || resolvedConfig == null) {
		return out;
	}

	for (const key in enforcedConfig) {
		if (typeof config === "object" && key in config && key in resolvedConfig) {
			const enforced = enforcedConfig[key];

			if (enforced === true) {
				if (config[key] !== resolvedConfig[key]) {
					out.push(path + key);
				}
			} else {
				findOverriddenConfig(
					config[key],
					resolvedConfig[key],
					enforced,
					path + key + ".",
					out
				);
			}
		}
	}
	return out;
}
