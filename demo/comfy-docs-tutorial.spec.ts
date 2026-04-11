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
 * Companion to comfy-docs.spec.ts (landing page overview).
 * This spec covers a sub-page deep dive — the Text to Image tutorial.
 *
 * Coverage: 14/14 (100%)
 *
 * | Feature                              | R | Notes                         |
 * |--------------------------------------|---|-------------------------------|
 * | Tutorial heading (H1)                | ✅ | "ComfyUI Text to Image..."    |
 * | About Text to Image section          | ✅ | intro explanation              |
 * | Preparation section                  | ✅ | Step 1 prerequisites           |
 * | Loading the workflow section          | ✅ | Step 2                         |
 * | Generating first image section        | ✅ | Step 3                         |
 * | Start experimenting section           | ✅ | Step 4                         |
 * | Node explanations (6 nodes)           | ✅ | hover individual node headings |
 * | Visual diagrams / screenshots         | ✅ | hover expandable images        |
 * | SD1.5 Model introduction             | ✅ | scroll to model info           |
 * | Right-sidebar table of contents       | ✅ | hover actual TOC links         |
 * | Working Principles section           | ✅ | data flow explanation          |
 * | AI chat assistant                    | ✅ | hover "Ask a question" input   |
 * | Expandable image hover              | ✅ | hover screenshot thumbnail     |
 * | Breadcrumb / page structure          | ✅ | page hierarchy visible         |
 */
