import '@testing-library/jest-dom';

import { vi } from 'vitest';

import { act, render } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';

import Game from '../routes/play/+page.svelte';
import createSnake from './utils/createSnake';
import moveSnakeBySteps from './utils/moveSnakeBySteps';
import {
	getCanvasBoundaryDimensions,
	getGameDifficulty,
	getGamePieceSize,
	getSnakePosition,
	setGameDifficulty,
	setGamePieceSize,
	setSnakePosition
} from './utils/storeIO';

import type { Difficulty } from './utils/storeIO';
import type { SnakePosition, SnakeDirection } from '$lib/types';

beforeAll(() => {
	vi.useFakeTimers();
});

afterAll(() => {
	vi.runOnlyPendingTimers();
	vi.useRealTimers();
});

let initialSnakePosition: SnakePosition[];
let initialGameDifficulty: Difficulty;
let initialGamePieceSize: number;

beforeEach(() => {
	initialSnakePosition = getSnakePosition();
	initialGameDifficulty = getGameDifficulty();
	initialGamePieceSize = getGamePieceSize();
});

afterEach(() => {
	setSnakePosition(initialSnakePosition);
	setGameDifficulty(initialGameDifficulty);
	setGamePieceSize(initialGamePieceSize);
});

describe('the snake can move in different shapes', () => {
	test.each([
		['right', [{ x1: 51, x2: 71, y1: 50, y2: 70, direction: 'right' }]],
		['left', [{ x1: 29, x2: 49, y1: 50, y2: 70, direction: 'left' }]],
		['up', [{ x1: 50, x2: 70, y1: 29, y2: 49, direction: 'up' }]],
		['down', [{ x1: 50, x2: 70, y1: 51, y2: 71, direction: 'down' }]]
	])(
		"when the snake is straight and it's direction is '%s' its body is '%o' after it moves",
		async (direction: string, position: object) => {
			setSnakePosition(
				createSnake(direction as SnakeDirection, {
					length: 20,
					thickness: 20,
					startPoint: { x: 50, y: 50 }
				})
			);
			setGamePieceSize(20);
			render(Game);
			await act();
			expect(getSnakePosition()).toEqual(position);
		}
	);

	test.each([
		[
			'right',
			'up',
			[],
			[
				{ x1: 200, x2: 251, y1: 160, y2: 170, direction: 'right' },
				{ x1: 200, x2: 210, y1: 160, y2: 199, direction: 'up' }
			]
		],
		[
			'up',
			'left',
			['left', 'up', 'right', 'up', 'right', 'down', 'right', 'down'],
			[
				{ x1: 240, x2: 250, y1: 159, y2: 210, direction: 'up' },
				{ x1: 240, x2: 290, y1: 200, y2: 210, direction: 'left' },
				{ x1: 280, x2: 290, y1: 200, y2: 250, direction: 'up' },
				{ x1: 240, x2: 290, y1: 240, y2: 250, direction: 'right' },
				{ x1: 240, x2: 250, y1: 240, y2: 290, direction: 'up' },
				{ x1: 200, x2: 250, y1: 280, y2: 290, direction: 'right' },
				{ x1: 200, x2: 210, y1: 240, y2: 290, direction: 'down' },
				{ x1: 160, x2: 210, y1: 240, y2: 250, direction: 'right' },
				{ x1: 160, x2: 170, y1: 200, y2: 250, direction: 'down' },
				{ x1: 160, x2: 199, y1: 200, y2: 210, direction: 'left' }
			]
		]
	])(
		`the snake can move in different shapes; 
		when it's head and tail directions are %s and %s and it's body directions are %o, it's positions are %o`,
		async (headDirection, tailDirection, bodyDirections, expectedPosition) => {
			setSnakePosition(
				createSnake(headDirection as SnakeDirection, {
					body: bodyDirections as SnakeDirection[],
					tailDirection: tailDirection as SnakeDirection,
					length: 40,
					thickness: 10,
					startPoint: { x: 200, y: 200 }
				})
			);
			setGamePieceSize(10);
			render(Game);
			await act();
			expect(getSnakePosition()).toEqual(expectedPosition);
		}
	);

	test.each([
		['Baby Steps', 1, [{ x1: 51, x2: 71, y1: 50, y2: 70, direction: 'right' }]],
		['Nightmare', 5, [{ x1: 55, x2: 75, y1: 50, y2: 70, direction: 'right' }]],
		['Cry To Your Mommy', 8, [{ x1: 58, x2: 78, y1: 50, y2: 70, direction: 'right' }]]
	])(
		'the snake speed depends on the difficulty; when the difficulty is "%s" the speed is "%i" and the snake position is %o after moving',

		async (difficulty, speed, expectedPosition) => {
			setGameDifficulty(difficulty as Difficulty);
			const initialSnakePosition = createSnake('right', {
				length: 20,
				thickness: 20,
				startPoint: { x: 50, y: 50 }
			});

			setGamePieceSize(20);
			setSnakePosition(initialSnakePosition);
			render(Game);
			await act();

			const currentSnakePosition = getSnakePosition();
			expect(currentSnakePosition[0].x1 - initialSnakePosition[0].x1).toBe(speed);
			expect(currentSnakePosition).toEqual(expectedPosition);
		}
	);

	test('the snake becomes straight after moving for sometime from starting shape any shape', async () => {
		setSnakePosition(
			createSnake('right', {
				body: ['up'],
				tailDirection: 'left',
				length: 10,
				thickness: 2,
				startPoint: { x: 30, y: 30 }
			})
		);

		setGamePieceSize(2);
		setGameDifficulty('Baby Steps');
		render(Game);
		await act();
		moveSnakeBySteps(24);

		const snakePosition = getSnakePosition();
		expect(snakePosition).toHaveLength(1);
		expect(snakePosition[0]).toEqual({
			x1: 27,
			x2: 57,
			y1: 20,
			y2: 22,
			direction: 'right'
		});
	});

	test('the snake can move through the canvas boundary', async () => {
		const canvasBoundaryDimensions = getCanvasBoundaryDimensions();
		setSnakePosition(
			createSnake('right', {
				length: 20,
				thickness: 6,
				startPoint: { x: canvasBoundaryDimensions.horizontal - 20, y: 50 }
			})
		);
		setGamePieceSize(6);
		render(Game);
		await act();

		const snakePosition = getSnakePosition();
		expect(snakePosition).toHaveLength(2);
		expect(snakePosition).toEqual([
			{ x1: 0, x2: 1, y1: 50, y2: 56, direction: 'right' },
			{
				x1: canvasBoundaryDimensions.horizontal - 19,
				x2: canvasBoundaryDimensions.horizontal,
				y1: 50,
				y2: 56,
				direction: 'right'
			}
		]);
	});
});

