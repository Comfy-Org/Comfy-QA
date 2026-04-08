---
name: comfy-qa-setup
description: 'Set up the comfy-qa skill for a frontend repository. Adds .claude/skills/comfy-qa/SKILL.md, playwright.qa.config.ts, and a starter qa.spec.ts tailored to the repo stack.'
---

# Comfy-QA Setup Skill

Add QA automation infrastructure to a frontend repository so that the `comfy-qa`
CLI and Claude agents can run Playwright E2E tests with video recording.

## What This Skill Produces

```
.claude/skills/comfy-qa/
  SKILL.md              # Repo-specific QA instructions for agents
  REPRODUCE.md          # Interactive issue reproduction guide
playwright.qa.config.ts # Playwright config (video ON, trace ON)
tests/e2e/qa.spec.ts    # Starter smoke tests for key routes/features
```

## Step 1: Identify the Repo Stack

Read `package.json` to determine:

| Field | What to look for |
|-------|-----------------|
| Framework | `next` → Next.js, `nuxt` → Nuxt, `vue` + `vite` → Vue+Vite |
| Package manager | `bun.lock` → bun, `pnpm-lock.yaml` → pnpm, `yarn.lock` → yarn, else npm |
| Auth | `firebase`, `vuefire`, `react-firebase-hooks` → Firebase Auth |
| UI library | `primevue`, `flowbite-react`, `@mui/*` |
| Existing tests | `@playwright/test`, `vitest`, `jest` in devDeps |
| Dev port | Check `scripts.dev` or framework config file |

## Step 2: Set Up the Backend

**No mocks.** QA must run against real servers. The decision of *which* backend
to use depends on whether the QA target (the PR/issue being tested) touches
backend code or behavior.

### Decision rule

```
Is the QA target related to the backend?
  ├─ YES → Clone backend repo to tmp/, build & run locally, point frontend to localhost
  └─ NO  → Use the staging server (the repo's default local dev config)
```

**"Related to backend"** means: the bug/feature involves API responses, data
flow, WebSocket messages, auth behavior, or anything where the backend's
behavior is part of what's being tested.

**"Unrelated to backend"** means: pure UI bugs, layout, CSS, i18n, theme
switching, client-side interactions — anything that behaves the same regardless
of which backend serves the data.

### When QA target is unrelated to backend (default)

Most frontend repos already point to a staging API server in their
`.env.development` or equivalent config. Just start the frontend dev server —
it will use staging automatically.

```bash
# Read the repo's env config to find the staging URL
cat .env.development | grep API

# Start the frontend — API calls go to staging
PKG_MANAGER run dev
```

### When QA target IS related to backend

Clone the backend repo into `tmp/`, build it, run it locally, and point the
frontend to the local backend for debugging/QA.

```bash
# 1. Clone the backend into the workspace
git clone --depth 10 BACKEND_REPO_URL tmp/BACKEND_DIR
cd tmp/BACKEND_DIR

# 2. Install deps and start
#    - For Python backends: venv + pip install + python main.py
#    - For Go backends: go get + start script
#    - For Node backends: npm install + npm start

# 3. If the backend needs a database, set it up:
#    - Supabase: `supabase start` (local Postgres)
#    - Docker: `docker compose up -d`
#    - SQLite: often no setup needed

# 4. Point the frontend to local backend
API_BASE_URL=http://localhost:BACKEND_PORT PKG_MANAGER run dev
```

### When the frontend needs auth emulators

If the project uses Firebase Auth or similar, start the auth emulator locally:

```bash
firebase emulators:start --only auth
```

### Principle: always real, never mocked

- All backend services must be real (local or staging)
- All databases must be real (local Supabase/Postgres/Docker, or staging)
- Auth must use real emulators or staging, not intercepted routes
- The QA environment must match what end users face

## Step 3: Install Playwright

Check if `@playwright/test` is already in devDeps. If not:

```bash
PKG_MANAGER add -D @playwright/test
npx playwright install chromium
```

## Step 4: Create playwright.qa.config.ts

Adapt this template based on the repo's framework and port:

```typescript
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  reporter: [["list"], ["html", { open: "never" }]],
  timeout: 60000,

  use: {
    baseURL: "http://localhost:PORT",  // ← fill in from dev server
    trace: "on",
    screenshot: "on",
    video: "on",
  },

  expect: { timeout: 10000 },

  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],

  outputDir: "./tmp/qa-results/",
  testDir: "./tests/e2e",
});
```

Common port defaults: Next.js → 3000, Nuxt → 3000, Vite → 5173.

## Step 5: Create .claude/skills/comfy-qa/SKILL.md

Write a repo-specific SKILL.md describing:

1. **Stack** — framework, package manager, UI library
2. **Prerequisites** — Node version, required tools, env vars
3. **Dev server** — how to start, which port
4. **Backend** — which backend repo, staging URL, how to run locally
5. **Auth** — if applicable, how to set up auth for testing
6. **Key routes** — main pages/features to cover in QA
7. **Data test IDs** — `data-testid` conventions used in the codebase
8. **Running QA** — the exact command to run tests

Use `grep -r 'data-testid' --include='*.vue' --include='*.tsx' --include='*.jsx'`
to discover existing test selectors.

## Step 6: Create .claude/skills/comfy-qa/REPRODUCE.md

Write a repo-specific issue reproduction guide covering:

1. How to read and parse an issue
2. How to set up prerequisites (custom nodes, workflows, settings)
3. How to explore interactively with Playwright in headed mode
4. How to record video evidence
5. How to generate a minimal reproduction test

## Step 7: Create tests/e2e/qa.spec.ts

Write starter smoke tests that cover the repo's critical paths.
The tests should:

- Navigate to each key route and ve dzrify it loads
- Test the primary user flow (the main thing the app does)
- Test auth flow if the app has login/signup
- Test responsive layout at common breakpoints
- Test accessibility basics (keyboard navigation, ARIA labels)

## Step 8: Add to .gitignore

Ensure the repo's `.gitignore` includes:
```
tmp/
```

## Step 9: Verify

Run the QA tests locally to make sure they pass:

```bash
PKG_MANAGER run dev &
npx playwright test --config playwright.qa.config.ts
```
