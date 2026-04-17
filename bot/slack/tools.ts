/**
 * Read-only tools for querying QA task list.
 * These are passed to the OpenAI chat completion as function tools.
 */

const PAGES_DOMAIN = "comfy-qa.pages.dev";
const RUNS_JSON_URL = `https://${PAGES_DOMAIN}/runs.json`;

export interface QARun {
  branch: string;
  url: string;
  title: string;
  status: string;
  type: string;
  date: string;
  repo?: string;
  number?: string;
  product?: string;
  badge_url?: string;
  badge_title?: string;
  reproduced?: number;
  not_repro?: number;
  inconclusive?: number;
  hasVideo?: boolean;
}

let cachedRuns: QARun[] | null = null;
let cacheTime = 0;
const CACHE_TTL = 60_000; // 1 minute

async function fetchRuns(): Promise<QARun[]> {
  if (cachedRuns && Date.now() - cacheTime < CACHE_TTL) return cachedRuns;
  const resp = await fetch(RUNS_JSON_URL);
  if (!resp.ok) throw new Error(`Failed to fetch runs: ${resp.status}`);
  cachedRuns = (await resp.json()) as QARun[];
  cacheTime = Date.now();
  return cachedRuns;
}

// Tool definitions for OpenAI function calling
export const toolDefinitions = [
  {
    type: "function" as const,
    function: {
      name: "list_qa_runs",
      description:
        "List QA runs from the comfy-qa registry. Can filter by status (reproduced, not-repro, inconclusive), type (qa, demo), or search by issue number/repo name. Returns URLs to the QA result pages.",
      parameters: {
        type: "object",
        properties: {
          status: {
            type: "string",
            enum: ["all", "reproduced", "not-repro", "inconclusive", "pass"],
            description: "Filter by QA status",
          },
          type: {
            type: "string",
            enum: ["all", "qa", "demo"],
            description: "Filter by run type",
          },
          search: {
            type: "string",
            description:
              "Search by issue number, repo name, or product name",
          },
          limit: {
            type: "number",
            description: "Max results to return (default 10)",
          },
        },
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "get_qa_stats",
      description:
        "Get aggregate statistics about QA runs: total count, reproduced/not-repro/inconclusive breakdown, list of repos.",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "get_qa_run_detail",
      description:
        "Get details about a specific QA run by issue number or branch name. Returns URL, status, badge info, and video availability.",
      parameters: {
        type: "object",
        properties: {
          number: {
            type: "string",
            description: "Issue/PR number (e.g. '10766')",
          },
          branch: {
            type: "string",
            description: "Branch name (e.g. 'sno-qa-10766')",
          },
        },
      },
      required: [],
    },
  },
  {
    type: "function" as const,
    function: {
      name: "get_dashboard_url",
      description:
        "Get the URL to the Comfy QA dashboard with optional filter applied.",
      parameters: {
        type: "object",
        properties: {
          filter: {
            type: "string",
            enum: [
              "all",
              "qa",
              "demo",
              "reproduced",
              "not-repro",
              "inconclusive",
            ],
            description: "Filter to apply on the dashboard",
          },
          search: {
            type: "string",
            description: "Search query to pre-fill",
          },
        },
      },
    },
  },
];

// Tool execution
export async function executeTool(
  name: string,
  args: Record<string, unknown>,
): Promise<string> {
  const runs = await fetchRuns();

  switch (name) {
    case "list_qa_runs": {
      let filtered = runs;
      const status = args.status as string | undefined;
      const type = args.type as string | undefined;
      const search = args.search as string | undefined;
      const limit = (args.limit as number) || 10;

      if (status && status !== "all") {
        filtered = filtered.filter((r) =>
          status === "reproduced"
            ? r.status === "reproduced" || r.status === "pass"
            : r.status === status,
        );
      }
      if (type && type !== "all") {
        filtered = filtered.filter((r) => r.type === type);
      }
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          (r) =>
            r.title?.toLowerCase().includes(q) ||
            r.branch?.toLowerCase().includes(q) ||
            r.number?.includes(q) ||
            r.repo?.toLowerCase().includes(q) ||
            r.product?.toLowerCase().includes(q),
        );
      }

      const results = filtered.slice(0, limit).map((r) => ({
        title: r.title,
        status: r.status,
        url: r.url,
        number: r.number,
        repo: r.repo,
        date: r.date?.split("T")[0],
        hasVideo: r.hasVideo,
      }));

      return JSON.stringify({
        total: filtered.length,
        showing: results.length,
        runs: results,
      });
    }

    case "get_qa_stats": {
      const stats = {
        total: runs.length,
        qa: runs.filter((r) => r.type === "qa").length,
        demo: runs.filter((r) => r.type === "demo").length,
        reproduced: runs.filter(
          (r) => r.status === "reproduced" || r.status === "pass",
        ).length,
        not_repro: runs.filter((r) => r.status === "not-repro").length,
        inconclusive: runs.filter((r) => r.status === "inconclusive").length,
        repos: [...new Set(runs.map((r) => r.repo).filter(Boolean))],
        dashboard: `https://${PAGES_DOMAIN}/`,
      };
      return JSON.stringify(stats);
    }

    case "get_qa_run_detail": {
      const number = args.number as string | undefined;
      const branch = args.branch as string | undefined;

      const run = runs.find(
        (r) =>
          (number && r.number === number) ||
          (branch && r.branch === branch),
      );

      if (!run) return JSON.stringify({ error: "Run not found" });

      return JSON.stringify({
        title: run.title,
        status: run.status,
        url: run.url,
        branch: run.branch,
        number: run.number,
        repo: run.repo,
        date: run.date,
        badge_title: run.badge_title,
        reproduced: run.reproduced,
        not_repro: run.not_repro,
        inconclusive: run.inconclusive,
        hasVideo: run.hasVideo,
        badge_url: run.badge_url,
      });
    }

    case "get_dashboard_url": {
      const filter = args.filter as string | undefined;
      const search = args.search as string | undefined;
      const params = new URLSearchParams();
      if (filter && filter !== "all") params.set("filter", filter);
      if (search) params.set("q", search);
      const url = `https://${PAGES_DOMAIN}/${params.toString() ? "?" + params : ""}`;
      return JSON.stringify({ url, description: "Comfy QA Dashboard" });
    }

    default:
      return JSON.stringify({ error: `Unknown tool: ${name}` });
  }
}
