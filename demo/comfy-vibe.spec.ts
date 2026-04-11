import { test, safeMove } from "./fixtures/fixture";
import { createVideoScript } from "../lib/demowright/dist/index.mjs";
import type { Page } from "@playwright/test";

/**
 * VIDEO SCRIPT — every word in `narration` is read aloud verbatim by Gemini TTS.
 *
 * Coverage: 22/22 (100%)
 *
 * | # | Feature                              | R | Notes                           |
 * |---|--------------------------------------|---|---------------------------------|
 * | 1 | Sidebar: My Workspace button         | ✅ | top-level nav                   |
 * | 2 | Sidebar: Recents link                | ✅ | OVERVIEW section                |
 * | 3 | Sidebar: Templates link              | ✅ | OVERVIEW section                |
 * | 4 | Sidebar: Tutorials link              | ✅ | OVERVIEW section                |
 * | 5 | Sidebar: My First Project            | ✅ | PRIVATE section                 |
 * | 6 | Sidebar: Personal Work               | ✅ | PRIVATE section                 |
 * | 7 | Sidebar: Client Project              | ✅ | SHARED section                  |
 * | 8 | Sidebar: Portrait Workflow            | ✅ | SHARED section                  |
 * | 9 | Sidebar: Custom LoRA                 | ✅ | SHARED section                  |
 * | 10| Sidebar: Reference Images            | ✅ | SHARED section                  |
 * | 11| Sidebar: Trash                       | ✅ | utility link                    |
 * | 12| Sidebar: Help                        | ✅ | utility link                    |
 * | 13| Header: Simple txt2img thumbnail     | ✅ | workflow card                   |
 * | 14| Header: Upscale Pipeline thumbnail   | ✅ | workflow card                   |
 * | 15| Header: Multi-Pass Refiner thumbnail | ✅ | workflow card                   |
 * | 16| Header: Minimal thumbnail            | ✅ | workflow card                   |
 * | 17| Search bar                           | ✅ | input placeholder "Search..."   |
 * | 18| Sort dropdown                        | ✅ | Last updated / Name / Type      |
 * | 19| Filter tab: Recent                   | ✅ | tab selector                    |
 * | 20| Filter tab: Shared with me           | ✅ | tab selector                    |
 * | 21| Filter tab: Favorites                | ✅ | tab selector                    |
 * | 22| Create your first workflow CTA       | ✅ | call-to-action button           |
 */
