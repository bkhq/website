---
title:
  en: Installation
  zh: 安装
order: 1
---

## 安装

先启动容器，并把浏览器界面和 DevTools 端点都映射出来。

```bash
docker run --rm -d   --name zzci-chrome   -p 8080:80   -p 9222:9222   zzci/chrome
```

然后在浏览器中打开 `http://127.0.0.1:8080` 查看这次会话。

## 和 [[agent-browser]] 配合的使用案例

最实用的模式是让浏览器界面保持可见，同时让代理通过 CDP 连到同一个会话：

```bash
agent-browser connect 9222
agent-browser snapshot
agent-browser fill @search "site:example.com"
agent-browser screenshot search-results.png
```

这个组合很适合演示、调试，以及那些需要偶尔人工查看页面状态的自动化流程。
