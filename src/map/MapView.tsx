import React, {useMemo} from 'react';
import {C, H, SANS, SERIF, W} from '../theme';
import geo from './geo.json';
import {DESERT, HUANGHE_LABEL, MOUNTAINS} from './places';
import {Cam, KX, LL, mkProject, Project, smooth, worldTransform} from './projection';

const rng = (seed: number) => () => {
  seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// 山脉符号的位置（沿山脊线均匀取点，带一点随机错落）
const PEAKS = MOUNTAINS.map((m, mi) => {
  const r = rng(mi + 3);
  const dense = smooth(m.line, 24);
  const out: {ll: LL; s: number}[] = [];
  let acc = 0.5;
  for (let i = 1; i < dense.length; i++) {
    acc += Math.hypot((dense[i][0] - dense[i - 1][0]) * KX, dense[i][1] - dense[i - 1][1]);
    if (acc >= 0.62) {
      acc = 0;
      out.push({ll: [dense[i][0], dense[i][1] + (r() - 0.5) * 0.35], s: 0.8 + r() * 0.45});
    }
  }
  return out;
});
const DUNES = (() => {
  const r = rng(42);
  const out: {ll: LL; kind: number}[] = [];
  while (out.length < 110) {
    const u = r() * 2 - 1, v = r() * 2 - 1;
    if (u * u + v * v > 0.92) continue;
    out.push({ll: [DESERT.center[0] + (u * DESERT.rx) / KX, DESERT.center[1] + v * DESERT.ry], kind: r()});
  }
  return out;
})();

export const GeoText: React.FC<{p: [number, number]; text: string; color: string; size?: number; opacity?: number; spacing?: number}> = ({p, text, color, size = 30, opacity = 0.85, spacing = 6}) => (
  <text x={p[0]} y={p[1]} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={size} letterSpacing={spacing}
    fill={color} opacity={opacity} stroke={C.paper} strokeWidth={6} strokeOpacity={0.8} paintOrder="stroke" strokeLinejoin="round">
    {text}
  </text>
);

/** 古代路线示意底图：海岸线、黄河、山脉、沙漠。不含任何现代国界。 */
export const MapView: React.FC<{
  cam: Cam;
  geoLabels?: number; // 山河名称的不透明度
  tag?: {x: number; y: number} | null; // “示意图”标注位置
  children?: (p: Project, cam: Cam) => React.ReactNode;
}> = ({cam, geoLabels = 1, tag = {x: 44, y: 1300}, children}) => {
  const p = useMemo(() => mkProject(cam), [cam.lon, cam.lat, cam.k]);
  const tf = worldTransform(cam);
  const peak = cam.k * 0.3;
  const [dx, dy] = p(DESERT.center[0], DESERT.center[1]);
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', left: 0, top: 0}}>
      <rect width={W} height={H} fill={C.sea} />
      <g transform={tf}>
        <path d={geo.land} fill={C.paper} stroke={C.blue} strokeOpacity={0.55} strokeWidth={2.2} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
        <path d={geo.lakes} fill={C.sea} stroke={C.blue} strokeOpacity={0.5} strokeWidth={1.6} vectorEffect="non-scaling-stroke" />
        <path d={geo.huanghe} fill="none" stroke={C.blue} strokeOpacity={0.75} strokeWidth={3.2} vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {/* 沙漠 */}
      <ellipse cx={dx} cy={dy} rx={DESERT.rx * cam.k} ry={DESERT.ry * cam.k} fill={C.ochre} opacity={0.13} />
      {DUNES.map((d, i) => {
        const [x, y] = p(d.ll[0], d.ll[1]);
        if (x < -20 || x > W + 20) return null;
        return d.kind < 0.3 ? (
          <path key={i} d={`M${x - 9} ${y} q9 -8 18 0`} fill="none" stroke={C.ochre} strokeWidth={2} opacity={0.6} strokeLinecap="round" />
        ) : (
          <circle key={i} cx={x} cy={y} r={1.8} fill={C.ochre} opacity={0.55} />
        );
      })}
      {/* 山脉 */}
      {PEAKS.map((list, mi) => list.map((pk, i) => {
        const [x, y] = p(pk.ll[0], pk.ll[1]);
        if (x < -40 || x > W + 40 || y < -40 || y > H + 40) return null;
        const s = peak * pk.s;
        return (
          <g key={`${mi}-${i}`} transform={`translate(${x} ${y})`}>
            <path d={`M${-s} ${s * 0.45} L${-s * 0.15} ${-s * 0.75} L${s * 0.25} ${-s * 0.2} L${s * 0.5} ${-s * 0.5} L${s * 1.1} ${s * 0.45} Z`} fill={C.ochre} opacity={0.78} />
            <path d={`M${-s * 0.15} ${-s * 0.75} L${s * 0.25} ${-s * 0.2} L${s * 0.05} ${s * 0.45} L${-s * 0.55} ${s * 0.45} Z`} fill={C.paper} opacity={0.3} />
          </g>
        );
      }))}
      {geoLabels > 0 && (
        <g opacity={geoLabels}>
          {MOUNTAINS.map((m) => <GeoText key={m.name} p={p(m.label[0], m.label[1])} text={m.name} color={C.ochre} />)}
          <GeoText p={p(DESERT.center[0], DESERT.center[1] + 0.25)} text={DESERT.name} color={C.ochre} size={28} />
          <GeoText p={p(HUANGHE_LABEL[0], HUANGHE_LABEL[1])} text="黄河" color={C.blue} size={28} />
        </g>
      )}
      {children?.(p, cam)}
      {tag && (
        <g transform={`translate(${tag.x} ${tag.y})`} opacity={0.9}>
          <rect width={108} height={44} rx={6} fill={C.paper} stroke={C.ink} strokeWidth={1.5} opacity={0.9} />
          <text x={54} y={30} textAnchor="middle" fontFamily={SANS} fontSize={24} fontWeight={500} fill={C.ink} letterSpacing={2}>示意图</text>
        </g>
      )}
    </svg>
  );
};

