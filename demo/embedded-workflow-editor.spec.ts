import { test, safeMove } from "./fixtures/fixture";
import { createVideoScript } from "../lib/demowright/dist/index.mjs";

test("embedded workflow editor tour", async ({ page }) => {
  test.setTimeout(5 * 60_000);

  await page.goto("https://comfyui-embedded-workflow-editor.vercel.app", {
    waitUntil: "domcontentloaded",
  });
  await page.waitForTimeout(1500);

  const script = createVideoScript()
    .title("Embedded Workflow Editor", {
      subtitle: "In-browser EXIF editor for ComfyUI images",
      durationMs: 2000,
    })
    .segment("This tool lets you edit ComfyUI workflow metadata embedded inside images, right in your browser.", async (pace) => {
      await safeMove(page, "h1, h2, h3, [class*='title']");
      await pace();
    })
    .segment("It supports PNG, WebP, FLAC, and MP4 files that contain ComfyUI workflow data.", async (pace) => {
      await safeMove(page, "main, [class*='card'], [class*='container']");
      await pace();
    })
    .segment("You can paste or drop files directly onto the drop zone at the top.", async (pace) => {
      await safeMove(page, "input[type='text'], [class*='drop'], [placeholder*='Paste']");
      await pace();
    })
    .segment("Or paste a URL and click Load URL to fetch an image from the web.", async (pace) => {
      await safeMove(page, "input[placeholder*='URL'], button");
      await pace();
    })
    .segment("Upload Files and Mount a Folder provide additional ways to import your images.", async (pace) => {
      await safeMove(page, "button[class*='upload'], [class*='mount'], button");
      await page.mouse.move(640, 360);
      await pace();
    })
    .segment("Once imported, editable workflows appear below where you can modify prompts and settings.", async (pace) => {
      await page.mouse.wheel(0, 200);
      await pace();
      await safeMove(page, "[class*='workflow'], [class*='editable'], h3, h4");
      await pace();
    })
    .segment("Everything runs locally in your browser, no server uploads required.", async (pace) => {
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
    outputDir: ".comfy-qa/.demos",
  });
});
