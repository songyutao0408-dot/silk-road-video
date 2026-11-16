import React from 'react';

type P = {size?: number};
const box = (size: number): React.SVGProps<SVGSVGElement> => ({width: size, height: size, viewBox: '0 0 200 200', style: {overflow: 'visible'}});

export const Grapes: React.FC<P> = ({size = 200}) => {
  const rows: [number, number[]][] = [[76, [40, 80, 120, 160]], [108, [60, 100, 140]], [140, [80, 120]], [172, [100]]];
  return (
    <svg {...box(size)}>
      <path d="M100 58 C98 40 104 28 112 14" fill="none" stroke="#7A4B1E" strokeWidth={8} strokeLinecap="round" />
      <path d="M112 30 C132 4 170 8 186 30 C170 34 164 52 140 54 C126 54 116 44 112 30 Z" fill="#6F8F4E" />
      <path d="M116 32 C140 26 160 28 180 30" fill="none" stroke="#4E6B36" strokeWidth={3} strokeLinecap="round" />
      {rows.map(([y, xs], r) => xs.map((x, i) => (
        <g key={`${r}-${i}`}>
          <circle cx={x} cy={y} r={23} fill={(r + i) % 2 ? '#7B4A93' : '#8E5BA8'} stroke="#4A2A5C" strokeWidth={2.5} />
          <circle cx={x - 8} cy={y - 8} r={6} fill="#D9BCE8" opacity={0.75} />
        </g>
      )))}
    </svg>
  );
};

export const Pomegranate: React.FC<P> = ({size = 200}) => (
  <svg {...box(size)}>
    <path d="M80 54 L74 20 L90 36 L100 14 L110 36 L126 20 L120 54 Z" fill="#9E2F22" stroke="#6E1F16" strokeWidth={2.5} strokeLinejoin="round" />
    <circle cx={100} cy={116} r={72} fill="#C8452F" stroke="#7E261B" strokeWidth={3} />
    <path d="M52 84 C44 100 42 118 48 136" fill="none" stroke="#F0A28C" strokeWidth={8} strokeLinecap="round" opacity={0.7} />
    <path d="M96 78 C128 74 150 98 148 130 C146 156 126 168 106 164 C116 136 112 106 96 78 Z" fill="#F6E3C8" stroke="#7E261B" strokeWidth={2.5} />
    {[[118, 96], [134, 112], [120, 118], [136, 134], [122, 140], [112, 104], [126, 154], [112, 128]].map(([x, y], i) => (
      <ellipse key={i} cx={x} cy={y} rx={7} ry={8.5} fill="#B83A2E" />
    ))}
  </svg>
);

export const Walnut: React.FC<P> = ({size = 200}) => (
  <svg {...box(size)}>
    <ellipse cx={100} cy={106} rx={70} ry={78} fill="#B9803F" stroke="#6B4018" strokeWidth={4} />
    <path d="M100 28 C110 70 110 140 100 184" fill="none" stroke="#6B4018" strokeWidth={6} strokeLinecap="round" />
    {['M84 52 C62 66 64 86 80 96', 'M78 108 C54 116 56 140 76 150', 'M52 84 C44 98 46 112 52 122', 'M120 54 C142 66 138 88 124 98',
      'M126 110 C150 120 144 144 126 152', 'M150 86 C158 100 156 116 150 126', 'M86 162 C92 168 96 170 98 170'].map((d, i) => (
      <path key={i} d={d} fill="none" stroke="#7E5122" strokeWidth={4.5} strokeLinecap="round" />
    ))}
    <path d="M56 66 C48 76 44 88 44 98" fill="none" stroke="#E2B77E" strokeWidth={6} strokeLinecap="round" opacity={0.7} />
  </svg>
);
