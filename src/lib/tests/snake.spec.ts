import { render, screen } from '@testing-library/svelte';
import Snake from '../snake';
import type { SnakePosition } from '../snake';
import Canvas from '../canvas/Canvas.svelte';
import createSnake from './createSnake';

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

	it('can be instantiated with an array of positions', () => {
		const snake = new Snake([position], 1, 15);
		expect(snake).toMatchObject(match);
	});
});

let ctx: CanvasRenderingContext2D;

beforeEach(() => {
	render(Canvas, {
		props: {
			container: document.createElement('section')
		}
	});

	ctx = (screen.getByTestId('canvas') as HTMLCanvasElement).getContext(
		'2d'
	) as CanvasRenderingContext2D;
});

const moveSnakeBySteps = (snake: Snake, steps: number) => {
	for (let step = 0; step < steps; step++) {
		snake.move();
	}
};

describe('renders snake and clears snake properly', () => {
	it('draws a rectangle for all positions in the body', () => {
		const { snake, createdWith } = createSnake('right');
		snake.draw(ctx);
		expect(ctx.fillRect).toBeCalledTimes(1);
		expect(ctx.fillRect).toBeCalledWith(
			createdWith[0].x1,
			createdWith[0].y1,
			createdWith[0].x2 - createdWith[0].x1,
			createdWith[0].y2 - createdWith[0].y1
		);
	});

	it("draws rectangle for all position when snake body's length greater than 1", () => {
		const { snake, createdWith } = createSnake('right', 'up');

		snake.draw(ctx);
		expect(ctx.fillRect).toBeCalledTimes(2);
		expect(ctx.fillRect).toBeCalledWith(
			createdWith[0].x1,
			createdWith[0].y1,
			createdWith[0].x2 - createdWith[0].x1,
			createdWith[0].y2 - createdWith[0].y1
		);
		expect(ctx.fillRect).toBeCalledWith(
			createdWith[1].x1,
			createdWith[1].y1,
			createdWith[1].x2 - createdWith[1].x1,
			createdWith[1].y2 - createdWith[1].y1
		);
	});

	it('only clears snake if snake has been drawn', () => {
		const { snake } = createSnake('right');
		snake.clear(ctx);
		expect(ctx.clearRect).not.toBeCalled();

		snake.draw(ctx);
		snake.clear(ctx);
		expect(ctx.clearRect).toBeCalled();
	});

	it('clears snake properly when tail is going right', () => {
		const { snake, snakeSpeed } = createSnake('right');
		snake.draw(ctx);
		snake.clear(ctx);

		const { x1, x2, y1, y2 } = snake.tail;
		expect(ctx.clearRect).toBeCalledWith(x1 - snakeSpeed - 1, y1 - 1, x2 - x1 + 2, y2 - y1 + 2);
	});

	it('clears snake properly when tail is going left', () => {
		const { snake, snakeSpeed } = createSnake('left');
		snake.draw(ctx);
		snake.clear(ctx);

		const { x1, x2, y1, y2 } = snake.tail;
		expect(ctx.clearRect).toBeCalledWith(x1 - 1, y1 - 1, x2 - x1 + snakeSpeed + 2, y2 - y1 + 2);
	});

	it('clears snake properly when tail is going up', () => {
		const { snake, snakeSpeed } = createSnake('up');
		snake.draw(ctx);
		snake.clear(ctx);

		const { x1, x2, y1, y2 } = snake.tail;
		expect(ctx.clearRect).toBeCalledWith(x1 - 1, y1 - 1, x2 - x1 + 2, y2 - y1 + snakeSpeed + 2);
	});

	it('clears snake properly when tail is going down', () => {
		const { snake, snakeSpeed } = createSnake('down');
		snake.draw(ctx);
		snake.clear(ctx);

		const { x1, x2, y1, y2 } = snake.tail;
		expect(ctx.clearRect).toBeCalledWith(x1 - 1, y1 - snakeSpeed - 1, x2 - x1 + 2, y2 - y1 + 2);
	});

	it("clears rectangle for all position when snake body's length greater than 1", () => {
		const { snake } = createSnake('right', 'down', ['up', 'left', 'up', 'right']);
		snake.draw(ctx);
		snake.clear(ctx);

		expect(ctx.clearRect).toBeCalledTimes(6);

		expect(ctx.clearRect).toBeCalledWith(
			snake.position[0].x1 - 1,
			snake.position[0].y1 - 1,
			snake.position[0].x2 - snake.position[0].x1 + 2,
			snake.position[0].y2 - snake.position[0].y1 + 2
		);

		expect(ctx.clearRect).toBeCalledWith(
			snake.position[1].x1 - 1,
			snake.position[1].y1 - 1,
			snake.position[1].x2 - snake.position[1].x1 + 2,
			snake.position[1].y2 - snake.position[1].y1 + 2
		);

		expect(ctx.clearRect).toBeCalledWith(
			snake.position[2].x1 - 1,
			snake.position[2].y1 - 1,
			snake.position[2].x2 - snake.position[2].x1 + 2,
			snake.position[2].y2 - snake.position[2].y1 + 2
		);

		expect(ctx.clearRect).toBeCalledWith(
			snake.position[3].x1 - 1,
			snake.position[3].y1 - 1,
			snake.position[3].x2 - snake.position[3].x1 + 2,
			snake.position[3].y2 - snake.position[3].y1 + 2
		);

		expect(ctx.clearRect).toBeCalledWith(
			snake.position[4].x1 - 1,
			snake.position[4].y1 - 1,
			snake.position[4].x2 - snake.position[4].x1 + 2,
			snake.position[4].y2 - snake.position[4].y1 + 2
		);
	});
});

