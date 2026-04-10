# ComfyUI Cloud — Comprehensive User Story

## Who
A creative professional, AI art enthusiast, or hobbyist who wants to use ComfyUI for image generation without installing anything locally — they want a hosted, GPU-accelerated node editor they can access from any browser. They may be brand new to ComfyUI or migrating from a local install.

## Goal
Explore every feature of the hosted ComfyUI Cloud editor in depth — from logging in and navigating the canvas, through all sidebar panels, workflow execution, canvas interactions, GPU selection, billing, sharing, and settings — to fully understand the hosted experience before committing to a workflow.

## Happy path

### Chapter 1 — Welcome & canvas overview
1. **Log in** — Arrive at cloud.comfy.org/login, sign in with email and password. The editor loads with a canvas and default workflow.
2. **Orient on the canvas** — The center of the screen is a graph canvas where you build workflows visually. This is the core workspace.
3. **Zoom in** — Scroll wheel up to zoom into the canvas, revealing more detail on individual nodes.
4. **Zoom out and pan** — Scroll wheel down to zoom back out. Pan by dragging the canvas background.
5. **Read the nodes** — Each box on the canvas is a node — model loaders, samplers, VAE decoders, output nodes.

### Chapter 2 — Node connections & wires
6. **See the wires** — Colored wires connect node outputs to inputs. Data flows left to right through the graph.
7. **Trace a connection** — Follow a wire from a model loader to a sampler to understand the data pipeline.
8. **Notice color coding** — Different wire colors represent different data types — images, models, latents, conditioning.

### Chapter 3 — Canvas interactions
9. **Drag a node** — Click and drag a node to reposition it. The wires follow the node as it moves.
10. **Right-click context menu** — Right-clicking the canvas opens a context menu with node creation, copy, paste, and more.
11. **Undo and redo** — The undo button steps back through your edits. Redo brings them forward again.
12. **Keyboard shortcuts** — Ctrl+Z undoes, Ctrl+Y redoes. These standard shortcuts work throughout the editor.

### Chapter 4 — Workflow tab management
13. **Top tab bar** — Your open workflows appear as tabs across the top. Switch between projects with one click.
14. **Create a new workflow** — Click the plus button to create a new blank workflow for a fresh canvas.
15. **Multiple workflows** — You can have several workflows open simultaneously, each in its own tab.

### Chapter 5 — Sidebar panels
16. **The left sidebar** — Five panels live on the left side. Let's tour each one.
17. **Assets panel** — Upload and manage images, videos, and reference files used in your workflows.
18. **Assets are organized** — Files are categorized so you can quickly find the reference images or videos you need.
19. **Node Library** — Browse every available node by category and search by name.
20. **Node Library search** — The search bar filters nodes instantly — type a name and matching nodes appear.
21. **Model Library** — Manage your checkpoints, LoRAs, VAEs, and other model files.
22. **Model details** — Each model shows its type, size, and compatibility — so you pick the right one.
23. **Workflows panel** — Save, load, organize, import, and export your workflow files.
24. **Workflow organization** — Folders and tags help you keep dozens of workflows manageable.
25. **Bottom toolbar** — Quick access to Help, Console, Shortcuts, and Settings at the bottom of the screen.
26. **Templates panel** — Pre-built workflow recipes you can clone and customize as starting points.

### Chapter 6 — Running a generation
27. **The Run button** — At the top, the Run button queues your workflow for execution on cloud GPUs.
28. **Batch count** — Set the batch count to generate multiple variations from one queue.
29. **GPU and machine selection** — Choose between GPU tiers — faster GPUs cost more credits but finish sooner.
30. **Machine tiers** — Different tiers offer different VRAM and compute power for demanding workflows.

### Chapter 7 — Task queue & output
31. **Task queue panel** — See active, completed, and failed jobs with their progress bars.
32. **Filter tasks** — Filter by completed or failed to find specific runs in your history.
33. **Preview outputs** — Generated images appear in the output area — review results without leaving the editor.
34. **Output node** — The output node on the canvas also displays the generated image inline.

### Chapter 8 — App Mode & sharing
35. **App Mode** — Switch to App Mode to preview your workflow as an end-user form, hiding the graph.
36. **App Mode form** — In App Mode, users see only the input fields and a generate button — clean and simple.
37. **Share button** — Generate a public link so others can run your workflow without needing an account.
38. **Collaboration** — Shared workflows let teams iterate on prompts and settings together.

### Chapter 9 — Credits, billing & profile
39. **Credits display** — Your remaining credits are visible in the interface so you always know your balance.
40. **Billing overview** — Check your usage history and purchase more credits when you're running low.
41. **User profile** — View your account info, display name, and connected integrations.
42. **Notifications** — The notification area shows system messages, job completions, and updates.

### Chapter 10 — Settings & help
43. **Settings dialog** — Hundreds of options for keyboard shortcuts, themes, display, and editor behavior.
44. **Theme options** — Switch between light and dark themes, or customize colors to your preference.
45. **Keyboard shortcut reference** — The settings panel lists every available keyboard shortcut.
46. **Help center** — Access documentation, tutorials, and community links from the help button.
47. **Documentation** — Step-by-step guides for common tasks and advanced workflows.

### Chapter 11 — Wrapping up
48. **Return to the canvas** — One final look at the full editor before we wrap up.
49. **Ecosystem integration** — ComfyUI Cloud connects to the Registry, Manager, and the broader community.
50. **Final CTA** — ComfyUI Cloud removes the install hassle — sign up at cloud.comfy.org and start generating in seconds.

## Key features to demo
- Login and authentication flow
- Canvas navigation (zoom, pan, node inspection)
- Node connections and wire visualization
- Canvas manipulation (drag, right-click context menu)
- Undo/redo functionality
- Workflow tab management (open, create, switch)
- All five sidebar panels (Assets, Nodes, Models, Workflows, Templates)
- Running generations and monitoring the task queue
- GPU/machine selection and tiers
- Preview and output viewing
- App Mode preview
- Sharing and collaboration
- Credits, billing, and user profile
- Notifications
- Settings and customization (themes, keyboard shortcuts)
- Help and documentation

## Implicit narration (what the voiceover should explain)
- WHY hosted ComfyUI exists (no install, instant GPU access, collaboration built in)
- WHO it's for (creators who want to generate without DevOps or local GPU)
- HOW it compares to local ComfyUI (same node editor, cloud GPUs, sharing built in)
- WHAT each sidebar panel is for and when you'd use it
- HOW the workflow execution pipeline works (queue → GPU → preview → download)
- WHY GPU selection matters (cost vs speed trade-off)
- HOW credits and billing work at a high level
- WHAT App Mode is good for (sharing with non-technical collaborators)

## Out of scope for this demo
- Detailed node parameter editing (too granular for overview tour)
- Actual image generation results (depends on GPU availability)
- API access and programmatic usage
- Team/organization management
- Custom node installation (covered in Registry demo)
