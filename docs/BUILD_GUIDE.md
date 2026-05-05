# Build Guide

## Prerequisites
- Node.js >= 18
- pnpm >= 8

## Install
pnpm install

## Build
pnpm --filter @sonic/shared build
pnpm --filter @sonic/config build
pnpm --filter @sonic/db build
pnpm --filter @sonic/observability build
pnpm --filter @sonic/mode-manager build
pnpm --filter @sonic/risk-engine build

## Test
pnpm test

## Typecheck
pnpm typecheck

## Lint
pnpm lint

## Phase 4: Database

The `packages/db` package provides:
- SQLite + Drizzle ORM persistent audit log
- `openDatabase(path)` — opens SQLite file, WAL mode enabled
- `initSchema(sqlite)` — creates `audit_events` table + indexes (idempotent)
- `SqliteAuditRepository` — record, query, count, stats, retention
- `InMemoryAuditLogger` — in-memory fallback (for tests, no file I/O)

The data directory (`./data/` by default) is created automatically on startup.

## Phase 4: New env vars

```
DATABASE_PATH=./data/sonic-solana-autotrader.sqlite
AUDIT_RETENTION_DAYS=30
AUDIT_MAX_EVENTS=10000
AUDIT_ROTATION_ENABLED=true
```

## Phase 4: Test count
201 tests (82 new Phase 4 tests + 119 regression tests).

## Phase 5: State Store and Safe Read Models

The `packages/state` package provides:
- `buildSystemStateSnapshot()` — full safe system state snapshot
- `buildAuditStateSnapshot()` — audit stats and timestamps
- `buildConfigStateSnapshot()` — safe config summary
- `buildModeStateSnapshot()` — mode status and locked modes
- `buildWorkerStateSnapshot()` — worker health from heartbeat age
- `calculateReadiness()` — SystemReadiness: ready/degraded/unsafe/unknown

### Build state package

```
pnpm --filter @sonic/state build
```

### New Telegram command

`/system` — system state overview
`/system health` — readiness and worker details
`/system safety` — runtime safety locks
`/system audit` — audit statistics
`/system worker` — startup and heartbeat info
`/system config` — safe config summary
`/system help` — subcommand list

### Phase 5: Limitations

- No Solana RPC (not yet implemented)
- No market data (not yet implemented)
- No Pump SDK adapter (not yet implemented)
- No trading, wallet, signing, sending, Jito, Pump.fun, or execution
- FULL_AUTO and LIMITED_LIVE remain locked

## Phase 5: Test count
291 tests (88 new Phase 5 tests + 203 regression tests).

## Phase 6A: Pump Adapter Interfaces + Safe Quote Models

The `packages/pump-adapter` package provides:
- Pure TypeScript interfaces and models for future Pump.fun/PumpSwap support
- Inert in Phase 6A — no live RPC, no execution, no network calls
- `PUMP_ADAPTER_CAPABILITIES` — all prohibited capabilities permanently false
- `MockPumpAdapter` — configurable mock for tests

### Build pump-adapter package

```
pnpm --filter @sonic/pump-adapter build
```

### Phase 6A: Limitations

- No Solana RPC (not yet implemented)
- No Pump SDK runtime integration (not yet implemented)
- No transaction instruction building (not yet implemented)
- No transaction construction, simulation, signing, or sending
- No Pump.fun buying/selling, no PumpSwap buying/selling, no Jito
- No market data ingestion
- No live or auto trading
- FULL_AUTO and LIMITED_LIVE remain locked
- No new Telegram trade/quote commands

## Phase 6A: Test count
397 tests (106 new Phase 6A tests + 291 regression tests).

## Phase 6B: Instruction Intent Models

The `packages/pump-adapter` extension adds:
- `PumpInstructionIntent` — local planning model only
- `PumpTransactionPlan` — local placeholder only
- `MockInstructionBuilder` — mock builder for tests
- `PHASE_6B_BUILDER_CAPABILITIES` — all 12 prohibited capabilities permanently false

### Phase 6B: Limitations

- No Solana RPC. No Pump SDK runtime. No real instruction building.
- No account metas, no binary instruction data, no transaction construction, simulation, signing, sending.
- FULL_AUTO and LIMITED_LIVE remain locked.

## Phase 6B: Test count
475 tests (78 new Phase 6B tests + 397 regression tests).

## Phase 6C: Disabled Pump SDK Wrapper Boundary

The `packages/pump-adapter` extension adds:
- `DisabledPumpSdkWrapper` — disabled boundary wrapper; never imports SDK or uses RPC
- `createPumpSdkWrapper()` — factory; always returns disabled wrapper (fail-closed)
- `PUMP_SDK_WRAPPER_CAPABILITIES` — all 12 wrapper capability flags permanently false
- `DISABLED_WRAPPER_CONFIG` — all live/executable permission fields permanently false

