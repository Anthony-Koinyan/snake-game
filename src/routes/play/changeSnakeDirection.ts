import type { SnakePosition, SnakeDirection } from '$lib/types';

export default function (
	newDirection: SnakeDirection,
	snakePosition: SnakePosition[],
	thickness: number
) {
	const snakeBody = JSON.parse(JSON.stringify(snakePosition)) as SnakePosition[];
	const head = snakeBody[0];

	if (newDirection === 'right') {
		if (
			head.direction !== 'right' &&
			head.direction !== 'left' &&
			head.y2 - head.y1 > thickness * 2
		) {
			snakeBody.unshift({
				x1: head.x1,
				x2: head.x2,
				y1: head.direction === 'up' ? head.y1 : head.y2 - thickness,
				y2: head.direction === 'up' ? head.y1 + thickness : head.y2,
				direction: 'right'
			});
		}
	} else if (newDirection === 'left') {
		if (
			head.direction !== 'right' &&
			head.direction !== 'left' &&
			head.y2 - head.y1 > thickness * 2
		) {
			snakeBody.unshift({
				x1: head.x1,
				x2: head.x2,
				y1: head.direction === 'up' ? head.y1 : head.y2 - thickness,
				y2: head.direction === 'up' ? head.y1 + thickness : head.y2,
				direction: 'left'
			});
		}
	} else if (newDirection === 'up') {
		if (head.direction !== 'up' && head.direction !== 'down' && head.x2 - head.x1 > thickness * 2) {
			snakeBody.unshift({
				x1: head.direction === 'right' ? head.x2 - thickness : head.x1,
				x2: head.direction === 'right' ? head.x2 : head.x1 + thickness,
				y1: head.y1,
				y2: head.y2,
				direction: 'up'
			});
		}
	} else if (newDirection === 'down') {
		if (head.direction !== 'up' && head.direction !== 'down' && head.x2 - head.x1 > thickness * 2) {
			snakeBody.unshift({
				x1: head.direction === 'right' ? head.x2 - thickness : head.x1,
				x2: head.direction === 'right' ? head.x2 : head.x1 + thickness,
				y1: head.y1,
				y2: head.y2,
				direction: 'down'
			});
		}
	}

	return snakeBody;
}
