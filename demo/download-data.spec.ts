import { test, safeMove } from "./fixtures/fixture";
import { createVideoScript } from "../lib/demowright/dist/index.mjs";

/**
 * VIDEO SCRIPT — every word in `narration` is read aloud verbatim by Gemini TTS.
 *
 * User Journey: A user checks ComfyUI adoption by cycling through all 4 time ranges,
 * hovering chart tooltips to read exact numbers, and noting the growth rate.
 *
 * Coverage: 8/8 (100%)
 *
 * | Feature                         | R | Notes                          |
 * |---------------------------------|---|--------------------------------|
 * | Headline + subtitle             | ✅ | "ComfyUI Download Data"        |
 * | Daily New Downloads card        | ✅ | net new downloads metric        |
 * | Change indicator (green %)      | ✅ | growth percentage               |
 * | Time range: 1 Week              | ✅ | click + hover chart points      |
 * | Time range: 1 Month             | ✅ | click + hover chart points      |
 * | Time range: 3 Months            | ✅ | click + hover chart points      |
 * | Time range: All Time            | ✅ | click + hover chart points      |
 * | Chart tooltip on hover          | ✅ | sweep across chart for tooltips |
 * | Next data update countdown      | ✅ | scroll down + hover             |
 * | GitHub repository link          | ✅ | hover link                      |
 *
 * Segment types: 0 NAVIGATE + 5 INTERACT + 3 OBSERVE = 63% interactive
 */
const VIDEO_SCRIPT = [
  {
    kind: "title",
    text: "ComfyUI Download Data",
    subtitle: "Daily Statistics",
    durationMs: 2000,
  },

  // ── 1: Welcome + headline ── OBSERVE
  {
    kind: "segment",
    narration:
      "Welcome to the ComfyUI Download Data dashboard — a focused tool that answers " +
      "one question: how fast is ComfyUI adoption growing?",
  },

  // ── 2: Click 1 Week + sweep chart ── INTERACT
  {
    kind: "segment",
    narration:
      "Let me start with the one-week view. Clicking this button zooms into the last " +
      "seven days — you can spot daily patterns like weekday versus weekend activity.",
  },

  // ── 3: Click 1 Month + sweep chart ── INTERACT
  {
    kind: "segment",
    narration:
      "Switching to one month widens the lens. Now I can see whether downloads have been " +
      "trending up or down over the last thirty days.",
  },

  // ── 4: Click 3 Months + sweep chart ── INTERACT
  {
    kind: "segment",
    narration:
      "The three-month view is where medium-term trends become clear — is growth " +
      "accelerating or starting to plateau?",
  },

  // ── 5: Click All Time + sweep chart ── INTERACT
  {
    kind: "segment",
    narration:
      "Finally, All Time shows the full history since tracking began. You can see the key " +
      "inflection points: launches, viral moments, and major releases.",
  },

  // ── 6: Slow tooltip sweep ── INTERACT
  {
    kind: "segment",
    narration:
      "Hovering over the chart reveals exact download counts for each day. This is how " +
      "you find the spikes and dig into what caused them.",
  },

  // ── 7: Scroll down — countdown + GitHub ── OBSERVE
  {
    kind: "segment",
    narration:
      "Scrolling down reveals the next data update countdown and a link to the GitHub repository. " +
      "This is an open-source community dashboard — anyone can contribute.",
  },

  // ── 8: Wrap-up ── OBSERVE
  {
    kind: "segment",
    narration:
      "A clean, focused dashboard that tracks ComfyUI adoption across every time horizon. " +
      "The answer, in every view, is clear growth.",
  },

  {
    kind: "outro",
    text: "ComfyUI Download Data",
    subtitle: "comfyui-download-statistics.vercel.app",
    durationMs: 2000,
  },
] as const;

