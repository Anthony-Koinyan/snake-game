<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import { ctxKey } from './settings';

	export let width: number;
	export let height: number;
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
		let dpr = window.devicePixelRatio;
		let rect = canvas.getBoundingClientRect();

		canvas.width = rect.width * dpr;
		canvas.height = rect.height * dpr;

		if (ctx) ctx.scale(1600 / (canvas.width * dpr), 900 / (canvas.height * dpr));

		canvas.style.width = rect.width + 'px';
		canvas.style.height = rect.height + 'px';
	});
</script>

<canvas
	{width}
	{height}
	class="border-2 border-solid border-red-300"
	bind:this={canvas}
	data-testid="canvas"
>
	Your browser doesn't support this content
	<slot />
</canvas>
