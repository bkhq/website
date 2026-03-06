# bitk-web

Monorepo template for full-stack web applications using Bun, Hono, Vite, and Cloudflare Workers.

## Stack

- **Runtime**: [Bun](https://bun.sh) (workspaces)
- **API**: [Hono](https://hono.dev) on [Cloudflare Workers](https://workers.cloudflare.com)
- **Frontend**: [Vite](https://vite.dev) + [React 19](https://react.dev) + [Tailwind CSS v4](https://tailwindcss.com)
- **UI**: [shadcn/ui](https://ui.shadcn.com) (base-nova) + [Base UI](https://base-ui.com)
- **Tooling**: [Biome](https://biomejs.dev) (lint/format), [TypeScript](https://www.typescriptlang.org), [Vitest](https://vitest.dev)
- **Deploy**: Single Cloudflare Worker (API + static assets)

## Structure

```
apps/
  api/          Hono API (Cloudflare Workers)
  frontend/     Vite + React SPA
packages/
  shared/       Shared utilities
  tsconfig/     Shared TypeScript configs
```

## Getting Started

```bash
bun install
bun run dev
```

Open http://localhost:3000 - both frontend and API are served by Vite via `@hono/vite-dev-server`.

## Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start dev server (frontend + API) |
| `bun run build` | Type-check API + build frontend |
| `bun run build:api` | Type-check API |
| `bun run build:frontend` | Build frontend |
| `bun run deploy` | Build and deploy to Cloudflare |
| `bun run test` | Run all tests |
| `bun run lint` | Lint with Biome |
| `bun run format` | Format with Biome |

## Deploy

### Manual

```bash
bun run deploy
```

### GitHub Actions

1. Add secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`
2. Optionally set variable: `WORKER_NAME` (defaults to `name` in `wrangler.toml`)
3. Trigger the **Deploy** workflow manually

## License

MIT
