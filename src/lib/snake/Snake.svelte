<script lang="ts">
	import { getContext } from 'svelte';
	import { GAME_PIECE_MIN_SIZE, RENDER_CONTEXT_KEY } from '$lib/stores';
	import { SNAKE_SPEED, SNAKE_START_POSITION, SNAKE_CURRENT_POSITION } from './store';
	import Snake from './index';
	import type { RenderContext } from '../canvas/types';

	const { addRenderFn } = getContext<RenderContext>(RENDER_CONTEXT_KEY);
	const snake = new Snake($SNAKE_START_POSITION, $SNAKE_SPEED, $GAME_PIECE_MIN_SIZE);

	addRenderFn({
		renderFn: (ctx: CanvasRenderingContext2D) => {
			snake.clear(ctx);
			snake.draw(ctx);
			snake.move();
			SNAKE_CURRENT_POSITION.update(() => snake.position);
		},
		animate: true
	});
</script>

<svelte:window
	on:keypress|preventDefault={(e) => {
		if (e.code === 'KeyD') snake.changeDirection('right');
		if (e.code === 'KeyA') snake.changeDirection('left');
		if (e.code === 'KeyW') snake.changeDirection('up');
		if (e.code === 'KeyS') snake.changeDirection('down');
	}}
/>
