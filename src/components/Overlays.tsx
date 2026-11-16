import React from 'react';
import {C, SERIF, W} from '../theme';
import {useT} from '../timing';

/** 纸色信息牌，水平居中 */
export const Plate: React.FC<{top: number; width?: number; opacity?: number; children: React.ReactNode}> = ({top, width = 720, opacity = 1, children}) => (
  <div style={{position: 'absolute', left: (W - width) / 2, top, width, opacity, transform: `translateY(${(1 - opacity) * 24}px)`, boxSizing: 'border-box',
    background: 'rgba(243,233,210,.95)', border: `4px solid ${C.ink}`, borderRadius: 18, padding: '22px 30px', textAlign: 'center',
    boxShadow: `10px 10px 0 rgba(43,43,43,.18)`}}>
    {children}
  </div>
);

/** 顶部年份条（在安全区 150px 以下）。flipAt 时刻翻转换字 */
export const YearBanner: React.FC<{text: string; flipAt?: number; top?: number}> = ({text, flipAt, top = 172}) => {
  const t = useT();
  const enter = Math.min(1, t / 0.3);
  const flip = flipAt === undefined ? 1 : Math.min(1, Math.abs(t - flipAt) / 0.18);
  return (
    <div style={{position: 'absolute', left: 0, width: W, top, display: 'flex', justifyContent: 'center', opacity: enter}}>
      <div style={{transform: `scaleY(${flip})`, background: C.blue, color: C.paper, fontFamily: SERIF, fontWeight: 900, fontSize: 76, lineHeight: '104px',
        padding: '4px 44px 8px', borderRadius: 10, letterSpacing: 3, borderBottom: `8px solid ${C.red}`, boxShadow: '8px 8px 0 rgba(43,43,43,.2)'}}>
        {text}
      </div>
    </div>
  );
};
