/**
 * TODO:
 * - ACTUALLY WRITE GOOD DOCUMENTATION
 * FIXME:
 * - FIX BUG WHERE SNAKE GETS LONGER WEN IT CHANGES DIRECTION
 *
 *  I SUSPECT THE CULPRIT IS THAT WHENEVER THE SNAKE.CHANGEDIRECTION METHOD IS CALLED IT
 * 	ADDS 6 PIXELS TO THE HEAD
 */

import { DEFAULT_CANVAS_HEIGHT, DEFAULT_CANVAS_WIDTH } from '$lib/canvas/store';
import { get } from 'svelte/store';
import type { GamePiece } from '../GamePiece';

// TODO: MOVE THIS TO GLOBAL TYPES FOLDER
export interface SnakePosition {
	x1: number;
	x2: number;
	y1: number;
	y2: number;
	direction: 'right' | 'left' | 'up' | 'down';
}

const canvasBoundary = { width: get(DEFAULT_CANVAS_WIDTH), height: get(DEFAULT_CANVAS_HEIGHT) };

export default class Snake implements GamePiece {
	private body: SnakePosition[];
	private speed: number;
	private thickness: number;
	private drawn = false;

	constructor(position: SnakePosition | SnakePosition[], speed: number, thickness: number) {
		this.body = Array.isArray(position)
			? JSON.parse(JSON.stringify(position))
			: [JSON.parse(JSON.stringify(position))];
		this.speed = speed;
		this.thickness = thickness;
	}

	get head() {
		return this.body[0];
	}

	private set head(position: SnakePosition) {
		this.body.unshift(position);
	}

	get tail() {
		return this.body[this.body.length - 1];
	}

	private set tail(position: SnakePosition) {
		this.body.push(position);
	}

	get position() {
		return JSON.parse(JSON.stringify(this.body));
	}

	draw(ctx: CanvasRenderingContext2D) {
		for (const position of this.body) {
			ctx.fillRect(position.x1, position.y1, position.x2 - position.x1, position.y2 - position.y1);
		}

		this.drawn = true;
	}

	clear(ctx: CanvasRenderingContext2D) {
		if (!this.drawn) {
			return console.warn('Snake.clear called before snake was drawn');
		}

		for (const position of this.body) {
			if (this.body.indexOf(position) === this.body.length - 1) {
				if (position.direction === 'right') {
					ctx.clearRect(
						position.x1 - this.speed - 1,
						position.y1 - 1,
						position.x2 - position.x1 + 2,
						position.y2 - position.y1 + 2
					);
				}

				if (position.direction === 'left') {
					ctx.clearRect(
						position.x1 - 1,
						position.y1 - 1,
						position.x2 - position.x1 + this.speed + 2,
						position.y2 - position.y1 + 2
					);
				}

				if (position.direction === 'up') {
					ctx.clearRect(
						position.x1 - 1,
						position.y1 - 1,
						position.x2 - position.x1 + 2,
						position.y2 - position.y1 + this.speed + 2
					);
				}

				if (position.direction === 'down') {
					ctx.clearRect(
						position.x1 - 1,
						position.y1 - this.speed - 1,
						position.x2 - position.x1 + 2,
						position.y2 - position.y1 + 2
					);
				}

				return;
			}

			ctx.clearRect(
				position.x1 - 1,
				position.y1 - 1,
				position.x2 - position.x1 + 2,
				position.y2 - position.y1 + 2
			);
		}

		this.drawn = false;
	}
	private moveHead() {
		if (this.head.direction === 'right') {
			this.head.x2 += this.speed;
		}

		if (this.head.direction === 'left') {
			this.head.x1 -= this.speed;
		}

		if (this.head.direction === 'up') {
			this.head.y1 -= this.speed;
		}

		if (this.head.direction === 'down') {
			this.head.y2 += this.speed;
		}
	}

