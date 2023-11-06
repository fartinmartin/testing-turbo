import path from "path";
import fs from "fs";
import { normalizePath, ResolvedConfig } from "vite";
import { listify } from "radash";

import { log } from "../log";
import { devHtmlTemplate } from "../templates";
import type { BoltOptions } from "../types";
import { injectRequire } from "../lib/require-js";

export function createDevIndexHtmls(
	config: ResolvedConfig,
	options: BoltOptions
) {
	const panels = config.build.rollupOptions.input as Record<string, string>;

	const htmls = listify(panels, (_key, value) => {
		const relativePath = normalizePath(path.relative(config.root, value));
		const destinationPath = path.resolve(config.build.outDir, relativePath);

		const displayName = options.extension.displayName;
		const url = `http://localhost:${options.dev.ports.server}/${relativePath}`;

		const source = devHtmlTemplate({ displayName, url, injectRequire });
		// const extras = { type: "asset", name: "", fileName: "index.html" };
		return { relativePath, destinationPath, source, displayName: _key, url };
	});

	log.clear().info(`\nCEP Panels served at:\n`);
	htmls.forEach((html) => {
		fs.writeFileSync(html.destinationPath, html.source);
		log.info(`   > ${html.displayName}: ${html.url.replace("index.html", "")}`);
	});
	log.info("");
}
