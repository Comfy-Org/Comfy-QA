/**
 * Comfy.org — www.comfy.org
 *
 * Story:  demo/stories/comfy-website.story.md
 * Output: .comfy-qa/.demos/comfy-website.mp4
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *  VIDEO SCRIPT (the source of truth)
 * ─────────────────────────────────────────────────────────────────────────────
 *  Every word in `narration` is read aloud verbatim by Gemini TTS during
 *  recording. This is a comprehensive >5 minute narrated walkthrough of the
 *  entire comfy.org landing page.
 *
 *  IMPORTANT: www.comfy.org is a Nuxt SSR site. All scripts are blocked via
 *  page.route so the page renders as static HTML. Segments use ONLY
 *  mouse.move / mouse.wheel — no page.evaluate, no safeMove, no clicks.
 *
 *  Rules:
 *    1. First person, present tense, conversational pace.
 *    2. Connect segments with transitional phrases — never bullet-points.
 *    3. Explain WHY, not just WHAT.
 *    4. Each segment ~6–10 seconds at 140 wpm ⇒ 14–24 words is the sweet spot.
 *    5. Total: 55 segments, video ~5+ minutes.
 *    6. Page height: ~5302px — scroll gradually through the full page.
 */
const VIDEO_SCRIPT = [
  // ── Title ──
  {
    kind: "title",
    text: "Comfy.org",
    subtitle: "The official ComfyUI homepage",
    durationMs: 2000,
  },

  // ── Chapter 1: First impressions & hero (segments 1–6) ──
  {
    kind: "segment",
    narration:
      "Welcome to comfy.org — the official home of ComfyUI, the most powerful " +
      "node-based tool for generative AI. Everything starts right here.",
    visuals: ["move center"],
  },
  {
    kind: "segment",
    narration:
      "The hero section hits you immediately with a bold statement — generate video, " +
      "images, 3D, and audio with AI. That's not just images, it's everything.",
    visuals: ["move hero area"],
  },
  {
    kind: "segment",
    narration:
      "Up in the top-left corner, you can see the ComfyUI logo. " +
      "That's your anchor — it tells you this is the official site, not a fork or mirror.",
    visuals: ["move top-left nav"],
  },
  {
    kind: "segment",
    narration:
      "The navigation bar across the top gives you the full ecosystem at a glance. " +
      "Products, Community, Resources, About, Pricing, Enterprise, Download, and Comfy Cloud.",
    visuals: ["move across nav"],
  },
  {
    kind: "segment",
    narration:
      "That's eight items in the nav bar — each one representing a pillar of the ComfyUI ecosystem. " +
      "This is a serious, full-featured platform, not a side project.",
    visuals: ["move right nav"],
  },
  {
    kind: "segment",
    narration:
      "Right below the hero, there's a prominent call-to-action inviting you to download " +
      "or get started. The path from curiosity to creation is just one click away.",
    visuals: ["move CTA area"],
  },

  // ── Chapter 2: The power statement (segments 7–10) ──
  {
    kind: "segment",
    narration:
      "Let me scroll down to the first major section. It reads: the most powerful tool " +
      "for generative AI, and it's open source. That's the entire pitch in one sentence.",
    visuals: ["wheel down"],
  },
  {
    kind: "segment",
    narration:
      "What makes this statement so compelling is the combination — powerful AND open source. " +
      "You get professional-grade tools without paying a subscription or losing control.",
    visuals: ["move text area"],
  },
  {
    kind: "segment",
    narration:
      "The visual design here reinforces the message. Clean typography, generous whitespace, " +
      "and screenshots of the actual node editor in action.",
    visuals: ["move visual area"],
  },
  {
    kind: "segment",
    narration:
      "Notice how they lead with capability, not complexity. " +
      "Video, images, 3D, audio — they want you excited about what you can create, not intimidated.",
    visuals: ["wheel down slightly"],
  },

  // ── Chapter 3: Download ComfyUI (segments 11–14) ──
  {
    kind: "segment",
    narration:
      "Scrolling further, we reach the Download ComfyUI section. " +
      "This is where the rubber meets the road — getting the tool onto your machine.",
    visuals: ["wheel down"],
  },
  {
    kind: "segment",
    narration:
      "You'll see download options for every major platform — Windows, Mac, and Linux. " +
      "ComfyUI runs locally on your own hardware, which means your data stays private.",
    visuals: ["move download buttons"],
  },
  {
    kind: "segment",
    narration:
      "The fact that it runs locally is a huge selling point. " +
      "No upload queues, no usage limits, no monthly fees. Just you and your GPU.",
    visuals: ["move download area"],
  },
  {
    kind: "segment",
    narration:
      "And because it's open source, you can inspect the code, customize it, " +
      "and contribute back. That level of transparency is rare in the AI space.",
    visuals: ["wheel down slightly"],
  },

  // ── Chapter 4: Comfy Cloud (segments 15–18) ──
  {
    kind: "segment",
    narration:
      "Next up is the Comfy Cloud section. Not everyone has a powerful GPU at home, " +
      "and this is where Cloud fills the gap perfectly.",
    visuals: ["wheel down"],
  },
  {
    kind: "segment",
    narration:
      "Comfy Cloud lets you run your workflows on remote GPUs — same interface, same nodes, " +
      "same experience, but powered by cloud hardware.",
    visuals: ["move cloud section"],
  },
  {
    kind: "segment",
    narration:
      "What I love about this approach is the choice. Run locally when you can, " +
      "offload to the cloud when you need more power. No vendor lock-in either way.",
    visuals: ["move cloud details"],
  },
  {
    kind: "segment",
    narration:
      "For teams and businesses, Cloud is especially valuable — consistent performance, " +
      "no hardware management, and the ability to scale on demand.",
    visuals: ["wheel down"],
  },

  // ── Chapter 5: Latest News & Updates (segments 19–22) ──
  {
    kind: "segment",
    narration:
      "Now we're scrolling into the Latest News and Updates section. " +
      "This is where you can see that ComfyUI is actively developed and constantly improving.",
    visuals: ["wheel down"],
  },
  {
    kind: "segment",
    narration:
      "The news cards show recent blog posts, release notes, and community highlights. " +
      "An active news section is one of the best signals of a healthy open-source project.",
    visuals: ["move news cards"],
  },
  {
    kind: "segment",
    narration:
      "Each card has a title, a brief summary, and a date — so you can quickly scan " +
      "what's new without leaving the home page.",
    visuals: ["move individual card"],
  },
  {
    kind: "segment",
    narration:
      "Seeing regular updates builds trust. It tells you this tool isn't abandoned — " +
      "there's a real team behind it, shipping features and fixing bugs consistently.",
    visuals: ["wheel down"],
  },

  // ── Chapter 6: Designed for Control & Creativity (segments 23–28) ──
  {
    kind: "segment",
    narration:
      "Here's the heart of the product pitch — Designed for Control and Creativity. " +
      "This section breaks down exactly why ComfyUI's approach is different.",
    visuals: ["wheel down"],
  },
  {
    kind: "segment",
    narration:
      "First up: Full Control with Nodes. The node-based interface lets you wire together " +
      "every step of your generation pipeline. Nothing is hidden behind a magic button.",
    visuals: ["move feature area"],
  },
  {
    kind: "segment",
    narration:
      "This is what separates ComfyUI from tools like Midjourney or Stable Diffusion WebUI. " +
      "You see exactly what's happening at every stage, and you can change any of it.",
    visuals: ["move feature details"],
  },
  {
    kind: "segment",
    narration:
      "Next: Reusable Workflows. Once you build a workflow that works, you can save it, " +
      "share it, and remix it. No more rebuilding the same setup from scratch every time.",
    visuals: ["wheel down slightly"],
  },
  {
    kind: "segment",
    narration:
      "Reusable workflows are what make ComfyUI practical for professionals. " +
      "You invest time once, then reuse that investment across hundreds of generations.",
    visuals: ["move workflow area"],
  },
  {
    kind: "segment",
    narration:
      "And finally: Live Preview. You can see results updating in real time as you " +
      "adjust parameters. That immediate feedback loop makes experimentation fast and intuitive.",
    visuals: ["wheel down"],
  },

  // ── Chapter 7: Open Source and Yours to Shape (segments 29–32) ──
  {
    kind: "segment",
    narration:
      "Now we're reaching the Open Source and Yours to Shape section. " +
      "This is where ComfyUI's philosophy really shines through.",
    visuals: ["wheel down"],
  },
  {
    kind: "segment",
    narration:
      "Open source means the code is public on GitHub — anyone can read it, audit it, " +
      "fork it, or contribute to it. There are no secrets, no hidden algorithms.",
    visuals: ["move open source text"],
  },
  {
    kind: "segment",
    narration:
      "Yours to Shape means you're not just a user — you're a potential contributor. " +
      "File an issue, submit a pull request, or build a custom node. The power is yours.",
    visuals: ["move section details"],
  },
  {
    kind: "segment",
    narration:
      "In an industry where most AI tools are closed-source SaaS products, " +
      "ComfyUI's commitment to openness is genuinely refreshing and important.",
    visuals: ["wheel down"],
  },

  // ── Chapter 8: Trusted by teams (segments 33–35) ──
  {
    kind: "segment",
    narration:
      "Here's some powerful social proof — Trusted by teams at, followed by logos and names " +
      "of professional organizations using ComfyUI in production.",
    visuals: ["wheel down"],
  },
  {
    kind: "segment",
    narration:
      "When you see real companies trusting an open-source tool for their production pipelines, " +
      "that tells you the software is battle-tested and reliable.",
    visuals: ["move logos area"],
  },
  {
    kind: "segment",
    narration:
      "This isn't just a hobbyist tool anymore — it's being used by studios, agencies, " +
      "and research labs around the world. That's a strong endorsement.",
    visuals: ["wheel down"],
  },

  // ── Chapter 9: Created with ComfyUI gallery (segments 36–40) ──
  {
    kind: "segment",
    narration:
      "And now my favorite section — Created with ComfyUI. This is the community gallery, " +
      "showcasing what real people are building with this tool.",
    visuals: ["wheel down"],
  },
  {
    kind: "segment",
    narration:
      "The gallery features images, videos, and 3D renders — all generated using ComfyUI workflows. " +
      "The quality here is genuinely impressive.",
    visuals: ["move gallery items"],
  },
  {
    kind: "segment",
    narration:
      "What strikes me is the diversity of styles. Photorealistic portraits, abstract art, " +
      "architectural visualizations, character designs — ComfyUI handles them all.",
    visuals: ["move more gallery"],
  },
  {
    kind: "segment",
    narration:
      "Each piece in this gallery started as a node graph. That's the magic of ComfyUI — " +
      "visual programming that produces visual art.",
    visuals: ["wheel down"],
  },
  {
    kind: "segment",
    narration:
      "Scrolling further through the gallery, you can see even more community creations. " +
      "This section alone could convince someone to download ComfyUI and start experimenting.",
    visuals: ["wheel down"],
  },

  // ── Chapter 10: Navigation deep-dive (segments 41–46) ──
  {
    kind: "segment",
    narration:
      "Let me scroll back up to the navigation bar — I want to walk through each link " +
      "so you understand the full ecosystem.",
    visuals: ["wheel up to top"],
  },
  {
    kind: "segment",
    narration:
      "Products is the dropdown for the ComfyUI product family. " +
      "It's where you explore the full range of tools the team has built.",
    visuals: ["move to Products link"],
  },
  {
    kind: "segment",
    narration:
      "The Download link gives you quick access to grab ComfyUI for your platform. " +
      "One click from anywhere on the site.",
    visuals: ["move to Download link"],
  },
  {
    kind: "segment",
    narration:
      "Community — with a shiny NEW badge — is the community hub. " +
      "It's where users connect, share work, and stay in the loop on what's happening.",
    visuals: ["move to Community link"],
  },
  {
    kind: "segment",
    narration:
      "Resources is your gateway to documentation, tutorials, and guides. " +
      "Everything you need to learn ComfyUI from beginner to expert.",
    visuals: ["move to Resources link"],
  },
  {
    kind: "segment",
    narration:
      "About and Pricing round out the informational links. About tells the company story, " +
      "while Pricing lays out the plans so you know exactly what you're getting.",
    visuals: ["move to right nav"],
  },

  // ── Chapter 11: Footer & social links (segments 47–52) ──
  {
    kind: "segment",
    narration:
      "Now let me scroll all the way to the bottom of the page to show you the footer. " +
      "There's a lot of useful information organized down here.",
    visuals: ["wheel to bottom"],
  },
  {
    kind: "segment",
    narration:
      "The footer is divided into sections — Product, Resources, Company, and Contact. " +
      "Each one groups related links so you can find exactly what you need.",
    visuals: ["move footer sections"],
  },
  {
    kind: "segment",
    narration:
      "Under Product, you'll find links to the core offerings — the editor, cloud, " +
      "and hub. Under Resources, documentation and learning materials.",
    visuals: ["move Product section"],
  },
  {
    kind: "segment",
    narration:
      "The social links are all here too — Discord, X, Reddit, GitHub, LinkedIn, and Instagram. " +
      "ComfyUI has a presence everywhere the AI community gathers.",
    visuals: ["move social links"],
  },
  {
    kind: "segment",
    narration:
      "Having this many social channels tells you the community is genuinely active. " +
      "Whether you prefer Reddit threads or Discord voice chats, there's a place for you.",
    visuals: ["move more social"],
  },
  {
    kind: "segment",
    narration:
      "And there's the JOIN OUR TEAM section — ComfyUI is hiring. " +
      "That's another strong signal that this project has serious momentum and resources behind it.",
    visuals: ["move careers section"],
  },

  // ── Chapter 12: Wrapping up (segments 53–55) ──
  {
    kind: "segment",
    narration:
      "Let me scroll back to the top for a final look at everything we've covered on this page.",
    visuals: ["wheel to top"],
  },
  {
    kind: "segment",
    narration:
      "We explored the hero, the download options, Comfy Cloud, news updates, the feature " +
      "breakdown with nodes, workflows, and live preview, plus the open-source philosophy.",
    visuals: ["move hero"],
  },
  {
    kind: "segment",
    narration:
      "We saw social proof from professional teams, a stunning community gallery, " +
      "and a footer packed with social links and career opportunities. " +
      "Head to comfy.org and start creating — the most powerful AI tool is waiting for you.",
    visuals: ["move center"],
  },

  // ── Outro ──
  {
    kind: "outro",
    text: "Comfy.org",
    subtitle: "www.comfy.org",
    durationMs: 2000,
  },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
//  PLAYWRIGHT IMPLEMENTATION (consumes VIDEO_SCRIPT above)
// ─────────────────────────────────────────────────────────────────────────────
import { test } from "./fixtures/fixture";
import { createVideoScript } from "../lib/demowright/dist/index.mjs";

// Note: www.comfy.org is a Nuxt SSR site whose page.evaluate calls hang
// after a few seconds. This spec uses ONLY mouse.wheel / mouse.move (which
// don't call page.evaluate) to avoid hangs. No safeMove, no page.click.
test("comfy.org website tour", async ({ page }) => {
  test.setTimeout(10 * 60_000);

  // Block ALL scripts so the Nuxt SSR page renders as static HTML —
  // mouse moves and scrolls then work reliably without hydration hangs.
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

  // Pre-navigate (heavy work BEFORE script.render — see hard rules)
  await page.goto("https://www.comfy.org/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2500);

  const script = createVideoScript()
    // ── Title ──
    .title(VIDEO_SCRIPT[0].text, {
      subtitle: VIDEO_SCRIPT[0].subtitle,
      durationMs: VIDEO_SCRIPT[0].durationMs,
    })

    // ── Chapter 1: First impressions & hero ──
    .segment(VIDEO_SCRIPT[1].narration, async (pace) => {
      await page.mouse.move(640, 360);
      await pace();
    })
    .segment(VIDEO_SCRIPT[2].narration, async (pace) => {
      await page.mouse.move(640, 280);
      await pace();
      await page.mouse.move(640, 350);
      await pace();
    })
    .segment(VIDEO_SCRIPT[3].narration, async (pace) => {
      await page.mouse.move(120, 40);
      await pace();
      await page.mouse.move(160, 40);
      await pace();
    })
    .segment(VIDEO_SCRIPT[4].narration, async (pace) => {
      await page.mouse.move(300, 40);
      await pace();
      await page.mouse.move(600, 40);
      await pace();
      await page.mouse.move(900, 40);
      await pace();
    })
    .segment(VIDEO_SCRIPT[5].narration, async (pace) => {
      await page.mouse.move(1000, 40);
      await pace();
      await page.mouse.move(1150, 40);
      await pace();
    })
    .segment(VIDEO_SCRIPT[6].narration, async (pace) => {
      await page.mouse.move(640, 450);
      await pace();
      await page.mouse.move(640, 480);
      await pace();
    })

    // ── Chapter 2: The power statement ──
    .segment(VIDEO_SCRIPT[7].narration, async (pace) => {
      await page.mouse.wheel(0, 400);
      await pace();
      await page.mouse.move(640, 300);
      await pace();
    })
    .segment(VIDEO_SCRIPT[8].narration, async (pace) => {
      await page.mouse.move(400, 350);
      await pace();
      await page.mouse.move(880, 350);
      await pace();
    })
    .segment(VIDEO_SCRIPT[9].narration, async (pace) => {
      await page.mouse.move(640, 400);
      await pace();
      await page.mouse.move(640, 450);
      await pace();
    })
    .segment(VIDEO_SCRIPT[10].narration, async (pace) => {
      await page.mouse.wheel(0, 300);
      await pace();
      await page.mouse.move(640, 350);
      await pace();
    })

    // ── Chapter 3: Download ComfyUI ──
    .segment(VIDEO_SCRIPT[11].narration, async (pace) => {
      await page.mouse.wheel(0, 400);
      await pace();
      await page.mouse.move(640, 300);
      await pace();
    })
    .segment(VIDEO_SCRIPT[12].narration, async (pace) => {
      await page.mouse.move(400, 400);
      await pace();
      await page.mouse.move(640, 400);
      await pace();
      await page.mouse.move(880, 400);
      await pace();
    })
    .segment(VIDEO_SCRIPT[13].narration, async (pace) => {
      await page.mouse.move(640, 380);
      await pace();
      await page.mouse.move(640, 420);
      await pace();
    })
    .segment(VIDEO_SCRIPT[14].narration, async (pace) => {
      await page.mouse.wheel(0, 250);
      await pace();
      await page.mouse.move(640, 350);
      await pace();
    })

    // ── Chapter 4: Comfy Cloud ──
    .segment(VIDEO_SCRIPT[15].narration, async (pace) => {
      await page.mouse.wheel(0, 400);
      await pace();
      await page.mouse.move(640, 300);
      await pace();
    })
    .segment(VIDEO_SCRIPT[16].narration, async (pace) => {
      await page.mouse.move(640, 350);
      await pace();
      await page.mouse.move(640, 400);
      await pace();
    })
    .segment(VIDEO_SCRIPT[17].narration, async (pace) => {
      await page.mouse.move(500, 380);
      await pace();
      await page.mouse.move(780, 380);
      await pace();
    })
    .segment(VIDEO_SCRIPT[18].narration, async (pace) => {
      await page.mouse.wheel(0, 350);
      await pace();
      await page.mouse.move(640, 350);
      await pace();
    })

    // ── Chapter 5: Latest News & Updates ──
    .segment(VIDEO_SCRIPT[19].narration, async (pace) => {
      await page.mouse.wheel(0, 400);
      await pace();
      await page.mouse.move(640, 280);
      await pace();
    })
    .segment(VIDEO_SCRIPT[20].narration, async (pace) => {
      await page.mouse.move(300, 400);
      await pace();
      await page.mouse.move(640, 400);
      await pace();
      await page.mouse.move(960, 400);
      await pace();
    })
    .segment(VIDEO_SCRIPT[21].narration, async (pace) => {
      await page.mouse.move(400, 420);
      await pace();
      await page.mouse.move(400, 450);
      await pace();
    })
    .segment(VIDEO_SCRIPT[22].narration, async (pace) => {
      await page.mouse.wheel(0, 350);
      await pace();
      await page.mouse.move(640, 350);
      await pace();
    })

    // ── Chapter 6: Designed for Control & Creativity ──
    .segment(VIDEO_SCRIPT[23].narration, async (pace) => {
      await page.mouse.wheel(0, 400);
      await pace();
      await page.mouse.move(640, 280);
      await pace();
    })
    .segment(VIDEO_SCRIPT[24].narration, async (pace) => {
      await page.mouse.move(640, 350);
      await pace();
      await page.mouse.move(640, 400);
      await pace();
    })
    .segment(VIDEO_SCRIPT[25].narration, async (pace) => {
      await page.mouse.move(500, 380);
      await pace();
      await page.mouse.move(780, 380);
      await pace();
    })
    .segment(VIDEO_SCRIPT[26].narration, async (pace) => {
      await page.mouse.wheel(0, 300);
      await pace();
      await page.mouse.move(640, 350);
      await pace();
    })
    .segment(VIDEO_SCRIPT[27].narration, async (pace) => {
      await page.mouse.move(500, 380);
      await pace();
      await page.mouse.move(780, 400);
      await pace();
    })
    .segment(VIDEO_SCRIPT[28].narration, async (pace) => {
      await page.mouse.wheel(0, 350);
      await pace();
      await page.mouse.move(640, 350);
      await pace();
    })

    // ── Chapter 7: Open Source and Yours to Shape ──
    .segment(VIDEO_SCRIPT[29].narration, async (pace) => {
      await page.mouse.wheel(0, 400);
      await pace();
      await page.mouse.move(640, 300);
      await pace();
    })
    .segment(VIDEO_SCRIPT[30].narration, async (pace) => {
      await page.mouse.move(640, 350);
      await pace();
      await page.mouse.move(640, 400);
      await pace();
    })
    .segment(VIDEO_SCRIPT[31].narration, async (pace) => {
      await page.mouse.move(500, 380);
      await pace();
      await page.mouse.move(780, 400);
      await pace();
    })
    .segment(VIDEO_SCRIPT[32].narration, async (pace) => {
      await page.mouse.wheel(0, 300);
      await pace();
      await page.mouse.move(640, 350);
      await pace();
    })

    // ── Chapter 8: Trusted by teams ──
    .segment(VIDEO_SCRIPT[33].narration, async (pace) => {
      await page.mouse.wheel(0, 350);
      await pace();
      await page.mouse.move(640, 300);
      await pace();
    })
    .segment(VIDEO_SCRIPT[34].narration, async (pace) => {
      await page.mouse.move(300, 380);
      await pace();
      await page.mouse.move(640, 380);
      await pace();
      await page.mouse.move(960, 380);
      await pace();
    })
    .segment(VIDEO_SCRIPT[35].narration, async (pace) => {
      await page.mouse.wheel(0, 300);
      await pace();
      await page.mouse.move(640, 350);
      await pace();
    })

    // ── Chapter 9: Created with ComfyUI gallery ──
    .segment(VIDEO_SCRIPT[36].narration, async (pace) => {
      await page.mouse.wheel(0, 400);
      await pace();
      await page.mouse.move(640, 300);
      await pace();
    })
    .segment(VIDEO_SCRIPT[37].narration, async (pace) => {
      await page.mouse.move(300, 350);
      await pace();
      await page.mouse.move(640, 350);
      await pace();
      await page.mouse.move(960, 350);
      await pace();
    })
    .segment(VIDEO_SCRIPT[38].narration, async (pace) => {
      await page.mouse.move(400, 400);
      await pace();
      await page.mouse.move(880, 400);
      await pace();
    })
    .segment(VIDEO_SCRIPT[39].narration, async (pace) => {
      await page.mouse.wheel(0, 300);
      await pace();
      await page.mouse.move(640, 380);
      await pace();
    })
    .segment(VIDEO_SCRIPT[40].narration, async (pace) => {
      await page.mouse.wheel(0, 350);
      await pace();
      await page.mouse.move(640, 380);
      await pace();
    })

    // ── Chapter 10: Navigation deep-dive ──
    .segment(VIDEO_SCRIPT[41].narration, async (pace) => {
      await page.mouse.wheel(0, -5500);
      await pace();
      await page.mouse.move(640, 40);
      await pace();
    })
    .segment(VIDEO_SCRIPT[42].narration, async (pace) => {
      await page.mouse.move(200, 40);
      await pace();
      await page.mouse.move(220, 40);
      await pace();
    })
    .segment(VIDEO_SCRIPT[43].narration, async (pace) => {
      await page.mouse.move(350, 40);
      await pace();
      await page.mouse.move(370, 40);
      await pace();
    })
    .segment(VIDEO_SCRIPT[44].narration, async (pace) => {
      await page.mouse.move(550, 40);
      await pace();
      await page.mouse.move(570, 40);
      await pace();
    })
    .segment(VIDEO_SCRIPT[45].narration, async (pace) => {
      await page.mouse.move(700, 40);
      await pace();
      await page.mouse.move(720, 40);
      await pace();
    })
    .segment(VIDEO_SCRIPT[46].narration, async (pace) => {
      await page.mouse.move(850, 40);
      await pace();
      await page.mouse.move(1000, 40);
      await pace();
    })

    // ── Chapter 11: Footer & social links ──
    .segment(VIDEO_SCRIPT[47].narration, async (pace) => {
      await page.mouse.wheel(0, 5500);
      await pace();
      await page.mouse.move(640, 500);
      await pace();
    })
    .segment(VIDEO_SCRIPT[48].narration, async (pace) => {
      await page.mouse.move(300, 550);
      await pace();
      await page.mouse.move(640, 550);
      await pace();
      await page.mouse.move(960, 550);
      await pace();
    })
    .segment(VIDEO_SCRIPT[49].narration, async (pace) => {
      await page.mouse.move(300, 580);
      await pace();
      await page.mouse.move(300, 620);
      await pace();
    })
    .segment(VIDEO_SCRIPT[50].narration, async (pace) => {
      await page.mouse.move(640, 650);
      await pace();
      await page.mouse.move(700, 650);
      await pace();
      await page.mouse.move(760, 650);
      await pace();
    })
    .segment(VIDEO_SCRIPT[51].narration, async (pace) => {
      await page.mouse.move(820, 650);
      await pace();
      await page.mouse.move(880, 650);
      await pace();
    })
    .segment(VIDEO_SCRIPT[52].narration, async (pace) => {
      await page.mouse.move(960, 580);
      await pace();
      await page.mouse.move(960, 620);
      await pace();
    })

    // ── Chapter 12: Wrapping up ──
    .segment(VIDEO_SCRIPT[53].narration, async (pace) => {
      await page.mouse.wheel(0, -5500);
      await pace();
    })
    .segment(VIDEO_SCRIPT[54].narration, async (pace) => {
      await page.mouse.move(640, 300);
      await pace();
      await page.mouse.move(640, 350);
      await pace();
    })
    .segment(VIDEO_SCRIPT[55].narration, async (pace) => {
      await page.mouse.move(640, 360);
      await pace();
      await page.mouse.move(640, 380);
      await pace();
    })

    // ── Outro ──
    .outro({
      text: VIDEO_SCRIPT[56].text,
      subtitle: VIDEO_SCRIPT[56].subtitle,
      durationMs: VIDEO_SCRIPT[56].durationMs,
    });

  await script.prepare(page);
  await script.render(page, { baseName: "comfy-website", outputDir: ".comfy-qa/.demos" });
});
