---
title:
  en: Installation
  zh: 安装
order: 1
---

## 安装

下载适合你平台的启动器。启动器是一个小型二进制文件（约 90 MB），会自动下载和管理应用更新（每次约 1 MB）。启动器跨版本保持不变，只有轻量级的应用包会被更新。

### 下载

| 平台 | 架构 | 下载 |
|------|------|------|
| Linux | x64 | [bkd-launcher-linux-x64](https://github.com/bkhq/bkd/releases/download/launcher-v1/bkd-launcher-linux-x64) |
| Linux | arm64 | [bkd-launcher-linux-arm64](https://github.com/bkhq/bkd/releases/download/launcher-v1/bkd-launcher-linux-arm64) |
| macOS | Apple Silicon (arm64) | [bkd-launcher-darwin-arm64](https://github.com/bkhq/bkd/releases/download/launcher-v1/bkd-launcher-darwin-arm64) |

[校验和](https://github.com/bkhq/bkd/releases/download/launcher-v1/checksums.txt) — 下载后验证文件完整性。

下载启动器，赋予可执行权限（`chmod +x`），然后运行。启动后打开 http://localhost:3000。

## 系统要求

BKD 以子进程方式启动 AI 编程代理，使用前请至少安装其中一个：

### Claude Code（推荐）

```bash
npm install -g @anthropic-ai/claude-code
```

需要在环境变量中设置 `ANTHROPIC_API_KEY`，或通过 `claude` CLI 完成认证。

### OpenAI Codex

```bash
npm install -g @openai/codex
```

需要 `OPENAI_API_KEY` 或 `CODEX_API_KEY`。

### Gemini CLI

```bash
npm install -g @google/gemini-cli
```

需要 `GOOGLE_API_KEY` 或 `GEMINI_API_KEY`。

> BKD 启动时会自动检测已安装的代理，可以任意组合使用。

## 使用方法

1. **创建项目** — 设置项目名称和工作目录（代理将在该仓库中工作）
2. **创建 Issue** — 描述任务内容，选择 AI 引擎和模型
3. **执行** — 点击执行，代理在你的工作目录中启动并开始工作
4. **对话** — 随时发送追加消息、上传文件或取消执行
5. **审查** — 查看 Diff、检查代理的工具调用记录，拖拽 Issue 到完成
