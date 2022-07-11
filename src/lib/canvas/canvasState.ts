import { readable, writable } from 'svelte/store';

interface CanvasState {
	scaleFactor: number;
	width: number | null;
	height: number | null;
	canvasWidth: number | null;
	canvasHeight: number | null;
	styleWidth: string | null;
	styleHeight: string | null;
}

export const DEFAULT_HEIGHT = readable(180);
export const DEFAULT_WIDTH = readable(320);

export const canvasState = writable<CanvasState>({
	scaleFactor: 1,
	width: null,
	height: null,
	canvasWidth: null,
	canvasHeight: null,
	styleWidth: null,
	styleHeight: null
});
