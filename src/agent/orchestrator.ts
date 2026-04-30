import * as path from "path";
import * as fs from "fs";
import { fetchPR, fetchIssue, parseRef, fetchDeploymentPreviewUrl } from "../utils/github";
import { detectRunningInstance, bootstrapWorkspace, type ComfyUIInstance, COMFYUI_REPOS, REPO_PROD_URLS } from "../utils/comfyui";
import { researchPR, researchIssue } from "./research";
import { startRecorder, navigateWithHUD } from "../browser/recorder";
import { runScenarioWithAgent, runScenarioResearchOnly, prePlanScenario, runScenarioWithPlan, type PlannedScenario } from "./browser-agent";
import { saveReport } from "../report/generate";
import { generateE2ETest } from "../report/e2e-test";
import { ensureQASkill } from "../utils/qa-skill";
import { cloneWorkspace } from "../utils/comfyui";
import { generateNarration, type NarrationSegment } from "../recorder/narration";
import { postMix } from "../recorder/post-mix";

export interface QAOptions {
  ref: string;        // "Comfy-Org/ComfyUI_frontend#9430" or issue ref
  type: "pr" | "issue" | "auto";
  record: boolean;
  outputBase: string;
  comfyUrl?: string;
}

export async function runQA(opts: QAOptions): Promise<void> {
  const { ref, record, outputBase } = opts;

  // 1. Parse ref
  const parsed = parseRef(ref);
  if (!parsed.number) throw new Error(`Ref must include a number: ${ref}`);

  // Ensure .comfy-qa/.gitignore exists to self-ignore all output
  fs.mkdirSync(outputBase, { recursive: true });
  const gitignorePath = path.join(outputBase, ".gitignore");
  if (!fs.existsSync(gitignorePath)) {
    fs.writeFileSync(gitignorePath, "*\n");
  }

  const slug = `${parsed.owner}-${parsed.repo}-${opts.type === "issue" ? "issue" : "pr"}-${parsed.number}`;
  const outputDir = path.join(outputBase, slug);
  fs.mkdirSync(outputDir, { recursive: true });

  console.log(`\n${"═".repeat(60)}`);
  console.log(`  Comfy-QA Agent`);
  console.log(`  Target: ${ref}`);
  console.log(`  Output: ${outputDir}`);
  console.log(`${"═".repeat(60)}\n`);

  // 2. Fetch target info
  let target: Awaited<ReturnType<typeof fetchPR>> | Awaited<ReturnType<typeof fetchIssue>>;
  let targetType: "pr" | "issue";

  if (opts.type === "pr" || opts.type === "auto") {
    try {
      console.log(`[1/5] Fetching PR data…`);
      target = await fetchPR(parsed.owner, parsed.repo, parsed.number);
      targetType = "pr";
    } catch {
      if (opts.type === "pr") throw new Error(`Could not fetch PR ${ref}`);
      console.log(`  PR not found, trying as issue…`);
      target = await fetchIssue(parsed.owner, parsed.repo, parsed.number);
      targetType = "issue";
    }
  } else {
    console.log(`[1/5] Fetching issue data…`);
    target = await fetchIssue(parsed.owner, parsed.repo, parsed.number);
    targetType = "issue";
  }
  console.log(`  ✓ ${target.title}`);

  // 3. Research phase
  console.log(`\n[2/5] Research phase — Claude analyzing ${targetType}…`);
  const research = targetType === "pr"
    ? await researchPR(target as Awaited<ReturnType<typeof fetchPR>>)
    : await researchIssue(target as Awaited<ReturnType<typeof fetchIssue>>);

  console.log(`  ✓ Severity: ${research.severity} | Area: ${research.affectedArea}`);
  console.log(`  ✓ ${research.qaChecklist.length} checklist items | ${research.testScenarios.length} test scenarios`);

  // 4. Browser recording phase
  let screenshots: string[] = [];
  let videoPath: string | undefined;
  const allLogs: string[] = [];

  if (record) {
    console.log(`\n[3/5] Recording phase — Playwright + HUD…`);

    // Resolve target URL:
    //   ComfyUI repos → detect local instance or bootstrap
    //   Other web-app repos → Vercel/preview URL from PR comments, then prod fallback
    let comfyUrl = opts.comfyUrl ?? null;
    let bootstrappedInstance: ComfyUIInstance | null = null;

    if (!comfyUrl) {
      if (COMFYUI_REPOS.has(parsed.repo)) {
        comfyUrl = await detectRunningInstance();
        if (!comfyUrl) {
          console.log(`  [bootstrap] No running ComfyUI — cloning & building target repo…`);
          const prBranch = targetType === "pr"
            ? (target as Awaited<ReturnType<typeof fetchPR>>).headRefName
            : undefined;

          const wsPath = await cloneWorkspace({
            owner: parsed.owner,
            repo: parsed.repo,
            outputBase,
            branch: prBranch,
            prNumber: targetType === "pr" ? parsed.number : undefined,
          });
          await ensureQASkill(wsPath);

          try {
            bootstrappedInstance = await bootstrapWorkspace({
              owner: parsed.owner,
              repo: parsed.repo,
              outputBase,
              branch: prBranch,
              prNumber: targetType === "pr" ? parsed.number : undefined,
            });
            comfyUrl = bootstrappedInstance.url;
          } catch (err) {
            console.log(`  [bootstrap] Failed: ${err}`);
            console.log(`  [bootstrap] Falling back to research-only mode`);
          }
        }
      } else {
        // Non-ComfyUI repo: use Vercel/preview URL or production fallback
        if (targetType === "pr") {
          console.log(`  [target] Fetching deployment preview URL from PR comments…`);
          comfyUrl = await fetchDeploymentPreviewUrl(parsed.owner, parsed.repo, parsed.number);
          if (comfyUrl) {
            console.log(`  [target] Preview URL: ${comfyUrl}`);
          }
        }
        if (!comfyUrl) {
          comfyUrl = REPO_PROD_URLS[parsed.repo] ?? null;
          if (comfyUrl) console.log(`  [target] Using production URL: ${comfyUrl}`);
        }
      }
    }

    // [3a] Pre-plan all scenario actions before recording (parallel LLM calls, no browser yet)
    let plans: PlannedScenario[] = [];
    if (comfyUrl) {
      console.log(`\n[3a/5] Pre-planning ${research.testScenarios.length} scenarios…`);
      plans = await Promise.all(
        research.testScenarios.map((s, i) => prePlanScenario(s, i, comfyUrl!))
      );
      console.log(`  ✓ Plans ready`);
    }

    // [3b] Record — execute pre-planned actions (no LLM calls on the hot path)
    // Narration is generated AFTER recording using real step timings for perfect sync.
    const session = await startRecorder(outputDir, `qa-${parsed.number}`);

    // Timing markers collected during recording, used for narration after
    const introStartMs = Date.now();
    let githubDoneMs = 0;
    let analysisDoneMs = 0;
    const scenarioStartMs: number[] = [];
    const stepTimings: number[][] = []; // [scenarioIdx][stepIdx] = elapsed ms

    try {
      await session.step(`Opening ${target.url}`);
      await navigateWithHUD(session, target.url, `QA: ${targetType.toUpperCase()} #${parsed.number}`);
      await session.plan(`Analyzing: ${target.title}`);
      await session.page.waitForTimeout(2000);
      githubDoneMs = Date.now();
      await session.screenshot("01-github-page");
      analysisDoneMs = Date.now();

      if (comfyUrl && plans.length > 0) {
        console.log(`  [mode] Pre-planned QA against ${comfyUrl}`);
        await session.step(`Navigating to ${comfyUrl}`);
        await navigateWithHUD(session, comfyUrl, `QA — ${targetType.toUpperCase()} #${parsed.number}`);
        await session.page.waitForTimeout(2000);
        await session.screenshot("02-target-loaded");

        for (const plan of plans) {
          scenarioStartMs.push(Date.now());
          const result = await runScenarioWithPlan(session, plan);
          stepTimings.push(result.stepTimingsMs);
          allLogs.push(...result.log);

          if (plan.scenarioIndex < plans.length - 1) {
            await session.page.goto(comfyUrl, { waitUntil: "domcontentloaded", timeout: 15000 });
            await session.page.waitForTimeout(500);
          }
        }
      } else if (comfyUrl) {
        // Fallback to live agent if pre-planning produced no plans
        console.log(`  [mode] Live agent QA against ${comfyUrl}`);
        await navigateWithHUD(session, comfyUrl, `QA — ${targetType.toUpperCase()} #${parsed.number}`);
        await session.page.waitForTimeout(2000);
        await session.screenshot("02-target-loaded");
        for (let i = 0; i < research.testScenarios.length; i++) {
          scenarioStartMs.push(Date.now());
          const result = await runScenarioWithAgent(session, research.testScenarios[i]!, i);
          stepTimings.push([]);
          allLogs.push(...result.log);
          if (i < research.testScenarios.length - 1) {
            await session.page.goto(comfyUrl, { waitUntil: "domcontentloaded", timeout: 15000 });
            await session.page.waitForTimeout(500);
          }
        }
      } else {
        console.log(`  [mode] Research-only (no target URL)`);
        await session.step("Scrolling through issue details");
        for (let scroll = 0; scroll < 3; scroll++) {
          await session.page.mouse.wheel(0, 400);
          await session.page.waitForTimeout(1000);
        }
        await session.screenshot("02-github-details");
        for (let i = 0; i < research.testScenarios.length; i++) {
          const result = await runScenarioResearchOnly(session, research.testScenarios[i]!, i);
          allLogs.push(...result.log);
        }
      }

      await session.step("QA Session complete");
      await session.status("QA finished");
      await session.page.waitForTimeout(1000);
      await session.screenshot("99-final");
      screenshots = session.screenshots;
    } finally {
      await session.stop();
      if (bootstrappedInstance) await bootstrappedInstance.stop();
      const webm = path.join(outputDir, `qa-${parsed.number}.webm`);
      if (fs.existsSync(webm)) videoPath = webm;
    }

    // [3c] Generate narration using REAL step timings measured during recording
    if (videoPath) {
      const recordingStart = introStartMs;
      const toVideoMs = (absMs: number) => Math.max(0, absMs - recordingStart);

      const narrationSegments: NarrationSegment[] = [
        {
          id: "intro",
          text: `Welcome to comfy QA. Reviewing ${targetType} ${parsed.number}: ${target.title.slice(0, 100)}`,
          startMs: 0,
        },
        {
          id: "github",
          text: `First, the GitHub ${targetType} page for context.`,
          startMs: toVideoMs(githubDoneMs),
        },
        {
          id: "analysis",
          text: `Severity ${research.severity}. Affected area: ${research.affectedArea}.`,
          startMs: toVideoMs(analysisDoneMs),
        },
        ...research.testScenarios.flatMap((s, i): NarrationSegment[] => {
          const scenStepTimings = stepTimings[i] ?? [];
          const scenStart = scenarioStartMs[i] ?? analysisDoneMs;
          // Accumulate step start times within the scenario
          let stepCursor = toVideoMs(scenStart);
          return [
            {
              id: `scenario-${i + 1}-intro`,
              text: `Scenario ${i + 1}: ${s.name}. ${s.description.slice(0, 120)}`,
              startMs: stepCursor,
            },
            ...s.steps.slice(0, 5).map((step, j) => {
              const start = stepCursor;
              stepCursor += scenStepTimings[j] ?? 2000;
              return {
                id: `scenario-${i + 1}-step-${j + 1}`,
                text: `Step ${j + 1}: ${step.slice(0, 150)}`,
                startMs: start,
              };
            }),
          ];
        }),
        { id: "outro", text: `QA session complete. Report and video evidence saved.`, startMs: toVideoMs(Date.now()) },
      ];

      try {
        console.log(`\n[3d/5] Generating narration from real timings…`);
        const narration = await generateNarration(narrationSegments, outputDir);
        if (narration) {
          const finalPath = path.join(outputDir, `qa-${parsed.number}.mp4`);
          await postMix(videoPath, narration.trackPath, narration.metaPath, 0, finalPath);
          videoPath = finalPath;
        }
      } catch (err) {
        console.log(`  [narration] Failed: ${String(err).slice(0, 200)}`);
      }
    }

    // Save agent logs
    if (allLogs.length > 0) {
      const logPath = path.join(outputDir, "agent-log.txt");
      fs.writeFileSync(logPath, allLogs.join("\n"));
      console.log(`  [log] ${logPath}`);
    }
  } else {
    console.log(`\n[3/5] Skipping recording (use --record to enable)`);
  }

  // 5. Generate E2E test file
  const e2eTestCode = generateE2ETest(target, targetType, research);
  const e2eTestPath = path.join(outputDir, `${targetType}-${parsed.number}.e2e.ts`);
  fs.writeFileSync(e2eTestPath, e2eTestCode);
  console.log(`  [e2e] ${e2eTestPath}`);

  // 6. Report generation
  console.log(`\n[5/5] Generating report…`);
  const result = saveReport({
    target,
    targetType,
    research,
    outputDir,
    screenshots,
    videoPath,
    runAt: new Date(),
  });

  // Summary
  console.log(`\n${"═".repeat(60)}`);
  console.log(`  ✅ QA Complete`);
  console.log(`  Report:   ${result.reportPath}`);
  console.log(`  QA Sheet: ${result.qaSheetPath}`);
  if (videoPath) console.log(`  Video:    ${videoPath}`);
  if (screenshots.length > 0) console.log(`  Screenshots: ${screenshots.length} files`);
  console.log(`${"═".repeat(60)}\n`);
}
