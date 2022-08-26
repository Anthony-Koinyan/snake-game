<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { afterNavigate } from '$app/navigation';
	import { HAVE_ICONS_BEEN_LOADED } from '$lib/stores';

	afterNavigate(() => {
		if (!$HAVE_ICONS_BEEN_LOADED) {
			const script = document.createElement('script');
			script.setAttribute('type', 'module');
			script.src = 'https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js';
			document.body.appendChild(script);

			$HAVE_ICONS_BEEN_LOADED = true;
		}
	});
</script>

{#if $page.url.pathname !== '/'}
	<nav class="w-full p-5 border-y-black border-b-2 shadow-md">
		<a
			href="/"
			class="flex text-3xl h-10 gap-4 ml-0 justify-start cursor-pointer w-fit hover:font-bold focus:font-bold focus:outline-none"
		>
			<ion-icon
				name="chevron-back-outline"
				class="text-3xl m-auto hover:font-bold focus:font-bold"
			/>
			<p class="my-auto">Go To Menu</p>
		</a>
	</nav>
{/if}
<main class="p-5 w-screen">
	<slot />
</main>
