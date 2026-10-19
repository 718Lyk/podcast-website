const PROGRESS_PREFIX = 'ww:progress:';

function isBrowser(): boolean {
	return typeof localStorage !== 'undefined';
}

/** 读取某期节目的播放进度（秒），无记录返回 null */
export function getProgress(slug: string): number | null {
	if (!isBrowser()) return null;
	const raw = localStorage.getItem(`${PROGRESS_PREFIX}${slug}`);
	if (!raw) return null;
	const value = Number(raw);
	return Number.isFinite(value) ? value : null;
}

/** 写入播放进度 */
export function saveProgress(slug: string, seconds: number): void {
	if (!isBrowser()) return;
	localStorage.setItem(`${PROGRESS_PREFIX}${slug}`, String(Math.floor(seconds)));
}

/** 清除播放进度 */
export function clearProgress(slug: string): void {
	if (!isBrowser()) return;
	localStorage.removeItem(`${PROGRESS_PREFIX}${slug}`);
}

const FAVORITES_KEY = 'ww:favorites';

/** 读取收藏的节目 slug 列表（新的在前） */
export function getFavorites(): string[] {
	if (!isBrowser()) return [];
	try {
		const raw = localStorage.getItem(FAVORITES_KEY);
		const parsed: unknown = raw ? JSON.parse(raw) : [];
		return Array.isArray(parsed)
			? parsed.filter((item): item is string => typeof item === 'string')
			: [];
	} catch {
		return [];
	}
}

/** 写入收藏列表 */
export function saveFavorites(slugs: string[]): void {
	if (!isBrowser()) return;
	localStorage.setItem(FAVORITES_KEY, JSON.stringify(slugs));
}

/** 读取数字型偏好（音量/倍速等），无记录或非法值返回 fallback */
export function getPref(key: string, fallback: number): number {
	if (!isBrowser()) return fallback;
	const value = Number(localStorage.getItem(key));
	return Number.isFinite(value) ? value : fallback;
}

/** 写入数字型偏好 */
export function savePref(key: string, value: number): void {
	if (!isBrowser()) return;
	localStorage.setItem(key, String(value));
}
