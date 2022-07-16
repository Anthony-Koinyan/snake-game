export interface CanvasSize {
	scaleFactor: number;
	width: number;
	height: number;
	canvasWidth: number;
	canvasHeight: number;
	styleWidth: string;
	styleHeight: string;
}

export type RenderFn = (ctx: CanvasRenderingContext2D) => void;

export interface RenderObject {
	renderFn: RenderFn;
	animate: boolean;
}

export interface Context {
	addToBeRendered(data: RenderObject): void;
	removeFromRenders(fn: RenderFn): void;
	removeFromAnimations(fn: RenderFn): void;
}
