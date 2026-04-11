import { test, safeMove } from "./fixtures/fixture";
import { createVideoScript } from "../lib/demowright/dist/index.mjs";

/**
 * VIDEO SCRIPT — every word in `narration` is read aloud verbatim by Gemini TTS.
 *
 * Coverage: 8/9 (89%)
 *
 * | Feature                              | R | Notes                              |
 * |--------------------------------------|---|------------------------------------|
 * | Page heading                         | ✅ | "ComfyUI Workflow Editor in your browser" |
 * | Supported formats (PNG/WebP/FLAC/MP4)| ✅ | hover format text area              |
 * | Way 1: Paste/Drop zone               | ✅ | hover + explain                     |
 * | Way 2: Upload Files button           | ✅ | hover + explain                     |
 * | Way 3: Mount a Folder button         | ✅ | hover + explain                     |
 * | Way 4: URL input + Load URL button   | ✅ | hover both elements                 |
 * | Editable Workflows section           | ✅ | scroll down to show placeholder     |
 * | Save workflow (download) button      | ✅ | hover + explain                     |
 * | Fork me on GitHub link               | ✅ | hover link                          |
 * | Actual file loading + JSON editing   | ❌ | requires external ComfyUI image     |
 */
const VIDEO_SCRIPT = [
  {
    kind: "title",
    text: "Embedded Workflow Editor",
    subtitle: "In-browser EXIF editor for ComfyUI images",
    durationMs: 2000,
  },
  {
    kind: "segment",
    narration:
      "This is the ComfyUI Embedded Workflow Editor — a browser-based tool for reading and editing the workflow metadata hidden inside ComfyUI output files.",
    visuals: ["safeMove heading", "mouse.move across page top"],
  },
  {
    kind: "segment",
    narration:
      "It supports PNG, WebP, FLAC, and MP4 files. Any file that ComfyUI generates with embedded workflow data can be opened here.",
    visuals: ["hover format text area", "sweep across format list"],
  },
  {
    kind: "segment",
    narration:
      "There are four ways to import files. Way one is the paste and drop zone at the top — drag a file from your desktop or paste from clipboard.",
    visuals: ["safeMove paste/drop input", "hover drop zone borders"],
  },
  {
    kind: "segment",
    narration:
      "Way two is the Upload Files button, which opens a standard file picker. Way three is Mount a Folder — this uses the File System Access API to connect directly to a local directory, like your ComfyUI output folder.",
    visuals: ["hover Upload Files", "hover Mount a Folder"],
  },
  {
    kind: "segment",
    narration:
      "Way four is paste a URL. If your ComfyUI image is hosted online, paste the link here and click Load URL to fetch it.",
    visuals: ["hover URL input", "hover Load URL button"],
  },
  {
    kind: "segment",
    narration:
      "Below the import options is the Editable Workflows section. Once you load an image with embedded workflow data, the JSON workflow appears here and you can modify prompts, seeds, and generation settings directly.",
    visuals: ["scroll to Editable Workflows", "hover textarea area"],
  },
  {
    kind: "segment",
    narration:
      "After making changes, the Save Workflow button lets you download the modified file with your edited workflow re-embedded. Everything runs locally in your browser — no server uploads required.",
    visuals: ["hover Save workflow button", "hover nearby text"],
  },
  {
    kind: "segment",
    narration:
      "The project is open source. The Fork me on GitHub link in the corner takes you to the source repository where you can contribute or report issues.",
    visuals: ["hover GitHub link", "hover page corner"],
  },
  {
    kind: "segment",
    narration:
      "A simple but essential tool for anyone who works with ComfyUI — inspect, edit, and re-export workflow metadata without ever leaving your browser.",
    visuals: ["scroll to top via mouse.wheel", "hover heading", "hover drop zone"],
  },
  {
    kind: "outro",
    text: "Embedded Workflow Editor",
    subtitle: "comfyui-embedded-workflow-editor.vercel.app",
    durationMs: 2000,
  },
] as const;

