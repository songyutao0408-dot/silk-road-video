import React from 'react';
import {AbsoluteFill, Easing} from 'remotion';
import {Envoy} from '../assets/Figures';
import {GoldCake, Livestock, Silk} from '../assets/Icons';
import {PaperGrain, Shot} from '../components/Base';
import {Plate, YearBanner} from '../components/Overlays';
import raw from '../data/shot06.json';
import {Node} from '../map/Extras';
import {MapView, RouteLine} from '../map/MapView';
import {P} from '../map/places';
import {Cam, LL, mkPath, slicePath} from '../map/projection';
import {C, SANS, SERIF, W} from '../theme';
import {cue, keys, pop, ramp, ShotData, useT, window_} from '../timing';

const d = raw as ShotData;
const MAIN = mkPath([P.长安, [105.5, 35.3], [103, 37], [100.4, 38.9], [98.5, 39.8], P.敦煌, [91, 42.4], [87, 43.5], [83, 43.7], P.乌孙]);
const SUBS: {name: string; path: ReturnType<typeof mkPath>; lab: object}[] = [
  {name: '大宛', path: mkPath([P.乌孙, [75.5, 42.4], P.大宛]), lab: {dx: 14, dy: 46}},
  {name: '康居', path: mkPath([P.乌孙, [74, 44.4], P.康居]), lab: {dx: -16, dy: -12, anchor: 'end'}},
  {name: '大月氏', path: mkPath([P.乌孙, [76, 41], [71.5, 39.4], P.大月氏]), lab: {dx: -18, anchor: 'end'}},
  {name: '大夏', path: mkPath([P.乌孙, [77, 40.2], [72.5, 37.6], P.大夏]), lab: {dx: -18, dy: 30, anchor: 'end'}},
  {name: '安息', path: mkPath([P.乌孙, [73, 43.6], [64, 41.2], P.安息]), lab: {dx: 0, dy: 54, anchor: 'middle'}},
  {name: '身毒', path: mkPath([P.乌孙, [78, 39.6], [75.5, 34], P.身毒]), lab: {dx: 18, dy: 14}},
];
const T = {people: cue(d, '三百多人'), go: cue(d, '他带着'), cattle: cue(d, '牛羊'), gold: cue(d, '金币'), silk: cue(d, '丝绸'), wusun: cue(d, '来到乌孙') + 0.5, sub: cue(d, '又派副使'), freq: cue(d, '从此')};

