/**
 * Embedded Workflow Editor — QA Evidence Video
 * Score: 3/4 (75%)
 */
import { test, safeMove } from "./fixtures/fixture";
import { createVideoScript } from "../lib/demowright/dist/index.mjs";

const SCORECARD_HTML = "<!DOCTYPE html>\n<html><head><meta charset=\"utf-8\"><title>Embedded Workflow Editor QA</title>\n<style>\n  * { box-sizing: border-box; margin: 0; padding: 0; }\n  body {\n    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;\n    background: radial-gradient(ellipse at top, #1a1f3a 0%, #0a0e1f 100%);\n    color: #fff;\n    min-height: 100vh;\n    padding: 40px 60px;\n  }\n  header {\n    text-align: center;\n    margin-bottom: 32px;\n  }\n  header h1 {\n    font-size: 42px;\n    font-weight: 800;\n    margin-bottom: 8px;\n    background: linear-gradient(135deg, #fff 0%, #8892b0 100%);\n    -webkit-background-clip: text;\n    background-clip: text;\n    -webkit-text-fill-color: transparent;\n  }\n  header .total {\n    font-size: 28px;\n    font-weight: 600;\n    color: #facc15;\n  }\n  .features {\n    display: grid;\n    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));\n    gap: 20px;\n  }\n  .feature {\n    background: rgba(255, 255, 255, 0.04);\n    border: 1px solid rgba(255, 255, 255, 0.1);\n    border-radius: 12px;\n    padding: 20px 24px;\n    backdrop-filter: blur(10px);\n  }\n  .feature.pass { border-left: 4px solid #4ade80; }\n  .feature.partial { border-left: 4px solid #facc15; }\n  .feature h3 {\n    font-size: 20px;\n    font-weight: 700;\n    margin-bottom: 12px;\n    display: flex;\n    align-items: center;\n    gap: 10px;\n  }\n  .feature h3 .score {\n    margin-left: auto;\n    font-family: 'SF Mono', Monaco, monospace;\n    font-size: 18px;\n    color: #8892b0;\n  }\n  .feature ul { list-style: none; }\n  .feature li {\n    padding: 6px 0;\n    font-size: 15px;\n    display: flex;\n    align-items: center;\n    gap: 10px;\n    color: #ccd6f6;\n  }\n  .feature li.fail { color: #8892b0; text-decoration: line-through; }\n  .mark {\n    display: inline-block;\n    width: 20px;\n    height: 20px;\n    line-height: 20px;\n    text-align: center;\n    border-radius: 50%;\n    font-weight: 700;\n    font-size: 12px;\n    flex-shrink: 0;\n  }\n  .feature.pass h3 .mark { background: #4ade80; color: #0a0e1f; }\n  .feature.partial h3 .mark { background: #facc15; color: #0a0e1f; }\n  .feature li.pass .mark { background: rgba(74, 222, 128, 0.2); color: #4ade80; }\n  .feature li.fail .mark { background: rgba(248, 113, 113, 0.2); color: #f87171; }\n  footer {\n    text-align: center;\n    margin-top: 40px;\n    font-size: 14px;\n    color: #8892b0;\n  }\n</style>\n</head><body>\n  <header>\n    <h1>Embedded Workflow Editor QA Results</h1>\n    <div class=\"total\">3/4 &nbsp;•&nbsp; 75%</div>\n  </header>\n  <div class=\"features\">\n    \n    <section class=\"feature pass\">\n      <h3><span class=\"mark\">✓</span>Landing Page <span class=\"score\">2/2</span></h3>\n      <ul><li class=\"pass\"><span class=\"mark\">✓</span>view_hero</li><li class=\"pass\"><span class=\"mark\">✓</span>view_drop_zone</li></ul>\n    </section>\n    <section class=\"feature partial\">\n      <h3><span class=\"mark\">⚠</span>Editor UI <span class=\"score\">1/2</span></h3>\n      <ul><li class=\"fail\"><span class=\"mark\">✗</span>view_json_editor</li><li class=\"pass\"><span class=\"mark\">✓</span>view_actions</li></ul>\n    </section>\n  </div>\n  <footer>Comfy-QA Evidence • Generated 2026-04-13</footer>\n</body></html>";

test("embedded-workflow-editor QA evidence", async ({ page }) => {
  test.setTimeout(15 * 60_000);

  const script = createVideoScript()
    .title("Embedded Workflow Editor QA", {
      subtitle: "Score: 3/4 (75%)",
      durationMs: 3000,
    })

    // ── Landing Page (2/2) ──
    // ✅ view_hero — PASS
    .segment("This is the Embedded Workflow Editor — it extracts the ComfyUI workflow JSON from inside an image or video file.", {
      action: async (pace) => {
        await safeMove(page, "h1");
        await page.mouse.wheel(0, 100);
        await page.waitForTimeout(400);
        await safeMove(page, "h2, p");
        await pace();
      },
    })
    // ✅ view_drop_zone — PASS
    .segment("The drop zone lets me upload an image or video that has a workflow embedded in its metadata.", async (pace) => {
      await safeMove(page, "[class*='drop'], [class*='upload'], input[type='file'], label");
      await page.mouse.wheel(0, 200);
      await page.waitForTimeout(400);
      await safeMove(page, "main, .container");
      await pace();
    })

    // ── Editor UI (1/2) ──
    // ❌ view_json_editor — FAIL: JSON editor only appears after file upload, which is unavailable in headless
    .segment("I'm looking for the JSON editor panel — it should appear after loading a workflow file, but no editor is visible without uploading a file first.", async (pace) => {
      await page.mouse.wheel(0, 200);
      await page.waitForTimeout(400);
      await safeMove(page, "textarea, .editor, [class*='json'], [class*='editor'], pre");
      await page.mouse.wheel(0, 200);
      await page.waitForTimeout(400);
      await safeMove(page, "main");
      await pace();
    })
    // ✅ view_actions — PASS
    .segment("The toolbar has buttons to save changes, download the edited workflow, or reset — these are visible even before loading a file.", async (pace) => {
      await page.mouse.wheel(0, -200);
      await page.waitForTimeout(400);
      await safeMove(page, "button");
      await page.waitForTimeout(300);
      await safeMove(page, "button:nth-child(2), button[type='submit']");
      await pace();
    })

    // Final scorecard
    .segment("Here are the final QA results for the Embedded Workflow Editor. Out of 4 operations, 3 passed — 75 percent. Landing Page works fully. Editor UI scored 1 out of 2 — the JSON editor requires a file upload which is unavailable in headless mode.", {
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
      text: "QA Results: 3/4 (75%)",
      subtitle: "Landing Page 2/2 ✅ | Editor UI 1/2 ⚠",
      durationMs: 4000,
    });

  await script.prepare(page);

  await page.goto("https://comfyui-embedded-workflow-editor.vercel.app/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);

  await script.render(page, {
    baseName: "embedded-workflow-editor-qa",
    outputDir: ".comfy-qa/.demos",
  });
});
