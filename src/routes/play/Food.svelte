<script lang="ts">
	import { GAME_PIECE_MIN_SIZE, RENDER_CONTEXT_KEY } from '$lib/stores';
	import { getContext } from 'svelte';
	import { FOOD_POSITION } from './store';

	import type { RenderContext } from '$lib/canvas/types';
	import type { FoodPosition } from '$lib/types';

	const { addRenderFn, removeRenderFn } = getContext<RenderContext>(RENDER_CONTEXT_KEY);

	let previousFoodPosition: FoodPosition = { x: 1, y: 1 };

	const renderFn = (ctx: CanvasRenderingContext2D) => {
		const radius = $GAME_PIECE_MIN_SIZE / 2;
		ctx.clearRect(
			previousFoodPosition.x - radius,
			previousFoodPosition.y - radius,
			radius * 2,
			radius * 2
		);

		ctx.beginPath();
		ctx.arc($FOOD_POSITION.x, $FOOD_POSITION.y, radius, 0, 2 * Math.PI);
		ctx.fill();
		ctx.closePath();
	};

	$: {
		removeRenderFn(renderFn);
		addRenderFn({ renderFn, animate: false });
		previousFoodPosition = { ...$FOOD_POSITION };
	}
</script>
