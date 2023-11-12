import type { UserConfig } from "vite";
import { BoltOptions } from "..";
import { log } from "../lib";

export function warnOverriddenOptions(
	options: BoltOptions,
	newOptions: BoltOptions
) {
	const overridden = compare(options, newOptions);

	if (overridden.length > 0) {
		const keys = overridden.map((key) => `\n  - ${key.key}`).join("");
		log.warn(
			`\nThe following Bolt CEP plugin options will be overridden by \`bolt.config.ts\`: \n${keys}`
		);
	}
}

export function warnOverriddenConfig(
	config: UserConfig,
	resolvedConfig: UserConfig
) {
	const overridden = compare(config, resolvedConfig);

	if (overridden.length > 0) {
		const keys = overridden.map((key) => `\n  - ${key.key}`).join("");
		log.warn(
			`\nThe following Vite config options will be overridden by Bolt CEP: \n${keys}`
		);
	}
}

function compare(original: any, updated: any, path = "") {
	const changes: { key: string; originalValue: any; updatedValue: any }[] = [];

	for (const key in original) {
		const originalValue = original[key];
		const updatedValue = updated[key];

		if (typeof originalValue === "object" && typeof updatedValue === "object") {
			// Recursively compare nested objects
			const nestedChanges = compare(
				originalValue,
				updatedValue,
				`${path ? path + "." : ""}${key}`
			);
			changes.push(...nestedChanges);
		} else if (originalValue !== updatedValue) {
			// Values are different, add to changes array
			changes.push({
				key: `${path ? path + "." : ""}${key}`,
				originalValue,
				updatedValue,
			});
		}
	}

	// Check for keys in the updated object that are not in the original
	for (const key in updated) {
		if (!(key in original)) {
			changes.push({
				key: `${path ? path + "." : ""}${key}`,
				originalValue: undefined,
				updatedValue: updated[key],
			});
		}
	}

	return changes;
}
