/**
 * 站点级元信息与外部链接配置。
 * 全站的 SEO 标签、RSS、sitemap 都从这里取值，避免散落硬编码。
 */
export const site = {
	name: 'Web Worker 播客',
	slogan: '聊前端、AI 与开源的中文技术播客',
	description:
		'Web Worker 是一档面向前端工程师与泛程序员的中文播客，话题覆盖前端工程化、AI、开源社区与程序员职业发展。',
	url: 'https://podcast.webworker.fm',
	lang: 'zh-CN',
	author: 'Web Worker 团队',
	contactEmail: 'hi@webworker.fm',
	/** 播客在各平台的订阅地址（示例值，上线前替换为真实地址） */
	platforms: {
		xiaoyuzhou: 'https://www.xiaoyuzhoufm.com/podcast/example',
		applePodcasts: 'https://podcasts.apple.com/podcast/example',
		spotify: 'https://open.spotify.com/show/example',
		netease: 'https://music.163.com/#/program/example',
		bilibili: 'https://space.bilibili.com/example'
	}
} as const;

export type PlatformKey = keyof typeof site.platforms;
