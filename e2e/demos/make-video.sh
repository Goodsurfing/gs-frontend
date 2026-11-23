#!/usr/bin/env bash
# Склейка сцен демо в один mp4: e2e/demos/make-video.sh membership-duo
set -euo pipefail
feature="${1:?укажите фичу, например membership-duo}"
dir="$(cd "$(dirname "$0")" && pwd)/output/$feature"
list="$dir/scenes/list.txt"
: > "$list"
for f in "$dir"/scenes/[0-9]*.webm; do echo "file '$f'" >> "$list"; done
ffmpeg -y -loglevel error -f concat -safe 0 -i "$list" \
    -vf "fps=25,scale=1280:800:flags=lanczos,format=yuv420p" \
    -c:v libx264 -preset slow -crf 26 -movflags +faststart "$dir/$feature.mp4"
ls -lh "$dir/$feature.mp4"
