# Safety Rules

1. Default mode is `READ_ONLY`
2. No live trading in Phase 2
3. `FULL_AUTO` and `LIMITED_LIVE` are locked and cannot be activated
4. Kill switch halts all non-read operations
5. No wallet or private key loaded in Phase 2
6. Admin allowlist enforced: empty `TELEGRAM_ADMIN_IDS` locks all control commands
7. `isAdmin` returns `false` when admin list is empty (fail-closed security)
8. All Telegram commands and callbacks are audit logged
9. Kill switch requires two-step confirmation via inline keyboard
10. Transaction signing and sending are not implemented

