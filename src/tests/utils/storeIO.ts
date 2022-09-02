import { DEFAULT_CANVAS_HEIGHT, DEFAULT_CANVAS_WIDTH } from '$lib/canvas/store';
import { SNAKE_POSITION } from '$lib/snake/store';
import { DIFFICULTIES, DIFFICULTY, GAME_PIECE_MIN_SIZE } from '$lib/stores';
import { get } from 'svelte/store';

import type { SnakePosition } from '$lib/snake/types';

const difficulties = get(DIFFICULTIES);
export type Difficulty = typeof difficulties[number];
export const setSnakePosition = (newPosition: SnakePosition[]) => SNAKE_POSITION.set(newPosition);
export const getGameDifficulty = () => get(DIFFICULTY);
export const setGameDifficulty = (difficulty: Difficulty) => DIFFICULTY.set(difficulty);
export const getGamePieceSize = () => get(GAME_PIECE_MIN_SIZE);
export const setGamePieceSize = (size: number) => GAME_PIECE_MIN_SIZE.set(size);
export const getSnakePosition = () =>
	JSON.parse(JSON.stringify(get(SNAKE_POSITION))) as SnakePosition[];
export const getCanvasBoundaryDimensions = () => {
	return {
		horizontal: get(DEFAULT_CANVAS_WIDTH),
		vertical: get(DEFAULT_CANVAS_HEIGHT)
	};
};
