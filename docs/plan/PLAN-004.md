# PLAN-004 调整默认语言无前缀路由并整理保留路径命名空间

- **status**: completed
- **createdAt**: 2026-03-09 14:10
- **approvedAt**: 2026-03-09 18:05
- **completedAt**: 2026-03-09 18:20
- **relatedTask**: FE-002

## 现状

当前前端路由是“所有语言都必须带前缀”的结构：

- 首页同时存在 `/` 与 `/[locale]/`
- 工具详情、标签页、分类页、系统页都在 `apps/frontend/src/pages/[locale]/...`
- `Header`、`Footer`、`LocaleSwitcher`、Markdown 内链重写都默认把站内链接写成 `/${locale}/...`
- `Base.astro` 的 canonical、alternate、x-default 也基于带前缀路径生成
- API 由 Worker 保留在 `/api/*`

当前实现的直接结果：

- 默认英文虽然有根首页 `/`，但其它英文内容页仍只能通过 `/en/*` 访问
- `/tag/*` 当前使用单数命名，与目标的 `/tags/*` 不一致
- 系统页当前位于 `/${locale}/privacy`、`/${locale}/terms`、`/${locale}/submit`，尚未归入 `/sys/*`
- 相关工具目前仅以内联卡片展示，没有独立的 `/link/*` 命名空间

## 调查上下文

这次变更会同时影响以下链路：

- 页面生成：`src/pages/[locale]/index.astro`、`[...slug].astro`、`tag/[tag].astro`、`category/[category].astro`、`privacy.astro`、`terms.astro`、`submit.astro`
- 链接生成：`src/lib/content.ts`
- 布局与 SEO：`src/layouts/Base.astro`
- 客户端语言切换：`src/components/LocaleSwitcher.tsx`
- 公共导航：`src/components/Header.tsx`、`Footer.tsx`
- 旧路径兼容：`apps/api/src/app.ts`

因此这是一个跨模块的非平凡改动，不适合只在根路由做前端跳转兜底。

## 方案

推荐采用“英文为默认无前缀主路由，中文保留 `/zh` 前缀，旧 `/en/*` 统一兼容跳转”的方案。

目标 URL 结构：

- 首页
  - 英文：`/`
  - 中文：`/zh/`
- 工具页
  - 英文：`/:tool`
  - 中文：`/zh/:tool`
- 工具子文档
  - 英文：`/:tool/:doc`
  - 中文：`/zh/:tool/:doc`
- 标签页
  - 英文：`/tags/:tag`
  - 中文：`/zh/tags/:tag`
- 分类页
  - 英文：`/category/:category`
  - 中文：`/zh/category/:category`
- 系统页
  - 英文：`/sys/privacy` `/sys/terms` `/sys/submit`
  - 中文：`/zh/sys/privacy` `/zh/sys/terms` `/zh/sys/submit`
- 关系页命名空间
  - 预留：`/link/*` 与 `/zh/link/*`
- API
  - 保持：`/api/*`

实施要点：

1. 为默认语言新增根级页面路由，不再让英文内容依赖 `/en/*`
2. 将当前 `[locale]` 页面收敛为“仅中文”或“显式语言前缀页面”，避免生成重复英文 canonical
3. 抽出统一的路由辅助方法，集中生成：
   - 默认语言路径
   - 非默认语言路径
   - 语言切换目标路径
   - canonical / alternate / x-default
4. 将 Markdown 内链本地化逻辑改为：
   - 英文链接默认无前缀
   - 中文链接加 `/zh`
   - `/api`、静态资源和保留系统路径按规则跳过或按语言前缀生成
5. 在 Worker 中兼容旧 `/en/*`，将其重定向到新的无前缀英文路径

## 风险

- 根级新增 `/:tool`、`/:tool/:doc` 后，必须避免与 `/api`、`/zh`、`/sys`、`/tags`、`/category`、`/link` 等保留前缀冲突
- 如果只改页面目录、不改 SEO 元数据，会产生英文页面双地址收录问题
- 如果不处理 `/en/*` 兼容，现有外链与搜索索引会直接失效
- `link` 命名空间目前只有语义方向，没有现成数据模型；本次若强行实现详情页，容易引入半成品路由

## 范围

本次建议纳入：

- 默认语言无前缀路由
- 中文保留 `/zh` 前缀
- `/sys` `/tags` `/category` 命名调整
- 旧 `/en/*` 兼容策略
- 站内链接、语言切换与 SEO 修正

本次不建议纳入：

- 新的 `/link/*` 页面实体与信息架构实现
- 内容文件命名从 `en.xxx.md` / `zh.xxx.md` 改成目录式存储

`/link/*` 更适合在确认“是按工具聚合、按双向关系对、还是按关系类型”之后单独做一轮。

## 备选方案

### 方案 A：仅保留现有 `/en/*` `/zh/*`，根路径做语言检测跳转

优点：

- 代码改动最小

缺点：

- 默认语言仍然不是主路由
- 英文路径冗余
- 与你提出的 `/bkd`、`/zh/bkd` 目标不一致

### 方案 B：增加根级 catch-all，把无前缀请求跳到 `/en/*` 或 `/zh/*`

优点：

- 改动较少

缺点：

- 实际 canonical 仍在带前缀路由
- 站内链接和内容模型继续围绕语言前缀设计
- 后续若再改成英文无前缀，还要做第二次迁移

### 方案 C：英文无前缀为主路由，中文保留 `/zh`，旧 `/en/*` 做兼容跳转

优点：

- URL 结构最干净
- SEO 语义清晰
- 与当前内容文件回退机制兼容

缺点：

- 需要同步调整页面生成、链接工具、SEO 和 Worker 兼容逻辑

推荐采用方案 C。
