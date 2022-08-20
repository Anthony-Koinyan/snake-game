<script lang="ts">
	import { getContext } from 'svelte';
	import { GAME_PIECE_MIN_SIZE, RENDER_CONTEXT_KEY } from '$lib/stores';
	import { SNAKE_SPEED, SNAKE_POSITION } from './store';
	import Snake from './index';
	import type { RenderContext } from '../canvas/types';

	export let deleteAnimation = false;

	const { addRenderFn, removeRenderFn } = getContext<RenderContext>(RENDER_CONTEXT_KEY);
	const snake = new Snake($SNAKE_POSITION, $SNAKE_SPEED, $GAME_PIECE_MIN_SIZE);

	const renderFn = (ctx: CanvasRenderingContext2D) => {
		snake.clear(ctx);
		snake.draw(ctx);
		snake.move();
		SNAKE_POSITION.update(() => snake.position);
	};

	addRenderFn({
		renderFn,
		animate: true
	});

	$: {
		if (deleteAnimation) {
			removeRenderFn(renderFn);
		}
	}
</script>

<svelte:window
	on:keypress|preventDefault={(e) => {
		if (e.code === 'KeyD') snake.changeDirection('right');
		if (e.code === 'KeyA') snake.changeDirection('left');
		if (e.code === 'KeyW') snake.changeDirection('up');
		if (e.code === 'KeyS') snake.changeDirection('down');
	}}
/>
