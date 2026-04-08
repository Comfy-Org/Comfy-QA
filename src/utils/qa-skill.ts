import { $ } from "bun";
import * as fs from "fs";
import * as path from "path";
import crypto from "crypto";

const SKILL_PATH = ".claude/skills/comfy-qa/SKILL.md";
const REPRODUCE_PATH = ".claude/skills/comfy-qa/REPRODUCE.md";
const PW_CONFIG_PATH = "playwright.qa.config.ts";
const QA_SPEC_PATH = "tests/e2e/qa.spec.ts";

interface StackInfo {
  framework: "next" | "nuxt" | "vite" | "cra" | "unknown";
  pkgManager: "bun" | "pnpm" | "yarn" | "npm";
  port: number;
  hasPlaywright: boolean;
  hasFirebase: boolean;
  uiLibrary: string | null;
  devScript: string;
  routes: string[];
  testIds: string[];
  depsHash: string;
}

/** Detect the repo stack from package.json and filesystem */
function detectStack(wsPath: string): StackInfo {
  const pkgPath = path.join(wsPath, "package.json");
  const pkg = fs.existsSync(pkgPath)
    ? JSON.parse(fs.readFileSync(pkgPath, "utf-8"))
    : {};

  const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
  const depNames = Object.keys(allDeps);
  const scripts = pkg.scripts ?? {};

  // Framework
  let framework: StackInfo["framework"] = "unknown";
  if (depNames.includes("next")) framework = "next";
  else if (depNames.includes("nuxt")) framework = "nuxt";
  else if (depNames.includes("vite") || depNames.includes("@vitejs/plugin-vue") || depNames.includes("@vitejs/plugin-react")) framework = "vite";
  else if (depNames.includes("react-scripts")) framework = "cra";

  // Package manager
  let pkgManager: StackInfo["pkgManager"] = "npm";
  if (fs.existsSync(path.join(wsPath, "bun.lock")) || fs.existsSync(path.join(wsPath, "bun.lockb"))) pkgManager = "bun";
  else if (fs.existsSync(path.join(wsPath, "pnpm-lock.yaml"))) pkgManager = "pnpm";
  else if (fs.existsSync(path.join(wsPath, "yarn.lock"))) pkgManager = "yarn";

  // Port
  let port = 3000;
  if (framework === "vite") port = 5173;
  else if (framework === "nuxt" || framework === "next") port = 3000;

  // Playwright
  const hasPlaywright = depNames.includes("@playwright/test") || depNames.includes("playwright");

  // Firebase
  const hasFirebase = depNames.some((d) => d.includes("firebase") || d.includes("vuefire"));

  // UI library
  let uiLibrary: string | null = null;
  if (depNames.includes("primevue")) uiLibrary = "PrimeVue";
  else if (depNames.includes("flowbite-react")) uiLibrary = "Flowbite React";
  else if (depNames.some((d) => d.startsWith("@mui/"))) uiLibrary = "MUI";
  else if (depNames.includes("@chakra-ui/react")) uiLibrary = "Chakra UI";
  else if (depNames.includes("antd")) uiLibrary = "Ant Design";

  // Dev script
  const devScript = scripts.dev ? "dev" : scripts.start ? "start" : "dev";

  // Deps hash for staleness detection
  const depsHash = crypto
    .createHash("md5")
    .update(JSON.stringify(allDeps))
    .digest("hex")
    .slice(0, 8);

  return {
    framework,
    pkgManager,
    port,
    hasPlaywright,
    hasFirebase,
    uiLibrary,
    devScript,
    routes: detectRoutes(wsPath, framework),
    testIds: detectTestIds(wsPath),
    depsHash,
  };
}

/** Find routes/pages from framework conventions */
function detectRoutes(wsPath: string, framework: string): string[] {
  const routes: string[] = ["/"];
  const candidates: string[] = [];

  // Next.js app router
  const appDir = path.join(wsPath, "app");
  if (fs.existsSync(appDir)) {
    candidates.push(...scanDirForPages(appDir, "page.tsx", "page.jsx", "page.ts", "page.js"));
  }

  // Next.js pages router
  const pagesDir = path.join(wsPath, "pages");
  if (fs.existsSync(pagesDir)) {
    candidates.push(...scanDirForPages(pagesDir, "index.tsx", "index.jsx", "index.ts", "index.js"));
  }

  // Nuxt pages
  const nuxtPages = path.join(wsPath, "pages");
  if (framework === "nuxt" && fs.existsSync(nuxtPages)) {
    candidates.push(...scanDirForPages(nuxtPages, "index.vue", ".vue"));
  }

  // Vue Router
  const srcRouter = path.join(wsPath, "src", "router");
  if (fs.existsSync(srcRouter)) {
    // Just note that router exists; routes are in code
    routes.push("/about", "/settings");
  }

  for (const c of candidates) {
    const route = "/" + c.replace(/\/(page|index)\.(tsx?|jsx?|vue)$/, "").replace(/\\/g, "/");
    if (route !== "/" && !routes.includes(route)) routes.push(route);
  }

  return routes.slice(0, 10); // cap at 10
}

