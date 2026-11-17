#!/usr/bin/env python3
"""用代码合成一支原创国风 BGM（D 宫五声音阶，拨弦 + 箫 + 手鼓 + 长音铺底）。
不使用任何现成乐曲或采样，所有声音由 numpy 计算得到。
编排跟着镜头走：读取 src/data/shotNN.json 的时长，每个镜头用不同的配器和乐句。
输出: public/audio/bgm.wav（44.1kHz 立体声，与全片等长）
用法: python3 tools/bgm.py
"""
import json, math, os, wave
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 44100
BPM = 80
BEAT = 60 / BPM
BAR = 4 * BEAT
FPS = 30

shots = [json.load(open(os.path.join(ROOT, f"src/data/shot{i:02d}.json"), encoding="utf-8")) for i in range(1, 14)]
offs, t = [], 0.0
for s in shots:
    offs.append(t)
    t += math.ceil(s["duration"] * FPS) / FPS
TOTAL = t
N = int((TOTAL + 4) * SR)
rng = np.random.default_rng(138)

# —— 音高：简谱 1 2 3 5 6（D 宫），8 9 10 12 13 为高八度 ——
D4 = 293.66
SEMI = {1: 0, 2: 2, 3: 4, 5: 7, 6: 9}

def freq(deg, octave=0):
    o, d = divmod(deg - 1, 7)
    return D4 * 2 ** ((SEMI[d + 1] + 12 * (o + octave)) / 12)

# —— 音色 ——
def pluck(f, dur, bright=1.0):
    """古筝式拨弦：谐波各自指数衰减，起音带一点下滑和拨片噪声"""
    n = int(dur * SR)
    tt = np.arange(n) / SR
    bend = 1 + 0.012 * np.exp(-tt * 28)
    ph = 2 * np.pi * np.cumsum(f * bend) / SR
    out = np.zeros(n)
    for h in range(1, 9):
        if f * h > 9000:
            break
        amp = bright ** (h - 1) / h ** 1.25 * (1.0 if h % 2 else 0.8)
        out += amp * np.exp(-tt * (1.6 + 0.9 * h)) * np.sin(h * ph + 0.3 * h)
    att = int(0.004 * SR)
    out[:att] *= np.linspace(0, 1, att)
    out[: int(0.012 * SR)] += 0.12 * rng.standard_normal(int(0.012 * SR)) * np.linspace(1, 0, int(0.012 * SR))
    return out

def flute(f, dur):
    """箫：正弦加少量泛音，带颤音和气声，起音缓"""
    n = int((dur + 0.25) * SR)
    tt = np.arange(n) / SR
    vib = 1 + 0.006 * np.sin(2 * np.pi * 5.2 * tt) * np.clip((tt - 0.25) / 0.3, 0, 1)
    ph = 2 * np.pi * np.cumsum(f * vib) / SR
    tone = np.sin(ph) + 0.28 * np.sin(2 * ph) + 0.1 * np.sin(3 * ph)
    breath = rng.standard_normal(n)
    breath = np.convolve(breath, np.ones(24) / 24, mode="same") * 0.5
    env = np.clip(tt / 0.09, 0, 1) * np.clip((dur + 0.25 - tt) / 0.25, 0, 1)
    return (tone + breath) * env * 0.5

def drum(low=True):
    n = int(0.5 * SR)
    tt = np.arange(n) / SR
    if low:  # 手鼓低音
        ph = 2 * np.pi * np.cumsum(55 + 60 * np.exp(-tt * 30)) / SR
        return np.sin(ph) * np.exp(-tt * 9) + 0.15 * rng.standard_normal(n) * np.exp(-tt * 60)
    x = rng.standard_normal(n) * np.exp(-tt * 45)  # 鼓边轻击
    return np.diff(x, prepend=0) * 0.6

def pad(f, dur):
    n = int(dur * SR)
    tt = np.arange(n) / SR
    x = sum(np.sin(2 * np.pi * f * m * tt + p) / m for m, p in ((1, 0), (2, 1.1), (3, 2.3)))
    x *= 0.75 + 0.25 * np.sin(2 * np.pi * 0.13 * tt)
    return x * np.clip(tt / 1.2, 0, 1) * np.clip((dur - tt) / 1.2, 0, 1)

