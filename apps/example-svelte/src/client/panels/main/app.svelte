<script lang="ts">
	// const { os, path } = require("bolt-cep");
	import * as bolt from "bolt-cep";

	function node() {
		const version = `Node.js ${process.version}`;
		const platform = "TODO";
		const folder = "TODO";
		// const platform = `Platform: ${os.platform}`;
		// const folder = `Folder: ${path.basename(window.cep_node.global.__dirname)}`;
		alert([version, platform, folder].join("\n"));
	}

	const response = "TODO";
	async function extendscript() {
		// const response = await evalES(`helloWorld("${csi.getApplicationID()}")`);
		console.log(response);
	}

	async function extendscriptTS() {
		// const response = await evalES(`helloWorld("${csi.getApplicationID()}")`);
		console.log(response);
	}
</script>

<main>
	<h1>Hello</h1>

	<button on:click={node}>node</button>
	<button on:click={extendscript}>evalES</button>
	<button on:click={extendscriptTS}>evalTS</button>
</main>