// TODO: test behaviour when snake's tail is equal to thickness
describe('the snake can move', () => {
	it("doesn't move the snake if it has not been drawn", () => {
		const { snake, createdWith } = createSnake('down', 'right');
		snake.move();
		expect(snake.head).toEqual(createdWith[0]);
		expect(snake.tail).toEqual(createdWith[1]);
	});

	it('moves forward when the head direction is right', () => {
		const { snake, createdWith, snakeSpeed } = createSnake('right');
		snake.draw(ctx);
		snake.move();
		expect(snake.head.x2).toBe(createdWith[0].x2 + snakeSpeed);
	});

	it('moves forward when the head direction is left', () => {
		const { snake, createdWith, snakeSpeed } = createSnake('left');
		snake.draw(ctx);
		snake.move();
		expect(snake.head.x1).toBe(createdWith[0].x1 - snakeSpeed);
	});

	it('moves forward when the head direction is up', () => {
		const { snake, createdWith, snakeSpeed } = createSnake('up');
		snake.draw(ctx);
		snake.move();
		expect(snake.head.y1).toBe(createdWith[0].y1 - snakeSpeed);
	});

	it('moves forward when the head direction is down', () => {
		const { snake, createdWith, snakeSpeed } = createSnake('down');
		snake.draw(ctx);
		snake.move();
		expect(snake.head.y2).toBe(createdWith[0].y2 + snakeSpeed);
	});

	it('moves forward when the tail direction is right', () => {
		const { snake, createdWith, snakeSpeed } = createSnake('up', 'right');
		snake.draw(ctx);
		snake.move();
		expect(snake.tail.x1).toBe(createdWith[createdWith.length - 1].x1 + snakeSpeed);
	});

	it('moves forward when the tail direction is left', () => {
		const { snake, createdWith, snakeSpeed } = createSnake('up', 'left');
		snake.draw(ctx);
		snake.move();
		expect(snake.tail.x2).toBe(createdWith[createdWith.length - 1].x2 - snakeSpeed);
	});

	it('moves forward when the tail direction is up', () => {
		const { snake, createdWith, snakeSpeed } = createSnake('right', 'up');
		snake.draw(ctx);
		snake.move();
		expect(snake.tail.y2).toBe(createdWith[createdWith.length - 1].y2 - snakeSpeed);
	});

	it('moves forward when the tail direction is down', () => {
		const { snake, createdWith, snakeSpeed } = createSnake('left', 'down');
		snake.draw(ctx);
		snake.move();
		expect(snake.tail.y1).toBe(createdWith[createdWith.length - 1].y1 + snakeSpeed);
	});

	it('straightens the snake body eventually', () => {
		const { snake } = createSnake('right', 'up');
		snake.draw(ctx);
		expect(snake.position.length).toBe(2);
		moveSnakeBySteps(snake, 100);
		expect(snake.position.length).toBe(1);
	});
});