L = np.zeros(N)
R = np.zeros(N)

def put(sig, at, gain=1.0, pan=0.0):
    i = int(at * SR)
    if i >= N or i < 0:
        return
    sig = sig[: N - i]
    L[i:i + len(sig)] += sig * gain * (1 - max(0, pan))
    R[i:i + len(sig)] += sig * gain * (1 + min(0, pan))

# —— 乐句（简谱音级, 拍数；0 为休止），每句 4 小节 ——
A = [(5, 1), (6, .5), (5, .5), (3, 1), (2, 1), (1, 1), (2, .5), (3, .5), (5, 2), (6, 1), (8, .5), (6, .5), (5, 1), (3, 1), (2, 1.5), (3, .5), (2, 2)]
B = [(3, .5), (5, .5), (6, 1), (8, 1), (6, 1), (5, .5), (6, .5), (5, 1), (3, 2), (2, 1), (3, .5), (5, .5), (3, 1), (2, 1), (1, 3), (0, 1)]
Cc = [(8, 1), (9, .5), (8, .5), (6, 1), (5, 1), (6, 1), (8, 1), (9, 2), (10, 1), (9, .5), (8, .5), (6, 1), (5, 1), (6, 1.5), (5, .5), (6, 2)]
SP = [(6, 2), (0, 2), (5, 1.5), (3, .5), (0, 2), (2, 2), (0, 2), (1, 3), (0, 1)]  # 稀疏、悬疑

# 每个镜头的编排：乐句、主奏音色、是否加鼓/分解和弦、整体力度
PLAN = {
    1: dict(m=SP, lead="flute", drum=0, arp=0, lvl=0.8),    # 钩子：悬疑
    2: dict(m=None, lead=None, drum=0, arp=0, lvl=1.0),     # 标题：刮奏亮相
    3: dict(m=A, lead="pluck", drum=1, arp=1, lvl=0.85),
    4: dict(m=A, lead="pluck", drum=1, arp=1, lvl=0.9, alt=B),
    5: dict(m=B, lead="flute", drum=0, arp=1, lvl=0.8),
    6: dict(m=A, lead="both", drum=1, arp=1, lvl=0.95),
    7: dict(m=Cc, lead="pluck", drum=2, arp=0, lvl=1.0),    # 凿空：重鼓
    8: dict(m=B, lead="both", drum=1, arp=1, lvl=0.9),
    9: dict(m=Cc, lead="both", drum=1, arp=1, lvl=1.0),     # 全图：最饱满
    10: dict(m=A, lead="pluck", drum=1, arp=1, lvl=0.95, alt=Cc),
    11: dict(m=Cc, lead="both", drum=1, arp=1, lvl=1.0),
    12: dict(m=B, lead="flute", drum=0, arp=1, lvl=0.75),   # 考点：安静
    13: dict(m=SP, lead="pluck", drum=0, arp=0, lvl=0.8),
}
ARP = [1 - 7, 5 - 7, 1, 5 - 7, 3, 5 - 7, 1, 5 - 7]  # 低音区分解和弦（八分音符）

def shot_at(time):
    k = 0
    for i, o in enumerate(offs):
        if time >= o - 1e-6:
            k = i
    return k + 1

def glissando(at, up=True, gain=0.5):
    degs = [1, 2, 3, 5, 6, 8, 9, 10, 12, 13, 15]
    if not up:
        degs = degs[::-1]
    for i, dg in enumerate(degs):
        put(pluck(freq(dg), 2.2, 0.95), at + i * 0.055, gain * (0.6 + 0.04 * i), pan=-0.4 + 0.08 * i)

# 长音铺底贯穿全片
put(pad(freq(1, -2), TOTAL + 1), 0, 0.055)
put(pad(freq(5, -2), TOTAL + 1), 0, 0.035, pan=0.3)

