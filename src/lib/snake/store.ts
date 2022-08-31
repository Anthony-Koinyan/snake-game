// TODO: MOVE THIS TO GLOBAL STORE

import { derived, writable } from 'svelte/store';

import { DIFFICULTIES, DIFFICULTY } from '../stores';

import type { SnakePosition } from './types';

export const SNAKE_SPEED = derived(
	[DIFFICULTY, DIFFICULTIES],
	([difficulty, difficulties]) => difficulties.indexOf(difficulty) + 1
);
export const SNAKE_POSITION = writable<SnakePosition[]>([
	{ x1: 130, x2: 210, y1: 97, y2: 109, direction: 'right' }
]);
