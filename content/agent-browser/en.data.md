---
title:
  en: Data & Storage
  zh: 数据说明
order: 3
---

## Data & Storage

`agent-browser` itself is usually a thin control layer. The durable state tends to live in the browser session it connects to rather than in the CLI process.

## What Matters In Practice

- Browser cookies and local storage live with the connected browser profile
- Screenshots and exported files live wherever you tell the CLI to write them
- Session continuity depends on whether the backing browser is ephemeral or persistent

## With [[zzci-chrome|zzci/chrome]]

If [[zzci-chrome|zzci/chrome]] is disposable, treat each automation run as a fresh session. If you mount persistent browser storage there, `agent-browser` will reconnect to a session with longer-lived state.
