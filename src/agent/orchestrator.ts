import * as path from "path";
import * as fs from "fs";
import { fetchPR, fetchIssue, parseRef } from "../utils/github";
import { detectRunningInstance, bootstrapWorkspace, type ComfyUIInstance } from "../utils/comfyui";
import { researchPR, researchIssue } from "./research";
import { startRecorder, navigateWithHUD } from "../browser/recorder";
import { runScenarioWithAgent, runScenarioResearchOnly } from "./browser-agent";
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

    // Resolve ComfyUI URL: explicit flag → auto-detect → auto-bootstrap
    let comfyUrl = opts.comfyUrl || await detectRunningInstance();
    let bootstrappedInstance: ComfyUIInstance | null = null;

    if (!comfyUrl) {
      // Auto clone + build the target repo
      console.log(`  [bootstrap] No running instance — cloning & building target repo…`);
      const prBranch = targetType === "pr"
        ? (target as Awaited<ReturnType<typeof fetchPR>>).headRefName
        : undefined;

      // Clone workspace first so we can set up QA skill before bootstrapping
      const wsPath = await cloneWorkspace({
        owner: parsed.owner,
        repo: parsed.repo,
        outputBase,
        branch: prBranch,
        prNumber: targetType === "pr" ? parsed.number : undefined,
      });

      // Ensure QA skill exists (creates comfy-qa branch + generates files if missing)
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

    // Pre-generate narration BEFORE recording (so durations are known)
    const narrationSegments: NarrationSegment[] = [
      { id: "intro", text: `Welcome to comfy QA. Let's review ${targetType} number ${parsed.number}: ${target.title.slice(0, 100)}` },
      { id: "github", text: `First, let's look at the GitHub ${targetType} page for context.` },
      { id: "analysis", text: `Severity ${research.severity}. Affected area: ${research.affectedArea}.` },
      ...research.testScenarios.flatMap((s, i): NarrationSegment[] => [
        { id: `scenario-${i + 1}-intro`, text: `Scenario ${i + 1}: ${s.name}. ${s.description}` },
        ...s.steps.slice(0, 5).map((step, j) => ({
          id: `scenario-${i + 1}-step-${j + 1}`,
          text: `Step ${j + 1}: ${step.slice(0, 150)}`,
        })),
      ]),
      { id: "outro", text: `QA session complete. Report and video evidence saved.` },
    ];

    const narration = await generateNarration(narrationSegments, outputDir);

    const session = await startRecorder(outputDir, `qa-${parsed.number}`);
    if (narration) session.attachNarration(narration.durations);
    const ffmpegStartMs = Date.now();

    try {
      // Screenshot the GitHub page for evidence
      if (narration) await session.narrate("intro", `Opening ${target.url}`);
      else await session.step(`Opening ${target.url}`);
      await navigateWithHUD(session, target.url, `QA: ${targetType.toUpperCase()} #${parsed.number}`);
      await session.plan(`Analyzing: ${target.title}`);
      if (narration) await session.narrate("github", "Inspecting GitHub page");
      else await session.page.waitForTimeout(2000);
      if (narration) await session.narrate("analysis", `${research.severity} severity`);
      await session.screenshot("01-github-page");

      if (comfyUrl) {
        // ── ComfyUI available: AI agent drives the browser ──
        console.log(`  [mode] Agent-driven QA against ${comfyUrl}`);
        await session.step(`Navigating to ComfyUI at ${comfyUrl}`);
        await navigateWithHUD(session, comfyUrl, `ComfyUI QA — ${targetType.toUpperCase()} #${parsed.number}`);
        await session.page.waitForTimeout(2000);
        await session.screenshot("02-comfyui-loaded");

        for (let i = 0; i < research.testScenarios.length; i++) {
          const scenario = research.testScenarios[i];
          console.log(`  [scenario ${i + 1}/${research.testScenarios.length}] ${scenario.name}`);

          const result = await runScenarioWithAgent(session, scenario, i);
          allLogs.push(...result.log);

          if (i < research.testScenarios.length - 1) {
            await session.page.goto(comfyUrl, { waitUntil: "domcontentloaded", timeout: 15000 });
            await session.page.waitForTimeout(1000);
          }
        }
      } else {
        // ── No ComfyUI: research-only recording with GitHub evidence ──
        console.log(`  [mode] Research-only (no ComfyUI instance available)`);

        await session.step("Scrolling through issue details");
        for (let scroll = 0; scroll < 3; scroll++) {
          await session.page.mouse.wheel(0, 400);
          await session.page.waitForTimeout(1000);
        }
        await session.screenshot("02-github-details");

        for (let i = 0; i < research.testScenarios.length; i++) {
          const scenario = research.testScenarios[i];
          console.log(`  [scenario ${i + 1}/${research.testScenarios.length}] ${scenario.name} (planned)`);

          if (narration) {
            await session.narrate(`scenario-${i + 1}-intro`, `Scenario ${i + 1}: ${scenario.name}`);
            for (let j = 0; j < Math.min(scenario.steps.length, 5); j++) {
              await session.narrate(`scenario-${i + 1}-step-${j + 1}`, `Step ${j + 1}: ${scenario.steps[j].slice(0, 80)}`);
            }
            await session.screenshot(`scenario-${String(i + 1).padStart(2, "0")}-plan`);
          } else {
            const result = await runScenarioResearchOnly(session, scenario, i);
            allLogs.push(...result.log);
          }
        }
      }

      if (narration) await session.narrate("outro", "QA Session complete");
      else await session.step("QA Session complete");
      await session.status(comfyUrl ? "Agent-driven QA finished" : "Research-only QA finished");
      await session.page.waitForTimeout(1500);
      await session.screenshot("99-final");
      screenshots = session.screenshots;
    } finally {
      const demoStartMs = session.getDemoStartMs();
      await session.stop();
      if (bootstrappedInstance) {
        await bootstrappedInstance.stop();
      }
      const webm = path.join(outputDir, `qa-${parsed.number}.webm`);
      if (fs.existsSync(webm)) videoPath = webm;

      // Post-mix narration onto the recorded video
      if (narration && videoPath) {
        try {
          const offsetMs = Math.max(0, demoStartMs - ffmpegStartMs);
          const finalPath = path.join(outputDir, `qa-${parsed.number}-narrated.mp4`);
          await postMix(videoPath, narration.trackPath, narration.metaPath, offsetMs, finalPath);
          videoPath = finalPath;
        } catch (err) {
          console.log(`  [post-mix] Failed: ${String(err).slice(0, 200)}`);
        }
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
