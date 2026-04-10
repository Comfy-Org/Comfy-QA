import { defineConfig } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env.local manually so GEMINI_API_KEY is available for the TTS provider
const envPath = path.resolve(__dirname, ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

export default defineConfig({
  timeout: 5 * 60_000,
  use: {
    video: { mode: "on", size: { width: 1280, height: 720 } },
    viewport: { width: 1280, height: 720 },
    screenshot: "on",
    headless: true, // qa-hud captures audio via Web Audio API tap, works headless
    // Chrome-specific args; Firefox ignores them but they shouldn't cause harm
    launchOptions: {
      args: [],
    },
  },
  projects: [
    { name: "firefox", use: { browserName: "firefox" }, testIgnore: "cloud-comfy.spec.ts" },
    {
      name: "chromium-webgl",
      use: {
        browserName: "chromium",
        launchOptions: { args: ["--headless=new"] },
      },
      testMatch: "cloud-comfy.spec.ts",
    },
  ],
  outputDir: path.resolve(__dirname, ".comfy-qa", ".tmp", "demos"),
  testDir: path.resolve(__dirname, "demo"),
  testMatch: "*.spec.ts",
  reporter: [["list"], ["./demo/fixtures/mux-reporter.ts"]],
});
