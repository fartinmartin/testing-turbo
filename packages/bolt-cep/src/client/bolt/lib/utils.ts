import { csi } from "@client/cep";

export const posix = (str: string) => str.replace(/\\/g, "/");

export const openLinkInBrowser = (url: string) => {
	if (window.cep) {
		csi.openURLInDefaultBrowser(url);
	} else {
		location.href = url;
	}
};