### Phase 6C: Limitations

- No real Pump SDK runtime integration. No `@solana/web3.js`. No Solana SDK.
- No live RPC, real instruction building, account metas, binary instruction data.
- No transaction construction, simulation, signing, sending, wallet access, or execution.
- Unsafe enable/live/executable config attempts are coerced to disabled (fail-closed).
- FULL_AUTO and LIMITED_LIVE remain locked.
- No new Telegram trade/quote commands.
- Phase 7 should be read-only event engine or further disabled wrapper hardening — not execution.

## Phase 6C: Test count
548 tests (73 new Phase 6C tests + 475 regression tests).

## Phase 7A: Event Engine Core

The new `packages/event-engine` package provides:
- `EventEnvelope` — canonical event container with full validation
- `IEventBus` / `InMemoryEventBus` — bounded, isolated, in-memory pub/sub
- `EventSourceCapabilities` — all network/execution/wallet flags permanently `false`
- `DedupeStore` — in-memory TTL deduplication
- `validateEventEnvelope` — full structural and safety validation
- `EventEngineResult<T>` — safe result/error type

### Build event-engine package

```
pnpm --filter @sonic/event-engine build
```

### Phase 7A: Limitations

- No Solana RPC, no Helius, no QuickNode, no WebSocket providers.
- No Yellowstone / Geyser. No Pump SDK runtime. No @solana/web3.js.
- No market data ingestion. No wallet/private keys.
- No transaction construction, simulation, signing, or sending.
- No trade execution, swap logic, or Jito.
- future_chain and future_market categories are model-only placeholders.
- FULL_AUTO and LIMITED_LIVE remain locked.
- No new Telegram trade/event-stream commands.

## Phase 7A: Test count
667 tests (119 new Phase 7A tests + 548 regression tests).

## Phase 7B: Disabled Provider Boundaries

The `packages/event-engine` extension (Phase 7B) adds:
- `EventProviderType` / `EventProviderStatus` — disabled provider type/status models
- `EventProviderConfig` / `EventProviderCapabilities` — all permissions/capabilities permanently `false`
- `PHASE_7B_PROVIDER_CAPABILITIES` — canonical Phase 7B capability guard
- `EventProviderBoundary` interface + `DisabledEventProvider` — disabled boundary; lifecycle methods return safe forbidden results
- `createDisabledEventProvider` — factory; always returns disabled provider (fail-closed)
- Named helpers: `createDisabledHeliusProvider`, `createDisabledWebSocketProvider`, `createDisabledYellowstoneProvider`, `createDisabledPollingProvider`
- `EventProviderRegistry` / `getEventProviderRegistry` — registry of disabled providers

### Phase 7B: Limitations

- No Helius SDK. No WebSocket client. No Yellowstone or Geyser packages. No `@solana/web3.js`.
- No Solana RPC, no live polling, no live streaming, no market data ingestion.
- No wallet/private keys. No transaction construction, simulation, signing, or sending.
- No trade execution, swap logic, or Jito.
- All unsafe enable/live/network config attempts are coerced to disabled (fail-closed).
- FULL_AUTO and LIMITED_LIVE remain locked.
- No new Telegram event-stream or trade commands.

## Phase 7B: Test count
862 tests (195 new Phase 7B tests + 667 regression tests).

## Phase 7C: Mock Providers + Fixture Replay

Phase 7C adds controlled mock providers and replayable fixture events.

New exports in `packages/event-engine`:
- `MockProviderStatus`, `MOCK_PROVIDER_CAPABILITIES`, `createControlledMockProvider()`
- `FixtureEvent`, `validateFixtureEvent()`, `BUILTIN_FIXTURE_EVENTS`, built-in fixtures
- `FixtureSequence`, `validateFixtureSequence()`, `buildFixtureSequence()`, `BUILTIN_SEQUENCE_ALL`
- `ReplayStatus`, `ReplayStats`, `replayFixtureSequence()`, `replayAndCollect()`

### Phase 7C: Limitations

- No live providers of any kind (Helius, WebSocket, Yellowstone, Geyser, QuickNode, Triton, Alchemy).
- No Solana RPC. No market data ingestion. No live chain events.
- No wallet/private keys. No transaction construction, signing, or sending.
- Mock provider can only replay synthetic fixture events locally.
- All disabled provider boundaries are fail-closed (connect/disconnect always return appropriate results).
- FULL_AUTO and LIMITED_LIVE remain locked.
- No new Telegram trade/event-stream commands.

## Phase 7D: Disabled Provider Config + Readiness Checks

Phase 7D adds disabled provider configuration models and readiness checks to `packages/event-engine`.

### What Phase 7D adds

