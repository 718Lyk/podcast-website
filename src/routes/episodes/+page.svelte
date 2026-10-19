<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { browser } from '$app/env';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import Seo from '#lib/components/seo/Seo.svelte';
	import EpisodeCard from '#lib/components/episode/EpisodeCard.svelte';
	import { getAllTags } from '#lib/content/episodes';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const episodes = $derived(data.episodes);
	const tags = $derived(getAllTags());

	// 筛选状态以 URL 为唯一真源：可分享、可后退，静态托管下零服务器成本。
	// 预渲染期 searchParams 不可用，构建期视为无筛选；shallow goto 只更新 page.shallow.url，
	// 真实导航后 shallow 为 null，故统一从 effectiveUrl 读取
	const effectiveUrl = $derived(page.shallow?.url ?? page.url);
	const q = $derived(browser ? (effectiveUrl.searchParams.get('q') ?? '') : '');
	const activeTag = $derived(browser ? (effectiveUrl.searchParams.get('tag') ?? '') : '');

	const PAGE_SIZE = 8;
	let visibleCount = $state(PAGE_SIZE);

	// 搜索词或标签变化时，从第一页重新展示
	$effect(() => {
		void q;
		void activeTag;
		visibleCount = PAGE_SIZE;
	});

	// 全站静态预渲染，搜索/筛选在浏览器端完成，无需任何网络请求
	const filtered = $derived.by(() => {
		const keyword = q.trim().toLowerCase();
		return episodes.filter((episode) => {
			if (activeTag && !episode.tags.includes(activeTag)) return false;
			if (!keyword) return true;
			return (
				episode.title.toLowerCase().includes(keyword) ||
				episode.summary.toLowerCase().includes(keyword) ||
				episode.tags.some((tag) => tag.toLowerCase().includes(keyword)) ||
				(episode.guests ?? []).some((guest) => guest.toLowerCase().includes(keyword))
			);
		});
	});

	const visible = $derived(filtered.slice(0, visibleCount));
	const remaining = $derived(filtered.length - visible.length);

	function setSearch(value: string) {
		const params = new SvelteURLSearchParams(effectiveUrl.searchParams.toString());
		if (value) params.set('q', value);
		else params.delete('q');
		const query = params.toString();
		// shallow：仅更新 URL 不触发导航/滚动/失焦，输入时零开销
		goto(resolve(query ? `/episodes?${query}` : '/episodes'), { replace: true, shallow: true });
	}

	/** 标签链接保留当前搜索词，便于组合筛选与分享 */
	function tagHref(tag: string) {
		const params = new SvelteURLSearchParams();
		if (q) params.set('q', q);
		if (tag) params.set('tag', tag);
		const query = params.toString();
		return resolve(query ? `/episodes?${query}` : '/episodes');
	}

	const pillIdle =
		'border border-neutral-200 bg-white text-neutral-600 hover:border-indigo-300 hover:text-indigo-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:border-indigo-700 dark:hover:text-indigo-400';
	const pillActive = 'bg-indigo-600 font-medium text-white';

	let inputEl: HTMLInputElement | undefined = $state();
	// 输入框以本地 DOM 为准（避免每个按键重渲染导致光标跳动）；仅在 q 因后退/前进变化时同步回来
	$effect(() => {
		if (inputEl && inputEl.value !== q) inputEl.value = q;
	});

	let sentinelEl: HTMLDivElement | undefined = $state();
	// 无限滚动：哨兵进入视口自动加载下一页；列表为空或已全部展示时哨兵不渲染
	$effect(() => {
		const el = sentinelEl;
		if (!el) return;
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting) && remaining > 0) {
					visibleCount += PAGE_SIZE;
				}
			},
			{ rootMargin: '240px 0px' }
		);
		observer.observe(el);
		return () => observer.disconnect();
	});
</script>

<Seo
	title="全部节目"
	description="Web Worker 播客全部节目列表：AI、前端工程化、开源社区与程序员职业发展等话题的历史节目归档。"
	path="/episodes"
/>

<header>
	<h1 class="text-2xl font-bold text-neutral-900 sm:text-3xl dark:text-neutral-100">全部节目</h1>
	<p class="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
		{#if q || activeTag}
			筛选出 {filtered.length} 期（共 {episodes.length} 期）
		{:else}
			共 {episodes.length} 期，按期号倒序排列。
		{/if}
	</p>
</header>

<!-- 搜索框 -->
<div class="mt-6">
	<label class="sr-only" for="episode-search">搜索节目</label>
	<div class="relative">
		<svg
			class="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-neutral-400"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			aria-hidden="true"
		>
			<circle cx="11" cy="11" r="7" />
			<path d="m21 21-4.3-4.3" />
		</svg>
		<input
			id="episode-search"
			type="search"
			bind:this={inputEl}
			oninput={(event) => setSearch(event.currentTarget.value)}
			placeholder="搜索标题、简介、嘉宾或标签…"
			autocomplete="off"
			spellcheck="false"
			class="w-full rounded-full border border-neutral-300 bg-white py-2.5 pr-4 pl-10 text-sm text-neutral-900 transition placeholder:text-neutral-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-indigo-400"
		/>
	</div>
</div>

<!-- 标签筛选（链接式：保留搜索词，可后退可分享） -->
<div class="mt-4 flex flex-wrap items-center gap-2">
	<a
		href={tagHref('')}
		aria-current={activeTag === '' ? 'true' : undefined}
		class="rounded-full px-3 py-1.5 text-sm transition {activeTag === '' ? pillActive : pillIdle}"
	>
		全部
	</a>
	{#each tags as { tag, count } (tag)}
		<a
			href={tagHref(tag)}
			aria-current={activeTag === tag ? 'true' : undefined}
			class="rounded-full px-3 py-1.5 text-sm transition {activeTag === tag
				? pillActive
				: pillIdle}"
		>
			{tag}
			<span class="ml-1 text-xs opacity-60">{count}</span>
		</a>
	{/each}
</div>

<!-- 节目列表 -->
<div class="mt-6 grid gap-4 lg:grid-cols-2">
	{#each visible as episode (episode.slug)}
		<EpisodeCard {episode} />
	{:else}
		<div
			class="col-span-full rounded-xl border border-dashed border-neutral-300 bg-white p-10 text-center dark:border-neutral-700 dark:bg-neutral-900"
		>
			<p class="text-sm font-medium text-neutral-700 dark:text-neutral-300">没有找到匹配的节目</p>
			<p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
				试试更换关键词，或
				<a href={resolve('/episodes')} class="text-indigo-700 hover:underline dark:text-indigo-400"
					>清除全部筛选</a
				>
			</p>
		</div>
	{/each}
</div>

<!-- 无限滚动哨兵 + 兜底按钮 -->
{#if remaining > 0}
	<div bind:this={sentinelEl} class="h-px" aria-hidden="true"></div>
	<div class="mt-6 text-center">
		<button
			type="button"
			onclick={() => (visibleCount += PAGE_SIZE)}
			class="rounded-full border border-neutral-300 bg-white px-5 py-2 text-sm font-medium text-neutral-700 transition hover:border-indigo-300 hover:text-indigo-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-indigo-700 dark:hover:text-indigo-400"
		>
			加载更多（还有 {remaining} 期）
		</button>
	</div>
{:else if filtered.length > PAGE_SIZE}
	<p class="mt-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
		已显示全部 {filtered.length} 期节目
	</p>
{/if}
