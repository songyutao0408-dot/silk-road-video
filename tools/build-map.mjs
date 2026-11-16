// 把 Natural Earth 公开数据（陆地、湖泊、黄河）简化成示意底图用的 SVG 路径。
// 只取自然地理要素，不含任何国界和行政区划。
import fs from 'node:fs';
const load = (n) => JSON.parse(fs.readFileSync(`.cache/${n}.geojson`, 'utf8'));
const BOX = {w: -40, e: 160, s: -60, n: 85};
// 与 src/map/projection.ts 保持一致：等距圆柱投影，标准纬线 38°N
const KX = Math.cos((38 * Math.PI) / 180);
const proj = ([lon, lat]) => [+(lon * KX).toFixed(3), +(-lat).toFixed(3)];

function dp(pts, tol) {
  if (pts.length < 3) return pts;
  const keep = new Uint8Array(pts.length); keep[0] = keep[pts.length - 1] = 1;
  const st = [[0, pts.length - 1]];
  while (st.length) {
    const [a, b] = st.pop(); let md = 0, mi = -1;
    const [ax, ay] = pts[a], [bx, by] = pts[b]; const dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy) || 1e-9;
    for (let i = a + 1; i < b; i++) { const d = L < 1e-6 ? Math.hypot(pts[i][0] - ax, pts[i][1] - ay) : Math.abs((pts[i][0] - ax) * dy - (pts[i][1] - ay) * dx) / L; if (d > md) { md = d; mi = i; } }
    if (md > tol) { keep[mi] = 1; st.push([a, mi], [mi, b]); }
  }
  return pts.filter((_, i) => keep[i]);
}
const inBox = (ring) => ring.some(([x, y]) => x > BOX.w && x < BOX.e && y > BOX.s && y < BOX.n);
const clamp = ([x, y]) => [Math.max(BOX.w - 5, Math.min(BOX.e + 5, x)), Math.max(BOX.s - 5, Math.min(BOX.n + 5, y))];
const toPath = (ring, close) => ring.map(proj).map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join('') + (close ? 'Z' : '');
const polys = (g) => (g.type === 'Polygon' ? [g.coordinates] : g.coordinates);

let land = '';
for (const f of load('ne_50m_land').features)
  for (const poly of polys(f.geometry))
    for (const ring of poly) {
      if (!inBox(ring)) continue;
      const r = dp(ring.map(clamp), 0.12); if (r.length > 3) land += toPath(r, true);
    }
let lakes = '';
const LAKES = ['Aral Sea', 'Lake Balkhash', 'Issyk-Kul', 'Qinghai Hu', 'Lake Baikal', 'Bosten Hu'];
for (const f of load('ne_50m_lakes').features) {
  const n = f.properties.name || '';
  if (!LAKES.some((k) => n.includes(k))) continue;
  for (const poly of polys(f.geometry)) lakes += toPath(dp(poly[0], 0.06), true);
}
let huanghe = '';
for (const f of load('ne_50m_rivers_lake_centerlines').features) {
  const n = (f.properties.name || '') + (f.properties.name_en || '');
  if (!/Huang|Yellow/i.test(n)) continue;
  const ls = f.geometry.type === 'LineString' ? [f.geometry.coordinates] : f.geometry.coordinates;
  for (const l of ls) huanghe += toPath(dp(l, 0.04), false);
}
fs.writeFileSync('src/map/geo.json', JSON.stringify({land, lakes, huanghe}));
console.log('land', land.length, 'lakes', lakes.length, 'huanghe', huanghe.length);
