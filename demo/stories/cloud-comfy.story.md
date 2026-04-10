# ComfyUI Cloud — User Story

## Who
A creator who wants to generate AI images but doesn't have a local GPU, doesn't want to install Python/CUDA, and doesn't want to download gigabytes of model files.

## Goal
Go from zero to a generated image using a pre-built template on cloud GPUs — no local setup required.

## Happy path

1. **Login** — Sign in with email and password. The editor canvas loads automatically.
2. **See the node editor** — The canvas is where workflows live. Each box is a processing step, connected like a flowchart.
3. **Pick a template** — Open the Templates panel and grab a pre-built workflow (e.g. text-to-image) instead of building from scratch.
4. **Hit Run** — Queue the workflow on a cloud GPU. No local hardware needed.
5. **Explore the sidebar** — Assets, Nodes, Models, Workflows — everything organized in one place.
6. **See the result** — The generated image appears in the editor. Share it with a single click.

## Key features to demo
- Email login flow
- The node-based canvas editor
- Templates panel (pre-built workflows)
- Run button and cloud GPU queue
- Sidebar navigation (Assets, Nodes, Models, Workflows)
- Output preview and Share button

## Implicit narration (what the voiceover should explain)
- WHY cloud matters (no install, no GPU, no model downloads)
- HOW the node editor works (visual flowchart of processing steps)
- WHAT templates provide (instant start without building from scratch)
- WHERE results appear (inline in the editor, shareable via link)

## Out of scope for this demo
- Custom node installation
- App mode / publishing workflows as apps
- Settings and advanced configuration
- Model management and uploading
