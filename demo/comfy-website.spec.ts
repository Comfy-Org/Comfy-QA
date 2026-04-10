/**
 * ComfyUI — www.comfy.org
 *
 * Story:  demo/stories/comfy-website.story.md
 * Output: .comfy-qa/.demos/comfy-website.mp4
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *  VIDEO SCRIPT (the source of truth)
 * ─────────────────────────────────────────────────────────────────────────────
 *  Every word in `narration` is read aloud verbatim by Gemini TTS during
 *  recording. Edit this constant first, run it through your head as a
 *  voiceover, and only then touch the Playwright code below.
 *
 *  Rules:
 *    1. First person, present tense, conversational pace.
 *    2. Connect segments with transitional phrases — never bullet-points.
 *    3. Explain WHY, not just WHAT.
 *    4. Each segment ~6–10 seconds at 140 wpm ⇒ 14–24 words is the sweet spot.
 *    5. ~8 minutes, 30 segments organized in 8 chapters.
 *
 *  IMPORTANT: www.comfy.org is a Nuxt SSR site. Scripts are blocked to avoid
 *  hangs. Only mouse.move and mouse.wheel are used inside segments — no
 *  safeMove, no page.evaluate, no typeKeys.
 */
const VIDEO_SCRIPT = [
  // ── Intro ──
  { kind: "title", text: "ComfyUI", subtitle: "The most powerful open-source AI image generator", durationMs: 3000 },
  { kind: "segment", narration: "ComfyUI is the leading open-source tool for AI image generation. If you've heard about it but aren't sure where to start, this homepage tells the whole story." },
  { kind: "segment", narration: "The official site explains what ComfyUI does, why it's different, and gives you three clear paths to get started — local install, cloud, or documentation." },

  // ── Chapter 1: Hero Section ──
  { kind: "title", text: "Hero Section", subtitle: "First impressions and visual impact", durationMs: 2000 },
  { kind: "segment", narration: "Right at the top, the main tagline grabs your attention. ComfyUI positions itself as the most powerful and modular AI image generation tool available." },
  { kind: "segment", narration: "Below the tagline, a subtitle explains the core concept — build complex image generation pipelines by connecting nodes visually, like a flowchart. No coding required." },
  { kind: "segment", narration: "Three prominent call-to-action buttons sit right here: Get Started, Try Cloud, and Download. Each one leads to a different onboarding path." },
  { kind: "segment", narration: "The hero image showcases the node editor in action — a real workflow with connected nodes, previews, and outputs. This is what you'll be building." },

  // ── Chapter 2: Core Features ──
  { kind: "title", text: "Core Features", subtitle: "What makes ComfyUI different", durationMs: 2000 },
  { kind: "segment", narration: "Scrolling into the features section, the first highlight is the node-based editor itself. Every generation step is a visible, connectable block you can rearrange." },
  { kind: "segment", narration: "Full control is the recurring theme. Unlike black-box tools, here you see and adjust every parameter — samplers, schedulers, conditioning, VAE, all exposed." },
  { kind: "segment", narration: "The open-source badge matters. ComfyUI is community-driven, MIT-licensed, and developed in the open. Anyone can contribute, audit, or fork the code." },
  { kind: "segment", narration: "Extensibility is where it really shines. Hundreds of custom nodes created by the community let you add new models, preprocessors, and post-processing steps." },
  { kind: "segment", narration: "Real workflow examples and screenshots show what's possible — from simple text-to-image to multi-model pipelines with inpainting and upscaling chained together." },

  // ── Chapter 3: Model Support ──
  { kind: "title", text: "Model Support", subtitle: "Every major architecture, one interface", durationMs: 2000 },
  { kind: "segment", narration: "Stable Diffusion and SDXL are first-class citizens. Both are fully supported with dedicated nodes for loading, conditioning, and sampling." },
  { kind: "segment", narration: "Flux model integration is another headline feature. The latest generation of image models works seamlessly inside the same node graph." },
  { kind: "segment", narration: "ControlNet and specialized models like IP-Adapter plug right in. Pose control, depth maps, edge detection — all available as drag-and-drop nodes." },
  { kind: "segment", narration: "New model support gets added regularly by the community. When a new architecture drops, custom nodes often appear within days, not months." },

  // ── Chapter 4: Community and Ecosystem ──
  { kind: "title", text: "Community & Ecosystem", subtitle: "Thousands of users, hundreds of nodes", durationMs: 2000 },
  { kind: "segment", narration: "Community testimonials and quotes from real users highlight how ComfyUI changed their creative workflow. These aren't marketing blurbs — they're genuine experiences." },
  { kind: "segment", narration: "The user count and ecosystem numbers tell the scale story. Tens of thousands of active users generating millions of images every month." },
  { kind: "segment", narration: "The custom node ecosystem is massive — hundreds of community-built extensions covering everything from face restoration to video generation to style transfer." },
  { kind: "segment", narration: "Integration partners and platforms round out the picture. ComfyUI connects with cloud providers, model hosting services, and creative tool pipelines." },

  // ── Chapter 5: Getting Started Paths ──
  { kind: "title", text: "Getting Started", subtitle: "Three paths into ComfyUI", durationMs: 2000 },
  { kind: "segment", narration: "The local installation path is front and center. Download ComfyUI for Windows, Mac, or Linux and run everything on your own hardware with full privacy." },
  { kind: "segment", narration: "The cloud option — ComfyUI Cloud — means zero install. Open a browser, connect your models, and start generating immediately on hosted GPUs." },
  { kind: "segment", narration: "The documentation path is for learners. Comprehensive guides, tutorials, and API references let you go at your own pace before committing." },

  // ── Chapter 6: Resources and Footer ──
  { kind: "title", text: "Resources & Footer", subtitle: "Everything you need to dive in", durationMs: 2000 },
  { kind: "segment", narration: "The documentation link takes you to structured guides covering installation, first workflows, advanced techniques, and custom node development." },
  { kind: "segment", narration: "The GitHub repository link is where the source lives. Star counts, recent commits, and open issues show a healthy, actively maintained project." },
  { kind: "segment", narration: "Discord community and social links connect you to thousands of creators sharing workflows, troubleshooting issues, and showcasing their work." },

  // ── Outro ──
  { kind: "segment", narration: "The official ComfyUI homepage — your launchpad into AI image generation. Pick your path: local, cloud, or docs." },
  { kind: "outro", text: "ComfyUI", subtitle: "comfy.org", narration: "ComfyUI gives you full control over AI image generation through visual node pipelines. Support for SD, SDXL, Flux, ControlNet, hundreds of custom nodes, three ways to start — local install, cloud, or documentation — and a thriving open-source community.", durationMs: 3000 },
] as const;

