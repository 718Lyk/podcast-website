import { getEpisodes } from '#lib/content/episodes';
import { site } from '#lib/config/site';

export const prerender = true;

function escapeXml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

/** RSS 2.0 + iTunes 命名空间（Apple Podcasts 规范），构建期预渲染为静态文件 */
export function GET(): Response {
	const items = getEpisodes()
		.map((episode) => {
			const link = `${site.url}/episodes/${episode.slug}`;
			return `    <item>
      <title>${escapeXml(episode.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${new Date(episode.date).toUTCString()}</pubDate>
      <description>${escapeXml(episode.summary)}</description>
      <itunes:summary>${escapeXml(episode.summary)}</itunes:summary>
      <itunes:duration>${escapeXml(episode.duration)}</itunes:duration>
      <itunes:episode>${episode.number}</itunes:episode>
      <itunes:image href="${escapeXml(new URL(episode.cover, site.url).href)}"/>
      <enclosure url="${escapeXml(episode.audioUrl)}" type="${escapeXml(episode.audioType)}" length="${episode.audioSize}"/>
    </item>`;
		})
		.join('\n');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="https://podcasts.apple.com/au/summary" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(site.name)}</title>
    <link>${escapeXml(site.url)}</link>
    <atom:link href="${escapeXml(new URL('/feed.xml', site.url).href)}" rel="self" type="application/rss+xml"/>
    <language>${site.lang}</language>
    <description>${escapeXml(site.description)}</description>
    <itunes:author>${escapeXml(site.author)}</itunes:author>
    <itunes:summary>${escapeXml(site.description)}</itunes:summary>
    <itunes:type>episodic</itunes:type>
    <itunes:category text="Technology"/>
${items}
  </channel>
</rss>`;

	return new Response(xml, {
		headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' }
	});
}
