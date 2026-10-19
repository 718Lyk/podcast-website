<script lang="ts">
	let { data }: { data: Record<string, unknown> } = $props();

	// 转义 < 避免 JSON 内容中的标签干扰 HTML 解析
	const json = $derived(JSON.stringify(data).replace(/</g, '\\u003c'));
	// 闭合标签用字符串拼接，避免源码中出现会截断 script 的结束标记
	const tag = $derived(`<script type="application/ld+json">${json}<` + `/script>`);
</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html tag}
</svelte:head>
