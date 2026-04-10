# ComfyUI Frontend — User Story

## Who
A creative professional, AI artist, or developer who wants to understand the ComfyUI graph editor interface in detail — how nodes look, how connections work, how to navigate the canvas, and what UI elements are available for building workflows.

## Goal
Explore every visual and interactive element of the ComfyUI frontend editor: the canvas workspace, node anatomy, wire system, zoom/pan controls, toolbars, menus, widgets, and organizational features — providing a deep dive into the UI/UX that complements the cloud platform overview.

## Happy path

### Chapter 1 — Canvas overview
1. **Land on the editor** — After logging in at cloud.comfy.org, the editor loads with a default workflow on an infinite canvas.
2. **Canvas orientation** — The canvas is the central workspace — a zoomable, pannable 2D graph where all nodes live.
3. **Default workflow** — A starter workflow is pre-loaded with connected nodes showing a typical image generation pipeline.
4. **Canvas background** — The dotted grid pattern provides spatial reference as you pan and zoom.

### Chapter 2 — Node anatomy
5. **Node structure** — Each node is a rectangular card with a colored title bar, input slots on the left, and output slots on the right.
6. **Title bar** — The top bar shows the node type name and is color-coded by category.
7. **Input slots** — Left-side dots accept incoming connections — each labeled with its expected data type.
8. **Output slots** — Right-side dots send data downstream to other nodes.
9. **Widget area** — The body of a node contains interactive widgets: sliders, dropdowns, text fields, and toggles.
10. **Collapsed nodes** — Nodes can be collapsed to save space, showing only their title and connection points.

### Chapter 3 — Wire/connection system
11. **Wire basics** — Colored lines connect outputs to inputs, representing data flow through the graph.
12. **Wire colors** — Different data types use different wire colors — images, latents, models, conditioning each have distinct hues.
13. **Wire routing** — Wires curve smoothly between nodes, automatically routing around obstacles.
14. **Connection compatibility** — Only compatible types can connect — the UI prevents invalid wiring.

### Chapter 4 — Navigation
15. **Zoom in** — Scroll wheel zooms into the canvas, revealing node detail and widget text.
16. **Zoom out** — Scrolling out shows the full workflow topology — how all nodes relate.
17. **Extreme zoom in** — At maximum zoom, individual widget labels and values are clearly readable.
18. **Extreme zoom out** — At minimum zoom, the entire workflow fits on screen as a miniature map.
19. **Pan left** — Click and drag the canvas background to pan horizontally.
20. **Pan right** — Continue panning to explore nodes off-screen to the right.
21. **Pan vertically** — Pan up and down to see nodes arranged across the vertical axis.

### Chapter 5 — Node organization
22. **Node groups** — Group boxes visually organize related nodes with a colored background and label.
23. **Group colors** — Groups can be color-coded to distinguish pipeline stages.
24. **Node alignment** — Nodes snap to grid for clean, organized layouts.
25. **Node spacing** — Proper spacing between nodes keeps the workflow readable.

### Chapter 6 — Visual hierarchy
26. **Color coding by type** — Loader nodes, processing nodes, and output nodes each have distinct color schemes.
27. **Selected state** — Clicking a node highlights it with a selection border.
28. **Hover state** — Hovering over a node subtly highlights it, showing it's interactive.
29. **Active vs inactive** — Nodes in the execution path appear active; disconnected nodes appear dimmer.

### Chapter 7 — Input widgets
30. **Slider widgets** — Numeric parameters like denoise strength use horizontal sliders with value readouts.
31. **Dropdown widgets** — Selection fields like sampler name show a dropdown menu of options.
32. **Text input widgets** — Prompt nodes have multi-line text areas for entering positive and negative prompts.
33. **Number fields** — Width, height, seed, and step count use numeric input fields.
34. **Toggle widgets** — Boolean options appear as checkboxes or toggle switches.
35. **Image widgets** — Some nodes display image thumbnails or previews inline.

### Chapter 8 — Output and preview
36. **Preview images** — Output nodes display generated images directly on the canvas.
37. **Preview sizing** — Preview images can be resized by dragging node edges.
38. **Multiple outputs** — Nodes with multiple outputs show each on a separate slot.

### Chapter 9 — Toolbar and status
39. **Top toolbar** — The toolbar at the top provides workflow management, run controls, and settings.
40. **Status indicators** — Connection status, GPU availability, and execution state are shown in the UI.
41. **Progress bar** — During execution, a progress indicator shows generation advancement.
42. **Queue controls** — The Queue Prompt button starts generation; View Queue shows pending jobs.

### Chapter 10 — Menus and dialogs
43. **Context menu** — Right-clicking the canvas reveals the context menu with node creation options.
44. **Node search** — The search dialog lets you find and add any node type by name.
45. **Search categories** — Node search results are organized by category for quick browsing.
46. **Workflow tabs** — Multiple workflows can be open simultaneously as tabs.

### Chapter 11 — Layout and theme
47. **Responsive panels** — Side panels resize and collapse for different screen sizes.
48. **Dark theme** — The default dark theme reduces eye strain during long sessions.
49. **UI density** — The interface balances information density with readability.
50. **Font and icons** — Consistent iconography and typography throughout the interface.

### Chapter 12 — Indicators and feedback
51. **Error indicators** — Nodes with configuration errors show warning badges or red borders.
52. **Execution feedback** — Nodes flash or highlight as they execute in sequence.
53. **Final overview** — The ComfyUI frontend is a powerful, visual-first editor built for complex AI workflows.

## Key features to demo
- Canvas workspace with infinite pan/zoom
- Node anatomy (title, inputs, outputs, widgets)
- Wire/connection visual system with color coding
- Zoom levels from extreme close-up to full overview
- Pan navigation in all directions
- Node groups and organization
- Color coding and visual hierarchy
- Input widgets (sliders, dropdowns, text, numbers, toggles)
- Output preview areas
- Toolbar and status indicators
- Context menus and node search
- Workflow tab system
- Theme and layout
- Error/warning indicators
- Progress and execution feedback

## Implicit narration (what the voiceover should explain)
- WHY the node-based UI exists (visual programming is more intuitive than code for creative work)
- HOW data flows through the graph (left to right, output to input)
- WHAT each node component does (title = type, slots = connections, body = parameters)
- HOW color coding helps you read complex workflows at a glance
- WHY zoom and pan matter (workflows can grow very large)

## Out of scope for this demo
- Cloud platform features (covered in cloud-comfy demo)
- Sidebar panels deep dive (covered in cloud-comfy demo)
- Actual image generation and results
- API access and programmatic usage
- Custom node installation
