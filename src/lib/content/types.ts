/** 节目时间轴章节 */
export interface Chapter {
	time: string;
	title: string;
}

/** 各播客平台的跳转地址 */
export interface PlatformLinks {
	xiaoyuzhou?: string;
	applePodcasts?: string;
	spotify?: string;
	netease?: string;
	bilibili?: string;
}

/** 一集节目的结构化数据（全站唯一事实标准） */
export interface Episode {
	number: number;
	slug: string;
	title: string;
	guests: string[];
	hosts: string[];
	date: string;
	duration: string;
	audioUrl: string;
	audioType: string;
	audioSize: number;
	cover: string;
	tags: string[];
	summary: string;
	chapters: Chapter[];
	platformLinks: PlatformLinks;
}

/** 带 Shownotes 正文的节目（详情页使用） */
export interface EpisodeWithBody extends Episode {
	/** Shownotes 正文（Markdown 原文） */
	body: string;
}
