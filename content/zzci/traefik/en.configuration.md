---
title:
  en: Configuration
  zh: 配置
order: 2
---

## Configuration

Most deployments will configure this image in three layers:

1. Environment variables in `.env`
2. Static Traefik entrypoints and providers
3. Dynamic routing and middleware rules for your services

## What To Configure

- Public ports such as `80` and `443`
- Domain names and TLS settings
- Docker provider access or file-based dynamic config
- Plugin-specific options for middleware you want enabled at the edge

## Practical Advice

Keep plugin configuration versioned next to the rest of your infrastructure files so the proxy image, routing rules, and application services move together.
