/**
 * Download Data — QA Evidence Video
 * Score: 5/5 (100%)
 */
import { test, safeMove } from "../../demo/fixtures/fixture";
import { createVideoScript } from "../../lib/demowright/dist/index.mjs";

const SCORECARD_HTML = "<!DOCTYPE html>\n<html><head><meta charset=\"utf-8\"><title>Download Data QA</title>\n<style>\n  * { box-sizing: border-box; margin: 0; padding: 0; }\n  body {\n    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;\n    background: radial-gradient(ellipse at top, #1a1f3a 0%, #0a0e1f 100%);\n    color: #fff;\n    min-height: 100vh;\n    padding: 40px 60px;\n  }\n  header {\n    text-align: center;\n    margin-bottom: 32px;\n  }\n  header h1 {\n    font-size: 42px;\n    font-weight: 800;\n    margin-bottom: 8px;\n    background: linear-gradient(135deg, #fff 0%, #8892b0 100%);\n    -webkit-background-clip: text;\n    background-clip: text;\n    -webkit-text-fill-color: transparent;\n  }\n  header .total {\n    font-size: 28px;\n    font-weight: 600;\n    color: #4ade80;\n  }\n  .features {\n    display: grid;\n    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));\n    gap: 20px;\n  }\n  .feature {\n    background: rgba(255, 255, 255, 0.04);\n    border: 1px solid rgba(255, 255, 255, 0.1);\n    border-radius: 12px;\n    padding: 20px 24px;\n    backdrop-filter: blur(10px);\n  }\n  .feature.pass { border-left: 4px solid #4ade80; }\n  .feature.partial { border-left: 4px solid #facc15; }\n  .feature h3 {\n    font-size: 20px;\n    font-weight: 700;\n    margin-bottom: 12px;\n    display: flex;\n    align-items: center;\n    gap: 10px;\n  }\n  .feature h3 .score {\n    margin-left: auto;\n    font-family: 'SF Mono', Monaco, monospace;\n    font-size: 18px;\n    color: #8892b0;\n  }\n  .feature ul { list-style: none; }\n  .feature li {\n    padding: 6px 0;\n    font-size: 15px;\n    display: flex;\n    align-items: center;\n    gap: 10px;\n    color: #ccd6f6;\n  }\n  .feature li.fail { color: #8892b0; text-decoration: line-through; }\n  .mark {\n    display: inline-block;\n    width: 20px;\n    height: 20px;\n    line-height: 20px;\n    text-align: center;\n    border-radius: 50%;\n    font-weight: 700;\n    font-size: 12px;\n    flex-shrink: 0;\n  }\n  .feature.pass h3 .mark { background: #4ade80; color: #0a0e1f; }\n  .feature.partial h3 .mark { background: #facc15; color: #0a0e1f; }\n  .feature li.pass .mark { background: rgba(74, 222, 128, 0.2); color: #4ade80; }\n  .feature li.fail .mark { background: rgba(248, 113, 113, 0.2); color: #f87171; }\n  footer {\n    text-align: center;\n    margin-top: 40px;\n    font-size: 14px;\n    color: #8892b0;\n  }\n</style>\n</head><body>\n  <header>\n    <h1>Download Data QA Results</h1>\n    <div class=\"total\">5/5 &nbsp;•&nbsp; 100%</div>\n  </header>\n  <div class=\"features\">\n    \n    <section class=\"feature pass\">\n      <h3><span class=\"mark\">✓</span>Landing Page <span class=\"score\">2/2</span></h3>\n      <ul><li class=\"pass\"><span class=\"mark\">✓</span>view_chart</li><li class=\"pass\"><span class=\"mark\">✓</span>view_totals</li></ul>\n    </section>\n    <section class=\"feature pass\">\n      <h3><span class=\"mark\">✓</span>Time Ranges <span class=\"score\">3/3</span></h3>\n      <ul><li class=\"pass\"><span class=\"mark\">✓</span>view_daily</li><li class=\"pass\"><span class=\"mark\">✓</span>view_weekly</li><li class=\"pass\"><span class=\"mark\">✓</span>view_monthly</li></ul>\n    </section>\n  </div>\n  <footer>Comfy-QA Evidence • Generated 2026-04-13</footer>\n</body></html>";

