export const W = 1080;
export const H = 1920;
export const FPS = 30;

export const C = {
  paper: '#F3E9D2',
  red: '#B83A2E',
  blue: '#2C4A6B',
  ochre: '#A0662D',
  ink: '#2B2B2B',
  dark: '#1E1B19',
  sea: '#D5DCCF',
};

export const SERIF = "'Noto Serif SC', serif";
export const SANS = "'Noto Sans SC', sans-serif";

// 抖音安全区：顶部 150、底部 450、右侧 160。内容左右对称留 160，保证居中又不被遮挡
export const SAFE = {top: 150, bottom: 450, right: 160, left: 160};
export const CONTENT_W = W - SAFE.left - SAFE.right; // 760
export const SUB_BOTTOM = 480; // 字幕底边距画面底部
