#!/usr/bin/env bash
# 下载字体（思源宋体/黑体可变字体）和 Natural Earth 公开数据。体积较大，不入库。
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p public/fonts .cache
get() { [ -s "$2" ] || curl -fsSL --retry 2 -o "$2" "$1"; }
get "https://raw.githubusercontent.com/google/fonts/main/ofl/notoserifsc/NotoSerifSC%5Bwght%5D.ttf" public/fonts/NotoSerifSC.ttf
get "https://raw.githubusercontent.com/google/fonts/main/ofl/notosanssc/NotoSansSC%5Bwght%5D.ttf" public/fonts/NotoSansSC.ttf
NE=https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson
for f in ne_50m_land ne_50m_lakes ne_50m_rivers_lake_centerlines; do get "$NE/$f.geojson" ".cache/$f.geojson"; done
ls -la public/fonts .cache
