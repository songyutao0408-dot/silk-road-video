import React from 'react';
import {C} from '../theme';

type P = {size?: number; color?: string; flip?: boolean};
const box = (size: number, flip?: boolean, vb = '0 0 200 150'): React.SVGProps<SVGSVGElement> => ({
  width: size, height: size * 0.75, viewBox: vb, style: {overflow: 'visible', transform: flip ? 'scaleX(-1)' : undefined},
});

/** 双峰驼剪影（默认朝左＝向西） */
export const Camel: React.FC<P> = ({size = 120, color = '#5E3B16', flip}) => (
  <svg {...box(size, flip)}>
    <path d="M44 74 C50 56 60 54 66 62 C70 28 94 26 100 58 C106 28 130 28 136 62 C152 60 164 68 166 84 L164 100 C150 108 62 108 50 98 Z" fill={color} />
    <path d="M56 98 C38 94 30 72 28 52 L12 54 C4 54 2 44 10 42 L28 34 C40 32 44 44 44 56 C46 68 54 74 62 76 Z" fill={color} />
    {[58, 76, 136, 152].map((x, i) => <path key={x} d={`M${x} 98 L${x + (i % 2 ? 3 : -3)} 144`} stroke={color} strokeWidth={9} strokeLinecap="round" />)}
    <path d="M166 84 q10 10 5 26" fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" />
    <path d="M92 62 h22 v22 h-22 z" fill={C.red} />
  </svg>
);

/** 良马（朝右＝向东） */
export const Horse: React.FC<P> = ({size = 120, color = '#5E3B16', flip}) => (
  <svg {...box(size, flip)}>
    <ellipse cx={98} cy={80} rx={52} ry={25} fill={color} />
    <path d="M132 64 L156 22 L176 34 L158 92 Z" fill={color} />
    <path d="M154 22 L160 8 L168 22 L190 40 L192 52 L174 54 L162 44 Z" fill={color} />
    <path d="M150 24 C138 36 132 50 128 64" fill="none" stroke="#2B2B2B" strokeWidth={8} strokeLinecap="round" />
    {[[64, 98, 54, 142], [82, 100, 86, 142], [124, 100, 118, 142], [142, 94, 152, 142]].map(([a, b, c, e], i) => (
      <path key={i} d={`M${a} ${b} L${c} ${e}`} stroke={color} strokeWidth={10} strokeLinecap="round" />
    ))}
    <path d="M48 72 C28 76 24 104 32 124" fill="none" stroke="#2B2B2B" strokeWidth={9} strokeLinecap="round" />
  </svg>
);

/** 丝绸：一匹卷起的丝帛 */
export const Silk: React.FC<P> = ({size = 120, color = C.red}) => (
  <svg {...box(size)}>
    <path d="M30 52 H150 C170 52 170 104 150 104 H30 Z" fill={color} />
    <ellipse cx={30} cy={78} rx={14} ry={26} fill="#E9B7A8" stroke={color} strokeWidth={5} />
    <path d="M30 66 a6 12 0 1 0 0.1 0" fill="none" stroke={color} strokeWidth={3} />
    <path d="M150 104 C176 108 186 124 172 140 C150 128 120 136 96 126 C116 118 138 116 150 104 Z" fill="#D2614F" />
    {[64, 96, 128].map((x) => <path key={x} d={`M${x} 56 q8 22 0 44`} fill="none" stroke="#8E2A20" strokeWidth={3} />)}
  </svg>
);

/** 铁器：铁锸（农具） */
export const Iron: React.FC<P> = ({size = 120}) => (
  <svg {...box(size)}>
    <rect x={93} y={4} width={14} height={76} rx={5} fill={C.ochre} />
    <path d="M62 70 H138 V112 C138 134 112 146 100 148 C88 146 62 134 62 112 Z" fill="#4A5560" stroke="#2B2B2B" strokeWidth={4} strokeLinejoin="round" />
    <path d="M74 80 V112 C74 124 86 132 96 136" fill="none" stroke="#8D9AA6" strokeWidth={5} strokeLinecap="round" />
  </svg>
);

/** 漆器：朱漆耳杯 */
export const Lacquer: React.FC<P> = ({size = 120}) => (
  <svg {...box(size)}>
    <ellipse cx={100} cy={70} rx={78} ry={34} fill="#2B2B2B" />
    <ellipse cx={100} cy={66} rx={62} ry={24} fill={C.red} />
    <path d="M22 70 C26 110 60 132 100 132 C140 132 174 110 178 70 Z" fill="#2B2B2B" />
    <path d="M50 100 q50 22 100 0" fill="none" stroke={C.red} strokeWidth={5} />
    <path d="M66 62 q34 -14 68 0" fill="none" stroke="#E8B04A" strokeWidth={4} strokeLinecap="round" />
  </svg>
);

