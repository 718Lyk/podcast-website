import { z } from 'zod';

export const chapterSchema = z.object({
	time: z.string(),
	title: z.string()
});

export const platformLinksSchema = z
	.object({
		xiaoyuzhou: z.string().optional(),
		applePodcasts: z.string().optional(),
		spotify: z.string().optional(),
		netease: z.string().optional(),
		bilibili: z.string().optional()
	})
	.default({});

/**
 * frontmatter 校验规则。
 * 脏数据（缺 audioUrl、期号非数字等）会在构建期直接让 build 失败。
 */
export const episodeFrontmatterSchema = z.object({
	number: z.number().int().positive(),
	slug: z.string().min(1),
	title: z.string().min(1),
	guests: z.array(z.string()).default([]),
	hosts: z.array(z.string()).default([]),
	date: z.string().min(1),
	duration: z.string().min(1),
	audioUrl: z.string().min(1),
	audioType: z.string().default('audio/mpeg'),
	audioSize: z.number().nonnegative().default(0),
	cover: z.string().default(''),
	tags: z.array(z.string()).default([]),
	summary: z.string().default(''),
	chapters: z.array(chapterSchema).default([]),
	platformLinks: platformLinksSchema
});

export type EpisodeFrontmatter = z.infer<typeof episodeFrontmatterSchema>;
