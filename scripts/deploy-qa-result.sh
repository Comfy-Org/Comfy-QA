#!/usr/bin/env bash
# Deploy QA results to comfy-qa.pages.dev
#
# Usage (from any repo's CI):
#   COMFY_QA_TOKEN=${{ secrets.COMFY_QA_TOKEN }} \
#   bash <(curl -s https://raw.githubusercontent.com/Comfy-Org/Comfy-QA/main/scripts/deploy-qa-result.sh) \
#     --branch "qa-comfyui-frontend-10766" \
#     --title "Workflow reload overwrites modified tab" \
#     --status "pass" \
#     --repo "ComfyUI_frontend" \
#     --number "10766" \
#     --video "./evidence.mp4" \
#     --spec "./test.spec.ts"
#
# Required env: COMFY_QA_TOKEN (GitHub PAT with contents:write on Comfy-Org/Comfy-QA)
# Or: uses the default GITHUB_TOKEN if running inside Comfy-QA repo's own CI.

set -euo pipefail

COMFY_QA_REPO="Comfy-Org/Comfy-QA"
PAGES_DOMAIN="comfy-qa.pages.dev"

# Parse args
BRANCH="" TITLE="" STATUS="unknown" REPO="" NUMBER="" VIDEO="" SPEC="" BODY=""
while [[ $# -gt 0 ]]; do
  case $1 in
    --branch) BRANCH="$2"; shift 2;;
    --title) TITLE="$2"; shift 2;;
    --status) STATUS="$2"; shift 2;;
    --repo) REPO="$2"; shift 2;;
    --number) NUMBER="$2"; shift 2;;
    --video) VIDEO="$2"; shift 2;;
    --spec) SPEC="$2"; shift 2;;
    --body) BODY="$2"; shift 2;;
    *) echo "Unknown arg: $1"; exit 1;;
  esac
done

# Default branch name from repo + number
if [ -z "$BRANCH" ]; then
  BRANCH="qa-${REPO}-${NUMBER}"
fi

# Determine token
TOKEN="${COMFY_QA_TOKEN:-${GITHUB_TOKEN:-}}"
if [ -z "$TOKEN" ]; then
  echo "Error: COMFY_QA_TOKEN or GITHUB_TOKEN required"
  exit 1
fi

echo "Deploying QA result: $BRANCH ($STATUS)"

# Clone comfy-qa repo (shallow, just to create a branch)
WORKDIR=$(mktemp -d)
git clone --depth 1 "https://x-access-token:${TOKEN}@github.com/${COMFY_QA_REPO}.git" "$WORKDIR"
cd "$WORKDIR"
git checkout --orphan "$BRANCH"
git rm -rf . 2>/dev/null || true

# Generate badge SVG
BADGE_COLOR="grey"
case $STATUS in
  pass) BADGE_COLOR="#22c55e";;
  fail) BADGE_COLOR="#ef4444";;
  running) BADGE_COLOR="#f59e0b";;
  skip) BADGE_COLOR="#6b7280";;
esac

cat > badge.svg <<BADGE
<svg xmlns="http://www.w3.org/2000/svg" width="90" height="20">
  <rect width="90" height="20" rx="3" fill="$BADGE_COLOR"/>
  <text x="45" y="14" text-anchor="middle" fill="white" font-family="system-ui" font-size="11" font-weight="bold">QA ${STATUS^^}</text>
</svg>
BADGE

# Generate results.json
cat > results.json <<JSON
{
  "type": "qa",
  "branch": "$BRANCH",
  "repo": "$REPO",
  "number": "$NUMBER",
  "title": $(echo "$TITLE" | python3 -c "import json,sys; print(json.dumps(sys.stdin.read().strip()))"),
  "status": "$STATUS",
  "date": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "hasVideo": $([ -n "$VIDEO" ] && echo "true" || echo "false"),
  "url": "https://${BRANCH}.${PAGES_DOMAIN}/"
}
JSON