/** 苜蓿：三出复叶 + 紫花 */
export const Alfalfa: React.FC<P> = ({size = 120}) => (
  <svg {...box(size)}>
    <path d="M100 146 C100 110 98 80 104 40" fill="none" stroke="#4E6B36" strokeWidth={6} strokeLinecap="round" />
    {[[100, 108, -1], [102, 80, 1]].map(([x, y, s], i) => (
      <g key={i} transform={`translate(${x} ${y}) scale(${s} 1)`}>
        <path d="M0 0 L34 -8" stroke="#4E6B36" strokeWidth={4} />
        <ellipse cx={46} cy={-24} rx={11} ry={17} fill="#6F8F4E" transform="rotate(20 46 -24)" />
        <ellipse cx={56} cy={-6} rx={11} ry={17} fill="#7FA05A" transform="rotate(75 56 -6)" />
        <ellipse cx={42} cy={8} rx={10} ry={16} fill="#6F8F4E" transform="rotate(125 42 8)" />
      </g>
    ))}
    {[[104, 38], [94, 28], [112, 24], [102, 14], [92, 44], [114, 40]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={8} ry={10} fill={i % 2 ? '#8E5BA8' : '#7B4A93'} />)}
  </svg>
);

/** 胡麻（芝麻）：带蒴果的植株 */
export const Sesame: React.FC<P> = ({size = 120}) => (
  <svg {...box(size)}>
    <path d="M100 148 V16" stroke="#4E6B36" strokeWidth={6} strokeLinecap="round" />
    {[36, 64, 92].map((y, i) => (
      <g key={y}>
        <path d={`M100 ${y + 16} C84 ${y + 10} 78 ${y - 6} 82 ${y - 18} C94 ${y - 10} 100 ${y} 100 ${y + 16} Z`} fill="#C9A55A" stroke="#7E5122" strokeWidth={2.5} />
        <path d={`M100 ${y + 16} C116 ${y + 10} 122 ${y - 6} 118 ${y - 18} C106 ${y - 10} 100 ${y} 100 ${y + 16} Z`} fill="#C9A55A" stroke="#7E5122" strokeWidth={2.5} />
        <path d={`M100 ${y + 30} C${i % 2 ? 140 : 60} ${y + 26} ${i % 2 ? 158 : 42} ${y + 40} ${i % 2 ? 166 : 34} ${y + 52} C${i % 2 ? 140 : 60} ${y + 56} ${i % 2 ? 116 : 84} ${y + 48} 100 ${y + 30} Z`} fill="#6F8F4E" />
      </g>
    ))}
    {[[40, 132], [54, 140], [150, 136], [164, 128], [30, 144]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={6} ry={4} fill="#E6D3A0" stroke="#7E5122" strokeWidth={2} />)}
  </svg>
);

/** 金饼（汉代黄金，非圆形方孔钱） */
export const GoldCake: React.FC<P> = ({size = 120}) => (
  <svg {...box(size)}>
    <ellipse cx={120} cy={104} rx={62} ry={30} fill="#B8862B" />
    <ellipse cx={120} cy={96} rx={62} ry={30} fill="#E0AE3F" stroke="#8A6218" strokeWidth={3} />
    <ellipse cx={120} cy={96} rx={36} ry={15} fill="#C7952F" />
    <ellipse cx={72} cy={66} rx={56} ry={27} fill="#B8862B" />
    <ellipse cx={72} cy={58} rx={56} ry={27} fill="#EDBE52" stroke="#8A6218" strokeWidth={3} />
    <ellipse cx={72} cy={58} rx={32} ry={13} fill="#D3A237" />
  </svg>
);

/** 牛羊：一头牛 + 一只羊 */
export const Livestock: React.FC<P> = ({size = 120}) => (
  <svg {...box(size)}>
    <ellipse cx={74} cy={66} rx={50} ry={28} fill="#7A4B1E" />
    <path d="M110 50 L140 40 L150 62 L128 78 Z" fill="#7A4B1E" />
    <path d="M132 40 C128 26 140 20 148 22 M146 44 C156 34 162 36 166 42" fill="none" stroke="#2B2B2B" strokeWidth={5} strokeLinecap="round" />
    {[40, 58, 92, 108].map((x) => <path key={x} d={`M${x} 86 V126`} stroke="#7A4B1E" strokeWidth={10} strokeLinecap="round" />)}
    <g transform="translate(118 84)">
      {[[10, 22], [28, 14], [46, 20], [58, 32], [40, 38], [20, 38]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={15} fill="#F7F0E0" stroke="#2B2B2B" strokeWidth={2.5} />)}
      <circle cx={34} cy={28} r={18} fill="#F7F0E0" />
      <ellipse cx={72} cy={24} rx={11} ry={13} fill="#2B2B2B" />
      <path d="M18 48 V64 M48 48 V64" stroke="#2B2B2B" strokeWidth={6} strokeLinecap="round" />
    </g>
  </svg>
);

/** 竹简：写着竖排字的简册 */
export const BambooSlips: React.FC<{text: string; size?: number}> = ({text, size = 200}) => (
  <svg width={size} height={size * 1.25} viewBox="0 0 200 250" style={{overflow: 'visible'}}>
    {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={12 + i * 36} y={10 + (i % 2) * 4} width={32} height={228} rx={4} fill={i % 2 ? '#D9B877' : '#CDA862'} stroke="#7E5122" strokeWidth={2.5} />)}
    {[52, 196].map((y) => <path key={y} d={`M8 ${y} H196 M8 ${y + 7} H196`} stroke="#7A4B1E" strokeWidth={3} />)}
    {text.split('').map((ch, i) => (
      <text key={i} x={100} y={118 + i * 62} textAnchor="middle" fontFamily="'Noto Serif SC', serif" fontWeight={900} fontSize={56} fill={C.ink}>{ch}</text>
    ))}
  </svg>
);
