import { site } from '#lib/config/site';

/**
 * 路径 → 绝对 URL。
 * site.url 含完整子路径（与 vite.config.ts 的 paths.base 保持一致），
 * 供 canonical、og:image、RSS、sitemap 等构建期 SEO 输出使用；
 * 页面内的 <a> 链接请用 $app/paths 的 resolve()，静态资源用 asset()。
 */
export function absoluteUrl(path: string): string {
	const suffix = path === '/' ? '/' : path.startsWith('/') ? path : `/${path}`;
	return `${site.url}${suffix}`;
}
