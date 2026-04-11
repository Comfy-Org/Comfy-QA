/**
 * Comprehensive demo of https://cloud.comfy.org/ — the hosted ComfyUI editor.
 *
 * Story:  demo/stories/cloud-comfy.story.md
 * Output: .comfy-qa/.demos/cloud-comfy.mp4
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *  VIDEO SCRIPT (the source of truth)
 * ─────────────────────────────────────────────────────────────────────────────
 *  Every word in `narration` is read aloud verbatim by Gemini TTS during
 *  recording. This is a comprehensive >5 minute narrated walkthrough of the
 *  entire ComfyUI Cloud editor.
 *
 *  Rules:
 *    1. First person, present tense, conversational pace.
 *    2. Connect segments with transitional phrases — never bullet-points.
 *    3. Explain WHY, not just WHAT.
 *    4. Each segment ~6–10 seconds at 140 wpm ⇒ 14–24 words is the sweet spot.
 *    5. Total: 53 segments, video ~5+ minutes.
 */
const VIDEO_SCRIPT = [
  // ── Title ──
  {
    kind: "title",
    text: "ComfyUI Cloud",
    subtitle: "Hosted Node Editor Tour",
    durationMs: 2000,
  },

  // ── Chapter 1: Welcome & canvas overview (segments 1–5) ──
  {
    kind: "segment",
    narration:
      "Welcome to ComfyUI Cloud — the hosted node editor for AI image generation. " +
      "No install required, just open your browser and start creating.",
    visuals: ["safeMove canvas"],
  },
  {
    kind: "segment",
    narration:
      "The center of the screen is a graph canvas where you build workflows visually. " +
      "This is the core workspace where everything happens.",
    visuals: ["mouse.move center"],
  },
  {
    kind: "segment",
    narration:
      "I can zoom in with the scroll wheel to get a closer look at individual nodes. " +
      "Watch how the canvas scales smoothly as I scroll.",
    visuals: ["wheel -200", "pause"],
  },
  {
    kind: "segment",
    narration:
      "And zoom back out to see the full workflow at a glance. " +
      "Panning is just as easy — click and drag the background to move around.",
    visuals: ["wheel +200", "pan"],
  },
  {
    kind: "segment",
    narration:
      "Each box on the canvas is a node — model loaders, samplers, VAE decoders, and output nodes. " +
      "They're the building blocks of every workflow.",
    visuals: ["mouse.move nodes"],
  },

  // ── Chapter 2: Node connections & wires (segments 6–8) ──
  {
    kind: "segment",
    narration:
      "Now look at the colored wires connecting these nodes. " +
      "Each wire carries data from one node's output to another node's input.",
    visuals: ["mouse.move wire area"],
  },
  {
    kind: "segment",
    narration:
      "I can trace a connection from the model loader through the sampler to the output. " +
      "This visual flow makes it intuitive to understand how data moves through your pipeline.",
    visuals: ["mouse trace"],
  },
  {
    kind: "segment",
    narration:
      "Different wire colors represent different data types — images, latents, conditioning, and models. " +
      "The color coding helps you spot connection errors at a glance.",
    visuals: ["mouse.move wires"],
  },

  // ── Chapter 3: Canvas interactions (segments 9–12) ──
  {
    kind: "segment",
    narration:
      "Let me show you some canvas interactions. " +
      "I can click and drag any node to reposition it — the wires follow automatically.",
    visuals: ["mouse.move node", "drag"],
  },
  {
    kind: "segment",
    narration:
      "Right-clicking on the canvas opens a context menu with options to add nodes, copy, paste, and more. " +
      "It's the fastest way to build out your graph.",
    visuals: ["hover context area"],
  },
  {
    kind: "segment",
    narration:
      "The undo button in the toolbar steps back through your recent edits. " +
      "Made a mistake? Just undo it and try again.",
    visuals: ["safeMove undo"],
  },
  {
    kind: "segment",
    narration:
      "And of course the standard keyboard shortcuts work here — Ctrl+Z to undo, Ctrl+Y to redo. " +
      "Power users will feel right at home.",
    visuals: ["safeMove toolbar"],
  },

  // ── Chapter 4: Workflow tab management (segments 13–15) ──
  {
    kind: "segment",
    narration:
      "Up at the top, the tab bar shows all your open workflows. " +
      "Switch between projects with a single click — just like browser tabs.",
    visuals: ["safeMove tablist"],
  },
  {
    kind: "segment",
    narration:
      "Click the plus button to create a new blank workflow whenever you need a fresh canvas. " +
      "Your existing workflows stay open in their tabs.",
    visuals: ["hover new workflow"],
  },
  {
    kind: "segment",
    narration:
      "Having multiple workflows open simultaneously is incredibly useful. " +
      "You can reference one workflow while building another, or A/B test different approaches.",
    visuals: ["safeMove tablist"],
  },

  // ── Chapter 5: Sidebar panels (segments 16–26) ──
  {
    kind: "segment",
    narration:
      "On the left side of the screen you'll find the sidebar — five panels that organize everything you need. " +
      "Let me walk through each one.",
    visuals: ["safeMove nav"],
  },
  {
    kind: "segment",
    narration:
      "First up is the Assets panel — this is where your uploaded images, videos, and reference files live. " +
      "Anything you want to use as input goes here.",
    visuals: ["click Assets"],
  },
  {
    kind: "segment",
    narration:
      "Files are organized so you can quickly find the reference images or videos you need. " +
      "No more digging through local folders.",
    visuals: ["pause"],
  },
  {
    kind: "segment",
    narration:
      "Next is the Node Library — browse every available node by category, or search by name. " +
      "It's your catalog of all the building blocks.",
    visuals: ["click Nodes"],
  },
  {
    kind: "segment",
    narration:
      "The search bar inside the Node Library filters nodes instantly. " +
      "Type a name and matching nodes appear — it's the fastest way to find what you need.",
    visuals: ["pause"],
  },
  {
    kind: "segment",
    narration:
      "The Model Library is where you manage your checkpoints, LoRAs, VAEs, and other model files. " +
      "Everything in one place, ready to use.",
    visuals: ["click Models"],
  },
  {
    kind: "segment",
    narration:
      "Each model entry shows its type, file size, and compatibility information. " +
      "So you always pick the right model for your workflow.",
    visuals: ["pause"],
  },
  {
    kind: "segment",
    narration:
      "The Workflows panel lets you save, load, organize, and export your workflow files. " +
      "Think of it as your project manager.",
    visuals: ["click Workflows"],
  },
  {
    kind: "segment",
    narration:
      "Folders and tags keep dozens of workflows manageable. " +
      "As your collection grows, you'll appreciate the organization.",
    visuals: ["pause"],
  },
  {
    kind: "segment",
    narration:
      "At the bottom of the screen, a toolbar gives you quick access to Help, Console, Shortcuts, and Settings. " +
      "These utilities are always one click away while you work.",
    visuals: ["safeMove bottom toolbar"],
  },
  {
    kind: "segment",
    narration:
      "And finally, the Templates panel — pre-built workflow recipes you can clone and customize. " +
      "They're perfect starting points when you don't want to build from scratch.",
    visuals: ["click Templates"],
  },

  // ── Chapter 6: Running a generation (segments 27–30) ──
  {
    kind: "segment",
    narration:
      "Now let's talk about actually running your workflow. " +
      "The Run button at the top queues your workflow for execution on cloud GPUs.",
    visuals: ["hover Run"],
  },
  {
    kind: "segment",
    narration:
      "Next to it, you can set the batch count to generate multiple variations from one queue. " +
      "Want four different images? Set the batch to four and hit Run.",
    visuals: ["safeMove batch"],
  },
  {
    kind: "segment",
    narration:
      "Before running, you can choose which GPU tier to use. " +
      "Faster GPUs cost more credits but finish your generation sooner — it's a speed versus cost trade-off.",
    visuals: ["safeMove GPU selector"],
  },
  {
    kind: "segment",
    narration:
      "Different machine tiers offer different amounts of VRAM and compute power. " +
      "For demanding workflows with large models, you'll want the higher tiers.",
    visuals: ["pause"],
  },

  // ── Chapter 7: Task queue & output (segments 31–34) ──
  {
    kind: "segment",
    narration:
      "Once a job is running, the task queue panel shows its progress in real time. " +
      "You can see active, completed, and failed jobs at a glance.",
    visuals: ["hover queue"],
  },
  {
    kind: "segment",
    narration:
      "Filter by completed or failed to find specific runs in your history. " +
      "It's like a job log that keeps track of everything you've generated.",
    visuals: ["hover filter"],
  },
  {
    kind: "segment",
    narration:
      "Generated images appear in the output area of the canvas. " +
      "You can review results right here without leaving the editor or opening another app.",
    visuals: ["mouse.move output area"],
  },
  {
    kind: "segment",
    narration:
      "The output node on the canvas also displays the generated image inline. " +
      "So you always see your results in the context of the workflow that created them.",
    visuals: ["mouse.move output node"],
  },

  // ── Chapter 8: App Mode & sharing (segments 35–38) ──
  {
    kind: "segment",
    narration:
      "App Mode is one of the coolest features here. " +
      "It lets you preview your workflow as a simple end-user form, completely hiding the graph.",
    visuals: ["hover App Mode"],
  },
  {
    kind: "segment",
    narration:
      "In App Mode, users see only the input fields and a generate button. " +
      "It turns your complex workflow into a clean, focused tool that anyone can use.",
    visuals: ["pause"],
  },
  {
    kind: "segment",
    narration:
      "The Share button generates a public link so others can run your workflow. " +
      "Send it to a colleague, a client, or the whole community.",
    visuals: ["hover Share"],
  },
  {
    kind: "segment",
    narration:
      "Shared workflows make collaboration effortless. " +
      "Your team can iterate on prompts and settings together without setting up their own environments.",
    visuals: ["pause"],
  },

  // ── Chapter 9: Credits, billing & profile (segments 39–42) ──
  {
    kind: "segment",
    narration:
      "Let me show you the account side of things. " +
      "Your remaining credits are visible in the interface so you always know your balance.",
    visuals: ["safeMove credits"],
  },
  {
    kind: "segment",
    narration:
      "The billing area lets you check your usage history and purchase more credits when you're running low. " +
      "No surprises on your next invoice.",
    visuals: ["pause"],
  },
  {
    kind: "segment",
    narration:
      "Your user profile shows account info, display name, and any connected integrations. " +
      "It's straightforward to manage your identity here.",
    visuals: ["safeMove profile"],
  },
  {
    kind: "segment",
    narration:
      "The notification area keeps you posted on system messages, job completions, and platform updates. " +
      "So you never miss when a generation finishes.",
    visuals: ["safeMove notifications"],
  },

  // ── Chapter 10: Settings & help (segments 43–47) ──
  {
    kind: "segment",
    narration:
      "Now let's open the settings. " +
      "The settings dialog has hundreds of options covering keyboard shortcuts, themes, and editor behavior.",
    visuals: ["hover Settings"],
  },
  {
    kind: "segment",
    narration:
      "You can switch between light and dark themes, or fine-tune colors to match your preference. " +
      "A comfortable editor makes long sessions much more enjoyable.",
    visuals: ["pause"],
  },
  {
    kind: "segment",
    narration:
      "The keyboard shortcut reference lists every available shortcut in one place. " +
      "Spend five minutes here and you'll be navigating the editor twice as fast.",
    visuals: ["pause"],
  },
  {
    kind: "segment",
    narration:
      "The help center gives you access to documentation, tutorials, and community links. " +
      "If you ever get stuck, this is where you go first.",
    visuals: ["hover Help"],
  },
  {
    kind: "segment",
    narration:
      "The documentation covers everything from basic workflow creation to advanced multi-model pipelines. " +
      "It's thorough and well-organized.",
    visuals: ["pause"],
  },

  // ── Chapter 11: Wrapping up (segments 48–53) ──
  {
    kind: "segment",
    narration:
      "Let me come back to the canvas for a final overview of everything we've covered today.",
    visuals: ["mouse.move center"],
  },
  {
    kind: "segment",
    narration:
      "We explored the canvas — zooming, panning, and inspecting nodes and their wire connections. " +
      "That's the foundation of every workflow.",
    visuals: ["mouse.move canvas"],
  },
  {
    kind: "segment",
    narration:
      "We toured all five sidebar panels — Assets, Nodes, Models, Workflows, and Templates. " +
      "Each one serves a specific purpose in your creative process.",
    visuals: ["safeMove nav"],
  },
  {
    kind: "segment",
    narration:
      "We looked at running generations, monitoring the task queue, choosing GPU tiers, and reviewing outputs. " +
      "The full execution pipeline from queue to preview.",
    visuals: ["mouse.move top bar"],
  },
  {
    kind: "segment",
    narration:
      "And we covered sharing, App Mode, settings, credits, and the help center. " +
      "Everything you need to go from zero to generating images in minutes.",
    visuals: ["safeMove header"],
  },
  {
    kind: "segment",
    narration:
      "ComfyUI Cloud removes the install hassle entirely — sign up at cloud.comfy.org " +
      "and start generating in seconds. No GPU? No problem.",
    visuals: ["mouse.move center"],
  },

  // ── Outro ──
  {
    kind: "outro",
    text: "ComfyUI Cloud",
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

test("cloud comfyui tour", async ({ page, browserName }, testInfo) => {
  // WebGL requires Chromium's new headless mode (--headless=new).
  // Run with: bunx playwright test --project=chromium-webgl demo/cloud-comfy.spec.ts
  test.skip(browserName !== "chromium", "cloud editor requires Chromium for WebGL support");
  test.setTimeout(10 * 60_000);

  // ── Login (heavy work — done outside script.render so it doesn't overrun) ──
  await page.goto(`${CLOUD_URL}/login`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(3000);

  // Click "Use email instead"
  const emailBtn = page.getByRole("button", { name: /use email instead/i });
  if (await emailBtn.isVisible().catch(() => false)) {
    await emailBtn.click();
    await page.waitForTimeout(1500);
  }

  // Fill credentials
  const email = process.env.CLOUD_USERNAME ?? "";
  const password = process.env.CLOUD_PASSWORD ?? "";
  if (!email || !password) {
    throw new Error("CLOUD_USERNAME / CLOUD_PASSWORD missing in .env.local");
  }
  // Wait explicitly for the email input (login form may load lazily)
  await page.locator('input[name="email"]').waitFor({ state: "visible", timeout: 30000 });
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill(password);
  await page.getByRole("button", { name: /^sign in$/i }).click();

  // Wait for editor to load (canvas appears)
  await page.waitForSelector("canvas", { timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(8000);

  // ── Build the narrated script ──
  const script = createVideoScript()
    // ── Title ──
    .title(VIDEO_SCRIPT[0].text, {
      subtitle: VIDEO_SCRIPT[0].subtitle,
      durationMs: VIDEO_SCRIPT[0].durationMs,
    })

    // ── Chapter 1: Welcome & canvas overview ──
    .segment(VIDEO_SCRIPT[1].narration, async (pace) => {
      await safeMove(page, "canvas");
      await pace();
    })
    .segment(VIDEO_SCRIPT[2].narration, async (pace) => {
      await page.mouse.move(640, 360);
      await pace();
    })
    .segment(VIDEO_SCRIPT[3].narration, async (pace) => {
      await page.mouse.wheel(0, -200);
      await pace();
      await page.waitForTimeout(500);
      await pace();
    })
    .segment(VIDEO_SCRIPT[4].narration, async (pace) => {
      await page.mouse.wheel(0, 200);
      await pace();
      // Simulate pan by moving mouse across canvas
      await page.mouse.move(400, 300);
      await pace();
      await page.mouse.move(700, 400);
      await pace();
    })
    .segment(VIDEO_SCRIPT[5].narration, async (pace) => {
      await page.mouse.move(500, 300);
      await pace();
      await page.mouse.move(700, 400);
      await pace();
    })

    // ── Chapter 2: Node connections & wires ──
    .segment(VIDEO_SCRIPT[6].narration, async (pace) => {
      await page.mouse.move(550, 350);
      await pace();
      await page.mouse.move(600, 370);
      await pace();
    })
    .segment(VIDEO_SCRIPT[7].narration, async (pace) => {
      // Trace from left to right across the canvas
      await page.mouse.move(300, 350);
      await pace();
      await page.mouse.move(500, 350);
      await pace();
      await page.mouse.move(700, 350);
      await pace();
    })
    .segment(VIDEO_SCRIPT[8].narration, async (pace) => {
      await page.mouse.move(450, 320);
      await pace();
      await page.mouse.move(600, 380);
      await pace();
    })

    // ── Chapter 3: Canvas interactions ──
    .segment(VIDEO_SCRIPT[9].narration, async (pace) => {
      await page.mouse.move(500, 350);
      await pace();
      // Simulate drag motion
      await page.mouse.move(520, 340);
      await pace();
      await page.mouse.move(540, 330);
      await pace();
    })
    .segment(VIDEO_SCRIPT[10].narration, async (pace) => {
      // Hover over an empty area of canvas where context menu would appear
      await page.mouse.move(640, 400);
      await pace();
    })
    .segment(VIDEO_SCRIPT[11].narration, async (pace) => {
      await safeMove(page, 'button[aria-label*="撤销"], button[aria-label*="Undo"], button[title*="Undo"]');
      await pace();
    })
    .segment(VIDEO_SCRIPT[12].narration, async (pace) => {
      await safeMove(page, '[class*="toolbar"], [class*="Toolbar"], header');
      await pace();
    })

    // ── Chapter 4: Workflow tab management ──
    .segment(VIDEO_SCRIPT[13].narration, async (pace) => {
      await safeMove(page, '[role="tablist"], .workflow-tabs, header');
      await pace();
    })
    .segment(VIDEO_SCRIPT[14].narration, async (pace) => {
      const newBtn = page
        .getByRole("button", { name: /创建空白工作流|new workflow|create blank/i })
        .first();
      if (await newBtn.isVisible().catch(() => false)) {
        await newBtn.hover().catch(() => {});
      }
      await pace();
    })
    .segment(VIDEO_SCRIPT[15].narration, async (pace) => {
      await safeMove(page, '[role="tablist"], .workflow-tabs, header');
      await pace();
    })

    // ── Chapter 5: Sidebar panels ──
    .segment(VIDEO_SCRIPT[16].narration, async (pace) => {
      await safeMove(page, "nav");
      await pace();
    })
    .segment(VIDEO_SCRIPT[17].narration, async (pace) => {
      const assetsBtn = page.locator('button[aria-label*="资产"], button[aria-label*="Assets"]').first();
      if (await assetsBtn.isVisible().catch(() => false)) {
        await assetsBtn.click().catch(() => {});
      }
      await pace();
    })
    .segment(VIDEO_SCRIPT[18].narration, async (pace) => {
      await page.waitForTimeout(500);
      await pace();
    })
    .segment(VIDEO_SCRIPT[19].narration, async (pace) => {
      const nodesBtn = page.locator('button[aria-label*="节点"], button[aria-label*="Nodes"]').first();
      if (await nodesBtn.isVisible().catch(() => false)) {
        await nodesBtn.click().catch(() => {});
      }
      await pace();
    })
    .segment(VIDEO_SCRIPT[20].narration, async (pace) => {
      await safeMove(page, '[class*="search"] input, [placeholder*="Search"], [placeholder*="搜索"]');
      await pace();
    })
    .segment(VIDEO_SCRIPT[21].narration, async (pace) => {
      const modelsBtn = page.locator('button[aria-label*="模型"], button[aria-label*="Models"]').first();
      if (await modelsBtn.isVisible().catch(() => false)) {
        await modelsBtn.click().catch(() => {});
      }
      await pace();
    })
    .segment(VIDEO_SCRIPT[22].narration, async (pace) => {
      await page.waitForTimeout(500);
      await pace();
    })
    .segment(VIDEO_SCRIPT[23].narration, async (pace) => {
      const workflowsBtn = page.locator('button[aria-label*="工作流"], button[aria-label*="Workflows"]').first();
      if (await workflowsBtn.isVisible().catch(() => false)) {
        await workflowsBtn.click().catch(() => {});
      }
      await pace();
    })
    .segment(VIDEO_SCRIPT[24].narration, async (pace) => {
      await page.waitForTimeout(500);
      await pace();
    })
    .segment(VIDEO_SCRIPT[25].narration, async (pace) => {
      await safeMove(page, '[class*="bottom-bar"], [class*="statusbar"], footer, [class*="toolbar"]:last-child');
      await pace();
    })
    .segment(VIDEO_SCRIPT[26].narration, async (pace) => {
      const templatesBtn = page.locator('button[aria-label*="模板"], button[aria-label*="Templates"]').first();
      if (await templatesBtn.isVisible().catch(() => false)) {
        await templatesBtn.click().catch(() => {});
      }
      await pace();
    })

    // ── Chapter 6: Running a generation ──
    .segment(VIDEO_SCRIPT[27].narration, async (pace) => {
      const runBtn = page.getByRole("button", { name: /^运行$|^Run$/i }).first();
      if (await runBtn.isVisible().catch(() => false)) {
        await runBtn.hover().catch(() => {});
      }
      await pace();
    })
    .segment(VIDEO_SCRIPT[28].narration, async (pace) => {
      await safeMove(page, 'input[type="number"], [role="spinbutton"]');
      await pace();
    })
    .segment(VIDEO_SCRIPT[29].narration, async (pace) => {
      await safeMove(page, 'button[class*="gpu"], button[class*="machine"], [class*="GPU"], [aria-label*="GPU"], [aria-label*="Machine"]');
      await pace();
    })
    .segment(VIDEO_SCRIPT[30].narration, async (pace) => {
      await page.waitForTimeout(500);
      await pace();
    })

    // ── Chapter 7: Task queue & output ──
    .segment(VIDEO_SCRIPT[31].narration, async (pace) => {
      const queueBtn = page.getByRole("button", { name: /任务队列|task queue|queue/i }).first();
      if (await queueBtn.isVisible().catch(() => false)) {
        await queueBtn.hover().catch(() => {});
      }
      await pace();
    })
    .segment(VIDEO_SCRIPT[32].narration, async (pace) => {
      const allBtn = page.getByRole("button", { name: /^全部$|^All$/i }).first();
      if (await allBtn.isVisible().catch(() => false)) {
        await allBtn.hover().catch(() => {});
      }
      await pace();
    })
    .segment(VIDEO_SCRIPT[33].narration, async (pace) => {
      await page.mouse.move(800, 400);
      await pace();
      await page.mouse.move(850, 450);
      await pace();
    })
    .segment(VIDEO_SCRIPT[34].narration, async (pace) => {
      await page.mouse.move(750, 400);
      await pace();
    })

    // ── Chapter 8: App Mode & sharing ──
    .segment(VIDEO_SCRIPT[35].narration, async (pace) => {
      const appModeBtn = page.getByRole("button", { name: /进入应用模式|app mode/i }).first();
      if (await appModeBtn.isVisible().catch(() => false)) {
        await appModeBtn.hover().catch(() => {});
      }
      await pace();
    })
    .segment(VIDEO_SCRIPT[36].narration, async (pace) => {
      await page.waitForTimeout(500);
      await pace();
    })
    .segment(VIDEO_SCRIPT[37].narration, async (pace) => {
      const shareBtn = page.getByRole("button", { name: /share|分享/i }).first();
      if (await shareBtn.isVisible().catch(() => false)) {
        await shareBtn.hover().catch(() => {});
      }
      await pace();
    })
    .segment(VIDEO_SCRIPT[38].narration, async (pace) => {
      await page.waitForTimeout(500);
      await pace();
    })

    // ── Chapter 9: Credits, billing & profile ──
    .segment(VIDEO_SCRIPT[39].narration, async (pace) => {
      await safeMove(page, '[class*="credit"], [class*="Credit"], [class*="balance"], [aria-label*="credit"], [aria-label*="Credit"]');
      await pace();
    })
    .segment(VIDEO_SCRIPT[40].narration, async (pace) => {
      await page.waitForTimeout(500);
      await pace();
    })
    .segment(VIDEO_SCRIPT[41].narration, async (pace) => {
      await safeMove(page, '[class*="profile"], [class*="avatar"], [class*="user"], img[alt*="avatar"], img[alt*="Avatar"]');
      await pace();
    })
    .segment(VIDEO_SCRIPT[42].narration, async (pace) => {
      await safeMove(page, '[class*="notification"], [class*="bell"], [aria-label*="notification"], [aria-label*="Notification"]');
      await pace();
    })

    // ── Chapter 10: Settings & help ──
    .segment(VIDEO_SCRIPT[43].narration, async (pace) => {
      const settingsBtn = page.getByRole("button", { name: /设置|settings/i }).first();
      if (await settingsBtn.isVisible().catch(() => false)) {
        await settingsBtn.hover().catch(() => {});
      }
      await pace();
    })
    .segment(VIDEO_SCRIPT[44].narration, async (pace) => {
      await page.waitForTimeout(500);
      await pace();
    })
    .segment(VIDEO_SCRIPT[45].narration, async (pace) => {
      await page.waitForTimeout(500);
      await pace();
    })
    .segment(VIDEO_SCRIPT[46].narration, async (pace) => {
      const helpBtn = page.getByRole("button", { name: /帮助中心|help center|help/i }).first();
      if (await helpBtn.isVisible().catch(() => false)) {
        await helpBtn.hover().catch(() => {});
      }
      await pace();
    })
    .segment(VIDEO_SCRIPT[47].narration, async (pace) => {
      await page.waitForTimeout(500);
      await pace();
    })

    // ── Chapter 11: Wrapping up ──
    .segment(VIDEO_SCRIPT[48].narration, async (pace) => {
      await page.mouse.move(640, 360);
      await pace();
    })
    .segment(VIDEO_SCRIPT[49].narration, async (pace) => {
      await safeMove(page, "canvas");
      await pace();
    })
    .segment(VIDEO_SCRIPT[50].narration, async (pace) => {
      await safeMove(page, "nav");
      await pace();
    })
    .segment(VIDEO_SCRIPT[51].narration, async (pace) => {
      await page.mouse.move(640, 80);
      await pace();
    })
    .segment(VIDEO_SCRIPT[52].narration, async (pace) => {
      await safeMove(page, "header");
      await pace();
    })
    .segment(VIDEO_SCRIPT[53].narration, async (pace) => {
      await page.mouse.move(640, 360);
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
    baseName: "cloud-comfy",
    outputDir: ".comfy-qa/.demos",
  });
});
