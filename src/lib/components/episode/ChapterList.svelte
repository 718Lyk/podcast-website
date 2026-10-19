<script lang="ts">
	import type { Chapter, Episode } from '#lib/content/types';
	import { timestampToSeconds } from '#lib/utils/format';
	import { player } from '#lib/components/player/player.svelte';

	let { episode, chapters }: { episode: Episode; chapters: Chapter[] } = $props();

	/** 正在播的必须是本页这期节目，播放其他节目时不高亮 */
	const isPlayingThis = $derived(player.current?.slug === episode.slug);

	/** 当前播放位置所在的章节序号 */
	const activeIndex = $derived.by(() => {
		if (!isPlayingThis) return -1;
		const now = player.time;
		let index = -1;
		chapters.forEach((chapter, i) => {
			if (timestampToSeconds(chapter.time) <= now) index = i;
		});
		return index;
	});
</script>

{#if chapters.length > 0}
	<nav aria-label="章节时间轴">
		<ul
			class="divide-y divide-neutral-100 rounded-xl border border-neutral-200 bg-white dark:divide-neutral-800 dark:border-neutral-800 dark:bg-neutral-900"
		>
			{#each chapters as chapter, i (chapter.time + chapter.title)}
				<li>
					<button
						type="button"
						onclick={() => player.seekTo(episode, timestampToSeconds(chapter.time))}
						class="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition hover:bg-indigo-50 dark:hover:bg-indigo-950/60 {i ===
						activeIndex
							? 'font-medium text-indigo-700 dark:text-indigo-400'
							: 'text-neutral-700 dark:text-neutral-300'}"
					>
						<span
							class="shrink-0 rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-xs tabular-nums dark:bg-neutral-800 {i ===
							activeIndex
								? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400'
								: 'text-neutral-500 dark:text-neutral-400'}"
						>
							{chapter.time}
						</span>
						<span class="min-w-0 truncate">{chapter.title}</span>
					</button>
				</li>
			{/each}
		</ul>
	</nav>
{/if}
