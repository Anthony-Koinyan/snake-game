<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
</script>

{#if $page.url.pathname !== '/'}
	<nav class="w-full p-5 border-y-black border-b-2 shadow-md">
		<a
			href="/"
			class="flex text-3xl h-10 gap-4 ml-0 justify-start cursor-pointer w-fit hover:font-bold focus:font-bold focus:outline-none hover:-translate-x-1 stroke-[2.5] hover:stroke-[3]"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				class="w-7 h-7 m-auto"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
			</svg>
			<p class="my-auto">Go To Menu</p>
		</a>
	</nav>
{/if}
<main class="p-5 w-screen">
	<slot />
</main>
