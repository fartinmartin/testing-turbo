import { XMLBuilder } from "xmlbuilder2/lib/interfaces";
import type { CEPPanel } from "..";

export const extensionTemplate = (root: XMLBuilder, panel: CEPPanel) => {
	const ext = root.ele("Extension", { Id: panel.id });

	const dispatch = ext.ele("DispatchInfo");
	if (panel.host) dispatch.att("Host", panel.host);

	resources: {
		const resources = dispatch.ele("Resources");

		resources.ele("MainPath").txt(panel.mainPath!);
		if (panel.scriptPath) resources.ele("ScriptPath").txt(panel.scriptPath);

		const cli = resources.ele("CEFCommandLine");
		if (panel.parameters) panel.parameters.forEach((param) => cli.ele("Parameter").txt(param)); // prettier-ignore
	}

	lifecycle: {
		const lifecycle = dispatch.ele("Lifecycle");
		lifecycle.ele("AutoVisible").txt(panel.window.autoVisible.toString());

		if (panel.startOnEvents) {
			const startOn = lifecycle.ele("StartOn");
			panel.startOnEvents.forEach((event) => startOn.ele("Event").txt(event));
		}
	}

	ui: {
		const ui = dispatch.ele("UI"); // @ts-expect-error

		ui.ele("Type").txt(panel.type);
		if (panel.displayName) ui.ele("Menu").txt(panel.displayName);

		geometry: {
			const geometry = ui.ele("Geometry");

			if (panel.window.width && panel.window.height) {
				const size = geometry.ele("Size");
				size.ele("Width").txt("" + panel.window.width);
				size.ele("Height").txt("" + panel.window.height);
			}

			if (panel.window.maxWidth && panel.window.maxHeight) {
				const maxSize = geometry.ele("MaxSize");
				maxSize.ele("Width").txt("" + panel.window.maxWidth);
				maxSize.ele("Height").txt("" + panel.window.maxHeight);
			}

			if (panel.window.minWidth && panel.window.minHeight) {
				const minSize = geometry.ele("MinSize");
				minSize.ele("Width").txt("" + panel.window.minWidth);
				minSize.ele("Height").txt("" + panel.window.minHeight);
			}
		}

		// prettier-ignore
		icons: {
      const icons = ui.ele("Icons");
      icons.ele("Icon", { Type: "Normal" }).txt(panel.icons?.normal!);
      icons.ele("Icon", { Type: "RollOver" }).txt(panel.icons?.rollOver!);
      icons.ele("Icon", { Type: "DarkNormal" }).txt(panel.icons?.dark!);
      icons.ele("Icon", { Type: "DarkRollOver" }).txt(panel.icons?.darkRollOver!);
    }
	}

	return ext;
};
