#!/usr/bin/env bash
# Backfill thumbnail.jpg for all existing QA branches on comfy-qa.pages.dev.
#
# Iterates through every branch listed in pages/runs.json, checks if
# thumbnail.jpg already exists, and if not, downloads video.mp4, extracts
# a frame at 3s with ffmpeg, and pushes thumbnail.jpg to the branch.
#
# Usage:
#   COMFY_QA_TOKEN=ghp_... ./scripts/backfill-thumbnails.sh
#
# Required:
#   - COMFY_QA_TOKEN (PAT with contents:write on Comfy-Org/Comfy-QA)
#   - ffmpeg installed locally
#   - pages/runs.json (built by build-index.sh)

set -euo pipefail

REPO="Comfy-Org/Comfy-QA"
PAGES_DOMAIN="comfy-qa.pages.dev"
RUNS_JSON="pages/runs.json"
TOKEN="${COMFY_QA_TOKEN:-${GITHUB_TOKEN:-}}"

if [ -z "$TOKEN" ]; then
  echo "Error: COMFY_QA_TOKEN or GITHUB_TOKEN required" >&2
  exit 1
fi

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "Error: ffmpeg not installed" >&2
  exit 1
fi

if [ ! -f "$RUNS_JSON" ]; then
  echo "Error: $RUNS_JSON not found. Run scripts/build-index.sh first." >&2
  exit 1
fi

# Extract branch names from runs.json
BRANCHES=$(python3 -c "import json; [print(r['branch']) for r in json.load(open('$RUNS_JSON')) if r.get('hasVideo', True) and r.get('branch')]")

TOTAL=$(echo "$BRANCHES" | wc -l | tr -d ' ')
CURRENT=0
DONE=0
SKIPPED=0
FAILED=0

for BRANCH in $BRANCHES; do
  CURRENT=$((CURRENT + 1))
  URL="https://${BRANCH}.${PAGES_DOMAIN}"

  # Skip if thumbnail already exists (HEAD request)
  if curl -sfI "${URL}/thumbnail.jpg" -o /dev/null 2>&1; then
    SKIPPED=$((SKIPPED + 1))
    echo "[$CURRENT/$TOTAL] skip ${BRANCH} (thumbnail exists)"
    continue
  fi

  # Check video exists
  if ! curl -sfI "${URL}/video.mp4" -o /dev/null 2>&1; then
    echo "[$CURRENT/$TOTAL] skip ${BRANCH} (no video)"
    SKIPPED=$((SKIPPED + 1))
    continue
  fi

  WORKDIR=$(mktemp -d)
  trap 'rm -rf "$WORKDIR"' EXIT

  echo "[$CURRENT/$TOTAL] generate thumbnail for ${BRANCH}..."

  # Download video
  if ! curl -sf "${URL}/video.mp4" -o "${WORKDIR}/video.mp4"; then
    echo "  download failed"
    FAILED=$((FAILED + 1))
    rm -rf "$WORKDIR"
    trap - EXIT
    continue
  fi

  # Extract thumbnail at 3s
  if ! ffmpeg -y -ss 3 -i "${WORKDIR}/video.mp4" -frames:v 1 -vf "scale=640:-1" -q:v 3 "${WORKDIR}/thumbnail.jpg" 2>/dev/null; then
    # Fallback to first frame
    ffmpeg -y -i "${WORKDIR}/video.mp4" -frames:v 1 -vf "scale=640:-1" -q:v 3 "${WORKDIR}/thumbnail.jpg" 2>/dev/null || true
  fi

  if [ ! -s "${WORKDIR}/thumbnail.jpg" ]; then
    echo "  ffmpeg failed"
    FAILED=$((FAILED + 1))
    rm -rf "$WORKDIR"
    trap - EXIT
    continue
  fi

  # Commit thumbnail to the branch (orphan branch pattern, same as deploy script)
  git clone --depth 1 --branch "$BRANCH" "https://x-access-token:${TOKEN}@github.com/${REPO}.git" "${WORKDIR}/repo" 2>/dev/null || {
    echo "  branch not found in repo"
    FAILED=$((FAILED + 1))
    rm -rf "$WORKDIR"
    trap - EXIT
    continue
  }

  cp "${WORKDIR}/thumbnail.jpg" "${WORKDIR}/repo/thumbnail.jpg"
  (
    cd "${WORKDIR}/repo"
    git add thumbnail.jpg
    if git diff --cached --quiet; then
      echo "  no change"
    else
      git -c user.email=qa@comfy.org -c user.name="Comfy QA" commit -m "chore: add thumbnail for ${BRANCH}" --quiet
      git push origin "$BRANCH" --quiet
      echo "  pushed"
      DONE=$((DONE + 1))
    fi
  )

  rm -rf "$WORKDIR"
  trap - EXIT
done

echo ""
echo "Done: $DONE generated, $SKIPPED skipped, $FAILED failed, $TOTAL total"
