// 抽帧自检：node tools/stills.mjs <镜头号> <秒,秒,...|N张> [--guides] [--scale=0.5] [--out=out/stills]
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
const args = process.argv.slice(2);
const flags = Object.fromEntries(args.filter((a) => a.startsWith('--')).map((a) => a.slice(2).split('=')));
const [shot, spec = '5'] = args.filter((a) => !a.startsWith('--'));
const id = `Shot${String(shot).padStart(2, '0')}`;
const shell = '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const browserExecutable = fs.existsSync(shell) ? shell : undefined;
const inputProps = {guides: 'guides' in flags};
const outDir = flags.out || 'out/stills';
fs.mkdirSync(outDir, {recursive: true});
const serveUrl = await bundle({entryPoint: 'src/index.ts'});
const comp = await selectComposition({serveUrl, id, inputProps, browserExecutable});
const dur = comp.durationInFrames / comp.fps;
const times = spec.includes(',') || spec.includes('.') ? spec.split(',').map(Number)
  : Array.from({length: +spec}, (_, i) => ((i + 0.5) * dur) / +spec);
for (const t of times) {
  const frame = Math.min(comp.durationInFrames - 1, Math.round(t * comp.fps));
  const output = `${outDir}/${id}_${t.toFixed(1).padStart(5, '0')}s.png`;
  await renderStill({composition: comp, serveUrl, output, frame, inputProps, browserExecutable, scale: +(flags.scale || 0.5)});
  console.log(output);
}
