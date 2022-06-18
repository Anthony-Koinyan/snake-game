import '@testing-library/jest-dom';
import { render, fireEvent, screen } from '@testing-library/svelte';
import Canvas from './canvas.svelte';

let canvas: HTMLCanvasElement;

describe('Renders canvas properly', () => {
	beforeEach(() => {
		render(Canvas);
		canvas = screen.getByTitle('canvas');
	});

	it('renders the canvas', () => {
		expect(canvas).toBeInTheDocument();

		expect(canvas.width).toBe(window.innerWidth - 100);
		expect(canvas.height).toBe(window.innerHeight - 100);
	});

	it('is responsive on desktop', async () => {
		window.innerWidth = 1920;
		window.innerHeight = 1080;
		await fireEvent.resize(window);

		expect(canvas.width).toBe(window.innerWidth - 100);
		expect(canvas.height).toBe(window.innerHeight - 100);

		window.innerWidth = 1366;
		window.innerHeight = 768;
		await fireEvent.resize(window);

		expect(canvas.width).toBe(window.innerWidth - 100);
		expect(canvas.height).toBe(window.innerHeight - 100);

		window.innerWidth = 1280;
		window.innerHeight = 720;
		await fireEvent.resize(window);

		expect(canvas.width).toBe(window.innerWidth - 100);
		expect(canvas.height).toBe(window.innerHeight - 100);
	});

	it('is responsive on mobile', async () => {
		window.innerWidth = 390;
		window.innerHeight = 844;
		await fireEvent(window, new Event('resize'));

		expect(canvas.width).toBe(window.innerWidth - 10);
		expect(canvas.height).toBe(window.innerHeight - 50);

		window.innerWidth = 412;
		window.innerHeight = 914;
		await fireEvent(window, new Event('resize'));

		expect(canvas.width).toBe(window.innerWidth - 10);
		expect(canvas.height).toBe(window.innerHeight - 50);

		window.innerWidth = 360;
		window.innerHeight = 740;
		await fireEvent(window, new Event('resize'));

		expect(canvas.width).toBe(window.innerWidth - 10);
		expect(canvas.height).toBe(window.innerHeight - 50);
	});
});
