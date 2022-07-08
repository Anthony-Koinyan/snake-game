import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/svelte';
import Play from '../../play/index.svelte';

// let food: Food;
describe('checking for default content on initial render', () => {
	it('has the snake and the scoreboard', () => {
		render(Play);
		const canvas: HTMLCanvasElement = screen.getByTestId('canvas');
		const ctx = canvas.getContext('2d');

		expect(ctx?.fillRect).toBeCalledTimes(1);
		expect(screen.getByText(0)).toBeInTheDocument();
	});
});
