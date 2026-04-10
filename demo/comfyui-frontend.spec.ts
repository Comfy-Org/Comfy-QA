/**
 * ComfyUI Frontend — cloud.comfy.org editor UI deep dive
 *
 * Story:  demo/stories/comfyui-frontend.story.md
 * Output: .comfy-qa/.demos/comfyui-frontend.mp4
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
    text: "ComfyUI Frontend",
    subtitle: "Editor UI Deep Dive",
    durationMs: 2000,
  },

  // ── 1–4: Canvas overview ──
  {
    kind: "segment",
    narration:
      "Welcome to the ComfyUI frontend — the visual graph editor where you build AI image generation workflows node by node.",
  },
  {
    kind: "segment",
    narration:
      "The canvas is your workspace — an infinite, zoomable surface where every node lives. Think of it as a digital whiteboard for AI pipelines.",
  },
  {
    kind: "segment",
    narration:
      "A default workflow is pre-loaded so you're never staring at a blank canvas. These connected nodes form a complete image generation pipeline.",
  },
  {
    kind: "segment",
    narration:
      "Notice the dotted grid in the background — it provides spatial reference as you pan and zoom, helping you stay oriented.",
  },

  // ── 5–10: Node anatomy ──
  {
    kind: "segment",
    narration:
      "Let me zoom in on a node to show you its anatomy. Each node is a rectangular card with a colored title bar at the top.",
  },
  {
    kind: "segment",
    narration:
      "The title bar tells you the node type — like KSampler, Load Checkpoint, or CLIP Text Encode. Color coding groups them by category.",
  },
  {
    kind: "segment",
    narration:
      "On the left side of each node, you'll see input slots — small colored dots. These accept incoming data connections.",
  },
  {
    kind: "segment",
    narration:
      "On the right side are output slots — they send data downstream to other nodes. Each slot is labeled with its data type.",
  },
  {
    kind: "segment",
    narration:
      "The body of the node contains widgets — sliders, dropdowns, and text fields that control the node's parameters.",
  },
  {
    kind: "segment",
    narration:
      "Some nodes can be collapsed to save space, showing only their title bar and connection dots — perfect for keeping large workflows tidy.",
  },

  // ── 11–14: Wire/connection system ──
  {
    kind: "segment",
    narration:
      "Now let's look at the wires. Colored lines flow between nodes, connecting outputs to inputs — this is how data moves through your workflow.",
  },
  {
    kind: "segment",
    narration:
      "Wire colors aren't random — different data types use different colors. Models, latents, images, and conditioning each have distinct hues.",
  },
  {
    kind: "segment",
    narration:
      "The wires curve smoothly between nodes, making it easy to trace data flow even in complex workflows with many connections.",
  },
  {
    kind: "segment",
    narration:
      "The system prevents invalid connections — you can only wire compatible types together. This catches mistakes before they cause errors.",
  },

  // ── 15–21: Zoom and pan ──
  {
    kind: "segment",
    narration:
      "Navigation is essential when workflows grow. Let me zoom in with the scroll wheel to show you the fine detail of each node.",
  },
  {
    kind: "segment",
    narration:
      "At this zoom level, you can read every parameter label, every widget value, and every slot name clearly.",
  },
  {
    kind: "segment",
    narration:
      "Now let me zoom out — way out — to see the entire workflow topology. From here you can see how all the pieces connect.",
  },
  {
    kind: "segment",
    narration:
      "At extreme zoom out, the workflow becomes a miniature map. You can see the overall architecture at a glance.",
  },
  {
    kind: "segment",
    narration:
      "Let me zoom back to a comfortable level. Now I'll pan across the canvas by moving the mouse to explore different regions.",
  },
  {
    kind: "segment",
    narration:
      "Panning reveals nodes that were off-screen. Large workflows can span thousands of pixels in every direction.",
  },
  {
    kind: "segment",
    narration:
      "Let me pan vertically too — nodes can be arranged across both axes, so you'll often scroll up and down as well.",
  },

  // ── 22–25: Node groups and organization ──
  {
    kind: "segment",
    narration:
      "Organized workflows use node groups — colored rectangles that visually cluster related nodes together with a label.",
  },
  {
    kind: "segment",
    narration:
      "Groups can be color-coded to distinguish pipeline stages — for example, blue for loading, green for processing, orange for output.",
  },
  {
    kind: "segment",
    narration:
      "Inside a group, nodes snap to alignment. This keeps your layout clean and professional, even with dozens of nodes.",
  },
  {
    kind: "segment",
    narration:
      "Good spacing between nodes is key to readability. The grid system helps you maintain consistent gaps throughout your workflow.",
  },

  // ── 26–29: Visual hierarchy and state ──
  {
    kind: "segment",
    narration:
      "Color coding isn't just decorative — it creates visual hierarchy. Loader nodes, processing nodes, and output nodes each use distinct color schemes.",
  },
  {
    kind: "segment",
    narration:
      "When you select a node, it gets a highlighted border — making it easy to see which node is currently active for editing.",
  },
  {
    kind: "segment",
    narration:
      "Hovering over a node subtly highlights it, signaling that it's interactive and ready for your click or configuration.",
  },
  {
    kind: "segment",
    narration:
      "Disconnected or bypassed nodes appear dimmer than active ones — this visual feedback helps you spot broken connections instantly.",
  },

  // ── 30–35: Input widgets ──
  {
    kind: "segment",
    narration:
      "Let me explore the widget types you'll find inside nodes. Sliders control numeric parameters — drag to set values like denoise strength.",
  },
  {
    kind: "segment",
    narration:
      "Dropdown menus let you select from predefined options — sampler names, scheduler types, and model variants all use dropdowns.",
  },
  {
    kind: "segment",
    narration:
      "Text input areas are where you write prompts. The positive and negative prompt nodes have multi-line text fields for your descriptions.",
  },
  {
    kind: "segment",
    narration:
      "Numeric fields handle precise values — width, height, seed, and step count. You can type exact numbers or use arrow keys to adjust.",
  },
  {
    kind: "segment",
    narration:
      "Toggle widgets appear as checkboxes for boolean options — enable or disable features with a single click.",
  },
  {
    kind: "segment",
    narration:
      "Some nodes even display image thumbnails inline — preview nodes show their last output right on the canvas.",
  },

  // ── 36–38: Output and preview ──
  {
    kind: "segment",
    narration:
      "Output nodes are special — they display generated images directly on the canvas, so you see results without opening a separate viewer.",
  },
  {
    kind: "segment",
    narration:
      "Preview images can be resized by dragging the node edges — make them larger for inspection or smaller to save canvas space.",
  },
  {
    kind: "segment",
    narration:
      "Nodes with multiple outputs show each one on a separate slot — letting you route different data streams to different destinations.",
  },

  // ── 39–42: Toolbar and status ──
  {
    kind: "segment",
    narration:
      "The top toolbar anchors the editor experience. It provides workflow management, run controls, and quick access to settings.",
  },
  {
    kind: "segment",
    narration:
      "Status indicators in the UI show connection health, GPU availability, and whether the backend is ready to process your queue.",
  },
  {
    kind: "segment",
    narration:
      "During execution, a progress indicator advances — you can see which step the sampler is on and estimate time remaining.",
  },
  {
    kind: "segment",
    narration:
      "The Queue Prompt button kicks off generation, and View Queue lets you check pending jobs — helpful when you've queued multiple generations.",
  },

  // ── 43–46: Menus and dialogs ──
  {
    kind: "segment",
    narration:
      "Right-clicking the canvas opens a context menu with options to add nodes, paste, and manage your workflow structure.",
  },
  {
    kind: "segment",
    narration:
      "The node search dialog is the fastest way to add nodes — just start typing and matching node types appear instantly.",
  },
  {
    kind: "segment",
    narration:
      "Search results are organized by category — sampling, conditioning, latent, image — so you can browse even if you don't know the exact name.",
  },
  {
    kind: "segment",
    narration:
      "Multiple workflows can be open simultaneously as tabs — switch between projects without losing your place in any of them.",
  },

  // ── 47–50: Layout and theme ──
  {
    kind: "segment",
    narration:
      "The side panels are responsive — they resize and collapse to give you maximum canvas space when you need it.",
  },
  {
    kind: "segment",
    narration:
      "The dark theme is the default — it reduces eye strain during long creative sessions and makes node colors pop against the background.",
  },
  {
    kind: "segment",
    narration:
      "The interface balances information density with readability — enough detail to be powerful, but not so much that it overwhelms.",
  },
  {
    kind: "segment",
    narration:
      "Consistent iconography and typography throughout the UI make the editor feel cohesive and professional.",
  },

  // ── 51–53: Indicators and feedback ──
  {
    kind: "segment",
    narration:
      "Nodes with configuration errors show warning badges or red highlights — the editor catches problems before you hit Run.",
  },
  {
    kind: "segment",
    narration:
      "During execution, nodes flash as they process in sequence — you can watch data flow through your pipeline in real time.",
  },
  {
    kind: "segment",
    narration:
      "And that's the ComfyUI frontend — a powerful, visual-first editor designed for building complex AI workflows with precision and clarity.",
  },

  // ── 54: Outro ──
  {
    kind: "outro",
    text: "ComfyUI Frontend",
    subtitle: "cloud.comfy.org",
    durationMs: 2000,
  },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
//  PLAYWRIGHT IMPLEMENTATION (consumes VIDEO_SCRIPT above)
// ─────────────────────────────────────────────────────────────────────────────
import { test, safeMove } from "./fixtures/fixture";
import { createVideoScript } from "../lib/demowright/dist/index.mjs";

const CLOUD_URL = "https://cloud.comfy.org";
const email = process.env.CLOUD_USERNAME ?? "";
const password = process.env.CLOUD_PASSWORD ?? "";

test("comfyui frontend tour", async ({ page }) => {
  test.setTimeout(10 * 60_000);

  // ── Login (heavy work — done outside script.render) ──
  await page.goto(`${CLOUD_URL}/login`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(3000);

  const emailBtn = page.getByRole("button", { name: /use email instead/i });
  if (await emailBtn.isVisible().catch(() => false)) {
    await emailBtn.click();
    await page.waitForTimeout(1500);
  }

  if (!email || !password) {
    throw new Error("CLOUD_USERNAME / CLOUD_PASSWORD missing in .env.local");
  }
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill(password);
  await page.getByRole("button", { name: /^sign in$/i }).click();

  // Wait for editor canvas to load
  await page.waitForSelector("canvas", { timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(8000);

  // ── Build the narrated script ──
  const script = createVideoScript()
    // ── Title ──
    .title(VIDEO_SCRIPT[0].text, {
      subtitle: VIDEO_SCRIPT[0].subtitle,
      durationMs: VIDEO_SCRIPT[0].durationMs,
    })

    // ── 1–4: Canvas overview ──
    .segment(VIDEO_SCRIPT[1].narration, async (pace) => {
      await safeMove(page, "canvas");
      await pace();
    })
    .segment(VIDEO_SCRIPT[2].narration, async (pace) => {
      await page.mouse.move(640, 360);
      await pace();
      await page.mouse.move(500, 300);
      await pace();
    })
    .segment(VIDEO_SCRIPT[3].narration, async (pace) => {
      await page.mouse.move(400, 350);
      await pace();
      await page.mouse.move(700, 400);
      await pace();
    })
    .segment(VIDEO_SCRIPT[4].narration, async (pace) => {
      await page.mouse.move(300, 500);
      await pace();
      await page.mouse.move(800, 250);
      await pace();
    })

    // ── 5–10: Node anatomy ──
    .segment(VIDEO_SCRIPT[5].narration, async (pace) => {
      await page.mouse.wheel(0, -300);
      await pace();
      await page.mouse.move(500, 350);
      await pace();
    })
    .segment(VIDEO_SCRIPT[6].narration, async (pace) => {
      await page.mouse.move(500, 310);
      await pace();
      await page.mouse.move(600, 310);
      await pace();
    })
    .segment(VIDEO_SCRIPT[7].narration, async (pace) => {
      await page.mouse.move(440, 370);
      await pace();
      await page.mouse.move(440, 400);
      await pace();
    })
    .segment(VIDEO_SCRIPT[8].narration, async (pace) => {
      await page.mouse.move(620, 370);
      await pace();
      await page.mouse.move(620, 400);
      await pace();
    })
    .segment(VIDEO_SCRIPT[9].narration, async (pace) => {
      await page.mouse.move(530, 380);
      await pace();
      await page.mouse.move(530, 420);
      await pace();
    })
    .segment(VIDEO_SCRIPT[10].narration, async (pace) => {
      await page.mouse.move(550, 340);
      await pace();
      await page.mouse.move(650, 340);
      await pace();
    })

    // ── 11–14: Wire/connection system ──
    .segment(VIDEO_SCRIPT[11].narration, async (pace) => {
      await page.mouse.move(500, 380);
      await pace();
      await page.mouse.move(650, 350);
      await pace();
    })
    .segment(VIDEO_SCRIPT[12].narration, async (pace) => {
      await page.mouse.move(550, 360);
      await pace();
      await page.mouse.move(700, 380);
      await pace();
    })
    .segment(VIDEO_SCRIPT[13].narration, async (pace) => {
      await page.mouse.move(480, 370);
      await pace();
      await page.mouse.move(620, 390);
      await pace();
    })
    .segment(VIDEO_SCRIPT[14].narration, async (pace) => {
      await page.mouse.move(450, 380);
      await pace();
      await page.mouse.move(600, 370);
      await pace();
    })

    // ── 15–21: Zoom and pan ──
    .segment(VIDEO_SCRIPT[15].narration, async (pace) => {
      await page.mouse.move(640, 360);
      await page.mouse.wheel(0, -400);
      await pace();
    })
    .segment(VIDEO_SCRIPT[16].narration, async (pace) => {
      await page.mouse.move(500, 350);
      await pace();
      await page.mouse.move(600, 380);
      await pace();
    })
    .segment(VIDEO_SCRIPT[17].narration, async (pace) => {
      await page.mouse.move(640, 360);
      await page.mouse.wheel(0, 800);
      await pace();
    })
    .segment(VIDEO_SCRIPT[18].narration, async (pace) => {
      await page.mouse.move(640, 360);
      await pace();
      await page.mouse.wheel(0, 300);
      await pace();
    })
    .segment(VIDEO_SCRIPT[19].narration, async (pace) => {
      await page.mouse.wheel(0, -400);
      await pace();
      await page.mouse.move(400, 360);
      await pace();
    })
    .segment(VIDEO_SCRIPT[20].narration, async (pace) => {
      await page.mouse.move(800, 360);
      await pace();
      await page.mouse.move(900, 360);
      await pace();
    })
    .segment(VIDEO_SCRIPT[21].narration, async (pace) => {
      await page.mouse.move(640, 200);
      await pace();
      await page.mouse.move(640, 500);
      await pace();
    })

    // ── 22–25: Node groups and organization ──
    .segment(VIDEO_SCRIPT[22].narration, async (pace) => {
      await page.mouse.move(350, 300);
      await pace();
      await page.mouse.move(550, 450);
      await pace();
    })
    .segment(VIDEO_SCRIPT[23].narration, async (pace) => {
      await page.mouse.move(400, 350);
      await pace();
      await page.mouse.move(700, 350);
      await pace();
    })
    .segment(VIDEO_SCRIPT[24].narration, async (pace) => {
      await page.mouse.move(500, 370);
      await pace();
      await page.mouse.move(600, 370);
      await pace();
    })
    .segment(VIDEO_SCRIPT[25].narration, async (pace) => {
      await page.mouse.move(450, 380);
      await pace();
      await page.mouse.move(650, 380);
      await pace();
    })

    // ── 26–29: Visual hierarchy and state ──
    .segment(VIDEO_SCRIPT[26].narration, async (pace) => {
      await page.mouse.move(350, 340);
      await pace();
      await page.mouse.move(700, 400);
      await pace();
    })
    .segment(VIDEO_SCRIPT[27].narration, async (pace) => {
      await page.mouse.move(520, 350);
      await pace();
    })
    .segment(VIDEO_SCRIPT[28].narration, async (pace) => {
      await page.mouse.move(520, 360);
      await pace();
      await page.mouse.move(600, 360);
      await pace();
    })
    .segment(VIDEO_SCRIPT[29].narration, async (pace) => {
      await page.mouse.move(800, 450);
      await pace();
      await page.mouse.move(400, 300);
      await pace();
    })

    // ── 30–35: Input widgets ──
    .segment(VIDEO_SCRIPT[30].narration, async (pace) => {
      await page.mouse.move(530, 400);
      await pace();
      await page.mouse.move(580, 400);
      await pace();
    })
    .segment(VIDEO_SCRIPT[31].narration, async (pace) => {
      await page.mouse.move(530, 420);
      await pace();
      await page.mouse.move(560, 420);
      await pace();
    })
    .segment(VIDEO_SCRIPT[32].narration, async (pace) => {
      await page.mouse.move(400, 380);
      await pace();
      await page.mouse.move(400, 420);
      await pace();
    })
    .segment(VIDEO_SCRIPT[33].narration, async (pace) => {
      await page.mouse.move(550, 440);
      await pace();
      await page.mouse.move(600, 440);
      await pace();
    })
    .segment(VIDEO_SCRIPT[34].narration, async (pace) => {
      await page.mouse.move(550, 450);
      await pace();
    })
    .segment(VIDEO_SCRIPT[35].narration, async (pace) => {
      await page.mouse.move(700, 400);
      await pace();
      await page.mouse.move(750, 400);
      await pace();
    })

    // ── 36–38: Output and preview ──
    .segment(VIDEO_SCRIPT[36].narration, async (pace) => {
      await page.mouse.move(800, 350);
      await pace();
      await page.mouse.move(850, 400);
      await pace();
    })
    .segment(VIDEO_SCRIPT[37].narration, async (pace) => {
      await page.mouse.move(830, 380);
      await pace();
      await page.mouse.move(870, 420);
      await pace();
    })
    .segment(VIDEO_SCRIPT[38].narration, async (pace) => {
      await page.mouse.move(620, 370);
      await pace();
      await page.mouse.move(620, 410);
      await pace();
    })

    // ── 39–42: Toolbar and status ──
    .segment(VIDEO_SCRIPT[39].narration, async (pace) => {
      await safeMove(page, "header, [role='banner'], .top-bar");
      await pace();
    })
    .segment(VIDEO_SCRIPT[40].narration, async (pace) => {
      await page.mouse.move(900, 30);
      await pace();
      await page.mouse.move(1000, 30);
      await pace();
    })
    .segment(VIDEO_SCRIPT[41].narration, async (pace) => {
      await page.mouse.move(640, 30);
      await pace();
      await page.mouse.move(700, 30);
      await pace();
    })
    .segment(VIDEO_SCRIPT[42].narration, async (pace) => {
      const queueBtn = page.getByRole("button", { name: /queue prompt|queue|任务队列/i }).first();
      if (await queueBtn.isVisible().catch(() => false)) {
        await queueBtn.hover().catch(() => {});
      }
      await pace();
    })

    // ── 43–46: Menus and dialogs ──
    .segment(VIDEO_SCRIPT[43].narration, async (pace) => {
      await page.mouse.move(640, 360);
      await pace();
    })
    .segment(VIDEO_SCRIPT[44].narration, async (pace) => {
      await page.mouse.move(640, 300);
      await pace();
      await page.mouse.move(640, 350);
      await pace();
    })
    .segment(VIDEO_SCRIPT[45].narration, async (pace) => {
      await page.mouse.move(640, 320);
      await pace();
      await page.mouse.move(640, 380);
      await pace();
    })
    .segment(VIDEO_SCRIPT[46].narration, async (pace) => {
      await safeMove(page, '[role="tablist"], .workflow-tabs, header');
      await pace();
    })

    // ── 47–50: Layout and theme ──
    .segment(VIDEO_SCRIPT[47].narration, async (pace) => {
      await safeMove(page, "nav, aside");
      await pace();
    })
    .segment(VIDEO_SCRIPT[48].narration, async (pace) => {
      await page.mouse.move(640, 360);
      await pace();
      await page.mouse.move(500, 300);
      await pace();
    })
    .segment(VIDEO_SCRIPT[49].narration, async (pace) => {
      await page.mouse.move(400, 350);
      await pace();
      await page.mouse.move(700, 350);
      await pace();
    })
    .segment(VIDEO_SCRIPT[50].narration, async (pace) => {
      await page.mouse.move(300, 30);
      await pace();
      await page.mouse.move(500, 30);
      await pace();
    })

    // ── 51–53: Indicators and feedback ──
    .segment(VIDEO_SCRIPT[51].narration, async (pace) => {
      await page.mouse.move(550, 350);
      await pace();
      await page.mouse.move(650, 380);
      await pace();
    })
    .segment(VIDEO_SCRIPT[52].narration, async (pace) => {
      await page.mouse.move(400, 370);
      await pace();
      await page.mouse.move(600, 370);
      await pace();
      await page.mouse.move(800, 370);
      await pace();
    })
    .segment(VIDEO_SCRIPT[53].narration, async (pace) => {
      await safeMove(page, "canvas");
      await pace();
    })

    // ── Outro ──
    .outro({
      text: VIDEO_SCRIPT[54].text,
      subtitle: VIDEO_SCRIPT[54].subtitle,
      durationMs: VIDEO_SCRIPT[54].durationMs,
    });

  await script.prepare(page);
  await script.render(page, {
    baseName: "comfyui-frontend",
    outputDir: ".comfy-qa/.demos",
  });
});
