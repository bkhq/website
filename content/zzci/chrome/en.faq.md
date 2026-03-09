---
title:
  en: FAQ
  zh: 常见问题
order: 4
---

## FAQ

### Can I automate it with [[agent-browser]]?

Yes. That is one of the most useful pairings. The container exposes port `9222`, and [[agent-browser]] can attach to the running session over CDP.

### Why not launch a browser directly inside the automation tool?

Running the browser as a separate container makes it easier to inspect, share, restart, or place behind infrastructure controls.

### Is this only for AI agents?

No. Any CDP-capable workflow can benefit from it. The agent pairing is just a convenient example.