const VIDEO_SCRIPT = [
  // ── 0: Title ──
  {
    kind: "title",
    text: "Comfy Vibe",
    subtitle: "Workspace App Tour",
    durationMs: 2000,
  },

  // ── 1: Welcome + sidebar overview ──
  {
    kind: "segment",
    narration:
      "Welcome to Comfy Vibe — the new workspace app for managing your ComfyUI projects, templates, and shared workflows.",
  },

  // ── 2: My Workspace ──
  {
    kind: "segment",
    narration:
      "The sidebar starts with the My Workspace button — your home base that brings everything into one view.",
  },

  // ── 3: OVERVIEW section — Recents, Templates ──
  {
    kind: "segment",
    narration:
      "Under Overview I see Recents for recently opened files, and Templates for pre-built starting points.",
  },

  // ── 4: OVERVIEW — Tutorials ──
  {
    kind: "segment",
    narration:
      "Next is Tutorials — guided walkthroughs that help you learn ComfyUI techniques step by step.",
  },

  // ── 5: PRIVATE section — My First Project, Personal Work ──
  {
    kind: "segment",
    narration:
      "The Private section holds personal projects. I see My First Project and Personal Work — only you can access these.",
  },

  // ── 6: SHARED section — Client Project, Portrait Workflow ──
  {
    kind: "segment",
    narration:
      "Shared projects appear next. Client Project and Portrait Workflow are visible to collaborators you invite.",
  },

  // ── 7: SHARED — Custom LoRA, Reference Images ──
  {
    kind: "segment",
    narration:
      "Further down, Custom LoRA and Reference Images round out the shared workspace — team assets in one place.",
  },

  // ── 8: Trash + Help ──
  {
    kind: "segment",
    narration:
      "At the bottom of the sidebar, Trash keeps deleted items recoverable, and Help links to documentation.",
  },

  // ── 9: Header workflow thumbnails — first two ──
  {
    kind: "segment",
    narration:
      "The header showcases workflow thumbnails. Simple txt2img is the classic starting point, and Upscale Pipeline adds resolution enhancement.",
  },

  // ── 10: Header thumbnails — last two ──
  {
    kind: "segment",
    narration:
      "Multi-Pass Refiner chains multiple sampling passes, while Minimal strips a workflow to its bare essentials.",
  },

  // ── 11: Search bar ──
  {
    kind: "segment",
    narration:
      "The search bar lets me filter everything by name. I hover it now — type any keyword and results appear instantly.",
  },

  // ── 12: Sort dropdown ──
  {
    kind: "segment",
    narration:
      "The sort dropdown defaults to Last Updated. You can also sort by Name or Type to organize your list differently.",
  },

  // ── 13: Filter tabs ──
  {
    kind: "segment",
    narration:
      "Three filter tabs sit below: Recent shows your latest activity, Shared With Me surfaces collaborations, and Favorites pins your best work.",
  },

  // ── 14: Empty state + CTA ──
  {
    kind: "segment",
    narration:
      "Right now the workspace is empty — no recent files yet. The Create Your First Workflow button invites you to get started.",
  },

  // ── 15: Wrap-up ──
  {
    kind: "segment",
    narration:
      "That is Comfy Vibe — a full workspace app with organized projects, smart search, and collaboration built in from day one.",
  },

  // ── 16: Outro ──
  {
    kind: "outro",
    text: "Comfy Vibe",
    subtitle: "comfy-vibe.vercel.app",
    durationMs: 2000,
  },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Move mouse to the center of the first element matching `text` on the page.
 * Falls back to (fallbackX, fallbackY) if not found within 2s.
 * Uses page.getByText() (Playwright locator) then boundingBox — no focus().
 */
async function moveToText(
  page: Page,
  text: string,
  fallbackX = 640,
  fallbackY = 360,
): Promise<void> {
  try {
    const loc = page.getByText(text, { exact: false }).first();
    const box = await loc.boundingBox({ timeout: 2000 }).catch(() => null);
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      return;
    }
  } catch {}
  await page.mouse.move(fallbackX, fallbackY);
}

// ─────────────────────────────────────────────────────────────────────────────
//  PLAYWRIGHT IMPLEMENTATION (consumes VIDEO_SCRIPT above)
// ─────────────────────────────────────────────────────────────────────────────

