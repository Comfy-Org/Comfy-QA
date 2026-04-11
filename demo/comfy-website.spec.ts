import { test, safeMove } from "./fixtures/fixture";
import { createVideoScript } from "../lib/demowright/dist/index.mjs";

/**
 * VIDEO SCRIPT — every word in `narration` is read aloud verbatim by Gemini TTS.
 *
 * Coverage: 15/19 (79%)
 *
 * | Feature                              | R | Notes                         |
 * |--------------------------------------|---|-------------------------------|
 * | Hero heading + branding              | ✅ | "most powerful open-source..." |
 * | Download ComfyUI CTA                 | ✅ | hover button                   |
 * | Comfy Cloud CTA                      | ✅ | hover button                   |
 * | Trusted by teams (partner logos)     | ✅ | scroll + narrate               |
 * | Latest News & Updates                | ✅ | scroll + hover cards           |
 * | Designed for Control and Creativity  | ✅ | Full Control, Reusable, Live Preview |
 * | Open Source and Yours to Shape       | ✅ | open source, custom nodes, runs locally |
 * | Created with ComfyUI gallery         | ✅ | scroll + hover                 |
 * | JOIN OUR TEAM / Careers              | ✅ | scroll + narrate               |
 * | Footer: Product links                | ✅ | Download, Cloud, Enterprise    |
 * | Footer: Resources links              | ✅ | Gallery, Hub, Blog             |
 * | Footer: Community links              | ✅ | Discord, GitHub, Docs, YouTube |
 * | Footer: Company links                | ✅ | About, Careers, Terms          |
 * | Footer: Contact/Support              | ✅ | email, support                 |
 * | Nav bar dropdowns                    | ❌ | JS blocked — dropdowns don't work |
 * | "Open Comfy Hub" link                | ❌ | requires JS navigation         |
 * | "Let's chat" enterprise button       | ❌ | requires JS navigation         |
 * | "Explore more on our blog" link      | ❌ | requires JS navigation         |
 * | "Browse community builds" link       | ❌ | requires JS navigation         |
 */
