---
title:
  en: Introduction
  zh: 简介
order: 0
---

## 概述

`zzci/chrome` 是一个适合远程浏览和自动化的轻量浏览器容器。它在 `80` 端口提供可见的浏览器界面，在 `9222` 端口暴露 Chrome DevTools Protocol 端点。

## 和 [[agent-browser]] 配合

一个很实用的工作流是把 [[zzci-chrome|zzci/chrome]] 作为浏览器容器运行，再让 [[agent-browser]] 通过 CDP 接入这次真实的 Chrome 会话。

```bash
docker run --rm -d   --name zzci-chrome   -p 8080:80   -p 9222:9222   zzci/chrome

agent-browser connect 9222
agent-browser snapshot
agent-browser click @e2
agent-browser screenshot checkout.png
```

这样你既能看到真实浏览器界面，也能让自动化命令直接驱动这次会话。
