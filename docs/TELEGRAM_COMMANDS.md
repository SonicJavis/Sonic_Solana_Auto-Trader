# Telegram Commands

## Phase 2 - Telegram Control Layer Hardening

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
- `/audit`       - View recent audit log events (last 10)

### Notes

- No trading commands exist. Trading is disabled in Phase 2.
- `LIMITED_LIVE` and `FULL_AUTO` are locked and cannot be set.
- All admin commands require TELEGRAM_ADMIN_IDS to be configured.
- If no admin IDs are configured, all control commands are locked.
- All commands and callbacks are audit logged.

