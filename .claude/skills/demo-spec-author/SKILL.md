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

### User journey constraint (mandatory)

Every story must describe a **complete user workflow** — not a museum tour. A user journey has:

1. **An entry point** — how the user arrives (Google search, Discord link, bookmark)
2. **A concrete goal** — "install a ControlNet node" not "explore the page"
3. **Real actions to reach that goal** — search, click result, read detail, copy install command
4. **A measurable outcome** — the user has accomplished something (copied a command, submitted a form, downloaded a file)

#### The "Could I follow along?" test

Read your happy path steps aloud. If a viewer could follow the same steps on their own computer and achieve the same outcome, the story passes. If the viewer would just be watching someone hover over things, rewrite it.

#### BAD: museum tour (DON'T)
```
1. Land on homepage → hover heading
2. Hover over search bar
3. Hover over nav links
4. Scroll down → hover pagination
5. Hover over login button
```

#### GOOD: real workflow (DO)
```
1. Land on homepage → read the hero
2. Click search bar → type "controlnet" → scan results
3. Click the top result → land on detail page
4. Read install command → click Copy button
5. Scroll to version history → confirm active maintenance
6. Click logo → return to homepage
```

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
2. **Every word of narration must pair with a visual action.** If the narrator is talking, the cursor must be moving, hovering, scrolling, or typing. Zero idle frames. A segment where the mouse sits still while the voiceover explains "why this matters" is a failed segment — rewrite it to hover related elements while explaining, or cut it.
3. **Connect segments with transitional phrases.** "Let's start by…", "Next…", "While we're here…", "Before we wrap up…", "Finally…". This eliminates the choppy "label-label-label" feel.
4. **Explain WHY, not just WHAT.** "Let me search for ControlNet because that's the most common feature people look for" beats "I'm searching for ControlNet."
5. **Sentences read aloud should feel natural at 1× speed.** ~140 words per minute is normal speech. A 5-second segment fits ~12 words.
6. **Avoid jargon the target audience wouldn't know** unless you immediately explain it.
7. **End with a CTA or summary.** The outro should give the viewer somewhere to go next.
8. **If a segment has nothing to show, cut it.** Pure commentary segments with no UI to demonstrate should be merged into adjacent segments that do have visual actions. Never write a segment whose `visuals` hint is just "pause" or "mouse.move center".

### `visuals` — light hints only

`visuals` is a non-executable comment array that documents what should be on screen during this narration. The actual Playwright work happens in phase 5. Keep visuals notes brief — they're just a reminder for the implementer.

### Segment classification (mandatory)

Every segment must be one of three types. Annotate each VIDEO_SCRIPT entry with a `// TYPE` comment.

| Type | What happens | `setup` callback | `action` callback | Example |
|------|-------------|------------------|-------------------|---------|
| **NAVIGATE** | Page changes URL | `page.goto()` or nav click | Visual hover on new page | Click node card → detail page loads |
| **INTERACT** | User input changes state | Optional | `typeKeys`, `mouse.click`, `keyboard.press` | Type search query, click Copy, select time range |
| **OBSERVE** | Read-only viewing | None | `safeMove`, `mouse.wheel`, `mouse.move` | Scroll README, hover metadata |

#### Minimum interaction ratio (non-negotiable)

| Rule | Threshold |
|------|-----------|
| NAVIGATE + INTERACT segments | **≥ 50%** of total |
| OBSERVE-only segments | **≤ 30%** of total |
| Consecutive OBSERVE segments | **≤ 2** in a row |

If your 10-segment script has 7 OBSERVE segments, it's a hover tour. Go back to Phase 2 and redesign the user journey.

**Why?** Gemini 3.1 Pro scored our existing demos 3.7–6.3/10 because 93.6% of segments were OBSERVE-only.

#### Example annotated script
```ts
const VIDEO_SCRIPT = [
  { kind: "title", ... },
  { kind: "segment", narration: "Welcome to the registry...",              /* OBSERVE */ },
  { kind: "segment", narration: "Let me type controlnet in the search...", /* INTERACT */ },
  { kind: "segment", narration: "Results stream in instantly...",          /* OBSERVE */ },
  { kind: "segment", narration: "I'll click KJNodes to see details...",    /* NAVIGATE */ },
  { kind: "segment", narration: "Here's the install command — Copy...",    /* INTERACT */ },
  { kind: "segment", narration: "Version history shows 37 releases...",    /* OBSERVE */ },
  { kind: "segment", narration: "Clicking the logo takes me home...",      /* NAVIGATE */ },
  { kind: "outro", ... },
] as const;
// Ratio: 2 NAVIGATE + 2 INTERACT + 3 OBSERVE = 57% interactive ✅
```

## Phase 4 — Review the script

Before writing any Playwright code:

