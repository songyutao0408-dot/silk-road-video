import {Easing, interpolate, spring, useCurrentFrame} from 'remotion';
import {FPS} from './theme';

export type ShotData = {
  id: number;
  title: string;
  text: string;
  audio: string;
  audioDuration: number;
  pad: number;
  duration: number;
  lines: {text: string; start: number; end: number}[];
  words: {text: string; idx: number; start: number; end: number}[];
};

export const shotFrames = (d: ShotData) => Math.ceil(d.duration * FPS);

const PUNCT = /^[，。？！；：…—、“”‘’《》（）\s]+|[，。？！；：…—、“”‘’《》（）\s]+$/g;

/** 旁白里某个词开始被读到的时刻（镜头内秒数，已含开头留白） */
export const cue = (d: ShotData, phrase: string, nth = 0): number => {
  let i = -1;
  for (let n = 0; n <= nth; n++) i = d.text.indexOf(phrase, i + 1);
  if (i < 0) throw new Error(`镜头${d.id} 旁白中找不到「${phrase}」`);
  let prevEnd = 0;
  for (const w of d.words) {
    const n = w.text.replace(PUNCT, '').length || 1;
    if (w.idx <= i && i < w.idx + n) return d.pad + w.start + ((w.end - w.start) * (i - w.idx)) / n;
    if (w.idx > i) return d.pad + w.start;
    prevEnd = w.end;
  }
  return d.pad + prevEnd;
};

/** 当前镜头内时间（秒） */
export const useT = () => useCurrentFrame() / FPS;

const clampOpt = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const ease = Easing.bezier(0.33, 0, 0.2, 1);

/** t 在 [a,b] 内从 0 平滑到 1 */
export const ramp = (t: number, a: number, b: number, easing = ease) =>
  interpolate(t, [a, b], [0, 1], {...clampOpt, easing});

/** 出现又消失：a 开始淡入，b 开始淡出 */
export const window_ = (t: number, a: number, b: number, fade = 0.3) =>
  Math.min(ramp(t, a, a + fade), 1 - ramp(t, b, b + fade));

/** 从 a 时刻起的弹出缩放（0 → 过冲 → 1） */
export const pop = (t: number, a: number, damping = 11) =>
  t < a ? 0 : spring({frame: (t - a) * FPS, fps: FPS, config: {damping, stiffness: 170, mass: 0.8}});

/** 关键帧插值 */
export const keys = (t: number, ts: number[], vs: number[], easing = ease) =>
  interpolate(t, ts, vs, {...clampOpt, easing});
