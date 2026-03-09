---
title:
  en: Introduction
  zh: 简介
order: 0
---

## Overview

`zzci/traefik` packages Traefik as a ready-to-run Docker image with built-in plugins. It is aimed at teams that want a reusable edge proxy image for self-hosted services without rebuilding Traefik on every deployment.

## What It Is Good At

- Terminating HTTP and HTTPS traffic for multiple services
- Shipping a pre-baked Traefik image with plugins already included
- Reusing the same image in local labs, VPS deployments, and small internal platforms

## Typical Use Case

Use it when you want one container image to handle ingress, routing, and plugin-based middleware for a Docker stack.
