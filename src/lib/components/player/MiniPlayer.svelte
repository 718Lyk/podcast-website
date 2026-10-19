<script lang="ts">
	import { player } from './player.svelte';
	import ProgressBar from './ProgressBar.svelte';
	import CoverImage from '#lib/components/episode/CoverImage.svelte';
</script>

{#if player.current}
	<div
		class="fixed inset-x-0 bottom-0 z-50 border-t border-neutral-200 bg-white/95 shadow-[0_-4px_16px_rgb(0_0_0/0.06)] backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/95"
		role="region"
		aria-label="全局播放器"
	>
		<div class="mx-auto flex max-w-5xl items-center gap-3 px-3 py-2 sm:gap-4 sm:px-6 sm:py-3">
			<a
				href="/episodes/{player.current.slug}"
				class="shrink-0"
				aria-label="查看节目详情"
				onclick={() => player.close()}
			>
				<CoverImage episode={player.current} size="size-11 sm:size-12" />
			</a>

			<div class="min-w-0 flex-1">
				<p class="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
					No.{player.current.number}
					{player.current.title}
				</p>
				<div class="mt-1 hidden sm:block">
					<ProgressBar compact />
				</div>
				<div class="mt-0.5 sm:hidden">
					<ProgressBar compact />
				</div>
			</div>

			<div class="flex shrink-0 items-center gap-1">
				<button
					type="button"
					onclick={() => player.skip(-15)}
					class="rounded-full p-2 text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
					aria-label="后退 15 秒"
				>
					<svg
						class="size-5"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M11 4 4 8l7 4V4zM4 8v8" />
						<text x="13" y="16" font-size="8" fill="currentColor" stroke="none">15</text>
					</svg>
				</button>
				<button
					type="button"
					onclick={() => player.toggle()}
					class="rounded-full bg-indigo-600 p-2.5 text-white hover:bg-indigo-500"
					aria-label={player.paused ? '播放' : '暂停'}
				>
					{#if player.paused}
						<svg class="size-5" viewBox="0 0 24 24" fill="currentColor">
							<path
								d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86a1 1 0 0 0-1.5.86z"
							/>
						</svg>
					{:else}
						<svg class="size-5" viewBox="0 0 24 24" fill="currentColor">
							<path d="M7 4h4v16H7zM13 4h4v16h-4z" />
						</svg>
					{/if}
				</button>
				<button
					type="button"
					onclick={() => player.skip(15)}
					class="rounded-full p-2 text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
					aria-label="快进 15 秒"
				>
					<svg
						class="size-5"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M13 4l7 4-7 4V4zM20 8v8" />
						<text x="3" y="16" font-size="8" fill="currentColor" stroke="none">15</text>
					</svg>
				</button>
				<div class="hidden items-center gap-1 md:flex">
					<button
						type="button"
						onclick={() => player.toggleMute()}
						class="rounded-full p-2 text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
						aria-label={player.volume > 0 ? '静音' : '取消静音'}
					>
						{#if player.volume > 0}
							<svg class="size-5" viewBox="0 0 24 24" fill="currentColor">
								<path
									d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05a4.5 4.5 0 0 0 2.5-4.02zM14 3.23v2.06a7 7 0 0 1 0 13.42v2.06a9 9 0 0 0 0-17.54z"
								/>
							</svg>
						{:else}
							<svg class="size-5" viewBox="0 0 24 24" fill="currentColor">
								<path
									d="M3 9v6h4l5 5V4L7 9H3zm13.59 3 2.7-2.7-1.41-1.42-2.71 2.71-2.7-2.71-1.42 1.42 2.71 2.7-2.71 2.71 1.42 1.41 2.7-2.7 2.71 2.7 1.41-1.41-2.7-2.71z"
								/>
							</svg>
						{/if}
					</button>
					<input
						type="range"
						min="0"
						max="1"
						step="0.05"
						value={player.volume}
						oninput={(event) => player.setVolume(Number(event.currentTarget.value))}
						class="w-16 cursor-pointer accent-indigo-600"
						aria-label="音量"
					/>
				</div>
				<button
					type="button"
					onclick={() => player.cycleRate()}
					class="rounded-full px-2 py-1 text-xs font-medium text-neutral-600 tabular-nums hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
					aria-label="切换倍速"
				>
					{player.rate}x
				</button>
				<button
					type="button"
					onclick={() => player.close()}
					class="rounded-full p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-400"
					aria-label="关闭播放器"
				>
					<svg
						class="size-5"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12M18 6L6 18" />
					</svg>
				</button>
			</div>
		</div>
	</div>
{/if}
