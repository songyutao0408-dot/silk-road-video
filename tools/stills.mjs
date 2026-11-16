// 抽帧自检：node tools/stills.mjs <镜头号>:<秒,秒|N张> [更多...] [--guides] [--scale=0.5] [--out=out/stills] [--sheet=拼图.jpg]
// 例：node tools/stills.mjs 1:2.5,9 4:6 --guides     （"4:6" 表示镜头4 均匀抽 6 张）
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
const args = process.argv.slice(2);
const flags = Object.fromEntries(args.filter((a) => a.startsWith('--')).map((a) => a.slice(2).split('=')));
const jobs = args.filter((a) => !a.startsWith('--'));
const shell = '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const browserExecutable = fs.existsSync(shell) ? shell : undefined;
const inputProps = {guides: 'guides' in flags};
const outDir = flags.out || 'out/stills';
const scale = +(flags.scale || 0.5);
fs.mkdirSync(outDir, {recursive: true});
const serveUrl = await bundle({entryPoint: 'src/index.ts'});
const files = [];
for (const job of jobs) {
  const [shot, spec = '4'] = job.split(':');
  const id = /^\d+$/.test(shot) ? `Shot${shot.padStart(2, '0')}` : shot;
  const comp = await selectComposition({serveUrl, id, inputProps, browserExecutable});
  const dur = comp.durationInFrames / comp.fps;
  const times = spec.includes(',') || spec.includes('.') ? spec.split(',').map(Number)
    : Array.from({length: +spec}, (_, i) => ((i + 0.5) * dur) / +spec);
  for (const t of times) {
    const frame = Math.min(comp.durationInFrames - 1, Math.round(t * comp.fps));
    const output = `${outDir}/${id}_${t.toFixed(1).padStart(5, '0')}s.png`;
    await renderStill({composition: comp, serveUrl, output, frame, inputProps, browserExecutable, scale});
    files.push(output);
  }
}
console.log(files.length, 'frames');
if (flags.sheet) {
  const cols = Math.min(+(flags.cols || 6), files.length);
  const ins = files.flatMap((f) => ['-i', f]);
  const w = 1080 * scale, h = 1920 * scale;
  const layout = files.map((_, i) => `${(i % cols) * w}_${Math.floor(i / cols) * h}`).join('|');
  execFileSync('ffmpeg', ['-v', 'error', '-y', ...ins, '-filter_complex',
    files.length > 1 ? `xstack=inputs=${files.length}:layout=${layout}:fill=0xF3E9D2` : 'null', '-q:v', '3', flags.sheet]);
  console.log(flags.sheet);
}
