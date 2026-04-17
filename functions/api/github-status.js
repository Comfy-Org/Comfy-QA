// Cloudflare Pages Function: /api/github-status
// Fetches GitHub issue or PR open/closed state, caches for 15 minutes.
// Query params: ?owner=Comfy-Org&repo=ComfyUI_frontend&number=8532&type=issue
//
// Env: GITHUB_TOKEN_QA — fine-grained PAT with Issues+PRs read-only

const CACHE_TTL = 15 * 60; // 15 minutes

export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const owner = url.searchParams.get("owner");
  const repo = url.searchParams.get("repo");
  const number = url.searchParams.get("number");
  const type = url.searchParams.get("type") || "issue"; // "issue" | "pr"

  if (!owner || !repo || !number) {
    return new Response(JSON.stringify({ error: "missing params" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const cacheKey = new Request(
    `https://github-status-cache/${owner}/${repo}/${type}/${number}`,
    { method: "GET" }
  );
  const cache = caches.default;

  // Return cached response if fresh
  const cached = await cache.match(cacheKey);
  if (cached) return corsJson(cached);

  const endpoint =
    type === "pr"
      ? `https://api.github.com/repos/${owner}/${repo}/pulls/${number}`
      : `https://api.github.com/repos/${owner}/${repo}/issues/${number}`;

  const ghResp = await fetch(endpoint, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "comfy-qa-pages/1.0",
      ...(env.GITHUB_TOKEN_QA
        ? { Authorization: `Bearer ${env.GITHUB_TOKEN_QA}` }
        : {}),
    },
  });

  if (!ghResp.ok) {
    return new Response(
      JSON.stringify({ error: `GitHub API ${ghResp.status}` }),
      { status: ghResp.status, headers: corsHeaders() }
    );
  }

  const data = await ghResp.json();
  const result = {
    state: data.state, // "open" | "closed"
    title: data.title,
    number: data.number,
    type: data.pull_request ? "pr" : "issue",
    merged: data.pull_request?.merged_at ? true : false,
    url: data.html_url,
  };

  const response = new Response(JSON.stringify(result), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": `public, max-age=${CACHE_TTL}`,
      ...corsHeaders(),
    },
  });

  // Store in edge cache
  await cache.put(cacheKey, response.clone());
  return response;
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "https://comfy-qa.pages.dev",
    "Access-Control-Allow-Methods": "GET",
  };
}

function corsJson(resp) {
  // Re-wrap cached response with CORS headers
  return new Response(resp.body, {
    status: resp.status,
    headers: { ...Object.fromEntries(resp.headers), ...corsHeaders() },
  });
}