/** Helper: click a time-range button by label, wait for chart to update */
async function clickTimeRange(
  page: import("@playwright/test").Page,
  label: string,
) {
  const btn = page
    .getByRole("button", { name: new RegExp(label, "i") })
    .first();
  if (await btn.isVisible().catch(() => false)) {
    await btn.click().catch(() => {});
    await page.waitForTimeout(800);
  }
}

test("comfyui download statistics tour", async ({ page }) => {
  test.setTimeout(5 * 60_000);

  await page.goto("https://comfyui-download-statistics.vercel.app", {
    waitUntil: "domcontentloaded",
  });
  await page.waitForTimeout(2500);

  const script = createVideoScript()
    .title(VIDEO_SCRIPT[0].text, {
      subtitle: VIDEO_SCRIPT[0].subtitle,
      durationMs: VIDEO_SCRIPT[0].durationMs,
    })

    // ── 1: Welcome — headline + card ── OBSERVE
    .segment(VIDEO_SCRIPT[1].narration, async (pace) => {
      await safeMove(page, "h1, h2");
      await pace();
      await safeMove(page, "[class*='card'], [class*='chart'], main");
      await pace();
      // Hover the change indicator (green %)
      await page.mouse.move(750, 280);
      await pace();
    })

    // ── 2: 1 Week ── INTERACT
    .segment(VIDEO_SCRIPT[2].narration, async (pace) => {
      await clickTimeRange(page, "1 Week");
      await page.mouse.move(300, 400);
      await pace();
      await page.mouse.move(550, 390);
      await pace();
      await page.mouse.move(800, 410);
      await pace();
    })

    // ── 3: 1 Month ── INTERACT
    .segment(VIDEO_SCRIPT[3].narration, async (pace) => {
      await clickTimeRange(page, "1 Month");
      await page.mouse.move(250, 420);
      await pace();
      await page.mouse.move(550, 400);
      await pace();
      await page.mouse.move(900, 390);
      await pace();
    })

    // ── 4: 3 Months ── INTERACT
    .segment(VIDEO_SCRIPT[4].narration, async (pace) => {
      await clickTimeRange(page, "3 Months");
      await page.mouse.move(250, 410);
      await pace();
      await page.mouse.move(600, 400);
      await pace();
      await page.mouse.move(950, 390);
      await pace();
    })

    // ── 5: All Time ── INTERACT
    .segment(VIDEO_SCRIPT[5].narration, async (pace) => {
      await clickTimeRange(page, "All Time");
      await page.mouse.move(200, 430);
      await pace();
      await page.mouse.move(500, 400);
      await pace();
      await page.mouse.move(950, 380);
      await pace();
    })

    // ── 6: Tooltip sweep ── INTERACT
    .segment(VIDEO_SCRIPT[6].narration, async (pace) => {
      for (const x of [250, 400, 550, 700, 850, 1000]) {
        await page.mouse.move(x, 400);
        await page.waitForTimeout(300);
      }
      await pace();
      // Sweep back partway
      await page.mouse.move(500, 410);
      await pace();
    })

    // ── 7: Countdown + GitHub ── OBSERVE
    .segment(VIDEO_SCRIPT[7].narration, async (pace) => {
      await page.mouse.wheel(0, 400);
      await page.mouse.move(640, 400);
      await pace();
      await safeMove(page, "a[href*='github']");
      await pace();
      await page.mouse.move(640, 500);
      await pace();
    })

    // ── 8: Wrap-up ── OBSERVE
    .segment(VIDEO_SCRIPT[8].narration, async (pace) => {
      await page.mouse.wheel(0, -2000);
      await page.waitForTimeout(300);
      await safeMove(page, "h1, h2");
      await pace();
      await safeMove(page, "[class*='card'], [class*='chart'], main");
      await pace();
    })

    .outro({
      text: VIDEO_SCRIPT[9].text,
      subtitle: VIDEO_SCRIPT[9].subtitle,
      durationMs: VIDEO_SCRIPT[9].durationMs,
    });

  await script.prepare(page);
  await script.render(page, {
    baseName: "download-data",
    outputDir: ".comfy-qa/.demos",
  });
});
