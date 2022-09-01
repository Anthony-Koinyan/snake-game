<script lang="ts">
	import { getContext } from 'svelte';
	import { GAME_PIECE_MIN_SIZE, RENDER_CONTEXT_KEY } from '$lib/stores';

	import moveSnake from './moveSnake';
	import isGameOver from './isGameOver';
	import changeSnakeDirection from './changeSnakeDirection';

	import { drawSnake, clearSnake } from './render';
	import { SNAKE_SPEED, SNAKE_POSITION } from './store';
	import { DEFAULT_CANVAS_WIDTH, DEFAULT_CANVAS_HEIGHT } from '../canvas/store';

	import type { RenderContext } from '../canvas/types';

	const { addRenderFn, removeRenderFn } = getContext<RenderContext>(RENDER_CONTEXT_KEY);

	const renderFn = (ctx: CanvasRenderingContext2D) => {
		for (let i = 0; i < $SNAKE_SPEED; i++) {
			if (isGameOver($SNAKE_POSITION)) {
				removeRenderFn(renderFn);
				break;
			}

			clearSnake(ctx, $SNAKE_POSITION);
			$SNAKE_POSITION = moveSnake(
				$SNAKE_POSITION,
				$GAME_PIECE_MIN_SIZE,
				$DEFAULT_CANVAS_WIDTH,
				$DEFAULT_CANVAS_HEIGHT
			);
			drawSnake(ctx, $SNAKE_POSITION);
		}
	};

	addRenderFn({
		renderFn,
		animate: true
	});
</script>

<svelte:window
	on:keyup={(e) => {
		// TODO: add other inputs (swipe & onscreen controls)
		if (e.code === 'KeyD' || e.code === 'ArrowRight')
			$SNAKE_POSITION = changeSnakeDirection('right', $SNAKE_POSITION, $GAME_PIECE_MIN_SIZE);
		if (e.code === 'KeyA' || e.code === 'ArrowLeft')
			$SNAKE_POSITION = changeSnakeDirection('left', $SNAKE_POSITION, $GAME_PIECE_MIN_SIZE);
		if (e.code === 'KeyW' || e.code === 'ArrowUp')
			$SNAKE_POSITION = changeSnakeDirection('up', $SNAKE_POSITION, $GAME_PIECE_MIN_SIZE);
		if (e.code === 'KeyS' || e.code === 'ArrowDown')
			$SNAKE_POSITION = changeSnakeDirection('down', $SNAKE_POSITION, $GAME_PIECE_MIN_SIZE);
	}}
/>
