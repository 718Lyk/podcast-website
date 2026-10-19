<script lang="ts">
	import type { Episode } from '#lib/content/types';
	import { formatDate } from '#lib/utils/format';
	import { player } from '#lib/components/player/player.svelte';
	import FavoriteButton from '#lib/components/favorites/FavoriteButton.svelte';
	import CoverImage from './CoverImage.svelte';
	import Badge from '#lib/components/ui/Badge.svelte';

	let { episode, featured = false }: { episode: Episode; featured?: boolean } = $props();

	const isCurrent = $derived(player.current?.slug === episode.slug);
	const isPlaying = $derived(isCurrent && !player.paused);
</script>

<article
	class="group flex gap-4 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:gap-5 sm:p-5 dark:border-neutral-800 dark:bg-neutral-900"
>
	<a href="/episodes/{episode.slug}" class="shrink-0" aria-label="查看第 {episode.number} 期详情">
		<CoverImage {episode} size={featured ? 'size-20 sm:size-28' : 'size-16 sm:size-20'} />
	</a>

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
			<span>{episode.duration}</span>
		</div>

		<h3
			class="mt-1.5 font-semibold text-neutral-900 group-hover:text-indigo-700 dark:text-neutral-100 dark:group-hover:text-indigo-400 {featured
				? 'text-lg sm:text-xl'
				: 'text-base'}"
		>
			<a href="/episodes/{episode.slug}">{episode.title}</a>
		</h3>

		{#if featured || episode.summary}
			<p class="mt-1.5 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">
				{episode.summary}
			</p>
		{/if}

		<div class="mt-2.5 flex flex-wrap items-center justify-between gap-2">
			<div class="flex flex-wrap items-center gap-1.5">
				{#each episode.tags as tag (tag)}
					<Badge>{tag}</Badge>
				{/each}
			</div>
			<div class="flex shrink-0 items-center gap-2">
				<FavoriteButton slug={episode.slug} />
				<button
					type="button"
					onclick={() => (isCurrent ? player.toggle() : player.play(episode))}
					class="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-indigo-600 px-3.5 py-1.5 text-sm font-medium text-white transition hover:bg-indigo-500"
					aria-label={isPlaying ? '暂停播放' : '播放本期节目'}
				>
					{#if isPlaying}
						<svg class="size-4" viewBox="0 0 24 24" fill="currentColor">
							<path d="M7 4h4v16H7zM13 4h4v16h-4z" />
						</svg>
						暂停
					{:else}
						<svg class="size-4" viewBox="0 0 24 24" fill="currentColor">
							<path
								d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86a1 1 0 0 0-1.5.86z"
							/>
						</svg>
						播放
					{/if}
				</button>
			</div>
		</div>
	</div>
</article>
