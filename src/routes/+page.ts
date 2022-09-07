import { SCOREBOARD } from '$lib/stores';
import { get } from 'svelte/store';

import { SNAKE_POSITION } from './play/store';

import type { PageLoad } from './$types';

export const load: PageLoad = () => {
	const links = [
		{
			url: '/play#continue',
			text: 'Continue'
		},
		{
			url: '/play#new-game',
			text: 'New Game'
		},
		{
			url: '/settings',
			text: 'Settings'
		},
		{
			url: '/high-scores',
			text: 'High Scores'
		},
		{
			url: 'https://github.com/Anthony-Koinyan/snake-game',
			text: 'Repo'
		}
	];

	const snakePosition = get(SNAKE_POSITION);
	const score = get(SCOREBOARD);

	if (
		snakePosition.length === 1 &&
		snakePosition[0].x1 === 130 &&
		snakePosition[0].x2 === 210 &&
		snakePosition[0].y1 === 97 &&
		snakePosition[0].y2 === 109 &&
		score === 0
	) {
		links.shift();
	}
	return { links };
};
