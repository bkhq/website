# Changelog

## 2026-03-07 01:00 [progress]

Project initialized with monorepo template:
- apps/api: Hono on Cloudflare Workers
- apps/frontend: Vite + React 19 + Tailwind v4 + shadcn + Base UI
- packages/tsconfig + packages/shared
- GitHub Actions deploy workflow (manual trigger)
- Biome for lint/format, Vitest for testing

## 2026-03-07 03:45 [decision]

Renamed the project identity from `template-bun-cloudflare` to `bkio`.
Updated all workspace package names and TypeScript references to `@bkio/*`.
Changed the Cloudflare Workers name in `wrangler.toml` to `bk-io`.
Removed the existing `.git` history and reinitialized the repository on branch `main`.

## 2026-03-07 03:40 [decision]

Moved API TypeScript build output from `apps/api/src` to `apps/api/dist`.
Ignored API build artifacts in version control and removed previously committed generated files.
Kept the Worker entry on TypeScript source because local development and Wrangler both work directly from source.

## 2026-03-09 18:20 [decision]

Changed frontend routing to use English as the default no-prefix path and Chinese under `/zh/*`.
Moved system pages to `/sys/*` and tag pages to `/tags/*`, while keeping `/api/*` reserved.
Updated locale switching, internal link localization, canonical and alternate tags, and Worker redirects for legacy `/en/*` and `/tag/*` paths.
