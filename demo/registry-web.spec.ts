/**
 * Comfy Registry — registry.comfy.org
 *
 * Story:  demo/stories/registry-web.story.md
 * Output: .comfy-qa/.demos/registry-web.mp4
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *  VIDEO SCRIPT (the source of truth)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * User Journey: A user searches for a ControlNet node, clicks into the detail
 * page, reads the install command and copies it, checks version history, then
 * navigates back and does a second search for video nodes.
 *
 * Coverage: 33/81 (41%)
 *
 * | Feature                          | C | R | U | D | Notes                        |
 * |----------------------------------|---|---|---|---|------------------------------|
 * | Search nodes                     |   | ✅ |   |   | two queries: controlnet+video|
 * | Node detail page                 |   | ✅ |   |   | via click-through            |
 * | Install command (copy)           |   | ✅ |   |   | click Copy button            |
 * | Version history                  |   | ✅ |   |   | scroll on detail page        |
 * | Browse catalog                   |   | ✅ |   |   | hover cards on homepage      |
 * | Logo navigation (home)           |   | ✅ |   |   | click logo → back to home    |
 * | Pagination                       |   | ✅ |   |   | hover pagination controls    |
 * | Publish a node                   | ❌ | ❌ | ❌ | ❌ | auth required                |
 * | Filter by OS                     |   | ❌ |   |   | not demoed                   |
 * | Sort results                     |   | ❌ |   |   | not demoed                   |
 *
 * Segment classification:
 *   NAVIGATE: 3  INTERACT: 5  OBSERVE: 4  Total: 12
 *   Ratio: (3+5)/12 = 67% interactive ✅
 *   Max consecutive OBSERVE: 2 ✅
 */
