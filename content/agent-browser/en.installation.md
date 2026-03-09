---
title:
  en: Installation
  zh: 安装
order: 1
---

## Installation

Follow the repository README to make the `agent-browser` CLI available in your shell. The examples below assume the `agent-browser` command is already on your `PATH`.

## Dedicated Use Case with [[zzci-chrome|zzci/chrome]]

If you want a ready browser container for local agent workflows, start [[zzci-chrome|zzci/chrome]] first and then attach `agent-browser` to the exposed DevTools port:

```bash
docker run --rm -d   --name zzci-chrome   -p 8080:80   -p 9222:9222   zzci/chrome

agent-browser connect 9222
agent-browser snapshot
agent-browser click @e2
agent-browser fill @search "browser automation"
agent-browser screenshot browser-search.png
```

That gives you a visible browser on port `80` and an automation endpoint on port `9222`.
