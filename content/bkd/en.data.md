---
title:
  en: Data & Storage
  zh: 数据说明
order: 3
---

## Data Storage

BKD uses SQLite as its database. All data is stored locally on your machine — nothing is sent to external servers (except the API calls to the AI providers you configure).

### Database Location

By default, the database is stored at `data/db/bkd.db` relative to the BKD working directory. You can change this path via the `DB_PATH` environment variable.

```bash
# Default location
data/db/bkd.db

# Custom location
DB_PATH=/path/to/your/database.db
```

### What Gets Stored

| Data | Description |
|------|-------------|
| Projects | Project name, workspace directory path |
| Issues | Title, description, status, assigned agent/model |
| Sessions | Chat history, agent output, tool call logs |
| File diffs | Changes made by agents during execution |
| Uploaded files | Files attached to issues as agent context |

### Directory Structure

BKD's data directory is organized as follows:

```
data/
├── app/                 # Running application version
│   └── ...              # Current app bundle files
├── updates/             # Upgrade packages
│   └── ...              # Downloaded update archives
├── db/
│   └── bkd.db           # SQLite database (projects, issues, sessions)
└── uploads/             # Uploaded file attachments
```

**`data/app/`** — Contains the currently running application version. The launcher extracts the app bundle here. When BKD starts, it loads and serves the application from this directory. You should not manually modify files in this directory — they will be overwritten on the next update.

**`data/updates/`** — Stores downloaded upgrade packages. When a new version is available, the launcher downloads the update archive here before extracting it to `data/app/`. Old update packages may accumulate over time and can be safely deleted to free disk space.

**`data/db/`** — Holds the SQLite database file. All persistent state — projects, issues, sessions, chat history, and agent output — lives in `bkd.db`.

**`data/uploads/`** — Stores files uploaded through the UI and attached to issues. These files are passed as context to the agent when executing tasks.

### Worktrees Directory

At the root level (outside `data/`), BKD creates a `worktrees/` directory for managing git worktrees:

```
worktrees/
└── <project-id>/
    └── <issue-id>/      # Isolated git worktree for agent execution
```

**`worktrees/`** — Each issue execution gets its own isolated git worktree, organized by project ID and issue ID. This allows multiple agents to work on different issues of the same repository simultaneously without interfering with each other. Worktrees are created when an agent starts executing and are linked to the project's workspace repository.

Key points about worktrees:

- Each worktree is an independent working copy of the repository with its own branch
- Agents make changes in their worktree, keeping the main repository clean
- You can review diffs in the UI before merging changes back
- Worktrees are keyed by project ID and issue ID to avoid conflicts
- Stale worktrees from completed or cancelled issues can be cleaned up safely

## Data Cleanup

### Delete a Single Project

Delete a project from the UI by clicking the project settings and choosing "Delete Project". This removes the project, all its issues, and associated session data from the database. It does **not** delete any files the agents created in your workspace directory or worktrees.

### Reset All Data

To completely reset BKD and start fresh, stop the server and delete the data directory and worktrees:

```bash
# Stop BKD first, then:
rm -rf data/
rm -rf worktrees/
```

This removes the database, uploaded files, and all worktrees. On the next start, BKD will create a fresh database.

### Delete Session History Only

If you want to keep your projects and issues but clear all chat history and agent output:

```bash
# Using sqlite3 CLI
sqlite3 data/db/bkd.db "DELETE FROM sessions; DELETE FROM messages; VACUUM;"
```

### Clean Up Worktrees

To remove worktrees from completed or old sessions:

```bash
# Remove all worktrees (stop BKD first)
rm -rf worktrees/

# Remove a specific project's worktrees
rm -rf worktrees/<project-id>/
```

BKD will recreate worktrees as needed when agents execute.

### Clean Up Old Update Packages

Downloaded update packages in `data/updates/` can be safely removed:

```bash
rm -rf data/updates/*
```

The launcher will re-download updates if needed.

### Database Backup

Since BKD uses a single SQLite file, backup is straightforward:

```bash
# Simple file copy (stop BKD first for consistency)
cp data/db/bkd.db data/db/bkd-backup-$(date +%Y%m%d).db

# Or use sqlite3 backup command (safe while running)
sqlite3 data/db/bkd.db ".backup data/db/bkd-backup.db"
```

### Disk Usage

The database grows as you create more sessions. Agent output (especially verbose tool call logs) can accumulate. Worktrees also consume disk space proportional to your repository size. Monitor disk usage with:

```bash
# Database size
ls -lh data/db/bkd.db

# Worktrees size
du -sh worktrees/

# Update packages size
du -sh data/updates/
```

To reclaim space after deleting old data:

```bash
sqlite3 data/db/bkd.db "VACUUM;"
```
