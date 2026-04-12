/**
 * Comfy Registry — Node Detail Page
 *
 * Story:  demo/stories/registry-node-detail.story.md
 * Output: .comfy-qa/.demos/registry-node-detail.mp4
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *  VIDEO SCRIPT (the source of truth)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * User Journey: A user evaluates a node — reads the name and author, copies
 * the install command, scrolls through README and version history, then
 * clicks View Repository to see the GitHub link.
 *
 * Coverage: 11/13 (85%)
 *
 * | Feature                          | R | Notes                              |
 * |----------------------------------|---|------------------------------------|
 * | Node name (H1)                   | ✅ | ComfyUI-KJNodes                    |
 * | Publisher identity               | ✅ | @kijai author badge                |
 * | Install command code block       | ✅ | comfy node install                 |
 * | Copy button                      | ✅ | click (INTERACT)                   |
 * | README markdown rendering        | ✅ | scroll through                     |
 * | Version history heading          | ✅ | scroll + read                      |
 * | Latest version + date            | ✅ | hover version entry                |
 * | View Repository (GitHub)         | ✅ | hover link                         |
 * | Breadcrumb navigation            | ✅ | click Home breadcrumb link         |
 * | Metadata (downloads/stars)       | ✅ | hover                              |
 * | CLI docs link                    | ✅ | hover                              |
 * | Description section              | ❌ | merged into README scroll          |
 * | Older versions scroll            | ❌ | single scroll covers latest+older  |
 *
 * Segment classification:
 *   NAVIGATE: 1  INTERACT: 3  OBSERVE: 4  Total: 8
 *   Ratio: (1+3)/8 = 50% interactive ✅
 *   Max consecutive OBSERVE: 2 ✅
 */
