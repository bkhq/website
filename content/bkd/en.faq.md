---
title:
  en: FAQ
  zh: 常见问题
order: 4
---

## Frequently Asked Questions

### Which AI agent should I use?

**Claude Code** is recommended for most tasks. It has the strongest code understanding and generation capabilities. OpenAI Codex and Gemini CLI are good alternatives if you already have API keys for those providers. You can install multiple agents and choose per-issue.

### Can I use multiple agents at the same time?

Yes. BKD supports running multiple agent sessions in parallel, controlled by the `MAX_CONCURRENT_EXECUTIONS` setting (default: 5). Each session gets its own isolated git worktree, so agents won't interfere with each other.

### Do I need to pay for API access?

Yes. BKD itself is free and open-source, but the AI agents require API keys from their respective providers (Anthropic, OpenAI, or Google). You'll be billed by the provider based on your usage.

### Does BKD send my code to external servers?

BKD runs entirely on your local machine. The only external communication is between the AI agents and their API providers (e.g., Claude Code sends prompts to Anthropic's API). Your code and project data never leave your machine through BKD itself.

### How do I update BKD?

The launcher handles updates automatically. When a new version is available, the launcher downloads the update package to `data/updates/` and extracts it to `data/app/`. Simply restart BKD to get the latest version.

### Can I change the port?

Yes. Set the `API_PORT` environment variable or add it to your `.env` file:

```bash
API_PORT=8080
```

### What happens if an agent execution fails?

The issue stays in its current column. You can view the agent's output and error messages in the chat panel. Common causes include:

- Missing or invalid API key
- Network connectivity issues
- Agent not installed (`npm install -g` required)
- Insufficient API quota or rate limiting

You can retry execution or send follow-up messages to guide the agent.

### Can I edit files while an agent is working?

It's not recommended. Each agent works in its own git worktree, but if you modify files in the same branch, you may encounter merge conflicts. Wait for the agent to finish, review the diff, and then make your own changes.

### How do I clean up old worktrees?

Worktrees from completed sessions can be safely removed:

```bash
rm -rf worktrees/
```

BKD will recreate worktrees as needed. See the [[bkd/data|Data & Storage]] page for more cleanup options.

### Does BKD work behind a proxy?

BKD itself doesn't need internet access. However, the AI agents need to reach their API endpoints. Configure your proxy via standard environment variables:

```bash
HTTPS_PROXY=http://proxy.example.com:8080
HTTP_PROXY=http://proxy.example.com:8080
```

### Can I use BKD with private/self-hosted models?

BKD currently supports Claude Code, OpenAI Codex, and Gemini CLI as execution engines. If your self-hosted model is compatible with one of these CLI tools (e.g., via a custom API base URL), it may work. Check the respective agent's documentation for custom endpoint configuration.

### Is there a maximum issue/project limit?

No hard limit. BKD uses SQLite which can handle millions of records. Practical limits depend on your disk space and memory. For very large projects with thousands of sessions, you may want to periodically clean up old session data.
