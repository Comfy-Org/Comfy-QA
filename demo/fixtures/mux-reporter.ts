/**
 * Playwright reporter that muxes each test's recorded video with the
 * narration audio (and optional subtitles) into a final mp4 — automatically,
 * per test, cross-platform.
 *
 * Inputs (produced by demowright + the demo fixture):
 *   - <output>/<spec>-<test>-chromium/video.webm   ← Playwright recording
 *   - .comfy-qa/.demos/tmp/<spec>.wav               ← TTS narration
 *   - .comfy-qa/.demos/tmp/<spec>.srt               ← optional captions
 *
 * Output:
 *   - .comfy-qa/.demos/<spec>.mp4
 *
 * Robustness:
 *   - Skips silently if ffmpeg, the webm, or the wav is missing
 *   - Polls briefly for the webm (Playwright flushes it just after onTestEnd)
 *   - Catches all errors so a mux failure never fails the test run
 *   - Cross-platform: uses Node child_process.spawn, no shell, no bash
 */
import type {
  FullConfig,
  Reporter,
  TestCase,
  TestResult,
} from "@playwright/test/reporter";
import { spawn } from "child_process";
import * as fs from "fs";
import * as path from "path";
// ffmpeg-static ships a prebuilt ffmpeg binary for the current platform,
// so users don't need to install ffmpeg system-wide.
import ffmpegStatic from "ffmpeg-static";

const FFMPEG_BIN = (ffmpegStatic as unknown as string) || "ffmpeg";

const PROJECT_ROOT = process.cwd();
const PREPARED_DIR = path.join(PROJECT_ROOT, ".comfy-qa", ".demos", "tmp");
const OUTPUT_DIR = path.join(PROJECT_ROOT, ".comfy-qa", ".demos");

function specSlug(testFile: string): string {
  return path.basename(testFile).replace(/\.spec\.[tj]sx?$/, "");
}

async function waitForFile(p: string, timeoutMs = 5000): Promise<boolean> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const st = fs.statSync(p);
      if (st.size > 0) return true;
    } catch {}
    await new Promise((r) => setTimeout(r, 100));
  }
  return false;
}

function runFfmpeg(args: string[]): Promise<number> {
  return new Promise((resolve) => {
    const proc = spawn(FFMPEG_BIN, args, { stdio: "ignore" });
    proc.on("error", () => resolve(-1));
    proc.on("close", (code) => resolve(code ?? -1));
  });
}

export default class MuxReporter implements Reporter {
  private muxed = new Set<string>();

  onBegin(_config: FullConfig) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    try {
      fs.writeFileSync(
        path.join(PROJECT_ROOT, ".comfy-qa", ".gitignore"),
        "*\n!.gitignore\n",
      );
    } catch {}
  }

  async onTestEnd(test: TestCase, result: TestResult) {
    try {
      const slug = specSlug(test.location.file);
      // Only mux once per spec file (specs may contain multiple tests)
      if (this.muxed.has(slug)) return;

      const wav = path.join(PREPARED_DIR, `${slug}.wav`);
      const srt = path.join(PREPARED_DIR, `${slug}.srt`);
      if (!fs.existsSync(wav)) return;

      // Find the webm: prefer Playwright's reported attachment, fall back to result.outputDir
      let webm: string | undefined;
      const videoAttachment = result.attachments.find(
        (a) => a.name === "video" && a.path,
      );
      if (videoAttachment?.path) webm = videoAttachment.path;

      if (!webm) return;
      if (!(await waitForFile(webm))) return;

      const out = path.join(OUTPUT_DIR, `${slug}.mp4`);
      const args = ["-y", "-i", webm, "-i", wav];
      if (fs.existsSync(srt)) {
        // ffmpeg's subtitles filter needs the path escaped for : on Windows drives
        const escSrt = srt.replace(/\\/g, "/").replace(/:/g, "\\:");
        args.push("-vf", `subtitles='${escSrt}'`);
      }
      args.push(
        "-c:v", "libx264",
        "-preset", "fast",
        "-pix_fmt", "yuv420p",
        "-c:a", "aac",
        "-b:a", "128k",
        "-ar", "44100",
        "-shortest",
        out,
      );

      const code = await runFfmpeg(args);
      if (code === 0) {
        this.muxed.add(slug);
        // eslint-disable-next-line no-console
        console.log(`  [mux] ${slug}.mp4`);
      } else if (code === -1) {
        // ffmpeg missing — warn once
        if (!this.muxed.has("__warned__")) {
          this.muxed.add("__warned__");
          console.log("  [mux] ffmpeg binary not available; skipping mux");
        }
      }
    } catch (err) {
      // Never fail the test run because of mux issues
      console.log(`  [mux] error: ${String(err).slice(0, 120)}`);
    }
  }
}