const VIDEO_SCRIPT = [
  // ── Title ──
  {
    kind: "title",
    text: "Comfy Registry",
    subtitle: "Node Detail Page",
    durationMs: 2000,
  },

  // 1 — OBSERVE: node heading + author identity
  {
    kind: "segment",
    narration:
      "I'm looking at ComfyUI-KJNodes — one of the most popular utility packs in the ecosystem. " +
      "The heading shows the node name clearly, and right below it the author @kijai gives you accountability.",
    visuals: ["safeMove h1", "safeMove author link"],
  },

  // 2 — OBSERVE: metadata — downloads, stars, breadcrumb
  {
    kind: "segment",
    narration:
      "The metadata section shows over three million downloads and thousands of stars — " +
      "clear signals that this is a battle-tested, community-approved package. The breadcrumb at the top shows exactly where I am.",
    visuals: ["safeMove downloads", "safeMove stars", "safeMove breadcrumb"],
  },

  // 3 — INTERACT: click Copy button on install command
  {
    kind: "segment",
    narration:
      "Here is the install command — one line in the terminal and the entire pack is installed. " +
      "I'll click Copy to put it on my clipboard, ready to paste.",
    visuals: ["safeMove code block", "click Copy button"],
  },

  // 4 — INTERACT: scroll through README content
  {
    kind: "segment",
    narration:
      "Scrolling into the README, the full GitHub documentation is rendered right here — " +
      "formatted markdown with images and code blocks, without leaving the registry.",
    visuals: ["wheel +500", "hover README content", "wheel +400"],
  },

  // 5 — OBSERVE: version history
  {
    kind: "segment",
    narration:
      "Further down is the version history. Frequent releases like these tell me the author " +
      "is committed to keeping things working with every ComfyUI update.",
    visuals: ["wheel +500", "safeMove version heading", "wheel +300"],
  },

  // 6 — INTERACT: hover View Repository link
  {
    kind: "segment",
    narration:
      "The View Repository link takes me straight to GitHub — source code, issue tracker, " +
      "and community discussions all live there. Let me scroll back up to find it.",
    visuals: ["wheel -2000", "safeMove View Repository link"],
  },

  // 7 — NAVIGATE: click breadcrumb Home to navigate back
  {
    kind: "segment",
    narration:
      "I can click the Home breadcrumb to go back to the registry homepage. " +
      "In just a few scrolls, I've evaluated who made this node, how to install it, and whether it's well maintained.",
    visuals: ["setup: click Home breadcrumb", "safeMove h1", "safeMove search bar"],
  },

  // 8 — OBSERVE: final summary on homepage
  {
    kind: "segment",
    narration:
      "That is the power of a proper registry — search, evaluate, copy the install command, " +
      "check the version history, and go. Everything a developer needs in one place.",
    visuals: ["safeMove h1", "safeMove main cards"],
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
//  PLAYWRIGHT IMPLEMENTATION
// ─────────────────────────────────────────────────────────────────────────────
import { test, safeMove } from "./fixtures/fixture";
import { createVideoScript } from "../lib/demowright/dist/index.mjs";

test("comfy registry node detail tour", async ({ page }) => {
  test.setTimeout(10 * 60_000);

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

  // Pre-navigate to a popular node detail page
  await page.goto("https://registry.comfy.org/nodes/comfyui-kjnodes", {
    waitUntil: "domcontentloaded",
  });
  await page.waitForTimeout(3000);

  const script = createVideoScript()
    .title(VIDEO_SCRIPT[0].text, {
      subtitle: VIDEO_SCRIPT[0].subtitle,
      durationMs: VIDEO_SCRIPT[0].durationMs,
    })

    // 1 — OBSERVE: node heading + author identity
    .segment(VIDEO_SCRIPT[1].narration, async (pace) => {
      await safeMove(page, "h1");
      await pace();
      await safeMove(page, 'a[href*="kijai"], a[href*="publisher"], [class*="author"], [class*="publisher"]');
      await pace();
    })

    // 2 — OBSERVE: metadata — downloads, stars, breadcrumb
    .segment(VIDEO_SCRIPT[2].narration, async (pace) => {
      await safeMove(page, '[class*="download"], [class*="stat"]:first-of-type');
      await pace();
      await safeMove(page, '[class*="star"], [class*="stat"]:last-of-type');
      await pace();
      await safeMove(page, 'nav[aria-label="breadcrumb"], [class*="breadcrumb"]');
      await pace();
    })

    // 3 — INTERACT: click Copy button on install command
    .segment(VIDEO_SCRIPT[3].narration, async (pace) => {
      await safeMove(page, "code, pre");
      await pace();
      // Click the Copy button
      const copyBtn = page.locator('button:has-text("Copy"), button[aria-label*="copy"], button[aria-label*="Copy"]').first();
      const copyBox = await copyBtn.boundingBox().catch(() => null);
      if (copyBox) {
        await page.mouse.click(copyBox.x + copyBox.width / 2, copyBox.y + copyBox.height / 2);
      }
      await pace();
      await safeMove(page, 'a[href*="comfy-cli"], a[href*="getting-started"], a[href*="install-cli"]');
      await pace();
    })

    // 4 — INTERACT: scroll through README content
    .segment(VIDEO_SCRIPT[4].narration, async (pace) => {
      await page.mouse.wheel(0, 500);
      await pace();
      await safeMove(page, '[class*="readme"] img, [class*="markdown"] img, article img');
      await pace();
      await page.mouse.wheel(0, 400);
      await pace();
    })

    // 5 — OBSERVE: version history
    .segment(VIDEO_SCRIPT[5].narration, async (pace) => {
      await page.mouse.wheel(0, 500);
      await pace();
      await safeMove(page, 'h2:has-text("Version"), h2:has-text("version")');
      await pace();
      await page.mouse.wheel(0, 300);
      await pace();
    })

    // 6 — INTERACT: hover View Repository link
    .segment(VIDEO_SCRIPT[6].narration, async (pace) => {
      await page.mouse.wheel(0, -2000);
      await page.waitForTimeout(500);
      await safeMove(page, 'a:has-text("View Repository"), a:has-text("Repository"), a[href*="github.com"]');
      await pace();
      await safeMove(page, "h1");
      await pace();
    })

    // 7 — NAVIGATE: click breadcrumb Home to navigate back
    .segment(VIDEO_SCRIPT[7].narration, {
      setup: async () => {
        const homeLink = page.locator('nav[aria-label="breadcrumb"] a:first-child, [class*="breadcrumb"] a:first-child, a[href="/"]').first();
        const box = await homeLink.boundingBox().catch(() => null);
        if (box) {
          await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
        } else {
          await homeLink.click().catch(() => {});
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

    // 8 — OBSERVE: final summary on homepage
    .segment(VIDEO_SCRIPT[8].narration, async (pace) => {
      await safeMove(page, "h1");
      await pace();
      await page.mouse.move(400, 400);
      await pace();
      await page.mouse.move(700, 400);
      await pace();
    })

    .outro({
      text: VIDEO_SCRIPT[9].text,
      subtitle: VIDEO_SCRIPT[9].subtitle,
      durationMs: VIDEO_SCRIPT[9].durationMs,
    });

  await script.prepare(page);
  await script.render(page, {
    baseName: "registry-node-detail",
    outputDir: ".comfy-qa/.demos",
  });
});
