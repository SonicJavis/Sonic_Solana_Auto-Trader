# Sonic_Solana_Auto-Trader

**Phase 13 — Replay Lab v1**

A defensive intelligence and control foundation for Solana trading. No live trading or execution in any phase up to and including Phase 13.

## Features (Phase 13 — adds to Phase 11)

- New `packages/replay-lab` — local deterministic replay lab model layer (no Solana SDK, no provider SDK, no network, no wallet, no private keys, no trading, no execution)
- `ReplayVerdict` — 5 safe outcome values: `passed`, `failed`, `degraded`, `inconclusive`, `fixture_only` (no buy/sell/execute/trade/live wording)
- `ReplayLabCapabilities` — all 9 unsafe flags permanently `false`; `fixtureOnly: true`
- `ReplayStep`, `ReplayScenario`, `ReplayRun`, `ReplayComparison` — complete model types; all with `liveData: false`, `fixtureOnly: true`, `safeToDisplay: true`
- `buildReplayStepResult()` — deterministic step verdict engine (no fixtures → inconclusive; reject → failed; risky/risk → degraded; multi-warn → degraded; clean → fixture_only)
- `runReplayScenario()` — execute a full scenario, returning a validated `ReplayRun`
- `compareReplayRuns()` — regression comparison: score delta, confidence delta, verdict change detection
- `getReplayLabCapabilities()` — all-false capability guard
- 8 deterministic synthetic fixture scenarios: clean_token, risky_creator, wallet_cluster_risk, manipulation_reject, mixed_warning, missing_data, regression_baseline, regression_candidate
- 85 new tests in `tests/phase13.test.ts` — **1600 passing** (19 test files)
- **Fixture/local replay only** — no live data, no Solana RPC, no provider APIs, no trade intents, no execution plans, no paper trading
- See [docs/REPLAY_LAB.md](./docs/REPLAY_LAB.md) for full details

## Features (Phase 11 — adds to Phase 10)

- New `packages/manipulation-detector` — local bundle/manipulation detector layer (no Solana SDK, no provider SDK, no network, no wallet, no private keys, no enforcement)
- `BundleSignal` — local bundle/manipulation signal model; 9 `BundleSignalType` values; `fixtureOnly: true`, `liveData: false`
- `ManipulationPattern` — local manipulation pattern model; 9 `ManipulationPatternType` values; `fixtureOnly: true`, `liveData: false`
- `CoordinatedActivitySnapshot` — coordinated activity counts per token; `fixtureOnly: true`, `liveData: false`
- `BundleRiskScore`, `WashTradeScore`, `CoordinationScore`, `FundingPatternScore`, `CreatorLinkScore` — deterministic component scores (0–100)
- 17 `ManipulationRiskFlag` codes (LIKELY_BUNDLE_PATTERN, LIKELY_WASH_TRADE_PATTERN, COORDINATED_DUMP_PATTERN, placeholder flags, etc.)
- `ManipulationClassification` — 5 safe values: `reject`, `watch_only`, `analysis_only`, `insufficient_data`, `fixture_only` (no trade/copy wording)
- `ManipulationDetectorCapabilities` — all unsafe flags `false`: `canTrade`, `canExecute`, `canUseSolanaRpc`, `canUseProviderApis`, `canAccessPrivateKeys`, `canCreateTradeIntents`, `canCreateEnforcementActions`
- `ManipulationDetectionResult` — `actionAllowed/tradingAllowed/executionAllowed/enforcementAllowed` always `false`; `liveData: false`; `safeToDisplay: true`
- `buildManipulationDetectionResult()` — validates inputs, scores, classifies, returns safe result (never throws)
- 8 deterministic synthetic fixture groups: clean_activity, likely_bundle, possible_bundle, likely_wash_trade, coordinated_dump, creator_linked_manipulation, fresh_wallet_farm_manipulation, bot_noise
- 84 new tests in `tests/phase11.test.ts` — **1450 passing** (17 test files)
- **Fixture/local detection only** — no live bundle detection, no live wash-trade detection, no Solana RPC, no provider APIs, no enforcement actions, no trade intents
- See [docs/MANIPULATION_DETECTOR.md](./docs/MANIPULATION_DETECTOR.md) for full details

## Features (Phase 10 — adds to Phase 9)

