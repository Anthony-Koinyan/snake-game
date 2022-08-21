<script lang="ts">
	import Canvas from '$lib/canvas/Canvas.svelte';
	import Level from '$lib/Level.svelte';
	import { SCOREBOARD } from '$lib/stores';
</script>

<section class="flex flex-col justify-between items-center h-screen w-5/6 max-h-screen mx-auto">
	<section class="h-2/3 sm:h-5/6 w-full my-auto">
		<Canvas>
			<Level />
		</Canvas>
	</section>
	<section class="text-2xl text-center h-1/6 w-full pt-1/3">{$SCOREBOARD}</section>
</section>
