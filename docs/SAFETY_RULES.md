# Safety Rules

## Phase 4 Safety Foundation

1. Default mode is `READ_ONLY`
2. No live trading in Phase 4 — all trading capabilities are permanently disabled
3. `FULL_AUTO` and `LIMITED_LIVE` are **locked** and cannot be activated (config-level and manager-level)
4. Kill switch halts all non-read operations
5. No wallet or private key loaded — not implemented in Phase 4
6. Admin allowlist enforced: empty `TELEGRAM_ADMIN_IDS` locks all control commands
7. `isAdmin` returns `false` when admin list is empty (fail-closed security)
8. All Telegram commands and callbacks are audit logged (now persistently to SQLite)
9. Kill switch requires two-step confirmation via inline keyboard
10. Transaction signing and sending are not implemented
11. Unsafe capability flags (e.g. `ENABLE_LIVE_TRADING`) default to `false` — even if set to `true`, they do **not** activate any unsafe functionality in Phase 4
12. Fail-closed: unsafe flags are detected, warned about, and capabilities remain disabled
13. `RuntimeSafetyStatus` provides a single source of truth for all safety invariants
14. Worker performs a safety check on startup and exits if any invariant is violated
15. Config validation fails closed: invalid config applies safe defaults (READ_ONLY, all unsafe flags false)
16. Secrets are never logged — redaction is applied at every boundary (log output, config summary, audit records, Telegram output)
17. **Phase 4**: SQLite audit DB init failure causes worker to exit (fail-closed)
18. **Phase 4**: `DATABASE_URL` and `TELEGRAM_BOT_TOKEN` raw values are never persisted or displayed
19. **Phase 4**: `details` and `safeSummary` are redacted before persistence — no raw secrets stored
20. **Phase 4**: Retention never deletes the DB file; it only removes old/excess rows
21. **Phase 4**: No Solana RPC, Jito, Pump.fun, signing, sending, wallet loading — not in scope

## Phase 5 Additional Safety Rules

22. **Phase 5**: State/read-model snapshots are read-only — no snapshot mutates any system state
23. **Phase 5**: No raw DATABASE_URL, TELEGRAM_BOT_TOKEN, or credential-like values in any snapshot
24. **Phase 5**: No raw detailsJson exposed by read models or Telegram `/system` output
25. **Phase 5**: No Solana RPC, market data, wallets, signing, sending, Jito, Pump.fun, or execution code added
26. **Phase 5**: `packages/state` does not depend on apps/telegram-bot or apps/worker (no circular imports)
27. **Phase 5**: `/system` and all subcommands are read-only — no mode mutation, no execution trigger
28. **Phase 5**: Readiness calculation is conservative — defaults to `unsafe` on any invariant failure
29. **Phase 5**: FULL_AUTO and LIMITED_LIVE remain locked
