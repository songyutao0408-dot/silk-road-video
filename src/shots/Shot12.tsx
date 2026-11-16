import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Paper, Shot} from '../components/Base';
import raw from '../data/shot12.json';
import {C, SANS, SERIF} from '../theme';
import {cue, pop, ramp, ShotData, useT} from '../timing';

const d = raw as ShotData;
const R: React.FC<{children: React.ReactNode}> = ({children}) => <span style={{color: C.red, fontWeight: 900}}>{children}</span>;
const ITEMS: {n: string; at: string; head: string; body: React.ReactNode}[] = [
  {n: '①', at: '张骞两次', head: '张骞两次出使西域', body: <><R>公元前138年</R>、<R>公元前119年</R></>},
  {n: '②', at: '西域都护府', head: '设立西域都护府', body: <><R>公元前60年</R>，今新疆地区<br />开始隶属中央政权</>},
  {n: '③', at: '还有丝绸之路', head: '丝绸之路的路线', body: <>长安 → 河西走廊 → 今新疆地区<br />→ 中亚、西亚 → 欧洲</>},
];

export const Shot12: React.FC = () => {
  const t = useT();
  const tShot = cue(d, '截图');
  const flash = t > tShot && t < tShot + 0.35 ? 1 - (t - tShot) / 0.35 : 0;
  const corner = (s: React.CSSProperties) => <div style={{position: 'absolute', width: 60, height: 60, borderColor: C.red, borderStyle: 'solid', borderWidth: 0, opacity: ramp(t, tShot, tShot + 0.2), ...s}} />;
  return (
    <Shot data={d}>
      <Paper>
        <div style={{position: 'absolute', left: 150, top: 230, width: 780, height: 1050, boxSizing: 'border-box', background: '#FBF4E2', border: `5px solid ${C.ink}`, borderRadius: 22,
          boxShadow: '14px 14px 0 rgba(43,43,43,.18)', transform: `scale(${0.94 + 0.06 * pop(t, 0.2, 12)})`, opacity: ramp(t, 0.2, 0.4)}}>
          <div style={{background: C.blue, color: C.paper, fontFamily: SERIF, fontWeight: 900, fontSize: 68, lineHeight: '128px', textAlign: 'center', borderRadius: '16px 16px 0 0', letterSpacing: 12,
            borderBottom: `8px solid ${C.red}`}}>考点卡片</div>
          <div style={{padding: '18px 36px 0'}}>
            {ITEMS.map((it, i) => {
              const at = cue(d, it.at) - 0.1;
              return (
                <div key={i} style={{opacity: ramp(t, at, at + 0.3), transform: `translateX(${(1 - ramp(t, at, at + 0.35)) * 50}px)`, padding: '38px 0 40px', borderBottom: i < 2 ? `3px dashed ${C.ochre}` : 'none'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
                    <span style={{fontFamily: SERIF, fontWeight: 900, fontSize: 70, lineHeight: '74px', color: C.red}}>{it.n}</span>
                    <span style={{fontFamily: SERIF, fontWeight: 900, fontSize: 56, color: C.ink}}>{it.head}</span>
                  </div>
                  <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 44, lineHeight: '68px', color: C.ink, marginTop: 14, paddingLeft: 6}}>{it.body}</div>
                </div>
              );
            })}
          </div>
        </div>
        {corner({left: 120, top: 200, borderLeftWidth: 10, borderTopWidth: 10})}
        {corner({left: 900, top: 200, borderRightWidth: 10, borderTopWidth: 10})}
        {corner({left: 120, top: 1250, borderLeftWidth: 10, borderBottomWidth: 10})}
        {corner({left: 900, top: 1250, borderRightWidth: 10, borderBottomWidth: 10})}
        <AbsoluteFill style={{background: '#fff', opacity: flash * 0.8}} />
      </Paper>
    </Shot>
  );
};
export const shot12 = d;
