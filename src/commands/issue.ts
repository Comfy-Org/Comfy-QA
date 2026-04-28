import { runQA } from "../agent/orchestrator";
import { parseGitHubUrl } from "../utils/parse-url";

export async function commandIssue(args: string[]): Promise<void> {
  let ref = args.find((a) => !a.startsWith("--"));
  const record = !args.includes("--no-record");
  const comfyUrlIdx = args.indexOf("--comfy-url");
  const comfyUrl = comfyUrlIdx >= 0 ? args[comfyUrlIdx + 1] : undefined;

  // Accept GitHub URL: comfy-qa issue https://github.com/org/repo/issues/456
  if (ref) {
    const parsed = parseGitHubUrl(ref);
    if (parsed) ref = parsed.ref;
  }

  if (!ref) {
    console.error("Usage: comfy-qa issue <github-url | owner/repo#number>");
    console.error("       comfy-qa issue https://github.com/org/repo/issues/456");
    process.exit(1);
  }

  await runQA({ ref, type: "issue", record, outputBase: ".comfy-qa", comfyUrl });
}
