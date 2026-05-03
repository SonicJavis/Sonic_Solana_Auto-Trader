# Telegram Commands

## Phase 4 - Database + Persistent Audit Logs

### Informational commands (anyone)

- `/start`   - Introduction and system overview
- `/help`    - List all commands
- `/status`  - Full system status (version, mode, uptime, locks)
- `/safety`  - Safety posture overview
- `/version` - App and phase version info

### Admin-only control commands

- `/mode [MODE]` - View current mode (no arg) or change mode (arg, admin only)
- `/pause`       - Pause the system (sets PAUSED mode)
- `/kill`        - Activate kill switch (requires inline keyboard confirmation)
- `/audit`       - View and query persistent audit log (see sub-commands below)

### /audit sub-commands (Phase 4, admin-only)

| Command                      | Description                                    |
|------------------------------|------------------------------------------------|
| `/audit`                     | Show recent 10 events                          |
| `/audit recent`              | Show recent 10 events                          |
| `/audit page N`              | Page N of events (10 per page, max page 100)   |
| `/audit severity warn`       | Filter by severity (debug/info/warn/error/critical) |
| `/audit severity error`      | Filter by error severity                       |
| `/audit type SYSTEM_STARTUP` | Filter by event type                           |
| `/audit type MODE_TRANSITION_REJECTED` | Filter by event type               |
| `/audit source worker`       | Filter by source                               |
| `/audit source telegram`     | Filter by telegram source                      |
| `/audit stats`               | Aggregate statistics (totals, by type, by severity) |
| `/audit help`                | Show /audit help text                          |

### /audit example output

```
📋 Recent Audit Events

ℹ️ 2024-06-01 12:00:00 UTC (worker) [READ_ONLY]
  SYSTEM_STARTUP: Worker safe startup — Phase 4
ℹ️ 2024-06-01 12:00:01 UTC (worker) [READ_ONLY]
  DATABASE_INITIALIZED: SQLite audit database initialized successfully
⚠️ 2024-06-01 11:59:00 UTC (worker) [READ_ONLY]
  UNSAFE_FLAGS_DETECTED: Unsafe flags detected: ENABLE_LIVE_TRADING — all capabilities remain disabled

Showing 3 event(s)
```

### Notes

- No trading commands exist. Trading is disabled in Phase 4.
- `LIMITED_LIVE` and `FULL_AUTO` are locked and cannot be set.
- All admin commands require TELEGRAM_ADMIN_IDS to be configured.
- If no admin IDs are configured, all control commands are locked.
- All commands and callbacks are audit logged persistently to SQLite.
- **Audit output never exposes raw secrets, credentials, or connection strings.**
- `detailsJson` is never shown in Telegram output; only `safeSummary` or `message`.
- No Telegram command can unlock modes or trigger execution.

