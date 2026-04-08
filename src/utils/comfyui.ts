import { $ } from "bun";
import * as path from "path";
import * as fs from "fs";

export interface ComfyUIInstance {
  url: string;
  pid?: number;
  repoPath?: string;
  /** All spawned processes (backend + frontend etc.) */
  procs: { name: string; pid: number; kill: () => void }[];
  stop: () => Promise<void>;
}

/** Known repo dependency graph: repo → related repos to clone into tmp/ */
const RELATED_REPOS: Record<string, { owner: string; repo: string; setup?: string }[]> = {
  // Web UIs testable with Playwright — real backend, no mocks
  "ComfyUI_frontend":  [{ owner: "Comfy-Org", repo: "ComfyUI", setup: "python" }],
  "registry-web":      [{ owner: "Comfy-Org", repo: "comfy-api", setup: "go" }],
  "website":           [{ owner: "Comfy-Org", repo: "comfy-api", setup: "go" }],
};

/** Check if a URL is actually serving ComfyUI (not some random app) */
async function isComfyUI(url: string): Promise<boolean> {
  try {
    const apiResp = await fetch(`${url}/api/system_stats`, {
      signal: AbortSignal.timeout(2000),
    });
    if (apiResp.ok) return true;
  } catch {}

  try {
    const resp = await fetch(url, { signal: AbortSignal.timeout(2000) });
    if (!resp.ok) return false;
    const html = await resp.text();
    return (
      html.includes("comfyui") ||
      html.includes("ComfyUI") ||
      html.includes("comfy-ui") ||
      html.includes("litegraph") ||
      html.includes("comfyApp")
    );
  } catch {
    return false;
  }
}

/** Detect a running ComfyUI instance by checking common ports */
export async function detectRunningInstance(): Promise<string | null> {
  const candidates = [
    "http://localhost:8188",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:8000",
  ];

  for (const url of candidates) {
    if (await isComfyUI(url)) {
      console.log(`  [detect] Verified ComfyUI at ${url}`);
      return url;
    }
  }

  console.log(`  [detect] No ComfyUI instance found on common ports`);
  return null;
}

/** Clone a single repo (or reuse existing) */
async function cloneRepo(
  repoUrl: string,
  destPath: string,
  opts?: { prNumber?: number; branch?: string }
): Promise<void> {
  if (fs.existsSync(destPath)) {
    console.log(`  [workspace] Reusing: ${destPath}`);
    try { await $`git -C ${destPath} pull --ff-only`.quiet(); } catch {}
    return;
  }

  console.log(`  [workspace] Cloning → ${destPath}`);
  if (opts?.prNumber && !opts?.branch) {
    await $`git clone --depth 50 ${repoUrl} ${destPath}`;
    console.log(`  [workspace] Fetching PR #${opts.prNumber} head…`);
    await $`git -C ${destPath} fetch origin pull/${opts.prNumber}/head:qa-pr-${opts.prNumber}`;
    await $`git -C ${destPath} checkout qa-pr-${opts.prNumber}`;
  } else {
    const branch = opts?.branch;
    if (branch) {
      await $`git clone --depth 10 --branch ${branch} ${repoUrl} ${destPath}`;
    } else {
      await $`git clone --depth 10 ${repoUrl} ${destPath}`;
    }
  }

  const hash = (await $`git -C ${destPath} rev-parse --short HEAD`.text()).trim();
  console.log(`  [workspace] Checked out at ${hash}`);
}

/**
 * Clone target repo into .comfy-qa/ws/<name>/
 * Clone related repos into .comfy-qa/ws/<name>/tmp/<related-repo>/
 */
