<script lang="ts">
	// TODO: STYLE FALLBACK CONTENT!!!!
	import { afterUpdate, onMount, setContext, tick } from 'svelte';
	import { ctxKey } from '../settings';
	import { canvasSize } from './store';
	import { setCanvasSize, scaleCanvasDrawings } from './setCanvasSize';
	import type { RenderFn, RenderObject, Context } from './types';

	export let container: HTMLElement;
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let animationLoop: number;

	const renders = new Set<RenderFn>();
	const animations = new Set<RenderFn>();

	setContext<Context>(ctxKey, {
		addToBeRendered(data: RenderObject) {
			if (data.animate) {
				if (animations.has(data.renderFn)) animations.delete(data.renderFn);
				animations.add(data.renderFn);
			} else {
				if (renders.has(data.renderFn)) renders.delete(data.renderFn);
				renders.add(data.renderFn);
			}
		},
		removeFromRenders(fn: RenderFn) {
			if (renders.has(fn)) renders.delete(fn);
		},
		removeFromAnimations(fn: RenderFn) {
			if (animations.has(fn)) animations.delete(fn);
		}
	});

	const runRenders = () => {
		renders.forEach((fn) => {
			if (!fn) throw new Error('Render function must not be null');
			if (typeof fn !== 'function') throw new Error('Render function must be function');
			fn(ctx);
		});
	};

	const runAnimations = () => {
		if (animations.size === 0) {
			cancelAnimationFrame(animationLoop);

			return;
		}

		animations.forEach((fn) => {
			if (!fn) {
				cancelAnimationFrame(animationLoop);
				throw new Error('Animation function must not be null');
			}

			if (typeof fn !== 'function') {
				cancelAnimationFrame(animationLoop);
				throw new Error('Animation function must be function');
			}

			fn(ctx);
		});

		animationLoop = requestAnimationFrame(runAnimations);
	};

	onMount(async () => {
		await tick();
		setCanvasSize(container);
		const context = canvas.getContext('2d');
		if (!context) throw new Error('Browser does not support canvas');
		ctx = context;

		return () => {
			cancelAnimationFrame(animationLoop);
		};
	});

	afterUpdate(async () => {
		if (!ctx) return;
		cancelAnimationFrame(animationLoop);
		await tick();
		scaleCanvasDrawings(ctx, $canvasSize.scaleFactor);

		if (renders.size > 0) {
			await tick();
			runRenders();
		}

		if (animations.size > 0) {
			await tick();
			runAnimations();
		}
	});
</script>

<canvas
	width={$canvasSize.canvasWidth}
	height={$canvasSize.canvasHeight}
	style:width={$canvasSize.styleWidth}
	style:height={$canvasSize.styleHeight}
	class="border-2 border-solid border-red-300 mx-auto"
	bind:this={canvas}
	data-testid="canvas"
>
	Your browser doesn't support this content
</canvas>

<slot />
<svelte:window
	on:resize|passive={() => {
		setCanvasSize(container);
	}}
/>
