import {continueRender, delayRender, staticFile} from 'remotion';

let started = false;
export const loadFonts = () => {
  if (started || typeof document === 'undefined') return;
  started = true;
  const handle = delayRender('加载字体');
  const faces = [
    new FontFace('Noto Serif SC', `url(${staticFile('fonts/NotoSerifSC.ttf')})`, {weight: '200 900'}),
    new FontFace('Noto Sans SC', `url(${staticFile('fonts/NotoSansSC.ttf')})`, {weight: '100 900'}),
  ];
  Promise.all(faces.map((f) => f.load()))
    .then((loaded) => {
      loaded.forEach((f) => document.fonts.add(f));
      continueRender(handle);
    })
    .catch((e) => {
      throw new Error('字体加载失败，请先运行 tools/fetch-assets.sh: ' + e);
    });
};
