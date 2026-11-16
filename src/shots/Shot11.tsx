import React from 'react';
import {AbsoluteFill} from 'remotion';
import {PaperGrain, Shot} from '../components/Base';
import {Plate} from '../components/Overlays';
import raw from '../data/shot11.json';
import {Node, SilkRoad} from '../map/Extras';
import {GeoText, MapView, RouteLine} from '../map/MapView';
import {Cam, fracAt, slicePath} from '../map/projection';
import {EAST, NODES, NORTH} from '../map/silkroad';
import {C, SANS, SERIF, W} from '../theme';
import {cue, keys, pop, ramp, ShotData, useT} from '../timing';

const d = raw as ShotData;
const LIGHTS = ['长安', '敦煌', '龟兹', '于阗', '疏勒', '大宛', '木鹿', '安息', '泰西封', '安条克', '大秦'];
const TIANSHAN = slicePath(NORTH, fracAt(NORTH, [73.8, 39.8])).pts;

export const Shot11: React.FC = () => {
  const t = useT();
  const T = {more: cue(d, '更是'), y: cue(d, '2014年'), corridor: cue(d, '“丝绸之路'), list: cue(d, '被列入')};
  const cam: Cam = {lon: 65, lat: 37.2, k: keys(t, [0, d.duration], [10.6, 11.4])};
  const hl = ramp(t, T.corridor, T.corridor + 0.6);
  return (
    <Shot data={d}>
      <AbsoluteFill style={{backgroundColor: C.paper}}>
        <MapView cam={cam} geoLabels={0}>
          {(p) => (
            <>
              {hl > 0 && <g opacity={hl * 0.5}><RouteLine pts={EAST.pts} p={p} width={22} dash="1 0" color="#E8B04A" /><RouteLine pts={TIANSHAN} p={p} width={22} dash="1 0" color="#E8B04A" /></g>}
              <SilkRoad p={p} width={5.5} />
              {LIGHTS.map((n, i) => {
                const [x, y] = p(NODES[n][0], NODES[n][1]);
                const ph = (t * 0.9 + i * 0.37) % 1;
                const on = ramp(t, 0.4 + i * 0.12, 0.7 + i * 0.12);
                return (
                  <g key={n} opacity={on}>
                    <circle cx={x} cy={y} r={8 + ph * 34} fill="none" stroke="#E8B04A" strokeWidth={4} opacity={1 - ph} />
                    <circle cx={x} cy={y} r={16} fill="#E8B04A" opacity={0.45} />
                    <circle cx={x} cy={y} r={8} fill={C.red} stroke={C.paper} strokeWidth={2.5} />
                  </g>
                );
              })}
              <Node p={p} name="长安" lit={1} size={34} dx={0} dy={48} anchor="middle" />
              <Node p={p} name="大秦" label="大秦（罗马）" lit={1} size={32} dx={-6} dy={48} />
              <GeoText p={p(84, 45.6)} text="天山" color={C.ochre} size={34} opacity={hl} />
            </>
          )}
        </MapView>
        <div style={{position: 'absolute', left: 0, top: 0, width: W, height: 620, background: `linear-gradient(${C.paper} 0%, ${C.paper} 45%, rgba(243,233,210,0) 100%)`}} />
        <PaperGrain />
        <div style={{position: 'absolute', left: 0, width: W, top: 200, textAlign: 'center', fontFamily: SANS, fontWeight: 700, fontSize: 50, color: C.ink, opacity: ramp(t, 0.4, 0.8),
          WebkitTextStroke: `10px ${C.paper}`, paintOrder: 'stroke fill'}}>不只是一条商路，更是——</div>
        <div style={{position: 'absolute', left: 0, width: W, top: 290, textAlign: 'center', fontFamily: SERIF, fontWeight: 900, fontSize: 112, lineHeight: '150px', color: C.blue,
          WebkitTextStroke: `14px ${C.paper}`, paintOrder: 'stroke fill'}}>
          {['东西方文明', '交流的大道'].map((line, li) => (
            <div key={li}>{line.split('').map((ch, i) => { const a = T.more + (li * 5 + i) * 0.07; return <span key={i} style={{display: 'inline-block', opacity: ramp(t, a, a + 0.2), transform: `translateY(${(1 - ramp(t, a, a + 0.25)) * 24}px)`}}>{ch}</span>; })}</div>
          ))}
        </div>
        {t > T.y - 0.1 && (
          <Plate top={1030} opacity={ramp(t, T.y - 0.1, T.y + 0.2)} width={740}>
            <div style={{fontFamily: SERIF, fontWeight: 900, fontSize: 116, lineHeight: '130px', color: C.red, transform: `scale(${pop(t, T.y, 8)})`}}>2014年</div>
            <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 36, color: C.ink, opacity: ramp(t, T.corridor, T.corridor + 0.3)}}>“丝绸之路：长安—天山廊道的路网”</div>
            <div style={{fontFamily: SERIF, fontWeight: 900, fontSize: 60, color: C.blue, marginTop: 6, opacity: ramp(t, T.list, T.list + 0.3)}}>列入《世界遗产名录》</div>
          </Plate>
        )}
      </AbsoluteFill>
    </Shot>
  );
};
export const shot11 = d;
