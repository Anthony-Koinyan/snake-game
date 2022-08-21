import { readable, writable } from 'svelte/store';

/**FIXME: when difficulties is iterated on it return two copies of each enum
 */

enum difficulties {
	'baby steps' = 1,
	'pretty easy',
	'midly difficult',
	'hard',
	'nightmare',
	'hell',
	'beg for mercy',
	'cry to your mommy'
}

// TODO: make this a store (I think, not sure🤷🏾‍♂️)
export const RENDER_CONTEXT_KEY = Symbol();

export const GAME_PIECE_MIN_SIZE = readable(12);
export const SCOREBOARD = writable(0);
export const DIFFICULTIES = readable(difficulties);
export const DIFFICULTY = writable({
	name: 'baby steps',
	increment: difficulties['baby steps']
});
