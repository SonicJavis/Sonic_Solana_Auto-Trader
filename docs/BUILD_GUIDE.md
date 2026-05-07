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

## Phase 26: Local Dashboard Interaction State and Filters

The `apps/dashboard` package provides a local read-only dashboard UI shell:

- Pure TypeScript components — no React, no DOM, no browser APIs for unsafe side effects
- Fixture-backed data from Phase 23 fixtures
- Renders Phase 24 view models as structured, typed output
- Adds deterministic in-memory interaction state/filter/selectors in `apps/dashboard/src/state/`
- No persistence/browser storage
- No network calls
- No live data
- No Solana RPC/provider APIs
- No wallets/private keys
- No execution/trading controls
- No mutation controls

The dashboard build command for Phase 25 (no browser bundle produced):

```
pnpm --filter @sonic/dashboard build
```

## Phase 24: Dashboard View Models

The `packages/dashboard-view-models` package provides deterministic local adapters and typed view models for dashboard data consumption:

- No UI rendering
- No network calls
- No live data
- No Solana RPC/provider APIs
- No wallets/private keys
- No execution/trading logic

Build only this package:

```
pnpm --filter @sonic/dashboard-view-models build
```

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

## Phase 13: Replay Lab v1

### What is the Replay Lab?

A local, deterministic model layer for replaying synthetic fixture scenarios across the intelligence stack. Fixture/local only — no live data, no RPC, no trading, no execution.

### Package: @sonic/replay-lab

- 8 deterministic fixture scenarios
- `runReplayScenario()` — execute a full scenario
- `compareReplayRuns()` — regression comparison between runs
- `getReplayLabCapabilities()` — all unsafe capability flags false

### Build replay-lab package

```
pnpm --filter @sonic/replay-lab build
```

### Phase 13: Limitations

- Fixture/local replay only — no live data
- No Solana RPC
- No provider APIs
- No wallet/private key handling
- No trade intents or execution plans
- No paper trading
- No trade execution
- FULL_AUTO and LIMITED_LIVE remain locked
- No new Telegram trade commands

## Phase 13: Test count
1600 passing tests (85 new Phase 13 tests + 1515 regression tests). 19 test files.

## Phase 14: Replay Reporting and Edge Diagnostics v1

A read-only, fixture-only, analysis-only reporting and diagnostics layer on top of Phase 13 Replay Lab. Evidence-review only — no live data, no RPC, no trading, no execution.

### Package: @sonic/replay-reporting

- `buildScenarioIndex()` — deterministic scenario index
- `buildReplayRunReport()` — per-run analysis report
- `buildReplayComparisonReport()` — regression comparison report
- `buildReplayDiagnostics()` — structured diagnostic findings
- `exportReplayReportJson()` — deterministic JSON export with safety validation
- `exportReplayReportMarkdown()` — safe Markdown export with safety footer
- `getReplayReportingCapabilities()` — all 11 unsafe capability flags false

### Build replay-reporting package

```
pnpm --filter @sonic/replay-reporting build
```

### Validation commands

```
pnpm install --no-frozen-lockfile  # if adding new package
pnpm typecheck
pnpm lint
pnpm test
```

### Phase 14: Safe usage notes

- All reports carry `fixtureOnly: true`, `liveData: false`, `safeToDisplay: true`
- Reports are evidence review aids only — they do not recommend or enable trading
- JSON exports validate all string content before export
- Markdown exports include a mandatory safety footer
- Validation rejects unsafe action text, secret patterns, and URL/RPC patterns

### Phase 14: Limitations

- Read-only, fixture-only, analysis-only — no live data
- No Solana RPC
- No provider APIs
- No wallet/private key handling
- No trade intents or execution plans
- No paper trading
- No trade execution
- No database writes
- No Telegram alerts
- FULL_AUTO and LIMITED_LIVE remain locked
- No new Telegram trade commands

### PR workflow reminder

- All changes go through PRs into `main`
- Do not commit directly to `main`
- Do not merge PRs without review
- Branch naming: `copilot/phase-N-description`

