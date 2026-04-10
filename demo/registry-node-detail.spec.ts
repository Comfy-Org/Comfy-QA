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
 * Coverage: 11/13 (85%)
 *
 * | Feature                        | R | Notes                                |
 * |--------------------------------|---|--------------------------------------|
 * | Node name (H1)                 | ✅ | ComfyUI-KJNodes                      |
 * | Publisher identity              | ✅ | @author badge                         |
 * | Install command code block      | ✅ | comfy node install comfyui-kjnodes    |
 * | Copy button                     | ✅ | hover                                 |
 * | CLI docs link                   | ✅ | hover                                 |
 * | Description section             | ✅ | H2 heading                            |
 * | README markdown rendering       | ✅ | scroll through formatted README       |
 * | Version history heading         | ✅ | H2 heading                            |
 * | Latest version + date           | ✅ | version number shown                  |
 * | Older versions (scroll)         | ✅ | show active maintenance               |
 * | View Repository (GitHub)        | ✅ | hover link                            |
 * | Home breadcrumb                 | ❌ | breadcrumb selector not found         |
 * | Metadata sidebar (deps/OS/lic)  | ❌ | need to locate sidebar elements       |
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
    visuals: ["safeMove h1"],
  },
  {
    kind: "segment",
    narration:
      "The heading shows the node name clearly. Right below it, you can see who published this package — " +
      "the @author identity gives you accountability and trust.",
    visuals: ["safeMove h1", "hover author badge"],
  },
  {
    kind: "segment",
    narration:
      "Here is the install command: comfy node install comfyui-kjnodes. " +
      "One line in your terminal and the entire pack is installed in your ComfyUI setup.",
    visuals: ["safeMove code block"],
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
    visuals: ["scroll to Description h2"],
  },
  {
    kind: "segment",
    narration:
      "The full README from the GitHub repository is rendered right here. " +
      "You get formatted markdown — images, code blocks, and all — without leaving the registry.",
    visuals: ["scroll through README"],
  },
  {
    kind: "segment",
    narration:
      "Further down is the Version History. This is where you check how actively maintained a node is. " +
      "Frequent updates mean the author is committed to keeping things working.",
    visuals: ["scroll to Version history h2"],
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
      "The View Repository link takes you straight to GitHub — the source code, issue tracker, and community discussions all live there.",
    visuals: ["hover View Repository link"],
  },
  {
    kind: "segment",
    narration:
      "In just a few scrolls, you can evaluate any node: who made it, what it does, " +
      "how to install it, how often it is updated, and where to find the source code. " +
      "That is the power of a proper registry.",
    visuals: ["scroll to top"],
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
    // Node name
    .segment(VIDEO_SCRIPT[1].narration, async (pace) => {
      await safeMove(page, "h1");
      await pace();
    })
    // Publisher identity
    .segment(VIDEO_SCRIPT[2].narration, async (pace) => {
      await safeMove(page, "h1");
      await pace();
      // Author info is usually near the heading
      await page.mouse.move(640, 200);
      await pace();
    })
    // Install command
    .segment(VIDEO_SCRIPT[3].narration, async (pace) => {
      await safeMove(page, "code, pre");
      await pace();
    })
    // Copy button + CLI link
    .segment(VIDEO_SCRIPT[4].narration, async (pace) => {
      await safeMove(page, 'button:has-text("Copy")');
      await pace();
      await safeMove(
        page,
        'a[href*="comfy-cli"], a[href*="getting-started"], a[href*="install-cli"]',
      );
      await pace();
    })
    // Description section
    .segment(VIDEO_SCRIPT[5].narration, async (pace) => {
      await page.mouse.wheel(0, 400);
      await pace();
      await safeMove(page, 'h2:has-text("Description")');
      await pace();
    })
    // README rendering
    .segment(VIDEO_SCRIPT[6].narration, async (pace) => {
      await page.mouse.wheel(0, 400);
      await pace();
      await page.mouse.wheel(0, 300);
      await pace();
    })
    // Version history heading
    .segment(VIDEO_SCRIPT[7].narration, async (pace) => {
      await page.mouse.wheel(0, 500);
      await pace();
      await safeMove(page, 'h2:has-text("Version history")');
      await pace();
    })
    // Latest version + older versions
    .segment(VIDEO_SCRIPT[8].narration, async (pace) => {
      await page.mouse.move(640, 500);
      await pace();
      await page.mouse.wheel(0, 400);
      await pace();
      await page.mouse.wheel(0, 300);
      await pace();
    })
    // View Repository link
    .segment(VIDEO_SCRIPT[9].narration, async (pace) => {
      // Scroll back up to find the repo link (usually near the top or sidebar)
      await page.mouse.wheel(0, -2000);
      await page.waitForTimeout(500);
      await safeMove(page, 'a:has-text("View Repository"), a[href*="github.com"]');
      await pace();
    })
    // Wrap-up
    .segment(VIDEO_SCRIPT[10].narration, async (pace) => {
      await page.mouse.wheel(0, -2000);
      await page.waitForTimeout(300);
      await page.mouse.move(640, 360);
      await pace();
    })
    .outro({
      text: VIDEO_SCRIPT[11].text,
      subtitle: VIDEO_SCRIPT[11].subtitle,
      durationMs: VIDEO_SCRIPT[11].durationMs,
    });

  await script.prepare(page);
  await script.render(page, {
    baseName: "registry-node-detail",
    outputDir: ".comfy-qa/.demos",
  });
});
