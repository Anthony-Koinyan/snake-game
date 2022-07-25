<script lang="ts">
	import type { RenderContext } from '$lib/canvas/types';
	import { GAME_PIECE_MIN_SIZE, RENDER_CONTEXT_KEY } from '$lib/stores';
	import { getContext } from 'svelte';
	import Food from './index';
	import { FOOD_POSITION } from './store';

	const { addRenderFn } = getContext<RenderContext>(RENDER_CONTEXT_KEY);
	const food = new Food($FOOD_POSITION, $GAME_PIECE_MIN_SIZE / 2);

	addRenderFn({
		renderFn: (ctx) => {
			food.draw(ctx);
		},
		animate: false
	});
</script>
