/**
 * Post-mix narration audio onto the recorded video.
 *
 * Two modes:
 *  - Timed: each narration segment placed at its measured video timestamp (startMs).
 *  - Sequential (fallback): concatenated track delayed by offsetMs.
 *
 * Subtitles are embedded as mov_text soft stream (visible in VLC, browsers, Gemini)
 * AND written as a VTT sidecar for the web player <track> element.
 */
import { $ } from "bun";
import * as fs from "fs";
import * as path from "path";

interface MetaSegment {
  id: string;
  text: string;
  durationMs: number;
  startMs?: number;
}

interface Meta {
  segments: MetaSegment[];
  totalDurationMs: number;
}

function srtTime(ms: number): string {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const r = ms % 1000;
  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")},${String(r).padStart(3,"0")}`;
}

function vttTime(ms: number): string {
  return srtTime(ms).replace(",", ".");
}

/** Write narration.srt + narration.vtt to outDir. Returns srtPath. */
function writeSubtitleFiles(meta: Meta, fallbackOffsetMs: number, outDir: string): string {
  const srtLines: string[] = [];
  const vttLines: string[] = ["WEBVTT", ""];
  let cursor = fallbackOffsetMs;

  meta.segments.forEach((seg, i) => {
    const start = seg.startMs ?? cursor;
    const end = start + seg.durationMs;
    cursor = end;
    srtLines.push(String(i + 1), `${srtTime(start)} --> ${srtTime(end)}`, seg.text, "");
    vttLines.push(String(i + 1), `${vttTime(start)} --> ${vttTime(end)}`, seg.text, "");
  });

  const srtPath = path.join(outDir, "narration.srt");
  fs.writeFileSync(srtPath, srtLines.join("\n"));
  fs.writeFileSync(path.join(outDir, "narration.vtt"), vttLines.join("\n"));
  return srtPath;
}

export async function postMix(
  videoPath: string,
  trackPath: string,
  metaPath: string,
  offsetMs: number,
  outPath: string
): Promise<void> {
  const meta: Meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
  const outDir = path.dirname(outPath);

  const timedMode = meta.segments.length > 0 && meta.segments.every((s) => s.startMs != null);
  console.log(`  [post-mix] Mode: ${timedMode ? "timed" : "sequential"} | ${meta.segments.length} segments`);

  // Write subtitle files first (SRT embedded into mp4, VTT served as sidecar)
  const srtPath = writeSubtitleFiles(meta, offsetMs, outDir);

  if (timedMode) {
    const narrationDir = path.dirname(trackPath);
    const segWavs = meta.segments.map((s) => path.join(narrationDir, `${s.id}.wav`));
    const missing = segWavs.filter((p) => !fs.existsSync(p));

    if (missing.length === 0) {
      // Build per-segment adelay filter
      const audioInputs = segWavs.flatMap((p) => ["-i", p]);
      const n = meta.segments.length;
      const delays = meta.segments.map((s, i) =>
        `[${i + 1}:a]adelay=${s.startMs}|${s.startMs}[a${i}]`
      ).join(";");
      const mixIn = meta.segments.map((_, i) => `[a${i}]`).join("");
      const audioFilter = `${delays};${mixIn}amix=inputs=${n}:normalize=0[aout]`;
      const srtInputIdx = n + 1;

      console.log(`  [post-mix] Timed mix + subtitle embed…`);
      await $`ffmpeg -y -i ${videoPath} ${audioInputs} -i ${srtPath} \
        -filter_complex ${audioFilter} \
        -map 0:v -map [aout] -map ${String(srtInputIdx)}:s \
        -c:v libx264 -preset fast -pix_fmt yuv420p \
        -c:a aac -b:a 128k \
        -c:s mov_text -metadata:s:s:0 language=eng \
        -shortest ${outPath}`.quiet();

      console.log(`  [post-mix] ✓ ${outPath}`);
      return;
    }
    console.log(`  [post-mix] Missing ${missing.length} WAVs — falling back to sequential`);
  }

  // Sequential mode
  const adelay = `${offsetMs}|${offsetMs}`;
  console.log(`  [post-mix] Sequential mix + subtitle embed…`);
  await $`ffmpeg -y -i ${videoPath} -i ${trackPath} -i ${srtPath} \
    -filter_complex ${`[1:a]adelay=${adelay}[aout]`} \
    -map 0:v -map [aout] -map 2:s \
    -c:v libx264 -preset fast -pix_fmt yuv420p \
    -c:a aac -b:a 128k \
    -c:s mov_text -metadata:s:s:0 language=eng \
    -shortest ${outPath}`.quiet();

  console.log(`  [post-mix] ✓ ${outPath}`);
}
