import type { Episode } from '#lib/content/types';
import { clearProgress, getProgress, savePref, saveProgress } from '#lib/utils/storage';

/** 倍速档位（循环切换） */
export const RATES = [0.75, 1, 1.25, 1.5, 2] as const;

/**
 * 全局播放器状态（Svelte 5 Runes）—— 播放相关状态的唯一来源。
 * 规则：所有 UI 组件只读写这里的状态，禁止直接操作 audio 元素。
 * audio 元素由 PlayerHost 挂在根 layout，路由切换不销毁，播放不中断。
 */
class PlayerState {
	current = $state<Episode | null>(null);
	/** 与 audio.paused 同步（bind:paused） */
	paused = $state(true);
	time = $state(0);
	duration = $state(0);
	rate = $state(1);
	/** 0～1，由 PlayerHost 通过 bind:volume 同步到 audio */
	volume = $state(1);
	/** 最近一次非静音音量，取消静音时恢复用（非响应式） */
	#lastVolume = 1;

	/** 由 PlayerHost 通过 bind:this 注入；非响应式 */
	audio: HTMLAudioElement | null = null;

	/** 播放某期节目；若已在播该期则切换暂停 */
	play(episode: Episode) {
		const audio = this.audio;
		if (!audio) return;
		if (this.current?.slug === episode.slug) {
			this.toggle();
			return;
		}
		this.current = episode;
		this.time = 0;
		this.duration = 0;
		this.paused = false;

		audio.src = episode.audioUrl;
		audio.playbackRate = this.rate;

		// 恢复上次播放进度（超过 30 秒才恢复）
		const saved = getProgress(episode.slug);
		if (saved && saved > 30) {
			const restore = () => {
				audio.currentTime = saved;
				audio.removeEventListener('loadedmetadata', restore);
			};
			audio.addEventListener('loadedmetadata', restore);
		}

		void audio.play().catch(() => {
			// 移动端必须用户手势触发；play 本身都由点击发起，失败时静默
			this.paused = true;
		});
	}

	toggle() {
		const audio = this.audio;
		if (!audio || !this.current) return;
		if (audio.paused) void audio.play();
		else audio.pause();
	}

	seek(seconds: number) {
		if (!this.audio || !this.current) return;
		this.audio.currentTime = seconds;
		this.time = seconds;
	}

	/** 跳转到指定节目的指定位置；尚未加载该期时自动开播（章节点击入口） */
	seekTo(episode: Episode, seconds: number) {
		const audio = this.audio;
		if (!audio) return;
		if (this.current?.slug !== episode.slug) this.play(episode);

		// src 刚变更时元数据未加载，直接设 currentTime 会被重置 → 挂 loadedmetadata 兜底
		const apply = () => {
			audio.currentTime = seconds;
			audio.removeEventListener('loadedmetadata', apply);
		};
		if (audio.readyState >= HTMLMediaElement.HAVE_METADATA) {
			apply();
		} else {
			audio.addEventListener('loadedmetadata', apply);
		}
		this.time = seconds;
	}

	/** 快进快退，秒数可正可负 */
	skip(delta: number) {
		if (!this.current) return;
		const max = this.duration || this.time;
		this.seek(Math.min(Math.max(this.time + delta, 0), max));
	}

	cycleRate() {
		const index = RATES.indexOf(this.rate as (typeof RATES)[number]);
		const next = RATES[(index + 1) % RATES.length];
		this.setRate(next);
	}

	setRate(rate: number) {
		this.rate = rate;
		if (this.audio) this.audio.playbackRate = rate;
		savePref('ww:rate', rate);
	}

	setVolume(volume: number) {
		const clamped = Math.min(Math.max(volume, 0), 1);
		this.volume = clamped;
		if (clamped > 0) this.#lastVolume = clamped;
		savePref('ww:volume', clamped);
	}

	/** 静音/取消静音 */
	toggleMute() {
		this.setVolume(this.volume > 0 ? 0 : this.#lastVolume);
	}

	/** 停止播放并清空状态（MiniPlayer 关闭按钮） */
	close() {
		this.audio?.pause();
		if (this.audio) this.audio.removeAttribute('src');
		this.current = null;
		this.paused = true;
		this.time = 0;
		this.duration = 0;
	}

	/** 播放自然结束：清空进度，下次从头播 */
	onEnded() {
		if (this.current) clearProgress(this.current.slug);
		this.paused = true;
	}
}

export const player = new PlayerState();

/** 播放进度持久化（由 PlayerHost 调用，debounce 2s） */
export function persistProgress(episode: Episode, seconds: number) {
	if (seconds >= 5) saveProgress(episode.slug, seconds);
}
