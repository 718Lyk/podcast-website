<script lang="ts">
	import { page } from '$app/state';
	import { site } from '#lib/config/site';
	import { absoluteUrl } from '#lib/utils/url';

	let {
		title,
		description = site.description,
		path = page.url.pathname,
		image
	}: { title: string; description?: string; path?: string; image?: string } = $props();

	const fullTitle = $derived(title === site.name ? title : `${title} | ${site.name}`);
	const url = $derived(absoluteUrl(path));
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={url} />

	<meta property="og:site_name" content={site.name} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={url} />
	<meta property="og:type" content="website" />
	<meta property="og:locale" content={site.lang} />
	{#if image}
		<meta property="og:image" content={absoluteUrl(image)} />
	{/if}

	<meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
</svelte:head>
