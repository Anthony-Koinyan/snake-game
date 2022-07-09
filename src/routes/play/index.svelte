<script lang="ts" context="module">
	export async function load() {
		if (typeof window === 'undefined') {
			return { redirect: '/', status: 303 };
		}

		function setCanvasSize(scale: number = 1):
			| Function
			| {
					canvasWidth: number;
					canvasHeight: number;
			  } {
			let h = 9 * scale;

			if (h > window.innerHeight * 0.8) {
				return {
					canvasWidth: 16 * scale - 1,
					canvasHeight: 9 * scale - 1
				};
			}

			return setCanvasSize(scale + 1);
		}

		return { props: setCanvasSize() };
	}
</script>

<script lang="ts">
	import Canvas from '$lib/canvas.svelte';
	import Snake from '$lib/snake/Snake.svelte';

	export let canvasWidth: number;
	export let canvasHeight: number;
</script>

<section class="flex flex-col items-center gap-5 w-fit h-screen mx-auto my-4">
	<Canvas width={canvasWidth} height={canvasHeight}>
		<Snake />
	</Canvas>
	<div class="text-2xl text-left w-full">0</div>
</section>
