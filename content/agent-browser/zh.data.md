---
title:
  en: Data & Storage
  zh: 数据说明
order: 3
---

## 数据说明

`agent-browser` 本身通常只是一个薄控制层。真正持续存在的状态，往往保存在它连接的浏览器会话里，而不是 CLI 进程里。

## 实际上要关注什么

- Cookie 和 local storage 取决于浏览器 profile
- 截图和导出文件保存在你指定的输出路径里
- 会话是否连续，取决于底层浏览器是一次性的还是持久化的

## 配合 [[zzci-chrome|zzci/chrome]]

如果 [[zzci-chrome|zzci/chrome]] 是一次性容器，就把每次自动化当成全新会话；如果那边挂了持久化存储，`agent-browser` 再次连接时就能接着使用更长生命周期的浏览器状态。
