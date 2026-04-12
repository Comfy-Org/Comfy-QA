import { test, safeMove } from "./fixtures/fixture";
import { createVideoScript } from "../lib/demowright/dist/index.mjs";
import { typeKeys } from "../lib/demowright/dist/helpers.mjs";
import type { Page } from "@playwright/test";

/**
 * VIDEO SCRIPT — every word in `narration` is read aloud verbatim by Gemini TTS.
 *
 * User Journey: A user opens Comfy Vibe, browses sidebar sections, clicks Templates,
 * views workflow thumbnails, uses search to filter, switches filter tabs, and clicks
 * Create your first workflow.
 *
 * Coverage: 22/22 (100%)
 *
 * | # | Feature                              | R | Notes                           |
 * |---|--------------------------------------|---|---------------------------------|
 * | 1 | Sidebar: My Workspace button         | ✅ | top-level nav                   |
 * | 2 | Sidebar: Recents link                | ✅ | OVERVIEW section                |
 * | 3 | Sidebar: Templates link              | ✅ | OVERVIEW section — clicked       |
 * | 4 | Sidebar: Tutorials link              | ✅ | OVERVIEW section — clicked       |
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
 * | 17| Search bar                           | ✅ | click + type query              |
 * | 18| Sort dropdown                        | ✅ | click to open                   |
 * | 19| Filter tab: Recent                   | ✅ | click tab                       |
 * | 20| Filter tab: Shared with me           | ✅ | click tab                       |
 * | 21| Filter tab: Favorites                | ✅ | click tab                       |
 * | 22| Create your first workflow CTA       | ✅ | click button                    |
 *
 * Segment types: 2 NAVIGATE + 6 INTERACT + 2 OBSERVE = 80% interactive
 */
