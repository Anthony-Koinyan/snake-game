// TODO: move this to test folder

import { render, screen } from '@testing-library/svelte';
import Snake from '../snake';
import type { SnakePosition } from '../snake';
import Canvas from '../canvas/Canvas.svelte';

describe('Instatiates the snake class properly', () => {
	const coords: SnakePosition = {
		x1: 40,
		x2: 190,
		y1: 300,
		y2: 315,
		direction: 'right'
	};

	const match = {
		body: [
			{
				x1: 40,
				x2: 190,
				y1: 300,
				y2: 315,
				direction: 'right'
			}
		]
	};

	it('can be instantiated with a coords object', () => {
		const snake = new Snake(coords, 1, 15);
		expect(snake).toMatchObject(match);
	});

	it('can be instantiated with an array of coords ', () => {
		const snake = new Snake([coords], 1, 15);
		expect(snake).toMatchObject(match);
	});
});

describe('renders snake and clears snake properly', () => {
	let ctx: CanvasRenderingContext2D;
	let coords: SnakePosition[];
	let snake: Snake;

	beforeEach(() => {
		render(Canvas);
		const canvas: HTMLCanvasElement = screen.getByTestId('canvas');
		ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
	});

	it('draws a rectangle for all positions in the body', () => {
		coords = [
			{
				x1: 40,
				x2: 190,
				y1: 300,
				y2: 315,
				direction: 'right'
			}
		];

		snake = new Snake(coords, 1, 15);
		snake.draw(ctx);
		expect(ctx.fillRect).toBeCalledTimes(1);
		expect(ctx.fillRect).toBeCalledWith(
			coords[0].x1,
			coords[0].y1,
			coords[0].x2 - coords[0].x1,
			coords[0].y2 - coords[0].y1
		);
	});

	it("draws rectangle for all coords when snake body's length greater than 1", () => {
		coords = [
			{
				x1: 40,
				x2: 190,
				y1: 300,
				y2: 315,
				direction: 'right'
			},
			{
				x1: 40,
				x2: 190,
				y1: 200,
				y2: 315,
				direction: 'up'
			}
		];

		snake = new Snake(coords, 1, 15);
		snake.draw(ctx);
		expect(ctx.fillRect).toBeCalledTimes(2);
	});

	it('only clears snake if snake has been drawn', () => {
		coords = [
			{
				x1: 40,
				x2: 190,
				y1: 300,
				y2: 315,
				direction: 'right'
			}
		];

		const snake = new Snake(coords, 1, 15);
		snake.clear(ctx);
		expect(ctx.clearRect).not.toBeCalled();

		snake.draw(ctx);
		snake.clear(ctx);

		expect(ctx.clearRect).toBeCalled();
		expect(ctx.clearRect).toBeCalledWith(
			coords[0].x1,
			coords[0].y1,
			coords[0].x2 - coords[0].x1,
			coords[0].y2 - coords[0].y1
		);
	});

	it("clears rectangle for all coords when snake body's length greater than 1", () => {
		coords = [
			{
				x1: 40,
				x2: 190,
				y1: 300,
				y2: 315,
				direction: 'right'
			},
			{
				x1: 40,
				x2: 190,
				y1: 200,
				y2: 315,
				direction: 'up'
			}
		];

		const snake = new Snake(coords, 1, 15);
		snake.draw(ctx);
		snake.clear(ctx);
		expect(ctx.clearRect).toBeCalledTimes(2);
	});
});
