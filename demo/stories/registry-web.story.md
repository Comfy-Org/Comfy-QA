# Comfy Registry — Comprehensive User Story

## Who
A ComfyUI hobbyist, professional, or new user who just discovered custom nodes exist — maybe they need an LLM router, a ControlNet preprocessor, a video model helper, or a GGUF loader — and they want to find vetted, community-reviewed packages they can install from a trusted central place. Alternatively, a node author who wants to understand the publishing ecosystem.

## Goal
Explore every feature of the Comfy Registry home page in depth — from hero branding to search, browsing, pagination, navigation, documentation access, login, and language options — to fully understand the ecosystem before installing anything.

## Happy path

### Chapter 1 — First impressions & hero
1. **Land on the registry home** — Arrive from a Discord link or a Google search. The hero says "Welcome to ComfyUI Registry" and immediately makes it clear this is the official, curated place for custom nodes.
2. **Notice the branding** — The "Comfy Registry" logo in the top-left nav anchors the experience. It's clean, modern, purpose-built.
3. **Read the tagline** — The hero text explains what this site does in a single glance: find and install custom nodes for ComfyUI.
4. **See the navigation bar** — Across the top: Comfy Registry (home), Documentation link, Discord link. Simple, no clutter.
5. **Spot the auth buttons** — Login and Signup buttons sit in the top-right corner, inviting publishers to join.
6. **Find the Get Started CTA** — Below the hero, a call-to-action button guides new users toward the documentation.

### Chapter 2 — The search experience
7. **Notice the search bar** — Front and center, with placeholder "Search Nodes". This is the single most-used feature.
8. **Click into the search bar** — The cursor moves to the search input, highlighting it.
9. **Type "controlnet"** — Letters appear one by one. This is the most common query people search for.
10. **Watch results appear** — The page updates with matching node packages. Each result card shows the package name, description, version, and publisher.
11. **Read through the results** — Scroll slowly through search results, examining what ControlNet packages are available.
12. **Notice result card details** — Each card contains the package name, a brief description, install stats, and the publisher identity.
13. **Appreciate the breadth** — There are multiple ControlNet-related packages from different authors, each solving a slightly different problem.

### Chapter 3 — Browsing the node catalog
14. **Clear search and return to browsing** — Go back to the full catalog view to see what's popular.
15. **Examine the first row of nodes** — Popular packages like KJNodes, rgthree's ComfyUI Nodes, Easy-Use.
16. **Hover over KJNodes** — See the card hover state, revealing more details about this popular utility pack.
17. **Scroll to see more nodes** — VideoHelperSuite, Impact Pack, essentials — each solving real workflow problems.
18. **Hover over Impact Pack** — One of the most downloaded packs in the ecosystem.
19. **Continue scrolling** — ControlNet Aux, GGUF, and more specialized nodes appear.
20. **Hover over GGUF** — The GGUF node enables running quantized models, a key feature for users with limited VRAM.
21. **Appreciate the diversity** — From image processing to video to LLMs, the registry covers the full spectrum of ComfyUI capabilities.

### Chapter 4 — Deep dive into node cards
22. **Scroll back up** — Return to the top of the catalog to examine cards more carefully.
23. **Examine card metadata** — Version number, install count, GitHub stars, and node count — all the signals that help you decide if a node is trustworthy.
24. **Look at @author names** — Each card shows who built it in @author format, building trust and accountability.
25. **Notice the visual design** — Cards are clean, scannable, and information-dense without being overwhelming.

### Chapter 5 — Pagination
26. **Scroll to the bottom** — Find the pagination controls at the bottom of the page.
27. **See page numbers** — Pages 1 through 5 are visible, plus Next/Previous buttons.
28. **Hover over page 2** — Ready to browse the next batch of nodes.
29. **Hover over page 3** — Even more nodes deeper in the catalog.
30. **Notice the Previous/Next controls** — Standard pagination that makes browsing large catalogs manageable.

### Chapter 6 — Navigation & documentation
31. **Scroll back to the top** — Return to the navigation bar.
32. **Hover over Documentation link** — This link takes publishers to guides on packaging and publishing their own nodes.
33. **Hover over Discord link** — The community hub where users discuss nodes, report bugs, and share workflows.
34. **Examine the Documentation purpose** — Docs cover everything from creating your first node pack to CI/CD publishing pipelines.

### Chapter 7 — Authentication & publishing
35. **Move to Login button** — For existing publishers returning to manage their packages.
36. **Move to Signup button** — For new node authors who want to join the ecosystem.
37. **Explain the publisher flow** — Signing up lets you publish, version, and manage your custom nodes from a dashboard.
38. **Why authentication matters** — It ensures every package has a verified author, building trust across the community.

### Chapter 8 — Language & accessibility
39. **Find the language selector** — Located in the interface for international users.
40. **Hover over the language options** — The registry supports multiple languages, making it accessible worldwide.
41. **Appreciate internationalization** — ComfyUI has a massive global community — supporting multiple languages is essential.

### Chapter 9 — Second search: "video"
42. **Return to the search bar** — Let's try a different search to show the breadth.
43. **Clear previous search** — Start fresh with a new query.
44. **Type "video"** — A common query for users working with video generation workflows.
45. **See video-related results** — VideoHelperSuite and other video-focused nodes appear.
46. **Scroll through video results** — Each specialized for different aspects of video workflows.
47. **Appreciate the specificity** — The search is smart enough to surface relevant results across package names and descriptions.

### Chapter 10 — Wrapping up
48. **Scroll back to the hero** — Return to where we started for the final summary.
49. **Reflect on the ecosystem** — Thousands of nodes, hundreds of publishers, one trusted registry.
50. **Final CTA** — Whether installing nodes or publishing your own, this is where the ComfyUI ecosystem lives.

## Key features to demo
- Hero branding & first impression
- Navigation bar (home, docs, Discord)
- Search bar ("Search Nodes" placeholder)
- Live search with "controlnet" query
- Node catalog browsing (20+ popular nodes)
- Individual node card hover states
- Card metadata (name, description, @author, version, install count, GitHub stars, node count)
- Pagination (pages 1–5, Next/Previous)
- Documentation link
- Discord community link
- Login / Signup buttons
- Language selector
- Second search query ("video")
- Get Started CTA
- Overall ecosystem breadth

## Implicit narration (what the voiceover should explain)
- WHY a registry exists (without it, you're installing random GitHub repos and hoping they're safe and maintained)
- WHO publishes here (verified node authors from the community)
- HOW it integrates with ComfyUI Manager (one-click install from the registry)
- WHAT makes a good node (active maintenance, clear docs, version history)
- WHERE to go next (docs for publishers, Discord for community)
- WHO benefits (hobbyists, professionals, researchers, node authors)

## Out of scope for this demo
- Logging in / publishing your own node (that's a separate "publisher" demo)
- Node detail pages (can't navigate inside segments)
- The admin / moderation views
- The CI / verification badge details
