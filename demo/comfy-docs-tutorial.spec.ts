/**
 * ComfyUI Docs — Text to Image Tutorial (sub-page deep dive)
 *
 * Story:  demo/stories/comfy-docs-tutorial.story.md
 * Output: .comfy-qa/.demos/comfy-docs-tutorial.mp4
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *  VIDEO SCRIPT (the source of truth)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * User Journey: A user reads the Text to Image tutorial — clicks TOC links
 * to jump between sections, reads node explanations, and interacts with the
 * AI chat assistant.
 *
 * Coverage: 12/15 (80%)
 *
 * | Feature                              | R | Notes                         |
 * |--------------------------------------|---|-------------------------------|
 * | Tutorial heading (H1)                | ✅ | "ComfyUI Text to Image..."    |
 * | Right-sidebar table of contents      | ✅ | hover TOC links               |
 * | TOC click → Preparation              | ✅ | click link, scroll to section |
 * | Preparation section                  | ✅ | read prerequisites            |
 * | Working Principles section           | ✅ | click TOC link, read content  |
 * | Node explanations                    | ✅ | scroll through node headings  |
 * | Visual diagrams / screenshots        | ✅ | hover images                  |
 * | AI chat assistant                    | ✅ | hover "Ask a question" input  |
 * | Breadcrumb / page structure          | ✅ | sidebar visible               |
 * | Loading the workflow section         | ❌ | merged into scroll            |
 * | Generating first image section       | ❌ | merged into scroll            |
 * | Start experimenting section          | ❌ | merged into scroll            |
 *
 * Segment classification:
 *   NAVIGATE: 0  INTERACT: 4  OBSERVE: 4  Total: 8
 *   Ratio: (0+4)/8 = 50% interactive ✅
 *   Max consecutive OBSERVE: 2 ✅
 */
