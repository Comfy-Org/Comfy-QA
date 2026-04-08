import * as fs from "fs";
import * as path from "path";

/** Get the setup prompt text (reusable across setup command and auto-setup) */
export function getSetupPrompt(): string {
  const skillPath = path.join(import.meta.dir, "../../skills/comfy-qa-setup/SKILL.md");
  const skill = fs.readFileSync(skillPath, "utf-8");

  // Strip frontmatter
  const body = skill.replace(/^---[\s\S]*?---\n*/, "");

  return `${body}

---

## Context: Current Repository

You are running inside a frontend repository. Follow the steps above to:

1. Detect the stack from package.json, lock files, and framework config
2. Determine the backend dependency and whether to use staging or local
3. Install Playwright if not present
4. Create \`playwright.qa.config.ts\`
5. Create \`.claude/skills/comfy-qa/SKILL.md\` with repo-specific details
6. Create \`.claude/skills/comfy-qa/REPRODUCE.md\`
7. Create \`tests/e2e/qa.spec.ts\` with starter smoke tests
8. Update \`.gitignore\` to include \`tmp/\`
9. Verify by running the tests

### Updating an existing setup

If QA files already exist, update them instead of overwriting:

- **playwright.qa.config.ts** — check if port or browser config needs updating
- **SKILL.md** — update if the stack, backend, or key routes changed
- **qa.spec.ts** — add new tests for new routes/features, keep passing tests
- **REPRODUCE.md** — update if reproduction workflow changed

Only modify what's out of date. Don't regenerate files that are already correct.

Now read this repo's package.json and begin.`;
}

export async function commandSetup(_args: string[]): Promise<void> {
  console.log(getSetupPrompt());
}
