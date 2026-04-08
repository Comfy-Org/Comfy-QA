import { test } from "./fixtures/fixture";
import { createVideoScript } from "../lib/demowright/dist/index.mjs";

// Note: www.comfy.org is a Nuxt SSR site whose page.evaluate calls hang
// after a few seconds (filed as demowright issue #3). This spec uses ONLY
// mouse.wheel / mouse.move (which don't call page.evaluate) to avoid hangs.
test("comfy.org website tour", async ({ page }) => {
  test.setTimeout(3 * 60_000);

  // www.comfy.org is a Nuxt SSR site whose hydration JS hangs Playwright
  // operations after a few seconds. Block ALL .js files (and analytics) so the
  // page renders as static HTML — mouse moves and scrolls then work reliably.
  await page.route("**/*", (route) => {
    const req = route.request();
    const url = req.url();
    const type = req.resourceType();
    if (
      type === "script" ||
      /google-analytics|googletagmanager|sentry|posthog|hotjar|intercom|crisp|drift|hubspot|plausible|fullstory|segment|mixpanel/i.test(
        url,
      )
    ) {
      return route.abort();
    }
    return route.continue();
  });

  await page.goto("https://www.comfy.org/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2500);

  const script = createVideoScript()
    .title("Comfy.org", { subtitle: "Website Tour", durationMs: 2000 })
    .segment("Welcome to comfy.org, the official ComfyUI homepage.", async (pace) => {
      await page.mouse.move(640, 360);
      await pace();
    })
    .segment("ComfyUI is the most powerful node-based AI image generation tool.", async (pace) => {
      await page.mouse.move(400, 200);
      await pace();
      await page.mouse.move(800, 400);
      await pace();
    })
    .segment("Scrolling through the landing page hero section.", async (pace) => {
      await page.mouse.wheel(0, 400);
      await pace();
      await page.mouse.wheel(0, 400);
      await pace();
    })
    .segment("Browse features, screenshots, and integrations as you scroll.", async (pace) => {
      await page.mouse.wheel(0, 500);
      await pace();
      await page.mouse.wheel(0, 500);
      await pace();
    })
    .segment("Discover what makes ComfyUI a leading open source platform.", async (pace) => {
      await page.mouse.wheel(0, 600);
      await pace();
      await page.mouse.wheel(0, 600);
      await pace();
    })
    .segment("Continue scrolling to see community testimonials and links.", async (pace) => {
      await page.mouse.wheel(0, 700);
      await pace();
      await page.mouse.wheel(0, 700);
      await pace();
    })
    .segment("The footer holds documentation, GitHub, and Discord links.", async (pace) => {
      await page.mouse.wheel(0, 800);
      await pace();
      await page.mouse.wheel(0, 800);
      await pace();
    })
    .outro({ text: "Comfy.org", subtitle: "www.comfy.org", durationMs: 2000 });

  await script.prepare(page);
  await script.render(page, { baseName: "comfy-website", outputDir: ".comfy-qa/.demos" });
});
