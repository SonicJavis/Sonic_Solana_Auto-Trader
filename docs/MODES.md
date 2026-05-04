# App Modes

- `READ_ONLY`: Default. Only read operations allowed.
- `PAPER`: Simulated trading, no real execution.
- `MANUAL_CONFIRM`: Each trade requires explicit confirmation.
- `LIMITED_LIVE`: **Locked in Phase 4.** Cannot be activated.
- `FULL_AUTO`: **Locked in Phase 4.** Cannot be activated.
- `PAUSED`: System paused, no operations.
- `KILL_SWITCH`: Emergency stop, all non-read ops blocked.

## Phase 4 Allowed Modes

`READ_ONLY`, `PAPER`, `MANUAL_CONFIRM`, `PAUSED`, `KILL_SWITCH`

## Locked Modes (Phase 4)

`LIMITED_LIVE`, `FULL_AUTO` — locked at both the config schema level and the ModeManager level.
Setting `FULL_AUTO_UNLOCKED=true` or `LIMITED_LIVE_UNLOCKED=true` in env does **not** unlock these modes.
Mode transitions (accepted and rejected) are now persisted to the SQLite audit database.

## Phase 5 Mode Reporting

Phase 5 adds read-only mode status reporting via packages/state:
- buildModeStateSnapshot() returns a ModeStateSnapshot with current mode, allowed safe modes, locked modes, and mode safety status
- Mode safety status: safe (current mode is a safe mode), locked (kill switch active), unsafe (otherwise)
- /system safety Telegram command displays locked modes and runtime safety booleans

## Locked Modes (Phase 6A)

LIMITED_LIVE, FULL_AUTO — remain locked. No Phase 6A code unlocks these modes.
The pump adapter is inert — it cannot trigger mode changes or execute trades.
