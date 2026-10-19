<script lang="ts">
	import { onMount } from 'svelte';
	import { site } from '#lib/config/site';
	import { getPref } from '#lib/utils/storage';
	import { player, persistProgress } from './player.svelte';

	// 全站唯一的 <audio> 元素，挂在根 layout，路由切换不销毁，播放不中断。

	// 恢复上次的音量与倍速偏好
	onMount(() => {
		const savedVolume = getPref('ww:volume', 1);
		if (savedVolume !== 1) player.setVolume(savedVolume);
		const savedRate = getPref('ww:rate', 1);
		if (savedRate !== 1) player.setRate(savedRate);
	});

	// 播放进度持久化：debounce 2s 写入 localStorage
	$effect(() => {
		const episode = player.current;
		const time = player.time;
		if (!episode) return;
		const timer = setTimeout(() => persistProgress(episode, time), 2000);
		return () => clearTimeout(timer);
	});

	// Media Session：锁屏 / 系统媒体控制中心（渐进增强）
	$effect(() => {
		const episode = player.current;
		if (!episode || !('mediaSession' in navigator)) return;
		navigator.mediaSession.metadata = new MediaMetadata({
			title: episode.title,
			artist: episode.hosts.join(' / '),
			album: site.name,
			artwork: episode.cover ? [{ src: episode.cover, sizes: '512x512' }] : []
		});
		navigator.mediaSession.setActionHandler('play', () => player.toggle());
		navigator.mediaSession.setActionHandler('pause', () => player.toggle());
		navigator.mediaSession.setActionHandler('seekbackward', () => player.skip(-15));
		navigator.mediaSession.setActionHandler('seekforward', () => player.skip(15));
	});
</script>

<audio
	preload="none"
	bind:this={player.audio}
	bind:paused={player.paused}
	bind:currentTime={player.time}
	bind:duration={player.duration}
	bind:playbackRate={player.rate}
	bind:volume={player.volume}
	onended={player.onEnded}
></audio>
