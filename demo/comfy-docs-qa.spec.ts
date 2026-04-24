/**
 * Comfy Docs — QA Evidence Video
 * Score: 4/5 (80%)
 */
import { test, safeMove, expect } from "./fixtures/fixture";
import { createVideoScript } from "../lib/demowright/dist/index.mjs";

const SCORECARD_HTML = "<!DOCTYPE html>\n<html><head><meta charset=\"utf-8\"><title>Comfy Docs QA</title>\n<style>\n  * { box-sizing: border-box; margin: 0; padding: 0; }\n  body {\n    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;\n    background: radial-gradient(ellipse at top, #1a1f3a 0%, #0a0e1f 100%);\n    color: #fff;\n    min-height: 100vh;\n    padding: 40px 60px;\n  }\n  header {\n    text-align: center;\n    margin-bottom: 32px;\n  }\n  header h1 {\n    font-size: 42px;\n    font-weight: 800;\n    margin-bottom: 8px;\n    background: linear-gradient(135deg, #fff 0%, #8892b0 100%);\n    -webkit-background-clip: text;\n    background-clip: text;\n    -webkit-text-fill-color: transparent;\n  }\n  header .total {\n    font-size: 28px;\n    font-weight: 600;\n    color: #4ade80;\n  }\n  .features {\n    display: grid;\n    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));\n    gap: 20px;\n  }\n  .feature {\n    background: rgba(255, 255, 255, 0.04);\n    border: 1px solid rgba(255, 255, 255, 0.1);\n    border-radius: 12px;\n    padding: 20px 24px;\n    backdrop-filter: blur(10px);\n  }\n  .feature.pass { border-left: 4px solid #4ade80; }\n  .feature.partial { border-left: 4px solid #facc15; }\n  .feature h3 {\n    font-size: 20px;\n    font-weight: 700;\n    margin-bottom: 12px;\n    display: flex;\n    align-items: center;\n    gap: 10px;\n  }\n  .feature h3 .score {\n    margin-left: auto;\n    font-family: 'SF Mono', Monaco, monospace;\n    font-size: 18px;\n    color: #8892b0;\n  }\n  .feature ul { list-style: none; }\n  .feature li {\n    padding: 6px 0;\n    font-size: 15px;\n    display: flex;\n    align-items: center;\n    gap: 10px;\n    color: #ccd6f6;\n  }\n  .feature li.fail { color: #8892b0; text-decoration: line-through; }\n  .mark {\n    display: inline-block;\n    width: 20px;\n    height: 20px;\n    line-height: 20px;\n    text-align: center;\n    border-radius: 50%;\n    font-weight: 700;\n    font-size: 12px;\n    flex-shrink: 0;\n  }\n  .feature.pass h3 .mark { background: #4ade80; color: #0a0e1f; }\n  .feature.partial h3 .mark { background: #facc15; color: #0a0e1f; }\n  .feature li.pass .mark { background: rgba(74, 222, 128, 0.2); color: #4ade80; }\n  .feature li.fail .mark { background: rgba(248, 113, 113, 0.2); color: #f87171; }\n  footer {\n    text-align: center;\n    margin-top: 40px;\n    font-size: 14px;\n    color: #8892b0;\n  }\n</style>\n</head><body>\n  <header>\n    <h1>Comfy Docs QA Results</h1>\n    <div class=\"total\">4/5 &nbsp;•&nbsp; 80%</div>\n  </header>\n  <div class=\"features\">\n    \n    <section class=\"feature pass\">\n      <h3><span class=\"mark\">✓</span>Landing Page <span class=\"score\">2/2</span></h3>\n      <ul><li class=\"pass\"><span class=\"mark\">✓</span>view_hero</li><li class=\"pass\"><span class=\"mark\">✓</span>view_sidebar</li></ul>\n    </section>\n    <section class=\"feature partial\">\n      <h3><span class=\"mark\">⚠</span>Getting Started <span class=\"score\">0/1</span></h3>\n      <ul><li class=\"fail\"><span class=\"mark\">✗</span>view_install_guide</li></ul>\n    </section>\n    <section class=\"feature pass\">\n      <h3><span class=\"mark\">✓</span>Tutorials <span class=\"score\">1/1</span></h3>\n      <ul><li class=\"pass\"><span class=\"mark\">✓</span>view_tutorials</li></ul>\n    </section>\n    <section class=\"feature pass\">\n      <h3><span class=\"mark\">✓</span>Custom Nodes <span class=\"score\">1/1</span></h3>\n      <ul><li class=\"pass\"><span class=\"mark\">✓</span>view_custom_nodes_docs</li></ul>\n    </section>\n  </div>\n  <footer>Comfy-QA Evidence • Generated 2026-04-12</footer>\n</body></html>";

