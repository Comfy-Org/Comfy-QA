/**
 * Comfy Registry — Node Detail Page
 *
 * Story:  demo/stories/registry-node-detail.story.md
 * Output: .comfy-qa/.demos/registry-node-detail.mp4
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *  VIDEO SCRIPT (the source of truth)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Coverage: 13/13 (100%)
 *
 * | Feature                        | R | Notes                                |
 * |--------------------------------|---|--------------------------------------|
 * | Node name (H1)                 | ✅ | ComfyUI-KJNodes                      |
 * | Publisher identity              | ✅ | @kijai author badge + metadata       |
 * | Install command code block      | ✅ | comfy node install comfyui-kjnodes    |
 * | Copy button                     | ✅ | hover                                 |
 * | CLI docs link                   | ✅ | hover                                 |
 * | Description section             | ✅ | H2 heading                            |
 * | README markdown rendering       | ✅ | scroll through formatted README       |
 * | Version history heading         | ✅ | H2 heading                            |
 * | Latest version + date           | ✅ | version number shown                  |
 * | Older versions (scroll)         | ✅ | show active maintenance               |
 * | View Repository (GitHub)        | ✅ | hover link                            |
 * | Breadcrumb navigation           | ✅ | Home → All Nodes → comfyui-kjnodes   |
 * | Metadata sidebar (downloads/stars)| ✅ | hover download count + star count   |
 */
