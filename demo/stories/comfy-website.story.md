# ComfyUI Website — User Story

## Who
Someone who just heard about ComfyUI — maybe from a tweet, a YouTube video, or a friend — and wants to understand what it is and how to get started.

## Goal
Understand what ComfyUI offers, see why it stands out from other AI image tools, and find the right entry point (cloud, local install, or documentation).

## Happy path

1. **Land on the homepage** — Arrive at comfy.org. The hero section immediately communicates the value proposition: the most powerful open-source AI image generator.
2. **Read the hero** — The hero explains the core idea — build complex image generation pipelines by connecting nodes visually, like a flowchart.
3. **Scroll to features** — Key features are laid out below the hero. Full control over every step of the generation process is the differentiator.
4. **See examples and integrations** — Further down, real examples show what's possible. ComfyUI works with Stable Diffusion, SDXL, Flux, and more.
5. **Read community proof** — Testimonials and ecosystem links demonstrate this is a thriving community with thousands of active users, not just a solo project.
6. **Find next steps in the footer** — Documentation, GitHub, and Discord links are all in the footer. Pick a path and dive in.

## Key features to demo
- Hero section with clear value proposition
- Feature highlights (node-based, full control, open-source)
- Integration examples (SD, SDXL, Flux)
- Community testimonials and social proof
- Footer navigation to docs, GitHub, Discord

## Implicit narration (what the voiceover should explain)
- WHY ComfyUI exists (full control over AI image generation, not a black box)
- HOW it works at a high level (node-based visual pipeline)
- WHAT sets it apart (open-source, extensible, huge ecosystem)
- WHERE to go next (docs for learning, GitHub for code, Discord for community)

## Out of scope for this demo
- Actually using ComfyUI (that's the frontend demo)
- Installing locally (that's the docs/getting-started demo)
- Custom node development or advanced workflows

## Technical notes
- This is a Nuxt SSR site — scripts must be blocked to avoid Playwright hangs
- Only mouse.move and mouse.wheel are safe inside segments (no safeMove, no page.evaluate)
