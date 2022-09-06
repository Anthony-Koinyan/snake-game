import { readable, writable } from 'svelte/store';

// TODO: make this a store (I think, not sure🤷🏾‍♂️)
export const RENDER_CONTEXT_KEY = Symbol();
// TODO: this is only writable for testing purposes. Figure out a way to test without changing this
export const GAME_PIECE_MIN_SIZE = writable(12);
// TODO: change this to SCORE
export const SCOREBOARD = writable(0);

const difficulties = <const>[
	'Baby Steps',
	'Pretty Easy',
	'Midly Difficult',
	'Hard',
	'Nightmare',
	'Hell',
	'Beg For Mercy',
	'Cry To Your Mommy'
];

export const DIFFICULTIES = readable(difficulties);
export const DIFFICULTY = writable<typeof difficulties[number]>('Baby Steps');
