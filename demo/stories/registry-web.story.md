# Comfy Registry — User Story

## Who
A ComfyUI user who needs a specific custom node — an upscaler, a ControlNet preprocessor, or a video model — and wants to find, evaluate, and install it without trawling through GitHub.

## Goal
Find, evaluate, and install a node package in under 30 seconds.

## Happy path

1. **Land on the registry home** — Arrive from a Discord link or Google search. The hero immediately signals this is the official hub for ComfyUI custom nodes.
2. **Search for a node** — Type "SUPIR" into the search bar. Results stream in as you type — no page reload, no waiting.
3. **Click the top result** — Open the detail page to see everything about the package before committing.
4. **Read the detail page** — README, install command, version history, dependencies — all in one place.
5. **Copy the install command** — One click copies it to the clipboard. Paste into ComfyUI Manager and the node is installed.
6. **Check version history** — Verify the package is actively maintained and see recent updates.
7. **Back to browse** — Return to the main page to explore categories or trending nodes.

## Key features to demo
- The search bar (the single most-used feature)
- Live search suggestions
- Detail page with README and metadata
- Install command copy (the conversion event)
- Version history (the "is this maintained?" check)
- Browse / category navigation
- The growing ecosystem angle

## Implicit narration (what the voiceover should explain)
- WHY a registry exists (without it, you're hunting random GitHub repos)
- HOW fast the search-to-install loop is (under 30 seconds)
- WHAT signals quality (version history, active maintenance)
- WHERE to go next (browse, publish your own)

## Out of scope for this demo
- Logging in / publishing your own node (that's a separate "publisher" demo)
- The admin / moderation views
- The CI / verification badge details
