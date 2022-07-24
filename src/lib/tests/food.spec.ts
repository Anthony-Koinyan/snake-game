import { render, screen } from '@testing-library/svelte';
import { FoodPosition } from './food/types';
import Food from '../food';
import Canvas from '../canvas/Canvas.svelte';
import { GAME_PIECE_MIN_SIZE } from '../stores';
import { get } from 'svelte/store';

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

const foodRadius = get(GAME_PIECE_MIN_SIZE);

it('Instatiates the food class properly', () => {
	const food = new Food(position);
	expect(food).toMatchObject(match);
});

it('returns a copy of position object if food.position is called', () => {
	const food = new Food(position);
	expect(food.position).not.toBe(position);
});

describe('renders and clears food properly', () => {
	let ctx: CanvasRenderingContext2D;
	let position: FoodPosition[];
	let food: Food;

	beforeEach(() => {
		render(Canvas, {
			props: {
				container: document.createElement('section')
			}
		});
		const canvas: HTMLCanvasElement = screen.getByTestId('canvas');
		ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
	});

	it('draws a circle at position of food on the canvas', () => {
		food = new Food(position);
		food.draw(ctx);
		expect(ctx?.arc).toBeCalledWith(foodPosition.x, foodPosition.y, foodRadius, 0, 2 * Math.PI);
		expect(ctx.fill).toBeCalledTimes(1);
	});

	it('only clears Food if Food has been drawn', () => {
		const food = new Food(position);

		food.clear(ctx);
		expect(ctx.clearRect).not.toBeCalled();

		food.draw(ctx);
		food.clear(ctx);

		expect(ctx.clearRect).toBeCalledWith(
			foodPosition.x - foodRadius,
			foodPosition.y - foodRadius,
			foodRadius * 2,
			foodRadius * 2
		);
	});
});
