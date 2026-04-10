/**
 * Comfy Vibe — comfy-vibe.vercel.app
 *
 * Story:  demo/stories/comfy-vibe.story.md
 * Output: .comfy-qa/.demos/comfy-vibe.mp4
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
 *    5. ~6 minutes, 22 segments organized in 7 chapters.
 */
const VIDEO_SCRIPT = [
  // ── Intro ──
  { kind: "title", text: "Comfy Vibe", subtitle: "The Comfy design experience", durationMs: 3000 },
  { kind: "segment", narration: "Comfy Vibe is a showcase of the design language behind every Comfy product. Typography, color, motion, layout — all the visual decisions that shape the user experience." },
  { kind: "segment", narration: "Think of it as a living style guide. Every section demonstrates a different aspect of the design system in action." },

  // ── Chapter 1: Hero and First Impression ──
  { kind: "title", text: "Hero & First Impression", subtitle: "Bold entrance, immediate clarity", durationMs: 2000 },
  { kind: "segment", narration: "The hero section hits you with bold typography and smooth entrance animations. The font choices are deliberate — clean, modern, and highly legible at every size." },
  { kind: "segment", narration: "Notice the color palette right away. Accent colors pop against muted backgrounds, creating contrast that draws your eye exactly where it should go." },
  { kind: "segment", narration: "The full-screen layout establishes visual hierarchy from the first pixel. Headings dominate, body text recedes, and whitespace gives everything room to breathe." },

  // ── Chapter 2: Layout and Spacing ──
  { kind: "title", text: "Layout & Spacing", subtitle: "Structure through negative space", durationMs: 2000 },
  { kind: "segment", narration: "Scrolling down reveals the grid system at work. Content blocks align to a consistent grid, giving the page a structured but not rigid feel." },
  { kind: "segment", narration: "Whitespace rhythm is the secret ingredient. The spacing between sections follows a predictable scale — it creates breathing room without feeling empty." },
  { kind: "segment", narration: "Content hierarchy through spacing is subtle but powerful. Related elements sit close together, while distinct sections are separated by generous vertical gaps." },

  // ── Chapter 3: Typography System ──
  { kind: "title", text: "Typography System", subtitle: "From headlines to fine print", durationMs: 2000 },
  { kind: "segment", narration: "The font family choices underpin the entire design. A geometric sans-serif for headings paired with a readable body font creates visual contrast and warmth." },
  { kind: "segment", narration: "The type scale moves from large hero headings down through subheadings, body text, and captions. Each step is proportional — nothing feels arbitrarily sized." },
  { kind: "segment", narration: "Weight and emphasis patterns add another dimension. Bold for headings, medium for navigation, regular for body — the weight conveys importance without color." },

  // ── Chapter 4: Color and Contrast ──
  { kind: "title", text: "Color & Contrast", subtitle: "Palette with purpose", durationMs: 2000 },
  { kind: "segment", narration: "Primary and accent colors are used sparingly but effectively. The primary color anchors the brand, while accents highlight interactive elements and key information." },
  { kind: "segment", narration: "Dark and light surface treatments create depth. Cards float above backgrounds, sections alternate tone, and shadows are subtle — just enough to imply layers." },
  { kind: "segment", narration: "Color as information hierarchy is the design principle at play. The most important content gets the strongest color, while secondary information fades back." },

  // ── Chapter 5: Motion and Interaction ──
  { kind: "title", text: "Motion & Interaction", subtitle: "Movement with meaning", durationMs: 2000 },
  { kind: "segment", narration: "Hovering over buttons and links reveals transition states. Colors shift, underlines appear, and subtle scale changes confirm that the element is interactive." },
  { kind: "segment", narration: "Scroll-triggered entrance animations bring sections to life as you reach them. Elements fade in, slide up, or scale from zero — timed to feel natural, not flashy." },
  { kind: "segment", narration: "Micro-interactions provide subtle feedback on every action. A button press, a toggle switch, a menu expand — each has a small animation that says 'I heard you.'" },
  { kind: "segment", narration: "Easing curves and timing are carefully chosen. Nothing snaps instantly or drifts too slowly. The motion feels organic — quick to respond, smooth to settle." },

  // ── Chapter 6: Design at Scale ──
  { kind: "title", text: "Design at Scale", subtitle: "Consistency across every component", durationMs: 2000 },
  { kind: "segment", narration: "Further down, more content sections show how the system adapts to different content types — dense information, media-heavy layouts, and minimal interfaces all share the same DNA." },
  { kind: "segment", narration: "The footer wraps it all up with consistent link styling and navigation patterns. Even at the bottom of the page, every element follows the same design rules." },
  { kind: "segment", narration: "Overall coherence is the goal. Every element — from the hero to the footer — feels intentional. Nothing is an afterthought, nothing clashes." },

  // ── Outro ──
  { kind: "segment", narration: "That's Comfy Vibe — the design thinking behind every Comfy product. From typography to motion, every choice is deliberate." },
  { kind: "outro", text: "Comfy Vibe", subtitle: "Design meets function", narration: "Comfy Vibe showcases the complete design system: typography scale, color palette, spacing rhythm, motion design, hover states, scroll animations, and cross-component consistency — the visual language that powers every Comfy product.", durationMs: 3000 },
] as const;

