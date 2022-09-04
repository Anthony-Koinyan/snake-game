import type { FoodPosition } from './food/types';
import type { SnakePosition } from './snake/types';

export default function (snakeHead: SnakePosition, foodPosition: FoodPosition, radius: number) {
	if (
		foodPosition.x >= snakeHead.x1 &&
		foodPosition.x <= snakeHead.x2 &&
		foodPosition.y >= snakeHead.y1 &&
		foodPosition.y <= snakeHead.y2
	) {
		return true;
	}

	if (foodPosition.y >= snakeHead.y1 && foodPosition.y <= snakeHead.y2) {
		if (
			(foodPosition.x + radius >= snakeHead.x1 &&
				foodPosition.x + radius <= snakeHead.x1 + radius) ||
			(foodPosition.x - radius <= snakeHead.x2 && foodPosition.x - radius >= snakeHead.x2 - radius)
		) {
			return true;
		}
	}

	if (foodPosition.x >= snakeHead.x1 && foodPosition.x <= snakeHead.x2) {
		if (
			(foodPosition.y + radius >= snakeHead.y1 &&
				foodPosition.y + radius <= snakeHead.y1 + radius) ||
			(foodPosition.y - radius <= snakeHead.y2 && foodPosition.y - radius >= snakeHead.y2 - radius)
		) {
			return true;
		}
	}

	return false;
}
