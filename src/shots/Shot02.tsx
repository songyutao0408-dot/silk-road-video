import React from 'react';
import {Paper, Shot} from '../components/Base';
import raw from '../data/shot02.json';
import {C, SANS, SERIF, W} from '../theme';
import {cue, ramp, ShotData, useT} from '../timing';

const d = raw as ShotData;
const SW = 700, TOP = 250, FULL = 1010; // 卷轴宽、顶、展开高度

export const Shot02: React.FC = () => {
  const t = useT();
  const open = ramp(t, 0.2, 1.5);
  const h = 30 + open * FULL;
  const tT = cue(d, '丝绸之路') - 0.15;
  const roller = (y: number) => (
    <div style={{position: 'absolute', left: (W - SW) / 2 - 36, top: y, width: SW + 72, height: 40, borderRadius: 20,
      background: `linear-gradient(#7A4B1E, ${C.ochre} 40%, #5E3B16)`, boxShadow: '0 8px 14px rgba(0,0,0,.45)'}}>
      <div style={{position: 'absolute', left: -8, top: 6, width: 22, height: 28, borderRadius: 6, background: C.red}} />
      <div style={{position: 'absolute', right: -8, top: 6, width: 22, height: 28, borderRadius: 6, background: C.red}} />
    </div>
  );
  return (
    <Shot data={d}>
      <Paper dark>
        {/* 卷轴纸面 */}
        <div style={{position: 'absolute', left: (W - SW) / 2, top: TOP + 20, width: SW, height: h, overflow: 'hidden', background: C.paper,
          boxShadow: '0 0 0 6px #C9B88F inset, 0 0 0 10px #B83A2E22 inset'}}>
          <div style={{position: 'absolute', left: 0, top: 0, width: SW, height: FULL + 30}}>
            {/* 远山与驼队装饰 */}
            <svg width={SW} height={FULL + 30} style={{position: 'absolute', left: 0, top: 0}}>
              <path d={`M0 ${FULL - 170} C120 ${FULL - 260} 200 ${FULL - 150} 320 ${FULL - 230} C430 ${FULL - 300} 520 ${FULL - 160} ${SW} ${FULL - 240} V${FULL + 30} H0 Z`} fill={C.ochre} opacity={0.2} />
              <path d={`M0 ${FULL - 90} C160 ${FULL - 170} 300 ${FULL - 60} 460 ${FULL - 130} C560 ${FULL - 170} 640 ${FULL - 100} ${SW} ${FULL - 120} V${FULL + 30} H0 Z`} fill={C.ochre} opacity={0.3} />
              <path d={`M40 ${FULL - 40} C200 ${FULL - 110} 420 ${FULL - 10} 660 ${FULL - 90}`} fill="none" stroke={C.red} strokeWidth={6} strokeDasharray="16 12" strokeLinecap="round" />
            </svg>
            {/* 主标题：竖排 */}
            <div style={{position: 'absolute', left: 360, top: 60, width: 200, fontFamily: SERIF, fontWeight: 900, fontSize: 180, lineHeight: '196px', color: C.ink, textAlign: 'center'}}>
              {'丝绸之路'.split('').map((ch, i) => {
                const a = tT + i * 0.13;
                return <div key={i} style={{opacity: ramp(t, a, a + 0.22), transform: `scale(${1.25 - 0.25 * ramp(t, a, a + 0.25)})`, color: i < 2 ? C.red : C.ink}}>{ch}</div>;
              })}
            </div>
            {/* 副标题：竖排 */}
            <div style={{position: 'absolute', left: 190, top: 96, width: 70, fontFamily: SERIF, fontWeight: 700, fontSize: 54, lineHeight: '66px', color: C.blue, textAlign: 'center',
              opacity: ramp(t, tT + 0.6, tT + 1.0)}}>
              {'一条连接东西方的大道'.split('').map((ch, i) => <div key={i}>{ch}</div>)}
            </div>
            {/* 角落小字 */}
            <div style={{position: 'absolute', left: 60, top: 820, width: 64, padding: '12px 0', background: C.red, color: C.paper, borderRadius: 8, fontFamily: SANS, fontWeight: 700,
              fontSize: 34, lineHeight: '40px', textAlign: 'center', opacity: ramp(t, tT + 0.8, tT + 1.1)}}>
              {'七年级历史'.split('').map((ch, i) => <div key={i}>{ch}</div>)}
            </div>
          </div>
        </div>
        {roller(TOP)}
        {roller(TOP + 20 + h)}
      </Paper>
    </Shot>
  );
};
export const shot02 = d;
