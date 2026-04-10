/**
 * Demo Editor Agent — reads actions.jsonl from research, scores segments,
 * and assembles a final polished MP4 using ffmpeg.
 *
 * Output:
 *   - final_demo.mp4    (polished video with cuts + cards)
 *   - edit_plan.json     (the editing decisions made)
 *
 * Usage:
 *   bun src/agent/demo-editor.ts .comfy-qa/.research/comfy-registry/
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { $ } from "bun";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ActionLogEntry {
  ts: number;
  offsetMs: number;
  type: string;
  feature?: string;
  chapter?: string;
  action?: string;
  selector?: string;
  text?: string;
  success?: boolean;
  error?: string;
  screenshot?: string;
}

interface Segment {
  feature: string;
  chapter: string;
  startMs: number;
  endMs: number;
  narration: string;
  actions: ActionLogEntry[];
  success: boolean;
  hasError: boolean;
  retryCount: number;
}

interface EditDecision {
  segment: Segment;
  action: "keep" | "trim" | "cut";
  reason: string;
  trimStartMs?: number;
  trimEndMs?: number;
}

interface EditPlan {
  product: string;
  totalRawMs: number;
  segments: EditDecision[];
  finalSegments: EditDecision[];
  estimatedFinalMs: number;
}

// ---------------------------------------------------------------------------
// Parse actions.jsonl into segments
// ---------------------------------------------------------------------------

function parseLog(logPath: string): ActionLogEntry[] {
  const lines = fs.readFileSync(logPath, "utf-8").trim().split("\n");
  return lines.map((l) => JSON.parse(l) as ActionLogEntry);
}

function groupIntoSegments(entries: ActionLogEntry[]): Segment[] {
  const segments: Segment[] = [];
  let current: Partial<Segment> | null = null;
  let currentChapter = "";

  for (const entry of entries) {
    if (entry.type === "chapter_start") {
      currentChapter = entry.chapter ?? "";
    }

    if (entry.type === "feature_start") {
      current = {
        feature: entry.feature ?? "",
        chapter: currentChapter,
        startMs: entry.offsetMs,
        endMs: entry.offsetMs,
        narration: "",
        actions: [],
        success: false,
        hasError: false,
        retryCount: 0,
      };
    }

    if (current) {
      current.actions!.push(entry);
      current.endMs = entry.offsetMs;

      if (entry.type === "narrate" && !current.narration) {
        current.narration = entry.text ?? "";
      }
      if (entry.type === "error") {
        current.hasError = true;
        current.retryCount = (current.retryCount ?? 0) + 1;
      }
    }

    if (entry.type === "feature_end" && current) {
      current.success = entry.success ?? false;
      current.endMs = entry.offsetMs;
      segments.push(current as Segment);
      current = null;
    }
  }

  return segments;
}

// ---------------------------------------------------------------------------
// Score and decide
// ---------------------------------------------------------------------------

/** Find the first narration timestamp in a segment's actions */
function findFirstNarration(seg: Segment): ActionLogEntry | undefined {
  return seg.actions.find((a) => a.type === "narrate");
}

/** Find the last narration timestamp in a segment's actions */
function findLastNarration(seg: Segment): ActionLogEntry | undefined {
  return [...seg.actions].reverse().find((a) => a.type === "narrate");
}

