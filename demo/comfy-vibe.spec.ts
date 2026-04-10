import { test } from "./fixtures/fixture";
import { createVideoScript } from "../lib/demowright/dist/index.mjs";

/**
 * VIDEO SCRIPT — every word in `narration` is read aloud verbatim by Gemini TTS.
 *
 * Coverage: 2/2 (100%) — the site has only a title and a blank page.
 *
 * | Feature                    | R | Notes              |
 * |----------------------------|---|--------------------|
 * | "ComfyUI Prototypes" title | ✅ | primary heading    |
 * | Minimal blank-canvas state | ✅ | intentional        |
 */
const VIDEO_SCRIPT = [
  {
    kind: "title",
    text: "Comfy Vibe",
    subtitle: "ComfyUI Prototypes",
    durationMs: 2000,
  },
  {
    kind: "segment",
    narration:
      "Welcome to Comfy Vibe — an early-stage project in the ComfyUI ecosystem, currently deployed at comfy-vibe.vercel.app.",
    visuals: ["mouse.move center"],
  },
  {
    kind: "segment",
    narration:
      "The page shows a single heading: ComfyUI Prototypes. That is the entire visible content right now — no sidebar, no dashboard, no navigation.",
    visuals: ["safeMove h1"],
  },
  {
    kind: "segment",
    narration:
      "The name Prototypes tells us this is an official staging ground for experimental ideas in the ComfyUI world. It is not a finished product, and it does not pretend to be one.",
    visuals: ["mouse.move center"],
  },
  {
    kind: "segment",
    narration:
      "The fact that it is live on Vercel means the infrastructure is ready. Once features begin to ship — whether workflow management, template browsing, or community tools — they will land here.",
    visuals: ["mouse.move center"],
  },
  {
    kind: "segment",
    narration:
      "For now, Comfy Vibe is a project to watch. If you are following the ComfyUI ecosystem, bookmark this page and check back as it evolves.",
    visuals: ["mouse.move center"],
  },
  {
    kind: "outro",
    text: "Comfy Vibe",
    subtitle: "comfy-vibe.vercel.app",
    durationMs: 2000,
  },
] as const;

test("comfy vibe tour", async ({ page }) => {
  test.setTimeout(5 * 60_000);

  await page.goto("https://comfy-vibe.vercel.app/", {
    waitUntil: "domcontentloaded",
  });
  await page.waitForTimeout(3000);

  const script = createVideoScript()
    .title(VIDEO_SCRIPT[0].text, {
      subtitle: VIDEO_SCRIPT[0].subtitle,
      durationMs: VIDEO_SCRIPT[0].durationMs,
    })
    .segment(VIDEO_SCRIPT[1].narration, async (pace) => {
      await page.mouse.move(640, 360);
      await pace();
    })
    .segment(VIDEO_SCRIPT[2].narration, async (pace) => {
      const h1 = page.locator("h1").first();
      if (await h1.isVisible().catch(() => false)) {
        const box = await h1.boundingBox();
        if (box) await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      } else {
        await page.mouse.move(640, 300);
      }
      await pace();
    })
    .segment(VIDEO_SCRIPT[3].narration, async (pace) => {
      await page.mouse.move(640, 360);
      await pace();
    })
    .segment(VIDEO_SCRIPT[4].narration, async (pace) => {
      await page.mouse.move(640, 360);
      await pace();
    })
    .segment(VIDEO_SCRIPT[5].narration, async (pace) => {
      await page.mouse.move(640, 360);
      await pace();
    })
    .outro({
      text: VIDEO_SCRIPT[6].text,
      subtitle: VIDEO_SCRIPT[6].subtitle,
      durationMs: VIDEO_SCRIPT[6].durationMs,
    });

  await script.prepare(page);
  await script.render(page, {
    baseName: "comfy-vibe",
    outputDir: ".comfy-qa/.demos",
  });
});
