import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/svelte';
import Canvas from './canvas.svelte';

let canvas: HTMLCanvasElement;

describe('Renders canvas properly', () => {
	beforeEach(() => {
		render(Canvas);
		canvas = screen.getByTitle('canvas');
	});

	it('renders the canvas to be 80% of the screen width and height', () => {
		expect(canvas.width).toBeCloseTo(window.innerWidth * 0.8, 0);
		expect(canvas.height).toBeCloseTo(window.innerHeight * 0.8, 0);
	});
});
