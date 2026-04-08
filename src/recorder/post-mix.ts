/**
 * Post-mix narration audio onto the recorded video and burn subtitles.
 * Uses ffmpeg adelay filter for sync — single offset = (demo_start - ffmpeg_start) ms.
 *
 * Inspired by snomiao/playwright-multi-tab — see docs/making-the-demo-video.md
 */
import { $ } from "bun";
import * as fs from "fs";
import * as path from "path";

interface Meta {
  segments: { id: string; text: string; durationMs: number }[];
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

/** Generate SRT subtitle file from meta + initial offset */
function generateSrt(meta: Meta, offsetMs: number, outPath: string): void {
  const lines: string[] = [];
  let cursor = offsetMs;
  meta.segments.forEach((seg, i) => {
    const start = cursor;
    const end = cursor + seg.durationMs;
    lines.push(String(i + 1));
    lines.push(`${srtTime(start)} --> ${srtTime(end)}`);
    lines.push(seg.text);
    lines.push("");
    cursor = end;
  });
  fs.writeFileSync(outPath, lines.join("\n"));
}

/**
 * Mix audio + subtitles onto video.
 * @param videoPath path to silent recorded video (webm/mp4)
 * @param trackPath narration_track.wav from generateNarration
 * @param metaPath meta.json from generateNarration
 * @param offsetMs delay to apply to audio (when narration starts in video timeline)
 * @param outPath output video path
 */
export async function postMix(
  videoPath: string,
  trackPath: string,
  metaPath: string,
  offsetMs: number,
  outPath: string
): Promise<void> {
  const meta: Meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));

  // Step 1: overlay audio with adelay
  const tmpDir = path.dirname(outPath);
  const audioMixed = path.join(tmpDir, "_audio-mixed.mp4");
  const adelay = `${offsetMs}|${offsetMs}`;

  console.log(`  [post-mix] Overlaying audio (adelay=${offsetMs}ms)…`);
  await $`ffmpeg -y -i ${videoPath} -i ${trackPath} -filter_complex ${`[1:a]adelay=${adelay}[aout]`} -map 0:v -map [aout] -c:v libx264 -preset fast -pix_fmt yuv420p -c:a aac -shortest ${audioMixed}`.quiet();

  // Step 2: generate SRT
  const srtPath = path.join(tmpDir, "narration.srt");
  generateSrt(meta, offsetMs, srtPath);
  console.log(`  [post-mix] Subtitles → ${srtPath}`);

  // Step 3: burn subtitles
  console.log(`  [post-mix] Burning subtitles…`);
  // Escape path for ffmpeg subtitle filter
  const escSrt = srtPath.replace(/\\/g, "/").replace(/:/g, "\\:");
  await $`ffmpeg -y -i ${audioMixed} -vf ${`subtitles=${escSrt}:force_style='FontSize=18,Alignment=2,OutlineColour=&H80000000,BorderStyle=4,MarginV=30'`} -c:a copy ${outPath}`.quiet();

  // Cleanup intermediate
  try { fs.unlinkSync(audioMixed); } catch {}

  console.log(`  [post-mix] Final video → ${outPath}`);
}
