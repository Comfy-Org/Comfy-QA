import { $ } from "bun";

export interface PRInfo {
  number: number;
  title: string;
  body: string;
  state: string;
  headRefName: string;
  baseRefName: string;
  author: string;
  labels: string[];
  url: string;
  files: { path: string; additions: number; deletions: number }[];
  comments: { author: string; body: string; createdAt: string }[];
}

export interface IssueInfo {
  number: number;
  title: string;
  body: string;
  state: string;
  author: string;
  labels: string[];
  url: string;
  comments: { author: string; body: string; createdAt: string }[];
}

/** Parse "owner/repo#number" or "owner/repo" + number */
export function parseRef(ref: string): { owner: string; repo: string; number?: number } {
  const match = ref.match(/^([^/]+)\/([^#]+)(?:#(\d+))?$/);
  if (!match) throw new Error(`Invalid ref: ${ref}. Expected owner/repo#number`);
  return {
    owner: match[1],
    repo: match[2],
    number: match[3] ? parseInt(match[3]) : undefined,
  };
}

export async function fetchPR(owner: string, repo: string, number: number): Promise<PRInfo> {
  const [prJson, filesJson, commentsJson] = await Promise.all([
    $`gh api repos/${owner}/${repo}/pulls/${number}`.text(),
    $`gh api repos/${owner}/${repo}/pulls/${number}/files --paginate`.text(),
    $`gh api repos/${owner}/${repo}/issues/${number}/comments --paginate`.text(),
  ]);
  const pr = JSON.parse(prJson);
  const files = JSON.parse(filesJson);
  const comments = JSON.parse(commentsJson);
  return {
    number: pr.number,
    title: pr.title,
    body: pr.body || "",
    state: pr.state,
    headRefName: pr.head.ref,
    baseRefName: pr.base.ref,
    author: pr.user?.login || "unknown",
    labels: (pr.labels || []).map((l: any) => l.name),
    url: pr.html_url,
    files: files.map((f: any) => ({
      path: f.filename,
      additions: f.additions,
      deletions: f.deletions,
    })),
    comments: comments.map((c: any) => ({
      author: c.user?.login || "unknown",
      body: c.body || "",
      createdAt: c.created_at,
    })),
  };
}

export async function fetchIssue(owner: string, repo: string, number: number): Promise<IssueInfo> {
  const [issueJson, commentsJson] = await Promise.all([
    $`gh api repos/${owner}/${repo}/issues/${number}`.text(),
    $`gh api repos/${owner}/${repo}/issues/${number}/comments --paginate`.text(),
  ]);
  const issue = JSON.parse(issueJson);
  const comments = JSON.parse(commentsJson);
  return {
    number: issue.number,
    title: issue.title,
    body: issue.body || "",
    state: issue.state,
    author: issue.user?.login || "unknown",
    labels: (issue.labels || []).map((l: any) => l.name),
    url: issue.html_url,
    comments: comments.map((c: any) => ({
      author: c.user?.login || "unknown",
      body: c.body || "",
      createdAt: c.created_at,
    })),
  };
}

export async function fetchRecentIssues(owner: string, repo: string, limit = 20): Promise<IssueInfo[]> {
  const json = await $`gh issue list --repo ${owner}/${repo} --limit ${limit} --state open --json number,title,body,state,author,labels,url`.text();
  return JSON.parse(json);
}

/** Extract the first Vercel/Netlify/preview deployment URL from PR bot comments */
export async function fetchDeploymentPreviewUrl(owner: string, repo: string, prNumber: number): Promise<string | null> {
  const commentsJson = await $`gh api repos/${owner}/${repo}/issues/${prNumber}/comments --paginate`.text();
  const comments: { user: { login: string }; body: string }[] = JSON.parse(commentsJson);

  for (const c of comments) {
    const login = c.user?.login ?? "";
    // Only trust bot comments
    if (!login.includes("bot") && login !== "github-actions") continue;

    // Extract first https URL from known deploy platforms
    const match = c.body.match(/https:\/\/[^\s\)\"\'<]+(?:vercel\.app|netlify\.app|pages\.dev|fly\.dev|railway\.app)[^\s\)\"\'<]*/);
    if (match) {
      // Skip feedback/avatar/non-app URLs
      const url = match[0].replace(/[.,;]+$/, "");
      if (url.includes("feedback") || url.includes("avatar") || url.includes("badge") || url.includes("svg")) continue;
      return url;
    }
  }
  return null;
}
