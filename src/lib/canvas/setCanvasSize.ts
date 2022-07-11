import { get } from 'svelte/store';
import getCanvasScaleFactor from './getCanvasScaleFactor';
import { canvasState, DEFAULT_HEIGHT, DEFAULT_WIDTH } from './canvasState';

export default () => {
	const data = get(canvasState);
	const WIDTH = get(DEFAULT_WIDTH);
	const HEIGHT = get(DEFAULT_HEIGHT);
	const containertWidth = window.innerWidth * 0.7;
	const containerHeight = window.innerWidth * 0.7;
	const scale = getCanvasScaleFactor(WIDTH, HEIGHT, containertWidth, containerHeight);
	const pixelRatio = window.devicePixelRatio || 1;

	if (data.width === WIDTH * scale) return;

	canvasState.update(
		(_data) =>
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			(_data = {
				scaleFactor: scale,
				width: WIDTH * scale,
				height: HEIGHT * scale,
				canvasWidth: WIDTH * scale * pixelRatio,
				canvasHeight: HEIGHT * scale * pixelRatio,
				styleWidth: `${WIDTH * scale}px`,
				styleHeight: `${HEIGHT * scale}px`
			})
	);

	return scale;
};
