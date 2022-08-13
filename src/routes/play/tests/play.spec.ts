import '@testing-library/jest-dom';
import { act, fireEvent, render, screen } from '@testing-library/svelte';
import { get } from 'svelte/store';
import Play from '../index.svelte';
import { GAME_PIECE_MIN_SIZE, LEVEL, SCOREBOARD } from '$lib/stores';
import { SNAKE_POSITION } from '$lib/snake/store';
import type { SnakePosition } from '$lib/snake';
import { FOOD_POSITION } from '$lib/food/store';
import type { FoodPosition } from '$lib/food/types';

const advanceTimersByTime = async (time: number) => {
	await act(() => jest.advanceTimersByTime(time));
};

describe('checking for default content on initial render', () => {
	const [snakePosition] = get(SNAKE_POSITION);
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

	const getSnakeCurrentPosition = () => get(SNAKE_POSITION);
	const getFoodCurrentPosition = () => get(FOOD_POSITION);

	describe('snake can move', () => {
		it('moves the snake', async () => {
			const snakePosition = getSnakeCurrentPosition();
			await advanceTimersByTime(16);
			expect(getSnakeCurrentPosition()).not.toEqual(snakePosition);
		});

		it('can change snake direction with "WASD" keys', async () => {
			expect(getSnakeCurrentPosition().length).toBe(1);
			expect(getSnakeCurrentPosition()[0].direction).toBe('right');

			fireEvent.keyPress(window, { key: 'W', code: 'KeyW' });
			await advanceTimersByTime(100);
			expect(getSnakeCurrentPosition().length).toBe(2);
			expect(getSnakeCurrentPosition()[0].direction).toBe('up');

			fireEvent.keyPress(window, { key: 'D', code: 'KeyD' });
			await advanceTimersByTime(100);
			expect(getSnakeCurrentPosition().length).toBe(3);
			expect(getSnakeCurrentPosition()[0].direction).toBe('right');

			fireEvent.keyPress(window, { key: 'S', code: 'KeyS' });
			await advanceTimersByTime(100);
			expect(getSnakeCurrentPosition().length).toBe(4);
			expect(getSnakeCurrentPosition()[0].direction).toBe('down');

			fireEvent.keyPress(window, { key: 'A', code: 'KeyA' });
			await advanceTimersByTime(100);
			expect(getSnakeCurrentPosition().length).toBe(5);
			expect(getSnakeCurrentPosition()[0].direction).toBe('left');
		});
	});

	describe('game updates properly when snake eats food', () => {
		let scoreboard: HTMLElement;
		const level = get(LEVEL);
		let previousFoodPosition: FoodPosition;
		let previousSnakePosition: SnakePosition[];

		beforeEach(async () => {
			scoreboard = screen.getByText(0);

			FOOD_POSITION.update(() => {
				return { x: 175, y: 99 };
			});

			previousFoodPosition = getFoodCurrentPosition();
			previousSnakePosition = getSnakeCurrentPosition();
			await advanceTimersByTime(64);
		});

		it('changes food position', () => {
			expect(getFoodCurrentPosition()).not.toEqual(previousFoodPosition);
		});

		it('draws food with its new position and clears the previous food', () => {
			const ctx = (screen.getByTestId('canvas') as HTMLCanvasElement).getContext('2d');
			const foodPosition = getFoodCurrentPosition();
			const radius = get(GAME_PIECE_MIN_SIZE) / 2;

			expect(ctx?.arc).toBeCalledWith(foodPosition.x, foodPosition.y, radius, 0, 2 * Math.PI);
			expect(ctx?.fill).toBeCalledTimes(1);

			expect(ctx?.clearRect).toBeCalledWith(
				previousFoodPosition.x - radius,
				previousFoodPosition.y - radius,
				radius * 2,
				radius * 2
			);
		});

		it('increases the snake length', () => {
			const snakePosition = getSnakeCurrentPosition();

			expect(snakePosition[0].x2 - snakePosition[0].x1).toBe(
				previousSnakePosition[0].x2 - previousSnakePosition[0].x1 + 3
			);
		});

		it('updates the scoreboard', () => {
			expect(scoreboard.textContent).toBe(`${level}`);
		});

		afterEach(() => {
			SCOREBOARD.update(() => 0);
			SNAKE_POSITION.update(() => [
				{
					x1: 130,
					x2: 170,
					y1: 97,
					y2: 103,
					direction: 'right'
				}
			]);
			FOOD_POSITION.update(() => {
				return { x: 50, y: 90 };
			});
		});
	});

	afterEach(() => {
		jest.runOnlyPendingTimers();
		jest.useRealTimers();
	});
});
