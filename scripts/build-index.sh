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

# Fetch status from each branch's badge.svg or results.json (parallel)
import concurrent.futures

def fetch_status(run):
    url = run.get("url", "").rstrip("/")
    if not url:
        return run

    headers = {"User-Agent": "comfy-qa-indexer/1.0"}

    # Try results.json first
    try:
        req = urllib.request.Request(f"{url}/results.json", headers=headers)
        resp = json.loads(urllib.request.urlopen(req, timeout=8).read())
        if "status" in resp:
            run["status"] = resp["status"]
            run["title"] = resp.get("title", run.get("title", ""))
            return run
    except:
        pass

    # Try badge.svg — parse detailed status from SVG title text
    try:
        import re
        req = urllib.request.Request(f"{url}/badge.svg", headers=headers)
        svg = urllib.request.urlopen(req, timeout=8).read().decode()

        # Extract title: "#10766 QA0413: 1 reproduced, 0 not-repro, 0 inconclusive / 1"
        title_match = re.search(r"<title>([^<]+)</title>", svg)
        if title_match:
            badge_text = title_match.group(1)
            run["badge_title"] = badge_text

            # Parse counts
            repro = int(m.group(1)) if (m := re.search(r"(\d+)\s*reproduced", badge_text)) else 0
            not_repro = int(m.group(1)) if (m := re.search(r"(\d+)\s*not-repro", badge_text)) else 0
            inconclusive = int(m.group(1)) if (m := re.search(r"(\d+)\s*inconclusive", badge_text)) else 0
            total = int(m.group(1)) if (m := re.search(r"/\s*(\d+)", badge_text)) else (repro + not_repro + inconclusive)

            run["reproduced"] = repro
            run["not_repro"] = not_repro
            run["inconclusive"] = inconclusive
            run["total"] = total

            # Determine status
            if repro > 0:
                run["status"] = "reproduced"
            elif not_repro > 0:
                run["status"] = "not-repro"
            elif inconclusive > 0:
                run["status"] = "inconclusive"

            # Extract issue number
            num_match = re.search(r"#(\d+)", badge_text)
            if num_match:
                run["title"] = f"#{num_match.group(1)}"

        # Store badge URL for direct display
        run["badge_url"] = f"{url}/badge.svg"
    except:
        pass

    # Detect actual video filename from the subsite's HTML
    try:
        import re as _re
        req = urllib.request.Request(f"{url}/", headers=headers)
        html = urllib.request.urlopen(req, timeout=8).read().decode(errors="replace")
        vm = _re.search(r'<(?:source|video)[^>]+src=["\']?([^"\'>\s]+\.(?:mp4|webm))', html)
        if vm:
            run["videoSrc"] = vm.group(1)
            run["hasVideo"] = True
        else:
            run["hasVideo"] = False
    except:
        run["hasVideo"] = False

    return run

print(f"Fetching status for {len(runs)} runs...")
with concurrent.futures.ThreadPoolExecutor(max_workers=10) as pool:
    runs = list(pool.map(fetch_status, runs))

status_counts = {}
for r in runs:
    s = r.get("status", "unknown")
    status_counts[s] = status_counts.get(s, 0) + 1
print(f"Status: {status_counts}")

with open(f"{outdir}/runs.json", "w") as f:
    json.dump(runs, f, indent=2)

print(f"Generated {outdir}/runs.json with {len(runs)} entries")
PYTHON
