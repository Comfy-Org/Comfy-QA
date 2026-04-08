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
  const json = await $`gh pr view ${number} --repo ${owner}/${repo} --json number,title,body,state,headRefName,baseRefName,author,labels,url,files,comments`.text();
  const raw = JSON.parse(json);
  return {
    number: raw.number,
    title: raw.title,
    body: raw.body || "",
    state: raw.state,
    headRefName: raw.headRefName,
    baseRefName: raw.baseRefName,
    author: raw.author?.login || "unknown",
    labels: (raw.labels || []).map((l: any) => l.name),
    url: raw.url,
    files: (raw.files || []).map((f: any) => ({
      path: f.path,
      additions: f.additions,
      deletions: f.deletions,
    })),
    comments: (raw.comments || []).map((c: any) => ({
      author: c.author?.login || "unknown",
      body: c.body || "",
      createdAt: c.createdAt,
    })),
  };
}

export async function fetchIssue(owner: string, repo: string, number: number): Promise<IssueInfo> {
  const json = await $`gh issue view ${number} --repo ${owner}/${repo} --json number,title,body,state,author,labels,url,comments`.text();
  const raw = JSON.parse(json);
  return {
    number: raw.number,
    title: raw.title,
    body: raw.body || "",
    state: raw.state,
    author: raw.author?.login || "unknown",
    labels: (raw.labels || []).map((l: any) => l.name),
    url: raw.url,
    comments: (raw.comments || []).map((c: any) => ({
      author: c.author?.login || "unknown",
      body: c.body || "",
      createdAt: c.createdAt,
    })),
  };
}

export async function fetchRecentIssues(owner: string, repo: string, limit = 20): Promise<IssueInfo[]> {
  const json = await $`gh issue list --repo ${owner}/${repo} --limit ${limit} --state open --json number,title,body,state,author,labels,url`.text();
  return JSON.parse(json);
}
