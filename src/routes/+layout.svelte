<script lang="ts">
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';
	import { site } from '#lib/config/site';
	import { absoluteUrl } from '#lib/utils/url';
	import Header from '#lib/components/layout/Header.svelte';
	import Footer from '#lib/components/layout/Footer.svelte';
	import PlayerHost from '#lib/components/player/PlayerHost.svelte';
	import MiniPlayer from '#lib/components/player/MiniPlayer.svelte';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	// RSS 自动发现：阅读器与搜索引擎可直接识别 feed 地址
	const feedUrl = absoluteUrl('/feed.xml');
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="theme-color" content="#4f46e5" />
	<link rel="alternate" type="application/rss+xml" title={site.name} href={feedUrl} />
</svelte:head>

<div class="flex min-h-screen flex-col">
	<Header />
	<!-- pb-24 为底部固定的 MiniPlayer 预留空间 -->
	<main class="mx-auto w-full max-w-5xl flex-1 px-4 py-8 pb-24 sm:px-6 sm:py-10 sm:pb-24">
		{@render children()}
	</main>
	<Footer />
</div>

<!-- 全局播放器挂载点：在 layout 中，路由切换不销毁，播放不中断 -->
<PlayerHost />
<MiniPlayer />