export async function cloneWorkspace(opts: {
  owner: string;
  repo: string;
  outputBase: string;
  branch?: string;
  prNumber?: number;
}): Promise<string> {
  const wsBase = path.join(opts.outputBase, "ws");
  fs.mkdirSync(wsBase, { recursive: true });

  // Target repo
  const refLabel = opts.prNumber && !opts.branch ? `pr-${opts.prNumber}` : (opts.branch ?? "main");
  const dirName = `${opts.repo}-${refLabel}`;
  const wsPath = path.join(wsBase, dirName);

  await cloneRepo(
    `https://github.com/${opts.owner}/${opts.repo}.git`,
    wsPath,
    { prNumber: opts.prNumber, branch: opts.branch }
  );

  // Related repos → wsPath/tmp/<repo>/
  const related = RELATED_REPOS[opts.repo];
  if (related) {
    const tmpDir = path.join(wsPath, "tmp");
    fs.mkdirSync(tmpDir, { recursive: true });

    for (const rel of related) {
      const relPath = path.join(tmpDir, rel.repo);
      console.log(`  [related] ${rel.owner}/${rel.repo} → tmp/${rel.repo}/`);
      await cloneRepo(
        `https://github.com/${rel.owner}/${rel.repo}.git`,
        relPath
      );

      // Setup related repo deps
      if (rel.setup === "python") {
        await setupPythonRepo(relPath);
      } else if (rel.setup === "go") {
        await setupGoRepo(relPath);
      } else {
        await installDeps(relPath);
      }
    }
  }

  return wsPath;
}

/** Install Python deps (venv + pip) */
async function setupPythonRepo(repoPath: string): Promise<void> {
  const venvPath = path.join(repoPath, ".venv");
  if (!fs.existsSync(venvPath)) {
    console.log(`  [python] Creating venv in ${path.basename(repoPath)}/`);
    try {
      await $`python3 -m venv ${venvPath}`.quiet();
    } catch {
      console.log(`  [python] venv creation failed — skipping pip install`);
      return;
    }
  }

  const pip = path.join(venvPath, "bin", "pip");
  const requirements = path.join(repoPath, "requirements.txt");
  if (fs.existsSync(requirements)) {
    console.log(`  [python] Installing requirements…`);
    try {
      await $`${pip} install -r ${requirements}`.cwd(repoPath).quiet();
    } catch (err) {
      console.log(`  [python] pip install failed (non-fatal): ${String(err).slice(0, 100)}`);
    }
  }
}

/** Setup Go backend repo (install deps, check for start script) */
async function setupGoRepo(repoPath: string): Promise<void> {
  console.log(`  [go] Setting up ${path.basename(repoPath)}/`);

  // Check if Go is available
  try {
    await $`go version`.quiet();
  } catch {
    console.log(`  [go] Go not installed — backend will need staging URL instead`);
    console.log(`  [go] Set API_BASE_URL env var to point to staging server`);
    return;
  }

  try {
    console.log(`  [go] Running go get…`);
    await $`go get`.cwd(repoPath).quiet();
  } catch (err) {
    console.log(`  [go] go get failed (non-fatal): ${String(err).slice(0, 100)}`);
  }
}

/** Detect package manager and install deps */
export async function installDeps(wsPath: string): Promise<void> {
  const pkgJson = path.join(wsPath, "package.json");
  if (!fs.existsSync(pkgJson)) {
    console.log(`  [build] No package.json in ${path.basename(wsPath)} — skipping`);
    return;
  }

  console.log(`  [build] Installing deps in ${path.basename(wsPath)}/…`);
  if (fs.existsSync(path.join(wsPath, "bun.lock")) || fs.existsSync(path.join(wsPath, "bun.lockb"))) {
    await $`bun install`.cwd(wsPath).quiet();
  } else if (fs.existsSync(path.join(wsPath, "pnpm-lock.yaml"))) {
    await $`pnpm install --frozen-lockfile`.cwd(wsPath).quiet();
  } else if (fs.existsSync(path.join(wsPath, "yarn.lock"))) {
    await $`yarn install --frozen-lockfile`.cwd(wsPath).quiet();
  } else {
    await $`npm ci`.cwd(wsPath).quiet();
  }
}