## Phase 14: Test count
1750 passing tests (150 new Phase 14 tests + 1600 regression tests). 20 test files.

## Phase 15: Strategy Intent Model v1

### New package: `@sonic/strategy-intent`

```bash
pnpm --filter @sonic/strategy-intent build
```

### Validation commands

```bash
pnpm install           # install/update workspace
pnpm typecheck         # TypeScript type checking
pnpm lint              # ESLint with max-warnings 0
pnpm test              # run all 1956 tests
```

### Safe usage notes

- `@sonic/strategy-intent` is **fixture-only, analysis-only, non-executable**
- Import only via the package barrel: `import { ... } from '@sonic/strategy-intent'`
- **StrategyIntent is NOT a real trade intent** — it is an internal analysis model for human review only
- Always validate outputs with `validateStrategyIntent()` before use
- Never interpret `StrategyFamily` or `StrategyIntentClassification` values as trade signals
- All inputs must have `fixtureOnly: true` and `liveData: false`
- Capabilities guard (`getStrategyIntentCapabilities()`) always returns all unsafe flags as `false`

### PR workflow reminder

- Work on feature branches only (e.g. `copilot/phase-15-*`)
- Never commit directly to `main`
- Never merge PRs locally — use the GitHub PR workflow only
- Run `pnpm typecheck && pnpm lint && pnpm test` before pushing

## Building @sonic/strategy-evaluation

```bash
pnpm --filter @sonic/strategy-evaluation build
```

### Safe usage notes for @sonic/strategy-evaluation

- `@sonic/strategy-evaluation` is **fixture-only, analysis-only, non-executable**
- Import only via the package barrel: `import { ... } from '@sonic/strategy-evaluation'`
- **StrategyEvaluation is NOT a real evaluation** — it is an internal analysis model for human review only
- Always validate outputs with `validateStrategyEvaluation()` before use
- Never interpret `StrategyEvaluationClassification` or score band values as trade signals
- All inputs must have `fixtureOnly: true` and `liveData: false`
- Capabilities guard (`getStrategyEvaluationCapabilities()`) always returns all unsafe flags as `false`
- Markdown exports always include the mandatory safety footer


## Building @sonic/evidence-ledger

```bash
pnpm --filter @sonic/evidence-ledger build
```

### Safe usage notes for @sonic/evidence-ledger

- `@sonic/evidence-ledger` is **fixture-only, analysis-only, non-executable, append-only**
- Import only via the package barrel: `import { ... } from '@sonic/evidence-ledger'`
- **EvidenceLedger is NOT a trading ledger** — it is a fixture-only, append-only, audit-style reasoning record for human review
- Always validate outputs with `validateEvidenceLedger()` before use
- Never interpret `DecisionTraceClassification` values as trade signals or actionable decisions
- All inputs must have `fixtureOnly: true` and `liveData: false`
- Capabilities guard (`getEvidenceLedgerCapabilities()`) always returns all unsafe flags as `false`, including `canMutatePriorEvidence: false`
- Prior evidence cannot be mutated — `appendOnly: true` is enforced on all outputs
- Markdown exports always include the mandatory safety footer stating prior evidence cannot be mutated
- Integrity checks (`checkEvidenceIntegrity()`) must pass before using ledger outputs
- See [docs/EVIDENCE_LEDGER.md](./EVIDENCE_LEDGER.md) for full documentation

### PR workflow reminder

- Work on feature branches only (e.g. `copilot/phase-17-*`)
- Never commit directly to `main`
- Never merge PRs locally — use the GitHub PR workflow only
- Run `pnpm typecheck && pnpm lint && pnpm test` before pushing

## Phase 18: Dashboard Read Models

### Validation commands

```bash
pnpm install
pnpm typecheck
pnpm lint
pnpm test
```

### Safe usage notes for @sonic/dashboard-read-models

