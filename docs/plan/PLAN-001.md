# PLAN-001 Rename workspace identities and reset git history

## status

completed

## Current State

- 根项目名称仍为 `template-bun-cloudflare`
- workspace 包名与 TypeScript `extends` 路径均依赖 `@template-bun-cloudflare/*`
- Cloudflare Workers 名称仍为 `template-bun-cloudflare`
- 仓库当前存在 `.git` 目录并跟踪远端 `origin/main`

## Proposal

- 将根项目名改为 `bitk-web`
- 将内部 workspace 包前缀统一改为 `@bitk-web/*`
- 将 `wrangler.toml` 中的 Worker 名称改为 `bk-io`
- 同步 README、CLAUDE、docs 标题中的旧项目名
- 最后删除 `.git` 并执行 `git init`

## Risks

- 删除 `.git` 会丢失当前提交历史与远端配置
- workspace 名称变更后需要更新锁文件，否则安装状态可能不一致

## Scope

- 仅处理命名和仓库初始化
- 不改业务代码和运行逻辑

## Alternatives

- 保留 Git 历史，仅改远端与首个新提交；不采用，因为与用户要求不符
