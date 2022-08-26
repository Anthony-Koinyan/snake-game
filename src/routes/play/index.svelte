<script lang="ts">
	import Canvas from '$lib/canvas/Canvas.svelte';
	import Level from '$lib/Level.svelte';
	import { SCOREBOARD } from '$lib/stores';
</script>

<section class="flex flex-col justify-between items-center h-[calc(100vh-7.5rem)] w-5/6 mx-auto">
	<section class="h-2/3 sm:h-5/6 w-full my-auto">
		<Canvas>
			<Level />
		</Canvas>
	</section>
	<section class="text-2xl flex items-center justify-center h-1/6 w-full pt-1/3">
		{$SCOREBOARD}
	</section>
</section>
