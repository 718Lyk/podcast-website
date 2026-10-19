/**
 * 生成本地示例音频（开发/演示用）：
 * 每期 2 分钟、8kHz 单声道 16-bit WAV，按章节分段变调，
 * 让「章节跳转/播放进度/倍速」在浏览器里可以真实验证。
 * 运行：node scripts/generate-demo-audio.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../static/audio');

const SAMPLE_RATE = 8000;
const DURATION = 120; // 秒

/** 每期节目的音调分段（start/end 秒），章节边界处换频率，跳转后听感可辨 */
const SHOWS = [
	{
		file: '101.wav',
		segments: [
			{ start: 0, end: 20, freq: 220 },
			{ start: 20, end: 55, freq: 294 },
			{ start: 55, end: 100, freq: 349 },
			{ start: 100, end: 120, freq: 440 }
		]
	},
	{
		file: '102.wav',
		segments: [
			{ start: 0, end: 30, freq: 196 },
			{ start: 30, end: 65, freq: 262 },
			{ start: 65, end: 105, freq: 330 },
			{ start: 105, end: 120, freq: 415 }
		]
	}
];

/** 44 字节标准 WAV 头（PCM 16-bit 单声道） */
function wavHeader(dataBytes) {
	const buf = Buffer.alloc(44);
	buf.write('RIFF', 0);
	buf.writeUInt32LE(36 + dataBytes, 4);
	buf.write('WAVE', 8);
	buf.write('fmt ', 12);
	buf.writeUInt32LE(16, 16);
	buf.writeUInt16LE(1, 20); // PCM
	buf.writeUInt16LE(1, 22); // 单声道
	buf.writeUInt32LE(SAMPLE_RATE, 24);
	buf.writeUInt32LE(SAMPLE_RATE * 2, 28);
	buf.writeUInt16LE(2, 32);
	buf.writeUInt16LE(16, 34);
	buf.write('data', 36);
	buf.writeUInt32LE(dataBytes, 40);
	return buf;
}

function generate(show) {
	const totalSamples = SAMPLE_RATE * DURATION;
	const data = Buffer.alloc(totalSamples * 2);
	for (let i = 0; i < totalSamples; i++) {
		const t = i / SAMPLE_RATE;
		const seg = show.segments.find((s) => t >= s.start && t < s.end) ?? show.segments.at(-1);
		// 0.5Hz 慢包络 + 低音量，避免刺耳
		const envelope = 0.5 + 0.5 * Math.sin(2 * Math.PI * 0.5 * t);
		const value = Math.sin(2 * Math.PI * seg.freq * t) * 0.18 * envelope;
		data.writeInt16LE(Math.round(value * 32767), i * 2);
	}
	return Buffer.concat([wavHeader(data.length), data]);
}

mkdirSync(OUT_DIR, { recursive: true });
for (const show of SHOWS) {
	const wav = generate(show);
	const out = resolve(OUT_DIR, show.file);
	writeFileSync(out, wav);
	console.log(`${show.file}: ${(wav.length / 1024 / 1024).toFixed(2)} MB`);
}
