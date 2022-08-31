export type SnakeDirection = 'right' | 'left' | 'up' | 'down';

export interface SnakePosition {
	x1: number;
	x2: number;
	y1: number;
	y2: number;
	direction: SnakeDirection;
}
