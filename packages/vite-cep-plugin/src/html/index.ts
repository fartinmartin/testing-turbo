import path from "path";
import { JSDOM } from "jsdom";
import { require } from "../lib";
import { IndexHtmlTransformContext } from "vite";
import type { OutputAsset, OutputBundle } from "rollup";
import { BoltOptions } from "../types";

export function transformHtml(
	html: string,
	{ bundle, server }: IndexHtmlTransformContext,
	{ dev }: BoltOptions
) {
	let dom = new JSDOM(html);

	dom = injectRequire(dom);
	dom = css(dom);
	dom = js(dom);

	if (bundle) {
		const dist = path.join(dev.output.root, "assets");
		const assets = path.join(process.cwd(), dist);
		const client = path.join(process.cwd(), dev.input.root, dev.input.client);
		const relative = path.relative(client, assets);
		const depth = relative.replace(dist, "").slice(0, -1);

		handleCssAssets(bundle, depth);
	}

	return dom.serialize();
}

function css(dom: JSDOM) {
	return dom;
}

function js(dom: JSDOM) {
	return dom;
}

function injectRequire(dom: JSDOM) {
	const document = dom.window.document;
	const head = document.querySelector("head");

	const script = document.createElement("script");
	script.innerText = require;

	head?.insertBefore(script, head.firstChild);

	return dom;
}

function handleCssAssets(bundle: OutputBundle, depth: string) {
	for (const file in bundle) {
		const asset = bundle[file] as OutputAsset;

		if (!asset.source) return;
		if (path.extname(file) !== ".css") return;

		const newCode = asset.source;
		if (typeof newCode === "string") {
			asset.source = fixAssetPathCSS(newCode, depth);
		} else {
			console.log("missing code: ", file);
		}
	}
}

function fixAssetPathJS(code: string, depth: string) {
	code = code.replace(/\=\"\.\/assets/g, `="${depth}/assets`);
	code = code.replace(/\=\"\/assets/g, `="${depth}/assets`);
	code = code.replace(/\(\"\.\/assets/g, `("${depth}/assets`);
	code = code.replace(/\(\"\/assets/g, `("${depth}/assets`);
	return code;
}

function fixAssetPathCSS(code: string, depth: string) {
	code = code.replace(/\(\.\/assets/g, `(${depth}/assets`);
	code = code.replace(/\(\/assets/g, `(./`);
	return code;
}

function fixAssetPathHTML(code: string, depth: string) {
	code = code.replace(/\=\"\/assets/g, `="${depth}/assets`);
	return code;
}

function removeModuleTags(code: string) {
	code = code.replace(/\<link rel=\"modulepreload\" (.*)\>/g, "");
	code = code.replace(/\<script type=\"module\" (.*)\>/g, "");
	return code;
}
