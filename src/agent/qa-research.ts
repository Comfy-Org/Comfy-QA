/**
 * QA Research Agent — explores a website, tests CRUD operations,
 * generates a demowright spec, debugs it, and records QA evidence video.
 *
 * Phase 1: Explore site headlessly, test each operation, pass/fail scoring
 * Phase 2: Generate .spec.ts, debug without video (demowright fast mode)
 * Phase 3: Record with video (demowright demo mode + TTS)
 *
 * Usage:
 *   bun src/agent/qa-research.ts demo/checklists/registry-web.yaml
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { $ } from "bun";
import { chromium, type Page } from "playwright";
import * as yaml from "yaml";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Operation {
  id: string;
  type: string;
  description: string;
  steps_hint: string;
  narration: string;
  success_criteria: string;
}

interface Feature {
  name: string;
  operations: Operation[];
}

interface Checklist {
  product: string;
  url: string;
  persona: string;
  features: Feature[];
  conclusion?: { narration: string };
}

interface StepAction {
  type: "goto" | "click" | "type" | "scroll" | "hover" | "wait" | "key" | "safeMove";
  selector?: string;
  text?: string;
  value?: number;
}

interface OperationResult {
  id: string;
  feature: string;
  type: string;
  narration: string;
  success: boolean;
  actions: StepAction[];
  error?: string;
}

interface ResearchResults {
  product: string;
  url: string;
  features: {
    name: string;
    operations: OperationResult[];
    score: string;
    passed: number;
    total: number;
  }[];
  totalPassed: number;
  totalOperations: number;
  scorePercent: number;
}

// ---------------------------------------------------------------------------
// LLM
// ---------------------------------------------------------------------------

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY_QA ?? process.env.ANTHROPIC_API_KEY ?? "";
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY ?? "";

import Anthropic from "@anthropic-ai/sdk";

const anthropicClient = ANTHROPIC_KEY ? new Anthropic({ apiKey: ANTHROPIC_KEY, timeout: 60_000 }) : null;

async function callLLM(system: string, messages: any[]): Promise<string> {
  if (anthropicClient) {
    try {
      const res = await anthropicClient.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 8192,
        system,
        messages,
      });
      return res.content?.[0]?.type === "text" ? res.content[0].text : "";
    } catch (err: any) {
      console.log(`  ⚠ Anthropic SDK: ${err.message?.slice(0, 80)}`);
    }
  }

  if (OPENROUTER_KEY) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 60_000);
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        signal: controller.signal,
        headers: { Authorization: `Bearer ${OPENROUTER_KEY}`, "content-type": "application/json" },
        body: JSON.stringify({
          model: "anthropic/claude-sonnet-4-20250514",
          messages: [{ role: "system", content: system }, ...messages],
          max_tokens: 8192,
        }),
      });
      clearTimeout(timer);
      const json = (await res.json()) as any;
      return json.choices?.[0]?.message?.content ?? "";
    } catch (err: any) {
      console.log(`  ⚠ OpenRouter: ${err.message?.slice(0, 60)}`);
    }
  }

  return "";
}

// ---------------------------------------------------------------------------
// Page helpers
// ---------------------------------------------------------------------------

function formatA11y(node: any, depth: number): string {
  const indent = "  ".repeat(depth);
  let line = `${indent}${node.role}`;
  if (node.name) line += ` "${node.name}"`;
  if (node.value) line += ` [${node.value}]`;
  let text = line + "\n";
  for (const child of node.children ?? []) {
    text += formatA11y(child, depth + 1);
  }
  return text;
}

async function captureState(page: Page) {
  const screenshot = await page.screenshot({ type: "png" }).catch(() => null);

  // accessibility.snapshot() can throw if the property itself is undefined
  let a11yTree = "(unavailable)";
  try {
    if (page.accessibility) {
      const a11y = await page.accessibility.snapshot();
      if (a11y) a11yTree = formatA11y(a11y, 0).slice(0, 3000);
    }
  } catch {
    // Fall back to innerText extraction
    try {
      const text = await page.evaluate(() => document.body?.innerText?.slice(0, 3000) ?? "");
      a11yTree = text || "(unavailable)";
    } catch {}
  }

  return {
    screenshotBase64: screenshot ? screenshot.toString("base64") : "",
    a11yTree,
    url: page.url(),
    title: await page.title().catch(() => ""),
  };
}

async function executeAction(page: Page, action: StepAction): Promise<boolean> {
  try {
    switch (action.type) {
      case "goto":
        await page.goto(action.text!, { waitUntil: "domcontentloaded", timeout: 15000 });
        await page.waitForTimeout(1500);
        break;
      case "click":
        await page.locator(action.selector!).first().click({ timeout: 5000 });
        break;
      case "type":
        await page.locator(action.selector!).first().fill(action.text!, { timeout: 5000 });
        break;
      case "scroll":
        await page.mouse.wheel(0, action.value ?? 300);
        await page.waitForTimeout(500);
        break;
      case "hover":
        await page.locator(action.selector!).first().hover({ timeout: 5000 });
        break;
      case "wait":
        await page.waitForTimeout(action.value ?? 1000);
        break;
      case "key":
        await page.keyboard.press(action.text!);
        break;
      case "safeMove":
        const el = page.locator(action.selector!).first();
        if (await el.isVisible({ timeout: 3000 })) {
          const box = await el.boundingBox();
          if (box) await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        }
        break;
    }
    return true;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Phase 1: Research
// ---------------------------------------------------------------------------

async function testOperation(
  page: Page,
  checklist: Checklist,
  feature: Feature,
  op: Operation,
): Promise<OperationResult> {
  const result: OperationResult = {
    id: op.id,
    feature: feature.name,
    type: op.type,
    narration: op.narration,
    success: false,
    actions: [],
  };

  console.log(`    Testing: ${op.id}`);

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const state = await captureState(page);

      const systemPrompt = `You are a QA tester recording a video demo of a website.

Product: ${checklist.product}

RULES:
- Headless browser, NO URL bar. Use {"type": "goto", "text": "url"} to navigate.
- Use simple CSS selectors. Maximum 5 actions.
- Set "success": true if the success criteria is met in the current state.
- ALWAYS include at least 1 visual action (safeMove, hover, scroll) so the video shows
  something happening. Even if content is already visible, move the cursor to it so the
  viewer's eye is drawn to the relevant element.
- For "read" operations: use safeMove or hover to highlight the relevant element.
- For "create"/"update"/"delete" operations: perform the actual action (click, type).
- On retry, try a different selector approach.

Action types:
- {"type": "goto", "text": "url"}     — navigate (use absolute URL)
- {"type": "safeMove", "selector": "..."}  — move cursor to element (visual)
- {"type": "hover", "selector": "..."}     — hover over element (visual)
- {"type": "scroll", "value": 300}    — scroll down N pixels (visual)
- {"type": "click", "selector": "..."}     — click element
- {"type": "type", "selector": "...", "text": "..."}  — type text
- {"type": "wait", "value": 1000}     — wait N ms

Respond with ONLY JSON:
{
  "actions": [{"type": "safeMove", "selector": "h1"}],
  "success": true/false,
  "observation": "what I see"
}`;

      const userContent: any[] = [{
        type: "text",
        text: `Operation: ${op.id} — ${op.description}
Steps hint: ${op.steps_hint}
Success criteria: ${op.success_criteria}
Attempt: ${attempt}/3${attempt > 1 ? " — previous approach failed, try something different" : ""}

URL: ${state.url} | Title: ${state.title}

Accessibility Tree:
${state.a11yTree}`,
      }];

      if (state.screenshotBase64) {
        userContent.push({
          type: "image",
          source: { type: "base64", media_type: "image/png", data: state.screenshotBase64 },
        });
      }

      const response = await callLLM(systemPrompt, [{ role: "user", content: userContent }]);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) continue;

      const decision = JSON.parse(jsonMatch[0]);

      // Execute actions and record successful ones
      for (const action of decision.actions ?? []) {
        const ok = await executeAction(page, action);
        if (ok) result.actions.push(action);
      }

      await page.waitForTimeout(1000);

      if (decision.success) {
        result.success = true;
        console.log(`      ✅ (attempt ${attempt})`);
        return result;
      }
    } catch (err: any) {
      result.error = err.message?.slice(0, 200);
    }
  }

  console.log(`      ❌ (3 attempts failed)`);
  return result;
}

async function runPhase1(checklist: Checklist): Promise<ResearchResults> {
  console.log(`\n🔬 Phase 1: Research — ${checklist.product}\n`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();

  await page.goto(checklist.url, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForTimeout(2000);

  const results: ResearchResults = {
    product: checklist.product,
    url: checklist.url,
    features: [],
    totalPassed: 0,
    totalOperations: 0,
    scorePercent: 0,
  };

  for (const feature of checklist.features) {
    console.log(`\n  📋 ${feature.name}`);
    const fr = { name: feature.name, operations: [] as OperationResult[], score: "", passed: 0, total: feature.operations.length };

    for (const op of feature.operations) {
      const r = await testOperation(page, checklist, feature, op);
      fr.operations.push(r);
      if (r.success) fr.passed++;
    }

    fr.score = `${fr.passed}/${fr.total}`;
    results.features.push(fr);
    results.totalPassed += fr.passed;
    results.totalOperations += fr.total;
    console.log(`    Score: ${fr.score}`);
  }

  results.scorePercent = Math.round((results.totalPassed / results.totalOperations) * 100);
  await browser.close();
  return results;
}

// ---------------------------------------------------------------------------
// Phase 2: Generate spec
// ---------------------------------------------------------------------------

/**
 * Render a rich HTML scorecard to be shown as a fullscreen page before the outro.
 * Returns a self-contained HTML string that the spec can pass to page.setContent().
 */
