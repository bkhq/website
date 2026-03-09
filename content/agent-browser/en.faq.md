---
title:
  en: FAQ
  zh: 常见问题
order: 4
---

## FAQ

### When should I use `connect` mode?

Use `connect` when you already have a browser running and you want the agent to work against that exact session.

### Does [[zzci-chrome|zzci/chrome]] make sense as the companion browser?

Yes. It exposes a visible browser UI on port `80` and a DevTools endpoint on port `9222`, which makes it a convenient companion for `agent-browser`.

### Can I mix manual browsing and automation?

Yes. That is one of the main reasons to separate the browser from the automation CLI. You can inspect the live session while the agent continues driving it.
