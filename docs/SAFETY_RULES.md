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

## Phase 7B Additional Safety Rules

64. **Phase 7B**: All `EventProviderCapabilities` flags are permanently `false` — including `hasRuntimeDependency`, `canUseNetwork`, `canUseSolanaRpc`, `canUseWebSocket`, `canUseYellowstone`, `canUseGeyser`, `canPoll`, `canStream`, `canEmitLiveEvents`, `canTriggerExecution`, `canAccessWallets`, `canAccessPrivateKeys`
65. **Phase 7B**: All `EventProviderConfig` permission fields are permanently `false` — `enabled`, `allowNetwork`, `allowSolanaRpc`, `allowWebSocket`, `allowLiveEvents`, `allowPolling`, `allowStreaming`, `allowExecutionTriggers`
66. **Phase 7B**: `DisabledEventProvider` never connects, polls, streams, or emits live events — all lifecycle methods return safe disabled/forbidden result objects
67. **Phase 7B**: `createDisabledEventProvider` factory always returns a disabled provider — unsafe enable/live/network attempts are coerced to disabled (fail-closed)
68. **Phase 7B**: All `ProviderError` results carry `safeToDisplay: true` — no raw secrets, no stack traces, no RPC URLs, no API keys, no credentials
69. **Phase 7B**: No Helius SDK installed. No WebSocket client installed. No Yellowstone or Geyser packages installed. No `@solana/web3.js`. No wallet libraries.
70. **Phase 7B**: `EventProviderRegistry` contains only disabled providers — no provider is started, connected, or given live capability
71. **Phase 7B**: Provider type names all end with `_disabled` — no provider type implies live or network capability
72. **Phase 7B**: FULL_AUTO and LIMITED_LIVE remain locked. No new Telegram event-stream or trade commands.
64. **Phase 7A**: FULL_AUTO and LIMITED_LIVE remain locked. `RuntimeSafetyStatus` still returns all unsafe capability flags as `false`.

## Phase 7B/7C Additional Safety Rules

65. **Phase 7B**: All 6 disabled provider boundaries (helius_disabled, websocket_disabled, etc.) cannot connect — `connect()` and `disconnect()` always return `LIVE_PROVIDER_FORBIDDEN` errors
66. **Phase 7B**: `PHASE_7B_PROVIDER_CAPABILITIES` has all 12 capability flags as `false` — including `canReplayFixtureEvents: false` for disabled providers
67. **Phase 7B**: `buildDisabledProviderRegistry()` returns a read-only registry of inert provider boundaries — no connections possible
68. **Phase 7C**: `ControlledMockProvider` can ONLY replay synthetic fixture events locally — `canReplayFixtureEvents: true` is its only capability; all other 11 flags are `false`
69. **Phase 7C**: Fixture events must have `mock: true`, `replay: true`, `live: false` — any attempt to replay a live event is rejected with `LIVE_EVENT_FORBIDDEN`
70. **Phase 7C**: Fixture event payloads must not contain secrets, private keys, RPC URLs, API keys, wallet data, or non-serializable values
71. **Phase 7C**: `offsetMs` is bounded to [0, 600,000] ms — no unbounded delays allowed
72. **Phase 7C**: Sequence length is bounded to 1,000 events — no unbounded sequences
73. **Phase 7C**: All Phase 7C error codes have `safeToDisplay: true` — no stack traces, no secrets, no credentials
74. **Phase 7C**: `mock_provider` source type is safe — it implies no live network capability, only local fixture replay
75. **Phase 7C**: No Helius, WebSocket, Yellowstone, Geyser, QuickNode, Triton, or Alchemy integration added
76. **Phase 7C**: No market data ingestion, no live chain events, no transaction construction, no signing, no sending
77. **Phase 7C**: FULL_AUTO and LIMITED_LIVE remain locked.


30. **Phase 6A**: `packages/pump-adapter` is inert — no Solana RPC, no network calls, no transaction building, no signing, no sending, no execution
31. **Phase 6A**: All pump adapter capability flags (`canSignTransactions`, `canSendTransactions`, `canExecuteTrades`, `canAccessPrivateKeys`, `canUseLiveRpc`, `canUseJito`, `canBuildTransactions`, `canBuildInstructions`) are permanently `false`
32. **Phase 6A**: `PumpAdapterStatusReport.isLiveCapable` is always `false`; `executionForbidden` is always `true`
33. **Phase 6A**: Quote results always carry `isMockResult: true` — they do not represent executed trades
34. **Phase 6A**: Bonding curve state always carries `isMockState: true` — not fetched from chain
35. **Phase 6A**: All error results carry `safeToDisplay: true` — never contain raw secrets or stack traces
36. **Phase 6A**: No Pump.fun buying/selling. No PumpSwap buying/selling. No Jito. No wallet access.
37. **Phase 6A**: FULL_AUTO and LIMITED_LIVE remain locked. No new Telegram trade/quote commands.


