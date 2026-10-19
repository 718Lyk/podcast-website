import { marked } from 'marked';

marked.setOptions({ gfm: true, async: false });

/**
 * 渲染节目 Shownotes Markdown 为 HTML，并把正文中的时间戳
 * （如 12:30 / 01:12:30）转换为可点击的章节跳转按钮。
 * 按钮本身不带事件，由详情页容器统一做事件委托调用 player.seek()。
 */
export function renderEpisodeBody(body: string): string {
	const html = marked.parse(body, { async: false }) as string;
	return html.replace(
		/(?<![\d:])(\d{1,2}:\d{2}(?::\d{2})?)(?![\d:])/g,
		'<button type="button" class="chapter-seek" data-seek="$1">$1</button>'
	);
}
