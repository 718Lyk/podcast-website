import { getEpisodes } from '#lib/content/episodes';
import { absoluteUrl } from '#lib/utils/url';

export const prerender = true;

/** 全站 sitemap：静态页 + 全部节目详情页，构建期预渲染 */
export function GET(): Response {
	const episodes = getEpisodes();
	const lastmod = episodes[0]?.date ?? new Date().toISOString().slice(0, 10);

	const staticPages = ['/', '/episodes', '/subscribe', '/about'];
	const urls = [
		...staticPages.map(
			(path) => `  <url>
    <loc>${absoluteUrl(path)}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`
		),
		...episodes.map(
			(episode) => `  <url>
    <loc>${absoluteUrl(`/episodes/${episode.slug}`)}</loc>
    <lastmod>${episode.date}</lastmod>
  </url>`
		)
	].join('\n');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

	return new Response(xml, {
		headers: { 'Content-Type': 'application/xml; charset=utf-8' }
	});
}
