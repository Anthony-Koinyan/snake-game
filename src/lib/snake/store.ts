// TODO: MOVE THIS TO GLOBAL STORE

import { derived, writable } from 'svelte/store';
import { DIFFICULTY } from '../stores';
import type { SnakePosition } from './index';

// TODO: Drive this from game difficulty
export const SNAKE_SPEED = derived(DIFFICULTY, (difficulty) => difficulty.increment);

export const SNAKE_POSITION = writable<SnakePosition[]>([
	{
		x1: 130,
		x2: 170,
		y1: 97,
		y2: 103,
		direction: 'right'
	}
]);
