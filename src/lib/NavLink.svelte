<script lang="ts">
	export let url: string;
	export let target = '';
</script>

<a
	href={url}
	class="text-4xl sm:text-5xl inline-block my-auto p-4 hover:font-bold hover:border-4 hover:border-solid hover:border-black hover:shadow-md focus:font-bold focus:border-4 focus:border-solid focus:border-black focus:shadow-md focus:outline-none"
	{target}
>
	<slot />
</a>
