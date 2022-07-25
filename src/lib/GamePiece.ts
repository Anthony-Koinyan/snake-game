import type { SnakePosition } from './snake';
import type { FoodPosition } from './food/types';

// TODO: CHANGE THIS FOLDER'S NAME TO TYPES
export interface GamePiece {
	draw: (ctx: CanvasRenderingContext2D) => void;
	clear: (ctx: CanvasRenderingContext2D) => void;
	position: () => SnakePosition[] | FoodPosition;
}
