/**
 * Comfy Code Search — cs.comfy.org
 *
 * Story:  demo/stories/comfy-codesearch.story.md
 * Output: .comfy-qa/.demos/comfy-codesearch.mp4
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
 *    4. Each segment ~12–18 seconds at 140 wpm ⇒ 28–42 words is the sweet spot.
 *    5. Total: ~30 segments across 7 chapters, video ~8 min.
 */
const VS = [
  // ── Intro ── (idx 0–2)
  { idx: 0, kind: "title", text: "Comfy Code Search", subtitle: "Sourcegraph-powered search across every Comfy repository", narration: "Comfy Code Search — the fastest way to understand the ComfyUI codebase.", durationMs: 4000 },
  { idx: 1, kind: "segment", narration: "When you're building a custom node, understanding how existing nodes work internally is essential. But ComfyUI's code spans dozens of repositories — the backend, the frontend, custom node packages, and documentation." },
  { idx: 2, kind: "segment", narration: "GitHub's search works within one repo at a time. Comfy Code Search gives you Sourcegraph-powered regex search across every Comfy-Org repository simultaneously. Let me show you how it works." },

  // ── Chapter 1: First Search ── (idx 3–7)
  { idx: 3, kind: "title", text: "Chapter 1", subtitle: "First Search", narration: "Let's start with the basics — running your first search.", durationMs: 3000 },
  { idx: 4, kind: "segment", narration: "Here's the search bar. It's powered by Monaco — the same editor that runs VS Code — so you get syntax highlighting and autocomplete right in the input. Let me type KSampler, one of ComfyUI's most important nodes." },
  { idx: 5, kind: "segment", narration: "I hit enter and results start streaming in immediately. Notice how fast that is — Sourcegraph's indexed search returns matches from dozens of repos in under a second." },
  { idx: 6, kind: "segment", narration: "Let me walk you through a single result. Each one shows the repository name at the top, then the file path, and below that you see the matching lines with full syntax highlighting. It's like reading the code in your editor." },
  { idx: 7, kind: "segment", narration: "Up at the top I can see the total match count. This tells me KSampler appears across many repositories — in the backend, the frontend, custom nodes, and documentation. That's the power of cross-repo search." },

  // ── Chapter 2: Understanding Results ── (idx 8–12)
  { idx: 8, kind: "title", text: "Chapter 2", subtitle: "Understanding Results", narration: "Now let's dig deeper into the search results.", durationMs: 3000 },
  { idx: 9, kind: "segment", narration: "As I scroll down, notice how the results are grouped by repository. First I see matches from ComfyUI's main backend, then the frontend repo, then custom node packages. This grouping makes it easy to understand where code lives." },
  { idx: 10, kind: "segment", narration: "Over on the left sidebar, I can see filter options. These let me narrow results by programming language — for example, I might only want Python files, not TypeScript. Let me click on Python to filter." },
  { idx: 11, kind: "segment", narration: "Now I'm only seeing Python results. The match count has dropped because we've filtered out the TypeScript and JavaScript matches. This is incredibly useful when you know which language you're looking for." },
  { idx: 12, kind: "segment", narration: "I can also filter by repository from the sidebar. If I only care about the main ComfyUI backend, I can click that repo name and instantly see just those results. Let me clear these filters and move on." },

  // ── Chapter 3: Advanced Search ── (idx 13–17)
  { idx: 13, kind: "title", text: "Chapter 3", subtitle: "Advanced Search", narration: "Time for the advanced features — regex, file filters, and symbol search.", durationMs: 3000 },
  { idx: 14, kind: "segment", narration: "Let me clear the search box and try a regex search. I'll type slash, class, backslash-s-plus, KSampler, slash. This regex pattern matches the exact class definition of KSampler, filtering out all the places where it's just referenced." },
  { idx: 15, kind: "segment", narration: "Now I only see results where KSampler is actually defined as a class. That's much more targeted. Regex support means you can craft precise patterns — match function signatures, find specific imports, locate error messages." },
  { idx: 16, kind: "segment", narration: "Let me try another approach. I'll add a file filter — file colon star dot py. This limits results to Python files only, right in the query. I can also use lang colon python as a shorthand. Both do the same thing." },
  { idx: 17, kind: "segment", narration: "One more powerful feature — symbol search. I'll type type colon symbol followed by KSampler. This uses Sourcegraph's code intelligence to find only symbol definitions — classes, functions, variables — not plain text matches." },

  // ── Chapter 4: Code Navigation ── (idx 18–23)
  { idx: 18, kind: "title", text: "Chapter 4", subtitle: "Code Navigation", narration: "Let's leave the search results and explore the code itself.", durationMs: 3000 },
  { idx: 19, kind: "segment", narration: "I'll click into this result to see the full source file. Notice how I'm taken directly to the matching line — no need to clone the repo, no IDE setup. The code is right here in my browser with full syntax highlighting." },
  { idx: 20, kind: "segment", narration: "Look at the line numbers on the left. I can click any line number to get a permalink — useful for sharing specific code locations with teammates. The highlighting makes the code as readable as any desktop editor." },
  { idx: 21, kind: "segment", narration: "Let me scroll through the file to see the full context. Here I can see the class definition, all its methods, the imports at the top. This is essential for understanding how KSampler processes its inputs and connects to the rest of the pipeline." },
  { idx: 22, kind: "segment", narration: "At the top I see breadcrumb navigation — the repo name, then the directory path, then the filename. I can click any part of the breadcrumb to jump to that directory level. It's intuitive navigation through the codebase." },
  { idx: 23, kind: "segment", narration: "On the left side, there's a file tree sidebar. This lets me browse other files in the same directory — I can explore related modules, test files, or configuration without going back to search. It's a full repository browser." },

  // ── Chapter 5: Cross-References ── (idx 24–28)
  { idx: 24, kind: "title", text: "Chapter 5", subtitle: "Cross-References", narration: "Sourcegraph's code intelligence goes beyond plain text search.", durationMs: 3000 },
  { idx: 25, kind: "segment", narration: "Watch what happens when I hover over a symbol in the code. A tooltip appears with the definition preview — I can see the type signature, the docstring, and where it's defined. This is real code intelligence, not just text matching." },
  { idx: 26, kind: "segment", narration: "If I click on that symbol, it takes me directly to the definition — even if it's in a completely different repository. This is jump-to-definition working across the entire Comfy ecosystem, not just one repo." },
  { idx: 27, kind: "segment", narration: "I can also find all references. This shows me every place where this symbol is used — every import, every function call, every type annotation. It's like find-all-references in VS Code, but across all repositories." },
  { idx: 28, kind: "segment", narration: "And here's git blame — I can see who last modified each line and when. This is invaluable when you need to understand why a piece of code was written a certain way, or who to ask about a specific implementation." },

  // ── Chapter 6: Repository Browser ── (idx 29–32)
  { idx: 29, kind: "title", text: "Chapter 6", subtitle: "Repository Browser", narration: "Comfy Code Search isn't just search — it's a full repository browser.", durationMs: 3000 },
  { idx: 30, kind: "segment", narration: "Let me navigate to the repository list. Here I can see all the Comfy-Org repositories indexed by Sourcegraph. Each one is searchable and browsable — from the main ComfyUI backend to frontend packages and community tools." },
  { idx: 31, kind: "segment", narration: "I'll open a repository and navigate through its file tree. This gives me the same experience as browsing on GitHub, but with Sourcegraph's code intelligence baked in — hover for definitions, click for references." },
  { idx: 32, kind: "segment", narration: "I can even view the README directly in the browser. This is a great starting point when you encounter an unfamiliar repo in search results — read the README, understand the project, then dive into the code." },

  // ── Outro ── (idx 33–34)
  { idx: 33, kind: "segment", narration: "That's Comfy Code Search — regex-powered cross-repo search, instant code navigation, git blame, and a full repository browser. The fastest way to understand any part of the Comfy ecosystem." },
  { idx: 34, kind: "outro", text: "Comfy Code Search", subtitle: "cs.comfy.org", narration: "With Comfy Code Search you get instant cross-repo search with regex, Sourcegraph-powered code intelligence, jump-to-definition, find-references, git blame, and a full repository browser — all from your browser.", durationMs: 4000 },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
//  PLAYWRIGHT IMPLEMENTATION (consumes VIDEO_SCRIPT above)
// ─────────────────────────────────────────────────────────────────────────────
import { test, safeMove } from "./fixtures/fixture";
import { createVideoScript } from "../lib/demowright/dist/index.mjs";
import { typeKeys } from "../lib/demowright/dist/helpers.mjs";

test("comfy code search tour", async ({ page }) => {
  test.setTimeout(10 * 60_000);

  // Pre-navigate (heavy work BEFORE script.render)
  const SEARCH_URL = "https://cs.comfy.org/";
  await page.goto(SEARCH_URL, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(3000);

  // Track URLs captured between segments for navigation
  let sourceFileUrl = "";
  let repoListUrl = "https://cs.comfy.org/search/console";
  let repoUrl = "";

  // Selectors used repeatedly
  const SEARCH_INPUT =
    "[data-testid='searchbox'] textarea, .monaco-editor textarea, input[type='text'], textarea";
  const RESULT_ITEM =
    "[data-result-id], [class*='result'], [class*='Result'], [class*='StreamingSearchResult']";
  const RESULT_LINK = "a[href*='/-/blob/'], a[href*='github.com']";
  const CODE_VIEW = "pre, code, [class*='code'], [class*='blob'], [class*='Blob']";
  const SIDEBAR = "aside, nav, [class*='sidebar'], [class*='Sidebar'], [class*='panel']";

  /** Helper: focus and clear the search box, then type a new query */
  async function clearAndType(query: string) {
    const searchBox = page.locator(SEARCH_INPUT).first();
    if (await searchBox.isVisible().catch(() => false)) {
      await searchBox.click().catch(() => {});
    }
    // Triple-click to select all, then replace
    await page.keyboard.press("Meta+a");
    await page.waitForTimeout(200);
    await typeKeys(page, query, 70);
  }

  const script = createVideoScript()

    // ════════════════════════════════════════════════════════════════════════
    //  INTRO
    // ════════════════════════════════════════════════════════════════════════

    .title(VS[0].text, {
      subtitle: VS[0].subtitle,
      narration: VS[0].narration,
      durationMs: VS[0].durationMs,
    })

    // Segment 1 — Code spans dozens of repos
    .segment(VS[1].narration, async (pace) => {
      await safeMove(page, "h1, header, [class*='logo'], [class*='Logo']");
      await pace();
      await safeMove(page, "main, [class*='search'], [class*='Search']");
      await pace();
      await page.mouse.wheel(0, 100);
      await pace();
    })

    // Segment 2 — Sourcegraph-powered cross-repo search
    .segment(VS[2].narration, async (pace) => {
      await safeMove(page, SEARCH_INPUT);
      await pace();
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" })).catch(() => {});
      await pace();
      await safeMove(page, "h1, header, [class*='logo'], [class*='Logo']");
      await pace();
    })

    // ════════════════════════════════════════════════════════════════════════
    //  CHAPTER 1: FIRST SEARCH
    // ════════════════════════════════════════════════════════════════════════

    .title(VS[3].text, {
      subtitle: VS[3].subtitle,
      narration: VS[3].narration,
      durationMs: VS[3].durationMs,
    })

    // Segment 4 — Type KSampler in the Monaco search bar
    .segment(VS[4].narration, async (pace) => {
      const searchBox = page.locator(SEARCH_INPUT).first();
      if (await searchBox.isVisible().catch(() => false)) {
        await searchBox.click().catch(() => {});
      }
      await pace();
      await typeKeys(page, "KSampler", 90);
      await pace();
      await page.keyboard.press("Enter");
      await page.waitForTimeout(4000);
    })

    // Segment 5 — Results streaming in
    .segment(VS[5].narration, async (pace) => {
      const resultLink = page.locator(RESULT_LINK).first();
      await resultLink.waitFor({ state: "visible", timeout: 8000 }).catch(() => {});
      await safeMove(page, RESULT_ITEM);
      await pace();
      await page.mouse.wheel(0, 200);
      await pace();
      // Capture a result link for Chapter 4 navigation
      sourceFileUrl = (await resultLink.getAttribute("href").catch(() => "")) ?? "";
      if (sourceFileUrl && !sourceFileUrl.startsWith("http")) {
        sourceFileUrl = new URL(sourceFileUrl, SEARCH_URL).href;
      }
      await page.mouse.wheel(0, 150);
      await pace();
    })

    // Segment 6 — Result anatomy: repo name, file path, matching lines
    .segment(VS[6].narration, async (pace) => {
      await page.evaluate(() => window.scrollTo({ top: 200, behavior: "smooth" })).catch(() => {});
      await page.waitForTimeout(500);
      // Hover over the first result to show repo name
      await safeMove(page, RESULT_ITEM);
      await pace();
      // Hover over matching lines with syntax highlighting
      await safeMove(page, "[class*='match'], [class*='highlight'], mark, .cm-line");
      await pace();
      await safeMove(page, RESULT_LINK);
      await pace();
    })

    // Segment 7 — Match counter and overview
    .segment(VS[7].narration, async (pace) => {
      // Scroll back to top to see the match counter
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" })).catch(() => {});
      await page.waitForTimeout(500);
      await safeMove(page, "[class*='count'], [class*='Count'], [class*='info'], [class*='header']");
      await pace();
      await page.mouse.wheel(0, 300);
      await pace();
      await page.mouse.wheel(0, 300);
      await pace();
    })

    // ════════════════════════════════════════════════════════════════════════
    //  CHAPTER 2: UNDERSTANDING RESULTS
    // ════════════════════════════════════════════════════════════════════════

    .title(VS[8].text, {
      subtitle: VS[8].subtitle,
      narration: VS[8].narration,
      durationMs: VS[8].durationMs,
    })

    // Segment 9 — Scroll through grouped results
    .segment(VS[9].narration, async (pace) => {
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" })).catch(() => {});
      await page.waitForTimeout(500);
      await page.mouse.wheel(0, 400);
      await pace();
      await page.mouse.wheel(0, 400);
      await pace();
      await page.mouse.wheel(0, 400);
      await pace();
      await page.mouse.wheel(0, 300);
      await pace();
    })

    // Segment 10 — Sidebar language filter (click Python)
    .segment(VS[10].narration, async (pace) => {
      await safeMove(page, SIDEBAR);
      await pace();
      // Try to click a language filter (Python)
      const langFilter = page.locator("text=Python, [data-testid*='lang'], [class*='language']").first();
      if (await langFilter.isVisible().catch(() => false)) {
        await safeMove(page, "text=Python");
        await pace();
        await langFilter.click().catch(() => {});
        await page.waitForTimeout(2000);
      } else {
        await page.mouse.wheel(0, 200);
        await pace();
      }
    })

    // Segment 11 — Filtered Python results
    .segment(VS[11].narration, async (pace) => {
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" })).catch(() => {});
      await page.waitForTimeout(500);
      await safeMove(page, "[class*='count'], [class*='Count'], [class*='info']");
      await pace();
      await page.mouse.wheel(0, 300);
      await pace();
      await safeMove(page, RESULT_ITEM);
      await pace();
    })

    // Segment 12 — Filter by repo, then clear filters
    .segment(VS[12].narration, async (pace) => {
      // Try to find a repo filter in the sidebar
      const repoFilter = page.locator("[class*='repo'], [data-testid*='repo']").first();
      if (await repoFilter.isVisible().catch(() => false)) {
        await safeMove(page, "[class*='repo'], [data-testid*='repo']");
        await pace();
      }
      await pace();
      // Navigate back to clear filters — re-run the plain KSampler search
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" })).catch(() => {});
      await page.waitForTimeout(500);
      await safeMove(page, SEARCH_INPUT);
      await pace();
    })

    // ════════════════════════════════════════════════════════════════════════
    //  CHAPTER 3: ADVANCED SEARCH
    // ════════════════════════════════════════════════════════════════════════

    .title(VS[13].text, {
      subtitle: VS[13].subtitle,
      narration: VS[13].narration,
      durationMs: VS[13].durationMs,
    })

    // Segment 14 — Regex search: /class\s+KSampler/
    .segment(VS[14].narration, async (pace) => {
      await clearAndType("/class\\s+KSampler/");
      await pace();
      await page.keyboard.press("Enter");
      await page.waitForTimeout(4000);
      await safeMove(page, RESULT_ITEM);
      await pace();
    })

    // Segment 15 — Regex results — only class definitions
    .segment(VS[15].narration, async (pace) => {
      await page.mouse.wheel(0, 250);
      await pace();
      await safeMove(page, "[class*='match'], [class*='highlight'], mark, .cm-line");
      await pace();
      await page.mouse.wheel(0, 250);
      await pace();
    })

    // Segment 16 — File filter: file:*.py and lang:python
    .segment(VS[16].narration, async (pace) => {
      await clearAndType("KSampler file:*.py");
      await pace();
      await page.keyboard.press("Enter");
      await page.waitForTimeout(3000);
      await safeMove(page, RESULT_ITEM);
      await pace();
      // Show lang:python alternative
      await clearAndType("KSampler lang:python");
      await pace();
    })

    // Segment 17 — Symbol search: type:symbol KSampler
    .segment(VS[17].narration, async (pace) => {
      await clearAndType("type:symbol KSampler");
      await pace();
      await page.keyboard.press("Enter");
      await page.waitForTimeout(4000);
      await safeMove(page, RESULT_ITEM);
      await pace();
      await page.mouse.wheel(0, 300);
      await pace();
    })

    // ════════════════════════════════════════════════════════════════════════
    //  CHAPTER 4: CODE NAVIGATION
    // ════════════════════════════════════════════════════════════════════════

    .title(VS[18].text, {
      subtitle: VS[18].subtitle,
      narration: VS[18].narration,
      durationMs: VS[18].durationMs,
    })

    // Segment 19 — Click into a result to see full source
    .segment(VS[19].narration, async (pace) => {
      // Navigate to source file captured earlier
      if (sourceFileUrl) {
        await page.goto(sourceFileUrl, { waitUntil: "domcontentloaded" });
        await page.waitForTimeout(3000);
      } else {
        // Fallback: go back to search and click first result
        await page.goto(SEARCH_URL + "search?q=KSampler&patternType=keyword", { waitUntil: "domcontentloaded" });
        await page.waitForTimeout(3000);
        const link = page.locator(RESULT_LINK).first();
        await link.click().catch(() => {});
        await page.waitForTimeout(3000);
      }
      await safeMove(page, CODE_VIEW);
      await pace();
      await page.mouse.wheel(0, 200);
      await pace();
    })

    // Segment 20 — Line numbers and syntax highlighting
    .segment(VS[20].narration, async (pace) => {
      // Hover over line numbers
      await safeMove(page, "[class*='line-number'], [class*='LineNumber'], .line-number, td.line");
      await pace();
      await safeMove(page, CODE_VIEW);
      await pace();
      await page.mouse.wheel(0, 150);
      await pace();
    })

    // Segment 21 — Scroll through the file for full context
    .segment(VS[21].narration, async (pace) => {
      // Scroll up to see imports
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" })).catch(() => {});
      await page.waitForTimeout(800);
      await safeMove(page, CODE_VIEW);
      await pace();
      // Scroll down through the class definition
      await page.mouse.wheel(0, 400);
      await pace();
      await page.mouse.wheel(0, 400);
      await pace();
      await page.mouse.wheel(0, 300);
      await pace();
    })

    // Segment 22 — Breadcrumb navigation
    .segment(VS[22].narration, async (pace) => {
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" })).catch(() => {});
      await page.waitForTimeout(500);
      await safeMove(page, "[class*='breadcrumb'], [class*='Breadcrumb'], nav[aria-label*='bread'], .repo-header");
      await pace();
      // Hover over each breadcrumb segment
      await safeMove(page, "[class*='breadcrumb'] a, [class*='Breadcrumb'] a, .repo-header a");
      await pace();
      await page.mouse.wheel(0, 100);
      await pace();
    })

    // Segment 23 — File tree sidebar
    .segment(VS[23].narration, async (pace) => {
      // Look for file tree toggle or sidebar
      await safeMove(page, "[class*='file-tree'], [class*='FileTree'], [class*='tree'], [class*='Tree']");
      await pace();
      await safeMove(page, SIDEBAR);
      await pace();
      // Scroll the sidebar to show more files
      await page.mouse.wheel(0, 200);
      await pace();
      await safeMove(page, "[class*='file-tree'] a, [class*='TreeNode'], [class*='tree-item']");
      await pace();
    })

    // ════════════════════════════════════════════════════════════════════════
    //  CHAPTER 5: CROSS-REFERENCES
    // ════════════════════════════════════════════════════════════════════════

    .title(VS[24].text, {
      subtitle: VS[24].subtitle,
      narration: VS[24].narration,
      durationMs: VS[24].durationMs,
    })

    // Segment 25 — Hover a symbol to see definition preview
    .segment(VS[25].narration, async (pace) => {
      // Make sure we're viewing a source file
      await page.evaluate(() => window.scrollTo({ top: 200, behavior: "smooth" })).catch(() => {});
      await page.waitForTimeout(500);
      // Hover over a symbol/token in the code
      const token = page.locator("[class*='token'], [class*='identifier'], .hl-typed, span.hl-def").first();
      if (await token.isVisible().catch(() => false)) {
        const box = await token.boundingBox().catch(() => null);
        if (box) {
          await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
          await page.waitForTimeout(2000); // Wait for hover tooltip
        }
      }
      await pace();
      await safeMove(page, "[class*='tooltip'], [class*='Tooltip'], [class*='hover'], [class*='popover']");
      await pace();
    })

    // Segment 26 — Jump to definition
    .segment(VS[26].narration, async (pace) => {
      // Try clicking a definition link
      const defLink = page.locator("[class*='token'], [class*='identifier'], span.hl-def, a[href*='/-/blob/']").first();
      if (await defLink.isVisible().catch(() => false)) {
        await safeMove(page, "[class*='token'], [class*='identifier'], span.hl-def");
        await pace();
        // Capture current URL for potential back-nav
        const beforeUrl = page.url();
        await defLink.click().catch(() => {});
        await page.waitForTimeout(3000);
        // Store new URL
        repoUrl = page.url();
      }
      await safeMove(page, CODE_VIEW);
      await pace();
      await page.mouse.wheel(0, 200);
      await pace();
    })

    // Segment 27 — Find all references
    .segment(VS[27].narration, async (pace) => {
      // Right-click or look for "Find references" option
      await safeMove(page, "[class*='token'], [class*='identifier'], span.hl-def");
      await pace();
      // Try to trigger references panel
      const refBtn = page.locator("text=references, text=References, [class*='reference']").first();
      if (await refBtn.isVisible().catch(() => false)) {
        await safeMove(page, "text=references, text=References, [class*='reference']");
        await pace();
      }
      await page.mouse.wheel(0, 300);
      await pace();
      await page.mouse.wheel(0, 200);
      await pace();
    })

    // Segment 28 — Git blame
    .segment(VS[28].narration, async (pace) => {
      // Look for blame button/toggle
      const blameBtn = page.locator("text=Blame, text=blame, [class*='blame'], [aria-label*='blame']").first();
      if (await blameBtn.isVisible().catch(() => false)) {
        await safeMove(page, "text=Blame, text=blame, [class*='blame']");
        await pace();
        await blameBtn.click().catch(() => {});
        await page.waitForTimeout(2000);
      }
      await pace();
      // Show blame annotations
      await safeMove(page, "[class*='blame'], [class*='Blame'], [class*='author']");
      await pace();
      await page.mouse.wheel(0, 200);
      await pace();
    })

    // ════════════════════════════════════════════════════════════════════════
    //  CHAPTER 6: REPOSITORY BROWSER
    // ════════════════════════════════════════════════════════════════════════

    .title(VS[29].text, {
      subtitle: VS[29].subtitle,
      narration: VS[29].narration,
      durationMs: VS[29].durationMs,
    })

    // Segment 30 — Browse the repository list
    .segment(VS[30].narration, async (pace) => {
      // Navigate to the repository list
      await page.goto(SEARCH_URL, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(2000);
      // Look for a "Repositories" link or navigate
      const repoLink = page.locator("text=Repositories, text=repositories, a[href*='repo']").first();
      if (await repoLink.isVisible().catch(() => false)) {
        await safeMove(page, "text=Repositories, text=repositories");
        await pace();
        await repoLink.click().catch(() => {});
        await page.waitForTimeout(2000);
      }
      await pace();
      await page.mouse.wheel(0, 300);
      await pace();
      await page.mouse.wheel(0, 300);
      await pace();
    })

    // Segment 31 — Open a repo, navigate the file tree
    .segment(VS[31].narration, async (pace) => {
      // Click the first repo in the list
      const firstRepo = page.locator("a[href*='comfyanonymous'], a[href*='Comfy-Org'], [class*='repo-link']").first();
      if (await firstRepo.isVisible().catch(() => false)) {
        await safeMove(page, "a[href*='comfyanonymous'], a[href*='Comfy-Org']");
        await pace();
        await firstRepo.click().catch(() => {});
        await page.waitForTimeout(3000);
      }
      await safeMove(page, "[class*='file-tree'], [class*='FileTree'], [class*='tree'], [class*='Tree']");
      await pace();
      await page.mouse.wheel(0, 200);
      await pace();
    })

    // Segment 32 — View README in the browser
    .segment(VS[32].narration, async (pace) => {
      // Look for README link
      const readmeLink = page.locator("a[href*='README'], text=README, [class*='readme']").first();
      if (await readmeLink.isVisible().catch(() => false)) {
        await safeMove(page, "a[href*='README'], text=README");
        await pace();
        await readmeLink.click().catch(() => {});
        await page.waitForTimeout(2000);
      }
      await safeMove(page, CODE_VIEW);
      await pace();
      await page.mouse.wheel(0, 400);
      await pace();
      await page.mouse.wheel(0, 300);
      await pace();
    })

    // ════════════════════════════════════════════════════════════════════════
    //  OUTRO
    // ════════════════════════════════════════════════════════════════════════

    // Segment 33 — Closing statement
    .segment(VS[33].narration, async (pace) => {
      // Go back to homepage for closing shot
      await page.goto(SEARCH_URL, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(2000);
      await safeMove(page, "h1, header, [class*='logo'], [class*='Logo']");
      await pace();
      await safeMove(page, SEARCH_INPUT);
      await pace();
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" })).catch(() => {});
      await pace();
    })

    // Conclusion card with narration
    .outro({
      text: VS[34].text,
      subtitle: VS[34].subtitle,
      narration: VS[34].narration,
      durationMs: VS[34].durationMs,
    });

  await script.prepare(page);
  await script.render(page, {
    baseName: "comfy-codesearch",
    outputDir: ".comfy-qa/.demos",
  });
});
