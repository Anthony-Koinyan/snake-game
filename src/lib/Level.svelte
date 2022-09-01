<script lang="ts">
	/**
	 * TODO:
	 * - Draw obstacles if the level in level that have those
	 */
	import Snake from './snake/Snake.svelte';
	import Food from './food/Food.svelte';
	import { GAME_PIECE_MIN_SIZE, SCOREBOARD } from './stores';
	import { DEFAULT_CANVAS_HEIGHT, DEFAULT_CANVAS_WIDTH } from './canvas/store';
	import { SNAKE_POSITION, SNAKE_SPEED } from './snake/store';
	import { FOOD_POSITION } from './food/store';

	let eaten: boolean;

	$: snakeHead = $SNAKE_POSITION[0];

	$: {
		if (!snakeHead) eaten = false;

		/**
		 * FIXME:
		 * - Sometimes part of the food is drawn in the snake position
		 */
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
			eaten = true;
		} else if (
			((snakeHead.direction === 'down' && snakeHead.y2 === $FOOD_POSITION.y) ||
				(snakeHead.direction === 'up' && snakeHead.y1 === $FOOD_POSITION.y)) &&
			(snakeHead.x1 === foodPosition.x1 ||
				(snakeHead.x1 < foodPosition.x2 && snakeHead.x1 > foodPosition.x1) ||
				(snakeHead.x2 < foodPosition.x2 && snakeHead.x2 > foodPosition.x1))
		) {
			eaten = true;
		} else {
			eaten = false;
		}
	}

	$: {
		if (eaten) {
			FOOD_POSITION.update(() => {
				const generateNewPosition = (): { x: number; y: number } => {
					const position = {
						x: Math.round(Math.random() * $DEFAULT_CANVAS_WIDTH),
						y: Math.round(Math.random() * $DEFAULT_CANVAS_HEIGHT)
					};

					if (
						position.x > $DEFAULT_CANVAS_WIDTH - $GAME_PIECE_MIN_SIZE / 2 ||
						position.x < $GAME_PIECE_MIN_SIZE ||
						position.y > $DEFAULT_CANVAS_HEIGHT - $GAME_PIECE_MIN_SIZE / 2 ||
						position.y < $GAME_PIECE_MIN_SIZE
					) {
						return generateNewPosition();
					}

					return position;
				};
				return {
					x: Math.round(Math.random() * $DEFAULT_CANVAS_WIDTH),
					y: Math.round(Math.random() * $DEFAULT_CANVAS_HEIGHT)
				};
			});

			SNAKE_POSITION.update((position) => {
				if (position[0].direction === 'right') position[0].x2 += 3;
				if (position[0].direction === 'left') position[0].x1 += 3;
				if (position[0].direction === 'up') position[0].y1 += 3;
				if (position[0].direction === 'down') position[0].y2 += 3;

				return position;
			});

			SCOREBOARD.update((score) => score + $SNAKE_SPEED);
		}
	}
</script>

<Snake />
<Food redraw={eaten} />
