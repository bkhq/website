---
title:
  en: Introduction
  zh: 简介
order: 0
---

## Overview

`agent-browser` is a browser automation CLI designed for agent-style workflows. It is most useful when the browser is already running and you want a tool to inspect the page, capture a snapshot, and execute actions against that live session.

## Pairing with [[zzci-chrome|zzci/chrome]]

A clean setup is to keep Chrome inside [[zzci-chrome|zzci/chrome]] and let `agent-browser` attach to it over CDP.

```bash
docker run --rm -d   --name zzci-chrome   -p 8080:80   -p 9222:9222   zzci/chrome

agent-browser connect 9222
agent-browser snapshot
agent-browser click @e2
agent-browser screenshot current-page.png
```

This pattern keeps the browser visible while the agent still gets a stable automation interface.
