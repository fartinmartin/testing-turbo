import path from "path";
import fs from "fs-extra";
import { unique } from "radash";

import type { Context } from "../..";
import type { BoltOptions } from "../../types";
import { log } from "../../lib/log";

export async function handleCopyModules(
	options: BoltOptions,
	context: Context
) {
	const userEnforcedPackages = options.bundle?.copyModules ?? [];
	const allPackages = unique(userEnforcedPackages.concat(context.packages));
	copyModules({
		packages: allPackages,
		src: options.dev.root,
		dest: options.dev.outDir,
		symlink: false,
	});
}

interface CopyModulesArgs {
	packages: string[];
	src: string;
	dest: string;
	symlink: boolean;
}

function copyModules({ packages, src, dest, symlink }: CopyModulesArgs) {
	const allPackages = packages.flatMap((pkg) => {
		return nodeSolve({ src, pkg, keepDevDependencies: false });
	});

	const uniqePackages = unique(allPackages);

	const numPackages = packages.length;
	const numDependencies = uniqePackages.length;
	const packageList = packages.join(",");
	log.info(
		`Copying ${numPackages} Node Module(s) (${numDependencies} Dependencies) : ${packageList}`
	);

	fs.ensureDirSync(path.join(dest, "node_modules"));

	uniqePackages.map((pkg: string) => {
		const fullSrcPath = path.join(process.cwd(), src, "node_modules", pkg);
		const fullDstPath = path.join(process.cwd(), dest, "node_modules", pkg);

		fs.ensureDirSync(path.dirname(fullDstPath));

		if (!symlink) {
			fs.copySync(fullSrcPath, fullDstPath, { dereference: true });
		} else {
			fs.ensureSymlink(fullSrcPath, fullDstPath, "dir");
		}
	});
}

interface NodeSolveArgs {
	src: string;
	pkg: string;
	keepDevDependencies: boolean;
}

function nodeSolve({ src, pkg, keepDevDependencies }: NodeSolveArgs) {
	let allDependencies = [pkg];

	const fullPath = path.join(src, "node_modules", pkg);
	const pkgJson = path.join(fullPath, "package.json");

	if (fs.existsSync(pkgJson)) {
		const raw = fs.readFileSync(pkgJson, { encoding: "utf-8" });
		const json = JSON.parse(raw);

		let { dependencies, devDependencies } = json;

		const depList = dependencies ? Object.keys(dependencies) : [];
		const devDepList = devDependencies ? Object.keys(devDependencies) : [];

		const resDepList = keepDevDependencies
			? depList.concat(devDepList)
			: depList;

		if (resDepList.length > 0) {
			allDependencies = allDependencies.concat(resDepList);
			resDepList.map((name) => {
				allDependencies = allDependencies.concat(
					nodeSolve({ src, pkg: name, keepDevDependencies })
				);
			});
		}
	}

	return allDependencies || [];
}
