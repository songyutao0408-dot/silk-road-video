import React from 'react';
import {Paper, Shot} from '../components/Base';
import raw from '../data/shot13.json';
import {C, SANS, SERIF, W} from '../theme';
import {cue, pop, ramp, ShotData, useT} from '../timing';

const d = raw as ShotData;

export const Shot13: React.FC = () => {
  const t = useT();
  const tHu = cue(d, '胡');
  const tC = cue(d, '评论区');
  return (
    <Shot data={d} outro={false}>
      <Paper>
        <div style={{position: 'absolute', left: 0, width: W, top: 230, textAlign: 'center', fontFamily: SANS, fontWeight: 700, fontSize: 54, color: C.blue, opacity: ramp(t, 0.3, 0.6)}}>
          <span style={{background: C.blue, color: C.paper, padding: '6px 34px', borderRadius: 50}}>考考你</span>
        </div>
        <div style={{position: 'absolute', left: 0, width: W, top: 370, textAlign: 'center', fontFamily: SERIF, fontWeight: 900, fontSize: 96, lineHeight: '150px', color: C.ink}}>
          <div style={{opacity: ramp(t, 0.5, 0.9)}}>你还知道哪些</div>
          <div style={{opacity: ramp(t, 0.9, 1.3)}}>
            带
            <span style={{display: 'inline-block', width: 150, height: 150, lineHeight: '142px', margin: '0 14px', borderRadius: 26, background: C.red, color: C.paper, fontSize: 112,
              transform: `scale(${1 + 0.25 * Math.sin(Math.min(1, Math.max(0, (t - tHu) / 0.5)) * Math.PI)}) rotate(-4deg)`}}>胡</span>
            字的
          </div>
          <div style={{opacity: ramp(t, 1.2, 1.6)}}>食物？</div>
        </div>
        <div style={{position: 'absolute', left: 160, width: 760, top: 900, display: 'flex', justifyContent: 'space-between'}}>
          {[0, 1, 2, 3].map((i) => {
            const at = 1.6 + i * 0.22;
            const blink = 0.55 + 0.45 * Math.sin((t - at) * 6 - i * 1.2);
            return (
              <div key={i} style={{width: 164, height: 200, borderRadius: 24, border: `5px dashed ${C.ochre}`, background: '#FBF4E2', textAlign: 'center', fontFamily: SERIF, fontWeight: 900,
                fontSize: 130, lineHeight: '196px', color: C.red, transform: `scale(${pop(t, at, 9)})`}}>
                <span style={{opacity: t > at ? blink : 0}}>？</span>
              </div>
            );
          })}
        </div>
        <div style={{position: 'absolute', left: 0, width: W, top: 1170, textAlign: 'center', opacity: ramp(t, tC, tC + 0.3)}}>
          <span style={{display: 'inline-block', fontFamily: SANS, fontWeight: 700, fontSize: 56, color: C.paper, background: C.ink, padding: '12px 44px', borderRadius: 60,
            transform: `scale(${0.7 + 0.3 * pop(t, tC, 8)}) translateY(${Math.sin(t * 6) * 5}px)`}}>评论区告诉我</span>
        </div>
      </Paper>
    </Shot>
  );
};
export const shot13 = d;
