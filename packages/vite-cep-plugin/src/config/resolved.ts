import path from "path";
import fs from "fs";
import { normalizePath, ResolvedConfig, ViteDevServer } from "vite";
import { listify } from "radash";

import { log } from "../lib/log";
import { devHtmlTemplate } from "../templates";
import type { BoltOptions } from "../types";
import { require } from "../lib/external";
import { Context } from "..";

export type PanelPaths = ReturnType<typeof createDevIndexHtmls>;
export function createDevIndexHtmls(
	config: ResolvedConfig,
	options: BoltOptions
) {
	const panels = config.build.rollupOptions.input as Record<string, string>;

	return listify(panels, (_key, value) => {
		const { root, client } = options.dev.input;
		const clientRoot = path.join(root, client);

		const relativePath = normalizePath(path.relative(clientRoot, value));
		const destinationPath = path.resolve(config.build.outDir, relativePath);
		const displayName = options.extension.displayName;

		const source = devHtmlTemplate({ displayName, relativePath, require }); // prettier-ignore

		return { relativePath, destinationPath, source, displayName: _key };
	});
}

export function logPanelPaths(server: ViteDevServer, { panelPaths }: Context) {
	server?.httpServer?.once("listening", () => _log(server.config.server.port));

	function _log(port: number | undefined) {
		log.clear().info(`\n  CEP Panels served at:\n`);

		panelPaths?.forEach((html) => {
			fs.writeFileSync(html.destinationPath, html.source);

			const noIndexInPath = html.relativePath.replace("index.html", "");
			const url = `http://localhost:${port}/${noIndexInPath}`;

			log.info(`  ➜  ${html.displayName}: ${url}`);
		});
	}
}
