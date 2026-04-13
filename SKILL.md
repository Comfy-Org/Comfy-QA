---
name: comfy-qa
description: "Generate high-quality narrated QA demo videos for Comfy-Org products. Takes a PR, issue, feature doc, or product URL as input and produces a story, Playwright spec, and MP4 video with TTS narration and HUD overlay."
---

# comfy-qa

Automated QA demo video generator for Comfy-Org's public-facing products. Given a target (PR, issue, feature, or product URL), it generates narrated browser demo videos showing real user workflows.

## What this project does

```
Input:  PR / issue / feature doc / product URL
  ↓
Phase 1: Probe → discover site structure (headless browser)
Phase 2: Story → generate .comfy-qa/02-stories/<product>.story.md
Phase 3: Spec  → generate .comfy-qa/03-spec/<product>.spec.ts
Phase 4: Video → render .comfy-qa/04-videos/<product>.mp4
  ↓
Output: Narrated MP4 with TTS, cursor HUD, subtitles
```

## Quick start

```bash
# Install
bun install
bun run prepare   # sync demowright submodule

# Generate a demo for a product
# 1. Write or generate a story in .comfy-qa/02-stories/
# 2. Write or generate a spec in .comfy-qa/03-spec/
# 3. Run the spec
bunx playwright test .comfy-qa/03-spec/<product>.spec.ts

# Run all demos
bunx playwright test

# Evaluate output videos with Gemini
bun tmp/review-videos.ts
```

## Project structure

```
src/
├── agent/
│   ├── demo-research.ts   ← explores sites, generates stories
│   ├── demo-editor.ts     ← post-processes raw recordings
│   ├── browser-agent.ts   ← AI-driven browser automation
│   ├── orchestrator.ts    ← full QA pipeline (fetch → research → record → report)
│   └── research.ts        ← PR/issue analysis agent
├── cli.ts                 ← CLI entry point (cmqa)
└── utils/                 ← GitHub API, URL parsing, ComfyUI helpers

demo/
├── fixtures/
│   ├── fixture.ts         ← Playwright fixture (HUD + Gemini TTS + audio)
│   └── mux-reporter.ts    ← video + audio → MP4 muxer

.claude/skills/
├── demo-spec-author/SKILL.md  ← spec authoring rules and patterns

.comfy-qa/                 ← ALL generated output (gitignored)
├── spec/                  ← generated Playwright spec files
├── stories/               ← generated story markdown files
├── checklists/            ← generated feature checklists (YAML)
├── videos/                ← rendered MP4 videos
└── .tmp/                  ← intermediate Playwright artifacts
```

## Key principles

### 1. User journeys, not museum tours
Every demo must show a **complete user workflow** — search, click, navigate, type, copy — not just hover over elements. See `.claude/skills/demo-spec-author/SKILL.md` for the full spec-authoring guide.

### 2. Segment classification
Each video segment is classified as NAVIGATE (page transitions via `setup` callback), INTERACT (clicks, typing), or OBSERVE (hover/scroll). At least 50% of segments must be NAVIGATE or INTERACT.

### 3. Coverage scoring
Demo quality is measured by enumerating all CRUD operations on the target site and calculating coverage as a ratio (e.g., 13/22 = 59%). Never use simple pass/fail.

### 4. Zero idle frames
Every segment must have continuous cursor movement during narration. No segment where the mouse sits still while the narrator talks.

## Environment variables (.env.local)

```bash
GEMINI_API_KEY=...          # Required: TTS narration (Gemini 2.5 Flash)
CLOUD_USERNAME=...          # Optional: cloud.comfy.org login
CLOUD_PASSWORD=...
GOOGLE_USERNAME=...         # Optional: registry.comfy.org email login
GOOGLE_PASSWORD=...
```

## Submodule: demowright

`lib/demowright` provides cursor HUD overlay, TTS integration, and video production via `createVideoScript()`. After pulling, run `bun run prepare` to sync it.

## CLI

```bash
cmqa pr <owner/repo#number>     # QA a pull request
cmqa issue <owner/repo#number>  # QA an issue
cmqa full <owner/repo>          # Batch QA for a repo
```
