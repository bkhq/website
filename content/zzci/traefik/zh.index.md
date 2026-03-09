---
title:
  en: Introduction
  zh: 简介
order: 0
---

## 概述

`zzci/traefik` 把 Traefik 打包成一个开箱即用的 Docker 镜像，并内置所需插件。它适合想把入口代理标准化的团队，在自托管环境中不必每次部署都重新构建 Traefik。

## 适合的场景

- 为多套服务统一处理 HTTP / HTTPS 入口流量
- 提前把 Traefik 插件烘焙进镜像，减少运行时准备工作
- 在本地实验环境、VPS 和内部平台复用同一套入口层镜像

## 典型用法

如果你希望用一个容器镜像同时处理 ingress、路由和插件中间件，这类镜像很合适。
