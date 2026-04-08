import { test, safeMove } from "./fixture";
import { createVideoScript } from "../lib/demowright/dist/index.mjs";

test("comfy vibe tour", async ({ page }) => {
  test.setTimeout(5 * 60_000);

  await page.goto("https://comfy-vibe.vercel.app/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);

  const script = createVideoScript()
    .title("Comfy Vibe", { subtitle: "A Comfy-Org Experience", durationMs: 2000 })
    .segment("Welcome to Comfy Vibe, a fresh Comfy-Org web experience.", async (pace) => {
      await safeMove(page, "h1");
      await pace();
    })
    .segment("The hero section sets the tone for the product.", async (pace) => {
      await safeMove(page, "main");
      await pace();
      await page.mouse.move(640, 360);
      await pace();
    })
    .segment("Let us scroll down to explore the first section.", async (pace) => {
      await page.mouse.wheel(0, 400);
      await pace();
      await page.mouse.wheel(0, 300);
      await pace();
    })
    .segment("Feature highlights showcase what Comfy Vibe can do.", async (pace) => {
      await page.mouse.wheel(0, 400);
      await pace();
      await page.mouse.wheel(0, 400);
      await pace();
    })
    .segment("Further down we find additional content and details.", async (pace) => {
      await page.mouse.wheel(0, 500);
      await pace();
      await page.mouse.wheel(0, 500);
      await pace();
    })
    .segment("The page continues with more sections and visuals.", async (pace) => {
      await page.mouse.wheel(0, 400);
      await pace();
      await page.mouse.move(800, 400);
      await pace();
    })
    .segment("Near the bottom you can find footer links and info.", async (pace) => {
      await page.mouse.wheel(0, 600);
      await pace();
      await page.mouse.wheel(0, 400);
      await pace();
    })
    .segment("Scrolling back up returns us to the top of the page.", async (pace) => {
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
      await pace();
      await safeMove(page, "h1");
      await pace();
    })
    .outro({ text: "Comfy Vibe", subtitle: "comfy-vibe.vercel.app", durationMs: 2000 });

  await script.prepare(page);
  await script.render(page, { baseName: "comfy-vibe", outputDir: ".comfy-qa/demos" });
});
