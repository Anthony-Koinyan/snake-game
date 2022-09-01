import type { SnakePosition } from './types';

export default function (
	snakePosition: SnakePosition[],
	thickness: number,
	horizontalBoundary: number,
	verticalBoundary: number
): SnakePosition[] {
	const snakeBody = JSON.parse(JSON.stringify(snakePosition)) as SnakePosition[];
	let head = snakeBody[0];
	let tail = snakeBody[snakeBody.length - 1];

	if (
		(head.x1 === 0 ||
			head.y1 === 0 ||
			head.x2 === horizontalBoundary ||
			head.y2 === verticalBoundary) &&
		(snakeBody.length === 1 || (snakeBody.length > 1 && head.direction !== snakeBody[1].direction))
	) {
		if (head.direction === 'left') {
			snakeBody.unshift({
				x1: horizontalBoundary,
				x2: horizontalBoundary,
				y1: head.y1,
				y2: head.y2,
				direction: head.direction
			});

			head = snakeBody[0];
		} else if (head.direction === 'right') {
			snakeBody.unshift({
				x1: 0,
				x2: 0,
				y1: head.y1,
				y2: head.y2,
				direction: head.direction
			});

			head = snakeBody[0];
		} else if (head.direction === 'up') {
			snakeBody.unshift({
				x1: head.x1,
				x2: head.x2,
				y1: verticalBoundary,
				y2: verticalBoundary,
				direction: head.direction
			});

			head = snakeBody[0];
		} else if (head.direction === 'down') {
			snakeBody.unshift({
				x1: head.x1,
				x2: head.x2,
				y1: 0,
				y2: 0,
				direction: head.direction
			});

			head = snakeBody[0];
		}
	}

	if (head.direction === 'right') {
		head.x2 += 1;
	} else if (head.direction === 'left') {
		head.x1 -= 1;
	} else if (head.direction === 'up') {
		head.y1 -= 1;
	} else if (head.direction === 'down') {
		head.y2 += 1;
	}

	if (tail.direction === 'right') {
		if (
			(tail.x1 + thickness === tail.x2 && tail.x2 < horizontalBoundary) ||
			tail.x1 === horizontalBoundary
		) {
			snakeBody.pop();
			tail = snakeBody[snakeBody.length - 1];
		}
	} else if (tail.direction === 'left') {
		if ((tail.x1 + thickness >= tail.x2 && tail.x1 > 0) || tail.x2 === 0) {
			snakeBody.pop();
			tail = snakeBody[snakeBody.length - 1];
		}
	} else if (tail.direction === 'up') {
		if ((tail.y1 + thickness >= tail.y2 && tail.y1 > 0) || tail.y2 === 0) {
			snakeBody.pop();
			tail = snakeBody[snakeBody.length - 1];
		}
	} else if (tail.direction === 'down') {
		if (
			(tail.y1 + thickness >= tail.y2 && tail.y2 < verticalBoundary) ||
			tail.y1 === verticalBoundary
		) {
			snakeBody.pop();
			tail = snakeBody[snakeBody.length - 1];
		}
	}

	if (tail.direction === 'right') {
		tail.x1 += 1;
	} else if (tail.direction === 'left') {
		tail.x2 -= 1;
	} else if (tail.direction === 'up') {
		tail.y2 -= 1;
	} else if (tail.direction === 'down') {
		tail.y1 += 1;
	}

	return snakeBody;
}
