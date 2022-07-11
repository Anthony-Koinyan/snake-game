<script lang="ts">
	// TODO: STYLE FALLBACK CONTENT!!!!
	import { browser } from '$app/env';
	import { onMount, setContext } from 'svelte';
	import { ctxKey } from '../settings';
	import { canvasState } from './canvasState';
	import setCanvasSize from './setCanvasSize';

	if (browser) setCanvasSize();

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null;

	setContext(ctxKey, {
		getCanvasContext: () => {
			if (!ctx) ctx = canvas.getContext('2d');
			return ctx;
		}
	});

	onMount(() => {
		if (!ctx) ctx = canvas.getContext('2d');
		if (!$canvasState.scaleFactor || !ctx) return;
		let pixelRatio = window.devicePixelRatio;
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.scale($canvasState.scaleFactor * pixelRatio, $canvasState.scaleFactor * pixelRatio);
	});
</script>

<canvas
	width={$canvasState.width}
	height={$canvasState.height}
	style:width={$canvasState.styleWidth}
	style:height={$canvasState.styleHeight}
	class="border-2 border-solid border-red-300"
	bind:this={canvas}
	data-testid="canvas"
>
	Your browser doesn't support this content
	<slot />
</canvas>
<svelte:window on:resize={setCanvasSize} />
