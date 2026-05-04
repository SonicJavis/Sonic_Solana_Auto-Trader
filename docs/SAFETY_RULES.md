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

## Phase 6B Additional Safety Rules

38. **Phase 6B**: `PumpInstructionIntent` is a local planning model only — no real Solana instruction, no AccountMeta, no binary instruction data
39. **Phase 6B**: `PumpTransactionPlan` is a local placeholder only — no blockhash, no fee payer, no signatures, no transaction bytes, no RPC required
40. **Phase 6B**: `PumpInstructionBuilderRequest.allowExecutableInstructions` must always be `false` — enforced at type level and at runtime
41. **Phase 6B**: All `PumpInstructionIntent` instances carry `executionForbidden: true` and `isExecutable: false`
42. **Phase 6B**: All `PumpTransactionPlan` instances carry `requiresWallet: false`, `requiresSignature: false`, `requiresRpc: false`
43. **Phase 6B**: `PHASE_6B_BUILDER_CAPABILITIES` — all 12 prohibited capability flags permanently `false` (canBuildExecutableInstructions, canSimulateTransactions, canReturnAccountMetas, canReturnBinaryInstructionData, plus Phase 6A flags)
44. **Phase 6B**: No new Solana SDK imports. No Pump SDK runtime dependency added. No wallet/keypair handling.
45. **Phase 6B**: FULL_AUTO and LIMITED_LIVE remain locked. No new Telegram trade/quote commands.

## Phase 6C Additional Safety Rules

46. **Phase 6C**: `DisabledPumpSdkWrapper` is a disabled boundary only — no real Pump SDK runtime, no Solana SDK, no live RPC, no instruction building, no account metas, no binary data, no wallet access, no signing, no sending, no execution
47. **Phase 6C**: All `PumpSdkWrapperCapabilities` flags are permanently `false` — including `hasPumpSdkRuntime` and `hasSolanaSdkRuntime`
48. **Phase 6C**: All `PumpSdkWrapperConfig` live/executable permission fields are permanently `false`
49. **Phase 6C**: `createPumpSdkWrapper` factory always returns a disabled wrapper — unsafe enable/live attempts are coerced to disabled (fail-closed)
50. **Phase 6C**: Optional live methods (`getLiveQuote`, `getLiveBondingCurveState`, `buildRealInstruction`) always return safe forbidden result objects
51. **Phase 6C**: All wrapper error results carry `safeToDisplay: true` — no raw secrets, no stack traces, no RPC URLs, no credentials
52. **Phase 6C**: No real Pump SDK dependency installed. No `@solana/web3.js`. No wallet libraries. No RPC provider SDKs.
53. **Phase 6C**: FULL_AUTO and LIMITED_LIVE remain locked. No new Telegram trade/quote commands.

## Phase 7A Additional Safety Rules

54. **Phase 7A**: `packages/event-engine` is local-only infrastructure — no network calls, no Solana RPC, no Helius, no WebSocket, no Yellowstone, no Geyser, no live providers of any kind
55. **Phase 7A**: All `EventSourceCapabilities` flags are permanently `false`: `canUseNetwork: false`, `canUseSolanaRpc: false`, `canEmitLiveEvents: false`, `canTriggerExecution: false`, `canAccessWallets: false`
56. **Phase 7A**: `buildEventEngineSystemStatus()` reports `liveProviders: 'disabled'`, `networkEvents: 'forbidden'`, `executionTriggers: 'forbidden'`, `solanaRpc: 'forbidden'`
57. **Phase 7A**: `InMemoryEventBus` cannot trigger execution — it dispatches events to registered handlers only; handlers run in-process with no side effects outside what they explicitly code
58. **Phase 7A**: Handler failures are caught and isolated — one failing handler does not crash the bus or other handlers
59. **Phase 7A**: `EventPayload` validation rejects functions, class instances (including `Error`), circular references, and Symbols — plain serializable objects only
60. **Phase 7A**: All `EventEngineError` results carry `safeToDisplay: true` — no raw secrets, no stack traces, no RPC URLs, no private keys
61. **Phase 7A**: `future_chain` and `future_market` event categories are model-only placeholders — they must not trigger any provider, RPC, or network logic
62. **Phase 7A**: `future_provider_disabled` source type is a model-only placeholder — it implies no live capability
63. **Phase 7A**: No new Telegram trade/event-stream commands added
64. **Phase 7A**: FULL_AUTO and LIMITED_LIVE remain locked. `RuntimeSafetyStatus` still returns all unsafe capability flags as `false`.


30. **Phase 6A**: `packages/pump-adapter` is inert — no Solana RPC, no network calls, no transaction building, no signing, no sending, no execution
31. **Phase 6A**: All pump adapter capability flags (`canSignTransactions`, `canSendTransactions`, `canExecuteTrades`, `canAccessPrivateKeys`, `canUseLiveRpc`, `canUseJito`, `canBuildTransactions`, `canBuildInstructions`) are permanently `false`
32. **Phase 6A**: `PumpAdapterStatusReport.isLiveCapable` is always `false`; `executionForbidden` is always `true`
33. **Phase 6A**: Quote results always carry `isMockResult: true` — they do not represent executed trades
34. **Phase 6A**: Bonding curve state always carries `isMockState: true` — not fetched from chain
35. **Phase 6A**: All error results carry `safeToDisplay: true` — never contain raw secrets or stack traces
36. **Phase 6A**: No Pump.fun buying/selling. No PumpSwap buying/selling. No Jito. No wallet access.
37. **Phase 6A**: FULL_AUTO and LIMITED_LIVE remain locked. No new Telegram trade/quote commands.
