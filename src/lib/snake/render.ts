import type { SnakePosition } from './types';

export function drawSnake(ctx: CanvasRenderingContext2D, snakePosition: SnakePosition[]) {
	for (const position of snakePosition) {
		ctx.fillRect(position.x1, position.y1, position.x2 - position.x1, position.y2 - position.y1);
	}
}

export function clearSnake(ctx: CanvasRenderingContext2D, snakePosition: SnakePosition[]) {
	for (const position of snakePosition) {
		ctx.clearRect(
			position.x1 - 1,
			position.y1 - 1,
			position.x2 - position.x1 + 2,
			position.y2 - position.y1 + 2
		);
	}
}