## Phase 7D Additional Safety Rules

78. **Phase 7D**: `validateProviderConfig()` is fail-closed — any unsafe flag (enabled, allowNetwork, allowSolanaRpc, allowWebSocket, allowPolling, allowStreaming, allowLiveEvents, allowApiKeyUsage) set to `true` is captured in `unsafeReasons` and `unsafeRequested=true`; the output config always has all permissions `false`
79. **Phase 7D**: Raw endpoint URLs and API key values are never stored in `ProviderConfigSafe` — only boolean presence (`endpointConfigured`, `apiKeyConfigured`) is surfaced
80. **Phase 7D**: `ProviderReadinessEntry.canConnect`, `canEmitLiveEvents`, and `canTriggerExecution` are always `false` — no readiness state implies live or network readiness
81. **Phase 7D**: Unsafe provider config attempts result in `unsafe_requested` readiness — visible in the report and via `assertAllProvidersSafe()`
82. **Phase 7D**: `buildProviderReadinessReport()` notes are safe to display — no raw URLs, API keys, secrets, or stack traces
83. **Phase 7D**: `enabledProviderCount`, `liveProviderCount`, and `networkProviderCount` must all be 0 for a safe Phase 7D report
84. **Phase 7D**: `PHASE_7D_READINESS_SUMMARY` reports all providers as disabled and all live/network/execution/wallet/API-key access as forbidden
85. **Phase 7D**: No Helius, WebSocket, Yellowstone, Geyser, or any other provider SDK is loaded or connected
86. **Phase 7D**: No market data ingestion, no live chain events, no transaction construction, no signing, no sending, no execution
87. **Phase 7D**: FULL_AUTO and LIMITED_LIVE remain locked. No new Telegram event-stream or trade commands.


## Phase 7E Additional Safety Rules

88. **Phase 7E**: `EventEngineReadinessSnapshot.liveProviders`, `networkAccess`, `solanaRpc`, `executionTriggers`, `walletAccess`, and `apiKeyUsage` fields are always `'forbidden'` — no snapshot value implies live or execution readiness
89. **Phase 7E**: `ProviderReadinessSummary` never contains raw provider URLs, API key values, endpoint configurations, or credential data — only safe counts and state strings
90. **Phase 7E**: `buildPhase8ReadinessGate()` returns `readyForTokenIntelligence: true` only when all safety conditions hold (all live/network/enabled/unsafe counts are 0, FULL_AUTO and LIMITED_LIVE locked)
91. **Phase 7E**: Phase 8 readiness means readiness to build Token Intelligence models locally only — it does NOT imply live data ingestion, market data access, wallet access, signing, sending, or execution
92. **Phase 7E**: Telegram `/system engine` and `/system phase8` commands never display raw URLs, API keys, secrets, or detailsJson — all output is safe to display
93. **Phase 7E**: No new live providers, provider SDK imports, RPC clients, WebSocket clients, or network calls are introduced
94. **Phase 7E**: `@sonic/event-engine` remains a dependency-free local package — `@sonic/state` imports from it but no reverse dependency exists
95. **Phase 7E**: FULL_AUTO and LIMITED_LIVE remain locked.

## Phase 8 Additional Safety Rules

96. **Phase 8**: `packages/token-intelligence` has no dependencies on Solana SDK, Pump SDK, Helius SDK, WebSocket clients, Yellowstone/Geyser packages, wallet libraries, RPC providers, or any app packages
97. **Phase 8**: All `TokenIntelligenceCapabilities` unsafe fields are permanently `false`: `canUseLiveData`, `canUseSolanaRpc`, `canUseProviderApis`, `canTrade`, `canCreateTradeIntents`, `canExecute`
98. **Phase 8**: `TokenIntelligenceResult.actionAllowed`, `tradingAllowed`, and `executionAllowed` are always `false` — enforced at construction time
99. **Phase 8**: `TokenIntelligenceResult.liveData` is always `false`; `fixtureOnly` is always `true` for fixture data
100. **Phase 8**: All `TokenClassification` values are safe — no value uses buy, sell, execute, trade, snipe, live_candidate, or auto_candidate wording
101. **Phase 8**: Token Intelligence scoring outputs are analysis-only — they must never be interpreted as or converted to trade signals
102. **Phase 8**: All `TokenIntelligenceError` results carry `safeToDisplay: true` — no raw secrets, no stack traces, no RPC URLs, no API keys, no wallet data
103. **Phase 8**: `buildTokenIntelligenceResult()` never throws for normal validation failures — it returns safe TiResult errors
104. **Phase 8**: Fixture profiles use synthetic token mints — not real on-chain addresses; no real wallet addresses, real RPC URLs, or API keys appear in fixture data
105. **Phase 8**: `@sonic/state` Phase 8 static status uses no import from `@sonic/token-intelligence` — the status is a pure static value, avoiding circular dependency risk
106. **Phase 8**: No market data ingestion, no live chain events, no transaction construction, no signing, no sending, no execution
107. **Phase 8**: FULL_AUTO and LIMITED_LIVE remain locked. No new Telegram trade/token-lookup commands.

