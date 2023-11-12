import { type BoltOptions } from "vite-cep-plugin";
import pkg from "./package.json";

const config: BoltOptions = {
	extension: {
		version: pkg.version,
		id: "com.vite-bolt.cep",
		displayName: "Vite Bolt CEP",
		type: "Panel",
		parameters: [],
		extensionManifestVersion: 6.0,
		requiredRuntimeVersion: 9.0,
		// TODO: better understand these:
		scriptPath: undefined,
		standalone: undefined,
	},

	icons: {
		normal: "./src/assets/light-icon.png",
		rollOver: "./src/assets/light-icon-rollover.png",
		dark: "./src/assets/dark-icon.png",
		darkRollOver: "./src/assets/dark-icon-rollover.png",
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
			root: "main", // relative to `dev.panels`
			window: {
				autoVisible: true,
				width: 500,
				height: 550,
			},
			parameters: ["--v=0", "--enable-nodejs", "--mixed-context"],
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
		copyModules: [],
		copyAssets: [],
		zipAssets: [],
	},

	extendscript: {
		root: "src/host", // TODO: remove from here? we're already defining at `dev.input.host`
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
		logLevels: ["info"],
		ports: {
			server: 3000, // `UserConfig.server.port`
			preview: 5000, // `UserConfig.preview.port`
			debug: 8860, // NOT from UserConfig, instead used when creating CEP .debug file
		},
		input: {
			root: "src",
			client: "client",
			host: "host",
		},
		output: {
			root: "dist",
			cep: "cep",
			zxp: "zxp",
			zip: "zip",
		},
		// below are overrides for vite's UserConfig
		clearScreen: false,
		target: "chrome74",
	},
};

export default config;
