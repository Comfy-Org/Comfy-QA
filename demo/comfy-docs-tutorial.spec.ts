import { test, safeMove } from "./fixtures/fixture";
import { createVideoScript } from "../lib/demowright/dist/index.mjs";

/**
 * VIDEO SCRIPT — every word in `narration` is read aloud verbatim by Gemini TTS.
 *
 * Companion to comfy-docs.spec.ts (landing page overview).
 * This spec covers a sub-page deep dive — the Text to Image tutorial.
 *
 * Coverage: 10/12 (83%)
 *
 * | Feature                              | R | Notes                         |
 * |--------------------------------------|---|-------------------------------|
 * | Tutorial heading (H1)                | ✅ | "ComfyUI Text to Image..."    |
 * | About Text to Image section          | ✅ | intro explanation              |
 * | Preparation section                  | ✅ | Step 1 prerequisites           |
 * | Loading the workflow section          | ✅ | Step 2                         |
 * | Generating first image section        | ✅ | Step 3                         |
 * | Start experimenting section           | ✅ | Step 4                         |
 * | Node explanations (6 nodes)           | ✅ | scroll through each node       |
 * | Visual diagrams / screenshots         | ✅ | 14 images on page              |
 * | SD1.5 Model introduction             | ✅ | scroll to model info           |
 * | Right-sidebar table of contents       | ✅ | hover TOC                      |
 * | Breadcrumb navigation                | ❌ | hard to locate reliably        |
 * | Code blocks interaction (copy)       | ❌ | requires click                 |
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
    visuals: ["safeMove h1"],
  },
  {
    kind: "segment",
    narration:
      "The page opens with About Text to Image, explaining in plain language what this workflow does " +
      "and why it is the foundation of everything you will build in ComfyUI.",
    visuals: ["scroll to About section"],
  },
  {
    kind: "segment",
    narration:
      "On the right side, there is a table of contents that lets you jump to any section. " +
      "For a page this long, that navigation is essential.",
    visuals: ["hover TOC sidebar"],
  },
  {
    kind: "segment",
    narration:
      "Step one is Preparation — you need a model checkpoint file before you can generate anything. " +
      "The docs explain exactly which models work and where to download them.",
    visuals: ["scroll to Preparation"],
  },
  {
    kind: "segment",
    narration:
      "Step two walks you through loading the Text to Image workflow into ComfyUI. " +
      "Notice the annotated screenshots — they show you exactly what to click and where.",
    visuals: ["scroll to Loading section", "hover screenshots"],
  },
  {
    kind: "segment",
    narration:
      "Step three is where the magic happens: loading your model and generating the first image. " +
      "The tutorial holds your hand through every click.",
    visuals: ["scroll to Generating section"],
  },
  {
    kind: "segment",
    narration:
      "Step four encourages you to experiment — change the prompt, adjust the sampler settings, " +
      "try different seeds. This is where learning really begins.",
    visuals: ["scroll to Experimenting section"],
  },
  {
    kind: "segment",
    narration:
      "The Working Principles section explains how data flows through the node graph — " +
      "from checkpoint loading to latent space encoding to final image decoding.",
    visuals: ["scroll to Working Principles"],
  },
  {
    kind: "segment",
    narration:
      "Then each node gets its own detailed explanation. Load Checkpoint, Empty Latent Image, " +
      "CLIP Text Encoder, KSampler, VAE Decode, and Save Image — six nodes that form the complete pipeline.",
    visuals: ["scroll through node explanations"],
  },
  {
    kind: "segment",
    narration:
      "At the bottom, the SD1.5 Model section gives you background on Stable Diffusion one point five — " +
      "its strengths, its limitations, and when to use newer alternatives.",
    visuals: ["scroll to SD1.5 section"],
  },
  {
    kind: "segment",
    narration:
      "This single tutorial page takes a complete beginner from zero to their first generated image. " +
      "That is the power of well-written documentation — and docs.comfy.org delivers.",
    visuals: ["scroll to top"],
  },
  {
    kind: "outro",
    text: "ComfyUI Docs",
    subtitle: "docs.comfy.org",
    durationMs: 2000,
  },
] as const;

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
    // Heading
    .segment(VIDEO_SCRIPT[1].narration, async (pace) => {
      await safeMove(page, "h1");
      await pace();
    })
    // About Text to Image
    .segment(VIDEO_SCRIPT[2].narration, async (pace) => {
      await page.mouse.wheel(0, 300);
      await pace();
      await safeMove(page, 'h2:has-text("About")');
      await pace();
    })
    // Table of contents (right sidebar)
    .segment(VIDEO_SCRIPT[3].narration, async (pace) => {
      // TOC is typically on the right side
      await page.mouse.move(1100, 300);
      await pace();
      await page.mouse.move(1100, 400);
      await pace();
    })
    // Preparation
    .segment(VIDEO_SCRIPT[4].narration, async (pace) => {
      await page.mouse.wheel(0, 400);
      await pace();
      await safeMove(page, 'h2:has-text("Preparation"), h3:has-text("Preparation")');
      await pace();
    })
    // Loading the workflow + screenshots
    .segment(VIDEO_SCRIPT[5].narration, async (pace) => {
      await page.mouse.wheel(0, 500);
      await pace();
      await page.mouse.wheel(0, 400);
      await pace();
      // Hover over a screenshot if visible
      await page.mouse.move(640, 400);
      await pace();
    })
    // Generating first image
    .segment(VIDEO_SCRIPT[6].narration, async (pace) => {
      await page.mouse.wheel(0, 500);
      await pace();
      await page.mouse.wheel(0, 400);
      await pace();
    })
    // Start experimenting
    .segment(VIDEO_SCRIPT[7].narration, async (pace) => {
      await page.mouse.wheel(0, 500);
      await pace();
      await safeMove(page, 'h2:has-text("Experimenting"), h3:has-text("Experimenting")');
      await pace();
    })
    // Working Principles
    .segment(VIDEO_SCRIPT[8].narration, async (pace) => {
      await page.mouse.wheel(0, 500);
      await pace();
      await safeMove(page, 'h2:has-text("Working Principles")');
      await pace();
    })
    // Node explanations (scroll through)
    .segment(VIDEO_SCRIPT[9].narration, async (pace) => {
      await page.mouse.wheel(0, 400);
      await pace();
      await page.mouse.wheel(0, 400);
      await pace();
      await page.mouse.wheel(0, 400);
      await pace();
    })
    // SD1.5 Model section
    .segment(VIDEO_SCRIPT[10].narration, async (pace) => {
      await page.mouse.wheel(0, 500);
      await pace();
      await safeMove(page, 'h2:has-text("SD1.5"), h2:has-text("Introduction to")');
      await pace();
    })
    // Wrap-up
    .segment(VIDEO_SCRIPT[11].narration, async (pace) => {
      await page.mouse.wheel(0, -5000);
      await page.waitForTimeout(500);
      await page.mouse.move(640, 360);
      await pace();
    })
    .outro({
      text: VIDEO_SCRIPT[12].text,
      subtitle: VIDEO_SCRIPT[12].subtitle,
      durationMs: VIDEO_SCRIPT[12].durationMs,
    });

  await script.prepare(page);
  await script.render(page, {
    baseName: "comfy-docs-tutorial",
    outputDir: ".comfy-qa/.demos",
  });
});
