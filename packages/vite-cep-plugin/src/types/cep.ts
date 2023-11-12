import { CEFCommand, CEPHost, CEPPanelType } from "./adobe";

export interface CEPConfig {
	extension: {
		id: string;
		version: string;
		displayName: string;
		type: CEPPanelType;
		parameters: CEFCommand[];
		extensionManifestVersion: number;
		requiredRuntimeVersion: number;
		// TODO: what are these?
		scriptPath?: string; // TODO: i think this is set per-panel, so we could remove from here
		standalone?: boolean; // https://stackoverflow.com/a/17329699/8703073
	};

	icons: IconConfig;
	window: WindowConfig;

	hosts: CEPHost[];
	panels: CEPPanel[];

	zxp: {
		country: string;
		province: string;
		org: string;
		password: string;
		tsa: string;
		sourceMap?: boolean;
		jsxBin?: "off" | "copy" | "replace";
	};

	build?: {
		sourceMap?: boolean;
		jsxBin?: "off" | "copy" | "replace";
	};

	bundle?: {
		copyModules?: string[];
		copyAssets?: string[];
		zipAssets?: string[];
	};
}

export interface CEPConfigExtended extends CEPConfig {
	panels: CEPExtendedPanel[];
}

export interface CEPPanel {
	displayName?: string | null;

	root: string;
	mainPath?: string;
	scriptPath?: string;

	id?: string;
	parameters?: CEFCommand[];
	type?: CEPPanelType;

	host?: string;
	startOnEvents?: string[];

	window: WindowConfig & { autoVisible: boolean };
	icons?: IconConfig;
}

export interface CEPExtendedPanel extends CEPPanel {
	id: string;
	parameters: CEFCommand[];
	type: CEPPanelType;
	icons: IconConfig;
}

interface IconConfig {
	normal?: string;
	rollOver?: string;
	dark?: string;
	darkRollOver?: string;
}

interface WindowConfig {
	width?: number;
	height?: number;
	maxWidth?: number;
	maxHeight?: number;
	minWidth?: number;
	minHeight?: number;
}
