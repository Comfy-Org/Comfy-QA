import { test, safeMove } from "./fixtures/fixture";
import { createVideoScript } from "../lib/demowright/dist/index.mjs";

test("comfy vibe tour", async ({ page }) => {
  test.setTimeout(5 * 60_000);

  await page.goto("https://comfy-vibe.vercel.app/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(3000);

  const script = createVideoScript()
    .title("Comfy Vibe", { subtitle: "Creative Workspace", durationMs: 2000 })
    .segment("Welcome to Comfy Vibe, a workspace for managing ComfyUI workflows.", async (pace) => {
      await safeMove(page, "header, nav, [class*='sidebar']");
      await pace();
    })
    .segment("The left sidebar organizes your projects and workspace sections.", async (pace) => {
      await safeMove(page, "nav, [class*='sidebar'], [class*='menu']");
      await pace();
    })
    .segment("Under My Workspace you can find Recents, Tutorials, and Templates.", async (pace) => {
      await safeMove(page, "[class*='Recents'], [class*='recent'], a[href*='recent']");
      await pace();
    })
    .segment("The main area shows your recent projects and workflow files.", async (pace) => {
      await page.mouse.move(640, 360);
      await pace();
    })
    .segment("Click Create your first workflow to start building in the canvas.", async (pace) => {
      await safeMove(page, "button, a[href*='create'], [class*='create']");
      await pace();
    })
    .segment("The top toolbar provides quick access to upload, share, and settings.", async (pace) => {
      await safeMove(page, "header, [class*='toolbar'], [class*='topbar']");
      await pace();
    })
    .segment("Comfy Vibe brings a clean, focused environment for AI content creation.", async (pace) => {
      await page.mouse.move(640, 360);
      await pace();
    })
    .outro({ text: "Comfy Vibe", subtitle: "comfy-vibe.vercel.app", durationMs: 2000 });

  await script.prepare(page);
  await script.render(page, { baseName: "comfy-vibe", outputDir: ".comfy-qa/.demos" });
});
