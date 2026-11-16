import React from 'react';
import {BambooSlips} from '../assets/Icons';
import {Paper, Shot} from '../components/Base';
import raw from '../data/shot05.json';
import {C, SANS, SERIF, W} from '../theme';
import {cue, pop, ramp, ShotData, useT} from '../timing';

const d = raw as ShotData;
const SLIPS = [{text: '地理', x: 270}, {text: '物产', x: 540}, {text: '风俗', x: 810}];

export const Shot05: React.FC = () => {
  const t = useT();
  const tStrike = cue(d, '但张骞');
  const strike = ramp(t, tStrike, tStrike + 0.35);
  const tKnow = cue(d, '中原第一次');
  return (
    <Shot data={d}>
      <Paper>
        <div style={{position: 'absolute', left: 0, width: W, top: 230, textAlign: 'center', fontFamily: SERIF, fontWeight: 900, fontSize: 120, color: C.ink,
          opacity: ramp(t, 0.25, 0.5), transform: `scale(${0.9 + 0.1 * pop(t, 0.25, 10)})`}}>
          任务
          <span style={{position: 'relative', display: 'inline-block', color: strike > 0.5 ? '#9a938a' : C.ink}}>
            失败
            <span style={{position: 'absolute', left: -10, top: '54%', height: 16, width: `calc(${strike * 100}% + ${strike * 20}px)`, background: C.red, borderRadius: 8, transform: 'rotate(-6deg)', transformOrigin: '0 50%'}} />
          </span>
          了？
        </div>
        <div style={{position: 'absolute', left: 0, width: W, top: 420, textAlign: 'center', fontFamily: SANS, fontWeight: 700, fontSize: 50, color: C.blue,
          opacity: ramp(t, tStrike + 0.3, tStrike + 0.7)}}>张骞带回了西域各国的——</div>
        {SLIPS.map(({text, x}, i) => {
          const at = cue(d, text) - 0.25;
          const k = ramp(t, at, at + 0.55);
          const land = pop(t, at + 0.45, 9);
          return (
            <div key={text} style={{position: 'absolute', left: x - 95 - (1 - k) * (700 + i * 120), top: 560 + (1 - k) * -180 + Math.sin(k * Math.PI) * -60,
              transform: `rotate(${(1 - k) * -40 + (i - 1) * 3}deg) scale(${0.96 + 0.04 * land})`, opacity: Math.min(1, k * 3)}}>
              <BambooSlips text={text} size={190} />
            </div>
          );
        })}
        {/* 长安城门 */}
        <svg width={W} height={330} viewBox="0 0 1080 330" style={{position: 'absolute', left: 0, top: 880}}>
          <g opacity={ramp(t, tStrike + 0.2, tStrike + 0.7)}>
            <path d="M170 150 H910 V300 H170 Z" fill="#8C7B62" />
            {Array.from({length: 13}).map((_, i) => <rect key={i} x={170 + i * 58} y={128} width={36} height={24} fill="#8C7B62" />)}
            <path d="M330 150 L360 96 H720 L750 150 Z" fill={C.blue} />
            <path d="M300 100 Q540 40 780 100 L750 112 H330 Z" fill={C.ink} />
            <path d="M470 300 V220 Q540 160 610 220 V300 Z" fill={C.ink} />
            <rect x={455} y={172} width={170} height={0} />
          </g>
        </svg>
        <div style={{position: 'absolute', left: 0, width: W, top: 1200, textAlign: 'center', fontFamily: SERIF, fontWeight: 900, fontSize: 58, color: C.ink, letterSpacing: 16,
          opacity: ramp(t, tStrike + 0.3, tStrike + 0.7)}}>长安</div>
        <div style={{position: 'absolute', left: 0, width: W, top: 1270, textAlign: 'center', opacity: ramp(t, tKnow, tKnow + 0.4)}}>
          <span style={{display: 'inline-block', fontFamily: SANS, fontWeight: 700, fontSize: 46, color: C.paper, background: C.red, borderRadius: 12, padding: '6px 30px',
            transform: `scale(${0.8 + 0.2 * pop(t, tKnow, 9)})`}}>中原第一次真正了解西域</span>
        </div>
      </Paper>
    </Shot>
  );
};
export const shot05 = d;
