import { csi } from "@client/cep";

export function createEvalES(namespace: string, orThrow?: boolean) {
	const namespaced = `var host = typeof $ !== 'undefined' ? $ : window; host["${namespace}"].`;

	/**
	 * @function EvalES
	 * Evaluates a string in ExtendScript scoped to the project's namespace
	 * Optionally, pass true to the isGlobal param to avoid scoping
	 *
	 * @param script    The script as a string to be evaluated
	 * @param isGlobal  Optional. Defaults to false,
	 *
	 * @return String Result.
	 */
	return function (script: string, isGlobal = false): Promise<string> {
		const prefix = isGlobal ? "" : namespaced;
		const tryCatch = `try{"${prefix + script}"}catch(e){alert(e);};`;

		return new Promise((resolve, reject) => {
			csi.evalScript(tryCatch, (res: string) => {
				resolve(res);
			});
		});
	};
}