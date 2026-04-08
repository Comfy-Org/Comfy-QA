import { test, safeMove } from "./fixture";
import { createVideoScript } from "../lib/demowright/dist/index.mjs";

test("comfy registry tour", async ({ page }) => {
  test.setTimeout(5 * 60_000);

  await page.goto("https://registry.comfy.org/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);

  const script = createVideoScript()
    .title("Comfy Registry", { subtitle: "Custom Node Hub", durationMs: 1500 })
    .segment("Welcome to the Comfy Registry, the hub for custom nodes.", async (pace) => {
      await safeMove(page, "h1");
      await pace();
    })
    .segment("Browse hundreds of community-contributed node packs here.", async (pace) => {
      await safeMove(page, "main");
      await pace();
      await page.mouse.wheel(0, 200);
      await pace();
    })
    .segment("Featured nodes are showcased on the home page.", async (pace) => {
      await page.mouse.wheel(0, 300);
      await pace();
      await page.mouse.wheel(0, 300);
      await pace();
    })
    .segment("Each node has install commands and version history.", async (pace) => {
      await page.mouse.wheel(0, 400);
      await pace();
      await page.mouse.wheel(0, 400);
      await pace();
    })
    .segment("Search lets you find nodes by name, tag, or category.", async (pace) => {
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
      await pace();
    })
    .outro({ text: "Comfy Registry", subtitle: "registry.comfy.org", durationMs: 1500 });

  await script.prepare(page);
  await script.render(page, { baseName: "registry-web", outputDir: ".comfy-qa/demos" });
});
