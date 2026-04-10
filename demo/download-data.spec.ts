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
 * | Time range: 1 Week              | ✅ | click + hover                   |
 * | Time range: 1 Month             | ✅ | click + hover                   |
 * | Time range: 3 Months            | ✅ | click + hover                   |
 * | Time range: All Time            | ✅ | click + hover                   |
 * | Chart tooltip on hover          | ✅ | per-day download counts         |
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
    visuals: ["safeMove h1"],
  },
  {
    kind: "segment",
    narration:
      "The Daily New Downloads card shows net new downloads per day across all portable ComfyUI releases. The green indicator reveals the growth rate over the selected timeframe.",
    visuals: ["safeMove card area"],
  },
  {
    kind: "segment",
    narration:
      "Let me start with the one-week view. This zooms into the most recent seven days so we can spot daily patterns — weekday versus weekend activity, for instance.",
    visuals: ["click 1 Week button", "hover chart"],
  },
  {
    kind: "segment",
    narration:
      "Switching to one month widens the lens. Now we can see whether the last thirty days have been trending up or down.",
    visuals: ["click 1 Month button", "hover chart"],
  },
  {
    kind: "segment",
    narration:
      "The three-month view is where medium-term trends become clear. Is growth accelerating or starting to plateau?",
    visuals: ["click 3 Months button", "hover chart"],
  },
  {
    kind: "segment",
    narration:
      "Finally, All Time shows the full history — every download since tracking began. You can see the key inflection points: launches, viral moments, and major releases.",
    visuals: ["click All Time button", "hover chart"],
  },
  {
    kind: "segment",
    narration:
      "Hovering over the chart reveals the exact download count for each day. This is how you find the spikes and dig into what caused them.",
    visuals: ["hover across chart slowly"],
  },
  {
    kind: "segment",
    narration:
      "Scrolling down reveals the next data update countdown and a link to the GitHub repository. This is an open-source community dashboard — anyone can contribute.",
    visuals: ["scroll down", "hover GitHub link"],
  },
  {
    kind: "segment",
    narration:
      "A clean, focused dashboard that answers one question: is ComfyUI growing? The answer, across every time horizon, is yes.",
    visuals: ["scroll to top"],
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
    // Welcome + headline
    .segment(VIDEO_SCRIPT[1].narration, async (pace) => {
      await safeMove(page, "h1, h2");
      await pace();
    })
    // Daily New Downloads card + green indicator
    .segment(VIDEO_SCRIPT[2].narration, async (pace) => {
      await safeMove(page, "[class*='card'], [class*='chart'], main");
      await pace();
    })
    // 1 Week view
    .segment(VIDEO_SCRIPT[3].narration, async (pace) => {
      await clickTimeRange(page, "1 Week");
      await page.mouse.move(500, 400);
      await pace();
      await page.mouse.move(700, 380);
      await pace();
    })
    // 1 Month view
    .segment(VIDEO_SCRIPT[4].narration, async (pace) => {
      await clickTimeRange(page, "1 Month");
      await page.mouse.move(400, 420);
      await pace();
      await page.mouse.move(800, 390);
      await pace();
    })
    // 3 Months view
    .segment(VIDEO_SCRIPT[5].narration, async (pace) => {
      await clickTimeRange(page, "3 Months");
      await page.mouse.move(300, 410);
      await pace();
      await page.mouse.move(900, 400);
      await pace();
    })
    // All Time view
    .segment(VIDEO_SCRIPT[6].narration, async (pace) => {
      await clickTimeRange(page, "All Time");
      await page.mouse.move(200, 430);
      await pace();
      await page.mouse.move(800, 380);
      await pace();
    })
    // Hover chart for tooltips
    .segment(VIDEO_SCRIPT[7].narration, async (pace) => {
      for (const x of [300, 500, 700, 900]) {
        await page.mouse.move(x, 400);
        await page.waitForTimeout(400);
      }
      await pace();
    })
    // Scroll down: countdown + GitHub link
    .segment(VIDEO_SCRIPT[8].narration, async (pace) => {
      await page.mouse.wheel(0, 400);
      await page.waitForTimeout(500);
      await safeMove(page, "a[href*='github']");
      await pace();
    })
    // Wrap-up
    .segment(VIDEO_SCRIPT[9].narration, async (pace) => {
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
      await page.waitForTimeout(500);
      await page.mouse.move(640, 360);
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