bar_start = 0.0
phrase_pos = {}
while bar_start < TOTAL - 0.5:
    sid = shot_at(bar_start)
    plan = PLAN[sid]
    idx = phrase_pos.get(sid, 0)
    phrase_pos[sid] = idx + 1
    lvl = plan["lvl"]
    # 镜头4 被扣留的十余年：鼓停下来，只留拨弦，气氛收住
    held = sid == 4 and offs[3] + 7.2 < bar_start < offs[3] + 13.5
    if plan["m"] is not None:
        motif = plan.get("alt") if plan.get("alt") and (idx // 4) % 2 else plan["m"]
        # 取出这一小节的音
        pos, bar_in_phrase = 0.0, idx % 4
        for deg, beats in motif:
            b0 = pos
            pos += beats
            if not (bar_in_phrase * 4 <= b0 < bar_in_phrase * 4 + 4) or deg == 0:
                continue
            at = bar_start + (b0 - bar_in_phrase * 4) * BEAT
            dur = beats * BEAT
            if plan["lead"] in ("pluck", "both"):
                put(pluck(freq(deg), max(1.6, dur * 2.2)), at, 0.42 * lvl, pan=-0.15)
                if beats >= 2:  # 长音加一个轻的八度回音
                    put(pluck(freq(deg + 7), 1.4, 0.7), at + BEAT, 0.14 * lvl, pan=0.3)
            if plan["lead"] in ("flute", "both"):
                put(flute(freq(deg), dur * 0.96), at, (0.30 if plan["lead"] == "flute" else 0.17) * lvl, pan=0.2)
    if plan["arp"] and not held:
        for j, dg in enumerate(ARP):
            put(pluck(freq(dg + 7, -1), 1.3, 0.75), bar_start + j * BEAT / 2, 0.15 * lvl, pan=0.35 if j % 2 else -0.35)
    if plan["drum"] and not held:
        g = 0.5 if plan["drum"] == 2 else 0.3
        put(drum(True), bar_start, g * lvl)
        put(drum(True), bar_start + 2.5 * BEAT, g * 0.7 * lvl)
        for b in (1, 3):
            put(drum(False), bar_start + b * BEAT, 0.22 * lvl, pan=0.25)
        if plan["drum"] == 2:
            put(drum(True), bar_start + 3.5 * BEAT, g * 0.6)
    bar_start += BAR

# 点题与收尾的刮奏、重音
glissando(offs[1] + 0.25, up=True, gain=0.5)          # 镜头2 卷轴展开
put(pluck(freq(1, -1), 3.5), offs[1] + 2.3, 0.55)      # “丝绸之路”四字出现
put(pluck(freq(5), 3.0), offs[1] + 2.3, 0.35, pan=0.2)
for k, o in enumerate([0.35, 0.95, 1.55, 2.15]):       # 镜头7 凿击
    put(drum(True), offs[6] + o, 0.55)
glissando(offs[8] + 0.2, up=True, gain=0.35)           # 镜头9 路线全图
glissando(TOTAL - 5.2, up=False, gain=0.4)             # 结尾下行刮奏
for dg, g in ((1 - 7, 0.6), (5 - 7, 0.4), (1, 0.4), (3, 0.3)):
    put(pluck(freq(dg + 7, -1), 4.5), TOTAL - 4.2, g)

# —— 混响（指数衰减噪声卷积）——
def reverb(x, seed):
    r = np.random.default_rng(seed)
    n = int(1.8 * SR)
    ir = r.standard_normal(n) * np.exp(-np.arange(n) / SR * 3.6)
    ir = np.convolve(ir, np.ones(6) / 6, mode="same")
    size = 1 << (len(x) + n).bit_length()
    y = np.fft.irfft(np.fft.rfft(x, size) * np.fft.rfft(ir, size), size)[: len(x)]
    return y / (np.abs(y).max() + 1e-9)

mixL = L + 0.22 * reverb(L, 1) * np.abs(L).max()
mixR = R + 0.22 * reverb(R, 2) * np.abs(R).max()
n_out = int(TOTAL * SR)
st = np.stack([mixL[:n_out], mixR[:n_out]], axis=1)
st /= np.abs(st).max() / 0.89
tt = np.arange(n_out) / SR
st *= (np.clip(tt / 0.4, 0, 1) * np.clip((TOTAL - tt) / 2.5, 0, 1))[:, None]
out = os.path.join(ROOT, "public/audio/bgm.wav")
with wave.open(out, "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((st * 32767).astype("<i2").tobytes())
print(out, f"{TOTAL:.2f}s")
