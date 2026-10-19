<script lang="ts">
	import { onMount } from 'svelte';
	import { site } from '#lib/config/site';
	import { formatDate, timestampToSeconds, durationToIso8601 } from '#lib/utils/format';
	import { player } from '#lib/components/player/player.svelte';
	import Seo from '#lib/components/seo/Seo.svelte';
	import JsonLd from '#lib/components/seo/JsonLd.svelte';
	import InlinePlayer from '#lib/components/player/InlinePlayer.svelte';
	import EpisodeCard from '#lib/components/episode/EpisodeCard.svelte';
	import ChapterList from '#lib/components/episode/ChapterList.svelte';
	import PlatformLinks from '#lib/components/episode/PlatformLinks.svelte';
	import CoverImage from '#lib/components/episode/CoverImage.svelte';
	import FavoriteButton from '#lib/components/favorites/FavoriteButton.svelte';
	import Badge from '#lib/components/ui/Badge.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const episode = $derived(data.episode);
	const prev = $derived(data.prev);
	const next = $derived(data.next);

	let bodyEl: HTMLDivElement;

	/** 正文中的时间戳按钮 → 章节跳转（事件委托，避免在非交互元素上挂 onclick） */
	onMount(() => {
		const handler = (event: MouseEvent) => {
			const button = (event.target as HTMLElement).closest<HTMLButtonElement>('.chapter-seek');
			if (button?.dataset.seek) player.seekTo(episode, timestampToSeconds(button.dataset.seek));
		};
		bodyEl.addEventListener('click', handler);
		return () => bodyEl.removeEventListener('click', handler);
	});

	const episodeJsonLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'PodcastEpisode',
		name: episode.title,
		description: episode.summary,
		url: new URL(`/episodes/${episode.slug}`, site.url).href,
		datePublished: episode.date,
		timeRequired: durationToIso8601(episode.duration),
		episodeNumber: episode.number,
		partOfSeries: {
			'@type': 'PodcastSeries',
			name: site.name,
			url: site.url
		},
		associatedMedia: {
			'@type': 'MediaObject',
			contentUrl: episode.audioUrl,
			encodingFormat: episode.audioType
		},
		actor: episode.guests.map((guest) => ({ '@type': 'Person', name: guest }))
	});
</script>

<Seo
	title="No.{episode.number} {episode.title}"
	description={episode.summary}
	path="/episodes/{episode.slug}"
	image={episode.cover || undefined}
/>
<JsonLd data={episodeJsonLd} />

<nav class="mb-6 text-sm text-neutral-500 dark:text-neutral-400" aria-label="返回">
	<a href="/episodes" class="hover:text-indigo-700 dark:hover:text-indigo-400">← 全部节目</a>
</nav>