/** 路线：朱红虚线，下面垫一层纸色保证可读 */
export const RouteLine: React.FC<{pts: LL[]; p: Project; color?: string; width?: number; dash?: string; opacity?: number}> = ({pts, p, color = C.red, width = 7, dash = '18 12', opacity = 1}) => {
  if (pts.length < 2) return null;
  const d = pts.map(([lo, la], i) => { const [x, y] = p(lo, la); return `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`; }).join('');
  return (
    <g opacity={opacity}>
      <path d={d} fill="none" stroke={C.paper} strokeWidth={width + 7} strokeLinecap="round" strokeLinejoin="round" opacity={0.75} />
      <path d={d} fill="none" stroke={color} strokeWidth={width} strokeDasharray={dash} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
};

/** 城市/国家：小圆点 + 文字标签；lit 为点亮程度 0~1 */
export const City: React.FC<{p: [number, number]; name: string; lit?: number; show?: number; dx?: number; dy?: number; anchor?: 'start' | 'middle' | 'end'; size?: number}> = ({p, name, lit = 0, show = 1, dx = 16, dy = 12, anchor = 'start', size = 36}) => {
  if (show <= 0) return null;
  const pulse = lit > 0 && lit < 1 ? lit : 0;
  return (
    <g opacity={show}>
      {pulse > 0 && <circle cx={p[0]} cy={p[1]} r={10 + pulse * 46} fill="none" stroke={C.red} strokeWidth={5} opacity={1 - pulse} />}
      {lit > 0 && <circle cx={p[0]} cy={p[1]} r={20} fill={C.red} opacity={0.22 * lit} />}
      <circle cx={p[0]} cy={p[1]} r={9 + 3 * lit} fill={lit > 0.5 ? C.red : C.paper} stroke={lit > 0.5 ? C.paper : C.ink} strokeWidth={3} />
      <text x={p[0] + dx} y={p[1] + dy} textAnchor={anchor} fontFamily={SANS} fontWeight={700} fontSize={size}
        fill={lit > 0.5 ? C.red : C.ink} stroke={C.paper} strokeWidth={8} paintOrder="stroke" strokeLinejoin="round">
        {name}
      </text>
    </g>
  );
};
