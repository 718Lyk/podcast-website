import { error } from '@sveltejs/kit';
import {
	getAdjacentEpisodes,
	getEpisode,
	getRelatedEpisodes,
	getEpisodes
} from '#lib/content/episodes';
import { renderEpisodeBody } from '#lib/utils/markdown';
import type { PageLoad } from './$types';

/** adapter-static 枚举全部详情页路径 */
export const entries = () => getEpisodes().map((episode) => ({ slug: episode.slug }));

export const load: PageLoad = ({ params }) => {
	const found = getEpisode(params.slug);
	if (!found) error(404, '节目不存在');

	// body 已渲染为 HTML，不进客户端 payload
	const { body, ...episode } = found;
	const { prev, next } = getAdjacentEpisodes(params.slug);

	return {
		episode,
		bodyHtml: renderEpisodeBody(body),
		prev,
		next,
		related: getRelatedEpisodes(params.slug)
	};
};
