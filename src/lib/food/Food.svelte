<script lang="ts">
	import type { RenderContext } from '$lib/canvas/types';
	import { GAME_PIECE_MIN_SIZE, RENDER_CONTEXT_KEY } from '$lib/stores';
	import { getContext } from 'svelte';
	import Food from './index';
	import { FOOD_POSITION } from './store';

	export let redraw = false;

	const { addRenderFn, removeRenderFn } = getContext<RenderContext>(RENDER_CONTEXT_KEY);
	let food: Food;

	const renderFn = (ctx: CanvasRenderingContext2D) => {
		if (redraw) {
			food.clear(ctx);
		}
		food = new Food($FOOD_POSITION, $GAME_PIECE_MIN_SIZE / 2);
		food.draw(ctx);
	};

	$: {
		if (redraw) {
			removeRenderFn(renderFn);
		}
		addRenderFn({ renderFn, animate: false });
	}
</script>
