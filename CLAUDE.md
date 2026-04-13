
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
bunx playwright test                    # run all demos
bunx playwright test demo/comfy-docs.spec.ts  # run one demo
bun demo/evaluate-demos.ts              # evaluate output videos with Gemini
```

Output goes to `.comfy-qa/04-videos/` (git-ignored). The mux-reporter at `demo/fixtures/mux-reporter.ts` automatically combines video + narration audio + subtitles into mp4 after each test.

### Submodule: demowright

`lib/demowright` is a git submodule. After pulling, run `bun run prepare` to sync it.
If you get "Requiring @playwright/test second time", delete `lib/demowright/node_modules/playwright` and `lib/demowright/node_modules/@playwright` — the root node_modules copy must be the only one.

### Known issues & next steps

**Current baseline: 10 specs (9 headless, 1 skip). Coverage ranges from 50% to 100% per demo.**

| Demo | URL | Coverage | Notes |
|------|-----|----------|-------|
| cloud-comfy | cloud.comfy.org | 100% (21/21) | skip: WebGL headless |
| comfyui-frontend | cloud.comfy.org | 100% (17/17) | UI-only tour |
| registry-web | registry.comfy.org | 41% (33/81) | homepage only |
| registry-node-detail | registry.comfy.org/nodes/* | 100% (13/13) | detail page |
| comfy-docs | docs.comfy.org | 48% (40/84) | landing page only |
| comfy-docs-tutorial | docs.comfy.org/tutorials/* | 100% (14/14) | sub-page deep dive |
| download-data | comfyui-download-statistics.vercel.app | 100% (8/8) | all 4 time ranges |
| embedded-workflow-editor | comfyui-embedded-workflow-editor.vercel.app | 89% (8/9) | no actual file editing |
| comfy-website | www.comfy.org | 79% (15/19) | JS blocked (SSR) |
| comfy-vibe | comfy-vibe.vercel.app | 100% (22/22) | full workspace app |

**Skipped:**
- `cloud-comfy`: Auto-skipped in headless mode — WebGL canvas renders blank white. Requires `headed: true` in playwright config + `CLOUD_USERNAME`/`CLOUD_PASSWORD` in `.env.local`. Needs a CI setup with Xvfb or a headed runner.

**Removed (auth-walled, no public access):**
- `comfy-codesearch` / `sign-in-sourcegraph`: Sourcegraph login required, no public API.
- `custom-node-licenses`: Google sign-in required.

**Next improvements:**
- Cache TTS wav files across runs to avoid re-generating identical narrations.
- Demowright's built-in ffmpeg subtitles filter fails on macOS (path quoting) — the mux-reporter works around this but demowright itself should be fixed upstream.
- The Anthropic SDK uses `ANTHROPIC_API_KEY_QA` (with `_QA` suffix) to avoid conflicting with other tools, falling back to `ANTHROPIC_API_KEY`.

### Environment variables (.env.local)

- `GEMINI_API_KEY` — required for TTS narration in demos
- `ANTHROPIC_API_KEY_QA` — for the research agent (Claude SDK)
- `CLOUD_USERNAME` / `CLOUD_PASSWORD` — for cloud-comfy demo (optional)
