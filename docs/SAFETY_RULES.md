# Safety Rules

## Phase 3 Safety Foundation

1. Default mode is `READ_ONLY`
2. No live trading in Phase 3 — all trading capabilities are permanently disabled
3. `FULL_AUTO` and `LIMITED_LIVE` are **locked** and cannot be activated (config-level and manager-level)
4. Kill switch halts all non-read operations
5. No wallet or private key loaded — not implemented in Phase 3
6. Admin allowlist enforced: empty `TELEGRAM_ADMIN_IDS` locks all control commands
7. `isAdmin` returns `false` when admin list is empty (fail-closed security)
8. All Telegram commands and callbacks are audit logged
9. Kill switch requires two-step confirmation via inline keyboard
10. Transaction signing and sending are not implemented
11. Unsafe capability flags (e.g. `ENABLE_LIVE_TRADING`) default to `false` — even if set to `true`, they do **not** activate any unsafe functionality in Phase 3
12. Fail-closed: unsafe flags are detected, warned about, and capabilities remain disabled
13. `RuntimeSafetyStatus` provides a single source of truth for all safety invariants
14. Worker performs a safety check on startup and exits if any invariant is violated
15. Config validation fails closed: invalid config applies safe defaults (READ_ONLY, all unsafe flags false)
16. Secrets are never logged — redaction is applied at every boundary (log output, config summary, audit records)
