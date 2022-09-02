import { tick } from 'svelte';

export default function scaleCanvas(
	parentWidth: number,
	parentHeight: number,
	canvasWidth: number,
	canvasHeight: number,
	ctx: CanvasRenderingContext2D
) {
	const scaleFactor = Math.min(parentWidth / canvasWidth, parentHeight / canvasHeight);
	const pixelRatio = window.devicePixelRatio || 1;

	tick().then(() => {
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.scale(scaleFactor * pixelRatio, scaleFactor * pixelRatio);
	});

	return {
		canvasWidth: Math.floor(canvasWidth * scaleFactor * pixelRatio),
		canvasHeight: Math.floor(canvasHeight * scaleFactor * pixelRatio),
		styleWidth: `${Math.floor(canvasWidth * scaleFactor)}px`,
		styleHeight: `${Math.floor(canvasHeight * scaleFactor)}px`
	};
}
