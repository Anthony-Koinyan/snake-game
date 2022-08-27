import { readable, writable } from 'svelte/store';

// TODO: make this a store (I think, not sure🤷🏾‍♂️)
export const RENDER_CONTEXT_KEY = Symbol();
export const GAME_PIECE_MIN_SIZE = readable(12);
export const SCOREBOARD = writable(0);
export const DIFFICULTIES = readable([
	'Baby Steps',
	'Pretty Easy',
	'Midly Difficult',
	'Hard',
	'Nightmare',
	'Hell',
	'Beg For Mercy',
	'Cry To Your Mommy'
]);
export const DIFFICULTY = writable('Baby Steps');
