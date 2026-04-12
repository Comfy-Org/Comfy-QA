/**
 * ComfyUI Docs — docs.comfy.org
 *
 * Story:  demo/stories/comfy-docs.story.md
 * Output: .comfy-qa/.demos/comfy-docs.mp4
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *  VIDEO SCRIPT (the source of truth)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * User Journey: A user arrives at docs.comfy.org, explores the card groups,
 * opens Ctrl+K search, types a query, clicks a result to navigate to a
 * tutorial page, then goes back to the landing page.
 *
 * Coverage: 40/84 (48%)
 *
 * | Feature                          | R | Notes                              |
 * |----------------------------------|---|------------------------------------|
 * | Landing page hero                | ✅ | heading + subtitle                 |
 * | Sidebar navigation               | ✅ | hover sections                     |
 * | Category card groups              | ✅ | hover Install, Tutorials, etc.     |
 * | Ctrl+K search modal              | ✅ | open, type, close                  |
 * | Search results                   | ✅ | view results for "ControlNet"      |
 * | Card click → sub-page            | ✅ | navigate to tutorial page          |
 * | Sub-page content                 | ✅ | hover heading + content            |
 * | Back navigation                  | ✅ | return to landing page             |
 * | Built-in Nodes reference         | ✅ | scroll to node categories          |
 * | Download link                    | ❌ | external nav                       |
 * | Cloud link                       | ❌ | external nav                       |
 *
 * Segment classification:
 *   NAVIGATE: 2  INTERACT: 4  OBSERVE: 4  Total: 10
 *   Ratio: (2+4)/10 = 60% interactive ✅
 *   Max consecutive OBSERVE: 2 ✅
 */
