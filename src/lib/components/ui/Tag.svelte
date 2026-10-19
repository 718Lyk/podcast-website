<script lang="ts">
	let { label, href }: { label: string; href?: string } = $props();

	const cls =
		'inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600 transition hover:bg-slate-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700';
</script>

{#if href}
	<a {href} class={cls}>{label}</a>
{:else}
	<span class={cls}>{label}</span>
{/if}
