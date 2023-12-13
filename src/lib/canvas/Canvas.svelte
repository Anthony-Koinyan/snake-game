<script lang="ts">
	// TODO: STYLE FALLBACK CONTENT!!!!
	import { onDestroy, onMount, setContext } from 'svelte';
	import debounce from 'lodash.debounce';

	import scaleCanvas from './scaleCanvas';
	import { RENDER_CONTEXT_KEY } from '../stores';
	import type { RenderFn, RenderObject, RenderContext } from './types';

	export let paused: boolean;

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let animation: number;

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
				if (typeof fn !== 'function') {
					throw new Error('INVALID INPUT!!!\nRender function must be FUNCTION!!!');
				}
				fn(ctx);
			});
		}
	};

	const runAnimations = () => {
		if (animations.size === 0) {
			return pauseAnimation();
		}

		animations.forEach((fn) => {
			if (typeof fn !== 'function') {
				throw new Error('INVALID INPUT!!!Animation function must be FUNCTION!!!');
			}

			fn(ctx);
		});

		animation = requestAnimationFrame(runAnimations);
	};

	const pauseAnimation = () => {
		cancelAnimationFrame(animation);
		animation = 0;
	};

	$: {
		if (paused === true && animation > 0) pauseAnimation();
		else if (paused === false && animation === 0) runAnimations();
	}

	onMount(() => {
		if (!canvas.getContext('2d')) throw new Error('Browser does not support canvas');
		ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

		scaleCanvas(canvas);

		if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
			ctx.fillStyle = 'rgb(245, 245, 245, 1)';
		}

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
	class="border-2 border-solid border-black dark:border-neutral-100 mx-auto shadow-md"
	bind:this={canvas}
	data-testid="canvas"
>
	Your browser doesn't support this content
</canvas>

<slot />
<svelte:window
	on:resize|passive={debounce(() => {
		const wasAnimationRunningBeforeResize = !!animation;

		pauseAnimation();
		scaleCanvas(canvas);

		if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
			ctx.fillStyle = 'rgb(245, 245, 245, 1)';
		}

		runRenders();
		runAnimations();

		if (!wasAnimationRunningBeforeResize) pauseAnimation();
	}, 125)}
/>
