import type { BoltOptions } from "../types";
import * as xml from "xmlbuilder2";

export const debugTemplate = (options: BoltOptions) => {
	const { hosts, dev, panels } = options;
	let port = dev.ports.debug;

	const root = xml
		.create({ version: "1.0", encoding: "UTF-8" })
		.ele("ExtensionList");

	panels.forEach((panel) => {
		const extension = root.ele("Extension");
		extension.att("Id", panel.id ?? options.extension.id);

		const hostList = extension.ele("HostList");
		hosts.forEach(({ name }) => {
			const host = hostList.ele("Host");
			host.att("Name", name);
			host.att("Port", "" + port++);
		});
	});

	return root.end({ prettyPrint: true });
};
