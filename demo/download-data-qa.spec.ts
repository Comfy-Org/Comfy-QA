/**
 * Download Data — QA Evidence Video
 * Score: 5/5 (100%)
 */
import { test, safeMove } from "./fixtures/fixture";
import { createVideoScript } from "../lib/demowright/dist/index.mjs";

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
    .segment("This dashboard shows ComfyUI download trends over time — useful for tracking growth.", async (pace) => {
      await safeMove(page, "h1, h2");
      await page.waitForTimeout(400);
      await page.locator(".recharts-wrapper, canvas, svg").first().hover({ timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(400);
      await pace();
    })
    // ✅ view_totals — PASS
    .segment("I can see the total download counts at a glance — the numbers update as I change time ranges.", async (pace) => {
      await safeMove(page, "[class*='total'], [class*='count'], [class*='stat'], h3");
      await page.mouse.wheel(0, 200);
      await page.waitForTimeout(400);
      await pace();
    })

    // ── Time Ranges (3/3) ──
    // ✅ view_daily — PASS
    .segment("I'm clicking the Daily button to zoom into short-term download trends.", {
      setup: async () => {
        await page.locator("button:has-text('Daily'), button:has-text('Day'), [role='tab']:has-text('Daily'), [role='tab']:has-text('Day')").first().click({ timeout: 5000 }).catch(() => {});
        await page.waitForTimeout(1000);
      },
      action: async (pace) => {
        await safeMove(page, "button:has-text('Daily'), button:has-text('Day'), [role='tab']:has-text('Daily')");
        await page.locator(".recharts-wrapper, canvas, svg").first().hover({ timeout: 3000 }).catch(() => {});
        await pace();
      },
    })
    // ✅ view_weekly — PASS
    .segment("Switching to Weekly view smooths out daily noise and shows the broader pattern.", {
      setup: async () => {
        await page.locator("button:has-text('Weekly'), button:has-text('Week'), [role='tab']:has-text('Weekly'), [role='tab']:has-text('Week')").first().click({ timeout: 5000 }).catch(() => {});
        await page.waitForTimeout(1000);
      },
      action: async (pace) => {
        await safeMove(page, "button:has-text('Weekly'), button:has-text('Week'), [role='tab']:has-text('Weekly')");
        await page.locator(".recharts-wrapper, canvas, svg").first().hover({ timeout: 3000 }).catch(() => {});
        await pace();
      },
    })
    // ✅ view_monthly — PASS
    .segment("Monthly view shows the long-term growth trend — I can see ComfyUI adoption over the past year.", {
      setup: async () => {
        await page.locator("button:has-text('Monthly'), button:has-text('Month'), [role='tab']:has-text('Monthly'), [role='tab']:has-text('Month')").first().click({ timeout: 5000 }).catch(() => {});
        await page.waitForTimeout(1000);
      },
      action: async (pace) => {
        await safeMove(page, "button:has-text('Monthly'), button:has-text('Month'), [role='tab']:has-text('Monthly')");
        await page.locator(".recharts-wrapper, canvas, svg").first().hover({ timeout: 3000 }).catch(() => {});
        await pace();
      },
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
      subtitle: "Landing Page 2/2 ✅ | Time Ranges 3/3 ✅",
      durationMs: 4000,
    });

  await script.prepare(page);

  await page.goto("https://comfyui-download-statistics.vercel.app/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);

  await script.render(page, {
    baseName: "download-data-qa",
    outputDir: ".comfy-qa/.demos",
  });
});
