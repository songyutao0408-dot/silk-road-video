import React from 'react';
import {AbsoluteFill, Easing} from 'remotion';
import {Detained, Envoy, Jie, Person} from '../assets/Figures';
import {PaperGrain, Shot} from '../components/Base';
import {Plate, YearBanner} from '../components/Overlays';
import raw from '../data/shot04.json';
import {City, GeoText, MapView, RouteLine} from '../map/MapView';
import {P} from '../map/places';
import {Cam, fracAt, LL, mkPath, slicePath} from '../map/projection';
import {C, SANS, SERIF, W} from '../theme';
import {cue, keys, pop, ramp, ShotData, useT, window_} from '../timing';

const d = raw as ShotData;
const lin = Easing.linear;

// —— 路线（示意）——
const CAP1: LL = [101.3, 38.4]; // 河西一带被扣
const CAP2: LL = [95.0, 37.3]; // 归途经羌中再次被扣
const OUT1 = mkPath([P.长安, [105.5, 35.3], [103.2, 36.7], CAP1]);
const OUT2 = mkPath([CAP1, [98.5, 39.8], [94.7, 40.3], [89.5, 42.5], [83, 41.5], [76.2, 39.6], [73.6, 39.9], P.大宛, P.康居, P.大月氏, P.大夏]);
const RET1 = mkPath([P.大夏, [71, 37.2], [75.5, 37.6], [80, 37.0], [85.5, 37.7], [90.5, 38.2], CAP2]);
const RET2 = mkPath([CAP2, [99, 36.3], [103.8, 35.4], P.长安]);
const XIONGNU: LL[] = [[84, 52], [124, 52], [124, 42.5], [113, 41.2], [107, 40], [103.6, 38.2], [101.6, 37], [97, 38.3], [93, 39.6], [88, 43.6], [84, 46]];

// —— 时间点（全部跟着配音走）——
const T = {
  people: cue(d, '一百多人'),
  go: cue(d, '出发') - 0.5,
  zone: cue(d, '刚进入'),
  cap1: cue(d, '就被扣留'),
  years: cue(d, '十多年'),
  mission: cue(d, '始终'),
  escape: cue(d, '逃了出来'),
  yuezhi: cue(d, '大月氏'),
  settled: cue(d, '可大月氏'),
  back: cue(d, '回程'),
  cap2: cue(d, '扣留了一年多'),
  y126: cue(d, '公元前126年'),
  home: cue(d, '回到长安'),
  recap: cue(d, '出发时'),
  two: cue(d, '两个'),
};
const ARR = {大宛: T.yuezhi - 1.4, 康居: T.yuezhi - 0.8, 大月氏: T.yuezhi - 0.1, 大夏: T.yuezhi + 1.0};
const F = {大宛: fracAt(OUT2, P.大宛), 康居: fracAt(OUT2, P.康居), 大月氏: fracAt(OUT2, P.大月氏)};

