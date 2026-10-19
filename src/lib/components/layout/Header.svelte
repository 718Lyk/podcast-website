<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import { site } from '#lib/config/site';
	import { theme } from '#lib/components/theme/theme.svelte';

	// resolve() 自动补部署子路径（paths.base），内部链接一律经它生成
	const home = resolve('/');
	const navItems = [
		{ href: home, label: '首页' },
		{ href: resolve('/episodes'), label: '节目' },
		{ href: resolve('/favorites'), label: '收藏' },
		{ href: resolve('/subscribe'), label: '订阅' },
		{ href: resolve('/about'), label: '关于' }
	];

	const isActive = (href: string) =>
		href === home ? page.url.pathname === home : page.url.pathname.startsWith(href);

	onMount(() => theme.init());
</script>

<header class="border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
	<div
		class="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3 sm:px-6"
	>
		<a href={home} class="flex items-center gap-2.5">
			<span
				class="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-700 text-sm font-bold text-white"
				aria-hidden="true"
			>
				WW
			</span>
			<span class="leading-tight">
				<span class="block font-bold text-neutral-900 dark:text-neutral-100">{site.name}</span>
				<span class="hidden text-xs text-neutral-500 sm:block dark:text-neutral-400"
					>{site.slogan}</span
				>
			</span>
		</a>

		<nav aria-label="主导航">
			<ul class="flex items-center gap-1 text-sm">
				{#each navItems as item (item.href)}
					<li>
						<a
							href={item.href}
							aria-current={isActive(item.href) ? 'page' : undefined}
							class="rounded-full px-3 py-1.5 transition {isActive(item.href)
								? 'bg-indigo-50 font-medium text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400'
								: 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100'}"
						>
							{item.label}
						</a>
					</li>
				{/each}
				<li class="hidden sm:block">
					<a
						href={resolve('/feed.xml')}
						class="rounded-full p-2 text-neutral-500 transition hover:bg-neutral-100 hover:text-indigo-700 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-indigo-400"
						aria-label="RSS 订阅"
						title="RSS 订阅"
					>
						<svg class="size-4" viewBox="0 0 24 24" fill="currentColor">
							<path
								d="M6.18 17.82a2.18 2.18 0 1 1-4.36 0 2.18 2.18 0 0 1 4.36 0zM1.82 8.91v3.27c5.42 0 9.82 4.4 9.82 9.82h3.27c0-7.23-5.86-13.09-13.09-13.09zM1.82 2.36v3.27c9.05 0 16.37 7.33 16.37 16.37h3.27C21.45 11.15 12.67 2.36 1.82 2.36z"
							/>
						</svg>
					</a>
				</li>
				<li>
					<button
						type="button"
						onclick={() => theme.toggle()}
						class="rounded-full p-2 text-neutral-500 transition hover:bg-neutral-100 hover:text-indigo-700 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-indigo-400"
						aria-label={theme.current === 'dark' ? '切换到浅色模式' : '切换到深色模式'}
					>
						{#if theme.current === 'dark'}
							<svg
								class="size-4"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
							>
								<circle cx="12" cy="12" r="4" />
								<path
									d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.3 11.3 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.3-11.3 1.4-1.4"
								/>
							</svg>
						{:else}
							<svg class="size-4" viewBox="0 0 24 24" fill="currentColor">
								<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
							</svg>
						{/if}
					</button>
				</li>
			</ul>
		</nav>
	</div>
</header>
