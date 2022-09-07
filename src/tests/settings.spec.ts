import '@testing-library/jest-dom';

import { DIFFICULTY } from '$lib/stores';
import { get } from 'svelte/store';

import { fireEvent, render, screen } from '@testing-library/svelte';

import Settings from '../routes/settings/+page.svelte';

describe('The difficulty can be changed', () => {
	const getGameDifficulty = () => get(DIFFICULTY);

	beforeEach(() => {
		render(Settings);
	});

	it('renders the difficulty toggle', () => {
		expect(screen.getByText('Set The Game Difficulty')).toBeInTheDocument();
		expect(screen.getAllByRole('radio').length).toBe(8);
	});

	it('has "Baby Steps" as the default difficulty', () => {
		expect(screen.getByRole('radio', { name: 'Baby Steps' })).toBeChecked();
	});

	it('changes the difficulty when a difficulty is selected', () => {
		const [babySteps, prettyEasy, midlyDifficult] = screen.getAllByRole('radio');

		fireEvent.click(midlyDifficult);
		expect(midlyDifficult).toBeChecked();
		expect(getGameDifficulty()).toBe('Midly Difficult');

		fireEvent.click(prettyEasy);
		expect(prettyEasy).toBeChecked();
		expect(getGameDifficulty()).toBe('Pretty Easy');

		fireEvent.click(babySteps);
		expect(babySteps).toBeChecked();
		expect(getGameDifficulty()).toBe('Baby Steps');
	});
});
