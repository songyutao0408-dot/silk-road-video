import React from 'react';
import {C} from '../theme';
import {City, GeoText, RouteLine} from './MapView';
import {XIONGNU} from './places';
import {LL, Path, Project, slicePath} from './projection';
import {EAST, NORTH, NODES, SOUTH, WEST} from './silkroad';

/** 沿路径生长的箭头 */
export const Arrow: React.FC<{path: Path; p: Project; prog: number; color?: string; width?: number; dash?: string; head?: number}> = ({path, p, prog, color = C.red, width = 9, dash, head = 26}) => {
  if (prog <= 0.02) return null;
  const {pts} = slicePath(path, prog);
  const xy = pts.map(([a, b]) => p(a, b));
  const [x1, y1] = xy[xy.length - 1], [x0, y0] = xy[Math.max(0, xy.length - 4)];
  const ang = (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI;
  const d = xy.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join('');
  return (
    <g>
      <path d={d} fill="none" stroke={C.paper} strokeWidth={width + 6} strokeLinecap="round" strokeLinejoin="round" opacity={0.7} />
      <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dash} />
      <path d={`M${head} 0 L${-head * 0.5} ${-head * 0.62} L${-head * 0.5} ${head * 0.62} Z`} fill={color} stroke={C.paper} strokeWidth={3} transform={`translate(${x1} ${y1}) rotate(${ang})`} />
    </g>
  );
};

/** 匈奴控制区（斜线阴影） */
export const XiongnuZone: React.FC<{p: Project; opacity: number; label?: LL; labelOpacity?: number; id?: string}> = ({p, opacity, label = [104.5, 44.6], labelOpacity = 0.8, id = 'hatch'}) => {
  const xg = XIONGNU.map(([lo, la]) => p(lo, la).join(',')).join(' ');
  return (
    <g opacity={opacity}>
      <defs>
        <pattern id={id} width={18} height={18} patternUnits="userSpaceOnUse" patternTransform="rotate(40)">
          <line x1={0} y1={0} x2={0} y2={18} stroke={C.ink} strokeWidth={3} opacity={0.28} />
        </pattern>
      </defs>
      <polygon points={xg} fill={C.ink} opacity={0.08} />
      <polygon points={xg} fill={`url(#${id})`} />
      <GeoText p={p(label[0], label[1])} text="匈奴" color={C.ink} size={64} spacing={24} opacity={labelOpacity} />
    </g>
  );
};

/** 丝绸之路全线。pE/pN/pS/pW 为各段描出的进度 */
export const SilkRoad: React.FC<{p: Project; pE?: number; pN?: number; pS?: number; pW?: number; width?: number; color?: string}> = ({p, pE = 1, pN = 1, pS = 1, pW = 1, width = 7, color}) => (
  <>
    {pE > 0 && <RouteLine pts={slicePath(EAST, pE).pts} p={p} width={width} color={color} />}
    {pN > 0 && <RouteLine pts={slicePath(NORTH, pN).pts} p={p} width={width} color={color} />}
    {pS > 0 && <RouteLine pts={slicePath(SOUTH, pS).pts} p={p} width={width} color={color} />}
    {pW > 0 && <RouteLine pts={slicePath(WEST, pW).pts} p={p} width={width} color={color} />}
  </>
);

export const Node: React.FC<{p: Project; name: string; lit?: number; show?: number; dx?: number; dy?: number; anchor?: 'start' | 'middle' | 'end'; size?: number; label?: string}> = ({p, name, label, ...rest}) => {
  const ll = NODES[name];
  return <City p={p(ll[0], ll[1])} name={label ?? name} {...rest} />;
};
