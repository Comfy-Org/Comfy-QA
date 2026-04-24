/**
 * Evaluate demo video quality using Gemini's vision model.
 * Reads all .mp4 files in .comfy-qa/.demos/ and asks Gemini to review each one.
 *
 * Usage: bun demo/evaluate-demos.ts
 */
import * as fs from "fs";
import * as path from "path";

const DEMOS_DIR = process.env.DEMOS_DIR
  ? path.resolve(process.env.DEMOS_DIR)
  : path.resolve(import.meta.dirname!, "..", ".comfy-qa", ".demos");
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-2.5-flash";

if (!GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY not set");
  process.exit(1);
}

interface EvalResult {
  file: string;
  sizeMB: string;
  score: number;
  actionSync: number;
  summary: string;
}

async function evaluateVideo(mp4Path: string): Promise<EvalResult> {
  const filename = path.basename(mp4Path);
  const stat = fs.statSync(mp4Path);
  const sizeMB = (stat.size / 1024 / 1024).toFixed(1);
  const videoB64 = fs.readFileSync(mp4Path).toString("base64");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;
  const body = {
    contents: [
      {
        parts: [
          { inlineData: { mimeType: "video/mp4", data: videoB64 } },
          {
            text: `You are a STRICT QA reviewer for automated browser demo videos. Your job is to catch problems, not praise. Most AI-generated demos have serious issues.

SCORE HARSHLY. A 9-10 is reserved for demos that could ship to a customer TODAY with zero edits. Most demos score 4-7.

Key failure modes to watch for:
- **Narration says an action but nothing happens on screen** (e.g., "I'm typing controlnet" but no typing occurs) → this alone should drop the score to 3 or below
- **Cursor moves randomly** instead of pointing at what the narration describes → score 4 or below
- **Narration describes UI elements that don't exist on screen** → score 3 or below
- **Blank/white screen** for any portion → score 1-2
- **No audio or silent narration** → score 4 or below

Scoring rubric (be strict):
1. **Action-narration sync (1-10)**: THE MOST IMPORTANT. When narration says "I'm clicking X", does the cursor click X? When it says "typing controlnet", does text appear? Score 1 if narration describes actions not performed.
2. **Visual clarity (1-10)**: Is content readable? Any glitches, blank screens?
3. **Pacing (1-10)**: Natural pace? Dead time?
4. **Completeness (1-10)**: Does the demo actually demonstrate the feature, or just show a static page?
5. **Overall (1-10)**: Would you send this to a customer? Be honest.

The overall score is NOT an average — it should be DRAGGED DOWN by the worst category. A demo with perfect visuals but zero action sync should score 2-3 overall.

Respond in this exact JSON format (no markdown fences):
{"score": <1-10>, "actionSync": <1-10>, "visual": <1-10>, "pacing": <1-10>, "completeness": <1-10>, "summary": "<2-3 sentences explaining the biggest problems>"}`,
          },
        ],
      },
    ],
    generationConfig: { temperature: 0.1, maxOutputTokens: 2048 },
  };

  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(120_000),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    return { file: filename, sizeMB, score: 0, actionSync: 0, summary: `API error ${resp.status}: ${errText.slice(0, 200)}` };
  }

  const data: any = await resp.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  try {
    const cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "");
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in response");
    const parsed = JSON.parse(jsonMatch[0]);
    return {
      file: filename,
      sizeMB,
      score: Math.round((parsed.score ?? 0) * 10) / 10,
      actionSync: Math.round((parsed.actionSync ?? 0) * 10) / 10,
      summary: parsed.summary ?? text.slice(0, 500),
    };
  } catch (e) {
    const rawPreview = text.slice(0, 200).replace(/\n/g, " ");
    console.error(`\n  [parse error] ${filename}: ${e} — raw: ${rawPreview}`);
    const scoreMatch = text.match(/"score"\s*:\s*([\d.]+)/);
    const syncMatch = text.match(/"actionSync"\s*:\s*([\d.]+)/);
    const summaryMatch = text.match(/"summary"\s*:\s*"([^"]{10,})"/);
    const score = scoreMatch ? parseFloat(scoreMatch[1]) : 0;
    const actionSync = syncMatch ? parseFloat(syncMatch[1]) : 0;
    const summary = summaryMatch ? summaryMatch[1] : text.slice(0, 500);
    return { file: filename, sizeMB, score, actionSync, summary };
  }
}

async function main() {
  const mp4s = fs.readdirSync(DEMOS_DIR)
    .filter((f) => f.endsWith(".mp4"))
    .map((f) => path.join(DEMOS_DIR, f))
    .sort();

  console.log(`Found ${mp4s.length} demo videos in ${DEMOS_DIR}\n`);

  const results: EvalResult[] = [];

  for (const mp4 of mp4s) {
    const name = path.basename(mp4);
    process.stdout.write(`  Evaluating ${name}...`);
    const result = await evaluateVideo(mp4);
    results.push(result);
    console.log(` ${result.score}/10 (sync: ${result.actionSync}/10)`);
  }

  console.log("\n" + "=".repeat(80));
  console.log("DEMO VIDEO QUALITY REPORT (strict scoring)");
  console.log("=".repeat(80) + "\n");

  for (const r of results) {
    const flag = r.score <= 5 ? " *** NEEDS FIX ***" : r.score <= 7 ? " * needs improvement *" : "";
    console.log(`${r.file} (${r.sizeMB} MB) — Score: ${r.score}/10 | Action sync: ${r.actionSync}/10${flag}`);
    console.log(`   ${r.summary}\n`);
  }

  const avg = results.reduce((s, r) => s + r.score, 0) / results.length;
  const syncAvg = results.reduce((s, r) => s + r.actionSync, 0) / results.length;
  console.log("-".repeat(80));
  console.log(`Average: ${avg.toFixed(1)}/10 | Action sync avg: ${syncAvg.toFixed(1)}/10 | ${results.length} demos`);
  console.log(`Target: 9/10 average with no demo below 7/10`);
}

main().catch(console.error);
