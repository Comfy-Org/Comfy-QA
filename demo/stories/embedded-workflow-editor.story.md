# Embedded Workflow Editor — User Story

## Who
A ComfyUI creator who generated an image last week and now wants to tweak the prompt without regenerating from scratch.

## Goal
Edit the workflow metadata embedded in a ComfyUI-generated image — change the prompt, keep the pixels — and export an updated file ready to reload into ComfyUI.

## Happy path

1. **Open the tool** — Navigate to the Embedded Workflow Editor in the browser. No install, no account required.
2. **Drop the image** — Drag a ComfyUI-generated WebP (or PNG) onto the drop zone. The tool reads EXIF data and extracts the full workflow JSON.
3. **Inspect the workflow** — See every node and parameter that produced the image: checkpoint model, sampler settings, and the original prompt.
4. **Edit the prompt** — Change the subject text (e.g. "quartz crystal" to "amethyst geode"). All other parameters stay untouched.
5. **Export the updated image** — Download the image with the new workflow written back into EXIF metadata. Pixels are unchanged.
6. **Reload into ComfyUI** — Open the exported file in ComfyUI and it loads with the edited prompt already set.

## Key features to demo
- File drop zone (PNG/WebP input)
- EXIF workflow extraction and display
- Inline prompt editing
- Lossless metadata rewrite
- Local-only processing (no server upload)

## Implicit narration (what the voiceover should explain)
- WHY this matters (avoid rebuilding workflows from scratch just to change a prompt)
- HOW it works (reads EXIF metadata, extracts workflow JSON, writes it back)
- WHAT stays the same (pixel data is untouched, only metadata changes)
- WHERE it runs (entirely in the browser, no uploads, complete privacy)

## Out of scope for this demo
- Generating images (this tool only edits metadata)
- Batch processing multiple images
- Advanced node graph editing
- ComfyUI installation or setup
