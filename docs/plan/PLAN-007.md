# PLAN-007 为工具内容目录增加 path 映射并支持嵌套目录

- **status**: completed
- **createdAt**: 2026-03-09 20:31
- **approvedAt**: 2026-03-09 20:31
- **completedAt**: 2026-03-09 20:50
- **relatedTask**: FE-005

## 现状

当前内容读取逻辑直接把 `slug` 当作 `content/` 下的目录名使用。

- `getToolMeta(slug)` 读取 `content/<slug>/meta.json`
- `getToolDocSlugs(slug)`、`getToolDocs(slug)`、`getToolDoc(slug, doc)` 都读取 `content/<slug>/`
- `resolveToolLogo(slug, logo)` 也从 `content/<slug>/` 取文件

这意味着如果保留 URL slug 为 `zzci-chrome`，就无法把内容实际存成 `content/zzci/chrome/`。

## 调查上下文

当前路由层仍以 `slug` 作为页面主键，这正符合目标：

- URL 继续使用 `slug`
- 站内 `link` 关系继续用 `slug`
- 只需要把内容读取层从“按 slug 找目录”改成“按 path 找目录，未配置时回退 slug”

因此不需要改路由结构，只需要改数据与内容加载层。

## 方案

采用 `path` 字段方案：

1. 在 `content/list.json` 的 `list[]` 中增加可选 `path`
2. 所有内容读取函数优先解析 `path`，未配置时回退 `slug`
3. 路径校验允许多级目录，但继续禁止 `..`、空段、绝对路径和越界访问
4. 将 `zzci-chrome` / `zzci-traefik` 迁移到 `content/zzci/chrome` / `content/zzci/traefik`
5. 模板页增加 `path` 用法说明

## 风险

- 如果路径校验不严，可能引入目录穿越风险
- 如果只有部分读取函数支持 `path`，会出现 logo / meta / docs 不一致
- 迁移目录后若 `list.json` 漏填 `path`，页面会直接读不到内容

## 范围

本次纳入：

- `path` 字段支持
- 读取逻辑统一收口
- `zzci-*` 目录迁移
- 构建验证

本次不纳入：

- slug 改成多级路径
- 其它工具目录重组