# Generate index.html
cat > index.html <<HTML
<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>QA: $TITLE</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>tailwind.config = { darkMode: 'class' }</script>
</head>
<body class="bg-zinc-950 text-zinc-100 min-h-screen p-8">
  <div class="max-w-3xl mx-auto">
    <a href="https://${PAGES_DOMAIN}/" class="text-zinc-500 text-sm hover:text-white mb-4 block">&larr; Back to registry</a>
    <div class="flex items-center gap-3 mb-4">
      <img src="badge.svg" alt="$STATUS" class="h-5">
      <h1 class="text-2xl font-bold">$TITLE</h1>
    </div>
    <div class="text-sm text-zinc-400 mb-6">
      <span>$REPO #$NUMBER</span> &middot;
      <span>$(date -u +%Y-%m-%d)</span>
    </div>
    $([ -n "$VIDEO" ] && echo '<video controls class="w-full rounded-lg mb-6" src="video.mp4"></video>')
    <div class="bg-zinc-900 rounded-lg p-4 mb-6">
      <h2 class="text-sm font-bold mb-2">Results</h2>
      <pre id="results" class="text-xs text-zinc-400 overflow-auto"></pre>
    </div>
    $([ -n "$SPEC" ] && echo '<div class="bg-zinc-900 rounded-lg p-4"><h2 class="text-sm font-bold mb-2">Test Spec</h2><pre id="spec" class="text-xs text-zinc-400 overflow-auto"></pre></div>')
  </div>
  <script>
    fetch('results.json').then(r=>r.json()).then(d=>document.getElementById('results').textContent=JSON.stringify(d,null,2));
    const specEl = document.getElementById('spec');
    if (specEl) fetch('spec.ts').then(r=>r.text()).then(t=>specEl.textContent=t).catch(()=>{});
  </script>
</body>
</html>
HTML

# Copy video and spec if provided
[ -n "$VIDEO" ] && [ -f "$VIDEO" ] && cp "$VIDEO" video.mp4

# Generate poster thumbnail from video at 3s (for dashboard main page)
if [ -f "video.mp4" ] && command -v ffmpeg >/dev/null 2>&1; then
  ffmpeg -y -ss 3 -i video.mp4 -frames:v 1 -vf "scale=640:-1" -q:v 3 thumbnail.jpg 2>/dev/null || true
  # Fallback to first frame if 3s seek failed (video shorter than 3s)
  if [ ! -s thumbnail.jpg ]; then
    ffmpeg -y -i video.mp4 -frames:v 1 -vf "scale=640:-1" -q:v 3 thumbnail.jpg 2>/dev/null || true
  fi
fi

[ -n "$SPEC" ] && [ -f "$SPEC" ] && cp "$SPEC" spec.ts

# Commit and push (stores results in git for the dashboard API)
git add -A
git commit -m "QA: ${REPO}#${NUMBER} — ${STATUS}"
git push origin "$BRANCH" --force

# Deploy to CF Pages via wrangler (creates the subdomain immediately)
CF_TOKEN="${CLOUDFLARE_API_TOKEN:-${CF_API_TOKEN:-}}"
CF_ACCOUNT="${CLOUDFLARE_ACCOUNT_ID:-}"
if [ -n "$CF_TOKEN" ] && [ -n "$CF_ACCOUNT" ]; then
  CLOUDFLARE_API_TOKEN="$CF_TOKEN" CLOUDFLARE_ACCOUNT_ID="$CF_ACCOUNT" \
    npx wrangler pages deploy . --project-name=comfy-qa --branch="$BRANCH" 2>&1 | tail -3
else
  echo "Skipping wrangler deploy (CLOUDFLARE_API_TOKEN not set)"
  echo "CF Pages will pick up the branch if Git integration is enabled."
fi

echo ""
echo "Deployed: https://${BRANCH}.${PAGES_DOMAIN}/"
echo "Badge:    https://${BRANCH}.${PAGES_DOMAIN}/badge.svg"

# Cleanup
rm -rf "$WORKDIR"
