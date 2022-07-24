import '@testing-library/jest-dom';
import { act, render, screen } from '@testing-library/svelte';
import Play from '../../play/index.svelte';
import { SNAKE_START_POSITION } from '$lib/snake/store';
import { FOOD_POSITION } from '$lib/food/store';
import { GAME_PIECE_MIN_SIZE } from '$lib/stores';
import { get } from 'svelte/store';

describe('checking for default content on initial render', () => {
	it('has the snake and the scoreboard', async () => {
		const snakePosition = get(SNAKE_START_POSITION);
		const foodPosition = get(FOOD_POSITION);
		const foodRadius = get(GAME_PIECE_MIN_SIZE);
		render(Play);

		const canvas: HTMLCanvasElement = screen.getByTestId('canvas');
		const ctx = canvas.getContext('2d');

		await act();
		await act();

		expect(ctx?.fillRect).toBeCalledWith(
			snakePosition.x1,
			snakePosition.y1,
			snakePosition.x2 - snakePosition.x1,
			snakePosition.y2 - snakePosition.y1
		);

		expect(ctx?.arc).toBeCalledWith(foodPosition.x, foodPosition.y, foodRadius, 0, 2 * Math.PI);
		expect(ctx?.fill).toBeCalledTimes(1);

		expect(screen.getByText(0)).toBeInTheDocument();
	});
});
