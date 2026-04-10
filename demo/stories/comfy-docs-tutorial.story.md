# ComfyUI Docs — Tutorial Deep Dive Story

## Who
A new ComfyUI user who has just installed the software and wants to generate their first image. They found the docs and are looking for a step-by-step guide.

## Goal
Walk through the "Text to Image" tutorial page on docs.comfy.org, demonstrating how the documentation teaches users to go from zero to their first generated image.

## Happy path

### Chapter 1 — Arriving at the tutorial
1. **Land on the tutorial page** — Navigate directly to the Text to Image tutorial. The heading "ComfyUI Text to Image Workflow" immediately tells you what you'll learn.
2. **See the breadcrumb navigation** — The breadcrumbs show Tutorials > Basic > Text to Image, giving context within the docs structure.
3. **Notice the table of contents** — A right-sidebar TOC lets you jump to any section of this long page.

### Chapter 2 — Reading the guide
4. **About Text to Image** — The introduction explains what text-to-image generation is and why it matters.
5. **Preparation section** — Step 1 covers what you need before starting (a model checkpoint file).
6. **Loading the workflow** — Step 2 shows how to load the example workflow into ComfyUI.
7. **Generating your first image** — Step 3 walks through loading a model and hitting Generate.
8. **Start experimenting** — Step 4 encourages you to try different prompts and settings.

### Chapter 3 — Understanding the nodes
9. **Working principles** — A section explaining how the workflow nodes connect and process data.
10. **Node explanations** — Detailed breakdowns of each node: Load Checkpoint, Empty Latent Image, CLIP Text Encoder, KSampler, VAE Decode, Save Image.
11. **Visual diagrams** — Screenshots and annotated images show exactly what each node looks like.

### Chapter 4 — Model information
12. **SD1.5 Model introduction** — Background on the Stable Diffusion 1.5 model used in the tutorial.
13. **Advantages and limitations** — Honest assessment of what SD1.5 can and cannot do.

## Key features to demo
- Tutorial page structure and navigation
- Step-by-step workflow with screenshots
- Node-by-node explanations
- Visual diagrams and annotated images
- Right-sidebar table of contents
- Breadcrumb navigation

## Out of scope
- Actually running ComfyUI or generating images
- Other tutorials beyond Text to Image
- API reference pages
