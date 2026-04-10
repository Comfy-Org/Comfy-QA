/**
 * Demo Editor Agent — reads actions.jsonl from research, extracts active
 * bursts (narration + surrounding actions), removes LLM thinking gaps,
 * and assembles a tight final MP4 using ffmpeg.
 *
 * Key improvement: instead of keeping whole feature segments (which include
 * 15-30s LLM response wait times), we extract only the "activity bursts"
 * — windows around narrations and actions where something is actually
 * happening on screen.
 *
 * Output:
 *   - final_demo.mp4    (polished video with idle time removed)
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

/** A burst is a tight window of activity within a segment */
interface Burst {
  feature: string;
  chapter: string;
  startMs: number;
  endMs: number;
  hasNarration: boolean;
  eventCount: number;
}

interface EditPlan {
  product: string;
  totalRawMs: number;
  segments: { feature: string; chapter: string; success: boolean; durationMs: number; action: string; reason: string }[];
  bursts: Burst[];
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
// Extract activity bursts from segments
// ---------------------------------------------------------------------------

const BURST_PAD_BEFORE = 1000;  // 1s padding before first event in burst
const BURST_PAD_AFTER = 1500;   // 1.5s padding after last event in burst
const MIN_BURST_MS = 3000;      // Minimum burst duration

interface TimedEvent {
  offsetMs: number;
  endMs: number;
  type: string;
  text?: string;
}

/**
 * Extract activity bursts from a segment.
 *
 * For narrations, we estimate end time as the time of the next event
 * (since the agent waits for TTS playback before proceeding).
 * For actions, we use a small duration (500ms).
 *
 * Events that overlap or are close (within GAP_TOLERANCE) form one burst.
 * Gaps longer than that (typically LLM thinking time) are cut.
 */
function extractBursts(seg: Segment): Burst[] {
  // Collect all meaningful events (narrate, action, screenshot)
  const rawEvents = seg.actions.filter(
    (a) => a.type === "narrate" || (a.type === "action" && a.success !== false),
  );

  if (rawEvents.length === 0) return [];

  // Build timed events: narration endMs = next event's timestamp (TTS plays until then)
  const events: TimedEvent[] = [];
  for (let i = 0; i < rawEvents.length; i++) {
    const a = rawEvents[i];
    if (a.type === "narrate") {
      // Estimate TTS duration from word count (~150 wpm)
      const words = (a.text ?? "").split(/\s+/).length;
      const ttsDurMs = Math.max(2500, (words / 150) * 60 * 1000);

      // Also find the next meaningful event timestamp
      const idx = seg.actions.indexOf(a);
      let nextTs = Infinity;
      for (let j = idx + 1; j < seg.actions.length; j++) {
        const n = seg.actions[j];
        if (n.type === "narrate" || n.type === "action") {
          nextTs = n.offsetMs;
          break;
        }
      }

      // Use the SHORTER of: estimated TTS duration, or time until next event.
      // This avoids including LLM thinking time that happens after TTS finishes.
      const endMs = a.offsetMs + Math.min(ttsDurMs, nextTs === Infinity ? ttsDurMs : nextTs - a.offsetMs);
      events.push({ offsetMs: a.offsetMs, endMs, type: "narrate", text: a.text });
    } else {
      events.push({ offsetMs: a.offsetMs, endMs: a.offsetMs + 500, type: "action" });
    }
  }

  events.sort((a, b) => a.offsetMs - b.offsetMs);

  // Merge events into bursts. Gap tolerance: 3s (covers visual pause between actions).
  // Anything longer = LLM thinking time, which we want to cut.
  const GAP_TOLERANCE = 3000;
  const groups: TimedEvent[][] = [[events[0]]];
  let groupEnd = events[0].endMs;

  for (let i = 1; i < events.length; i++) {
    if (events[i].offsetMs <= groupEnd + GAP_TOLERANCE) {
      groups[groups.length - 1].push(events[i]);
      groupEnd = Math.max(groupEnd, events[i].endMs);
    } else {
      groups.push([events[i]]);
      groupEnd = events[i].endMs;
    }
  }

  return groups.map((g) => {
    const firstStart = g[0].offsetMs;
    const lastEnd = Math.max(...g.map((e) => e.endMs));
    const startMs = Math.max(seg.startMs, firstStart - BURST_PAD_BEFORE);
    const endMs = Math.min(seg.endMs, lastEnd + BURST_PAD_AFTER);
    const hasNarration = g.some((e) => e.type === "narrate");
    return {
      feature: seg.feature,
      chapter: seg.chapter,
      startMs,
      endMs: Math.max(endMs, startMs + MIN_BURST_MS),
      hasNarration,
      eventCount: g.length,
    };
  });
}

// ---------------------------------------------------------------------------
// Build edit plan
// ---------------------------------------------------------------------------

function createEditPlan(entries: ActionLogEntry[]): EditPlan {
  const segments = groupIntoSegments(entries);
  const totalRawMs = entries.length > 0 ? entries[entries.length - 1].offsetMs : 0;

  const segmentReports: EditPlan["segments"] = [];
  const allBursts: Burst[] = [];

  for (const seg of segments) {
    const durationMs = seg.endMs - seg.startMs;

    if (!seg.success) {
      segmentReports.push({
        feature: seg.feature,
        chapter: seg.chapter,
        success: false,
        durationMs,
        action: "cut",
        reason: "Feature demonstration failed",
      });
      continue;
    }

    if (durationMs < 1500) {
      segmentReports.push({
        feature: seg.feature,
        chapter: seg.chapter,
        success: true,
        durationMs,
        action: "cut",
        reason: "Too short to be meaningful",
      });
      continue;
    }

    const bursts = extractBursts(seg);
    // Only keep bursts that have narration (visual-only bursts are usually noise)
    const goodBursts = bursts.filter((b) => b.hasNarration);

    if (goodBursts.length === 0) {
      // Fallback: keep all bursts if none have narration
      const fallback = bursts.length > 0 ? bursts : [];
      allBursts.push(...fallback);
      segmentReports.push({
        feature: seg.feature,
        chapter: seg.chapter,
        success: true,
        durationMs,
        action: fallback.length > 0 ? "burst" : "cut",
        reason: fallback.length > 0
          ? `No narrated bursts, keeping ${fallback.length} action bursts`
          : "No usable bursts",
      });
    } else {
      allBursts.push(...goodBursts);
      const burstMs = goodBursts.reduce((a, b) => a + (b.endMs - b.startMs), 0);
      const saved = durationMs - burstMs;
      segmentReports.push({
        feature: seg.feature,
        chapter: seg.chapter,
        success: true,
        durationMs,
        action: "burst",
        reason: `${goodBursts.length} burst(s), ${(burstMs / 1000).toFixed(1)}s kept, ${(saved / 1000).toFixed(1)}s idle removed`,
      });
    }
  }

  const estimatedFinalMs = allBursts.reduce((a, b) => a + (b.endMs - b.startMs), 0);

  return {
    product: "",
    totalRawMs,
    segments: segmentReports,
    bursts: allBursts,
    estimatedFinalMs,
  };
}

// ---------------------------------------------------------------------------
// Generate ffmpeg script
// ---------------------------------------------------------------------------

function generateFfmpegScript(plan: EditPlan, rawVideoPath: string, outputPath: string): string {
  const audioPath = rawVideoPath.replace("raw_video.webm", "narration.wav");
  const hasAudio = fs.existsSync(audioPath);

  if (plan.bursts.length === 0) {
    return `#!/bin/bash\necho "No usable bursts found"`;
  }

  const concatListPath = outputPath.replace(".mp4", "-segments.txt");
  const segmentCmds: string[] = [];

  for (let i = 0; i < plan.bursts.length; i++) {
    const b = plan.bursts[i];
    const startSec = (b.startMs / 1000).toFixed(3);
    const endSec = (b.endMs / 1000).toFixed(3);
    const segFile = outputPath.replace(".mp4", `-seg${i}.mp4`);

    if (hasAudio) {
      segmentCmds.push(
        `ffmpeg -y -ss ${startSec} -to ${endSec} -i "${rawVideoPath}" ` +
        `-ss ${startSec} -to ${endSec} -i "${audioPath}" ` +
        `-map 0:v -map 1:a -c:v libx264 -preset fast -c:a aac -b:a 128k -shortest "${segFile}"`,
      );
    } else {
      segmentCmds.push(
        `ffmpeg -y -ss ${startSec} -to ${endSec} -i "${rawVideoPath}" ` +
        `-c:v libx264 -preset fast "${segFile}"`,
      );
    }
  }

  const concatEntries = plan.bursts.map((_, i) =>
    `file '${outputPath.replace(".mp4", `-seg${i}.mp4`)}'`,
  );

  return `#!/bin/bash
set -e

# Cut individual bursts (video + audio synced at same timestamps)
${segmentCmds.join("\n")}

# Create concat list
cat > "${concatListPath}" << 'CONCAT'
${concatEntries.join("\n")}
CONCAT

# Concatenate all bursts into final video
ffmpeg -y -f concat -safe 0 -i "${concatListPath}" -c copy "${outputPath}"

echo "Final video: ${outputPath}"

# Cleanup
rm -f ${plan.bursts.map((_, i) => `"${outputPath.replace(".mp4", `-seg${i}.mp4`)}"`).join(" ")}
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

  console.log(`\n  Editor Agent: processing ${researchDir}\n`);

  // Parse and plan
  const entries = parseLog(logPath);
  const plan = createEditPlan(entries);

  const rawSec = (plan.totalRawMs / 1000).toFixed(1);
  const finalSec = (plan.estimatedFinalMs / 1000).toFixed(1);
  const ratio = plan.totalRawMs > 0 ? ((1 - plan.estimatedFinalMs / plan.totalRawMs) * 100).toFixed(0) : "0";

  console.log(`  Raw footage:  ${rawSec}s`);
  console.log(`  Final video:  ${finalSec}s  (${ratio}% idle removed)`);
  console.log(`  Bursts:       ${plan.bursts.length}`);
  console.log(`  Segments:     ${plan.segments.length} features`);

  // Save edit plan
  const planPath = path.join(researchDir, "edit_plan.json");
  fs.writeFileSync(planPath, JSON.stringify(plan, null, 2));
  console.log(`  Plan: ${planPath}`);

  // Generate ffmpeg script
  const rawVideoPath = path.join(researchDir, "raw_video.webm");
  const outputPath = path.join(researchDir, "final_demo.mp4");

  if (fs.existsSync(rawVideoPath)) {
    const scriptPath = path.join(researchDir, "edit.sh");
    const script = generateFfmpegScript(plan, rawVideoPath, outputPath);
    fs.writeFileSync(scriptPath, script, { mode: 0o755 });
    console.log(`  Script: ${scriptPath}\n`);

    try {
      console.log("  Running ffmpeg...");
      await $`bash ${scriptPath}`.quiet();
      console.log(`  Done: ${outputPath}`);
    } catch (err: any) {
      console.log(`  ffmpeg failed — run manually: bash ${scriptPath}`);
    }
  } else {
    console.log(`  No raw_video.webm found — skipping video assembly`);
  }

  // Print segment report
  console.log("\n  --- Segment Report ---");
  for (const s of plan.segments) {
    const dur = (s.durationMs / 1000).toFixed(1);
    const icon = s.action === "cut" ? "X" : "OK";
    console.log(`  [${icon}] [${dur}s] ${s.chapter} / ${s.feature}: ${s.reason}`);
  }

  // Print burst details
  console.log("\n  --- Burst Detail ---");
  for (const b of plan.bursts) {
    const dur = ((b.endMs - b.startMs) / 1000).toFixed(1);
    console.log(`  [${dur}s] ${b.chapter} / ${b.feature} (${b.eventCount} events${b.hasNarration ? ", narrated" : ""})`);
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
