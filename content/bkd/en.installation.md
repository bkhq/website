---
title:
  en: Installation
  zh: 安装
order: 1
---

## Installation

Download the launcher binary for your platform. The launcher is a small binary (~90 MB) that automatically downloads and manages app updates (~1 MB each). The launcher stays fixed across versions — only the lightweight app package gets updated.

### Download

| Platform | Architecture | Download |
|----------|-------------|----------|
| Linux | x64 | [bkd-launcher-linux-x64](https://github.com/bkhq/bkd/releases/download/launcher-v1/bkd-launcher-linux-x64) |
| Linux | arm64 | [bkd-launcher-linux-arm64](https://github.com/bkhq/bkd/releases/download/launcher-v1/bkd-launcher-linux-arm64) |
| macOS | Apple Silicon (arm64) | [bkd-launcher-darwin-arm64](https://github.com/bkhq/bkd/releases/download/launcher-v1/bkd-launcher-darwin-arm64) |

[Checksums](https://github.com/bkhq/bkd/releases/download/launcher-v1/checksums.txt) — Verify file integrity after download.

Download the launcher, make it executable (`chmod +x`), and run it. Open http://localhost:3000 after starting.

## System Requirements

BKD spawns AI coding agents as child processes. Install at least one before using:

### Claude Code (Recommended)

```bash
npm install -g @anthropic-ai/claude-code
```

Requires `ANTHROPIC_API_KEY` in your environment or configured via `claude` CLI.

### OpenAI Codex

```bash
npm install -g @openai/codex
```

Requires `OPENAI_API_KEY` or `CODEX_API_KEY`.

### Gemini CLI

```bash
npm install -g @google/gemini-cli
```

Requires `GOOGLE_API_KEY` or `GEMINI_API_KEY`.

> BKD auto-detects which agents are installed at startup. You can use any combination.

## Usage

1. **Create a project** — Give it a name and set the workspace directory (the repo the agents will work in)
2. **Create an issue** — Describe the task, pick an AI engine and model
3. **Execute** — Click execute; the agent spawns in your workspace and starts working
4. **Chat** — Send follow-up messages, upload files, or cancel at any time
5. **Review** — View diffs, check the agent's tool calls, drag the issue to Done