export const Shot06: React.FC = () => {
  const t = useT();
  const pm = ramp(t, T.go, T.wusun, Easing.inOut(Easing.quad));
  const camT = [0, T.go, T.wusun, T.sub + 0.9, T.freq, T.freq + 1.4];
  const cam: Cam = {
    lon: keys(t, camT, [106.5, 106.5, 82.5, 69, 69, 88]),
    lat: keys(t, camT, [36.6, 36.6, 41.6, 38.2, 38.2, 39.8]),
    k: keys(t, camT, [58, 58, 46, 34, 34, 22]),
  };
  const seg = slicePath(MAIN, pm);
  const moving = t > T.go && t < T.wusun;
  const goodsOp = window_(t, T.cattle - 0.3, T.wusun - 0.4);
  const freqOp = ramp(t, T.freq + 0.2, T.freq + 0.6);
  const goods: [number, React.ReactNode, string, string][] = [
    [T.cattle, <Livestock size={150} />, '牛羊', '上万头'], [T.gold, <GoldCake size={150} />, '金币', '大量'], [T.silk, <Silk size={150} />, '丝绸', '大量'],
  ];
  return (
    <Shot data={d}>
      <AbsoluteFill style={{backgroundColor: C.paper}}>
        <MapView cam={cam}>
          {(p) => {
            const [hx, hy] = p(seg.head[0], seg.head[1]);
            return (
              <>
                <RouteLine pts={seg.pts} p={p} />
                {SUBS.map((s, i) => {
                  const a = T.sub + 0.2 + i * 0.36;
                  const pr = ramp(t, a, a + 0.55);
                  return pr > 0 ? <RouteLine key={s.name} pts={slicePath(s.path, pr).pts} p={p} width={5} dash="10 9" /> : null;
                })}
                {/* 往来频繁：路上双向移动的小点 */}
                {freqOp > 0 && Array.from({length: 10}).map((_, i) => {
                  const f = (((i % 2 ? 1 : -1) * t * 0.11 + i / 10) % 1 + 1) % 1;
                  const [x, y] = p(...slicePath(MAIN, f).head);
                  return <circle key={i} cx={x} cy={y + (i % 2 ? -9 : 9)} r={9} fill={i % 2 ? C.blue : C.red} stroke={C.paper} strokeWidth={3} opacity={freqOp} />;
                })}
                <Node p={p} name="长安" lit={1} size={42} dx={18} dy={46} />
                <Node p={p} name="乌孙" lit={ramp(t, T.wusun - 0.1, T.wusun + 0.5)} size={44} dx={16} dy={50} />
                {SUBS.map((s, i) => {
                  const a = T.sub + 0.2 + i * 0.36 + 0.5;
                  return <Node key={s.name} p={p} name={s.name} lit={ramp(t, a, a + 0.5)} show={ramp(t, T.sub - 0.3, T.sub + 0.2)} {...(s.lab as object)} />;
                })}
                {t < T.sub + 0.4 && (
                  <g transform={`translate(${hx} ${hy - 110 - (moving ? Math.abs(Math.sin(t * 9)) * 7 : 0)})`} opacity={ramp(t, 0.3, 0.6) * (1 - ramp(t, T.sub, T.sub + 0.4))}>
                    <foreignObject width={260} height={130} style={{overflow: 'visible'}}><Envoy size={112} followers={3} /></foreignObject>
                  </g>
                )}
              </>
            );
          }}
        </MapView>
        <PaperGrain />
        <YearBanner text="公元前119年" />
        <div style={{position: 'absolute', left: 0, width: W, top: 318, display: 'flex', justifyContent: 'center', opacity: ramp(t, T.people - 0.1, T.people + 0.2)}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 18, background: 'rgba(243,233,210,.94)', border: `3px solid ${C.ink}`, borderRadius: 60, padding: '6px 34px', transform: `scale(${0.6 + 0.4 * pop(t, T.people, 9)})`}}>
            <span style={{fontFamily: SANS, fontWeight: 700, fontSize: 36, color: C.ink}}>第二次出使</span>
            <span style={{fontFamily: SERIF, fontWeight: 900, fontSize: 64, lineHeight: '84px', color: C.red}}>三百多人</span>
          </div>
        </div>
        {goodsOp > 0 && (
          <Plate top={1000} opacity={goodsOp} width={740}>
            <div style={{display: 'flex', justifyContent: 'space-around'}}>
              {goods.map(([at, icon, name, num], i) => (
                <div key={i} style={{width: 210, transform: `scale(${pop(t, at, 9)})`}}>
                  <div style={{height: 116}}>{icon}</div>
                  <div style={{fontFamily: SERIF, fontWeight: 900, fontSize: 50, color: C.ink}}>{name}</div>
                  <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 34, color: C.red}}>{num}</div>
                </div>
              ))}
            </div>
          </Plate>
        )}
        {freqOp > 0 && (
          <Plate top={1130} opacity={freqOp} width={700}>
            <div style={{fontFamily: SERIF, fontWeight: 900, fontSize: 60, color: C.blue}}>汉朝 <span style={{color: C.red}}>⇄</span> 西域</div>
            <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 44, color: C.ink, marginTop: 6}}>往来越来越频繁</div>
          </Plate>
        )}
      </AbsoluteFill>
    </Shot>
  );
};
export const shot06 = d;
