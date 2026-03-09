---
title:
  en: Configuration
  zh: 配置
order: 2
---

## 配置

如果你把工作模式固定下来，`agent-browser` 的行为会更稳定。通常有两种模式：

- **连接模式**：附着到一个已经运行中的浏览器会话
- **启动模式**：让工具自己启动或管理浏览器

## 配合 [[zzci-chrome|zzci/chrome]] 的 CDP 模式

当 [[zzci-chrome|zzci/chrome]] 已经运行时，可以直接连到它的 DevTools 端点：

```bash
agent-browser connect 9222
agent-browser snapshot
```

如果你倾向一次一条命令，也可以让命令通过 CDP 参数指向同一个会话，这样它会复用现成浏览器，而不是重新启动一个新的实例。
