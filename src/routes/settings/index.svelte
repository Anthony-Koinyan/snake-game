<script lang="ts">
	import { DIFFICULTIES, DIFFICULTY } from '$lib/stores';

	/**
	 * TODO:
	 * - Add selector for input controls: "WASD" or arrow keys for desktop, swipe or on screen arrow keys for mobile
	 * - Add game type (level or game mode, don't know what to call it🤷🏾‍♂️) selector with images of the level (maybe 🤷🏾‍♂️)
	 */
</script>

<form>
	<h2 class="text-4xl mt-1 ml-2 font-medium">Set The Game Difficulty</h2>
	<section class="grid gap-3 m-6 cursor-pointer">
		{#each $DIFFICULTIES as difficulty}
			<label class="text-2xl hover:font-semibold w-fit">
				<input
					type="radio"
					name="difficulty"
					value={difficulty}
					bind:group={$DIFFICULTY}
					class="h-4 w-4 text-gray-600 hover:text-gray-800 focus:ring-gray-600 focus:hover:ring-gray-800"
				/>
				{difficulty}
			</label>
		{/each}
	</section>
</form>
