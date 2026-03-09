---
title:
  en: Configuration
  zh: 配置
order: 2
---

## Configuration

`agent-browser` becomes more predictable when you choose one of two modes and keep it consistent:

- **Connect mode**: attach to an already-running browser session
- **Launch mode**: let the tool start or manage the browser for you

## CDP Mode with [[zzci-chrome|zzci/chrome]]

When you already have [[zzci-chrome|zzci/chrome]] running, connect to its DevTools endpoint directly:

```bash
agent-browser connect 9222
agent-browser snapshot
```

For one-shot operations, point the command at the same session with its CDP option so the command runs against the existing browser instead of launching a fresh one.