function scoreSegment(seg: Segment): EditDecision {
  const durationMs = seg.endMs - seg.startMs;
  const firstNarration = findFirstNarration(seg);

  // Failed entirely
  if (!seg.success) {
    return { segment: seg, action: "cut", reason: "Feature demonstration failed" };
  }

  // Too short (likely just a hover)
  if (durationMs < 1500) {
    return { segment: seg, action: "cut", reason: "Too short to be meaningful" };
  }

  // Perfect: succeeded on first try, has narration, reasonable duration
  if (!seg.hasError && seg.narration && durationMs > 2000 && durationMs < 30000) {
    // Trim leading silence: start from 1s before first narration instead of segment start
    if (firstNarration && (firstNarration.offsetMs - seg.startMs) > 2000) {
      const trimStart = Math.max(seg.startMs, firstNarration.offsetMs - 1000);
      return {
        segment: seg,
        action: "trim",
        reason: "Clean success, trimming leading silence before narration",
        trimStartMs: trimStart,
        trimEndMs: seg.endMs,
      };
    }
    return { segment: seg, action: "keep", reason: "Clean success with narration" };
  }

  // Success but had errors (retries) — trim to last successful narration
  if (seg.hasError) {
    const lastNarrate = findLastNarration(seg);
    if (lastNarrate) {
      // Start 1s before the last narration for visual context
      const trimStart = Math.max(seg.startMs, lastNarrate.offsetMs - 1000);
      return {
        segment: seg,
        action: "trim",
        reason: `Had ${seg.retryCount} retries, trimming to last successful narration`,
        trimStartMs: trimStart,
        trimEndMs: seg.endMs,
      };
    }
    return { segment: seg, action: "keep", reason: "Success with retries, keeping full" };
  }

  // Too long (agent got stuck) — trim starting from first narration
  if (durationMs > 45000) {
    const trimStart = firstNarration
      ? Math.max(seg.startMs, firstNarration.offsetMs - 1000)
      : seg.startMs;
    return {
      segment: seg,
      action: "trim",
      reason: "Too long — trimming from first narration",
      trimStartMs: trimStart,
      trimEndMs: Math.min(seg.endMs, trimStart + 25000),
    };
  }

  return { segment: seg, action: "keep", reason: "Default keep" };
}

function createEditPlan(entries: ActionLogEntry[]): EditPlan {
  const segments = groupIntoSegments(entries);
  const decisions = segments.map(scoreSegment);
  const finalSegments = decisions.filter((d) => d.action !== "cut");
  const totalRawMs = entries.length > 0 ? entries[entries.length - 1].offsetMs : 0;
  const estimatedFinalMs = finalSegments.reduce((acc, d) => {
    if (d.action === "trim" && d.trimStartMs !== undefined && d.trimEndMs !== undefined) {
      return acc + (d.trimEndMs - d.trimStartMs);
    }
    return acc + (d.segment.endMs - d.segment.startMs);
  }, 0);

  return {
    product: "",
    totalRawMs,
    segments: decisions,
    finalSegments,
    estimatedFinalMs,
  };
}

// ---------------------------------------------------------------------------
// Generate ffmpeg cut list
// ---------------------------------------------------------------------------

