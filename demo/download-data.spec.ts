/**
 * ComfyUI Download Data — comfyui-download-statistics.vercel.app
 *
 * Story:  demo/stories/download-data.story.md
 * Output: .comfy-qa/.demos/download-data.mp4
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *  VIDEO SCRIPT (the source of truth)
 * ─────────────────────────────────────────────────────────────────────────────
 *  Every word in `narration` is read aloud verbatim by Gemini TTS during
 *  recording. Edit this constant first, run it through your head as a
 *  voiceover, and only then touch the Playwright code below.
 *
 *  Rules:
 *    1. First person, present tense, conversational pace.
 *    2. Connect segments with transitional phrases — never bullet-points.
 *    3. Explain WHY, not just WHAT.
 *    4. Each segment ~6–10 seconds at 140 wpm ⇒ 14–24 words is the sweet spot.
 *    5. Target: 50+ segments for a comprehensive 5-minute walkthrough.
 */
const VIDEO_SCRIPT = [
  // ── 0: Title ──
  {
    kind: "title",
    text: "ComfyUI Download Data",
    subtitle: "Tracking ecosystem growth in real time",
    durationMs: 2000,
  },

  // ── 1–5: Landing & overview ──
  {
    kind: "segment",
    narration:
      "Welcome to the ComfyUI Download Data dashboard — a single page that tracks how fast the ComfyUI ecosystem is growing.",
    visuals: ["safeMove h1"],
  },
  {
    kind: "segment",
    narration:
      "Right below the headline, the subtitle reads Daily New Downloads — net new downloads per day for all portable ComfyUI releases. That's the core metric this page tracks.",
    visuals: ["safeMove main"],
  },
  {
    kind: "segment",
    narration:
      "Let me start by orienting you to the layout. The headline at the top tells us exactly what we're looking at — ComfyUI Download Data.",
    visuals: ["safeMove h1"],
  },
  {
    kind: "segment",
    narration:
      "Below the headline, you'll find the change statistics — something like plus four thousand downloads per day and a percentage increase showing growth over the selected timeframe.",
    visuals: ["mouse.move 600 250"],
  },
  {
    kind: "segment",
    narration:
      "Think of these headline numbers as the executive summary — even without touching the chart, you get the big picture instantly.",
    visuals: ["mouse.move 400 280"],
  },

  // ── 6–10: Chart introduction ──
  {
    kind: "segment",
    narration:
      "Now let's look at the star of the page — the interactive download chart that visualizes trends over time.",
    visuals: ["mouse.move 600 400"],
  },
  {
    kind: "segment",
    narration:
      "The horizontal axis represents time — dates marching from left to right. The vertical axis shows download counts.",
    visuals: ["mouse.move 200 450"],
  },
  {
    kind: "segment",
    narration:
      "Each data point on the line represents the number of downloads recorded during that period. Together they form the trend.",
    visuals: ["mouse.move 400 420"],
  },
  {
    kind: "segment",
    narration:
      "Let me hover across the chart slowly so you can see the tooltip that appears with exact numbers for each data point.",
    visuals: ["mouse.move 300 430"],
  },
  {
    kind: "segment",
    narration:
      "Watch the tooltip as I move to the right — the numbers shift with each date, giving you granular detail on demand.",
    visuals: ["mouse.move 500 430"],
  },

  // ── 11–14: More chart hovering ──
  {
    kind: "segment",
    narration:
      "Moving further along the timeline here, you can spot peaks where download activity surged — perhaps after a major release or viral post.",
    visuals: ["mouse.move 650 430"],
  },
  {
    kind: "segment",
    narration:
      "And here toward the right edge is the most recent data. This is where you check whether today's momentum is up or down.",
    visuals: ["mouse.move 800 430"],
  },
  {
    kind: "segment",
    narration:
      "Let me sweep back to the left side of the chart. Early data points show where the journey began.",
    visuals: ["mouse.move 250 430"],
  },
  {
    kind: "segment",
    narration:
      "The shape of this curve tells a story — steady growth, sudden spikes, and the overall trajectory of adoption.",
    visuals: ["mouse.move 500 400"],
  },

  // ── 15–17: Time range buttons intro ──
  {
    kind: "segment",
    narration:
      "Above the chart you'll notice the time range buttons. These let you zoom into different windows of data.",
    visuals: ["mouse.move 600 350"],
  },
  {
    kind: "segment",
    narration:
      "There are four options: one Week, one Month, three Months, and All Time. Each one redraws the chart with a different scope.",
    visuals: ["mouse.move 500 350"],
  },
  {
    kind: "segment",
    narration:
      "Let's explore each time range one by one, starting with the shortest view — one Week.",
    visuals: ["hover 1 Week button"],
  },

  // ── 18–24: 1 Week view ──
  {
    kind: "segment",
    narration:
      "I'm clicking the one Week button now. This filters the chart to show only the last seven days of download activity.",
    visuals: ["click 1 Week"],
  },
  {
    kind: "segment",
    narration:
      "In the one-week view, each data point represents a single day. You can see the daily rhythm of the community.",
    visuals: ["mouse.move 400 430"],
  },
  {
    kind: "segment",
    narration:
      "Let me hover across Monday through Friday — weekday downloads tend to be higher because developers are at their desks.",
    visuals: ["mouse.move 300 430"],
  },
  {
    kind: "segment",
    narration:
      "And here toward the weekend you might notice a dip — or sometimes a spike when hobbyists have free time to experiment.",
    visuals: ["mouse.move 600 430"],
  },
  {
    kind: "segment",
    narration:
      "The one-week view is perfect for spotting anomalies — did a new release just drop? Did a YouTube tutorial go viral?",
    visuals: ["mouse.move 700 430"],
  },
  {
    kind: "segment",
    narration:
      "If you're a custom node author, this is the view you check after publishing an update to see if downloads spiked.",
    visuals: ["mouse.move 500 420"],
  },
  {
    kind: "segment",
    narration:
      "One week gives you the pulse. But to see a real trend, we need a wider window. Let's try one Month.",
    visuals: ["mouse.move 400 400"],
  },

  // ── 25–31: 1 Month view ──
  {
    kind: "segment",
    narration:
      "Switching to the one Month view now. The chart redraws to show the last thirty days of download data.",
    visuals: ["click 1 Month"],
  },
  {
    kind: "segment",
    narration:
      "With a month of data, daily noise smooths out and the underlying trend becomes clearer.",
    visuals: ["mouse.move 400 430"],
  },
  {
    kind: "segment",
    narration:
      "Let me trace across the first half of the month. Are downloads climbing, flat, or declining?",
    visuals: ["mouse.move 300 430"],
  },
  {
    kind: "segment",
    narration:
      "Now moving to the second half — look for any inflection points where the curve changes direction.",
    visuals: ["mouse.move 600 430"],
  },
  {
    kind: "segment",
    narration:
      "A sustained upward slope over thirty days is a strong signal that something is driving new adoption.",
    visuals: ["mouse.move 750 430"],
  },
  {
    kind: "segment",
    narration:
      "Content creators and investors watch this monthly view because it filters out noise but still shows recent momentum.",
    visuals: ["mouse.move 500 420"],
  },
  {
    kind: "segment",
    narration:
      "One month is great for recent trends. But what about the bigger picture? Let's zoom out to three Months.",
    visuals: ["mouse.move 450 400"],
  },

  // ── 32–38: 3 Months view ──
  {
    kind: "segment",
    narration:
      "Clicking the three Months button now. This is the quarterly view — ninety days of ComfyUI download history.",
    visuals: ["click 3 Months"],
  },
  {
    kind: "segment",
    narration:
      "At this scale, you can see seasonal patterns. Does the community grow faster in certain months?",
    visuals: ["mouse.move 400 430"],
  },
  {
    kind: "segment",
    narration:
      "Let me hover through the early part of the quarter. This is where the baseline was set three months ago.",
    visuals: ["mouse.move 250 430"],
  },
  {
    kind: "segment",
    narration:
      "Moving forward through the middle — you can see whether growth accelerated or hit a plateau.",
    visuals: ["mouse.move 500 430"],
  },
  {
    kind: "segment",
    narration:
      "And arriving at the present day on the right edge — compare this to where we started. That delta is the quarterly growth.",
    visuals: ["mouse.move 750 430"],
  },
  {
    kind: "segment",
    narration:
      "Three months is the sweet spot for medium-term analysis. It captures product launches, conference bumps, and seasonal effects.",
    visuals: ["mouse.move 600 420"],
  },
  {
    kind: "segment",
    narration:
      "If you're writing a blog post or quarterly report about ComfyUI adoption, this is the chart you'd screenshot.",
    visuals: ["mouse.move 500 400"],
  },

  // ── 39–46: All Time view ──
  {
    kind: "segment",
    narration:
      "Now for the big reveal — All Time. I'm clicking it to see every download ever recorded since tracking began.",
    visuals: ["click All Time"],
  },
  {
    kind: "segment",
    narration:
      "The All Time view is the most impressive. You can see the entire growth arc of ComfyUI from its earliest days.",
    visuals: ["mouse.move 400 430"],
  },
  {
    kind: "segment",
    narration:
      "On the far left is where it all started — modest download numbers when ComfyUI was a niche tool.",
    visuals: ["mouse.move 200 430"],
  },
  {
    kind: "segment",
    narration:
      "As I move right, watch the curve steepen. This is where ComfyUI went from niche to mainstream in the AI art community.",
    visuals: ["mouse.move 400 430"],
  },
  {
    kind: "segment",
    narration:
      "Key inflection points along this curve often correspond to major releases — new samplers, ControlNet support, or video generation features.",
    visuals: ["mouse.move 550 430"],
  },
  {
    kind: "segment",
    narration:
      "The steeper the slope, the faster the adoption. And what we see here is a classic exponential growth pattern.",
    visuals: ["mouse.move 650 430"],
  },
  {
    kind: "segment",
    narration:
      "Hovering over the most recent data point shows today's standing — the cumulative result of years of community effort.",
    visuals: ["mouse.move 800 430"],
  },
  {
    kind: "segment",
    narration:
      "The All Time view puts everything in perspective. Short-term dips that looked alarming at the weekly level barely register here.",
    visuals: ["mouse.move 500 420"],
  },

  // ── 47–51: Analysis & context ──
  {
    kind: "segment",
    narration:
      "Let me compare what we've seen. The weekly view shows daily rhythms. The monthly view shows momentum. The quarterly view shows trends. And All Time shows the arc.",
    visuals: ["mouse.move 500 350"],
  },
  {
    kind: "segment",
    narration:
      "Together, these four views give you a complete picture of ecosystem health — from today's pulse to the long-term trajectory.",
    visuals: ["mouse.move 600 350"],
  },
  {
    kind: "segment",
    narration:
      "What does this data tell us about ComfyUI? In a word — growth. Consistent, accelerating growth driven by an active open-source community.",
    visuals: ["mouse.move 500 300"],
  },
  {
    kind: "segment",
    narration:
      "Every new custom node, every tutorial, every Discord conversation — they all contribute to the download numbers you see here.",
    visuals: ["safeMove h1"],
  },
  {
    kind: "segment",
    narration:
      "If you're a node author, these numbers validate your work. If you're evaluating ComfyUI, they prove it's not going away.",
    visuals: ["mouse.move 600 300"],
  },

  // ── 52–54: GitHub & wrap-up ──
  {
    kind: "segment",
    narration:
      "Before we wrap up, notice the GitHub link on the page. This dashboard itself is open source — you can fork it, contribute, or verify the data.",
    visuals: ["safeMove a[href*='github']"],
  },
  {
    kind: "segment",
    narration:
      "Open sourcing the dashboard means the community can trust these numbers. No black box — just transparent data.",
    visuals: ["mouse.move 600 300"],
  },
  {
    kind: "segment",
    narration:
      "And that's the ComfyUI Download Data dashboard — your window into the health and trajectory of the ComfyUI ecosystem. Bookmark it and check back often.",
    visuals: ["safeMove h1"],
  },

  // ── 55: Outro ──
  {
    kind: "outro",
    text: "ComfyUI Download Data",
    subtitle: "comfyui-download-statistics.vercel.app",
    durationMs: 2000,
  },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
//  PLAYWRIGHT IMPLEMENTATION (consumes VIDEO_SCRIPT above)
// ─────────────────────────────────────────────────────────────────────────────
import { test, safeMove } from "./fixtures/fixture";
import { createVideoScript } from "../lib/demowright/dist/index.mjs";

test("comfyui download statistics tour", async ({ page }) => {
  test.setTimeout(10 * 60_000);

  // Pre-navigate (heavy work BEFORE script.render — see hard rules in skill)
  await page.goto("https://comfyui-download-statistics.vercel.app", {
    waitUntil: "domcontentloaded",
  });
  await page.waitForTimeout(3000);

  const script = createVideoScript()
    // ── Title ──
    .title(VIDEO_SCRIPT[0].text, {
      subtitle: VIDEO_SCRIPT[0].subtitle,
      durationMs: VIDEO_SCRIPT[0].durationMs,
    })

    // ── 1–5: Landing & overview ──
    .segment(VIDEO_SCRIPT[1].narration, async (pace) => {
      await safeMove(page, "h1");
      await pace();
    })
    .segment(VIDEO_SCRIPT[2].narration, async (pace) => {
      await safeMove(page, "main");
      await pace();
    })
    .segment(VIDEO_SCRIPT[3].narration, async (pace) => {
      await safeMove(page, "h1");
      await pace();
    })
    .segment(VIDEO_SCRIPT[4].narration, async (pace) => {
      await page.mouse.move(600, 250);
      await pace();
      await page.mouse.move(400, 280);
      await pace();
    })
    .segment(VIDEO_SCRIPT[5].narration, async (pace) => {
      await page.mouse.move(400, 280);
      await pace();
      await page.mouse.move(600, 300);
      await pace();
    })

    // ── 6–10: Chart introduction ──
    .segment(VIDEO_SCRIPT[6].narration, async (pace) => {
      await page.mouse.move(600, 400);
      await pace();
    })
    .segment(VIDEO_SCRIPT[7].narration, async (pace) => {
      await page.mouse.move(200, 450);
      await pace();
      await page.mouse.move(200, 600);
      await pace();
    })
    .segment(VIDEO_SCRIPT[8].narration, async (pace) => {
      await page.mouse.move(400, 420);
      await pace();
    })
    .segment(VIDEO_SCRIPT[9].narration, async (pace) => {
      await page.mouse.move(250, 430);
      await pace();
      await page.mouse.move(350, 430);
      await pace();
    })
    .segment(VIDEO_SCRIPT[10].narration, async (pace) => {
      await page.mouse.move(450, 430);
      await pace();
      await page.mouse.move(550, 430);
      await pace();
    })

    // ── 11–14: More chart hovering ──
    .segment(VIDEO_SCRIPT[11].narration, async (pace) => {
      await page.mouse.move(600, 430);
      await pace();
      await page.mouse.move(700, 430);
      await pace();
    })
    .segment(VIDEO_SCRIPT[12].narration, async (pace) => {
      await page.mouse.move(750, 430);
      await pace();
      await page.mouse.move(850, 430);
      await pace();
    })
    .segment(VIDEO_SCRIPT[13].narration, async (pace) => {
      await page.mouse.move(600, 430);
      await pace();
      await page.mouse.move(300, 430);
      await pace();
    })
    .segment(VIDEO_SCRIPT[14].narration, async (pace) => {
      await page.mouse.move(400, 400);
      await pace();
      await page.mouse.move(600, 400);
      await pace();
    })

    // ── 15–17: Time range buttons intro ──
    .segment(VIDEO_SCRIPT[15].narration, async (pace) => {
      await page.mouse.move(600, 350);
      await pace();
    })
    .segment(VIDEO_SCRIPT[16].narration, async (pace) => {
      await page.mouse.move(400, 350);
      await pace();
      await page.mouse.move(600, 350);
      await pace();
    })
    .segment(VIDEO_SCRIPT[17].narration, async (pace) => {
      await safeMove(page, "button:has-text('1 Week'), button:has-text('1W'), button:has-text('7D')");
      await pace();
    })

    // ── 18–24: 1 Week view ──
    .segment(VIDEO_SCRIPT[18].narration, async (pace) => {
      const btn = page.locator("button").filter({ hasText: /1\s*W|1\s*Week|7\s*D/i }).first();
      if (await btn.isVisible().catch(() => false)) {
        await btn.click().catch(() => {});
      }
      await pace();
    })
    .segment(VIDEO_SCRIPT[19].narration, async (pace) => {
      await page.mouse.move(400, 430);
      await pace();
      await page.mouse.move(500, 430);
      await pace();
    })
    .segment(VIDEO_SCRIPT[20].narration, async (pace) => {
      await page.mouse.move(250, 430);
      await pace();
      await page.mouse.move(350, 430);
      await pace();
      await page.mouse.move(500, 430);
      await pace();
    })
    .segment(VIDEO_SCRIPT[21].narration, async (pace) => {
      await page.mouse.move(600, 430);
      await pace();
      await page.mouse.move(750, 430);
      await pace();
    })
    .segment(VIDEO_SCRIPT[22].narration, async (pace) => {
      await page.mouse.move(700, 430);
      await pace();
      await page.mouse.move(800, 430);
      await pace();
    })
    .segment(VIDEO_SCRIPT[23].narration, async (pace) => {
      await page.mouse.move(500, 420);
      await pace();
      await page.mouse.move(600, 420);
      await pace();
    })
    .segment(VIDEO_SCRIPT[24].narration, async (pace) => {
      await page.mouse.move(400, 400);
      await pace();
    })

    // ── 25–31: 1 Month view ──
    .segment(VIDEO_SCRIPT[25].narration, async (pace) => {
      const btn = page.locator("button").filter({ hasText: /1\s*M|1\s*Month|30\s*D/i }).first();
      if (await btn.isVisible().catch(() => false)) {
        await btn.click().catch(() => {});
      }
      await pace();
    })
    .segment(VIDEO_SCRIPT[26].narration, async (pace) => {
      await page.mouse.move(400, 430);
      await pace();
      await page.mouse.move(500, 430);
      await pace();
    })
    .segment(VIDEO_SCRIPT[27].narration, async (pace) => {
      await page.mouse.move(250, 430);
      await pace();
      await page.mouse.move(400, 430);
      await pace();
    })
    .segment(VIDEO_SCRIPT[28].narration, async (pace) => {
      await page.mouse.move(550, 430);
      await pace();
      await page.mouse.move(700, 430);
      await pace();
    })
    .segment(VIDEO_SCRIPT[29].narration, async (pace) => {
      await page.mouse.move(700, 430);
      await pace();
      await page.mouse.move(800, 430);
      await pace();
    })
    .segment(VIDEO_SCRIPT[30].narration, async (pace) => {
      await page.mouse.move(500, 420);
      await pace();
    })
    .segment(VIDEO_SCRIPT[31].narration, async (pace) => {
      await page.mouse.move(450, 400);
      await pace();
    })

    // ── 32–38: 3 Months view ──
    .segment(VIDEO_SCRIPT[32].narration, async (pace) => {
      const btn = page.locator("button").filter({ hasText: /3\s*M|3\s*Month|90\s*D/i }).first();
      if (await btn.isVisible().catch(() => false)) {
        await btn.click().catch(() => {});
      }
      await pace();
    })
    .segment(VIDEO_SCRIPT[33].narration, async (pace) => {
      await page.mouse.move(400, 430);
      await pace();
      await page.mouse.move(500, 430);
      await pace();
    })
    .segment(VIDEO_SCRIPT[34].narration, async (pace) => {
      await page.mouse.move(200, 430);
      await pace();
      await page.mouse.move(350, 430);
      await pace();
    })
    .segment(VIDEO_SCRIPT[35].narration, async (pace) => {
      await page.mouse.move(450, 430);
      await pace();
      await page.mouse.move(600, 430);
      await pace();
    })
    .segment(VIDEO_SCRIPT[36].narration, async (pace) => {
      await page.mouse.move(700, 430);
      await pace();
      await page.mouse.move(830, 430);
      await pace();
    })
    .segment(VIDEO_SCRIPT[37].narration, async (pace) => {
      await page.mouse.move(600, 420);
      await pace();
    })
    .segment(VIDEO_SCRIPT[38].narration, async (pace) => {
      await page.mouse.move(500, 400);
      await pace();
    })

    // ── 39–46: All Time view ──
    .segment(VIDEO_SCRIPT[39].narration, async (pace) => {
      const btn = page.locator("button").filter({ hasText: /All\s*Time|All/i }).first();
      if (await btn.isVisible().catch(() => false)) {
        await btn.click().catch(() => {});
      }
      await pace();
    })
    .segment(VIDEO_SCRIPT[40].narration, async (pace) => {
      await page.mouse.move(400, 430);
      await pace();
      await page.mouse.move(600, 430);
      await pace();
    })
    .segment(VIDEO_SCRIPT[41].narration, async (pace) => {
      await page.mouse.move(150, 430);
      await pace();
      await page.mouse.move(250, 430);
      await pace();
    })
    .segment(VIDEO_SCRIPT[42].narration, async (pace) => {
      await page.mouse.move(350, 430);
      await pace();
      await page.mouse.move(500, 430);
      await pace();
    })
    .segment(VIDEO_SCRIPT[43].narration, async (pace) => {
      await page.mouse.move(500, 430);
      await pace();
      await page.mouse.move(600, 430);
      await pace();
    })
    .segment(VIDEO_SCRIPT[44].narration, async (pace) => {
      await page.mouse.move(600, 430);
      await pace();
      await page.mouse.move(700, 430);
      await pace();
    })
    .segment(VIDEO_SCRIPT[45].narration, async (pace) => {
      await page.mouse.move(780, 430);
      await pace();
      await page.mouse.move(850, 430);
      await pace();
    })
    .segment(VIDEO_SCRIPT[46].narration, async (pace) => {
      await page.mouse.move(500, 420);
      await pace();
      await page.mouse.move(600, 400);
      await pace();
    })

    // ── 47–51: Analysis & context ──
    .segment(VIDEO_SCRIPT[47].narration, async (pace) => {
      await page.mouse.move(500, 350);
      await pace();
    })
    .segment(VIDEO_SCRIPT[48].narration, async (pace) => {
      await page.mouse.move(600, 350);
      await pace();
    })
    .segment(VIDEO_SCRIPT[49].narration, async (pace) => {
      await page.mouse.move(500, 300);
      await pace();
    })
    .segment(VIDEO_SCRIPT[50].narration, async (pace) => {
      await safeMove(page, "h1");
      await pace();
    })
    .segment(VIDEO_SCRIPT[51].narration, async (pace) => {
      await page.mouse.move(600, 300);
      await pace();
    })

    // ── 52–54: GitHub & wrap-up ──
    .segment(VIDEO_SCRIPT[52].narration, async (pace) => {
      await safeMove(page, "a[href*='github']");
      await pace();
    })
    .segment(VIDEO_SCRIPT[53].narration, async (pace) => {
      await page.mouse.move(600, 300);
      await pace();
    })
    .segment(VIDEO_SCRIPT[54].narration, async (pace) => {
      await safeMove(page, "h1");
      await pace();
    })

    // ── Outro ──
    .outro({
      text: VIDEO_SCRIPT[55].text,
      subtitle: VIDEO_SCRIPT[55].subtitle,
      durationMs: VIDEO_SCRIPT[55].durationMs,
    });

  await script.prepare(page);
  await script.render(page, {
    baseName: "download-data",
    outputDir: ".comfy-qa/.demos",
  });
});
