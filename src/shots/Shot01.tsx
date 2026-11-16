import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Grapes, Pomegranate, Walnut} from '../assets/Fruits';
import {Paper, Shot} from '../components/Base';
import raw from '../data/shot01.json';
import {C, SANS, SERIF, W} from '../theme';
import {cue, keys, pop, ramp, ShotData, useT} from '../timing';

const d = raw as ShotData;
const TITLE = ['两千年前，', '中原没有葡萄？'];

const Fruit: React.FC<{x: number; at: number; name: string; children: React.ReactNode}> = ({x, at, name, children}) => {
  const t = useT();
  const s = pop(t, at, 9);
  const wob = Math.sin((t - at) * 3) * 2.5 * Math.min(1, Math.max(0, t - at));
  return (
    <div style={{position: 'absolute', left: x - 115, top: 740, width: 230, textAlign: 'center'}}>
      <div style={{transform: `scale(${s}) rotate(${wob}deg)`, transformOrigin: '50% 60%', height: 230}}>{children}</div>
      <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 44, color: C.paper, marginTop: 14, letterSpacing: 6, opacity: ramp(t, at + 0.15, at + 0.4)}}>{name}</div>
    </div>
  );
};

export const Shot01: React.FC = () => {
  const t = useT();
  const tQ = cue(d, '怎么来的');
  const t2000 = cue(d, '两千多年前');
  const q = pop(t, tQ, 7);
  const zoom = keys(t, [0, d.duration], [1, 1.035]);
  const pulse = 1 + 0.06 * Math.sin(Math.min(1, Math.max(0, (t - t2000) / 0.6)) * Math.PI);
  let ci = 0;
  return (
    <Shot data={d} intro={false}>
      <Paper dark>
        <AbsoluteFill style={{transform: `scale(${zoom})`, transformOrigin: '50% 45%'}}>
          {/* 墨晕 */}
          <div style={{position: 'absolute', left: W / 2 - 520, top: 380, width: 1040, height: 1040, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(160,102,45,.34) 0%, rgba(160,102,45,.12) 45%, rgba(0,0,0,0) 70%)'}} />
          {/* 大字：第 0 帧就开始逐字出现，保证前 3 秒抓人 */}
          <div style={{position: 'absolute', left: 0, width: W, top: 250, textAlign: 'center', fontFamily: SERIF, fontWeight: 900,
            fontSize: 102, lineHeight: '150px', color: C.paper, transform: `scale(${pulse})`}}>
            {TITLE.map((line, li) => (
              <div key={li}>
                {line.split('').map((ch) => {
                  const at = 0.05 + ci++ * 0.055;
                  const hot = li === 1 && (ch === '葡' || ch === '萄' || ch === '？');
                  return (
                    <span key={ci} style={{display: 'inline-block', opacity: ramp(t, at, at + 0.18), color: hot ? '#E8674F' : C.paper,
                      transform: `translateY(${(1 - ramp(t, at, at + 0.22)) * 26}px)`}}>{ch}</span>
                  );
                })}
              </div>
            ))}
          </div>
          <div style={{position: 'absolute', left: W / 2 - 150, top: 580, width: 300 * ramp(t, 0.7, 1.2), height: 6, background: C.red, borderRadius: 3}} />
          <Fruit x={280} at={cue(d, '葡萄')} name="葡萄"><Grapes size={230} /></Fruit>
          <Fruit x={540} at={cue(d, '石榴')} name="石榴"><Pomegranate size={230} /></Fruit>
          <Fruit x={800} at={cue(d, '核桃')} name="核桃"><Walnut size={230} /></Fruit>
          {/* 大问号 */}
          <div style={{position: 'absolute', left: 0, width: W, top: 1060, textAlign: 'center', fontFamily: SERIF, fontWeight: 900, fontSize: 290,
            lineHeight: '300px', color: '#E0523C', transform: `scale(${q}) rotate(${Math.sin((t - tQ) * 5) * 5 * Math.max(0, 1 - (t - tQ))}deg)`,
            textShadow: '0 0 60px rgba(184,58,46,.55)'}}>？</div>
        </AbsoluteFill>
      </Paper>
    </Shot>
  );
};
export const shot01 = d;
