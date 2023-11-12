import { csi } from "../../../cep";

export function createEvalTS<Scripts>(namespace: string) {
	/**
	 * End-to-end type-safe ExtendScript evaluation with error handling
	 * Call ExtendScript functions from CEP with type-safe parameters and return types.
	 * Any ExtendScript errors are captured and logged to the CEP console for tracing
	 *
	 * @example
	 * // CEP
	 * evalTS("myFunc", 60, 'test').then((res) => {
	 *    console.log(res.word);
	 * });
	 *
	 * // ExtendScript
	 * export const myFunc = (num: number, word: string) => {
	 *    return { num, word };
	 * }
	 *
	 */
	return function <
		Key extends string & keyof Scripts,
		Func extends Function & Scripts[Key],
	>(functionName: Key, ...args: ArgTypes<Func>): Promise<ReturnType<Func>> {
		const formattedArgs = args.map((arg) => `${JSON.stringify(arg)}`).join(",");
		console.log(`evalTS called ${functionName} with args: ${formattedArgs}`);

		const script = `try{
      var host = typeof $ !== 'undefined' ? $ : window;
      var res = host["${namespace}"].${functionName}(${formattedArgs});
      JSON.stringify(res);
    }catch(e){
      e.fileName = new File(e.fileName).fsName;
      JSON.stringify(e);
    }`;

		return new Promise((resolve, reject) => {
			csi.evalScript(script, createCallback<Func>(resolve, reject));
		});
	};
}

function createCallback<Func extends Function>(
	resolve: (value: ReturnType<Func> | PromiseLike<ReturnType<Func>>) => void,
	reject: (reason?: any) => void
): any {
	return (res: string) => {
		try {
			//@ts-ignore
			if (res === "undefined") return resolve();
			const parsed = JSON.parse(res);
			if (parsed.name === "ReferenceError") {
				console.error("REFERENCE ERROR");
				reject(parsed);
			} else {
				resolve(parsed);
			}
		} catch (error) {
			reject(res);
		}
	};
}

type ArgTypes<F extends Function> = F extends (...args: infer A) => any
	? A
	: never;
type ReturnType<F extends Function> = F extends (...args: infer A) => infer B
	? B
	: never;
