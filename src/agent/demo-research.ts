/**
 * Demo Research Agent — explores a website guided by a feature checklist,
 * narrates discoveries via TTS, and logs every action with timestamps.
 *
 * Output:
 *   - raw_video.webm  (full Playwright recording)
 *   - actions.jsonl    (timestamped action log with feature markers)
 *   - screenshots/     (per-feature screenshots)
 *
 * Usage:
 *   bun src/agent/demo-research.ts demo/checklists/registry-web.yaml
 */
import { chromium, type Page, type BrowserContext } from "playwright";
import * as fs from "node:fs";
import * as path from "node:path";
import * as yaml from "yaml";
import { applyHud } from "../../lib/demowright/dist/setup.mjs";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FeatureItem {
  id: string;
  description: string;
  action?: string;
  narration_hint: string;
  success_hint?: string;
}

interface Chapter {
  name: string;
  goal: string;
  features: FeatureItem[];
}

interface Checklist {
  product: string;
  url: string;
  staging_url_env?: string;
  persona: string;
  narration_style: Record<string, string>;
  chapters: Chapter[];
  conclusion: { narration: string };
}

interface ActionLogEntry {
  ts: number;
  offsetMs: number;
  type: "narrate" | "action" | "feature_start" | "feature_end" | "chapter_start" | "chapter_end" | "screenshot" | "error";
  feature?: string;
  chapter?: string;
  action?: string;
  selector?: string;
  text?: string;
  success?: boolean;
  error?: string;
  screenshot?: string;
}

interface AgentDecision {
  narration: string;
  actions: Array<{
    type: "click" | "type" | "scroll" | "hover" | "wait" | "key";
    selector?: string;
    text?: string;
    x?: number;
    y?: number;
    key?: string;
    ms?: number;
  }>;
  done: boolean;
  observation: string;
}

// ---------------------------------------------------------------------------
// LLM integration (Anthropic direct or OpenRouter)
// ---------------------------------------------------------------------------

async function callLLM(
  systemPrompt: string,
  messages: Array<{ role: "user" | "assistant"; content: any }>,
): Promise<string> {
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  if (openRouterKey) {
    return callOpenRouter(systemPrompt, messages, openRouterKey);
  }
  if (anthropicKey) {
    return callAnthropic(systemPrompt, messages);
  }

  // Fallback: claude CLI
  const prompt = `${systemPrompt}\n\n${messages.map((m) => (typeof m.content === "string" ? m.content : JSON.stringify(m.content))).join("\n")}`;
  const proc = Bun.spawn(["claude", "--print", "--model", "claude-sonnet-4-6"], {
    stdin: new TextEncoder().encode(prompt),
    stdout: "pipe",
    stderr: "pipe",
  });
  const output = await new Response(proc.stdout).text();
  await proc.exited;
  return output;
}

async function callAnthropic(
  systemPrompt: string,
  messages: Array<{ role: "user" | "assistant"; content: any }>,
): Promise<string> {
  const Anthropic = (await import("@anthropic-ai/sdk")).default;
  const client = new Anthropic();
  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    system: systemPrompt,
    messages,
  });
  return response.content[0].type === "text" ? response.content[0].text : "";
}

