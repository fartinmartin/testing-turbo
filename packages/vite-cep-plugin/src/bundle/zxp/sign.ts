import os from "os";
import path from "path";
import fs from "fs";
import { execSync } from "child_process";
import { sleep } from "radash";
import type { BoltOptions } from "../../types";
import { removeIfExists, safeCreate } from "../../lib/utils";
import { resultLog } from ".";

export async function signZXP(
	config: BoltOptions,
	input: string,
	zxpDir: string,
	tmpDir: string
) {
	const name = config.extension.id;
	const data = config.zxp;

	const output = path.join(zxpDir, `${name}.zxp`);
	const certPath = path.join(tmpDir, `${name}-cert  `);

	const zxpCmd = os.platform() == "win32" ? `ZXPSignCmd` : `./ZXPSignCmd`;
	const cwdDir = path.join(__dirname, "..", "bin");

	const signPrepStr = `${zxpCmd} -selfSignedCert ${data.country} ${data.province} ${data.org} ${name} ${data.password} "${certPath}"`;
	const signStr = `${zxpCmd} -sign "${input}" "${output}" "${certPath}" ${data.password} -tsa ${data.tsa}`;

	removeIfExists(output);
	safeCreate(zxpDir);

	console.log({ signPrepStr });
	execSync(signPrepStr, { cwd: cwdDir, encoding: "utf-8" });
	console.log({ signStr });

	const jsx = path.join(input, "jsx");

	let waits = 1;
	while (!fs.existsSync(jsx) || fs.readdirSync(jsx).length === 0) {
		console.log(`waiting for ExtendScript to finish... ${100 * waits++}ms`);
		await sleep(100);
	}

	execSync(signStr, { cwd: cwdDir, encoding: "utf-8" });
	// TODO: replace with log.info()
	resultLog("built zxp", true, output);

	return output;
}
