import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, staticFile} from 'remotion';
import {C, CONTENT_W, FPS, H, SAFE, SANS, SUB_BOTTOM, W} from '../theme';
import {ShotData, useT} from '../timing';
import {loadFonts} from '../fonts';

loadFonts();

/** 宣纸底 */
export const Paper: React.FC<{dark?: boolean; children?: React.ReactNode}> = ({dark, children}) => (
  <AbsoluteFill style={{backgroundColor: dark ? C.dark : C.paper}}>
    {children}
    <PaperGrain dark={dark} />
  </AbsoluteFill>
);

/** 纸纹叠加层（放在画面最上面，统一质感） */
export const PaperGrain: React.FC<{dark?: boolean}> = ({dark}) => (
  <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: dark ? 'screen' : 'multiply', opacity: dark ? 0.06 : 0.55}}>
    <Img src={staticFile('paper.png')} style={{width: W, height: H}} />
  </AbsoluteFill>
);

/** 烧录字幕：白字黑描边，底边距画面底部 480px，宽度限制在安全区内 */
export const Subtitles: React.FC<{data: ShotData}> = ({data}) => {
  const t = useT() - data.pad;
  const line = data.lines.find((l) => t >= l.start && t < l.end);
  if (!line) return null;
  // 描边层和填充层分开画，避免描边吃掉笔画
  const base: React.CSSProperties = {
    position: 'absolute', left: SAFE.left - 20, width: CONTENT_W + 40, bottom: SUB_BOTTOM,
    textAlign: 'center', fontFamily: SANS, fontWeight: 700, fontSize: 46, lineHeight: '64px',
    letterSpacing: 2, whiteSpace: 'nowrap',
  };
  return (
    <>
      <div style={{...base, color: '#111', WebkitTextStroke: '10px #111', textShadow: '0 3px 8px rgba(0,0,0,.5)'}}>{line.text}</div>
      <div style={{...base, color: '#fff'}}>{line.text}</div>
    </>
  );
};

/** 墨迹晕开转场：镜头开头墨色从中心散开，结尾向中心合拢（都落在 0.3 秒留白内） */
export const InkTransition: React.FC<{data: ShotData; intro?: boolean; outro?: boolean}> = ({data, intro = true, outro = true}) => {
  const t = useT();
  const D = 0.28;
  let r: number | null = null; // 透明圆的半径（占对角线百分比）
  if (intro && t < D) r = (t / D) ** 1.6 * 115;
  else if (outro && t > data.duration - D) r = (Math.max(0, data.duration - t - 0.03) / D) ** 1.6 * 115;
  if (r === null) return null;
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 44%, rgba(30,27,25,0) ${Math.max(0, r - 14)}%, rgba(30,27,25,.75) ${r - 4}%, ${C.dark} ${r + 4}%)`}} />
  );
};

/** 镜头外壳：配音（前后各留 0.3 秒）+ 字幕 + 转场 */
export const Shot: React.FC<{data: ShotData; intro?: boolean; outro?: boolean; children: React.ReactNode}> = ({data, intro, outro, children}) => (
  <AbsoluteFill style={{backgroundColor: C.dark}}>
    {children}
    <Subtitles data={data} />
    <InkTransition data={data} intro={intro} outro={outro} />
    <Sequence from={Math.round(data.pad * FPS)} layout="none">
      <Audio src={staticFile(data.audio)} />
    </Sequence>
  </AbsoluteFill>
);

/** 调试用：显示安全区（渲染时传 --props='{"guides":true}'） */
export const SafeGuides: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    <div style={{position: 'absolute', left: 0, top: 0, width: W, height: SAFE.top, background: 'rgba(255,0,0,.25)'}} />
    <div style={{position: 'absolute', left: 0, bottom: 0, width: W, height: SAFE.bottom, background: 'rgba(255,0,0,.25)'}} />
    <div style={{position: 'absolute', right: 0, top: 0, width: SAFE.right, height: H, background: 'rgba(255,0,0,.25)'}} />
  </AbsoluteFill>
);