- New `packages/wallet-intelligence` — local wallet cluster intelligence layer (no Solana SDK, no provider SDK, no network, no wallet, no private keys, no copy trading)
- `WalletProfile` — local-only wallet identity model; `fixtureOnly: true`, `liveData: false`; `walletAddress` is a public identifier model only
- `WalletCluster` — local wallet cluster model; 9 `WalletClusterType` values; `fixtureOnly: true`, `liveData: false`
- `WalletQualityScore`, `ClusterQualityScore`, `LeaderFollowerScore`, `FreshWalletRiskScore`, `FundingSourceScore` — deterministic component scores (0–100)
- 16 `WalletClusterRiskFlag` codes (INSUFFICIENT_WALLET_DATA, FAST_DUMPER_HISTORY, BOT_NOISE_SIGNALS, FRESH_WALLET_FARM_PLACEHOLDER, COORDINATED_SELL_PLACEHOLDER, placeholder flags, etc.)
- `WalletClusterClassification` — 5 safe values: `reject`, `watch_only`, `analysis_only`, `insufficient_data`, `fixture_only` (no trade/copy wording)
- `WalletIntelligenceCapabilities` — all unsafe flags `false`: `canTrade`, `canExecute`, `canCopyTrade`, `canUseSolanaRpc`, `canUseProviderApis`, `canAccessPrivateKeys`, `canCreateTradeIntents`
- `WalletClusterIntelligenceResult` — `actionAllowed/tradingAllowed/executionAllowed/copyTradingAllowed` always `false`; `liveData: false`; `safeToDisplay: true`
- `buildWalletClusterIntelligenceResult()` — validates inputs, scores, classifies, returns safe result (never throws)
- 7 deterministic synthetic fixture clusters: smart_accumulator, profitable_leader, fast_dumper, fresh_wallet_farm, same_funding_source, bot_noise, known_rug_cluster
- 62 new tests in `tests/phase10.test.ts` — **1366 passing** (16 test files)
- **Fixture/local scoring only** — no live data, no Solana RPC, no provider APIs, no wallet data, no trade actions, no copy trading
- See [docs/WALLET_INTELLIGENCE.md](./docs/WALLET_INTELLIGENCE.md) for full details

## Features (Phase 9 — adds to Phase 8)

- New `packages/creator-intelligence` — local creator intelligence layer (no Solana SDK, no provider SDK, no network, no wallet)
- `CreatorProfile` — local-only creator identity model; `fixtureOnly: true`, `liveData: false`; `creatorAddress` is a public identifier model only
- `CreatorLaunchHistorySnapshot` — local launch history metrics snapshot; `fixtureOnly: true`, `liveData: false`
- `CreatorSuccessScore`, `CreatorLaunchQualityScore`, `CreatorConsistencyScore`, `CreatorSuspiciousPatternScore` — deterministic component scores (0–100)
- 14 `CreatorRiskFlag` codes (INSUFFICIENT_CREATOR_DATA, HIGH_FAILURE_RATE, RUG_LIKE_HISTORY, placeholder flags, etc.)
- `CreatorClassification` — 5 safe values: `reject`, `watch_only`, `analysis_only`, `insufficient_data`, `fixture_only` (no trade wording)
- `CreatorIntelligenceCapabilities` — all unsafe flags `false`: `canTrade`, `canExecute`, `canUseSolanaRpc`, `canUseProviderApis`, `canUseWalletData`, `canCreateTradeIntents`
- `CreatorIntelligenceResult` — `actionAllowed/tradingAllowed/executionAllowed` always `false`; `liveData: false`; `safeToDisplay: true`
- `buildCreatorIntelligenceResult()` — validates inputs, scores, classifies, returns safe result (never throws)
- 6 deterministic synthetic fixtures: strong, new, fast_dump, repeated_metadata, suspicious_funding, rug_like
- 73 new tests in `tests/phase9.test.ts` — **1304 passing** (15 test files)
- **Fixture/local scoring only** — no live data, no Solana RPC, no provider APIs, no wallet data, no trade actions
- See [docs/CREATOR_INTELLIGENCE.md](./docs/CREATOR_INTELLIGENCE.md) for full details

## Features (Phase 8 — adds to Phase 7A/7B/7C/7D/7E)

