# PLAN-005 删除 category 并统一使用 tags 分类

- **status**: completed
- **createdAt**: 2026-03-09 20:23
- **approvedAt**: 2026-03-09 20:23
- **completedAt**: 2026-03-09 20:27
- **relatedTask**: FE-003

## 现状

当前站点同时维护两套分类语义：

- `content/list.json` 中存在 `categories[]`
- `content/list.json` 中每个工具条目存在 `category`
- 首页目录页同时渲染 category filters 与 tags filters
- 详情页与关联卡片使用 category badge
- 静态路由单独生成 `/category/*` 页面

这导致分类语义重复，且与“只保留 tags 做分类”的目标不一致。

## 调查上下文

本次变更会影响：

- 数据与类型：`content/list.json`、`apps/frontend/src/lib/content.ts`
- 目录页：`apps/frontend/src/components/ToolDirectoryPage.astro`、`apps/frontend/src/components/ToolSearch.tsx`
- 详情页：`apps/frontend/src/components/ToolDetailPage.astro`
- 路由：`apps/frontend/src/pages/category/[category].astro`、`apps/frontend/src/pages/[locale]/category/[category].astro`
- 路由保留字与模板示例：`apps/frontend/src/lib/routes.ts`、`apps/frontend/src/pages/template.astro`

这是一个跨模块改动，需要同步清理类型、页面和数据。

## 方案

采用“彻底删除 category，只保留 tags”的方案：

1. 删除 `content/list.json` 中的 `categories[]`
2. 删除 `content/list.json` 中每个工具条目的 `category`
3. 将原分类 key 直接加入对应工具的 `tags[]`
4. 首页只保留 tag 过滤，不再渲染 category tabs
5. 详情页与关联卡片移除 category badge
6. 删除 `/category/*` 页面生成和路由保留字

## 风险

- 首页目录页的交互会从“双维度过滤”变成“单维度 tag 过滤”
- 若页面仍残留 `category` 类型引用，构建会直接失败
- 旧 `/category/*` 链接会失效，但这次按要求不做兼容

## 范围

本次纳入：

- 数据结构清理
- category UI 清理
- category 页面删除
- 构建验证

本次不纳入：

- 旧 `/category/*` 重定向兼容
- tags 重新命名或重新分组
