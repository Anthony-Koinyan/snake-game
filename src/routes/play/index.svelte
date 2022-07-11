<script lang="ts">
	import Canvas from '$lib/canvas/Canvas.svelte';
	import Snake from '$lib/snake/Snake.svelte';
</script>

<section class="flex flex-col items-center gap-5 w-fit h-screen mx-auto my-0">
	<Canvas>
		<Snake />
	</Canvas>
	<div class="text-2xl text-left w-full">0</div>
</section>