- New `packages/token-intelligence` — local token intelligence layer (no Solana SDK, no provider SDK, no network, no wallet)
- `TokenProfile` — local-only token identity model; boolean social/image presence; `fixtureOnly: true`, `liveData: false`
- `TokenMetricSnapshot` — local quantitative metrics snapshot; `fixtureOnly: true`, `liveData: false`
- `MetadataQualityScore`, `CurveQualityScore`, `HolderConcentrationScore`, `LiquidityQualityScore`, `OrganicMomentumScore` — deterministic component scores (0–100)
- 13 `TokenRiskFlag` codes (MISSING_METADATA, HIGH_TOP_HOLDER_CONCENTRATION, LOW_LIQUIDITY, SELL_PRESSURE_HIGH, CURVE_TOO_EARLY/ADVANCED, placeholder flags, etc.)
- `TokenClassification` — 5 safe values: `reject`, `watch_only`, `analysis_only`, `insufficient_data`, `fixture_only` (no trade wording)
- `TokenIntelligenceCapabilities` — all unsafe flags `false`: `canTrade`, `canExecute`, `canUseSolanaRpc`, `canUseProviderApis`, etc.
- `TokenIntelligenceResult` — `actionAllowed/tradingAllowed/executionAllowed` always `false`; `liveData: false`; `safeToDisplay: true`
- `buildTokenIntelligenceResult()` — validates inputs, scores, classifies, returns safe result (never throws)
- 5 deterministic synthetic fixtures: good, missing_metadata, concentrated_holder, low_liquidity, high_sell_pressure
- `PHASE_8_TOKEN_INTELLIGENCE_STATUS` (in `@sonic/state`) — static safe status snapshot
- 83 new tests in `tests/phase8.test.ts` — **1231 passing** (14 test files)
- **Fixture/local scoring only** — no live data, no Solana RPC, no provider APIs, no trade actions

## Features (Phase 7E — adds to Phase 7A/7B/7C/7D)

- `EventEngineReadinessSnapshot` (in `@sonic/state`) — safe top-level snapshot; all live/network/execution fields always `'forbidden'`
- `ProviderReadinessSummary` (in `@sonic/state`) — safe provider readiness counts and overall state; no raw URLs/API keys
- `Phase8ReadinessGate` (in `@sonic/state`) — static Phase 8 Token Intelligence readiness checklist
- `buildEventEngineReadinessSnapshot()` — builds complete snapshot using Phase 7D provider readiness
- `buildPhase8ReadinessGate()` — evaluates Phase 8 readiness; `readyForTokenIntelligence: true` only when all local foundations and safety conditions hold
- `PHASE_7E_EVENT_ENGINE_SUMMARY` — static constant safe for `/system` output
- `EVENT_ENGINE_READINESS_CODES` — 6 safe error/readiness codes
- Telegram `/system engine` — Event Engine local-only status and provider readiness summary
- Telegram `/system phase8` — Phase 8 Token Intelligence readiness gate
- 107 new tests in `tests/phase7e.test.ts` — **1148 passing** (13 test files)
- **Phase 8 readiness means ready to build Token Intelligence models locally only** — NOT live data, trading, or execution

## Features (Phase 7D — adds to Phase 7A/7B/7C)

- `ProviderConfigMode` — `disabled`, `mock_only`, `future_live_not_available`
- `ProviderConfigInput` — raw input shape; all unsafe live/network/API-key flags are captured, never honoured
- `ProviderConfigSafe` — validated safe config; all permissions always `false`; raw URLs/API keys never stored
- `ProviderConfigErrorCode` — 9 safe error codes for validation failures
- `validateProviderConfig()` — fail-closed validation; unsafe attempts produce `unsafeRequested=true` + reasons
- `createDisabledProviderConfig()` — creates a named disabled safe config for any provider type
- `ProviderReadiness` — `disabled_safe`, `mock_only_ready`, `unsafe_requested`, `unavailable`, `unknown`
- `ProviderReadinessEntry` — per-provider entry; `canConnect`/`canEmitLiveEvents`/`canTriggerExecution` always `false`
- `ProviderReadinessReport` — aggregated readiness report; counts all 0 for safe Phase 7D state
- `evaluateProviderReadiness()` — derives readiness from safe config
- `buildProviderReadinessReport()` — generates report with safe-to-display notes
- `assertAllProvidersSafe()` — throws safe error if any provider requested unsafe permissions
- `PHASE_7D_READINESS_SUMMARY` — static summary constant safe for `/system` output
- 81 new tests in `tests/phase7d.test.ts` — 1041+ passing

## Features (Phase 7B — adds to Phase 7A)

