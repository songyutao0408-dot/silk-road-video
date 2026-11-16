import {Config} from '@remotion/cli/config';
import fs from 'node:fs';

// 云端环境用预装的 Chromium headless shell；本地没有这个路径时走 Remotion 默认浏览器
const shell = '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
if (fs.existsSync(shell)) Config.setBrowserExecutable(shell);
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setCodec('h264');
Config.setPixelFormat('yuv420p');
Config.setOverwriteOutput(true);