const VIDEO_SCRIPT = [
  // ── Title ──
  {
    kind: "title",
    text: "Comfy Registry",
    subtitle: "Find and install any ComfyUI node",
    durationMs: 2000,
  },

  // 1 — OBSERVE: landing page first impression
  {
    kind: "segment",
    narration:
      "Welcome to the Comfy Registry — the official hub for every ComfyUI custom node. " +
      "The hero section tells you exactly what this site does, and below it the most popular packages are already visible.",
    visuals: ["safeMove h1", "safeMove main cards area"],
  },

  // 2 — INTERACT: click search bar + type "controlnet"
  {
    kind: "segment",
    narration:
      "Let me search for a ControlNet node — the most common thing people look for here. " +
      "I'll click the search bar and type controlnet to see what comes up.",
    visuals: ["click search input", "typeKeys 'controlnet'"],
  },

  // 3 — OBSERVE: scan search results + scroll
  {
    kind: "segment",
    narration:
      "Results stream in instantly. Each card shows the package name, description, and download count " +
      "so I can evaluate options without clicking into every single one.",
    visuals: ["wheel +400", "hover result cards"],
  },

  // 4 — NAVIGATE: click top result → detail page
  {
    kind: "segment",
    narration:
      "I'll click the top result to see its detail page. Here is the node name, the author, " +
      "and the one-line install command that gets it into my ComfyUI setup.",
    visuals: ["setup: click node link", "safeMove h1", "safeMove code block"],
  },

  // 5 — INTERACT: click Copy button on install command
  {
    kind: "segment",
    narration:
      "The Copy button puts the install command right on my clipboard — one click and I'm ready to paste " +
      "it into my terminal. No need to manually select and copy text.",
    visuals: ["safeMove Copy button", "click Copy button"],
  },

  // 6 — OBSERVE: scroll to version history
  {
    kind: "segment",
    narration:
      "Scrolling down to the version history, I can confirm this node is actively maintained. " +
      "Frequent releases mean the author is keeping up with ComfyUI changes.",
    visuals: ["wheel +600", "safeMove version heading", "wheel +300"],
  },

  // 7 — NAVIGATE: click logo → back to homepage
  {
    kind: "segment",
    narration:
      "Clicking the logo takes me straight back to the homepage. " +
      "The full loop — search, evaluate, copy the install command, and return — took under a minute.",
    visuals: ["setup: click logo", "safeMove h1", "safeMove search bar"],
  },

  // 8 — INTERACT: clear search + type "video"
  {
    kind: "segment",
    narration:
      "Let me do a second search — this time for video nodes, since video generation " +
      "is one of the hottest areas in AI right now. I'll clear the bar and type video.",
    visuals: ["click search", "select all + delete", "typeKeys 'video'"],
  },

  // 9 — OBSERVE: browse video search results
  {
    kind: "segment",
    narration:
      "VideoHelperSuite is right at the top — the go-to package for video workflows. " +
      "Below it are specialized nodes for AnimateDiff, CogVideo, and more.",
    visuals: ["hover result cards", "wheel +300"],
  },

  // 10 — INTERACT: clear search to return to catalog
  {
    kind: "segment",
    narration:
      "Let me clear the search to browse the full catalog again. " +
      "These are the most popular nodes — thousands of users rely on them every day.",
    visuals: ["clear search", "scroll to top", "hover cards"],
  },

  // 11 — NAVIGATE: scroll to pagination
  {
    kind: "segment",
    narration:
      "At the bottom, pagination controls let me browse hundreds more packages across multiple pages. " +
      "Whether I'm searching or browsing, the registry makes finding the right node fast.",
    visuals: ["wheel to bottom", "safeMove pagination", "hover Next button"],
  },

  // 12 — INTERACT: scroll back to top for final CTA
  {
    kind: "segment",
    narration:
      "The Comfy Registry puts the entire ComfyUI ecosystem at your fingertips — search, evaluate, " +
      "and install any node in seconds. Head to registry.comfy.org and start building.",
    visuals: ["scroll to top", "safeMove h1", "safeMove search bar"],
  },

  // ── Outro ──
  {
    kind: "outro",
    text: "Comfy Registry",
    subtitle: "registry.comfy.org",
    durationMs: 2000,
  },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
//  PLAYWRIGHT IMPLEMENTATION (consumes VIDEO_SCRIPT above)
// ─────────────────────────────────────────────────────────────────────────────
import { test, safeMove } from "./fixtures/fixture";
import { createVideoScript } from "../lib/demowright/dist/index.mjs";
// NOTE: typeKeys uses page.evaluate which hangs on registry.comfy.org.
// Use page.keyboard.type() instead — it sends key events directly.

test("comfy registry tour", async ({ page }) => {
  test.setTimeout(15 * 60_000);

  // ── Login to registry (email/password from .env.local) ──
  const regEmail = process.env.GOOGLE_USERNAME ?? "";
  const regPass = process.env.GOOGLE_PASSWORD ?? "";
  if (regEmail && regPass) {
    await page.goto("https://registry.comfy.org/auth/login", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2000);
    const emailBtn = page.locator('button:has-text("Sign In with Email")');
    if (await emailBtn.isVisible().catch(() => false)) {
      await emailBtn.click();
      await page.waitForTimeout(1000);
      await page.locator('input[type="email"]').fill(regEmail);
      await page.locator('input[type="password"]').fill(regPass);
      await page.locator('button:has-text("Sign In")').first().click();
      await page.waitForTimeout(3000);
    }
  }

  // Pre-navigate (heavy work BEFORE script.render)
  await page.goto("https://registry.comfy.org/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(3000);

  const script = createVideoScript()
    // ── Title ──
    .title(VIDEO_SCRIPT[0].text, {
      subtitle: VIDEO_SCRIPT[0].subtitle,
      durationMs: VIDEO_SCRIPT[0].durationMs,
    })

    // 1 — OBSERVE: landing page first impression
    .segment(VIDEO_SCRIPT[1].narration, async (pace) => {
      await safeMove(page, "h1");
      await pace();
      await page.mouse.wheel(0, 200);
      await pace();
      await page.mouse.move(400, 400);
      await pace();
      await page.mouse.move(700, 400);
      await pace();
    })

    // 2 — INTERACT: click search bar + type "controlnet"
    .segment(VIDEO_SCRIPT[2].narration, async (pace) => {
      await page.mouse.wheel(0, -1000);
      const search = page.locator('input[placeholder*="Search"]').first();
      const box = await search.boundingBox().catch(() => null);
      if (box) {
        await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
      }
      await pace();
      await page.keyboard.type("controlnet", { delay: 90 });
      await pace();
    })

    // 3 — OBSERVE: scan search results + scroll
    .segment(VIDEO_SCRIPT[3].narration, async (pace) => {
      await page.mouse.wheel(0, 300);
      await pace();
      await page.mouse.move(400, 400);
      await pace();
      await page.mouse.move(700, 450);
      await pace();
    })

    // 4 — NAVIGATE: click top result → detail page
    .segment(VIDEO_SCRIPT[4].narration, {
      setup: async () => {
        const nodeLink = page.locator('a[href*="/nodes/"]').first();
        const box = await nodeLink.boundingBox().catch(() => null);
        if (box) {
          await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
        } else {
          await nodeLink.click().catch(() => {});
        }
        await page.waitForTimeout(3000);
      },
      action: async (pace) => {
        await safeMove(page, "h1");
        await pace();
        await safeMove(page, "code, pre, [class*='install'], [class*='command']");
        await pace();
        await safeMove(page, 'a[href*="publisher"], [class*="author"], [class*="publisher"]');
        await pace();
      },
    })

    // 5 — INTERACT: click Copy button on install command
    .segment(VIDEO_SCRIPT[5].narration, async (pace) => {
      await safeMove(page, 'button:has-text("Copy"), button[aria-label*="copy"], button[aria-label*="Copy"]');
      await pace();
      // Click the Copy button
      const copyBtn = page.locator('button:has-text("Copy"), button[aria-label*="copy"], button[aria-label*="Copy"]').first();
      const copyBox = await copyBtn.boundingBox().catch(() => null);
      if (copyBox) {
        await page.mouse.click(copyBox.x + copyBox.width / 2, copyBox.y + copyBox.height / 2);
      }
      await pace();
      await safeMove(page, "code, pre");
      await pace();
    })

    // 6 — OBSERVE: scroll to version history
    .segment(VIDEO_SCRIPT[6].narration, async (pace) => {
      await page.mouse.wheel(0, 600);
      await pace();
      await safeMove(page, 'h2:has-text("Version"), h3:has-text("Version"), [class*="version"]');
      await pace();
      await page.mouse.wheel(0, 300);
      await pace();
    })

    // 7 — NAVIGATE: click logo → back to homepage
    .segment(VIDEO_SCRIPT[7].narration, {
      setup: async () => {
        const logo = page.locator('nav a[href="/"], a[href="/"] img, header a[href="/"]').first();
        const box = await logo.boundingBox().catch(() => null);
        if (box) {
          await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
        } else {
          await logo.click().catch(() => {});
        }
        await page.waitForTimeout(3000);
      },
      action: async (pace) => {
        await safeMove(page, "h1");
        await pace();
        await safeMove(page, 'input[placeholder*="Search"]');
        await pace();
      },
    })

    // 8 — INTERACT: clear search + type "video"
    .segment(VIDEO_SCRIPT[8].narration, async (pace) => {
      const search = page.locator('input[placeholder*="Search"]').first();
      const box = await search.boundingBox().catch(() => null);
      if (box) {
        await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
        await page.keyboard.press("Control+A").catch(() => {});
        await page.keyboard.press("Backspace").catch(() => {});
      }
      await pace();
      await page.keyboard.type("video", { delay: 100 });
      await pace();
    })

    // 9 — OBSERVE: browse video search results
    .segment(VIDEO_SCRIPT[9].narration, async (pace) => {
      await page.mouse.move(400, 400);
      await pace();
      await page.mouse.move(700, 420);
      await pace();
      await page.mouse.wheel(0, 300);
      await pace();
    })

    // 10 — INTERACT: clear search to return to catalog
    .segment(VIDEO_SCRIPT[10].narration, async (pace) => {
      const search = page.locator('input[placeholder*="Search"]').first();
      const box = await search.boundingBox().catch(() => null);
      if (box) {
        await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
        await page.keyboard.press("Control+A").catch(() => {});
        await page.keyboard.press("Backspace").catch(() => {});
      }
      await pace();
      await page.mouse.wheel(0, -2000);
      await pace();
      await page.mouse.move(400, 400);
      await pace();
    })

    // 11 — NAVIGATE: scroll to pagination
    .segment(VIDEO_SCRIPT[11].narration, async (pace) => {
      await page.mouse.wheel(0, 3000);
      await pace();
      await safeMove(page, 'nav[aria-label*="pagination"], ul:has(> li > a[href*="page"]), .pagination, [class*="pagination"]');
      await pace();
      await safeMove(page, 'a:has-text("Next"), button:has-text("Next")');
      await pace();
    })

    // 12 — INTERACT: scroll back to top for final CTA
    .segment(VIDEO_SCRIPT[12].narration, async (pace) => {
      await page.mouse.wheel(0, -3000);
      await pace();
      await safeMove(page, "h1");
      await pace();
      await safeMove(page, 'input[placeholder*="Search"]');
      await pace();
    })

    // ── Outro ──
    .outro({
      text: VIDEO_SCRIPT[13].text,
      subtitle: VIDEO_SCRIPT[13].subtitle,
      durationMs: VIDEO_SCRIPT[13].durationMs,
    });

  await script.prepare(page);
  await script.render(page, {
    baseName: "registry-web",
    outputDir: ".comfy-qa/.demos",
  });
});
