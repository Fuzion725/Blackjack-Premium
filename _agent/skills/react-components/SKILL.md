---
name: react-components
description: Converts Stitch screens to modular Vite + React components with TypeScript and Tailwind.
---

# react-components

This skill converts Stitch design exports into modular Vite + React components. It focuses on TypeScript safety, isolated logic, and Tailwind-aligned styling to produce maintainable UI code.

## Core Capabilities
- **Component Conversion**: Converts Stitch HTML + JSON into production-ready React components.
- **Tailwind Mapping**: Uses Tailwind class mapping derived from project theme values.
- **Data Decoupling**: Moves static text, image URLs, and lists into `src/data/mockData.ts`.
- **Modular Architecture**: Breaks down designs into independent files and isolated logic into custom hooks.

## Workflow
1. Fetch design JSON and HTML asset from Stitch.
2. Inspect layouts and extract Tailwind configuration.
3. Generate component files, hooks, and mock data in the `src` directory.
