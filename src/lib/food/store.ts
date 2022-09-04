import { writable } from 'svelte/store';
import type { FoodPosition } from './types';

export const FOOD_POSITION = writable<FoodPosition>({ x: 50, y: 90 });
