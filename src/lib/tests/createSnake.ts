import type { SnakePosition, SnakeDirection } from '$lib/snake/types';

/**
 * A utility function for making snake objects for testing
 *
 * @param headDirection - the direction of the snake's head
 * @param options - adding data to create snake
 * @param options.tailDirection - the direction of the snake's tail
 * @param options.body - an array containing the directions of the rest of the snake's body continued from the snake's head
 * @param options.length - the length of a given section of the snake
 * @param options.thickness - the snakes thickness
 * @param options.startPoint - an object representing the point on the canvas to start drawing the snake
 * @param options.startPoint.x - the point on the x axis on the canvas to start drawing the snake
 * @param options.startPoint.y - the point on the y axis on the canvas to start drawing the snake
 *
 * @returns an snake object with body directions corresponding to the input
 */
const createSnake = (
	headDirection: SnakeDirection,
	{
		tailDirection = undefined,
		body = [],
		length = 50,
		thickness = 15,
		startPoint = { x: 0, y: 0 }
	}: {
		tailDirection?: SnakeDirection;
		body?: SnakeDirection[];
		length?: number;
		thickness?: number;
		startPoint?: {
			x: number;
			y: number;
		};
	} = {
		tailDirection: undefined,
		body: [],
		length: 50,
		thickness: 15,
		startPoint: {
			x: 0,
			y: 0
		}
	}
) => {
	const snakeBody: SnakePosition[] = [];

	const addToBody = (newDirection: SnakeDirection, oldDirection?: SnakeDirection) => {
		if (!oldDirection) {
			if (newDirection === 'right') {
				return snakeBody.push({
					x1: startPoint.x,
					x2: startPoint.x + length,
					y1: startPoint.y,
					y2: startPoint.y + thickness,
					direction: newDirection
				});
			} else if (newDirection === 'left') {
				return snakeBody.push({
					x1: startPoint.x - length,
					x2: startPoint.x,
					y1: startPoint.y,
					y2: startPoint.y + thickness,
					direction: newDirection
				});
			} else if (newDirection === 'up') {
				return snakeBody.push({
					x1: startPoint.x,
					x2: startPoint.x + thickness,
					y1: startPoint.y - length,
					y2: startPoint.y,
					direction: 'up'
				});
			} else if (newDirection === 'down') {
				return snakeBody.push({
					x1: startPoint.x,
					x2: startPoint.x + thickness,
					y1: startPoint.y,
					y2: startPoint.y + length,
					direction: 'down'
				});
			}
		}

		if (newDirection === 'right') {
			if (oldDirection === 'left' || oldDirection === 'right')
				throw new Error(
					"Next direction cannot be 'RIGHT' if previous direction is 'LEFT' or 'RIGHT'"
				);

			snakeBody.unshift({
				x1: snakeBody[0].x1,
				x2: snakeBody[0].x2 + length,
				y1: snakeBody[0].direction === 'up' ? snakeBody[0].y1 : snakeBody[0].y2 - thickness,
				y2: snakeBody[0].direction === 'up' ? snakeBody[0].y1 + thickness : snakeBody[0].y2,
				direction: 'right'
			});
		} else if (newDirection === 'left') {
			if (oldDirection === 'left' || oldDirection === 'right')
				throw new Error(
					"Next direction cannot be 'LEFT' if previous direction is 'LEFT' or 'RIGHT'"
				);

			snakeBody.unshift({
				x1: snakeBody[0].x1 - length,
				x2: snakeBody[0].x2,
				y1: snakeBody[0].direction === 'up' ? snakeBody[0].y1 : snakeBody[0].y2 - thickness,
				y2: snakeBody[0].direction === 'up' ? snakeBody[0].y1 + thickness : snakeBody[0].y2,
				direction: 'left'
			});
		} else if (newDirection === 'up') {
			if (oldDirection === 'up' || oldDirection === 'down')
				throw new Error("Next direction cannot be 'UP' if previous direction is 'UP' or 'DOWN'");

			snakeBody.unshift({
				x1: snakeBody[0].direction === 'right' ? snakeBody[0].x2 - thickness : snakeBody[0].x1,
				x2: snakeBody[0].direction === 'right' ? snakeBody[0].x2 : snakeBody[0].x1 + thickness,
				y1: snakeBody[0].y1 - length,
				y2: snakeBody[0].y2,
				direction: 'up'
			});
		} else {
			if (oldDirection === 'up' || oldDirection === 'down')
				throw new Error("Tail direction cannot be 'DOWN' if head direction is 'UP' or 'DOWN'");

			snakeBody.unshift({
				x1: snakeBody[0].direction === 'right' ? snakeBody[0].x2 - thickness : snakeBody[0].x1,
				x2: snakeBody[0].direction === 'right' ? snakeBody[0].x2 : snakeBody[0].x1 + thickness,
				y1: snakeBody[0].y1,
				y2: snakeBody[0].y2 + length,
				direction: 'down'
			});
		}
	};

	if (tailDirection) {
		addToBody(tailDirection);
	}

	if (body.length > 0) {
		for (let i = body.length - 1; i >= 0; i--) {
			addToBody(body[i], body[i - 1] || headDirection);
		}
	}

	if (snakeBody.length) {
		addToBody(headDirection, snakeBody[0].direction);
	} else {
		addToBody(headDirection);
	}

	return snakeBody;
};

export default createSnake;
