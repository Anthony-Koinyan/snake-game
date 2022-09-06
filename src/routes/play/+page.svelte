<script lang="ts">
	import Canvas from '$lib/canvas/Canvas.svelte';
	import Level from '$lib/Level.svelte';
	import Snake from '$lib/snake/Snake.svelte';
	import Food from '$lib/food/Food.svelte';

	import { SCOREBOARD } from '$lib/stores';
	import { DEFAULT_CANVAS_HEIGHT, DEFAULT_CANVAS_WIDTH } from '$lib/canvas/store';
</script>

<section class="flex flex-col justify-between items-center h-[calc(100vh-7.5rem)] w-5/6 mx-auto">
	<section class="h-2/3 sm:h-5/6 w-full my-auto">
		<Canvas width={$DEFAULT_CANVAS_WIDTH} height={$DEFAULT_CANVAS_HEIGHT}>
			<Level />
			<Snake />
			<Food />
		</Canvas>
	</section>
	<section class="text-2xl flex items-center justify-center h-1/6 w-full pt-1/3">
		{$SCOREBOARD}
	</section>
</section>
