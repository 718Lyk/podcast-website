<script lang="ts">
	import type { Episode } from '#lib/content/types';

	let { episode, size = 'size-14' }: { episode: Episode; size?: string } = $props();

	let failed = $state(false);
	const showImg = $derived(episode.cover !== '' && !failed);
</script>

{#if showImg}
	<img
		src={episode.cover}
		alt="第 {episode.number} 期《{episode.title}》封面"
		width="256"
		height="256"
		loading="lazy"
		class="rounded-lg object-cover {size}"
		onerror={() => (failed = true)}
	/>
{:else}
	<!-- 封面缺失时的占位：品牌渐变 + 期号 -->
	<div
		class="flex {size} items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-700 text-white"
		aria-hidden="true"
	>
		<span class="text-lg font-bold tabular-nums sm:text-xl">No.{episode.number}</span>
	</div>
{/if}