- Disabled read-only provider boundaries (`packages/event-engine`) — defines where future event providers could plug in
- `EventProviderType` — 6 disabled provider types (helius_disabled, websocket_disabled, yellowstone_disabled, polling_disabled, mock_disabled, unknown_disabled)
- `EventProviderStatus` — disabled / unavailable / unsupported / mock_only / future_not_available
- `EventProviderConfig` — all 8 live/network/execution permission fields permanently `false`
- `EventProviderCapabilities` — all 12 capability flags permanently `false` (including hasRuntimeDependency, canUseNetwork, canUseSolanaRpc, canUseWebSocket, canUseYellowstone, canUseGeyser, canEmitLiveEvents, canTriggerExecution, canAccessWallets, canAccessPrivateKeys)
- `ProviderErrorCode` — 13 safe error codes (PROVIDER_DISABLED, SOLANA_RPC_FORBIDDEN, WEBSOCKET_FORBIDDEN, etc.)
- `EventProviderBoundary` interface + `DisabledEventProvider` — always disabled; lifecycle methods return safe forbidden results
- `createDisabledEventProvider` factory — fail-closed; all unsafe enable/live/network attempts coerced to disabled
- Named helpers: `createDisabledHeliusProvider`, `createDisabledWebSocketProvider`, `createDisabledYellowstoneProvider`, `createDisabledPollingProvider`
- `EventProviderRegistry` — registry of disabled providers; all entries disabled; no provider startup
- 195 new tests in `tests/phase7b.test.ts` — 862 total, all passing

## Features (Phase 7C — adds to Phase 7A)

- `mock_provider` added to `EventSourceType` — valid source for mock/fixture events
- `EventProviderType` — 6 disabled provider boundaries (Phase 7B): helius_disabled, websocket_disabled, yellowstone_disabled, quicknode_disabled, triton_disabled, alchemy_disabled
- `EventProviderCapabilities` — 12 capability flags all false for disabled providers
- `createDisabledEventProvider()` — fail-closed factory; connect/disconnect always return LIVE_PROVIDER_FORBIDDEN
- `buildDisabledProviderRegistry()` — registry of all 6 disabled provider boundaries
- `MockProviderStatus` — idle / loaded / replaying / completed / failed / stopped
- `MockProviderCapabilities` — 12 flags; only `canReplayFixtureEvents: true`, all others false
- `createControlledMockProvider()` — stateful mock provider for deterministic local replay
- `FixtureEvent` — fixture wrapper with `mock: true`, `replay: true`, `live: false`, `offsetMs`
- `validateFixtureEvent()` — validates ID, flags, offset bounds, envelope validity
- Built-in synthetic fixtures: `FIXTURE_SYSTEM_STARTUP`, `FIXTURE_PUMP_ADAPTER_STATUS`, `FIXTURE_FUTURE_CHAIN_PLACEHOLDER`, `FIXTURE_SAFETY_EVENT`
- `FixtureSequence` — ordered sequence of fixtures; max 1,000 events; optional `maxReplayEvents` cap
- `buildFixtureSequence()` — sorts by `offsetMs`, validates, returns safe result
- `BUILTIN_SEQUENCE_ALL` — pre-built sequence of all 4 built-in fixtures
- `replayFixtureSequence()` — stateless deterministic synchronous replay into `InMemoryEventBus`
- `ReplayStats` — eventsPlanned, eventsPublished, eventsRejected, startedAt, completedAt, status
- 11 new Phase 7C error codes (INVALID_FIXTURE_ID, FIXTURE_SEQUENCE_TOO_LARGE, LIVE_EVENT_FORBIDDEN, etc.)
- 98 new tests in `tests/phase7c.test.ts` — 765 total, all passing

## Features (Phase 7A — event engine core)

- New `packages/event-engine` package — local-only, no network dependencies
- `EventEnvelope` — canonical event container with safe payload, safeToPersist, safeToDisplay
- `EventCategory` — system, config, mode, safety, audit, pump_adapter, future_chain (placeholder), future_market (placeholder), unknown
- `EventSourceType` — internal, worker, telegram, audit_repository, state_service, pump_adapter_mock, mock_provider, future_provider_disabled
- `EventSeverity` — debug, info, warn, error, critical
- `EventSourceCapabilities` — all 5 network/execution/wallet flags permanently `false`
- `IEventBus` interface + `InMemoryEventBus` implementation — bounded history (default 1000), handler failure isolation, idempotent unsubscribe
- `DedupeStore` — in-memory TTL deduplication with clock injection for deterministic tests
- `validateEventEnvelope` — full structural and safety validation (rejects functions, class instances, circular refs, raw Errors)
- `EventEngineResult<T>` — safe result/error type with 28 error codes; all errors `safeToDisplay: true`
- `buildEventEngineSystemStatus` — reports liveProviders:disabled, networkEvents:forbidden, executionTriggers:forbidden, solanaRpc:forbidden
- PHASE constant updated to 7

