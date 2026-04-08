---
name: demo-spec-author
description: "Author a narrated demo spec for a Comfy-Org product following the comfy-qa house workflow. Use when adding a new spec under demo/, recording a feature walkthrough, or producing a video evidence file. Enforces story-first authoring: probe → story → videoScript → playwright."
---

# demo-spec-author

The house workflow for writing `demo/<product>.spec.ts` files in this repo. The narration is the source of truth — you write a complete voiceover script BEFORE writing any Playwright code.

## When to use

- The user asks for a demo of a Comfy-Org product (or a feature within one)
- You're adding a new file to `demo/`
- You're updating an existing demo to cover a new feature
- The QA target is a feature, in which case the "story" is "how a real user would actually use this feature"

## Workflow (5 phases — do them in order)

```
1. Probe         → Understand what exists on the live site
2. Story         → Write demo/stories/<product>.story.md (happy paths in plain English)
3. Video Script  → Write VIDEO_SCRIPT constant at top of demo/<product>.spec.ts
4. Review        → Read the video script aloud in your head — does it flow?
5. Playwright    → Translate VIDEO_SCRIPT into createVideoScript() calls below it
```

**Skip no phase. Do not write Playwright code in phase 1–4.**

## Phase 1 — Probe

Use a throwaway script to discover the page structure. This is the only time you touch a browser before writing code.

```bash
cat > /tmp/probe.mjs << 'EOF'
import { chromium } from 'playwright';
const b = await chromium.launch({ headless: true });
const p = await (await b.newContext()).newPage();
await p.goto('https://<target-url>/', { waitUntil: 'domcontentloaded' });
await p.waitForTimeout(3000);
console.log('Title:', await p.title());
console.log('H1:', await p.locator('h1').first().textContent().catch(() => null));
console.log('Visible buttons/links:', await p.$$eval('button, a', els =>
  els.filter(e => e.offsetParent).slice(0, 30).map(e => e.textContent.trim().slice(0,60))));
console.log('Inputs:', await p.$$eval('input', els =>
  els.filter(e => e.offsetParent).map(e => ({type: e.type, ph: e.placeholder}))));
await b.close();
EOF
bun /tmp/probe.mjs
```

Goal: identify the **5–10 features a real user would actually use**, in the order they'd encounter them.

## Phase 2 — Story

Write `demo/stories/<product>.story.md` with the happy path(s) as a plain-English user journey. Treat the user as a real person with a goal, not a feature checklist.

Template:

```markdown
# <Product Name> — User Story

## Who
A <user persona> (e.g., "a ComfyUI developer looking for an LLM node implementation", "a stakeholder evaluating the platform").

## Goal
What the user wants to accomplish in one sentence.

## Happy path
1. **Land on home page** — The user arrives via a Google search or a link in Discord. They see <hero element> and immediately understand what the site does.
2. **Find the search box** — They notice the prominent search input at the top.
3. **Type their query** — They type "controlnet sdxl" and hit Enter.
4. **Scan results** — Results appear instantly. They see file names, line numbers, and a snippet of matched code.
5. **Click into a result** — They click the most relevant entry to see the full file.
6. ... etc

## Key features to demo
- Search across thousands of repos
- Live result streaming
- Click-through to source
- Repository filter / language filter
- ...

## Implicit narration (what the voiceover should explain)
- WHY the site exists (problem it solves)
- WHO it's for
- HOW it differs from grep/GitHub search
- WHAT the next step is for the viewer
```

The story is for humans (and future you), not the agent. It captures intent before detail.

## Phase 3 — Video Script (THE source of truth)

At the **top of `demo/<product>.spec.ts`**, define a `VIDEO_SCRIPT` constant. Every word in `narration` will be read aloud by Gemini TTS during recording. Write it as a continuous, natural voiceover — not a list of feature labels.

```ts
/**
 * VIDEO SCRIPT — every word in `narration` is read aloud verbatim by Gemini TTS.
 *
 * Read this aloud in your head before writing any Playwright code.
 * If it sounds like a robot reading bullet points, rewrite it.
 * If it sounds like a human walking a friend through the site, ship it.
 */
const VIDEO_SCRIPT = [
  {
    kind: "title",
    text: "Comfy Code Search",
    subtitle: "Find any node in seconds",
    durationMs: 2000,
  },
  {
    kind: "segment",
    narration: "Welcome to Comfy Code Search — the fastest way to find code across every ComfyUI custom node ever published.",
    visuals: ["safeMove h1", "safeMove main"],
  },
  {
    kind: "segment",
    narration: "I'm a developer looking for an example of how to load a ControlNet model. Let me click the search box at the top of the page.",
    visuals: ["safeMove input[type=search]"],
  },
  {
    kind: "segment",
    narration: "Now I'm typing 'controlnet loader'. Notice how the results stream in live as I type — no need to hit enter.",
    visuals: ["typeKeys 'controlnet loader'"],
  },
  {
    kind: "segment",
    narration: "Hundreds of matches across different repositories. Each result shows the file name, the matching line, and the surrounding context.",
    visuals: ["wheel +400"],
  },
  // ...more segments
  {
    kind: "outro",
    text: "Comfy Code Search",
    subtitle: "cs.comfy.org",
    durationMs: 2000,
  },
] as const;
```

### Narration writing rules

