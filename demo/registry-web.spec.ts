/**
 * Comfy Registry — registry.comfy.org
 *
 * Story:  demo/stories/registry-web.story.md
 * Output: .comfy-qa/.demos/registry-web.mp4
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
 *    4. Each segment ~6–10 seconds at 140 wpm => 14–24 words is the sweet spot.
 *    5. Total: ~30 segments across 8 chapters, video ~8–10 min.
 *
 *  Structure:
 *    Intro              — title card + 2 segments
 *    Ch 1: Landing Page — title card + 3 segments
 *    Ch 2: Searching    — title card + 4 segments
 *    Ch 3: Filters      — title card + 3 segments
 *    Ch 4: Node Detail  — title card + 5 segments
 *    Ch 5: Publisher    — title card + 3 segments
 *    Ch 6: Docs         — title card + 2 segments
 *    Outro              — 1 segment + conclusion card
 */

const VS = [
  // ── Intro (0–2) ──
  /* 0  */ { kind: "title", text: "Comfy Registry", subtitle: "The official package manager for ComfyUI custom nodes", narration: "Welcome to the Comfy Registry — the central hub for every custom node in the ComfyUI ecosystem.", durationMs: 3000 },
  /* 1  */ { kind: "segment", narration: "If you've ever spent an hour digging through GitHub repos trying to find the right custom node, you know the pain. Broken links, outdated code, no install instructions." },
  /* 2  */ { kind: "segment", narration: "The Comfy Registry solves all of that. Verified packages, semantic versioning, one-command installs. Let me give you the full tour." },

  // ── Chapter 1: Landing Page Tour (3–6) ──
  /* 3  */ { kind: "title", text: "Landing Page Tour", subtitle: "Your front door to the ComfyUI ecosystem", durationMs: 2000 },
  /* 4  */ { kind: "segment", narration: "The hero section puts the search bar front and center — it's the most-used feature on the entire site, and for good reason." },
  /* 5  */ { kind: "segment", narration: "Scroll down and you'll see trending nodes. These are the packages the community is installing right now — a great way to discover what's popular." },
  /* 6  */ { kind: "segment", narration: "Below that, ecosystem stats show total nodes, publishers, and downloads. This registry is growing fast — thousands of packages and counting." },

  // ── Chapter 2: Searching for Nodes (7–11) ──
  /* 7  */ { kind: "title", text: "Searching for Nodes", subtitle: "Algolia-powered instant search across every package", durationMs: 2000 },
  /* 8  */ { kind: "segment", narration: "I'll click the search bar and type SUPIR — a popular image upscaling model. Watch how results stream in as I type each letter." },
  /* 9  */ { kind: "segment", narration: "The live suggestions narrow down instantly. Algolia powers this search, so it's fast even across thousands of packages." },
  /* 10 */ { kind: "segment", narration: "Each result card shows the package name, latest version, publisher, download count, and tags. Enough to decide at a glance." },
  /* 11 */ { kind: "segment", narration: "I can scroll through to compare alternatives. The ecosystem has dozens of upscaling nodes, and the registry makes it easy to evaluate them side by side." },

  // ── Chapter 3: Filters and Sorting (12–15) ──
  /* 12 */ { kind: "title", text: "Filters and Sorting", subtitle: "Narrow results by OS, accelerator, and sort order", durationMs: 2000 },
  /* 13 */ { kind: "segment", narration: "Let me head to the browse page. Here I can filter by operating system — Windows, macOS, or Linux — to see only compatible nodes." },
  /* 14 */ { kind: "segment", narration: "There's also an accelerator filter for CUDA, ROCm, or MPS. If you're on an AMD GPU, this saves you from installing nodes that only work with NVIDIA." },
  /* 15 */ { kind: "segment", narration: "I'll change the sort order to most downloads. Pagination keeps things snappy — even with thousands of results, each page loads instantly." },

  // ── Chapter 4: Node Detail Page (16–21) ──
  /* 16 */ { kind: "title", text: "Node Detail Page", subtitle: "Everything you need to evaluate before you install", durationMs: 2000 },
  /* 17 */ { kind: "segment", narration: "I'll click into the top result. The header shows the node icon, name, publisher badge, and tags — trust signals you can verify at a glance." },
  /* 18 */ { kind: "segment", narration: "Scrolling down, the README explains what this node does, what models it supports, and how to configure it. This is documentation that used to be scattered across GitHub wikis." },
  /* 19 */ { kind: "segment", narration: "Here's the install command. I'll hover the copy button — paste this into your terminal and the node installs automatically. No git cloning required." },
  /* 20 */ { kind: "segment", narration: "The version history shows every release with a changelog. Frequent updates mean active maintenance — that's a strong trust signal." },
  /* 21 */ { kind: "segment", narration: "Further down, I can see dependencies, supported operating systems, accelerators, GitHub link, license info, and the list of contained ComfyUI nodes." },

  // ── Chapter 5: Publisher Ecosystem (22–25) ──
  /* 22 */ { kind: "title", text: "Publisher Ecosystem", subtitle: "Meet the people behind the nodes", durationMs: 2000 },
  /* 23 */ { kind: "segment", narration: "Back at the top, clicking the publisher name takes me to their profile page. Here I can see their logo, bio, and member list." },
  /* 24 */ { kind: "segment", narration: "Below the profile, all of their published nodes are listed. If I trust one package from a publisher, I'm likely to trust their others too." },
  /* 25 */ { kind: "segment", narration: "Verified publishers have gone through a review process. That badge means the code has been checked and meets quality standards." },

  // ── Chapter 6: Docs Integration (26–28) ──
  /* 26 */ { kind: "title", text: "Docs Integration", subtitle: "From browsing to building — publish your own node", durationMs: 2000 },
  /* 27 */ { kind: "segment", narration: "In the footer, there's a link to the registry documentation. This covers API endpoints, publishing workflows, and packaging requirements." },
  /* 28 */ { kind: "segment", narration: "If you're building custom nodes, the docs walk you through publishing step by step. Your node gets its own page, version tracking, and download stats." },

  // ── Outro (29–30) ──
  /* 29 */ { kind: "segment", narration: "That's the full Comfy Registry experience. Search, filter, evaluate, install — the whole flow takes under a minute for any node in the ecosystem." },
  /* 30 */ { kind: "outro", text: "Comfy Registry", subtitle: "registry.comfy.org", narration: "With the Comfy Registry you get instant search, OS and accelerator filters, verified publishers, one-command installs, version tracking, and a growing library of community nodes. Start exploring at registry.comfy.org.", durationMs: 3000 },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
//  PLAYWRIGHT IMPLEMENTATION (consumes VIDEO_SCRIPT above)
// ─────────────────────────────────────────────────────────────────────────────
import { test, safeMove } from "./fixtures/fixture";
import { createVideoScript } from "../lib/demowright/dist/index.mjs";
import { typeKeys } from "../lib/demowright/dist/helpers.mjs";

test("comfy registry tour", async ({ page }) => {
  test.setTimeout(10 * 60_000);

  const REGISTRY_URL = process.env.REGISTRY_URL ?? "https://registry.comfy.org/";
  await page.goto(REGISTRY_URL, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);

  // Track URLs for navigation between segments
  let detailUrl = "";
  let publisherUrl = "";

  const script = createVideoScript()

    // ═══════════════════════════════════════════════════════════════════════
    //  INTRO
    // ═══════════════════════════════════════════════════════════════════════

    .title(VS[0].text, {
      subtitle: VS[0].subtitle,
      narration: VS[0].narration,
      durationMs: VS[0].durationMs,
    })

    // Segment 1 — The pain of finding custom nodes manually
    .segment(VS[1].narration, async (pace) => {
      await safeMove(page, "h1");
      await pace();
      await safeMove(page, "main");
      await pace();
    })

    // Segment 2 — The registry solves it
    .segment(VS[2].narration, async (pace) => {
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" })).catch(() => {});
      await pace();
      await safeMove(page, 'input[type="search"], input[placeholder*="Search"], input[placeholder*="search"]');
      await pace();
    })

    // ═══════════════════════════════════════════════════════════════════════
    //  CHAPTER 1: Landing Page Tour
    // ═══════════════════════════════════════════════════════════════════════

    .title(VS[3].text, {
      subtitle: VS[3].subtitle,
      durationMs: VS[3].durationMs,
    })

    // Segment 4 — Hero and search bar prominence
    .segment(VS[4].narration, async (pace) => {
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" })).catch(() => {});
      await pace();
      await safeMove(page, 'input[type="search"], input[placeholder*="Search"], input[placeholder*="search"]');
      await pace();
      await safeMove(page, "h1");
      await pace();
    })

    // Segment 5 — Trending / featured nodes
    .segment(VS[5].narration, async (pace) => {
      await page.mouse.wheel(0, 400);
      await pace();
      await page.mouse.wheel(0, 300);
      await pace();
      // Hover over a trending node card
      await safeMove(page, 'a[href*="/nodes/"]');
      await pace();
    })

    // Segment 6 — Ecosystem stats
    .segment(VS[6].narration, async (pace) => {
      await page.mouse.wheel(0, 400);
      await pace();
      await page.mouse.wheel(0, 300);
      await pace();
      await page.mouse.wheel(0, 300);
      await pace();
    })

    // ═══════════════════════════════════════════════════════════════════════
    //  CHAPTER 2: Searching for Nodes
    // ═══════════════════════════════════════════════════════════════════════

    .title(VS[7].text, {
      subtitle: VS[7].subtitle,
      durationMs: VS[7].durationMs,
    });

  // Navigate back to top for search
  const scrollToTopAndFocusSearch = async () => {
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" })).catch(() => {});
    await page.waitForTimeout(500);
  };

  script
    // Segment 8 — Type SUPIR into search
    .segment(VS[8].narration, async (pace) => {
      await scrollToTopAndFocusSearch();
      await safeMove(page, 'input[type="search"], input[placeholder*="Search"], input[placeholder*="search"]');
      await pace();
      const search = page.locator('input[type="search"], input[placeholder*="Search"], input[placeholder*="search"]').first();
      if (await search.isVisible().catch(() => false)) {
        await search.click().catch(() => {});
        await typeKeys(page, "SUPIR", 120);
      }
      await pace();
    })

    // Segment 9 — Live suggestions streaming in
    .segment(VS[9].narration, async (pace) => {
      const resultLink = page.locator('a[href*="/nodes/"]').first();
      await resultLink.waitFor({ state: "visible", timeout: 5000 }).catch(() => {});
      await pace();
      await safeMove(page, 'a[href*="/nodes/"]');
      await pace();
    })

    // Segment 10 — Result card anatomy
    .segment(VS[10].narration, async (pace) => {
      const resultLink = page.locator('a[href*="/nodes/"]').first();
      // Capture the first result URL for later navigation
      detailUrl = await resultLink.getAttribute("href").catch(() => "") ?? "";
      if (detailUrl && !detailUrl.startsWith("http")) {
        detailUrl = new URL(detailUrl, REGISTRY_URL).href;
      }
      await safeMove(page, 'a[href*="/nodes/"]');
      await pace();
      // Hover over second result for comparison
      const secondResult = page.locator('a[href*="/nodes/"]').nth(1);
      if (await secondResult.isVisible().catch(() => false)) {
        const box = await secondResult.boundingBox().catch(() => null);
        if (box) await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      }
      await pace();
    })

    // Segment 11 — Scroll to compare alternatives
    .segment(VS[11].narration, async (pace) => {
      await page.mouse.wheel(0, 300);
      await pace();
      await page.mouse.wheel(0, 300);
      await pace();
      await page.mouse.wheel(0, 200);
      await pace();
    })

    // ═══════════════════════════════════════════════════════════════════════
    //  CHAPTER 3: Filters and Sorting
    // ═══════════════════════════════════════════════════════════════════════

    .title(VS[12].text, {
      subtitle: VS[12].subtitle,
      durationMs: VS[12].durationMs,
    });

  // Navigate to browse page between segments
  const navigateToBrowse = async () => {
    await page.goto(REGISTRY_URL + "nodes", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2000);
  };

  script
    // Segment 13 — OS filter
    .segment(VS[13].narration, async (pace) => {
      await navigateToBrowse();
      await pace();
      // Look for OS filter controls
      const osFilter = page.locator('text=/[Ww]indows|[Ll]inux|[Mm]ac[Oo][Ss]|[Oo]perating/').first();
      if (await osFilter.isVisible().catch(() => false)) {
        const box = await osFilter.boundingBox().catch(() => null);
        if (box) await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      }
      await pace();
      await page.mouse.wheel(0, 100);
      await pace();
    })

    // Segment 14 — Accelerator filter
    .segment(VS[14].narration, async (pace) => {
      const accFilter = page.locator('text=/CUDA|ROCm|MPS|[Aa]ccelerator/').first();
      if (await accFilter.isVisible().catch(() => false)) {
        const box = await accFilter.boundingBox().catch(() => null);
        if (box) await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      }
      await pace();
      await page.mouse.wheel(0, 100);
      await pace();
    })

    // Segment 15 — Sort by downloads + pagination
    .segment(VS[15].narration, async (pace) => {
      const sortControl = page.locator('text=/[Ss]ort|[Dd]ownloads|[Mm]ost [Pp]opular/').first();
      if (await sortControl.isVisible().catch(() => false)) {
        const box = await sortControl.boundingBox().catch(() => null);
        if (box) await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      }
      await pace();
      await page.mouse.wheel(0, 400);
      await pace();
      await page.mouse.wheel(0, 400);
      await pace();
    })

    // ═══════════════════════════════════════════════════════════════════════
    //  CHAPTER 4: Node Detail Page
    // ═══════════════════════════════════════════════════════════════════════

    .title(VS[16].text, {
      subtitle: VS[16].subtitle,
      durationMs: VS[16].durationMs,
    });

  // Navigate to detail page between segments
  const navigateToDetail = async () => {
    if (detailUrl) {
      await page.goto(detailUrl, { waitUntil: "domcontentloaded" });
    } else {
      // Fallback: click first node link on current page
      const link = page.locator('a[href*="/nodes/"]').first();
      if (await link.isVisible().catch(() => false)) {
        const href = await link.getAttribute("href").catch(() => "") ?? "";
        if (href) {
          const fullUrl = href.startsWith("http") ? href : new URL(href, REGISTRY_URL).href;
          await page.goto(fullUrl, { waitUntil: "domcontentloaded" });
        }
      }
    }
    await page.waitForTimeout(2000);
  };

  script
    // Segment 17 — Header info + publisher badge + tags
    .segment(VS[17].narration, async (pace) => {
      await navigateToDetail();
      await safeMove(page, "h1");
      await pace();
      // Hover publisher badge area
      const publisherEl = page.locator('a[href*="/publishers/"], a[href*="/publisher/"], text=/[Pp]ublish/').first();
      if (await publisherEl.isVisible().catch(() => false)) {
        publisherUrl = await publisherEl.getAttribute("href").catch(() => "") ?? "";
        if (publisherUrl && !publisherUrl.startsWith("http")) {
          publisherUrl = new URL(publisherUrl, REGISTRY_URL).href;
        }
        const box = await publisherEl.boundingBox().catch(() => null);
        if (box) await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      }
      await pace();
    })

    // Segment 18 — README content
    .segment(VS[18].narration, async (pace) => {
      await page.mouse.wheel(0, 300);
      await pace();
      await page.mouse.wheel(0, 300);
      await pace();
      await page.mouse.wheel(0, 200);
      await pace();
    })

    // Segment 19 — Install command + copy button
    .segment(VS[19].narration, async (pace) => {
      // Look for install command area
      const installArea = page.locator('text=/install/i, text=/comfy node/i, text=/comfy-cli/i').first();
      if (await installArea.isVisible().catch(() => false)) {
        const box = await installArea.boundingBox().catch(() => null);
        if (box) await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      }
      await pace();
      // Hover copy button
      const copyBtn = page.locator('button:has-text("Copy"), button[aria-label*="opy"], button[aria-label*="copy"]').first();
      if (await copyBtn.isVisible().catch(() => false)) {
        const box = await copyBtn.boundingBox().catch(() => null);
        if (box) await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      }
      await pace();
    })

    // Segment 20 — Version history + changelog
    .segment(VS[20].narration, async (pace) => {
      await page.mouse.wheel(0, 400);
      await pace();
      const versionArea = page.locator('text=/[Vv]ersion/').first();
      if (await versionArea.isVisible().catch(() => false)) {
        const box = await versionArea.boundingBox().catch(() => null);
        if (box) await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      }
      await pace();
      await page.mouse.wheel(0, 300);
      await pace();
    })

    // Segment 21 — Dependencies + compatibility + GitHub link + license
    .segment(VS[21].narration, async (pace) => {
      await page.mouse.wheel(0, 400);
      await pace();
      await page.mouse.wheel(0, 300);
      await pace();
      // Look for GitHub link or license info
      const ghLink = page.locator('a[href*="github.com"]').first();
      if (await ghLink.isVisible().catch(() => false)) {
        const box = await ghLink.boundingBox().catch(() => null);
        if (box) await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      }
      await pace();
    })

    // ═══════════════════════════════════════════════════════════════════════
    //  CHAPTER 5: Publisher Ecosystem
    // ═══════════════════════════════════════════════════════════════════════

    .title(VS[22].text, {
      subtitle: VS[22].subtitle,
      durationMs: VS[22].durationMs,
    });

  // Navigate to publisher page between segments
  const navigateToPublisher = async () => {
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" })).catch(() => {});
    await page.waitForTimeout(500);
    if (publisherUrl) {
      await page.goto(publisherUrl, { waitUntil: "domcontentloaded" });
    } else {
      // Fallback: click first publisher link on detail page
      const pubLink = page.locator('a[href*="/publishers/"], a[href*="/publisher/"]').first();
      if (await pubLink.isVisible().catch(() => false)) {
        const href = await pubLink.getAttribute("href").catch(() => "") ?? "";
        if (href) {
          const fullUrl = href.startsWith("http") ? href : new URL(href, REGISTRY_URL).href;
          await page.goto(fullUrl, { waitUntil: "domcontentloaded" });
        }
      }
    }
    await page.waitForTimeout(2000);
  };

  script
    // Segment 23 — Publisher profile page
    .segment(VS[23].narration, async (pace) => {
      await navigateToPublisher();
      await safeMove(page, "h1");
      await pace();
      await page.mouse.wheel(0, 200);
      await pace();
    })

    // Segment 24 — Browse publisher's other nodes
    .segment(VS[24].narration, async (pace) => {
      await page.mouse.wheel(0, 300);
      await pace();
      // Hover over their published nodes
      const nodeCard = page.locator('a[href*="/nodes/"]').first();
      if (await nodeCard.isVisible().catch(() => false)) {
        const box = await nodeCard.boundingBox().catch(() => null);
        if (box) await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      }
      await pace();
      await page.mouse.wheel(0, 200);
      await pace();
    })

    // Segment 25 — Publisher verification badge
    .segment(VS[25].narration, async (pace) => {
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" })).catch(() => {});
      await pace();
      // Hover near verified badge area
      const badge = page.locator('text=/[Vv]erif/, [class*="badge"], [class*="verified"]').first();
      if (await badge.isVisible().catch(() => false)) {
        const box = await badge.boundingBox().catch(() => null);
        if (box) await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      }
      await pace();
      await safeMove(page, "h1");
      await pace();
    })

    // ═══════════════════════════════════════════════════════════════════════
    //  CHAPTER 6: Docs Integration
    // ═══════════════════════════════════════════════════════════════════════

    .title(VS[26].text, {
      subtitle: VS[26].subtitle,
      durationMs: VS[26].durationMs,
    });

  // Navigate back to landing page for footer
  const navigateToLanding = async () => {
    await page.goto(REGISTRY_URL, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);
  };

  script
    // Segment 27 — Registry docs link in footer
    .segment(VS[27].narration, async (pace) => {
      await navigateToLanding();
      // Scroll all the way to footer
      await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })).catch(() => {});
      await page.waitForTimeout(1000);
      await pace();
      const docsLink = page.locator('footer a[href*="docs"], footer a:has-text("Docs"), footer a:has-text("Documentation")').first();
      if (await docsLink.isVisible().catch(() => false)) {
        const box = await docsLink.boundingBox().catch(() => null);
        if (box) await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      }
      await pace();
    })

    // Segment 28 — How to publish your own node
    .segment(VS[28].narration, async (pace) => {
      // Hover GitHub / social links in footer
      const ghFooter = page.locator('footer a[href*="github"], footer a:has-text("GitHub")').first();
      if (await ghFooter.isVisible().catch(() => false)) {
        const box = await ghFooter.boundingBox().catch(() => null);
        if (box) await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      }
      await pace();
      await page.mouse.wheel(0, -200);
      await pace();
    })

    // ═══════════════════════════════════════════════════════════════════════
    //  OUTRO
    // ═══════════════════════════════════════════════════════════════════════

    // Segment 29 — Wrap-up narration
    .segment(VS[29].narration, async (pace) => {
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" })).catch(() => {});
      await page.waitForTimeout(500);
      await pace();
      await safeMove(page, "h1");
      await pace();
      await safeMove(page, 'input[type="search"], input[placeholder*="Search"], input[placeholder*="search"]');
      await pace();
    })

    // Conclusion card
    .outro({
      text: VS[30].text,
      subtitle: VS[30].subtitle,
      narration: VS[30].narration,
      durationMs: VS[30].durationMs,
    });

  await script.prepare(page);
  await script.render(page, {
    baseName: "registry-web",
    outputDir: ".comfy-qa/.demos",
  });
});