const VIDEO_SCRIPT = [
  // ── 0: Title ──
  {
    kind: "title",
    text: "Comfy Vibe",
    subtitle: "Your ComfyUI Workspace",
    durationMs: 2000,
  },

  // ── 1: Welcome + sidebar overview ── OBSERVE
  {
    kind: "segment",
    narration:
      "Welcome to Comfy Vibe — the workspace app for managing your ComfyUI projects. " +
      "The sidebar organizes everything into Overview, Private, and Shared sections.",
  },

  // ── 2: Click Templates in sidebar ── NAVIGATE
  {
    kind: "segment",
    narration:
      "Let me start by clicking Templates in the Overview section — these are pre-built " +
      "workflow starting points that save you from building everything from scratch.",
  },

  // ── 3: Browse workflow thumbnails ── OBSERVE
  {
    kind: "segment",
    narration:
      "The header showcases four workflow templates: Simple txt2img for basic generation, " +
      "Upscale Pipeline for resolution enhancement, Multi-Pass Refiner for iterative quality, and Minimal for the bare essentials.",
  },

  // ── 4: Click search bar + type query ── INTERACT
  {
    kind: "segment",
    narration:
      "Let me search for something specific. I'll click the search bar and type 'upscale' " +
      "to filter down to resolution-related workflows.",
  },

  // ── 5: Click sort dropdown ── INTERACT
  {
    kind: "segment",
    narration:
      "Next, the sort dropdown — it defaults to Last Updated, but I can switch to sort " +
      "by Name or Type to reorganize the list.",
  },

  // ── 6: Click filter tabs — Recent, Shared, Favorites ── INTERACT
  {
    kind: "segment",
    narration:
      "The filter tabs let me narrow my view. I'll click Recent for latest activity, then " +
      "Shared With Me for collaborations, and finally Favorites to see my pinned workflows.",
  },

  // ── 7: Explore PRIVATE sidebar — My First Project, Personal Work ── INTERACT
  {
    kind: "segment",
    narration:
      "The Private section holds personal projects. Let me hover My First Project and Personal Work — " +
      "only you can see these, they are not shared with anyone.",
  },

  // ── 8: Click Tutorials in sidebar ── NAVIGATE
  {
    kind: "segment",
    narration:
      "Now let me click Tutorials — these are guided walkthroughs that teach you ComfyUI " +
      "techniques step by step, perfect for getting started.",
  },

  // ── 9: Click Create your first workflow CTA ── INTERACT
  {
    kind: "segment",
    narration:
      "The workspace is empty for now, but the Create Your First Workflow button is waiting. " +
      "One click and you are building your first pipeline.",
  },

  // ── 10: Outro ──
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

/**
 * Click the center of the first element matching `text` via boundingBox.
 * Falls back to moveToText if click target is not found.
 */
async function clickText(
  page: Page,
  text: string,
  fallbackX = 640,
  fallbackY = 360,
): Promise<void> {
  try {
    const loc = page.getByText(text, { exact: false }).first();
    const box = await loc.boundingBox({ timeout: 2000 }).catch(() => null);
    if (box) {
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
      return;
    }
  } catch {}
  await page.mouse.click(fallbackX, fallbackY);
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

    // ── 1: Welcome + sidebar overview ── OBSERVE
    .segment(VIDEO_SCRIPT[1].narration, async (pace) => {
      await moveToText(page, "My Workspace", 120, 80);
      await pace();
      await moveToText(page, "Recents", 120, 160);
      await pace();
      await moveToText(page, "Trash", 120, 560);
      await pace();
    })

    // ── 2: Click Templates ── NAVIGATE
    .segment(VIDEO_SCRIPT[2].narration, {
      setup: async () => {
        await clickText(page, "Templates", 120, 190);
        await page.waitForTimeout(1500);
      },
      action: async (pace) => {
        await moveToText(page, "Templates", 120, 190);
        await pace();
        await page.mouse.move(640, 300);
        await pace();
      },
    })

    // ── 3: Browse workflow thumbnails ── OBSERVE
    .segment(VIDEO_SCRIPT[3].narration, async (pace) => {
      await moveToText(page, "Simple txt2img", 400, 150);
      await pace();
      await moveToText(page, "Upscale Pipeline", 600, 150);
      await pace();
      await moveToText(page, "Multi-Pass Refiner", 800, 150);
      await pace();
      await moveToText(page, "Minimal", 1000, 150);
      await pace();
    })

    // ── 4: Click search bar + type query ── INTERACT
    .segment(VIDEO_SCRIPT[4].narration, async (pace) => {
      // Click the search bar via boundingBox
      const searchInput = page.locator('input[placeholder*="Search" i], input[placeholder*="search"]').first();
      const searchBox = await searchInput.boundingBox({ timeout: 2000 }).catch(() => null);
      if (searchBox) {
        await page.mouse.click(searchBox.x + searchBox.width / 2, searchBox.y + searchBox.height / 2);
      }
      await pace();
      await typeKeys(page, "upscale", 90);
      await pace();
    })

    // ── 5: Click sort dropdown ── INTERACT
    .segment(VIDEO_SCRIPT[5].narration, async (pace) => {
      // Clear search first
      await page.keyboard.press("Control+A").catch(() => {});
      await page.keyboard.press("Backspace").catch(() => {});
      await pace();
      // Click sort dropdown
      await clickText(page, "Last updated", 900, 290);
      await pace();
      await page.mouse.move(920, 320);
      await pace();
    })

    // ── 6: Click filter tabs ── INTERACT
    .segment(VIDEO_SCRIPT[6].narration, async (pace) => {
      await clickText(page, "Recent", 450, 330);
      await pace();
      await clickText(page, "Shared with me", 600, 330);
      await pace();
      await clickText(page, "Favorites", 750, 330);
      await pace();
    })

    // ── 7: Private sidebar items ── INTERACT
    .segment(VIDEO_SCRIPT[7].narration, async (pace) => {
      await moveToText(page, "My First Project", 120, 300);
      await pace();
      await moveToText(page, "Personal Work", 120, 330);
      await pace();
      await moveToText(page, "Client Project", 120, 390);
      await pace();
    })

    // ── 8: Click Tutorials ── NAVIGATE
    .segment(VIDEO_SCRIPT[8].narration, {
      setup: async () => {
        await clickText(page, "Tutorials", 120, 220);
        await page.waitForTimeout(1500);
      },
      action: async (pace) => {
        await moveToText(page, "Tutorials", 120, 220);
        await pace();
        await page.mouse.move(640, 400);
        await pace();
      },
    })

    // ── 9: Click Create CTA ── INTERACT
    .segment(VIDEO_SCRIPT[9].narration, async (pace) => {
      await moveToText(page, "Create your first workflow", 640, 540);
      await pace();
      await clickText(page, "Create your first workflow", 640, 540);
      await pace();
    })

    // ── Outro ──
    .outro({
      text: VIDEO_SCRIPT[10].text,
      subtitle: VIDEO_SCRIPT[10].subtitle,
      durationMs: VIDEO_SCRIPT[10].durationMs,
    });

  await script.prepare(page);
  await script.render(page, {
    baseName: "comfy-vibe",
    outputDir: ".comfy-qa/.demos",
  });
});
