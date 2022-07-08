<script lang="ts">
	import Canvas from '$lib/canvas.svelte';
	import Snake from '$lib/snake/Snake.svelte';
</script>

<section class="flex flex-col items-center justify-center gap-5">
	<Canvas>
		<Snake />
	</Canvas>
	<div class="text-2xl">0</div>
</section>
