#!/usr/bin/env bash
# 分镜头渲染。用法: tools/render.sh preview|final [镜头号 ...]
#   preview: 540×960 低清 → out/preview/shotNN.mp4
#   final:   1080×1920   → out/final/shotNN.mp4
set -euo pipefail
cd "$(dirname "$0")/.."
MODE=${1:-preview}; shift || true
SHOTS=("$@"); [ ${#SHOTS[@]} -eq 0 ] && SHOTS=($(ls src/shots | sed -n 's/Shot\([0-9]*\)\.tsx/\1/p'))
if [ "$MODE" = final ]; then SCALE=1; CRF=17; else SCALE=0.5; CRF=22; fi
mkdir -p "out/$MODE"
for n in "${SHOTS[@]}"; do
  id=$(printf 'Shot%02d' "$((10#$n))")
  npx remotion render src/index.ts "$id" "out/$MODE/$(echo "$id" | tr 'S' 's').mp4" \
    --scale "$SCALE" --crf "$CRF" --audio-codec aac --log error
  echo "done out/$MODE/$(echo "$id" | tr 'S' 's').mp4"
done
