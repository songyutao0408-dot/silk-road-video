import React from 'react';
import {AbsoluteFill} from 'remotion';
import {PaperGrain, Shot} from '../components/Base';
import raw from '../data/shot07.json';
import {C, SANS, SERIF, W} from '../theme';
import {cue, pop, ramp, ShotData, useT} from '../timing';

const d = raw as ShotData;
// 裂缝中线的折点（y 从 330 到 1300）
const ZIG = [[540, 330], [528, 430], [552, 540], [532, 660], [550, 780], [530, 900], [548, 1020], [534, 1140], [546, 1250], [540, 1340]];
const PROFILE = [0.06, 0.62, 0.86, 1, 0.92, 1, 0.9, 1, 0.8, 0.1]; // 裂缝上下收窄

export const Shot07: React.FC = () => {
  const t = useT();
  const tWord = cue(d, '凿空');
  const strikes = [0.35, 0.95, 1.55, 2.15].filter((s) => s < tWord);
  const openK = ramp(t, strikes[0], tWord + 0.5);
  const w = 6 + openK * 330; // 裂缝半宽
  const left = ZIG.map(([x, y], i) => `${x - w * PROFILE[i] * (0.92 + 0.08 * Math.sin(i * 1.7 + 1))},${y}`);
  const right = ZIG.map(([x, y], i) => `${x + w * PROFILE[i] * (0.92 + 0.08 * Math.cos(i * 1.3))},${y}`).reverse();
  const last = strikes.filter((s) => s <= t).pop();
  const since = last === undefined ? 9 : t - last;
  const swing = last === undefined ? 0 : Math.max(0, 1 - since / 0.25);
  const next = strikes.find((s) => s > t);
  const windup = next !== undefined ? ramp(t, next - 0.3, next) : 0;
  const toolOp = 1 - ramp(t, tWord - 0.1, tWord + 0.3);
  const tMean = cue(d, '意思是');
  return (
    <Shot data={d}>
      <AbsoluteFill style={{backgroundColor: '#2A2623', transform: `translate(${swing * Math.sin(t * 90) * 7}px, ${swing * Math.cos(t * 70) * 5}px)`}}>
        <svg width={W} height={1920} style={{position: 'absolute'}}>
          {/* 岩壁纹理 */}
          {Array.from({length: 26}).map((_, i) => {
            const x = (i * 197) % 1080, y = (i * 331) % 1750;
            return <path key={i} d={`M${x} ${y} l${60 + (i % 5) * 30} ${20 - (i % 3) * 25} l${40 - (i % 4) * 20} ${70 + (i % 3) * 20}`} fill="none" stroke="#4A423B" strokeWidth={4} strokeLinecap="round" opacity={0.7} />;
          })}
          <defs>
            <linearGradient id="beam" x1="0" x2="1"><stop offset="0" stopColor="#F3E9D2" /><stop offset="0.5" stopColor="#FFF8E6" /><stop offset="1" stopColor="#F3E9D2" /></linearGradient>
            <filter id="glow"><feGaussianBlur stdDeviation="28" /></filter>
          </defs>
          <polygon points={[...left, ...right].join(' ')} fill="#F6D98A" opacity={0.55 * openK} filter="url(#glow)" />
          <polygon points={[...left, ...right].join(' ')} fill="url(#beam)" stroke="#1E1B19" strokeWidth={6} strokeLinejoin="round" />
          {/* 火星 */}
          {since < 0.3 && Array.from({length: 7}).map((_, i) => {
            const a = (i / 7) * Math.PI * 2 + 0.4, r = since * 520;
            return <circle key={i} cx={540 + Math.cos(a) * r} cy={352 + Math.sin(a) * r * 0.7} r={7 * (1 - since / 0.3)} fill="#F6D98A" />;
          })}
          {/* 凿子和锤子 */}
          <g opacity={toolOp} transform={`translate(540 ${330 + swing * 10})`}>
            <g transform="rotate(8)">
              <rect x={-13} y={-150} width={26} height={110} rx={6} fill={C.ochre} stroke="#1E1B19" strokeWidth={3} />
              <path d="M-13 -42 H13 L5 0 H-5 Z" fill="#8D9AA6" stroke="#1E1B19" strokeWidth={3} />
            </g>
            <g transform={`translate(22 -160) rotate(${-55 * windup + 4})`} style={{transformOrigin: '150px 0'}}>
              <rect x={-36} y={-34} width={96} height={62} rx={8} fill="#5B6570" stroke="#1E1B19" strokeWidth={3} />
              <rect x={50} y={-12} width={170} height={20} rx={8} fill={C.ochre} stroke="#1E1B19" strokeWidth={3} />
            </g>
          </g>
        </svg>
        <div style={{position: 'absolute', left: 0, width: W, top: 520, textAlign: 'center', fontFamily: SERIF, fontWeight: 900, fontSize: 250, lineHeight: '300px', color: C.ink}}>
          {'凿空'.split('').map((ch, i) => (
            <div key={i} style={{transform: `scale(${pop(t, tWord + i * 0.28, 8)})`, color: i ? C.ink : C.red}}>{ch}</div>
          ))}
        </div>
        <div style={{position: 'absolute', left: 0, width: W, top: 1140, textAlign: 'center', fontFamily: SERIF, fontWeight: 700, fontSize: 44, color: C.ink,
          opacity: ramp(t, tWord + 0.8, tWord + 1.2)}}>——司马迁《史记》</div>
        <div style={{position: 'absolute', left: 0, width: W, top: 1215, textAlign: 'center', fontFamily: SANS, fontWeight: 700, fontSize: 38, color: C.blue,
          opacity: ramp(t, tMean, tMean + 0.4)}}>凿＝开　空＝通</div>
        <PaperGrain dark />
      </AbsoluteFill>
    </Shot>
  );
};
export const shot07 = d;
