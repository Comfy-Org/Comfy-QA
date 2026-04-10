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
 *  recording. This is a narrated walkthrough of the Comfy Vibe prototype
 *  landing page — an early-stage placeholder for what may become a ComfyUI
 *  workspace tool.
 *
 *  Rules:
 *    1. First person, present tense, conversational pace.
 *    2. Connect segments with transitional phrases — never bullet-points.
 *    3. Explain WHY, not just WHAT.
 *    4. Each segment ~6–10 seconds at 140 wpm ⇒ 14–24 words is the sweet spot.
 *    5. Total: 22 segments, video ~2–3 minutes.
 */
const VIDEO_SCRIPT = [
  // ── Title ──
  {
    kind: "title",
    text: "Comfy Vibe",
    subtitle: "A prototype landing page in the ComfyUI ecosystem",
    durationMs: 2000,
  },

  // ── Chapter 1: First impressions (segments 1–5) ──
  {
    kind: "segment",
    narration:
      "Welcome to Comfy Vibe — let's see what's at comfy-vibe.vercel.app. " +
      "This is one of the newer projects in the ComfyUI ecosystem.",
  },
  {
    kind: "segment",
    narration:
      "Right away you can see this is very minimal. The page loads with a single heading — " +
      "ComfyUI Prototypes. That's it. No sidebar, no dashboard, no navigation.",
  },
  {
    kind: "segment",
    narration:
      "The background is clean and the typography is straightforward. " +
      "There's no visual clutter here — because there's almost nothing on the page yet.",
  },
  {
    kind: "segment",
    narration:
      "This is clearly an early-stage placeholder. The domain is live, the deployment works, " +
      "but the product itself hasn't been built out yet.",
  },
  {
    kind: "segment",
    narration:
      "And honestly? That's worth documenting. Not every project launches fully formed. " +
      "Sometimes you deploy a landing page first and build the product behind it.",
  },

  // ── Chapter 2: What's actually here (segments 6–10) ──
  {
    kind: "segment",
    narration:
      "Let me look more carefully at what's on the page. The title says ComfyUI Prototypes — " +
      "plural. That suggests this is meant to host multiple experiments.",
  },
  {
    kind: "segment",
    narration:
      "The word prototypes is key. This isn't positioned as a finished product. " +
      "It's a staging ground for ideas that might graduate into real tools.",
  },
  {
    kind: "segment",
    narration:
      "There are no links, no buttons, no interactive elements anywhere on the page. " +
      "It's purely static text — a signpost more than an application.",
  },
  {
    kind: "segment",
    narration:
      "The fact that it's hosted on Vercel tells us something too. " +
      "This is likely a Next.js or similar framework deployment, ready to scale when content arrives.",
  },
  {
    kind: "segment",
    narration:
      "The page renders quickly and cleanly. Whatever framework is behind this, " +
      "the foundation is solid — it just needs content to fill it.",
  },

  // ── Chapter 3: What this might become (segments 11–15) ──
  {
    kind: "segment",
    narration:
      "So what could Comfy Vibe become? The name itself hints at something creative — " +
      "vibe suggests aesthetics, mood, and creative direction.",
  },
  {
    kind: "segment",
    narration:
      "Given it says prototypes, I'd guess this could become a gallery of experimental ComfyUI tools. " +
      "Maybe workflow templates, maybe UI experiments, maybe both.",
  },
  {
    kind: "segment",
    narration:
      "The ComfyUI ecosystem is growing fast. There's the main editor, the registry, " +
      "the documentation site, and now prototype spaces like this one.",
  },
  {
    kind: "segment",
    narration:
      "A dedicated prototyping space makes sense. It gives the team room to experiment " +
      "without risking the stability of the core product.",
  },
  {
    kind: "segment",
    narration:
      "Whether this becomes a workspace dashboard, a component library, or something else entirely — " +
      "having the domain and deployment pipeline ready is half the battle.",
  },

  // ── Chapter 4: Prototyping in the ecosystem (segments 16–20) ──
  {
    kind: "segment",
    narration:
      "Let me zoom out and talk about why prototyping matters for ComfyUI specifically. " +
      "This is a tool used by thousands of creative professionals every day.",
  },
  {
    kind: "segment",
    narration:
      "When you move fast in generative AI, you need safe spaces to try new ideas. " +
      "A prototype page like this is exactly that kind of safe space.",
  },
  {
    kind: "segment",
    narration:
      "The best features in ComfyUI started as experiments. Node grouping, custom widgets, " +
      "the workflow format itself — all prototyped before they shipped.",
  },
  {
    kind: "segment",
    narration:
      "So even though this page is nearly empty right now, it represents something important — " +
      "the willingness to explore new directions publicly.",
  },
  {
    kind: "segment",
    narration:
      "I'll be keeping an eye on this URL. When new prototypes land here, " +
      "they'll give us a preview of where ComfyUI is heading next.",
  },

  // ── Chapter 5: Wrapping up (segments 21–22) ──
  {
    kind: "segment",
    narration:
      "That's Comfy Vibe today — a minimal prototype landing page with the title " +
      "ComfyUI Prototypes and nothing else. Simple, honest, and ready to grow.",
  },
  {
    kind: "segment",
    narration:
      "Check back at comfy-vibe.vercel.app as the ComfyUI ecosystem evolves. " +
      "What's a placeholder today could be an essential tool tomorrow.",
  },

  // ── Outro ──
  {
    kind: "outro",
    text: "Comfy Vibe",
    subtitle: "comfy-vibe.vercel.app",
    durationMs: 2000,
  },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
//  PLAYWRIGHT IMPLEMENTATION (consumes VIDEO_SCRIPT above)
// ─────────────────────────────────────────────────────────────────────────────
import { test, safeMove } from "./fixtures/fixture";
import { createVideoScript } from "../lib/demowright/dist/index.mjs";

test("comfy vibe tour", async ({ page }) => {
  test.setTimeout(10 * 60_000);

  // Pre-navigate (heavy work BEFORE script.render — see hard rules in skill)
  await page.goto("https://comfy-vibe.vercel.app/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(4000);

  const script = createVideoScript()
    // ── Title ──
    .title(VIDEO_SCRIPT[0].text, {
      subtitle: VIDEO_SCRIPT[0].subtitle,
      durationMs: VIDEO_SCRIPT[0].durationMs,
    })

    // ── Chapter 1: First impressions ──
    .segment(VIDEO_SCRIPT[1].narration, async (pace) => {
      await page.mouse.move(640, 360);
      await pace();
    })
    .segment(VIDEO_SCRIPT[2].narration, async (pace) => {
      await safeMove(page, "h1, h2, [class*='title'], [class*='heading']");
      await pace();
      await page.mouse.move(640, 300);
      await pace();
    })
    .segment(VIDEO_SCRIPT[3].narration, async (pace) => {
      await page.mouse.move(640, 200);
      await pace();
      await page.mouse.move(640, 400);
      await pace();
    })
    .segment(VIDEO_SCRIPT[4].narration, async (pace) => {
      await page.mouse.move(400, 360);
      await pace();
      await page.mouse.move(880, 360);
      await pace();
    })
    .segment(VIDEO_SCRIPT[5].narration, async (pace) => {
      await page.mouse.move(640, 360);
      await pace();
    })

    // ── Chapter 2: What's actually here ──
    .segment(VIDEO_SCRIPT[6].narration, async (pace) => {
      await safeMove(page, "h1, h2, [class*='title'], [class*='heading']");
      await pace();
    })
    .segment(VIDEO_SCRIPT[7].narration, async (pace) => {
      await safeMove(page, "h1, h2, [class*='title'], [class*='heading']");
      await pace();
      await page.mouse.move(640, 340);
      await pace();
    })
    .segment(VIDEO_SCRIPT[8].narration, async (pace) => {
      await page.mouse.move(200, 200);
      await pace();
      await page.mouse.move(1080, 500);
      await pace();
    })
    .segment(VIDEO_SCRIPT[9].narration, async (pace) => {
      await page.mouse.move(640, 100);
      await pace();
      await page.mouse.move(640, 300);
      await pace();
    })
    .segment(VIDEO_SCRIPT[10].narration, async (pace) => {
      await page.mouse.move(640, 360);
      await pace();
    })

    // ── Chapter 3: What this might become ──
    .segment(VIDEO_SCRIPT[11].narration, async (pace) => {
      await safeMove(page, "h1, h2, [class*='title'], [class*='heading']");
      await pace();
    })
    .segment(VIDEO_SCRIPT[12].narration, async (pace) => {
      await page.mouse.move(640, 300);
      await pace();
      await page.mouse.move(640, 400);
      await pace();
    })
    .segment(VIDEO_SCRIPT[13].narration, async (pace) => {
      await page.mouse.move(640, 360);
      await pace();
    })
    .segment(VIDEO_SCRIPT[14].narration, async (pace) => {
      await page.mouse.move(500, 360);
      await pace();
      await page.mouse.move(780, 360);
      await pace();
    })
    .segment(VIDEO_SCRIPT[15].narration, async (pace) => {
      await page.mouse.move(640, 300);
      await pace();
      await page.mouse.move(640, 360);
      await pace();
    })

    // ── Chapter 4: Prototyping in the ecosystem ──
    .segment(VIDEO_SCRIPT[16].narration, async (pace) => {
      await page.mouse.move(640, 360);
      await pace();
    })
    .segment(VIDEO_SCRIPT[17].narration, async (pace) => {
      await page.mouse.move(400, 300);
      await pace();
      await page.mouse.move(880, 400);
      await pace();
    })
    .segment(VIDEO_SCRIPT[18].narration, async (pace) => {
      await page.mouse.move(640, 360);
      await pace();
    })
    .segment(VIDEO_SCRIPT[19].narration, async (pace) => {
      await safeMove(page, "h1, h2, [class*='title'], [class*='heading']");
      await pace();
    })
    .segment(VIDEO_SCRIPT[20].narration, async (pace) => {
      await page.mouse.move(640, 300);
      await pace();
      await page.mouse.move(640, 360);
      await pace();
    })

    // ── Chapter 5: Wrapping up ──
    .segment(VIDEO_SCRIPT[21].narration, async (pace) => {
      await safeMove(page, "h1, h2, [class*='title'], [class*='heading']");
      await pace();
    })
    .segment(VIDEO_SCRIPT[22].narration, async (pace) => {
      await page.mouse.move(640, 360);
      await pace();
    })

    // ── Outro ──
    .outro({
      text: VIDEO_SCRIPT[23].text,
      subtitle: VIDEO_SCRIPT[23].subtitle,
      durationMs: VIDEO_SCRIPT[23].durationMs,
    });

  await script.prepare(page);
  await script.render(page, {
    baseName: "comfy-vibe",
    outputDir: ".comfy-qa/.demos",
  });
});
