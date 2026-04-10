# Research Agent — QA Evidence Video Pipeline

## Overview

The Research Agent automates QA testing of Comfy-Org web products. It explores
a website, tests CRUD operations for each feature, scores results, and produces
a narrated video demonstrating both successes and failures.

**Key constraints:**
- We only modify QA tests, never source code.
- QA tests never throw. Even if a feature is broken, the test passes.

## Principles

1. **Observe, don't assert.** QA tests record what actually happens — they don't
   assert what should happen. If a feature fails, the test demonstrates the
   failure in the video. It does not `throw` or mark the Playwright test as failed.

2. **Evidence for humans.** The output video is evidence that anyone can watch to
   understand the current state of the product. Successes and failures are both
   shown with narration explaining what happened.

3. **Reproduction tests.** A generated spec that demonstrates a bug serves as a
   reproduction test. When the bug is later fixed, the spec will show the feature
   working instead of failing — proving the fix. The test itself always passes
   either way.

4. **Scores, not verdicts.** The QA score (e.g. 9/13) is informational. A low
   score means "these features don't work as expected," not "the test failed."
   The scorecard in the outro is a summary, not a pass/fail gate.

## Architecture

```
Checklist YAML (feature x CRUD operations)
  │
  ▼
Phase 1: Research (no video, headless, fast)
  LLM explores site → tests each operation → pass/fail
  Retries failed operations multiple times before marking as fail
  Output: research-results.json (selectors, narrations, scores)
  │
  ▼
Phase 2: Generate & Debug spec (no video, demowright fast mode)
  Generate .spec.ts from Phase 1 results
  Run `playwright test` without video → demowright skips delays
  LLM fixes failing steps and retries
  Loop until spec passes (or max retries)
  │
  ▼
Phase 3: Record (with video, demowright demo mode)
  Run finalized spec with video recording
  demowright adds: demo delays, cursor overlay, TTS narration
  Failed operations are demonstrated (not skipped)
  Final frame: QA scorecard (fullscreen outro card)
  Output: .comfy-qa/.demos/<product>.mp4
```

## Why This Architecture

Previous approach recorded video while the LLM was thinking (15-30s gaps per
decision). Cutting idle time with ffmpeg helped (63% removal) but could never
produce a polished result. Separating "figuring out what to do" from "recording
the demo" eliminates idle time entirely.

## Checklist YAML Format

```yaml
product: Comfy Registry
url: https://registry.comfy.org/

features:
  - name: Node Search
    operations:
      - id: search_by_name
        type: read
        description: "Search for a node by name"
        steps_hint: "Click search input, type 'SUPIR', verify results appear"
        narration: "Searching for SUPIR — results stream in instantly."
        success_criteria: "Search results visible with node cards"

      - id: search_filters
        type: read
        description: "Filter search results"
        steps_hint: "Apply OS or accelerator filter"
        narration: "Filtering to show only nodes compatible with my setup."
        success_criteria: "Filter applied, results updated"

  - name: Node Detail
    operations:
      - id: view_node
        type: read
        description: "View a node's detail page"
        ...
      - id: install_node
        type: create
        description: "Copy install command"
        ...
```

Each operation is 1 point. Total score = passed / total operations.

## QA Scorecard

The final video frame shows a fullscreen card with results:

```
┌─────────────────────────────────┐
│   Comfy Registry QA Results     │
│                                 │
│   Node Search          2/2  ✅  │
│   Node Detail          4/5  ⚠   │
│     ❌ view_readme              │
│   Publisher             3/3  ✅  │
│   Documentation         2/2  ✅  │
│                                 │
│   Total: 11/12 (92%)            │
└─────────────────────────────────┘
```

This is rendered as a demowright outro card with the score table.

## Generated Spec Format

The Research Agent generates a standard demowright `.spec.ts`:

```typescript
import { test, safeMove } from "./fixtures/fixture";
import { createVideoScript } from "../lib/demowright/dist/index.mjs";

test("registry-web QA", async ({ page }) => {
  await page.goto("https://registry.comfy.org/");
  await page.waitForTimeout(2000);

  const script = createVideoScript()
    .title("Comfy Registry QA", { subtitle: "Automated QA Evidence", durationMs: 2000 })

    // ✅ search_by_name (PASS)
    .segment("Searching for SUPIR — results stream in instantly.", async (pace) => {
      await page.click("input[placeholder*='Search']");
      await page.keyboard.type("SUPIR", { delay: 80 });
      await pace();
      await page.waitForSelector(".result-card");
      await pace();
    })

    // ❌ view_readme (FAIL — demonstrated)
    .segment("Trying to view the README section, but it fails to load.", async (pace) => {
      await safeMove(page, ".readme-section");
      await pace();
      // Show the failure state
    })

    // QA Scorecard (outro)
    .outro({
      text: "QA Results: 11/12 (92%)",
      subtitle: "Node Search 2/2 ✅ | Node Detail 4/5 ⚠ | Publisher 3/3 ✅",
      durationMs: 5000,
    });

  await script.prepare(page);
  await script.render(page, { baseName: "registry-web", outputDir: ".comfy-qa/.demos" });
});
```

## Integration with Existing Specs

The generated specs coexist with hand-written `demo/*.spec.ts` files. Both use
the same demowright fixture. The Research Agent can also update existing specs
when the UI changes.

## Running

```sh
# Phase 1: Research (explore + score)
bun src/agent/research.ts demo/checklists/registry-web.yaml

# Phase 2+3 are automated by Phase 1
# Or run the generated spec directly:
bunx playwright test demo/registry-web.spec.ts
```
