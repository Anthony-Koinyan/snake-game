import '@testing-library/jest-dom';

import { FOOD_POSITION } from '$lib/food/store';
import { SNAKE_POSITION, SNAKE_SPEED } from '$lib/snake/store';
import { GAME_PIECE_MIN_SIZE, SCOREBOARD } from '$lib/stores';
import { get } from 'svelte/store';
import { vi } from 'vitest';

import { act, render, screen } from '@testing-library/svelte';

import Play from '../play/index.svelte';

import type { SnakePosition } from '$lib/snake/types';
import type { FoodPosition } from '$lib/food';

const getSnakeCurrentPosition = () => get(SNAKE_POSITION);
const getFoodCurrentPosition = () => get(FOOD_POSITION);
const advanceTimersByTime = async (time: number) => {
	await act(() => vi.advanceTimersByTime(time));
};

beforeAll(() => {
	vi.useFakeTimers();
	vi.spyOn(window, 'requestAnimationFrame');
});

afterAll(() => {
	vi.runOnlyPendingTimers();
	vi.useRealTimers();
});

beforeEach(async () => {
	FOOD_POSITION.update(() => {
		return { x: 175, y: 99 };
	});

	render(Play);
});

afterEach(() => {
	SCOREBOARD.update(() => 0);
	FOOD_POSITION.update(() => ({ x: 50, y: 90 }));
	SNAKE_POSITION.update(() => [
		{
			x1: 130,
			x2: 170,
			y1: 97,
			y2: 103,
			direction: 'right'
		}
	]);
});

describe('checking for default content on initial render', () => {
	let ctx: CanvasRenderingContext2D | null;

	beforeEach(async () => {
		const canvas: HTMLCanvasElement = screen.getByTestId('canvas');
		ctx = canvas.getContext('2d');
	});

	it('draws the snake', () => {
		const [snakePosition] = get(SNAKE_POSITION);

		expect(ctx?.fillRect).toBeCalledWith(
			snakePosition.x1,
			snakePosition.y1,
			snakePosition.x2 - snakePosition.x1,
			snakePosition.y2 - snakePosition.y1
		);
	});

	it('draws food', () => {
		const foodPosition = get(FOOD_POSITION);
		const foodRadius = get(GAME_PIECE_MIN_SIZE) / 2;

		expect(ctx?.arc).toBeCalledWith(foodPosition.x, foodPosition.y, foodRadius, 0, 2 * Math.PI);
		expect(ctx?.fill).toBeCalledTimes(1);
	});

	it('has the scoreboard', () => {
		expect(screen.getByText(0)).toBeInTheDocument();
	});
});

describe('game updates properly when snake eats food', () => {
	let scoreboard: HTMLElement;
	let previousFoodPosition: FoodPosition;
	let previousSnakePosition: SnakePosition[];

	beforeEach(async () => {
		previousFoodPosition = getFoodCurrentPosition();
		previousSnakePosition = getSnakeCurrentPosition();

		scoreboard = screen.getByText(0);
		await advanceTimersByTime(64); // 4 animation frames (16ms per frame)
	});

	it('changes food position', () => {
		expect(getFoodCurrentPosition()).not.toEqual(previousFoodPosition);
	});

	it('draws food with its new position and clears the previous food', async () => {
		const ctx = (screen.getByTestId('canvas') as HTMLCanvasElement).getContext('2d');
		const foodPosition = getFoodCurrentPosition();
		const radius = get(GAME_PIECE_MIN_SIZE) / 2;

		await advanceTimersByTime(16); // 1 animation frame
		expect(ctx?.arc).toBeCalledWith(foodPosition.x, foodPosition.y, radius, 0, 2 * Math.PI);
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

	// TODO: this test expectation should be scoreboard + speed
	it('updates the scoreboard', () => {
		const speed = get(SNAKE_SPEED);
		expect(scoreboard.textContent).toBe(`${speed}`);
	});
});
