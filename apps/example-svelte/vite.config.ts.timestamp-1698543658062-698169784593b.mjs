// vite.config.ts
import { defineConfig } from "file:///Users/Martin/code/playground/turbo/node_modules/vite/dist/node/index.js";
import { svelte } from "file:///Users/Martin/code/playground/turbo/node_modules/@sveltejs/vite-plugin-svelte/src/index.js";
import { bolt } from "file:///Users/Martin/code/playground/turbo/packages/bolt-cep/dist/index.js";
var config = {
  cep: {
    panels: [
      {
        root: "main",
        name: "Main",
        window: { autoVisible: true }
      }
    ],
    id: "",
    version: "",
    displayName: "",
    type: "Panel",
    symlink: "local",
    extensionManifestVersion: 0,
    requiredRuntimeVersion: 0,
    hosts: [],
    parameters: [],
    serverConfig: {
      port: 0,
      servePort: 0,
      startingDebugPort: 0
    },
    icons: void 0,
    window: void 0,
    zxp: {
      country: "",
      province: "",
      org: "",
      password: "",
      tsa: "",
      sourceMap: false,
      jsxBin: "off"
    }
  },
  extendscript: {
    babel: {},
    extenstions: [],
    ponyfills: [],
    jsxbin: "off",
    includes: {
      iife: false,
      globalThis: ""
    }
  },
  client: {
    root: "src/client",
    panels: "panels"
  }
};
var vite_config_default = defineConfig({
  plugins: [svelte(), bolt(config)],
  root: "src/client"
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvTWFydGluL2NvZGUvcGxheWdyb3VuZC90dXJiby9hcHBzL2V4YW1wbGUtc3ZlbHRlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvTWFydGluL2NvZGUvcGxheWdyb3VuZC90dXJiby9hcHBzL2V4YW1wbGUtc3ZlbHRlL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9NYXJ0aW4vY29kZS9wbGF5Z3JvdW5kL3R1cmJvL2FwcHMvZXhhbXBsZS1zdmVsdGUvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHsgc3ZlbHRlIH0gZnJvbSBcIkBzdmVsdGVqcy92aXRlLXBsdWdpbi1zdmVsdGVcIjtcbmltcG9ydCB7IHR5cGUgQm9sdE9wdGlvbnMsIGJvbHQgfSBmcm9tIFwiYm9sdC1jZXBcIjtcblxuLy8gaW1wb3J0IGNlcENvbmZpZyBmcm9tIFwiLi9jZXAuY29uZmlnXCI7XG4vLyBpbXBvcnQgeyBleHRlbmRzY3JpcHRDb25maWcgfSBmcm9tIFwiLi92aXRlLmVzLmNvbmZpZ1wiO1xuY29uc3QgY29uZmlnOiBCb2x0T3B0aW9ucyA9IHtcblx0Y2VwOiB7XG5cdFx0cGFuZWxzOiBbXG5cdFx0XHR7XG5cdFx0XHRcdHJvb3Q6IFwibWFpblwiLFxuXHRcdFx0XHRuYW1lOiBcIk1haW5cIixcblx0XHRcdFx0d2luZG93OiB7IGF1dG9WaXNpYmxlOiB0cnVlIH0sXG5cdFx0XHR9LFxuXHRcdF0sXG5cdFx0aWQ6IFwiXCIsXG5cdFx0dmVyc2lvbjogXCJcIixcblx0XHRkaXNwbGF5TmFtZTogXCJcIixcblx0XHR0eXBlOiBcIlBhbmVsXCIsXG5cdFx0c3ltbGluazogXCJsb2NhbFwiLFxuXHRcdGV4dGVuc2lvbk1hbmlmZXN0VmVyc2lvbjogMCxcblx0XHRyZXF1aXJlZFJ1bnRpbWVWZXJzaW9uOiAwLFxuXHRcdGhvc3RzOiBbXSxcblx0XHRwYXJhbWV0ZXJzOiBbXSxcblx0XHRzZXJ2ZXJDb25maWc6IHtcblx0XHRcdHBvcnQ6IDAsXG5cdFx0XHRzZXJ2ZVBvcnQ6IDAsXG5cdFx0XHRzdGFydGluZ0RlYnVnUG9ydDogMCxcblx0XHR9LFxuXHRcdGljb25zOiB1bmRlZmluZWQsXG5cdFx0d2luZG93OiB1bmRlZmluZWQsXG5cdFx0enhwOiB7XG5cdFx0XHRjb3VudHJ5OiBcIlwiLFxuXHRcdFx0cHJvdmluY2U6IFwiXCIsXG5cdFx0XHRvcmc6IFwiXCIsXG5cdFx0XHRwYXNzd29yZDogXCJcIixcblx0XHRcdHRzYTogXCJcIixcblx0XHRcdHNvdXJjZU1hcDogZmFsc2UsXG5cdFx0XHRqc3hCaW46IFwib2ZmXCIsXG5cdFx0fSxcblx0fSxcblx0ZXh0ZW5kc2NyaXB0OiB7XG5cdFx0YmFiZWw6IHt9LFxuXHRcdGV4dGVuc3Rpb25zOiBbXSxcblx0XHRwb255ZmlsbHM6IFtdLFxuXHRcdGpzeGJpbjogXCJvZmZcIixcblx0XHRpbmNsdWRlczoge1xuXHRcdFx0aWlmZTogZmFsc2UsXG5cdFx0XHRnbG9iYWxUaGlzOiBcIlwiLFxuXHRcdH0sXG5cdH0sXG5cdGNsaWVudDoge1xuXHRcdHJvb3Q6IFwic3JjL2NsaWVudFwiLFxuXHRcdHBhbmVsczogXCJwYW5lbHNcIixcblx0fSxcbn07XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuXHRwbHVnaW5zOiBbc3ZlbHRlKCksIGJvbHQoY29uZmlnKV0sXG5cdHJvb3Q6IFwic3JjL2NsaWVudFwiLFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXVWLFNBQVMsb0JBQW9CO0FBQ3BYLFNBQVMsY0FBYztBQUN2QixTQUEyQixZQUFZO0FBSXZDLElBQU0sU0FBc0I7QUFBQSxFQUMzQixLQUFLO0FBQUEsSUFDSixRQUFRO0FBQUEsTUFDUDtBQUFBLFFBQ0MsTUFBTTtBQUFBLFFBQ04sTUFBTTtBQUFBLFFBQ04sUUFBUSxFQUFFLGFBQWEsS0FBSztBQUFBLE1BQzdCO0FBQUEsSUFDRDtBQUFBLElBQ0EsSUFBSTtBQUFBLElBQ0osU0FBUztBQUFBLElBQ1QsYUFBYTtBQUFBLElBQ2IsTUFBTTtBQUFBLElBQ04sU0FBUztBQUFBLElBQ1QsMEJBQTBCO0FBQUEsSUFDMUIsd0JBQXdCO0FBQUEsSUFDeEIsT0FBTyxDQUFDO0FBQUEsSUFDUixZQUFZLENBQUM7QUFBQSxJQUNiLGNBQWM7QUFBQSxNQUNiLE1BQU07QUFBQSxNQUNOLFdBQVc7QUFBQSxNQUNYLG1CQUFtQjtBQUFBLElBQ3BCO0FBQUEsSUFDQSxPQUFPO0FBQUEsSUFDUCxRQUFRO0FBQUEsSUFDUixLQUFLO0FBQUEsTUFDSixTQUFTO0FBQUEsTUFDVCxVQUFVO0FBQUEsTUFDVixLQUFLO0FBQUEsTUFDTCxVQUFVO0FBQUEsTUFDVixLQUFLO0FBQUEsTUFDTCxXQUFXO0FBQUEsTUFDWCxRQUFRO0FBQUEsSUFDVDtBQUFBLEVBQ0Q7QUFBQSxFQUNBLGNBQWM7QUFBQSxJQUNiLE9BQU8sQ0FBQztBQUFBLElBQ1IsYUFBYSxDQUFDO0FBQUEsSUFDZCxXQUFXLENBQUM7QUFBQSxJQUNaLFFBQVE7QUFBQSxJQUNSLFVBQVU7QUFBQSxNQUNULE1BQU07QUFBQSxNQUNOLFlBQVk7QUFBQSxJQUNiO0FBQUEsRUFDRDtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sUUFBUTtBQUFBLEVBQ1Q7QUFDRDtBQUdBLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzNCLFNBQVMsQ0FBQyxPQUFPLEdBQUcsS0FBSyxNQUFNLENBQUM7QUFBQSxFQUNoQyxNQUFNO0FBQ1AsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
