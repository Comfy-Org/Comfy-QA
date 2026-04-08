import type { Page } from "playwright";
import type { RecorderSession } from "../browser/recorder";
import type { TestScenario, QAChecklistItem } from "./research";

/** An action the AI agent decides to take */
interface AgentAction {
  type: "click" | "type" | "scroll" | "hover" | "wait" | "key" | "drag" | "screenshot" | "evaluate" | "done";
  selector?: string;
  text?: string;
  x?: number;
  y?: number;
  key?: string;
  ms?: number;
  code?: string;
  observation?: string;
}

/** Get page accessibility tree snapshot for the agent to reason about */
async function getA11ySnapshot(page: Page): Promise<string> {
  try {
    const tree = await page.accessibility.snapshot();
    return tree ? formatA11yTree(tree, 0) : "(empty a11y tree)";
  } catch {
    return "(a11y tree unavailable)";
  }
}

function formatA11yTree(node: any, depth: number): string {
  const indent = "  ".repeat(depth);
  let line = `${indent}[${node.role}]`;
  if (node.name) line += ` "${node.name}"`;
  if (node.value) line += ` value="${node.value}"`;
  if (node.checked !== undefined) line += ` checked=${node.checked}`;
  if (node.pressed !== undefined) line += ` pressed=${node.pressed}`;
  let result = line + "\n";
  if (node.children) {
    for (const child of node.children.slice(0, 50)) {
      result += formatA11yTree(child, depth + 1);
    }
    if (node.children.length > 50) {
      result += `${indent}  ... (${node.children.length - 50} more)\n`;
    }
  }
  return result;
}

/** Take a screenshot and encode it as base64 for the AI agent */
async function capturePageState(page: Page): Promise<{
  screenshot: string;
  a11yTree: string;
  url: string;
  title: string;
  consoleErrors: string[];
}> {
  const screenshotBuffer = await page.screenshot({ type: "png" });
  const screenshot = screenshotBuffer.toString("base64");
  const a11yTree = await getA11ySnapshot(page);
  const url = page.url();
  const title = await page.title();

  return { screenshot, a11yTree, url, title, consoleErrors: [] };
}

/** Ask Claude to decide the next action based on the current page state */
async function askAgentForAction(
  scenario: TestScenario,
  stepIndex: number,
  pageState: { screenshot: string; a11yTree: string; url: string; title: string },
  history: string[]
): Promise<AgentAction[]> {
  const prompt = `You are a QA automation agent controlling a browser via Playwright to test ComfyUI.

## Current Scenario: ${scenario.name}
${scenario.description}

## Test Steps
${scenario.steps.map((s, i) => `${i === stepIndex ? "👉 " : "  "}${i + 1}. ${s}`).join("\n")}

## Current Step: ${stepIndex + 1}/${scenario.steps.length}
"${scenario.steps[stepIndex]}"

## Expected Outcome
${scenario.expectedOutcome}

## Playwright Hint
${scenario.playwrightHint}

## Page State
- URL: ${pageState.url}
- Title: ${pageState.title}

## Accessibility Tree (truncated)
${pageState.a11yTree.slice(0, 3000)}

## Action History
${history.slice(-10).join("\n") || "(start)"}

---

Return a JSON array of 1-5 actions to execute for this step. Each action:
{
  "type": "click" | "type" | "scroll" | "hover" | "wait" | "key" | "done",
  "selector": "CSS selector or text content to target",
  "text": "text to type (for type action)",
  "x": number, "y": number (for coordinate-based click),
  "key": "key name (for key action, e.g. Enter, Tab)",
  "ms": milliseconds (for wait action),
  "observation": "what you expect to see / what you observed"
}

Use "done" when the current step is complete and we should move to the next step.
If ComfyUI is not loaded or the page shows something unexpected, include an observation explaining what you see.
Return ONLY the JSON array.`;

  const proc = Bun.spawn(["claude", "--print", "--model", "claude-sonnet-4-6"], {
    stdin: new TextEncoder().encode(prompt),
    stdout: "pipe",
    stderr: "pipe",
  });
  const output = await new Response(proc.stdout).text();
  await proc.exited;

  const jsonMatch = output.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    return [{ type: "done", observation: `Agent could not parse response: ${output.slice(0, 200)}` }];
  }

  try {
    return JSON.parse(jsonMatch[0]) as AgentAction[];
  } catch {
    return [{ type: "done", observation: "Failed to parse agent actions" }];
  }
}

