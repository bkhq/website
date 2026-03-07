---
title:
  en: Configuration
  zh: 配置
order: 2
---

## Configuration

All configuration is done via environment variables. Create a `.env` file in the project root or set them in your shell environment.

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `API_PORT` | Server port | `3000` |
| `API_HOST` | Listen address | `0.0.0.0` |
| `DB_PATH` | SQLite database path | `data/db/bkd.db` |
| `MAX_CONCURRENT_EXECUTIONS` | Max parallel agent sessions | `5` |
| `LOG_LEVEL` | Log level (`trace` / `debug` / `info` / `warn` / `error`) | `info` |
| `ANTHROPIC_API_KEY` | Claude API key | — |
| `OPENAI_API_KEY` | OpenAI / Codex API key | — |
| `GOOGLE_API_KEY` | Gemini API key | — |

### Example `.env` File

```bash
# Server
API_PORT=3000
API_HOST=0.0.0.0

# Database
DB_PATH=data/db/bkd.db

# Agent limits
MAX_CONCURRENT_EXECUTIONS=5

# Logging
LOG_LEVEL=info

# API Keys (set the ones you need)
ANTHROPIC_API_KEY=sk-ant-xxxxx
OPENAI_API_KEY=sk-xxxxx
GOOGLE_API_KEY=AIzaxxxxx
```

### API Keys

You only need to configure the API key for the agent(s) you plan to use. BKD auto-detects which agents are installed at startup.

- **Claude Code** — Set `ANTHROPIC_API_KEY`, or authenticate via `claude` CLI beforehand
- **OpenAI Codex** — Set `OPENAI_API_KEY` or `CODEX_API_KEY`
- **Gemini CLI** — Set `GOOGLE_API_KEY` or `GEMINI_API_KEY`

### Concurrency

`MAX_CONCURRENT_EXECUTIONS` controls how many agent sessions can run in parallel. Each session spawns a child process, so this depends on your system's CPU and memory. The default of `5` works well for most machines. Increase it if you have a powerful multi-core setup; decrease it on memory-constrained environments.

### Logging

Set `LOG_LEVEL` to control verbosity:

- `trace` — Everything, including internal agent communication
- `debug` — Detailed operational information
- `info` — General operational events (default)
- `warn` — Warnings and potential issues
- `error` — Errors only
