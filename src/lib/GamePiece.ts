export interface GamePiece {
	draw: (ctx: CanvasRenderingContext2D) => void;
	clear: (ctx: CanvasRenderingContext2D) => void;
}
