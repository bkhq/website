---
title:
  en: Data & Storage
  zh: 数据说明
order: 3
---

## 数据存储

BKD 使用 SQLite 作为数据库。所有数据都存储在本地机器上——不会发送到外部服务器（除了你配置的 AI 提供商的 API 调用）。

### 数据库位置

默认情况下，数据库存储在 BKD 工作目录的 `data/db/bkd.db`。你可以通过 `DB_PATH` 环境变量修改路径。

```bash
# 默认位置
data/db/bkd.db

# 自定义位置
DB_PATH=/path/to/your/database.db
```

### 存储内容

| 数据 | 说明 |
|------|------|
| 项目 | 项目名称、工作目录路径 |
| Issue | 标题、描述、状态、分配的代理/模型 |
| 会话 | 聊天历史、代理输出、工具调用日志 |
| 文件 Diff | 代理执行期间所做的更改 |
| 上传文件 | 附加到 Issue 作为代理上下文的文件 |

### 目录结构

BKD 的数据目录组织如下：

```
data/
├── app/                 # 当前运行的应用版本
│   └── ...              # 应用包文件
├── updates/             # 升级包
│   └── ...              # 下载的更新存档
├── db/
│   └── bkd.db           # SQLite 数据库（项目、Issue、会话）
└── uploads/             # 上传的文件附件
```

**`data/app/`** — 包含当前运行的应用版本。启动器将应用包解压到此目录。BKD 启动时从该目录加载并运行应用。不要手动修改此目录中的文件——下次更新时会被覆盖。

**`data/updates/`** — 存储下载的升级包。当有新版本可用时，启动器会将更新存档下载到此目录，然后解压到 `data/app/`。旧的升级包可能会逐渐积累，可以安全删除以释放磁盘空间。

**`data/db/`** — 存放 SQLite 数据库文件。所有持久化状态——项目、Issue、会话、聊天历史和代理输出——都保存在 `bkd.db` 中。

**`data/uploads/`** — 存储通过 UI 上传并附加到 Issue 的文件。执行任务时，这些文件会作为上下文传递给代理。

### 工作树目录

在根目录（`data/` 之外），BKD 会创建 `worktrees/` 目录用于管理 git 工作树：

```
worktrees/
└── <project-id>/
    └── <issue-id>/      # 代理执行的隔离 git 工作树
```

**`worktrees/`** — 每个 Issue 执行都会获得独立的 git 工作树，按项目 ID 和 Issue ID 组织。这允许多个代理同时在同一仓库的不同 Issue 上工作，互不干扰。工作树在代理开始执行时创建，并与项目的工作目录仓库关联。

工作树要点：

- 每个工作树都是仓库的独立工作副本，拥有自己的分支
- 代理在工作树中进行修改，保持主仓库整洁
- 你可以在 UI 中审查 diff，然后再合并更改
- 工作树以项目 ID 和 Issue ID 为键，避免冲突
- 已完成或已取消 Issue 的工作树可以安全清理

## 数据清理

### 删除单个项目

在 UI 中点击项目设置，选择「删除项目」。这会从数据库中删除项目、所有 Issue 及关联的会话数据。**不会**删除代理在工作目录或工作树中创建的文件。

### 重置所有数据

要完全重置 BKD 并重新开始，停止服务器后删除数据目录和工作树：

```bash
# 先停止 BKD，然后：
rm -rf data/
rm -rf worktrees/
```

这会删除数据库、上传的文件和所有工作树。下次启动时，BKD 会创建全新的数据库。

### 仅删除会话历史

如果你想保留项目和 Issue，但清除所有聊天记录和代理输出：

```bash
# 使用 sqlite3 CLI
sqlite3 data/db/bkd.db "DELETE FROM sessions; DELETE FROM messages; VACUUM;"
```

### 清理工作树

删除已完成或旧 Issue 的工作树：

```bash
# 删除所有工作树（先停止 BKD）
rm -rf worktrees/

# 删除特定项目的工作树
rm -rf worktrees/<project-id>/
```

代理执行时 BKD 会根据需要重新创建工作树。

### 清理旧升级包

`data/updates/` 中下载的升级包可以安全删除：

```bash
rm -rf data/updates/*
```

启动器会在需要时重新下载更新。

### 数据库备份

由于 BKD 使用单个 SQLite 文件，备份非常简单：

```bash
# 简单文件复制（建议先停止 BKD 以确保一致性）
cp data/db/bkd.db data/db/bkd-backup-$(date +%Y%m%d).db

# 或使用 sqlite3 备份命令（运行中也安全）
sqlite3 data/db/bkd.db ".backup data/db/bkd-backup.db"
```

### 磁盘占用

数据库会随着会话增多而增长。代理输出（尤其是详细的工具调用日志）会逐渐积累。工作树的磁盘占用与仓库大小成正比。监控磁盘使用：

```bash
# 数据库大小
ls -lh data/db/bkd.db

# 工作树大小
du -sh worktrees/

# 升级包大小
du -sh data/updates/
```

删除旧数据后回收空间：

```bash
sqlite3 data/db/bkd.db "VACUUM;"
```
