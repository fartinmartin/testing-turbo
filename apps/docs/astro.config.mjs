import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: "Bolt Docs",
			logo: {
				src: "./src/assets/bolt-cep.svg",
				replacesTitle: true,
			},
			social: {
				github: "https://github.com/hyperbrew/bolt-cep",
				twitter: "https://twitter.com/hyperbrew",
			},
			sidebar: [
				{
					label: "Guide",
					items: [
						{ label: "Getting Started", link: "/guide/getting-started/" },
						{ label: "Why Bolt", link: "/guide/why-bolt/" },
						{ label: "Features", link: "/guide/features/" },
					],
				},
				{
					label: "Reference",
					autogenerate: { directory: "reference" },
				},
			],
			customCss: ["./src/styles/vitepress.css"],
		}),
	],
});