function setupUserEvents(setup: () => void) {
	setup();
	return {
		user: userEvent.setup({
			advanceTimers(delay) {
				vi.advanceTimersByTime(delay);
			}
		}),
		...render(Game)
	};
}

describe('the snake can change directions', () => {
	test.each([
		[
			'right',
			'up',
			[
				{ x1: 79, x2: 91, y1: 50, y2: 62, direction: 'up' },
				{ x1: 51, x2: 91, y1: 50, y2: 62, direction: 'right' }
			]
		],
		[
			'right',
			'down',
			[
				{ x1: 79, x2: 91, y1: 50, y2: 62, direction: 'down' },
				{ x1: 51, x2: 91, y1: 50, y2: 62, direction: 'right' }
			]
		],
		[
			'up',
			'right',
			[
				{ x1: 50, x2: 62, y1: 9, y2: 21, direction: 'right' },
				{ x1: 50, x2: 62, y1: 9, y2: 49, direction: 'up' }
			]
		],

		[
			'up',
			'left',
			[
				{ x1: 50, x2: 62, y1: 9, y2: 21, direction: 'left' },
				{ x1: 50, x2: 62, y1: 9, y2: 49, direction: 'up' }
			]
		]
	])(
		'the snakes direction changes from %s to %s when %s key is pressed',
		async (intialDirection, newDirection, expectedPosition) => {
			const { user } = setupUserEvents(() =>
				setSnakePosition(
					createSnake(intialDirection as SnakeDirection, {
						length: 40,
						thickness: 12,
						startPoint: { x: 50, y: 50 }
					})
				)
			);

			await act();

			await user.keyboard(
				`{Arrow${newDirection.charAt(0).toUpperCase() + newDirection.substring(1)}}`
			);

			const snakePosition = getSnakePosition();
			expect(snakePosition).toHaveLength(2);
			expect(snakePosition[0].direction).toBe(newDirection);
			expect(snakePosition).toEqual(expectedPosition);
		}
	);
});

describe('the game stops stops running', () => {
	test('the game stops when the snake bites itself', async () => {
		const { user } = setupUserEvents(() => {
			setSnakePosition(
				createSnake('right', {
					length: 150,
					thickness: 12,
					startPoint: { x: 50, y: 50 }
				})
			);
			setGamePieceSize(12);
		});

		await act();

		await user.keyboard('[ArrowUp]');
		moveSnakeBySteps(13);

		await user.keyboard('[ArrowLeft]');
		moveSnakeBySteps(13);

		await user.keyboard('[ArrowDown]');
		moveSnakeBySteps(2);

		let snakePosition = getSnakePosition();
		let head = snakePosition[0];
		expect(head.y2 - head.y1).toBe(13);

		moveSnakeBySteps(12);
		snakePosition = getSnakePosition();
		head = snakePosition[0];
		expect(head.y2 - head.y1).toBe(13);
	});
});