## Features (Phase 6C — adds to Phase 6A/6B)

- Disabled Pump SDK wrapper boundary (`packages/pump-adapter`) — defines where a future Pump SDK could plug in
- `PumpSdkWrapperMode` type: disabled / mock / future_live_not_available
- `PumpSdkWrapperStatus` type: disabled / unavailable / unsupported / mock_only
- `PumpSdkWrapperConfig` — all live/executable permission fields permanently false
- `PumpSdkWrapperCapabilities` — 12 capability flags, all permanently false (including hasPumpSdkRuntime, hasSolanaSdkRuntime)
- `PumpSdkWrapperErrorCode` — 11 safe error codes (SDK_WRAPPER_DISABLED, LIVE_RPC_FORBIDDEN, etc.)
- `PumpSdkWrapper` interface — getStatus, getCapabilities, getConfig, assertDisabled, explainDisabledReason, boundary placeholders for future live methods (all return forbidden results)
- `DisabledPumpSdkWrapper` — the only implementation; always returns disabled/forbidden results; never imports SDK
- `createPumpSdkWrapper` factory — always returns disabled wrapper; unsafe enable/live/executable attempts are coerced to disabled (fail-closed)
- 73 new tests in `tests/phase6c.test.ts` — 548 total, all passing

## Features (Phase 6B — adds to Phase 6A)

- Instruction intent models: `PumpInstructionIntent` (local planning model, not executable)
- Transaction plan placeholder models: `PumpTransactionPlan` (local placeholder, not a transaction)
- Builder request/result types: `PumpInstructionBuilderRequest`, `PumpInstructionBuilderResult`
- Warning codes: MODEL_ONLY, EXECUTION_FORBIDDEN, SIGNING_FORBIDDEN, SENDING_FORBIDDEN, LIVE_RPC_FORBIDDEN, REAL_INSTRUCTIONS_FORBIDDEN
- Error codes: 12 forbidden-operation codes (INSTRUCTION_BUILDING_FORBIDDEN, EXECUTABLE_INSTRUCTIONS_FORBIDDEN, etc.)
- Phase 6B safety capability guard: `PHASE_6B_BUILDER_CAPABILITIES` — all 12 prohibited capabilities permanently false
- Mock instruction builder: `MockInstructionBuilder`, `createMockInstructionBuilder`
- Input validation helpers: allowExecutableInstructions guard, quote success, venue allow-list, positive amounts, slippage bounds

## Features (Phase 6A)

- Pump adapter boundary package (`packages/pump-adapter`) — pure TypeScript models, inert
- Venue types: `PumpVenueType` (pump_curve, pumpswap, unknown, unsupported)
- Adapter status types: `PumpAdapterStatus` (available, unavailable, disabled, unsupported)
- Safe quote request/result models: `PumpQuoteRequest`, `PumpBuyQuoteRequest`, `PumpSellQuoteRequest`, `PumpQuoteResult`
- Bonding curve state model: `BondingCurveState` (mock-safe, not fetched from chain)
- Safe error/result types: `PumpAdapterResult`, `PumpAdapterError`, all error codes
- Input validation helpers: validateTokenMint, validateInputAmount, validateSlippageBps, validateRequestedAt, validateQuoteRequest
- Safety capability guard: `PUMP_ADAPTER_CAPABILITIES` — all prohibited capabilities permanently false
- Mock adapter: `MockPumpAdapter`, `createDisabledMockAdapter`, `createAvailableMockAdapter`
- Safe read-only state/read-model layer (`packages/state`)
- `SystemStateSnapshot` — aggregated system state: phase, mode, readiness, DB, audit, worker, safety
- Readiness calculation: `ready` / `degraded` / `unsafe` / `unknown` with documented rules
- Audit read model: stats, last startup/heartbeat/unsafe-flags timestamps
- Config read model: safe summary (no raw tokens, DATABASE_URL, or credentials)
- Mode read model: current mode, locked modes, mode safety status
- Worker read model: health derived from heartbeat age
- Telegram `/system` command with subcommands: health, safety, audit, worker, config, help
- All `/system` output is secret-safe (no raw credentials, no detailsJson)
- SQLite + Drizzle ORM persistent audit log (`audit_events` table)
- Telegram bot, admin allowlist enforcement (fail-closed)
- Full command suite: `/start`, `/help`, `/status`, `/mode`, `/pause`, `/kill`, `/audit`, `/safety`, `/version`, `/system`
- `FULL_AUTO` and `LIMITED_LIVE` modes remain locked
- TypeScript pnpm monorepo with strict settings

