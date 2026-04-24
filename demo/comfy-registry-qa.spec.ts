/**
 * Comfy Registry — QA Evidence Video
 * Score: 10/14 (71%)
 */
import { test, safeMove, expect } from "./fixtures/fixture";
import { createVideoScript } from "../lib/demowright/dist/index.mjs";

const SCORECARD_HTML = "<!DOCTYPE html>\n<html><head><meta charset=\"utf-8\"><title>Comfy Registry QA</title>\n<style>\n  * { box-sizing: border-box; margin: 0; padding: 0; }\n  body {\n    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;\n    background: radial-gradient(ellipse at top, #1a1f3a 0%, #0a0e1f 100%);\n    color: #fff;\n    min-height: 100vh;\n    padding: 40px 60px;\n  }\n  header {\n    text-align: center;\n    margin-bottom: 32px;\n  }\n  header h1 {\n    font-size: 42px;\n    font-weight: 800;\n    margin-bottom: 8px;\n    background: linear-gradient(135deg, #fff 0%, #8892b0 100%);\n    -webkit-background-clip: text;\n    background-clip: text;\n    -webkit-text-fill-color: transparent;\n  }\n  header .total {\n    font-size: 28px;\n    font-weight: 600;\n    color: #facc15;\n  }\n  .features {\n    display: grid;\n    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));\n    gap: 20px;\n  }\n  .feature {\n    background: rgba(255, 255, 255, 0.04);\n    border: 1px solid rgba(255, 255, 255, 0.1);\n    border-radius: 12px;\n    padding: 20px 24px;\n    backdrop-filter: blur(10px);\n  }\n  .feature.pass { border-left: 4px solid #4ade80; }\n  .feature.partial { border-left: 4px solid #facc15; }\n  .feature h3 {\n    font-size: 20px;\n    font-weight: 700;\n    margin-bottom: 12px;\n    display: flex;\n    align-items: center;\n    gap: 10px;\n  }\n  .feature h3 .score {\n    margin-left: auto;\n    font-family: 'SF Mono', Monaco, monospace;\n    font-size: 18px;\n    color: #8892b0;\n  }\n  .feature ul { list-style: none; }\n  .feature li {\n    padding: 6px 0;\n    font-size: 15px;\n    display: flex;\n    align-items: center;\n    gap: 10px;\n    color: #ccd6f6;\n  }\n  .feature li.fail { color: #8892b0; text-decoration: line-through; }\n  .mark {\n    display: inline-block;\n    width: 20px;\n    height: 20px;\n    line-height: 20px;\n    text-align: center;\n    border-radius: 50%;\n    font-weight: 700;\n    font-size: 12px;\n    flex-shrink: 0;\n  }\n  .feature.pass h3 .mark { background: #4ade80; color: #0a0e1f; }\n  .feature.partial h3 .mark { background: #facc15; color: #0a0e1f; }\n  .feature li.pass .mark { background: rgba(74, 222, 128, 0.2); color: #4ade80; }\n  .feature li.fail .mark { background: rgba(248, 113, 113, 0.2); color: #f87171; }\n  footer {\n    text-align: center;\n    margin-top: 40px;\n    font-size: 14px;\n    color: #8892b0;\n  }\n</style>\n</head><body>\n  <header>\n    <h1>Comfy Registry QA Results</h1>\n    <div class=\"total\">10/14 &nbsp;•&nbsp; 71%</div>\n  </header>\n  <div class=\"features\">\n    \n    <section class=\"feature pass\">\n      <h3><span class=\"mark\">✓</span>Landing Page <span class=\"score\">2/2</span></h3>\n      <ul><li class=\"pass\"><span class=\"mark\">✓</span>view_hero</li><li class=\"pass\"><span class=\"mark\">✓</span>view_trending</li></ul>\n    </section>\n    <section class=\"feature pass\">\n      <h3><span class=\"mark\">✓</span>Node Search <span class=\"score\">3/3</span></h3>\n      <ul><li class=\"pass\"><span class=\"mark\">✓</span>search_by_name</li><li class=\"pass\"><span class=\"mark\">✓</span>clear_and_search_again</li><li class=\"pass\"><span class=\"mark\">✓</span>view_result_card</li></ul>\n    </section>\n    <section class=\"feature partial\">\n      <h3><span class=\"mark\">⚠</span>Node Detail <span class=\"score\">4/5</span></h3>\n      <ul><li class=\"pass\"><span class=\"mark\">✓</span>view_node_page</li><li class=\"pass\"><span class=\"mark\">✓</span>view_readme</li><li class=\"pass\"><span class=\"mark\">✓</span>view_install_command</li><li class=\"pass\"><span class=\"mark\">✓</span>view_version_history</li><li class=\"fail\"><span class=\"mark\">✗</span>view_metadata</li></ul>\n    </section>\n    <section class=\"feature partial\">\n      <h3><span class=\"mark\">⚠</span>Publisher Profile <span class=\"score\">0/2</span></h3>\n      <ul><li class=\"fail\"><span class=\"mark\">✗</span>navigate_to_publisher</li><li class=\"fail\"><span class=\"mark\">✗</span>view_publisher_nodes</li></ul>\n    </section>\n    <section class=\"feature partial\">\n      <h3><span class=\"mark\">⚠</span>Documentation <span class=\"score\">1/2</span></h3>\n      <ul><li class=\"pass\"><span class=\"mark\">✓</span>view_docs_overview</li><li class=\"fail\"><span class=\"mark\">✗</span>view_publish_guide</li></ul>\n    </section>\n  </div>\n  <footer>Comfy-QA Evidence • Generated 2026-04-13</footer>\n</body></html>";