## Phase 9 Additional Safety Rules

108. **Phase 9**: `packages/creator-intelligence` has no dependencies on Solana SDK, Pump SDK, Helius SDK, WebSocket clients, Yellowstone/Geyser packages, wallet libraries, RPC providers, or any app packages
109. **Phase 9**: All `CreatorIntelligenceCapabilities` unsafe fields are permanently `false`: `canUseLiveData`, `canUseSolanaRpc`, `canUseProviderApis`, `canUseWalletData`, `canTrade`, `canCreateTradeIntents`, `canExecute`
110. **Phase 9**: `CreatorIntelligenceResult.actionAllowed`, `tradingAllowed`, and `executionAllowed` are always `false` — enforced at construction time
111. **Phase 9**: `CreatorIntelligenceResult.liveData` is always `false`; `fixtureOnly` is always `true` for fixture data
112. **Phase 9**: All `CreatorClassification` values are safe — no value uses buy, sell, execute, trade, snipe, live_candidate, auto_candidate, or enter wording
113. **Phase 9**: Creator Intelligence scoring outputs are analysis-only — they must never be interpreted as or converted to trade signals
114. **Phase 9**: All `CreatorIntelligenceError` results carry `safeToDisplay: true` — no raw secrets, no stack traces, no RPC URLs, no API keys, no wallet data
115. **Phase 9**: `buildCreatorIntelligenceResult()` never throws for normal validation failures — it returns safe CiResult errors
116. **Phase 9**: Fixture profiles use synthetic creator addresses — not real on-chain addresses; no real wallet addresses, real RPC URLs, API keys, or private data appear in fixture data
117. **Phase 9**: `creatorAddress` is a public identifier model field only — no wallet access, no signing, no private keys, no fund access
118. **Phase 9**: Wallet cluster intelligence and bundle detection are placeholder flags only — no runtime enforcement implemented
119. **Phase 9**: No live creator/dev wallet fetching, no live launch-history fetching, no live funding-source analysis
120. **Phase 9**: FULL_AUTO and LIMITED_LIVE remain locked. No new Telegram trade/creator-lookup commands.

## Phase 10 Additional Safety Rules

121. **Phase 10**: `packages/wallet-intelligence` has no dependencies on Solana SDK, Pump SDK, Helius SDK, WebSocket clients, Yellowstone/Geyser packages, wallet libraries, RPC providers, or any app packages
122. **Phase 10**: All `WalletIntelligenceCapabilities` unsafe fields are permanently `false`: `canUseLiveData`, `canUseSolanaRpc`, `canUseProviderApis`, `canAccessPrivateKeys`, `canTrade`, `canCreateTradeIntents`, `canCopyTrade`, `canExecute`
123. **Phase 10**: `WalletClusterIntelligenceResult.actionAllowed`, `tradingAllowed`, `executionAllowed`, and `copyTradingAllowed` are always `false` — enforced at construction time
124. **Phase 10**: `WalletClusterIntelligenceResult.liveData` is always `false`; `fixtureOnly` is always `true` for fixture data
125. **Phase 10**: All `WalletClusterClassification` values are safe — no value uses buy, sell, execute, trade, snipe, live_candidate, auto_candidate, enter, copy, or mirror wording
126. **Phase 10**: Wallet cluster intelligence scoring outputs are analysis-only — they must never be interpreted as or converted to trade signals or copy-trading signals
127. **Phase 10**: All `WalletIntelligenceError` results carry `safeToDisplay: true` — no raw secrets, no stack traces, no RPC URLs, no API keys, no wallet data, no private keys
128. **Phase 10**: `buildWalletClusterIntelligenceResult()` never throws for normal validation failures — it returns safe WiResult errors
129. **Phase 10**: Fixture wallet addresses are synthetic (`FIXTURE_*` prefixed) — not real on-chain addresses; no real wallet addresses, real RPC URLs, API keys, or private data appear in fixture data
130. **Phase 10**: `walletAddress` is a public identifier model field only — no wallet access, no signing, no private keys, no fund access
131. **Phase 10**: Funding source analysis, same-slot coordination, creator-linked wallet analysis, and bundle detection are placeholder flags only — no runtime enforcement implemented
132. **Phase 10**: No live wallet fetching, no live funding-source analysis, no live creator-linked wallet analysis, no live copy-trading logic
133. **Phase 10**: FULL_AUTO and LIMITED_LIVE remain locked. No new Telegram trade/wallet-lookup/copy-trading commands.
