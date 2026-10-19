/** 把 "01:12:30" / "12:30" 这类时间戳解析为秒数 */
export function timestampToSeconds(value: string): number {
	const parts = value.split(':').map((part) => Number(part));
	if (parts.some((n) => Number.isNaN(n))) return 0;
	return parts.reduce((total, part) => total * 60 + part, 0);
}

/** 把秒数格式化为 "mm:ss" 或 "hh:mm:ss" */
export function formatSeconds(totalSeconds: number): string {
	if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return '00:00';
	const seconds = Math.floor(totalSeconds % 60);
	const minutes = Math.floor((totalSeconds / 60) % 60);
	const hours = Math.floor(totalSeconds / 3600);
	const pad = (n: number) => String(n).padStart(2, '0');
	return hours > 0
		? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
		: `${pad(minutes)}:${pad(seconds)}`;
}

/** 格式化发布日期，默认中文，也可传入其他 locale */
export function formatDate(iso: string, locale = 'zh-CN'): string {
	const date = new Date(iso);
	if (Number.isNaN(date.getTime())) return iso;
	return new Intl.DateTimeFormat(locale, {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	}).format(date);
}

/** 把 "01:12:30" 转为 ISO 8601 时长（PT1H12M30S），schema.org / JSON-LD 用 */
export function durationToIso8601(duration: string): string {
	const parts = duration.split(':').map((part) => Number(part));
	if (parts.some((n) => Number.isNaN(n))) return '';
	const [hours, minutes, seconds] = parts.length === 3 ? parts : [0, ...parts];
	let out = 'PT';
	if (hours) out += `${hours}H`;
	if (minutes) out += `${minutes}M`;
	if (seconds) out += `${seconds}S`;
	return out === 'PT' ? '' : out;
}

/** 文件体积可读化 */
export function formatFileSize(bytes: number): string {
	if (!bytes) return '';
	const units = ['B', 'KB', 'MB', 'GB'];
	let value = bytes;
	let unitIndex = 0;
	while (value >= 1024 && unitIndex < units.length - 1) {
		value /= 1024;
		unitIndex += 1;
	}
	return `${value.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}
