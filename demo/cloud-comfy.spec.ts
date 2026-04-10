/**
 * ComfyUI Cloud — cloud.comfy.org
 *
 * Story:  demo/stories/cloud-comfy.story.md
 * Output: .comfy-qa/.demos/cloud-comfy.mp4
 *
 * ---------------------------------------------------------------------------
 *  VIDEO SCRIPT — 8 chapters, ~40 segments, targeting 8–10 minute runtime
 * ---------------------------------------------------------------------------
 *  Every word in `narration` is read aloud verbatim by Gemini TTS during
 *  recording. Edit this constant first, run it through your head as a
 *  voiceover, and only then touch the Playwright code below.
 *
 *  Rules:
 *    1. First person, present tense, conversational pace.
 *    2. Connect segments with transitional phrases — never bullet-points.
 *    3. Explain WHY and user benefit for every feature.
 *    4. Each segment ~6–10 seconds at 140 wpm => 14–24 words is the sweet spot.
 *    5. Total: 8 chapters, ~40 segments, video ~8–10 minutes.
 *
 *  Chapter overview:
 *    Ch 1 – Intro + Login (4 segments)
 *    Ch 2 – Canvas and Node Editor (6 segments)
 *    Ch 3 – Tab Bar and Workflow Management (5 segments)
 *    Ch 4 – Sidebar Panels (6 segments)
 *    Ch 5 – Templates (4 segments)
 *    Ch 6 – Running a Generation (5 segments)
 *    Ch 7 – App Mode and Sharing (5 segments)
 *    Ch 8 – Settings, Help, Workspace + Outro (5 segments)
 */

// ---------------------------------------------------------------------------
//  PLAYWRIGHT IMPLEMENTATION
// ---------------------------------------------------------------------------
import { test, safeMove } from "./fixtures/fixture";
import { createVideoScript } from "../lib/demowright/dist/index.mjs";
import { typeKeys } from "../lib/demowright/dist/helpers.mjs";

const CLOUD_URL = process.env.CLOUD_URL ?? "https://cloud.comfy.org";

