import path from "path";
import { type BoltOptions } from "bolt-cep";

const config: BoltOptions = {
	extension: {
		version: "",
		id: "com.bolt.cep",
		displayName: "Bolt CEP",
		type: "Panel",
		parameters: [],
		extensionManifestVersion: 6.0,
		requiredRuntimeVersion: 9.0,
		// TODO: better understand these:
		scriptPath: undefined,
		standalone: undefined,
	},

	icons: {
		darkNormal: "./src/assets/light-icon.png",
		normal: "./src/assets/dark-icon.png",
		darkNormalRollOver: "./src/assets/light-icon.png",
		normalRollOver: "./src/assets/dark-icon.png",
	},

	// TODO: how does this relate to `panel.window`?
	window: {
		width: 500,
		height: 550,
	},

	hosts: [
		{ name: "AEFT", version: "[0.0,99.9]" },
		{ name: "AME", version: "[0.0,99.9]" },
		{ name: "AUDT", version: "[0.0,99.9]" },
		{ name: "FLPR", version: "[0.0,99.9]" },
		{ name: "IDSN", version: "[0.0,99.9]" },
		{ name: "ILST", version: "[0.0,99.9]" },
		{ name: "KBRG", version: "[0.0,99.9]" },
		{ name: "PHXS", version: "[0.0,99.9]" },
		{ name: "PPRO", version: "[0.0,99.9]" },
	],

	panels: [
		{
			root: "main",
			displayName: "Main",
			window: {
				autoVisible: true,
				width: 500,
				height: 550,
			},
		},
	],

	zxp: {
		country: "US",
		province: "CA",
		org: "MyCompany",
		password: "mypassword",
		tsa: "http://timestamp.digicert.com/",
		sourceMap: false,
		jsxBin: "off",
	},

	build: {
		jsxBin: "off",
		sourceMap: true,
	},

	bundle: {
		installModules: [],
		copy: [],
		zip: [],
	},

	extendscript: {
		root: "src/host",
		babelOptions: {},
		extensions: [],
		ponyfills: [],
		includes: {
			iife: false,
			globalThis: "",
		},
	},

	dev: {
		panels: "panels", // path to panel root (relative to `BoltOptions.dev.root` below, can be empty string)
		symlink: "local",
		logLevel: "info",
		ports: {
			server: 3000, // `UserConfig.server.port`
			preview: 5000, // `UserConfig.preview.port`
			debug: 8860, // NOT from UserConfig, instead used when creating CEP .debug file
		},
		// below are overrides for vite's UserConfig
		root: "src/client",
		outDir: path.resolve(__dirname, "dist", "cep"),
		clearScreen: false,
		target: "chrome74",
	},
};

export default config;