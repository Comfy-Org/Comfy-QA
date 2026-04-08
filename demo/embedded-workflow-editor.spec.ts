import { test, safeMove } from "./fixture";
import { createVideoScript } from "../lib/demowright/dist/index.mjs";

test("embedded workflow editor tour", async ({ page }) => {
  test.setTimeout(5 * 60_000);

  await page.goto("https://comfyui-embedded-workflow-editor.vercel.app", {
    waitUntil: "domcontentloaded",
  });
  await page.waitForTimeout(1500);

  const script = createVideoScript()
    .title("Embedded Workflow Editor", {
      subtitle: "In-place EXIF editor for ComfyUI images",
      durationMs: 2000,
    })
    .segment("Edit ComfyUI workflow metadata embedded directly inside your images.", async (pace) => {
      await safeMove(page, "h1");
      await pace();
    })
    .segment("Drop any ComfyUI-generated PNG or WebP onto the drop zone.", async (pace) => {
      await safeMove(page, "main");
      await pace();
    })
    .segment("The tool parses EXIF chunks and extracts the workflow JSON.", async (pace) => {
      await page.mouse.wheel(0, 200);
      await pace();
      await safeMove(page, "body");
      await pace();
    })
    .segment("View the embedded workflow graph and its node parameters.", async (pace) => {
      await page.mouse.wheel(0, 300);
      await pace();
    })
    .segment("Edit prompts, seeds, and sampler settings directly in place.", async (pace) => {
      await page.mouse.wheel(0, 300);
      await pace();
    })
    .segment("Changes are written back into the image metadata losslessly.", async (pace) => {
      await page.mouse.wheel(0, 300);
      await pace();
    })
    .segment("Export the updated image with the new workflow embedded inside.", async (pace) => {
      await page.mouse.wheel(0, 300);
      await pace();
    })
    .segment("No server uploads, everything runs locally in your browser.", async (pace) => {
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
      await pace();
    })
    .outro({
      text: "Embedded Workflow Editor",
      subtitle: "comfyui-embedded-workflow-editor.vercel.app",
      durationMs: 2000,
    });

  await script.prepare(page);
  await script.render(page, {
    baseName: "embedded-workflow-editor",
    outputDir: ".comfy-qa/demos",
  });
});
