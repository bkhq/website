# PLAN-003 迁移前端到 Astro + Content Collections

- **status**: completed
- **createdAt**: 2026-03-07 08:30
- **approvedAt**: 2026-03-07 09:00
- **relatedTask**: FE-001

## 现状

当前前端是 Vite + React 19 SPA，所有工具数据硬编码在 TSX 组件中：

- `apps/frontend/src/pages/HomePage.tsx` — 工具列表数据（toolCards 数组）
- `apps/frontend/src/pages/ToolDetailPage.tsx` — 工具详情数据（toolDetails 对象）
- `apps/frontend/src/i18n/` — 轻量 React Context i18n 系统
- `apps/frontend/src/hooks/use-theme.ts` — 主题切换 hook
- `apps/frontend/src/components/ui/` — shadcn Base UI 组件（badge, button, card, dropdown-menu, input, separator）
- `apps/frontend/src/components/Layout.tsx` — 布局组件（header + footer）

部署方式：Cloudflare Worker 处理 API 路由 + Workers Static Assets 托管 SPA。

**问题：** 添加新工具需要修改 TSX 代码，无法通过 Markdown 管理内容，不利于内容驱动的网站维护。

## 方案

### 架构变更

```
apps/frontend/          → Astro 项目（替换 Vite + React SPA）
├── astro.config.mjs    → Astro 配置（React + Tailwind + Cloudflare adapter）
├── src/
│   ├── content/
│   │   └── config.ts           → Content Collections schema 定义
content/                        → 根目录，方便编辑（Astro 引用）
├── tools.json                  → 全局列表（排序、分类、推荐）
└── tools/
    ├── image-compressor/
    │   ├── meta.json               → 工具元信息
    │   ├── index.md                → 简介
    │   ├── usage.md                → 使用指南
    │   └── configuration.md
    └── json-formatter/
        ├── meta.json
        ├── index.md
        └── usage.md
│   ├── layouts/
│   │   └── Base.astro          → 基础 HTML 布局（替换 index.html）
│   ├── pages/
│   │   ├── index.astro         → 首页
│   │   └── tools/
│   │       └── [...slug].astro → 工具详情/文档页（动态路由）
│   ├── components/
│   │   ├── ui/                 → shadcn 组件（保留，改为 .tsx 供 islands 使用）
│   │   ├── Header.astro        → 静态 header
│   │   ├── Footer.astro        → 静态 footer
│   │   ├── ToolSearch.tsx      → React island（搜索+筛选）
│   │   ├── ThemeToggle.tsx     → React island（主题切换）
│   │   └── LocaleSwitcher.tsx  → React island（语言切换）
│   ├── i18n/                   → i18n 工具函数（非 React Context）
│   └── styles/
│       └── global.css          → 现有 index.css
```

### 实施步骤

#### 阶段 1：Astro 项目初始化

1. 在 `apps/frontend/` 安装 Astro 及相关依赖：
   - `astro`, `@astrojs/react`, `@astrojs/tailwind`, `@astrojs/cloudflare`
   - 保留现有 React、Tailwind、shadcn 依赖
2. 创建 `astro.config.mjs` 配置：
   - output: `hybrid`（静态为主，按需 SSR）
   - integrations: react(), tailwind()
   - adapter: cloudflare()
3. 移除 Vite 相关配置（`vite.config.ts`、`@hono/vite-dev-server`、`@vitejs/plugin-react`）
4. 更新 `tsconfig.json` 为 Astro 配置
5. 创建 `Base.astro` 布局（迁移 `index.html` 的 head 内容 + 主题/语言初始化脚本）

#### 阶段 2：Content Collections 定义

1. 创建 `src/content/config.ts`：

```typescript
import { defineCollection } from 'astro:content'
import { glob, file } from 'astro/loaders'
import { z } from 'astro/zod'

const i18nText = z.object({ en: z.string(), zh: z.string() })

// 全局工具列表
const toolList = defineCollection({
  loader: file('src/content/tools.json'),
  schema: z.object({
    slug: z.string(),
    category: z.string(),
    order: z.number(),
    featured: z.boolean().optional(),
  }),
})

// 工具元信息（每个工具目录下的 meta.json）
const toolMeta = defineCollection({
  loader: glob({ pattern: '**/meta.json', base: './src/data/tools' }),
  schema: z.object({
    title: i18nText,
    description: i18nText,
    badge: z.string(),
    icon: z.string(),
    version: z.string().optional(),
    website: z.string().url().optional(),
    github: z.string().url().optional(),
    downloads: z.array(z.object({
      name: z.string(),
      icon: z.string(),
      file: z.string(),
      url: z.string(),
    })).optional(),
  }),
})

// 工具文档（每个工具目录下的 .md 文件）
const toolDocs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/data/tools' }),
  schema: z.object({
    title: i18nText,
    order: z.number().default(99),
  }),
})

export const collections = { toolList, toolMeta, toolDocs }
```

2. 创建 `src/content/tools.json`：

```json
{
  "categories": [
    { "key": "images", "en": "Images", "zh": "图片" },
    { "key": "textCode", "en": "Text & Code", "zh": "文本 & 代码" },
    { "key": "colors", "en": "Colors", "zh": "颜色" },
    { "key": "converters", "en": "Converters", "zh": "转换器" }
  ],
  "list": [
    { "slug": "image-compressor", "category": "images", "order": 1, "featured": true },
    { "slug": "json-formatter", "category": "textCode", "order": 2, "featured": true }
  ]
}
```

3. 迁移现有硬编码数据到 `src/data/tools/` 目录结构

#### 阶段 3：i18n 改造

