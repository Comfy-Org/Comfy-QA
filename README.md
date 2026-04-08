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

## License

MIT
