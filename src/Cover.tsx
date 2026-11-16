import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Envoy} from './assets/Figures';
import {Camel} from './assets/Icons';
import {PaperGrain} from './components/Base';
import {Node, SilkRoad} from './map/Extras';
import {MapView} from './map/MapView';
import {C, SANS, SERIF, W} from './theme';

export const Cover: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: C.paper}}>
    <MapView cam={{lon: 87, lat: 42, k: 24}} geoLabels={0.8} tag={{x: 44, y: 1070}}>
      {(p) => (
        <>
          <SilkRoad p={p} width={8} />
          <Node p={p} name="长安" lit={1} size={40} dx={-16} dy={50} anchor="end" />
          <Node p={p} name="敦煌" lit={1} size={34} dx={0} dy={-22} anchor="middle" />
          <Node p={p} name="大宛" lit={1} size={34} dx={0} dy={-22} anchor="middle" />
        </>
      )}
    </MapView>
    <div style={{position: 'absolute', left: 0, top: 0, width: W, height: 780, background: `linear-gradient(${C.paper} 0%, ${C.paper} 68%, rgba(243,233,210,0) 100%)`}} />
    {/* 沙丘与驼队 */}
    <svg width={W} height={900} viewBox="0 0 1080 900" style={{position: 'absolute', left: 0, top: 980}}>
      <path d="M0 300 C200 200 380 330 600 250 C800 180 950 260 1080 220 V900 H0 Z" fill="#C99A5B" />
      <path d="M0 380 C260 300 420 420 700 350 C860 310 980 360 1080 340 V900 H0 Z" fill={C.ochre} />
      <path d="M0 520 C300 440 520 560 1080 470 V900 H0 Z" fill="#7A4B1E" />
    </svg>
    <div style={{position: 'absolute', left: 120, top: 1100}}><Envoy size={150} followers={1} /></div>
    {[390, 560, 730].map((x, i) => <div key={x} style={{position: 'absolute', left: x, top: 1110 + i * 12 - (i === 1 ? 22 : 0)}}><Camel size={170} color="#3A2A1A" /></div>)}
    <PaperGrain />
    <div style={{position: 'absolute', left: 0, width: W, top: 230, textAlign: 'center'}}>
      <div style={{fontFamily: SERIF, fontWeight: 900, fontSize: 118, color: C.ink, letterSpacing: 6}}><span style={{color: C.red, fontSize: 150}}>3</span>分钟讲透</div>
      <div style={{fontFamily: SERIF, fontWeight: 900, fontSize: 186, lineHeight: '230px', color: C.red, letterSpacing: 2, marginTop: -6}}>丝绸之路</div>
      <div style={{display: 'inline-block', marginTop: 22, background: C.blue, color: C.paper, fontFamily: SANS, fontWeight: 700, fontSize: 50, padding: '10px 36px 14px', borderRadius: 12, borderBottom: `8px solid ${C.red}`}}>七年级历史｜张骞出使西域</div>
    </div>
  </AbsoluteFill>
);