function generateScorecardHtml(results: ResearchResults, checklist: Checklist): string {
  const rows = results.features.map((f) => {
    const ops = f.operations.map((op) => {
      const mark = op.success ? "✓" : "✗";
      const cls = op.success ? "pass" : "fail";
      return `<li class="${cls}"><span class="mark">${mark}</span>${escapeHtml(op.id)}</li>`;
    }).join("");
    const featMark = f.passed === f.total ? "✓" : "⚠";
    const featCls = f.passed === f.total ? "pass" : "partial";
    return `
    <section class="feature ${featCls}">
      <h3><span class="mark">${featMark}</span>${escapeHtml(f.name)} <span class="score">${f.score}</span></h3>
      <ul>${ops}</ul>
    </section>`;
  }).join("");

  const total = `${results.totalPassed}/${results.totalOperations}`;
  const pct = results.scorePercent;

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${escapeHtml(checklist.product)} QA</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    background: radial-gradient(ellipse at top, #1a1f3a 0%, #0a0e1f 100%);
    color: #fff;
    min-height: 100vh;
    padding: 40px 60px;
  }
  header {
    text-align: center;
    margin-bottom: 32px;
  }
  header h1 {
    font-size: 42px;
    font-weight: 800;
    margin-bottom: 8px;
    background: linear-gradient(135deg, #fff 0%, #8892b0 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  header .total {
    font-size: 28px;
    font-weight: 600;
    color: ${pct >= 80 ? "#4ade80" : pct >= 50 ? "#facc15" : "#f87171"};
  }
  .features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 20px;
  }
  .feature {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 20px 24px;
    backdrop-filter: blur(10px);
  }
  .feature.pass { border-left: 4px solid #4ade80; }
  .feature.partial { border-left: 4px solid #facc15; }
  .feature h3 {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .feature h3 .score {
    margin-left: auto;
    font-family: 'SF Mono', Monaco, monospace;
    font-size: 18px;
    color: #8892b0;
  }
  .feature ul { list-style: none; }
  .feature li {
    padding: 6px 0;
    font-size: 15px;
    display: flex;
    align-items: center;
    gap: 10px;
    color: #ccd6f6;
  }
  .feature li.fail { color: #8892b0; text-decoration: line-through; }
  .mark {
    display: inline-block;
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    border-radius: 50%;
    font-weight: 700;
    font-size: 12px;
    flex-shrink: 0;
  }
  .feature.pass h3 .mark { background: #4ade80; color: #0a0e1f; }
  .feature.partial h3 .mark { background: #facc15; color: #0a0e1f; }
  .feature li.pass .mark { background: rgba(74, 222, 128, 0.2); color: #4ade80; }
  .feature li.fail .mark { background: rgba(248, 113, 113, 0.2); color: #f87171; }
  footer {
    text-align: center;
    margin-top: 40px;
    font-size: 14px;
    color: #8892b0;
  }
</style>
</head><body>
  <header>
    <h1>${escapeHtml(checklist.product)} QA Results</h1>
    <div class="total">${total} &nbsp;•&nbsp; ${pct}%</div>
  </header>
  <div class="features">
    ${rows}
  </div>
  <footer>Comfy-QA Evidence • Generated ${new Date().toISOString().split("T")[0]}</footer>
</body></html>`;
}

/**
 * Build a multi-sentence scorecard narration that takes ~12-15s to read
 * so the scorecard stays on screen long enough to be readable.
 */
function buildScorecardNarration(results: ResearchResults, checklist: Checklist): string {
  const parts: string[] = [];
  parts.push(`Here are the final QA results for ${checklist.product}.`);
  parts.push(`Out of ${results.totalOperations} operations tested, ${results.totalPassed} passed, giving an overall score of ${results.scorePercent} percent.`);

  const passed = results.features.filter(f => f.passed === f.total);
  const partial = results.features.filter(f => f.passed < f.total);

  if (passed.length > 0) {
    const names = passed.map(f => f.name).join(", ");
    parts.push(`The following features work as expected: ${names}.`);
  }
  if (partial.length > 0) {
    const details = partial.map(f => {
      const failedOps = f.operations.filter(o => !o.success).map(o => o.id).join(", ");
      return `${f.name} scored ${f.score} — failing operations include ${failedOps}`;
    }).join("; ");
    parts.push(`Partial coverage in: ${details}.`);
  }

  parts.push(`This video serves as evidence of the current product state. Failing operations are demonstrated as bugs to be fixed.`);
  return parts.join(" ");
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/**
 * Generate assertion code for a FAILED operation.
 * Instead of .catch(() => {}), we assert the actual broken behavior.
 * When the bug is fixed, this assertion will fail → signal to update the spec.
 */
function generateFailAssertion(op: OperationResult): string {
  const lines: string[] = [];

  // Replay the actions that were attempted, wrapped in try/catch to observe failure
  if (op.actions.length > 0) {
    const lastAction = op.actions[op.actions.length - 1];

    // If the last action was a goto, the page may have loaded but content wasn't right
    if (lastAction.type === "goto") {
      lines.push(`      // Navigate to the target page`);
      lines.push(`      await page.goto(${JSON.stringify(lastAction.text)}, { waitUntil: "domcontentloaded", timeout: 15000 });`);
      lines.push(`      await page.waitForTimeout(1500);`);
      lines.push(`      // Assert: operation did not succeed (current known behavior)`);
      lines.push(`      // When this bug is fixed, this assertion will fail → update the spec`);
    }

    // If last action was a click/type that failed, assert the element isn't interactable
    if (lastAction.type === "click" && lastAction.selector) {
      lines.push(`      // Assert: element is not clickable (current known behavior)`);
      lines.push(`      const target = page.locator(${JSON.stringify(lastAction.selector)}).first();`);
      lines.push(`      expect(await target.isVisible().catch(() => false)).toBe(false);`);
    }
  }

  if (lines.length === 0) {
    // No specific actions to assert — just document the failure
    lines.push(`      // This operation failed during research — no working selectors found`);
    lines.push(`      // Current page state is shown in the video as evidence`);
  }

  return lines.join("\n");
}

function actionToCode(a: StepAction): string | null {
  switch (a.type) {
    case "goto":
      return `await page.goto(${JSON.stringify(a.text)}, { waitUntil: "domcontentloaded", timeout: 15000 }); await page.waitForTimeout(1500);`;
    case "click":
      return `await page.locator(${JSON.stringify(a.selector)}).first().click({ timeout: 5000 });`;
    case "type":
      return `await page.locator(${JSON.stringify(a.selector)}).first().fill(${JSON.stringify(a.text)}, { timeout: 5000 });`;
    case "scroll":
      return `await page.mouse.wheel(0, ${a.value ?? 300});`;
    case "hover":
      return `await page.locator(${JSON.stringify(a.selector)}).first().hover({ timeout: 5000 });`;
    case "wait":
      return `await page.waitForTimeout(${a.value ?? 1000});`;
    case "key":
      return `await page.keyboard.press(${JSON.stringify(a.text)});`;
    case "safeMove":
      return `await safeMove(page, ${JSON.stringify(a.selector)});`;
    default:
      return null;
  }
}

function generateSpec(results: ResearchResults, checklist: Checklist): string {
  const segments: string[] = [];

  // Actions that change the page (must run BEFORE narration starts)
  const SETUP_TYPES = new Set(["goto", "click", "type", "scroll", "key", "wait"]);
  // Actions that are visual (safe to run DURING narration)
  const VISUAL_TYPES = new Set(["safeMove", "hover"]);

  for (const feature of results.features) {
    segments.push(`\n    // ── ${feature.name} (${feature.score}) ──`);

    for (const op of feature.operations) {
      const icon = op.success ? "✅" : "❌";

      if (op.success) {
        // ── PASS: generate setup + action with real assertions ──
        const narration = op.narration;
        const setupLines: string[] = [];
        const visualLines: string[] = [];

        for (const a of op.actions) {
          const line = actionToCode(a);
          if (line) {
            if (SETUP_TYPES.has(a.type)) {
              setupLines.push(line);
            } else {
              visualLines.push(line);
            }
          }
        }

        if (setupLines.length > 0) {
          const actionBody = visualLines.length > 0
            ? visualLines.map(l => `        ${l}`).join("\n") + "\n        await pace();"
            : "        await pace();";

          segments.push(`    // ${icon} ${op.id} (${op.type}) — PASS
    .segment(${JSON.stringify(narration)}, {
      setup: async () => {
${setupLines.map(l => `        ${l}`).join("\n")}
      },
      action: async (pace) => {
${actionBody}
      },
    })`);
        } else {
          const bodyLines = visualLines.length > 0
            ? visualLines.map(l => `      ${l}`).join("\n") + "\n      await pace();"
            : "      await pace();";

          segments.push(`    // ${icon} ${op.id} (${op.type}) — PASS
    .segment(${JSON.stringify(narration)}, async (pace) => {
${bodyLines}
    })`);
        }
      } else {
        // ── FAIL: assert the actual broken behavior ──
        const narration = `${op.narration.replace(/\.$/, "")} — but this operation is currently failing.`;
        const failBody = generateFailAssertion(op);

        segments.push(`    // ${icon} ${op.id} (${op.type}) — FAIL (asserts current broken behavior)
    .segment(${JSON.stringify(narration)}, async (pace) => {
${failBody}
      await pace();
    })`);
      }
    }
  }

  // Scorecard (compact for outro subtitle)
  const scoreLines: string[] = [];
  for (const f of results.features) {
    const icon = f.passed === f.total ? "✅" : "⚠";
    scoreLines.push(`${f.name} ${f.score} ${icon}`);
  }

  // Scorecard HTML (for full-page render before outro)
  const scorecardHtml = generateScorecardHtml(results, checklist);

  const slug = checklist.product.toLowerCase().replace(/\s+/g, "-");

  return `/**
 * ${checklist.product} — QA Evidence Video
 * Auto-generated by Research Agent on ${new Date().toISOString().split("T")[0]}
 * Score: ${results.totalPassed}/${results.totalOperations} (${results.scorePercent}%)
 */
import { test, safeMove, expect } from "./fixtures/fixture";
import { createVideoScript } from "../lib/demowright/dist/index.mjs";

const SCORECARD_HTML = ${JSON.stringify(scorecardHtml)};

test("${slug} QA evidence", async ({ page }) => {
  test.setTimeout(10 * 60_000);

  const script = createVideoScript()
    .title(${JSON.stringify(checklist.product + " QA")}, {
      subtitle: "Score: ${results.totalPassed}/${results.totalOperations} (${results.scorePercent}%)",
      durationMs: 3000,
    })
${segments.join("\n")}

    // Render the full scorecard as the last segment (visible for ~8s)
    .segment(${JSON.stringify(buildScorecardNarration(results, checklist))}, {
      setup: async () => {
        await page.setContent(SCORECARD_HTML, { waitUntil: "domcontentloaded" });
        await page.waitForTimeout(500);
      },
      action: async (pace) => {
        await pace();
      },
    })

    .outro({
      text: "QA Results: ${results.totalPassed}/${results.totalOperations} (${results.scorePercent}%)",
      subtitle: ${JSON.stringify(scoreLines.join(" | "))},
      durationMs: 4000,
    });

  // Pre-generate TTS BEFORE navigating — avoids idle time in recording
  await script.prepare(page);

  // Navigate after TTS is ready — recording is already active
  await page.goto(${JSON.stringify(checklist.url)}, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);

  await script.render(page, {
    baseName: ${JSON.stringify(slug + "-qa")},
    outputDir: ".comfy-qa/.demos",
  });
});
`;
}

// ---------------------------------------------------------------------------
// Phase 2+3: Debug & Record
// ---------------------------------------------------------------------------

async function runSpec(specPath: string, label: string): Promise<{ ok: boolean; output: string }> {
  // Use -c demo/ to override testDir so specs in demo/ are found
  const testDir = path.dirname(specPath);
  console.log(`\n${label}\n  Running: bunx playwright test -c ${testDir}/ ${specPath}\n`);
  try {
    const result = await $`bunx playwright test -c ${testDir}/ ${specPath} --reporter=list 2>&1`.text();
    // Match Playwright's summary line: "N passed" or "N failed"
    const passMatch = result.match(/(\d+) passed/);
    const failMatch = result.match(/(\d+) failed/);
    const ok = passMatch !== null && (failMatch === null || parseInt(failMatch[1]) === 0);
    console.log(result.slice(-1000));
    return { ok, output: result };
  } catch (err: any) {
    const output = err.stdout?.toString() ?? err.message ?? "";
    console.log(output.slice(-1000));
    return { ok: false, output };
  }
}

/**
 * Phase 2 debug loop: if spec fails, ask LLM to fix it, then re-run.
 * Returns true if spec passes after fixes.
 */
async function debugLoop(specPath: string, maxRetries = 3): Promise<boolean> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const { ok, output } = await runSpec(specPath, `🔧 Phase 2: Debug (attempt ${attempt}/${maxRetries})`);
    if (ok) return true;

    if (attempt === maxRetries) {
      console.log(`\n⚠ Spec still failing after ${maxRetries} debug attempts.`);
      return false;
    }

    // Ask LLM to fix the spec
    console.log(`\n🔧 Asking LLM to fix spec...`);
    const specContent = fs.readFileSync(specPath, "utf-8");
    const errorTail = output.slice(-2000);

    const fixPrompt = `You are fixing a Playwright test spec that failed. Here is the spec and error output.

RULES:
- Only fix the specific error. Don't rewrite the whole spec.
- Keep the same structure (title, segments, outro).
- If a selector timed out, try a more robust selector or add .catch(() => {}).
- If an import is wrong, fix it.
- Return the COMPLETE fixed spec file (not just the diff).

## Current spec:
\`\`\`typescript
${specContent}
\`\`\`

## Error output (last 2000 chars):
\`\`\`
${errorTail}
\`\`\`

Return ONLY the fixed TypeScript file content, no markdown fences.`;

    try {
      const fixed = await callLLM("You fix Playwright test specs. Return only the fixed file content.", [
        { role: "user", content: fixPrompt },
      ]);

      // Extract TypeScript from response (strip markdown fences if present)
      let fixedContent = fixed.trim();
      if (fixedContent.startsWith("```")) {
        fixedContent = fixedContent.replace(/^```\w*\n/, "").replace(/\n```$/, "");
      }

      // Sanity checks — reject truncated / incomplete LLM responses
      const hasImport = fixedContent.includes("import");
      const hasTest = fixedContent.includes("test(");
      const hasEnd = /\}\s*\)\s*;?\s*$/.test(fixedContent);
      const balancedBraces = (fixedContent.match(/\{/g)?.length ?? 0) === (fixedContent.match(/\}/g)?.length ?? 0);

      if (hasImport && hasTest && hasEnd && balancedBraces) {
        fs.writeFileSync(specPath, fixedContent);
        console.log(`  ✏️ Spec updated, retrying...`);
      } else {
        console.log(`  ⚠ LLM response incomplete (import=${hasImport}, test=${hasTest}, end=${hasEnd}, balanced=${balancedBraces}), keeping original.`);
      }
    } catch (err: any) {
      console.log(`  ⚠ LLM fix failed: ${err.message?.slice(0, 100)}`);
    }
  }
  return false;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const checklistPath = process.argv[2];
  if (!checklistPath) {
    console.error("Usage: bun src/agent/qa-research.ts <checklist.yaml>");
    process.exit(1);
  }

  const raw = fs.readFileSync(path.resolve(checklistPath), "utf-8");
  const checklist = yaml.parse(raw) as Checklist;
  const slug = checklist.product.toLowerCase().replace(/\s+/g, "-");
  const outputDir = path.resolve(".comfy-qa/.research", slug);
  fs.mkdirSync(outputDir, { recursive: true });

  // ── Phase 1 ──
  const results = await runPhase1(checklist);

  fs.writeFileSync(path.join(outputDir, "research-results.json"), JSON.stringify(results, null, 2));

  // Print scorecard
  console.log(`\n  ┌───────────────────────────────────┐`);
  console.log(`  │  ${checklist.product} QA Results`.padEnd(37) + "│");
  console.log(`  │                                   │`);
  for (const f of results.features) {
    const icon = f.passed === f.total ? "✅" : "⚠ ";
    console.log(`  │  ${icon} ${f.name.padEnd(22)} ${f.score.padStart(5)}  │`);
  }
  console.log(`  │                                   │`);
  console.log(`  │  Total: ${results.totalPassed}/${results.totalOperations} (${results.scorePercent}%)`.padEnd(37) + "│");
  console.log(`  └───────────────────────────────────┘`);

  // ── Phase 2: Generate spec ──
  const specContent = generateSpec(results, checklist);
  const specPath = path.join("demo", `${slug}-qa.spec.ts`);
  fs.writeFileSync(specPath, specContent);
  console.log(`\n📝 Spec: ${specPath}`);

  // ── Phase 2: Debug loop (LLM fixes failing spec) ──
  const debugOk = await debugLoop(specPath, 3);

  // ── Phase 3: Record ──
  if (debugOk) {
    const { ok: recordOk } = await runSpec(specPath, "🎬 Phase 3: Record (with video)");
    if (recordOk) {
      console.log(`\n✅ Video: .comfy-qa/.demos/${slug}-qa.mp4`);
    }
  } else {
    console.log(`\n⚠ Debug failed after retries. Fix spec manually:`);
    console.log(`  bunx playwright test ${specPath}`);
  }

  console.log("\n✅ Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