const VS = VIDEO_SCRIPT;

// ─────────────────────────────────────────────────────────────────────────────
//  PLAYWRIGHT IMPLEMENTATION (consumes VIDEO_SCRIPT above)
// ─────────────────────────────────────────────────────────────────────────────
import { test, safeMove } from "./fixtures/fixture";
import { createVideoScript } from "../lib/demowright/dist/index.mjs";

test("comfy vibe tour", async ({ page }) => {
  test.setTimeout(10 * 60_000);

  // Pre-navigate before script.render
  await page.goto("https://comfy-vibe.vercel.app/", {
    waitUntil: "domcontentloaded",
  });
  await page.waitForTimeout(2000);

  const script = createVideoScript()
    // ── Intro ──
    .title(VS[0].text, {
      subtitle: VS[0].subtitle,
      durationMs: VS[0].durationMs,
    })

    // Segment 1 — What is Comfy Vibe
    .segment(VS[1].narration, async (pace) => {
      await safeMove(page, "h1");
      await pace();
      await safeMove(page, "main");
      await pace();
    })

    // Segment 2 — Living style guide
    .segment(VS[2].narration, async (pace) => {
      await page.mouse.move(640, 300);
      await pace();
      await page.mouse.move(640, 500);
      await pace();
    })

    // ── Chapter 1: Hero and First Impression ──
    .title(VS[3].text, {
      subtitle: VS[3].subtitle,
      durationMs: VS[3].durationMs,
    })

    // Segment 3 — Bold typography and entrance animations
    .segment(VS[4].narration, async (pace) => {
      await safeMove(page, "h1");
      await pace();
      await page.mouse.move(640, 250);
      await pace();
    })

    // Segment 4 — Color palette
    .segment(VS[5].narration, async (pace) => {
      await page.mouse.move(400, 300);
      await pace();
      await page.mouse.move(800, 350);
      await pace();
    })

    // Segment 5 — Full-screen layout and hierarchy
    .segment(VS[6].narration, async (pace) => {
      await page.mouse.move(640, 150);
      await pace();
      await page.mouse.move(640, 400);
      await pace();
      await page.mouse.move(640, 550);
      await pace();
    })

    // ── Chapter 2: Layout and Spacing ──
    .title(VS[7].text, {
      subtitle: VS[7].subtitle,
      durationMs: VS[7].durationMs,
    })

    // Segment 6 — Grid system
    .segment(VS[8].narration, async (pace) => {
      await page.mouse.wheel(0, 400);
      await pace();
      await page.mouse.move(300, 350);
      await pace();
      await page.mouse.move(900, 350);
      await pace();
    })

    // Segment 7 — Whitespace rhythm
    .segment(VS[9].narration, async (pace) => {
      await page.mouse.wheel(0, 350);
      await pace();
      await page.mouse.move(640, 300);
      await pace();
    })

    // Segment 8 — Content hierarchy through spacing
    .segment(VS[10].narration, async (pace) => {
      await page.mouse.wheel(0, 350);
      await pace();
      await page.mouse.move(640, 400);
      await pace();
    })

    // ── Chapter 3: Typography System ──
    .title(VS[11].text, {
      subtitle: VS[11].subtitle,
      durationMs: VS[11].durationMs,
    })

    // Segment 9 — Font family choices
    .segment(VS[12].narration, async (pace) => {
      await page.mouse.wheel(0, 350);
      await pace();
      await page.mouse.move(640, 300);
      await pace();
    })

    // Segment 10 — Type scale
    .segment(VS[13].narration, async (pace) => {
      await page.mouse.wheel(0, 300);
      await pace();
      await page.mouse.move(640, 350);
      await pace();
    })

    // Segment 11 — Weight and emphasis
    .segment(VS[14].narration, async (pace) => {
      await page.mouse.wheel(0, 300);
      await pace();
      await page.mouse.move(500, 380);
      await pace();
    })

    // ── Chapter 4: Color and Contrast ──
    .title(VS[15].text, {
      subtitle: VS[15].subtitle,
      durationMs: VS[15].durationMs,
    })

    // Segment 12 — Primary and accent colors
    .segment(VS[16].narration, async (pace) => {
      await page.mouse.wheel(0, 350);
      await pace();
      await page.mouse.move(640, 350);
      await pace();
    })

    // Segment 13 — Dark/light surface treatment
    .segment(VS[17].narration, async (pace) => {
      await page.mouse.wheel(0, 350);
      await pace();
      await page.mouse.move(500, 400);
      await pace();
    })

    // Segment 14 — Color as information hierarchy
    .segment(VS[18].narration, async (pace) => {
      await page.mouse.wheel(0, 300);
      await pace();
      await page.mouse.move(700, 350);
      await pace();
    })

    // ── Chapter 5: Motion and Interaction ──
    .title(VS[19].text, {
      subtitle: VS[19].subtitle,
      durationMs: VS[19].durationMs,
    })

    // Segment 15 — Hover state transitions
    .segment(VS[20].narration, async (pace) => {
      await safeMove(page, "a");
      await pace();
      await safeMove(page, "button");
      await pace();
    })

    // Segment 16 — Scroll-triggered animations
    .segment(VS[21].narration, async (pace) => {
      await page.mouse.wheel(0, 400);
      await pace();
      await page.mouse.wheel(0, 300);
      await pace();
    })

    // Segment 17 — Micro-interactions
    .segment(VS[22].narration, async (pace) => {
      await page.mouse.move(640, 350);
      await pace();
      await page.mouse.move(500, 400);
      await pace();
    })

    // Segment 18 — Easing curves and timing
    .segment(VS[23].narration, async (pace) => {
      await page.mouse.wheel(0, 300);
      await pace();
      await page.mouse.move(640, 380);
      await pace();
    })

    // ── Chapter 6: Design at Scale ──
    .title(VS[24].text, {
      subtitle: VS[24].subtitle,
      durationMs: VS[24].durationMs,
    })

    // Segment 19 — Adapts to different content types
    .segment(VS[25].narration, async (pace) => {
      await page.mouse.wheel(0, 400);
      await pace();
      await page.mouse.move(640, 400);
      await pace();
    })

    // Segment 20 — Footer consistency
    .segment(VS[26].narration, async (pace) => {
      await page.mouse.wheel(0, 500);
      await pace();
      await page.mouse.move(640, 550);
      await pace();
    })

    // Segment 21 — Overall coherence
    .segment(VS[27].narration, async (pace) => {
      await page.mouse.wheel(0, 300);
      await pace();
      await page.mouse.move(640, 400);
      await pace();
    })

    // ── Outro ──
    // Segment 22 — Wrap-up
    .segment(VS[28].narration, async (pace) => {
      await page.mouse.wheel(0, -3000);
      await pace();
      await safeMove(page, "h1");
      await pace();
    })

    .outro({
      text: VS[29].text,
      subtitle: VS[29].subtitle,
      narration: VS[29].narration,
      durationMs: VS[29].durationMs,
    });

  await script.prepare(page);
  await script.render(page, {
    baseName: "comfy-vibe",
    outputDir: ".comfy-qa/.demos",
  });
});
