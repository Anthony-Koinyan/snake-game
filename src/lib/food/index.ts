import type { FoodPosition } from './types';
import type { GamePiece } from '$lib/GamePiece';

export default class Food implements GamePiece {
	private body: FoodPosition;
	private radius: number;
	private drawn: boolean;

	constructor(position: FoodPosition, radius: number) {
		this.body = position;
		this.radius = radius;
		this.drawn = false;
	}

	get position() {
		return JSON.parse(JSON.stringify(this.body));
	}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.beginPath();
		ctx.arc(this.body.x, this.body.y, this.radius, 0, 2 * Math.PI);
		ctx.fill();
		this.drawn = true;
	}

	clear(ctx: CanvasRenderingContext2D) {
		if (!this.drawn) return;

		ctx.closePath();
		ctx.clearRect(
			this.body.x - this.radius,
			this.body.y - this.radius,
			this.radius * 2,
			this.radius * 2
		);
	}
}
