import '@testing-library/jest-dom';
import { act, fireEvent, render, screen } from '@testing-library/svelte';
import { get } from 'svelte/store';
import Play from '../play/index.svelte';
import { GAME_PIECE_MIN_SIZE, SCOREBOARD } from '$lib/stores';
import { SNAKE_POSITION, SNAKE_SPEED } from '$lib/snake/store';
import type { SnakePosition } from '$lib/snake';
import { FOOD_POSITION } from '$lib/food/store';
import type { FoodPosition } from '$lib/food';

const getSnakeCurrentPosition = () => get(SNAKE_POSITION);
const getFoodCurrentPosition = () => get(FOOD_POSITION);
const advanceTimersByTime = async (time: number) => {
	await act(() => jest.advanceTimersByTime(time));
};
const changeSnakeDirection = (direction: SnakePosition['direction']) => {
	if (direction === 'right') {
		fireEvent.keyPress(window, { key: 'D', code: 'KeyD' });
	}

	if (direction === 'left') {
		fireEvent.keyPress(window, { key: 'A', code: 'KeyA' });
	}

	if (direction === 'up') {
		fireEvent.keyPress(window, { key: 'W', code: 'KeyW' });
	}

	if (direction === 'down') {
		fireEvent.keyPress(window, { key: 'S', code: 'KeyS' });
	}
};

beforeAll(() => {
	jest.useFakeTimers();
	jest.spyOn(window, 'requestAnimationFrame');
});

afterAll(() => {
	jest.runOnlyPendingTimers();
	jest.useRealTimers();
});

beforeEach(async () => {
	FOOD_POSITION.update(() => {
		return { x: 175, y: 99 };
	});

	render(Play);
	await act();
	await act();
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
	const [snakePosition] = get(SNAKE_POSITION);
	let ctx: CanvasRenderingContext2D | null;

	beforeEach(async () => {
		const canvas: HTMLCanvasElement = screen.getByTestId('canvas');
		ctx = canvas.getContext('2d');
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
		const foodPosition = get(FOOD_POSITION);
		const foodRadius = get(GAME_PIECE_MIN_SIZE) / 2;

		expect(ctx?.arc).toBeCalledWith(foodPosition.x, foodPosition.y, foodRadius, 0, 2 * Math.PI);
		expect(ctx?.fill).toBeCalledTimes(1);
	});

	it('has the scoreboard', () => {
		expect(screen.getByText(0)).toBeInTheDocument();
	});
});

describe('snake can move', () => {
	it('moves the snake', async () => {
		const snakePosition = getSnakeCurrentPosition();
		await advanceTimersByTime(16); // 1 animation frame
		expect(getSnakeCurrentPosition()).not.toEqual(snakePosition);
	});

	it('has a speed equal to SNAKE_SPEED store', async () => {
		const speed = get(SNAKE_SPEED);
		const previousSnakePosition = getSnakeCurrentPosition();

		await advanceTimersByTime(16); // 1 animation frame
		const currentSnakePosition = getSnakeCurrentPosition();
		expect(currentSnakePosition[0].x2 - previousSnakePosition[0].x2).toBe(speed);
	});

	// TODO: make this work
	// it('can change snake direction with "WASD" keys', async () => {
	// 	expect(getSnakeCurrentPosition().length).toBe(1);
	// 	expect(getSnakeCurrentPosition()[0].direction).toBe('right');

	// 	changeSnakeDirection('up');
	// 	await advanceTimersByTime(100); // 6 animation frames (16ms per frame)
	// 	expect(getSnakeCurrentPosition().length).toBe(2);
	// 	expect(getSnakeCurrentPosition()[0].direction).toBe('up');

	// 	changeSnakeDirection('right');
	// 	await advanceTimersByTime(100); // 6 animation frames (16ms per frame)
	// 	expect(getSnakeCurrentPosition().length).toBe(3);
	// 	expect(getSnakeCurrentPosition()[0].direction).toBe('right');

	// 	changeSnakeDirection('down');
	// 	await advanceTimersByTime(100); // 6 animation frames (16ms per frame)
	// 	expect(getSnakeCurrentPosition().length).toBe(4);
	// 	expect(getSnakeCurrentPosition()[0].direction).toBe('down');

	// 	changeSnakeDirection('left');
	// 	await advanceTimersByTime(100); // 6 animation frames (16ms per frame)
	// 	expect(getSnakeCurrentPosition().length).toBe(5);
	// 	expect(getSnakeCurrentPosition()[0].direction).toBe('left');
	// });

	// TODO: write a test to check that the sanke can eat itself

	// it("doesn't move when it hits itself", async () => {
	// 	fireEvent.keyPress(window, { key: 'W', code: 'KeyW' }); // MOVE SNAKE UP
	// 	await advanceTimersByTime(100); // 6 steps (16ms per frame, 1 frame per step)
	// 	fireEvent.keyPress(window, { key: 'A', code: 'KeyA' }); // MOVE SNAKE LEFT
	// 	await advanceTimersByTime(100); // 6 steps (16ms per frame, 1 frame per step)
	// 	fireEvent.keyPress(window, { key: 'S', code: 'KeyS' }); // MOVE SNAKE DOWN
	// 	await advanceTimersByTime(100); // 6 steps (16ms per frame, 1 frame per step)
	// 	const snakePosition = getSnakeCurrentPosition();
	// 	expect(snakePosition[0].y2 - snakePosition[0].y1).toBe(6);
	// });
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

	it('updates the scoreboard', () => {
		const speed = get(SNAKE_SPEED);
		expect(scoreboard.textContent).toBe(`${speed}`);
	});
});