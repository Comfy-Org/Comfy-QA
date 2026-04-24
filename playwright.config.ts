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

const chromiumWebGlArgs = [
  "--use-gl=angle",
  "--use-angle=swiftshader",
  "--enable-webgl",
  "--ignore-gpu-blocklist",
];

export default defineConfig({
  preserveOutput: "always",
  timeout: 5 * 60_000,
  use: {
    video: { mode: "on", size: { width: 1280, height: 720 } },
    viewport: { width: 1280, height: 720 },
    screenshot: "on",
    headless: true,
  },
  projects: [
    {
      name: "firefox",
      use: { browserName: "firefox" },
      testIgnore: "cloud-comfy.spec.ts",
    },
    {
      // Most specs run on Chromium with WebGL for canvas-heavy pages.
      // SwiftShader enables headless WebGL (required for cloud.comfy.org).
      name: "chromium-webgl",
      use: {
        browserName: "chromium",
        launchOptions: { args: chromiumWebGlArgs },
      },
      testMatch: "cloud-comfy.spec.ts",
    },
  ],
  outputDir: path.resolve(__dirname, ".comfy-qa", ".tmp", "demos"),
  testDir: path.resolve(__dirname, ".comfy-qa", "03-spec"),
  testMatch: "*.spec.ts",
  reporter: [["list"], ["./demo/fixtures/mux-reporter.ts"]],
});
