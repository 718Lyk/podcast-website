<script lang="ts">
	import { site } from '#lib/config/site';
	import Seo from '#lib/components/seo/Seo.svelte';

	const hosts = [
		{
			name: '辛宝',
			intro: '播客主理人之一，前端工程师，也记录"程序员爸爸"的育娃日常与生活支线。'
		},
		{
			name: 'Smart',
			intro: '播客主理人之一，关注 AI 与工程效率，负责把技术话题聊成人话。'
		}
	];

	const topics = ['AI 与大模型', '前端工程化', '开源社区', '程序员职业发展', '技术人的工作与生活'];
</script>

<Seo
	title="关于播客"
	description="关于 Web Worker 播客：一档面向前端工程师与泛程序员的中文技术播客，了解主播与联系方式。"
	path="/about"
/>

<h1 class="text-2xl font-bold text-neutral-900 sm:text-3xl dark:text-neutral-100">
	关于 {site.name}
</h1>

<section
	class="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 dark:border-neutral-800 dark:bg-neutral-900"
>
	<h2 class="text-lg font-bold text-neutral-900 dark:text-neutral-100">我们是</h2>
	<p class="mt-3 leading-7 text-neutral-700 dark:text-neutral-300">{site.description}</p>
	<p class="mt-3 leading-7 text-neutral-700 dark:text-neutral-300">
		节目会邀请一线工程师与开源作者做客，聊具体的工程实践与真实经历——既有硬核的技术深潜，也有轻松的行业八卦。适合在通勤、写代码、做家务时收听。
	</p>
</section>

<section
	class="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 dark:border-neutral-800 dark:bg-neutral-900"
>
	<h2 class="text-lg font-bold text-neutral-900 dark:text-neutral-100">常聊话题</h2>
	<div class="mt-3 flex flex-wrap gap-2">
		{#each topics as topic (topic)}
			<span
				class="rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400"
				>{topic}</span
			>
		{/each}
	</div>
</section>

<section
	class="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 dark:border-neutral-800 dark:bg-neutral-900"
>
	<h2 class="text-lg font-bold text-neutral-900 dark:text-neutral-100">主播</h2>
	<div class="mt-4 grid gap-4 sm:grid-cols-2">
		{#each hosts as host (host.name)}
			<div class="rounded-xl bg-neutral-50 p-4 dark:bg-neutral-900/50">
				<p class="font-semibold text-neutral-900 dark:text-neutral-100">{host.name}</p>
				<p class="mt-1 text-sm leading-6 text-neutral-600 dark:text-neutral-400">{host.intro}</p>
			</div>
		{/each}
	</div>
</section>

<section
	class="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 dark:border-neutral-800 dark:bg-neutral-900"
>
	<h2 class="text-lg font-bold text-neutral-900 dark:text-neutral-100">联系与合作</h2>
	<p class="mt-3 leading-7 text-neutral-700 dark:text-neutral-300">
		想来做嘉宾、商务合作或单纯聊聊技术？欢迎写信到
		<a
			href="mailto:{site.contactEmail}"
			class="text-indigo-700 underline decoration-indigo-200 underline-offset-2 hover:decoration-indigo-500 dark:text-indigo-400 dark:decoration-indigo-800"
		>
			{site.contactEmail}
		</a>。
	</p>
</section>
