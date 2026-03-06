# REPO-001 Rename workspace and reinitialize git

## Summary

按用户要求完成以下改动：
- 删除当前仓库 Git 历史并重新初始化
- 项目名修改为 `bitk-web`
- Cloudflare Workers 名称修改为 `bk-io`

## Status

- status: completed
- owner: codex
- priority: P1

## Scope

- 根工作区名称与脚本引用
- 子包 package 名称与内部依赖引用
- Cloudflare Workers 配置名称
- 最小文档同步
- `.git` 删除并重新 `git init`

## Notes

- Git 重置是用户显式要求的破坏性操作。
