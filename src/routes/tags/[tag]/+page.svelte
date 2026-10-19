<script lang="ts">
	import type { PageProps } from './$types';
	import Seo from '#lib/components/seo/Seo.svelte';
	import EpisodeCard from '#lib/components/episode/EpisodeCard.svelte';

	let { data }: PageProps = $props();
</script>

<Seo
	title={`标签：${data.tag}`}
	description={`Web Worker 播客「${data.tag}」标签下的全部节目，共 ${data.episodes.length} 期。`}
	path={`/tags/${encodeURIComponent(data.tag)}`}
/>
<section class="mx-auto max-w-5xl px-4 py-10">
	<h1 class="text-2xl font-bold">标签：{data.tag}</h1>
	<p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">共 {data.episodes.length} 期</p>
	<div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each data.episodes as episode (episode.slug)}
			<EpisodeCard {episode} />
		{/each}
	</div>
</section>