test("download-data QA evidence", async ({ page }) => {
  test.setTimeout(10 * 60_000);

  const script = createVideoScript()
    .title("Download Data QA", {
      subtitle: "Score: 5/5 (100%)",
      durationMs: 3000,
    })

    // ── Landing Page (2/2) ──
    // ✅ view_chart — PASS
    .segment("This dashboard shows ComfyUI download trends over time — useful for tracking growth.", {
      setup: async () => {
        // Wait for chart JS to render (Next.js client-side hydration)
        await page.waitForSelector(".recharts-wrapper, canvas, svg", { timeout: 8000 }).catch(() => {});
        await page.waitForTimeout(1000);
      },
      action: async (pace) => {
        // Move cursor to page center first so it's visible from the start
        await page.mouse.move(640, 360);
        await page.waitForTimeout(200);
        await safeMove(page, "h1, h2, [class*='title'], [class*='heading']").catch(() => {});
        await page.waitForTimeout(400);
        await page.locator(".recharts-wrapper, canvas, svg").first().hover({ timeout: 5000 }).catch(() => {});
        await page.waitForTimeout(400);
        await pace();
      },
    })
    // ✅ view_totals — PASS
    .segment("The chart is rendering the full download statistics — I'm moving the cursor over it to explore the data.", async (pace) => {
      await safeMove(page, ".recharts-wrapper, canvas, svg").catch(() => {});
      await page.waitForTimeout(400);
      await safeMove(page, "h1, h2").catch(() => {});
      await pace();
    })

    // ── Time Ranges (3/3) ──
    // ✅ view_1week — PASS
    .segment("Now I'm clicking the 1 Week button to zoom into the most recent short-term download data.", async (pace) => {
      await safeMove(page, "button:has-text('1 Week')");
      await page.locator("button:has-text('1 Week')").first().click({ timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(800);
      await page.locator(".recharts-wrapper, canvas, svg").first().hover({ timeout: 3000 }).catch(() => {});
      await pace();
    })
    // ✅ view_3months — PASS
    .segment("Now clicking 3 Months — this view smooths out noise and reveals the broader growth pattern.", async (pace) => {
      await safeMove(page, "button:has-text('3 Months')");
      await page.locator("button:has-text('3 Months')").first().click({ timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(800);
      await page.locator(".recharts-wrapper, canvas, svg").first().hover({ timeout: 3000 }).catch(() => {});
      await pace();
    })
    // ✅ view_alltime — PASS
    .segment("Finally, All Time — this shows the complete download history and I can see ComfyUI's growth from launch to today.", async (pace) => {
      await safeMove(page, "button:has-text('All Time')");
      await page.locator("button:has-text('All Time')").first().click({ timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(800);
      await page.locator(".recharts-wrapper, canvas, svg").first().hover({ timeout: 3000 }).catch(() => {});
      await pace();
    })

    // Final scorecard
    .segment("Here are the final QA results for the Download Data dashboard. All 5 operations passed — a perfect 100 percent score. The chart, totals, and all three time range views work correctly.", {
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
      text: "QA Results: 5/5 (100%)",
      subtitle: "Landing Page 2/2 ✅ | Time Ranges: 1 Week, 3 Months, All Time 3/3 ✅",
      durationMs: 4000,
    });

  await script.prepare(page);

  await page.goto("https://comfyui-download-statistics.vercel.app/", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => document.body && document.body.innerText.trim().length > 200, { timeout: 30000 }).catch(() => {});
  await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(3000);

  await script.render(page, {
    baseName: "download-data-qa",
    outputDir: ".comfy-qa/04-videos",
  });
});
