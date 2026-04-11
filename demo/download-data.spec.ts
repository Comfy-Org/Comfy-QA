import { test, safeMove } from "./fixtures/fixture";
import { createVideoScript } from "../lib/demowright/dist/index.mjs";

/**
 * VIDEO SCRIPT — every word in `narration` is read aloud verbatim by Gemini TTS.
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
 * | Next data update countdown      | ✅ | scroll down                     |
 * | GitHub repository link          | ✅ | hover link                      |
 */
const VIDEO_SCRIPT = [
  {
    kind: "title",
    text: "ComfyUI Download Data",
    subtitle: "Daily Statistics",
    durationMs: 2000,
  },
  {
    kind: "segment",
    narration:
      "Welcome to the ComfyUI Download Data dashboard — a single-purpose tool for tracking how fast ComfyUI adoption is growing.",
    visuals: ["safeMove h1", "mouse.move to subtitle area"],
  },
  {
    kind: "segment",
    narration:
      "The Daily New Downloads card shows net new downloads per day across all portable ComfyUI releases. The green indicator reveals the growth rate over the selected timeframe.",
    visuals: ["safeMove card area", "hover green indicator"],
  },
  {
    kind: "segment",
    narration:
      "Let me start with the one-week view. This zooms into the most recent seven days so we can spot daily patterns — weekday versus weekend activity, for instance.",
    visuals: ["click 1 Week button", "sweep chart left-to-right"],
  },
  {
    kind: "segment",
    narration:
      "Switching to one month widens the lens. Now we can see whether the last thirty days have been trending up or down.",
    visuals: ["click 1 Month button", "sweep chart left-to-right"],
  },
  {
    kind: "segment",
    narration:
      "The three-month view is where medium-term trends become clear. Is growth accelerating or starting to plateau?",
    visuals: ["click 3 Months button", "sweep chart left-to-right"],
  },
  {
    kind: "segment",
    narration:
      "Finally, All Time shows the full history — every download since tracking began. You can see the key inflection points: launches, viral moments, and major releases.",
    visuals: ["click All Time button", "sweep chart left-to-right"],
  },
  {
    kind: "segment",
    narration:
      "Hovering over the chart reveals the exact download count for each day. This is how you find the spikes and dig into what caused them.",
    visuals: ["sweep across chart slowly with pauses"],
  },
  {
    kind: "segment",
    narration:
      "Scrolling down reveals the next data update countdown and a link to the GitHub repository. This is an open-source community dashboard — anyone can contribute.",
    visuals: ["scroll down", "hover countdown", "hover GitHub link"],
  },
  {
    kind: "segment",
    narration:
      "A clean, focused dashboard that answers one question: is ComfyUI growing? The answer, across every time horizon, is yes.",
    visuals: ["scroll to top via mouse.wheel", "hover headline", "hover card"],
  },
  {
    kind: "outro",
    text: "ComfyUI Download Data",
    subtitle: "comfyui-download-statistics.vercel.app",
    durationMs: 2000,
  },
] as const;

/** Helper: click a time-range button by label, wait for chart to update */
async function clickTimeRange(page: import("@playwright/test").Page, label: string) {
  const btn = page.getByRole("button", { name: new RegExp(label, "i") }).first();
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
    // Seg 1: Welcome + headline
    .segment(VIDEO_SCRIPT[1].narration, async (pace) => {
      await safeMove(page, "h1, h2");
      await pace();
      await page.mouse.move(640, 250);
      await pace();
    })
    // Seg 2: Daily New Downloads card + green indicator
    .segment(VIDEO_SCRIPT[2].narration, async (pace) => {
      await safeMove(page, "[class*='card'], [class*='chart'], main");
      await pace();
      // Hover the change indicator (green %) — typically right of the number
      await page.mouse.move(750, 280);
      await pace();
      await page.mouse.move(640, 320);
      await pace();
    })
    // Seg 3: 1 Week view — click + sweep chart with multiple hover points
    .segment(VIDEO_SCRIPT[3].narration, async (pace) => {
      await clickTimeRange(page, "1 Week");
      await page.mouse.move(300, 400);
      await pace();
      await page.mouse.move(500, 390);
      await pace();
      await page.mouse.move(700, 410);
      await pace();
      await page.mouse.move(900, 380);
      await pace();
    })
    // Seg 4: 1 Month view — click + sweep chart
    .segment(VIDEO_SCRIPT[4].narration, async (pace) => {
      await clickTimeRange(page, "1 Month");
      await page.mouse.move(250, 420);
      await pace();
      await page.mouse.move(500, 400);
      await pace();
      await page.mouse.move(750, 390);
      await pace();
      await page.mouse.move(950, 410);
      await pace();
    })
    // Seg 5: 3 Months view — click + sweep chart
    .segment(VIDEO_SCRIPT[5].narration, async (pace) => {
      await clickTimeRange(page, "3 Months");
      await page.mouse.move(250, 410);
      await pace();
      await page.mouse.move(450, 400);
      await pace();
      await page.mouse.move(700, 420);
      await pace();
      await page.mouse.move(950, 390);
      await pace();
    })
    // Seg 6: All Time view — click + sweep chart
    .segment(VIDEO_SCRIPT[6].narration, async (pace) => {
      await clickTimeRange(page, "All Time");
      await page.mouse.move(200, 430);
      await pace();
      await page.mouse.move(450, 400);
      await pace();
      await page.mouse.move(700, 380);
      await pace();
      await page.mouse.move(950, 400);
      await pace();
    })
    // Seg 7: Hover chart for tooltips — slow sweep with pauses
    .segment(VIDEO_SCRIPT[7].narration, async (pace) => {
      for (const x of [250, 400, 550, 700, 850, 1000]) {
        await page.mouse.move(x, 400);
        await page.waitForTimeout(350);
      }
      await pace();
      // Sweep back partway for visual interest
      await page.mouse.move(600, 410);
      await pace();
    })
    // Seg 8: Scroll down: countdown + GitHub link
    .segment(VIDEO_SCRIPT[8].narration, async (pace) => {
      await page.mouse.wheel(0, 400);
      await page.mouse.move(640, 400);
      await pace();
      await safeMove(page, "a[href*='github']");
      await pace();
      await page.mouse.move(640, 500);
      await pace();
    })
    // Seg 9: Wrap-up — scroll to top via mouse.wheel + hover headline + card
    .segment(VIDEO_SCRIPT[9].narration, async (pace) => {
      await page.mouse.wheel(0, -2000);
      await page.waitForTimeout(300);
      await safeMove(page, "h1, h2");
      await pace();
      await safeMove(page, "[class*='card'], [class*='chart'], main");
      await pace();
    })
    .outro({
      text: VIDEO_SCRIPT[10].text,
      subtitle: VIDEO_SCRIPT[10].subtitle,
      durationMs: VIDEO_SCRIPT[10].durationMs,
    });

  await script.prepare(page);
  await script.render(page, {
    baseName: "download-data",
    outputDir: ".comfy-qa/.demos",
  });
});
