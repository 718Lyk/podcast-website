import { parse as parseYaml } from 'yaml';
import { episodeFrontmatterSchema } from './schema';
import type { Episode, EpisodeWithBody } from './types';

/** 构建期读取 content/episodes 下全部 Markdown 的原始文本 */
const rawFiles = import.meta.glob('../../../content/episodes/*.md', {
	eager: true,
	query: '?raw',
	import: 'default'
}) as Record<string, string>;

function splitFrontmatter(raw: string): { data: unknown; body: string } {
	const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw.trim());
	if (!match) {
		throw new Error('节目文件缺少 YAML frontmatter（应以 --- 包裹）');
	}
	return { data: parseYaml(match[1]), body: match[2].trim() };
}

/** 全部节目，按期号倒序 —— 全站唯一数据源 */
export const episodes: EpisodeWithBody[] = Object.entries(rawFiles)
	.map(([path, raw]) => {
		const { data, body } = splitFrontmatter(raw);
		const result = episodeFrontmatterSchema.safeParse(data);
		if (!result.success) {
			throw new Error(`节目数据校验失败：${path}\n${JSON.stringify(result.error.issues, null, 2)}`);
		}
		return { ...(result.data as Episode), body };
	})
	.sort((a, b) => b.number - a.number);

export function getEpisodes(): EpisodeWithBody[] {
	return episodes;
}

export function getLatestEpisode(): EpisodeWithBody | null {
	return episodes[0] ?? null;
}

export function getEpisode(slug: string): EpisodeWithBody | null {
	return episodes.find((episode) => episode.slug === slug) ?? null;
}

/** 上一期（更早）/ 下一期（更新） */
export function getAdjacentEpisodes(slug: string): { prev: Episode | null; next: Episode | null } {
	const index = episodes.findIndex((episode) => episode.slug === slug);
	if (index === -1) return { prev: null, next: null };
	return {
		prev: episodes[index + 1] ?? null,
		next: episodes[index - 1] ?? null
	};
}

export function getRelatedEpisodes(slug: string, limit = 3): EpisodeWithBody[] {
	const current = getEpisode(slug);
	if (!current) return [];
	return episodes
		.filter(
			(episode) => episode.slug !== slug && episode.tags.some((tag) => current.tags.includes(tag))
		)
		.slice(0, limit);
}

export function getAllTags(): { tag: string; count: number }[] {
	const counter = new Map<string, number>();
	for (const episode of episodes) {
		for (const tag of episode.tags) counter.set(tag, (counter.get(tag) ?? 0) + 1);
	}
	return [...counter.entries()]
		.map(([tag, count]) => ({ tag, count }))
		.sort((a, b) => b.count - a.count);
}

export function getEpisodesByTag(tag: string): EpisodeWithBody[] {
	return episodes.filter((episode) => episode.tags.includes(tag));
}