1. **First person, present tense.** "I'm clicking the search box" not "User clicks search box".
2. **Explain pace details when they matter.** "Now I'm typing slowly so you can see…", "Let me scroll down to find…", "I'll wait a moment while it loads…".
3. **Connect segments with transitional phrases.** "Let's start by…", "Next…", "While we're here…", "Before we wrap up…", "Finally…". This eliminates the choppy "label-label-label" feel.
4. **Explain WHY, not just WHAT.** "Let me search for ControlNet because that's the most common feature people look for" beats "I'm searching for ControlNet."
5. **Sentences read aloud should feel natural at 1× speed.** ~140 words per minute is normal speech. A 5-second segment fits ~12 words.
6. **Avoid jargon the target audience wouldn't know** unless you immediately explain it.
7. **End with a CTA or summary.** The outro should give the viewer somewhere to go next.

### `visuals` — light hints only

`visuals` is a non-executable comment array that documents what should be on screen during this narration. The actual Playwright work happens in phase 5. Keep visuals notes brief — they're just a reminder for the implementer.

## Phase 4 — Review the script

Before writing any Playwright code:

1. **Read every `narration` string aloud in your head.** Time yourself with a stopwatch. Each segment should be 4–10 seconds at conversational speed.
2. **Check the flow.** Does sentence N+1 follow naturally from sentence N? Or does it jump?
3. **Prune anything redundant.** If two consecutive segments say the same thing, merge them.
4. **Verify total length.** A good demo is 30–90 seconds. 21 segments × 6 seconds each = 126 seconds (too long). Aim for 6–10 segments unless the product is dense.
5. **Never claim something the demo can't show.** If you say "now I'll click the buy button", the visuals had better actually click it.

If the script doesn't pass this review, rewrite it. **Do not proceed to Phase 5 with a weak script.** A weak script ⇒ a boring video ⇒ wasted Gemini TTS API quota and human review time.

## Phase 5 — Playwright implementation

Now translate `VIDEO_SCRIPT` into actual `createVideoScript()` chains. The implementation lives **below** the `VIDEO_SCRIPT` constant in the same file.

```ts
import { test, safeMove } from "./fixtures/fixture";
import { createVideoScript } from "../lib/demowright/dist/index.mjs";

const VIDEO_SCRIPT = [/* ...from phase 3... */] as const;

test("comfy code search tour", async ({ page }) => {
  test.setTimeout(5 * 60_000);

  // Pre-navigate (heavy work BEFORE script.render — see hard rules below)
  await page.goto("https://cs.comfy.org/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);

  // Translate VIDEO_SCRIPT → createVideoScript builder
  const script = createVideoScript()
    .title(VIDEO_SCRIPT[0].text, {
      subtitle: VIDEO_SCRIPT[0].subtitle,
      durationMs: VIDEO_SCRIPT[0].durationMs,
    })
    .segment(VIDEO_SCRIPT[1].narration, async (pace) => {
      await safeMove(page, "h1");
      await pace();
      await safeMove(page, "main");
      await pace();
    })
    .segment(VIDEO_SCRIPT[2].narration, async (pace) => {
      await safeMove(page, 'input[type="search"]');
      await pace();
    })
    .segment(VIDEO_SCRIPT[3].narration, async (pace) => {
      await typeKeys(page, "controlnet loader", 80);
      await pace();
    })
    // ... etc
    .outro({
      text: VIDEO_SCRIPT[VIDEO_SCRIPT.length - 1].text,
      subtitle: VIDEO_SCRIPT[VIDEO_SCRIPT.length - 1].subtitle,
      durationMs: VIDEO_SCRIPT[VIDEO_SCRIPT.length - 1].durationMs,
    });

  await script.prepare(page);
  await script.render(page, { baseName: "comfy-codesearch", outputDir: ".comfy-qa/.demos" });
});
```

The narration text in `.segment(...)` calls **must reference VIDEO_SCRIPT** (e.g., `VIDEO_SCRIPT[1].narration`) rather than being inlined as string literals. This guarantees the rendered audio matches the script of record.

## Hard rules (non-negotiable)

These are encoded in past commit history and bug reports:

| Rule | Why |
|------|-----|
| **No `page.goto` inside `.segment()` callbacks** | Heavy nav overruns audio length → silent gaps in final video ([demowright #10](https://github.com/snomiao/demowright/issues/10)) |
| **No `page.click()` that triggers navigation inside segments** | Same overrun problem |
| **Use `safeMove(page, sel)` not `moveToEl`** | `moveToEl` throws on missing selectors ([demowright #2](https://github.com/snomiao/demowright/issues/2)) |
| **Title/outro `durationMs: 2000`** | Long enough to read, short enough not to bore |
| **Pre-navigate BEFORE `script.render()`** | Wall clock counts toward segment timing once render starts |
| **Always call `script.prepare(page)` first** | Pre-fetches ALL TTS in parallel — no API latency mid-test |
| **Only `safeMove` / `mouse.wheel` / `mouse.move` / `hover` / `typeKeys` in segments** | These don't call `page.evaluate` which can hang on SSR sites ([demowright #3](https://github.com/snomiao/demowright/issues/3)) |
| **For SSR sites that hang anyway** (e.g., www.comfy.org) | Block all `<script>` resources via `page.route`, see `comfy-website.spec.ts` |

## Output paths

```
demo/stories/<product>.story.md      ← Phase 2 output (committed)
demo/<product>.spec.ts               ← Phases 3–5 output (committed)
.comfy-qa/.demos/<baseName>.mp4      ← Final video (gitignored)
.comfy-qa/.demos/tmp/<base>.wav      ← Intermediate audio (gitignored)
.comfy-qa/.tmp/demos/<test>/         ← Playwright artifacts (gitignored)
```

## Reference templates

- `demo/registry-web.spec.ts` — canonical short tour (8 segments)
- `demo/cloud-comfy.spec.ts` — auth flow + 21 segments (largest example)
- `demo/comfy-website.spec.ts` — SSR site requiring script blocking
