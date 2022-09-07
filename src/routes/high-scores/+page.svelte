<script lang="ts">
	import { HIGHSCORES } from '$lib/stores';
</script>

{#if $HIGHSCORES.length}
	<ol class="grid gap-3 lg:gap-5 w-fit h-2/3 lg:h-3/4 align-baseline m-auto list-decimal">
		{#each $HIGHSCORES as highscore}
			<li class="text-3xl py-10 first:pt-5 font-light">
				{highscore}
			</li>
		{/each}
	</ol>
{:else}
	<div class="text-4xl flex flex-col items-center justify-center gap-4 h-[calc(100vh-8rem)]">
		NOTHING TO SEE HERE 👀 START
		<span> PLAYING TO GET SOME HIGH SCORES </span>
	</div>
{/if}
