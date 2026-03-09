---
title:
  en: Introduction
  zh: 简介
order: 0
---

## Overview

`zzci/chrome` is a lightweight browser container for remote browsing and automation. It gives you a visible browser session on port `80` and a Chrome DevTools Protocol endpoint on port `9222`.

## Pairing with [[agent-browser]]

A practical workflow is to run [[zzci-chrome|zzci/chrome]] as the browser container and let [[agent-browser]] connect to the live Chrome session over CDP.

```bash
docker run --rm -d   --name zzci-chrome   -p 8080:80   -p 9222:9222   zzci/chrome

agent-browser connect 9222
agent-browser snapshot
agent-browser click @e2
agent-browser screenshot checkout.png
```

This gives you a real browser UI in one place and automation control in another.
