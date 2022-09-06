<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
</script>

{#if $page.url.pathname !== '/'}
	<nav class="w-full p-5 border-y-black border-b-2 shadow-md">
		<a
			href="/"
			class="flex text-3xl h-10 gap-4 ml-0 justify-start cursor-pointer w-fit group active:-translate-x-4"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				class="w-7 h-7 m-auto stroke-[2.5] group-hover:stroke-[3] group-focus:stroke-[3]"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
			</svg>
			<p class="my-auto group-hover:font-bold group-focus:font-bold group-focus:outline-none">
				Go To Menu
			</p>
		</a>
	</nav>
{/if}
<main class="p-5 w-screen">
	<slot />
</main>
