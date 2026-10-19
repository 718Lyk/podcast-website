<script lang="ts">
	import type { PlatformKey } from '#lib/config/site';

	let { links, size = 'md' }: { links: Partial<Record<PlatformKey, string>>; size?: 'sm' | 'md' } =
		$props();

	const platformNames: Record<PlatformKey, string> = {
		xiaoyuzhou: '小宇宙',
		applePodcasts: 'Apple Podcasts',
		spotify: 'Spotify',
		netease: '网易云音乐',
		bilibili: 'B站'
	};

	const entries = $derived(
		Object.entries(links).filter(([, url]) => url) as [PlatformKey, string][]
	);
</script>

{#if entries.length > 0}
	<div class="flex flex-wrap gap-2">
		{#each entries as [key, url] (key)}
			<a
				href={url}
				target="_blank"
				rel="noopener noreferrer"
				class="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-neutral-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-indigo-700 dark:hover:bg-indigo-950/60 dark:hover:text-indigo-400 {size ===
				'sm'
					? 'text-xs'
					: 'text-sm'}"
			>
				{platformNames[key]}
			</a>
		{/each}
	</div>
{/if}
