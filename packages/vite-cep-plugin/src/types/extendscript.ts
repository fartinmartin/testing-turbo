import { RollupBabelInputPluginOptions } from "@rollup/plugin-babel";
import { RollupOptions } from "rollup";

export interface ExtendScriptConfig {
	root: string;
	extensions: string[];
	babelOptions: RollupBabelInputPluginOptions;
	ponyfills: Ponyfill[];
	includes: {
		iife: boolean;
		globalThis: string;
	};
	rollupOverrides?: RollupOptions;
}

interface Ponyfill {
	find: string;
	replace: string;
	inject: string;
}
