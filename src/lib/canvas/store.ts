import { readable, writable } from 'svelte/store';
import type { CanvasSize } from './types';

// TODO: CHANGE THIS TO 600x400
export const DEFAULT_CANVAS_WIDTH = readable(600);
export const DEFAULT_CANVAS_HEIGHT = readable(400);

export const canvasSize = writable<CanvasSize>({
	scaleFactor: 1,
	canvasWidth: 1,
	canvasHeight: 1,
	styleWidth: '1px',
	styleHeight: '1px'
});
