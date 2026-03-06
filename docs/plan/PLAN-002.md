# PLAN-002 Keep Worker source entry and move API TypeScript output to dist

## status

completed

## Current State

- `apps/api` 运行 `tsc` 时没有 `outDir`
- `packages/tsconfig/base.json` 开启了 `declaration` 和 `declarationMap`
- 因此 `apps/api/src` 被直接写入 `.js/.d.ts/.d.ts.map`
- `wrangler.toml` 与本地 Vite dev server 仍以 `src/index.ts` 作为入口

## Proposal

- 为 `apps/api` 增加 `rootDir` 和 `outDir`
- 将 API 构建产物统一输出到 `apps/api/dist`
- 将 `apps/api/dist/` 加入 `.gitignore`
- 删除已提交的 API 生成文件
- 保留 Worker 源码入口，避免影响本地开发和 Wrangler 对 TS 的直接支持

## Risks

- 构建输出目录变更后，依赖旧产物路径的脚本会失效
- 若未来需要纯 JS 入口部署，应单独调整 deploy 流程

## Scope

- 只修复构建产物位置与版本控制过滤
- 不调整 API 运行逻辑和开发服务器入口

## Alternatives

- 将 `wrangler.toml` 入口切换到 `apps/api/dist/index.js`
- 当前不采用，因为本地开发仍直接使用 `src/index.ts`，并且 Wrangler 可直接处理 TS 源码
