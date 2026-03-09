---
title:
  en: Installation
  zh: 安装
order: 1
---

## Installation

The repository workflow is built around downloading a release, unpacking it, copying the sample environment file, and starting the stack.

```bash
# 1. Download a release bundle from the repository
# 2. Extract it
# 3. Prepare environment variables
cp env.example .env

# 4. Start the packaged stack
./aa run
```

## Before You Start

Prepare the domains, certificates, and upstream services you want Traefik to expose. This image is most useful when it sits in front of an existing Docker Compose or container-based deployment.