test("comfy-docs QA evidence", async ({ page }) => {
  test.setTimeout(15 * 60_000);

  const script = createVideoScript()
    .title("Comfy Docs QA", {
      subtitle: "Score: 4/5 (80%)",
      durationMs: 3000,
    })

    // ── Landing Page (2/2) ──
    // ✅ view_hero — PASS
    .segment("This is the Comfy Docs homepage — the starting point for learning ComfyUI.", {
      setup: async () => {
        await page.mouse.wheel(0, 0);
        await page.waitForTimeout(500);
      },
      action: async (pace) => {
        await safeMove(page, "h1");
        await page.mouse.wheel(0, 200);
        await page.waitForTimeout(500);
        await safeMove(page, "h2");
        await pace();
      },
    })
    // ✅ view_sidebar — PASS
    .segment("The sidebar on the left shows all the documentation sections — installation, tutorials, guides, and API reference.", async (pace) => {
      await safeMove(page, "nav");
      await page.mouse.wheel(0, 200);
      await page.waitForTimeout(400);
      await safeMove(page, "aside");
      await pace();
    })

    // ── Getting Started (0/1) ──
    // ❌ view_install_guide — FAIL: page exists but install guide content is missing
    .segment("I'm navigating to the Getting Started section to find the installation guide.", {
      setup: async () => {
        await page.goto("https://docs.comfy.org/get_started/introduction", { waitUntil: "domcontentloaded", timeout: 15000 });
        await page.waitForTimeout(1500);
      },
      action: async (pace) => {
        await safeMove(page, "h1");
        await page.mouse.wheel(0, 300);
        await page.waitForTimeout(500);
        await page.mouse.wheel(0, 300);
        await pace();
      },
    })

    // ── Tutorials (1/1) ──
    // ✅ view_tutorials — PASS
    .segment("The tutorials section has hands-on examples for common ComfyUI workflows.", {
      setup: async () => {
        await page.goto("https://docs.comfy.org/tutorials/basic/", { waitUntil: "domcontentloaded", timeout: 15000 });
        await page.waitForTimeout(1500);
      },
      action: async (pace) => {
        await safeMove(page, "h1");
        await page.mouse.wheel(0, 300);
        await page.waitForTimeout(500);
        await safeMove(page, "article");
        await pace();
      },
    })

    // ── Custom Nodes (1/1) ──
    // ✅ view_custom_nodes_docs — PASS
    .segment("If I want to build my own custom nodes, this section explains the API and packaging requirements.", {
      setup: async () => {
        await page.goto("https://docs.comfy.org/custom-nodes/overview", { waitUntil: "domcontentloaded", timeout: 15000 });
        await page.waitForTimeout(1500);
      },
      action: async (pace) => {
        await safeMove(page, "h1");
        await page.mouse.wheel(0, 300);
        await page.waitForTimeout(500);
        await page.mouse.wheel(0, 300);
        await safeMove(page, "article");
        await pace();
      },
    })

    // Final scorecard
    .segment("Here are the final QA results for Comfy Docs. Out of 5 operations tested, 4 passed — an 80 percent score. Landing Page, Tutorials, and Custom Nodes all work correctly. Getting Started scored 0 out of 1 — the install guide content is missing.", {
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
      text: "QA Results: 4/5 (80%)",
      subtitle: "Landing Page 2/2 ✅ | Getting Started 0/1 ⚠ | Tutorials 1/1 ✅ | Custom Nodes 1/1 ✅",
      durationMs: 4000,
    });

  await script.prepare(page);

  await page.goto("https://docs.comfy.org/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);

  await script.render(page, {
    baseName: "comfy-docs-qa",
    outputDir: ".comfy-qa/.demos",
  });
});
