import path from "path";
import { sift } from "radash";
import type { OutputBundle, OutputChunk } from "rollup";

export function getRequires(bundle: OutputBundle) {
	// hmm, does the original only `getRequires` from the OutputChunk that is imported by `index.html`? and is that why it is run in the transformIndexHtml hook?
	// surely there is a (better) way to determine the main js bundle file from OutputBundle??
	const jsFileNames = Object.keys(bundle).filter(
		(name) => path.extname(name) === ".js"
	);

	let requires: string[] = [];

	jsFileNames.forEach((name) => {
		const chunk = bundle[name] as OutputChunk;
		if (!chunk.code) return;

		const requireRegExp = /(require\(\"([A-z]|[0-9]|\.|\/|\-)*\"\)(\;|\,))/g;
		const allRequires = chunk.code.match(requireRegExp);

		if (allRequires) {
			const nameRegExp = /(["'])(?:(?=(\\?))\2.)*?\1/;
			const requireNames = sift(allRequires.map((m) => m.match(nameRegExp)?.[0].replace(/\"/g, ""))); // prettier-ignore

			const characters = [".", "/", "\\"];
			const copyModules = requireNames.filter((name: string) => !nodeBuiltIns.includes(name) && !characters.includes(name[0])); // prettier-ignore

			requires = requires.concat(copyModules);
		}
	});

	return requires;
}

const nodeBuiltIns = [
	"crypto",
	"assert",
	"buffer",
	"child_process",
	"worker_threads",
	"cluster",
	"dgram",
	"dns",
	"domain",
	"events",
	"fs",
	"http",
	"https",
	"net",
	"os",
	"path",
	"punycode",
	"querystring",
	"readline",
	"stream",
	"string_decoder",
	"timers",
	"tls",
	"tty",
	"url",
	"util",
	"v8",
	"vm",
	"zlib",
];