1. 将 React Context i18n 改为纯函数工具：
   - `src/i18n/translations.ts` — 静态翻译（UI 文案）
   - `src/i18n/utils.ts` — `t()` 函数、`getLocale()` 从 cookie/header 读取
2. Astro 组件直接调用 `t()` 函数（无需 React Context）
3. React Islands 通过 props 接收 locale 和翻译

#### 阶段 4：页面迁移

1. **首页 `index.astro`**：
   - 从 `toolList` + `toolMeta` collections 读取数据
   - 静态渲染 hero、分类、工具卡片列表
   - `<ToolSearch client:load>` 处理客户端搜索/筛选

2. **工具详情页 `tools/[...slug].astro`**：
   - `getStaticPaths()` 从 `toolDocs` 生成所有路径
   - 路由：`/tools/image-compressor` → index.md，`/tools/image-compressor/usage` → usage.md
   - 侧边栏从同一工具目录下的 docs 自动生成
   - Markdown 内容由 Astro 渲染（零 JS）

3. **Layout 拆分**：
   - `Header.astro` — 静态 logo + 导航
   - `<ThemeToggle client:load />` — React island
   - `<LocaleSwitcher client:load />` — React island
   - `Footer.astro` — 静态 footer

#### 阶段 5：构建与部署

1. 更新 `package.json` scripts：
   - `dev`: `astro dev`
   - `build`: `astro build`
   - `preview`: `astro preview`
2. 更新 `wrangler.toml`：
   - assets directory 改为 Astro 输出目录
   - 或改用 Cloudflare Pages（推荐，与 Astro adapter 更匹配）
3. 更新根 `package.json` 的 build 脚本
4. 验证 Hono API 路由仍正常（保持 `/api/*` 在 Worker 中）

### 文件变更清单

| 操作 | 文件 |
|------|------|
| 新增 | `astro.config.mjs` |
| 新增 | `src/content/config.ts` |
| 新增 | `src/content/tools.json` |
| 新增 | `src/data/tools/*/meta.json` |
| 新增 | `src/data/tools/*/*.md` |
| 新增 | `src/layouts/Base.astro` |
| 新增 | `src/pages/index.astro` |
| 新增 | `src/pages/tools/[...slug].astro` |
| 新增 | `src/components/Header.astro` |
| 新增 | `src/components/Footer.astro` |
| 新增 | `src/components/ToolSearch.tsx` |
| 新增 | `src/components/ThemeToggle.tsx` |
| 新增 | `src/components/LocaleSwitcher.tsx` |
| 改造 | `src/i18n/` — React Context → 纯函数 |
| 改造 | `src/styles/global.css` — 从 index.css 迁移 |
| 保留 | `src/components/ui/*` — shadcn 组件不变 |
| 保留 | `src/hooks/use-theme.ts` |
| 删除 | `vite.config.ts` |
| 删除 | `src/main.tsx` |
| 删除 | `src/pages/HomePage.tsx`（数据迁移到 collections） |
| 删除 | `src/pages/ToolDetailPage.tsx`（数据迁移到 collections） |
| 删除 | `index.html`（替换为 Base.astro） |
| 更新 | `package.json` — 依赖和脚本 |
| 更新 | `tsconfig.json` |

## 风险

1. **Astro + Base UI 兼容性**：shadcn 的 Base UI 版本是为 React SPA 设计的，在 Astro Islands 中可能有 hydration 问题。需验证 dropdown-menu 等复杂组件的行为。
   - 缓解：先做 POC 测试 dropdown-menu 在 `client:load` 下的表现
2. **Hono API 共存**：当前 Hono 处理 API + SPA 回退。迁移到 Astro 后，需要决定 API 路由是走 Astro 的 API routes 还是保持独立 Hono Worker。
   - 建议：保持 Hono 独立处理 `/api/*`，Astro 只管前端页面
3. **Content Collections loader 限制**：`glob` loader 对 JSON 文件的支持需要验证 — meta.json 是否能正确关联到对应的 markdown docs。
   - 缓解：可能需要自定义 loader 或使用 `file` loader + 目录遍历
4. **构建时间**：从 Vite SPA（单 bundle）到 Astro 静态生成（多页），构建策略不同。
5. **开发体验**：Astro dev server 与 Hono dev server 需要分别运行或通过 proxy 集成。

## 工作量

- **阶段 1**（项目初始化）：~2h — 配置文件、依赖安装、tsconfig
- **阶段 2**（Content Collections）：~3h — schema 定义、数据迁移、loader 验证
- **阶段 3**（i18n 改造）：~1h — Context → 纯函数
- **阶段 4**（页面迁移）：~4h — 首页、详情页、Layout 拆分、React Islands
- **阶段 5**（构建部署）：~2h — wrangler 配置、CI 更新、验证

总计约 12h 工作量，跨 ~20 个文件。

## 备选方案

### 方案 B：保持 Vite + React，添加 Markdown 管道

- 用 `vite-plugin-content` 或自定义 Vite plugin 在构建时读取 markdown
- 保持 SPA 架构
- **优点**：改动最小，不需要框架迁移
- **缺点**：没有静态生成的 SEO 优势，自建 markdown 管道维护成本高，缺少 Content Collections 的类型安全

### 方案 C：Astro Starlight

- 使用 Astro 的 Starlight 主题（专为文档站点设计）
- **优点**：开箱即用的文档功能（搜索、侧边栏、版本管理）
- **缺点**：首页设计受限于 Starlight 模板，自定义程度不如纯 Astro

**推荐方案 A**（纯 Astro + Content Collections），因为它在内容管理灵活性和自定义 UI 之间取得了最好的平衡。

## 批注

- **2026-03-07 09:00 用户**：content 放根目录方便编辑。已批准实施。
