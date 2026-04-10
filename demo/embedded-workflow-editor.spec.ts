/**
 * Embedded Workflow Editor — comfyui-embedded-workflow-editor.vercel.app
 *
 * Story:  demo/stories/embedded-workflow-editor.story.md
 * Output: .comfy-qa/.demos/embedded-workflow-editor.mp4
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
 *    4. Each segment ~6–10 seconds at 140 wpm => 14–24 words is the sweet spot.
 *    5. Total: ~25 segments across 7 chapters, video ~7 min.
 *
 *  Structure:
 *    Intro                          — title card + 2 segments
 *    Ch 1: The Drop Zone            — title card + 3 segments
 *    Ch 2: Workflow Overview         — title card + 4 segments
 *    Ch 3: Reading the Prompt        — title card + 3 segments
 *    Ch 4: Editing Metadata          — title card + 4 segments
 *    Ch 5: Export and Verification   — title card + 3 segments
 *    Ch 6: Privacy and Use Cases     — title card + 3 segments
 *    Outro                           — 1 segment + conclusion card
 */

const VS = [
  // ── Intro (0–2) ──
  /* 0  */ { kind: "title", text: "Embedded Workflow Editor", subtitle: "Inspect and edit ComfyUI metadata inside any image", narration: "Welcome to the embedded workflow editor — the browser tool that lets you see and change every setting baked into a ComfyUI image.", durationMs: 3000 },
  /* 1  */ { kind: "segment", narration: "Every ComfyUI-generated image carries its full workflow inside the file metadata — prompts, models, sampler settings, everything. But reading or editing that metadata usually means Python scripts or command-line tools." },
  /* 2  */ { kind: "segment", narration: "This browser-based tool lets you drop any ComfyUI image, inspect every parameter, edit what you want, and export — all locally, no uploads, no code. Let me show you the full workflow." },

  // ── Chapter 1: The Drop Zone (3–6) ──
  /* 3  */ { kind: "title", text: "The Drop Zone", subtitle: "Load any ComfyUI-generated PNG or WebP", durationMs: 2000 },
  /* 4  */ { kind: "segment", narration: "Here's the landing page. The interface is clean — a prominent drop zone in the center, ready for drag-and-drop or a file picker. It supports both PNG and WebP formats." },
  /* 5  */ { kind: "segment", narration: "I'll load a sample WebP file. This image was generated with Stable Diffusion XL — a quartz crystal scene rendered with specific prompts, seeds, and sampler settings all embedded in the EXIF data." },
  /* 6  */ { kind: "segment", narration: "Watch how quickly the parser works. Within a second, it reads the EXIF metadata, extracts the full workflow JSON, and renders the entire node graph right here in the browser." },

  // ── Chapter 2: Workflow Overview (7–11) ──
  /* 7  */ { kind: "title", text: "Workflow Overview", subtitle: "Every node, every parameter, at a glance", durationMs: 2000 },
  /* 8  */ { kind: "segment", narration: "Now I can see the full workflow structure. Every node that was used to create this image is listed — each one with its ID, type, and all parameters exposed for inspection." },
  /* 9  */ { kind: "segment", narration: "Here's the checkpoint loader node. It points to the SDXL base model — that's the foundation model this image was generated with. The model path is stored right in the metadata." },
  /* 10 */ { kind: "segment", narration: "Next, the CLIP text encoder nodes. There are two — one for the positive prompt and one for the negative prompt. These are the text instructions that guided the image generation." },
  /* 11 */ { kind: "segment", narration: "And here's the KSampler node — the heart of the generation process. Seed value, 50 steps, Euler sampler, CFG scale 8. Every parameter needed to reproduce this exact image." },

  // ── Chapter 3: Reading the Prompt (12–15) ──
  /* 12 */ { kind: "title", text: "Reading the Prompt", subtitle: "Understand exactly what created this image", durationMs: 2000 },
  /* 13 */ { kind: "segment", narration: "Let me find the positive prompt. There it is — 'a clear and sparkling quartz crystal on a cherrywood table.' This is the main creative instruction that shaped the entire image." },
  /* 14 */ { kind: "segment", narration: "The negative prompt reads 'text, watermark.' Short but effective — it tells the model what to avoid. Negative prompts are just as important as positive ones for quality results." },
  /* 15 */ { kind: "segment", narration: "Together, these parameters form a complete recipe. Anyone with ComfyUI could load this workflow and reproduce the exact same image — same model, same seed, same settings." },

  // ── Chapter 4: Editing Metadata (16–20) ──
  /* 16 */ { kind: "title", text: "Editing Metadata", subtitle: "Change prompts, seeds, and settings in place", durationMs: 2000 },
  /* 17 */ { kind: "segment", narration: "Now for the powerful part — editing. I'll click into the positive prompt field. These fields are fully editable, so I can change any parameter directly in the browser." },
  /* 18 */ { kind: "segment", narration: "I'll clear the original prompt and type something new — 'amethyst geode on a marble shelf.' When this image is loaded back into ComfyUI, it'll open with this new prompt ready to generate." },
  /* 19 */ { kind: "segment", narration: "Let me also change the seed value. The seed controls randomness — a different seed means a different variation of the same prompt. I'll pick a new number to get a fresh result." },
  /* 20 */ { kind: "segment", narration: "Finally, I'll change the sampler steps from 50 down to 30. Fewer steps means faster generation with slightly less refinement — a useful tradeoff when you're iterating quickly." },

  // ── Chapter 5: Export and Verification (21–24) ──
  /* 21 */ { kind: "title", text: "Export and Verification", subtitle: "Save your changes, keep your pixels", durationMs: 2000 },
  /* 22 */ { kind: "segment", narration: "With all my edits in place, I'll click the export button. The tool writes the updated metadata back into the image file and triggers a download." },
  /* 23 */ { kind: "segment", narration: "Here's what makes this special — the export is completely lossless. Only the metadata changes. The actual image pixels remain identical, bit for bit. No recompression, no quality loss." },
  /* 24 */ { kind: "segment", narration: "The downloaded file is ready for ComfyUI. Load the image, and the workflow opens with all my new settings — the updated prompt, the new seed, the adjusted steps. No manual reconfiguration needed." },

  // ── Chapter 6: Privacy and Use Cases (25–28) ──
  /* 25 */ { kind: "title", text: "Privacy and Use Cases", subtitle: "Everything stays in your browser", durationMs: 2000 },
  /* 26 */ { kind: "segment", narration: "An important detail — no server uploads. The entire tool runs in browser JavaScript. Your images never leave your machine, and there's no backend processing. Complete privacy by design." },
  /* 27 */ { kind: "segment", narration: "Use case one: tweak a prompt without regenerating from scratch. You've got a great image but want to try a different subject — edit the metadata, load it into ComfyUI, and generate the variation." },
  /* 28 */ { kind: "segment", narration: "Use case two: share images with different metadata baked in. Maybe you want to share an image but swap the prompt before posting — the original creative intent stays private." },

  // ── Outro (29–30) ──
  /* 29 */ { kind: "segment", narration: "That's the embedded workflow editor from start to finish. Drop an image, inspect the full workflow, edit any parameter, and export — all in your browser, all in under a minute." },
  /* 30 */ { kind: "outro", text: "Embedded Workflow Editor", subtitle: "Inspect, edit, export — no code required", narration: "The embedded workflow editor gives you full metadata inspection, in-place editing of prompts, seeds, and sampler settings, lossless export, and complete browser-local privacy — no Python, no uploads, just your browser.", durationMs: 3000 },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
//  PLAYWRIGHT IMPLEMENTATION (consumes VIDEO_SCRIPT above)
// ─────────────────────────────────────────────────────────────────────────────
import { test, safeMove } from "./fixtures/fixture";
import { createVideoScript } from "../lib/demowright/dist/index.mjs";
import { typeKeys } from "../lib/demowright/dist/helpers.mjs";
import * as path from "node:path";

/** Path to a real ComfyUI-generated WebP with embedded workflow EXIF metadata */
const SAMPLE_IMAGE = path.resolve(
  process.cwd(),
  ".comfy-qa/ws/ComfyUI_frontend-main/browser_tests/assets/workflowInMedia/workflow.webp",
);

test("embedded workflow editor tour", async ({ page }) => {
  test.setTimeout(10 * 60_000);

  // Pre-navigate BEFORE script.render (hard rule: no goto inside segments)
  await page.goto("https://comfyui-embedded-workflow-editor.vercel.app", {
    waitUntil: "domcontentloaded",
  });
  await page.waitForTimeout(2000);

  // ── Helper: drop the sample image onto the page ──
  const dropFile = async () => {
    const fileInput = page.locator('input[type="file"]').first();
    if (await fileInput.count()) {
      await fileInput.setInputFiles(SAMPLE_IMAGE);
    } else {
      // Some apps create the input lazily on drag events — click the drop area first
      const dropZone = page
        .locator('[class*="drop"], [class*="upload"], [class*="Drop"], [class*="Upload"], main')
        .first();
      await dropZone.click().catch(() => {});
      await page.waitForTimeout(500);
      const input = page.locator('input[type="file"]').first();
      if (await input.count()) {
        await input.setInputFiles(SAMPLE_IMAGE);
      }
    }
    await page.waitForTimeout(3000); // Wait for EXIF parsing and rendering
  };

  // ── Helper: focus a prompt text field for editing ──
  const focusPromptField = async () => {
    const textarea = page.locator("textarea").first();
    if (await textarea.isVisible().catch(() => false)) {
      await textarea.click().catch(() => {});
      return;
    }
    const editable = page
      .locator('[contenteditable="true"], input[type="text"]')
      .first();
    if (await editable.isVisible().catch(() => false)) {
      await editable.click().catch(() => {});
    }
  };

  // ── Helper: find and focus a specific input by nearby text ──
  const focusFieldNear = async (labelPattern: string) => {
    const label = page.locator(`text=/${labelPattern}/i`).first();
    if (await label.isVisible().catch(() => false)) {
      // Try to find an input/textarea near this label
      const box = await label.boundingBox().catch(() => null);
      if (box) {
        await page.mouse.move(box.x + box.width + 20, box.y + box.height / 2);
        await page.mouse.click(box.x + box.width + 20, box.y + box.height / 2);
      }
    }
  };

  const script = createVideoScript()

    // ═══════════════════════════════════════════════════════════════════════
    //  INTRO
    // ═══════════════════════════════════════════════════════════════════════

    .title(VS[0].text, {
      subtitle: VS[0].subtitle,
      narration: VS[0].narration,
      durationMs: VS[0].durationMs,
    })

    // Segment 1 — metadata lives inside every ComfyUI image
    .segment(VS[1].narration, async (pace) => {
      await safeMove(page, "h1");
      await pace();
      await safeMove(page, "main");
      await pace();
      await page.mouse.wheel(0, 100);
      await pace();
    })

    // Segment 2 — what this tool does
    .segment(VS[2].narration, async (pace) => {
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" })).catch(() => {});
      await pace();
      await safeMove(page, '[class*="drop"], [class*="upload"], [class*="Drop"], [class*="Upload"], main');
      await pace();
      await page.mouse.wheel(0, 80);
      await pace();
    })

    // ═══════════════════════════════════════════════════════════════════════
    //  CHAPTER 1: The Drop Zone
    // ═══════════════════════════════════════════════════════════════════════

    .title(VS[3].text, {
      subtitle: VS[3].subtitle,
      durationMs: VS[3].durationMs,
    })

    // Segment 4 — page layout, drop zone UI
    .segment(VS[4].narration, async (pace) => {
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" })).catch(() => {});
      await pace();
      await safeMove(page, "h1");
      await pace();
      await safeMove(page, '[class*="drop"], [class*="upload"], [class*="Drop"], [class*="Upload"], main');
      await pace();
    });

  // Between chapter segments: drop the file
  await dropFile();

  script
    // Segment 5 — drop the sample WebP file
    .segment(VS[5].narration, async (pace) => {
      // File is already loaded — show the result
      await page.mouse.wheel(0, 150);
      await pace();
      await safeMove(page, "textarea, pre, code, [class*='editor'], [class*='json'], [class*='workflow'], [class*='node']");
      await pace();
    })

    // Segment 6 — EXIF parser extracts workflow JSON
    .segment(VS[6].narration, async (pace) => {
      await page.mouse.wheel(0, 200);
      await pace();
      await safeMove(page, "textarea, pre, code, [class*='tree'], [class*='node'], [class*='workflow']");
      await pace();
      await page.mouse.wheel(0, 150);
      await pace();
    })

    // ═══════════════════════════════════════════════════════════════════════
    //  CHAPTER 2: Workflow Overview
    // ═══════════════════════════════════════════════════════════════════════

    .title(VS[7].text, {
      subtitle: VS[7].subtitle,
      durationMs: VS[7].durationMs,
    })

    // Segment 8 — full workflow structure, all nodes listed
    .segment(VS[8].narration, async (pace) => {
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" })).catch(() => {});
      await page.waitForTimeout(300);
      await page.mouse.wheel(0, 250);
      await pace();
      await safeMove(page, "textarea, pre, code, [class*='editor'], [class*='json'], [class*='workflow']");
      await pace();
      await page.mouse.wheel(0, 200);
      await pace();
    })

    // Segment 9 — checkpoint loader node, SDXL base model
    .segment(VS[9].narration, async (pace) => {
      // Look for checkpoint-related text
      const ckptText = page.locator('text=/[Cc]heckpoint|ckpt|CheckpointLoader/').first();
      if (await ckptText.isVisible().catch(() => false)) {
        const box = await ckptText.boundingBox().catch(() => null);
        if (box) await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      } else {
        await page.mouse.wheel(0, 200);
      }
      await pace();
      await page.mouse.wheel(0, 100);
      await pace();
    })

    // Segment 10 — CLIP text encoder nodes
    .segment(VS[10].narration, async (pace) => {
      // Look for CLIP-related text
      const clipText = page.locator('text=/CLIP|CLIPText|text_encoder|positive|negative/').first();
      if (await clipText.isVisible().catch(() => false)) {
        const box = await clipText.boundingBox().catch(() => null);
        if (box) await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      } else {
        await page.mouse.wheel(0, 200);
      }
      await pace();
      await page.mouse.wheel(0, 150);
      await pace();
    })

    // Segment 11 — KSampler node: seed, steps, sampler, CFG
    .segment(VS[11].narration, async (pace) => {
      // Look for KSampler-related text
      const ksamplerText = page.locator('text=/KSampler|sampler|steps|seed/').first();
      if (await ksamplerText.isVisible().catch(() => false)) {
        const box = await ksamplerText.boundingBox().catch(() => null);
        if (box) await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      } else {
        await page.mouse.wheel(0, 200);
      }
      await pace();
      await page.mouse.wheel(0, 100);
      await pace();
    })

    // ═══════════════════════════════════════════════════════════════════════
    //  CHAPTER 3: Reading the Prompt
    // ═══════════════════════════════════════════════════════════════════════

    .title(VS[12].text, {
      subtitle: VS[12].subtitle,
      durationMs: VS[12].durationMs,
    })

    // Segment 13 — find the positive prompt
    .segment(VS[13].narration, async (pace) => {
      // Try to scroll to the prompt text
      const promptText = page.locator('text=/quartz crystal|cherrywood/').first();
      if (await promptText.isVisible().catch(() => false)) {
        const box = await promptText.boundingBox().catch(() => null);
        if (box) await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      } else {
        // Scroll to find it
        await page.mouse.wheel(0, 300);
        await page.waitForTimeout(300);
        const retryPrompt = page.locator('text=/quartz crystal|cherrywood/').first();
        if (await retryPrompt.isVisible().catch(() => false)) {
          const box = await retryPrompt.boundingBox().catch(() => null);
          if (box) await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        }
      }
      await pace();
      // Hover over the prompt field itself
      await safeMove(page, "textarea, [class*='prompt'], [class*='text']");
      await pace();
    })

    // Segment 14 — find the negative prompt
    .segment(VS[14].narration, async (pace) => {
      const negText = page.locator('text=/watermark|negative/i').first();
      if (await negText.isVisible().catch(() => false)) {
        const box = await negText.boundingBox().catch(() => null);
        if (box) await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      } else {
        await page.mouse.wheel(0, 200);
      }
      await pace();
      await page.mouse.wheel(0, 100);
      await pace();
    })

    // Segment 15 — understanding parameters for reproduction
    .segment(VS[15].narration, async (pace) => {
      // Scroll back to show the full workflow context
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" })).catch(() => {});
      await page.waitForTimeout(300);
      await pace();
      await page.mouse.wheel(0, 300);
      await pace();
      await safeMove(page, "textarea, pre, code, [class*='editor'], [class*='json'], [class*='workflow']");
      await pace();
    })

    // ═══════════════════════════════════════════════════════════════════════
    //  CHAPTER 4: Editing Metadata
    // ═══════════════════════════════════════════════════════════════════════

    .title(VS[16].text, {
      subtitle: VS[16].subtitle,
      durationMs: VS[16].durationMs,
    });

  // Focus the prompt field between chapter title and first edit segment
  await focusPromptField();

  script
    // Segment 17 — click into the prompt text field
    .segment(VS[17].narration, async (pace) => {
      // Locate and click the prompt textarea/input
      const textarea = page.locator("textarea").first();
      if (await textarea.isVisible().catch(() => false)) {
        await textarea.click().catch(() => {});
        const box = await textarea.boundingBox().catch(() => null);
        if (box) await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      } else {
        const input = page.locator('input[type="text"], [contenteditable="true"]').first();
        if (await input.isVisible().catch(() => false)) {
          await input.click().catch(() => {});
        }
      }
      await pace();
    })

    // Segment 18 — clear and type new prompt
    .segment(VS[18].narration, async (pace) => {
      // Select all text in the focused field
      await page.keyboard.press("Control+a").catch(() =>
        page.keyboard.press("Meta+a").catch(() => {}),
      );
      await page.waitForTimeout(200);
      await typeKeys(page, "amethyst geode on a marble shelf", 55);
      await pace();
      await page.mouse.wheel(0, 50);
      await pace();
    })

    // Segment 19 — edit the seed value
    .segment(VS[19].narration, async (pace) => {
      // Try to find and click the seed field
      const seedLabel = page.locator('text=/seed/i').first();
      if (await seedLabel.isVisible().catch(() => false)) {
        const box = await seedLabel.boundingBox().catch(() => null);
        if (box) {
          await page.mouse.move(box.x + box.width + 30, box.y + box.height / 2);
          await page.waitForTimeout(200);
          await page.mouse.click(box.x + box.width + 30, box.y + box.height / 2);
        }
      } else {
        await focusFieldNear("seed");
      }
      await page.waitForTimeout(200);
      // Select all and type new seed
      await page.keyboard.press("Control+a").catch(() =>
        page.keyboard.press("Meta+a").catch(() => {}),
      );
      await page.waitForTimeout(100);
      await typeKeys(page, "42", 80);
      await pace();
    })

    // Segment 20 — edit sampler steps
    .segment(VS[20].narration, async (pace) => {
      // Try to find and click the steps field
      const stepsLabel = page.locator('text=/steps/i').first();
      if (await stepsLabel.isVisible().catch(() => false)) {
        const box = await stepsLabel.boundingBox().catch(() => null);
        if (box) {
          await page.mouse.move(box.x + box.width + 30, box.y + box.height / 2);
          await page.waitForTimeout(200);
          await page.mouse.click(box.x + box.width + 30, box.y + box.height / 2);
        }
      } else {
        await focusFieldNear("steps");
      }
      await page.waitForTimeout(200);
      // Select all and type new steps value
      await page.keyboard.press("Control+a").catch(() =>
        page.keyboard.press("Meta+a").catch(() => {}),
      );
      await page.waitForTimeout(100);
      await typeKeys(page, "30", 80);
      await pace();
      await page.mouse.wheel(0, 100);
      await pace();
    })

    // ═══════════════════════════════════════════════════════════════════════
    //  CHAPTER 5: Export and Verification
    // ═══════════════════════════════════════════════════════════════════════

    .title(VS[21].text, {
      subtitle: VS[21].subtitle,
      durationMs: VS[21].durationMs,
    })

    // Segment 22 — click export/download button
    .segment(VS[22].narration, async (pace) => {
      // Scroll up to find export controls
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" })).catch(() => {});
      await page.waitForTimeout(300);
      await page.mouse.wheel(0, 200);
      // Look for the export/download/save button
      const exportBtn = page
        .locator(
          'button:has-text("export"), button:has-text("Export"), ' +
          'button:has-text("download"), button:has-text("Download"), ' +
          'button:has-text("save"), button:has-text("Save"), ' +
          'a:has-text("export"), a:has-text("download"), a:has-text("Export"), a:has-text("Download")',
        )
        .first();
      if (await exportBtn.isVisible().catch(() => false)) {
        await safeMove(page, 'button:has-text("export"), button:has-text("Export"), button:has-text("download"), button:has-text("Download"), button:has-text("save"), button:has-text("Save")');
        await pace();
        await exportBtn.click().catch(() => {});
      } else {
        // Scroll to find it
        await page.mouse.wheel(0, 300);
        await pace();
        const retryBtn = page
          .locator(
            'button:has-text("export"), button:has-text("Export"), ' +
            'button:has-text("download"), button:has-text("Download"), ' +
            'button:has-text("save"), button:has-text("Save")',
          )
          .first();
        if (await retryBtn.isVisible().catch(() => false)) {
          const box = await retryBtn.boundingBox().catch(() => null);
          if (box) await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
          await pace();
          await retryBtn.click().catch(() => {});
        }
      }
      await pace();
    })

    // Segment 23 — lossless explanation
    .segment(VS[23].narration, async (pace) => {
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" })).catch(() => {});
      await pace();
      await page.mouse.wheel(0, 150);
      await pace();
      // Hover around the image/preview area to emphasize pixels unchanged
      await safeMove(page, "img, canvas, [class*='preview'], [class*='image']");
      await pace();
    })

    // Segment 24 — file ready for ComfyUI
    .segment(VS[24].narration, async (pace) => {
      await page.mouse.wheel(0, 200);
      await pace();
      await safeMove(page, "textarea, pre, code, [class*='editor'], [class*='json'], [class*='workflow']");
      await pace();
      await page.mouse.wheel(0, 100);
      await pace();
    })

    // ═══════════════════════════════════════════════════════════════════════
    //  CHAPTER 6: Privacy and Use Cases
    // ═══════════════════════════════════════════════════════════════════════

    .title(VS[25].text, {
      subtitle: VS[25].subtitle,
      durationMs: VS[25].durationMs,
    })

    // Segment 26 — no server uploads, browser-only
    .segment(VS[26].narration, async (pace) => {
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" })).catch(() => {});
      await pace();
      await safeMove(page, "h1");
      await pace();
      // Hover around the page to emphasize local-only nature
      await safeMove(page, "main");
      await pace();
    })

    // Segment 27 — use case: tweak prompt without regenerating
    .segment(VS[27].narration, async (pace) => {
      await page.mouse.wheel(0, 200);
      await pace();
      await safeMove(page, "textarea, [class*='prompt'], [class*='text']");
      await pace();
      await page.mouse.wheel(0, 100);
      await pace();
    })

    // Segment 28 — use case: share images with different metadata
    .segment(VS[28].narration, async (pace) => {
      await page.mouse.wheel(0, 200);
      await pace();
      // Hover export area one more time
      const exportBtn = page
        .locator(
          'button:has-text("export"), button:has-text("Export"), ' +
          'button:has-text("download"), button:has-text("Download"), ' +
          'button:has-text("save"), button:has-text("Save")',
        )
        .first();
      if (await exportBtn.isVisible().catch(() => false)) {
        const box = await exportBtn.boundingBox().catch(() => null);
        if (box) await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      }
      await pace();
    })

    // ═══════════════════════════════════════════════════════════════════════
    //  OUTRO
    // ═══════════════════════════════════════════════════════════════════════

    // Segment 29 — summary
    .segment(VS[29].narration, async (pace) => {
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" })).catch(() => {});
      await page.waitForTimeout(300);
      await pace();
      await safeMove(page, "h1");
      await pace();
      await page.mouse.wheel(0, 200);
      await pace();
      await safeMove(page, '[class*="drop"], [class*="upload"], [class*="Drop"], [class*="Upload"], main');
      await pace();
    })

    // Conclusion card
    .outro({
      text: VS[30].text,
      subtitle: VS[30].subtitle,
      narration: VS[30].narration,
      durationMs: VS[30].durationMs,
    });

  await script.prepare(page);
  await script.render(page, {
    baseName: "embedded-workflow-editor",
    outputDir: ".comfy-qa/.demos",
  });
});
