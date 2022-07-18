import { readable, writable } from 'svelte/store';
import type { SnakePosition } from './index';

export const SNAKE_SPEED = readable(1);
export const SNAKE_START_POSITION = writable<SnakePosition>({
	x1: 130,
	x2: 170,
	y1: 97,
	y2: 103,
	direction: 'right'
});
