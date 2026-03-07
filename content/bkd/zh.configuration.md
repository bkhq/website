---
title:
  en: Configuration
  zh: 配置
order: 2
---

## 配置

所有配置通过环境变量完成。在项目根目录创建 `.env` 文件或在 Shell 环境中设置。

### 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `API_PORT` | 服务端口 | `3000` |
| `API_HOST` | 监听地址 | `0.0.0.0` |
| `DB_PATH` | SQLite 数据库路径 | `data/db/bkd.db` |
| `MAX_CONCURRENT_EXECUTIONS` | 最大并行代理会话数 | `5` |
| `LOG_LEVEL` | 日志级别（`trace` / `debug` / `info` / `warn` / `error`） | `info` |
| `ANTHROPIC_API_KEY` | Claude API 密钥 | — |
| `OPENAI_API_KEY` | OpenAI / Codex API 密钥 | — |
| `GOOGLE_API_KEY` | Gemini API 密钥 | — |

### `.env` 文件示例

```bash
# 服务器
API_PORT=3000
API_HOST=0.0.0.0

# 数据库
DB_PATH=data/db/bkd.db

# 代理限制
MAX_CONCURRENT_EXECUTIONS=5

# 日志
LOG_LEVEL=info

# API 密钥（设置你需要的即可）
ANTHROPIC_API_KEY=sk-ant-xxxxx
OPENAI_API_KEY=sk-xxxxx
GOOGLE_API_KEY=AIzaxxxxx
```

### API 密钥

你只需要配置你计划使用的代理的 API 密钥。BKD 启动时会自动检测已安装的代理。

- **Claude Code** — 设置 `ANTHROPIC_API_KEY`，或提前通过 `claude` CLI 完成认证
- **OpenAI Codex** — 设置 `OPENAI_API_KEY` 或 `CODEX_API_KEY`
- **Gemini CLI** — 设置 `GOOGLE_API_KEY` 或 `GEMINI_API_KEY`

### 并发控制

`MAX_CONCURRENT_EXECUTIONS` 控制可以同时运行的代理会话数量。每个会话会启动一个子进程，因此取决于系统的 CPU 和内存。默认值 `5` 适用于大多数机器。如果你有高性能的多核配置可以增加；在内存受限的环境中建议减少。

### 日志级别

设置 `LOG_LEVEL` 控制日志详细程度：

- `trace` — 全部信息，包括代理内部通信
- `debug` — 详细的运行信息
- `info` — 一般运行事件（默认）
- `warn` — 警告和潜在问题
- `error` — 仅错误