<article>
	<!-- 节目头部 -->
	<header class="flex flex-col gap-5 sm:flex-row sm:gap-6">
		<div class="shrink-0 sm:w-40">
			<CoverImage {episode} size="w-full max-w-40 h-auto aspect-square" />
		</div>
		<div class="min-w-0 flex-1">
			<div
				class="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-500 dark:text-neutral-400"
			>
				<span
					class="rounded bg-indigo-50 px-1.5 py-0.5 font-medium text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400"
				>
					No.{episode.number}
				</span>
				<time datetime={episode.date}>{formatDate(episode.date)}</time>
				<span aria-hidden="true">·</span>
				<span>时长 {episode.duration}</span>
			</div>
			<div class="mt-2 flex items-start justify-between gap-3">
				<h1
					class="min-w-0 flex-1 text-2xl leading-snug font-bold text-neutral-900 sm:text-3xl dark:text-neutral-100"
				>
					{episode.title}
				</h1>
				<FavoriteButton slug={episode.slug} />
			</div>

			<div class="mt-3 space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
				{#if episode.guests.length > 0}
					<p>嘉宾：{episode.guests.join('、')}</p>
				{/if}
				<p>主播：{episode.hosts.join('、')}</p>
			</div>

			<p class="mt-3 leading-7 text-neutral-700 dark:text-neutral-300">{episode.summary}</p>

			{#if episode.tags.length > 0}
				<div class="mt-3 flex flex-wrap gap-1.5">
					{#each episode.tags as tag (tag)}
						<Badge>{tag}</Badge>
					{/each}
				</div>
			{/if}
		</div>
	</header>

	<!-- 站内播放 -->
	<section class="mt-8" aria-label="播放器">
		<InlinePlayer {episode} />
		{#if episode.audioUrl}
			<p class="mt-2 text-xs text-neutral-400 dark:text-neutral-500">
				无法播放？<a
					href={episode.audioUrl}
					class="underline hover:text-indigo-700 dark:hover:text-indigo-400">直接下载音频</a
				>
				或前往以下平台收听：
			</p>
		{/if}
		{#if episode.platformLinks && Object.keys(episode.platformLinks).length > 0}
			<div class="mt-3">
				<PlatformLinks links={episode.platformLinks} size="sm" />
			</div>
		{/if}
	</section>

	<!-- 章节时间轴 -->
	{#if episode.chapters.length > 0}
		<section class="mt-8" aria-labelledby="chapters-heading">
			<h2
				id="chapters-heading"
				class="mb-3 text-lg font-bold text-neutral-900 dark:text-neutral-100"
			>
				章节时间轴
			</h2>
			<ChapterList {episode} chapters={episode.chapters} />
		</section>
	{/if}

	<!-- Shownotes 正文（时间戳可点击跳转） -->
	<section class="mt-8" aria-labelledby="shownotes-heading">
		<h2
			id="shownotes-heading"
			class="mb-3 text-lg font-bold text-neutral-900 dark:text-neutral-100"
		>
			Shownotes
		</h2>
		<div class="prose-podcast" bind:this={bodyEl}>
			<!-- Markdown 在构建期渲染为静态 HTML，关掉 JS 也能完整阅读 -->
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html data.bodyHtml}
		</div>
	</section>

	<!-- 上一期 / 下一期 -->
	<nav
		class="mt-10 grid gap-3 border-t border-neutral-200 pt-6 sm:grid-cols-2 dark:border-neutral-800"
		aria-label="上下期导航"
	>
		{#if prev}
			<a
				href="/episodes/{prev.slug}"
				class="rounded-xl border border-neutral-200 bg-white p-4 transition hover:border-indigo-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-indigo-700"
			>
				<span class="text-xs text-neutral-500 dark:text-neutral-400"
					>← 上一期 · No.{prev.number}</span
				>
				<p class="mt-1 line-clamp-1 text-sm font-medium text-neutral-900 dark:text-neutral-100">
					{prev.title}
				</p>
			</a>
		{:else}
			<span></span>
		{/if}
		{#if next}
			<a
				href="/episodes/{next.slug}"
				class="rounded-xl border border-neutral-200 bg-white p-4 text-right transition hover:border-indigo-300 sm:col-start-2 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-indigo-700"
			>
				<span class="text-xs text-neutral-500 dark:text-neutral-400"
					>下一期 · No.{next.number} →</span
				>
				<p class="mt-1 line-clamp-1 text-sm font-medium text-neutral-900 dark:text-neutral-100">
					{next.title}
				</p>
			</a>
		{/if}
	</nav>

	<!-- 相关推荐 -->
	{#if data.related.length > 0}
		<section class="mt-10" aria-labelledby="related-heading">
			<h2
				id="related-heading"
				class="mb-4 text-lg font-bold text-neutral-900 dark:text-neutral-100"
			>
				相关节目
			</h2>
			<div class="grid gap-4 md:grid-cols-2">
				{#each data.related as related (related.slug)}
					<EpisodeCard episode={related} />
				{/each}
			</div>
		</section>
	{/if}
</article>
