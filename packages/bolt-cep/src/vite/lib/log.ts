export const log = createLogger();

function createLogger() {
	// TODO: let user control log level
	const level = "info";
	// TODO: colors...

	return {
		verbose: function (message: any) {
			console.log(message);
			return this;
		},
		info: function (message: any) {
			console.log(message);
			return this;
		},
		warn: function (message: any) {
			console.warn(message);
			return this;
		},
		error: function (message: any) {
			console.error(message);
			return this;
		},
		clear: function () {
			// console.clear();
			return this;
		},
	};
}
