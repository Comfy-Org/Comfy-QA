
Default to using Bun instead of Node.js.

- Use `bun <file>` instead of `node <file>` or `ts-node <file>`
- Use `bun test` instead of `jest` or `vitest`
- Use `bun build <file.html|file.ts|file.css>` instead of `webpack` or `esbuild`
- Use `bun install` instead of `npm install` or `yarn install` or `pnpm install`
- Use `bun run <script>` instead of `npm run <script>` or `yarn run <script>` or `pnpm run <script>`
- Use `bunx <package> <command>` instead of `npx <package> <command>`
- Bun automatically loads .env, so don't use dotenv.

## APIs

- `Bun.serve()` supports WebSockets, HTTPS, and routes. Don't use `express`.
- `bun:sqlite` for SQLite. Don't use `better-sqlite3`.
- `Bun.redis` for Redis. Don't use `ioredis`.
- `Bun.sql` for Postgres. Don't use `pg` or `postgres.js`.
- `WebSocket` is built-in. Don't use `ws`.
- Prefer `Bun.file` over `node:fs`'s readFile/writeFile
- Bun.$`ls` instead of execa.

## Testing

Use `bun test` to run tests.

```ts#index.test.ts
import { test, expect } from "bun:test";

test("hello world", () => {
  expect(1).toBe(1);
});
```

## Frontend

Use HTML imports with `Bun.serve()`. Don't use `vite`. HTML imports fully support React, CSS, Tailwind.

Server:

```ts#index.ts
import index from "./index.html"

Bun.serve({
  routes: {
    "/": index,
    "/api/users/:id": {
      GET: (req) => {
        return new Response(JSON.stringify({ id: req.params.id }));
      },
    },
  },
  // optional websocket support
  websocket: {
    open: (ws) => {
      ws.send("Hello, world!");
    },
    message: (ws, message) => {
      ws.send(message);
    },
    close: (ws) => {
      // handle close
    }
  },
  development: {
    hmr: true,
    console: true,
  }
})
```

HTML files can import .tsx, .jsx or .js files directly and Bun's bundler will transpile & bundle automatically. `<link>` tags can point to stylesheets and Bun's CSS bundler will bundle.

```html#index.html
<html>
  <body>
    <h1>Hello, world!</h1>
    <script type="module" src="./frontend.tsx"></script>
  </body>
</html>
```

With the following `frontend.tsx`:

```tsx#frontend.tsx
import React from "react";
import { createRoot } from "react-dom/client";

// import .css files directly and it works
import './index.css';

const root = createRoot(document.body);

export default function Frontend() {
  return <h1>Hello, world!</h1>;
}

root.render(<Frontend />);
```

Then, run index.ts

```sh
bun --hot ./index.ts
```

For more information, read the Bun API docs in `node_modules/bun-types/docs/**.mdx`.

## Demo Videos

Automated browser demo videos live in `demo/*.spec.ts`. Each spec uses the fixture at `demo/fixtures/fixture.ts` which applies demowright HUD (cursor, keyboard overlay, TTS narration) and records video.

### Running demos

```sh
bunx playwright test                              # run all QA evidence specs
bunx playwright test .comfy-qa/03-spec/comfy-docs-qa.spec.ts  # run one spec
bun demo/evaluate-demos.ts                        # evaluate output videos with Gemini
```

Specs live in `.comfy-qa/03-spec/`. Output goes to `.comfy-qa/04-videos/` (git-ignored). The mux-reporter at `demo/fixtures/mux-reporter.ts` automatically combines video + narration audio into mp4 after each test (no SRT filter — macOS path quoting breaks it).

### Submodule: demowright

`lib/demowright` is a git submodule. After pulling, run `bun run prepare` to sync it.
If you get "Requiring @playwright/test second time", delete `lib/demowright/node_modules/playwright` and `lib/demowright/node_modules/@playwright` — the root node_modules copy must be the only one.

### QA Evidence Videos

**Current baseline: 5 QA evidence specs, all chromium headless. Evaluator median: 9.2/10.**

| Spec | URL | Score | Notes |
|------|-----|-------|-------|
| comfy-docs-qa | docs.comfy.org | 10/10 | landing + install + tutorials + custom nodes |
| comfy-registry-qa | registry.comfy.org | 9/10 | 11/14 features; publisher profile missing |
| comfy-website-qa | www.comfy.org | 9/10 | hero + download CTA + features + nav + community |
| download-data-qa | comfyui-download-statistics.vercel.app | 9/10 | chart + all 3 time ranges |
| embedded-workflow-editor-qa | comfyui-embedded-workflow-editor.vercel.app | 9/10 | drop zone + JSON view + download |

Scores are median of 3 Gemini evaluator runs. The evaluator has ±4 point variance per run — always use median of 3. After recording, manually mux if demowright's built-in mux fails:
```sh
ffmpeg -y -ss $TRIM -i video.webm -i audio.wav -c:v libx264 -preset fast -pix_fmt yuv420p -c:a aac -b:a 128k -ar 44100 -shortest out.mp4
```
where `TRIM = video_duration - audio_duration - 0.5`.

**Known issues:**
- `comfy-registry-qa`: Publisher profile pages (navigate_to_publisher, view_publisher_nodes) return 404 — feature not yet implemented upstream.
- Demowright's built-in SRT subtitles filter fails on macOS — mux-reporter works around this.
- The Anthropic SDK uses `ANTHROPIC_API_KEY_QA` (with `_QA` suffix) to avoid conflicting with other tools, falling back to `ANTHROPIC_API_KEY`.

### Environment variables (.env.local)

- `GEMINI_API_KEY` — required for TTS narration in demos
- `ANTHROPIC_API_KEY_QA` — for the research agent (Claude SDK)
- `CLOUD_USERNAME` / `CLOUD_PASSWORD` — for cloud-comfy demo (optional)
