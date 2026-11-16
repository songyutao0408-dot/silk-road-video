import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Grapes, Pomegranate, Walnut} from '../assets/Fruits';
import {Alfalfa, Horse, Iron, Lacquer, Sesame, Silk} from '../assets/Icons';
import {Paper, Shot} from '../components/Base';
import raw from '../data/shot10.json';
import {C, SANS, SERIF, W} from '../theme';
import {cue, keys, ramp, ShotData, useT} from '../timing';

const d = raw as ShotData;
const Plaque: React.FC<{a: string}> = ({a}) => (
  <div style={{width: 118, height: 118, margin: '0 auto', background: '#D9B877', border: '4px solid #7E5122', borderRadius: 10, boxSizing: 'border-box', fontFamily: SERIF, fontWeight: 900,
    fontSize: 46, lineHeight: '54px', color: C.ink, paddingTop: 2}}>{a.slice(0, 2)}<br />{a.slice(2)}</div>
);
type Item = {name: string; at: number; node: React.ReactNode; label?: string};
const WESTWARD: Item[] = [
  {name: '丝绸', at: cue(d, '丝绸'), node: <Silk size={140} />},
  {name: '铁器', at: cue(d, '铁器'), node: <Iron size={140} />},
  {name: '漆器', at: cue(d, '漆器'), node: <Lacquer size={140} />},
  {name: '凿井技术', at: cue(d, '凿井'), node: <Plaque a="凿井技术" />, label: ''},
  {name: '冶铁技术', at: cue(d, '冶铁'), node: <Plaque a="冶铁技术" />, label: ''},
];
const EASTWARD: Item[] = [
  {name: '良马', at: cue(d, '良马'), node: <Horse size={132} />},
  {name: '葡萄', at: cue(d, '葡萄'), node: <Grapes size={104} />},
  {name: '苜蓿', at: cue(d, '苜蓿'), node: <Alfalfa size={132} />},
  {name: '石榴', at: cue(d, '石榴'), node: <Pomegranate size={104} />},
  {name: '核桃', at: cue(d, '核桃'), node: <Walnut size={104} />},
  {name: '胡麻', at: cue(d, '胡麻'), node: <Sesame size={132} />},
];
const TG = cue(d, '开头那串葡萄');

const Belt: React.FC<{top: number; items: Item[]; dir: -1 | 1; title: React.ReactNode; at: number}> = ({top, items, dir, title, at}) => {
  const t = useT();
  const slot = 760 / items.length;
  const off = ((t * 90 * dir) % 60 + 60) % 60;
  return (
    <div style={{position: 'absolute', left: 0, top, width: W, opacity: ramp(t, at, at + 0.3)}}>
      <div style={{position: 'absolute', left: 0, width: W, top: 0, textAlign: 'center'}}>
        <span style={{display: 'inline-block', background: dir < 0 ? C.red : C.blue, color: C.paper, fontFamily: SERIF, fontWeight: 900, fontSize: 50, padding: '4px 40px 8px', borderRadius: 12}}>{title}</span>
      </div>
      {items.map((it, i) => {
        const k = ramp(t, it.at - 0.15, it.at + 0.35);
        if (k <= 0) return null;
        return (
          <div key={it.name} style={{position: 'absolute', left: 160 + slot * i - dir * (1 - k) * 260, top: 110, width: slot, textAlign: 'center', opacity: Math.min(1, k * 2.5)}}>
            <div style={{height: 122, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', transform: `translateY(${Math.sin(t * 5 + i) * 2}px)`}}>{it.node}</div>
            <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 38, color: C.ink, marginTop: 8, height: 50}}>{it.label ?? it.name}</div>
          </div>
        );
      })}
      {/* 传送带 */}
      <div style={{position: 'absolute', left: 130, top: 296, width: 820, height: 52, borderRadius: 26, background: C.ink, overflow: 'hidden'}}>
        <svg width={900} height={52} style={{position: 'absolute', left: -60 + off, top: 0}}>
          {Array.from({length: 16}).map((_, i) => <path key={i} d={dir < 0 ? `M${i * 60 + 34} 12 L${i * 60 + 18} 26 L${i * 60 + 34} 40` : `M${i * 60 + 18} 12 L${i * 60 + 34} 26 L${i * 60 + 18} 40`} fill="none" stroke={C.paper} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" opacity={0.75} />)}
        </svg>
      </div>
      {[150, 930].map((x) => <div key={x} style={{position: 'absolute', left: x - 30, top: 292, width: 60, height: 60, borderRadius: 30, background: C.ochre, border: `5px solid ${C.ink}`, boxSizing: 'border-box'}} />)}
    </div>
  );
};

export const Shot10: React.FC = () => {
  const t = useT();
  const g = ramp(t, TG - 0.1, TG + 0.9);
  const slot = 760 / 6;
  const x0 = 160 + slot * 1.5, y0 = 840 + 110 + 70;
  return (
    <Shot data={d}>
      <Paper>
        <Belt top={270} items={WESTWARD} dir={-1} title="西方 ← 中原" at={0.3} />
        <Belt top={840} items={EASTWARD} dir={1} title="西域 → 中原" at={cue(d, '西域的') - 0.3} />
        {/* 结尾推到开头那串葡萄 */}
        <AbsoluteFill style={{backgroundColor: C.dark, opacity: g * 0.94}} />
        {g > 0 && (
          <>
            <div style={{position: 'absolute', left: keys(g, [0, 1], [x0, 540]) - 250, top: keys(g, [0, 1], [y0, 760]) - 250, width: 500, height: 500,
              transform: `scale(${keys(g, [0, 1], [0.21, 1])})`, opacity: Math.min(1, g * 4)}}>
              <Grapes size={500} />
            </div>
            <div style={{position: 'absolute', left: 0, width: W, top: 1090, textAlign: 'center', fontFamily: SERIF, fontWeight: 900, fontSize: 72, color: C.paper,
              opacity: ramp(t, cue(d, '就是这么来的'), cue(d, '就是这么来的') + 0.3)}}>沿着<span style={{color: '#E8674F'}}>丝绸之路</span>来到中原</div>
          </>
        )}
      </Paper>
    </Shot>
  );
};
export const shot10 = d;
