import type { SnakePosition } from './snake';
import type { FoodPosition } from './food';

export interface GamePiece {
	draw: (ctx: CanvasRenderingContext2D) => void;
	clear: (ctx: CanvasRenderingContext2D) => void;
	position: () => SnakePosition[] | FoodPosition;
}
