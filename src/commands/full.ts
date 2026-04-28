import { runQA } from "../agent/orchestrator";
import { fetchRecentIssues, parseRef } from "../utils/github";

export async function commandFull(args: string[]): Promise<void> {
  const repoRef = args.find((a) => !a.startsWith("--"));
  const record = !args.includes("--no-record");
  const limitIdx = args.indexOf("--limit");
  const limit = limitIdx >= 0 ? parseInt(args[limitIdx + 1]) : 5;
  const comfyUrlIdx = args.indexOf("--comfy-url");
  const comfyUrl = comfyUrlIdx >= 0 ? args[comfyUrlIdx + 1] : undefined;

  if (!repoRef) {
    console.error("Usage: comfy-qa full <owner/repo> [--limit N] [--no-record]");
    process.exit(1);
  }

  const { owner, repo } = parseRef(repoRef);
  console.log(`\n[full] Fetching top ${limit} open issues from ${owner}/${repo}…`);

  const issues = await fetchRecentIssues(owner, repo, limit);
  console.log(`  Found ${issues.length} issues\n`);

  for (const issue of issues) {
    console.log(`\n${"─".repeat(60)}`);
    console.log(`  Processing issue #${issue.number}: ${issue.title}`);
    try {
      await runQA({
        ref: `${owner}/${repo}#${issue.number}`,
        type: "issue",
        record,
        outputBase: ".comfy-qa",
        comfyUrl,
      });
    } catch (err) {
      console.error(`  ✗ Failed: ${err}`);
    }
  }

  console.log(`\n[full] Done. Reports in .comfy-qa/`);
}
