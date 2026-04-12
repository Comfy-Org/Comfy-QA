/**
 * Demo fixture: applies qa-hud with Gemini TTS provider + audio capture.
 * Use `import { test } from "./fixture"` in demo specs.
 *
 * After each test, this fixture muxes the captured audio.wav onto the
 * Playwright-recorded video.webm via ffmpeg → produces a final mp4 with sound.
 */
import { test as base } from "@playwright/test";
import { execFile } from "child_process";
import { promisify } from "util";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { applyHud } from "../../lib/demowright/dist/setup.mjs";

const execFileP = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "../..");
const COMFY_QA_DIR = path.join(PROJECT_ROOT, ".comfy-qa");
// demowright joins outputDir with cwd → use a relative path
const DEMOS_OUTPUT_DIR_REL = ".comfy-qa/.demos";
const DEMOS_OUTPUT_DIR = path.join(COMFY_QA_DIR, ".demos");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_TTS_MODEL = "gemini-2.5-flash-preview-tts";

/** Wrap raw 16-bit PCM in a WAV header so AudioContext.decodeAudioData accepts it */
function pcmToWav(pcm: Buffer, rate = 24000, channels = 1, bits = 16): Buffer {
  const dataLen = pcm.length;
  const byteRate = rate * channels * (bits / 8);
  const blockAlign = channels * (bits / 8);
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + dataLen, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(rate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bits, 34);
  header.write("data", 36);
  header.writeUInt32LE(dataLen, 40);
  return Buffer.concat([header, pcm]);
}

const cache = new Map<string, Buffer>();

// Concurrency limiter — Gemini free tier allows ~2-3 concurrent TTS requests.
// Without this, prepare() fires 13+ parallel requests → mass 429s → 10min backoff spiral.
let activeRequests = 0;
const MAX_CONCURRENT = 2;
const requestQueue: (() => void)[] = [];

async function withConcurrencyLimit<T>(fn: () => Promise<T>): Promise<T> {
  while (activeRequests >= MAX_CONCURRENT) {
    await new Promise<void>((resolve) => requestQueue.push(resolve));
  }
  activeRequests++;
  try {
    return await fn();
  } finally {
    activeRequests--;
    requestQueue.shift()?.();
  }
}

async function geminiTTSOnce(text: string): Promise<Buffer> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_TTS_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
  const body = {
    contents: [{ parts: [{ text }] }],
    generationConfig: {
      responseModalities: ["AUDIO"],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } } },
    },
  };

  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(20000),
  });
  if (!resp.ok) throw new Error(`Gemini TTS ${resp.status}: ${await resp.text()}`);

  const data: any = await resp.json();
  const b64 = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!b64) throw new Error(`Gemini TTS no audio: ${JSON.stringify(data).slice(0, 200)}`);

  return pcmToWav(Buffer.from(b64, "base64"));
}

async function geminiTTS(text: string): Promise<Buffer> {
  if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not set");
  if (cache.has(text)) return cache.get(text)!;

  return withConcurrencyLimit(async () => {
    // Double-check cache (another request may have resolved while we waited)
    if (cache.has(text)) return cache.get(text)!;

    // Exponential backoff: retry for up to ~2 minutes on 503/rate-limit errors
    const MAX_ATTEMPTS = 8;
    const BASE_DELAY_MS = 1000;
    const MAX_DELAY_MS = 30_000;
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      try {
        const wav = await geminiTTSOnce(text);
        cache.set(text, wav);
        return wav;
      } catch (err) {
        const msg = String(err).slice(0, 120);
        const isRetryable = /503|429|rate|timeout|aborted/i.test(msg);
        console.log(`  [tts] attempt ${attempt + 1}/${MAX_ATTEMPTS} failed: ${msg}`);
        if (!isRetryable || attempt === MAX_ATTEMPTS - 1) break;
        const delay = Math.min(BASE_DELAY_MS * 2 ** attempt, MAX_DELAY_MS);
        console.log(`  [tts] retrying in ${(delay / 1000).toFixed(0)}s...`);
        await new Promise((r) => setTimeout(r, delay));
      }
    }

    // Fallback: 0.5s of silence so playback doesn't hang
    const silence = pcmToWav(Buffer.alloc(24000)); // 0.5s @ 24kHz mono 16-bit
    cache.set(text, silence);
    return silence;
  });
}

/** Safe wrapper for moveToEl that no-ops when the selector doesn't exist or page is busy */
export async function safeMove(page: any, selector: string): Promise<void> {
  const TIMEOUT_MS = 3000;
  try {
    const existsPromise = page.evaluate(
      (s: string) => !!document.querySelector(s),
      selector,
    );
    const exists = await Promise.race([
      existsPromise,
      new Promise<boolean>((resolve) => setTimeout(() => resolve(false), TIMEOUT_MS)),
    ]);
    if (!exists) return;
    const { moveToEl } = await import("../../lib/demowright/dist/helpers.mjs");
    await Promise.race([
      moveToEl(page, selector),
      new Promise((resolve) => setTimeout(resolve, TIMEOUT_MS)),
    ]);
  } catch {}
}

/** Slug from spec file basename, e.g. comfyui-frontend.spec.ts → comfyui-frontend */
function specSlug(testInfo: any): string {
  return path.basename(testInfo.file).replace(/\.spec\.[tj]sx?$/, "");
}

export const test = base.extend<{ audioPath: string; videoPathHolder: { path?: string } }>({
  audioPath: async ({}, use, testInfo) => {
    fs.mkdirSync(testInfo.outputDir, { recursive: true });
    await use(path.join(testInfo.outputDir, "narration.wav"));
  },
  videoPathHolder: async ({}, use) => {
    const holder: { path?: string } = {};
    await use(holder);
  },
  page: async ({ page, videoPathHolder }, use) => {
    await use(page);
    try { videoPathHolder.path = await page.video()?.path(); } catch {}
  },
  context: async ({ context, audioPath }, use) => {
    await applyHud(context, {
      cursor: true,
      keyboard: true,
      cursorStyle: "default",
      actionDelay: 250,
      tts: GEMINI_API_KEY ? geminiTTS : undefined,
      audio: audioPath,
      outputDir: DEMOS_OUTPUT_DIR_REL,
    } as any);

    await use(context);
    // demowright's render() handles muxing audio + video → .comfy-qa/.demos/<baseName>.mp4
  },
});

export { expect } from "@playwright/test";
