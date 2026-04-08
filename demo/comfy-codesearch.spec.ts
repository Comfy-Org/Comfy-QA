import { test, safeMove } from "./fixtures/fixture";
import { createVideoScript } from "../lib/demowright/dist/index.mjs";
import { typeKeys } from "../lib/demowright/dist/helpers.mjs";

test("comfy codesearch tour", async ({ page }) => {
  test.setTimeout(5 * 60_000);

  await page.goto("https://cs.comfy.org/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);

  const script = createVideoScript()
    .title("Comfy Code Search", { subtitle: "cs.comfy.org", durationMs: 2000 })
    .segment("Welcome to Comfy Code Search, powered by Sourcegraph.", async (pace) => {
      await safeMove(page, "h1, header");
      await pace();
    })
    .segment("Search across every Comfy-Org repository from one place.", async (pace) => {
      await safeMove(page, "main");
      await pace();
    })
    .segment("Let's type a query into the search box.", async (pace) => {
      await safeMove(page, "[data-testid='searchbox'], .monaco-editor, input[type='text']");
      await pace();
      await typeKeys(page, "KSampler", 70);
      await pace();
    })
    .segment("Press enter to run the query across all repos.", async (pace) => {
      await page.keyboard.press("Enter");
      await pace();
    })
    .segment("Results show matching files with highlighted snippets.", async (pace) => {
      await page.mouse.wheel(0, 300);
      await pace();
      await page.mouse.wheel(0, 300);
      await pace();
    })
    .segment("Each match links directly to the source file and line.", async (pace) => {
      await safeMove(page, "a[href*='/-/blob/'], a[href*='github.com']");
      await pace();
    })
    .segment("Scroll further to explore related matches and repositories.", async (pace) => {
      await page.mouse.wheel(0, 400);
      await pace();
      await page.mouse.wheel(0, 400);
      await pace();
    })
    .segment("Jump back to the top for another search.", async (pace) => {
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
      await pace();
    })
    .outro({ text: "Comfy Code Search", subtitle: "cs.comfy.org", durationMs: 2000 });

  await script.prepare(page);
  await script.render(page, { baseName: "comfy-codesearch", outputDir: ".comfy-qa/demos" });
});
