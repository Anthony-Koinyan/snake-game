import { act, render } from '@testing-library/svelte';

import Canvas from '$lib/canvas/Canvas.svelte';

test('the canvas scales properly', async () => {
	const target = document.createElement('div');

	Object.defineProperty(target, 'clientWidth', {
		writable: true,
		configurable: true,
		value: 950
	});

	Object.defineProperty(target, 'clientHeight', {
		writable: true,
		configurable: true,
		value: 700
	});

	document.body.appendChild(target);

	const initialCanvasDimensions = { width: 600, height: 400 };

	const scaleFactor = Math.min(
		target.clientHeight / initialCanvasDimensions.height,
		target.clientWidth / initialCanvasDimensions.width
	);

	const pixelRatio = 2;
	window.devicePixelRatio = pixelRatio;

	const { getByTestId } = render(Canvas, { target, props: initialCanvasDimensions });
	const canvas = getByTestId('canvas') as HTMLCanvasElement;
	await act();

	expect(canvas.width).toBe(Math.floor(initialCanvasDimensions.width * scaleFactor * pixelRatio));
	expect(canvas.height).toBe(Math.floor(initialCanvasDimensions.height * scaleFactor * pixelRatio));
	expect(canvas.style.width).toBe(`${Math.floor(initialCanvasDimensions.width * scaleFactor)}px`);
	expect(canvas.style.height).toBe(`${Math.floor(initialCanvasDimensions.height * scaleFactor)}px`);
	const ctx = canvas.getContext('2d');
	expect(ctx?.setTransform).toBeCalledWith(1, 0, 0, 1, 0, 0);
	expect(ctx?.scale).toBeCalledWith(scaleFactor * pixelRatio, scaleFactor * pixelRatio);
});
