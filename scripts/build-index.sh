#!/usr/bin/env bash
# Build runs.json from CF Pages deployments API.
# Runs in CI before deploying the dashboard.
set -euo pipefail

CF_TOKEN="${CLOUDFLARE_API_TOKEN:-}"
CF_ACCOUNT="${CLOUDFLARE_ACCOUNT_ID:-5ae914d9b87bcf6bbe1ada5798f92a5f}"
PROJECT="comfy-qa"
OUTDIR="${1:-pages}"

echo "Building runs.json..."

if [ -z "$CF_TOKEN" ]; then
  echo "No CLOUDFLARE_API_TOKEN — writing empty runs.json"
  echo "[]" > "${OUTDIR}/runs.json"
  exit 0
fi

python3 - "$CF_TOKEN" "$CF_ACCOUNT" "$PROJECT" "$OUTDIR" <<'PYTHON'
import json, sys, urllib.request

token, account, project, outdir = sys.argv[1:5]
base = f"https://api.cloudflare.com/client/v4/accounts/{account}/pages/projects/{project}/deployments"

# Paginate
all_deps = []
for page in range(1, 11):
    req = urllib.request.Request(f"{base}?per_page=25&page={page}")
    req.add_header("Authorization", f"Bearer {token}")
    resp = json.loads(urllib.request.urlopen(req).read())
    results = resp.get("result") or []
    all_deps.extend(results)
    if len(results) < 25:
        break

# Deduplicate by branch (keep latest deployment per branch)
seen = set()
runs = []
for dep in all_deps:
    branch = (dep.get("deployment_trigger") or {}).get("metadata", {}).get("branch", "")
    if not branch or branch == "main" or branch in seen:
        continue
    seen.add(branch)

    aliases = dep.get("aliases") or []
    url = aliases[0] if aliases else (dep.get("url") or "")
    if url and not url.startswith("http"):
        url = "https://" + url

    run = {
        "branch": branch,
        "url": url,
        "date": dep.get("created_on", ""),
        "hasVideo": True,
    }

    # Detect type
    if "demo-" in branch:
        run["type"] = "demo"
        product = branch.replace("demo-comfy-qa-", "").replace("demo-", "").replace("sno-demo-", "")
        run["product"] = product
        run["title"] = product.replace("-", " ").title()
        run["status"] = "pass"
    elif "qa-" in branch:
        run["type"] = "qa"
        num = branch.split("-")[-1]
        repo = branch.replace(f"-{num}", "").replace("sno-qa-", "").replace("qa-", "")
        run["number"] = num
        run["repo"] = repo if repo else "unknown"
        run["title"] = f"#{num}" if not repo else f"{repo} #{num}"
        run["status"] = "unknown"
    else:
        continue

    runs.append(run)

runs.sort(key=lambda r: r.get("date", ""), reverse=True)

with open(f"{outdir}/runs.json", "w") as f:
    json.dump(runs, f, indent=2)

print(f"Generated {outdir}/runs.json with {len(runs)} entries")
PYTHON
