export type RenderFn = (ctx: CanvasRenderingContext2D) => void;

export interface RenderObject {
	renderFn: RenderFn;
	animate: boolean;
}

export interface RenderContext {
	addRenderFn(data: RenderObject): void;
	removeRenderFn(fn: RenderFn): void;
}