## Safety Notice

- **NO LIVE TRADING**: All trading functionality is strictly disabled in Phases 6A/6B/6C/7A/7B/7C.
- **NO EXECUTION**: The system has no capability to send transactions to the Solana network.
- **NO WALLET / PRIVATE KEYS**: Private key handling, wallet loading, and transaction signing are NOT implemented.
- **NO SOLANA RPC**: No Solana RPC connections in any phase through 7C.
- **NO JITO / PUMP.FUN TRADING**: No Pump.fun buying/selling. No PumpSwap buying/selling. No Jito.
- **NO TRANSACTION BUILDING**: No real transaction instruction building or construction.
- **NO ACCOUNT METAS**: No AccountMeta objects are returned.
- **NO BINARY INSTRUCTION DATA**: No binary instruction data is returned.
- **NO SIMULATION**: No transaction simulation.
- **PUMP ADAPTER IS INERT**: `packages/pump-adapter` is model-only — no live RPC, no execution, no signing, no sending.
- **PUMP SDK WRAPPER IS DISABLED**: `DisabledPumpSdkWrapper` defines only the boundary where a future Pump SDK could plug in. No real Pump SDK runtime. No Solana SDK. All wrapper capabilities are false.
- **INSTRUCTION INTENTS ARE LOCAL MODELS ONLY**: `PumpInstructionIntent` is a planning model, not an executable instruction.
- **TRANSACTION PLANS ARE PLACEHOLDERS ONLY**: `PumpTransactionPlan` is a placeholder, not a Solana transaction.
- **EVENT ENGINE IS LOCAL ONLY**: `packages/event-engine` is in-memory infrastructure only — no network, no Solana RPC, no live providers, no execution triggers, no wallet access.
- **EVENT SOURCE CAPABILITIES ARE ALL FALSE**: All network/execution/wallet capability flags are permanently `false` for disabled and source providers.
- **MOCK PROVIDER IS FIXTURE-ONLY**: `ControlledMockProvider` can only replay synthetic fixture events locally — no live events, no network, no execution triggers.
- **DISABLED PROVIDERS ARE INERT**: All 6 Phase 7B disabled provider boundaries (Helius, WebSocket, Yellowstone, etc.) always return LIVE_PROVIDER_FORBIDDEN — no connections possible.
- **NO LIVE PROVIDERS**: No Helius, WebSocket, Yellowstone, Geyser, QuickNode, Triton, or Alchemy integration.
- **NO MARKET DATA INGESTION**: No live token launch detection or market data.
- **READ-ONLY FIRST**: The foundation is built for infrastructure only.
- **FULL_AUTO and LIMITED_LIVE remain locked**.

## Workspace packages

- `packages/shared` — constants, modes, types
- `packages/config` — environment schema and loader
- `packages/db` — SQLite/Drizzle persistent audit repository + in-memory fallback
- `packages/mode-manager` — mode state machine
- `packages/state` — safe read-only state/read-model layer (Phase 5)
- `packages/pump-adapter` — pump adapter interfaces and quote models (Phase 6A, inert)
- `packages/observability` — logger
- `packages/risk-engine` — risk checks
- `packages/testing` — shared test utilities
- `apps/telegram-bot` — Telegram control interface
- `apps/worker` — safe heartbeat loop

## Commands

```sh
pnpm test        # run tests (1148 passing as of Phase 7E)
pnpm lint        # lint all packages
pnpm typecheck   # type check all packages
pnpm build       # build all packages
```

## Environment Variables (Phase 4 additions)

```
DATABASE_PATH=./data/sonic-solana-autotrader.sqlite  # local SQLite file (not a secret)
AUDIT_RETENTION_DAYS=30                              # 1–365, default 30
AUDIT_MAX_EVENTS=10000                               # 100–1000000, default 10000
AUDIT_ROTATION_ENABLED=true                          # default true
```

