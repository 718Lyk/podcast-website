/**
 * 主题状态单例：与 <html> 的 .dark 类保持同步。
 * 初始类由 app.html 内联脚本在首帧前设置（localStorage 'ww:theme' 或系统偏好）。
 */
export type Theme = 'light' | 'dark';

class ThemeState {
	current = $state<Theme>('light');

	/** 水合后调用，让 UI 图标与实际主题对齐 */
	init() {
		this.current = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
	}

	toggle() {
		const next: Theme = this.current === 'dark' ? 'light' : 'dark';
		this.current = next;
		document.documentElement.classList.toggle('dark', next === 'dark');
		try {
			localStorage.setItem('ww:theme', next);
		} catch {
			/* 隐私模式下忽略 */
		}
	}
}

export const theme = new ThemeState();
