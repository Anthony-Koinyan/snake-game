import '@testing-library/jest-dom';

import { vi } from 'vitest';

import { act, render, screen } from '@testing-library/svelte';

import Game from '../routes/play/index.svelte';
import moveSnakeBySteps from './utils/moveSnakeBySteps';
import {
	getFoodPosition,
	getGamePieceSize,
	getScore,
	getSnakePosition,
	getSnakeSpeed,
	setFoodPosition,
	setScore,
	setSnakePosition
} from './utils/storeIO';

beforeAll(() => {
	vi.useFakeTimers();
});

afterAll(() => {
	vi.runOnlyPendingTimers();
	vi.useRealTimers();
});

describe('checking for default content on initial render', () => {
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null;

	beforeEach(() => {
		render(Game);
		canvas = screen.getByTestId('canvas');
		ctx = canvas.getContext('2d');
	});

	test('draws the snake', () => {
		const [snakePosition] = getSnakePosition();

		expect(ctx?.fillRect).toBeCalledWith(
			snakePosition.x1,
			snakePosition.y1,
			snakePosition.x2 - snakePosition.x1,
			snakePosition.y2 - snakePosition.y1
		);
	});

	test('draws food', () => {
		const foodPosition = getFoodPosition();
		const foodRadius = getGamePieceSize() / 2;

		expect(ctx?.arc).toBeCalledWith(foodPosition.x, foodPosition.y, foodRadius, 0, 2 * Math.PI);
		expect(ctx?.fill).toBeCalledTimes(1);
	});

	test('has the scoreboard', () => {
		expect(screen.getByText(0)).toBeInTheDocument();
	});
});

describe('game updates properly when snake eats food', () => {
	beforeEach(() => {
		setScore(0);
		setFoodPosition({ x: 175, y: 99 });
		setSnakePosition([{ x1: 130, x2: 170, y1: 97, y2: 103, direction: 'right' }]);
	});

	afterAll(() => {
		setFoodPosition({ x: 50, y: 90 });
		setSnakePosition([{ x1: 130, x2: 170, y1: 97, y2: 103, direction: 'right' }]);
	});

	test('changes food position', async () => {
		const previousFoodPosition = getFoodPosition();

		render(Game);
		await act();
		moveSnakeBySteps(4);
		await act();

		expect(getFoodPosition()).not.toEqual(previousFoodPosition);
	});

	test('draws food with its new position and clears the previous food', async () => {
		const previousFoodPosition = getFoodPosition();

		render(Game);
		await act();
		moveSnakeBySteps(4);
		await act();

		const ctx = (screen.getByTestId('canvas') as HTMLCanvasElement).getContext('2d');
		const foodPosition = getFoodPosition();
		const radius = getGamePieceSize() / 2;

		expect(ctx?.arc).toBeCalledWith(foodPosition.x, foodPosition.y, radius, 0, 2 * Math.PI);
		expect(ctx?.clearRect).toHaveBeenCalledWith(
			previousFoodPosition.x - radius,
			previousFoodPosition.y - radius,
			radius * 2,
			radius * 2
		);
	});

	test('increases the snake length', async () => {
		const previousSnakePosition = getSnakePosition();

		render(Game);
		await act();
		moveSnakeBySteps(4);
		await act();

		const snakePosition = getSnakePosition();
		expect(snakePosition[0].x2 - snakePosition[0].x1).toBe(
			previousSnakePosition[0].x2 - previousSnakePosition[0].x1 + 3
		);
	});

	test('updates the scoreboard', async () => {
		const previousScore = getScore();
		const { getByText } = render(Game);
		const scoreboard = getByText(0);

		await act();
		moveSnakeBySteps(4);
		await act();

		expect(scoreboard.textContent).toBe(`${getSnakeSpeed() + previousScore}`);
	});
});
