import { CEPConfig } from "./cep";
import { ExtendScriptConfig } from "./extendscript";

export interface BoltOptions extends CEPConfig {
	extendscript: ExtendScriptConfig;
	dev: {
		panels: string;
		symlink: "local" | "global";
		logLevel: "info";
		ports: {
			server: number; // `UserConfig.server.port`
			preview: number; // `UserConfig.preview.port`
			debug: number; // NOT from UserConfig, instead used when creating CEP .debug file
		};
		input: {
			root: string;
			client: string;
			host: string;
		};
		output: {
			root: string;
			cep: string;
			zxp: string;
			zip: string;
		};
		// below are overrides for vite's UserConfig
		clearScreen: boolean;
		target: string; // "chrome74",
	};
}

// export type BoltOptions = Partial<_BoltOptions> & {
// 	id: string;
// 	version: string;
// 	displayName: string;
// };