test("comfy vibe workspace tour", async ({ page }) => {
  test.setTimeout(5 * 60_000);

  await page.goto("https://comfy-vibe.vercel.app/", {
    waitUntil: "domcontentloaded",
  });
  await page.waitForTimeout(3000);

  const script = createVideoScript()
    // ── Title ──
    .title(VIDEO_SCRIPT[0].text, {
      subtitle: VIDEO_SCRIPT[0].subtitle,
      durationMs: VIDEO_SCRIPT[0].durationMs,
    })

    // ── 1: Welcome — sweep across main content area ──
    .segment(VIDEO_SCRIPT[1].narration, async (pace) => {
      await page.mouse.move(640, 360);
      await pace();
      await page.mouse.move(400, 300);
      await pace();
    })

    // ── 2: My Workspace button ──
    .segment(VIDEO_SCRIPT[2].narration, async (pace) => {
      await moveToText(page, "My Workspace", 120, 80);
      await pace();
      await page.mouse.move(120, 100);
      await pace();
    })

    // ── 3: OVERVIEW — Recents, Templates ──
    .segment(VIDEO_SCRIPT[3].narration, async (pace) => {
      await moveToText(page, "Recents", 120, 160);
      await pace();
      await moveToText(page, "Templates", 120, 190);
      await pace();
    })

    // ── 4: OVERVIEW — Tutorials ──
    .segment(VIDEO_SCRIPT[4].narration, async (pace) => {
      await moveToText(page, "Tutorials", 120, 220);
      await pace();
      await page.mouse.move(120, 250);
      await pace();
    })

    // ── 5: PRIVATE — My First Project, Personal Work ──
    .segment(VIDEO_SCRIPT[5].narration, async (pace) => {
      await moveToText(page, "My First Project", 120, 300);
      await pace();
      await moveToText(page, "Personal Work", 120, 330);
      await pace();
    })

    // ── 6: SHARED — Client Project, Portrait Workflow ──
    .segment(VIDEO_SCRIPT[6].narration, async (pace) => {
      await moveToText(page, "Client Project", 120, 390);
      await pace();
      await moveToText(page, "Portrait Workflow", 120, 420);
      await pace();
    })

    // ── 7: SHARED — Custom LoRA, Reference Images ──
    .segment(VIDEO_SCRIPT[7].narration, async (pace) => {
      await moveToText(page, "Custom LoRA", 120, 450);
      await pace();
      await moveToText(page, "Reference Images", 120, 480);
      await pace();
    })

    // ── 8: Trash + Help ──
    .segment(VIDEO_SCRIPT[8].narration, async (pace) => {
      await moveToText(page, "Trash", 120, 560);
      await pace();
      await moveToText(page, "Help", 120, 590);
      await pace();
    })

    // ── 9: Header thumbnails — Simple txt2img, Upscale Pipeline ──
    .segment(VIDEO_SCRIPT[9].narration, async (pace) => {
      await moveToText(page, "Simple txt2img", 400, 150);
      await pace();
      await moveToText(page, "Upscale Pipeline", 600, 150);
      await pace();
    })

    // ── 10: Header thumbnails — Multi-Pass Refiner, Minimal ──
    .segment(VIDEO_SCRIPT[10].narration, async (pace) => {
      await moveToText(page, "Multi-Pass Refiner", 800, 150);
      await pace();
      await moveToText(page, "Minimal", 1000, 150);
      await pace();
    })

    // ── 11: Search bar ──
    .segment(VIDEO_SCRIPT[11].narration, async (pace) => {
      await safeMove(page, 'input[placeholder*="Search" i], input[placeholder*="search"]');
      await pace();
      await page.mouse.move(700, 260);
      await pace();
    })

    // ── 12: Sort dropdown ──
    .segment(VIDEO_SCRIPT[12].narration, async (pace) => {
      await moveToText(page, "Last updated", 900, 290);
      await pace();
      await page.mouse.move(920, 310);
      await pace();
    })

    // ── 13: Filter tabs — Recent, Shared with me, Favorites ──
    .segment(VIDEO_SCRIPT[13].narration, async (pace) => {
      await moveToText(page, "Recent", 450, 330);
      await pace();
      await moveToText(page, "Shared with me", 600, 330);
      await pace();
      await moveToText(page, "Favorites", 750, 330);
      await pace();
    })

    // ── 14: Empty state + Create CTA ──
    .segment(VIDEO_SCRIPT[14].narration, async (pace) => {
      await page.mouse.move(640, 480);
      await pace();
      await moveToText(page, "Create your first workflow", 640, 540);
      await pace();
    })

    // ── 15: Wrap-up — sweep back across workspace ──
    .segment(VIDEO_SCRIPT[15].narration, async (pace) => {
      await page.mouse.move(200, 300);
      await pace();
      await page.mouse.move(640, 360);
      await pace();
    })

    // ── Outro ──
    .outro({
      text: VIDEO_SCRIPT[16].text,
      subtitle: VIDEO_SCRIPT[16].subtitle,
      durationMs: VIDEO_SCRIPT[16].durationMs,
    });

  await script.prepare(page);
  await script.render(page, {
    baseName: "comfy-vibe",
    outputDir: ".comfy-qa/.demos",
  });
});
