import React from 'react';
import {AbsoluteFill, Easing} from 'remotion';
import {Camel, Silk} from '../assets/Icons';
import {PaperGrain, Shot} from '../components/Base';
import {Plate} from '../components/Overlays';
import raw from '../data/shot09.json';
import {Node, SilkRoad} from '../map/Extras';
import {GeoText, MapView} from '../map/MapView';
import {P} from '../map/places';
import {Cam, fracAt, Path, slicePath} from '../map/projection';
import {EAST, NORTH, SOUTH, WEST} from '../map/silkroad';
import {C, SANS, SERIF, W} from '../theme';
import {cue, keys, pop, ramp, ShotData, useT, window_} from '../timing';

const d = raw as ShotData;
const lin = Easing.linear;
const T = {go: cue(d, '从长安出发'), hexi: cue(d, '河西走廊'), xj: cue(d, '和今天的新疆'), cong: cue(d, '越过葱岭'), mid: cue(d, '中亚'), west: cue(d, '西亚'), eu: cue(d, '欧洲') + 0.9,
  silk: cue(d, '丝绸最受欢迎'), later: cue(d, '后来人们'), name: cue(d, '“丝绸之路”')};
const HEXI = ['武威', '张掖', '酒泉', '敦煌'] as const;
const LAB: Record<string, object> = {武威: {dx: 14, dy: 44}, 张掖: {dx: 0, dy: -22, anchor: 'middle'}, 酒泉: {dx: 0, dy: 50, anchor: 'middle'}, 敦煌: {dx: 10, dy: -20}};
const CAMELS: [Path, number][] = [[EAST, 0.45], [NORTH, 0.3], [SOUTH, 0.55], [WEST, 0.12], [WEST, 0.48]];

