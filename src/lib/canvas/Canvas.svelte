<script lang="ts">
	// TODO: STYLE FALLBACK CONTENT!!!!
	import { onDestroy, onMount, setContext, tick } from 'svelte';

	import scaleCanvas from './scaleCanvas';
	import { RENDER_CONTEXT_KEY } from '../stores';
	import type { RenderFn, RenderObject, RenderContext } from './types';

	export let width: number, height: number;

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let animation: number;

	let canvasDimensions = {
		canvasWidth: 1,
		canvasHeight: 1,
		styleWidth: '1px',
		styleHeight: '1px'
	};

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

		animation = requestAnimationFrame(runAnimations);
	};

	const pauseAnimation = () => {
		cancelAnimationFrame(animation);
		animation = 0;
	};

	const getParentDimensions = () => {
		const parent = canvas.parentElement as HTMLElement;
		return { width: parent.clientWidth, height: parent.clientHeight };
	};

	onMount(async () => {
		if (!canvas.getContext('2d')) throw new Error('Browser does not support canvas');
		ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

		const { width: parentWidth, height: parentHeight } = getParentDimensions();
		canvasDimensions = scaleCanvas(parentWidth, parentHeight, width, height, ctx);

		await tick();
		runRenders();
		runAnimations();
	});

	onDestroy(() => {
		if (animation) {
			pauseAnimation();
		}
	});
</script>

<canvas
	width={canvasDimensions.canvasWidth}
	height={canvasDimensions.canvasHeight}
	style:width={canvasDimensions.styleWidth}
	style:height={canvasDimensions.styleHeight}
	class="border-2 border-solid border-black mx-auto shadow-md"
	bind:this={canvas}
	data-testid="canvas"
>
	Your browser doesn't support this content
</canvas>

<slot />
<svelte:window
	on:resize|passive={() => {
		// FIXME: Don't move an animation frame on resize just draw
		const wasAnimationRunningBeforeResize = !!animation;
		pauseAnimation();

		const { width: parentWidth, height: parentHeight } = getParentDimensions();
		canvasDimensions = scaleCanvas(parentWidth, parentHeight, width, height, ctx);

		tick().then(() => {
			runRenders();
			runAnimations();
			if (!wasAnimationRunningBeforeResize) pauseAnimation();
		});
	}}
	on:keypress|preventDefault={(e) => {
		if (e.code === 'Space') {
			if (animation) pauseAnimation();
			else runAnimations();
		}
	}}
/>