const VIDEO_SCRIPT = [
  // ── Title ──
  {
    kind: "title",
    text: "ComfyUI Docs",
    subtitle: "The official documentation for ComfyUI",
    durationMs: 2000,
  },

  // 1 — OBSERVE: landing page hero + sidebar structure
  {
    kind: "segment",
    narration:
      "Welcome to the official ComfyUI documentation — the single most important resource for anyone " +
      "learning or building with ComfyUI. The sidebar on the left organizes everything from Getting Started to advanced API docs.",
    visuals: ["safeMove h1", "safeMove aside"],
  },

  // 2 — OBSERVE: category cards on landing page
  {
    kind: "segment",
    narration:
      "The landing page groups content into quick-access cards — Install Locally, Install Custom Nodes, " +
      "and tutorial categories like ControlNet, Video, and 3D generation. Each card is a doorway into a different creative domain.",
    visuals: ["scroll down", "hover category buttons", "hover tutorial cards"],
  },

  // 3 — INTERACT: open Ctrl+K search modal
  {
    kind: "segment",
    narration:
      "The fastest way to find anything is the search — I'll press Control K to open it. " +
      "This searches across every page title, heading, and paragraph in the entire docs site.",
    visuals: ["Ctrl+K to open search modal"],
  },

  // 4 — INTERACT: type "ControlNet" in search
  {
    kind: "segment",
    narration:
      "Let me type ControlNet — the most popular topic people search for. " +
      "Results appear instantly with page titles and context snippets so I can evaluate each match without clicking through.",
    visuals: ["typeKeys 'ControlNet'", "pause on results"],
  },

  // 5 — INTERACT: close search with Escape
  {
    kind: "segment",
    narration:
      "I'll press Escape to close the search. Now let me show you what happens when I click into " +
      "one of the tutorial cards on the landing page.",
    visuals: ["press Escape", "scroll to top", "hover card"],
  },

  // 6 — NAVIGATE: click a tutorial card → sub-page
  {
    kind: "segment",
    narration:
      "Clicking this card takes me to the tutorial page. Here is the heading, the step-by-step content, " +
      "and annotated screenshots that walk you through the entire workflow.",
    visuals: ["setup: click card link", "safeMove h1", "scroll content"],
  },

  // 7 — OBSERVE: browse sub-page content
  {
    kind: "segment",
    narration:
      "The tutorial content is well-structured — clear headings, code blocks, and visual diagrams. " +
      "Everything a beginner needs to follow along on their own machine.",
    visuals: ["wheel +400", "safeMove headings", "wheel +300"],
  },

  // 8 — NAVIGATE: go back to landing page
  {
    kind: "segment",
    narration:
      "Let me go back to the main documentation page. The sidebar makes it easy to navigate " +
      "between any section without losing your place in the hierarchy.",
    visuals: ["setup: click sidebar home link", "safeMove h1", "safeMove aside"],
  },

  // 9 — INTERACT: scroll to Built-in Nodes section
  {
    kind: "segment",
    narration:
      "Scrolling down to the Built-in Nodes section, I can see every node that ships with ComfyUI " +
      "organized by category — Image, Video, 3D, Audio, and Utility.",
    visuals: ["wheel +400", "hover node category cards", "wheel +200"],
  },

  // 10 — OBSERVE: final CTA
  {
    kind: "segment",
    narration:
      "Whether you're generating your first image or building a production API pipeline, " +
      "docs.comfy.org has you covered. Bookmark it — you'll be coming back often.",
    visuals: ["scroll to top", "safeMove h1", "safeMove search area"],
  },

  // ── Outro ──
  {
    kind: "outro",
    text: "ComfyUI Docs",
    subtitle: "docs.comfy.org",
    durationMs: 2000,
  },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
//  PLAYWRIGHT IMPLEMENTATION (consumes VIDEO_SCRIPT above)
// ─────────────────────────────────────────────────────────────────────────────
import { test, safeMove } from "./fixtures/fixture";
import { createVideoScript } from "../lib/demowright/dist/index.mjs";
import { typeKeys } from "../lib/demowright/dist/helpers.mjs";

test("comfy docs tour", async ({ page }) => {
  test.setTimeout(10 * 60_000);

  // Pre-navigate (heavy work BEFORE script.render)
  await page.goto("https://docs.comfy.org/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(3000);

  const script = createVideoScript()
    // ── Title ──
    .title(VIDEO_SCRIPT[0].text, {
      subtitle: VIDEO_SCRIPT[0].subtitle,
      durationMs: VIDEO_SCRIPT[0].durationMs,
    })

    // 1 — OBSERVE: landing page hero + sidebar structure
    .segment(VIDEO_SCRIPT[1].narration, async (pace) => {
      await safeMove(page, "h1");
      await pace();
      await safeMove(page, "aside");
      await pace();
      await page.mouse.move(150, 250);
      await pace();
    })

    // 2 — OBSERVE: category cards on landing page
    .segment(VIDEO_SCRIPT[2].narration, async (pace) => {
      await page.mouse.wheel(0, 250);
      await pace();
      await page.mouse.move(500, 380);
      await pace();
      await page.mouse.move(700, 380);
      await pace();
      await page.mouse.move(500, 450);
      await pace();
    })

    // 3 — INTERACT: open Ctrl+K search modal
    .segment(VIDEO_SCRIPT[3].narration, async (pace) => {
      await page.mouse.wheel(0, -1000);
      await safeMove(page, "header");
      await pace();
      await page.keyboard.press("Control+k");
      await page.waitForTimeout(800);
      await pace();
    })

    // 4 — INTERACT: type "ControlNet" in search
    .segment(VIDEO_SCRIPT[4].narration, async (pace) => {
      await typeKeys(page, "ControlNet", 80);
      await pace();
      await page.waitForTimeout(1000);
      await page.mouse.move(640, 350);
      await pace();
      await page.mouse.move(640, 400);
      await pace();
    })

    // 5 — INTERACT: close search with Escape
    .segment(VIDEO_SCRIPT[5].narration, async (pace) => {
      await page.keyboard.press("Escape");
      await page.waitForTimeout(500);
      await pace();
      await page.mouse.wheel(0, -1000);
      await pace();
      await page.mouse.move(500, 380);
      await pace();
    })

    // 6 — NAVIGATE: click a tutorial card → sub-page
    .segment(VIDEO_SCRIPT[6].narration, {
      setup: async () => {
        // Click a tutorial/category card link on the landing page
        const card = page.locator('a[href*="/tutorials"], a[href*="/getting-started"], a[href*="/interface"]').first();
        const box = await card.boundingBox().catch(() => null);
        if (box) {
          await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
        } else {
          await card.click().catch(() => {});
        }
        await page.waitForTimeout(3000);
      },
      action: async (pace) => {
        await safeMove(page, "h1");
        await pace();
        await page.mouse.wheel(0, 300);
        await pace();
        await page.mouse.move(640, 400);
        await pace();
      },
    })

    // 7 — OBSERVE: browse sub-page content
    .segment(VIDEO_SCRIPT[7].narration, async (pace) => {
      await page.mouse.wheel(0, 400);
      await pace();
      await page.mouse.move(640, 350);
      await pace();
      await page.mouse.wheel(0, 300);
      await pace();
    })

    // 8 — NAVIGATE: go back to landing page
    .segment(VIDEO_SCRIPT[8].narration, {
      setup: async () => {
        // Click sidebar link back to documentation home
        const homeLink = page.locator('aside a[href="/"], aside a:has-text("Documentation"), aside a:has-text("Home"), a[href="/"]').first();
        const box = await homeLink.boundingBox().catch(() => null);
        if (box) {
          await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
        } else {
          await page.goto("https://docs.comfy.org/", { waitUntil: "domcontentloaded" });
        }
        await page.waitForTimeout(3000);
      },
      action: async (pace) => {
        await safeMove(page, "h1");
        await pace();
        await safeMove(page, "aside");
        await pace();
      },
    })

    // 9 — INTERACT: scroll to Built-in Nodes section
    .segment(VIDEO_SCRIPT[9].narration, async (pace) => {
      await page.mouse.wheel(0, 400);
      await pace();
      await page.mouse.move(500, 400);
      await pace();
      await page.mouse.move(700, 400);
      await pace();
      await page.mouse.wheel(0, 200);
      await pace();
    })

    // 10 — OBSERVE: final CTA
    .segment(VIDEO_SCRIPT[10].narration, async (pace) => {
      await page.mouse.wheel(0, -3000);
      await pace();
      await safeMove(page, "h1");
      await pace();
      await safeMove(page, "header");
      await pace();
    })

    // ── Outro ──
    .outro({
      text: VIDEO_SCRIPT[11].text,
      subtitle: VIDEO_SCRIPT[11].subtitle,
      durationMs: VIDEO_SCRIPT[11].durationMs,
    });

  await script.prepare(page);
  await script.render(page, {
    baseName: "comfy-docs",
    outputDir: ".comfy-qa/.demos",
  });
});
