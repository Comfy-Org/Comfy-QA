/**
 * ComfyUI Docs — docs.comfy.org
 *
 * Story:  demo/stories/comfy-docs.story.md
 * Output: .comfy-qa/.demos/comfy-docs.mp4
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
 *    4. Each segment ~10–15 seconds at 140 wpm ⇒ 20–35 words is the sweet spot.
 *    5. Total: 9 chapters, 32 segments, targeting ~8 min video.
 */
const VIDEO_SCRIPT = [
  // ── Intro (title + 2 segments) ──
  { kind: "title", text: "ComfyUI Docs", subtitle: "Everything you need to master ComfyUI", durationMs: 3000 },
  { kind: "segment", narration: "Just installed ComfyUI and staring at an empty canvas? Or hit a wall with a specific node? The docs site is your first stop — structured learning for beginners through experts." },
  { kind: "segment", narration: "This isn't a bare-bones wiki. It's a complete learning path with tutorials, references, and developer guides — all searchable and organized by skill level." },

  // ── Chapter 1: Site Structure (title + 3 segments) ──
  { kind: "title", text: "Site Structure", subtitle: "Navigation, themes, and layout", durationMs: 2000 },
  { kind: "segment", narration: "The homepage greets you with a clean layout. On the left, a sidebar organizes everything into major sections — Getting Started, Tutorials, Node Reference, Custom Nodes, Developer Guide, and Advanced topics." },
  { kind: "segment", narration: "Let me toggle the theme. There's a dark mode switch right in the header. One click and the entire site shifts to a dark palette — perfect for those late-night workflow building sessions." },
  { kind: "segment", narration: "Notice the breadcrumbs at the top of each page. They show exactly where you are in the docs hierarchy. The header also has direct links to the GitHub repo and Discord community." },

  // ── Chapter 2: Getting Started (title + 4 segments) ──
  { kind: "title", text: "Getting Started", subtitle: "From install to first image", durationMs: 2000 },
  { kind: "segment", narration: "The Getting Started section is the first thing in the sidebar. It walks brand-new users through everything — installing ComfyUI, launching it for the first time, and understanding the interface." },
  { kind: "segment", narration: "The installation page has OS-specific tabs — Windows, Mac, and Linux — each with tailored instructions. You pick your platform and follow along step by step. No guessing required." },
  { kind: "segment", narration: "Next up is the First Workflow tutorial. This page takes you from an empty canvas to your first generated image. It introduces nodes, links, and widgets — the three building blocks of every ComfyUI workflow." },
  { kind: "segment", narration: "Many tutorial pages include downloadable workflow files. You can import them directly into ComfyUI and experiment with a working setup instead of building from scratch." },

  // ── Chapter 3: Search (title + 4 segments) ──
  { kind: "title", text: "Finding Answers Fast", subtitle: "Full-text search across all documentation", durationMs: 2000 },
  { kind: "segment", narration: "Let me show you the search. I'll press Ctrl+K to open the search modal. This keyboard shortcut works from any page — it's the fastest way to find anything on the site." },
  { kind: "segment", narration: "I'll type ControlNet — one of the most asked-about features. Watch how results stream in as I type, updating with every keystroke. The search is truly incremental." },
  { kind: "segment", narration: "The results are organized by category. I can see hits from tutorials, node references, and developer guides all at once. This cross-section view helps you find exactly the right depth of explanation." },
  { kind: "segment", narration: "I'll use the keyboard to navigate down through the results and press Enter to jump directly to the page. No scrolling through the sidebar — search gets you there in seconds." },

  // ── Chapter 4: Tutorials (title + 4 segments) ──
  { kind: "title", text: "Tutorials", subtitle: "Step-by-step guides for every skill level", durationMs: 2000 },
  { kind: "segment", narration: "The Tutorials section is where you learn by doing. The Text to Image tutorial is the starting point — it walks through prompting, sampling, and generating your first image with detailed explanations at each step." },
  { kind: "segment", narration: "Moving on to more advanced topics, there's a dedicated ControlNet tutorial. It explains how to use reference images to guide generation — one of ComfyUI's most powerful features." },
  { kind: "segment", narration: "The LoRA usage tutorial covers fine-tuned models — how to load them, adjust their strength, and combine multiple LoRAs in a single workflow. This is where personalization really starts." },
  { kind: "segment", narration: "Every tutorial follows the same format — step-by-step instructions with annotated screenshots and downloadable workflow files. You can read, follow along, and import the workflow to verify your setup." },

  // ── Chapter 5: Node Reference (title + 4 segments) ──
  { kind: "title", text: "Node Reference", subtitle: "Every built-in node documented", durationMs: 2000 },
  { kind: "segment", narration: "The Node Reference section is the encyclopedia. The sidebar lists node categories — Loaders, Samplers, Conditioning, Latent operations, and more. Each category groups related nodes together." },
  { kind: "segment", narration: "Let me click into an individual node page. You'll see the full layout — a description of what the node does, every input and output with their data types, and each parameter explained in detail." },
  { kind: "segment", narration: "Many node pages include code examples and configuration tips. These are especially useful when you're wiring up complex workflows and need to understand exactly what values each parameter accepts." },
  { kind: "segment", narration: "Cross-references link related nodes together. If you're looking at a sampler, you'll see links to compatible schedulers and conditioning nodes. This web of connections mirrors how ComfyUI actually works." },

  // ── Chapter 6: Custom Nodes (title + 3 segments) ──
  { kind: "title", text: "Custom Nodes", subtitle: "Extend ComfyUI with community and your own nodes", durationMs: 2000 },
  { kind: "segment", narration: "The Custom Nodes section covers both sides — installing community nodes and building your own. The installation guide walks through ComfyUI Manager and manual installation methods." },
  { kind: "segment", narration: "For developers, the Creating Custom Nodes guide is a deep dive. It covers node structure, input and output types, widget configuration, and how to package everything properly." },
  { kind: "segment", narration: "Once your node is ready, the Publishing guide explains how to submit it to the Comfy Registry — making it discoverable and installable by the entire community with a single command." },

  // ── Chapter 7: Developer Guide (title + 3 segments) ──
  { kind: "title", text: "Developer Guide", subtitle: "APIs, frontend, and contributing", durationMs: 2000 },
  { kind: "segment", narration: "The Developer Guide section is for people building on top of ComfyUI. The API reference documents every endpoint — queueing prompts, retrieving images, monitoring progress, and managing the workflow queue." },
  { kind: "segment", narration: "There's a dedicated Frontend Development section covering the web interface codebase. If you want to customize the UI or build extensions that modify the editor, this is your starting point." },
  { kind: "segment", narration: "The Contributing guide rounds it out — how to set up a development environment, run tests, and submit pull requests. ComfyUI is open source and the docs make it easy to get involved." },

  // ── Chapter 8: UX Features (title + 3 segments) ──
  { kind: "title", text: "UX Features", subtitle: "Code blocks, table of contents, and responsive layout", durationMs: 2000 },
  { kind: "segment", narration: "Let me highlight some UX details. Code blocks throughout the docs have a copy button in the top corner. One click and the code is on your clipboard — no manual selecting and hoping you got it all." },
  { kind: "segment", narration: "On the right side of every page, there's a table of contents. It highlights your current section as you scroll and lets you jump to any heading instantly. Great for long reference pages." },
  { kind: "segment", narration: "The layout is fully responsive. On mobile, the sidebar collapses into a hamburger menu and the table of contents tucks away. Every page is readable on any screen size, which matters when you're referencing docs on a second device." },

  // ── Outro (1 segment + conclusion card) ──
  { kind: "segment", narration: "That's ComfyUI Docs — tutorials, references, search, dark mode, downloadable workflows. Everything from install to advanced custom node development, all in one place." },
  { kind: "outro", text: "ComfyUI Docs", subtitle: "docs.comfy.org", narration: "With ComfyUI Docs you get step-by-step tutorials with downloadable workflows, a complete node reference, instant Ctrl+K search, dark mode, and developer guides — from first install to publishing your own custom nodes.", durationMs: 3000 },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
//  PLAYWRIGHT IMPLEMENTATION (consumes VIDEO_SCRIPT above)
// ─────────────────────────────────────────────────────────────────────────────
import { test, safeMove } from "./fixtures/fixture";
import { createVideoScript } from "../lib/demowright/dist/index.mjs";
import { typeKeys } from "../lib/demowright/dist/helpers.mjs";

test("comfy docs tour", async ({ page }) => {
  test.setTimeout(10 * 60_000);

  // Pre-navigate (heavy work BEFORE script.render — see hard rules)
  const DOCS_URL = process.env.DOCS_URL ?? "https://docs.comfy.org/";
  await page.goto(DOCS_URL, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);

  // ── Helper: click a sidebar link matching text ──
  const clickSidebarLink = async (text: string) => {
    const link = page.locator(`aside a:has-text("${text}"), nav a:has-text("${text}")`).first();
    if (await link.isVisible().catch(() => false)) {
      await link.click().catch(() => {});
      await page.waitForTimeout(1500);
    }
  };

  // ── Helper: open search modal ──
  const openSearch = async () => {
    await page.keyboard.press("Control+KeyK").catch(() => {});
    await page.waitForTimeout(600);
    // Fallback: click search button if Ctrl+K didn't open it
    const searchBtn = page.locator(
      'button:has-text("Search"), button[aria-label*="Search"], [data-search]'
    ).first();
    if (await searchBtn.isVisible().catch(() => false)) {
      await searchBtn.click().catch(() => {});
      await page.waitForTimeout(500);
    }
  };

  // ── Helper: close search modal ──
  const closeSearch = async () => {
    await page.keyboard.press("Escape").catch(() => {});
    await page.waitForTimeout(400);
  };

  // ── Helper: scroll to top smoothly ──
  const scrollToTop = async () => {
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" })).catch(() => {});
    await page.waitForTimeout(600);
  };

  const script = createVideoScript()

    // ═══════════════════════════════════════════════════════════════════════
    //  INTRO (title + 2 segments)
    // ═══════════════════════════════════════════════════════════════════════
    .title(VIDEO_SCRIPT[0].text, {
      subtitle: VIDEO_SCRIPT[0].subtitle,
      durationMs: VIDEO_SCRIPT[0].durationMs,
    })

    // Segment 1 — WHY: the docs site is the starting point for everyone
    .segment(VIDEO_SCRIPT[1].narration, async (pace) => {
      await safeMove(page, "h1");
      await pace();
      await safeMove(page, "main");
      await pace();
    })

    // Segment 2 — Structured learning path, not a bare wiki
    .segment(VIDEO_SCRIPT[2].narration, async (pace) => {
      await safeMove(page, "aside");
      await pace();
      await safeMove(page, "nav");
      await pace();
      await page.mouse.wheel(0, 200);
      await pace();
    })

    // ═══════════════════════════════════════════════════════════════════════
    //  CHAPTER 1: Site Structure (title + 3 segments)
    // ═══════════════════════════════════════════════════════════════════════
    .title(VIDEO_SCRIPT[3].text, {
      subtitle: VIDEO_SCRIPT[3].subtitle,
      durationMs: VIDEO_SCRIPT[3].durationMs,
    })

    // Segment 3 — Homepage layout and sidebar sections
    .segment(VIDEO_SCRIPT[4].narration, async (pace) => {
      await scrollToTop();
      await safeMove(page, "h1");
      await pace();
      await safeMove(page, "aside");
      await pace();
      await page.mouse.wheel(0, 300);
      await pace();
      await page.mouse.wheel(0, 300);
      await pace();
    })

    // Segment 4 — Theme toggle (light → dark)
    .segment(VIDEO_SCRIPT[5].narration, async (pace) => {
      await scrollToTop();
      // Hover toward theme toggle area in header
      await safeMove(page, "header");
      await pace();
      // Try to click theme toggle
      const themeToggle = page.locator(
        'button[aria-label*="theme" i], button[aria-label*="dark" i], button[aria-label*="light" i], button[aria-label*="mode" i], [data-theme-toggle], button:has(svg[class*="moon"]), button:has(svg[class*="sun"])'
      ).first();
      if (await themeToggle.isVisible().catch(() => false)) {
        await themeToggle.click().catch(() => {});
      }
      await page.waitForTimeout(800);
      await pace();
      await safeMove(page, "main");
      await pace();
    })

    // Segment 5 — Breadcrumbs and header links
    .segment(VIDEO_SCRIPT[6].narration, async (pace) => {
      // Navigate to any inner page to show breadcrumbs
      await clickSidebarLink("Getting Started");
      await safeMove(page, 'nav[aria-label*="breadcrumb" i], .breadcrumb, ol[class*="breadcrumb"]');
      await pace();
      await safeMove(page, "header");
      await pace();
      // Hover over GitHub / Discord links in header
      const githubLink = page.locator('a[href*="github.com"], a[aria-label*="GitHub" i]').first();
      if (await githubLink.isVisible().catch(() => false)) {
        await safeMove(page, 'a[href*="github.com"]');
      }
      await pace();
    })

    // ═══════════════════════════════════════════════════════════════════════
    //  CHAPTER 2: Getting Started (title + 4 segments)
    // ═══════════════════════════════════════════════════════════════════════
    .title(VIDEO_SCRIPT[7].text, {
      subtitle: VIDEO_SCRIPT[7].subtitle,
      durationMs: VIDEO_SCRIPT[7].durationMs,
    })

    // Segment 6 — Installation section at the top of sidebar
    .segment(VIDEO_SCRIPT[8].narration, async (pace) => {
      await clickSidebarLink("Getting Started");
      await safeMove(page, "aside");
      await pace();
      await safeMove(page, "main");
      await pace();
      await page.mouse.wheel(0, 200);
      await pace();
    })

    // Segment 7 — OS-specific tabs (Windows/Mac/Linux)
    .segment(VIDEO_SCRIPT[9].narration, async (pace) => {
      // Look for install page or tabs
      await clickSidebarLink("Install");
      await safeMove(page, "main");
      await pace();
      // Try to interact with OS tabs
      const winTab = page.locator('button:has-text("Windows"), [role="tab"]:has-text("Windows")').first();
      if (await winTab.isVisible().catch(() => false)) {
        await safeMove(page, 'button:has-text("Windows"), [role="tab"]:has-text("Windows")');
        await pace();
        await winTab.click().catch(() => {});
        await page.waitForTimeout(500);
      }
      const macTab = page.locator('button:has-text("Mac"), [role="tab"]:has-text("Mac"), button:has-text("macOS")').first();
      if (await macTab.isVisible().catch(() => false)) {
        await safeMove(page, 'button:has-text("Mac"), [role="tab"]:has-text("Mac"), button:has-text("macOS")');
        await pace();
        await macTab.click().catch(() => {});
        await page.waitForTimeout(500);
      }
      await pace();
    })

    // Segment 8 — First Workflow tutorial page
    .segment(VIDEO_SCRIPT[10].narration, async (pace) => {
      await clickSidebarLink("First Workflow");
      await safeMove(page, "h1");
      await pace();
      await page.mouse.wheel(0, 400);
      await pace();
      await page.mouse.wheel(0, 400);
      await pace();
    })

    // Segment 9 — Downloadable workflow files
    .segment(VIDEO_SCRIPT[11].narration, async (pace) => {
      await page.mouse.wheel(0, 300);
      await pace();
      // Look for download links or workflow file references
      const downloadLink = page.locator('a:has-text("download"), a:has-text("workflow"), a[href*=".json"]').first();
      if (await downloadLink.isVisible().catch(() => false)) {
        await safeMove(page, 'a:has-text("download"), a:has-text("workflow"), a[href*=".json"]');
      }
      await pace();
      await page.mouse.wheel(0, 200);
      await pace();
    })

    // ═══════════════════════════════════════════════════════════════════════
    //  CHAPTER 3: Search (title + 4 segments)
    // ═══════════════════════════════════════════════════════════════════════
    .title(VIDEO_SCRIPT[12].text, {
      subtitle: VIDEO_SCRIPT[12].subtitle,
      durationMs: VIDEO_SCRIPT[12].durationMs,
    })

    // Segment 10 — Open search with Ctrl+K
    .segment(VIDEO_SCRIPT[13].narration, async (pace) => {
      await scrollToTop();
      await pace();
      await openSearch();
      await pace();
      // Show the search modal is open
      const searchInput = page.locator(
        'input[type="search"], input[placeholder*="Search" i], [role="searchbox"], [role="combobox"], dialog input'
      ).first();
      if (await searchInput.isVisible().catch(() => false)) {
        await safeMove(page, 'input[type="search"], input[placeholder*="Search" i], [role="searchbox"], [role="combobox"], dialog input');
      }
      await pace();
    })

    // Segment 11 — Type "ControlNet" and see incremental results
    .segment(VIDEO_SCRIPT[14].narration, async (pace) => {
      const searchInput = page.locator(
        'input[type="search"], input[placeholder*="Search" i], [role="searchbox"], [role="combobox"], dialog input'
      ).first();
      if (await searchInput.isVisible().catch(() => false)) {
        await searchInput.click().catch(() => {});
        await typeKeys(page, "Control", 120);
        await pace();
        await typeKeys(page, "Net", 120);
      }
      await page.waitForTimeout(800);
      await pace();
    })

    // Segment 12 — Results span tutorials, references, and guides
    .segment(VIDEO_SCRIPT[15].narration, async (pace) => {
      await page.waitForTimeout(500);
      await page.mouse.wheel(0, 150);
      await pace();
      await page.mouse.wheel(0, 150);
      await pace();
      await page.mouse.wheel(0, 100);
      await pace();
    })

    // Segment 13 — Navigate from search result to target page
    .segment(VIDEO_SCRIPT[16].narration, async (pace) => {
      // Use keyboard to navigate results
      await page.keyboard.press("ArrowDown").catch(() => {});
      await page.waitForTimeout(400);
      await pace();
      await page.keyboard.press("ArrowDown").catch(() => {});
      await page.waitForTimeout(400);
      await pace();
      await page.keyboard.press("Enter").catch(() => {});
      await page.waitForTimeout(1500);
      await pace();
    })

    // ═══════════════════════════════════════════════════════════════════════
    //  CHAPTER 4: Tutorials (title + 4 segments)
    // ═══════════════════════════════════════════════════════════════════════
    .title(VIDEO_SCRIPT[17].text, {
      subtitle: VIDEO_SCRIPT[17].subtitle,
      durationMs: VIDEO_SCRIPT[17].durationMs,
    })

    // Segment 14 — Text to Image tutorial
    .segment(VIDEO_SCRIPT[18].narration, async (pace) => {
      await closeSearch();
      await clickSidebarLink("Tutorial");
      await page.waitForTimeout(800);
      // Try to find Text to Image or similar
      const t2iLink = page.locator('a:has-text("Text to Image"), a:has-text("text2img"), a:has-text("Basic")').first();
      if (await t2iLink.isVisible().catch(() => false)) {
        await t2iLink.click().catch(() => {});
        await page.waitForTimeout(1500);
      }
      await safeMove(page, "h1");
      await pace();
      await page.mouse.wheel(0, 400);
      await pace();
      await page.mouse.wheel(0, 300);
      await pace();
    })

    // Segment 15 — ControlNet tutorial overview
    .segment(VIDEO_SCRIPT[19].narration, async (pace) => {
      const cnLink = page.locator('a:has-text("ControlNet")').first();
      if (await cnLink.isVisible().catch(() => false)) {
        await cnLink.click().catch(() => {});
        await page.waitForTimeout(1500);
      } else {
        await clickSidebarLink("ControlNet");
      }
      await safeMove(page, "h1");
      await pace();
      await page.mouse.wheel(0, 400);
      await pace();
    })

    // Segment 16 — LoRA usage tutorial
    .segment(VIDEO_SCRIPT[20].narration, async (pace) => {
      const loraLink = page.locator('a:has-text("LoRA"), a:has-text("Lora")').first();
      if (await loraLink.isVisible().catch(() => false)) {
        await loraLink.click().catch(() => {});
        await page.waitForTimeout(1500);
      } else {
        await clickSidebarLink("LoRA");
      }
      await safeMove(page, "h1");
      await pace();
      await page.mouse.wheel(0, 400);
      await pace();
      await page.mouse.wheel(0, 300);
      await pace();
    })

    // Segment 17 — Step-by-step format with screenshots and downloadable workflows
    .segment(VIDEO_SCRIPT[21].narration, async (pace) => {
      await page.mouse.wheel(0, 300);
      await pace();
      // Hover over screenshot images
      const img = page.locator("main img").first();
      if (await img.isVisible().catch(() => false)) {
        await safeMove(page, "main img");
      }
      await pace();
      await page.mouse.wheel(0, 300);
      await pace();
    })

    // ═══════════════════════════════════════════════════════════════════════
    //  CHAPTER 5: Node Reference (title + 4 segments)
    // ═══════════════════════════════════════════════════════════════════════
    .title(VIDEO_SCRIPT[22].text, {
      subtitle: VIDEO_SCRIPT[22].subtitle,
      durationMs: VIDEO_SCRIPT[22].durationMs,
    })

    // Segment 18 — Node categories in sidebar
    .segment(VIDEO_SCRIPT[23].narration, async (pace) => {
      await clickSidebarLink("Node Reference");
      await safeMove(page, "aside");
      await pace();
      await page.mouse.wheel(0, 200);
      await pace();
      await page.mouse.wheel(0, 200);
      await pace();
      await page.mouse.wheel(0, 200);
      await pace();
    })

    // Segment 19 — Individual node page layout
    .segment(VIDEO_SCRIPT[24].narration, async (pace) => {
      // Click into a specific node (e.g. KSampler, CheckpointLoader, etc.)
      const nodeLink = page.locator('a:has-text("KSampler"), a:has-text("Sampler"), a:has-text("CheckpointLoader")').first();
      if (await nodeLink.isVisible().catch(() => false)) {
        await nodeLink.click().catch(() => {});
        await page.waitForTimeout(1500);
      }
      await safeMove(page, "h1");
      await pace();
      await page.mouse.wheel(0, 400);
      await pace();
      await page.mouse.wheel(0, 300);
      await pace();
    })

    // Segment 20 — Code examples and configuration tips
    .segment(VIDEO_SCRIPT[25].narration, async (pace) => {
      await page.mouse.wheel(0, 300);
      await pace();
      // Hover over code blocks
      const codeBlock = page.locator("pre, code").first();
      if (await codeBlock.isVisible().catch(() => false)) {
        await safeMove(page, "pre, code");
      }
      await pace();
      await page.mouse.wheel(0, 200);
      await pace();
    })

    // Segment 21 — Cross-references between related nodes
    .segment(VIDEO_SCRIPT[26].narration, async (pace) => {
      await page.mouse.wheel(0, 300);
      await pace();
      // Look for internal links to other node pages
      const crossRef = page.locator('main a[href*="node"], main a[href*="reference"]').first();
      if (await crossRef.isVisible().catch(() => false)) {
        await safeMove(page, 'main a[href*="node"], main a[href*="reference"]');
      }
      await pace();
      await page.mouse.wheel(0, 200);
      await pace();
    })

    // ═══════════════════════════════════════════════════════════════════════
    //  CHAPTER 6: Custom Nodes (title + 3 segments)
    // ═══════════════════════════════════════════════════════════════════════
    .title(VIDEO_SCRIPT[27].text, {
      subtitle: VIDEO_SCRIPT[27].subtitle,
      durationMs: VIDEO_SCRIPT[27].durationMs,
    })

    // Segment 22 — Installing custom nodes guide
    .segment(VIDEO_SCRIPT[28].narration, async (pace) => {
      await clickSidebarLink("Custom Node");
      await page.waitForTimeout(800);
      const installLink = page.locator('a:has-text("Install"), a:has-text("install")').first();
      if (await installLink.isVisible().catch(() => false)) {
        await installLink.click().catch(() => {});
        await page.waitForTimeout(1500);
      }
      await safeMove(page, "h1");
      await pace();
      await page.mouse.wheel(0, 400);
      await pace();
      await page.mouse.wheel(0, 300);
      await pace();
    })

    // Segment 23 — Creating custom nodes guide
    .segment(VIDEO_SCRIPT[29].narration, async (pace) => {
      const createLink = page.locator('a:has-text("Creat"), a:has-text("Build"), a:has-text("Develop")').first();
      if (await createLink.isVisible().catch(() => false)) {
        await createLink.click().catch(() => {});
        await page.waitForTimeout(1500);
      }
      await safeMove(page, "h1");
      await pace();
      await page.mouse.wheel(0, 400);
      await pace();
      await page.mouse.wheel(0, 400);
      await pace();
    })

    // Segment 24 — Publishing to Registry
    .segment(VIDEO_SCRIPT[30].narration, async (pace) => {
      const publishLink = page.locator('a:has-text("Publish"), a:has-text("Registry"), a:has-text("publish")').first();
      if (await publishLink.isVisible().catch(() => false)) {
        await publishLink.click().catch(() => {});
        await page.waitForTimeout(1500);
      }
      await safeMove(page, "h1");
      await pace();
      await page.mouse.wheel(0, 300);
      await pace();
    })

    // ═══════════════════════════════════════════════════════════════════════
    //  CHAPTER 7: Developer Guide (title + 3 segments)
    // ═══════════════════════════════════════════════════════════════════════
    .title(VIDEO_SCRIPT[31].text, {
      subtitle: VIDEO_SCRIPT[31].subtitle,
      durationMs: VIDEO_SCRIPT[31].durationMs,
    })

    // Segment 25 — API reference
    .segment(VIDEO_SCRIPT[32].narration, async (pace) => {
      await clickSidebarLink("Developer");
      await page.waitForTimeout(800);
      const apiLink = page.locator('a:has-text("API"), a:has-text("api")').first();
      if (await apiLink.isVisible().catch(() => false)) {
        await apiLink.click().catch(() => {});
        await page.waitForTimeout(1500);
      }
      await safeMove(page, "h1");
      await pace();
      await page.mouse.wheel(0, 400);
      await pace();
      await page.mouse.wheel(0, 300);
      await pace();
    })

    // Segment 26 — Frontend development
    .segment(VIDEO_SCRIPT[33].narration, async (pace) => {
      const feLink = page.locator('a:has-text("Frontend"), a:has-text("frontend"), a:has-text("UI")').first();
      if (await feLink.isVisible().catch(() => false)) {
        await feLink.click().catch(() => {});
        await page.waitForTimeout(1500);
      }
      await safeMove(page, "h1");
      await pace();
      await page.mouse.wheel(0, 400);
      await pace();
    })

    // Segment 27 — Contributing guide
    .segment(VIDEO_SCRIPT[34].narration, async (pace) => {
      const contribLink = page.locator('a:has-text("Contribut"), a:has-text("contribut")').first();
      if (await contribLink.isVisible().catch(() => false)) {
        await contribLink.click().catch(() => {});
        await page.waitForTimeout(1500);
      }
      await safeMove(page, "h1");
      await pace();
      await page.mouse.wheel(0, 300);
      await pace();
      await page.mouse.wheel(0, 300);
      await pace();
    })

    // ═══════════════════════════════════════════════════════════════════════
    //  CHAPTER 8: UX Features (title + 3 segments)
    // ═══════════════════════════════════════════════════════════════════════
    .title(VIDEO_SCRIPT[35].text, {
      subtitle: VIDEO_SCRIPT[35].subtitle,
      durationMs: VIDEO_SCRIPT[35].durationMs,
    })

    // Segment 28 — Code blocks with copy button
    .segment(VIDEO_SCRIPT[36].narration, async (pace) => {
      // Navigate back to a page with code blocks
      await page.goBack().catch(() => {});
      await page.waitForTimeout(1000);
      await page.mouse.wheel(0, 300);
      await pace();
      const copyBtn = page.locator('button:has-text("Copy"), button[aria-label*="opy"], pre button, .copy-button').first();
      if (await copyBtn.isVisible().catch(() => false)) {
        await safeMove(page, 'button:has-text("Copy"), button[aria-label*="opy"], pre button, .copy-button');
      } else {
        // Hover over a code block to show the copy button
        await safeMove(page, "pre");
        await page.waitForTimeout(500);
        const copyBtnRetry = page.locator('button:has-text("Copy"), button[aria-label*="opy"], pre button, .copy-button').first();
        if (await copyBtnRetry.isVisible().catch(() => false)) {
          await safeMove(page, 'button:has-text("Copy"), button[aria-label*="opy"], pre button, .copy-button');
        }
      }
      await pace();
    })

    // Segment 29 — Table of contents navigation (right sidebar)
    .segment(VIDEO_SCRIPT[37].narration, async (pace) => {
      await scrollToTop();
      await pace();
      // Hover over right-side table of contents
      const toc = page.locator('aside:last-of-type, [class*="toc"], nav[aria-label*="table of contents" i], [class*="TableOfContents"]').first();
      if (await toc.isVisible().catch(() => false)) {
        await safeMove(page, 'aside:last-of-type, [class*="toc"], nav[aria-label*="table of contents" i], [class*="TableOfContents"]');
      }
      await pace();
      // Scroll down to show the TOC highlighting
      await page.mouse.wheel(0, 600);
      await page.waitForTimeout(400);
      await pace();
      await page.mouse.wheel(0, 400);
      await pace();
    })

    // Segment 30 — Responsive layout and accessibility
    .segment(VIDEO_SCRIPT[38].narration, async (pace) => {
      await scrollToTop();
      await pace();
      // Show responsive layout by hovering across key areas
      await safeMove(page, "header");
      await pace();
      await safeMove(page, "main");
      await pace();
      await safeMove(page, "aside");
      await pace();
    })

    // ═══════════════════════════════════════════════════════════════════════
    //  OUTRO (1 segment + conclusion card)
    // ═══════════════════════════════════════════════════════════════════════

    // Segment 31 — Wrap-up narration
    .segment(VIDEO_SCRIPT[39].narration, async (pace) => {
      await page.goto(DOCS_URL, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(1500);
      await scrollToTop();
      await safeMove(page, "h1");
      await pace();
      await safeMove(page, "aside");
      await pace();
      await safeMove(page, "main");
      await pace();
    })

    // Conclusion card
    .outro({
      text: VIDEO_SCRIPT[40].text,
      subtitle: VIDEO_SCRIPT[40].subtitle,
      narration: VIDEO_SCRIPT[40].narration,
      durationMs: VIDEO_SCRIPT[40].durationMs,
    });

  await script.prepare(page);
  await script.render(page, {
    baseName: "comfy-docs",
    outputDir: ".comfy-qa/.demos",
  });
});