test("cloud comfyui comprehensive tour", async ({ page }) => {
  test.setTimeout(15 * 60_000);

  // -- 1. Login (done outside script.render so TTS wait is not recorded) -----
  await page.goto(`${CLOUD_URL}/login`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(3000);

  const emailBtn = page.getByRole("button", { name: /use email instead/i });
  if (await emailBtn.isVisible().catch(() => false)) {
    await emailBtn.click();
    await page.waitForTimeout(1500);
  }

  const email = process.env.CLOUD_USERNAME ?? "";
  const password = process.env.CLOUD_PASSWORD ?? "";
  if (!email || !password) {
    throw new Error("CLOUD_USERNAME / CLOUD_PASSWORD missing in .env.local");
  }
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill(password);
  await page.getByRole("button", { name: /^sign in$/i }).click();

  // Wait for the editor canvas to appear
  await page.waitForSelector("canvas", { timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(8000);

  // -- 2. Build the narrated script ------------------------------------------
  const script = createVideoScript()

    // ═══════════════════════════════════════════════════════════════════════════
    //  CHAPTER 1 — Intro + Login
    // ═══════════════════════════════════════════════════════════════════════════
    .title("ComfyUI Cloud", {
      subtitle: "Professional AI image generation — zero local setup",
      durationMs: 3000,
    })

    // 1-1: Why cloud
    .segment(
      "Setting up ComfyUI locally means installing Python, CUDA drivers, and downloading gigabytes of model files. Cloud removes all of that.",
      async (pace) => {
        await safeMove(page, "canvas");
        await pace();
        await page.mouse.move(640, 360);
        await pace();
      },
    )

    // 1-2: Email login flow
    .segment(
      "I signed in with just an email and password. No SSH keys, no terminal commands — just a browser and a login form.",
      async (pace) => {
        await page.mouse.move(640, 200);
        await pace();
        await page.mouse.move(640, 360);
        await pace();
      },
    )

    // 1-3: Editor first load — canvas with nodes
    .segment(
      "And here's the editor. The same powerful node-based workflow tool as the desktop version, but running entirely in my browser on cloud GPUs.",
      async (pace) => {
        await safeMove(page, "canvas");
        await pace();
        await page.mouse.move(500, 300);
        await pace();
        await page.mouse.move(780, 420);
        await pace();
      },
    )

    // 1-4: Quick orientation
    .segment(
      "Let me give you a full tour of everything ComfyUI Cloud has to offer. We'll start with the canvas and work through every panel.",
      async (pace) => {
        await page.mouse.move(640, 360);
        await pace();
        await page.mouse.move(400, 300);
        await pace();
      },
    )

    // ═══════════════════════════════════════════════════════════════════════════
    //  CHAPTER 2 — Canvas and Node Editor
    // ═══════════════════════════════════════════════════════════════════════════
    .title("The Node Editor", {
      subtitle: "Build visual AI pipelines with drag-and-drop nodes",
      durationMs: 2000,
    })

    // 2-1: Canvas overview
    .segment(
      "The canvas is where everything happens. Each box is a node — model loaders, prompt encoders, samplers, and output nodes all connected like a flowchart.",
      async (pace) => {
        await safeMove(page, "canvas");
        await pace();
        await page.mouse.move(300, 280);
        await pace();
        await page.mouse.move(600, 350);
        await pace();
        await page.mouse.move(850, 300);
        await pace();
      },
    )

    // 2-2: Zoom and pan navigation
    .segment(
      "I can zoom in with the scroll wheel to inspect individual nodes in detail, or zoom out to see the entire pipeline at a glance.",
      async (pace) => {
        await page.mouse.wheel(0, -400);
        await pace();
        await page.mouse.move(640, 360);
        await pace();
        await page.mouse.wheel(0, 500);
        await pace();
        await page.mouse.wheel(0, -100);
        await pace();
      },
    )

    // 2-3: Node selection and SelectionToolbox
    .segment(
      "Clicking a node selects it and reveals the selection toolbox. From here I can delete, bypass, recolor, group into a subgraph, or inspect node details.",
      async (pace) => {
        await page.mouse.move(400, 300);
        await pace();
        await page.mouse.click(400, 300);
        await pace();
        await page.mouse.move(400, 260);
        await pace();
      },
    )

    // 2-4: Node search — double-click canvas
    .segment(
      "Double-clicking the canvas opens the node search popover. I can type any node name to find and add it instantly — much faster than browsing menus.",
      async (pace) => {
        await page.mouse.dblclick(640, 450);
        await pace();
        await page.waitForTimeout(800);
        await page.mouse.move(640, 350);
        await pace();
        // Close the search by pressing Escape
        await page.keyboard.press("Escape");
        await pace();
      },
    )

    // 2-5: Node context menu — right-click
    .segment(
      "Right-clicking a node opens a context menu with advanced options like converting widgets to inputs, collapsing the node, or copying its configuration.",
      async (pace) => {
        await page.mouse.click(500, 320, { button: "right" });
        await pace();
        await page.mouse.move(520, 380);
        await pace();
        // Dismiss the context menu
        await page.keyboard.press("Escape");
        await pace();
      },
    )

    // 2-6: Minimap panel
    .segment(
      "In the bottom-right corner, the minimap gives me a bird's-eye view of the entire workflow. I can click anywhere on it to jump to that section instantly.",
      async (pace) => {
        await page.mouse.move(1100, 650);
        await pace();
        await page.mouse.move(1150, 680);
        await pace();
        await page.mouse.move(640, 360);
        await pace();
      },
    )

    // ═══════════════════════════════════════════════════════════════════════════
    //  CHAPTER 3 — Tab Bar and Workflow Management
    // ═══════════════════════════════════════════════════════════════════════════
    .title("Workflow Management", {
      subtitle: "Organize multiple workflows like browser tabs",
      durationMs: 2000,
    })

    // 3-1: Tab bar overview
    .segment(
      "The tab bar at the top works just like a browser. Each tab is a separate workflow, so I can switch between projects without losing my place.",
      async (pace) => {
        await page.mouse.move(300, 40);
        await pace();
        await page.mouse.move(500, 40);
        await pace();
        await page.mouse.move(700, 40);
        await pace();
      },
    )

    // 3-2: Create new workflow
    .segment(
      "The plus button creates a fresh workflow tab instantly. I use this when I want to experiment without touching my current working pipeline.",
      async (pace) => {
        const newBtn = page.locator(
          'button:has-text("New"), button:has-text("Create"), button:has-text("+")',
        ).first();
        if (await newBtn.isVisible().catch(() => false)) {
          await newBtn.hover().catch(() => {});
        }
        await pace();
        await page.mouse.move(640, 40);
        await pace();
      },
    )

    // 3-3: Rename workflow — double-click tab
    .segment(
      "Double-clicking a tab name lets me rename it inline, using the title editor. Descriptive names keep my workspace organized when I have many workflows open.",
      async (pace) => {
        await page.mouse.move(400, 40);
        await pace();
        await page.mouse.move(400, 40);
        await pace();
      },
    )

    // 3-4: Workflow overflow menu
    .segment(
      "Each tab has an overflow menu with options to duplicate, export as JSON, or delete the workflow. Exporting is great for sharing pipelines with teammates.",
      async (pace) => {
        await page.mouse.move(450, 40);
        await pace();
        await page.mouse.move(460, 40);
        await pace();
      },
    )

    // 3-5: Workflows sidebar panel
    .segment(
      "The Workflows sidebar panel gives me a list view of all saved workflows. I can search, sort, and manage everything from one place.",
      async (pace) => {
        const wfBtn = page
          .locator(
            'button[aria-label*="工作流"], button[aria-label*="Workflows"]',
          )
          .first();
        if (await wfBtn.isVisible().catch(() => false)) {
          await wfBtn.click().catch(() => {});
          await page.waitForTimeout(1000);
        }
        await page.mouse.move(200, 300);
        await pace();
        await page.mouse.move(200, 400);
        await pace();
        await page.mouse.move(200, 500);
        await pace();
      },
    )

    // ═══════════════════════════════════════════════════════════════════════════
    //  CHAPTER 4 — Sidebar Panels
    // ═══════════════════════════════════════════════════════════════════════════
    .title("Sidebar Panels", {
      subtitle: "Node library, models, assets, and more",
      durationMs: 2000,
    })

    // 4-1: Sidebar overview
    .segment(
      "The left sidebar has an icon toolbar that opens different panels. Each panel focuses on one part of the creative workflow — nodes, models, assets, and apps.",
      async (pace) => {
        await page.mouse.move(30, 200);
        await pace();
        await page.mouse.move(30, 300);
        await pace();
        await page.mouse.move(30, 400);
        await pace();
        await page.mouse.move(30, 500);
        await pace();
      },
    )

    // 4-2: Node Library
    .segment(
      "The Node Library organizes nodes into categories: Essentials, All, Custom, and Blueprints. I can drag any node directly onto the canvas to add it to my workflow.",
      async (pace) => {
        const nodesBtn = page
          .locator(
            'button[aria-label*="节点"], button[aria-label*="Nodes"]',
          )
          .first();
        if (await nodesBtn.isVisible().catch(() => false)) {
          await nodesBtn.click().catch(() => {});
          await page.waitForTimeout(1000);
        }
        await page.mouse.move(180, 250);
        await pace();
        await page.mouse.move(180, 350);
        await pace();
        await page.mouse.move(180, 450);
        await pace();
      },
    )

    // 4-3: Model Library
    .segment(
      "The Model Library shows all available checkpoints, LoRAs, and VAEs. On the cloud, these are pre-downloaded — no more waiting for multi-gigabyte downloads.",
      async (pace) => {
        const modelsBtn = page
          .locator(
            'button[aria-label*="模型"], button[aria-label*="Models"]',
          )
          .first();
        if (await modelsBtn.isVisible().catch(() => false)) {
          await modelsBtn.click().catch(() => {});
          await page.waitForTimeout(1000);
        }
        await page.mouse.move(180, 250);
        await pace();
        await page.mouse.move(180, 350);
        await pace();
        await page.mouse.move(180, 450);
        await pace();
      },
    )

    // 4-4: Assets panel
    .segment(
      "The Assets panel shows all my generated outputs. I can switch between grid and list views, filter by type — images, videos, audio, 3D models, or text — and sort by date or name.",
      async (pace) => {
        const assetsBtn = page
          .locator(
            'button[aria-label*="资产"], button[aria-label*="Assets"]',
          )
          .first();
        if (await assetsBtn.isVisible().catch(() => false)) {
          await assetsBtn.click().catch(() => {});
          await page.waitForTimeout(1000);
        }
        await page.mouse.move(180, 200);
        await pace();
        await page.mouse.move(180, 350);
        await pace();
        await page.mouse.move(180, 500);
        await pace();
      },
    )

    // 4-5: Asset upload dialog
    .segment(
      "I can also upload my own images to use as inputs. The upload dialog supports drag-and-drop or file browsing, making it easy to bring reference images into my pipeline.",
      async (pace) => {
        await page.mouse.move(180, 180);
        await pace();
        await page.mouse.move(200, 200);
        await pace();
      },
    )

    // 4-6: Apps tab
    .segment(
      "The Apps tab lists published workflow applications. These are simplified interfaces built from workflows — perfect for non-technical users who just want to generate.",
      async (pace) => {
        const appsBtn = page
          .locator(
            'button[aria-label*="应用"], button[aria-label*="Apps"]',
          )
          .first();
        if (await appsBtn.isVisible().catch(() => false)) {
          await appsBtn.click().catch(() => {});
          await page.waitForTimeout(1000);
        }
        await page.mouse.move(180, 300);
        await pace();
        await page.mouse.move(180, 400);
        await pace();
      },
    )

    // ═══════════════════════════════════════════════════════════════════════════
    //  CHAPTER 5 — Templates
    // ═══════════════════════════════════════════════════════════════════════════
    .title("Templates", {
      subtitle: "Start from pre-built, production-ready workflows",
      durationMs: 2000,
    })

    // 5-1: Templates panel open
    .segment(
      "Instead of building from scratch, the Templates panel offers professionally designed workflows. Let me open it and browse what's available.",
      async (pace) => {
        const templatesBtn = page
          .locator(
            'button[aria-label*="模板"], button[aria-label*="Templates"]',
          )
          .first();
        if (await templatesBtn.isVisible().catch(() => false)) {
          await templatesBtn.click().catch(() => {});
          await page.waitForTimeout(1500);
        }
        await page.mouse.move(200, 300);
        await pace();
      },
    )

    // 5-2: Browse template cards
    .segment(
      "Each card previews a workflow category — text-to-image, inpainting, upscaling, style transfer, and more. The most popular tasks are one click away.",
      async (pace) => {
        await page.mouse.move(200, 280);
        await pace();
        await page.mouse.move(200, 380);
        await pace();
        await page.mouse.move(200, 480);
        await pace();
        await page.mouse.move(200, 580);
        await pace();
      },
    )

    // 5-3: Open a template
    .segment(
      "I'll select a template to load it. All nodes are already wired up with sensible defaults — checkpoint loaders, CLIP encoders, samplers, and output nodes, all preconfigured.",
      async (pace) => {
        await page.mouse.move(200, 350);
        await pace();
        // Click the first visible template card
        await page.mouse.click(200, 350);
        await page.waitForTimeout(2000);
        await pace();
        await safeMove(page, "canvas");
        await pace();
      },
    )

    // 5-4: Edit prompt in text widget
    .segment(
      "Now I just need to change the prompt text. I'll type my own description and the workflow is ready to run. That's the beauty of templates — zero setup, full customization.",
      async (pace) => {
        await page.mouse.move(500, 350);
        await pace();
        await page.mouse.move(500, 380);
        await pace();
      },
    )

    // ═══════════════════════════════════════════════════════════════════════════
    //  CHAPTER 6 — Running a Generation
    // ═══════════════════════════════════════════════════════════════════════════
    .title("Running a Generation", {
      subtitle: "Cloud GPUs handle the heavy lifting",
      durationMs: 2000,
    })

    // 6-1: Run button and batch count
    .segment(
      "The Run button in the top bar queues my workflow for execution. I can set the batch count to generate multiple variations in a single run for comparison.",
      async (pace) => {
        const runBtn = page
          .locator('button:has-text("Run"), button:has-text("运行")')
          .first();
        if (await runBtn.isVisible().catch(() => false)) {
          await runBtn.hover().catch(() => {});
        }
        await pace();
        await page.mouse.move(640, 60);
        await pace();
      },
    )

    // 6-2: Queue progress overlay
    .segment(
      "Once submitted, a progress overlay appears showing real-time status. The progress bar updates as each node executes, so I always know exactly where my generation stands.",
      async (pace) => {
        await page.mouse.move(640, 100);
        await pace();
        await page.mouse.move(640, 150);
        await pace();
      },
    )

    // 6-3: Queue sidebar
    .segment(
      "The Queue sidebar tracks everything — active jobs, completed runs, and failed attempts. I can filter by status to quickly find what I need.",
      async (pace) => {
        const queueBtn = page
          .locator(
            'button[aria-label*="队列"], button[aria-label*="Queue"]',
          )
          .first();
        if (await queueBtn.isVisible().catch(() => false)) {
          await queueBtn.click().catch(() => {});
          await page.waitForTimeout(1000);
        }
        await page.mouse.move(200, 300);
        await pace();
        await page.mouse.move(200, 400);
        await pace();
        await page.mouse.move(200, 500);
        await pace();
      },
    )

    // 6-4: Job details popover
    .segment(
      "Clicking a completed job opens its details — generated assets, total runtime, GPU usage, and any error messages. It's a full audit trail for every generation.",
      async (pace) => {
        await page.mouse.move(200, 350);
        await pace();
        await page.mouse.move(300, 350);
        await pace();
      },
    )

    // 6-5: Output preview in node
    .segment(
      "The generated image appears directly in the output node on the canvas. No hunting through file directories — results are right where I expect them.",
      async (pace) => {
        await safeMove(page, "canvas");
        await pace();
        await page.mouse.move(700, 400);
        await pace();
        await page.mouse.move(750, 420);
        await pace();
      },
    )

    // ═══════════════════════════════════════════════════════════════════════════
    //  CHAPTER 7 — App Mode and Sharing
    // ═══════════════════════════════════════════════════════════════════════════
    .title("App Mode and Sharing", {
      subtitle: "Simplify workflows for any audience",
      durationMs: 2000,
    })

    // 7-1: Canvas mode selector
    .segment(
      "ComfyUI Cloud has three canvas modes — Graph, Linear, and Builder. The mode selector lets me switch between them depending on my audience and use case.",
      async (pace) => {
        await page.mouse.move(640, 60);
        await pace();
        await page.mouse.move(700, 60);
        await pace();
      },
    )

    // 7-2: Linear View
    .segment(
      "Linear View strips away the graph complexity and presents a clean, form-based interface. It's perfect for non-technical users who just want to fill in a prompt and hit generate.",
      async (pace) => {
        await page.mouse.move(640, 300);
        await pace();
        await page.mouse.move(640, 400);
        await pace();
        await page.mouse.move(640, 500);
        await pace();
      },
    )

    // 7-3: Builder Mode
    .segment(
      "Builder Mode goes further — it lets me customize the app layout, choose which parameters to expose, and design the experience my users will actually see.",
      async (pace) => {
        await page.mouse.move(400, 300);
        await pace();
        await page.mouse.move(600, 300);
        await pace();
        await page.mouse.move(800, 300);
        await pace();
      },
    )

    // 7-4: Share button
    .segment(
      "The Share button generates a public link in one click. Anyone with the link can view my workflow, try it out, or even remix it as their own starting point.",
      async (pace) => {
        const shareBtn = page
          .locator('button:has-text("Share")')
          .first();
        if (await shareBtn.isVisible().catch(() => false)) {
          await shareBtn.hover().catch(() => {});
        }
        await pace();
        await page.mouse.move(640, 200);
        await pace();
      },
    )

    // 7-5: Publish to ComfyHub
    .segment(
      "For wider distribution, I can publish to ComfyHub. The wizard walks me through adding a thumbnail, writing a description, uploading example outputs, and confirming the listing.",
      async (pace) => {
        await page.mouse.move(640, 300);
        await pace();
        await page.mouse.move(640, 400);
        await pace();
      },
    )

    // ═══════════════════════════════════════════════════════════════════════════
    //  CHAPTER 8 — Settings, Help, Workspace + Outro
    // ═══════════════════════════════════════════════════════════════════════════
    .title("Settings and Workspace", {
      subtitle: "Customize your environment and collaborate with your team",
      durationMs: 2000,
    })

    // 8-1: Settings dialog
    .segment(
      "The Settings dialog lets me customize my experience — toggle between light and dark themes, switch keybind presets, configure default values, and manage API keys.",
      async (pace) => {
        const settingsBtn = page
          .locator(
            'button[aria-label*="设置"], button[aria-label*="Settings"]',
          )
          .first();
        if (await settingsBtn.isVisible().catch(() => false)) {
          await settingsBtn.click().catch(() => {});
          await page.waitForTimeout(1500);
        }
        await page.mouse.move(640, 300);
        await pace();
        await page.mouse.move(640, 400);
        await pace();
        // Close settings
        await page.keyboard.press("Escape");
        await page.waitForTimeout(500);
        await pace();
      },
    )

    // 8-2: Help center
    .segment(
      "The Help center links to documentation, video tutorials, and a keyboard shortcut reference. If I ever get stuck, the answers are always one click away.",
      async (pace) => {
        const helpBtn = page
          .locator(
            'button[aria-label*="帮助"], button[aria-label*="Help"]',
          )
          .first();
        if (await helpBtn.isVisible().catch(() => false)) {
          await helpBtn.hover().catch(() => {});
        }
        await pace();
        await page.mouse.move(640, 360);
        await pace();
      },
    )

    // 8-3: Workspace and team management
    .segment(
      "Workspace management supports team collaboration. I can invite members, share assets and workflows across the team, and manage permissions — all from a single dashboard.",
      async (pace) => {
        await page.mouse.move(640, 200);
        await pace();
        await page.mouse.move(640, 300);
        await pace();
        await page.mouse.move(640, 400);
        await pace();
      },
    )

    // 8-4: Summary narration
    .segment(
      "That covers the full ComfyUI Cloud experience. From the powerful node editor to templates, cloud GPU execution, sharing, app mode, and team collaboration — everything in one browser tab.",
      async (pace) => {
        await safeMove(page, "canvas");
        await pace();
        await page.mouse.move(640, 360);
        await pace();
      },
    )

    // 8-5: Conclusion
    .segment(
      "No Python installs, no CUDA drivers, no model downloads. Just log in, build your workflow, and start generating. ComfyUI Cloud makes AI image creation truly accessible.",
      async (pace) => {
        await page.mouse.move(640, 360);
        await pace();
      },
    )

    // ── Outro card ──
    .outro({
      text: "ComfyUI Cloud",
      subtitle: "cloud.comfy.org",
      narration:
        "ComfyUI Cloud gives you the full power of ComfyUI in your browser — cloud GPUs, a rich node editor, pre-built templates, real-time queue tracking, one-click sharing, app mode for any audience, and zero local setup. Try it today at cloud dot comfy dot org.",
      durationMs: 3000,
    });

  await script.prepare(page);
  await script.render(page, {
    baseName: "cloud-comfy",
    outputDir: ".comfy-qa/.demos",
  });
});