async function callOpenRouter(
  systemPrompt: string,
  messages: Array<{ role: "user" | "assistant"; content: any }>,
  apiKey: string,
): Promise<string> {
  // Convert Anthropic-style messages to OpenAI-style for OpenRouter
  const openaiMessages: any[] = [{ role: "system", content: systemPrompt }];

  for (const msg of messages) {
    if (typeof msg.content === "string") {
      openaiMessages.push({ role: msg.role, content: msg.content });
    } else if (Array.isArray(msg.content)) {
      // Convert Anthropic content blocks to OpenAI format
      const parts: any[] = [];
      for (const block of msg.content) {
        if (block.type === "text") {
          parts.push({ type: "text", text: block.text });
        } else if (block.type === "image") {
          parts.push({
            type: "image_url",
            image_url: {
              url: `data:${block.source.media_type};base64,${block.source.data}`,
            },
          });
        }
      }
      openaiMessages.push({ role: msg.role, content: parts });
    }
  }

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://github.com/comfy-org/comfy-qa",
      "X-Title": "Comfy QA Demo Research",
    },
    body: JSON.stringify({
      model: "anthropic/claude-sonnet-4",
      max_tokens: 2048,
      messages: openaiMessages,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenRouter API error ${res.status}: ${errText.slice(0, 300)}`);
  }

  const json = (await res.json()) as any;
  return json.choices?.[0]?.message?.content ?? "";
}

async function askAgent(
  checklist: Checklist,
  chapter: Chapter,
  feature: FeatureItem,
  pageState: { screenshot: string; a11yTree: string; url: string; title: string },
  history: string[],
  attempt: number,
): Promise<AgentDecision> {
  const systemPrompt = `You are a demo presenter exploring a website to create a narrated video demo.

Product: ${checklist.product}
Persona: ${checklist.persona}

You are currently demonstrating a feature. Your job is to:
1. Write a short narration (1-2 sentences, first person, conversational) explaining what you're doing and WHY it matters to the user.
2. Decide what Playwright actions to take to demonstrate the feature.
3. Report whether you've successfully demonstrated the feature.

CRITICAL RULES FOR "done":
- Set "done": true as soon as you have NARRATED the feature and it is VISIBLE on the page. You do NOT need to click every element.
- If the relevant content is already visible in the screenshot or accessibility tree, narrate it and set "done": true immediately.
- Scrolling to see content and narrating it IS a successful demonstration. You don't need to interact further.
- If you've already narrated the feature on a previous attempt, set "done": true.
- Do NOT keep trying different selectors if the content is already visible. Just narrate and finish.
- Maximum 2 actions per response. Prefer scroll + wait over complex click sequences.

IMPORTANT: You are in a headless browser — there is NO URL bar. To navigate to a different page, use {"type": "navigate", "text": "https://full-url-here"}. Do NOT try to use keyboard shortcuts like Ctrl+L or type URLs into input fields.

Respond with ONLY a JSON object (no markdown):
{
  "narration": "What to say (first person, explain user benefit)",
  "actions": [
    {"type": "click", "selector": "CSS selector"},
    {"type": "type", "selector": "CSS selector", "text": "text to type"},
    {"type": "scroll", "y": 300},
    {"type": "hover", "selector": "CSS selector"},
    {"type": "wait", "ms": 1000},
    {"type": "key", "key": "Enter"},
    {"type": "navigate", "text": "https://example.com/page"}
  ],
  "done": true/false,
  "observation": "What I see on the page"
}`;

  const userContent: any[] = [
    {
      type: "text",
      text: `## Current Task
Chapter: ${chapter.name} — ${chapter.goal}
Feature: ${feature.id} — ${feature.description}
${feature.action ? `Suggested action: ${feature.action}` : ""}
Narration hint: ${feature.narration_hint}
${feature.success_hint ? `Success criteria: ${feature.success_hint}` : ""}
Attempt: ${attempt}/3
${attempt > 1 ? "IMPORTANT: If you can see the relevant content on the page, just narrate it and set done=true. Do not keep retrying." : ""}

## Page State
URL: ${pageState.url}
Title: ${pageState.title}

## Accessibility Tree (first 2000 chars)
${pageState.a11yTree.slice(0, 2000)}

## Recent History
${history.slice(-8).join("\n") || "(start)"}`,
    },
  ];

  // Include screenshot as vision input
  if (pageState.screenshot) {
    userContent.push({
      type: "image",
      source: {
        type: "base64",
        media_type: "image/png",
        data: pageState.screenshot,
      },
    });
  }

  const text = await callLLM(systemPrompt, [{ role: "user", content: userContent }]);

  // Parse JSON response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return {
      narration: "",
      actions: [],
      done: false,
      observation: `Could not parse agent response: ${text.slice(0, 200)}`,
    };
  }
  try {
    return JSON.parse(jsonMatch[0]) as AgentDecision;
  } catch {
    return {
      narration: "",
      actions: [],
      done: false,
      observation: "JSON parse failed",
    };
  }
}

// ---------------------------------------------------------------------------
// Page state capture
// ---------------------------------------------------------------------------

async function getA11ySnapshot(page: Page): Promise<string> {
  try {
    const tree = await page.accessibility.snapshot();
    return tree ? formatA11y(tree, 0) : "(empty)";
  } catch {
    return "(unavailable)";
  }
}

function formatA11y(node: any, depth: number): string {
  const indent = "  ".repeat(depth);
  let line = `${indent}[${node.role}]`;
  if (node.name) line += ` "${node.name}"`;
  if (node.value) line += ` val="${node.value}"`;
  let result = line + "\n";
  if (node.children) {
    for (const child of node.children.slice(0, 40)) {
      result += formatA11y(child, depth + 1);
    }
  }
  return result;
}

async function captureState(page: Page) {
  const buf = await page.screenshot({ type: "png" });
  return {
    screenshot: buf.toString("base64"),
    a11yTree: await getA11ySnapshot(page),
    url: page.url(),
    title: await page.title(),
  };
}

// ---------------------------------------------------------------------------
// Action execution
// ---------------------------------------------------------------------------

async function executeAction(
  page: Page,
  action: AgentDecision["actions"][0],
): Promise<{ success: boolean; result: string }> {
  try {
    switch (action.type) {
      case "click":
        if (action.selector) {
          await page.click(action.selector, { timeout: 5000 });
          return { success: true, result: `Clicked: ${action.selector}` };
        }
        if (action.x !== undefined && action.y !== undefined) {
          await page.mouse.click(action.x, action.y);
          return { success: true, result: `Clicked (${action.x},${action.y})` };
        }
        return { success: false, result: "Click: no target" };

      case "type":
        if (action.selector && action.text) {
          await page.fill(action.selector, action.text, { timeout: 5000 });
          return { success: true, result: `Typed "${action.text}" → ${action.selector}` };
        }
        if (action.text) {
          await page.keyboard.type(action.text, { delay: 80 });
          return { success: true, result: `Typed: "${action.text}"` };
        }
        return { success: false, result: "Type: no text" };

      case "scroll":
        await page.mouse.wheel(0, action.y ?? 300);
        return { success: true, result: `Scrolled ${action.y ?? 300}px` };

      case "hover":
        if (action.selector) {
          await page.hover(action.selector, { timeout: 5000 });
          return { success: true, result: `Hovered: ${action.selector}` };
        }
        return { success: false, result: "Hover: no target" };

      case "wait":
        await page.waitForTimeout(action.ms ?? 1000);
        return { success: true, result: `Waited ${action.ms ?? 1000}ms` };

      case "key":
        if (action.key) {
          await page.keyboard.press(action.key);
          return { success: true, result: `Key: ${action.key}` };
        }
        return { success: false, result: "Key: none" };

      case "navigate":
        if (action.text) {
          await page.goto(action.text, { waitUntil: "domcontentloaded", timeout: 15000 });
          await page.waitForTimeout(1500);
          return { success: true, result: `Navigated: ${action.text}` };
        }
        return { success: false, result: "Navigate: no URL" };

      default:
        return { success: false, result: `Unknown: ${action.type}` };
    }
  } catch (err: any) {
    return { success: false, result: `Failed: ${err.message?.slice(0, 150)}` };
  }
}

// ---------------------------------------------------------------------------
// TTS (reuse Gemini TTS from fixture)
// ---------------------------------------------------------------------------

async function generateTTS(text: string): Promise<Buffer | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || !text.trim()) return null;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;
  const body = {
    contents: [{ parts: [{ text }] }],
    generationConfig: {
      responseModalities: ["AUDIO"],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } },
      },
    },
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as any;
    const b64 = json?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!b64) return null;
    const pcm = Buffer.from(b64, "base64");
    return pcmToWav(pcm, 24000, 1);
  } catch {
    return null;
  }
}

function pcmToWav(pcm: Buffer, sampleRate: number, channels: number): Buffer {
  const header = Buffer.alloc(44);
  const dataSize = pcm.length;
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * channels * 2, 28);
  header.writeUInt16LE(channels * 2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(dataSize, 40);
  return Buffer.concat([header, pcm]);
}

// ---------------------------------------------------------------------------
// Play audio in browser (inject base64 WAV)
// ---------------------------------------------------------------------------

async function playAudioInBrowser(page: Page, wavBuf: Buffer): Promise<number> {
  const b64 = wavBuf.toString("base64");
  const durationMs = await page.evaluate(async (data: string) => {
    const binary = atob(data);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const blob = new Blob([bytes], { type: "audio/wav" });
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    await audio.play();
    const dur = audio.duration * 1000;
    return isFinite(dur) ? dur : 3000;
  }, b64);
  return durationMs;
}

// ---------------------------------------------------------------------------
// Main research loop
// ---------------------------------------------------------------------------

export async function runDemoResearch(checklistPath: string) {
  // Load checklist
  const raw = fs.readFileSync(checklistPath, "utf-8");
  const checklist = yaml.parse(raw) as Checklist;

  // Resolve URL
  const baseUrl = checklist.staging_url_env
    ? process.env[checklist.staging_url_env] ?? checklist.url
    : checklist.url;

  // Setup output dir
  const productSlug = checklist.product.toLowerCase().replace(/\s+/g, "-");
  const outputDir = path.resolve(`.comfy-qa/.research/${productSlug}`);
  fs.mkdirSync(outputDir, { recursive: true });
  fs.mkdirSync(path.join(outputDir, "screenshots"), { recursive: true });

  // Action log
  const logPath = path.join(outputDir, "actions.jsonl");
  const logStream = fs.createWriteStream(logPath, { flags: "w" });
  const startMs = Date.now();

  function log(entry: Omit<ActionLogEntry, "ts" | "offsetMs">) {
    const now = Date.now();
    const full: ActionLogEntry = { ts: now, offsetMs: now - startMs, ...entry };
    logStream.write(JSON.stringify(full) + "\n");
    const prefix = `[${((now - startMs) / 1000).toFixed(1)}s]`;
    if (entry.type === "narrate") console.log(`  ${prefix} 🎤 ${entry.text}`);
    else if (entry.type === "action") console.log(`  ${prefix} ▶ ${entry.action} ${entry.success ? "✓" : "✗"}`);
    else if (entry.type === "feature_start") console.log(`  ${prefix} 📌 ${entry.feature}: ${entry.text}`);
    else if (entry.type === "feature_end") console.log(`  ${prefix} ${entry.success ? "✅" : "❌"} ${entry.feature}`);
    else if (entry.type === "chapter_start") console.log(`\n  ${prefix} 📖 Chapter: ${entry.chapter}`);
    else if (entry.type === "error") console.log(`  ${prefix} ⚠ ${entry.error}`);
  }

  // Launch browser
  console.log(`\n🔬 Research Agent: ${checklist.product}`);
  console.log(`   URL: ${baseUrl}`);
  console.log(`   Output: ${outputDir}\n`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: { dir: outputDir, size: { width: 1280, height: 720 } },
  });

  // Apply HUD overlay (cursor, keystrokes)
  await applyHud(context, {
    cursor: true,
    keyboard: true,
    cursorStyle: "default",
    actionDelay: 200,
  });

  const page = await context.newPage();
  const history: string[] = [];

  // Navigate to site
  await page.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForTimeout(2000);

  // Audio segments for later muxing
  const audioSegments: Array<{ offsetMs: number; wavBuf: Buffer }> = [];

  // -- Research loop --
  for (const chapter of checklist.chapters) {
    log({ type: "chapter_start", chapter: chapter.name, text: chapter.goal });

    for (const feature of chapter.features) {
      log({ type: "feature_start", feature: feature.id, text: feature.description });

      // Auto-execute navigation actions from checklist before asking the agent
      if (feature.action) {
        const navMatch = feature.action.match(/navigate\s+to\s+(\S+)/i);
        if (navMatch) {
          const target = navMatch[1].startsWith("http") ? navMatch[1] : new URL(navMatch[1], baseUrl).href;
          try {
            await page.goto(target, { waitUntil: "domcontentloaded", timeout: 15000 });
            await page.waitForTimeout(1500);
            log({ type: "action", feature: feature.id, action: `navigate ${target}`, success: true });
            history.push(`[${feature.id}] Navigated to ${target}`);
          } catch (err: any) {
            log({ type: "error", feature: feature.id, error: `Auto-navigate failed: ${err.message?.slice(0, 100)}` });
          }
        }
      }

      let demonstrated = false;
      for (let attempt = 1; attempt <= 3 && !demonstrated; attempt++) {
        try {
          // Capture page state
          const state = await captureState(page);

          // Ask Claude what to do
          const decision = await askAgent(checklist, chapter, feature, state, history, attempt);

          // Narrate
          if (decision.narration) {
            log({ type: "narrate", feature: feature.id, text: decision.narration });
            const wav = await generateTTS(decision.narration);
            if (wav) {
              audioSegments.push({ offsetMs: Date.now() - startMs, wavBuf: wav });
              const durMs = await playAudioInBrowser(page, wav).catch(() => 3000);
              await page.waitForTimeout(Math.max(durMs - 500, 500));
            }
          }

          // Execute actions
          for (const action of decision.actions) {
            const result = await executeAction(page, action);
            log({
              type: "action",
              feature: feature.id,
              action: `${action.type} ${action.selector ?? action.text ?? action.key ?? ""}`.trim(),
              selector: action.selector,
              success: result.success,
              error: result.success ? undefined : result.result,
            });
            history.push(`[${feature.id}] ${result.result}`);
            await page.waitForTimeout(400); // visual pause
          }

          if (decision.observation) {
            history.push(`[observe] ${decision.observation}`);
          }

          demonstrated = decision.done;
        } catch (err: any) {
          log({ type: "error", feature: feature.id, error: err.message?.slice(0, 200) });
        }
      }

      // Screenshot for this feature
      const ssPath = path.join(outputDir, "screenshots", `${feature.id}.png`);
      await page.screenshot({ path: ssPath }).catch(() => {});
      log({ type: "screenshot", feature: feature.id, screenshot: ssPath });

      log({ type: "feature_end", feature: feature.id, success: demonstrated });
    }

    log({ type: "chapter_end", chapter: chapter.name });
  }

  // Conclusion narration
  if (checklist.conclusion?.narration) {
    log({ type: "narrate", text: checklist.conclusion.narration });
    const wav = await generateTTS(checklist.conclusion.narration);
    if (wav) {
      audioSegments.push({ offsetMs: Date.now() - startMs, wavBuf: wav });
      await playAudioInBrowser(page, wav).catch(() => {});
      await page.waitForTimeout(3000);
    }
  }

  // Save audio track
  if (audioSegments.length > 0) {
    const totalMs = Date.now() - startMs;
    const wavPath = path.join(outputDir, "narration.wav");
    const wavBuf = buildWavTrack(audioSegments, totalMs);
    if (wavBuf) fs.writeFileSync(wavPath, wavBuf);
    console.log(`\n  🔊 Audio: ${wavPath}`);
  }

  // Stop recording
  await page.waitForTimeout(1000);
  const videoPath = await page.video()?.path();
  await context.close();
  await browser.close();

  if (videoPath) {
    const dest = path.join(outputDir, "raw_video.webm");
    fs.renameSync(videoPath, dest);
    console.log(`  🎬 Video: ${dest}`);
  }

  logStream.end();
  console.log(`  📋 Log: ${logPath}`);
  console.log(`\n✅ Research complete for ${checklist.product}\n`);
}

// ---------------------------------------------------------------------------
// WAV track builder (stereo mix of all narration segments)
// ---------------------------------------------------------------------------

function parseWav(buf: Buffer) {
  const dataOff = buf.indexOf("data") + 8;
  if (dataOff < 8) return { float32: new Float32Array(0), sampleRate: 24000, channels: 1, sampleCount: 0, durationMs: 0 };
  const sr = buf.readUInt32LE(24);
  const ch = buf.readUInt16LE(22);
  const pcm = buf.subarray(dataOff);
  const count = pcm.length / 2;
  const f32 = new Float32Array(count);
  for (let i = 0; i < count; i++) f32[i] = pcm.readInt16LE(i * 2) / 32768;
  return { float32: f32, sampleRate: sr, channels: ch, sampleCount: count, durationMs: (count / ch / sr) * 1000 };
}

function buildWavTrack(segments: Array<{ offsetMs: number; wavBuf: Buffer }>, totalMs: number): Buffer | null {
  if (!segments.length) return null;
  const sr = 24000;
  const ch = 2;
  const totalSamples = Math.ceil((totalMs / 1000) * sr * ch);
  const track = new Float32Array(totalSamples);

  for (const seg of segments) {
    const p = parseWav(seg.wavBuf);
    const off = Math.floor((seg.offsetMs / 1000) * sr) * ch;
    const stereo =
      p.channels === 1
        ? (() => {
            const s = new Float32Array(p.sampleCount * 2);
            for (let i = 0; i < p.sampleCount; i++) {
              s[i * 2] = p.float32[i];
              s[i * 2 + 1] = p.float32[i];
            }
            return s;
          })()
        : p.float32;
    for (let i = 0; i < stereo.length && off + i < track.length; i++) {
      track[off + i] += stereo[i];
    }
  }

  const int16 = new Int16Array(track.length);
  for (let i = 0; i < track.length; i++) {
    const s = Math.max(-1, Math.min(1, track[i]));
    int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }

  const dataBytes = int16.length * 2;
  const buf = Buffer.alloc(44 + dataBytes);
  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + dataBytes, 4);
  buf.write("WAVE", 8);
  buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(ch, 22);
  buf.writeUInt32LE(sr, 24);
  buf.writeUInt32LE(sr * ch * 2, 28);
  buf.writeUInt16LE(ch * 2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write("data", 36);
  buf.writeUInt32LE(dataBytes, 40);
  Buffer.from(int16.buffer).copy(buf, 44);
  return buf;
}

// ---------------------------------------------------------------------------
// CLI entrypoint
// ---------------------------------------------------------------------------

if (import.meta.main) {
  const checklistPath = process.argv[2];
  if (!checklistPath) {
    console.error("Usage: bun src/agent/demo-research.ts <checklist.yaml>");
    process.exit(1);
  }
  runDemoResearch(path.resolve(checklistPath)).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