1. **Read every `narration` string aloud in your head.** Time yourself with a stopwatch. Each segment should be 4–10 seconds at conversational speed.
2. **Check the flow.** Does sentence N+1 follow naturally from sentence N? Or does it jump?
3. **Prune anything redundant.** If two consecutive segments say the same thing, merge them.
4. **Verify total length.** A good demo is 30–90 seconds. 21 segments × 6 seconds each = 126 seconds (too long). Aim for 6–10 segments unless the product is dense.
5. **Never claim something the demo can't show.** If you say "now I'll click the buy button", the visuals had better actually click it.
6. **Count segment types.** Tag each segment as NAVIGATE, INTERACT, or OBSERVE. If NAVIGATE + INTERACT < 50%, go back to Phase 2 and add real user actions.
7. **Check for museum-tour streaks.** If you have 3+ consecutive OBSERVE segments, merge or replace them with an INTERACT segment.

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

## Coverage scoring (non-negotiable principle)

Never evaluate demo quality as simple "pass/fail". Instead, enumerate every possible operation on the target site and score coverage as a ratio.

### How to score

1. **Enumerate all operations** — List every CRUD operation, route, UI component, and interactive feature the site exposes. Sources (in priority order):
   - OpenAPI spec or TypeDefs (if source code is available)
   - YAML checklist (`demo/checklists/*.yaml`)
   - Route/URL enumeration from the live site
   - Component/feature counting from `demo/stories/*.story.md`

2. **Map demo coverage** — For each operation, mark whether the demo actually demonstrates it:
   - A full CRUD entity = 4 operations (Create, Read, Update, Delete)
   - A video showing CRU but not D = 3/4
   - A read-only page with 5 sections, demo shows 3 = 3/5

3. **Calculate ratio** — `demonstrated / total_possible`

4. **Report line by line** — Never summarize as a single number. Show the full matrix so gaps are visible.

### Example

```
## registry.comfy.org coverage: 14/22 (64%)

| Feature              | C | R | U | D | Notes           |
|----------------------|---|---|---|---|-----------------|
| Search nodes         |   | ✅ |   |   | types + results |
| Node detail page     |   | ✅ |   |   |                 |
| Publish a node       | ❌ | ❌ | ❌ | ❌ | auth required   |
| Filter by OS         |   | ✅ |   |   |                 |
| Sort results         |   | ✅ |   |   |                 |
| Pagination           |   | ✅ |   |   |                 |
| ...                  |   |   |   |   |                 |
```

