import type { Page } from "playwright";

/**
 * Inject the comfy-qa info panel (step/plan/status/annotation).
 * Cursor + keystroke display is handled by qa-hud.
 */
export async function injectHUD(page: Page, title: string): Promise<void> {
  await page.addStyleTag({
    content: `
      #comfy-qa-hud {
        position: fixed;
        top: 12px;
        left: 12px;
        z-index: 2147483640;
        background: rgba(0,0,0,0.82);
        color: #00ff88;
        font-family: 'JetBrains Mono', 'Fira Code', monospace;
        font-size: 13px;
        padding: 10px 14px;
        border-radius: 8px;
        border: 1px solid #00ff88;
        min-width: 340px;
        pointer-events: none;
        line-height: 1.6;
        box-shadow: 0 0 20px rgba(0,255,136,0.3);
      }
      #comfy-qa-hud .hud-title { color: #fff; font-weight: bold; margin-bottom: 4px; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; }
      #comfy-qa-hud .hud-step { color: #ffeb3b; }
      #comfy-qa-hud .hud-plan { color: #80deea; font-size: 11px; margin-top: 4px; }
      #comfy-qa-hud .hud-status { color: #ff9800; }
      #comfy-qa-hud .hud-ts { color: #666; font-size: 10px; }
      #comfy-qa-annotation {
        position: fixed;
        z-index: 2147483639;
        background: rgba(255,235,59,0.9);
        color: #000;
        padding: 6px 10px;
        border-radius: 4px;
        font-family: monospace;
        font-size: 12px;
        font-weight: bold;
        pointer-events: none;
        display: none;
        max-width: 320px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.5);
      }
    `,
  });

  await page.evaluate((t: string) => {
    // Info panel
    const hud = document.createElement("div");
    hud.id = "comfy-qa-hud";
    hud.innerHTML = `
      <div class="hud-title">Comfy-QA Agent</div>
      <div class="hud-step" id="hud-step">Initializing…</div>
      <div class="hud-plan" id="hud-plan"></div>
      <div class="hud-status" id="hud-status"></div>
      <div class="hud-ts" id="hud-ts"></div>
    `;
    document.body.appendChild(hud);

    // Annotation bubble
    const ann = document.createElement("div");
    ann.id = "comfy-qa-annotation";
    document.body.appendChild(ann);

    // Expose update APIs
    (window as any).__comfyQA = {
      setStep: (text: string) => {
        const el = document.getElementById("hud-step");
        if (el) el.textContent = "▶ " + text;
        const ts = document.getElementById("hud-ts");
        if (ts) ts.textContent = new Date().toISOString();
      },
      setPlan: (text: string) => {
        const el = document.getElementById("hud-plan");
        if (el) el.textContent = "📋 " + text;
      },
      setStatus: (text: string) => {
        const el = document.getElementById("hud-status");
        if (el) el.textContent = "⚡ " + text;
      },
      annotate: (x: number, y: number, text: string, durationMs = 2500) => {
        const a = document.getElementById("comfy-qa-annotation");
        if (!a) return;
        a.textContent = text;
        a.style.left = Math.min(x + 20, window.innerWidth - 340) + "px";
        a.style.top = Math.max(y - 40, 10) + "px";
        a.style.display = "block";
        setTimeout(() => { a.style.display = "none"; }, durationMs);
      },
    };

    (window as any).__comfyQA.setStep("Starting QA session: " + t);
  }, title);
}

/** Update HUD step text */
export async function hudStep(page: Page, step: string): Promise<void> {
  try {
    await page.evaluate((s: string) => (window as any).__comfyQA?.setStep(s), step);
  } catch {}
  console.log(`  [hud] ${step}`);
}

/** Update HUD plan text */
export async function hudPlan(page: Page, plan: string): Promise<void> {
  try {
    await page.evaluate((s: string) => (window as any).__comfyQA?.setPlan(s), plan);
  } catch {}
}

/** Update HUD status */
export async function hudStatus(page: Page, status: string): Promise<void> {
  try {
    await page.evaluate((s: string) => (window as any).__comfyQA?.setStatus(s), status);
  } catch {}
}

/** Show annotation bubble near coordinates */
export async function hudAnnotate(
  page: Page,
  x: number,
  y: number,
  text: string,
  durationMs = 3000
): Promise<void> {
  try {
    await page.evaluate(
      ({ x, y, text, durationMs }: { x: number; y: number; text: string; durationMs: number }) =>
        (window as any).__comfyQA?.annotate(x, y, text, durationMs),
      { x, y, text, durationMs }
    );
  } catch {}
}