const VIDEO_SCRIPT = [
  {
    kind: "title",
    text: "Comfy Registry",
    subtitle: "Node Detail Page",
    durationMs: 2000,
  },
  {
    kind: "segment",
    narration:
      "Let me show you what happens when you click into a specific node on the Comfy Registry. " +
      "I'm looking at ComfyUI-KJNodes — one of the most popular utility packs in the ecosystem.",
    visuals: ["safeMove breadcrumb", "safeMove h1"],
  },
  {
    kind: "segment",
    narration:
      "First, notice the breadcrumb trail at the top — Home, then All Nodes, then comfyui-kjnodes. " +
      "This tells you exactly where you are in the registry hierarchy.",
    visuals: ["safeMove breadcrumb Home", "safeMove breadcrumb All Nodes", "safeMove breadcrumb kjnodes"],
  },
  {
    kind: "segment",
    narration:
      "The heading shows the node name clearly. Right below it, you can see this is published by @kijai — " +
      "the author identity gives you accountability and trust.",
    visuals: ["safeMove h1", "safeMove author link"],
  },
  {
    kind: "segment",
    narration:
      "Look at the metadata — over three million downloads and thousands of stars. " +
      "These numbers tell you this is a battle-tested, community-approved package.",
    visuals: ["safeMove downloads count", "safeMove stars count"],
  },
  {
    kind: "segment",
    narration:
      "Here is the install command: comfy node install comfyui-kjnodes. " +
      "One line in your terminal and the entire pack is installed in your ComfyUI setup.",
    visuals: ["safeMove code block", "safeMove Copy button"],
  },
  {
    kind: "segment",
    narration:
      "Notice the Copy button next to the command — one click and it is on your clipboard. " +
      "Next to that, a link to the Comfy CLI getting-started guide helps first-time users set up the tool.",
    visuals: ["hover Copy button", "hover CLI link"],
  },
  {
    kind: "segment",
    narration:
      "Scrolling down, the Description section explains what this node pack does. " +
      "KJNodes provides dozens of quality-of-life helper nodes that make complex workflows much easier to build.",
    visuals: ["scroll to Description h2", "safeMove Description h2"],
  },
  {
    kind: "segment",
    narration:
      "The full README from the GitHub repository is rendered right here. " +
      "You get formatted markdown — images, code blocks, and all — without leaving the registry.",
    visuals: ["scroll through README", "hover README images"],
  },
  {
    kind: "segment",
    narration:
      "Further down is the Version History. This is where you check how actively maintained a node is. " +
      "Frequent updates mean the author is committed to keeping things working.",
    visuals: ["scroll to Version history h2", "safeMove Version history h2"],
  },
  {
    kind: "segment",
    narration:
      "The latest version is shown at the top with its release date. " +
      "Scrolling through the list, you can see this package has dozens of releases — that is a very healthy sign.",
    visuals: ["hover latest version", "scroll older versions"],
  },
  {
    kind: "segment",
    narration:
      "The View Repository link takes you straight to GitHub — the source code, issue tracker, " +
      "and community discussions all live there.",
    visuals: ["scroll up to repo link", "hover View Repository link", "hover h1"],
  },
  {
    kind: "segment",
    narration:
      "In just a few scrolls, you can evaluate any node: who made it, what it does, " +
      "how to install it, how often it is updated, and where to find the source code. " +
      "That is the power of a proper registry.",
    visuals: ["scroll to top", "hover h1", "hover breadcrumb", "hover author"],
  },
  {
    kind: "outro",
    text: "Comfy Registry",
    subtitle: "registry.comfy.org",
    durationMs: 2000,
  },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
//  PLAYWRIGHT IMPLEMENTATION
// ─────────────────────────────────────────────────────────────────────────────
import { test, safeMove } from "./fixtures/fixture";
import { createVideoScript } from "../lib/demowright/dist/index.mjs";

test("comfy registry node detail tour", async ({ page }) => {
  test.setTimeout(5 * 60_000);

  // Pre-navigate to a popular node detail page
  await page.goto("https://registry.comfy.org/nodes/comfyui-kjnodes", {
    waitUntil: "domcontentloaded",
  });
  await page.waitForTimeout(3000);

  const script = createVideoScript()
    .title(VIDEO_SCRIPT[0].text, {
      subtitle: VIDEO_SCRIPT[0].subtitle,
      durationMs: VIDEO_SCRIPT[0].durationMs,
    })
    // 1: Node name + breadcrumb overview
    .segment(VIDEO_SCRIPT[1].narration, async (pace) => {
      await safeMove(page, 'nav[aria-label="breadcrumb"], nav ol, [class*="breadcrumb"]');
      await pace();
      await safeMove(page, "h1");
      await pace();
    })
    // 2: Breadcrumb navigation trail
    .segment(VIDEO_SCRIPT[2].narration, async (pace) => {
      // Hover each breadcrumb link: Home → All Nodes → kjnodes
      await safeMove(page, 'nav[aria-label="breadcrumb"] a:first-child, [class*="breadcrumb"] a:first-child');
      await pace();
      await safeMove(page, 'a[href*="/nodes"]:not([href*="comfyui-kjnodes"]), nav[aria-label="breadcrumb"] a:nth-child(2)');
      await pace();
      await safeMove(page, 'nav[aria-label="breadcrumb"] span:last-child, [class*="breadcrumb"] :last-child');
      await pace();
    })
    // 3: Publisher identity — @kijai author
    .segment(VIDEO_SCRIPT[3].narration, async (pace) => {
      await safeMove(page, "h1");
      await pace();
      // Author link usually shows as @kijai near the heading
      await safeMove(page, 'a[href*="kijai"], a[href*="publisher"], [class*="author"], [class*="publisher"]');
      await pace();
    })
    // 4: Metadata — downloads + stars
    .segment(VIDEO_SCRIPT[4].narration, async (pace) => {
      // Download count badge/text
      await safeMove(page, '[class*="download"], [class*="stat"]:first-of-type, text="Download"');
      await pace();
      // Stars count
      await safeMove(page, '[class*="star"], [class*="stat"]:last-of-type, text="Star"');
      await pace();
    })
    // 5: Install command + copy preview
    .segment(VIDEO_SCRIPT[5].narration, async (pace) => {
      await safeMove(page, "code, pre");
      await pace();
      await safeMove(page, 'button:has-text("Copy"), button[aria-label*="copy"], button[aria-label*="Copy"]');
      await pace();
    })
    // 6: Copy button + CLI link
    .segment(VIDEO_SCRIPT[6].narration, async (pace) => {
      await safeMove(page, 'button:has-text("Copy"), button[aria-label*="copy"], button[aria-label*="Copy"]');
      await pace();
      await safeMove(
        page,
        'a[href*="comfy-cli"], a[href*="getting-started"], a[href*="install-cli"]',
      );
      await pace();
    })
    // 7: Description section
    .segment(VIDEO_SCRIPT[7].narration, async (pace) => {
      await page.mouse.wheel(0, 400);
      await pace();
      await safeMove(page, 'h2:has-text("Description"), h2:has-text("description")');
      await pace();
    })
    // 8: README rendering — scroll + hover content
    .segment(VIDEO_SCRIPT[8].narration, async (pace) => {
      await page.mouse.wheel(0, 400);
      await pace();
      // Hover an image or heading inside the README
      await safeMove(page, '[class*="readme"] img, [class*="markdown"] img, article img');
      await pace();
      await page.mouse.wheel(0, 300);
      await pace();
    })
    // 9: Version history heading
    .segment(VIDEO_SCRIPT[9].narration, async (pace) => {
      await page.mouse.wheel(0, 500);
      await pace();
      await safeMove(page, 'h2:has-text("Version"), h2:has-text("version")');
      await pace();
    })
    // 10: Latest version + scroll older versions
    .segment(VIDEO_SCRIPT[10].narration, async (pace) => {
      // Hover the first version entry (latest)
      await safeMove(page, '[class*="version"]:first-of-type, table tr:nth-child(1), li:has-text(".")');
      await pace();
      await page.mouse.wheel(0, 400);
      await pace();
      await page.mouse.wheel(0, 300);
      await pace();
    })
    // 11: View Repository link
    .segment(VIDEO_SCRIPT[11].narration, async (pace) => {
      // Scroll back up to find the repo link
      await page.mouse.wheel(0, -2000);
      await page.waitForTimeout(500);
      await safeMove(page, 'a:has-text("View Repository"), a:has-text("Repository"), a[href*="github.com"]');
      await pace();
      // Hover back to the heading for a second visual action
      await safeMove(page, "h1");
      await pace();
    })
    // 12: Wrap-up — hover key elements as summary
    .segment(VIDEO_SCRIPT[12].narration, async (pace) => {
      await page.mouse.wheel(0, -2000);
      await page.waitForTimeout(300);
      // Hover the heading
      await safeMove(page, "h1");
      await pace();
      // Hover the breadcrumb
      await safeMove(page, 'nav[aria-label="breadcrumb"], [class*="breadcrumb"]');
      await pace();
      // Hover the author/publisher area
      await safeMove(page, 'a[href*="kijai"], a[href*="publisher"], [class*="author"]');
      await pace();
    })
    .outro({
      text: VIDEO_SCRIPT[13].text,
      subtitle: VIDEO_SCRIPT[13].subtitle,
      durationMs: VIDEO_SCRIPT[13].durationMs,
    });

  await script.prepare(page);
  await script.render(page, {
    baseName: "registry-node-detail",
    outputDir: ".comfy-qa/.demos",
  });
});
