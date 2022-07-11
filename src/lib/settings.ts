import { readable, writable } from 'svelte/store';
import type { SnakePosition } from './snake';

export const GAME_PIECE_MIN_SIZE = readable(5);

// TODO: Change this to snakeCtxKey
export const ctxKey = Symbol();
export const SNAKE_SPEED = writable(0);
export const SNAKE_START_POSITION = writable<SnakePosition>({
	x1: 60,
	x2: 65,
	y1: 30,
	y2: 35,
	direction: 'right'
});
