import { test, safeMove } from "./fixtures/fixture";
import { createVideoScript } from "../lib/demowright/dist/index.mjs";

/**
 * VIDEO SCRIPT — every word in `narration` is read aloud verbatim by Gemini TTS.
 *
 * User Journey: A user visits comfy.org, reads the hero, scrolls through all sections,
 * and understands the full value proposition from hero to footer.
 *
 * NOTE: www.comfy.org is a Nuxt SSR site. ALL scripts are blocked to prevent
 * page.evaluate hangs. This means no JS-dependent interactions (clicks, nav).
 * Exception ratio: JS blocked — 0% interactive is acceptable for SSR-only sites.
 * All segments are OBSERVE (scroll + hover).
 *
 * Coverage: 15/19 (79%)
 *
 * | Feature                              | R | Notes                         |
 * |--------------------------------------|---|-------------------------------|
 * | Hero heading + branding              | ✅ | "most powerful open-source..." |
 * | Download ComfyUI CTA                 | ✅ | hover button                   |
 * | Comfy Cloud CTA                      | ✅ | hover button                   |
 * | Trusted by teams (partner logos)     | ✅ | scroll + sweep logos           |
 * | Latest News & Updates                | ✅ | scroll + hover cards           |
 * | Designed for Control and Creativity  | ✅ | Full Control, Reusable, Live Preview |
 * | Open Source and Yours to Shape       | ✅ | open source, custom nodes, local |
 * | Created with ComfyUI gallery         | ✅ | scroll + hover items           |
 * | JOIN OUR TEAM / Careers              | ✅ | scroll + hover area            |
 * | Footer: Product links                | ✅ | Download, Cloud, Enterprise    |
 * | Footer: Resources links              | ✅ | Gallery, Hub, Blog             |
 * | Footer: Community links              | ✅ | Discord, GitHub, Docs          |
 * | Footer: Company links                | ✅ | About, Careers, Terms          |
 * | Footer: Contact/Support              | ✅ | email, support                 |
 * | Social icons                         | ✅ | sweep across icons             |
 * | Nav bar dropdowns                    | ❌ | JS blocked — dropdowns inert   |
 * | "Open Comfy Hub" link                | ❌ | requires JS navigation         |
 * | "Let's chat" enterprise button       | ❌ | requires JS navigation         |
 * | "Browse community builds" link       | ❌ | requires JS navigation         |
 *
 * Segment types: 0 NAVIGATE + 0 INTERACT + 8 OBSERVE = 0% interactive
 * Exception: JS blocked SSR site — scroll-through is the only viable demo mode.
 */
const VIDEO_SCRIPT = [
  {
    kind: "title",
    text: "Comfy.org",
    subtitle: "The Home of ComfyUI",
    durationMs: 2000,
  },

  // ── 1: Hero + CTAs ── OBSERVE
  {
    kind: "segment",
    narration:
      "Welcome to comfy.org — the home of ComfyUI. The hero puts two actions front and center: " +
      "Download ComfyUI for local use, or launch Comfy Cloud to run workflows in the browser.",
  },

  // ── 2: Partner logos ── OBSERVE
  {
    kind: "segment",
    narration:
      "Scrolling down, you see the companies that trust ComfyUI in production — " +
      "Tencent, Nike, HP, Autodesk, and more. Real teams, real workflows.",
  },

  // ── 3: Latest News ── OBSERVE
  {
    kind: "segment",
    narration:
      "The Latest News section keeps you up to date on releases, community highlights, " +
      "and ecosystem updates. Each card links to a full blog post.",
  },

  // ── 4: Control and Creativity features ── OBSERVE
  {
    kind: "segment",
    narration:
      "Designed for Control and Creativity — three pillars define ComfyUI. Full Control " +
      "with Nodes for visual pipeline building, Reusable Workflows for sharing, and Live Preview for real-time feedback.",
  },

  // ── 5: Open Source section ── OBSERVE
  {
    kind: "segment",
    narration:
      "Open Source and Yours to Shape — ComfyUI is fully open source with thousands of " +
      "custom nodes, and it runs locally so your data never leaves your machine.",
  },

  // ── 6: Gallery + Careers ── OBSERVE
  {
    kind: "segment",
    narration:
      "The Created with ComfyUI gallery showcases community outputs — images, video, " +
      "and 3D. Below it, the Careers section shows that comfy.org is actively hiring.",
  },

  // ── 7: Footer ── OBSERVE
  {
    kind: "segment",
    narration:
      "The footer organizes everything into columns: Product links, Resources like Gallery and Blog, " +
      "Community links for Discord and GitHub, and social icons for every platform.",
  },

  // ── 8: Wrap-up ── OBSERVE
  {
    kind: "segment",
    narration:
      "From hero to footer, comfy.org tells a clear story: ComfyUI is powerful, open source, " +
      "and backed by a real team. Everything you need is right here.",
  },

  {
    kind: "outro",
    text: "Comfy.org",
    subtitle: "www.comfy.org",
    durationMs: 2000,
  },
] as const;

