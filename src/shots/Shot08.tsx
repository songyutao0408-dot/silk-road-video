import React from 'react';
import {AbsoluteFill} from 'remotion';
import {PaperGrain, Shot} from '../components/Base';
import {Plate, YearBanner} from '../components/Overlays';
import raw from '../data/shot08.json';
import {City, MapView} from '../map/MapView';
import {P} from '../map/places';
import {Cam} from '../map/projection';
import {C, SANS, SERIF} from '../theme';
import {cue, keys, ramp, ShotData, useT} from '../timing';

const d = raw as ShotData;

export const Shot08: React.FC = () => {
  const t = useT();
  const tSeal = cue(d, '西域都护府') + 0.35;
  const tXJ = cue(d, '今天的新疆');
  const tPart = cue(d, '成为');
  const cam: Cam = {lon: 84, lat: 40.2, k: keys(t, [0, d.duration], [41, 45])};
  const k = ramp(t, tSeal - 0.22, tSeal);
  const hit = t > tSeal && t < tSeal + 0.3 ? 1 - (t - tSeal) / 0.3 : 0;
  const glow = ramp(t, tSeal, tSeal + 0.8) * (0.75 + 0.25 * Math.sin(t * 3));
  return (
    <Shot data={d}>
      <AbsoluteFill style={{backgroundColor: C.paper, transform: `translate(${hit * Math.sin(t * 80) * 8}px, ${hit * Math.cos(t * 95) * 8}px)`}}>
        <MapView cam={cam}>
          {(p) => {
            const [gx, gy] = p(83.5, 40.6);
            const [sx, sy] = p(82.3, 37.9);
            const [wx, wy] = p(84.3, 41.8);
            return (
              <>
                <defs>
                  <radialGradient id="xy"><stop offset="0" stopColor={C.red} stopOpacity={0.4} /><stop offset="0.7" stopColor={C.red} stopOpacity={0.16} /><stop offset="1" stopColor={C.red} stopOpacity={0} /></radialGradient>
                </defs>
                <ellipse cx={gx} cy={gy} rx={10.5 * cam.k} ry={5.6 * cam.k} fill="url(#xy)" opacity={glow} />
                <City p={p(P.敦煌[0], P.敦煌[1])} name="敦煌" dx={-16} dy={-14} anchor="end" />
                <City p={[wx, wy]} name="乌垒城" lit={ramp(t, tSeal + 0.3, tSeal + 0.9)} show={ramp(t, tSeal + 0.2, tSeal + 0.5)} dx={18} dy={-14} />
                <text x={wx + 18} y={wy + 28} fontFamily={SANS} fontWeight={500} fontSize={26} fill={C.ink} stroke={C.paper} strokeWidth={6} paintOrder="stroke" opacity={ramp(t, tSeal + 0.4, tSeal + 0.8)}>都护府治所</text>
                {/* 朱红印章 */}
                {k > 0 && (
                  <g transform={`translate(${sx} ${sy}) rotate(-5) scale(${3 - 2 * k})`} opacity={Math.min(1, k * 1.5) * 0.93}>
                    <rect x={-150} y={-150} width={300} height={300} rx={14} fill={C.red} />
                    <rect x={-132} y={-132} width={264} height={264} rx={6} fill="none" stroke={C.paper} strokeWidth={5} />
                    <line x1={0} y1={-126} x2={0} y2={126} stroke={C.paper} strokeWidth={3} opacity={0.6} />
                    {'西域'.split('').map((ch, i) => <text key={ch} x={66} y={-18 + i * 118} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={104} fill={C.paper}>{ch}</text>)}
                    {'都护府'.split('').map((ch, i) => <text key={ch} x={-66} y={-50 + i * 84} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={78} fill={C.paper}>{ch}</text>)}
                  </g>
                )}
              </>
            );
          }}
        </MapView>
        <PaperGrain />
        <YearBanner text="公元前60年" />
        {t > tXJ - 0.1 && (
          <Plate top={1072} opacity={ramp(t, tXJ - 0.1, tXJ + 0.25)} width={740}>
            <div style={{fontFamily: SERIF, fontWeight: 900, fontSize: 56, color: C.ink}}><span style={{color: C.red}}>今新疆地区</span>开始</div>
            <div style={{fontFamily: SERIF, fontWeight: 900, fontSize: 56, color: C.ink}}>隶属于中央政权</div>
            <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 40, color: C.blue, marginTop: 8, opacity: ramp(t, tPart, tPart + 0.3)}}>成为我国不可分割的一部分</div>
          </Plate>
        )}
      </AbsoluteFill>
    </Shot>
  );
};
export const shot08 = d;
