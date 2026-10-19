<script lang="ts">
	import { getEpisodes } from '#lib/content/episodes';
	import { site } from '#lib/config/site';
	import Seo from '#lib/components/seo/Seo.svelte';
	import JsonLd from '#lib/components/seo/JsonLd.svelte';
	import EpisodeCard from '#lib/components/episode/EpisodeCard.svelte';
	import PlatformLinks from '#lib/components/episode/PlatformLinks.svelte';

	const episodes = getEpisodes();
	const [latest, ...rest] = episodes;
	const restOnHome = rest.slice(0, 4);

	const hosts = [
		{
			initial: '辛',
			name: '辛宝',
			role: '主播 · 前端工程师',
			bio: '开源项目维护者，关注前端工程化与技术社区，也聊聊程序员的职业选择。'
		},
		{
			initial: 'S',
			name: 'Smart',
			role: '主播 · 技术管理者',
			bio: '在 AI 与研发效能的交界处做产品，既聊得动技术，也聊得动团队。'
		}
	];

	const podcastJsonLd: Record<string, unknown> = {
		'@context': 'https://schema.org',
		'@type': 'PodcastSeries',
		name: site.name,
		description: site.description,
		url: site.url,
		inLanguage: site.lang,
		author: hosts.map((host) => ({ '@type': 'Person', name: host.name }))
	};
</script>

<Seo title={site.name} description={site.description} path="/" />
<JsonLd data={podcastJsonLd} />

<!-- 品牌区 Hero -->
<section
	class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-700 to-fuchsia-700 px-6 py-12 text-white sm:px-10 sm:py-16"
>
	<!-- 装饰性光斑，纯视觉 -->
	<div
		class="pointer-events-none absolute -top-20 -right-16 size-64 rounded-full bg-white/10 blur-3xl"
		aria-hidden="true"
	></div>
	<div
		class="pointer-events-none absolute -bottom-24 -left-10 size-72 rounded-full bg-fuchsia-400/20 blur-3xl"
		aria-hidden="true"
	></div>

	<div class="relative">
		<p class="flex items-center gap-2 text-sm font-medium tracking-wide text-indigo-200">
			<svg class="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
				<path
					d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2z"
				/>
			</svg>
			{site.slogan}
		</p>
		<h1 class="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">{site.name}</h1>
		<p class="mt-4 max-w-2xl text-sm leading-7 text-indigo-100 sm:text-base">
			{site.description}
			这里既有最前沿的技术话题，也有程序员真实的工作与生活。
		</p>
		<div class="mt-7 flex flex-wrap items-center gap-3">
			<a
				href="#latest"
				class="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-indigo-700 shadow-lg shadow-indigo-900/20 transition hover:bg-indigo-50"
			>
				收听最新一期
			</a>
			<a
				href="/subscribe"
				class="rounded-full border border-white/40 px-5 py-2.5 text-sm font-medium text-white transition hover:border-white hover:bg-white/10"
			>
				订阅指南
			</a>
		</div>
		<div class="mt-6 flex flex-wrap items-center gap-2">
			<span class="text-xs text-indigo-200">在以下平台收听：</span>
			<PlatformLinks links={site.platforms} />
		</div>
	</div>
</section>

<!-- 最新一期 -->
{#if latest}
	<section class="mt-10 scroll-mt-20" id="latest" aria-labelledby="latest-heading">
		<div class="flex items-center justify-between">
			<h2 id="latest-heading" class="text-lg font-bold text-neutral-900 dark:text-neutral-100">
				最新一期
			</h2>
			<a href="/episodes" class="text-sm text-indigo-700 hover:underline dark:text-indigo-400"
				>全部节目 →</a
			>
		</div>
		<div class="mt-4">
			<EpisodeCard episode={latest} featured />
		</div>
	</section>
{/if}

<!-- 往期节目 -->
{#if restOnHome.length > 0}
	<section class="mt-10" aria-labelledby="recent-heading">
		<h2 id="recent-heading" class="text-lg font-bold text-neutral-900 dark:text-neutral-100">
			往期节目
		</h2>
		<div class="mt-4 grid gap-4 md:grid-cols-2">
			{#each restOnHome as episode (episode.slug)}
				<EpisodeCard {episode} />
			{/each}
		</div>
		<div class="mt-6 text-center">
			<a
				href="/episodes"
				class="inline-block rounded-full border border-neutral-300 bg-white px-5 py-2 text-sm font-medium text-neutral-700 transition hover:border-indigo-300 hover:text-indigo-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-indigo-700 dark:hover:text-indigo-400"
			>
				浏览全部 {episodes.length} 期节目
			</a>
		</div>
	</section>
{/if}

<!-- 关于主播 -->
<section class="mt-10" aria-labelledby="hosts-heading">
	<div class="flex items-center justify-between">
		<h2 id="hosts-heading" class="text-lg font-bold text-neutral-900 dark:text-neutral-100">
			关于主播
		</h2>
		<a href="/about" class="text-sm text-indigo-700 hover:underline dark:text-indigo-400"
			>了解更多 →</a
		>
	</div>
	<div class="mt-4 grid gap-4 sm:grid-cols-2">
		{#each hosts as host (host.name)}
			<article
				class="flex gap-4 rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
			>
				<span
					class="flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-700 text-lg font-bold text-white"
					aria-hidden="true"
				>
					{host.initial}
				</span>
				<div>
					<h3 class="font-semibold text-neutral-900 dark:text-neutral-100">{host.name}</h3>
					<p class="mt-0.5 text-xs text-indigo-700 dark:text-indigo-400">{host.role}</p>
					<p class="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-400">{host.bio}</p>
				</div>
			</article>
		{/each}
	</div>
</section>

<!-- 订阅引导 -->
<section
	class="mt-10 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 dark:border-neutral-800 dark:bg-neutral-900"
	aria-labelledby="subscribe-heading"
>
	<h2 id="subscribe-heading" class="text-lg font-bold text-neutral-900 dark:text-neutral-100">
		订阅播客
	</h2>
	<p class="mt-2 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-400">
		把 RSS 地址粘贴到任意播客客户端（小宇宙、Apple Podcasts、Overcast、Pocket Casts
		等），新节目发布后会自动推送到你的订阅列表。
	</p>
	<div class="mt-4 flex flex-wrap items-center gap-3">
		<a
			href="/subscribe"
			class="rounded-full bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
		>
			查看订阅指南
		</a>
		<a href="/feed.xml" class="text-sm text-indigo-700 hover:underline dark:text-indigo-400"
			>直接复制 RSS 地址</a
		>
	</div>
</section>
