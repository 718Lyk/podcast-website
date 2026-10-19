<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		href,
		variant = 'primary',
		onclick,
		children
	}: {
		href?: string;
		variant?: 'primary' | 'secondary';
		onclick?: () => void;
		children: Snippet;
	} = $props();

	const styles = $derived(
		variant === 'secondary'
			? 'inline-flex items-center justify-center rounded-full border border-neutral-300 px-5 py-2 text-sm font-medium text-neutral-700 transition hover:border-indigo-300 hover:text-indigo-700 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-indigo-700 dark:hover:text-indigo-400'
			: 'inline-flex items-center justify-center rounded-full bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-indigo-500'
	);
</script>

{#if href}
	<a {href} class={styles}>{@render children()}</a>
{:else}
	<button type="button" class={styles} {onclick}>{@render children()}</button>
{/if}