- `ProviderConfigMode`, `ProviderConfigInput`, `ProviderConfigSafe` — config types
- `validateProviderConfig()` — fail-closed; captures all unsafe attempts
- `createDisabledProviderConfig()` — named disabled config factory
- `ProviderReadiness`, `ProviderReadinessEntry`, `ProviderReadinessReport` — readiness types
- `evaluateProviderReadiness()`, `buildProviderReadinessEntry()`, `buildProviderReadinessReport()` — readiness logic
- `assertAllProvidersSafe()` — safe assertion helper
- `PHASE_7D_READINESS_SUMMARY` — static summary constant

### Phase 7D: Limitations

- No live providers. No network access. No Solana RPC. No WebSocket.
- No Helius, WebSocket, Yellowstone, Geyser SDKs.
- No API key usage. No wallet handling. No signing. No sending. No execution.
- No new Telegram trade/event-stream commands.
- FULL_AUTO and LIMITED_LIVE remain locked.
- Phase 7E may add controlled read-only configuration/replay integration — still without execution.

## Phase 7D: Test count
1041 passing tests (81 new Phase 7D tests + prior regression tests). Previous pre-existing failures from missing telegraf/drizzle-orm resolved with pnpm workflow.

## Phase 7E: Event Engine Final Gate + Provider Readiness Surface

Phase 7E surfaces Event Engine and provider readiness into `@sonic/state` and adds a Phase 8 Token Intelligence readiness gate.

### What Phase 7E adds

- `EventEngineReadinessSnapshot` (in `packages/state`) — safe top-level snapshot; all live/network/execution fields 'forbidden'
- `ProviderReadinessSummary` (in `packages/state`) — safe counts/state summary; no raw URLs/API keys
- `Phase8ReadinessGate` (in `packages/state`) — static Phase 8 readiness checklist
- `buildEventEngineReadinessSnapshot()` — complete snapshot builder
- `buildPhase8ReadinessGate()` — Phase 8 gate evaluator
- `PHASE_7E_EVENT_ENGINE_SUMMARY`, `EVENT_ENGINE_READINESS_CODES` — safe constants
- Telegram `/system engine` and `/system phase8` subcommands
- `PHASE_NAME` updated to 'Event Engine Final Gate + Provider Readiness Surface'

### Phase 7E: Limitations

- No live providers. No network access. No Solana RPC. No WebSocket.
- No Helius, WebSocket, Yellowstone, Geyser SDKs.
- No API key usage. No wallet handling. No signing. No sending. No execution.
- Phase 8 readiness means Token Intelligence model work only — NOT live data, trading, or execution.
- FULL_AUTO and LIMITED_LIVE remain locked.

## Phase 7E: Test count
1148 passing tests (107 new Phase 7E tests + 1041 regression tests). 13 test files.

## Phase 7C: Test count
Tests from Phase 7C remain part of the full suite.

## Phase 8: Token Intelligence v1

The new `packages/token-intelligence` package provides:
- `TokenProfile` and `TokenMetricSnapshot` — local-only token identity and metric models
- `MetadataQualityScore`, `CurveQualityScore`, `HolderConcentrationScore`, `LiquidityQualityScore`, `OrganicMomentumScore` — deterministic component scores (0–100)
- `TokenRiskFlag` (13 codes), `TokenRiskFlagEntry` — risk flag model
- `TokenClassification` (5 safe values) — never uses trade wording
- `TokenIntelligenceCapabilities` — all unsafe capability fields permanently `false`
- `TokenIntelligenceResult` — complete result; `actionAllowed/tradingAllowed/executionAllowed` always `false`
- `buildTokenIntelligenceResult()` — validates, scores, classifies, returns safe TiResult
- 5 synthetic fixture profiles: good, missing_metadata, concentrated_holder, low_liquidity, high_sell_pressure
- `@sonic/state` extended with `PHASE_8_TOKEN_INTELLIGENCE_STATUS` static snapshot

### Build token-intelligence package

```
pnpm --filter @sonic/token-intelligence build
```

### Phase 8: Limitations

- No live token data, holder data, or social data fetched
- No Solana RPC. No Helius, WebSocket, Yellowstone, Geyser. No provider API keys.
- No market data ingestion. No live chain events.
- No wallet/private keys. No transaction construction, simulation, signing, or sending.
- No trade execution, swap logic, or Jito.
- Scores and classifications are analysis-only — they do not imply permission to trade.
- FULL_AUTO and LIMITED_LIVE remain locked.
- No new Telegram trade/token-lookup commands.
- Phase 9 may add creator/wallet/bundle intelligence or controlled read-only ingestion — not execution.

## Phase 8: Test count
1231 passing tests (83 new Phase 8 tests + 1148 regression tests). 14 test files.

## Phase 9: Creator Intelligence v1