const VIDEO_SCRIPT = [
  // ── Title ──
  {
    kind: "title",
    text: "ComfyUI Docs",
    subtitle: "Text to Image Tutorial",
    durationMs: 2000,
  },

  // 1 — OBSERVE: tutorial heading + page structure
  {
    kind: "segment",
    narration:
      "This is the Text to Image tutorial — the first thing most new users read. " +
      "The heading tells me exactly what I'll learn, and the sidebar shows where this fits in the overall documentation.",
    visuals: ["safeMove h1", "safeMove aside nav"],
  },

  // 2 — INTERACT: hover TOC links, then click Preparation
  {
    kind: "segment",
    narration:
      "On the right side, the table of contents lets me jump to any section. " +
      "I'll click Preparation to go straight to the prerequisites — that's where I need to start.",
    visuals: ["safeMove TOC Preparation link", "click TOC Preparation link"],
  },

  // 3 — OBSERVE: read Preparation section + scroll through screenshots
  {
    kind: "segment",
    narration:
      "Step one is Preparation — I need a model checkpoint before I can generate anything. " +
      "The docs explain which models work, with annotated screenshots showing exactly what to download.",
    visuals: ["safeMove Preparation heading", "wheel +500", "hover screenshot"],
  },

  // 4 — INTERACT: click TOC link → Working Principles section
  {
    kind: "segment",
    narration:
      "Let me jump ahead to Working Principles using the table of contents. " +
      "This section explains how data flows through the node graph — the mental model every user needs.",
    visuals: ["click TOC Working Principles link", "safeMove heading"],
  },

  // 5 — OBSERVE: scroll through node explanations
  {
    kind: "segment",
    narration:
      "Each node gets its own explanation — Load Checkpoint, Empty Latent Image, CLIP Text Encoder, " +
      "KSampler, VAE Decode, and Save Image. Six nodes that form the complete text-to-image pipeline.",
    visuals: ["wheel +500", "safeMove node headings", "wheel +400"],
  },

  // 6 — INTERACT: scroll to visual diagrams and hover images
  {
    kind: "segment",
    narration:
      "The tutorial is full of visual diagrams showing the node connections. " +
      "These annotated screenshots make it easy to follow along — even if you've never seen a node editor before.",
    visuals: ["wheel +400", "hover diagram images"],
  },

  // 7 — INTERACT: hover AI chat assistant
  {
    kind: "segment",
    narration:
      "At the bottom corner, there's an AI chat assistant. " +
      "If I have a question about any concept on this page, I can ask it right here without leaving the docs.",
    visuals: ["safeMove chat textarea", "safeMove h1"],
  },

  // 8 — OBSERVE: scroll to top for final summary
  {
    kind: "segment",
    narration:
      "This single tutorial takes a complete beginner from zero to their first generated image. " +
      "Clear steps, annotated screenshots, and an AI assistant to help along the way — that is well-written documentation.",
    visuals: ["scroll to top", "safeMove h1", "safeMove TOC"],
  },

  // ── Outro ──
  {
    kind: "outro",
    text: "ComfyUI Docs",
    subtitle: "docs.comfy.org",
    durationMs: 2000,
  },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
//  PLAYWRIGHT IMPLEMENTATION
// ─────────────────────────────────────────────────────────────────────────────
import { test, safeMove } from "./fixtures/fixture";
import { createVideoScript } from "../lib/demowright/dist/index.mjs";

test("comfy docs tutorial deep dive", async ({ page }) => {
  test.setTimeout(15 * 60_000);

  // Block ALL scripts — Mintlify's JS causes page.evaluate to hang,
  // same pattern as comfy-website.spec.ts (Nuxt SSR site).
  // Static HTML is enough for a scroll-through demo.
  await page.route("**/*", (route) => {
    const type = route.request().resourceType();
    const url = route.request().url();
    if (
      type === "script" ||
      /google-analytics|googletagmanager|sentry|posthog|hotjar|intercom|crisp|plausible|segment|mixpanel/i.test(url)
    ) {
      return route.abort();
    }
    return route.continue();
  });

  // Pre-navigate to the tutorial sub-page
  await page.goto(
    "https://docs.comfy.org/tutorials/basic/text-to-image",
    { waitUntil: "domcontentloaded" },
  );
  await page.waitForTimeout(3000);

  const script = createVideoScript()
    .title(VIDEO_SCRIPT[0].text, {
      subtitle: VIDEO_SCRIPT[0].subtitle,
      durationMs: VIDEO_SCRIPT[0].durationMs,
    })

    // 1 — OBSERVE: tutorial heading + page structure
    .segment(VIDEO_SCRIPT[1].narration, async (pace) => {
      await safeMove(page, "h1");
      await pace();
      await safeMove(page, "aside nav, aside");
      await pace();
      await page.mouse.move(150, 300);
      await pace();
    })

    // 2 — INTERACT: hover TOC links, then click Preparation
    .segment(VIDEO_SCRIPT[2].narration, async (pace) => {
      await safeMove(page, 'aside a[href*="#preparation"], [class*="toc"] a[href*="#preparation"], [class*="outline"] a[href*="#preparation"]');
      await pace();
      // Click the Preparation TOC link
      const tocLink = page.locator('aside a[href*="#preparation"], [class*="toc"] a[href*="#preparation"], [class*="outline"] a[href*="#preparation"]').first();
      const box = await tocLink.boundingBox().catch(() => null);
      if (box) {
        await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
      }
      await page.waitForTimeout(600);
      await safeMove(page, 'h2:has-text("Preparation"), h3:has-text("Preparation")');
      await pace();
    })

    // 3 — OBSERVE: read Preparation section + scroll through screenshots
    .segment(VIDEO_SCRIPT[3].narration, async (pace) => {
      await safeMove(page, 'h2:has-text("Preparation"), h3:has-text("Preparation")');
      await pace();
      await page.mouse.wheel(0, 500);
      await pace();
      await safeMove(page, 'img[alt*="load"], img[alt*="workflow"], article img, main img');
      await pace();
    })

    // 4 — INTERACT: click TOC link → Working Principles section
    .segment(VIDEO_SCRIPT[4].narration, async (pace) => {
      // Click the Working Principles TOC link
      const wpLink = page.locator('aside a[href*="#working"], [class*="toc"] a[href*="#working"], [class*="outline"] a[href*="#working"]').first();
      const wpBox = await wpLink.boundingBox().catch(() => null);
      if (wpBox) {
        await page.mouse.click(wpBox.x + wpBox.width / 2, wpBox.y + wpBox.height / 2);
      }
      await page.waitForTimeout(600);
      await safeMove(page, 'h2:has-text("Working Principles"), h2:has-text("Working"), h2:has-text("working")');
      await pace();
      await page.mouse.wheel(0, 200);
      await pace();
    })

    // 5 — OBSERVE: scroll through node explanations
    .segment(VIDEO_SCRIPT[5].narration, async (pace) => {
      await page.mouse.wheel(0, 500);
      await pace();
      await safeMove(page, 'h3:has-text("Checkpoint"), h3:has-text("checkpoint"), h4:has-text("Checkpoint")');
      await pace();
      await page.mouse.wheel(0, 400);
      await pace();
      await safeMove(page, 'h3:has-text("KSampler"), h3:has-text("Sampler"), h4:has-text("KSampler")');
      await pace();
    })

    // 6 — INTERACT: scroll to visual diagrams and hover images
    .segment(VIDEO_SCRIPT[6].narration, async (pace) => {
      await page.mouse.wheel(0, 400);
      await pace();
      await safeMove(page, 'img[alt*="node"], img[alt*="workflow"], img[alt*="graph"], article img, main img');
      await pace();
      await page.mouse.wheel(0, 300);
      await pace();
    })

    // 7 — INTERACT: hover AI chat assistant
    .segment(VIDEO_SCRIPT[7].narration, async (pace) => {
      await safeMove(page, 'textarea[placeholder*="Ask"], input[placeholder*="Ask"], [class*="chat"] textarea, [class*="ask"] input');
      await pace();
      await page.mouse.wheel(0, -2000);
      await page.waitForTimeout(300);
      await safeMove(page, "h1");
      await pace();
    })

    // 8 — OBSERVE: scroll to top for final summary
    .segment(VIDEO_SCRIPT[8].narration, async (pace) => {
      await page.mouse.wheel(0, -5000);
      await page.waitForTimeout(300);
      await safeMove(page, "h1");
      await pace();
      await safeMove(page, 'aside a[href*="#preparation"], [class*="toc"] a, [class*="outline"] a');
      await pace();
      await safeMove(page, "aside nav, aside");
      await pace();
    })

    .outro({
      text: VIDEO_SCRIPT[9].text,
      subtitle: VIDEO_SCRIPT[9].subtitle,
      durationMs: VIDEO_SCRIPT[9].durationMs,
    });

  await script.prepare(page);
  await script.render(page, {
    baseName: "comfy-docs-tutorial",
    outputDir: ".comfy-qa/.demos",
  });
});
