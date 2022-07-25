import '@testing-library/jest-dom';
import { act, render, screen } from '@testing-library/svelte';
import Play from '../../play/index.svelte';
import { SNAKE_START_POSITION } from '$lib/snake/store';
import { FOOD_POSITION } from '$lib/food/store';
import { GAME_PIECE_MIN_SIZE } from '$lib/stores';
import { get } from 'svelte/store';

describe('checking for default content on initial render', () => {
	const snakePosition = get(SNAKE_START_POSITION);
	const foodPosition = get(FOOD_POSITION);
	const foodRadius = get(GAME_PIECE_MIN_SIZE) / 2;
	let ctx: CanvasRenderingContext2D | null;

	beforeEach(async () => {
		render(Play);
		const canvas: HTMLCanvasElement = screen.getByTestId('canvas');
		ctx = canvas.getContext('2d');
		await act();
		await act();
	});

	it('draws the snake', () => {
		expect(ctx?.fillRect).toBeCalledWith(
			snakePosition.x1,
			snakePosition.y1,
			snakePosition.x2 - snakePosition.x1,
			snakePosition.y2 - snakePosition.y1
		);
	});

	it('draws food', () => {
		expect(ctx?.arc).toBeCalledWith(foodPosition.x, foodPosition.y, foodRadius, 0, 2 * Math.PI);
		expect(ctx?.fill).toBeCalledTimes(1);
	});

	it('has the scoreboard', () => {
		expect(screen.getByText(0)).toBeInTheDocument();
	});
});
