<script lang="ts">
	import NavLink from '$lib/NavLink.svelte';
</script>

<nav class="flex flex-col items-center justify-center gap-20 w-full h-screen m-auto">
	<NavLink url="/play" description="Continue" />
	<NavLink url="/play" description="New Game" />
	<NavLink url="/settings" description="Settings" />
	<NavLink url="https://github.com/Anthony-Koinyan/snake-game" description="Repo" />
</nav>
