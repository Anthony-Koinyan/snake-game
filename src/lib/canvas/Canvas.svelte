<script lang="ts">
	// TODO: STYLE FALLBACK CONTENT!!!!
	import { onDestroy, onMount, setContext, tick } from 'svelte';
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

				if (canvas) {
					runRenders();
				}
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

	const runRenders = () => {
		if (renders.size > 0) {
			renders.forEach((fn) => {
				if (!fn) throw new Error('Render function must not be null');
				if (typeof fn !== 'function') throw new Error('Render function must be function');
				fn(ctx);
			});
		}
	};

	const runAnimations = () => {
		isAnimationRunning = true;

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

	const getCanvasParentElementDimensions = () => {
		const parent = canvas.parentElement;

		if (!parent) {
			throw new Error('Error mounting component');
		}

		return { width: parent.clientWidth, height: parent?.clientHeight };
	};

	onMount(async () => {
		await tick();
		const { width, height } = getCanvasParentElementDimensions();
		setCanvasSize(width, height);

		const context = canvas.getContext('2d');
		if (!context) throw new Error('Browser does not support canvas');
		ctx = context;

		await tick();
		scaleCanvasDrawings(ctx, $canvasSize.scaleFactor);
		runRenders();
		runAnimations();
	});

	onDestroy(() => {
		if (animationLoop) {
			pauseAnimation();
		}
	});
</script>

<canvas
	width={$canvasSize.canvasWidth}
	height={$canvasSize.canvasHeight}
	style:width={$canvasSize.styleWidth}
	style:height={$canvasSize.styleHeight}
	class="border-2 border-solid border-black mx-auto shadow-md"
	bind:this={canvas}
	data-testid="canvas"
>
	Your browser doesn't support this content
</canvas>

<slot />
<svelte:window
	on:resize|passive={() => {
		const wasAnimationRunningBeforeResize = isAnimationRunning;
		pauseAnimation();

		const { width, height } = getCanvasParentElementDimensions();
		setCanvasSize(width, height);

		tick().then(() => {
			scaleCanvasDrawings(ctx, $canvasSize.scaleFactor);
			runRenders();
			// FIXME: Don't move an animation frame on resize just draw
			runAnimations();
			if (!wasAnimationRunningBeforeResize) pauseAnimation();
		});
	}}
	on:keypress|preventDefault={(e) => {
		if (e.code === 'Space') {
			if (isAnimationRunning) pauseAnimation();
			else runAnimations();
		}
	}}
/>
