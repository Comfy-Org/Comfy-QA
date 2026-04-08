#!/bin/bash
# Post-test mux: combine demowright's prepared WAV/SRT with Playwright's recorded video.
# Demowright's context.close handler runs before Playwright flushes the .webm to disk,
# so the inline mux skips. This script does the mux after the test run completes.
set -e

TMP_VIDEO_DIR="${1:-.comfy-qa/.tmp/demos}"
PREPARED_DIR="${2:-.comfy-qa/demos/tmp}"
OUTPUT_DIR="${3:-.comfy-qa/demos}"

mkdir -p "$OUTPUT_DIR"
found=0

for wav in "$PREPARED_DIR"/*.wav; do
  [ -f "$wav" ] || continue
  base=$(basename "$wav" .wav)
  srt="$PREPARED_DIR/$base.srt"

  # Find the matching video.webm — search by spec basename in tmp video dir
  webm=$(find "$TMP_VIDEO_DIR" -type d -name "${base}-*chromium" -exec find {} -name "video.webm" \; 2>/dev/null | head -1)
  if [ -z "$webm" ]; then
    echo "  [skip] $base: no video.webm found in $TMP_VIDEO_DIR"
    continue
  fi

  out="$OUTPUT_DIR/$base.mp4"
  echo "  [mux] $base"
  echo "        wav:  $(ls -lh "$wav" | awk '{print $5}')"
  echo "        webm: $(ls -lh "$webm" | awk '{print $5}')"

  if [ -f "$srt" ]; then
    # Burn subtitles
    escSrt=$(echo "$srt" | sed 's/:/\\\\:/g')
    ffmpeg -y -i "$webm" -i "$wav" \
      -vf "subtitles='$escSrt'" \
      -c:v libx264 -preset fast -pix_fmt yuv420p \
      -c:a aac -b:a 128k -ar 44100 \
      -shortest "$out" 2>/dev/null
  else
    ffmpeg -y -i "$webm" -i "$wav" \
      -c:v libx264 -preset fast -pix_fmt yuv420p \
      -c:a aac -b:a 128k -ar 44100 \
      -shortest "$out" 2>/dev/null
  fi

  echo "        ✓ $out ($(ls -lh "$out" | awk '{print $5}'))"
  found=$((found + 1))
done

echo ""
echo "Muxed $found videos."
ls -lh "$OUTPUT_DIR"/*.mp4 2>/dev/null
