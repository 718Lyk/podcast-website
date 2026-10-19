import { getEpisodes } from '#lib/content/episodes';
import type { PageLoad } from './$types';

export const load: PageLoad = () => {
	// 去掉 body 正文，避免全量 Shownotes 进入客户端 payload
	const episodes = getEpisodes().map(({ body: _body, ...episode }) => episode);
	return { episodes };
};