	private moveTail() {
		if (this.tail.direction === 'right') {
			if (
				this.tail.x1 + this.thickness === this.tail.x2 ||
				this.tail.x1 + this.thickness > this.tail.x2
			)
				if (this.head.direction !== this.body[1].direction) {
					return this.body.pop();
				}
			this.tail.x1 += this.speed;
		}

		if (this.tail.direction === 'left') {
			if (
				this.tail.x1 + this.thickness === this.tail.x2 ||
				this.tail.x1 + this.thickness > this.tail.x2
			)
				if (this.head.direction !== this.body[1].direction) {
					return this.body.pop();
				}
			this.tail.x2 -= this.speed;
		}

		if (this.tail.direction === 'up') {
			if (this.tail.y2 === -1) {
				return this.body.pop();
			}

			if (
				this.tail.y1 + this.thickness === this.tail.y2 ||
				this.tail.y1 + this.thickness > this.tail.y2
			) {
				if (this.head.direction !== this.body[1].direction) {
					return this.body.pop();
				}
			}
			this.tail.y2 -= this.speed;
		}

		if (this.tail.direction === 'down') {
			if (
				this.tail.y1 + this.thickness === this.tail.y2 ||
				this.tail.y1 + this.thickness > this.tail.y2
			)
				if (this.head.direction !== this.body[1].direction) {
					return this.body.pop();
				}
			this.tail.y1 += this.speed;
		}
	}

	private moveThroughBoundary() {
		if (this.position.length > 1 && this.head.direction === this.position[1].direction) return;

		if (this.head.x1 === 0 && this.head.direction === 'left') {
			this.head = {
				x1: canvasBoundary.width - 1,
				x2: canvasBoundary.width,
				y1: this.head.y1,
				y2: this.head.y2,
				direction: this.head.direction
			};
		} else if (this.head.x2 === canvasBoundary.width && this.head.direction === 'right') {
			this.head = {
				x1: 0,
				x2: 1,
				y1: this.head.y1,
				y2: this.head.y2,
				direction: this.head.direction
			};
		} else if (this.head.y1 === 0 && this.head.direction === 'up') {
			this.head = {
				x1: this.head.x1,
				x2: this.head.x2,
				y1: canvasBoundary.height - 1,
				y2: canvasBoundary.height,
				direction: this.head.direction
			};
		} else if (this.head.y2 === canvasBoundary.height && this.head.direction === 'down') {
			this.head = {
				x1: this.head.x1,
				x2: this.head.x2,
				y1: 0,
				y2: 1,
				direction: this.head.direction
			};
		}
	}

	move() {
		if (!this.drawn) {
			return console.warn('Snake.move called before snake was drawn');
		}

		this.moveHead();
		this.moveThroughBoundary();
		this.moveTail();
	}

	changeDirection(direction: SnakePosition['direction']) {
		if (!this.drawn) {
			return console.warn('Snake.changeDirection called before snake was drawn');
		}

		if (direction === 'right') {
			if (this.head.direction === 'right' || this.head.direction === 'left') return;
			if (this.head.y2 - this.head.y1 < this.thickness * 2) return;

			this.head = {
				x1: this.head.x1,
				x2: this.head.x2,
				y1: this.head.direction === 'up' ? this.head.y1 : this.head.y2 - this.thickness,
				y2: this.head.direction === 'up' ? this.head.y1 + this.thickness : this.head.y2,
				direction: 'right'
			};
		}

		if (direction === 'left') {
			if (this.head.direction === 'right' || this.head.direction === 'left') return;
			if (this.head.y2 - this.head.y1 < this.thickness * 2) return;

			this.head = {
				x1: this.head.x1,
				x2: this.head.x2,
				y1: this.head.direction === 'up' ? this.head.y1 : this.head.y2 - this.thickness,
				y2: this.head.direction === 'up' ? this.head.y1 + this.thickness : this.head.y2,
				direction: 'left'
			};
		}

		if (direction === 'up') {
			if (this.head.direction === 'up' || this.head.direction === 'down') return;
			if (this.head.x2 - this.head.x1 < this.thickness * 2) return;

			this.head = {
				x1: this.head.direction === 'right' ? this.head.x2 - this.thickness : this.head.x1,
				x2: this.head.direction === 'right' ? this.head.x2 : this.head.x1 + this.thickness,
				y1: this.head.y1,
				y2: this.head.y2,
				direction: 'up'
			};
		}

		if (direction === 'down') {
			if (this.head.direction === 'up' || this.head.direction === 'down') return;
			if (this.head.x2 - this.head.x1 < this.thickness * 2) return;

			this.head = {
				x1: this.head.direction === 'right' ? this.head.x2 - this.thickness : this.head.x1,
				x2: this.head.direction === 'right' ? this.head.x2 : this.head.x1 + this.thickness,
				y1: this.head.y1,
				y2: this.head.y2,
				direction: 'down'
			};
		}
	}
}
