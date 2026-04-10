# ComfyUI Embedded Workflow Editor — User Story

## Who
A ComfyUI power user who shares generated images online and wants to edit, inspect, or re-embed workflow metadata inside those images without leaving the browser.

## Goal
Understand all four ways to load a ComfyUI image into the editor, learn what happens under the hood (EXIF parsing, workflow JSON extraction), and know how to edit and re-export losslessly.

## Happy path

1. **Land on the editor page** — They arrive from a GitHub link or community post. The heading "ComfyUI Workflow Editor in your browser" explains the tool's purpose immediately.
2. **Understand the problem** — ComfyUI embeds workflow JSON inside image metadata. Editing that metadata normally requires Python scripts or CLI tools.
3. **Way 1: Paste/Drop** — The first input area accepts drag-and-drop or clipboard paste. They hover it to see the supported gesture.
4. **Way 2: Upload Files** — A file picker button for users who prefer the traditional upload dialog.
5. **Way 3: Mount Folder** — Uses the File System Access API to mount a local directory and batch-process images.
6. **Way 4: Paste URL** — An input field where they can paste a URL to a remote image hosted anywhere.
7. **Understand EXIF parsing** — The tool reads EXIF/tEXt chunks from PNG, WebP, FLAC, and MP4 files.
8. **Understand workflow JSON** — The extracted metadata is a full ComfyUI workflow graph in JSON form.
9. **Understand editing** — Users can modify prompts, seeds, sampler settings, and node connections.
10. **Understand re-embedding** — Changes are written back into the file metadata without re-encoding the media (lossless).
11. **Understand export** — The modified file is downloaded with the new workflow embedded.
12. **Privacy angle** — Everything runs client-side; no images are uploaded to any server.
13. **Fork on GitHub** — The project is open-source; the "Fork me on GitHub" ribbon invites contributions.
14. **Format support** — PNG, WebP for images; FLAC, MP4 for audio/video workflows.
15. **Use cases** — Batch editing seeds, sharing workflow-embedded images, archiving workflows inside media files.

## Key features to demo
- Four input methods (paste/drop, upload, mount folder, paste URL)
- EXIF/metadata parsing explanation
- Workflow JSON structure
- In-place editing capabilities
- Lossless re-embedding
- Export/download flow
- Privacy (client-side only)
- Multi-format support (PNG, WebP, FLAC, MP4)
- GitHub fork link

## Implicit narration (what the voiceover should explain)
- WHY this tool exists (editing workflow metadata is hard without it)
- WHO uses it (image sharers, workflow archivists, batch processors)
- HOW it works under the hood (EXIF chunk parsing → JSON → editing → re-embedding)
- WHAT makes it special (lossless, browser-only, multi-format)
- WHERE to find the source code (GitHub)

## Out of scope for this demo
- Actually uploading and editing a real image (the demo is a narrated walkthrough of the UI)
- The internal JavaScript implementation
- ComfyUI workflow authoring (that's ComfyUI itself, not this tool)
