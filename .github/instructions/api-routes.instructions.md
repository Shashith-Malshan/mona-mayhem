---
applyTo: "src/pages/api/**/*.ts"
description: "Use when implementing or updating Astro API routes, especially contribution proxy endpoints and JSON error handling."
---

# API Route Instructions

- Use `import type` and explicit request/response payload types.
- Validate route params early and return structured JSON errors with clear status codes.
- Keep upstream fetch logic defensive:
  - Handle non-OK responses from upstream services.
  - Catch network/runtime failures and map to stable API errors.
  - Do not leak internal stack traces to clients.
- Return `Content-Type: application/json` for all JSON responses.
- Keep handlers deterministic and easy to test with small helper functions where useful.
