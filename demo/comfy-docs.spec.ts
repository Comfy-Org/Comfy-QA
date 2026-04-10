/**
 * ComfyUI Docs — docs.comfy.org
 *
 * Story:  demo/stories/comfy-docs.story.md
 * Output: .comfy-qa/.demos/comfy-docs.mp4
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *  VIDEO SCRIPT (the source of truth)
 * ─────────────────────────────────────────────────────────────────────────────
 *  Every word in `narration` is read aloud verbatim by Gemini TTS during
 *  recording. This is a comprehensive >5 minute narrated walkthrough of the
 *  entire ComfyUI documentation site landing page.
 *
 *  Rules:
 *    1. First person, present tense, conversational pace.
 *    2. Connect segments with transitional phrases — never bullet-points.
 *    3. Explain WHY, not just WHAT.
 *    4. Each segment ~6–10 seconds at 140 wpm ⇒ 14–24 words is the sweet spot.
 *    5. Total: 52 segments, video ~5+ minutes.
 */
const VIDEO_SCRIPT = [
  // ── Title ──
  {
    kind: "title",
    text: "ComfyUI Docs",
    subtitle: "The official documentation for ComfyUI",
    durationMs: 2000,
  },

  // ── Chapter 1: First impressions & landing page (segments 1–6) ──
  {
    kind: "segment",
    narration:
      "Welcome to the official ComfyUI documentation — the single most important resource for anyone " +
      "learning or building with ComfyUI. Everything you need to know lives right here.",
    visuals: ["safeMove h1"],
  },
  {
    kind: "segment",
    narration:
      "The hero section says ComfyUI Official Documentation — immediately telling you this is " +
      "the authoritative source, not some third-party wiki or community fork.",
    visuals: ["safeMove h1", "safeMove main"],
  },
  {
    kind: "segment",
    narration:
      "Up at the top, you can see the ComfyUI logo and the main navigation bar. " +
      "This is your anchor — it stays consistent as you move through the docs.",
    visuals: ["safeMove header"],
  },
  {
    kind: "segment",
    narration:
      "The top navigation includes a Download link for getting ComfyUI installed, " +
      "and a Comfy Cloud link for those who want to run workflows in the cloud.",
    visuals: ["safeMove nav"],
  },
  {
    kind: "segment",
    narration:
      "What makes this site special is its structure. You've got a sidebar on the left " +
      "for deep navigation, and the main content area on the right with organized sections.",
    visuals: ["safeMove aside", "safeMove main"],
  },
  {
    kind: "segment",
    narration:
      "The design is clean and focused — no distractions, just documentation. " +
      "They want you learning ComfyUI, not fighting the interface.",
    visuals: ["safeMove main"],
  },

  // ── Chapter 2: Sidebar navigation structure (segments 7–13) ──
  {
    kind: "segment",
    narration:
      "Let me draw your attention to the sidebar — this is the primary way you navigate the entire site. " +
      "It's organized into logical categories that take you from beginner to advanced.",
    visuals: ["safeMove aside"],
  },
  {
    kind: "segment",
    narration:
      "Right at the top of the sidebar is Getting Started — exactly where a new user should begin. " +
      "It covers what ComfyUI is, who it's for, and what to expect.",
    visuals: ["safeMove sidebar > Getting Started"],
  },
  {
    kind: "segment",
    narration:
      "Below that is Download and Install. " +
      "Whether you're on Windows, macOS, or Linux, there are detailed guides for every platform.",
    visuals: ["safeMove sidebar > Download & Install"],
  },
  {
    kind: "segment",
    narration:
      "Next comes First Generation — and this is the critical one. " +
      "It walks you step by step through producing your very first AI image. That's the moment it all clicks.",
    visuals: ["safeMove sidebar > First Generation"],
  },
  {
    kind: "segment",
    narration:
      "Then you've got Basic Concepts — nodes, connections, workflows, and the execution model. " +
      "This is the mental model every user needs to understand how ComfyUI actually works.",
    visuals: ["safeMove sidebar > Basic Concepts"],
  },
  {
    kind: "segment",
    narration:
      "Below that is Comfy Hub — the ecosystem for sharing and discovering workflows and custom nodes. " +
      "Think of it as the app store for ComfyUI creativity.",
    visuals: ["safeMove sidebar > Comfy Hub"],
  },
  {
    kind: "segment",
    narration:
      "What I love about this sidebar structure is the progression. " +
      "It starts with installation, moves to your first image, then deepens into concepts. Very intentional.",
    visuals: ["safeMove aside"],
  },

  // ── Chapter 3: Learn & tutorials (segments 14–21) ──
  {
    kind: "segment",
    narration:
      "Now let me scroll down the sidebar to the learning section. " +
      "This is where the docs really shine — hands-on tutorials organized by topic.",
    visuals: ["scroll sidebar"],
  },
  {
    kind: "segment",
    narration:
      "The Learn and Tutorials section contains step-by-step guides for real-world tasks. " +
      "These aren't abstract — they walk you through building actual workflows.",
    visuals: ["safeMove sidebar > Tutorials"],
  },
  {
    kind: "segment",
    narration:
      "There's also an Interface Guide that covers the UI in depth — " +
      "APP mode, Nodes 2.0, the Mask Editor, Workflow Templates, and Subgraph support.",
    visuals: ["safeMove sidebar > Interface Guide"],
  },
  {
    kind: "segment",
    narration:
      "Let me look at the main content area now. " +
      "The landing page itself shows organized category cards that give you quick access to popular topics.",
    visuals: ["safeMove main"],
  },
  {
    kind: "segment",
    narration:
      "You can see quick-link buttons here — Install Locally, Install Custom Nodes, Settings, " +
      "and Cloud Exclusive. Each one jumps you straight to the relevant guide.",
    visuals: ["hover category buttons"],
  },
  {
    kind: "segment",
    narration:
      "Further down, there are tutorial category buttons — Basic Examples, ControlNet, " +
      "Image workflows, 3D generation, Video, and Audio. The full creative spectrum.",
    visuals: ["scroll main content"],
  },
  {
    kind: "segment",
    narration:
      "ControlNet is probably the most popular tutorial category. " +
      "It teaches you guided image generation — how to control exactly what your AI produces.",
    visuals: ["hover ControlNet button"],
  },
  {
    kind: "segment",
    narration:
      "And the Video tutorials are incredibly relevant right now — video generation is one of the " +
      "fastest-moving areas in AI, and ComfyUI is at the center of it.",
    visuals: ["hover Video button"],
  },

  // ── Chapter 4: Built-in nodes (segments 22–27) ──
  {
    kind: "segment",
    narration:
      "Let me scroll down further to the Built-in Nodes section. " +
      "This is the reference documentation — every single node that ships with ComfyUI is documented here.",
    visuals: ["scroll to Built-in Nodes"],
  },
  {
    kind: "segment",
    narration:
      "The nodes are organized by category — Image, 3D, Video, Audio, Utility, and Partner Nodes. " +
      "Each category groups related functionality together.",
    visuals: ["safeMove node categories"],
  },
  {
    kind: "segment",
    narration:
      "The Image category covers everything from loading and saving images to applying transformations, " +
      "filters, and advanced processing techniques.",
    visuals: ["hover Image category"],
  },
  {
    kind: "segment",
    narration:
      "3D and Video categories are especially exciting. " +
      "ComfyUI has grown far beyond just image generation — it's now a full multimedia pipeline.",
    visuals: ["hover 3D and Video categories"],
  },
  {
    kind: "segment",
    narration:
      "Audio nodes let you generate and process sound — from music to speech synthesis. " +
      "This is one of the newer capabilities that keeps expanding.",
    visuals: ["hover Audio category"],
  },
  {
    kind: "segment",
    narration:
      "And then there are Utility and Partner Nodes. " +
      "Utility nodes handle workflow logic, while Partner Nodes come from ecosystem collaborators.",
    visuals: ["hover Utility and Partner"],
  },

  // ── Chapter 5: Development & extension (segments 28–33) ──
  {
    kind: "segment",
    narration:
      "Scrolling further into the sidebar, I can see the Development and Extension section. " +
      "This is where the docs shift from user-focused to developer-focused.",
    visuals: ["scroll sidebar to Development"],
  },
  {
    kind: "segment",
    narration:
      "The Development Guide covers everything a developer needs to extend ComfyUI — " +
      "architecture overview, plugin hooks, and contribution guidelines.",
    visuals: ["safeMove Development Guide"],
  },
  {
    kind: "segment",
    narration:
      "Custom Nodes is arguably the most important developer section. " +
      "It teaches you how to build, package, publish, and maintain your own nodes for the ecosystem.",
    visuals: ["safeMove Custom Nodes"],
  },
  {
    kind: "segment",
    narration:
      "The Local API section documents the REST and WebSocket APIs. " +
      "If you want to control ComfyUI programmatically — queue prompts, check progress, download results — this is where you learn how.",
    visuals: ["safeMove Local API"],
  },
  {
    kind: "segment",
    narration:
      "And the Cloud API documentation covers headless generation at scale. " +
      "This is for production use cases — batch processing, integrations, and automated pipelines.",
    visuals: ["safeMove Cloud API"],
  },
  {
    kind: "segment",
    narration:
      "What's impressive is the range. These docs serve a complete beginner installing ComfyUI for the first time " +
      "and a senior developer building production API integrations. That's a huge scope to cover well.",
    visuals: ["safeMove aside"],
  },

  // ── Chapter 6: Category quick-links on landing page (segments 34–39) ──
  {
    kind: "segment",
    narration:
      "Let me scroll back to the main content area and highlight the category quick-links. " +
      "These buttons are a brilliant shortcut for users who know what they're looking for.",
    visuals: ["scroll to top", "safeMove main"],
  },
  {
    kind: "segment",
    narration:
      "The first row includes Install Locally, Install Custom Nodes, and Settings. " +
      "These are the three most common tasks for someone who just downloaded ComfyUI.",
    visuals: ["hover Install buttons"],
  },
  {
    kind: "segment",
    narration:
      "There's also a Cloud Exclusive button for users running ComfyUI in the cloud. " +
      "Cloud deployments have their own setup requirements and capabilities.",
    visuals: ["hover Cloud Exclusive"],
  },
  {
    kind: "segment",
    narration:
      "The tutorial quick-links are organized by media type — Basic Examples first, " +
      "then ControlNet, Image, 3D, Video, Audio, and Utility. Each is a doorway into a different creative domain.",
    visuals: ["hover tutorial buttons"],
  },
  {
    kind: "segment",
    narration:
      "I want to call out the 3D button specifically. " +
      "3D generation with ComfyUI is relatively new, and having dedicated tutorials makes it much more approachable.",
    visuals: ["hover 3D button"],
  },
  {
    kind: "segment",
    narration:
      "Same goes for Audio — it's a growing frontier. " +
      "The fact that these tutorials exist alongside image and video shows how versatile ComfyUI has become.",
    visuals: ["hover Audio button"],
  },

  // ── Chapter 7: Search functionality (segments 40–44) ──
  {
    kind: "segment",
    narration:
      "Now let me show you one of the most powerful features of this docs site — the search. " +
      "You can trigger it with Control plus K, which opens an instant search modal.",
    visuals: ["safeMove header search"],
  },
  {
    kind: "segment",
    narration:
      "The search covers every single page in the documentation. " +
      "Whether you're looking for a specific node name, a concept, or a tutorial topic, it finds it fast.",
    visuals: ["focus search"],
  },
  {
    kind: "segment",
    narration:
      "Let me type ControlNet into the search to demonstrate. " +
      "Watch how quickly the results appear — it searches across titles, headings, and content.",
    visuals: ["typeKeys 'ControlNet'"],
  },
  {
    kind: "segment",
    narration:
      "The results show page titles with context snippets so you can evaluate each match " +
      "without actually opening it. That saves a lot of time when you're hunting for something specific.",
    visuals: ["pause on results"],
  },
  {
    kind: "segment",
    narration:
      "Let me close the search and go back to the main page. " +
      "Search is especially useful once you're familiar with the docs and know roughly what you need.",
    visuals: ["close search"],
  },

  // ── Chapter 8: Community & help (segments 45–48) ──
  {
    kind: "segment",
    narration:
      "At the bottom of the sidebar, you'll find the Get Help section. " +
      "This is where the docs connect you to the broader ComfyUI community.",
    visuals: ["scroll sidebar to bottom"],
  },
  {
    kind: "segment",
    narration:
      "It covers Support, Account management, Billing, Troubleshooting, and Community links — " +
      "so whether you have a technical issue or a billing question, there's a clear path to get answers.",
    visuals: ["safeMove help section"],
  },
  {
    kind: "segment",
    narration:
      "The Community section connects you to Discord and GitHub — " +
      "that's where users discuss workflows, share custom nodes, and help each other solve problems.",
    visuals: ["safeMove help links"],
  },
  {
    kind: "segment",
    narration:
      "Having these help channels documented right alongside the technical content " +
      "means no one gets stuck without knowing where to turn.",
    visuals: ["safeMove aside"],
  },

  // ── Chapter 9: Wrapping up (segments 49–52) ──
  {
    kind: "segment",
    narration:
      "Let me scroll back to the top of the page for a final overview of everything we've covered.",
    visuals: ["scroll to top"],
  },
  {
    kind: "segment",
    narration:
      "We started with the landing page and sidebar structure — fifteen organized sections " +
      "taking you from Getting Started through installation, concepts, and your first image.",
    visuals: ["safeMove h1"],
  },
  {
    kind: "segment",
    narration:
      "We explored the tutorial categories — ControlNet, Image, 3D, Video, Audio — " +
      "and the built-in node reference that documents every single node in ComfyUI.",
    visuals: ["safeMove main"],
  },
  {
    kind: "segment",
    narration:
      "We covered the developer docs — Custom Nodes, Local API, Cloud API — " +
      "and the search functionality that ties everything together.",
    visuals: ["safeMove nav"],
  },
  {
    kind: "segment",
    narration:
      "Whether you're generating your first image or building a production API pipeline, " +
      "docs.comfy.org has you covered. Bookmark it — you'll be coming back often.",
    visuals: ["safeMove h1"],
  },

  // ── Outro ──
  {
    kind: "outro",
    text: "ComfyUI Docs",
    subtitle: "docs.comfy.org",
    durationMs: 2000,
  },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
//  PLAYWRIGHT IMPLEMENTATION (consumes VIDEO_SCRIPT above)
// ─────────────────────────────────────────────────────────────────────────────
import { test, safeMove } from "./fixtures/fixture";
import { createVideoScript } from "../lib/demowright/dist/index.mjs";
import { typeKeys } from "../lib/demowright/dist/helpers.mjs";

test("comfy docs tour", async ({ page }) => {
  test.setTimeout(10 * 60_000);

  // Pre-navigate (heavy work BEFORE script.render — see hard rules in skill)
  await page.goto("https://docs.comfy.org/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(3000);

  const script = createVideoScript()
    // ── Title ──
    .title(VIDEO_SCRIPT[0].text, {
      subtitle: VIDEO_SCRIPT[0].subtitle,
      durationMs: VIDEO_SCRIPT[0].durationMs,
    })

    // ── Chapter 1: First impressions & landing page ──
    .segment(VIDEO_SCRIPT[1].narration, async (pace) => {
      await safeMove(page, "h1");
      await pace();
    })
    .segment(VIDEO_SCRIPT[2].narration, async (pace) => {
      await safeMove(page, "h1");
      await pace();
      await safeMove(page, "main");
      await pace();
    })
    .segment(VIDEO_SCRIPT[3].narration, async (pace) => {
      await safeMove(page, "header");
      await pace();
    })
    .segment(VIDEO_SCRIPT[4].narration, async (pace) => {
      await safeMove(page, "nav");
      await pace();
      await page.mouse.move(600, 30);
      await pace();
    })
    .segment(VIDEO_SCRIPT[5].narration, async (pace) => {
      await safeMove(page, "aside");
      await pace();
      await safeMove(page, "main");
      await pace();
    })
    .segment(VIDEO_SCRIPT[6].narration, async (pace) => {
      await safeMove(page, "main");
      await pace();
    })

    // ── Chapter 2: Sidebar navigation structure ──
    .segment(VIDEO_SCRIPT[7].narration, async (pace) => {
      await safeMove(page, "aside");
      await pace();
      await page.mouse.move(150, 200);
      await pace();
    })
    .segment(VIDEO_SCRIPT[8].narration, async (pace) => {
      // Hover Getting Started in sidebar
      await page.mouse.move(150, 180);
      await pace();
      await page.mouse.move(150, 200);
      await pace();
    })
    .segment(VIDEO_SCRIPT[9].narration, async (pace) => {
      // Hover Download & Install
      await page.mouse.move(150, 230);
      await pace();
      await page.mouse.move(150, 250);
      await pace();
    })
    .segment(VIDEO_SCRIPT[10].narration, async (pace) => {
      // Hover First Generation
      await page.mouse.move(150, 270);
      await pace();
      await page.mouse.move(150, 290);
      await pace();
    })
    .segment(VIDEO_SCRIPT[11].narration, async (pace) => {
      // Hover Basic Concepts
      await page.mouse.move(150, 310);
      await pace();
      await page.mouse.move(150, 330);
      await pace();
    })
    .segment(VIDEO_SCRIPT[12].narration, async (pace) => {
      // Hover Comfy Hub
      await page.mouse.move(150, 350);
      await pace();
      await page.mouse.move(150, 370);
      await pace();
    })
    .segment(VIDEO_SCRIPT[13].narration, async (pace) => {
      await safeMove(page, "aside");
      await pace();
      await page.mouse.move(150, 250);
      await pace();
    })

    // ── Chapter 3: Learn & tutorials ──
    .segment(VIDEO_SCRIPT[14].narration, async (pace) => {
      // Scroll sidebar down to tutorials
      await page.mouse.move(150, 400);
      await pace();
      await page.mouse.move(150, 420);
      await pace();
    })
    .segment(VIDEO_SCRIPT[15].narration, async (pace) => {
      // Hover Learn & Tutorials
      await page.mouse.move(150, 440);
      await pace();
      await page.mouse.move(150, 460);
      await pace();
    })
    .segment(VIDEO_SCRIPT[16].narration, async (pace) => {
      // Hover Interface Guide
      await page.mouse.move(150, 400);
      await pace();
      await page.mouse.move(150, 420);
      await pace();
    })
    .segment(VIDEO_SCRIPT[17].narration, async (pace) => {
      // Move to main content area
      await safeMove(page, "main");
      await pace();
      await page.mouse.move(640, 350);
      await pace();
    })
    .segment(VIDEO_SCRIPT[18].narration, async (pace) => {
      // Hover over category buttons on landing page
      await page.mouse.move(500, 380);
      await pace();
      await page.mouse.move(700, 380);
      await pace();
    })
    .segment(VIDEO_SCRIPT[19].narration, async (pace) => {
      // Scroll main content to see tutorial categories
      await page.mouse.wheel(0, 250);
      await pace();
      await page.mouse.move(500, 400);
      await pace();
    })
    .segment(VIDEO_SCRIPT[20].narration, async (pace) => {
      // Hover ControlNet area
      await page.mouse.move(500, 420);
      await pace();
      await page.mouse.move(520, 430);
      await pace();
    })
    .segment(VIDEO_SCRIPT[21].narration, async (pace) => {
      // Hover Video area
      await page.mouse.move(700, 420);
      await pace();
      await page.mouse.move(720, 430);
      await pace();
    })

    // ── Chapter 4: Built-in nodes ──
    .segment(VIDEO_SCRIPT[22].narration, async (pace) => {
      await page.mouse.wheel(0, 300);
      await pace();
      await page.mouse.move(640, 400);
      await pace();
    })
    .segment(VIDEO_SCRIPT[23].narration, async (pace) => {
      // Hover over node categories
      await page.mouse.move(500, 400);
      await pace();
      await page.mouse.move(700, 400);
      await pace();
    })
    .segment(VIDEO_SCRIPT[24].narration, async (pace) => {
      // Hover Image category
      await page.mouse.move(450, 420);
      await pace();
      await page.mouse.move(470, 430);
      await pace();
    })
    .segment(VIDEO_SCRIPT[25].narration, async (pace) => {
      // Hover 3D and Video
      await page.mouse.move(600, 420);
      await pace();
      await page.mouse.move(750, 420);
      await pace();
    })
    .segment(VIDEO_SCRIPT[26].narration, async (pace) => {
      // Hover Audio
      await page.mouse.move(500, 450);
      await pace();
      await page.mouse.move(520, 460);
      await pace();
    })
    .segment(VIDEO_SCRIPT[27].narration, async (pace) => {
      // Hover Utility and Partner
      await page.mouse.move(650, 450);
      await pace();
      await page.mouse.move(800, 450);
      await pace();
    })

    // ── Chapter 5: Development & extension ──
    .segment(VIDEO_SCRIPT[28].narration, async (pace) => {
      // Scroll sidebar to Development section
      await page.mouse.move(150, 400);
      await pace();
      await page.mouse.move(150, 500);
      await pace();
    })
    .segment(VIDEO_SCRIPT[29].narration, async (pace) => {
      // Hover Development Guide
      await page.mouse.move(150, 480);
      await pace();
      await page.mouse.move(150, 500);
      await pace();
    })
    .segment(VIDEO_SCRIPT[30].narration, async (pace) => {
      // Hover Custom Nodes
      await page.mouse.move(150, 520);
      await pace();
      await page.mouse.move(150, 540);
      await pace();
    })
    .segment(VIDEO_SCRIPT[31].narration, async (pace) => {
      // Hover Local API
      await page.mouse.move(150, 560);
      await pace();
      await page.mouse.move(150, 580);
      await pace();
    })
    .segment(VIDEO_SCRIPT[32].narration, async (pace) => {
      // Hover Cloud API
      await page.mouse.move(150, 600);
      await pace();
      await page.mouse.move(150, 620);
      await pace();
    })
    .segment(VIDEO_SCRIPT[33].narration, async (pace) => {
      await safeMove(page, "aside");
      await pace();
    })

    // ── Chapter 6: Category quick-links on landing page ──
    .segment(VIDEO_SCRIPT[34].narration, async (pace) => {
      await page.mouse.wheel(0, -2000);
      await pace();
      await safeMove(page, "main");
      await pace();
    })
    .segment(VIDEO_SCRIPT[35].narration, async (pace) => {
      // Hover Install buttons
      await page.mouse.move(500, 350);
      await pace();
      await page.mouse.move(650, 350);
      await pace();
    })
    .segment(VIDEO_SCRIPT[36].narration, async (pace) => {
      // Hover Cloud Exclusive
      await page.mouse.move(800, 350);
      await pace();
      await page.mouse.move(820, 360);
      await pace();
    })
    .segment(VIDEO_SCRIPT[37].narration, async (pace) => {
      // Hover tutorial quick-links
      await page.mouse.wheel(0, 200);
      await pace();
      await page.mouse.move(500, 400);
      await pace();
      await page.mouse.move(700, 400);
      await pace();
    })
    .segment(VIDEO_SCRIPT[38].narration, async (pace) => {
      // Hover 3D button
      await page.mouse.move(600, 430);
      await pace();
      await page.mouse.move(620, 440);
      await pace();
    })
    .segment(VIDEO_SCRIPT[39].narration, async (pace) => {
      // Hover Audio button
      await page.mouse.move(750, 430);
      await pace();
      await page.mouse.move(770, 440);
      await pace();
    })

    // ── Chapter 7: Search functionality ──
    .segment(VIDEO_SCRIPT[40].narration, async (pace) => {
      await page.mouse.wheel(0, -2000);
      await pace();
      await safeMove(page, "header");
      await pace();
    })
    .segment(VIDEO_SCRIPT[41].narration, async (pace) => {
      // Open search with Ctrl+K
      await page.keyboard.press("Control+k");
      await page.waitForTimeout(800);
      await pace();
    })
    .segment(VIDEO_SCRIPT[42].narration, async (pace) => {
      await typeKeys(page, "ControlNet", 80);
      await pace();
      await page.waitForTimeout(1000);
      await pace();
    })
    .segment(VIDEO_SCRIPT[43].narration, async (pace) => {
      // Pause to look at results
      await page.waitForTimeout(1500);
      await pace();
    })
    .segment(VIDEO_SCRIPT[44].narration, async (pace) => {
      // Close search with Escape
      await page.keyboard.press("Escape");
      await page.waitForTimeout(500);
      await pace();
    })

    // ── Chapter 8: Community & help ──
    .segment(VIDEO_SCRIPT[45].narration, async (pace) => {
      // Scroll sidebar to bottom for Get Help
      await page.mouse.move(150, 600);
      await pace();
      await page.mouse.move(150, 650);
      await pace();
    })
    .segment(VIDEO_SCRIPT[46].narration, async (pace) => {
      await page.mouse.move(150, 630);
      await pace();
      await page.mouse.move(150, 650);
      await pace();
    })
    .segment(VIDEO_SCRIPT[47].narration, async (pace) => {
      await page.mouse.move(150, 660);
      await pace();
      await page.mouse.move(150, 680);
      await pace();
    })
    .segment(VIDEO_SCRIPT[48].narration, async (pace) => {
      await safeMove(page, "aside");
      await pace();
    })

    // ── Chapter 9: Wrapping up ──
    .segment(VIDEO_SCRIPT[49].narration, async (pace) => {
      await page.mouse.wheel(0, -3000);
      await pace();
    })
    .segment(VIDEO_SCRIPT[50].narration, async (pace) => {
      await safeMove(page, "h1");
      await pace();
    })
    .segment(VIDEO_SCRIPT[51].narration, async (pace) => {
      await safeMove(page, "main");
      await pace();
      await page.mouse.move(640, 400);
      await pace();
    })
    .segment(VIDEO_SCRIPT[52].narration, async (pace) => {
      await safeMove(page, "nav");
      await pace();
    })
    .segment(VIDEO_SCRIPT[53].narration, async (pace) => {
      await safeMove(page, "h1");
      await pace();
    })

    // ── Outro ──
    .outro({
      text: VIDEO_SCRIPT[54].text,
      subtitle: VIDEO_SCRIPT[54].subtitle,
      durationMs: VIDEO_SCRIPT[54].durationMs,
    });

  await script.prepare(page);
  await script.render(page, {
    baseName: "comfy-docs",
    outputDir: ".comfy-qa/.demos",
  });
});
