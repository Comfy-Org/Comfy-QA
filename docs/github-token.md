# GitHub Token for comfy-qa.pages.dev

The dashboard uses a GitHub token to fetch issue/PR open-closed status via a
Cloudflare Pages Function (`/api/github-status`). The function caches responses
for 15 minutes to stay well under GitHub's 5 000 req/hr authenticated rate limit.

## Required permissions

Create a **fine-grained personal access token** at
https://github.com/settings/tokens/new with the following settings:

| Setting | Value |
|---|---|
| Token name | `comfy-qa-pages` |
| Expiration | 1 year (rotate annually) |
| Resource owner | `Comfy-Org` |
| Repository access | **All repositories** (or select repos you QA) |
| Permissions → Issues | **Read-only** |
| Permissions → Pull requests | **Read-only** |

No other permissions are needed.

## Adding to the repo

After generating the token, add it as a GitHub Actions secret **and** a
Cloudflare Pages environment variable:

```bash
# GitHub Actions secret (used by build-index.sh)
gh secret set GITHUB_TOKEN_QA --repo Comfy-Org/Comfy-QA --body "github_pat_..."

# Cloudflare Pages env var (used by the /api/github-status Function)
# Set via Cloudflare Dashboard → Pages → comfy-qa → Settings → Environment variables
# Variable name: GITHUB_TOKEN_QA
# Value: github_pat_...
```

> **Note:** The Cloudflare Pages variable must be set in the dashboard UI —
> wrangler.toml should not contain secret values.
