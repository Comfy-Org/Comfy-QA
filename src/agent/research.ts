import { $ } from "bun";
import type { PRInfo, IssueInfo } from "../utils/github";

/** Call Claude via CLI (already authenticated) or SDK if ANTHROPIC_API_KEY is set */
async function callClaude(prompt: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY_QA ?? process.env.ANTHROPIC_API_KEY;
  if (apiKey) {
    const Anthropic = (await import("@anthropic-ai/sdk")).default;
    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    });
    return response.content[0].type === "text" ? response.content[0].text : "";
  }
  // Fallback: pipe through claude CLI via stdin
  const proc = Bun.spawn(["claude", "--print", "--model", "claude-opus-4-6"], {
    stdin: new TextEncoder().encode(prompt),
    stdout: "pipe",
    stderr: "pipe",
  });
  const output = await new Response(proc.stdout).text();
  await proc.exited;
  return output;
}

/** Extract JSON from Claude response, handling code blocks and markdown wrapping */
function parseResearchJSON(text: string): ResearchResult {
  // Try extracting from ```json ... ``` code block first
  const codeBlockMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)```/);
  const candidate = codeBlockMatch ? codeBlockMatch[1].trim() : text;

  // Find the outermost JSON object
  const jsonMatch = candidate.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Research agent returned no JSON");

  try {
    return JSON.parse(jsonMatch[0]) as ResearchResult;
  } catch (e) {
    // Try cleaning common issues: trailing commas, comments
    const cleaned = jsonMatch[0]
      .replace(/,\s*([\]}])/g, "$1")  // trailing commas
      .replace(/\/\/.*$/gm, "");       // line comments
    return JSON.parse(cleaned) as ResearchResult;
  }
}

export interface ResearchResult {
  summary: string;
  bugType: "bug" | "feature" | "regression" | "performance" | "unknown";
  severity: "critical" | "high" | "medium" | "low";
  affectedArea: string;
  reproductionSteps: string[];
  expectedBehavior: string;
  actualBehavior: string;
  rootCauseSummary: string;
  qaChecklist: QAChecklistItem[];
  testScenarios: TestScenario[];
  risks: string[];
  relatedFiles: string[];
}

export interface QAChecklistItem {
  id: string;
  category: "functional" | "visual" | "regression" | "edge_case" | "performance";
  description: string;
  steps: string[];
  expectedResult: string;
  priority: "P0" | "P1" | "P2";
  status: "pending" | "pass" | "fail" | "blocked";
}

export interface TestScenario {
  name: string;
  description: string;
  preconditions: string[];
  steps: string[];
  expectedOutcome: string;
  playwrightHint: string;
}

export async function researchPR(pr: PRInfo): Promise<ResearchResult> {
  console.log(`  [research] Analyzing PR #${pr.number}: ${pr.title}`);

  const filesSummary = pr.files
    .slice(0, 30)
    .map((f) => `  ${f.path} (+${f.additions}/-${f.deletions})`)
    .join("\n");

  const commentsSummary = pr.comments
    .slice(0, 10)
    .map((c) => `  [${c.author}]: ${c.body.slice(0, 300)}`)
    .join("\n---\n");

  const prompt = `You are a senior QA engineer analyzing a GitHub PR for ComfyUI (a node-based AI image generation UI).

## PR #${pr.number}: ${pr.title}
**URL**: ${pr.url}
**Author**: ${pr.author}
**Branch**: ${pr.headRefName} → ${pr.baseRefName}
**Labels**: ${pr.labels.join(", ") || "none"}

## PR Description
${pr.body.slice(0, 3000)}

## Changed Files (${pr.files.length} total)
${filesSummary}

## Key Comments
${commentsSummary || "(none)"}

---

Produce a comprehensive QA analysis as JSON with this exact schema:
{
  "summary": "2-3 sentence executive summary",
  "bugType": "bug|feature|regression|performance|unknown",
  "severity": "critical|high|medium|low",
  "affectedArea": "e.g. canvas, workflow tabs, sidebar, node editor",
  "reproductionSteps": ["step 1", "step 2", ...],
  "expectedBehavior": "what should happen",
  "actualBehavior": "what actually happens (the bug)",
  "rootCauseSummary": "technical root cause in 1-2 sentences",
  "qaChecklist": [
    {
      "id": "QA-001",
      "category": "functional|visual|regression|edge_case|performance",
      "description": "test description",
      "steps": ["step 1", ...],
      "expectedResult": "expected outcome",
      "priority": "P0|P1|P2",
      "status": "pending"
    }
  ],
  "testScenarios": [
    {
      "name": "scenario name",
      "description": "what this tests",
      "preconditions": ["precondition 1", ...],
      "steps": ["step 1", ...],
      "expectedOutcome": "what should happen",
      "playwrightHint": "which playwright selectors/actions to use"
    }
  ],
  "risks": ["risk 1", "risk 2"],
  "relatedFiles": ["path/to/file.ts"]
}

Create 5-8 QA checklist items covering: happy path, regression, edge cases, visual checks.
Create 3-5 test scenarios focused on the core bug/feature.
Be specific and actionable. Use ComfyUI-specific terminology.`;

  const text = await callClaude(prompt);
  return parseResearchJSON(text);
}

export async function researchIssue(issue: IssueInfo): Promise<ResearchResult> {
  console.log(`  [research] Analyzing issue #${issue.number}: ${issue.title}`);

  const commentsSummary = issue.comments
    .slice(0, 8)
    .map((c) => `  [${c.author}]: ${c.body.slice(0, 500)}`)
    .join("\n---\n");

  const prompt = `You are a senior QA engineer analyzing a GitHub issue for ComfyUI (a node-based AI image generation UI).

## Issue #${issue.number}: ${issue.title}
**URL**: ${issue.url}
**Author**: ${issue.author}
**Labels**: ${issue.labels.join(", ") || "none"}
**State**: ${issue.state}

## Issue Description
${issue.body.slice(0, 3000)}

## Comments (${issue.comments.length} total)
${commentsSummary || "(none)"}

---

Produce a comprehensive QA analysis as JSON with this exact schema:
{
  "summary": "2-3 sentence executive summary",
  "bugType": "bug|feature|regression|performance|unknown",
  "severity": "critical|high|medium|low",
  "affectedArea": "e.g. canvas, workflow tabs, sidebar, node editor",
  "reproductionSteps": ["step 1", "step 2", ...],
  "expectedBehavior": "what should happen",
  "actualBehavior": "what actually happens",
  "rootCauseSummary": "technical root cause hypothesis",
  "qaChecklist": [
    {
      "id": "QA-001",
      "category": "functional|visual|regression|edge_case|performance",
      "description": "test description",
      "steps": ["step 1", ...],
      "expectedResult": "expected outcome",
      "priority": "P0|P1|P2",
      "status": "pending"
    }
  ],
  "testScenarios": [
    {
      "name": "scenario name",
      "description": "what this tests",
      "preconditions": ["precondition 1", ...],
      "steps": ["step 1", ...],
      "expectedOutcome": "what should happen",
      "playwrightHint": "playwright selectors/actions hint"
    }
  ],
  "risks": ["risk 1", "risk 2"],
  "relatedFiles": []
}

Create 5-8 QA checklist items. Create 3-5 test scenarios. Be specific and actionable.`;

  const text = await callClaude(prompt);
  return parseResearchJSON(text);
}
