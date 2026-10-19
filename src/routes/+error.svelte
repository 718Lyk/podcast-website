<script lang="ts">
	import { page } from '$app/state';
	import Button from '#lib/components/ui/Button.svelte';
</script>

<section class="mx-auto max-w-5xl px-4 py-20 text-center">
	<p class="text-sm text-neutral-500 dark:text-neutral-400">错误 {page.status}</p>
	<h1 class="mt-2 text-2xl font-bold">页面走丢了</h1>
	<p class="mt-2 text-neutral-600 dark:text-neutral-400">
		{page.error?.message ?? '找不到你要访问的内容。'}
	</p>
	<div class="mt-6 flex justify-center gap-3">
		<Button href="/">返回首页</Button>
		<Button href="/episodes" variant="secondary">浏览节目</Button>
	</div>
</section>