const VIDEO_SCRIPT = [
  {
    kind: "title",
    text: "Comfy.org",
    subtitle: "Website Tour",
    durationMs: 2000,
  },
  {
    kind: "segment",
    narration:
      "Welcome to comfy.org — the home of ComfyUI, the most powerful open-source generative AI tool available today.",
    visuals: ["safeMove hero heading", "mouse.move across hero area"],
  },
  {
    kind: "segment",
    narration:
      "The hero banner puts the two main actions front and center: Download ComfyUI for local use, or try Comfy Cloud to run workflows in the browser.",
    visuals: ["hover Download button", "hover Cloud button"],
  },
  {
    kind: "segment",
    narration:
      "Scrolling down, you see trusted partners — Tencent, Nike, HP, Autodesk, and more. These are real production teams using ComfyUI in their workflows.",
    visuals: ["scroll to partners section", "sweep across logos"],
  },
  {
    kind: "segment",
    narration:
      "The Latest News and Updates section showcases what is happening in the ComfyUI world right now. Each card links out to a blog post with full details.",
    visuals: ["scroll to news", "hover card 1", "hover card 2"],
  },
  {
    kind: "segment",
    narration:
      "Now here is Designed for Control and Creativity — three pillars that define why people choose ComfyUI. Full Control with Nodes means you build exactly the pipeline you want, visually.",
    visuals: ["scroll to features section", "hover Full Control pillar"],
  },
  {
    kind: "segment",
    narration:
      "Reusable Workflows let you save and share entire pipelines. And Live Preview means you see results as the generation progresses, not just at the end.",
    visuals: ["hover Reusable Workflows", "hover Live Preview"],
  },
  {
    kind: "segment",
    narration:
      "Next up: Open Source and Yours to Shape. ComfyUI is fully open source, supports thousands of custom nodes, and runs locally so your data stays on your machine.",
    visuals: ["scroll to Open Source section", "sweep across section"],
  },
  {
    kind: "segment",
    narration:
      "The Created with ComfyUI gallery shows real outputs from the community — proof that this tool produces professional-grade results across image, video, and 3D.",
    visuals: ["scroll to gallery", "hover gallery item 1", "hover gallery item 2"],
  },
  {
    kind: "segment",
    narration:
      "They are also hiring. The Join Our Team section shows that Comfy.org is actively growing — a healthy signal for the project's longevity.",
    visuals: ["scroll to careers", "hover job listings area"],
  },
  {
    kind: "segment",
    narration:
      "The footer is organized into four columns: Product links like Download and Cloud, Resources like Gallery and Blog, Company pages, and Contact information including support.",
    visuals: ["scroll to footer", "sweep across footer columns"],
  },
  {
    kind: "segment",
    narration:
      "Social links at the bottom connect to Discord, X, Reddit, GitHub, LinkedIn, and Instagram — everywhere the community gathers.",
    visuals: ["scroll to social icons", "sweep across icons"],
  },
  {
    kind: "segment",
    narration:
      "From the hero to the footer, comfy.org tells a clear story: ComfyUI is powerful, open, and backed by a real team. Everything you need is one click away.",
    visuals: ["scroll to top", "hover hero heading", "hover Download CTA"],
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
    // Seg 1: Hero
    .segment(VIDEO_SCRIPT[1].narration, async (pace) => {
      await safeMove(page, "h1, h2, [class*='hero']");
      await pace();
      await page.mouse.move(400, 250);
      await pace();
      await page.mouse.move(880, 300);
      await pace();
    })
    // Seg 2: Download + Cloud CTAs
    .segment(VIDEO_SCRIPT[2].narration, async (pace) => {
      await page.mouse.move(340, 450);
      await pace();
      await page.mouse.move(520, 450);
      await pace();
      await page.mouse.move(640, 450);
      await pace();
    })
    // Seg 3: Trusted partners — scroll + sweep across logos
    .segment(VIDEO_SCRIPT[3].narration, async (pace) => {
      await page.mouse.wheel(0, 500);
      await page.mouse.move(300, 400);
      await pace();
      await page.mouse.move(500, 400);
      await page.mouse.wheel(0, 300);
      await pace();
      await page.mouse.move(700, 400);
      await pace();
      await page.mouse.move(900, 400);
      await pace();
    })
    // Seg 4: Latest News
    .segment(VIDEO_SCRIPT[4].narration, async (pace) => {
      await page.mouse.wheel(0, 500);
      await page.mouse.move(350, 350);
      await pace();
      await page.mouse.move(640, 400);
      await pace();
      await page.mouse.move(900, 400);
      await pace();
    })
    // Seg 5: Designed for Control and Creativity — Full Control with Nodes
    .segment(VIDEO_SCRIPT[5].narration, async (pace) => {
      await page.mouse.wheel(0, 600);
      await page.mouse.move(300, 350);
      await pace();
      await page.mouse.move(500, 400);
      await pace();
      await page.mouse.move(640, 450);
      await pace();
    })
    // Seg 6: Reusable Workflows + Live Preview
    .segment(VIDEO_SCRIPT[6].narration, async (pace) => {
      await page.mouse.move(500, 400);
      await pace();
      await page.mouse.move(640, 380);
      await pace();
      await page.mouse.move(900, 400);
      await pace();
    })
    // Seg 7: Open Source and Yours to Shape — scroll + sweep
    .segment(VIDEO_SCRIPT[7].narration, async (pace) => {
      await page.mouse.wheel(0, 600);
      await page.mouse.move(400, 350);
      await pace();
      await page.mouse.move(640, 400);
      await pace();
      await page.mouse.move(880, 400);
      await pace();
    })
    // Seg 8: Created with ComfyUI gallery — scroll + hover items
    .segment(VIDEO_SCRIPT[8].narration, async (pace) => {
      await page.mouse.wheel(0, 600);
      await page.mouse.move(350, 380);
      await pace();
      await page.mouse.move(640, 400);
      await pace();
      await page.mouse.move(900, 380);
      await pace();
    })
    // Seg 9: JOIN OUR TEAM / Careers — scroll + hover listings
    .segment(VIDEO_SCRIPT[9].narration, async (pace) => {
      await page.mouse.wheel(0, 600);
      await page.mouse.move(400, 350);
      await pace();
      await page.mouse.move(640, 400);
      await pace();
      await page.mouse.move(800, 450);
      await pace();
    })
    // Seg 10: Footer columns — scroll + sweep left to right
    .segment(VIDEO_SCRIPT[10].narration, async (pace) => {
      await page.mouse.wheel(0, 600);
      await page.mouse.move(200, 550);
      await pace();
      await page.mouse.move(400, 570);
      await pace();
      await page.mouse.move(650, 580);
      await pace();
      await page.mouse.move(900, 560);
      await pace();
    })
    // Seg 11: Social links — scroll + sweep across icons
    .segment(VIDEO_SCRIPT[11].narration, async (pace) => {
      await page.mouse.wheel(0, 300);
      await pace();
      for (const x of [300, 420, 540, 660, 780, 900]) {
        await page.mouse.move(x, 650);
        await page.waitForTimeout(180);
      }
      await pace();
    })
    // Seg 12: Wrap-up — scroll to top + hover hero + hover CTA
    .segment(VIDEO_SCRIPT[12].narration, async (pace) => {
      await page.mouse.wheel(0, -3000);
      await page.waitForTimeout(300);
      await page.mouse.wheel(0, -3000);
      await page.waitForTimeout(300);
      await safeMove(page, "h1, h2, [class*='hero']");
      await pace();
      await page.mouse.move(400, 450);
      await pace();
      await page.mouse.move(640, 300);
      await pace();
    })
    .outro({
      text: VIDEO_SCRIPT[13].text,
      subtitle: VIDEO_SCRIPT[13].subtitle,
      durationMs: VIDEO_SCRIPT[13].durationMs,
    });

  await script.prepare(page);
  await script.render(page, {
    baseName: "comfy-website",
    outputDir: ".comfy-qa/.demos",
  });
});
