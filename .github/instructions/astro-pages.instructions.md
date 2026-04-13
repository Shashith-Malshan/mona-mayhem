---
applyTo: "src/pages/**/*.astro"
description: "Use when editing Astro page files for UI structure, styling, and client-side interaction patterns in Mona Mayhem."
---

# Astro Page Instructions

- Keep page structure simple and workshop-friendly; avoid unnecessary component abstraction unless repeated 3+ times.
- Use semantic HTML and accessible forms:
  - Every input needs a visible label.
  - Buttons must have clear text and predictable behavior.
  - Enter key behavior should match primary action where appropriate.
- Keep client scripts readable and local to the page when logic is page-specific.
- Prefer CSS variables for theme colors and keep visual styles cohesive when adding new UI.
- Show user-facing loading and error states for async actions.