function scanDirForPages(dir: string, ...fileNames: string[]): string[] {
  const results: string[] = [];
  try {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true, recursive: true })) {
      if (entry.isFile() && fileNames.some((f) => entry.name.endsWith(f) || entry.name === f)) {
        const rel = path.relative(dir, path.join(entry.parentPath || entry.path, entry.name));
        results.push(rel);
      }
    }
  } catch {}
  return results;
}

/** Find existing data-testid attributes */
function detectTestIds(wsPath: string): string[] {
  const ids: string[] = [];
  const srcDirs = ["src", "app", "pages", "components", "layouts"].map((d) => path.join(wsPath, d));

  for (const dir of srcDirs) {
    if (!fs.existsSync(dir)) continue;
    try {
      const files = fs.readdirSync(dir, { withFileTypes: true, recursive: true });
      for (const f of files) {
        if (!f.isFile()) continue;
        if (!/\.(vue|tsx|jsx|svelte)$/.test(f.name)) continue;
        const content = fs.readFileSync(path.join(f.parentPath || f.path, f.name), "utf-8");
        const matches = content.matchAll(/data-testid="([^"]+)"/g);
        for (const m of matches) ids.push(m[1]);
      }
    } catch {}
  }

  return [...new Set(ids)].slice(0, 30);
}

/** Generate all QA skill files */
function generateSkillFiles(wsPath: string, stack: StackInfo): void {
  // .claude/skills/comfy-qa/SKILL.md
  const skillDir = path.join(wsPath, ".claude", "skills", "comfy-qa");
  fs.mkdirSync(skillDir, { recursive: true });

  const skillContent = `---
name: comfy-qa
description: 'QA automation for this repo. Runs Playwright E2E tests with video recording.'
depsHash: "${stack.depsHash}"
---

# QA Skill

## Stack
- Framework: ${stack.framework}
- Package manager: ${stack.pkgManager}
- UI library: ${stack.uiLibrary ?? "none detected"}
- Auth: ${stack.hasFirebase ? "Firebase" : "none detected"}

## Prerequisites
- Node.js 22+
- \`${stack.pkgManager}\`
- Playwright browsers: \`npx playwright install chromium\`

## Dev Server
\`\`\`bash
${stack.pkgManager} run ${stack.devScript}  # → http://localhost:${stack.port}
\`\`\`

## Running QA Tests
\`\`\`bash
npx playwright test --config playwright.qa.config.ts
\`\`\`

## Key Routes
${stack.routes.map((r) => `- \`${r}\``).join("\n")}

${stack.testIds.length > 0 ? `## Data Test IDs\n${stack.testIds.map((id) => `- \`${id}\``).join("\n")}` : "## Data Test IDs\nNo \`data-testid\` attributes found yet. Add them to key interactive elements."}
`;

  fs.writeFileSync(path.join(skillDir, "SKILL.md"), skillContent);

  // REPRODUCE.md
  const reproduceContent = `---
name: reproduce-issue
description: 'Reproduce a GitHub issue interactively using Playwright.'
---

# Issue Reproduction

## Flow
1. Read the issue: \`gh issue view <number> --repo owner/repo\`
2. Start the dev server: \`${stack.pkgManager} run ${stack.devScript}\`
3. Open Playwright in headed mode for interactive exploration
4. Follow reproduction steps from the issue
5. Record video evidence
6. Generate a minimal reproduction test in \`tests/e2e/qa.spec.ts\`

## Prerequisites
- Dev server running on http://localhost:${stack.port}
${stack.hasFirebase ? "- Firebase Auth emulator: `firebase emulators:start --only auth`" : ""}
`;

  fs.writeFileSync(path.join(skillDir, "REPRODUCE.md"), reproduceContent);

  // playwright.qa.config.ts
  if (!fs.existsSync(path.join(wsPath, PW_CONFIG_PATH))) {
    const pwConfig = `import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  reporter: [["list"], ["html", { open: "never" }]],
  timeout: 60000,

  use: {
    baseURL: "http://localhost:${stack.port}",
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
`;
    fs.writeFileSync(path.join(wsPath, PW_CONFIG_PATH), pwConfig);
  }

  // tests/e2e/qa.spec.ts (only if not exists)
  const specPath = path.join(wsPath, QA_SPEC_PATH);
  if (!fs.existsSync(specPath)) {
    fs.mkdirSync(path.dirname(specPath), { recursive: true });

    const routeTests = stack.routes
      .map(
        (r) => `
  test("loads ${r}", async ({ page }) => {
    await page.goto("${r}");
    await expect(page).not.toHaveTitle(/error/i);
    await page.waitForLoadState("networkidle");
  });`
      )
      .join("\n");

    const specContent = `import { test, expect } from "@playwright/test";

test.describe("QA Smoke Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
  });

  test("home page loads", async ({ page }) => {
    await expect(page).not.toHaveTitle(/error/i);
  });
${routeTests}
});
`;
    fs.writeFileSync(specPath, specContent);
  }

  // .gitignore — ensure tmp/ is ignored
  const gitignorePath = path.join(wsPath, ".gitignore");
  if (fs.existsSync(gitignorePath)) {
    const content = fs.readFileSync(gitignorePath, "utf-8");
    if (!content.includes("tmp/")) {
      fs.appendFileSync(gitignorePath, "\n# QA output\ntmp/\n");
    }
  }
}

