import type { BoltOptions } from "../types";

export const debugTemplate = (props: BoltOptions) => {
	const { hosts, dev, panels } = props;
	let port = dev.ports.debug;

	return `<?xml version="1.0" encoding="UTF-8"?>\n\t<ExtensionList>\n\t${panels
		.map(
			(panel) =>
				`<Extension Id="${panel.id}">\n\t<HostList>\n\t${hosts
					.map((host) => `<Host Name="${host.name}" Port="${port++}"/>`)
					.join("")}\n\t</HostList>\n\t</Extension>`
		)
		.join("")}\n</ExtensionList>`;
};
