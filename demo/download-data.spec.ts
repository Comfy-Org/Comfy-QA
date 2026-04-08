import { test, safeMove } from "./fixtures/fixture";
import { createVideoScript } from "../lib/demowright/dist/index.mjs";

test("comfyui download statistics tour", async ({ page }) => {
  test.setTimeout(5 * 60_000);

  await page.goto("https://comfyui-download-statistics.vercel.app", {
    waitUntil: "domcontentloaded",
  });
  await page.waitForTimeout(2500);

  const script = createVideoScript()
    .title("ComfyUI Download Stats", {
      subtitle: "Community Dashboard",
      durationMs: 2000,
    })
    .segment("Welcome to the ComfyUI download statistics dashboard.", async (pace) => {
      await safeMove(page, "h1");
      await pace();
    })
    .segment("Headline metrics summarize total downloads across the ecosystem.", async (pace) => {
      await safeMove(page, "main");
      await pace();
      await page.mouse.move(600, 300);
      await pace();
    })
    .segment("Key counters highlight installs, packages, and active nodes.", async (pace) => {
      await page.mouse.wheel(0, 200);
      await pace();
      await page.mouse.move(400, 350);
      await pace();
    })
    .segment("An interactive chart visualizes download trends over time.", async (pace) => {
      await page.mouse.wheel(0, 250);
      await pace();
      await page.mouse.move(700, 400);
      await pace();
    })
    .segment("Hover the chart to inspect daily download volumes.", async (pace) => {
      await page.mouse.move(500, 450);
      await pace();
      await page.mouse.move(800, 450);
      await pace();
    })
    .segment("Scroll down to explore the ranked package leaderboard.", async (pace) => {
      await page.mouse.wheel(0, 400);
      await pace();
      await page.mouse.wheel(0, 300);
      await pace();
    })
    .segment("Each row shows a package with its total download count.", async (pace) => {
      await page.mouse.wheel(0, 300);
      await pace();
      await page.mouse.move(500, 400);
      await pace();
    })
    .segment("Keep scrolling to uncover long-tail community contributions.", async (pace) => {
      await page.mouse.wheel(0, 400);
      await pace();
      await page.mouse.wheel(0, 400);
      await pace();
    })
    .segment("Return to the top for a final overview of the dashboard.", async (pace) => {
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
      await pace();
    })
    .outro({
      text: "ComfyUI Download Stats",
      subtitle: "comfyui-download-statistics.vercel.app",
      durationMs: 2000,
    });

  await script.prepare(page);
  await script.render(page, {
    baseName: "download-data",
    outputDir: ".comfy-qa/.demos",
  });
});
