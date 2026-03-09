---
title:
  en: FAQ
  zh: 常见问题
order: 4
---

## FAQ

### Is this only for Docker?

It is most naturally used in Docker-based environments because the project ships a Docker image, but the routing ideas are the same as any Traefik deployment.

### Why use a custom image instead of upstream Traefik?

A custom image is useful when you want plugin support and repeatable deployment defaults already baked into the image.

### Where should I keep my routing rules?

Keep them with the rest of your infrastructure configuration so proxy changes are reviewed together with service changes.
