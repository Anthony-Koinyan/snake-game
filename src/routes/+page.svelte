<script lang="ts">
	import NavLink from '$lib/NavLink.svelte';
</script>

<div class="flex flex-col w-full h-[calc(100vh-2.5rem)]">
	<nav class="grid gap-3 lg:gap-5 w-fit h-2/3 lg:h-3/4 align-baseline m-auto">
		<NavLink url="/play">Continue</NavLink>
		<NavLink url="/play">New Game</NavLink>
		<NavLink url="/settings">Settings</NavLink>
		<NavLink url="/high-scores">High Scores</NavLink>
		<NavLink url="https://github.com/Anthony-Koinyan/snake-game" target="_blank">Repo</NavLink>
	</nav>
</div>