/** Check if QA skill exists and is up-to-date */
function isSkillCurrent(wsPath: string, stack: StackInfo): boolean {
  const skillPath = path.join(wsPath, SKILL_PATH);
  if (!fs.existsSync(skillPath)) return false;

  const content = fs.readFileSync(skillPath, "utf-8");
  const hashMatch = content.match(/depsHash:\s*"([^"]+)"/);
  if (!hashMatch) return false;

  return hashMatch[1] === stack.depsHash;
}

/**
 * Ensure the QA skill is set up in the workspace.
 * If missing or stale: checkout comfy-qa branch → generate files → commit.
 */
export async function ensureQASkill(wsPath: string): Promise<void> {
  const stack = detectStack(wsPath);

  if (isSkillCurrent(wsPath, stack)) {
    console.log(`  [qa-skill] Up-to-date (hash ${stack.depsHash})`);
    return;
  }

  const skillExists = fs.existsSync(path.join(wsPath, SKILL_PATH));
  console.log(`  [qa-skill] ${skillExists ? "Updating" : "Setting up"} QA skill…`);
  console.log(`  [qa-skill] Detected: ${stack.framework}, ${stack.pkgManager}, port ${stack.port}`);

  // Checkout or create comfy-qa branch
  try {
    await $`git -C ${wsPath} checkout comfy-qa`.quiet();
    console.log(`  [qa-skill] Switched to existing comfy-qa branch`);
  } catch {
    try {
      await $`git -C ${wsPath} checkout -b comfy-qa`.quiet();
      console.log(`  [qa-skill] Created comfy-qa branch`);
    } catch {
      // May fail if already on comfy-qa or detached HEAD — that's fine
      console.log(`  [qa-skill] Continuing on current branch`);
    }
  }

  // Generate files
  generateSkillFiles(wsPath, stack);
  console.log(`  [qa-skill] Generated: SKILL.md, REPRODUCE.md, playwright.qa.config.ts, qa.spec.ts`);

  // Install Playwright if not present
  if (!stack.hasPlaywright) {
    console.log(`  [qa-skill] Installing @playwright/test…`);
    try {
      if (stack.pkgManager === "bun") {
        await $`bun add -D @playwright/test`.cwd(wsPath).quiet();
      } else if (stack.pkgManager === "pnpm") {
        await $`pnpm add -D @playwright/test`.cwd(wsPath).quiet();
      } else {
        await $`npm install -D @playwright/test`.cwd(wsPath).quiet();
      }
    } catch (err) {
      console.log(`  [qa-skill] Failed to install Playwright (non-fatal)`);
    }
  }

  // Install Playwright browsers
  try {
    await $`npx playwright install chromium`.cwd(wsPath).quiet();
  } catch {}

  // Commit
  try {
    await $`git -C ${wsPath} add .claude/ playwright.qa.config.ts tests/e2e/qa.spec.ts .gitignore`.quiet();
    await $`git -C ${wsPath} commit -m "chore: set up comfy-qa E2E testing"`.quiet();
    console.log(`  [qa-skill] Committed QA setup`);
  } catch {
    console.log(`  [qa-skill] Nothing to commit (files unchanged)`);
  }
}