describe("the sanke's direction can be changed", () => {
	it("doesn't change if it is already moving in that direction", () => {
		const { snake, createdWith } = createSnake('right');
		snake.draw(ctx);
		snake.changeDirection('right');

		expect(snake.head.x1).toBe(createdWith[0].x1);
		expect(snake.head.x2).toBe(createdWith[0].x2);
		expect(snake.head.y1).toBe(createdWith[0].y1);
		expect(snake.head.y2).toBe(createdWith[0].y2);
	});

	it('can change the snakes direction', () => {
		let previousSnakePosition;
		const { snake, createdWith, snakeThickness } = createSnake('right');
		snake.draw(ctx);
		snake.changeDirection('up');

		expect(snake.head.x1).toBe(createdWith[0].x2 - snakeThickness);
		expect(snake.head.x2).toBe(createdWith[0].x2);
		expect(snake.head.y1).toBe(createdWith[0].y1);
		expect(snake.head.y2).toBe(createdWith[0].y2);

		moveSnakeBySteps(snake, 60);
		previousSnakePosition = snake.position;
		snake.changeDirection('left');

		expect(snake.head.x1).toBe(previousSnakePosition[0].x1);
		expect(snake.head.x2).toBe(previousSnakePosition[0].x2);
		expect(snake.head.y1).toBe(previousSnakePosition[0].y1);
		expect(snake.head.y2).toBe(previousSnakePosition[0].y1 + snakeThickness);

		moveSnakeBySteps(snake, 60);
		previousSnakePosition = snake.position;
		snake.changeDirection('down');

		expect(snake.head.x1).toBe(previousSnakePosition[0].x1);
		expect(snake.head.x2).toBe(previousSnakePosition[0].x1 + snakeThickness);
		expect(snake.head.y1).toBe(previousSnakePosition[0].y1);
		expect(snake.head.y2).toBe(previousSnakePosition[0].y2);

		moveSnakeBySteps(snake, 60);
		previousSnakePosition = snake.position;
		snake.changeDirection('right');

		expect(snake.head.x1).toBe(previousSnakePosition[0].x1);
		expect(snake.head.x2).toBe(previousSnakePosition[0].x2);
		expect(snake.head.y1).toBe(previousSnakePosition[0].y2 - snakeThickness);
		expect(snake.head.y2).toBe(previousSnakePosition[0].y2);

		moveSnakeBySteps(snake, 60);
		previousSnakePosition = snake.position;
		snake.changeDirection('down');

		expect(snake.head.x1).toBe(previousSnakePosition[0].x2 - snakeThickness);
		expect(snake.head.x2).toBe(previousSnakePosition[0].x2);
		expect(snake.head.y1).toBe(previousSnakePosition[0].y1);
		expect(snake.head.y2).toBe(previousSnakePosition[0].y2);

		moveSnakeBySteps(snake, 60);
		previousSnakePosition = snake.position;
		snake.changeDirection('left');

		expect(snake.head.x1).toBe(previousSnakePosition[0].x1);
		expect(snake.head.x2).toBe(previousSnakePosition[0].x2);
		expect(snake.head.y1).toBe(previousSnakePosition[0].y2 - snakeThickness);
		expect(snake.head.y2).toBe(previousSnakePosition[0].y2);

		moveSnakeBySteps(snake, 60);
		previousSnakePosition = snake.position;
		snake.changeDirection('up');

		expect(snake.head.x1).toBe(previousSnakePosition[0].x1);
		expect(snake.head.x2).toBe(previousSnakePosition[0].x1 + snakeThickness);
		expect(snake.head.y1).toBe(previousSnakePosition[0].y1);
		expect(snake.head.y2).toBe(previousSnakePosition[0].y2);

		moveSnakeBySteps(snake, 60);
		previousSnakePosition = snake.position;
		snake.changeDirection('right');

		expect(snake.head.x1).toBe(previousSnakePosition[0].x1);
		expect(snake.head.x2).toBe(previousSnakePosition[0].x2);
		expect(snake.head.y1).toBe(previousSnakePosition[0].y1);
		expect(snake.head.y2).toBe(previousSnakePosition[0].y1 + snakeThickness);
	});
});
