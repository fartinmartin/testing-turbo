import { csi } from "../../../cep";

export const evalFile = (filePath: string) => {
	const script = `typeof $ !== 'undefined' ? $.evalFile("${filePath}") : fl.runScript(FLfile.platformPathToURI("${filePath}"));`;
	const tryCatch = `try{"${script}"}catch(e){alert(e);};`;

	return new Promise((resolve, reject) => {
		csi.evalScript(tryCatch, (res: string) => {
			resolve(res);
		});
	});
};
