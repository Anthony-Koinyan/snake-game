// TODO: move this to test folder

import { render, screen } from '@testing-library/svelte';
import { get } from 'svelte/store';
import Snake from '../snake';
import type { SnakePosition } from '../snake';
import { SNAKE_SPEED } from '../snake/store';
import Canvas from '../canvas/Canvas.svelte';
import { GAME_PIECE_MIN_SIZE } from '../stores';

describe('Instatiates the snake class properly', () => {
	const position: SnakePosition = {
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

	it('can be instantiated with a position object', () => {
		const snake = new Snake(position, 1, 15);
		expect(snake).toMatchObject(match);
	});

	it('can be instantiated with an array of position ', () => {
		const snake = new Snake([position], 1, 15);
		expect(snake).toMatchObject(match);
	});
});

describe('renders snake and clears snake properly', () => {
	let ctx: CanvasRenderingContext2D;
	let position: SnakePosition[];
	let snake: Snake;

	beforeEach(() => {
		render(Canvas, {
			props: {
				container: document.createElement('section')
			}
		});
		const canvas: HTMLCanvasElement = screen.getByTestId('canvas');
		ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
	});

	it('draws a rectangle for all positions in the body', () => {
		position = [
			{
				x1: 40,
				x2: 190,
				y1: 300,
				y2: 315,
				direction: 'right'
			}
		];

		snake = new Snake(position, 1, 15);
		snake.draw(ctx);
		expect(ctx.fillRect).toBeCalledTimes(1);
		expect(ctx.fillRect).toBeCalledWith(
			position[0].x1,
			position[0].y1,
			position[0].x2 - position[0].x1,
			position[0].y2 - position[0].y1
		);
	});

	it("draws rectangle for all position when snake body's length greater than 1", () => {
		position = [
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

		snake = new Snake(position, 1, 15);
		snake.draw(ctx);
		expect(ctx.fillRect).toBeCalledTimes(2);
	});

	it('only clears snake if snake has been drawn', () => {
		position = [
			{
				x1: 40,
				x2: 190,
				y1: 300,
				y2: 315,
				direction: 'right'
			}
		];

		const snake = new Snake(position, 1, 15);
		snake.clear(ctx);
		expect(ctx.clearRect).not.toBeCalled();

		snake.draw(ctx);
		snake.clear(ctx);

		expect(ctx.clearRect).toBeCalled();
	});

	it("clears rectangle for all position when snake body's length greater than 1", () => {
		position = [
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

		const snake = new Snake(position, 1, 15);
		snake.draw(ctx);
		snake.clear(ctx);
		expect(ctx.clearRect).toBeCalledTimes(2);
	});
});

describe('the snake can move', () => {
	let ctx: CanvasRenderingContext2D;
	let speed: number;
	let thickness: number;
	let position: SnakePosition[];

	beforeAll(() => {
		speed = get(SNAKE_SPEED);
		thickness = get(GAME_PIECE_MIN_SIZE);
	});

	beforeEach(() => {
		render(Canvas, {
			props: {
				container: document.createElement('section')
			}
		});
		const canvas: HTMLCanvasElement = screen.getByTestId('canvas');
		ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
	});

	it("doesn't move the snake if it has not been drawn", () => {
		position = [
			{
				x1: 40,
				x2: 190,
				y1: 300,
				y2: 300 + thickness,
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

		const snake = new Snake(position, speed, thickness);
		snake.move();
		expect(snake.head).toEqual(position[0]);
		expect(snake.tail).toEqual(position[1]);
	});

	it('moves the snake right if the head and tail directions are right', () => {
		position = [
			{
				x1: 40,
				x2: 190,
				y1: 300,
				y2: 300 + thickness,
				direction: 'right'
			}
		];

		const snake = new Snake(position, speed, thickness);
		snake.draw(ctx);
		snake.move();
		expect(snake.head.x1).toBe(position[0].x1 + speed);
		expect(snake.tail.x2).toBe(position[0].x2 + speed);
		expect(snake.head.y1).toBe(position[0].y1);
		expect(snake.head.y2).toBe(position[0].y2);
	});

	it('moves the snake left if the head and tail directions are left', () => {
		position = [
			{
				x1: 40,
				x2: 190,
				y1: 300,
				y2: 300 + thickness,
				direction: 'left'
			}
		];

		const snake = new Snake(position, speed, thickness);
		snake.draw(ctx);
		snake.move();

		expect(snake.head.x1).toBe(position[0].x1 - speed);
		expect(snake.head.x2).toBe(position[0].x2 - speed);
		expect(snake.head.y1).toBe(position[0].y1);
		expect(snake.head.y2).toBe(position[0].y2);
	});

	it('moves the snake up if the head and tail directions are up', () => {
		position = [
			{
				x1: 40,
				x2: 40 + thickness,
				y1: 40,
				y2: 190,
				direction: 'up'
			}
		];

		const snake = new Snake(position, speed, thickness);
		snake.draw(ctx);
		snake.move();

		expect(snake.head.x1).toBe(position[0].x1);
		expect(snake.head.x2).toBe(position[0].x2);
		expect(snake.head.y1).toBe(position[0].y1 - speed);
		expect(snake.head.y2).toBe(position[0].y2 - speed);
	});

	it('moves the snake down if the head and tail directions are down', () => {
		position = [
			{
				x1: 40,
				x2: 40 + thickness,
				y1: 40,
				y2: 190,
				direction: 'down'
			}
		];

		const snake = new Snake(position, speed, thickness);
		snake.draw(ctx);
		snake.move();

		expect(snake.head.x1).toBe(position[0].x1);
		expect(snake.head.x2).toBe(position[0].x2);
		expect(snake.head.y1).toBe(position[0].y1 + speed);
		expect(snake.head.y2).toBe(position[0].y2 + speed);
	});

	it('moves snake head right and tail up if snake head direction is right and tail direction is up', () => {
		position = [
			{
				x1: 40,
				x2: 190,
				y1: 300,
				y2: 300 + thickness,
				direction: 'right'
			},
			{
				x1: 40,
				x2: 40 + thickness,
				y1: 300,
				y2: 315,
				direction: 'up'
			}
		];
		const snake = new Snake(position, speed, thickness);
		snake.draw(ctx);
		snake.move();
		expect(snake.head.x1).toBe(position[0].x1);
		expect(snake.head.x2).toBe(position[0].x2 + speed);
		expect(snake.head.y1).toBe(position[0].y1);
		expect(snake.head.y2).toBe(position[0].y2);

		expect(snake.tail.x1).toBe(position[position.length - 1].x1);
		expect(snake.tail.x2).toBe(position[position.length - 1].x2);
		expect(snake.tail.y1).toBe(position[position.length - 1].y1);
		expect(snake.tail.y2).toBe(position[position.length - 1].y2 - speed);
	});
});

describe("snake's direction can be changed to up or down", () => {
	let ctx: CanvasRenderingContext2D;
	let speed: number;
	let thickness: number;
	let snake: Snake | null;
	let position: SnakePosition[] | [];

	beforeEach(() => {
		speed = get(SNAKE_SPEED);
		thickness = get(GAME_PIECE_MIN_SIZE);

		render(Canvas, {
			props: {
				container: document.createElement('section')
			}
		});

		const canvas: HTMLCanvasElement = screen.getByTestId('canvas');
		ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
		snake = null;
		position = [];
	});

	it('adds new snake head with direction up and new position if snake.changeDirection is called with up and old direction is right', () => {
		position = [
			{
				x1: 40,
				x2: 190,
				y1: 300,
				y2: 300 + thickness,
				direction: 'right'
			}
		];

		snake = new Snake(position, speed, thickness);
		snake.draw(ctx);
		snake.changeDirection('up');

		expect(snake.position.length).toBe(2);
		expect(snake.head.direction).toBe('up');
		expect(snake.head.x1).toBe(position[0].x2 - thickness);
		expect(snake.head.x2).toBe(position[0].x2);
		expect(snake.head.y1).toBe(position[0].y1);
		expect(snake.head.y2).toBe(position[0].y2);
	});

	it('adds new snake head with direction up and new position if snake.changeDirection is called with up and old direction is left', () => {
		position = [
			{
				x1: 40,
				x2: 190,
				y1: 300,
				y2: 300 + thickness,
				direction: 'left'
			}
		];

		snake = new Snake(position, speed, thickness);
		snake.draw(ctx);
		snake.changeDirection('up');

		expect(snake.position.length).toBe(2);
		expect(snake.head.direction).toBe('up');
		expect(snake.head.x1).toBe(position[0].x1);
		expect(snake.head.x2).toBe(position[0].x1 + thickness);
		expect(snake.head.y1).toBe(position[0].y1);
		expect(snake.head.y2).toBe(position[0].y2);
	});

	it('adds new snake head with direction down and new position if snake.changeDirection is called with down and old direction is right', () => {
		position = [
			{
				x1: 40,
				x2: 190,
				y1: 300,
				y2: 300 + thickness,
				direction: 'right'
			}
		];

		snake = new Snake(position, speed, thickness);
		snake.draw(ctx);
		snake.changeDirection('down');

		expect(snake.position.length).toBe(2);
		expect(snake.head.direction).toBe('down');
		expect(snake.head.x1).toBe(position[0].x2 - thickness);
		expect(snake.head.x2).toBe(position[0].x2);
		expect(snake.head.y1).toBe(position[0].y1);
		expect(snake.head.y2).toBe(position[0].y2);
	});

	it('adds new snake head with direction down and new position if snake.changeDirection is called with down and old direction is left', () => {
		position = [
			{
				x1: 40,
				x2: 190,
				y1: 300,
				y2: 300 + thickness,
				direction: 'left'
			}
		];

		snake = new Snake(position, speed, thickness);
		snake.draw(ctx);
		snake.changeDirection('down');

		expect(snake.position.length).toBe(2);
		expect(snake.head.direction).toBe('down');
		expect(snake.head.x1).toBe(position[0].x1);
		expect(snake.head.x2).toBe(position[0].x1 + thickness);
		expect(snake.head.y1).toBe(position[0].y1);
		expect(snake.head.y2).toBe(position[0].y2);
	});

	it('adds new snake head with direction left and new position if snake.changeDirection is called with left and old direction is up', () => {
		position = [
			{
				x1: 40,
				x2: 40 + thickness,
				y1: 150,
				y2: 300,
				direction: 'up'
			}
		];

		snake = new Snake(position, speed, thickness);
		snake.draw(ctx);
		snake.changeDirection('left');

		expect(snake.position.length).toBe(2);
		expect(snake.head.direction).toBe('left');
		expect(snake.head.x1).toBe(position[0].x1);
		expect(snake.head.x2).toBe(position[0].x2);
		expect(snake.head.y1).toBe(position[0].y1);
		expect(snake.head.y2).toBe(position[0].y1 + thickness);
	});

	it('adds new snake head with direction left and new position if snake.changeDirection is called with left and old direction is down', () => {
		position = [
			{
				x1: 40,
				x2: 40 + thickness,
				y1: 150,
				y2: 300,
				direction: 'down'
			}
		];

		snake = new Snake(position, speed, thickness);
		snake.draw(ctx);
		snake.changeDirection('left');

		expect(snake.position.length).toBe(2);
		expect(snake.head.direction).toBe('left');
		expect(snake.head.x1).toBe(position[0].x1);
		expect(snake.head.x2).toBe(position[0].x2);
		expect(snake.head.y1).toBe(position[0].y2 - thickness);
		expect(snake.head.y2).toBe(position[0].y2);
	});

	it('adds new snake head with direction right and new position if snake.changeDirection is called with right and old direction is up', () => {
		position = [
			{
				x1: 40,
				x2: 40 + thickness,
				y1: 150,
				y2: 300,
				direction: 'up'
			}
		];

		snake = new Snake(position, speed, thickness);
		snake.draw(ctx);
		snake.changeDirection('right');

		expect(snake.position.length).toBe(2);
		expect(snake.head.direction).toBe('right');
		expect(snake.head.x1).toBe(position[0].x1);
		expect(snake.head.x2).toBe(position[0].x2);
		expect(snake.head.y1).toBe(position[0].y1);
		expect(snake.head.y2).toBe(position[0].y1 + thickness);
	});

	it('adds new snake head with direction right and new position if snake.changeDirection is called with right and old direction is down', () => {
		position = [
			{
				x1: 40,
				x2: 40 + thickness,
				y1: 150,
				y2: 300,
				direction: 'down'
			}
		];

		snake = new Snake(position, speed, thickness);
		snake.draw(ctx);
		snake.changeDirection('right');

		expect(snake.position.length).toBe(2);
		expect(snake.head.direction).toBe('right');
		expect(snake.head.x1).toBe(position[0].x1);
		expect(snake.head.x2).toBe(position[0].x2);
		expect(snake.head.y1).toBe(position[0].y2 - thickness);
		expect(snake.head.y2).toBe(position[0].y2);
	});

	it("doesn't change the snake's direction if the arrow key pressed direction is the same as the snake's direction", () => {
		position = [
			{
				x1: 40,
				x2: 190,
				y1: 300,
				y2: 300 + thickness,
				direction: 'left'
			}
		];

		snake = new Snake(position, speed, thickness);
		snake.draw(ctx);
		snake.changeDirection('left');

		expect(snake.position.length).toBe(1);
		expect(snake.head.direction).toBe('left');
		expect(snake.head.x1).toBe(position[0].x1);
		expect(snake.head.x2).toBe(position[0].x2);
		expect(snake.head.y1).toBe(position[0].y1);
		expect(snake.head.y2).toBe(position[0].y2);

		position[0].direction = 'right';
		snake = new Snake(position, speed, thickness);
		snake.draw(ctx);
		snake.changeDirection('right');

		expect(snake.position.length).toBe(1);
		expect(snake.head.direction).toBe('right');
		expect(snake.head.x1).toBe(position[0].x1);
		expect(snake.head.x2).toBe(position[0].x2);
		expect(snake.head.y1).toBe(position[0].y1);
		expect(snake.head.y2).toBe(position[0].y2);

		position = [
			{
				x1: 40,
				x2: 40 + thickness,
				y1: 150,
				y2: 300,
				direction: 'up'
			}
		];
		snake = new Snake(position, speed, thickness);
		snake.draw(ctx);
		snake.changeDirection('up');

		expect(snake.position.length).toBe(1);
		expect(snake.head.direction).toBe('up');
		expect(snake.head.x1).toBe(position[0].x1);
		expect(snake.head.x2).toBe(position[0].x2);
		expect(snake.head.y1).toBe(position[0].y1);
		expect(snake.head.y2).toBe(position[0].y2);

		position[0].direction = 'down';
		snake = new Snake(position, speed, thickness);
		snake.draw(ctx);
		snake.changeDirection('down');

		expect(snake.position.length).toBe(1);
		expect(snake.head.direction).toBe('down');
		expect(snake.head.x1).toBe(position[0].x1);
		expect(snake.head.x2).toBe(position[0].x2);
		expect(snake.head.y1).toBe(position[0].y1);
		expect(snake.head.y2).toBe(position[0].y2);
	});

	it("doesn't change direction if the length of the head (x2 - x1 if direction is left or right, y2 - y1 if direction is up or down) is less that thickness", () => {
		position = [
			{
				x1: 150,
				x2: 151,
				y1: 300,
				y2: 300 + thickness,
				direction: 'left'
			},
			{
				x1: 151,
				x2: 151 + thickness,
				y1: 300,
				y2: 380,
				direction: 'up'
			}
		];

		snake = new Snake(position, speed, thickness);
		snake.draw(ctx);
		snake.changeDirection('up');

		expect(snake.position.length).toBe(2);
		expect(snake.head.direction).toBe('left');
		expect(snake.head.x1).toBe(position[0].x1);
		expect(snake.head.x2).toBe(position[0].x2);
		expect(snake.head.y1).toBe(position[0].y1);
		expect(snake.head.y2).toBe(position[0].y2);

		snake.changeDirection('down');

		expect(snake.position.length).toBe(2);
		expect(snake.head.direction).toBe('left');
		expect(snake.head.x1).toBe(position[0].x1);
		expect(snake.head.x2).toBe(position[0].x2);
		expect(snake.head.y1).toBe(position[0].y1);
		expect(snake.head.y2).toBe(position[0].y2);

		position = [
			{
				x1: 151 + thickness,
				x2: 151 + thickness + 1,
				y1: 300,
				y2: 300 + thickness,

				direction: 'right'
			},
			{
				x1: 151,
				x2: 151 + thickness,
				y1: 300,
				y2: 380,
				direction: 'up'
			}
		];
		snake = new Snake(position, speed, thickness);
		snake = new Snake(position, speed, thickness);
		snake.draw(ctx);
		snake.changeDirection('up');

		expect(snake.position.length).toBe(2);
		expect(snake.head.direction).toBe('right');
		expect(snake.head.x1).toBe(position[0].x1);
		expect(snake.head.x2).toBe(position[0].x2);
		expect(snake.head.y1).toBe(position[0].y1);
		expect(snake.head.y2).toBe(position[0].y2);

		snake.changeDirection('down');

		expect(snake.position.length).toBe(2);
		expect(snake.head.direction).toBe('right');
		expect(snake.head.x1).toBe(position[0].x1);
		expect(snake.head.x2).toBe(position[0].x2);
		expect(snake.head.y1).toBe(position[0].y1);
		expect(snake.head.y2).toBe(position[0].y2);

		position = [
			{
				x1: 150,
				x2: 150 + thickness,
				y1: 299,
				y2: 300,
				direction: 'up'
			},
			{
				x1: 150,
				x2: 300,
				y1: 300,
				y2: 300 + thickness,
				direction: 'left'
			}
		];
		snake = new Snake(position, speed, thickness);
		snake.draw(ctx);

		snake.changeDirection('left');

		expect(snake.position.length).toBe(2);
		expect(snake.head.direction).toBe('up');
		expect(snake.head.x1).toBe(position[0].x1);
		expect(snake.head.x2).toBe(position[0].x2);
		expect(snake.head.y1).toBe(position[0].y1);
		expect(snake.head.y2).toBe(position[0].y2);

		snake.changeDirection('right');

		expect(snake.position.length).toBe(2);
		expect(snake.head.direction).toBe('up');
		expect(snake.head.x1).toBe(position[0].x1);
		expect(snake.head.x2).toBe(position[0].x2);
		expect(snake.head.y1).toBe(position[0].y1);
		expect(snake.head.y2).toBe(position[0].y2);

		position = [
			{
				x1: 150,
				x2: 150 + thickness,
				y1: 300 + thickness,
				y2: 300 + thickness + 1,
				direction: 'down'
			},
			{
				x1: 150,
				x2: 300,
				y1: 300,
				y2: 300 + thickness,
				direction: 'left'
			}
		];

		snake = new Snake(position, speed, thickness);
		snake.draw(ctx);

		snake.changeDirection('left');

		expect(snake.position.length).toBe(2);
		expect(snake.head.direction).toBe('down');
		expect(snake.head.x1).toBe(position[0].x1);
		expect(snake.head.x2).toBe(position[0].x2);
		expect(snake.head.y1).toBe(position[0].y1);
		expect(snake.head.y2).toBe(position[0].y2);

		snake.changeDirection('right');

		expect(snake.position.length).toBe(2);
		expect(snake.head.direction).toBe('down');
		expect(snake.head.x1).toBe(position[0].x1);
		expect(snake.head.x2).toBe(position[0].x2);
		expect(snake.head.y1).toBe(position[0].y1);
		expect(snake.head.y2).toBe(position[0].y2);
	});
});
