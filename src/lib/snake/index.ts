/**
 * TODO:
 * - add the ability for the snake to move
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

	constructor(coords: SnakePosition | SnakePosition[], speed: number, thickness: number) {
		this.body = Array.isArray(coords) ? coords : [coords];
		this.speed = speed;
		this.thickness = thickness;
	}

	private get head() {
		return this.body[0];
	}

	private set head(coords: SnakePosition) {
		this.body.unshift(coords);
	}

	private get tail() {
		return this.body[this.body.length - 1];
	}

	private set tail(coords: SnakePosition) {
		this.body.push(coords);
	}

	private removeTail() {
		this.body.pop();
	}

	draw(ctx: CanvasRenderingContext2D) {
		for (const coords of this.body) {
			const diffX = coords.x2 - coords.x1;
			const diffY = coords.y2 - coords.y1;
			ctx.fillRect(coords.x1, coords.y1, diffX, diffY);
		}

		this.drawn = true;
	}

	clear(ctx: CanvasRenderingContext2D) {
		if (!this.drawn) return;

		for (const coords of this.body) {
			const diffX = coords.x2 - coords.x1;
			const diffY = coords.y2 - coords.y1;
			ctx.clearRect(coords.x1, coords.y1, diffX, diffY);
		}

		this.drawn = false;
	}
}
