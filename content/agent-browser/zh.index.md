---
title:
  en: Introduction
  zh: 简介
order: 0
---

## 概述

`agent-browser` 是一个面向代理工作流的浏览器自动化 CLI。它特别适合这样的场景：浏览器已经在运行，你需要一个工具来读取页面快照、定位元素并对这个真实会话执行操作。

## 和 [[zzci-chrome|zzci/chrome]] 配合

一种很干净的用法是把 Chrome 运行在 [[zzci-chrome|zzci/chrome]] 里，再让 `agent-browser` 通过 CDP 接入。

```bash
docker run --rm -d   --name zzci-chrome   -p 8080:80   -p 9222:9222   zzci/chrome

agent-browser connect 9222
agent-browser snapshot
agent-browser click @e2
agent-browser screenshot current-page.png
```

这种模式既能保留可见浏览器界面，也能给代理提供稳定的自动化入口。