test("embedded workflow editor tour", async ({ page }) => {
  test.setTimeout(5 * 60_000);

  await page.goto("https://comfyui-embedded-workflow-editor.vercel.app", {
    waitUntil: "domcontentloaded",
  });
  await page.waitForTimeout(2000);

  const script = createVideoScript()
    .title(VIDEO_SCRIPT[0].text, {
      subtitle: VIDEO_SCRIPT[0].subtitle,
      durationMs: VIDEO_SCRIPT[0].durationMs,
    })
    // Seg 1: Page heading — safeMove + sweep across page top
    .segment(VIDEO_SCRIPT[1].narration, async (pace) => {
      await safeMove(page, "h1, h2, h3, [class*='title']");
      await pace();
      await page.mouse.move(400, 150);
      await pace();
      await page.mouse.move(880, 150);
      await pace();
    })
    // Seg 2: Supported formats — hover format text + sweep
    .segment(VIDEO_SCRIPT[2].narration, async (pace) => {
      await safeMove(page, "main, [class*='card'], [class*='container']");
      await pace();
      // Sweep across the format text area (PNG/WebP/FLAC/MP4)
      await page.mouse.move(400, 200);
      await pace();
      await page.mouse.move(640, 220);
      await pace();
      await page.mouse.move(880, 200);
      await pace();
    })
    // Seg 3: Way 1: Paste/Drop zone — safeMove + hover borders
    .segment(VIDEO_SCRIPT[3].narration, async (pace) => {
      await safeMove(
        page,
        "input[placeholder*='Paste'], input[placeholder*='Drop']",
      );
      await pace();
      // Hover around the drop zone borders for visual movement
      await page.mouse.move(400, 280);
      await pace();
      await page.mouse.move(880, 280);
      await pace();
    })
    // Seg 4: Way 2: Upload Files + Way 3: Mount a Folder
    .segment(VIDEO_SCRIPT[4].narration, async (pace) => {
      await safeMove(page, 'button:has-text("Upload Files")');
      await pace();
      await safeMove(page, 'button:has-text("Mount a Folder")');
      await pace();
    })
    // Seg 5: Way 4: URL input + Load URL
    .segment(VIDEO_SCRIPT[5].narration, async (pace) => {
      await safeMove(page, "input[placeholder*='URL']");
      await pace();
      await safeMove(page, 'button:has-text("Load URL")');
      await pace();
    })
    // Seg 6: Editable Workflows section — scroll + hover textarea
    .segment(VIDEO_SCRIPT[6].narration, async (pace) => {
      await page.mouse.wheel(0, 300);
      await page.mouse.move(400, 380);
      await pace();
      await safeMove(
        page,
        "[class*='workflow'], [class*='editable'], h3, h4, textarea",
      );
      await pace();
      await page.mouse.move(640, 450);
      await pace();
    })
    // Seg 7: Save workflow button — hover button + sweep nearby
    .segment(VIDEO_SCRIPT[7].narration, async (pace) => {
      await safeMove(page, "#save-workflow, button:has-text('Save workflow')");
      await pace();
      // Hover nearby context text
      await page.mouse.move(640, 500);
      await pace();
      await page.mouse.move(400, 480);
      await pace();
    })
    // Seg 8: GitHub link — hover link + hover corner
    .segment(VIDEO_SCRIPT[8].narration, async (pace) => {
      await safeMove(page, 'a[href*="github"]');
      await pace();
      // Hover toward top-right corner where GitHub ribbon typically sits
      await page.mouse.move(1200, 30);
      await pace();
      await page.mouse.move(1100, 80);
      await pace();
    })
    // Seg 9: Wrap-up — scroll to top via mouse.wheel + hover heading + drop zone
    .segment(VIDEO_SCRIPT[9].narration, async (pace) => {
      await page.mouse.wheel(0, -2000);
      await page.waitForTimeout(300);
      await safeMove(page, "h1, h2, h3, [class*='title']");
      await pace();
      await safeMove(
        page,
        "input[placeholder*='Paste'], input[placeholder*='Drop']",
      );
      await pace();
      await page.mouse.move(640, 300);
      await pace();
    })
    .outro({
      text: VIDEO_SCRIPT[10].text,
      subtitle: VIDEO_SCRIPT[10].subtitle,
      durationMs: VIDEO_SCRIPT[10].durationMs,
    });

  await script.prepare(page);
  await script.render(page, {
    baseName: "embedded-workflow-editor",
    outputDir: ".comfy-qa/.demos",
  });
});
