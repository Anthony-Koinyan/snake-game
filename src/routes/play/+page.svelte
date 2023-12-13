<script lang="ts">
	// import dialogPolyfill from 'dialog-polyfill';
	import { page } from '$app/stores';

	import Canvas from '$lib/canvas/Canvas.svelte';
	import Level from './Level.svelte';
	import Snake from './Snake.svelte';
	import Food from './Food.svelte';

	import { SCOREBOARD, GAME_PIECE_MIN_SIZE } from '$lib/stores';
	import { DEFAULT_CANVAS_HEIGHT, DEFAULT_CANVAS_WIDTH } from '$lib/canvas/store';
	import { FOOD_POSITION, SNAKE_POSITION } from './store';

	import generateNewPosition from './generateNewFoodPosition';

	if ($page.url.hash === '#new-game') {
		$SNAKE_POSITION = [{ x1: 130, x2: 210, y1: 97, y2: 109, direction: 'right' }];

		$FOOD_POSITION = generateNewPosition(
			$GAME_PIECE_MIN_SIZE / 2,
			{ width: $DEFAULT_CANVAS_WIDTH, height: $DEFAULT_CANVAS_HEIGHT },
			$SNAKE_POSITION
		);

		$SCOREBOARD = 0;
	}
	let game: HTMLElement;
	let paused = false;
	let isFullscreen = false;
</script>

<div class="relative" bind:this={game}>
	<div class="absolute flex sm:flex-col gap-4 opacity-60 right-0 top-0">
		<button
			class="border-black dark:border-neutral-100 border-4"
			on:click={() => (paused = !paused)}
			title={`${paused ? 'Play' : 'Pause'} Button`}
		>
			{#if paused}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="2"
					stroke="currentColor"
					class="w-7 h-7 sm:w-14 sm:h-14"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
					/>
				</svg>
			{:else}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="2"
					stroke="currentColor"
					class="w-7 h-7 sm:w-14 sm:h-14"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M15.75 5.25v13.5m-7.5-13.5v13.5"
					/>
				</svg>
			{/if}
		</button>
		<button
			class="border-black dark:border-neutral-100 border-4"
			on:click={() => {
				isFullscreen = !isFullscreen;
				if (isFullscreen)
					game.requestFullscreen().catch((err) => {
						alert('Something went wrong! try again later');
						console.log(err);
					});
				else document.exitFullscreen();
			}}
			title={'Fullscreen Toggles'}
		>
			{#if isFullscreen}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="2"
					stroke="currentColor"
					class="w-7 h-7 sm:w-14 sm:h-14"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25"
					/>
				</svg>
			{:else}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="2"
					stroke="currentColor"
					class="w-7 h-7 sm:w-14 sm:h-14"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
					/>
				</svg>
			{/if}
		</button>
	</div>
	<div class="h-[calc(100vh-7.5rem)] my-auto mx-auto">
		<div
			class="h-full sm:h-[90%] w-full m-0 flex flex-col justify-evenly sm:justify-between items-center"
		>
			<Canvas {paused}>
				<Level />
				<Snake />
				<Food />
			</Canvas>
			<div class="text-3xl flex items-end justify-center h-1/6 w-full pt-1/3">
				{$SCOREBOARD}
			</div>
		</div>
	</div>
</div>
<svelte:window
	on:keypress|preventDefault={(e) => {
		if (e.code === 'Space') {
			paused = !paused;
		}
	}}
/>
