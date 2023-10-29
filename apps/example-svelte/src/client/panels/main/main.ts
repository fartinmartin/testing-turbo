// import { initBolt } from "bolt-cep";
import App from "./app.svelte";
import "./app.css";

// initBolt();

const app = new App({
	target: document.getElementById("app")!,
});

export default app;
