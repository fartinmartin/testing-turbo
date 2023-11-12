// import { initBolt } from "vite-cep-plugin";
import App from "./app.svelte";
import "./app.css";

// initBolt();

const app = new App({
	target: document.getElementById("app")!,
});

export default app;
