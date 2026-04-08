/**
 * TTS narration generator using Gemini.
 * Generates per-segment WAV files, concatenates them into a single track,
 * and returns durations for narration-driven recording timing.
 *
 * Inspired by snomiao/playwright-multi-tab — see docs/making-the-demo-video.md
 */
import { $ } from "bun";
import * as fs from "fs";
import * as path from "path";

const GEMINI_TTS_MODEL = "gemini-2.5-flash-preview-tts";
const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta";

export interface NarrationSegment {
  id: string;
  text: string;
}

export interface NarrationResult {
  /** Per-segment durations in ms, keyed by segment id */
  durations: Map<string, number>;
  /** Concatenated WAV path (all segments joined in order) */
  trackPath: string;
  /** Per-segment WAV files in order */
  segmentPaths: string[];
  /** Meta JSON path with text + duration for subtitle generation */
  metaPath: string;
  /** Total duration in ms */
  totalDurationMs: number;
}

/** Wrap raw PCM in a WAV header */
function pcmToWav(pcm: Buffer, rate = 24000, channels = 1, bits = 16): Buffer {
  const dataLen = pcm.length;
  const byteRate = rate * channels * (bits / 8);
  const blockAlign = channels * (bits / 8);
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + dataLen, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);    // PCM chunk size
  header.writeUInt16LE(1, 20);     // PCM format
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(rate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bits, 34);
  header.write("data", 36);
  header.writeUInt32LE(dataLen, 40);
  return Buffer.concat([header, pcm]);
}

/** Get WAV duration in ms by reading the header */
function getWavDurationMs(wavPath: string): number {
  const buf = fs.readFileSync(wavPath);
  const sampleRate = buf.readUInt32LE(24);
  const channels = buf.readUInt16LE(22);
  const bits = buf.readUInt16LE(34);
  const dataLen = buf.readUInt32LE(40);
  return Math.round((dataLen / (sampleRate * channels * (bits / 8))) * 1000);
}

/** Call Gemini TTS for one text segment */
async function geminiTTS(text: string, apiKey: string): Promise<Buffer> {
  const url = `${GEMINI_API_BASE}/models/${GEMINI_TTS_MODEL}:generateContent?key=${apiKey}`;
  const body = {
    contents: [{ parts: [{ text }] }],
    generationConfig: {
      responseModalities: ["AUDIO"],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } },
      },
    },
  };

  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    throw new Error(`Gemini TTS failed: ${resp.status} ${await resp.text()}`);
  }

  const data: any = await resp.json();
  const b64 = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!b64) throw new Error(`Gemini TTS returned no audio: ${JSON.stringify(data).slice(0, 200)}`);
  return Buffer.from(b64, "base64");
}

/**
 * Generate narration WAVs for all segments, concatenate, and return durations.
 * Uses GEMINI_API_KEY from env. If unavailable, returns empty result (recorder will skip narration).
 */
export async function generateNarration(
  segments: NarrationSegment[],
  outputDir: string
): Promise<NarrationResult | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.log(`  [narration] GEMINI_API_KEY not set — skipping narration`);
    return null;
  }
  if (segments.length === 0) return null;

  const narrationDir = path.join(outputDir, "narration");
  fs.mkdirSync(narrationDir, { recursive: true });

  console.log(`  [narration] Generating ${segments.length} TTS segments via Gemini…`);

  const segmentPaths: string[] = [];
  const durations = new Map<string, number>();
  const meta: { id: string; text: string; durationMs: number }[] = [];

  // Generate sequentially to avoid rate limiting
  for (const seg of segments) {
    const segPath = path.join(narrationDir, `${seg.id}.wav`);
    if (fs.existsSync(segPath)) {
      // Reuse cached segment
      const dur = getWavDurationMs(segPath);
      segmentPaths.push(segPath);
      durations.set(seg.id, dur);
      meta.push({ id: seg.id, text: seg.text, durationMs: dur });
      continue;
    }

    // Retry up to 2 times on failure (Gemini sometimes returns OTHER finishReason)
    let pcm: Buffer | null = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        pcm = await geminiTTS(seg.text, apiKey);
        break;
      } catch (err) {
        if (attempt === 2) {
          console.log(`  [narration] Skipped ${seg.id}: ${String(err).slice(0, 80)}`);
        }
      }
    }
    if (!pcm) continue; // Skip this segment but keep going

    const wav = pcmToWav(pcm);
    fs.writeFileSync(segPath, wav);
    const dur = getWavDurationMs(segPath);
    segmentPaths.push(segPath);
    durations.set(seg.id, dur);
    meta.push({ id: seg.id, text: seg.text, durationMs: dur });
    console.log(`  [narration] ${seg.id}: ${dur}ms — "${seg.text.slice(0, 50)}..."`);
  }

  if (segmentPaths.length === 0) {
    console.log(`  [narration] No segments generated — disabling narration`);
    return null;
  }

  // Concatenate all WAVs into one track
  const trackPath = path.join(narrationDir, "narration_track.wav");
  const listPath = path.join(narrationDir, "concat-list.txt");
  fs.writeFileSync(
    listPath,
    segmentPaths.map((p) => `file '${path.resolve(p)}'`).join("\n")
  );
  await $`ffmpeg -y -f concat -safe 0 -i ${listPath} -c copy ${trackPath}`.quiet();

  const totalDurationMs = meta.reduce((sum, m) => sum + m.durationMs, 0);

  // Save meta for subtitle generation
  const metaPath = path.join(narrationDir, "meta.json");
  fs.writeFileSync(metaPath, JSON.stringify({ segments: meta, totalDurationMs }, null, 2));

  console.log(`  [narration] Track: ${trackPath} (${(totalDurationMs / 1000).toFixed(1)}s)`);

  return { durations, trackPath, segmentPaths, metaPath, totalDurationMs };
}
