<script lang="ts">
	import { favorites } from './favorites.svelte';

	let { slug }: { slug: string } = $props();

	const active = $derived(favorites.has(slug));
</script>

<button
	type="button"
	aria-pressed={active}
	aria-label={active ? '取消收藏' : '收藏节目'}
	title={active ? '取消收藏' : '收藏节目'}
	onclick={() => favorites.toggle(slug)}
	class="inline-flex shrink-0 items-center justify-center rounded-full border p-2 transition {active
		? 'border-rose-200 bg-rose-50 text-rose-600'
		: 'border-neutral-200 text-neutral-400 hover:border-neutral-400 hover:text-neutral-600 dark:border-neutral-800 dark:text-neutral-500 dark:hover:border-neutral-600 dark:hover:text-neutral-400'}"
>
	<svg
		class="size-4"
		viewBox="0 0 24 24"
		fill={active ? 'currentColor' : 'none'}
		stroke="currentColor"
		stroke-width="1.5"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
		/>
	</svg>
</button>
