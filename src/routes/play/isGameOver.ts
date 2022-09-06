import type { SnakePosition } from '$lib/types';

export default function (snakePosition: SnakePosition[]) {
	const head = JSON.parse(JSON.stringify(snakePosition))[0] as SnakePosition;
	for (const bodyPart of snakePosition) {
		if (snakePosition.indexOf(bodyPart) === 0) continue;

		if (
			head.direction === 'up' &&
			(bodyPart.direction === 'left' || bodyPart.direction === 'right') &&
			head.y1 === bodyPart.y2 &&
			head.x1 <= bodyPart.x2 &&
			head.x1 >= bodyPart.x1
		)
			return true;

		if (
			head.direction === 'down' &&
			(bodyPart.direction === 'left' || bodyPart.direction === 'right') &&
			head.y2 === bodyPart.y1 &&
			head.x2 <= bodyPart.x2 &&
			head.x1 >= bodyPart.x1
		)
			return true;

		if (
			head.direction === 'right' &&
			(bodyPart.direction === 'down' || bodyPart.direction === 'up') &&
			head.x2 === bodyPart.x1 &&
			head.y1 >= bodyPart.y1 &&
			head.y2 <= bodyPart.y2
		)
			return true;

		if (
			head.direction === 'left' &&
			(bodyPart.direction === 'down' || bodyPart.direction === 'up') &&
			head.x1 === bodyPart.x2 &&
			head.y1 >= bodyPart.y1 &&
			head.y2 <= bodyPart.y2
		)
			return true;
	}
	return false;
}
