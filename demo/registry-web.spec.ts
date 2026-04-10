/**
 * Comfy Registry — registry.comfy.org
 *
 * Story:  demo/stories/registry-web.story.md
 * Output: .comfy-qa/.demos/registry-web.mp4
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *  VIDEO SCRIPT (the source of truth)
 * ─────────────────────────────────────────────────────────────────────────────
 *  Every word in `narration` is read aloud verbatim by Gemini TTS during
 *  recording. This is a comprehensive >5 minute narrated walkthrough of the
 *  entire Comfy Registry home page.
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
    text: "Comfy Registry",
    subtitle: "The central hub for ComfyUI custom nodes",
    durationMs: 2000,
  },

  // ── Chapter 1: First impressions & hero (segments 1–6) ──
  {
    kind: "segment",
    narration:
      "Welcome to the Comfy Registry — the official, curated home for every custom node in the ComfyUI ecosystem. " +
      "Without a place like this, you'd be digging through random GitHub repos and hoping the code actually works.",
    visuals: ["safeMove h1"],
  },
  {
    kind: "segment",
    narration:
      "Right away, the hero section tells you exactly what this site does. " +
      "It says Welcome to ComfyUI Registry — clear, direct, no guessing.",
    visuals: ["safeMove h1", "safeMove main"],
  },
  {
    kind: "segment",
    narration:
      "Up in the top-left corner, you can see the Comfy Registry logo. " +
      "That's your anchor — click it from anywhere on the site to get back to this home page.",
    visuals: ["safeMove nav a:first-child"],
  },
  {
    kind: "segment",
    narration:
      "The design is intentionally clean and minimal. " +
      "They want you focused on finding nodes, not wading through clutter.",
    visuals: ["safeMove header"],
  },
  {
    kind: "segment",
    narration:
      "Let me point out the navigation bar across the top. " +
      "You've got three main links — the home page, Documentation, and a link to the Discord community.",
    visuals: ["safeMove nav"],
  },
  {
    kind: "segment",
    narration:
      "Below the hero there's a Get Started call-to-action. " +
      "If you're brand new to ComfyUI custom nodes, that button takes you straight to the onboarding docs.",
    visuals: ["safeMove main a, main button"],
  },

  // ── Chapter 2: The search experience (segments 7–13) ──
  {
    kind: "segment",
    narration:
      "Now let's talk about the single most important feature on this entire page — the search bar. " +
      "It's right at the top with a placeholder that reads Search Nodes.",
    visuals: ["safeMove input[placeholder*='Search']"],
  },
  {
    kind: "segment",
    narration:
      "I'm going to click into the search box now. " +
      "Notice how it highlights and gets ready for input — it's inviting you to start typing.",
    visuals: ["safeMove input[placeholder*='Search']"],
  },
  {
    kind: "segment",
    narration:
      "Let me type controlnet — that's by far the most common thing people search for here. " +
      "ControlNet is the backbone of guided image generation in ComfyUI.",
    visuals: ["typeKeys 'controlnet'"],
  },
  {
    kind: "segment",
    narration:
      "Watch the results update as I type. " +
      "The registry searches across package names, descriptions, and tags to find the most relevant matches.",
    visuals: ["pause"],
  },
  {
    kind: "segment",
    narration:
      "Each result card shows you the essentials at a glance — the package name, a short description, " +
      "and who published it. You can evaluate a node in seconds without clicking into it.",
    visuals: ["wheel +300"],
  },
  {
    kind: "segment",
    narration:
      "Let me scroll down a bit more to see the full range of ControlNet-related packages. " +
      "There are multiple options from different authors, each solving slightly different problems.",
    visuals: ["wheel +300"],
  },
  {
    kind: "segment",
    narration:
      "This is what makes a registry so valuable — you're not locked into one person's implementation. " +
      "You can compare alternatives and pick the one that fits your workflow best.",
    visuals: ["wheel +200"],
  },

  // ── Chapter 3: Browsing the node catalog (segments 14–21) ──
  {
    kind: "segment",
    narration:
      "Let me clear the search and go back to browsing the full catalog. " +
      "I want to show you what the default view looks like when you first land on the page.",
    visuals: ["clear search", "scroll to top"],
  },
  {
    kind: "segment",
    narration:
      "Here's the main catalog — the most popular custom nodes in the entire ecosystem. " +
      "These are the packages that thousands of people rely on every day.",
    visuals: ["safeMove main"],
  },
  {
    kind: "segment",
    narration:
      "Right at the top you'll see KJNodes — one of the most versatile utility packs out there. " +
      "It adds dozens of helper nodes that make complex workflows much easier to build.",
    visuals: ["hover first card"],
  },
  {
    kind: "segment",
    narration:
      "Next to it is rgthree's ComfyUI Nodes — another essential toolkit. " +
      "This one is known for its quality-of-life improvements and clean UI widgets.",
    visuals: ["hover second card"],
  },
  {
    kind: "segment",
    narration:
      "Let me scroll down to see more of these popular packages. " +
      "Every single one of them is here because the community has validated it through real usage.",
    visuals: ["wheel +350"],
  },
  {
    kind: "segment",
    narration:
      "Here's VideoHelperSuite — absolutely essential if you're doing any kind of video generation. " +
      "And Impact Pack right below it, which is one of the most downloaded packs of all time.",
    visuals: ["hover cards"],
  },
  {
    kind: "segment",
    narration:
      "Scrolling further, I can see ControlNet Auxiliary Preprocessors and the GGUF node. " +
      "GGUF lets you run quantized models, which is a lifesaver if you have limited GPU memory.",
    visuals: ["wheel +350"],
  },
  {
    kind: "segment",
    narration:
      "What I love about this catalog is the diversity. " +
      "You've got image processing, video generation, LLM integration, model optimization — the full spectrum of what ComfyUI can do.",
    visuals: ["wheel +300"],
  },

  // ── Chapter 4: Deep dive into node cards (segments 22–25) ──
  {
    kind: "segment",
    narration:
      "Let me scroll back up and take a closer look at how these node cards are designed. " +
      "There's a lot of useful information packed into each one.",
    visuals: ["scroll to top"],
  },
  {
    kind: "segment",
    narration:
      "Each card shows the package name in bold, followed by a brief description of what it does. " +
      "Below that, you'll see the version number, install count, GitHub stars, and node count.",
    visuals: ["hover card"],
  },
  {
    kind: "segment",
    narration:
      "The @author name is always visible too — that's important for trust. " +
      "You can see exactly who built each node and how active they are.",
    visuals: ["hover card"],
  },
  {
    kind: "segment",
    narration:
      "The visual layout is deliberately information-dense but scannable. " +
      "You can evaluate twenty packages in the time it would take to read one GitHub README.",
    visuals: ["safeMove main"],
  },

  // ── Chapter 5: Pagination (segments 26–30) ──
  {
    kind: "segment",
    narration:
      "Now let me scroll all the way to the bottom of the page to show you the pagination controls. " +
      "The registry has hundreds of packages, so they're organized across multiple pages.",
    visuals: ["wheel to bottom"],
  },
  {
    kind: "segment",
    narration:
      "Here at the bottom you can see page numbers — one through five — plus Next and Previous buttons. " +
      "Standard pagination that makes browsing a large catalog completely manageable.",
    visuals: ["safeMove pagination"],
  },
  {
    kind: "segment",
    narration:
      "If I hover over page two, I can see there's a whole other batch of nodes waiting to be discovered. " +
      "Some real hidden gems live on pages two and three.",
    visuals: ["hover page 2"],
  },
  {
    kind: "segment",
    narration:
      "And page three has even more. " +
      "The ecosystem is genuinely massive — we're talking about thousands of custom nodes across all these pages.",
    visuals: ["hover page 3"],
  },
  {
    kind: "segment",
    narration:
      "The Previous and Next buttons at the edges make it easy to navigate sequentially. " +
      "For most people, just browsing page by page is the most natural way to explore.",
    visuals: ["hover Next button"],
  },

  // ── Chapter 6: Navigation & documentation (segments 31–34) ──
  {
    kind: "segment",
    narration:
      "Let me scroll back up to the navigation bar — I want to talk about the Documentation link. " +
      "This is where the registry really helps node authors, not just consumers.",
    visuals: ["scroll to top", "safeMove nav"],
  },
  {
    kind: "segment",
    narration:
      "The Documentation link takes you to comprehensive guides on how to package, publish, and version your own custom nodes. " +
      "It covers everything from your first node pack to setting up automated CI publishing.",
    visuals: ["hover Documentation link"],
  },
  {
    kind: "segment",
    narration:
      "Right next to that is the Discord link. " +
      "The Discord server is where the community discusses nodes, reports bugs, shares workflows, and helps each other out.",
    visuals: ["hover Discord link"],
  },
  {
    kind: "segment",
    narration:
      "Between the docs and Discord, a new publisher has everything they need to go from zero to their first published node. " +
      "That's a really well-thought-out onboarding funnel.",
    visuals: ["safeMove nav"],
  },

  // ── Chapter 7: Authentication & publishing (segments 35–38) ──
  {
    kind: "segment",
    narration:
      "Now let's look at the authentication buttons in the top-right corner. " +
      "You'll see Login and Signup — these are primarily for node publishers.",
    visuals: ["safeMove Login button"],
  },
  {
    kind: "segment",
    narration:
      "The Login button is for existing publishers returning to manage their packages — " +
      "update versions, check download stats, respond to issues.",
    visuals: ["hover Login"],
  },
  {
    kind: "segment",
    narration:
      "And the Signup button is for new node authors who want to join the ecosystem. " +
      "Creating an account is the first step to publishing your own custom nodes.",
    visuals: ["hover Signup"],
  },
  {
    kind: "segment",
    narration:
      "Authentication matters because it ensures every package has a verified author behind it. " +
      "That accountability is what separates a registry from a random file-sharing site.",
    visuals: ["safeMove header"],
  },

  // ── Chapter 8: Language & accessibility (segments 39–41) ──
  {
    kind: "segment",
    narration:
      "Let me point out one more feature that's easy to miss — the language selector. " +
      "The ComfyUI community is genuinely global, with huge user bases in China, Japan, Korea, and Europe.",
    visuals: ["safeMove language selector"],
  },
  {
    kind: "segment",
    narration:
      "Having the registry available in multiple languages makes it accessible to everyone, " +
      "not just English speakers. That's a big deal for an open-source ecosystem.",
    visuals: ["hover language selector"],
  },
  {
    kind: "segment",
    narration:
      "Internationalization might seem like a small detail, but it's one of the reasons ComfyUI " +
      "has grown so fast — they meet users where they are, literally.",
    visuals: ["safeMove header"],
  },

  // ── Chapter 9: Second search — "video" (segments 42–47) ──
  {
    kind: "segment",
    narration:
      "Let me do one more search to show you the breadth of this registry. " +
      "I'm going to search for video, since video generation is one of the hottest areas in AI right now.",
    visuals: ["safeMove search bar"],
  },
  {
    kind: "segment",
    narration:
      "First let me clear the search box so we can start fresh with a new query.",
    visuals: ["clear search"],
  },
  {
    kind: "segment",
    narration:
      "Now I'm typing video — and watch how the results change immediately. " +
      "The search is fast and responsive, even across thousands of packages.",
    visuals: ["typeKeys 'video'"],
  },
  {
    kind: "segment",
    narration:
      "Right away I can see VideoHelperSuite at the top — that's the go-to package for video workflows. " +
      "It handles frame extraction, interpolation, and export.",
    visuals: ["pause"],
  },
  {
    kind: "segment",
    narration:
      "Below that there are more specialized video nodes — some for animation, some for motion transfer, " +
      "some for specific video models like AnimateDiff or CogVideo.",
    visuals: ["wheel +300"],
  },
  {
    kind: "segment",
    narration:
      "This is exactly why a search function matters so much. " +
      "In thirty seconds, I've gone from wondering what's available to having a shortlist of exactly the packages I need.",
    visuals: ["wheel +200"],
  },

  // ── Chapter 10: Wrapping up (segments 48–52) ──
  {
    kind: "segment",
    narration:
      "Let me scroll back to the top of the page for a final look at everything we've covered.",
    visuals: ["scroll to top"],
  },
  {
    kind: "segment",
    narration:
      "We started with the hero and branding, explored the search bar with two different queries, " +
      "browsed through dozens of popular nodes, and checked out the pagination.",
    visuals: ["safeMove h1"],
  },
  {
    kind: "segment",
    narration:
      "We looked at the navigation links — Documentation and Discord — " +
      "the Login and Signup buttons for publishers, and the language selector for international users.",
    visuals: ["safeMove nav"],
  },
  {
    kind: "segment",
    narration:
      "The Comfy Registry is the backbone of the ComfyUI custom node ecosystem. " +
      "Thousands of nodes from hundreds of publishers, all in one trusted place.",
    visuals: ["safeMove main"],
  },
  {
    kind: "segment",
    narration:
      "Whether you're installing nodes built by the community or publishing your own for the first time, " +
      "this is where the ecosystem lives. Head to registry.comfy.org and start exploring.",
    visuals: ["safeMove h1"],
  },

  // ── Outro ──
  {
    kind: "outro",
    text: "Comfy Registry",
    subtitle: "registry.comfy.org",
    durationMs: 2000,
  },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
//  PLAYWRIGHT IMPLEMENTATION (consumes VIDEO_SCRIPT above)
// ─────────────────────────────────────────────────────────────────────────────
import { test, safeMove } from "./fixtures/fixture";
import { createVideoScript } from "../lib/demowright/dist/index.mjs";
import { typeKeys } from "../lib/demowright/dist/helpers.mjs";

test("comfy registry tour", async ({ page }) => {
  test.setTimeout(10 * 60_000);

  // Pre-navigate (heavy work BEFORE script.render — see hard rules in skill)
  await page.goto("https://registry.comfy.org/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(3000);

  const script = createVideoScript()
    // ── Title ──
    .title(VIDEO_SCRIPT[0].text, {
      subtitle: VIDEO_SCRIPT[0].subtitle,
      durationMs: VIDEO_SCRIPT[0].durationMs,
    })

    // ── Chapter 1: First impressions & hero ──
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
      await safeMove(page, "nav a");
      await pace();
    })
    .segment(VIDEO_SCRIPT[4].narration, async (pace) => {
      await safeMove(page, "header");
      await pace();
    })
    .segment(VIDEO_SCRIPT[5].narration, async (pace) => {
      await safeMove(page, "nav");
      await pace();
      await page.mouse.move(800, 60);
      await pace();
    })
    .segment(VIDEO_SCRIPT[6].narration, async (pace) => {
      await safeMove(page, "main a");
      await pace();
    })

    // ── Chapter 2: The search experience ──
    .segment(VIDEO_SCRIPT[7].narration, async (pace) => {
      await safeMove(page, 'input[placeholder*="Search"]');
      await pace();
    })
    .segment(VIDEO_SCRIPT[8].narration, async (pace) => {
      await safeMove(page, 'input[placeholder*="Search"]');
      await pace();
      const search = page.locator('input[placeholder*="Search"]').first();
      if (await search.isVisible().catch(() => false)) {
        await search.focus().catch(() => {});
      }
      await pace();
    })
    .segment(VIDEO_SCRIPT[9].narration, async (pace) => {
      await typeKeys(page, "controlnet", 90);
      await pace();
    })
    .segment(VIDEO_SCRIPT[10].narration, async (pace) => {
      await page.waitForTimeout(1500);
      await pace();
    })
    .segment(VIDEO_SCRIPT[11].narration, async (pace) => {
      await page.mouse.wheel(0, 300);
      await pace();
    })
    .segment(VIDEO_SCRIPT[12].narration, async (pace) => {
      await page.mouse.wheel(0, 300);
      await pace();
    })
    .segment(VIDEO_SCRIPT[13].narration, async (pace) => {
      await page.mouse.wheel(0, 200);
      await pace();
    })

    // ── Chapter 3: Browsing the node catalog ──
    .segment(VIDEO_SCRIPT[14].narration, async (pace) => {
      // Clear search by triple-clicking and deleting
      const search = page.locator('input[placeholder*="Search"]').first();
      if (await search.isVisible().catch(() => false)) {
        await search.focus().catch(() => {});
        await page.keyboard.press("Control+A").catch(() => {});
        await page.keyboard.press("Backspace").catch(() => {});
      }
      await page.mouse.wheel(0, -2000);
      await pace();
    })
    .segment(VIDEO_SCRIPT[15].narration, async (pace) => {
      await safeMove(page, "main");
      await pace();
    })
    .segment(VIDEO_SCRIPT[16].narration, async (pace) => {
      // Hover over first node card
      await page.mouse.move(400, 400);
      await pace();
      await page.mouse.move(400, 420);
      await pace();
    })
    .segment(VIDEO_SCRIPT[17].narration, async (pace) => {
      // Hover over second card area
      await page.mouse.move(700, 400);
      await pace();
      await page.mouse.move(700, 420);
      await pace();
    })
    .segment(VIDEO_SCRIPT[18].narration, async (pace) => {
      await page.mouse.wheel(0, 350);
      await pace();
    })
    .segment(VIDEO_SCRIPT[19].narration, async (pace) => {
      // Hover over cards in the next row
      await page.mouse.move(400, 400);
      await pace();
      await page.mouse.move(400, 500);
      await pace();
    })
    .segment(VIDEO_SCRIPT[20].narration, async (pace) => {
      await page.mouse.wheel(0, 350);
      await pace();
      await page.mouse.move(500, 400);
      await pace();
    })
    .segment(VIDEO_SCRIPT[21].narration, async (pace) => {
      await page.mouse.wheel(0, 300);
      await pace();
      await page.mouse.move(640, 400);
      await pace();
    })

    // ── Chapter 4: Deep dive into node cards ──
    .segment(VIDEO_SCRIPT[22].narration, async (pace) => {
      await page.mouse.wheel(0, -2000);
      await pace();
    })
    .segment(VIDEO_SCRIPT[23].narration, async (pace) => {
      // Hover over a card to inspect details
      await page.mouse.move(400, 450);
      await pace();
      await page.mouse.move(420, 470);
      await pace();
    })
    .segment(VIDEO_SCRIPT[24].narration, async (pace) => {
      await page.mouse.move(400, 490);
      await pace();
      await page.mouse.move(420, 500);
      await pace();
    })
    .segment(VIDEO_SCRIPT[25].narration, async (pace) => {
      await safeMove(page, "main");
      await pace();
    })

    // ── Chapter 5: Pagination ──
    .segment(VIDEO_SCRIPT[26].narration, async (pace) => {
      await page.mouse.wheel(0, 2000);
      await pace();
      await page.mouse.wheel(0, 500);
      await pace();
    })
    .segment(VIDEO_SCRIPT[27].narration, async (pace) => {
      await safeMove(page, 'nav[aria-label*="pagination"], ul:has(> li > a[href*="page"]), .pagination, [class*="pagination"]');
      await pace();
    })
    .segment(VIDEO_SCRIPT[28].narration, async (pace) => {
      // Hover over page 2 link
      await safeMove(page, 'a[href*="page=2"], button:has-text("2")');
      await pace();
    })
    .segment(VIDEO_SCRIPT[29].narration, async (pace) => {
      // Hover over page 3 link
      await safeMove(page, 'a[href*="page=3"], button:has-text("3")');
      await pace();
    })
    .segment(VIDEO_SCRIPT[30].narration, async (pace) => {
      // Hover over Next button
      await safeMove(page, 'a:has-text("Next"), button:has-text("Next")');
      await pace();
    })

    // ── Chapter 6: Navigation & documentation ──
    .segment(VIDEO_SCRIPT[31].narration, async (pace) => {
      await page.mouse.wheel(0, -3000);
      await pace();
      await safeMove(page, "nav");
      await pace();
    })
    .segment(VIDEO_SCRIPT[32].narration, async (pace) => {
      await safeMove(page, 'a[href*="doc"], a:has-text("Documentation"), a:has-text("Docs")');
      await pace();
    })
    .segment(VIDEO_SCRIPT[33].narration, async (pace) => {
      await safeMove(page, 'a[href*="discord"], a:has-text("Discord")');
      await pace();
    })
    .segment(VIDEO_SCRIPT[34].narration, async (pace) => {
      await safeMove(page, "nav");
      await pace();
    })

    // ── Chapter 7: Authentication & publishing ──
    .segment(VIDEO_SCRIPT[35].narration, async (pace) => {
      await safeMove(page, 'a:has-text("Login"), button:has-text("Login"), a:has-text("Log in"), button:has-text("Log in")');
      await pace();
    })
    .segment(VIDEO_SCRIPT[36].narration, async (pace) => {
      await safeMove(page, 'a:has-text("Login"), button:has-text("Login"), a:has-text("Log in"), button:has-text("Log in")');
      await pace();
    })
    .segment(VIDEO_SCRIPT[37].narration, async (pace) => {
      await safeMove(page, 'a:has-text("Sign"), button:has-text("Sign")');
      await pace();
    })
    .segment(VIDEO_SCRIPT[38].narration, async (pace) => {
      await safeMove(page, "header");
      await pace();
    })

    // ── Chapter 8: Language & accessibility ──
    .segment(VIDEO_SCRIPT[39].narration, async (pace) => {
      await safeMove(page, 'select[class*="lang"], button[class*="lang"], [class*="language"], [aria-label*="language"], [aria-label*="Language"]');
      await pace();
    })
    .segment(VIDEO_SCRIPT[40].narration, async (pace) => {
      await safeMove(page, 'select[class*="lang"], button[class*="lang"], [class*="language"], [aria-label*="language"], [aria-label*="Language"]');
      await pace();
    })
    .segment(VIDEO_SCRIPT[41].narration, async (pace) => {
      await safeMove(page, "header");
      await pace();
    })

    // ── Chapter 9: Second search — "video" ──
    .segment(VIDEO_SCRIPT[42].narration, async (pace) => {
      await safeMove(page, 'input[placeholder*="Search"]');
      await pace();
    })
    .segment(VIDEO_SCRIPT[43].narration, async (pace) => {
      const search = page.locator('input[placeholder*="Search"]').first();
      if (await search.isVisible().catch(() => false)) {
        await search.focus().catch(() => {});
        await page.keyboard.press("Control+A").catch(() => {});
        await page.keyboard.press("Backspace").catch(() => {});
      }
      await pace();
    })
    .segment(VIDEO_SCRIPT[44].narration, async (pace) => {
      await typeKeys(page, "video", 100);
      await pace();
      await page.waitForTimeout(1000);
      await pace();
    })
    .segment(VIDEO_SCRIPT[45].narration, async (pace) => {
      await page.waitForTimeout(800);
      await pace();
    })
    .segment(VIDEO_SCRIPT[46].narration, async (pace) => {
      await page.mouse.wheel(0, 300);
      await pace();
    })
    .segment(VIDEO_SCRIPT[47].narration, async (pace) => {
      await page.mouse.wheel(0, 200);
      await pace();
    })

    // ── Chapter 10: Wrapping up ──
    .segment(VIDEO_SCRIPT[48].narration, async (pace) => {
      await page.mouse.wheel(0, -3000);
      await pace();
    })
    .segment(VIDEO_SCRIPT[49].narration, async (pace) => {
      await safeMove(page, "h1");
      await pace();
    })
    .segment(VIDEO_SCRIPT[50].narration, async (pace) => {
      await safeMove(page, "nav");
      await pace();
    })
    .segment(VIDEO_SCRIPT[51].narration, async (pace) => {
      await safeMove(page, "main");
      await pace();
    })
    .segment(VIDEO_SCRIPT[52].narration, async (pace) => {
      await safeMove(page, "h1");
      await pace();
    })

    // ── Outro ──
    .outro({
      text: VIDEO_SCRIPT[53].text,
      subtitle: VIDEO_SCRIPT[53].subtitle,
      durationMs: VIDEO_SCRIPT[53].durationMs,
    });

  await script.prepare(page);
  await script.render(page, {
    baseName: "registry-web",
    outputDir: ".comfy-qa/.demos",
  });
});
