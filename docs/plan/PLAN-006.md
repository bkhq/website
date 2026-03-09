# PLAN-006 删除 demo tool 内容与目录

- **status**: completed
- **createdAt**: 2026-03-09 20:29
- **approvedAt**: 2026-03-09 20:29
- **completedAt**: 2026-03-09 20:30
- **relatedTask**: FE-004

## 现状

`demo` 当前仍然注册在 `content/list.json` 中，同时存在完整的 `content/demo/` 内容目录。

- `featured` 仍包含 `demo`
- `list[]` 仍包含 `demo`
- `[...slug].astro` 与 `[locale]/[...slug].astro` 的静态路由生成完全依赖 `toolsData.list`

因此只要 `demo` 保留在 `list.json`，页面就会继续生成 `/demo/*` 与 `/zh/demo/*`。

## 调查上下文

本次变更影响面很小，主要集中在：

- `content/list.json`
- `content/demo/`
- 文档记录与变更日志

页面生成逻辑本身不需要改，只要数据源删掉 `demo` 即可自然收敛。

## 方案

采用“彻底删除 demo tool”的方案：

1. 从 `featured` 删除 `demo`
2. 从 `list[]` 删除 `demo`
3. 删除整个 `content/demo/` 目录
4. 运行前端构建，确认 `/demo/*` 不再生成

## 风险

- 如果还有其它内容引用 `demo` slug，删除后会变成死链
- 当前检索中没有发现其它业务代码依赖 `demo`

## 范围

本次纳入：

- `demo` 数据与内容目录删除
- 构建验证

本次不纳入：

- 为旧 `/demo/*` 做兼容重定向
