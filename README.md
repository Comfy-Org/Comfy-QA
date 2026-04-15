# comfy-qa

E2E QA automation for user-facing frontend repos. AI-driven Playwright tests with video recording, HUD overlay, and structured reports.

## One-shot setup

Tell your AI agent (Claude Code, Cursor, etc.):

```
run npx cmqa setup
```

The agent reads the emitted prompt and automatically:

- Detects your framework, package manager, backend, and auth
- Installs Playwright
- Creates `playwright.qa.config.ts` with video/trace/screenshot enabled
- Creates `.claude/skills/comfy-qa/SKILL.md` tailored to your repo
- Creates `.claude/skills/comfy-qa/REPRODUCE.md` for issue reproduction
- Creates starter `tests/e2e/qa.spec.ts` covering your key routes
- Updates `.gitignore`

Re-running `npx cmqa setup` updates existing files without overwriting what's already correct.

## QA a PR or issue

```bash
# Paste a GitHub URL — auto-detects PR vs issue
cmqa https://github.com/org/repo/pull/123
cmqa https://github.com/org/repo/issues/456

# Or use subcommands
cmqa pr https://github.com/org/repo/pull/123
cmqa issue org/repo#456

# Batch QA recent open issues
cmqa full org/repo --limit 5
```

Each run produces in `.comfy-qa/<slug>/`:

| File | Content |
|------|---------|
| `report.md` | Full QA report — bug analysis, checklist, test scenarios |
| `qa-sheet.md` | Printable QA checklist for manual testing |
| `<type>-<N>.e2e.ts` | Generated Playwright E2E test |
| `qa-<N>.webm` | Recorded session video with HUD overlay |
| `screenshots/` | Step-by-step screenshots |
| `research.json` | Raw research data |
| `agent-log.txt` | Agent action log |

## Options

```
--no-record         Disable video recording (ON by default)
--add-comment       Post report as GitHub comment
--comfy-url <url>   Point to a running dev server (default: auto-detect)
--limit N           Number of issues for batch mode (default: 5)
```

## How it works

1. **Research** — Fetches PR/issue from GitHub, Claude analyzes bug/feature and generates QA checklist + test scenarios
2. **Record** — Playwright opens the app with a HUD overlay showing what the agent is doing. If the dev server is running, an AI agent drives the browser through each test scenario
3. **Report** — Generates structured markdown report, QA sheet, E2E test file, and video

### Backend strategy

No mocks. QA runs against real servers:

- If the QA target is **unrelated to the backend** — use the repo's default staging server
- If the QA target **is related to the backend** — clone the backend to `tmp/`, build, run locally, point the frontend to `localhost`

## Install

```bash
bun install
```

## Roadmap

Short-term, in priority order:

1. **Improve reproduction precision.** Current pipeline misses bugs that depend
   on specific workflows or custom nodes (see
   [PR #9430](https://github.com/Comfy-Org/ComfyUI_frontend/pull/9430) — 8/11
   reproduced). Environment setup tools (workflow loader, custom-node
   installer, attachment downloader) close this gap.

2. **Measure reliability (flakiness).** Run the same checklist N times, track
   pass→fail→pass transitions per operation. A QA run is only trustworthy if
   its result is stable across repeats. Surface flaky operations on the
   dashboard.

3. **Auto-file GitHub issues for failing operations** — gated behind a
   confidence threshold. `scripts/report-failures.sh` exists but is intentionally
   not wired up yet: while reproduction rate is still ~70%, auto-filing would
   drown maintainers in false positives. Enable once (1) and (2) lift the
   floor, and keep a manual review step before filing the first batch per repo.

4. **Cross-product QA matrix.** Today: registry, docs, website, download-data,
   embedded-editor. Add cloud.comfy.org (WebGL, already working via
   `--headless=new`), comfy-vibe, and first-party ComfyUI_frontend runs.

5. **Continuous QA.** Schedule daily runs, track score trends per product,
   alert on regressions (score drop ≥ 10%).

## License

MIT
