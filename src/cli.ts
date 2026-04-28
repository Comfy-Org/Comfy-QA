#!/usr/bin/env bun

import { commandPR } from "./commands/pr";
import { commandIssue } from "./commands/issue";
import { commandFull } from "./commands/full";
import { commandSetup } from "./commands/setup";
import { parseGitHubUrl } from "./utils/parse-url";

const args = Bun.argv.slice(2);
const cmd = args[0];
const rest = args.slice(1);

const HELP = `cmqa — E2E QA automation for frontend repos

USAGE
  cmqa setup                              Emit setup prompt for your agent
  cmqa <github-url>                       Auto-detect PR or issue from URL
  cmqa pr    <github-url | owner/repo#N>  Research & QA a pull request
  cmqa issue <github-url | owner/repo#N>  Research & QA an issue / bug report
  cmqa full  <owner/repo>                 Batch QA recent open issues

SETUP (one-shot)
  Tell your agent: "run npx cmqa setup"
  The agent reads the emitted prompt and sets up a complete QA workflow
  for the current repo — Playwright config, E2E tests, skill files, etc.

OPTIONS
  --no-record         Disable video recording (recording is ON by default)
  --add-comment       Post QA report as a comment on the GitHub issue/PR
  --comfy-url <url>   Point to a running dev server (default: auto-detect)
  --limit N           (full only) Number of issues to process [default: 5]
  -h, --help          Show this help
  -v, --version       Show version

EXAMPLES
  cmqa setup
  cmqa https://github.com/org/repo/pull/123
  cmqa https://github.com/org/repo/issues/456
  cmqa pr org/repo#123
  cmqa issue org/repo#456 --no-record
  cmqa full org/repo --limit 3
`;

if (!cmd || cmd === "-h" || cmd === "--help") {
  console.log(HELP);
  process.exit(0);
}

if (cmd === "-v" || cmd === "--version") {
  const pkg = await import("../package.json");
  console.log(pkg.default.version);
  process.exit(0);
}

// Try GitHub URL as first arg (no subcommand needed)
const urlParsed = parseGitHubUrl(cmd);
if (urlParsed) {
  const handler = urlParsed.type === "pr" ? commandPR : commandIssue;
  await handler([urlParsed.ref, ...rest]);
} else {
  switch (cmd) {
    case "setup":
      await commandSetup(rest);
      break;
    case "pr":
      await commandPR(rest);
      break;
    case "issue":
      await commandIssue(rest);
      break;
    case "full":
      await commandFull(rest);
      break;
    default:
      console.error(`Unknown command: ${cmd}\nRun 'cmqa --help' for usage.`);
      process.exit(1);
  }
}
