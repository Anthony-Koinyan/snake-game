<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	$: links = data.links;
</script>

<div class="flex flex-col w-full h-[calc(100vh-2.5rem)]">
	<nav class="grid gap-3 lg:gap-5 w-fit h-2/3 lg:h-3/4 align-baseline m-auto">
		{#each links as link}
			<a
				href={link.url}
				class="text-4xl sm:text-5xl inline-block my-auto p-4 hover:font-bold hover:border-4 hover:border-solid hover:border-black dark:hover:border-neutral-100 hover:shadow-md focus:font-bold focus:border-4 focus:border-solid focus:border-black dark:focus:border-neutral-100 focus:shadow-md focus:outline-none active:translate-x-3"
				target={link.url.charAt(0) === '/' ? null : '_blank'}
				rel={link.url.charAt(0) === '/' ? null : 'noopener'}
			>
				{link.text}
			</a>
		{/each}
	</nav>
</div>
