# Mona Mayhem Copilot Instructions

## Project Overview
- This repository is a workshop starter for building "Mona Mayhem", a GitHub contribution battle app.
- Stack: Astro 5, TypeScript, Node adapter.
- Main user-facing page lives in `src/pages/index.astro`.
- Server-side API endpoints live in `src/pages/api/**`.

## Commands
- Install dependencies: `npm install`
- Start dev server: `npm run dev`
- Build for production: `npm run build`
- Preview production build: `npm run preview`

## Architecture Notes
- Astro file-based routing is used:
  - `src/pages/index.astro` -> `/`
  - `src/pages/api/contributions/[username].ts` -> `/api/contributions/:username`
- Keep API logic server-side and return JSON with explicit status codes.
- Favor small, focused changes that match the workshop progression.

## Coding Guidelines
- Prefer TypeScript-first implementations and explicit interfaces for API payloads.
- Keep markup accessible: use semantic elements, labels for inputs, and keyboard-friendly interactions.
- Avoid introducing new dependencies unless they clearly reduce complexity.
- Keep comments brief and only for non-obvious logic.

## Astro Best Practices
- Use `import type` for types when possible.
- Keep route handlers deterministic and defensive (validate params, handle upstream failures, return structured errors).
- For client interactivity in `.astro`, keep scripts focused and avoid over-coupling DOM and network logic.
- Preserve existing formatting and avoid unrelated refactors.

## Workshop Guardrails
- Do not modify files in `workshop/**` unless explicitly requested.
- Do not modify `docs/**` unless explicitly requested.
- Default to implementing app features in `src/**` and static assets in `public/**`.
