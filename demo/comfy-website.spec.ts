import { test, safeMove } from "./fixture";
import { createVideoScript } from "../lib/demowright/dist/index.mjs";

test("comfy.org website tour", async ({ page }) => {
  test.setTimeout(5 * 60_000);

  // Block analytics, chat widgets that hang page.evaluate on Nuxt SSR
  await page.route("**/*", (route) => {
    const url = route.request().url();
    if (
      /google-analytics|googletagmanager|sentry|posthog|hotjar|intercom|crisp|drift|hubspot|plausible|fullstory/i.test(
        url,
      )
    ) {
      return route.abort();
    }
    return route.continue();
  });

  await page.goto("https://www.comfy.org/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);

  const script = createVideoScript()
    .title("Comfy.org", { subtitle: "Website Tour", durationMs: 1500 })
    .segment("Welcome to the official Comfy.org website.", async (pace) => {
      await safeMove(page, "h1");
      await pace();
    })
    .segment("This is the home page for the ComfyUI ecosystem.", async (pace) => {
      await safeMove(page, "main");
      await pace();
      await page.mouse.wheel(0, 200);
      await pace();
    })
    .segment("The top navigation links to docs, blog, and downloads.", async (pace) => {
      await safeMove(page, "header");
      await pace();
      await safeMove(page, "header nav");
      await pace();
    })
    .segment("Scrolling through the landing page sections.", async (pace) => {
      await page.mouse.wheel(0, 400);
      await pace();
      await page.mouse.wheel(0, 400);
      await pace();
    })
    .segment("Feature highlights and call to actions appear next.", async (pace) => {
      await page.mouse.wheel(0, 500);
      await pace();
      await page.mouse.wheel(0, 500);
      await pace();
    })
    .segment("The footer has community links and resources.", async (pace) => {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await pace();
      await safeMove(page, "footer");
      await pace();
    })
    .outro({ text: "Comfy.org", subtitle: "www.comfy.org", durationMs: 1500 });

  await script.prepare(page);
  await script.render(page, { baseName: "comfy-website", outputDir: ".comfy-qa/demos" });
});