export const Shot09: React.FC = () => {
  const t = useT();
  const pE = keys(t, [T.go + 0.2, T.xj + 0.2], [0, 1], lin);
  const pN = keys(t, [T.xj + 0.2, T.cong + 0.4, T.west], [0, fracAt(NORTH, [73.8, 39.8]), 1], lin);
  const pS = keys(t, [T.xj + 0.2, T.cong + 0.4, T.west], [0, fracAt(SOUTH, [75.2, 37.6]), 1], lin);
  const pW = keys(t, [T.west, T.eu], [0, 1], lin);
  const camT = [0, T.go, T.xj + 0.2, T.cong + 0.4, T.west, T.eu, T.eu + 1.3];
  const cam: Cam = {
    lon: keys(t, camT, [106.5, 106.5, 97, 79, 62, 30, 65]),
    lat: keys(t, camT, [36.6, 36.6, 39.6, 39.4, 37.6, 38.5, 37.2]),
    k: keys(t, camT, [54, 54, 52, 30, 24, 17, 10.6]),
  };
  const full = ramp(t, T.eu + 0.3, T.eu + 1.3);
  const small = 1 - ramp(t, T.cong - 0.4, T.cong + 0.3); // 小地名只在近景显示
  const region = (name: string, at: number, lon: number, lat: number) => (p: (a: number, b: number) => [number, number]) => (
    <GeoText key={name} p={p(lon, lat)} text={name} color={C.blue} size={56} spacing={16} opacity={0.9 * ramp(t, at - 0.2, at + 0.3)} />
  );
  const silkOp = window_(t, T.silk - 0.2, T.later - 0.3);
  const cardOp = ramp(t, T.later, T.later + 0.3);
  return (
    <Shot data={d}>
      <AbsoluteFill style={{backgroundColor: C.paper}}>
        <MapView cam={cam} geoLabels={0.85 * (1 - ramp(t, T.west, T.west + 0.8))}>
          {(p) => (
            <>
              <GeoText p={p(100.2, 41.2)} text="河西走廊" color={C.red} size={34} opacity={small * ramp(t, T.hexi - 0.1, T.hexi + 0.3)} />
              <SilkRoad p={p} pE={pE} pN={pN} pS={pS} pW={pW} width={full > 0.5 ? 5.5 : 7} />
              {region('中亚', T.mid, 65.5, 44.2)(p)}
              {region('西亚', T.west, 47, 30.2)(p)}
              {region('欧洲', T.eu - 0.9, 17, 48)(p)}
              <Node p={p} name="长安" lit={ramp(t, T.go - 0.2, T.go + 0.4)} size={full > 0.5 ? 34 : 42} dx={full > 0.5 ? 0 : 18} dy={full > 0.5 ? 46 : 46} anchor={full > 0.5 ? 'middle' : 'start'} />
              {HEXI.map((n) => {
                const f = fracAt(EAST, P[n]);
                const at = T.go + 0.2 + f * (T.xj - T.go);
                return <Node key={n} p={p} name={n} lit={ramp(t, at - 0.1, at + 0.5)} show={small * ramp(t, T.go, T.go + 0.4)} {...LAB[n]} />;
              })}
              <Node p={p} name="玉门关" lit={ramp(t, T.xj + 0.3, T.xj + 0.8)} show={small * ramp(t, T.xj, T.xj + 0.3)} dx={-14} dy={-6} anchor="end" />
              <Node p={p} name="阳关" lit={ramp(t, T.xj + 0.3, T.xj + 0.8)} show={small * ramp(t, T.xj, T.xj + 0.3)} dx={-14} dy={32} anchor="end" />
              <GeoText p={p(80.5, 42.4)} text="北道" color={C.red} size={32} opacity={window_(t, T.xj + 0.9, T.west)} />
              <GeoText p={p(86.8, 37.0)} text="南道" color={C.red} size={32} opacity={window_(t, T.xj + 0.9, T.west)} />
              <GeoText p={p(72.4, 35.2)} text="葱岭" color={C.ochre} size={34} opacity={window_(t, T.cong - 0.2, T.eu)} />
              <Node p={p} name="大秦" label="大秦（罗马）" lit={ramp(t, T.eu - 0.2, T.eu + 0.4)} show={ramp(t, T.eu - 0.6, T.eu - 0.2)} size={32} dx={-6} dy={48} anchor="start" />
              {full > 0 && CAMELS.map(([path, f0], i) => {
                const [x, y] = p(...slicePath(path, f0 + (t - T.eu) * 0.012).head);
                return (
                  <g key={i} transform={`translate(${x - 28} ${y - 52 - Math.abs(Math.sin(t * 5 + i)) * 3})`} opacity={full}>
                    <foreignObject width={70} height={56} style={{overflow: 'visible'}}><Camel size={62} /></foreignObject>
                  </g>
                );
              })}
            </>
          )}
        </MapView>
        <div style={{position: 'absolute', left: 0, top: 0, width: W, height: 620, opacity: full, background: `linear-gradient(${C.paper} 0%, ${C.paper} 45%, rgba(243,233,210,0) 100%)`}} />
        <PaperGrain />
        {/* 路名 */}
        <div style={{position: 'absolute', left: 0, width: W, top: 250, textAlign: 'center', fontFamily: SERIF, fontWeight: 900, fontSize: 160, color: C.red, letterSpacing: 8,
          WebkitTextStroke: `14px ${C.paper}`, paintOrder: 'stroke fill'}}>
          {'丝绸之路'.split('').map((ch, i) => <span key={i} style={{display: 'inline-block', transform: `scale(${pop(t, T.name - 0.1 + i * 0.1, 9)})`}}>{ch}</span>)}
        </div>
        {silkOp > 0 && (
          <Plate top={1090} opacity={silkOp} width={640}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 26}}>
              <Silk size={150} />
              <div style={{textAlign: 'left', fontFamily: SERIF, fontWeight: 900, fontSize: 52, color: C.ink, lineHeight: '70px'}}>运往西方的货物<br /><span style={{color: C.red}}>丝绸最受欢迎</span></div>
            </div>
          </Plate>
        )}
        {cardOp > 0 && (
          <Plate top={1060} opacity={cardOp} width={740}>
            <div style={{display: 'inline-block', background: C.blue, color: C.paper, fontFamily: SANS, fontWeight: 700, fontSize: 34, padding: '2px 26px', borderRadius: 40}}>小知识</div>
            <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 40, lineHeight: '62px', color: C.ink, marginTop: 12}}>
              “丝绸之路”这个名字，是<span style={{color: C.red}}>1877年</span><br />德国地理学家<span style={{color: C.red}}>李希霍芬</span>提出的
            </div>
          </Plate>
        )}
      </AbsoluteFill>
    </Shot>
  );
};
export const shot09 = d;
