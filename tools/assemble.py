#!/usr/bin/env python3
"""把分镜头片段合成整片，并导出字幕和旁白稿。
用法: python3 tools/assemble.py preview|final [--no-bgm]
  BGM:  public/audio/bgm.wav 存在时自动混入，音量压在配音之下，旁白出现时再自动压低（闪避）
  视频: 各镜头片段无损拼接（不二次压缩画面）
  音频: 按时间轴把 13 段配音重新铺一遍，避免逐段拼接产生的累计偏差
  输出: preview → preview/full_preview.mp4
        final   → output/丝绸之路.mp4 + .srt + 旁白文本
"""
import json, math, os, subprocess, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
mode = sys.argv[1] if len(sys.argv) > 1 else "preview"
FPS = 30
shots = [json.load(open(f"src/data/shot{i:02d}.json", encoding="utf-8")) for i in range(1, 14)]
off, t = [], 0.0
for s in shots:
    off.append(t)
    t += math.ceil(s["duration"] * FPS) / FPS
total = t

def ts(x):
    ms = round(x * 1000)
    return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"

srt, n = [], 1
for s, o in zip(shots, off):
    for ln in s["lines"]:
        srt.append(f"{n}\n{ts(o + s['pad'] + ln['start'])} --> {ts(o + s['pad'] + ln['end'])}\n{ln['text']}\n")
        n += 1
txt = ["《丝绸之路》分镜头旁白稿", f"（配音 zh-CN-YunxiNeural，全片 {int(total // 60)} 分 {total % 60:.0f} 秒）", ""]
for s, o in zip(shots, off):
    txt += [f"镜头{s['id']}｜{s['title']}（{ts(o)[3:8]} 起，{s['duration']:.1f} 秒）", s["text"], ""]

seg = f"out/{mode}"
# 先去掉各片段自带的音轨再拼接：片段里音轨比画面略长，直接拼会让画面逐段后移
with open(f"{seg}/list.txt", "w") as f:
    for s in shots:
        name = f"shot{s['id']:02d}"
        subprocess.check_call(["ffmpeg", "-v", "error", "-y", "-i", f"{seg}/{name}.mp4", "-an", "-c", "copy", f"{seg}/{name}_v.mp4"])
        f.write(f"file '{name}_v.mp4'\n")
cmd = ["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", f"{seg}/list.txt"]
flt = []
for i, (s, o) in enumerate(zip(shots, off)):
    cmd += ["-i", "public/" + s["audio"]]
    flt.append(f"[{i + 1}:a]aresample=48000,adelay={round((o + s['pad']) * 1000)}:all=1[a{i}]")
BGM = "public/audio/bgm.wav"
use_bgm = os.path.exists(BGM) and "--no-bgm" not in sys.argv
voice = "".join(f"[a{i}]" for i in range(len(shots))) + f"amix=inputs={len(shots)}:normalize=0,apad=whole_dur={total:.3f}"
if use_bgm:
    cmd += ["-i", BGM]
    k = len(shots) + 1
    flt.append(voice + ",asplit=2[v1][v2]")
    flt.append(f"[{k}:a]aresample=48000,highpass=f=55,volume=-9dB[b0]")
    flt.append("[b0][v2]sidechaincompress=threshold=0.02:ratio=5:attack=40:release=600[b1]")
    flt.append("[v1][b1]amix=inputs=2:normalize=0,loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000[a]")
else:
    flt.append(voice + ",loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000[a]")
suffix = "" if use_bgm or mode != "final" else "_无BGM"
if mode == "final":
    os.makedirs("output", exist_ok=True)
    out = f"output/丝绸之路{suffix}.mp4"
    open("output/丝绸之路.srt", "w", encoding="utf-8").write("\n".join(srt))
    open("output/丝绸之路_旁白文本.txt", "w", encoding="utf-8").write("\n".join(txt))
else:
    out = "preview/full_preview.mp4"
    open("preview/full_preview.srt", "w", encoding="utf-8").write("\n".join(srt))
cmd += ["-filter_complex", ";".join(flt), "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
        "-t", f"{total:.3f}", "-movflags", "+faststart", out]
subprocess.check_call(cmd)
print(out, f"{total:.2f}s", f"{os.path.getsize(out) / 1e6:.1f}MB", f"字幕 {n - 1} 条")
