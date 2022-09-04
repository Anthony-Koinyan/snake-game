import hasSnakeCollidedWithObstacle from '../hasSnakeEatenFood';

import type { SnakePosition } from '$lib/snake/types';
import type { FoodPosition } from './types';

export default function generateNewPosition(
	diameter: number,
	canvasBoundary: { width: number; height: number },
	obstacles: SnakePosition[]
): FoodPosition {
	const radius = diameter / 2;
	const newPosition = {
		x: Math.floor(Math.random() * (canvasBoundary.width - diameter)) + radius,
		y: Math.floor(Math.random() * (canvasBoundary.height - diameter)) + radius
	};

	for (const obstacle of obstacles) {
		if (hasSnakeCollidedWithObstacle(obstacle, newPosition, radius))
			return generateNewPosition(diameter, canvasBoundary, obstacles);
	}

	return newPosition;
}
