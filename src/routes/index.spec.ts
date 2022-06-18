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

	it('renders the canvas', () => {
		const { getByTitle } = render(Page);
		expect(getByTitle('canvas')).toBeInTheDocument();
	});

	it("doesn't show dialog if a desktop device is in landscape", async () => {
		const { queryByText } = render(Page);
		expect(queryByText('Flip your screen')).not.toBeInTheDocument();
	});

	it("doesn't show dialog if a mobile device is in portrait", async () => {
		const { queryByText } = render(Page);
		window.innerWidth = 412;
		window.innerHeight = 914;
		matchMedia.useMediaQuery('(orientation: portrait)');
		await fireEvent.resize(window);
		expect(queryByText('Flip your screen')).not.toBeInTheDocument();
	});

	it('shows dialog if a mobile device is in landscape', async () => {
		const { queryByText } = render(Page);
		window.innerHeight = 412;
		window.innerWidth = 914;
		matchMedia.useMediaQuery('(orientation: landscape)');
		await fireEvent.resize(window);
		expect(queryByText('Flip your screen')).toBeInTheDocument();
	});
});
