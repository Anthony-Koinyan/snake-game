<script lang="ts">
	import { browser } from '$app/env';

	let width: number;
	let height: number;

	if (browser) {
		setCanvasSize();
	}

	function setCanvasSize() {
		width = window.innerWidth * 0.8;
		height = window.innerHeight * 0.8;
	}
</script>

<canvas {width} {height} class="border-2 border-solid border-red-300 m-auto" title="canvas">
	Your browser doesn't support this content
</canvas>

<svelte:window on:resize={setCanvasSize} />