This principle applies to all phases: story writing (phase 2 must acknowledge total surface area), video scripting (phase 3 must justify what's omitted), and project status reporting.

## Anti-patterns (things that produce bad demos)

These were identified by Gemini 3.1 Pro review of generated videos (avg 3.7–6.3/10). Avoid them.

### 1. Museum tour — hover everything, touch nothing
```ts
// BAD: 50 segments of safeMove, nothing clicked
.segment("Here's the search bar.", async (pace) => {
  await safeMove(page, 'input[placeholder*="Search"]'); await pace();
})
.segment("Here's the login button.", async (pace) => {
  await safeMove(page, 'button:has-text("Login")'); await pace();
})
```
**Fix:** Actually USE the search bar. Type a query. Click a result. One INTERACT segment replaces 5 OBSERVE segments.

### 2. Narrating intent instead of doing it
```ts
// BAD: Two segments where one would do
.segment("I'm going to click the search box now.", async (pace) => { ... })
.segment("Now I'm typing controlnet.", async (pace) => { ... })
```
**Fix:** One segment: "Let me search for controlnet — the most common query." with typeKeys in the action.

### 3. "Out of scope" for navigable features
```markdown
## Out of scope
- Node detail pages (can't navigate inside segments)  ← WRONG
```
**Fix:** With `setup` callbacks, you CAN navigate. Remove artificial scope limits.

### 4. Commentary without action
```ts
// BAD: narrator talks but cursor just sits at center
.segment("The registry is valuable because...", async (pace) => {
  await page.mouse.move(640, 360); await pace();
})
```
**Fix:** Merge commentary into an INTERACT segment. Explain WHY while the user is actively doing something.

### 5. Segments that only wait
```ts
// BAD: just waiting for results to appear
.segment("Results appear.", async (pace) => {
  await page.waitForTimeout(1500); await pace();
})
```
**Fix:** Merge into the typing segment — results appear as the user types.

## Hard rules (non-negotiable)

These are encoded in past commit history and bug reports:

| Rule | Why |
|------|-----|
| **No `page.goto` inside `.segment()` ACTION callbacks** | Heavy nav overruns audio length → silent gaps in final video ([demowright #10](https://github.com/snomiao/demowright/issues/10)). Use the `setup` callback instead: `.segment("narration", { setup: async () => { await page.goto(...) }, action: async (pace) => { /* visual only */ } })` |
| **No `page.click()` that triggers navigation inside ACTION callbacks** | Same overrun problem. Navigation clicks go in `setup`, visual-only clicks go in `action`. |
| **Use `safeMove(page, sel)` not `moveToEl`** | `moveToEl` throws on missing selectors ([demowright #2](https://github.com/snomiao/demowright/issues/2)) |
| **Title/outro `durationMs: 2000`** | Long enough to read, short enough not to bore |
| **Pre-navigate BEFORE `script.render()`** | Wall clock counts toward segment timing once render starts |
| **Always call `script.prepare(page)` first** | Pre-fetches ALL TTS in parallel — no API latency mid-test |
| **Only `safeMove` / `mouse.wheel` / `mouse.move` / `hover` / `typeKeys` in segments** | These don't call `page.evaluate` which can hang on SSR sites ([demowright #3](https://github.com/snomiao/demowright/issues/3)) |
| **No `element.focus()` inside segments** | `focus()` calls `page.evaluate()` internally → hangs on many sites. Use `mouse.click(boundingBox)` instead. |
| **For SSR sites that hang anyway** (e.g., www.comfy.org) | Block all `<script>` resources via `page.route`, see `comfy-website.spec.ts` |
| **ZERO idle frames — always move the mouse** | Every segment must have continuous visual action. Never let the cursor sit still while narrating. If you're explaining something, hover related elements. If there's nothing to show, shorten or cut the segment. |

## Setup callback patterns (reference)

The `setup` callback runs BEFORE narration starts — use it for page transitions and heavy operations. The `action` callback runs DURING narration — visual-only actions here.

### Pattern 1: Navigate to a new page
```ts
.segment(VIDEO_SCRIPT[N].narration, {
  setup: async () => {
    const link = page.locator('a[href*="/nodes/"]').first();
    const box = await link.boundingBox().catch(() => null);
    if (box) await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    await page.waitForTimeout(3000);
  },
  action: async (pace) => {
    await safeMove(page, "h1"); await pace();
    await safeMove(page, "code, pre"); await pace();
  },
})
```

### Pattern 2: Fill a form and submit
```ts
.segment(VIDEO_SCRIPT[N].narration, {
  setup: async () => {
    const input = page.locator("input[placeholder*='URL']").first();
    const box = await input.boundingBox().catch(() => null);
    if (box) await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    await input.fill("https://example.com/image.png");
    const btn = page.locator('button:has-text("Load")').first();
    const btnBox = await btn.boundingBox().catch(() => null);
    if (btnBox) await page.mouse.click(btnBox.x + btnBox.width / 2, btnBox.y + btnBox.height / 2);
    await page.waitForTimeout(3000);
  },
  action: async (pace) => {
    await safeMove(page, "[class*='result']"); await pace();
  },
})
```

### Pattern 3: Same-page button (no setup needed)
```ts
// Buttons that don't navigate are safe in action callbacks
.segment(VIDEO_SCRIPT[N].narration, async (pace) => {
  await clickTimeRange(page, "1 Month");
  await page.mouse.move(300, 400); await pace();
  await page.mouse.move(700, 400); await pace();
})
```

### When to use setup vs action

| Operation | Where | Why |
|-----------|-------|-----|
| `page.goto()` | `setup` | Network latency is unpredictable |
| Click that triggers navigation | `setup` | Page load time varies |
| `waitForTimeout(>500ms)` | `setup` | Long waits = silent gaps in narration |
| `typeKeys()` (visual typing) | `action` | User sees typing live |
| `safeMove()` / `mouse.move()` | `action` | Visual cursor movement |
| `mouse.click()` on same-page button | `action` | Fast, no navigation |
| `mouse.wheel()` | `action` | Viewer sees scrolling |

## Output paths

```
demo/stories/<product>.story.md      ← Phase 2 output (committed)
demo/<product>.spec.ts               ← Phases 3–5 output (committed)
.comfy-qa/.demos/<baseName>.mp4      ← Final video (gitignored)
.comfy-qa/.demos/tmp/<base>.wav      ← Intermediate audio (gitignored)
.comfy-qa/.tmp/demos/<test>/         ← Playwright artifacts (gitignored)
```

## Reference templates

| Spec | Segs | NAVIGATE | INTERACT | OBSERVE | Ratio | Notes |
|------|:----:|:--------:|:--------:|:-------:|:-----:|-------|
| `demo/download-data.spec.ts` | 9 | 0 | 5 | 4 | 56% ✅ | clicks 4 time-range buttons + chart sweep |
| `demo/registry-web.spec.ts` | 56 | 2 | 7 | 47 | 16% ❌ | needs rewrite — mostly hover tour |
| `demo/comfy-website.spec.ts` | 12 | 0 | 0 | 12 | 0% ❌ | JS blocked SSR, needs interactive segments |

**Best example:** `demo/download-data.spec.ts` — every button clicked, chart hovered, compact 9 segments.
**Setup pattern example:** `demo/registry-web.spec.ts` segments 48-49 — navigate to detail page and back via `setup` callback.
**SSR workaround:** `demo/comfy-website.spec.ts` — blocks all `<script>` for Nuxt sites that hang on `page.evaluate`.
