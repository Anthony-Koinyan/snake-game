<script lang="ts">
	import Canvas from '$lib/canvas/Canvas.svelte';
	import Snake from '$lib/snake/Snake.svelte';
	import Food from '$lib/food/Food.svelte';

	let container: HTMLElement;
</script>

<section class="flex flex-col justify-between items-center h-screen w-5/6 max-h-screen mx-auto">
	<section bind:this={container} class="h-2/3 sm:h-5/6 w-full my-0">
		<Canvas {container}>
			<Snake />
			<Food />
		</Canvas>
	</section>
	<section class="text-2xl text-center h-1/6 w-full pt-1/3">0</section>
</section>
