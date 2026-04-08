import { test, safeMove } from "./fixtures/fixture";
import { createVideoScript } from "../lib/demowright/dist/index.mjs";

test("comfyui frontend tour", async ({ page }) => {
  test.setTimeout(5 * 60_000);

  // Pre-navigate so script segments don't include heavy navigation overruns
  await page.goto("https://docs.comfy.org/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);

  const script = createVideoScript()
    .title("ComfyUI Docs", { subtitle: "Documentation Tour", durationMs: 1500 })
    .segment("Welcome to the official ComfyUI documentation site.", async (pace) => {
      await safeMove(page, "h1");
      await pace();
    })
    .segment("This is the main entry point for learning ComfyUI.", async (pace) => {
      await safeMove(page, "main");
      await pace();
      await page.mouse.wheel(0, 200);
      await pace();
    })
    .segment("The sidebar holds the full table of contents.", async (pace) => {
      await safeMove(page, "nav");
      await pace();
      await safeMove(page, "aside");
      await pace();
    })
    .segment("You can browse interfaces, custom nodes, and tutorials.", async (pace) => {
      await page.mouse.wheel(0, 300);
      await pace();
      await page.mouse.wheel(0, 300);
      await pace();
    })
    .segment("Each page has examples, code snippets, and screenshots.", async (pace) => {
      await page.mouse.wheel(0, 400);
      await pace();
      await page.mouse.wheel(0, 400);
      await pace();
    })
    .segment("The docs cover everything from install to advanced workflows.", async (pace) => {
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
      await pace();
    })
    .outro({ text: "ComfyUI Docs", subtitle: "docs.comfy.org", durationMs: 1500 });

  await script.prepare(page);
  await script.render(page, { baseName: "comfyui-frontend", outputDir: ".comfy-qa/demos" });
});
