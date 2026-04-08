/**
 * Comprehensive demo of https://cloud.comfy.org/ — the hosted ComfyUI editor.
 *
 * This walks a new user through:
 *  1. Login with email + password (credentials in .env.local)
 *  2. Editor overview (canvas, top bar, sidebar)
 *  3. The 6 main sidebar panels: Assets, Nodes, Models, Workflows, Apps, Templates
 *  4. Workflow tab management
 *  5. Running a generation (queue + run button)
 *  6. Task queue inspector
 *  7. App mode (entering app preview)
 *  8. Sharing a workflow
 *  9. Settings panel
 * 10. Help center
 */
import { test, safeMove } from "./fixtures/fixture";
import { createVideoScript } from "../lib/demowright/dist/index.mjs";

const CLOUD_URL = "https://cloud.comfy.org";

test("cloud comfyui tour", async ({ page }) => {
  test.setTimeout(10 * 60_000);

  // ── 1. Login (heavy work — done outside script.render so it doesn't overrun) ──
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
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill(password);
  await page.getByRole("button", { name: /^sign in$/i }).click();

  // Wait for editor to load (canvas appears)
  await page.waitForSelector("canvas", { timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(8000);

  // ── 2. Build the narrated script ──
  const script = createVideoScript()
    .title("ComfyUI Cloud", {
      subtitle: "Hosted Node Editor Tour",
      durationMs: 2000,
    })
    .segment(
      "Welcome to ComfyUI Cloud — the hosted node editor for AI image generation.",
      async (pace) => {
        await safeMove(page, "canvas");
        await pace();
      },
    )
    .segment(
      "The center is a graph canvas where you build workflows visually.",
      async (pace) => {
        await page.mouse.move(640, 360);
        await pace();
        await page.mouse.wheel(0, -200); // zoom in
        await pace();
        await page.mouse.wheel(0, 200); // zoom back
        await pace();
      },
    )
    .segment(
      "Each box on the canvas is a node — model loaders, samplers, and outputs.",
      async (pace) => {
        await page.mouse.move(500, 300);
        await pace();
        await page.mouse.move(700, 400);
        await pace();
      },
    )
    .segment(
      "The top tab bar shows your open workflows — switch between projects with one click.",
      async (pace) => {
        await safeMove(page, '[role="tablist"], .workflow-tabs, header');
        await pace();
      },
    )
    .segment(
      "Click the plus button to create a new blank workflow whenever you need a fresh canvas.",
      async (pace) => {
        const newBtn = page
          .getByRole("button", { name: /创建空白工作流|new workflow|create blank/i })
          .first();
        if (await newBtn.isVisible().catch(() => false)) {
          await newBtn.hover().catch(() => {});
        }
        await pace();
      },
    )
    .segment(
      "On the left sidebar are six panels — let's tour each one.",
      async (pace) => {
        await safeMove(page, "nav");
        await pace();
      },
    )
    .segment(
      "The Assets panel — your uploaded images, videos, and reference files.",
      async (pace) => {
        const assetsBtn = page.locator('button[aria-label*="资产"], button[aria-label*="Assets"]').first();
        if (await assetsBtn.isVisible().catch(() => false)) {
          await assetsBtn.click().catch(() => {});
        }
        await pace();
      },
    )
    .segment(
      "The Node Library — browse every available node by category and search.",
      async (pace) => {
        const nodesBtn = page.locator('button[aria-label*="节点"], button[aria-label*="Nodes"]').first();
        if (await nodesBtn.isVisible().catch(() => false)) {
          await nodesBtn.click().catch(() => {});
        }
        await pace();
      },
    )
    .segment(
      "The Model Library — manage your checkpoints, LoRAs, VAEs, and other models.",
      async (pace) => {
        const modelsBtn = page.locator('button[aria-label*="模型"], button[aria-label*="Models"]').first();
        if (await modelsBtn.isVisible().catch(() => false)) {
          await modelsBtn.click().catch(() => {});
        }
        await pace();
      },
    )
    .segment(
      "The Workflows panel — save, load, and organize your saved workflow files.",
      async (pace) => {
        const workflowsBtn = page.locator('button[aria-label*="工作流"], button[aria-label*="Workflows"]').first();
        if (await workflowsBtn.isVisible().catch(() => false)) {
          await workflowsBtn.click().catch(() => {});
        }
        await pace();
      },
    )
    .segment(
      "The Apps panel — published workflows running as standalone apps.",
      async (pace) => {
        const appsBtn = page.locator('button[aria-label*="应用"], button[aria-label*="Apps"]').first();
        if (await appsBtn.isVisible().catch(() => false)) {
          await appsBtn.click().catch(() => {});
        }
        await pace();
      },
    )
    .segment(
      "The Templates panel — pre-built workflow recipes you can clone and customize.",
      async (pace) => {
        const templatesBtn = page.locator('button[aria-label*="模板"], button[aria-label*="Templates"]').first();
        if (await templatesBtn.isVisible().catch(() => false)) {
          await templatesBtn.click().catch(() => {});
        }
        await pace();
      },
    )
    .segment(
      "The Run button at the top queues your workflow for execution on the cloud.",
      async (pace) => {
        const runBtn = page.getByRole("button", { name: /^运行$|^Run$/i }).first();
        if (await runBtn.isVisible().catch(() => false)) {
          await runBtn.hover().catch(() => {});
        }
        await pace();
      },
    )
    .segment(
      "Set the batch count to generate multiple variations from one queue.",
      async (pace) => {
        await safeMove(page, 'input[type="number"], [role="spinbutton"]');
        await pace();
      },
    )
    .segment(
      "The task queue panel shows active, completed, and failed jobs with their progress.",
      async (pace) => {
        const queueBtn = page.getByRole("button", { name: /任务队列|task queue|queue/i }).first();
        if (await queueBtn.isVisible().catch(() => false)) {
          await queueBtn.hover().catch(() => {});
        }
        await pace();
      },
    )
    .segment(
      "Filter by completed or failed to find specific runs in your history.",
      async (pace) => {
        const allBtn = page.getByRole("button", { name: /^全部$|^All$/i }).first();
        if (await allBtn.isVisible().catch(() => false)) {
          await allBtn.hover().catch(() => {});
        }
        await pace();
      },
    )
    .segment(
      "App Mode lets you preview your workflow as an end-user form, hiding the graph.",
      async (pace) => {
        const appModeBtn = page.getByRole("button", { name: /进入应用模式|app mode/i }).first();
        if (await appModeBtn.isVisible().catch(() => false)) {
          await appModeBtn.hover().catch(() => {});
        }
        await pace();
      },
    )
    .segment(
      "Share button generates a public link so others can run your workflow.",
      async (pace) => {
        const shareBtn = page.getByRole("button", { name: /share/i }).first();
        if (await shareBtn.isVisible().catch(() => false)) {
          await shareBtn.hover().catch(() => {});
        }
        await pace();
      },
    )
    .segment(
      "The settings dialog has hundreds of options for keyboard, theme, and behavior.",
      async (pace) => {
        const settingsBtn = page.getByRole("button", { name: /设置|settings/i }).first();
        if (await settingsBtn.isVisible().catch(() => false)) {
          await settingsBtn.hover().catch(() => {});
        }
        await pace();
      },
    )
    .segment(
      "And the help center has docs, tutorials, and keyboard shortcuts when you need them.",
      async (pace) => {
        const helpBtn = page.getByRole("button", { name: /帮助中心|help center|help/i }).first();
        if (await helpBtn.isVisible().catch(() => false)) {
          await helpBtn.hover().catch(() => {});
        }
        await pace();
      },
    )
    .segment(
      "ComfyUI Cloud removes the install hassle — sign up and start generating in seconds.",
      async (pace) => {
        await page.mouse.move(640, 360);
        await pace();
      },
    )
    .outro({
      text: "ComfyUI Cloud",
      subtitle: "cloud.comfy.org",
      durationMs: 2000,
    });

  await script.prepare(page);
  await script.render(page, {
    baseName: "cloud-comfy",
    outputDir: ".comfy-qa/.demos",
  });
});
