import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { type BoltOptions, bolt } from "bolt-cep";

// https://vitejs.dev/config/
export default defineConfig({
	// TODO: set `bolt()`'s `options` parameter to optional, currently reading options from `bolt.config.ts`
	plugins: [svelte(), bolt({} as BoltOptions)],
});
