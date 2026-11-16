#!/usr/bin/env python3
"""按镜头生成配音（edge-tts / zh-CN-YunxiNeural / +0%）和字幕时间轴。
用法: python3 tools/tts.py [镜头号 ...]   不带参数则生成全部。
输出: public/audio/shotNN.mp3, src/data/shotNN.json
"""
import asyncio, json, os, re, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CA = os.environ.get("SSL_CERT_FILE")
if CA and os.path.exists(CA):  # 云端环境走代理，需信任环境提供的 CA
    import certifi
    certifi.where = lambda: CA
import edge_tts

VOICE, RATE = "zh-CN-YunxiNeural", "+0%"
PAD = 0.3          # 镜头前后各留 0.3 秒
MAXLEN = 16        # 字幕每行最多 16 字
HARD = "，。？！；：…—"
PUNCT = HARD + "、“”‘’《》（）,.?!;: "


def vlen(s):  # 字幕显示长度（去掉行尾标点后）
    return len(s)


def clean(s):
    s = s.strip().lstrip("，。；：、—")
    s = re.sub(r"[，。；：、—]+$", "", s)
    return s


def split_lines(text, wordcuts):
    """返回 [(start_idx, end_idx)]，按标点切句，过长再切。"""
    spans, st = [], 0
    for i, ch in enumerate(text):
        if ch in HARD and not (i + 1 < len(text) and text[i + 1] in HARD + "”"):
            spans.append((st, i + 1)); st = i + 1
        elif ch == "”" and i > 0 and text[i - 1] in HARD:
            spans.append((st, i + 1)); st = i + 1
    if st < len(text):
        spans.append((st, len(text)))
    spans = [s for s in spans if clean(text[s[0]:s[1]])]

    def too_long(a, b):
        return vlen(clean(text[a:b])) > MAXLEN

    out = []
    for a, b in spans:
        stack = [(a, b)]
        while stack:
            x, y = stack.pop(0)
            if not too_long(x, y):
                out.append((x, y)); continue
            mid = (x + y) / 2
            cands = [i + 1 for i in range(x + 2, y - 2) if text[i] == "、"]
            if not cands:
                cands = [c for c in wordcuts if x + 3 <= c <= y - 3]
            if not cands:
                cands = [int(mid)]
            cut = min(cands, key=lambda c: abs(c - mid))
            stack = [(x, cut), (cut, y)] + stack
    # 合并过短的碎句
    merged = []
    for a, b in out:
        if merged:
            pa, pb = merged[-1]
            prev, cur = clean(text[pa:pb]), clean(text[a:b])
            ends_sentence = text[pb - 1] in "。？！" or text[pb - 2:pb] in ("。”", "？”")
            if (len(cur) <= 3 or len(prev) <= 3) and not ends_sentence and vlen(clean(text[pa:b])) <= MAXLEN:
                merged[-1] = (pa, b); continue
        merged.append((a, b))
    return merged


async def synth(shot):
    sid, text = shot["id"], shot["text"]
    mp3 = os.path.join(ROOT, "public/audio", f"shot{sid:02d}.mp3")
    words = []
    com = edge_tts.Communicate(text, VOICE, rate=RATE, boundary="WordBoundary")
    with open(mp3, "wb") as f:
        async for ch in com.stream():
            if ch["type"] == "audio":
                f.write(ch["data"])
            elif ch["type"] == "WordBoundary":
                words.append({"text": ch["text"], "start": ch["offset"] / 1e7,
                              "end": (ch["offset"] + ch["duration"]) / 1e7})
    dur = float(subprocess.check_output(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", mp3]))
    # 把每个词对回原文位置
    pos = 0
    for w in words:
        t = w["text"].strip(PUNCT)
        i = text.find(t, pos) if t else -1
        if i < 0:
            i = pos
        w["idx"] = i
        pos = i + max(len(t), 1)
    wordcuts = [w["idx"] for w in words]

    def t_at(i):  # 原文位置 i 处开始读的时间
        prev = None
        for w in words:
            n = len(w["text"].strip(PUNCT)) or 1
            if w["idx"] <= i < w["idx"] + n:
                return w["start"] + (w["end"] - w["start"]) * (i - w["idx"]) / n
            if w["idx"] > i:
                return w["start"]
            prev = w
        return prev["end"] if prev else 0.0

    spans = split_lines(text, wordcuts)
    lines = []
    for k, (a, b) in enumerate(spans):
        raw = text[a:b]
        lead = len(raw) - len(raw.lstrip(PUNCT))
        start = t_at(a + lead)
        last = [w for w in words if w["idx"] < b]
        end = last[-1]["end"] if last else dur
        lines.append({"text": clean(raw), "start": round(start, 3), "end": round(end, 3)})
    for k in range(len(lines) - 1):  # 短停顿时字幕连续显示
        gap = lines[k + 1]["start"] - lines[k]["end"]
        lines[k]["end"] = lines[k + 1]["start"] if gap < 0.6 else round(lines[k]["end"] + 0.25, 3)
    lines[-1]["end"] = round(min(dur, lines[-1]["end"] + 0.3), 3)
    for ln in lines:
        assert len(ln["text"]) <= MAXLEN, ln
    data = {"id": sid, "title": shot["title"], "text": text, "audio": f"audio/shot{sid:02d}.mp3",
            "audioDuration": round(dur, 3), "pad": PAD, "duration": round(dur + 2 * PAD, 3),
            "lines": lines,
            "words": [{"text": w["text"], "idx": w["idx"], "start": round(w["start"], 3),
                       "end": round(w["end"], 3)} for w in words]}
    with open(os.path.join(ROOT, "src/data", f"shot{sid:02d}.json"), "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
    print(f"镜头{sid:02d} {dur:6.2f}s  {len(lines)} 行字幕")
    for ln in lines:
        print(f"   {ln['start']:6.2f}-{ln['end']:6.2f}  {ln['text']}")
    return dur


async def main():
    shots = json.load(open(os.path.join(ROOT, "script/narration.json"), encoding="utf-8"))
    want = [int(a) for a in sys.argv[1:]]
    total = 0
    for s in shots:
        if want and s["id"] not in want:
            continue
        for attempt in range(2):
            try:
                total += await synth(s); break
            except Exception as e:  # noqa
                if attempt:
                    raise
                print("重试一次:", e)
    print(f"合计配音 {total:.1f}s")

asyncio.run(main())
