---
title:
  en: Configuration
  zh: 配置
order: 2
---

## Configuration

The two most important interfaces are:

- Port `80` for the remote browser UI
- Port `9222` for CDP clients such as [[agent-browser]]

## Common Deployment Choices

- Bind ports to localhost if the browser should stay private
- Put the UI behind a reverse proxy if teammates need shared access
- Mount persistent storage only when you want browser state to survive container restarts
- Pass proxy environment variables if the browser needs outbound network access through a proxy

## CDP Connection Modes

For long-lived sessions, use `agent-browser connect 9222`. For one-shot commands, point the CLI at the same endpoint with its CDP flag so each command attaches to the running browser.
