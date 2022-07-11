<script lang="ts">
	import { ctxKey, SNAKE_SPEED, SNAKE_START_POSITION, GAME_PIECE_MIN_SIZE } from '$lib/settings';
	import { getContext, onMount, tick } from 'svelte';
	import Snake from './index';

	const snake = new Snake($SNAKE_START_POSITION, $SNAKE_SPEED, $GAME_PIECE_MIN_SIZE);
	const { getCanvasContext } = getContext(ctxKey);

	onMount(async () => {
		const ctx: CanvasRenderingContext2D = getCanvasContext();
		await tick();

		snake.draw(ctx);
	});
</script>
