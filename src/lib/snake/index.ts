/**
 * TODO:
 * - actually write good documentation🙄
 */

import type { GamePiece } from '../GamePiece';

export interface SnakePosition {
	x1: number;
	x2: number;
	y1: number;
	y2: number;
	direction: 'right' | 'left' | 'up' | 'down';
}

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

	removeTail() {
		this.body.pop();
	}

	draw(ctx: CanvasRenderingContext2D) {
		for (const position of this.body) {
			ctx.fillRect(position.x1, position.y1, position.x2 - position.x1, position.y2 - position.y1);
		}

		this.drawn = true;
	}

	clear(ctx: CanvasRenderingContext2D) {
		if (!this.drawn) return;

		for (const position of this.body) {
			ctx.clearRect(
				position.x1 - 2,
				position.y1 - 2,
				position.x2 - position.x1 + 4,
				position.y2 - position.y1 + 4
			);
		}

		this.drawn = false;
	}

	move() {
		if (!this.drawn) return;

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

		if (this.tail.direction === 'right') {
			if (this.tail.x1 + this.thickness === this.tail.x2) {
				this.body.pop();
				return;
			}
			this.tail.x1 += this.speed;
		}

		if (this.tail.direction === 'left') {
			if (this.tail.x1 + this.thickness === this.tail.x2) {
				this.body.pop();
				return;
			}
			this.tail.x2 -= this.speed;
		}

		if (this.tail.direction === 'up') {
			if (this.tail.y1 + this.thickness === this.tail.y2) {
				this.body.pop();
				return;
			}
			this.tail.y2 -= this.speed;
		}

		if (this.tail.direction === 'down') {
			if (this.tail.y1 + this.thickness === this.tail.y2) {
				this.body.pop();
				return;
			}
			this.tail.y1 += this.speed;
		}
	}

	changeDirection(direction: SnakePosition['direction']) {
		if (direction === 'right') {
			if (this.head.direction === 'right' || this.head.direction === 'left') return;
			if (this.head.y2 - this.head.y1 < this.thickness) return;

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
			if (this.head.y2 - this.head.y1 < this.thickness) return;

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
			if (this.head.x2 - this.head.x1 < this.thickness) return;

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
			if (this.head.x2 - this.head.x1 < this.thickness) return;

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
