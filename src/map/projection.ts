export type LL = [number, number]; // [经度, 纬度]
export type Cam = {lon: number; lat: number; k: number}; // k = 每纬度像素数
export type Project = (lon: number, lat: number) => [number, number];

// 等距圆柱投影，标准纬线 38°N（与 tools/build-map.mjs 一致）
export const KX = Math.cos((38 * Math.PI) / 180);
// 地图焦点落在画面中部（避开顶部标题和底部字幕）
export const FOCUS = {x: 540, y: 820};

export const mkProject = (cam: Cam, focus = FOCUS): Project => (lon, lat) => [
  focus.x + (lon - cam.lon) * KX * cam.k,
  focus.y - (lat - cam.lat) * cam.k,
];
export const worldTransform = (cam: Cam, focus = FOCUS) =>
  `translate(${focus.x - cam.lon * KX * cam.k} ${focus.y + cam.lat * cam.k}) scale(${cam.k})`;

/** Catmull-Rom 平滑并加密折线 */
export const smooth = (pts: LL[], per = 16): LL[] => {
  const out: LL[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    for (let j = 0; j < per; j++) {
      const s = j / per, s2 = s * s, s3 = s2 * s;
      const f = (a: number, b: number, c: number, d: number) =>
        0.5 * (2 * b + (-a + c) * s + (2 * a - 5 * b + 4 * c - d) * s2 + (-a + 3 * b - 3 * c + d) * s3);
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
};

export type Path = {pts: LL[]; cum: number[]; total: number};
export const mkPath = (raw: LL[]): Path => {
  const pts = smooth(raw);
  const cum = [0];
  for (let i = 1; i < pts.length; i++)
    cum.push(cum[i - 1] + Math.hypot((pts[i][0] - pts[i - 1][0]) * KX, pts[i][1] - pts[i - 1][1]));
  return {pts, cum, total: cum[cum.length - 1]};
};

/** 取路径前 p（0~1）部分，返回折线和端点 */
export const slicePath = (path: Path, p: number): {pts: LL[]; head: LL} => {
  const target = Math.max(0, Math.min(1, p)) * path.total;
  const out: LL[] = [path.pts[0]];
  for (let i = 1; i < path.pts.length; i++) {
    if (path.cum[i] <= target) out.push(path.pts[i]);
    else {
      const s = (target - path.cum[i - 1]) / (path.cum[i] - path.cum[i - 1] || 1);
      const a = path.pts[i - 1], b = path.pts[i];
      out.push([a[0] + (b[0] - a[0]) * s, a[1] + (b[1] - a[1]) * s]);
      break;
    }
  }
  return {pts: out, head: out[out.length - 1]};
};

/** 路径上离某地最近处的进度（0~1） */
export const fracAt = (path: Path, at: LL): number => {
  let best = 0, bd = Infinity;
  path.pts.forEach((p, i) => {
    const d = Math.hypot((p[0] - at[0]) * KX, p[1] - at[1]);
    if (d < bd) { bd = d; best = i; }
  });
  return path.cum[best] / path.total;
};
