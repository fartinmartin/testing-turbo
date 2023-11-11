export const log = createLogger();

function createLogger() {
	let levels = ["verbose", "info", "warn", "error"];
	// TODO: colors...

	return {
		setLevels(logLevels: string[]) {
			levels = logLevels;
		},
		verbose: function (message: any) {
			if (levels.includes("verbose")) console.log(message);
			return this;
		},
		info: function (message: any) {
			if (levels.includes("info")) console.log(message);
			return this;
		},
		warn: function (message: any) {
			if (levels.includes("warn")) console.warn(message);
			return this;
		},
		error: function (message: any) {
			if (levels.includes("error")) console.error(message);
			return this;
		},
		clear: function () {
			// console.clear();
			return this;
		},
	};
}
