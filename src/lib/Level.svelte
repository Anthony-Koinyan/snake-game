<script lang="ts">
	/**
	 * TODO:
	 * - Snake should be able to eat itself
	 * - Draw obstacles if the level in level that have those
	 * - If there are no obstacles and the snake goes through the bounds of the
	 *   canvas it should come out the other side of the canvas
	 */
	import Snake from './snake/Snake.svelte';
	import Food from './food/Food.svelte';
	import { DIFFICULTY, GAME_PIECE_MIN_SIZE, SCOREBOARD } from './stores';
	import { DEFAULT_CANVAS_HEIGHT, DEFAULT_CANVAS_WIDTH } from './canvas/store';
	import { SNAKE_POSITION } from './snake/store';
	import { FOOD_POSITION } from './food/store';

	let eaten: boolean, stopSnake: boolean;

	$: snakeHead = $SNAKE_POSITION[0];

	$: {
		if (!snakeHead) eaten = false;

		/**
		 * FIXME:
		 * - Sometimes part of the food is drawn outside the canvas
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

			SCOREBOARD.update((score) => score + $DIFFICULTY.increment);
		}

		for (const bodyPart of $SNAKE_POSITION) {
			if ($SNAKE_POSITION.indexOf(bodyPart) === 0) continue;

			if (
				snakeHead.direction === 'up' &&
				(bodyPart.direction === 'left' || bodyPart.direction === 'right') &&
				snakeHead.y1 === bodyPart.y2 &&
				snakeHead.x1 <= bodyPart.x2 &&
				snakeHead.x1 >= bodyPart.x1
			)
				stopSnake = true;

			if (
				snakeHead.direction === 'down' &&
				(bodyPart.direction === 'left' || bodyPart.direction === 'right') &&
				snakeHead.y2 === bodyPart.y1 &&
				snakeHead.x2 <= bodyPart.x2 &&
				snakeHead.x1 >= bodyPart.x1
			)
				stopSnake = true;

			if (
				snakeHead.direction === 'right' &&
				(bodyPart.direction === 'down' || bodyPart.direction === 'up') &&
				snakeHead.x2 === bodyPart.x1 &&
				snakeHead.y1 >= bodyPart.y1 &&
				snakeHead.y2 <= bodyPart.y2
			)
				stopSnake = true;

			if (
				snakeHead.direction === 'left' &&
				(bodyPart.direction === 'down' || bodyPart.direction === 'up') &&
				snakeHead.x1 === bodyPart.x2 &&
				snakeHead.y1 >= bodyPart.y1 &&
				snakeHead.y2 <= bodyPart.y2
			)
				stopSnake = true;
		}
	}
</script>

<Snake deleteAnimation={stopSnake} />
<Food redraw={eaten} />
