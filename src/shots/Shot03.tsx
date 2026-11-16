import React from 'react';
import {AbsoluteFill} from 'remotion';
import {PaperGrain, Shot} from '../components/Base';
import raw from '../data/shot03.json';
import {Arrow, Node, XiongnuZone} from '../map/Extras';
import {GeoText, MapView} from '../map/MapView';
import {P} from '../map/places';
import {Cam, mkPath} from '../map/projection';
import {C, SANS, SERIF} from '../theme';
import {cue, keys, pop, ramp, ShotData, useT} from '../timing';

const d = raw as ShotData;
const RAIDS = [[99.5, 103.5, 107.5].map((lon, i) => mkPath([[lon, 43.6], [lon + 0.4, 42], [lon + 0.8 - i * 0.3, 39.6 - i * 0.5]]))][0];
const CONTACT = mkPath([P.长安, [101, 38.6], [91, 40.6], [79, 40.2], [70.5, 39.3]]);
const PINCER_E = mkPath([[107.5, 36.2], [107, 39], [105.5, 41.8]]);
const PINCER_W = mkPath([[70, 40.5], [80, 45.5], [91, 46.6], [97.5, 45.6]]);

export const Shot03: React.FC = () => {
  const t = useT();
  const T = {xn: cue(d, '北方的匈奴'), raid: cue(d, '南下'), wu: cue(d, '汉武帝'), yz: cue(d, '西边的大月氏'), hate: cue(d, '有仇'), contact: cue(d, '派人去联络'), pincer: cue(d, '一起对付')};
  const camT = [0, T.xn - 0.2, T.raid, T.yz - 0.6, T.yz + 0.8];
  const cam: Cam = {lon: keys(t, camT, [107.5, 107.5, 104, 104, 92.5]), lat: keys(t, camT, [36, 36, 40, 40, 40.2]), k: keys(t, camT, [60, 60, 40, 40, 24.5])};
  const wu = pop(t, T.wu, 11);
  return (
    <Shot data={d}>
      <AbsoluteFill style={{backgroundColor: C.paper}}>
        <MapView cam={cam} geoLabels={0.75}>
          {(p) => (
            <>
              <GeoText p={p(106.5, 28.8)} text="西汉" color={C.blue} size={60} spacing={18} opacity={0.75 * ramp(t, 0.3, 0.8)} />
              <XiongnuZone p={p} opacity={ramp(t, T.xn - 0.2, T.xn + 0.5)} label={[105, 46]} />
              {RAIDS.map((path, i) => <Arrow key={i} path={path} p={p} prog={ramp(t, T.raid + i * 0.18, T.raid + 0.7 + i * 0.18)} color={C.ink} width={11} />)}
              <Arrow path={CONTACT} p={p} prog={ramp(t, T.contact, T.contact + 1.2)} color={C.blue} width={7} dash="14 12" head={22} />
              <Arrow path={PINCER_E} p={p} prog={ramp(t, T.pincer, T.pincer + 0.7)} />
              <Arrow path={PINCER_W} p={p} prog={ramp(t, T.pincer + 0.1, T.pincer + 0.9)} />
              <Node p={p} name="长安" lit={ramp(t, 0.3, 0.9)} size={42} dx={-18} dy={48} anchor="end" />
              <Node p={p} name="大月氏" lit={ramp(t, T.yz, T.yz + 0.6)} show={ramp(t, T.yz - 0.2, T.yz + 0.2)} size={42} dx={-4} dy={58} anchor="start" />
              {t > T.hate && (() => { const [x, y] = p(P.大月氏[0], P.大月氏[1]); const s = pop(t, T.hate, 9); return (
                <g transform={`translate(${x + 6} ${y - 96}) scale(${s})`}>
                  <rect x={0} y={0} width={236} height={58} rx={10} fill={C.red} />
                  <text x={118} y={41} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={34} fill={C.paper}>与匈奴有仇</text>
                </g>); })()}
            </>
          )}
        </MapView>
        <PaperGrain />
        {/* 汉武帝剪影（左上角，安全区以下） */}
        <div style={{position: 'absolute', left: 60, top: 180, width: 250, transform: `scale(${wu})`, transformOrigin: '50% 50%', textAlign: 'center'}}>
          <svg width={250} height={250} viewBox="-125 -125 250 250">
            <circle r={118} fill={C.paper} stroke={C.ink} strokeWidth={5} />
            <circle r={104} fill="none" stroke={C.red} strokeWidth={3} />
            <clipPath id="wuclip"><circle r={103} /></clipPath>
            <g clipPath="url(#wuclip)">
              <path d="M0 -8 C-70 0 -92 60 -100 130 H100 C92 60 70 0 0 -8 Z" fill={C.ink} />
              <circle cx={0} cy={-34} r={30} fill={C.ink} />
              <rect x={-58} y={-82} width={116} height={13} rx={3} fill={C.ink} transform="rotate(-5)" />
              <rect x={-20} y={-76} width={40} height={18} fill={C.ink} />
              {[-50, -38, -26, 26, 38, 50].map((x) => <line key={x} x1={x} y1={-70 - x * 0.09} x2={x} y2={-36 - x * 0.09} stroke={C.red} strokeWidth={4} strokeDasharray="6 4" />)}
              <path d="M-24 6 L0 40 L24 6" fill="none" stroke={C.red} strokeWidth={7} />
            </g>
          </svg>
          <div style={{fontFamily: SERIF, fontWeight: 900, fontSize: 48, color: C.ink, marginTop: 2, WebkitTextStroke: `8px ${C.paper}`, paintOrder: 'stroke fill'}}>汉武帝</div>
        </div>
      </AbsoluteFill>
    </Shot>
  );
};
export const shot03 = d;
