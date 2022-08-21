<script lang="ts">
	// TODO: STYLE FALLBACK CONTENT!!!!
	import { onMount, setContext, tick } from 'svelte';
	import { RENDER_CONTEXT_KEY } from '../stores';
	import { canvasSize } from './store';
	import { setCanvasSize, scaleCanvasDrawings } from './setCanvasSize';
	import type { RenderFn, RenderObject, RenderContext } from './types';

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let animationLoop: number;
	let isAnimationRunning = false;

	const renders = new Set<RenderFn>();
	const animations = new Set<RenderFn>();

	setContext<RenderContext>(RENDER_CONTEXT_KEY, {
		addRenderFn(data: RenderObject) {
			if (data.animate) {
				if (animations.has(data.renderFn)) animations.delete(data.renderFn);
				animations.add(data.renderFn);
			} else {
				if (renders.has(data.renderFn)) renders.delete(data.renderFn);
				renders.add(data.renderFn);
			}
		},
		removeRenderFn(fn: RenderFn) {
			if (renders.has(fn)) renders.delete(fn);

			if (animations.has(fn)) {
				animations.delete(fn);
				if (animations.size === 0) {
					pauseAnimation();
				}
			}
		}
	});

	const runAnimations = () => {
		isAnimationRunning = true;

		if (renders.size > 0) {
			renders.forEach((fn) => {
				if (!fn) throw new Error('Render function must not be null');
				if (typeof fn !== 'function') throw new Error('Render function must be function');
				fn(ctx);
			});
		}

		if (animations.size === 0) {
			return pauseAnimation();
		}

		animations.forEach((fn) => {
			if (!fn) {
				pauseAnimation();
				throw new Error('Animation function must not be null');
			}

			if (typeof fn !== 'function') {
				pauseAnimation();
				throw new Error('Animation function must be function');
			}

			fn(ctx);
		});

		animationLoop = requestAnimationFrame(runAnimations);
	};

	const pauseAnimation = () => {
		cancelAnimationFrame(animationLoop);
		isAnimationRunning = false;
	};

	onMount(async () => {
		await tick();
		setCanvasSize(canvas);
		const context = canvas.getContext('2d');
		if (!context) throw new Error('Browser does not support canvas');
		ctx = context;

		await tick();
		scaleCanvasDrawings(ctx, $canvasSize.scaleFactor);
		runAnimations();

		return pauseAnimation;
	});
</script>

<canvas
	width={$canvasSize.canvasWidth}
	height={$canvasSize.canvasHeight}
	style:width={$canvasSize.styleWidth}
	style:height={$canvasSize.styleHeight}
	class="border-2 border-solid border-black mx-auto"
	bind:this={canvas}
	data-testid="canvas"
>
	Your browser doesn't support this content
</canvas>

<slot />
<svelte:window
	on:resize|passive={() => {
		const wasAnimationRunning = isAnimationRunning;
		pauseAnimation();
		setCanvasSize(canvas);

		tick().then(() => {
			scaleCanvasDrawings(ctx, $canvasSize.scaleFactor);
			runAnimations();
			if (!wasAnimationRunning) pauseAnimation();
		});
	}}
	on:keypress|preventDefault={(e) => {
		if (e.code === 'Space') {
			if (isAnimationRunning) pauseAnimation();
			else runAnimations();
		}
	}}
/>
