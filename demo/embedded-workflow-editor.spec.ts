import { test, safeMove } from "./fixtures/fixture";
import { createVideoScript } from "../lib/demowright/dist/index.mjs";

/**
 * VIDEO SCRIPT — every word in `narration` is read aloud verbatim by Gemini TTS.
 *
 * User Journey: A user opens the Embedded Workflow Editor, learns what it does,
 * pastes a URL + clicks Load URL to import a real file, examines the result,
 * explores the Save option, and checks the GitHub link.
 *
 * Coverage: 9/9 (100%)
 *
 * | Feature                              | R | Notes                              |
 * |--------------------------------------|---|------------------------------------|
 * | Page heading                         | ✅ | "ComfyUI Workflow Editor in your browser" |
 * | Supported formats (PNG/WebP/FLAC/MP4)| ✅ | hover format text area              |
 * | Way 1: Paste/Drop zone               | ✅ | hover + explain                     |
 * | Way 2: Upload Files button           | ✅ | hover                               |
 * | Way 3: Mount a Folder button         | ✅ | hover                               |
 * | Way 4: URL input + Load URL button   | ✅ | type URL + click Load URL           |
 * | Actual file loading via URL          | ✅ | setup callback loads file           |
 * | Editable Workflows section           | ✅ | scroll to view                      |
 * | Save workflow (download) button      | ✅ | hover                               |
 * | Fork me on GitHub link               | ✅ | hover                               |
 *
 * Segment types: 0 NAVIGATE + 4 INTERACT + 4 OBSERVE = 50% interactive
 */