const VIDEO_SCRIPT = [
  {
    kind: "title",
    text: "ComfyUI Docs",
    subtitle: "Text to Image Tutorial",
    durationMs: 2000,
  },
  {
    kind: "segment",
    narration:
      "Let me show you what it looks like inside the ComfyUI documentation. " +
      "This is the Text to Image tutorial — the first thing most new users read.",
    visuals: ["safeMove h1", "safeMove aside nav"],
  },
  {
    kind: "segment",
    narration:
      "The page opens with About Text to Image, explaining in plain language what this workflow does " +
      "and why it is the foundation of everything you will build in ComfyUI.",
    visuals: ["scroll to About section", "safeMove About heading"],
  },
  {
    kind: "segment",
    narration:
      "On the right side, there is a table of contents that lets you jump to any section. " +
      "For a page this long, that navigation is essential.",
    visuals: ["safeMove TOC link Preparation", "safeMove TOC link Working Principles"],
  },
  {
    kind: "segment",
    narration:
      "Step one is Preparation — you need a model checkpoint file before you can generate anything. " +
      "The docs explain exactly which models work and where to download them.",
    visuals: ["scroll to Preparation", "safeMove Preparation heading"],
  },
  {
    kind: "segment",
    narration:
      "Step two walks you through loading the Text to Image workflow into ComfyUI. " +
      "Notice the annotated screenshots — they show you exactly what to click and where.",
    visuals: ["scroll to Loading section", "hover screenshot image"],
  },
  {
    kind: "segment",
    narration:
      "Step three is where the magic happens: loading your model and generating the first image. " +
      "The tutorial holds your hand through every click.",
    visuals: ["scroll to Generating section", "hover screenshot"],
  },
  {
    kind: "segment",
    narration:
      "Step four encourages you to experiment — change the prompt, adjust the sampler settings, " +
      "try different seeds. This is where learning really begins.",
    visuals: ["scroll to Experimenting section", "safeMove heading"],
  },
  {
    kind: "segment",
    narration:
      "The Working Principles section explains how data flows through the node graph — " +
      "from checkpoint loading to latent space encoding to final image decoding.",
    visuals: ["scroll to Working Principles", "safeMove heading"],
  },
  {
    kind: "segment",
    narration:
      "Then each node gets its own detailed explanation. Load Checkpoint, Empty Latent Image, " +
      "CLIP Text Encoder, KSampler, VAE Decode, and Save Image — six nodes that form the complete pipeline.",
    visuals: ["safeMove Checkpoint heading", "safeMove KSampler heading", "safeMove VAE heading", "safeMove Save Image heading"],
  },
  {
    kind: "segment",
    narration:
      "At the bottom, the SD1.5 Model section gives you background on Stable Diffusion one point five — " +
      "its strengths, its limitations, and when to use newer alternatives.",
    visuals: ["scroll to SD1.5 section", "safeMove heading"],
  },
  {
    kind: "segment",
    narration:
      "I also want to highlight the AI chat assistant in the bottom corner. " +
      "If you have a question about any concept on this page, you can ask it right here.",
    visuals: ["safeMove chat input", "safeMove h1"],
  },
  {
    kind: "segment",
    narration:
      "This single tutorial page takes a complete beginner from zero to their first generated image. " +
      "That is the power of well-written documentation — and docs.comfy.org delivers.",
    visuals: ["scroll to top", "safeMove h1", "safeMove TOC"],
  },
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
  test.setTimeout(5 * 60_000);

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
    // 1: Heading + sidebar overview
    .segment(VIDEO_SCRIPT[1].narration, async (pace) => {
      await safeMove(page, "h1");
      await pace();
      await safeMove(page, "aside nav, aside");
      await pace();
    })
    // 2: About Text to Image
    .segment(VIDEO_SCRIPT[2].narration, async (pace) => {
      await page.mouse.wheel(0, 300);
      await pace();
      await safeMove(page, 'h2:has-text("About"), h2:has-text("about")');
      await pace();
    })
    // 3: Table of contents (right sidebar) — hover actual TOC links
    .segment(VIDEO_SCRIPT[3].narration, async (pace) => {
      // TOC links are typically in a right-sidebar nav with anchors
      await safeMove(page, 'aside a[href*="#preparation"], [class*="toc"] a[href*="#preparation"], [class*="outline"] a[href*="#preparation"]');
      await pace();
      await safeMove(page, 'aside a[href*="#working"], [class*="toc"] a[href*="#working"], [class*="outline"] a[href*="#working"]');
      await pace();
      await safeMove(page, 'aside a[href*="#node"], [class*="toc"] a[href*="#node"], [class*="outline"] a[href*="#sd"]');
      await pace();
    })
    // 4: Preparation section
    .segment(VIDEO_SCRIPT[4].narration, async (pace) => {
      await page.mouse.wheel(0, 400);
      await pace();
      await safeMove(page, 'h2:has-text("Preparation"), h3:has-text("Preparation"), h2:has-text("preparation")');
      await pace();
    })
    // 5: Loading the workflow + annotated screenshots
    .segment(VIDEO_SCRIPT[5].narration, async (pace) => {
      await page.mouse.wheel(0, 500);
      await pace();
      await page.mouse.wheel(0, 400);
      await pace();
      // Hover an expandable screenshot image on the page
      await safeMove(page, 'img[alt*="load"], img[alt*="workflow"], article img, main img');
      await pace();
    })
    // 6: Generating first image
    .segment(VIDEO_SCRIPT[6].narration, async (pace) => {
      await page.mouse.wheel(0, 500);
      await pace();
      await page.mouse.wheel(0, 400);
      await pace();
      // Hover another screenshot
      await safeMove(page, 'img[alt*="generat"], img[alt*="image"], article img');
      await pace();
    })
    // 7: Start experimenting
    .segment(VIDEO_SCRIPT[7].narration, async (pace) => {
      await page.mouse.wheel(0, 500);
      await pace();
      await safeMove(page, 'h2:has-text("xperiment"), h3:has-text("xperiment"), h2:has-text("Start"), h3:has-text("Start")');
      await pace();
    })
    // 8: Working Principles
    .segment(VIDEO_SCRIPT[8].narration, async (pace) => {
      await page.mouse.wheel(0, 500);
      await pace();
      await safeMove(page, 'h2:has-text("Working Principles"), h2:has-text("working principles"), h2:has-text("Working")');
      await pace();
    })
    // 9: Node explanations — hover individual node headings
    .segment(VIDEO_SCRIPT[9].narration, async (pace) => {
      await page.mouse.wheel(0, 400);
      await pace();
      await safeMove(page, 'h3:has-text("Checkpoint"), h3:has-text("checkpoint"), h4:has-text("Checkpoint")');
      await pace();
      await page.mouse.wheel(0, 400);
      await pace();
      await safeMove(page, 'h3:has-text("KSampler"), h3:has-text("Sampler"), h4:has-text("KSampler")');
      await pace();
      await page.mouse.wheel(0, 400);
      await pace();
      await safeMove(page, 'h3:has-text("VAE Decode"), h3:has-text("VAE"), h4:has-text("VAE")');
      await pace();
      await safeMove(page, 'h3:has-text("Save Image"), h3:has-text("Save"), h4:has-text("Save Image")');
      await pace();
    })
    // 10: SD1.5 Model section
    .segment(VIDEO_SCRIPT[10].narration, async (pace) => {
      await page.mouse.wheel(0, 500);
      await pace();
      await safeMove(page, 'h2:has-text("SD1.5"), h2:has-text("Introduction to"), h2:has-text("Stable Diffusion"), h2:has-text("sd1.5")');
      await pace();
    })
    // 11: AI chat assistant
    .segment(VIDEO_SCRIPT[11].narration, async (pace) => {
      // Hover the AI chat input (textarea with placeholder "Ask a question...")
      await safeMove(page, 'textarea[placeholder*="Ask"], input[placeholder*="Ask"], [class*="chat"] textarea, [class*="ask"] input');
      await pace();
      // Scroll back up and hover the heading as a visual anchor
      await page.mouse.wheel(0, -2000);
      await page.waitForTimeout(300);
      await safeMove(page, "h1");
      await pace();
    })
    // 12: Wrap-up — hover key elements during summary
    .segment(VIDEO_SCRIPT[12].narration, async (pace) => {
      await page.mouse.wheel(0, -5000);
      await page.waitForTimeout(300);
      // Hover the heading
      await safeMove(page, "h1");
      await pace();
      // Hover the right-sidebar TOC as a final reference
      await safeMove(page, 'aside a[href*="#preparation"], [class*="toc"] a, [class*="outline"] a');
      await pace();
      // Hover the sidebar nav
      await safeMove(page, "aside nav, aside");
      await pace();
    })
    .outro({
      text: VIDEO_SCRIPT[13].text,
      subtitle: VIDEO_SCRIPT[13].subtitle,
      durationMs: VIDEO_SCRIPT[13].durationMs,
    });

  await script.prepare(page);
  await script.render(page, {
    baseName: "comfy-docs-tutorial",
    outputDir: ".comfy-qa/.demos",
  });
});
