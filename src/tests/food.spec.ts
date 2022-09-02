import Canvas from '$lib/canvas/Canvas.svelte';
import { GAME_PIECE_MIN_SIZE } from '$lib/stores';
import { get } from 'svelte/store';

import { render, screen } from '@testing-library/svelte';

import Food from '../lib/food';

import type { FoodPosition } from '$lib/food';
const position: FoodPosition = {
	x: 300,
	y: 200
};

const match = {
	position: {
		x: 300,
		y: 200
	}
};

const radius = get(GAME_PIECE_MIN_SIZE) / 2;

it('Instatiates the food class properly', () => {
	const food = new Food(position, radius);
	expect(food).toMatchObject(match);
});

it('returns a copy of position object if food.position is called', () => {
	const food = new Food(position, radius);
	expect(food.position).not.toBe(position);
});

describe('renders and clears food properly', () => {
	let ctx: CanvasRenderingContext2D;
	let food: Food;

	beforeEach(() => {
		render(Canvas);
		const container = document.createElement('section');
		container.style.width = '600px';
		container.style.height = '400px';
		const canvas: HTMLCanvasElement = screen.getByTestId('canvas');
		container.appendChild(canvas);
		ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
	});

	it('draws a circle at position of food on the canvas', () => {
		food = new Food(position, radius);
		food.draw(ctx);
		expect(ctx?.arc).toBeCalledWith(position.x, position.y, radius, 0, 2 * Math.PI);
		expect(ctx.fill).toBeCalledTimes(1);
	});

	it('only clears Food if Food has been drawn', () => {
		const food = new Food(position, radius);

		food.clear(ctx);
		expect(ctx.clearRect).not.toBeCalled();

		food.draw(ctx);
		food.clear(ctx);

		expect(ctx.clearRect).toBeCalledWith(
			position.x - radius,
			position.y - radius,
			radius * 2,
			radius * 2
		);
	});
});
