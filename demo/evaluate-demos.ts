/**
 * Evaluate demo videos using Gemini 2.5 Pro.
 * Sends each video to Gemini and asks for a quality assessment.
 *
 * Usage:
 *   bun demo/evaluate-demos.ts                    # evaluate all
 *   bun demo/evaluate-demos.ts comfy-registry-qa  # evaluate one
 */
import * as fs from "node:fs";
import * as path from "node:path";

const GEMINI_KEY = process.env.GEMINI_API_KEY ?? "";
if (!GEMINI_KEY) {
  console.error("GEMINI_API_KEY missing in .env.local");
  process.exit(1);
}

const DEMOS_DIR = path.resolve(".comfy-qa/.demos");

interface EvalResult {
  slug: string;
  score: number;
  narration: number;
  visuals: number;
  pacing: number;
  coverage: number;
  summary: string;
  issues: string[];
}

function extractFieldsRegex(slug: string, text: string): EvalResult {
  const num = (key: string): number => {
    const m = text.match(new RegExp(`"${key}"\\s*:\\s*([\\d.]+)`));
    return m ? Math.round(parseFloat(m[1])) : 0;
  };
  const str = (key: string): string => {
    const m = text.match(new RegExp(`"${key}"\\s*:\\s*"([^"]*)`));
    return m ? m[1] : "";
  };
  const arr = (key: string): string[] => {
    const m = text.match(new RegExp(`"${key}"\\s*:\\s*\\[([^\\]]*)`, "s"));
    if (!m) return [];
    return [...m[1].matchAll(/"([^"]*)"/g)].map(x => x[1]);
  };
  return {
    slug,
    score: num("score"),
    narration: num("narration"),
    visuals: num("visuals"),
    pacing: num("pacing"),
    coverage: num("coverage"),
    summary: str("summary"),
    issues: arr("issues"),
  };
}

async function evaluateVideo(videoPath: string, slug: string): Promise<EvalResult> {
  const videoBytes = fs.readFileSync(videoPath);
  const base64Video = videoBytes.toString("base64");
  const mimeType = videoPath.endsWith(".webm") ? "video/webm" : "video/mp4";

  const prompt = `You are evaluating a QA evidence demo video for a web product.

Score each dimension 1-10:
1. **Narration**: Is the TTS clear? Does it explain what's happening and why?
2. **Visuals**: Are the right UI elements shown? Is the page visible and not blank?
3. **Pacing**: Is the video well-paced? No long idle gaps? No rushed sections?
4. **Coverage**: Are the key features demonstrated? Both successes and failures shown?

Also list any specific issues (blank screens, misaligned audio, idle time, etc.)

Respond with JSON only:
{
  "score": <overall 1-10>,
  "narration": <1-10>,
  "visuals": <1-10>,
  "pacing": <1-10>,
  "coverage": <1-10>,
  "summary": "<1-2 sentence overall assessment>",
  "issues": ["issue1", "issue2"]
}`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContent?key=${GEMINI_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { inlineData: { mimeType, data: base64Video } },
          ],
        }],
        generationConfig: { maxOutputTokens: 1024 },
      }),
    },
  );

  const json = await res.json() as any;
  let text = json.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  // Strip markdown fences (```json ... ```)
  text = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();

  const jsonMatch = text.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    // Fallback: extract individual fields with regex
    return extractFieldsRegex(slug, text);
  }

  try {
    const result = JSON.parse(jsonMatch[0]);
    return { slug, ...result };
  } catch {
    // JSON.parse failed — extract fields with regex
    return extractFieldsRegex(slug, jsonMatch[0]);
  }
}

async function main() {
  const filter = process.argv[2];

  const videos = fs.readdirSync(DEMOS_DIR)
    .filter(f => f.endsWith(".mp4"))
    .filter(f => !filter || f.includes(filter))
    .sort();

  console.log(`\nEvaluating ${videos.length} videos...\n`);

  const results: EvalResult[] = [];

  for (const video of videos) {
    const slug = video.replace(".mp4", "");
    const videoPath = path.join(DEMOS_DIR, video);
    const size = fs.statSync(videoPath).size;

    // Skip videos larger than 20MB (Gemini inline limit)
    if (size > 20 * 1024 * 1024) {
      console.log(`  ⏭ ${slug}: too large (${(size / 1024 / 1024).toFixed(1)}MB)`);
      continue;
    }

    console.log(`  🔍 ${slug} (${(size / 1024 / 1024).toFixed(1)}MB)...`);
    const result = await evaluateVideo(videoPath, slug);
    results.push(result);
    console.log(`     Score: ${result.score}/10 — ${result.summary}`);
  }

  // Summary table
  console.log("\n┌─────────────────────────────────────────────────────────────────┐");
  console.log("│  Demo Video Evaluation Results                                 │");
  console.log("├──────────────────────────┬───────┬─────┬─────┬─────┬───────────┤");
  console.log("│ Video                    │ Score │ Nar │ Vis │ Pac │ Cov       │");
  console.log("├──────────────────────────┼───────┼─────┼─────┼─────┼───────────┤");
  for (const r of results) {
    const name = r.slug.padEnd(24).slice(0, 24);
    console.log(`│ ${name} │  ${String(r.score).padStart(2)}   │  ${r.narration}  │  ${r.visuals}  │  ${r.pacing}  │  ${r.coverage}        │`);
  }
  console.log("└──────────────────────────┴───────┴─────┴─────┴─────┴───────────┘");

  const avg = results.length > 0
    ? (results.reduce((a, r) => a + r.score, 0) / results.length).toFixed(1)
    : "0";
  console.log(`\nAverage: ${avg}/10`);

  // Issues
  const allIssues = results.flatMap(r => r.issues.map(i => `${r.slug}: ${i}`));
  if (allIssues.length > 0) {
    console.log("\nIssues:");
    allIssues.forEach(i => console.log(`  - ${i}`));
  }

  // Save results
  const outPath = path.join(DEMOS_DIR, "evaluation.json");
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`\nSaved: ${outPath}`);
}

main().catch(err => { console.error(err); process.exit(1); });