- `@sonic/dashboard-read-models` is **fixture-only, analysis-only, non-executable, read-only**
- Import only via the package barrel: `import { ... } from '@sonic/dashboard-read-models'`
- **DashboardReadModels are NOT a trading system** — they are fixture-only, read-only data-shaping objects for future UI review
- Always validate outputs with `validateDashboardReadModelBundle()` before use
- Never interpret `DashboardReadModelSeverity` values as trade signals or actionable decisions
- All inputs must have `fixtureOnly: true` and `liveData: false`
- Capabilities guard (`getDashboardReadModelCapabilities()`) always returns all unsafe flags as `false`, including `canRenderUi: false`
- No UI rendering capability — `canRenderUi: false` is permanently enforced
- Markdown exports always include the mandatory safety footer
- See [docs/DASHBOARD_READ_MODELS.md](./DASHBOARD_READ_MODELS.md) for full documentation

### PR workflow reminder

- Work on feature branches only (e.g. `copilot/phase-18-*`)
- Never commit directly to `main`
- Never merge PRs locally — use the GitHub PR workflow only
- Run `pnpm typecheck && pnpm lint && pnpm test` before pushing

## Phase 19: Local Read-Only API Contracts v1

### New package: `@sonic/read-only-api-contracts`

```bash
pnpm --filter @sonic/read-only-api-contracts build
```

### Validation commands

```bash
pnpm install --no-frozen-lockfile  # if adding new package
pnpm typecheck                     # TypeScript type checking
pnpm lint                          # ESLint with max-warnings 0
pnpm test                          # run all 2817 tests
```

### Safe usage notes for @sonic/read-only-api-contracts

- `@sonic/read-only-api-contracts` is **fixture-only, analysis-only, non-executable, read-only, contract-only**
- Import only via the package barrel: `import { ... } from '@sonic/read-only-api-contracts'`
- **ReadOnlyApiContracts are NOT an API server, HTTP listener, UI, or trading system** — they are fixture-only, contract-only TypeScript models describing future API boundary contracts
- Always validate outputs with `validateReadOnlyApiContractBundle()` before use
- Never interpret endpoint contract metadata as live routing or handler registration
- All inputs must have `fixtureOnly: true` and `liveData: false`
- Capabilities guard (`getReadOnlyApiCapabilities()`) always returns all unsafe flags as `false`, including `canStartHttpServer: false`, `canOpenNetworkPort: false`, `canUseApiFramework: false`
- OpenAPI-like shape export is for documentation/planning only — no live server config, no real URLs
- See [docs/READ_ONLY_API_CONTRACTS.md](./READ_ONLY_API_CONTRACTS.md) for full documentation

### PR workflow reminder

- Work on feature branches only (e.g. `copilot/phase-19-*`)
- Never commit directly to `main`
- Never merge PRs locally — use the GitHub PR workflow only
- Run `pnpm typecheck && pnpm lint && pnpm test` before pushing

## Phase 19: Test count
2817 passing tests (226 new Phase 19 tests + 2591 regression tests). 25 test files.

## Phase 20: @sonic/read-only-api usage

- `@sonic/read-only-api` is **localhost-only, GET-only, fixture-only, read-only, analysis-only, non-executable**
- Import only via the package barrel: `import { ... } from '@sonic/read-only-api'`
- **LocalReadOnlyApi is NOT a trading system, live data source, or UI** — it is a localhost-only Fastify API shell serving safe fixture/contract responses
- `createReadOnlyApiApp()` **does NOT listen** — use with `inject()` for tests; call `startReadOnlyApiServer()` explicitly to open a port
- Default host `127.0.0.1`, default port `3140`
- All external bind hosts are rejected: `0.0.0.0`, `::`, `localhost`, external IPs/hostnames, URL-looking strings
- Always validate config with `createReadOnlyApiConfig()` before use
- Capabilities guard (`getLocalReadOnlyApiCapabilities()`) returns all unsafe flags as `false`; `canStartLocalhostServer: true` for 127.0.0.1 only
- All responses include safety metadata: `fixtureOnly: true`, `liveData: false`, `safeToDisplay: true`, `analysisOnly: true`, `nonExecutable: true`, `readOnly: true`, `localOnly: true`
- See [docs/LOCAL_READ_ONLY_API.md](./LOCAL_READ_ONLY_API.md) for full documentation

### PR workflow reminder

