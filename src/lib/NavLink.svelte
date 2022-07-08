<script lang="ts">
	export let url: string;
	export let description: string;
</script>

<a href={url} class="text-5xl font-mono hover:font-bold">{description}</a>
