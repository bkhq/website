---
title:
  en: Data & Storage
  zh: 数据说明
order: 3
---

## Data & Storage

By default, browser containers are best treated as disposable. If you remove the container, the session state usually disappears with it.

## What You May Want To Persist

- Browser profile state for repeat visits
- Downloaded files from automation runs
- Screenshots and exported artifacts captured by connected tools

## Practical Rule

Leave the container ephemeral for clean test runs. Add a mounted volume only when your workflow needs persistent browser state between sessions.