/** Execute a single agent action on the page */
async function executeAction(page: Page, action: AgentAction): Promise<string> {
  try {
    switch (action.type) {
      case "click":
        if (action.x !== undefined && action.y !== undefined) {
          await page.mouse.click(action.x, action.y);
          return `Clicked at (${action.x}, ${action.y})`;
        }
        if (action.selector) {
          await page.click(action.selector, { timeout: 5000 });
          return `Clicked: ${action.selector}`;
        }
        return "Click: no target specified";

      case "type":
        if (action.selector && action.text) {
          await page.fill(action.selector, action.text, { timeout: 5000 });
          return `Typed "${action.text}" into ${action.selector}`;
        }
        if (action.text) {
          await page.keyboard.type(action.text);
          return `Typed: "${action.text}"`;
        }
        return "Type: no text specified";

      case "scroll":
        const dy = action.y ?? 300;
        await page.mouse.wheel(0, dy);
        return `Scrolled by ${dy}px`;

      case "hover":
        if (action.selector) {
          await page.hover(action.selector, { timeout: 5000 });
          return `Hovered: ${action.selector}`;
        }
        if (action.x !== undefined && action.y !== undefined) {
          await page.mouse.move(action.x, action.y);
          return `Hovered at (${action.x}, ${action.y})`;
        }
        return "Hover: no target";

      case "wait":
        await page.waitForTimeout(action.ms ?? 1000);
        return `Waited ${action.ms ?? 1000}ms`;

      case "key":
        if (action.key) {
          await page.keyboard.press(action.key);
          return `Pressed key: ${action.key}`;
        }
        return "Key: no key specified";

      case "done":
        return `Step done: ${action.observation ?? ""}`;

      default:
        return `Unknown action: ${action.type}`;
    }
  } catch (err: any) {
    return `Action failed: ${err.message?.slice(0, 150)}`;
  }
}

/** Run a full test scenario with AI-driven browser automation */
export async function runScenarioWithAgent(
  session: RecorderSession,
  scenario: TestScenario,
  scenarioIndex: number,
  maxActionsPerStep = 10,
  maxStepRetries = 2
): Promise<{ success: boolean; log: string[] }> {
  const log: string[] = [];

  await session.step(`Scenario ${scenarioIndex + 1}: ${scenario.name}`);
  await session.plan(scenario.description);
  log.push(`=== Scenario: ${scenario.name} ===`);

  for (let stepIdx = 0; stepIdx < scenario.steps.length; stepIdx++) {
    const stepText = scenario.steps[stepIdx];
    await session.status(`Step ${stepIdx + 1}/${scenario.steps.length}: ${stepText}`);
    log.push(`--- Step ${stepIdx + 1}: ${stepText} ---`);

    let stepDone = false;
    let actionCount = 0;

    while (!stepDone && actionCount < maxActionsPerStep) {
      // Capture current state
      const pageState = await capturePageState(session.page);

      // Ask agent what to do
      const actions = await askAgentForAction(scenario, stepIdx, pageState, log);

      for (const action of actions) {
        if (action.observation) {
          log.push(`  [observe] ${action.observation}`);
          await session.annotate(200, 300, action.observation, 2000);
        }

        if (action.type === "done") {
          stepDone = true;
          break;
        }

        const result = await executeAction(session.page, action);
        log.push(`  [action] ${result}`);
        await session.page.waitForTimeout(400); // brief pause for visual recording
        actionCount++;
      }
    }

    await session.screenshot(
      `scenario-${String(scenarioIndex + 1).padStart(2, "0")}-step-${String(stepIdx + 1).padStart(2, "0")}`
    );
  }

  log.push(`=== Scenario complete ===`);
  return { success: true, log };
}

/** Fallback: run scenario without ComfyUI (research-only mode) */
export async function runScenarioResearchOnly(
  session: RecorderSession,
  scenario: TestScenario,
  scenarioIndex: number
): Promise<{ log: string[] }> {
  const log: string[] = [];

  await session.step(`Scenario ${scenarioIndex + 1}: ${scenario.name}`);
  await session.plan(scenario.description);
  log.push(`=== Scenario (research-only): ${scenario.name} ===`);

  // Show preconditions
  for (const pre of scenario.preconditions) {
    await session.status(`Precondition: ${pre}`);
    await session.page.waitForTimeout(800);
  }

  // Walk through steps as annotations
  for (let i = 0; i < scenario.steps.length; i++) {
    const step = scenario.steps[i];
    await session.status(`Step ${i + 1}/${scenario.steps.length}: ${step}`);
    await session.annotate(
      200 + Math.random() * 300,
      200 + Math.random() * 200,
      `Step ${i + 1}: ${step}`,
      2500
    );
    log.push(`  [planned] Step ${i + 1}: ${step}`);
    await session.page.waitForTimeout(1500);
  }

  // Show expected outcome
  await session.status(`Expected: ${scenario.expectedOutcome}`);
  await session.page.waitForTimeout(1000);

  await session.screenshot(
    `scenario-${String(scenarioIndex + 1).padStart(2, "0")}-plan`
  );

  log.push(`  [expected] ${scenario.expectedOutcome}`);
  log.push(`  [hint] ${scenario.playwrightHint}`);
  return { log };
}
