# App Modes

- `READ_ONLY`: Default. Only read operations allowed.
- `PAPER`: Simulated trading, no real execution.
- `MANUAL_CONFIRM`: Each trade requires explicit confirmation.
- `LIMITED_LIVE`: **Locked in Phase 2.** Cannot be activated.
- `FULL_AUTO`: **Locked in Phase 2.** Cannot be activated.
- `PAUSED`: System paused, no operations.
- `KILL_SWITCH`: Emergency stop, all non-read ops blocked.

## Phase 2 Allowed Modes

`READ_ONLY`, `PAPER`, `MANUAL_CONFIRM`, `PAUSED`, `KILL_SWITCH`

## Locked Modes (Phase 2)

`LIMITED_LIVE`, `FULL_AUTO`

