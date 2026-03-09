# PLAN-008 拆分 tags 到独立 content/tags.json

- **status**: completed
- **createdAt**: 2026-03-09 21:04
- **approvedAt**: 2026-03-09 21:04
- **completedAt**: 2026-03-09 21:06
- **relatedTask**: FE-006

## 现状

当前 `content/list.json` 同时承担两种职责：

- 工具注册表：`featured` 与 `list[]`
- 站点级 tag 字典：`tags[]`

这会让文件在后续扩展 tag 元数据时不断膨胀，也不利于分别维护“工具索引”和“标签配置”。

## 调查上下文

前端绝大多数代码都通过 `getToolsJson()` 读取统一结构，再访问 `toolsData.tags`。

因此最小改法不是全站改成新接口，而是：

1. 新增 `content/tags.json`
2. `getToolsJson()` 内部同时读取 `list.json` 与 `tags.json`
3. 对调用方继续返回相同的 `toolsData.tags`

这样页面层几乎不用改，只需要同步更新模板与投稿说明文档。

## 方案

采用“物理拆分、逻辑兼容”的方案：

1. 新建 `content/tags.json`
2. 从 `content/list.json` 移除 `tags[]`
3. 在 `content.ts` 中分别读取两个文件并组装成现有 `ToolsJson`
4. 更新模板页与投稿页文档，说明 `tags.json` 与 `list.json` 的职责划分

## 风险

- 如果 `tags.json` 路径或格式写错，标签页生成会直接失败
- 如果只改数据文件、不改文档，后续投稿仍容易按旧结构操作

## 范围

本次纳入：

- `tags.json` 拆分
- 读取逻辑更新
- 模板与投稿文档同步
- 构建验证
