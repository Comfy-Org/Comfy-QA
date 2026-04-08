/** Parse a GitHub PR/issue URL into { type, ref } */
export function parseGitHubUrl(url: string): { type: "pr" | "issue"; ref: string } | null {
  const m = url.match(
    /github\.com\/([^/]+)\/([^/]+)\/(pull|issues)\/(\d+)/
  );
  if (!m) return null;
  return {
    type: m[3] === "pull" ? "pr" : "issue",
    ref: `${m[1]}/${m[2]}#${m[4]}`,
  };
}
