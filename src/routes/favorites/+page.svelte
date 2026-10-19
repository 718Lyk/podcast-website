<script lang="ts">
	import { resolve } from '$app/paths';
	import { favorites } from '#lib/components/favorites/favorites.svelte';
	import { getEpisode } from '#lib/content/episodes';
	import EpisodeCard from '#lib/components/episode/EpisodeCard.svelte';
	import Seo from '#lib/components/seo/Seo.svelte';

	// 收藏状态存在浏览器本地，构建期预渲染为空列表，水合后显示
	const episodes = $derived(
		favorites.slugs.map((slug) => getEpisode(slug)).filter((episode) => episode !== null)
	);
</script>

<Seo title="我的收藏" description="你在 Web Worker 播客收藏的节目列表" path="/favorites" />

<div class="flex items-baseline justify-between">
	<h1 class="text-2xl font-bold text-neutral-900 sm:text-3xl dark:text-neutral-100">我的收藏</h1>
	<span class="text-sm text-neutral-500 dark:text-neutral-400">{favorites.count} 期</span>
</div>

{#if episodes.length === 0}
	<p
		class="mt-8 rounded-xl border border-dashed border-neutral-300 p-8 text-center text-neutral-500 dark:border-neutral-700 dark:text-neutral-400"
	>
		还没有收藏任何节目，去<a
			href={resolve('/episodes')}
			class="font-medium text-indigo-700 underline dark:text-indigo-400">节目列表</a
		>逛逛吧
	</p>
{:else}
	<div class="mt-6 grid gap-4">
		{#each episodes as episode (episode.slug)}
			<EpisodeCard {episode} />
		{/each}
	</div>
{/if}
