import { getAllTags, getEpisodesByTag } from '#lib/content/episodes';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => getAllTags().map(({ tag }) => ({ tag }));

export const load: PageLoad = ({ params }) => {
	const tag = decodeURIComponent(params.tag);
	// 去掉 body 正文，避免全量 Shownotes 进入客户端 payload
	const episodes = getEpisodesByTag(tag).map(({ body: _body, ...episode }) => episode);
	return { tag, episodes };
};
