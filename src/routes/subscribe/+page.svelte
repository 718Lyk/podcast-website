<script lang="ts">
	import { site } from '#lib/config/site';
	import { absoluteUrl } from '#lib/utils/url';
	import Seo from '#lib/components/seo/Seo.svelte';
	import PlatformLinks from '#lib/components/episode/PlatformLinks.svelte';

	const feedUrl = absoluteUrl('/feed.xml');

	let copied = $state(false);

	async function copyFeed() {
		await navigator.clipboard.writeText(feedUrl);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}

	const clients = [
		{ name: '小宇宙', tip: `搜索「${site.name}」或点击下方平台链接直接跳转` },
		{ name: 'Apple Podcasts', tip: '点击平台链接一键订阅' },
		{ name: 'Overcast / Pocket Casts', tip: '粘贴 RSS 地址即可添加' },
		{ name: '通用播放器', tip: '任何支持 RSS 的播客客户端都能订阅本节目' }
	];
</script>

<Seo
	title="订阅指南"
	description="订阅 Web Worker 播客：RSS 地址与小宇宙、Apple Podcasts、Spotify、网易云音乐、B站各平台一键跳转。"
	path="/subscribe"
/>

<h1 class="text-2xl font-bold text-neutral-900 sm:text-3xl dark:text-neutral-100">订阅指南</h1>
<p class="mt-2 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-400">
	在任意播客客户端订阅后，新节目上线会自动推送到你，无需反复打开网站。
</p>

<!-- RSS -->
<section
	class="mt-8 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900"
	aria-labelledby="rss-heading"
>
	<h2 id="rss-heading" class="text-lg font-bold text-neutral-900 dark:text-neutral-100">
		RSS 订阅
	</h2>
	<p class="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
		复制下面的地址，粘贴到任意播客客户端：
	</p>
	<div class="mt-4 flex flex-col gap-2 sm:flex-row">
		<code
			class="flex-1 truncate rounded-lg bg-neutral-100 px-4 py-3 font-mono text-sm text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200"
		>
			{feedUrl}
		</code>
		<button
			type="button"
			onclick={copyFeed}
			class="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-500 sm:w-28"
		>
			{copied ? '已复制 ✓' : '复制'}
		</button>
	</div>
</section>

<!-- 平台订阅 -->
<section
	class="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900"
	aria-labelledby="platform-heading"
>
	<h2 id="platform-heading" class="text-lg font-bold text-neutral-900 dark:text-neutral-100">
		平台一键订阅
	</h2>
	<div class="mt-4">
		<PlatformLinks links={site.platforms} />
	</div>
</section>

<!-- 客户端说明 -->
<section
	class="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900"
	aria-labelledby="client-heading"
>
	<h2 id="client-heading" class="text-lg font-bold text-neutral-900 dark:text-neutral-100">
		常用客户端
	</h2>
	<ul class="mt-4 space-y-3">
		{#each clients as client (client.name)}
			<li class="flex items-start gap-3 text-sm">
				<span class="mt-1 size-1.5 shrink-0 rounded-full bg-indigo-500" aria-hidden="true"></span>
				<span
					><strong class="text-neutral-900 dark:text-neutral-100">{client.name}</strong>
					<span class="text-neutral-600 dark:text-neutral-400"> — {client.tip}</span></span
				>
			</li>
		{/each}
	</ul>
</section>