const VS = VIDEO_SCRIPT;

// ─────────────────────────────────────────────────────────────────────────────
//  PLAYWRIGHT IMPLEMENTATION (consumes VIDEO_SCRIPT above)
// ─────────────────────────────────────────────────────────────────────────────
import { test } from "./fixtures/fixture";
import { createVideoScript } from "../lib/demowright/dist/index.mjs";

// Note: www.comfy.org is a Nuxt SSR site whose page.evaluate calls hang
// after a few seconds. This spec uses ONLY mouse.wheel / mouse.move (which
// don't call page.evaluate) to avoid hangs.
test("comfy.org website tour", async ({ page }) => {
  test.setTimeout(10 * 60_000);

  // Block ALL scripts and analytics to render as static HTML — mouse moves
  // and scrolls then work reliably.
  await page.route("**/*.js", (route) => route.abort());
  await page.route(
    /google|analytics|sentry|posthog|hotjar|intercom|crisp|drift|hubspot|plausible|fullstory|segment|mixpanel/,
    (route) => route.abort(),
  );

  // Pre-navigate before script.render
  await page.goto("https://www.comfy.org/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2500);

  const script = createVideoScript()
    // ── Intro ──
    .title(VS[0].text, {
      subtitle: VS[0].subtitle,
      durationMs: VS[0].durationMs,
    })

    // Segment 1 — What is ComfyUI
    .segment(VS[1].narration, async (pace) => {
      await page.mouse.move(640, 200);
      await pace();
      await page.mouse.move(640, 360);
      await pace();
    })

    // Segment 2 — Three paths overview
    .segment(VS[2].narration, async (pace) => {
      await page.mouse.move(400, 280);
      await pace();
      await page.mouse.move(800, 380);
      await pace();
    })

    // ── Chapter 1: Hero Section ──
    .title(VS[3].text, {
      subtitle: VS[3].subtitle,
      durationMs: VS[3].durationMs,
    })

    // Segment 3 — Main tagline
    .segment(VS[4].narration, async (pace) => {
      await page.mouse.move(640, 150);
      await pace();
      await page.mouse.move(640, 250);
      await pace();
    })

    // Segment 4 — Subtitle / node-based concept
    .segment(VS[5].narration, async (pace) => {
      await page.mouse.move(640, 300);
      await pace();
      await page.mouse.move(500, 350);
      await pace();
    })

    // Segment 5 — CTA buttons
    .segment(VS[6].narration, async (pace) => {
      await page.mouse.move(400, 400);
      await pace();
      await page.mouse.move(640, 400);
      await pace();
      await page.mouse.move(880, 400);
      await pace();
    })

    // Segment 6 — Hero image / editor screenshot
    .segment(VS[7].narration, async (pace) => {
      await page.mouse.move(640, 500);
      await pace();
      await page.mouse.wheel(0, 300);
      await pace();
    })

    // ── Chapter 2: Core Features ──
    .title(VS[8].text, {
      subtitle: VS[8].subtitle,
      durationMs: VS[8].durationMs,
    })

    // Segment 7 — Node-based editor
    .segment(VS[9].narration, async (pace) => {
      await page.mouse.wheel(0, 400);
      await pace();
      await page.mouse.move(640, 350);
      await pace();
    })

    // Segment 8 — Full control
    .segment(VS[10].narration, async (pace) => {
      await page.mouse.wheel(0, 350);
      await pace();
      await page.mouse.move(500, 400);
      await pace();
    })

    // Segment 9 — Open source
    .segment(VS[11].narration, async (pace) => {
      await page.mouse.wheel(0, 350);
      await pace();
      await page.mouse.move(640, 300);
      await pace();
    })

    // Segment 10 — Extensibility / custom nodes
    .segment(VS[12].narration, async (pace) => {
      await page.mouse.wheel(0, 400);
      await pace();
      await page.mouse.move(700, 380);
      await pace();
    })

    // Segment 11 — Workflow examples
    .segment(VS[13].narration, async (pace) => {
      await page.mouse.wheel(0, 400);
      await pace();
      await page.mouse.move(640, 450);
      await pace();
    })

    // ── Chapter 3: Model Support ──
    .title(VS[14].text, {
      subtitle: VS[14].subtitle,
      durationMs: VS[14].durationMs,
    })

    // Segment 12 — SD and SDXL
    .segment(VS[15].narration, async (pace) => {
      await page.mouse.wheel(0, 400);
      await pace();
      await page.mouse.move(500, 350);
      await pace();
    })

    // Segment 13 — Flux
    .segment(VS[16].narration, async (pace) => {
      await page.mouse.wheel(0, 350);
      await pace();
      await page.mouse.move(640, 400);
      await pace();
    })

    // Segment 14 — ControlNet and specialized models
    .segment(VS[17].narration, async (pace) => {
      await page.mouse.wheel(0, 350);
      await pace();
      await page.mouse.move(750, 380);
      await pace();
    })

    // Segment 15 — Community model support
    .segment(VS[18].narration, async (pace) => {
      await page.mouse.wheel(0, 350);
      await pace();
      await page.mouse.move(640, 350);
      await pace();
    })

    // ── Chapter 4: Community and Ecosystem ──
    .title(VS[19].text, {
      subtitle: VS[19].subtitle,
      durationMs: VS[19].durationMs,
    })

    // Segment 16 — Testimonials
    .segment(VS[20].narration, async (pace) => {
      await page.mouse.wheel(0, 400);
      await pace();
      await page.mouse.move(640, 350);
      await pace();
    })

    // Segment 17 — User count and numbers
    .segment(VS[21].narration, async (pace) => {
      await page.mouse.wheel(0, 350);
      await pace();
      await page.mouse.move(500, 400);
      await pace();
    })

    // Segment 18 — Custom node ecosystem
    .segment(VS[22].narration, async (pace) => {
      await page.mouse.wheel(0, 350);
      await pace();
      await page.mouse.move(700, 350);
      await pace();
    })

    // Segment 19 — Integration partners
    .segment(VS[23].narration, async (pace) => {
      await page.mouse.wheel(0, 350);
      await pace();
      await page.mouse.move(640, 400);
      await pace();
    })

    // ── Chapter 5: Getting Started Paths ──
    .title(VS[24].text, {
      subtitle: VS[24].subtitle,
      durationMs: VS[24].durationMs,
    })

    // Segment 20 — Local installation
    .segment(VS[25].narration, async (pace) => {
      await page.mouse.wheel(0, 400);
      await pace();
      await page.mouse.move(400, 380);
      await pace();
    })

    // Segment 21 — Cloud option
    .segment(VS[26].narration, async (pace) => {
      await page.mouse.wheel(0, 300);
      await pace();
      await page.mouse.move(640, 380);
      await pace();
    })

    // Segment 22 — Documentation path
    .segment(VS[27].narration, async (pace) => {
      await page.mouse.wheel(0, 300);
      await pace();
      await page.mouse.move(880, 380);
      await pace();
    })

    // ── Chapter 6: Resources and Footer ──
    .title(VS[28].text, {
      subtitle: VS[28].subtitle,
      durationMs: VS[28].durationMs,
    })

    // Segment 23 — Documentation link
    .segment(VS[29].narration, async (pace) => {
      await page.mouse.wheel(0, 400);
      await pace();
      await page.mouse.move(400, 500);
      await pace();
    })

    // Segment 24 — GitHub repository
    .segment(VS[30].narration, async (pace) => {
      await page.mouse.wheel(0, 300);
      await pace();
      await page.mouse.move(640, 500);
      await pace();
    })

    // Segment 25 — Discord and social links
    .segment(VS[31].narration, async (pace) => {
      await page.mouse.wheel(0, 300);
      await pace();
      await page.mouse.move(800, 500);
      await pace();
    })

    // ── Outro ──
    // Segment 26 — Wrap-up
    .segment(VS[32].narration, async (pace) => {
      await page.mouse.wheel(0, -3000);
      await pace();
      await page.mouse.move(640, 300);
      await pace();
    })

    .outro({
      text: VS[33].text,
      subtitle: VS[33].subtitle,
      narration: VS[33].narration,
      durationMs: VS[33].durationMs,
    });

  await script.prepare(page);
  await script.render(page, {
    baseName: "comfy-website",
    outputDir: ".comfy-qa/.demos",
  });
});
