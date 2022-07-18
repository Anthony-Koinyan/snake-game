import { readable } from 'svelte/store';

export const GAME_PIECE_MIN_SIZE = readable(20);
// TODO: make this a store (I think, not sure🤷🏾‍♂️)
export const RENDER_CONTEXT_KEY = Symbol();
