---
title:
  en: Installation
  zh: 安装
order: 1
---

## 安装

这个仓库的推荐流程是下载 release、解压、复制环境变量模板，然后直接启动打包好的运行脚本。

```bash
# 1. 从仓库下载 release 压缩包
# 2. 解压
# 3. 准备环境变量
cp env.example .env

# 4. 启动打包好的栈
./aa run
```

## 开始前准备

先准备好要暴露的域名、证书以及后端服务。这类镜像最适合放在已有 Docker Compose 或容器化服务前面，统一处理入口流量。
