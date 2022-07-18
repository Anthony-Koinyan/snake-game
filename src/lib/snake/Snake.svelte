<script lang="ts">
	import { getContext } from 'svelte';
	import { GAME_PIECE_MIN_SIZE, RENDER_CONTEXT_KEY } from '$lib/stores';
	import { SNAKE_SPEED, SNAKE_START_POSITION } from './store';
	import Snake from './index';
	import type { RenderContext } from '../canvas/types';

	const { addRenderFn } = getContext<RenderContext>(RENDER_CONTEXT_KEY);
	const snake = new Snake($SNAKE_START_POSITION, $SNAKE_SPEED, $GAME_PIECE_MIN_SIZE);

	addRenderFn({
		renderFn: (ctx: CanvasRenderingContext2D) => {
			snake.clear(ctx);
			snake.draw(ctx);
			snake.move();
		},
		animate: true
	});
</script>
