<script lang="ts">
	import { resolve } from '$app/paths';
	import { site } from '#lib/config/site';

	const year = new Date().getFullYear();
</script>

<footer class="border-t border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
	<div class="mx-auto max-w-5xl px-4 py-8 sm:px-6">
		<div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
			<div>
				<p class="font-semibold text-neutral-900 dark:text-neutral-100">{site.name}</p>
				<p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{site.slogan}</p>
			</div>
			<div
				class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral-500 dark:text-neutral-400"
			>
				<a href={resolve('/feed.xml')} class="hover:text-indigo-700 dark:hover:text-indigo-400"
					>RSS Feed</a
				>
				<a href={resolve('/subscribe')} class="hover:text-indigo-700 dark:hover:text-indigo-400"
					>订阅指南</a
				>
				<a
					href="mailto:{site.contactEmail}"
					class="hover:text-indigo-700 dark:hover:text-indigo-400">联系我们</a
				>
			</div>
		</div>
		<p
			class="mt-6 border-t border-neutral-100 pt-4 text-xs text-neutral-400 dark:border-neutral-800 dark:text-neutral-500"
		>
			© {year}
			{site.author} · 用 SvelteKit 构建，全站静态渲染
		</p>
	</div>
</footer>
