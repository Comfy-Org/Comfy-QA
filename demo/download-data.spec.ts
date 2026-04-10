import { test, safeMove } from "./fixtures/fixture";
import { createVideoScript } from "../lib/demowright/dist/index.mjs";

test("comfyui download statistics tour", async ({ page }) => {
  test.setTimeout(5 * 60_000);

  await page.goto("https://comfyui-download-statistics.vercel.app", {
    waitUntil: "domcontentloaded",
  });
  await page.waitForTimeout(2500);

  const script = createVideoScript()
    .title("ComfyUI Download Data", {
      subtitle: "Daily Statistics",
      durationMs: 2000,
    })
    .segment("Welcome to the ComfyUI Download Data dashboard.", async (pace) => {
      await safeMove(page, "h1, h2");
      await pace();
    })
    .segment("The Daily New Downloads card tracks net new downloads per day for all portable releases.", async (pace) => {
      await safeMove(page, "[class*='card'], [class*='chart'], main");
      await pace();
    })
    .segment("A green indicator shows the change over the selected timeframe.", async (pace) => {
      await page.mouse.move(500, 220);
      await pace();
    })
    .segment("Use the time range buttons to switch between one week, one month, three months, or all time.", async (pace) => {
      // Click "All Time" button if available
      const allTimeBtn = page.getByRole("button", { name: /all time/i }).first();
      if (await allTimeBtn.isVisible().catch(() => false)) {
        await allTimeBtn.click().catch(() => {});
        await page.waitForTimeout(1000);
      }
      await pace();
    })
    .segment("The area chart visualizes download trends, revealing growth patterns and spikes.", async (pace) => {
      await page.mouse.move(400, 450);
      await pace();
      await page.mouse.move(700, 400);
      await pace();
      await page.mouse.move(900, 420);
      await pace();
    })
    .segment("Hover over the chart to inspect daily download counts at specific dates.", async (pace) => {
      await page.mouse.move(600, 400);
      await pace();
      await page.mouse.move(800, 380);
      await pace();
    })
    .segment("Scroll down to see the next data update countdown and project link.", async (pace) => {
      await page.mouse.wheel(0, 400);
      await pace();
    })
    .segment("A clean, single-purpose dashboard for tracking ComfyUI adoption.", async (pace) => {
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
      await pace();
    })
    .outro({
      text: "ComfyUI Download Data",
      subtitle: "comfyui-download-statistics.vercel.app",
      durationMs: 2000,
    });

  await script.prepare(page);
  await script.render(page, {
    baseName: "download-data",
    outputDir: ".comfy-qa/.demos",
  });
});
