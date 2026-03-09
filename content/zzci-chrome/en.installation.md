---
title:
  en: Installation
  zh: 安装
order: 1
---

## Installation

Start the container and publish the browser UI plus the DevTools endpoint.

```bash
docker run --rm -d   --name zzci-chrome   -p 8080:80   -p 9222:9222   zzci/chrome
```

Then open `http://127.0.0.1:8080` in your browser to view the session.

## Use Case with [[agent-browser]]

The most useful pattern is to keep the browser visible while an agent connects to the same session over CDP:

```bash
agent-browser connect 9222
agent-browser snapshot
agent-browser fill @search "site:example.com"
agent-browser screenshot search-results.png
```

That setup is useful for demos, debugging, and repeatable browser tasks that still need occasional manual inspection.
