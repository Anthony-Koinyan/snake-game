import Snake from '$lib/snake';
import type { SnakePosition } from '$lib/snake';

type direction = SnakePosition['direction'];

export default (
	headDirection: direction,
	tailDirection: direction | null = null,
	body: direction[] = []
) => {
	const thickness = 15;
	const length = 100;
	const speed = 3;
	const startPoint = { x: 190, y: 190 };
	const snakeBody: SnakePosition[] = [];

	const addToBody = (newDirection: direction, oldDirection: direction) => {
		if (newDirection === 'right') {
			if (oldDirection === 'left' || oldDirection === 'right')
				throw new Error("Tail direction cannot be 'RIGHT' if head direction is 'LEFT' or 'RIGHT'");

			snakeBody.push({
				x1: snakeBody[0].x1,
				x2: snakeBody[0].x2 + length,
				y1: snakeBody[0].direction === 'up' ? snakeBody[0].y1 : snakeBody[0].y2 - thickness,
				y2: snakeBody[0].direction === 'up' ? snakeBody[0].y1 + thickness : snakeBody[0].y2,
				direction: 'right'
			});
		} else if (newDirection === 'left') {
			if (oldDirection === 'left' || oldDirection === 'right')
				throw new Error("Tail direction cannot be 'LEFT' if head direction is 'LEFT' or 'RIGHT'");

			snakeBody.push({
				x1: snakeBody[0].x1 - length,
				x2: snakeBody[0].x2,
				y1: snakeBody[0].direction === 'up' ? snakeBody[0].y1 : snakeBody[0].y2 - thickness,
				y2: snakeBody[0].direction === 'up' ? snakeBody[0].y1 + thickness : snakeBody[0].y2,
				direction: 'left'
			});
		} else if (newDirection === 'up') {
			if (oldDirection === 'up' || oldDirection === 'down')
				throw new Error("Tail direction cannot be 'UP' if head direction is 'UP' or 'DOWN'");

			snakeBody.push({
				x1: snakeBody[0].direction === 'right' ? snakeBody[0].x2 - thickness : snakeBody[0].x1,
				x2: snakeBody[0].direction === 'right' ? snakeBody[0].x2 : snakeBody[0].x1 + thickness,
				y1: snakeBody[0].y1 - length,
				y2: snakeBody[0].y2,
				direction: 'up'
			});
		} else {
			if (oldDirection === 'up' || oldDirection === 'down')
				throw new Error("Tail direction cannot be 'DOWN' if head direction is 'UP' or 'DOWN'");

			snakeBody.push({
				x1: snakeBody[0].direction === 'right' ? snakeBody[0].x2 - thickness : snakeBody[0].x1,
				x2: snakeBody[0].direction === 'right' ? snakeBody[0].x2 : snakeBody[0].x1 + thickness,
				y1: snakeBody[0].y1,
				y2: snakeBody[0].y2 + length,
				direction: 'down'
			});
		}
	};

	if (headDirection === 'right' || headDirection === 'left') {
		snakeBody.push({
			x1: startPoint.x,
			x2: startPoint.x + length,
			y1: startPoint.y,
			y2: startPoint.y + thickness,
			direction: headDirection
		});
	} else {
		snakeBody.push({
			x1: startPoint.x,
			x2: startPoint.x + thickness,
			y1: startPoint.y,
			y2: startPoint.y + length,
			direction: headDirection
		});
	}

	if (body.length > 0) {
		body.forEach((direction, index) => {
			addToBody(direction, body[index - 1] || headDirection);
		});
	}

	if (tailDirection) {
		addToBody(tailDirection, headDirection);
	}

	return {
		snake: new Snake(snakeBody, speed, thickness),
		createdWith: snakeBody,
		snakeSpeed: speed,
		snakeThickness: thickness,
		defaultLength: length
	};
};
