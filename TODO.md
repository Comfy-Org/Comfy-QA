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

### 3. Research Agent Phase 2 — Debug loop
- [x] If spec fails, LLM reads error + spec → fixes spec → re-runs
- [x] Loop until spec passes or max retries (3)
- [ ] Handle common failures: selector changed, page didn't load, timeout

### 4. Research Agent Phase 3 — Record
- [ ] Verify demowright correctly detects video mode and adds delays
- [ ] Verify TTS narration plays during recording
- [ ] If recording fails, go back to Phase 2 to fix, then retry Phase 3

### 5. QA Scorecard rendering
- [ ] Render QA results as fullscreen demowright outro card
- [ ] Show per-feature scores (e.g., Node Detail 4/5)
- [ ] Show total score (e.g., 11/13 = 85%)
- [ ] Consider richer scorecard (HTML canvas or SVG overlay)

### 6. Cleanup & polish
- [ ] Remove old demo-research.ts and demo-editor.ts once new pipeline is validated
- [ ] Run on all Comfy-Org products (cloud, docs, embedded-editor, etc.)
- [ ] Add more CRUD operations to checklist (currently all read-only)

## DONE

### New architecture (Phase 1 + spec generation)
- [x] Redesigned checklist YAML format with CRUD operations and success_criteria
- [x] Built QA Research Agent (`src/agent/qa-research.ts`) with 3-phase pipeline
- [x] Phase 1: headless exploration with LLM, tests each operation, scores pass/fail
- [x] Phase 2: generates demowright-compatible `.spec.ts` from research results
- [x] Phase 3: runs spec via `playwright test` (debug fast, record with video)
- [x] QA scorecard printed to console + embedded in spec outro card
- [x] Wrote docs (`docs/research-agent.md`)
- [x] Updated `demo/checklists/registry-web.yaml` to new CRUD format

### Research Agent v1-v5 (exploration, now superseded)
- [x] Built Research Agent with LLM-in-the-loop recording
- [x] Built Editor Agent with segment scoring + ffmpeg assembly
- [x] Identified idle time problem (LLM thinking = 50-90% of video)
- [x] Improved Editor with burst-based cutting (63% idle removal)
- [x] Confirmed fundamental limitation: can't cut out all idle time
- [x] Decided on new architecture: separate research from recording

### Analysis & Findings
- [x] registry.comfy.org/nodes requires client-side auth (redirects to sign-in)
- [x] Individual node pages (/nodes/comfyui-reactor-node) work without auth
- [x] Publisher pages work without auth
- [x] docs.comfy.org accessible without auth
- [x] Improved agent success rate from 31% to 81% with better system prompts