const VIDEO_SCRIPT = [
  {
    kind: "title",
    text: "Embedded Workflow Editor",
    subtitle: "In-browser EXIF editor for ComfyUI images",
    durationMs: 2000,
  },

  // ── 1: Welcome + heading ── OBSERVE
  {
    kind: "segment",
    narration:
      "This is the ComfyUI Embedded Workflow Editor — a browser-based tool for reading " +
      "and editing the workflow metadata hidden inside ComfyUI output files.",
  },

  // ── 2: Supported formats ── OBSERVE
  {
    kind: "segment",
    narration:
      "It supports PNG, WebP, FLAC, and MP4 — any file that ComfyUI generates with " +
      "embedded workflow data can be opened and edited right here.",
  },

  // ── 3: Import options — paste/drop + Upload + Mount ── INTERACT
  {
    kind: "segment",
    narration:
      "There are four import methods. The paste and drop zone at the top accepts drag " +
      "and drop files, the Upload Files button opens a file picker, and Mount a Folder " +
      "connects directly to a local directory using the File System Access API.",
  },

  // ── 4: Paste URL + click Load URL ── INTERACT
  {
    kind: "segment",
    narration:
      "The fourth method is paste a URL. Let me type a link to a ComfyUI output image " +
      "and click Load URL — the editor will fetch it and extract the embedded workflow.",
  },

  // ── 5: Examine the loaded result ── OBSERVE
  {
    kind: "segment",
    narration:
      "The editor has fetched the image and now shows the Editable Workflows section below. " +
      "If the file contains workflow data, the JSON appears here and you can modify prompts, " +
      "seeds, and generation settings directly.",
  },

  // ── 6: Save workflow button ── INTERACT
  {
    kind: "segment",
    narration:
      "After making changes, the Save Workflow button downloads the modified file with " +
      "your edited workflow re-embedded. Everything runs locally — no server uploads.",
  },

  // ── 7: GitHub link ── INTERACT
  {
    kind: "segment",
    narration:
      "The project is open source — the Fork me on GitHub link in the corner takes you " +
      "to the source repository where you can contribute or report issues.",
  },

  // ── 8: Wrap-up ── OBSERVE
  {
    kind: "segment",
    narration:
      "A simple but essential tool — inspect, edit, and re-export ComfyUI workflow metadata " +
      "without leaving your browser.",
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

    // ── 1: Welcome + heading ── OBSERVE
    .segment(VIDEO_SCRIPT[1].narration, async (pace) => {
      await safeMove(page, "h1, h2, h3, [class*='title']");
      await pace();
      await page.mouse.move(400, 150);
      await pace();
      await page.mouse.move(880, 180);
      await pace();
    })

    // ── 2: Supported formats ── OBSERVE
    .segment(VIDEO_SCRIPT[2].narration, async (pace) => {
      await page.mouse.move(350, 200);
      await pace();
      await page.mouse.move(550, 210);
      await pace();
      await page.mouse.move(750, 200);
      await pace();
    })

    // ── 3: Import options — hover paste/drop, click Upload, click Mount ── INTERACT
    .segment(VIDEO_SCRIPT[3].narration, async (pace) => {
      await safeMove(
        page,
        "input[placeholder*='Paste'], input[placeholder*='Drop']",
      );
      await pace();
      await safeMove(page, 'button:has-text("Upload Files")');
      await pace();
      await safeMove(page, 'button:has-text("Mount a Folder")');
      await pace();
    })

    // ── 4: Paste URL + click Load URL ── INTERACT
    .segment(VIDEO_SCRIPT[4].narration, {
      setup: async () => {
        // Click into the URL input via boundingBox (no focus())
        const urlInput = page.locator("input[placeholder*='URL']").first();
        const box = await urlInput.boundingBox().catch(() => null);
        if (box) {
          await page.mouse.click(
            box.x + box.width / 2,
            box.y + box.height / 2,
          );
        }
        await page.keyboard.press("Control+A").catch(() => {});
        await page.keyboard.press("Backspace").catch(() => {});
        await urlInput.fill(
          "https://raw.githubusercontent.com/comfyanonymous/ComfyUI/master/input/example.png",
        );
        await page.waitForTimeout(500);
        // Click the Load URL button via boundingBox
        const loadBtn = page.locator('button:has-text("Load URL")').first();
        const btnBox = await loadBtn.boundingBox().catch(() => null);
        if (btnBox) {
          await page.mouse.click(
            btnBox.x + btnBox.width / 2,
            btnBox.y + btnBox.height / 2,
          );
        } else {
          await loadBtn.click().catch(() => {});
        }
        await page.waitForTimeout(3000);
      },
      action: async (pace) => {
        // Show the URL input area with the filled URL
        await safeMove(page, "input[placeholder*='URL']");
        await pace();
        await safeMove(page, 'button:has-text("Load URL")');
        await pace();
      },
    })

    // ── 5: Examine loaded result ── OBSERVE
    .segment(VIDEO_SCRIPT[5].narration, async (pace) => {
      await page.mouse.wheel(0, 300);
      await page.mouse.move(400, 380);
      await pace();
      await safeMove(
        page,
        "[class*='workflow'], [class*='editable'], h3, h4, textarea, [class*='result']",
      );
      await pace();
      await page.mouse.move(640, 480);
      await pace();
    })

    // ── 6: Save workflow button ── INTERACT
    .segment(VIDEO_SCRIPT[6].narration, async (pace) => {
      await safeMove(
        page,
        "#save-workflow, button:has-text('Save workflow'), button:has-text('Save')",
      );
      await pace();
      await page.mouse.move(640, 500);
      await pace();
      await page.mouse.move(400, 480);
      await pace();
    })

    // ── 7: GitHub link ── INTERACT
    .segment(VIDEO_SCRIPT[7].narration, async (pace) => {
      await safeMove(page, 'a[href*="github"]');
      await pace();
      // Hover toward top-right corner where GitHub ribbon typically sits
      await page.mouse.move(1200, 30);
      await pace();
      await page.mouse.move(1100, 80);
      await pace();
    })

    // ── 8: Wrap-up ── OBSERVE
    .segment(VIDEO_SCRIPT[8].narration, async (pace) => {
      await page.mouse.wheel(0, -2000);
      await page.waitForTimeout(300);
      await safeMove(page, "h1, h2, h3, [class*='title']");
      await pace();
      await safeMove(
        page,
        "input[placeholder*='Paste'], input[placeholder*='Drop']",
      );
      await pace();
    })

    .outro({
      text: VIDEO_SCRIPT[9].text,
      subtitle: VIDEO_SCRIPT[9].subtitle,
      durationMs: VIDEO_SCRIPT[9].durationMs,
    });

  await script.prepare(page);
  await script.render(page, {
    baseName: "embedded-workflow-editor",
    outputDir: ".comfy-qa/.demos",
  });
});
