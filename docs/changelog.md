# Changelog

## 2026-03-07 01:00 [progress]

Project initialized with monorepo template:
- apps/api: Hono on Cloudflare Workers
- apps/frontend: Vite + React 19 + Tailwind v4 + shadcn + Base UI
- packages/tsconfig + packages/shared
- GitHub Actions deploy workflow (manual trigger)
- ESLint-based lint/format workflow, Vitest for testing

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

## 2026-03-09 20:27 [decision]

Removed the `category` concept from content and frontend routing.
Moved former category semantics into `tags`, deleted `/category/*` page generation, and updated directory/detail UI to use tags only.

## 2026-03-09 20:30 [decision]

Removed the `demo` tool from the content registry and deleted the `content/demo/` directory.
Static generation no longer produces `/demo/*` or `/zh/demo/*` pages.

## 2026-03-09 20:50 [decision]

Added optional `path` mapping for tool content directories while keeping URL `slug` unchanged.
Migrated `zzci-chrome` and `zzci-traefik` to nested `content/zzci/...` directories and updated content loading to resolve files by `path`.

## 2026-03-09 21:06 [decision]

Split the site-wide tag dictionary out of `content/list.json` into `content/tags.json`.
Kept the frontend data API stable by having `getToolsJson()` compose `tags.json` and `list.json` into the existing structure.

## 2026-03-10 00:00 [decision]

Updated BKD installation docs to call out the macOS first-run permission issue.
Added guidance to run `xattr -cr bkd` when the downloaded binary cannot execute after `chmod +x`.

## 2026-03-10 00:05 [decision]

Refined the BKD macOS installation note into a dedicated required-step section.
Changed `xattr -cr bkd` from optional troubleshooting guidance to a mandatory first-run step in both languages.