- Work on feature branches only (e.g. `copilot/phase-20-*`)
- Never commit directly to `main`
- Never merge PRs locally — use the GitHub PR workflow only
- Run `pnpm typecheck && pnpm lint && pnpm test` before pushing

## Phase 20: Test count
3050 passing tests (233 new Phase 20 tests + 2817 regression tests). 26 test files.

## Phase 21: @sonic/read-only-api query/filter/pagination usage

Phase 21 extends `@sonic/read-only-api` with safe, deterministic, fixture-only query parsing, filtering, sorting, and pagination helpers.

### Safe query usage

```typescript
import {
  parseReadOnlyApiQuery,
  buildReadOnlyApiQueryResult,
  applyReadOnlyApiFilters,
  applyReadOnlyApiSorting,
  applyReadOnlyApiPagination,
  buildReadOnlyApiPagination,
  encodeCursor,
  decodeCursor,
  validateReadOnlyApiQuerySafety,
} from '@sonic/read-only-api';

// Parse query params from a request (unknown input)
const queryResult = parseReadOnlyApiQuery(req.query);
if (!queryResult.ok) {
  // Handle parse error — never throws
}
const q = queryResult.value;
// q.limit, q.offset, q.cursor, q.severity, q.panel, q.sortBy, etc.
```

### Endpoint query parameters (Phase 21)

The following GET endpoints now accept optional query params:

```
GET /dashboard?limit=10&sortBy=severity&sortDirection=desc
GET /dashboard/evidence?severity=high&panel=evidence&limit=5&offset=0
GET /dashboard/safety?limit=10&cursor=<nextCursor>
```

### Safety invariants (Phase 21)

- All query parsing is **fixture-only and in-memory** — no live lookups
- Only bounded enum values are accepted for filter fields
- Only explicit allow-listed sort fields are accepted (id, severity, sourceKind, classification, createdAt, label, status, panel)
- Max limit: 100, Default limit: 25
- Negative offset/limit values are rejected
- Unsafe text (secrets, URLs, action terms) in query params is rejected
- SQL-like patterns, eval-like expressions, path traversal, and script patterns are rejected
- `applyReadOnlyApiFilters`, `applyReadOnlyApiSorting`, `applyReadOnlyApiPagination` **never mutate input arrays**
- Cursors are opaque base64url-encoded offsets — no external lookups
- See [docs/LOCAL_READ_ONLY_API_QUERY.md](./LOCAL_READ_ONLY_API_QUERY.md) for full documentation

### PR workflow reminder

- Work on feature branches only (e.g. `copilot/phase-21-*`)
- Never commit directly to `main`
- Never merge PRs locally — use the GitHub PR workflow only
- Run `pnpm typecheck && pnpm lint && pnpm test` before pushing

## Phase 21: Test count
3305 passing tests (255 new Phase 21 tests + 3050 regression tests). 27 test files.

## Phase 23: @sonic/read-only-api-client consumer SDK usage

Phase 23 adds `packages/read-only-api-client` — a typed local in-process consumer SDK.

```typescript
import {
  createReadOnlyApiClient,
  buildReadOnlyApiRequest,
  buildReadOnlyApiQuery,
  parseReadOnlyApiEnvelope,
  isReadOnlyApiSuccessEnvelope,
  HEALTH_SUCCESS_FIXTURE,
  listReadOnlyApiContractFixtures,
} from '@sonic/read-only-api-client';

// Create an in-process client (no network, no port binding)
const client = createReadOnlyApiClient();
const req = client.buildRequest('/health');
const req2 = client.buildRequest('/dashboard', { limit: 10, severity: 'high' });

// Build validated queries
const queryResult = buildReadOnlyApiQuery({ limit: 10, sortBy: 'id' });

// Parse envelopes
const result = parseReadOnlyApiEnvelope(someEnvelope);
if (result.ok) { /* result.data, result.meta */ }

// Use fixtures
const all = listReadOnlyApiContractFixtures(); // 10 fixtures
```

## Phase 23: Test count
4087 passing tests (336 new Phase 23 tests + 3751 regression tests). 29 test files.
