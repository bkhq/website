# CLAUDE.md

## Project

bkio — Monorepo template for Bun + Hono + Vite + React + Cloudflare Workers.

## Commands

- `bun run dev` — Start dev server (frontend + API via @hono/vite-dev-server)
- `bun run build` — Type-check API + build frontend
- `bun run deploy` — Build and deploy to Cloudflare Workers
- `bun run test` — Run all tests
- `bun run lint` — Lint with ESLint
- `bun run format` — Format with ESLint autofix

## Project Development

Use `/pma` for task and plan management. Follow the three-phase workflow:

1. **Investigation** — Trace code, read context, claim task
2. **Proposal** — Output findings and wait for approval
3. **Implementation** — Implement, verify, record

Task tracking: `docs/task/index.md`
Plan tracking: `docs/plan/index.md`
