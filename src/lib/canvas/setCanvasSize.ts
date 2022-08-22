import { get } from 'svelte/store';
import { DEFAULT_CANVAS_HEIGHT, DEFAULT_CANVAS_WIDTH, canvasSize } from './store';

const getCanvasScaleFactor = (
	originalWidth: number,
	originalHeight: number,
	maxWidth: number,
	maxHeight: number
) => {
	const heightScale = maxHeight / originalHeight;
	const widthScale = maxWidth / originalWidth;
	return Math.min(heightScale, widthScale);
};

export const scaleCanvasDrawings = (ctx: CanvasRenderingContext2D, scaleFactor: number) => {
	const pixelRatio = window.devicePixelRatio || 1;
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.scale(scaleFactor * pixelRatio, scaleFactor * pixelRatio);
};

export const setCanvasSize = (containertWidth: number, containerHeight: number) => {
	const WIDTH = get(DEFAULT_CANVAS_WIDTH);
	const HEIGHT = get(DEFAULT_CANVAS_HEIGHT);
	const scale = getCanvasScaleFactor(WIDTH, HEIGHT, containertWidth, containerHeight);
	const pixelRatio = window.devicePixelRatio || 1;

	canvasSize.update(
		(_data) =>
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			(_data = {
				scaleFactor: scale,
				canvasWidth: WIDTH * scale * pixelRatio,
				canvasHeight: HEIGHT * scale * pixelRatio,
				styleWidth: `${WIDTH * scale}px`,
				styleHeight: `${HEIGHT * scale}px`
			})
	);
};
