import path from "path";
import { UserConfig } from "vite";

// TODO: use what i make in `svelte-example`
export const defaultConfig: UserConfig = {
	resolve: {
		alias: [{ find: "@esTypes", replacement: path.resolve(__dirname, "src") }],
	},
	// root: path.resolve(src, "js"),
	// clearScreen: false,
	// server: {
	// 	port: cepConfig.port,
	// },
	// preview: {
	// 	port: cepConfig.servePort,
	// },

	// build: {
	// 	sourcemap: isPackage ? cepConfig.zxp.sourceMap : cepConfig.build?.sourceMap,
	// 	watch: {
	// 		include: "src/jsx/**",
	// 	},
	// 	rollupOptions: {
	// 		input,
	// 		output: {
	// 			manualChunks: {},
	// 			preserveModules: false,
	// 			format: "cjs",
	// 		},
	// 	},
	// 	target: "chrome74",
	// 	outDir,
	// },
};
