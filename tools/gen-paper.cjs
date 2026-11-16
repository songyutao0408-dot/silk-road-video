// 用代码生成一张宣纸纹理（只生成一次，渲染时作为叠加层，比逐帧跑滤镜快得多）
// 运行: NODE_PATH=$(npm root -g) node tools/gen-paper.cjs （需要 playwright）
const {chromium} = require('playwright');
const html = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920">
<filter id="n" x="0" y="0" width="100%" height="100%">
<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="a"/>
<feColorMatrix in="a" type="matrix" values="0 0 0 0 .55  0 0 0 0 .45  0 0 0 0 .3  0 0 0 .22 0" result="grain"/>
<feTurbulence type="fractalNoise" baseFrequency="0.004 0.012" numOctaves="3" seed="3" result="b"/>
<feColorMatrix in="b" type="matrix" values="0 0 0 0 .6  0 0 0 0 .45  0 0 0 0 .25  0 0 0 .5 -.12" result="cloud"/>
<feTurbulence type="fractalNoise" baseFrequency="0.02 0.6" numOctaves="2" seed="11" result="c"/>
<feColorMatrix in="c" type="matrix" values="0 0 0 0 .5  0 0 0 0 .4  0 0 0 0 .25  0 0 0 .35 -.12" result="fiber"/>
<feMerge><feMergeNode in="cloud"/><feMergeNode in="fiber"/><feMergeNode in="grain"/></feMerge>
</filter>
<rect width="1080" height="1920" fill="#fff"/>
<rect width="1080" height="1920" filter="url(#n)"/>
<radialGradient id="v" cx="50%" cy="50%" r="75%"><stop offset="60%" stop-color="#7a5a2a" stop-opacity="0"/><stop offset="100%" stop-color="#7a5a2a" stop-opacity=".22"/></radialGradient>
<rect width="1080" height="1920" fill="url(#v)"/></svg>`;
(async () => {
const b = await chromium.launch();
const p = await b.newPage({viewport: {width: 1080, height: 1920}});
await p.setContent(`<body style="margin:0">${html}</body>`);
await p.screenshot({path: 'public/paper.png'});
await b.close();
console.log('public/paper.png ok');
})();
