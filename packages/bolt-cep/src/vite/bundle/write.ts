import type {
	FunctionPluginHooks,
	NormalizedOutputOptions,
	PluginContext,
	OutputBundle,
} from "rollup";
import { BoltOptions, Flags } from "..";
import { handleExtendScript } from "./extendscript";

export function createWriteBundleHook(
	options: BoltOptions,
	flags: Flags
): FunctionPluginHooks["writeBundle"] {
	const writeBundle: FunctionPluginHooks["writeBundle"] = async function (
		this: PluginContext,
		_options: NormalizedOutputOptions,
		bundle: OutputBundle
	) {
		await handleExtendScript(options, flags);
	};

	return writeBundle;
}