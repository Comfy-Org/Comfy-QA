import { test } from "./fixtures/fixture";
import { createVideoScript } from "../lib/demowright/dist/index.mjs";

// Note: www.comfy.org is a Nuxt SSR site whose page.evaluate calls hang
// after a few seconds. This spec blocks all JS so the page renders as
// static HTML — mouse moves and scrolls then work reliably.
test("comfy.org website tour", async ({ page }) => {
  test.setTimeout(3 * 60_000);

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
    .segment("Welcome to comfy.org, home of the most powerful open-source generative AI tool.", async (pace) => {
      await page.mouse.move(640, 300);
      await pace();
    })
    .segment("The hero banner highlights the Download ComfyUI and Comfy Cloud buttons.", async (pace) => {
      await page.mouse.move(340, 450);
      await pace();
      await page.mouse.move(640, 450);
      await pace();
    })
    .segment("Scrolling down reveals trusted partners like Tencent, Nike, HP, and Autodesk.", async (pace) => {
      await page.mouse.wheel(0, 500);
      await pace();
      await page.mouse.wheel(0, 400);
      await pace();
    })
    .segment("The Latest News and Updates section showcases recent community highlights.", async (pace) => {
      await page.mouse.wheel(0, 400);
      await pace();
      await page.mouse.move(400, 400);
      await pace();
    })
    .segment("Each card links to blog posts about new features and model integrations.", async (pace) => {
      await page.mouse.wheel(0, 400);
      await pace();
      await page.mouse.move(700, 350);
      await pace();
    })
    .segment("Continuing to scroll shows more content, resources, and community links.", async (pace) => {
      await page.mouse.wheel(0, 500);
      await pace();
      await page.mouse.wheel(0, 500);
      await pace();
    })
    .segment("The footer provides links to documentation, GitHub, and the Discord community.", async (pace) => {
      await page.mouse.wheel(0, 800);
      await pace();
      await page.mouse.wheel(0, 800);
      await pace();
    })
    .outro({ text: "Comfy.org", subtitle: "www.comfy.org", durationMs: 2000 });

  await script.prepare(page);
  await script.render(page, { baseName: "comfy-website", outputDir: ".comfy-qa/.demos" });
});
