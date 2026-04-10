/**
 * Node Licenses — custom-node-licenses.vercel.app
 *
 * Story:  demo/stories/custom-node-licenses.story.md
 * Output: .comfy-qa/.demos/custom-node-licenses.mp4
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
 *    5. ~7 minutes, 26 segments organized in 7 chapters.
 */
const VIDEO_SCRIPT = [
  // ── Intro ── (idx 0–2)
  { kind: "title", text: "Node Licenses", subtitle: "Know your license before you ship", durationMs: 2500 },
  { kind: "segment", narration: "Building a commercial product with ComfyUI custom nodes? One GPL dependency changes your entire project's licensing. You need to know every license in your stack before shipping." },
  { kind: "segment", narration: "This dashboard maps the complete license landscape of the ComfyUI ecosystem. Visual breakdown, searchable table, and filters — license compliance in under a minute." },

  // ── Chapter 1: License Distribution Chart ── (idx 3–7)
  { kind: "title", text: "License Distribution", subtitle: "Visual breakdown of the ecosystem", durationMs: 1500 },
  { kind: "segment", narration: "The chart shows how licenses are distributed across all custom nodes. One glance reveals which license types dominate the ecosystem." },
  { kind: "segment", narration: "MIT takes the largest share, which is great news for commercial use. MIT means no copyleft obligations and maximum freedom to ship." },
  { kind: "segment", narration: "GPL and Apache slices are clearly visible too. GPL requires open-source distribution, while Apache adds patent protection on top of permissiveness." },
  { kind: "segment", narration: "Proprietary and uncommon licenses appear as smaller segments. These are the edge cases that need careful per-package review before integration." },

  // ── Chapter 2: Chart Interactions ── (idx 8–11)
  { kind: "title", text: "Chart Interactions", subtitle: "Hover and compare license segments", durationMs: 1500 },
  { kind: "segment", narration: "Hovering over each chart segment reveals the exact count and percentage. No need to estimate — the precise numbers appear instantly." },
  { kind: "segment", narration: "Comparing segment sizes visually shows the balance of the ecosystem. The MIT dominance is reassuring but the GPL slice demands attention." },
  { kind: "segment", narration: "Reading the ratios gives me a quick risk profile. If ninety percent is MIT, my odds of hitting a copyleft issue are low but not zero." },

  // ── Chapter 3: Node Table ── (idx 12–16)
  { kind: "title", text: "Node-by-Node Breakdown", subtitle: "Check every package individually", durationMs: 1500 },
  { kind: "segment", narration: "Below the chart, every custom node is listed with its license type. This table is the definitive reference for per-package compliance." },
  { kind: "segment", narration: "Each row shows the package name, license type, and publisher. Three columns that answer the essential question — can I use this commercially?" },
  { kind: "segment", narration: "Sorting by license type groups all MIT, GPL, and Apache packages together. This makes it easy to audit one license category at a time." },
  { kind: "segment", narration: "I can search for a specific package by name to check its license instantly. Much faster than digging through repository files manually." },

  // ── Chapter 4: Filtering ── (idx 17–21)
  { kind: "title", text: "Filtering", subtitle: "Narrow down by license type", durationMs: 1500 },
  { kind: "segment", narration: "Filtering to MIT-only shows me every commercial-safe package in the ecosystem. These are the nodes I can use without any copyleft worries." },
  { kind: "segment", narration: "Switching the filter to GPL reveals packages that require open-source distribution. If my project is closed-source, these are the ones to avoid." },
  { kind: "segment", narration: "The text search box lets me find specific packages by name while filters are active. Combining both narrows results down to exactly what I need." },
  { kind: "segment", narration: "Clearing all filters brings back the full picture. The complete ecosystem view is always one click away when I need the broad perspective." },

  // ── Chapter 5: Risk Assessment ── (idx 22–26)
  { kind: "title", text: "Risk Assessment", subtitle: "Licenses that need extra attention", durationMs: 1500 },
  { kind: "segment", narration: "Creative Commons licenses are non-standard for code and often ambiguous. If I see CC on a node, I need to review the specific variant carefully." },
  { kind: "segment", narration: "LGPL allows dynamic linking without copyleft spreading, but static linking triggers full GPL obligations. The distinction matters for how I integrate." },
  { kind: "segment", narration: "Custom and proprietary licenses need per-case review with legal counsel. No shortcut here — each one has unique terms and restrictions." },
  { kind: "segment", narration: "Building a compliance checklist from this data is straightforward. Export the filtered view and I have a ready-made audit document for my team." },

  // ── Chapter 6: Commercial Use Guide ── (idx 27–30)
  { kind: "title", text: "Commercial Use Guide", subtitle: "Quick reference for shipping products", durationMs: 1500 },
  { kind: "segment", narration: "MIT, Apache, and BSD licenses are generally safe for commercial use. These permissive licenses let me ship proprietary products without restrictions." },
  { kind: "segment", narration: "The GPL family carries copyleft obligations. Any derivative work must be distributed under the same license — a deal-breaker for many commercial projects." },
  { kind: "segment", narration: "Best practice is simple — check this dashboard before adding any node to a commercial project. Five seconds of checking prevents months of legal trouble." },

  // ── Outro ── (idx 31–32)
  { kind: "segment", narration: "That's the license dashboard. Visual breakdown, searchable table, filters — license compliance for the entire ComfyUI ecosystem in one page." },
  { kind: "outro", text: "Node Licenses", subtitle: "License clarity for the ComfyUI ecosystem", narration: "The license dashboard gives you a visual license distribution chart, a searchable node-by-node table, MIT GPL Apache filters, risk assessment for uncommon licenses, and a commercial compatibility guide — compliance clarity in seconds.", durationMs: 3000 },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
//  PLAYWRIGHT IMPLEMENTATION (consumes VIDEO_SCRIPT above)
// ─────────────────────────────────────────────────────────────────────────────
import { test, safeMove } from "./fixtures/fixture";
import { createVideoScript } from "../lib/demowright/dist/index.mjs";
import { typeKeys } from "../lib/demowright/dist/helpers.mjs";

const VS = VIDEO_SCRIPT;

test("custom node licenses tour", async ({ page }) => {
  test.setTimeout(10 * 60_000);

  // Pre-navigate before script.render
  await page.goto("https://custom-node-licenses.vercel.app", {
    waitUntil: "domcontentloaded",
  });
  await page.waitForTimeout(3000);

  const script = createVideoScript()

    // ── Intro ──
    .title(VS[0].text, { subtitle: VS[0].subtitle, durationMs: VS[0].durationMs })

    // Segment 1 — Why licenses matter
    .segment(VS[1].narration, async (pace) => {
      await safeMove(page, "h1");
      await pace();
      await safeMove(page, "main");
      await pace();
    })

    // Segment 2 — Dashboard value proposition
    .segment(VS[2].narration, async (pace) => {
      await page.mouse.move(640, 300);
      await pace();
      await page.mouse.move(400, 350);
      await pace();
    })

    // ── Chapter 1: License Distribution Chart ──
    .title(VS[3].text, { subtitle: VS[3].subtitle, durationMs: VS[3].durationMs })

    // Segment 3 — Chart overview
    .segment(VS[4].narration, async (pace) => {
      await page.mouse.wheel(0, 200);
      await pace();
      await safeMove(page, "svg, canvas, [class*=chart], [class*=Chart]");
      await pace();
    })

    // Segment 4 — MIT dominance
    .segment(VS[5].narration, async (pace) => {
      await page.mouse.move(640, 350);
      await pace();
      await page.mouse.move(600, 330);
      await pace();
    })

    // Segment 5 — GPL/Apache presence
    .segment(VS[6].narration, async (pace) => {
      await page.mouse.move(700, 370);
      await pace();
      await page.mouse.move(580, 390);
      await pace();
    })

    // Segment 6 — Proprietary and uncommon
    .segment(VS[7].narration, async (pace) => {
      await page.mouse.move(720, 340);
      await pace();
      await page.mouse.move(660, 400);
      await pace();
    })

    // ── Chapter 2: Chart Interactions ──
    .title(VS[8].text, { subtitle: VS[8].subtitle, durationMs: VS[8].durationMs })

    // Segment 7 — Hover for exact counts
    .segment(VS[9].narration, async (pace) => {
      await page.mouse.move(600, 340);
      await pace();
      await page.mouse.move(650, 360);
      await pace();
      await page.mouse.move(700, 350);
      await pace();
    })

    // Segment 8 — Compare segment sizes
    .segment(VS[10].narration, async (pace) => {
      await page.mouse.move(580, 330);
      await pace();
      await page.mouse.move(720, 380);
      await pace();
    })

    // Segment 9 — Read the ratios
    .segment(VS[11].narration, async (pace) => {
      await page.mouse.move(640, 350);
      await pace();
      await page.mouse.move(680, 370);
      await pace();
    })

    // ── Chapter 3: Node Table ──
    .title(VS[12].text, { subtitle: VS[12].subtitle, durationMs: VS[12].durationMs })

    // Segment 10 — Table overview
    .segment(VS[13].narration, async (pace) => {
      await page.mouse.wheel(0, 400);
      await pace();
      await safeMove(page, "table, [role=table], [class*=table], [class*=Table]");
      await pace();
    })

    // Segment 11 — Row details
    .segment(VS[14].narration, async (pace) => {
      await safeMove(page, "table tr:nth-child(2), [role=row]:nth-child(2)");
      await pace();
      await page.mouse.move(500, 450);
      await pace();
      await page.mouse.move(700, 450);
      await pace();
    })

    // Segment 12 — Sort by license type
    .segment(VS[15].narration, async (pace) => {
      await safeMove(page, "th:nth-child(2), [role=columnheader]:nth-child(2)");
      await pace();
      await page.mouse.move(600, 420);
      await pace();
    })

    // Segment 13 — Search for specific package
    .segment(VS[16].narration, async (pace) => {
      await page.mouse.wheel(0, -400);
      await pace();
      await safeMove(page, "input[type=search], input[type=text], input[placeholder*=earch], input[placeholder*=ilter]");
      await pace();
      await typeKeys(page, "impact", 80);
      await pace();
    })

    // ── Chapter 4: Filtering ──
    .title(VS[17].text, { subtitle: VS[17].subtitle, durationMs: VS[17].durationMs })

    // Segment 14 — Filter to MIT-only
    .segment(VS[18].narration, async (pace) => {
      // Clear previous search
      await page.keyboard.press("Control+a");
      await page.keyboard.press("Backspace");
      await pace();
      await safeMove(page, "select, button:has-text('MIT'), [class*=filter], [class*=Filter]");
      await pace();
    })

    // Segment 15 — Filter to GPL
    .segment(VS[19].narration, async (pace) => {
      await safeMove(page, "select, button:has-text('GPL'), [class*=filter], [class*=Filter]");
      await pace();
      await page.mouse.wheel(0, 200);
      await pace();
    })

    // Segment 16 — Text search with filters
    .segment(VS[20].narration, async (pace) => {
      await safeMove(page, "input[type=search], input[type=text], input[placeholder*=earch], input[placeholder*=ilter]");
      await pace();
      await typeKeys(page, "comfy", 80);
      await pace();
    })

    // Segment 17 — Clear filters
    .segment(VS[21].narration, async (pace) => {
      await page.keyboard.press("Control+a");
      await page.keyboard.press("Backspace");
      await pace();
      await safeMove(page, "button:has-text('Clear'), button:has-text('Reset'), button:has-text('All')");
      await pace();
    })

    // ── Chapter 5: Risk Assessment ──
    .title(VS[22].text, { subtitle: VS[22].subtitle, durationMs: VS[22].durationMs })

    // Segment 18 — Creative Commons
    .segment(VS[23].narration, async (pace) => {
      await page.mouse.wheel(0, 300);
      await pace();
      await page.mouse.move(500, 420);
      await pace();
    })

    // Segment 19 — LGPL
    .segment(VS[24].narration, async (pace) => {
      await page.mouse.move(600, 440);
      await pace();
      await page.mouse.move(500, 460);
      await pace();
    })

    // Segment 20 — Custom/proprietary
    .segment(VS[25].narration, async (pace) => {
      await page.mouse.wheel(0, 200);
      await pace();
      await page.mouse.move(550, 430);
      await pace();
    })

    // Segment 21 — Building a compliance checklist
    .segment(VS[26].narration, async (pace) => {
      await page.mouse.wheel(0, -400);
      await pace();
      await safeMove(page, "table, [role=table], [class*=table], [class*=Table]");
      await pace();
    })

    // ── Chapter 6: Commercial Use Guide ──
    .title(VS[27].text, { subtitle: VS[27].subtitle, durationMs: VS[27].durationMs })

    // Segment 22 — MIT/Apache/BSD safe
    .segment(VS[28].narration, async (pace) => {
      await page.mouse.wheel(0, -1000);
      await pace();
      await safeMove(page, "svg, canvas, [class*=chart], [class*=Chart]");
      await pace();
      await page.mouse.move(620, 340);
      await pace();
    })

    // Segment 23 — GPL family copyleft
    .segment(VS[29].narration, async (pace) => {
      await page.mouse.move(700, 370);
      await pace();
      await page.mouse.move(680, 390);
      await pace();
    })

    // Segment 24 — Best practice
    .segment(VS[30].narration, async (pace) => {
      await page.mouse.wheel(0, -500);
      await pace();
      await safeMove(page, "h1");
      await pace();
    })

    // ── Outro ──
    // Segment 25 — Wrap-up
    .segment(VS[31].narration, async (pace) => {
      await safeMove(page, "h1");
      await pace();
      await page.mouse.move(640, 360);
      await pace();
    })

    .outro({
      text: VS[32].text,
      subtitle: VS[32].subtitle,
      narration: VS[32].narration,
      durationMs: VS[32].durationMs,
    });

  await script.prepare(page);
  await script.render(page, {
    baseName: "custom-node-licenses",
    outputDir: ".comfy-qa/.demos",
  });
});
