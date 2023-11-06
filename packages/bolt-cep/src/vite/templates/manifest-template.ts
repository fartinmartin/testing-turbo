import type { BoltOptions } from "@vite/types";
import { extensionTemplate } from "./extension-template";
import * as xml from "xmlbuilder2";

export const manifestTemplate = (options: BoltOptions) => {
	const { extension, panels, hosts } = options;
	const standalone = extension.standalone ? "yes" : "no";

	const root = xml
		.create({ version: "1.0", encoding: "UTF-8", standalone })
		.ele("ExtensionManifest");

	root.att("Version", extension.extensionManifestVersion.toFixed(1));
	root.att("ExtensionBundleId", extension.id);
	root.att("ExtensionBundleVersion", extension.version);
	root.att("ExtensionBundleName", extension.displayName);
	root.att("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance");

	const list = root.ele("ExtensionList");
	panels
		.filter((value, index, self) => self.indexOf(value) === index) // remove duplicates (TODO: should be handled when we "fill" panel array)
		.forEach((panel) => {
			const ext = list.ele("Extension");
			ext.att("Id", panel.id ?? extension.id);
			ext.att("Version", extension.version);
		});

	env: {
		const env = root.ele("ExecutionEnvironment");

		const hostList = env.ele("HostList");
		hosts.forEach((host) => hostList.ele("Host", { Name: host.name, Version: host.version })); // prettier-ignore

		const localeList = env.ele("LocaleList");
		localeList.ele("Locale", { Code: "All" });

		const runtimeList = env.ele("RequiredRuntimeList");
		runtimeList.ele("RequiredRuntime", { Name: "CSXS", Version: extension.requiredRuntimeVersion.toFixed(1) }); // prettier-ignore
	}

	const infoList = root.ele("DispatchInfoList");
	panels.forEach((panel) => extensionTemplate(infoList, panel));

	return root.end({ prettyPrint: true });
};
