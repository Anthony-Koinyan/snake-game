<script lang="ts">
	// TODO: Add a dialog that says app shouldn only be used in portrait if screen oriantation is landscape
	import { browser } from '$app/env';
	import Canvas from '$lib/canvas.svelte';

	let showDialog = false;

	if (browser) {
		const mediaQueryList = window.matchMedia('(orientation: landscape)');
		showDialog = mediaQueryList.matches && (window.innerWidth < 640 || window.innerHeight < 640);
		mediaQueryList.addEventListener('change', (event) => {
			showDialog = event.matches && window.innerHeight < 640;
		});
	}
</script>

<Canvas />

{#if showDialog}
	<div
		class="absolute inset-0 text-center backdrop-blur flex flex-col justify-center items-center w-screen h-screen"
	>
		<div>Flip your screen</div>
	</div>
{/if}
