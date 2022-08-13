<script lang="ts">
	import Snake from './snake/Snake.svelte';
	import Food from './food/Food.svelte';
	import { GAME_PIECE_MIN_SIZE } from './stores';
	import { DEFAULT_CANVAS_HEIGHT, DEFAULT_CANVAS_WIDTH } from './canvas/store';
	import { SNAKE_POSITION } from './snake/store';
	import { FOOD_POSITION } from './food/store';
	import type { SnakePosition } from './snake';

	$: snakeHead = $SNAKE_POSITION ? $SNAKE_POSITION[0] : null;

	$: eaten = (() => {
		if (!snakeHead) return false;

		const foodPosition = {
			x1: $FOOD_POSITION.x - $GAME_PIECE_MIN_SIZE / 2,
			x2: $FOOD_POSITION.x + $GAME_PIECE_MIN_SIZE / 2,
			y1: $FOOD_POSITION.y - $GAME_PIECE_MIN_SIZE / 2,
			y2: $FOOD_POSITION.y + $GAME_PIECE_MIN_SIZE / 2
		};

		if (
			((snakeHead.direction === 'right' && snakeHead.x2 === $FOOD_POSITION.x) ||
				(snakeHead.direction === 'left' && snakeHead.x1 === $FOOD_POSITION.x)) &&
			(snakeHead.y1 === foodPosition.y1 ||
				(snakeHead.y1 < foodPosition.y2 && snakeHead.y1 > foodPosition.y1) ||
				(snakeHead.y2 < foodPosition.y2 && snakeHead.y2 > foodPosition.y1))
		) {
			return true;
		} else if (
			((snakeHead.direction === 'down' && snakeHead.y2 === $FOOD_POSITION.y) ||
				(snakeHead.direction === 'up' && snakeHead.y1 === $FOOD_POSITION.y)) &&
			(snakeHead.x1 === foodPosition.x1 ||
				(snakeHead.x1 < foodPosition.x2 && snakeHead.x1 > foodPosition.x1) ||
				(snakeHead.x2 < foodPosition.x2 && snakeHead.x2 > foodPosition.x1))
		) {
			return true;
		} else {
			return false;
		}
	})();

	$: {
		if (eaten) {
			FOOD_POSITION.update(() => {
				return {
					x: Math.round(Math.random() * $DEFAULT_CANVAS_WIDTH),
					y: Math.round(Math.random() * $DEFAULT_CANVAS_HEIGHT)
				};
			});
		}
	}
</script>

<Snake />
<Food redraw={eaten} />
