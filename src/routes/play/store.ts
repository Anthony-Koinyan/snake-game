import { DIFFICULTIES, DIFFICULTY } from '$lib/stores';
import { derived, writable } from 'svelte/store';

import type { FoodPosition, SnakePosition } from '$lib/types';

export const FOOD_POSITION = writable<FoodPosition>();

export const SNAKE_SPEED = derived(
	[DIFFICULTY, DIFFICULTIES],
	([difficulty, difficulties]) => difficulties.indexOf(difficulty) + 1
);

export const SNAKE_POSITION = writable<SnakePosition[]>([
	{ x1: 130, x2: 210, y1: 97, y2: 109, direction: 'right' }
]);
