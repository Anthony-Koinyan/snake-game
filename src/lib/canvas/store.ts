import { readable, writable } from 'svelte/store';
import type { CanvasSize } from './types';

export const DEFAULT_CANVAS_WIDTH = readable(300);
export const DEFAULT_CANVAS_HEIGHT = readable(200);

export const canvasSize = writable<CanvasSize>({
	scaleFactor: 1,
	width: 1,
	height: 1,
	canvasWidth: 1,
	canvasHeight: 1,
	styleWidth: '1px',
	styleHeight: '1px'
});
