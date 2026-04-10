# Comfy Registry — Node Detail Page Story

## Who
A ComfyUI user who found a node in the registry catalog and wants to evaluate it before installing. They want to see the full description, install command, version history, and repository link.

## Goal
Explore a specific node detail page on the Comfy Registry, demonstrating how a user evaluates a node before installing it.

## Happy path

### Chapter 1 — Landing on the detail page
1. **Navigate directly to a popular node** — Open the detail page for ComfyUI-KJNodes, one of the most popular utility packs.
2. **Read the node name** — The H1 heading shows "ComfyUI-KJNodes" — immediately clear what package this is.
3. **See the publisher name** — The @author badge shows who maintains this node, building trust.

### Chapter 2 — Install command
4. **Find the install command** — A code block shows `comfy node install comfyui-kjnodes` — the exact CLI command to install it.
5. **Notice the copy button** — One click copies the install command to clipboard. No manual typing needed.
6. **See the CLI docs link** — A link to the Comfy CLI getting-started guide helps first-time users set up the CLI.

### Chapter 3 — Description and README
7. **Read the description section** — The Description heading introduces what this node pack does.
8. **Scroll through the README** — The full README from the repository is rendered inline with formatted markdown.

### Chapter 4 — Version history
9. **Find the version history** — A "Version history" section lists every published version with dates.
10. **See the latest version** — The most recent version shows the version number and when it was published.
11. **Scroll through older versions** — Dozens of versions show active, ongoing maintenance.

### Chapter 5 — External links
12. **Find the View Repository link** — A link to the GitHub repository for source code, issues, and contributions.
13. **Return to the home page** — The Home breadcrumb link takes you back to the registry catalog.

## Key features to demo
- Node name (H1 heading)
- Publisher identity
- Install command with copy button
- CLI documentation link
- Description section
- README markdown rendering
- Version history with dates
- View Repository (GitHub) link
- Home breadcrumb navigation

## Out of scope
- Login or authenticated features
- Publishing or managing nodes
- Comparing multiple nodes side by side
