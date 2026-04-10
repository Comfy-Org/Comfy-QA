# Comfy Code Search — User Story

## Who
A custom node developer debugging an issue with KSampler — needs to understand how it's defined internally and how other nodes reference it across the Comfy ecosystem.

## Goal
Find exactly where KSampler is defined, see how other nodes use it, and jump into the source — all without cloning a single repo.

## Happy path

1. **Open Comfy Code Search** — Navigate to cs.comfy.org. The Sourcegraph-powered search interface loads with a single search box covering every Comfy-Org repository.
2. **Type the query** — Enter "KSampler" into the search box. The interface is ready for full-text and regex queries.
3. **See results stream in** — Results appear from multiple repositories — frontend, backend, and custom nodes — all in one view.
4. **Scan the result list** — Each result shows the file path, repo name, and matching lines with syntax highlighting. The definition is immediately visible.
5. **Scroll through more results** — Beyond the definition, find every reference to KSampler across the entire codebase — imports, subclasses, tests.
6. **Click into a result** — Jump directly to the source file with full context. No cloning repos, no switching tabs.
7. **Read the source** — The full file is displayed with syntax highlighting and line numbers. Understand the implementation in seconds.

## Key features to demo
- The unified search box (one place to search all Comfy repos)
- Cross-repository results (frontend, backend, custom nodes in one list)
- Syntax-highlighted code snippets in results
- File path and repo name on every result
- Click-through to full source file
- Regex support (mentioned in narration)

## Implicit narration (what the voiceover should explain)
- WHY this exists (GitHub search is per-repo; Comfy has dozens of repos, and you need to search them all at once)
- HOW it works (Sourcegraph indexes every Comfy-Org repository with full regex support)
- WHAT you see in results (file path, repo name, matching lines with highlighting)
- WHERE to go next (click any result to read the full source file instantly)

## Out of scope for this demo
- Advanced Sourcegraph query syntax (type:, repo:, lang: filters)
- Diff / blame views
- Saved searches and monitoring
- Authentication and private repo access
