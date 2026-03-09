---
title:
  en: Data & Storage
  zh: 数据说明
order: 3
---

## Data & Storage

Traefik itself is mostly configuration-driven. The data you usually care about is not application data but operational state.

## What To Preserve

- Static and dynamic configuration files
- ACME certificate storage if you issue certificates automatically
- Access logs and request logs if you need audit trails

## Backup Strategy

Back up the configuration and certificate state together. If you rebuild the container without preserving certificate storage, the proxy may need to request certificates again.