function generateFfmpegScript(plan: EditPlan, rawVideoPath: string, outputPath: string): string {
  // Build a concat filter with segments
  const parts: string[] = [];

  for (let i = 0; i < plan.finalSegments.length; i++) {
    const d = plan.finalSegments[i];
    const startSec = ((d.action === "trim" && d.trimStartMs !== undefined ? d.trimStartMs : d.segment.startMs) / 1000).toFixed(3);
    const endSec = ((d.action === "trim" && d.trimEndMs !== undefined ? d.trimEndMs : d.segment.endMs) / 1000).toFixed(3);
    parts.push(`-ss ${startSec} -to ${endSec} -i "${rawVideoPath}"`);
  }

  // If we have audio
  const audioPath = rawVideoPath.replace("raw_video.webm", "narration.wav");
  const hasAudio = fs.existsSync(audioPath);

  if (plan.finalSegments.length === 0) {
    return `# No segments to keep\necho "No usable segments found"`;
  }

  // Simple approach: use ffmpeg concat demuxer
  const concatListPath = outputPath.replace(".mp4", "-segments.txt");
  const segmentCmds: string[] = [];

  // Cut each segment from BOTH video and audio at the same timestamps
  for (let i = 0; i < plan.finalSegments.length; i++) {
    const d = plan.finalSegments[i];
    const startSec = ((d.action === "trim" && d.trimStartMs !== undefined ? d.trimStartMs : d.segment.startMs) / 1000).toFixed(3);
    const endSec = ((d.action === "trim" && d.trimEndMs !== undefined ? d.trimEndMs : d.segment.endMs) / 1000).toFixed(3);
    const segFile = outputPath.replace(".mp4", `-seg${i}.mp4`);

    if (hasAudio) {
      // Cut video + audio at the SAME timestamps, then mux together — keeps sync
      segmentCmds.push(
        `ffmpeg -y -ss ${startSec} -to ${endSec} -i "${rawVideoPath}" -ss ${startSec} -to ${endSec} -i "${audioPath}" ` +
        `-map 0:v -map 1:a -c:v libx264 -preset fast -c:a aac -b:a 128k -shortest "${segFile}"`
      );
    } else {
      segmentCmds.push(`ffmpeg -y -ss ${startSec} -to ${endSec} -i "${rawVideoPath}" -c:v libx264 -preset fast "${segFile}"`);
    }
  }

  const concatEntries = plan.finalSegments.map((_, i) => `file '${outputPath.replace(".mp4", `-seg${i}.mp4`)}'`);

  return `#!/bin/bash
set -e

# Cut individual segments (video + audio synced at same timestamps)
${segmentCmds.join("\n")}

# Create concat list
cat > "${concatListPath}" << 'CONCAT'
${concatEntries.join("\n")}
CONCAT

# Concatenate all segments into final video
ffmpeg -y -f concat -safe 0 -i "${concatListPath}" -c copy "${outputPath}"

echo "✅ Final video: ${outputPath}"

# Cleanup
rm -f ${plan.finalSegments.map((_, i) => `"${outputPath.replace(".mp4", `-seg${i}.mp4`)}"`).join(" ")}
rm -f "${concatListPath}"
`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export async function editDemoResearch(researchDir: string) {
  const logPath = path.join(researchDir, "actions.jsonl");
  if (!fs.existsSync(logPath)) {
    console.error(`No actions.jsonl found in ${researchDir}`);
    process.exit(1);
  }

  console.log(`\n✂️  Editor Agent: processing ${researchDir}\n`);

  // Parse and plan
  const entries = parseLog(logPath);
  const plan = createEditPlan(entries);

  console.log(`  📊 Raw footage: ${(plan.totalRawMs / 1000).toFixed(1)}s`);
  console.log(`  📊 Segments found: ${plan.segments.length}`);
  console.log(`  ✅ Keep: ${plan.segments.filter((d) => d.action === "keep").length}`);
  console.log(`  ✂️  Trim: ${plan.segments.filter((d) => d.action === "trim").length}`);
  console.log(`  ❌ Cut: ${plan.segments.filter((d) => d.action === "cut").length}`);
  console.log(`  📊 Estimated final: ${(plan.estimatedFinalMs / 1000).toFixed(1)}s`);

  // Save edit plan
  const planPath = path.join(researchDir, "edit_plan.json");
  fs.writeFileSync(planPath, JSON.stringify(plan, null, 2));
  console.log(`  📋 Plan: ${planPath}`);

  // Generate ffmpeg script
  const rawVideoPath = path.join(researchDir, "raw_video.webm");
  const outputPath = path.join(researchDir, "final_demo.mp4");

  if (fs.existsSync(rawVideoPath)) {
    const scriptPath = path.join(researchDir, "edit.sh");
    const script = generateFfmpegScript(plan, rawVideoPath, outputPath);
    fs.writeFileSync(scriptPath, script, { mode: 0o755 });
    console.log(`  🎬 Script: ${scriptPath}`);
    console.log(`\n  Run: bash ${scriptPath}\n`);

    // Auto-run if possible
    try {
      console.log("  ⏳ Running ffmpeg...");
      await $`bash ${scriptPath}`.quiet();
      console.log(`  ✅ Final video: ${outputPath}`);
    } catch (err: any) {
      console.log(`  ⚠ ffmpeg failed — run manually: bash ${scriptPath}`);
    }
  } else {
    console.log(`  ⚠ No raw_video.webm found — skipping video assembly`);
  }

  // Print segment report
  console.log("\n  ─── Segment Report ───");
  for (const d of plan.segments) {
    const dur = ((d.segment.endMs - d.segment.startMs) / 1000).toFixed(1);
    const icon = d.action === "keep" ? "✅" : d.action === "trim" ? "✂️" : "❌";
    console.log(`  ${icon} [${dur}s] ${d.segment.chapter} / ${d.segment.feature}: ${d.reason}`);
  }
  console.log("");
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

if (import.meta.main) {
  const dir = process.argv[2];
  if (!dir) {
    console.error("Usage: bun src/agent/demo-editor.ts <research-dir>");
    process.exit(1);
  }
  editDemoResearch(path.resolve(dir)).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
