#!/usr/bin/env bash
# Report failing QA operations as GitHub issues (with dedup).
#
# Reads .comfy-qa/.research/<product>/research-results.json and for each
# failing operation:
#   1. Checks if an issue already exists (by title match)
#   2. If not, creates a new issue with details + link to QA video
#
# Usage:
#   GH_TOKEN=... ./scripts/report-failures.sh <product-slug> [github-repo]
#   GH_TOKEN=... ./scripts/report-failures.sh comfy-registry Comfy-Org/registry-web
#
# Required:
#   - GH_TOKEN or gh CLI authenticated
#   - research-results.json for the product
#   - GITHUB_REPO env or argv[2] (target repo for issues)

set -euo pipefail

PRODUCT="${1:-}"
REPO="${2:-${GITHUB_REPO:-}}"

if [ -z "$PRODUCT" ]; then
  echo "Usage: $0 <product-slug> [github-repo]" >&2
  exit 1
fi

if [ -z "$REPO" ]; then
  echo "Error: GITHUB_REPO or argv[2] required (e.g. Comfy-Org/registry-web)" >&2
  exit 1
fi

RESULTS=".comfy-qa/.research/${PRODUCT}/research-results.json"
if [ ! -f "$RESULTS" ]; then
  echo "Error: $RESULTS not found. Run qa-research.ts first." >&2
  exit 1
fi

CREATED=0
SKIPPED=0
QA_VIDEO_URL="https://qa-${PRODUCT}.comfy-qa.pages.dev/"

# Extract all failing operations
FAILED_OPS=$(python3 -c "
import json
d = json.load(open('$RESULTS'))
for f in d['features']:
    for op in f['operations']:
        if not op['success']:
            print(f\"{f['name']}|{op['id']}|{op['narration']}|{op.get('error','')[:100]}\")
")

if [ -z "$FAILED_OPS" ]; then
  echo "No failing operations — nothing to report."
  exit 0
fi

echo "$FAILED_OPS" | while IFS='|' read -r feature op_id narration error; do
  TITLE="[QA Bug] ${op_id} failing in ${feature}"

  # Check if issue already exists (open or closed, by title match)
  EXISTING=$(gh issue list --repo "$REPO" --state all --search "\"$TITLE\" in:title" --json number --limit 1 2>/dev/null | python3 -c "import json,sys; d=json.load(sys.stdin); print(d[0]['number'] if d else '')" 2>/dev/null || echo "")

  if [ -n "$EXISTING" ]; then
    echo "skip: #${EXISTING} already exists for ${op_id}"
    SKIPPED=$((SKIPPED + 1))
    continue
  fi

  BODY=$(cat <<BODY_END
**Feature**: ${feature}
**Operation**: \`${op_id}\`

**Expected behavior (per QA narration)**:
> ${narration}

**Observed**: The operation failed during automated QA testing. The agent was unable to complete this step after 3 retries.

**Evidence**:
- QA video (reproduction): ${QA_VIDEO_URL}
- Error: \`${error}\`

**Product**: ${PRODUCT}

---
_Auto-filed by [Comfy-QA](https://github.com/Comfy-Org/Comfy-QA). The QA test that demonstrates this failure is in the linked video. When fixed, the test will change from demonstrating a failure to demonstrating success._

<sub>labels: qa-bug, automated</sub>
BODY_END
)

  echo "create: ${TITLE}"
  gh issue create \
    --repo "$REPO" \
    --title "$TITLE" \
    --body "$BODY" \
    --label "qa-bug,automated" 2>/dev/null && CREATED=$((CREATED + 1)) || echo "  create failed (labels may not exist yet)"
done

echo ""
echo "Done: $CREATED created, $SKIPPED skipped"
