# REPO-002 Move API build output out of src and ignore artifacts

## Summary

修正 API TypeScript 编译产物写回源码目录的问题，并过滤构建输出。

## Status

- status: completed
- owner: codex
- priority: P1

## Scope

- 调整 `apps/api` TypeScript 输出目录
- 过滤 `apps/api/dist`
- 删除已提交的 API 生成文件
- 保持当前 Worker 源码入口不变
