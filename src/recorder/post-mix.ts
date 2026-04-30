/**
 * Post-mix narration audio onto the recorded video.
 *
 * Two modes:
 *  - Timed: each narration segment is placed at its measured video timestamp
 *    (startMs from meta.json). Achieves perfect sync with pre-planned recording.
 *  - Sequential (fallback): segments are concatenated and delayed by offsetMs.
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

/** Format ms as SRT timestamp HH:MM:SS,mmm */
function srtTime(ms: number): string {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const msr = ms % 1000;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")},${String(msr).padStart(3, "0")}`;
}

/** Format ms as WebVTT timestamp HH:MM:SS.mmm */
function vttTime(ms: number): string {
  return srtTime(ms).replace(",", ".");
}

/** Generate SRT + WebVTT subtitle files. Uses startMs if available, else sequential. */
function generateSubtitles(meta: Meta, fallbackOffsetMs: number, outDir: string): void {
  const srtLines: string[] = [];
  const vttLines: string[] = ["WEBVTT", ""];
  let cursor = fallbackOffsetMs;

  meta.segments.forEach((seg, i) => {
    const start = seg.startMs ?? cursor;
    const end = start + seg.durationMs;
    cursor = seg.startMs != null ? end : end; // advance cursor either way

    srtLines.push(String(i + 1), `${srtTime(start)} --> ${srtTime(end)}`, seg.text, "");
    vttLines.push(String(i + 1), `${vttTime(start)} --> ${vttTime(end)}`, seg.text, "");
  });

  fs.writeFileSync(path.join(outDir, "narration.srt"), srtLines.join("\n"));
  fs.writeFileSync(path.join(outDir, "narration.vtt"), vttLines.join("\n"));
}

/**
 * Mix narration segments onto video.
 *
 * If meta.json segments have `startMs`, each segment is placed at that exact
 * video timestamp (timed mode — perfectly synced with pre-planned recording).
 * Otherwise falls back to a single adelay of `offsetMs` on the concatenated track.
 *
 * @param videoPath  recorded video (webm or mp4)
 * @param trackPath  concatenated narration_track.wav
 * @param metaPath   meta.json with segments array
 * @param offsetMs   fallback global adelay (0 in timed mode)
 * @param outPath    output mp4
 */
export async function postMix(
  videoPath: string,
  trackPath: string,
  metaPath: string,
  offsetMs: number,
  outPath: string
): Promise<void> {
  const meta: Meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
  const outDir = path.dirname(outPath);

  const timedMode = meta.segments.every((s) => s.startMs != null);
  console.log(`  [post-mix] Mode: ${timedMode ? "timed (real timestamps)" : "sequential (adelay)"}`);

  // Build ffmpeg audio filter
  let audioFilter: string;
  let inputFlag: string[];

  if (timedMode) {
    // Each segment WAV file is delayed to its measured video timestamp.
    // We need individual WAV paths — stored alongside narration_track in narration/ dir.
    const narrationDir = path.dirname(trackPath);
    const segWavs = meta.segments.map((s) => path.join(narrationDir, `${s.id}.wav`));
    const missing = segWavs.filter((p) => !fs.existsSync(p));
    if (missing.length > 0) {
      // Fall back to sequential if individual WAVs are missing
      console.log(`  [post-mix] Missing ${missing.length} segment WAVs — falling back to sequential`);
      timedFallback();
    } else {
      // -i video -i seg0.wav -i seg1.wav ...
      inputFlag = segWavs.flatMap((p) => ["-i", p]);
      const delays = meta.segments.map((s, i) => `[${i + 1}:a]adelay=${s.startMs}|${s.startMs}[a${i}]`).join(";");
      const mix = meta.segments.map((_, i) => `[a${i}]`).join("");
      audioFilter = `${delays};${mix}amix=inputs=${meta.segments.length}:normalize=0[aout]`;

      console.log(`  [post-mix] Mixing ${meta.segments.length} timed segments…`);
      await $`ffmpeg -y -i ${videoPath} ${inputFlag} -filter_complex ${audioFilter} -map 0:v -map [aout] -c:v libx264 -preset fast -pix_fmt yuv420p -c:a aac -b:a 128k -shortest ${outPath}`.quiet();
      generateSubtitles(meta, 0, outDir);
      console.log(`  [post-mix] Final video → ${outPath}`);
      return;
    }
  }

  // Sequential mode (or timed fallback)
  function timedFallback() {}
  const adelay = `${offsetMs}|${offsetMs}`;
  console.log(`  [post-mix] Overlaying track (adelay=${offsetMs}ms)…`);
  await $`ffmpeg -y -i ${videoPath} -i ${trackPath} -filter_complex ${`[1:a]adelay=${adelay}[aout]`} -map 0:v -map [aout] -c:v libx264 -preset fast -pix_fmt yuv420p -c:a aac -b:a 128k -shortest ${outPath}`.quiet();
  generateSubtitles(meta, offsetMs, outDir);
  console.log(`  [post-mix] Final video → ${outPath}`);
}
