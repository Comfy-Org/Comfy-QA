/**
 * ComfyUI Embedded Workflow Editor — comfyui-embedded-workflow-editor.vercel.app
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
 *    4. Each segment ~6–10 seconds at 140 wpm ⇒ 14–24 words is the sweet spot.
 *    5. Target: 50+ segments for a comprehensive 5-minute walkthrough.
 */
const VIDEO_SCRIPT = [
  // ── 0: Title ──
  {
    kind: "title",
    text: "ComfyUI Embedded Workflow Editor",
    subtitle: "Edit workflow metadata right in your browser",
    durationMs: 2000,
  },

  // ── 1–6: Landing & what this tool does ──
  {
    kind: "segment",
    narration:
      "Welcome to the ComfyUI Embedded Workflow Editor — a browser-based tool for viewing and editing workflow metadata inside your images.",
    visuals: ["safeMove h2"],
  },
  {
    kind: "segment",
    narration:
      "Here's the problem it solves. When ComfyUI generates an image, it embeds the entire workflow graph into the file's metadata.",
    visuals: ["safeMove main"],
  },
  {
    kind: "segment",
    narration:
      "That metadata includes every node, every connection, every prompt, seed, and sampler setting used to create the image.",
    visuals: ["mouse.move 600 250"],
  },
  {
    kind: "segment",
    narration:
      "But editing that metadata normally requires Python scripts, command-line tools, or specialized EXIF editors. This tool changes that.",
    visuals: ["mouse.move 500 280"],
  },
  {
    kind: "segment",
    narration:
      "With this editor, you load a ComfyUI image, modify its workflow metadata, and save it back — all without leaving your browser.",
    visuals: ["mouse.move 600 300"],
  },
  {
    kind: "segment",
    narration:
      "Let me walk you through the four different ways to load an image into this editor. Each one serves a different use case.",
    visuals: ["mouse.move 500 320"],
  },

  // ── 7–13: Way 1 — Paste/Drop ──
  {
    kind: "segment",
    narration:
      "The first method is drag and drop. You'll see a drop zone area on the page where you can paste or drop files directly.",
    visuals: ["safeMove [class*='drop'], [class*='paste'], textarea, input[type='file']"],
  },
  {
    kind: "segment",
    narration:
      "This is the fastest way to get started. Just grab an image from your file manager and drop it right onto this area.",
    visuals: ["mouse.move 500 250"],
  },
  {
    kind: "segment",
    narration:
      "You can also paste an image from your clipboard. Copy a ComfyUI image, come here, and press Control-V. That's it.",
    visuals: ["mouse.move 400 260"],
  },
  {
    kind: "segment",
    narration:
      "The drop zone supports PNG and WebP image files — the two most common formats ComfyUI uses for output.",
    visuals: ["mouse.move 600 260"],
  },
  {
    kind: "segment",
    narration:
      "But it doesn't stop at images. This tool also handles FLAC and MP4 files — because ComfyUI can embed workflows in audio and video too.",
    visuals: ["mouse.move 500 270"],
  },
  {
    kind: "segment",
    narration:
      "That's a detail most people miss. If you're using ComfyUI for audio or video generation, your workflow metadata is still in there.",
    visuals: ["mouse.move 400 280"],
  },
  {
    kind: "segment",
    narration:
      "Drag and drop is perfect for quick one-off edits when you have a single file you want to inspect or modify.",
    visuals: ["mouse.move 500 250"],
  },

  // ── 14–18: Way 2 — Upload Files button ──
  {
    kind: "segment",
    narration:
      "The second method is the Upload Files button. Let me hover over it so you can see it clearly.",
    visuals: ["safeMove button:has-text('Upload'), button:has-text('upload')"],
  },
  {
    kind: "segment",
    narration:
      "Clicking this button opens your operating system's file picker dialog. Select one or more files and they load instantly.",
    visuals: ["mouse.move 500 300"],
  },
  {
    kind: "segment",
    narration:
      "This method is ideal when your files are buried deep in a folder structure and dragging them would be awkward.",
    visuals: ["mouse.move 400 310"],
  },
  {
    kind: "segment",
    narration:
      "You can select multiple files at once in the file picker. The editor will process all of them in sequence.",
    visuals: ["mouse.move 600 310"],
  },
  {
    kind: "segment",
    narration:
      "For batch workflows — say you generated fifty images and want to tweak the seed in all of them — multi-select is a lifesaver.",
    visuals: ["mouse.move 500 320"],
  },

  // ── 19–23: Way 3 — Mount Folder ──
  {
    kind: "segment",
    narration:
      "The third method is Mount Folder. This is the power-user option. Let me hover over the button.",
    visuals: ["safeMove button:has-text('Mount'), button:has-text('mount'), button:has-text('Folder')"],
  },
  {
    kind: "segment",
    narration:
      "Mount Folder uses the browser's File System Access API to give the editor read and write access to an entire local directory.",
    visuals: ["mouse.move 500 340"],
  },
  {
    kind: "segment",
    narration:
      "That means you can browse, edit, and save files in place — no download step required. The editor writes directly to your disk.",
    visuals: ["mouse.move 400 350"],
  },
  {
    kind: "segment",
    narration:
      "This is incredible for batch processing. Mount your ComfyUI output folder and edit workflows across hundreds of images without leaving the browser.",
    visuals: ["mouse.move 600 350"],
  },
  {
    kind: "segment",
    narration:
      "Note that Mount Folder requires a Chromium-based browser — Chrome or Edge. Firefox and Safari don't support the File System Access API yet.",
    visuals: ["mouse.move 500 360"],
  },

  // ── 24–29: Way 4 — Paste URL ──
  {
    kind: "segment",
    narration:
      "The fourth and final method is Paste URL. There's an input field where you can paste a link to a remote image.",
    visuals: ["safeMove input[type='text'], input[type='url'], input[placeholder*='URL'], input[placeholder*='url'], input[placeholder*='http']"],
  },
  {
    kind: "segment",
    narration:
      "This is perfect for images hosted on the web — maybe someone shared a ComfyUI output on a forum or image hosting site.",
    visuals: ["mouse.move 500 370"],
  },
  {
    kind: "segment",
    narration:
      "Just paste the URL, click Load, and the editor fetches the image and parses its metadata right here in the browser.",
    visuals: ["safeMove button:has-text('Load'), button:has-text('load')"],
  },
  {
    kind: "segment",
    narration:
      "The image is fetched client-side, so the remote server sees a normal browser request — no proxy, no intermediary.",
    visuals: ["mouse.move 600 380"],
  },
  {
    kind: "segment",
    narration:
      "Paste URL is great for collaborative workflows — someone sends you a link and you can inspect their workflow without downloading the file first.",
    visuals: ["mouse.move 500 370"],
  },
  {
    kind: "segment",
    narration:
      "So those are the four input methods: drag and drop, file upload, folder mount, and URL paste. Each one optimized for a different scenario.",
    visuals: ["mouse.move 500 300"],
  },

  // ── 30–34: EXIF & metadata parsing ──
  {
    kind: "segment",
    narration:
      "Now let's talk about what happens under the hood when you load an image. The editor parses the file's metadata chunks.",
    visuals: ["mouse.move 500 280"],
  },
  {
    kind: "segment",
    narration:
      "For PNG files, ComfyUI stores workflow data in a custom text chunk inside the PNG specification. It's a well-defined extension point.",
    visuals: ["mouse.move 400 290"],
  },
  {
    kind: "segment",
    narration:
      "For WebP files, the metadata lives in EXIF data — specifically in custom EXIF fields that ComfyUI writes during image generation.",
    visuals: ["mouse.move 600 290"],
  },
  {
    kind: "segment",
    narration:
      "For audio and video files like FLAC and MP4, ComfyUI uses format-specific metadata containers — Vorbis comments and MP4 atoms.",
    visuals: ["mouse.move 500 300"],
  },
  {
    kind: "segment",
    narration:
      "The key point is that all of this parsing happens entirely in your browser. Your files never leave your machine.",
    visuals: ["mouse.move 500 280"],
  },

  // ── 35–39: Workflow JSON structure ──
  {
    kind: "segment",
    narration:
      "Once the metadata is extracted, the editor presents the workflow as structured JSON — the same format ComfyUI uses internally.",
    visuals: ["mouse.move 500 300"],
  },
  {
    kind: "segment",
    narration:
      "A ComfyUI workflow JSON contains nodes — each one representing a step in the generation pipeline. Loaders, samplers, encoders, decoders.",
    visuals: ["mouse.move 400 310"],
  },
  {
    kind: "segment",
    narration:
      "It also contains connections — the links between nodes that define the data flow. Which model feeds into which sampler, and so on.",
    visuals: ["mouse.move 600 310"],
  },
  {
    kind: "segment",
    narration:
      "And every node has parameters — the prompt text, the seed number, the sampler name, the CFG scale. All the settings that shaped the output.",
    visuals: ["mouse.move 500 320"],
  },
  {
    kind: "segment",
    narration:
      "Being able to see and edit this JSON directly means you have full control over the workflow without opening ComfyUI itself.",
    visuals: ["mouse.move 500 300"],
  },

  // ── 40–43: Editing & re-embedding ──
  {
    kind: "segment",
    narration:
      "The editing experience is straightforward. Change any value in the workflow — a prompt, a seed, a model name — and the editor tracks your modifications.",
    visuals: ["mouse.move 500 310"],
  },
  {
    kind: "segment",
    narration:
      "Here's what makes this tool special: the re-embedding is lossless. When you save, the editor writes the updated JSON back into the metadata without re-encoding the image.",
    visuals: ["mouse.move 400 300"],
  },
  {
    kind: "segment",
    narration:
      "That means no quality loss. Your pixels stay exactly the same — only the metadata changes. The image bytes are untouched.",
    visuals: ["mouse.move 600 300"],
  },
  {
    kind: "segment",
    narration:
      "The same lossless re-embedding works for audio and video files too. Edit the workflow, save, and the media quality is preserved perfectly.",
    visuals: ["mouse.move 500 310"],
  },

  // ── 44–46: Export process ──
  {
    kind: "segment",
    narration:
      "When you're done editing, you export the file. The editor packages the modified metadata back into the original file format.",
    visuals: ["mouse.move 500 300"],
  },
  {
    kind: "segment",
    narration:
      "The exported file downloads to your browser's default download folder — or, if you used Mount Folder, it writes directly back to disk.",
    visuals: ["mouse.move 600 300"],
  },
  {
    kind: "segment",
    narration:
      "You can then load that exported file into ComfyUI and it will reconstruct the entire workflow graph automatically from the embedded metadata.",
    visuals: ["mouse.move 500 290"],
  },

  // ── 47–49: Privacy & security ──
  {
    kind: "segment",
    narration:
      "Let's talk about privacy and security. This is a big deal because workflow metadata can contain sensitive information — API keys, model paths, prompts.",
    visuals: ["mouse.move 500 280"],
  },
  {
    kind: "segment",
    narration:
      "Everything in this editor runs one hundred percent client-side in your browser. No server, no upload, no cloud processing. Your data stays on your machine.",
    visuals: ["mouse.move 400 270"],
  },
  {
    kind: "segment",
    narration:
      "You can verify this yourself by disconnecting from the internet after the page loads. The editor continues to work perfectly offline.",
    visuals: ["mouse.move 600 270"],
  },

  // ── 50–52: Use cases & scenarios ──
  {
    kind: "segment",
    narration:
      "Let me describe some real-world scenarios where this tool shines. First — batch seed editing. You generated fifty images but want to change the seed in all of them.",
    visuals: ["mouse.move 500 300"],
  },
  {
    kind: "segment",
    narration:
      "Second — workflow sharing. You want to share an image on social media with the workflow embedded, but you need to remove your local model paths first.",
    visuals: ["mouse.move 400 310"],
  },
  {
    kind: "segment",
    narration:
      "Third — workflow archiving. You're building a library of your best workflows, embedded inside the images themselves for easy retrieval.",
    visuals: ["mouse.move 600 310"],
  },

  // ── 53–54: GitHub & ecosystem ──
  {
    kind: "segment",
    narration:
      "Notice the Fork me on GitHub ribbon. This project is completely open source — you can contribute features, report bugs, or fork it for your own use.",
    visuals: ["safeMove a[href*='github']"],
  },
  {
    kind: "segment",
    narration:
      "The Embedded Workflow Editor is part of the broader ComfyUI ecosystem. It complements ComfyUI itself, the Registry, and the Manager.",
    visuals: ["mouse.move 500 300"],
  },

  // ── 55: Final summary ──
  {
    kind: "segment",
    narration:
      "And that's the ComfyUI Embedded Workflow Editor — four ways to load, full metadata parsing, lossless editing, and total privacy. All in your browser.",
    visuals: ["safeMove h2"],
  },

  // ── 56: Outro ──
  {
    kind: "outro",
    text: "ComfyUI Embedded Workflow Editor",
    subtitle: "comfyui-embedded-workflow-editor.vercel.app",
    durationMs: 2000,
  },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
//  PLAYWRIGHT IMPLEMENTATION (consumes VIDEO_SCRIPT above)
// ─────────────────────────────────────────────────────────────────────────────
import { test, safeMove } from "./fixtures/fixture";
import { createVideoScript } from "../lib/demowright/dist/index.mjs";

test("embedded workflow editor tour", async ({ page }) => {
  test.setTimeout(10 * 60_000);

  // Pre-navigate (heavy work BEFORE script.render — see hard rules in skill)
  await page.goto("https://comfyui-embedded-workflow-editor.vercel.app", {
    waitUntil: "domcontentloaded",
  });
  await page.waitForTimeout(2000);

  const script = createVideoScript()
    // ── Title ──
    .title(VIDEO_SCRIPT[0].text, {
      subtitle: VIDEO_SCRIPT[0].subtitle,
      durationMs: VIDEO_SCRIPT[0].durationMs,
    })

    // ── 1–6: Landing & what this tool does ──
    .segment(VIDEO_SCRIPT[1].narration, async (pace) => {
      await safeMove(page, "h2");
      await pace();
    })
    .segment(VIDEO_SCRIPT[2].narration, async (pace) => {
      await safeMove(page, "main, body");
      await pace();
    })
    .segment(VIDEO_SCRIPT[3].narration, async (pace) => {
      await page.mouse.move(600, 250);
      await pace();
    })
    .segment(VIDEO_SCRIPT[4].narration, async (pace) => {
      await page.mouse.move(500, 280);
      await pace();
    })
    .segment(VIDEO_SCRIPT[5].narration, async (pace) => {
      await page.mouse.move(600, 300);
      await pace();
    })
    .segment(VIDEO_SCRIPT[6].narration, async (pace) => {
      await page.mouse.move(500, 320);
      await pace();
    })

    // ── 7–13: Way 1 — Paste/Drop ──
    .segment(VIDEO_SCRIPT[7].narration, async (pace) => {
      await safeMove(page, "[class*='drop'], [class*='paste'], [class*='Drop'], textarea");
      await pace();
    })
    .segment(VIDEO_SCRIPT[8].narration, async (pace) => {
      await page.mouse.move(500, 250);
      await pace();
    })
    .segment(VIDEO_SCRIPT[9].narration, async (pace) => {
      await page.mouse.move(400, 260);
      await pace();
    })
    .segment(VIDEO_SCRIPT[10].narration, async (pace) => {
      await page.mouse.move(600, 260);
      await pace();
    })
    .segment(VIDEO_SCRIPT[11].narration, async (pace) => {
      await page.mouse.move(500, 270);
      await pace();
    })
    .segment(VIDEO_SCRIPT[12].narration, async (pace) => {
      await page.mouse.move(400, 280);
      await pace();
    })
    .segment(VIDEO_SCRIPT[13].narration, async (pace) => {
      await page.mouse.move(500, 250);
      await pace();
    })

    // ── 14–18: Way 2 — Upload Files button ──
    .segment(VIDEO_SCRIPT[14].narration, async (pace) => {
      await safeMove(page, "button:has-text('Upload'), button:has-text('upload')");
      await pace();
    })
    .segment(VIDEO_SCRIPT[15].narration, async (pace) => {
      await page.mouse.move(500, 300);
      await pace();
    })
    .segment(VIDEO_SCRIPT[16].narration, async (pace) => {
      await page.mouse.move(400, 310);
      await pace();
    })
    .segment(VIDEO_SCRIPT[17].narration, async (pace) => {
      await page.mouse.move(600, 310);
      await pace();
    })
    .segment(VIDEO_SCRIPT[18].narration, async (pace) => {
      await page.mouse.move(500, 320);
      await pace();
    })

    // ── 19–23: Way 3 — Mount Folder ──
    .segment(VIDEO_SCRIPT[19].narration, async (pace) => {
      await safeMove(page, "button:has-text('Mount'), button:has-text('mount'), button:has-text('Folder')");
      await pace();
    })
    .segment(VIDEO_SCRIPT[20].narration, async (pace) => {
      await page.mouse.move(500, 340);
      await pace();
    })
    .segment(VIDEO_SCRIPT[21].narration, async (pace) => {
      await page.mouse.move(400, 350);
      await pace();
    })
    .segment(VIDEO_SCRIPT[22].narration, async (pace) => {
      await page.mouse.move(600, 350);
      await pace();
    })
    .segment(VIDEO_SCRIPT[23].narration, async (pace) => {
      await page.mouse.move(500, 360);
      await pace();
    })

    // ── 24–29: Way 4 — Paste URL ──
    .segment(VIDEO_SCRIPT[24].narration, async (pace) => {
      await safeMove(page, "input[type='text'], input[type='url'], input[placeholder*='URL'], input[placeholder*='url'], input[placeholder*='http']");
      await pace();
    })
    .segment(VIDEO_SCRIPT[25].narration, async (pace) => {
      await page.mouse.move(500, 370);
      await pace();
    })
    .segment(VIDEO_SCRIPT[26].narration, async (pace) => {
      await safeMove(page, "button:has-text('Load'), button:has-text('load')");
      await pace();
    })
    .segment(VIDEO_SCRIPT[27].narration, async (pace) => {
      await page.mouse.move(600, 380);
      await pace();
    })
    .segment(VIDEO_SCRIPT[28].narration, async (pace) => {
      await page.mouse.move(500, 370);
      await pace();
    })
    .segment(VIDEO_SCRIPT[29].narration, async (pace) => {
      await page.mouse.move(500, 300);
      await pace();
    })

    // ── 30–34: EXIF & metadata parsing ──
    .segment(VIDEO_SCRIPT[30].narration, async (pace) => {
      await page.mouse.move(500, 280);
      await pace();
    })
    .segment(VIDEO_SCRIPT[31].narration, async (pace) => {
      await page.mouse.move(400, 290);
      await pace();
    })
    .segment(VIDEO_SCRIPT[32].narration, async (pace) => {
      await page.mouse.move(600, 290);
      await pace();
    })
    .segment(VIDEO_SCRIPT[33].narration, async (pace) => {
      await page.mouse.move(500, 300);
      await pace();
    })
    .segment(VIDEO_SCRIPT[34].narration, async (pace) => {
      await page.mouse.move(500, 280);
      await pace();
    })

    // ── 35–39: Workflow JSON structure ──
    .segment(VIDEO_SCRIPT[35].narration, async (pace) => {
      await page.mouse.move(500, 300);
      await pace();
    })
    .segment(VIDEO_SCRIPT[36].narration, async (pace) => {
      await page.mouse.move(400, 310);
      await pace();
    })
    .segment(VIDEO_SCRIPT[37].narration, async (pace) => {
      await page.mouse.move(600, 310);
      await pace();
    })
    .segment(VIDEO_SCRIPT[38].narration, async (pace) => {
      await page.mouse.move(500, 320);
      await pace();
    })
    .segment(VIDEO_SCRIPT[39].narration, async (pace) => {
      await page.mouse.move(500, 300);
      await pace();
    })

    // ── 40–43: Editing & re-embedding ──
    .segment(VIDEO_SCRIPT[40].narration, async (pace) => {
      await page.mouse.move(500, 310);
      await pace();
    })
    .segment(VIDEO_SCRIPT[41].narration, async (pace) => {
      await page.mouse.move(400, 300);
      await pace();
    })
    .segment(VIDEO_SCRIPT[42].narration, async (pace) => {
      await page.mouse.move(600, 300);
      await pace();
    })
    .segment(VIDEO_SCRIPT[43].narration, async (pace) => {
      await page.mouse.move(500, 310);
      await pace();
    })

    // ── 44–46: Export process ──
    .segment(VIDEO_SCRIPT[44].narration, async (pace) => {
      await page.mouse.move(500, 300);
      await pace();
    })
    .segment(VIDEO_SCRIPT[45].narration, async (pace) => {
      await page.mouse.move(600, 300);
      await pace();
    })
    .segment(VIDEO_SCRIPT[46].narration, async (pace) => {
      await page.mouse.move(500, 290);
      await pace();
    })

    // ── 47–49: Privacy & security ──
    .segment(VIDEO_SCRIPT[47].narration, async (pace) => {
      await page.mouse.move(500, 280);
      await pace();
    })
    .segment(VIDEO_SCRIPT[48].narration, async (pace) => {
      await page.mouse.move(400, 270);
      await pace();
    })
    .segment(VIDEO_SCRIPT[49].narration, async (pace) => {
      await page.mouse.move(600, 270);
      await pace();
    })

    // ── 50–52: Use cases & scenarios ──
    .segment(VIDEO_SCRIPT[50].narration, async (pace) => {
      await page.mouse.move(500, 300);
      await pace();
    })
    .segment(VIDEO_SCRIPT[51].narration, async (pace) => {
      await page.mouse.move(400, 310);
      await pace();
    })
    .segment(VIDEO_SCRIPT[52].narration, async (pace) => {
      await page.mouse.move(600, 310);
      await pace();
    })

    // ── 53–54: GitHub & ecosystem ──
    .segment(VIDEO_SCRIPT[53].narration, async (pace) => {
      await safeMove(page, "a[href*='github']");
      await pace();
    })
    .segment(VIDEO_SCRIPT[54].narration, async (pace) => {
      await page.mouse.move(500, 300);
      await pace();
    })

    // ── 55: Final summary ──
    .segment(VIDEO_SCRIPT[55].narration, async (pace) => {
      await safeMove(page, "h2");
      await pace();
    })

    // ── Outro ──
    .outro({
      text: VIDEO_SCRIPT[56].text,
      subtitle: VIDEO_SCRIPT[56].subtitle,
      durationMs: VIDEO_SCRIPT[56].durationMs,
    });

  await script.prepare(page);
  await script.render(page, {
    baseName: "embedded-workflow-editor",
    outputDir: ".comfy-qa/.demos",
  });
});
