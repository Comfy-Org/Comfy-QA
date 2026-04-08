/**
 * Comfy Registry — registry.comfy.org
 *
 * Story:  demo/stories/registry-web.story.md
 * Output: .comfy-qa/.demos/registry-web.mp4
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
 *    5. Total: 6–10 segments, video ~45–80 s.
 */
const VIDEO_SCRIPT = [
  {
    kind: "title",
    text: "Comfy Registry",
    subtitle: "The central hub for ComfyUI custom nodes",
    durationMs: 2000,
  },
  {
    kind: "segment",
    narration:
      "Welcome to the Comfy Registry — the official place to find and install custom nodes for ComfyUI. " +
      "Without a registry like this, you'd be hunting through random GitHub repos and hoping the code is safe.",
    visuals: ["safeMove h1"],
  },
  {
    kind: "segment",
    narration:
      "Right at the top of the page is the search bar. " +
      "This is the single most used feature on the site, so let me show you how it works.",
    visuals: ["safeMove input[type=search]"],
  },
  {
    kind: "segment",
    narration:
      "I'm going to search for ControlNet — that's the most common reason people come here. " +
      "Watch the suggestions stream in as I type.",
    visuals: ["click search input", "typeKeys 'controlnet'"],
  },
  {
    kind: "segment",
    narration:
      "Each result shows the package name, the latest version, and the publisher. " +
      "Let me scroll a bit to see the breadth of what's available.",
    visuals: ["wheel +400", "wheel +400"],
  },
  {
    kind: "segment",
    narration:
      "Now let's get back to the top of the page and look at the navigation. " +
      "Up here you can sign up to publish your own node, browse the documentation, or switch language.",
    visuals: ["scrollTo top", "safeMove header"],
  },
  {
    kind: "segment",
    narration:
      "Notice the Get Started buttons in the hero. " +
      "These point new publishers at the docs that walk you through writing and shipping your first node pack.",
    visuals: ["safeMove main"],
  },
  {
    kind: "segment",
    narration:
      "And that is the Comfy Registry in a nutshell. " +
      "Whether you're installing nodes built by the community or publishing your own, this is where the ecosystem lives.",
    visuals: ["safeMove h1"],
  },
  {
    kind: "outro",
    text: "Comfy Registry",
    subtitle: "registry.comfy.org",
    durationMs: 2000,
  },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
//  PLAYWRIGHT IMPLEMENTATION (consumes VIDEO_SCRIPT above)
// ─────────────────────────────────────────────────────────────────────────────
import { test, safeMove } from "./fixtures/fixture";
import { createVideoScript } from "../lib/demowright/dist/index.mjs";
import { typeKeys } from "../lib/demowright/dist/helpers.mjs";

test("comfy registry tour", async ({ page }) => {
  test.setTimeout(5 * 60_000);

  // Pre-navigate (heavy work BEFORE script.render — see hard rules in skill)
  await page.goto("https://registry.comfy.org/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);

  const script = createVideoScript()
    .title(VIDEO_SCRIPT[0].text, {
      subtitle: VIDEO_SCRIPT[0].subtitle,
      durationMs: VIDEO_SCRIPT[0].durationMs,
    })
    .segment(VIDEO_SCRIPT[1].narration, async (pace) => {
      await safeMove(page, "h1");
      await pace();
    })
    .segment(VIDEO_SCRIPT[2].narration, async (pace) => {
      await safeMove(page, 'input[type="search"]');
      await pace();
    })
    .segment(VIDEO_SCRIPT[3].narration, async (pace) => {
      const search = page.locator('input[type="search"]').first();
      if (await search.isVisible().catch(() => false)) {
        await search.click().catch(() => {});
        await typeKeys(page, "controlnet", 80);
      }
      await pace();
    })
    .segment(VIDEO_SCRIPT[4].narration, async (pace) => {
      await page.mouse.wheel(0, 400);
      await pace();
      await page.mouse.wheel(0, 400);
      await pace();
    })
    .segment(VIDEO_SCRIPT[5].narration, async (pace) => {
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" })).catch(() => {});
      await pace();
      await safeMove(page, "header");
      await pace();
    })
    .segment(VIDEO_SCRIPT[6].narration, async (pace) => {
      await safeMove(page, "main");
      await pace();
    })
    .segment(VIDEO_SCRIPT[7].narration, async (pace) => {
      await safeMove(page, "h1");
      await pace();
    })
    .outro({
      text: VIDEO_SCRIPT[8].text,
      subtitle: VIDEO_SCRIPT[8].subtitle,
      durationMs: VIDEO_SCRIPT[8].durationMs,
    });

  await script.prepare(page);
  await script.render(page, {
    baseName: "registry-web",
    outputDir: ".comfy-qa/.demos",
  });
});
