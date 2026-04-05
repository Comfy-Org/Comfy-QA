#!/usr/bin/env bun

import { parseArgs } from "util";

const { values, positionals } = parseArgs({
  args: Bun.argv.slice(2),
  options: {
    help: { type: "boolean", short: "h" },
    version: { type: "boolean", short: "v" },
  },
  allowPositionals: true,
});

if (values.version) {
  const pkg = await import("../package.json");
  console.log(pkg.default.version);
  process.exit(0);
}

if (values.help || positionals.length === 0) {
  console.log(`comfy-qa - ComfyUI QA automation CLI

Usage:
  comfy-qa <command> [options]

Commands:
  (none yet)

Options:
  -h, --help     Show this help message
  -v, --version  Show version
`);
  process.exit(0);
}

console.error(`Unknown command: ${positionals[0]}`);
process.exit(1);
