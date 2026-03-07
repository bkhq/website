# Architecture

## Overview

Bun workspace monorepo deployed as a single Cloudflare Worker serving both API and static frontend assets.

## Structure

```
apps/
  api/            Hono API (Cloudflare Workers entry point)
  frontend/       Vite + React 19 SPA
packages/
  shared/         Shared types and utilities
  tsconfig/       Shared TypeScript configurations
```

## Runtime

- **Development**: Vite dev server with `@hono/vite-dev-server` — single process serves both frontend and API.
- **Production**: Cloudflare Worker handles API routes (`/api/*`), static assets served via Workers Static Assets with SPA fallback.

## Key Decisions

- **Single deployment**: Frontend and API deploy as one Cloudflare Worker to simplify infrastructure.
- **Bun workspaces**: Monorepo managed by Bun with `catalog:` for shared dependency versions.
- **Biome**: Single tool for linting and formatting (replaces ESLint + Prettier).
- **shadcn + Base UI**: shadcn (base-nova style) for styled components, Base UI for unstyled primitives.
