<script lang="ts">
	import { getContext } from 'svelte';
	import {
		DIFFICULTY,
		GAME_PIECE_MIN_SIZE,
		HIGHSCORES,
		RENDER_CONTEXT_KEY,
		SCOREBOARD
	} from '$lib/stores';

	import moveSnake from './moveSnake';
	import isGameOver from './isGameOver';
	import hasSnakeEatenFood from './hasSnakeEatenFood';
	import changeSnakeDirection from './changeSnakeDirection';
	import generateNewFoodPosition from './generateNewFoodPosition';

	import { SNAKE_SPEED, SNAKE_POSITION, FOOD_POSITION } from './store';
	import { DEFAULT_CANVAS_WIDTH, DEFAULT_CANVAS_HEIGHT } from '$lib/canvas/store';

	import type { RenderContext } from '$lib/canvas/types';
	import type { SnakeDirection } from '$lib/types';

	const { addRenderFn, removeRenderFn } = getContext<RenderContext>(RENDER_CONTEXT_KEY);

	const renderFn = (ctx: CanvasRenderingContext2D) => {
		for (let i = 0; i < $SNAKE_SPEED; i++) {
			if (isGameOver($SNAKE_POSITION)) {
				removeRenderFn(renderFn);
				$HIGHSCORES.push($SCOREBOARD);
				$HIGHSCORES.sort((first, second) => second - first);
				if ($HIGHSCORES.length > 5) {
					$HIGHSCORES.pop();
				}
				break;
			}

			if (hasSnakeEatenFood($SNAKE_POSITION[0], $FOOD_POSITION, $GAME_PIECE_MIN_SIZE / 2)) {
				$FOOD_POSITION = generateNewFoodPosition(
					$GAME_PIECE_MIN_SIZE,
					{
						width: $DEFAULT_CANVAS_WIDTH,
						height: $DEFAULT_CANVAS_HEIGHT
					},
					[...$SNAKE_POSITION]
				);

				SCOREBOARD.update((score) => score + $SNAKE_SPEED);
				SNAKE_POSITION.update((position) => {
					if (position[0].direction === 'right') position[0].x2 += $SNAKE_SPEED;
					if (position[0].direction === 'left') position[0].x1 -= $SNAKE_SPEED;
					if (position[0].direction === 'up') position[0].y1 -= $SNAKE_SPEED;
					if (position[0].direction === 'down') position[0].y2 += $SNAKE_SPEED;

					return position;
				});
			}

			for (const position of $SNAKE_POSITION) {
				ctx.clearRect(
					position.x1 - 1,
					position.y1 - 1,
					position.x2 - position.x1 + 2,
					position.y2 - position.y1 + 2
				);
			}

			$SNAKE_POSITION = moveSnake(
				$SNAKE_POSITION,
				$GAME_PIECE_MIN_SIZE,
				$DEFAULT_CANVAS_WIDTH,
				$DEFAULT_CANVAS_HEIGHT
			);

			for (const position of $SNAKE_POSITION) {
				ctx.fillRect(
					position.x1,
					position.y1,
					position.x2 - position.x1,
					position.y2 - position.y1
				);
			}
		}
	};

	addRenderFn({
		renderFn,
		animate: true
	});

	let startTouchX: number;
	let startTouchY: number;
	const touchThreshold = 15;
	let swipeDirection: SnakeDirection;
</script>

<svelte:window
	on:keydown={(e) => {
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
	on:touchstart={(e) => {
		startTouchX = e.changedTouches[0].pageX;
		startTouchY = e.changedTouches[0].pageY;
	}}
	on:touchmove={(e) => {
		const swipeDistanceX = e.changedTouches[0].pageX - startTouchX;
		const swipeDistanceY = e.changedTouches[0].pageY - startTouchY;

		if (swipeDistanceX < -touchThreshold) swipeDirection = 'left';
		if (swipeDistanceX > touchThreshold) swipeDirection = 'right';

		if (swipeDistanceY < -touchThreshold) swipeDirection = 'up';
		if (swipeDistanceY > touchThreshold) swipeDirection = 'down';
	}}
	on:touchend={() => {
		if (swipeDirection === 'right')
			$SNAKE_POSITION = changeSnakeDirection('right', $SNAKE_POSITION, $GAME_PIECE_MIN_SIZE);
		if (swipeDirection === 'left')
			$SNAKE_POSITION = changeSnakeDirection('left', $SNAKE_POSITION, $GAME_PIECE_MIN_SIZE);
		if (swipeDirection === 'up')
			$SNAKE_POSITION = changeSnakeDirection('up', $SNAKE_POSITION, $GAME_PIECE_MIN_SIZE);
		if (swipeDirection === 'down')
			$SNAKE_POSITION = changeSnakeDirection('down', $SNAKE_POSITION, $GAME_PIECE_MIN_SIZE);
	}}
/>