export const Shot04: React.FC = () => {
  const t = useT();
  const p1 = ramp(t, T.go, T.cap1 - 0.1);
  const p2 = keys(t, [T.escape, ARR.大宛, ARR.康居, ARR.大月氏, ARR.大夏], [0, F.大宛, F.康居, F.大月氏, 1], lin);
  const p3 = ramp(t, T.back, T.cap2 + 0.2);
  const p4 = ramp(t, T.y126 + 0.5, T.home + 1.0);

  const camT = [0, T.go, T.cap1, T.escape, ARR.大宛, ARR.大夏, T.back, T.cap2 + 0.3, T.y126 + 0.5, T.home + 1.0, d.duration];
  const cam: Cam = {
    lon: keys(t, camT, [106.8, 106.8, 102.2, 102.2, 76, 69.4, 69.4, 92.5, 92.5, 106.5, 107.2]),
    lat: keys(t, camT, [36.6, 36.6, 39.2, 39.2, 40.3, 39.8, 39.8, 38.2, 38.2, 36.0, 35.6]),
    k: keys(t, camT, [64, 64, 60, 60, 54, 62, 62, 50, 50, 62, 68]),
  };

  const seg1 = slicePath(OUT1, p1), seg2 = slicePath(OUT2, p2), seg3 = slicePath(RET1, p3), seg4 = slicePath(RET2, p4);
  const returning = t >= T.back;
  const head: LL = p4 > 0 ? seg4.head : returning ? seg3.head : p2 > 0 ? seg2.head : seg1.head;
  const moving = (t > T.go && t < T.cap1) || (t > T.escape && t < ARR.大夏) || (t > T.back && t < T.cap2 + 0.2) || (t > T.y126 + 0.5 && t < T.home + 1);
  const bob = moving ? Math.abs(Math.sin(t * 9)) * 7 : 0;
  const shake = t > T.cap1 && t < T.cap1 + 0.5 ? Math.sin(t * 60) * 6 * (1 - (t - T.cap1) / 0.5) : 0;
  const zone = ramp(t, T.zone - 0.2, T.zone + 0.5);
  const is126 = t >= T.y126;
  const final2 = t >= T.two;

  const detainOp = window_(t, T.cap1 + 0.1, T.escape - 0.1);
  const yearN = Math.min(10, 1 + Math.floor(Math.max(0, t - T.cap1 - 0.3) * 4));
  const settledOp = window_(t, T.settled, T.back - 0.2);
  const cap2Op = window_(t, T.cap2 - 0.1, T.y126 + 0.4);
  const recapOp = ramp(t, T.recap - 0.2, T.recap + 0.2);

  return (
    <Shot data={d}>
      <AbsoluteFill style={{backgroundColor: C.paper}}>
        <MapView cam={cam}>
          {(p) => {
            const [hx, hy] = p(head[0], head[1]);
            const xg = XIONGNU.map(([lo, la]) => p(lo, la).join(',')).join(' ');
            return (
              <>
                <defs>
                  <pattern id="hatch" width={18} height={18} patternUnits="userSpaceOnUse" patternTransform="rotate(40)">
                    <line x1={0} y1={0} x2={0} y2={18} stroke={C.ink} strokeWidth={3} opacity={0.28} />
                  </pattern>
                </defs>
                <g opacity={zone}>
                  <polygon points={xg} fill={C.ink} opacity={0.08} />
                  <polygon points={xg} fill="url(#hatch)" />
                  <GeoText p={p(P.匈奴[0], P.匈奴[1])} text="匈奴" color={C.ink} size={64} spacing={24} opacity={0.8 * (1 - ramp(t, T.home, T.home + 0.5))} />
                  <GeoText p={p(97.2, 40.9)} text="匈奴控制区" color={C.ink} size={30} spacing={4} opacity={0.8} />
                </g>
                <RouteLine pts={seg1.pts} p={p} />
                {p2 > 0 && <RouteLine pts={seg2.pts} p={p} />}
                {p3 > 0 && <RouteLine pts={seg3.pts} p={p} color={C.blue} dash="10 12" />}
                {p4 > 0 && <RouteLine pts={seg4.pts} p={p} color={C.blue} dash="10 12" />}
                <City p={p(P.长安[0], P.长安[1])} name="长安" lit={Math.max(ramp(t, 0.4, 1.0), 0.999 * +(t > 1))} size={42} dx={18} dy={46} />
                {(['大宛', '康居', '大月氏', '大夏'] as const).map((n) => (
                  <City key={n} p={p(P[n][0], P[n][1])} name={n} lit={ramp(t, ARR[n] - 0.1, ARR[n] + 0.5)}
                    show={ramp(t, T.escape, T.escape + 0.6) * 0.999 + 0.001}
                    {...(n === '大宛' ? {dx: 18, dy: 44} : {dx: -18, anchor: 'end' as const})} />
                ))}
                {/* 扣留地点的毡帐 */}
                {[{at: T.cap1, ll: CAP1, ox: -190, oy: -130}, {at: T.cap2, ll: CAP2, ox: 14, oy: 14}].map(({at, ll, ox, oy}, i) => {
                  const [x, y] = p(ll[0], ll[1]);
                  const s = pop(t, at, 10);
                  return (
                    <g key={i} transform={`translate(${x + ox} ${y + oy}) scale(${s * 0.8})`} style={{transformOrigin: '70px 110px', transformBox: 'fill-box'}}>
                      <foreignObject width={240} height={170} style={{overflow: 'visible'}}><Detained size={140} /></foreignObject>
                    </g>
                  );
                })}
                {/* 使团 */}
                {t > T.people - 0.2 && !final2 && (
                  <g transform={`translate(${hx - (returning ? 173 : 0) + shake} ${hy - 106 - bob})`} opacity={ramp(t, T.people - 0.2, T.people + 0.2)}>
                    <foreignObject width={220} height={130} style={{overflow: 'visible'}}>
                      <Envoy size={108} followers={returning ? 1 : 2} flip={returning} />
                    </foreignObject>
                  </g>
                )}
              </>
            );
          }}
        </MapView>
        <PaperGrain />

        <YearBanner text={is126 ? '公元前126年' : '公元前138年'} flipAt={T.y126} />
        {/* 人数计数器 */}
        <div style={{position: 'absolute', left: 0, width: W, top: 318, display: 'flex', justifyContent: 'center', opacity: ramp(t, T.people - 0.1, T.people + 0.2)}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 18, background: 'rgba(243,233,210,.94)', border: `3px solid ${C.ink}`, borderRadius: 60, padding: '6px 34px',
            transform: `scale(${final2 ? 0.9 + 0.1 * pop(t, T.two, 8) : 0.6 + 0.4 * pop(t, T.people, 9)})`}}>
            <span style={{fontFamily: SANS, fontWeight: 700, fontSize: 36, color: C.ink}}>使团人数</span>
            <span style={{fontFamily: SERIF, fontWeight: 900, fontSize: 72, lineHeight: '84px', color: C.red, minWidth: 120, textAlign: 'center'}}>{final2 ? '2' : '100+'}</span>
          </div>
        </div>

        {/* 被扣十余年：日月飞转 */}
        {detainOp > 0 && (
          <Plate top={1010} opacity={detainOp} width={720}>
            <div style={{display: 'flex', alignItems: 'center', gap: 34}}>
              <svg width={190} height={190} viewBox="-95 -95 190 190">
                <circle r={84} fill="none" stroke={C.ink} strokeWidth={4} />
                {Array.from({length: 12}).map((_, i) => <line key={i} x1={0} y1={-84} x2={0} y2={-70} stroke={C.ink} strokeWidth={4} transform={`rotate(${i * 30})`} />)}
                <g transform={`rotate(${(t - T.cap1) * 520})`}>
                  <circle cx={0} cy={-48} r={19} fill={C.red} />
                  <path d="M-14 36 A18 18 0 1 0 14 60 A14 14 0 1 1 -14 36 Z" fill={C.blue} />
                </g>
                <circle r={7} fill={C.ink} />
              </svg>
              <div style={{textAlign: 'left'}}>
                <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 40, color: C.ink}}>
                  被匈奴扣留{t < T.years ? <span style={{color: C.ochre}}>　第 {yearN} 年</span> : null}
                </div>
                <div style={{fontFamily: SERIF, fontWeight: 900, fontSize: 118, lineHeight: '136px', color: C.red, transform: `scale(${pop(t, T.years, 8)})`, transformOrigin: '0 60%'}}>十余年</div>
              </div>
            </div>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginTop: 6, height: 70 * ramp(t, T.mission, T.mission + 0.3), overflow: 'hidden', opacity: ramp(t, T.mission, T.mission + 0.4)}}>
              <svg width={34} height={66} viewBox="-16 0 32 80"><Jie h={80} /></svg>
              <span style={{fontFamily: SERIF, fontWeight: 700, fontSize: 46, color: C.blue, letterSpacing: 4}}>持汉节不失</span>
            </div>
          </Plate>
        )}
        {/* 大月氏不想再打仗 */}
        {settledOp > 0 && (
          <Plate top={1050} opacity={settledOp} width={680}>
            <div style={{fontFamily: SERIF, fontWeight: 900, fontSize: 58, color: C.blue}}>大月氏</div>
            <div style={{fontFamily: SANS, fontWeight: 500, fontSize: 40, color: C.ink, marginTop: 8}}>土地肥沃　生活安定</div>
            <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 46, color: C.red, marginTop: 10, opacity: ramp(t, cue(d, '不想再打仗'), cue(d, '不想再打仗') + 0.3)}}>不想再和匈奴打仗</div>
          </Plate>
        )}
        {cap2Op > 0 && (
          <Plate top={1080} opacity={cap2Op} width={620}>
            <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 40, color: C.ink}}>归途又被匈奴扣留</div>
            <div style={{fontFamily: SERIF, fontWeight: 900, fontSize: 104, lineHeight: '124px', color: C.red, transform: `scale(${pop(t, cue(d, '一年多'), 8)})`}}>一年多</div>
          </Plate>
        )}
        {/* 出发 100+ → 归来 2 */}
        {recapOp > 0 && (
          <Plate top={1000} opacity={recapOp} width={740}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 30}}>
              <div>
                <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 38, color: C.ink}}>出发</div>
                <div style={{fontFamily: SERIF, fontWeight: 900, fontSize: 104, lineHeight: '120px', color: C.blue}}>100+</div>
              </div>
              <svg width={90} height={50} viewBox="0 0 90 50" ><path d="M4 25 H70 M52 7 L74 25 L52 43" fill="none" stroke={C.ink} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" /></svg>
              <div>
                <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 38, color: C.ink}}>归来</div>
                {final2 ? (
                  <div style={{fontFamily: SERIF, fontWeight: 900, fontSize: 150, lineHeight: '120px', color: C.red, transform: `scale(${pop(t, T.two, 6)})`}}>2</div>
                ) : (
                  <div style={{fontFamily: SERIF, fontWeight: 900, fontSize: 104, lineHeight: '120px', color: C.ochre, opacity: 0.6}}>？</div>
                )}
              </div>
              <svg width={150} height={130} viewBox="-40 -14 150 140" style={{opacity: ramp(t, T.two + 0.2, T.two + 0.5)}}>
                <Person x={0} y={0} s={0.95} /><Person x={62} y={10} s={0.88} color="#4a4540" />
              </svg>
            </div>
            <div style={{fontFamily: SANS, fontWeight: 500, fontSize: 34, color: C.ink, marginTop: 10, opacity: ramp(t, T.two + 0.3, T.two + 0.6)}}>只剩张骞和随从堂邑父</div>
          </Plate>
        )}
      </AbsoluteFill>
    </Shot>
  );
};
export const shot04 = d;
