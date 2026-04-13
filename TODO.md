# Comfy-QA: Research Agent → QA Evidence Video Pipeline

## Architecture

```
Checklist YAML (feature x CRUD operations with point values)
  → Research Agent Phase 1: explore site, test each operation, pass/fail
  → Research Agent Phase 2: generate .spec.ts, debug without video (fast, no demowright delays)
  → Research Agent Phase 3: record with video (demowright delays + TTS + cursor overlay)
  → Final video: demo of all operations (successes + failures) + QA scorecard
```

## TODO

### Remaining
- [ ] Improve Gemini evaluation score: average 3.7/10 → target 7/10
- [ ] Fix mux-reporter subtitles filter on macOS (path quoting)
- [ ] Reduce title card idle time (video starts recording before render begins)

## DONE

- [x] QA Research Agent (`src/agent/qa-research.ts`) — 3-phase pipeline
- [x] Phase 1: headless LLM exploration, tests each CRUD operation, scores pass/fail
- [x] Phase 2: generates demowright .spec.ts, debug loop with LLM auto-fix (3 retries)
- [x] Phase 3: runs spec with video recording (demowright delays + TTS)
- [x] Anthropic SDK with 60s timeout (fixes Bun fetch hanging)
- [x] Phase 2 pass detection: regex "N passed"/"N failed" (not string match)
- [x] Visual actions in system prompt (safeMove, hover, scroll required)
- [x] QA scorecard: fullscreen HTML card with color-coded results + long narration
- [x] Checklist YAMLs: registry-web, comfy-docs, comfy-website, download-data, embedded-editor
- [x] CRUD operations: added create (search input), update (filter switch) operations
- [x] cloud-comfy headless WebGL via Chromium --headless=new
- [x] Gemini 3.1 Pro video evaluator (demo/evaluate-demos.ts)
- [x] demowright setup API: segment({ setup, action }) for pre-narration navigation
- [x] Deleted old demo-research.ts and demo-editor.ts
- [x] Timeout increased to 20min for slow specs
- [x] preserveOutput: "always" for webm retention
- [x] mux-reporter webm fallback + subtitles fallback
- [x] docs/research-agent.md with QA principles

### QA Scores (Phase 1)
| Product | Score |
|---------|-------|
| comfy-docs | 80% (4/5) |
| comfy-website | 80% (4/5) |
| comfy-registry | 77% (10/13) |
| embedded-workflow-editor | 75% (3/4) |
| download-data | 100% (5/5) |

### Gemini Video Evaluation
| Video | Score |
|-------|-------|
| comfy-registry-qa | 5/10 |
| comfy-docs-qa | 4/10 |
| download-data-qa | 2/10 |
| Average | 3.7/10 |
