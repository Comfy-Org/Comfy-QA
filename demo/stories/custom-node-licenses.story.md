# Node Licenses — User Story

## Who
A developer building a commercial product with ComfyUI custom nodes who needs to verify that every dependency's license is compatible before shipping.

## Goal
Quickly audit the license landscape of the ComfyUI ecosystem, identify which nodes use permissive licenses, and flag any that require careful legal review.

## Happy path

1. **Land on the dashboard** — Open the license explorer. The page immediately presents a visual breakdown of license distribution across all custom nodes.
2. **Read the chart** — A chart shows the proportion of each license type in the ecosystem. MIT dominates, but GPL and proprietary licenses are visibly present.
3. **Hover for detail** — Hovering over chart segments reveals exact counts per license type — essential for understanding the mix before diving into specifics.
4. **Scan the table** — Below the chart, every node is listed with its license. Scan the rows to check specific packages planned for integration.
5. **Filter by license** — Use the filter controls to narrow down to MIT-only (or any other license). This isolates the commercially safe options instantly.
6. **Explore the long tail** — Scroll further to find niche nodes with uncommon licenses. These are the ones that need manual legal review.
7. **Confirm and close** — A quick check here prevents compliance surprises later. Five seconds of diligence saves hours of legal cleanup.

## Key features to demo
- License distribution chart (pie/bar)
- Hover tooltips with exact counts per license
- Full node listing table with license column
- Filter/search controls for narrowing by license type
- Long-tail discovery of uncommon licenses

## Implicit narration (what the voiceover should explain)
- WHY license checking matters (commercial use, redistribution, compliance)
- HOW the chart gives instant clarity (visual proportion of MIT vs GPL vs other)
- WHAT the table reveals (per-node license, quick scanning)
- WHERE risk hides (niche nodes with uncommon or restrictive licenses)

## Out of scope for this demo
- Legal advice on specific license terms
- Comparing licenses across versions of the same node
- The publishing/submission side of license declaration
