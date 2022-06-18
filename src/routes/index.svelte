<script lang="ts">
	// TODO: Add a dialog that says app shouldn only be used in portrait if screen oriantation is landscape
	import { browser } from '$app/env';
	import Canvas from '$lib/canvas.svelte';

	let showPopup: boolean;

	if (browser) {
		const mediaQueryList = window.matchMedia('(orientation: portrait)');
		showPopup = mediaQueryList.matches && window.innerWidth < 640;

		mediaQueryList.addEventListener('change', (event) => {
			showPopup = event.matches && window.innerWidth < 640;
		});
	}
</script>

<Canvas />

{#if showPopup}
	<div
		class="absolute inset-0 text-center backdrop-blur flex flex-col justify-center items-center w-screen h-screen"
	>
		<div>Flip your screen</div>
	</div>
{/if}
