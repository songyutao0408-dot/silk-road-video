import React from 'react';
import {C} from '../theme';

/** 汉节：竹竿上缀三重牦牛尾 */
export const Jie: React.FC<{x?: number; h?: number}> = ({x = 0, h = 150}) => (
  <g transform={`translate(${x} 0)`}>
    <line x1={0} y1={0} x2={0} y2={h} stroke={C.ink} strokeWidth={4.5} strokeLinecap="round" />
    {[10, 30, 50].map((y) => (
      <path key={y} d={`M0 ${y} C-12 ${y + 4} -13 ${y + 16} -9 ${y + 22} L0 ${y + 14} L9 ${y + 22} C13 ${y + 16} 12 ${y + 4} 0 ${y} Z`} fill={C.red} />
    ))}
  </g>
);

/** 人物剪影（汉服长袍、戴冠） */
export const Person: React.FC<{x?: number; y?: number; s?: number; color?: string}> = ({x = 0, y = 0, s = 1, color = C.ink}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-7} y={-12} width={14} height={11} rx={2} fill={color} />
    <circle cx={0} cy={10} r={13} fill={color} />
    <path d="M0 24 C-22 28 -26 62 -30 122 L30 122 C26 62 22 28 0 24 Z" fill={color} />
  </g>
);

/** 使团：持节的张骞 + 随从。n 为随从人数，朝左（向西）绘制 */
export const Envoy: React.FC<{size?: number; followers?: number; flip?: boolean}> = ({size = 120, followers = 2, flip}) => (
  <svg width={size * 1.6} height={size} viewBox="0 0 240 150" style={{overflow: 'visible', transform: flip ? 'scaleX(-1)' : undefined}}>
    {Array.from({length: followers}).map((_, i) => (
      <Person key={i} x={128 + i * 44} y={44} s={0.82} color="#4a4540" />
    ))}
    <Person x={70} y={22} s={1} />
    <path d="M62 62 L36 72" stroke={C.ink} strokeWidth={10} strokeLinecap="round" />
    <Jie x={34} h={146} />
  </svg>
);

/** 毡帐 + 持矛看守：表示被匈奴扣留（软禁看管，而非牢狱） */
export const Detained: React.FC<{size?: number}> = ({size = 150}) => (
  <svg width={size * 1.5} height={size} viewBox="0 0 225 150" style={{overflow: 'visible'}}>
    <path d="M8 86 Q78 -6 148 86 Z" fill={C.ochre} stroke="#5E3B16" strokeWidth={3} strokeLinejoin="round" />
    <rect x={16} y={86} width={124} height={54} fill="#C6935A" stroke="#5E3B16" strokeWidth={3} />
    <circle cx={78} cy={36} r={8} fill="#5E3B16" />
    {[36, 56, 100, 120].map((x) => <path key={x} d={`M${x} 88 l10 26 l-10 26`} fill="none" stroke="#8A5A26" strokeWidth={2.5} />)}
    <path d="M64 140 V104 Q78 92 92 104 V140 Z" fill={C.ink} />
    <path d="M20 86 H136" stroke="#5E3B16" strokeWidth={5} />
    <Person x={186} y={30} s={0.9} />
    <line x1={212} y1={2} x2={212} y2={142} stroke={C.ink} strokeWidth={4.5} strokeLinecap="round" />
    <path d="M212 -18 L204 6 H220 Z" fill={C.ink} />
    <path d="M192 70 L212 76" stroke={C.ink} strokeWidth={9} strokeLinecap="round" />
  </svg>
);
