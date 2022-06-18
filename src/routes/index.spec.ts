import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/svelte';
import MatchMediaMock from 'jest-matchmedia-mock';
import Page from './index.svelte';

let matchMedia: MatchMediaMock;

describe('Renders content', () => {
	beforeAll(() => {
		matchMedia = new MatchMediaMock();
	});

	afterEach(() => {
		matchMedia.clear();
	});

	it('shows the homepage', () => {
		const { container } = render(Page);
		expect(container).toBeInTheDocument();
	});

	it('shows popup if a mobile device is in portrait', async () => {
		const { queryByText } = render(Page);
		window.innerWidth = 412;
		window.innerHeight = 914;
		matchMedia.useMediaQuery('(orientation: portrait)');
		await fireEvent.resize(window);
		expect(queryByText('Flip your screen')).toBeInTheDocument();
	});
});
