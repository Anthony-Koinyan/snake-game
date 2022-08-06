import '@testing-library/jest-dom';
import { act, fireEvent, render, screen } from '@testing-library/svelte';
import { get } from 'svelte/store';
import Play from '../index.svelte';
import { SNAKE_START_POSITION, SNAKE_CURRENT_POSITION } from '$lib/snake/store';
import { GAME_PIECE_MIN_SIZE } from '$lib/stores';
import type { SnakePosition } from '$lib/snake';
import { FOOD_POSITION } from '$lib/food/store';
// import type { FoodPosition } from '$lib/food/types';

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

describe('tests for gameplay elements', () => {
	beforeEach(async () => {
		jest.useFakeTimers();
		jest.spyOn(window, 'requestAnimationFrame');

		render(Play);
		await act();
		await act();
	});

	const getSnakeCurrentPosition = () => get(SNAKE_CURRENT_POSITION) as SnakePosition[];
	// const getFoodCurrentPosition = () => get(FOOD_POSITION) as FoodPosition;

	describe('snake can move', () => {
		it('moves the snake', async () => {
			const snakePosition = getSnakeCurrentPosition();
			await act(() => jest.advanceTimersByTime(16));
			expect(getSnakeCurrentPosition()).not.toEqual(snakePosition);
		});

		it('can change snake direction with "WASD" keys', async () => {
			expect(getSnakeCurrentPosition().length).toBe(1);
			expect(getSnakeCurrentPosition()[0].direction).toBe('right');

			fireEvent.keyPress(window, { key: 'W', code: 'KeyW' });
			await act(() => jest.advanceTimersByTime(100));
			expect(getSnakeCurrentPosition().length).toBe(2);
			expect(getSnakeCurrentPosition()[0].direction).toBe('up');

			fireEvent.keyPress(window, { key: 'D', code: 'KeyD' });
			await act(() => jest.advanceTimersByTime(100));
			expect(getSnakeCurrentPosition().length).toBe(3);
			expect(getSnakeCurrentPosition()[0].direction).toBe('right');

			fireEvent.keyPress(window, { key: 'S', code: 'KeyS' });
			await act(() => jest.advanceTimersByTime(100));
			expect(getSnakeCurrentPosition().length).toBe(4);
			expect(getSnakeCurrentPosition()[0].direction).toBe('down');

			fireEvent.keyPress(window, { key: 'A', code: 'KeyA' });
			await act(() => jest.advanceTimersByTime(100));
			expect(getSnakeCurrentPosition().length).toBe(5);
			expect(getSnakeCurrentPosition()[0].direction).toBe('left');
		});
	});

	// describe('game updates properly when snake eats food', () => {
	// 	beforeEach(() => {});

	// 	it('changes food position', () => {});
	// 	it('draws food with its new position and clears the previous food', () => {});
	// 	it('increases the snake length', () => {});
	// 	it('updates the scoreboard', () => {});

	// 	afterEach(() => {});
	// });

	afterEach(() => {
		jest.runOnlyPendingTimers();
		jest.useRealTimers();
	});
});
