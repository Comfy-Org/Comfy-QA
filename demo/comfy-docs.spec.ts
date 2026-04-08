import { test, safeMove } from "./fixture";
import { createVideoScript } from "../lib/demowright/dist/index.mjs";

test("comfy docs tour", async ({ page }) => {
  test.setTimeout(5 * 60_000);

  await page.goto("https://docs.comfy.org/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);

  const script = createVideoScript()
    .title("ComfyUI Docs", { subtitle: "Official Documentation", durationMs: 2000 })
    .segment("Welcome to the official ComfyUI documentation site.", async (pace) => {
      await safeMove(page, "h1");
      await pace();
    })
    .segment("The sidebar organizes guides, tutorials, and reference material.", async (pace) => {
      await safeMove(page, "aside");
      await pace();
      await safeMove(page, "nav");
      await pace();
    })
    .segment("New users can start with installation and getting started guides.", async (pace) => {
      await page.mouse.wheel(0, 300);
      await pace();
      await safeMove(page, "main");
      await pace();
    })
    .segment("Tutorials walk you through building real image workflows step by step.", async (pace) => {
      await page.mouse.wheel(0, 400);
      await pace();
      await page.mouse.wheel(0, 300);
      await pace();
    })
    .segment("The node reference documents every built-in node and parameter.", async (pace) => {
      await page.mouse.wheel(0, 400);
      await pace();
      await page.mouse.wheel(0, 400);
      await pace();
    })
    .segment("Developer guides cover custom nodes, the API, and extensions.", async (pace) => {
      await page.mouse.wheel(0, 400);
      await pace();
      await page.mouse.wheel(0, 300);
      await pace();
    })
    .segment("Instant search helps you jump to any topic in seconds.", async (pace) => {
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
      await pace();
      await safeMove(page, "header");
      await pace();
    })
    .segment("Light and dark themes keep reading comfortable any time of day.", async (pace) => {
      await safeMove(page, "header");
      await pace();
    })
    .outro({ text: "ComfyUI Docs", subtitle: "docs.comfy.org", durationMs: 2000 });

  await script.prepare(page);
  await script.render(page, { baseName: "comfy-docs", outputDir: ".comfy-qa/demos" });
});
