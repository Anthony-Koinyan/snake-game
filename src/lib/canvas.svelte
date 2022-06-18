<script lang="ts">
	import { browser } from '$app/env';

	let width: number;
	let height: number;

	if (browser) {
		setCanvasSize();
	}

	function setCanvasSize() {
		width = window.innerWidth > 640 ? window.innerWidth - 100 : window.innerWidth - 10;
		height = window.innerWidth > 640 ? window.innerHeight - 100 : window.innerHeight - 50;
	}
</script>

<canvas {width} {height} class="border-2 border-solid border-red-300 m-auto" title="canvas">
	Your browser doesn't support this content
</canvas>

<svelte:window on:resize={setCanvasSize} />
