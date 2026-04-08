import { test, safeMove } from "./fixtures/fixture";
import { createVideoScript } from "../lib/demowright/dist/index.mjs";

test("custom node licenses tour", async ({ page }) => {
  test.setTimeout(5 * 60_000);

  await page.goto("https://custom-node-licenses.vercel.app", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2500);

  const script = createVideoScript()
    .title("Custom Node Licenses", { subtitle: "ComfyUI License Explorer", durationMs: 2000 })
    .segment("Explore license distribution across ComfyUI custom nodes.", async (pace) => {
      await safeMove(page, "h1");
      await pace();
    })
    .segment("The hero section introduces the license dashboard overview.", async (pace) => {
      await safeMove(page, "main");
      await pace();
    })
    .segment("A chart visualizes how licenses are distributed.", async (pace) => {
      await page.mouse.wheel(0, 300);
      await pace();
      await safeMove(page, "svg, canvas");
      await pace();
    })
    .segment("Hover chart segments to inspect individual license counts.", async (pace) => {
      await safeMove(page, "svg path, canvas");
      await pace();
      await page.mouse.move(640, 360);
      await pace();
    })
    .segment("Below the chart, nodes are listed in a detailed table.", async (pace) => {
      await page.mouse.wheel(0, 400);
      await pace();
      await safeMove(page, "table, [role=table]");
      await pace();
    })
    .segment("Each row shows a custom node and its license type.", async (pace) => {
      await safeMove(page, "tr, [role=row]");
      await pace();
      await page.mouse.wheel(0, 300);
      await pace();
    })
    .segment("Filter controls let you narrow nodes by specific license.", async (pace) => {
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
      await pace();
      await safeMove(page, "input, select, button");
      await pace();
    })
    .segment("Scroll further to discover long-tail licenses in the dataset.", async (pace) => {
      await page.mouse.wheel(0, 600);
      await pace();
      await page.mouse.wheel(0, 600);
      await pace();
    })
    .outro({ text: "Custom Node Licenses", subtitle: "custom-node-licenses.vercel.app", durationMs: 2000 });

  await script.prepare(page);
  await script.render(page, { baseName: "custom-node-licenses", outputDir: ".comfy-qa/demos" });
});
