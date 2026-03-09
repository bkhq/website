# bkio - Task List

> Updated: 2026-03-09

## Usage

Each task is a single line linking to its detail file. All detailed information lives in `docs/task/PREFIX-NNN.md`.

### Format

- [ ] [**PREFIX-001 Short imperative title**](PREFIX-001.md) `P1`

### Status Markers

| Marker | Meaning |
|--------|---------|
| `[ ]`  | Pending |
| `[-]`  | In progress |
| `[x]`  | Completed |
| `[~]`  | Closed / Won't do |

### Priority: P0 (blocking) > P1 (high) > P2 (medium) > P3 (low)

### Rules

- Only update the checkbox marker; never delete the line.
- New tasks append to the end.
- See each `PREFIX-NNN.md` for full details.

---

## Tasks
- [x] [**REPO-001 Rename workspace and reinitialize git**](REPO-001.md) `P1`
- [x] [**REPO-002 Move API build output out of src and ignore artifacts**](REPO-002.md) `P1`
- [x] [**FE-001 迁移前端到 Astro + Content Collections**](FE-001.md) `P1`
- [x] [**FE-002 调整默认语言无前缀路由并保留保留路径命名空间**](FE-002.md) `P1`
- [x] [**FE-003 删除 category 数据与路由并统一使用 tags 分类**](FE-003.md) `P1`
- [x] [**FE-004 删除 demo tool 内容与目录**](FE-004.md) `P1`
- [x] [**FE-005 为工具内容目录增加 path 映射并支持嵌套目录**](FE-005.md) `P1`
- [x] [**FE-006 拆分 tags 到独立 content/tags.json**](FE-006.md) `P1`
