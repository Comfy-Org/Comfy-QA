/**
 * Download Statistics — comfyui-download-statistics.vercel.app
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
 *    5. ~7 minutes, 28 segments organized in 7 chapters.
 */
const VIDEO_SCRIPT = [
  // ── Intro ── (idx 0–2)
  { kind: "title", text: "Download Statistics", subtitle: "Track adoption across the ComfyUI ecosystem", durationMs: 2500 },
  { kind: "segment", narration: "How do you know which custom nodes are worth installing? Download numbers don't lie. This dashboard shows adoption trends for every package in the ComfyUI ecosystem." },
  { kind: "segment", narration: "Whether you're a node author tracking growth, a user evaluating packages, or just curious about the ecosystem — all the data is here, updated in real time." },

  // ── Chapter 1: Headline Metrics ── (idx 3–7)
  { kind: "title", text: "Headline Metrics", subtitle: "The big picture at a glance", durationMs: 1500 },
  { kind: "segment", narration: "The big number at the top is total downloads across every package. This single metric captures how active the entire ecosystem really is." },
  { kind: "segment", narration: "Next to it, total packages in the ecosystem. This count shows how many tools the community has published and made available." },
  { kind: "segment", narration: "Actively maintained packages get their own counter. A healthy ecosystem needs authors who keep updating, not just publishing and walking away." },
  { kind: "segment", narration: "Together these three numbers paint a clear picture — ecosystem size, overall adoption, and ongoing commitment from package authors." },

  // ── Chapter 2: Trend Chart ── (idx 8–13)
  { kind: "title", text: "Download Trends", subtitle: "Interactive chart over time", durationMs: 1500 },
  { kind: "segment", narration: "This interactive chart shows download volume over time. I can see the overall trajectory of the ecosystem at a glance." },
  { kind: "segment", narration: "Hovering over any point reveals exact daily numbers in a tooltip. Precise data for any date I care about, no guessing required." },
  { kind: "segment", narration: "Those sudden spikes usually mean a viral tutorial dropped or a major node just released. Release-day surges are easy to spot here." },
  { kind: "segment", narration: "The overall trend curve tells the real story — whether downloads are growing, plateauing, or showing seasonal patterns throughout the year." },
  { kind: "segment", narration: "Comparing different time periods helps me understand momentum. Last month versus this month shows whether growth is accelerating or slowing." },

  // ── Chapter 3: Package Leaderboard ── (idx 14–19)
  { kind: "title", text: "Package Leaderboard", subtitle: "Most downloaded packages ranked", durationMs: 1500 },
  { kind: "segment", narration: "Scrolling down to the leaderboard. Packages ranked by total downloads — the most trusted tools rise to the top naturally." },
  { kind: "segment", narration: "Each row shows the package name, publisher, and download count. This trio tells me who built it and how widely it's adopted." },
  { kind: "segment", narration: "Scrolling further reveals battle-tested essentials giving way to newer packages. The ranking reflects real community voting with installs." },
  { kind: "segment", narration: "I can sort or search the leaderboard to find specific packages quickly. No need to scroll through hundreds of entries manually." },
  { kind: "segment", narration: "Pagination lets me browse through every single package in the ecosystem. Nothing is hidden — the full picture is always accessible." },

  // ── Chapter 4: Long Tail Exploration ── (idx 20–24)
  { kind: "title", text: "Long Tail Exploration", subtitle: "Discover hidden gems beyond the top tier", durationMs: 1500 },
  { kind: "segment", narration: "Mid-tier packages are solid tools with moderate adoption. They may not top the charts but they solve real problems reliably." },
  { kind: "segment", narration: "Niche packages serve specialized workflows — inpainting helpers, LoRA managers, specific model integrations. Small audience but deeply valuable." },
  { kind: "segment", narration: "Hidden gems are innovative tools waiting to be discovered. Low download counts don't mean low quality — just low visibility so far." },
  { kind: "segment", narration: "Brand new packages sit at the bottom with near-zero downloads. Every top package started here — today's newcomer might be tomorrow's essential." },

  // ── Chapter 5: Using the Data ── (idx 25–28)
  { kind: "title", text: "Using the Data", subtitle: "Actionable insights for every role", durationMs: 1500 },
  { kind: "segment", narration: "For node authors, this dashboard tracks your package's adoption curve. Watch installs grow after each release and measure real impact." },
  { kind: "segment", narration: "For users, download counts help you choose battle-tested packages over experimental ones. Higher downloads usually mean better documentation and support." },
  { kind: "segment", narration: "For the ecosystem overall, these metrics gauge health and growth trajectory. A rising tide of downloads means the community is thriving." },

  // ── Outro ── (idx 29–30)
  { kind: "segment", narration: "That's the download dashboard. Real-time metrics, interactive charts, and a ranked leaderboard for every package in the ecosystem." },
  { kind: "outro", text: "Download Statistics", subtitle: "ComfyUI ecosystem metrics", narration: "The download dashboard gives you real-time ecosystem metrics, interactive trend charts with daily hover data, a ranked package leaderboard with search and sort, long-tail exploration for hidden gems, and actionable data for both authors and users.", durationMs: 3000 },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
//  PLAYWRIGHT IMPLEMENTATION (consumes VIDEO_SCRIPT above)
// ─────────────────────────────────────────────────────────────────────────────
import { test, safeMove } from "./fixtures/fixture";
import { createVideoScript } from "../lib/demowright/dist/index.mjs";
import { typeKeys } from "../lib/demowright/dist/helpers.mjs";

const VS = VIDEO_SCRIPT;

test("comfyui download statistics tour", async ({ page }) => {
  test.setTimeout(10 * 60_000);

  // Pre-navigate before script.render
  await page.goto("https://comfyui-download-statistics.vercel.app", {
    waitUntil: "domcontentloaded",
  });
  await page.waitForTimeout(3000);

  const script = createVideoScript()

    // ── Intro ──
    .title(VS[0].text, { subtitle: VS[0].subtitle, durationMs: VS[0].durationMs })

    // Segment 1 — Why this dashboard matters
    .segment(VS[1].narration, async (pace) => {
      await safeMove(page, "h1");
      await pace();
      await safeMove(page, "main");
      await pace();
    })

    // Segment 2 — Who it's for
    .segment(VS[2].narration, async (pace) => {
      await page.mouse.move(640, 300);
      await pace();
      await page.mouse.move(400, 350);
      await pace();
    })

    // ── Chapter 1: Headline Metrics ──
    .title(VS[3].text, { subtitle: VS[3].subtitle, durationMs: VS[3].durationMs })

    // Segment 3 — Total downloads counter
    .segment(VS[4].narration, async (pace) => {
      await page.mouse.wheel(0, -500);
      await pace();
      await safeMove(page, "h1");
      await pace();
      await page.mouse.move(400, 200);
      await pace();
    })

    // Segment 4 — Total packages
    .segment(VS[5].narration, async (pace) => {
      await page.mouse.move(640, 200);
      await pace();
      await page.mouse.move(700, 220);
      await pace();
    })

    // Segment 5 — Actively maintained
    .segment(VS[6].narration, async (pace) => {
      await page.mouse.move(900, 200);
      await pace();
      await page.mouse.move(850, 220);
      await pace();
    })

    // Segment 6 — What these numbers mean
    .segment(VS[7].narration, async (pace) => {
      await page.mouse.move(640, 180);
      await pace();
      await page.mouse.move(500, 200);
      await pace();
      await page.mouse.move(780, 200);
      await pace();
    })

    // ── Chapter 2: Trend Chart ──
    .title(VS[8].text, { subtitle: VS[8].subtitle, durationMs: VS[8].durationMs })

    // Segment 7 — Chart overview
    .segment(VS[9].narration, async (pace) => {
      await page.mouse.wheel(0, 300);
      await pace();
      await safeMove(page, "svg, canvas, [class*=chart], [class*=Chart]");
      await pace();
    })

    // Segment 8 — Hover for daily numbers
    .segment(VS[10].narration, async (pace) => {
      await page.mouse.move(400, 400);
      await pace();
      await page.mouse.move(500, 380);
      await pace();
      await page.mouse.move(600, 390);
      await pace();
    })

    // Segment 9 — Release-day spikes
    .segment(VS[11].narration, async (pace) => {
      await page.mouse.move(700, 370);
      await pace();
      await page.mouse.move(750, 350);
      await pace();
    })

    // Segment 10 — Overall trend curve
    .segment(VS[12].narration, async (pace) => {
      await page.mouse.move(350, 400);
      await pace();
      await page.mouse.move(550, 380);
      await pace();
      await page.mouse.move(800, 360);
      await pace();
    })

    // Segment 11 — Compare time periods
    .segment(VS[13].narration, async (pace) => {
      await page.mouse.move(450, 390);
      await pace();
      await page.mouse.move(700, 370);
      await pace();
    })

    // ── Chapter 3: Package Leaderboard ──
    .title(VS[14].text, { subtitle: VS[14].subtitle, durationMs: VS[14].durationMs })

    // Segment 12 — Top packages overview
    .segment(VS[15].narration, async (pace) => {
      await page.mouse.wheel(0, 400);
      await pace();
      await safeMove(page, "table, [role=table], [class*=table], [class*=Table]");
      await pace();
    })

    // Segment 13 — Row anatomy
    .segment(VS[16].narration, async (pace) => {
      await safeMove(page, "table tr:nth-child(2), [role=row]:nth-child(2)");
      await pace();
      await page.mouse.move(500, 450);
      await pace();
      await page.mouse.move(700, 450);
      await pace();
    })

    // Segment 14 — Scroll through rankings
    .segment(VS[17].narration, async (pace) => {
      await page.mouse.wheel(0, 300);
      await pace();
      await page.mouse.wheel(0, 300);
      await pace();
    })

    // Segment 15 — Sort or search
    .segment(VS[18].narration, async (pace) => {
      await page.mouse.wheel(0, -400);
      await pace();
      await safeMove(page, "input[type=search], input[type=text], input[placeholder*=earch], input[placeholder*=ilter]");
      await pace();
      await typeKeys(page, "manager", 80);
      await pace();
    })

    // Segment 16 — Pagination
    .segment(VS[19].narration, async (pace) => {
      // Clear the search
      await page.keyboard.press("Control+a");
      await page.keyboard.press("Backspace");
      await pace();
      await page.mouse.wheel(0, 600);
      await pace();
      await safeMove(page, "button:has-text('Next'), [aria-label*=next], [class*=pagination] button:last-child");
      await pace();
    })

    // ── Chapter 4: Long Tail Exploration ──
    .title(VS[20].text, { subtitle: VS[20].subtitle, durationMs: VS[20].durationMs })

    // Segment 17 — Mid-tier packages
    .segment(VS[21].narration, async (pace) => {
      await page.mouse.wheel(0, 400);
      await pace();
      await page.mouse.move(500, 400);
      await pace();
    })

    // Segment 18 — Niche packages
    .segment(VS[22].narration, async (pace) => {
      await page.mouse.wheel(0, 300);
      await pace();
      await page.mouse.move(500, 450);
      await pace();
    })

    // Segment 19 — Hidden gems
    .segment(VS[23].narration, async (pace) => {
      await page.mouse.wheel(0, 300);
      await pace();
      await page.mouse.move(600, 420);
      await pace();
    })

    // Segment 20 — Brand new packages
    .segment(VS[24].narration, async (pace) => {
      await page.mouse.wheel(0, 400);
      await pace();
      await page.mouse.move(500, 480);
      await pace();
    })

    // ── Chapter 5: Using the Data ──
    .title(VS[25].text, { subtitle: VS[25].subtitle, durationMs: VS[25].durationMs })

    // Segment 21 — For node authors
    .segment(VS[26].narration, async (pace) => {
      await page.mouse.wheel(0, -2000);
      await pace();
      await safeMove(page, "svg, canvas, [class*=chart], [class*=Chart]");
      await pace();
    })

    // Segment 22 — For users
    .segment(VS[27].narration, async (pace) => {
      await page.mouse.wheel(0, 400);
      await pace();
      await safeMove(page, "table tr:nth-child(2), [role=row]:nth-child(2)");
      await pace();
    })

    // Segment 23 — For the ecosystem
    .segment(VS[28].narration, async (pace) => {
      await page.mouse.wheel(0, -2000);
      await pace();
      await safeMove(page, "h1");
      await pace();
      await page.mouse.move(640, 250);
      await pace();
    })

    // ── Outro ──
    // Segment 24 — Wrap-up
    .segment(VS[29].narration, async (pace) => {
      await safeMove(page, "h1");
      await pace();
      await page.mouse.move(640, 360);
      await pace();
    })

    .outro({
      text: VS[30].text,
      subtitle: VS[30].subtitle,
      narration: VS[30].narration,
      durationMs: VS[30].durationMs,
    });

  await script.prepare(page);
  await script.render(page, {
    baseName: "download-data",
    outputDir: ".comfy-qa/.demos",
  });
});