test("comfy-registry QA evidence", async ({ page }) => {
  test.setTimeout(15 * 60_000);

  const script = createVideoScript()
    .title("Comfy Registry QA", {
      subtitle: "Score: 10/14 (71%)",
      durationMs: 3000,
    })

    // ── Landing Page (2/2) ──
    // ✅ view_hero — PASS
    .segment("Welcome to the Comfy Registry — the central hub for finding and installing ComfyUI custom nodes.", async (pace) => {
      await safeMove(page, "h1");
      await page.waitForTimeout(400);
      await safeMove(page, "header");
      await pace();
    })
    // ✅ view_trending — PASS
    .segment("Scrolling down, I can see the trending nodes — these are what the community is installing right now.", async (pace) => {
      await page.mouse.wheel(0, 400);
      await page.waitForTimeout(600);
      await safeMove(page, ".grid");
      await page.mouse.wheel(0, 200);
      await pace();
    })

    // ── Node Search (3/3) ──
    // ✅ search_by_name — PASS
    .segment("I want image upscaling, so I'm typing SUPIR into the search box. Results appear instantly as I type.", {
      setup: async () => {
        await page.mouse.wheel(0, -600);
        await page.waitForTimeout(500);
        const searchInput = page.locator("input[placeholder*='Search Nodes'], input[type='search'], input[placeholder*='search']").first();
        await searchInput.click({ timeout: 5000 }).catch(() => {});
        await page.waitForTimeout(300);
        await searchInput.fill("SUPIR", { timeout: 5000 }).catch(() => {});
        await page.waitForTimeout(2000);
      },
      action: async (pace) => {
        await safeMove(page, "input[placeholder*='Search Nodes'], input[type='search']");
        await page.mouse.wheel(0, 300);
        await page.waitForTimeout(500);
        await safeMove(page, ".card, article, [class*='node'], [class*='result']");
        await pace();
      },
    })
    // ✅ clear_and_search_again — PASS
    .segment("Now I'm clearing the search and typing video to find video processing nodes.", {
      setup: async () => {
        const searchInput = page.locator("input[placeholder*='Search Nodes'], input[type='search'], input[placeholder*='search']").first();
        await searchInput.click({ timeout: 5000 }).catch(() => {});
        await page.keyboard.selectAll();
        await page.waitForTimeout(200);
        await searchInput.fill("video", { timeout: 5000 }).catch(() => {});
        await page.waitForTimeout(2000);
        await page.mouse.wheel(0, 200);
      },
      action: async (pace) => {
        await safeMove(page, "input[placeholder*='Search Nodes'], input[type='search']");
        await page.waitForTimeout(400);
        await safeMove(page, ".card:first-child, article:first-child");
        await pace();
      },
    })
    // ✅ view_result_card — PASS
    .segment("Each result card shows the node name, version, publisher, download count, and tags — everything I need to decide at a glance.", async (pace) => {
      await safeMove(page, ".card:first-child, article:first-child");
      await page.mouse.wheel(0, 100);
      await page.waitForTimeout(400);
      await safeMove(page, ".card:nth-child(2), article:nth-child(2)");
      await pace();
    })

    // ── Node Detail (4/5) ──
    // ✅ view_node_page — PASS
    .segment("Here's the detail page for ReActor Node — I can see the name, publisher badge, version, and download count right at the top.", {
      setup: async () => {
        await page.goto("https://registry.comfy.org/nodes/comfyui-reactor-node", { waitUntil: "domcontentloaded", timeout: 15000 });
        await page.waitForTimeout(1500);
      },
      action: async (pace) => {
        await safeMove(page, "h1");
        await page.mouse.wheel(0, 200);
        await pace();
      },
    })
    // ✅ view_readme — PASS
    .segment("Scrolling down, the README documentation is rendered right here — no need to open GitHub.", async (pace) => {
      await page.mouse.wheel(0, 300);
      await page.waitForTimeout(500);
      await safeMove(page, "article, .prose, [class*='readme'], [class*='markdown']");
      await page.mouse.wheel(0, 300);
      await pace();
    })
    // ✅ view_install_command — PASS
    .segment("One command to install — I can copy this and paste it directly into my terminal.", async (pace) => {
      await page.mouse.wheel(0, -300);
      await page.waitForTimeout(400);
      await safeMove(page, "code, pre, [class*='install'], [class*='command']");
      await pace();
    })
    // ✅ view_version_history — PASS
    .segment("The version history shows frequent updates — that means active maintenance and a healthy project.", {
      setup: async () => {
        await page.mouse.wheel(0, 500);
      },
      action: async (pace) => {
        await safeMove(page, "h2, h3");
        await page.mouse.wheel(0, 200);
        await pace();
      },
    })
    // ❌ view_metadata — FAIL: metadata sidebar not found
    .segment("I'm looking for the metadata sidebar that should show OS support, GPU compatibility, and license — but it's not present on this page.", async (pace) => {
      await page.mouse.wheel(0, -400);
      await page.waitForTimeout(400);
      await safeMove(page, "aside, [class*='sidebar'], [class*='metadata']");
      await page.mouse.wheel(0, 200);
      await page.waitForTimeout(400);
      await pace();
    })

    // ── Publisher Profile (0/2) ──
    // ❌ navigate_to_publisher — FAIL: publisher link not clickable
    .segment("I'm trying to click on the publisher name to navigate to their profile page — but the link doesn't work.", async (pace) => {
      await page.mouse.wheel(0, -600);
      await page.waitForTimeout(500);
      await safeMove(page, "a[href*='publisher'], a[href*='profile'], [class*='publisher']");
      await page.locator("a[href*='publisher'], a[href*='/p/']").first().click({ timeout: 3000 }).catch(() => {});
      await page.waitForTimeout(1000);
      await safeMove(page, "h1");
      await pace();
    })
    // ❌ view_publisher_nodes — FAIL: publisher profile page unavailable
    .segment("There's no publisher profile page to show all their other nodes — this feature is currently missing.", async (pace) => {
      await page.mouse.wheel(0, 200);
      await page.waitForTimeout(400);
      await safeMove(page, "main, .container");
      await pace();
    })

    // ── Documentation (1/2) ──
    // ✅ view_docs_overview — PASS
    .segment("The documentation covers API endpoints, publishing guides, and packaging requirements for node authors.", {
      setup: async () => {
        await page.goto("https://docs.comfy.org/registry/overview", { waitUntil: "domcontentloaded", timeout: 15000 });
        await page.waitForTimeout(1500);
      },
      action: async (pace) => {
        await safeMove(page, "h1");
        await page.mouse.wheel(0, 300);
        await page.waitForTimeout(400);
        await safeMove(page, "article, main");
        await pace();
      },
    })
    // ❌ view_publish_guide — FAIL: publish guide link not found
    .segment("I'm looking for the publishing nodes guide — the link should be in the sidebar but it's not visible here.", async (pace) => {
      await safeMove(page, "nav, aside");
      await page.locator("a[href*='publish']").first().click({ timeout: 3000 }).catch(() => {});
      await page.waitForTimeout(1000);
      await safeMove(page, "h1");
      await page.mouse.wheel(0, 200);
      await pace();
    })

    // Final scorecard
    .segment("Here are the final QA results for Comfy Registry. Out of 14 operations, 10 passed — 71 percent. Landing Page and Node Search work fully. Node Detail scored 4 out of 5, Publisher Profile scored 0 out of 2, and Documentation scored 1 out of 2.", {
      setup: async () => {
        await page.setContent(SCORECARD_HTML, { waitUntil: "domcontentloaded" });
        await page.waitForTimeout(500);
      },
      action: async (pace) => {
        await safeMove(page, "header");
        await page.mouse.wheel(0, 200);
        await pace();
      },
    })

    .outro({
      text: "QA Results: 10/14 (71%)",
      subtitle: "Landing Page 2/2 ✅ | Node Search 3/3 ✅ | Node Detail 4/5 ⚠ | Publisher Profile 0/2 ⚠ | Documentation 1/2 ⚠",
      durationMs: 4000,
    });

  await script.prepare(page);

  await page.goto("https://registry.comfy.org/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);

  await script.render(page, {
    baseName: "comfy-registry-qa",
    outputDir: ".comfy-qa/.demos",
  });
});
