import { DEFAULT_CANVAS_HEIGHT, DEFAULT_CANVAS_WIDTH } from '$lib/canvas/store';
import { DIFFICULTIES, DIFFICULTY, GAME_PIECE_MIN_SIZE, SCOREBOARD } from '$lib/stores';
import { get } from 'svelte/store';

import { FOOD_POSITION, SNAKE_POSITION, SNAKE_SPEED } from '../../routes/play/store';

import type { SnakePosition, FoodPosition } from '$lib/types';

const difficulties = get(DIFFICULTIES);
export type Difficulty = typeof difficulties[number];
export const getScore = () => get(SCOREBOARD);
export const setScore = (score: number) => SCOREBOARD.set(score);
export const getSnakeSpeed = () => get(SNAKE_SPEED);
export const getGameDifficulty = () => get(DIFFICULTY);
export const setGameDifficulty = (difficulty: Difficulty) => DIFFICULTY.set(difficulty);
export const getGamePieceSize = () => get(GAME_PIECE_MIN_SIZE);
export const setGamePieceSize = (size: number) => GAME_PIECE_MIN_SIZE.set(size);
export const setFoodPosition = (newPosition: FoodPosition) => FOOD_POSITION.set(newPosition);
export const getFoodPosition = () => get(FOOD_POSITION);
export const setSnakePosition = (newPosition: SnakePosition[]) => SNAKE_POSITION.set(newPosition);
export const getSnakePosition = () =>
	JSON.parse(JSON.stringify(get(SNAKE_POSITION))) as SnakePosition[];
export const getCanvasBoundaryDimensions = () => {
	return {
		horizontal: get(DEFAULT_CANVAS_WIDTH),
		vertical: get(DEFAULT_CANVAS_HEIGHT)
	};
};
