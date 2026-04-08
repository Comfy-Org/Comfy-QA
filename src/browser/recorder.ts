import { chromium, type Browser, type BrowserContext, type Page } from "playwright";
import * as path from "path";
import * as fs from "fs";
import { applyHud } from "../../lib/demowright/dist/setup.mjs";
import { injectHUD, hudStep, hudPlan, hudStatus, hudAnnotate } from "./hud";

export interface RecorderSession {
  page: Page;
  context: BrowserContext;
  browser: Browser;
  screenshotDir: string;
  screenshots: string[];
  step: (text: string) => Promise<void>;
  plan: (text: string) => Promise<void>;
  status: (text: string) => Promise<void>;
  annotate: (x: number, y: number, text: string, ms?: number) => Promise<void>;
  screenshot: (name: string) => Promise<string>;
  /** Set narration durations and the demo start timestamp */
  attachNarration: (durations: Map<string, number>) => void;
  /** Run a narrated step: updates HUD and waits for the segment's audio duration */
  narrate: (id: string, hudText: string) => Promise<void>;
  /** Get demo start time (set when first narrate() is called or attachNarration) */
  getDemoStartMs: () => number;
  stop: () => Promise<void>;
}

export async function startRecorder(
  outputDir: string,
  videoName = "qa-session",
  viewportWidth = 1280,
  viewportHeight = 800
): Promise<RecorderSession> {
  fs.mkdirSync(outputDir, { recursive: true });
  const screenshotDir = path.join(outputDir, "screenshots");
  fs.mkdirSync(screenshotDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: viewportWidth, height: viewportHeight },
    recordVideo: {
      dir: outputDir,
      size: { width: viewportWidth, height: viewportHeight },
    },
  });

  // Apply qa-hud: cursor overlay, keystroke display, action slowdown
  await applyHud(context, {
    cursor: true,
    keyboard: true,
    cursorStyle: "default",
    actionDelay: 150,
  });

  const page = await context.newPage();
  const screenshots: string[] = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      console.error(`  [browser:error] ${msg.text()}`);
    }
  });

  const step = async (text: string) => {
    await hudStep(page, text);
    await page.waitForTimeout(300);
  };
  const plan = async (text: string) => hudPlan(page, text);
  const status = async (text: string) => hudStatus(page, text);
  const annotate = async (x: number, y: number, text: string, ms = 3000) =>
    hudAnnotate(page, x, y, text, ms);

  const screenshot = async (name: string): Promise<string> => {
    const file = path.join(screenshotDir, `${name}.png`);
    await page.screenshot({ path: file, fullPage: false });
    screenshots.push(file);
    console.log(`  [screenshot] ${file}`);
    return file;
  };

  let narrationDurations: Map<string, number> | null = null;
  let demoStartMs = 0;
  const recordingStartMs = Date.now();

  const attachNarration = (durations: Map<string, number>) => {
    narrationDurations = durations;
    demoStartMs = Date.now();
  };

  const getDemoStartMs = () => demoStartMs || recordingStartMs;

  const narrate = async (id: string, hudText: string) => {
    if (!demoStartMs) demoStartMs = Date.now();
    await hudStep(page, hudText);
    const dur = narrationDurations?.get(id) ?? 1500;
    const segStart = Date.now();
    // Caller can do work between this and we'll sleep the remainder
    // For now just sleep the full duration since we don't yield mid-call
    const elapsed = Date.now() - segStart;
    const remaining = dur - elapsed;
    if (remaining > 50) await page.waitForTimeout(remaining);
  };

  const stop = async () => {
    await page.waitForTimeout(1500);
    const video = await page.video()?.path();
    await context.close();
    await browser.close();
    if (video) {
      const dest = path.join(outputDir, `${videoName}.webm`);
      fs.renameSync(video, dest);
      console.log(`  [video] Saved → ${dest}`);
    }
  };

  return { page, context, browser, screenshotDir, screenshots, step, plan, status, annotate, screenshot, attachNarration, narrate, getDemoStartMs, stop };
}

/** Navigate to URL and inject comfy-qa info panel */
export async function navigateWithHUD(
  session: RecorderSession,
  url: string,
  title: string
): Promise<void> {
  await session.page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
  try {
    await injectHUD(session.page, title);
  } catch {
    // HUD injection fails on some pages (cross-origin) — that's OK
  }
  await session.page.waitForTimeout(500);
}
