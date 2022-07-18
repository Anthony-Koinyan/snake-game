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

		this.moveHead();
		this.moveTail();
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
			this.tail.x1 += this.speed;
		}

		if (this.tail.direction === 'left') {
			this.tail.x2 -= this.speed;
		}

		if (this.tail.direction === 'up') {
			this.tail.y2 -= this.speed;
		}

		if (this.tail.direction === 'down') {
			this.tail.y1 += this.speed;
		}
	}
}
