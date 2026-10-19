import { getFavorites, saveFavorites } from '#lib/utils/storage';

/**
 * 收藏状态单例：与播放器同一模式。
 * 任何组件 import { favorites } 即共享同一份响应式状态，
 * 变更时自动持久化到 localStorage。
 */
class FavoritesState {
	#slugs = $state<string[]>(getFavorites());

	/** 收藏的节目 slug 列表（新的在前） */
	get slugs(): string[] {
		return this.#slugs;
	}

	get count(): number {
		return this.#slugs.length;
	}

	has(slug: string): boolean {
		return this.#slugs.includes(slug);
	}

	toggle(slug: string): void {
		this.#slugs = this.has(slug)
			? this.#slugs.filter((item) => item !== slug)
			: [slug, ...this.#slugs];
		saveFavorites(this.#slugs);
	}
}

export const favorites = new FavoritesState();