`packages/creator-intelligence` adds the first local creator intelligence layer.

### Phase 9: What is provided

- `CreatorProfile` — local creator identity model; `fixtureOnly: true`, `liveData: false`
- `CreatorLaunchHistorySnapshot` — local launch history metrics snapshot
- `CreatorSuccessScore`, `CreatorLaunchQualityScore`, `CreatorConsistencyScore`, `CreatorSuspiciousPatternScore` — deterministic component scores (0–100)
- `CreatorRiskFlag` — 14 risk flag codes
- `CreatorClassification` — 5 safe values (no trade wording)
- `CreatorIntelligenceCapabilities` — all unsafe fields false
- `CreatorIntelligenceResult` — complete result; safety invariants enforced
- `buildCreatorIntelligenceResult()`, `scoreCreatorProfile()`, `buildCreatorRiskFlags()`, `classifyCreator()`, `getCreatorIntelligenceCapabilities()`
- 6 fixture creator profiles for tests

### Phase 9: Limitations

- Fixture/local scoring only — no live data
- No wallet cluster intelligence (placeholder flags only)
- No bundle detector (placeholder flags only)
- No live provider connections
- No Solana RPC
- No wallet/private key handling
- No trade intents
- No transaction construction/signing/sending
- No trade execution
- FULL_AUTO and LIMITED_LIVE remain locked
- No new Telegram trade commands; no live creator lookup command

## Phase 9: Test count
1304 passing tests (73 new Phase 9 tests + 1231 regression tests). 15 test files.


## Phase 10: Wallet Cluster Intelligence v1

The `packages/wallet-intelligence` package provides:
- `WalletProfile` — local-only wallet identity model (no wallet access, no private keys)
- `WalletCluster` — local wallet cluster model with 9 cluster types
- `WalletClusterHistoryMetrics` — cluster history metrics snapshot
- `WalletQualityScore`, `ClusterQualityScore`, `LeaderFollowerScore`, `FreshWalletRiskScore`, `FundingSourceScore` — deterministic component scores (0–100)
- 16 `WalletClusterRiskFlag` codes
- `WalletClusterClassification` — 5 safe values (no trade/copy wording)
- `WalletClusterIntelligenceResult` — complete result (all action/trading/execution/copy flags false)
- `buildWalletClusterIntelligenceResult()`, `scoreWalletClusterGroup()`, `buildWalletClusterRiskFlags()`, `classifyWalletCluster()`, `getWalletIntelligenceCapabilities()`
- 7 deterministic synthetic fixture clusters

### Build wallet-intelligence package

```
pnpm --filter @sonic/wallet-intelligence build
```

### Phase 10: Limitations

- Fixture/local scoring only — no live data
- No bundle detector (placeholder flags only)
- No creator-wallet graph analysis (placeholder flags only)
- No live provider connections
- No Solana RPC
- No wallet/private key handling
- No copy trading
- No trade intents
- No transaction construction/signing/sending
- No trade execution
- FULL_AUTO and LIMITED_LIVE remain locked
- No new Telegram trade/wallet-lookup/copy-trading commands

## Phase 10: Test count
1366 passing tests (62 new Phase 10 tests + 1304 regression tests). 16 test files.

## Phase 11: Bundle / Manipulation Detector v1

The `packages/manipulation-detector` package provides:

- `BundleSignal` — local bundle/manipulation signal model (9 signal types)
- `ManipulationPattern` — local manipulation pattern model (9 pattern types)
- `CoordinatedActivitySnapshot` — coordinated activity counts per token
- `BundleRiskScore`, `WashTradeScore`, `CoordinationScore`, `FundingPatternScore`, `CreatorLinkScore` — deterministic component scores (0–100)
- 17 `ManipulationRiskFlag` codes
- `ManipulationClassification` — 5 safe values (no trade/copy wording)
- `ManipulationDetectionResult` — complete result (all action/trading/execution/enforcement flags false)
- `buildManipulationDetectionResult()`, `buildManipulationRiskFlags()`, `classifyManipulation()`, `getManipulationDetectorCapabilities()`
- 8 deterministic synthetic fixture groups

### Build manipulation-detector package

```
pnpm --filter @sonic/manipulation-detector build
```

### Phase 11: Limitations

- Fixture/local detection only — no live data
- No live bundle detector
- No live wash-trade detector
- No live funding-source analysis
- No live provider connections
- No Solana RPC
- No wallet/private key handling
- No enforcement actions
- No trade intents
- No transaction construction/signing/sending
- No trade execution
- FULL_AUTO and LIMITED_LIVE remain locked
- No new Telegram trade/enforcement commands

## Phase 11: Test count
1450 passing tests (84 new Phase 11 tests + 1366 regression tests). 17 test files.