/** Start ComfyUI Python backend */
async function startBackend(comfyPath: string, port = 8188): Promise<{
  url: string;
  proc: { name: string; pid: number; kill: () => void };
} | null> {
  const mainPy = path.join(comfyPath, "main.py");
  if (!fs.existsSync(mainPy)) return null;

  const venvPython = path.join(comfyPath, ".venv", "bin", "python3");
  const python = fs.existsSync(venvPython) ? venvPython : "python3";

  console.log(`  [backend] Starting ComfyUI backend on port ${port}…`);
  const proc = Bun.spawn([python, "main.py", "--listen", "0.0.0.0", "--port", String(port), "--cpu"], {
    cwd: comfyPath,
    stdout: "pipe",
    stderr: "pipe",
  });

  const url = `http://localhost:${port}`;

  // Wait for backend
  for (let i = 0; i < 30; i++) {
    await Bun.sleep(2000);
    try {
      const r = await fetch(`${url}/api/system_stats`, { signal: AbortSignal.timeout(1500) });
      if (r.ok) {
        console.log(`  [backend] Ready at ${url}`);
        return { url, proc: { name: "comfyui-backend", pid: proc.pid, kill: () => proc.kill() } };
      }
    } catch {}
    process.stdout.write(".");
  }

  console.log(`\n  [backend] Did not become ready (may need models/deps)`);
  // Don't kill — it might still start later
  return { url, proc: { name: "comfyui-backend", pid: proc.pid, kill: () => proc.kill() } };
}

/** Start frontend dev server */
async function startFrontend(wsPath: string, backendUrl?: string): Promise<{
  url: string;
  proc: { name: string; pid: number; kill: () => void };
}> {
  await installDeps(wsPath);

  const pkgPath = path.join(wsPath, "package.json");
  let devCmd = "dev";
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
    const scripts = pkg.scripts ?? {};
    if (scripts.dev) devCmd = "dev";
    else if (scripts.start) devCmd = "start";
    else if (scripts.serve) devCmd = "serve";
  }

  const port = 5173 + Math.floor(Math.random() * 100);
  const devUrl = `http://localhost:${port}`;

  console.log(`  [frontend] Starting dev server (${devCmd}) on port ${port}…`);

  const proc = Bun.spawn(["npm", "run", devCmd, "--", "--port", String(port)], {
    cwd: wsPath,
    stdout: "pipe",
    stderr: "pipe",
    env: {
      ...process.env,
      PORT: String(port),
      VITE_PORT: String(port),
      ...(backendUrl ? { COMFY_API_URL: backendUrl } : {}),
    },
  });

  let ready = false;
  for (let i = 0; i < 30; i++) {
    await Bun.sleep(2000);
    try {
      const r = await fetch(devUrl, { signal: AbortSignal.timeout(1500) });
      if (r.ok) { ready = true; break; }
    } catch {}
    process.stdout.write(".");
  }

  if (ready) {
    console.log(`\n  [frontend] Ready at ${devUrl}`);
  } else {
    console.log(`\n  [frontend] May not be ready (will try anyway)`);
  }

  return {
    url: devUrl,
    proc: { name: "frontend-dev", pid: proc.pid, kill: () => proc.kill() },
  };
}

/** Full bootstrap: clone → install related → start backend → start frontend */
export async function bootstrapWorkspace(opts: {
  owner: string;
  repo: string;
  outputBase: string;
  branch?: string;
  prNumber?: number;
}): Promise<ComfyUIInstance> {
  const wsPath = await cloneWorkspace(opts);
  const procs: { name: string; pid: number; kill: () => void }[] = [];

  // Try to start backend if ComfyUI was cloned as a related repo
  let backendUrl: string | undefined;
  const backendPath = path.join(wsPath, "tmp", "ComfyUI");
  if (fs.existsSync(path.join(backendPath, "main.py"))) {
    const backend = await startBackend(backendPath);
    if (backend) {
      procs.push(backend.proc);
      backendUrl = backend.url;
    }
  }

  // Start the target repo's frontend
  const frontend = await startFrontend(wsPath, backendUrl);
  procs.push(frontend.proc);

  return {
    url: backendUrl ?? frontend.url,
    pid: frontend.proc.pid,
    repoPath: wsPath,
    procs,
    stop: async () => {
      for (const p of procs) {
        console.log(`  [stop] Killing ${p.name} (pid ${p.pid})`);
        p.kill();
      }
    },
  };
}
