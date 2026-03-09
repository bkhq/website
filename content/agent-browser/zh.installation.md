---
title:
  en: Installation
  zh: 安装
order: 1
---

## 安装

按照仓库 README 的方式把 `agent-browser` 命令准备到当前环境中。下面的示例默认你已经可以直接在 Shell 里运行 `agent-browser`。

## 和 [[zzci-chrome|zzci/chrome]] 配合的专门案例

如果你想给本地代理工作流准备一个现成的浏览器容器，可以先启动 [[zzci-chrome|zzci/chrome]]，再让 `agent-browser` 接入它暴露出来的 DevTools 端口：

```bash
docker run --rm -d   --name zzci-chrome   -p 8080:80   -p 9222:9222   zzci/chrome

agent-browser connect 9222
agent-browser snapshot
agent-browser click @e2
agent-browser fill @search "browser automation"
agent-browser screenshot browser-search.png
```

这样你会得到一个运行在 `80` 端口上的可见浏览器，以及一个在 `9222` 端口上的自动化入口。
