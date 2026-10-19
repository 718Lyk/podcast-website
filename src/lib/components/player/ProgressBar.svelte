<script lang="ts">
	import { formatSeconds } from '#lib/utils/format';
	import { player } from './player.svelte';

	let { compact = false }: { compact?: boolean } = $props();

	// 拖动中只更新视觉，松手（change 事件）才提交 currentTime，
	// 避免与音频 timeupdate 互相打架导致进度条来回跳
	let dragging = $state(false);
	let dragValue = $state(0);

	const display = $derived(dragging ? dragValue : player.time);

	function onInput(event: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		const value = Number(event.currentTarget.value);
		// 键盘方向键不触发 pointerdown：input/change 同步触发，直接 seek
		if (dragging) dragValue = value;
		else player.seek(value);
	}

	function onChange() {
		if (dragging) {
			player.seek(dragValue);
			dragging = false;
		}
	}
</script>

<div
	class="flex w-full items-center gap-2 text-xs text-neutral-500 tabular-nums dark:text-neutral-400"
>
	<span class="w-10 shrink-0 text-right sm:w-12">{formatSeconds(display)}</span>
	<input
		type="range"
		min="0"
		max={player.duration || 1}
		step="1"
		value={display}
		onpointerdown={() => {
			dragging = true;
			dragValue = player.time;
		}}
		oninput={onInput}
		onchange={onChange}
		onpointercancel={() => (dragging = false)}
		aria-label="播放进度"
		aria-valuetext="{formatSeconds(display)} / {player.duration
			? formatSeconds(player.duration)
			: '未知'}"
		class="h-2 w-full cursor-pointer touch-none accent-indigo-600 sm:h-1.5"
	/>
	<span class="w-10 shrink-0 sm:w-12">
		{player.duration ? formatSeconds(player.duration) : '--:--'}
	</span>
	{#if !compact}
		<span class="sr-only">总时长 {player.duration ? formatSeconds(player.duration) : '未知'}</span>
	{/if}
</div>