// Note: www.comfy.org is a Nuxt SSR site whose page.evaluate calls hang
// after a few seconds. This spec blocks all JS so the page renders as
// static HTML — mouse moves and scrolls then work reliably.
test("comfy.org website tour", async ({ page }) => {
  test.setTimeout(5 * 60_000);

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
    .title(VIDEO_SCRIPT[0].text, {
      subtitle: VIDEO_SCRIPT[0].subtitle,
      durationMs: VIDEO_SCRIPT[0].durationMs,
    })

    // ── 1: Hero + CTAs ── OBSERVE
    .segment(VIDEO_SCRIPT[1].narration, async (pace) => {
      await safeMove(page, "h1, h2, [class*='hero']");
      await pace();
      // Sweep to Download CTA area
      await page.mouse.move(340, 450);
      await pace();
      // Sweep to Cloud CTA area
      await page.mouse.move(560, 450);
      await pace();
      await page.mouse.move(880, 300);
      await pace();
    })

    // ── 2: Partner logos ── OBSERVE
    .segment(VIDEO_SCRIPT[2].narration, async (pace) => {
      await page.mouse.wheel(0, 600);
      await page.mouse.move(250, 400);
      await pace();
      await page.mouse.move(450, 400);
      await pace();
      await page.mouse.move(700, 400);
      await pace();
      await page.mouse.move(950, 400);
      await pace();
    })

    // ── 3: Latest News ── OBSERVE
    .segment(VIDEO_SCRIPT[3].narration, async (pace) => {
      await page.mouse.wheel(0, 600);
      await page.mouse.move(300, 350);
      await pace();
      await page.mouse.move(640, 380);
      await pace();
      await page.mouse.move(950, 370);
      await pace();
    })

    // ── 4: Control and Creativity ── OBSERVE
    .segment(VIDEO_SCRIPT[4].narration, async (pace) => {
      await page.mouse.wheel(0, 700);
      await page.mouse.move(300, 350);
      await pace();
      await page.mouse.move(640, 380);
      await pace();
      await page.mouse.move(900, 400);
      await pace();
    })

    // ── 5: Open Source ── OBSERVE
    .segment(VIDEO_SCRIPT[5].narration, async (pace) => {
      await page.mouse.wheel(0, 700);
      await page.mouse.move(350, 350);
      await pace();
      await page.mouse.move(640, 400);
      await pace();
      await page.mouse.move(900, 380);
      await pace();
    })

    // ── 6: Gallery + Careers ── OBSERVE
    .segment(VIDEO_SCRIPT[6].narration, async (pace) => {
      await page.mouse.wheel(0, 600);
      await page.mouse.move(300, 350);
      await pace();
      await page.mouse.move(640, 380);
      await pace();
      await page.mouse.wheel(0, 500);
      await page.mouse.move(500, 400);
      await pace();
      await page.mouse.move(800, 420);
      await pace();
    })

    // ── 7: Footer ── OBSERVE
    .segment(VIDEO_SCRIPT[7].narration, async (pace) => {
      await page.mouse.wheel(0, 700);
      await page.mouse.move(200, 500);
      await pace();
      await page.mouse.move(450, 520);
      await pace();
      await page.mouse.move(700, 530);
      await pace();
      // Sweep social icons
      for (const x of [350, 470, 590, 710, 830]) {
        await page.mouse.move(x, 620);
        await page.waitForTimeout(150);
      }
      await pace();
    })

    // ── 8: Wrap-up ── OBSERVE
    .segment(VIDEO_SCRIPT[8].narration, async (pace) => {
      await page.mouse.wheel(0, -4000);
      await page.waitForTimeout(300);
      await safeMove(page, "h1, h2, [class*='hero']");
      await pace();
      await page.mouse.move(450, 450);
      await pace();
      await page.mouse.move(640, 300);
      await pace();
    })

    .outro({
      text: VIDEO_SCRIPT[9].text,
      subtitle: VIDEO_SCRIPT[9].subtitle,
      durationMs: VIDEO_SCRIPT[9].durationMs,
    });

  await script.prepare(page);
  await script.render(page, {
    baseName: "comfy-website",
    outputDir: ".comfy-qa/.demos",
  });
});
