---
name: design-md
description: Analyzes Stitch projects and generates comprehensive DESIGN.md files documenting design systems.
---

# design-md

This skill analyzes Stitch projects and synthesizes a semantic design system into a `DESIGN.md` file. This file acts as a source of truth for generating new screens, ensuring they align with existing design language.

## Core Capabilities
- **Project Analysis**: Retrieves project and screen metadata from Stitch.
- **Visual Extraction**: Parses CSS/Tailwind tokens to extract colors, geometry, typography, and layout patterns.
- **Semantic Mapping**: Translates technical values into natural-language rules and component descriptions.
- **Documentation**: Assembles values into a structured `DESIGN.md`.

## Workflow
1. Use `mcp_stitch_get_project` and `mcp_stitch_list_screens`.
2. For each screen, analyze the HTML/CSS using `read_browser_page` or `get_screen`.
3. Synthesize the findings into a `DESIGN.md` file in the root directory.
