# Architecture

## Phase 35 Update

Phase 35 adds `apps/dashboard/src/composite-evidence-fixtures/` with a deterministic composite evidence dashboard/report fixture layer. It bridges Phase 33 composite evidence models and Phase 34 report integration models into the existing local dashboard/report fixture ecosystem, providing 16 typed, serializable, synthetic-only fixtures (9 dashboard, 4 report, 3 combined) for future dashboard, report, and replay workflows. This layer is local-only, read-only, fixture-backed, deterministic, in-memory, external-network-free, non-advisory, and non-accusatory.

## Phase 34 Update

Phase 34 extends `packages/offline-intelligence/` with a deterministic report-integration layer in `src/report-integration/`. It transforms synthetic Phase 33 composite evidence fixtures into report-ready local models and sections (summary, risk, quality, confidence, source references, weighting, safety boundary) for future dashboard/report/replay/serialization workflows. This layer is local-only, read-only, fixture-backed, deterministic, in-memory, external-network-free, non-advisory, and non-accusatory.

## Phase 33 Update

Phase 33 adds a new top-level package `packages/offline-intelligence/` with a deterministic composite offline-intelligence fixture-model layer. It combines synthetic cross-references to Phase 30 (creator-intelligence), Phase 31 (wallet-intelligence), and Phase 32 (manipulation-detector) fixture outputs into 16 unified composite evidence fixtures. This layer is local-only, read-only, fixture-backed, deterministic, in-memory, external-network-free, non-advisory, and non-accusatory.

## Phase 32 Update

Phase 32 extends `packages/manipulation-detector/` with a deterministic manipulation-evidence fixture-model layer for synthetic bundle-like, launch-structure, liquidity, coordination, concentration, and funding evidence fixtures. This layer is local-only, read-only, fixture-backed, deterministic, in-memory, external-network-free, non-advisory, and non-accusatory.

## Phase 30 Update

Phase 30 extends `packages/creator-intelligence/` with a deterministic creator-intelligence fixture-model layer for synthetic creator/profile/project/narrative/social/disclosure/engagement intelligence fixtures. This layer is local-only, read-only, fixture-backed, deterministic, in-memory, and external-network-free.

Monorepo with pnpm workspaces.

## Packages
- `shared`: Types, constants, utilities, `RuntimeSafetyStatus`
- `config`: Zod env validation, secret redaction, config provenance
- `observability`: Pino structured logging
- `db`: SQLite + Drizzle ORM persistent audit repository; `InMemoryAuditLogger` fallback
- `mode-manager`: Mode state machine (transitions persisted to audit DB in Phase 4)
- `risk-engine`: Safety gates
- `pump-adapter`: Pump adapter interfaces, quote models, instruction intent models, and disabled SDK wrapper boundary (Phases 6A/6B/6C, inert — no RPC, no execution, no real Pump SDK, no Solana SDK)
- `event-engine`: Local in-memory event bus, event envelope types, source status models, dedupe/TTL helpers, validation, disabled provider boundaries, mock provider, fixture events and replay, disabled provider config/readiness (Phases 7A/7B/7C/7D — no network, no execution)
- `token-intelligence`: Local token profile models, deterministic component scoring, risk flags, classification, fixture profiles, token intelligence engine (Phase 8 — no network, no Solana RPC, no provider APIs, no execution)
- `creator-intelligence`: Local creator profile models, deterministic component scoring, risk flags, classification, fixture profiles, creator intelligence engine, and Phase 30 creator/profile/project/narrative/social/disclosure/engagement fixture models with validation and safety validation (no network, no Solana RPC, no provider APIs, no wallet data, no execution, no social APIs, no scraping, no identity resolution)
- `wallet-intelligence`: Local wallet profile models, wallet cluster models, deterministic component scoring (wallet quality, cluster quality, leader-follower, fresh-wallet risk, funding source), risk flags, classification, fixture clusters, wallet cluster intelligence engine (Phase 10 — no network, no Solana RPC, no provider APIs, no wallet data, no private keys, no copy trading, no execution)
- `manipulation-detector`: Local bundle/manipulation detector models, deterministic component scoring (bundle risk, wash trade, coordination, funding pattern, creator link), risk flags, classification, 8 synthetic fixture groups, manipulation detector engine, and Phase 32 manipulation-evidence fixture models with validation and safety validation (no network, no Solana RPC, no provider APIs, no live bundle detection, no live wash-trade detection, no Jito/MEV/mempool integration, no enforcement actions, no trade intents, no execution)
- `offline-intelligence`: Phase 33 composite offline-intelligence fixture-model layer plus Phase 34 report-integration layer; combines synthetic cross-references to Phase 30/31/32 fixture outputs into 16 unified composite evidence fixtures, then transforms them into 16 deterministic report-integration fixtures with summary/risk/quality/confidence/source-reference/weighting/safety-boundary sections, validation, safety validation, and builders (no network, no Solana RPC, no provider APIs, no live data, no wallets, no Jito/MEV/mempool, no execution, no investment advice, no accusations, no external network, no file export/download behavior)
- `replay-lab`: Local deterministic replay lab model layer; replays synthetic fixture scenarios across the intelligence stack; 8 fixture scenarios, step/scenario/run/comparison models, deterministic verdict engine, regression comparison utilities (Phase 13 — no network, no Solana RPC, no provider APIs, no live data, no trade intents, no execution plans, no paper trading, no trade execution)
- `replay-reporting`: Read-only, fixture-only, analysis-only reporting and diagnostics layer on top of Replay Lab; scenario indexing, run reports, comparison reports, diagnostics, JSON/Markdown export (Phase 14 — no network, no Solana RPC, no provider APIs, no live data, no trade intents, no execution plans, no paper trading, no trade execution, no database writes)
- `strategy-intent`: Fixture-only, analysis-only, non-executable strategy intent model layer above Replay Lab and Replay Reporting; classifies fixture evidence into strategy families, evidence quality, safety gates, rationale, and StrategyIntent outputs (Phase 15 — no network, no Solana RPC, no provider APIs, no live data, no real trade intents, no execution plans, no paper trading, no trade execution, no transactions)
- `strategy-evaluation`: Fixture-only, analysis-only, non-executable strategy evaluation reports layer above Strategy Intent; score band summaries, evidence distributions, safety gate summaries, family comparisons, findings, JSON/Markdown export (Phase 16 — no network, no Solana RPC, no provider APIs, no live data, no real trade intents, no execution plans, no paper trading, no trade execution, no transactions)
- `evidence-ledger`: Safe, fixture-only, append-only, analysis-only, non-executable Evidence Ledger and Decision Trace layer above Strategy Evaluation; records audit-style reasoning records for why prior-phase outputs reached their conclusions; source references, evidence entries, decision traces, trace summaries, integrity checks, JSON/Markdown export (Phase 17 — no network, no Solana RPC, no provider APIs, no live data, no real trade intents, no execution plans, no paper trading, no trade execution, no transactions, no evidence mutation)
- `dashboard-read-models`: Safe, fixture-only, read-only, analysis-only, non-executable dashboard read model layer above Evidence Ledger; shapes Replay Lab, Replay Reporting, Strategy Intent, Strategy Evaluation, and Evidence Ledger fixture outputs into panel-shaped read models for future UI review; overview model, replay panel, strategy panel, evaluation panel, evidence panel, safety panel, bundle builder, JSON/Markdown export, 6 deterministic fixtures (Phase 18 — no network, no Solana RPC, no provider APIs, no live data, no real trade intents, no execution plans, no paper trading, no trade execution, no transactions, no evidence mutation, no UI rendering)
- `read-only-api-contracts`: Safe, fixture-only, read-only, analysis-only, non-executable, contract-only local API boundary contract models above Dashboard Read Models; 9 endpoint contracts, health contract, dashboard contract, evidence contract, safety contract, bundle builder, JSON export, OpenAPI-like documentation shape, response envelopes, 6 deterministic fixtures (Phase 19 — no API server, no HTTP listener, no network port, no Fastify/Hono/tRPC/Express, no network, no Solana RPC, no provider APIs, no live data, no real trade intents, no execution plans, no paper trading, no trade execution, no transactions, no evidence mutation, no UI rendering)
- `dashboard-view-models`: Local read-only dashboard adapter and typed view-model layer above Phase 22/23 envelopes/fixtures; deterministic health/capabilities/overview/evidence/safety models, combined dashboard model, and safe empty/loading/error/unavailable states for future UI consumers (Phase 24 — no UI rendering, no network, no Solana RPC, no provider APIs, no wallets, no trading, no execution)
- `state`: Safe read models for system, config, mode, audit, worker, health readiness, Phase 7E Event Engine/provider readiness + Phase 8 readiness gate, and Phase 8 Token Intelligence static status
- `testing`: Shared test utilities

## Apps
- `telegram-bot`: Telegram command interface (uses `SqliteAuditRepository`)
- `worker`: Safe heartbeat loop (DB init + retention on startup)
- `dashboard`: Phase 25 local read-only dashboard UI shell + Phase 26 local interaction state layer. Pure TypeScript, fixture-backed, no React/DOM, no network, no wallet, no trading/execution controls. Components: DashboardShell, SafetyBanner, MetadataPanel, HealthPanel, CapabilitiesPanel, OverviewPanel, EvidencePanel, SafetyPanel, EmptyState, LoadingState, ErrorState, UnavailableState, StatusBadge. State: deterministic in-memory active panel/visibility/filter/sort/reset/selectors in `apps/dashboard/src/state/`. Renders Phase 24 view models from Phase 23 fixtures only.

## Phase 7B: Disabled Provider Boundaries

Phase 7B extends `packages/event-engine` with disabled read-only provider boundary models. See [docs/EVENT_ENGINE.md](./EVENT_ENGINE.md) for full details.

```
packages/event-engine/src/
  provider-types.ts        — EventProviderType (6 disabled types), EventProviderStatus
  provider-capabilities.ts — EventProviderConfig, EventProviderCapabilities,
                             DISABLED_PROVIDER_CONFIG, DISABLED_PROVIDER_CAPABILITIES,
                             PHASE_7B_PROVIDER_CAPABILITIES
  disabled-provider.ts     — ProviderErrorCode (13 safe codes), ProviderError,
                             ProviderResult<T>, EventProviderBoundary interface,
                             DisabledEventProvider class
  provider-factory.ts      — createDisabledEventProvider (fail-closed), named helpers
  provider-registry.ts     — EventProviderRegistry, getEventProviderRegistry
```

No Helius SDK. No WebSocket client. No Yellowstone/Geyser. No `@solana/web3.js`.
No network, no Solana RPC, no wallets, no execution.
All `EventProviderCapabilities` flags are `false`.
`FULL_AUTO` and `LIMITED_LIVE` remain locked.

## Phase 7A/7B/7C/7D/7E: Event Engine Core + Disabled Providers + Mock Providers + Provider Config/Readiness + Readiness Surface

Phase 7A adds the local in-memory event engine package. Phase 7B adds disabled provider boundaries. Phase 7C adds controlled mock providers and replayable fixture events. Phase 7D adds disabled provider configuration models and readiness checks. Phase 7E surfaces provider readiness into `@sonic/state` and adds the Phase 8 Token Intelligence readiness gate. Phase 8 adds the `@sonic/token-intelligence` package with local token profile models, deterministic scoring, risk flags, and classification. See [docs/EVENT_ENGINE.md](./EVENT_ENGINE.md) and [docs/TOKEN_INTELLIGENCE.md](./TOKEN_INTELLIGENCE.md) for full details.

```
packages/event-engine/src/
  ... (Phase 7A–7D files unchanged)
  provider-config.ts      — Phase 7D: ProviderConfigSafe, validateProviderConfig
  provider-readiness.ts   — Phase 7D: ProviderReadinessReport, buildProviderReadinessReport

packages/state/src/
  event-engine-read-model.ts — Phase 7E: EventEngineReadinessSnapshot, ProviderReadinessSummary,
                                Phase8ReadinessGate, buildEventEngineReadinessSnapshot,
                                buildPhase8ReadinessGate, PHASE_7E_EVENT_ENGINE_SUMMARY
```

Telegram `/system engine` — Event Engine local-only status and provider readiness.
Telegram `/system phase8` — Phase 8 Token Intelligence readiness gate.

Phase 8 readiness means ready to build Token Intelligence models locally — NOT live data, trading, or execution.

```
packages/event-engine/src/
  types.ts                — EventCategory, EventSourceType (incl. mock_provider), EventSeverity
  event-envelope.ts       — EventEnvelope, EventPayload
  source-status.ts        — EventSourceStatus, EventSourceCapabilities, EventSourceHealth
                            EventEngineSystemStatus, PHASE_7A_SOURCE_CAPABILITIES
  errors.ts               — EventEngineErrorCode (28 codes), EventEngineError, EventEngineResult
  event-bus.ts            — IEventBus, SubscriptionId, EventBusStats, EventHandler
  in-memory-event-bus.ts  — InMemoryEventBus, createInMemoryEventBus, buildTestEvent
  dedupe.ts               — DedupeStore, isEventExpired, buildDedupeKey, ClockFn
  validation.ts           — validateEventEnvelope and helper validators
  disabled-provider.ts    — EventProviderType (6 disabled), EventProviderCapabilities (12 false),
                            PHASE_7B_PROVIDER_CAPABILITIES, DisabledEventProvider,
                            createDisabledEventProvider, EventProviderBoundary,
                            EventProviderRegistry, buildDisabledProviderRegistry
  replay-types.ts         — ReplayStatus, ReplayStats, ReplayResult
  fixture-events.ts       — FixtureEvent, validateFixtureEvent, BUILTIN_FIXTURE_EVENTS,
                            FIXTURE_SYSTEM_STARTUP, FIXTURE_PUMP_ADAPTER_STATUS,
                            FIXTURE_FUTURE_CHAIN_PLACEHOLDER, FIXTURE_SAFETY_EVENT
  fixture-sequence.ts     — FixtureSequence, validateFixtureSequence, buildFixtureSequence,
                            BUILTIN_SEQUENCE_ALL, MAX_FIXTURE_SEQUENCE_LENGTH
  mock-provider.ts        — MockProviderStatus, MockProviderCapabilities,
                            MOCK_PROVIDER_CAPABILITIES, ControlledMockProvider,
                            createControlledMockProvider
  replay-controller.ts    — replayFixtureSequence, replayAndCollect, ReplayOptions
  index.ts                — public barrel (all phases)
```

No dependency on other `@sonic/*` packages.
No network, no Solana RPC, no wallets, no execution, no live providers.
All capability flags are `false` except `canReplayFixtureEvents: true` in mock provider.
`FULL_AUTO` and `LIMITED_LIVE` remain locked.

## Phase 8: Token Intelligence v1

```
packages/token-intelligence/src/
  token-profile.ts              — TokenProfile, TokenMetricSnapshot (local model, fixtureOnly: true, liveData: false)
  score-types.ts                — MetadataQualityScore, CurveQualityScore, HolderConcentrationScore,
                                  LiquidityQualityScore, OrganicMomentumScore, TokenComponentScores
  metadata-score.ts             — scoreMetadata() — deterministic metadata quality scoring
  curve-score.ts                — scoreCurve() — bonding curve progress scoring
  holder-score.ts               — scoreHolderConcentration() — holder distribution scoring
  liquidity-score.ts            — scoreLiquidity() — virtual liquidity scoring
  momentum-score.ts             — scoreMomentum() — buy/sell balance and volume trend scoring
  risk-flags.ts                 — TokenRiskFlag (13 codes), TokenRiskFlagEntry, makeRiskFlag(),
                                  hasCriticalFlag(), filterFlagsBySeverity()
  classifier.ts                 — TokenClassification (5 safe values), TOKEN_CLASSIFICATIONS,
                                  isTokenClassification(), isClassificationSafe()
  types.ts                      — TokenIntelligenceCapabilities (all unsafe false), TokenIntelligenceResult
  errors.ts                     — TokenIntelligenceError, TiResult<T>, tiOk(), tiErr(), isTiOk(), isTiErr()
  validation.ts                 — validateTokenProfile(), validateTokenMetrics(), validateTokenMint(),
                                  validateScoreBounds(), validateConfidenceBounds()
  fixtures.ts                   — 5 deterministic synthetic fixture profiles + metrics, ALL_FIXTURE_TOKEN_PAIRS
  token-intelligence-engine.ts  — scoreTokenProfile(), buildTokenRiskFlags(), classifyToken(),
                                  buildTokenIntelligenceResult(), getTokenIntelligenceCapabilities()
  index.ts                      — public barrel (all Phase 8 exports)

packages/state/src/
  token-intelligence-read-model.ts — Phase 8: TokenIntelligenceStatusSnapshot,
                                      PHASE_8_TOKEN_INTELLIGENCE_STATUS,
                                      buildTokenIntelligenceStatusSnapshot()
```

No dependency on Solana SDK, provider SDKs, wallet libraries, or any other `@sonic/*` package.
No network, no Solana RPC, no provider APIs, no live data, no market data ingestion.
All `TokenIntelligenceCapabilities` unsafe flags are `false`.
`actionAllowed`, `tradingAllowed`, `executionAllowed` always `false` in every result.
`FULL_AUTO` and `LIMITED_LIVE` remain locked.

See [docs/TOKEN_INTELLIGENCE.md](./TOKEN_INTELLIGENCE.md) for full details.

## Phase 9: Creator Intelligence v1

```
packages/creator-intelligence/src/
  creator-profile.ts              — CreatorProfile, CreatorProfileSource (local model, fixtureOnly: true, liveData: false)
  creator-history.ts              — CreatorLaunchHistorySnapshot (local model, fixtureOnly: true, liveData: false)
  score-types.ts                  — CreatorSuccessScore, CreatorLaunchQualityScore, CreatorConsistencyScore,
                                    CreatorSuspiciousPatternScore, CreatorComponentScores
  success-score.ts                — scoreSuccess() — deterministic launch success scoring
  launch-quality-score.ts         — scoreLaunchQuality() — average launch quality scoring
  consistency-score.ts            — scoreConsistency() — creator consistency scoring
  suspicious-pattern-score.ts     — scoreSuspiciousPatterns() — safety quality scoring (higher = safer)
  risk-flags.ts                   — CreatorRiskFlag (14 codes), CreatorRiskFlagEntry, makeCreatorRiskFlag(),
                                    hasCreatorCriticalFlag(), filterCreatorFlagsBySeverity()
  classifier.ts                   — CreatorClassification (5 safe values), CREATOR_CLASSIFICATIONS,
                                    isCreatorClassification(), isCreatorClassificationSafe()
  types.ts                        — CreatorIntelligenceCapabilities (all unsafe false), CreatorIntelligenceResult
  errors.ts                       — CreatorIntelligenceError, CiResult<T>, ciOk(), ciErr(), isCiOk(), isCiErr()
  validation.ts                   — validateCreatorProfile(), validateCreatorHistory(), validateCreatorId(),
                                    validateCreatorAddress(), validateCreatorScoreBounds(),
                                    validateCreatorConfidenceBounds()
  fixtures.ts                     — 6 deterministic synthetic fixture profiles + histories, ALL_FIXTURE_CREATOR_PAIRS
  creator-intelligence-engine.ts  — scoreCreatorProfile(), buildCreatorRiskFlags(), classifyCreator(),
                                    buildCreatorIntelligenceResult(), getCreatorIntelligenceCapabilities()
  index.ts                        — public barrel (all Phase 9 exports)
```

No dependency on Solana SDK, provider SDKs, wallet libraries, or any other `@sonic/*` package.
No network, no Solana RPC, no provider APIs, no live data, no live creator/wallet/funding-source fetching.
No wallet cluster intelligence (placeholder flags only). No bundle detector (placeholder flags only).
All `CreatorIntelligenceCapabilities` unsafe flags are `false`.
`actionAllowed`, `tradingAllowed`, `executionAllowed` always `false` in every result.
`FULL_AUTO` and `LIMITED_LIVE` remain locked.

See [docs/CREATOR_INTELLIGENCE.md](./CREATOR_INTELLIGENCE.md) for full details.

```
packages/db/src/
  types.ts          — PersistentAuditRecord, AuditQueryFilters, RetentionPolicy, AuditStats
  schema.ts         — Drizzle audit_events schema
  client.ts         — openDatabase() → { client, sqlite }
  migrate.ts        — ensureDataDir(), initSchema() (CREATE TABLE IF NOT EXISTS)
  audit-repository.ts — SqliteAuditRepository implements IAuditRepository
  audit-logger.ts   — InMemoryAuditLogger implements IAuditRepository
  retention.ts      — applyRetention(), buildRetentionPolicy()
  index.ts          — barrel exports
```

## audit_events Table

| Column       | Type | Notes                              |
|--------------|------|------------------------------------|
| id           | TEXT | UUID primary key                   |
| timestamp    | TEXT | ISO 8601                           |
| phase        | TEXT | e.g. "Phase 4"                     |
| event_type   | TEXT | e.g. SYSTEM_STARTUP                |
| severity     | TEXT | debug/info/warn/error/critical     |
| source       | TEXT | worker/telegram/retention/...      |
| mode         | TEXT | current app mode at event time     |
| message      | TEXT | human-readable summary             |
| details_json | TEXT | JSON, redacted before storage      |
| safe_summary | TEXT | optional short summary, redacted   |
| created_at   | TEXT | INSERT time (datetime('now'))      |

## Safety Invariants (Phase 4)

- Worker fails closed if DB init fails
- Retention failure is warn only (RETENTION_FAILED event recorded)
- `DATABASE_URL`, `TELEGRAM_BOT_TOKEN` raw values never persisted
- Circular references in `details` handled safely
- No Solana RPC, signing, sending, wallets, Jito, Pump.fun in any path
- `FULL_AUTO` and `LIMITED_LIVE` remain locked

## Phase 5: State / Read-Model Layer

```
packages/state/src/
  types.ts              — SystemStateSnapshot, ConfigStateSnapshot, ModeStateSnapshot,
                          RuntimeSafetyStateSnapshot, AuditStateSnapshot, WorkerStateSnapshot,
                          DatabaseStateSnapshot, UnsafeFlagStateSnapshot, SystemReadiness
  audit-read-model.ts   — buildAuditStateSnapshot() — stats, timestamps from IAuditRepository
  config-read-model.ts  — buildConfigStateSnapshot() — safe config (no raw secrets)
  mode-read-model.ts    — buildModeStateSnapshot() — mode, locked modes, safety status
  worker-read-model.ts  — buildWorkerStateSnapshot() — health from heartbeat age
  health-read-model.ts  — calculateReadiness() — ready/degraded/unsafe/unknown rules
  state-service.ts      — buildSystemStateSnapshot() — top-level aggregator
  index.ts              — barrel exports
```

## Package dependency graph (Phase 5)

```
shared ← config ← db ← mode-manager ← state ← apps/telegram-bot
                                             ← apps/worker
```

`packages/state` depends on: shared, config, db, mode-manager.
`packages/state` does NOT depend on: apps/telegram-bot, apps/worker.
No circular imports.

## State Snapshot Safety Invariants (Phase 5)

- All snapshots are read-only — no state mutation
- No raw DATABASE_URL in any snapshot
- No raw TELEGRAM_BOT_TOKEN in any snapshot
- No raw detailsJson exposed (only stats and safe timestamps)
- No private keys, seed phrases, mnemonic, or credentials in any snapshot
- FULL_AUTO and LIMITED_LIVE remain locked
- No Solana RPC, market data, wallets, signing, sending, Jito, Pump.fun in any path

## Phase 6A: Pump Adapter Package

```
packages/pump-adapter/src/
  venue-types.ts          — PumpVenueType, PumpAdapterStatus, PumpAdapterStatusReport
  quote-types.ts          — PumpQuoteSide, PumpQuoteInputUnit, PumpQuoteRequest,
                            PumpBuyQuoteRequest, PumpSellQuoteRequest, PumpQuoteResult
  bonding-curve-types.ts  — BondingCurveState (mock-safe, not fetched from chain)
  errors.ts               — PumpAdapterErrorCode, PumpAdapterError, PumpAdapterResult,
                            pumpOk(), pumpErr(), isPumpOk(), isPumpErr()
  adapter.ts              — PumpAdapter interface (all methods inert in Phase 6A)
  safety.ts               — PUMP_ADAPTER_CAPABILITIES guard (all false), getPumpAdapterCapabilities()
  validation.ts           — validateTokenMint, validateInputAmount, validateSlippageBps,
                            validateRequestedAt, validateQuoteRequest
  mock-adapter.ts         — MockPumpAdapter, createDisabledMockAdapter(), createAvailableMockAdapter()
  types.ts                — re-exported convenience type barrel
  index.ts                — barrel exports
```

## Package dependency graph (Phase 6A)

```
shared ← config ← db ← mode-manager ← state ← apps/telegram-bot
                                             ← apps/worker

pump-adapter  (no dependencies on any other package — pure TypeScript models)
```

`packages/pump-adapter` has NO dependencies on: shared, config, db, mode-manager, state, apps.
`packages/pump-adapter` does NOT import: @solana/web3.js, Pump SDK, wallet libraries, RPC clients.
No circular imports.

## Phase 6A Safety Invariants

- All pump adapter capability flags are permanently false
- `PumpAdapterStatusReport.isLiveCapable` is always false; `executionForbidden` is always true
- No Solana RPC calls in any code path
- No transaction building, construction, simulation, signing, or sending
- No wallet or private key access
- No Pump.fun buying/selling, no PumpSwap buying/selling, no Jito
- Quote results marked `isMockResult: true` — not executed trades
- Bonding curve state marked `isMockState: true` — not fetched from chain
- All errors carry `safeToDisplay: true`
- FULL_AUTO and LIMITED_LIVE remain locked
- No new Telegram trade/quote commands

## Phase 6B: Instruction Intent Models

```
packages/pump-adapter/src/
  instruction-intent-types.ts — PumpInstructionIntentType, PumpTradeSide, PumpInstructionIntent
  transaction-plan-types.ts   — PumpTransactionPlanType, PumpTransactionPlan
  builder-types.ts            — Phase6BWarningCode, Phase6BErrorCode, Phase6BErrorResult,
                                Phase6BBuilderCapabilities, PumpInstructionBuilderRequest,
                                PumpInstructionBuilderResult
  instruction-builder.ts      — PumpInstructionIntentBuilder interface
  instruction-validation.ts   — phase6bError, validateAllowExecutableInstructions,
                                validateBuilderQuote, validateBuilderVenue, etc.
  mock-instruction-builder.ts — MockInstructionBuilder, PHASE_6B_BUILDER_CAPABILITIES,
                                getPhase6BBuilderCapabilities(), createMockInstructionBuilder()
```

## Phase 6C: Disabled SDK Wrapper Boundary

```
packages/pump-adapter/src/
  sdk-wrapper-types.ts     — PumpSdkWrapperMode, PumpSdkWrapperStatus, PumpSdkWrapperConfig,
                             PumpSdkWrapperCapabilities, PumpSdkWrapperErrorCode,
                             PumpSdkWrapperDisabledResult, PumpSdkWrapper interface,
                             DISABLED_WRAPPER_CONFIG, PUMP_SDK_WRAPPER_CAPABILITIES
  disabled-sdk-wrapper.ts  — DisabledPumpSdkWrapper, DISABLED_PUMP_SDK_WRAPPER,
                             createDisabledSdkWrapper()
  sdk-wrapper-factory.ts   — PumpSdkWrapperFactoryInput, createPumpSdkWrapper()
```

## Phase 6C Safety Invariants

- `packages/pump-adapter` has no dependencies on Pump SDK, @solana/web3.js, wallet libraries, or RPC clients
- All wrapper capability flags (`hasPumpSdkRuntime`, `hasSolanaSdkRuntime`, `canUseLiveRpc`, `canBuildRealInstructions`, `canReturnAccountMetas`, `canReturnBinaryInstructionData`, `canSimulateTransactions`, `canSignTransactions`, `canSendTransactions`, `canExecuteTrades`, `canAccessWallets`, `canAccessPrivateKeys`) are permanently `false`
- `createPumpSdkWrapper` factory always returns a disabled wrapper (fail-closed)
- Unsafe enable/live/executable config attempts are coerced to disabled
- Optional live methods return only safe forbidden result objects (never account metas, never binary data)
- All errors carry `safeToDisplay: true` — no raw secrets, no stack traces, no RPC URLs
- FULL_AUTO and LIMITED_LIVE remain locked
- No new Telegram trade/quote commands

## Phase 15: Strategy Intent Model v1

```
packages/strategy-intent/src/
  types.ts           — StrategyIntentCapabilities, StrategyFamily, StrategyEvidenceQuality,
                       StrategyIntentClassification, StrategySafetyGate, StrategyIntentRationale,
                       StrategyIntentFinding, StrategyIntent, StrategyIntentInput, StrategyIntentFixture
  errors.ts          — SiResult<T>, siOk, siErr, StrategyIntentError, StrategyIntentErrorCode
  capabilities.ts    — getStrategyIntentCapabilities() — all unsafe flags false
  evidence.ts        — assessStrategyEvidence() — fixture-only evidence quality assessment
  strategy-family.ts — classifyStrategyFamily() — fixture-only family classification
  safety-gates.ts    — buildStrategySafetyGates() — 9 analysis-only safety gates
  rationale.ts       — buildStrategyIntentRationale() — non-actionable rationale builder
  intent-builder.ts  — buildStrategyIntent() — full fixture-only intent builder
  validation.ts      — validateStrategyIntent(), validateStrategyIntentCapabilities(), text helpers
  fixtures.ts        — 6 deterministic synthetic StrategyIntentFixture objects
  index.ts           — public API barrel
```

Architecture layer:
```
Replay Lab (@sonic/replay-lab)
  → Replay Reporting (@sonic/replay-reporting)
    → Strategy Intent (@sonic/strategy-intent)   ← read-only, analysis-only
      → [human review only — no execution path]
```

`@sonic/strategy-intent` is a read-only layer. It imports from `@sonic/replay-lab` and `@sonic/replay-reporting` only. It exports fixture-only, analysis-only, non-executable `StrategyIntent` models for human review.

**StrategyIntent is NOT a real trade intent.** It does not enable or recommend trading.

No Solana SDK. No provider SDK. No network. No wallet. No execution. No real trade intents.
`FULL_AUTO` and `LIMITED_LIVE` remain locked.

- `strategy-evaluation`: Fixture-only, analysis-only, non-executable strategy evaluation report layer above Strategy Intent; aggregates score bands, evidence distribution, safety gate summaries, and family comparisons from StrategyIntent batches; JSON/Markdown export with mandatory safety footer (Phase 16 — no network, no Solana RPC, no provider APIs, no live data, no real trade intents, no execution plans, no orders, no positions, no live PnL, no paper trading, no trade execution, no transactions)

- `read-only-api-contracts` (packages): Fixture-only, read-only, analysis-only, non-executable, contract-only API boundary contract models for future local API planning; no HTTP server, no Fastify, no network ports; all unsafe capabilities false; `canStartHttpServer: false`, `canOpenNetworkPort: false`, `canUseApiFramework: false` permanently (Phase 19)

- `read-only-api` (apps): Localhost-only, GET-only, fixture-only, read-only, analysis-only, non-executable Fastify API shell; binds only to `127.0.0.1`; serves Phase 19 contract fixtures and Phase 18 dashboard read model fixtures through 11 deterministic GET endpoints; `createReadOnlyApiApp()` does NOT auto-listen; all unsafe capabilities false; `canStartLocalhostServer: true` for 127.0.0.1 only (Phase 20). Phase 21 adds safe in-memory query parsing, filtering, sorting, and pagination helpers; `canFilterFixtureData: true`, `canPaginateFixtureData: true`, `canSortFixtureData: true`. Phase 22 adds standard Phase 22 JSON response envelopes and error envelopes for all endpoints; `buildReadOnlyApiSuccessEnvelope`, `buildReadOnlyApiErrorEnvelope`, deterministic contract metadata, 5 stable error codes, 11 endpoint contracts, query validation error envelopes, `canServeResponseEnvelopes: true`, `canReturnErrorEnvelopes: true`, `canValidateQueryErrors: true`, `canProvideDeterministicMetadata: true`, `canProvideEndpointContracts: true`. Phase 23 adds `consumerSdk: true`, `contractFixtures: true`, `typedRequestBuilders: true`, `responseParsers: true`, `fixtureValidation: true`, `inProcessOnlyClient: true`, `externalNetworkClient: false`.
- `read-only-api-client` (packages): Phase 23 local/in-process consumer SDK for Phase 22 read-only API contracts; typed endpoint definitions, request builders, query builders, response parsers, type guards, assertion helpers, and 10 deterministic contract fixtures; no real network client, no port binding, no external I/O; depends on `@sonic/read-only-api` (Phase 23).

Architecture layer (Phase 23):
```
Replay Lab (@sonic/replay-lab)
  → Replay Reporting (@sonic/replay-reporting)
    → Strategy Intent (@sonic/strategy-intent)
      → Strategy Evaluation (@sonic/strategy-evaluation)
        → Evidence Ledger (@sonic/evidence-ledger)
          → Dashboard Read Models (@sonic/dashboard-read-models)
            → Read-Only API Contracts (@sonic/read-only-api-contracts)
              → Local Read-Only API Shell (@sonic/read-only-api)
                  → Phase 23 Consumer SDK (@sonic/read-only-api-client)  ← Phase 23
                      In-process only. No network. No port binding.
                      Typed endpoint definitions + request builders
                      Query param builders + validators
                      Response parsers + type guards
                      10 deterministic contract fixtures
                      [local/in-process use only]
```

`@sonic/read-only-api` is the first runtime API shell. It imports from `@sonic/read-only-api-contracts` and `@sonic/dashboard-read-models` only. It exports fixture-only, analysis-only, non-executable responses through safe GET endpoints for local human review. Phase 21 adds deterministic query/filter/pagination support. Phase 22 adds standard Phase 22 JSON response envelopes with deterministic contract metadata, error code constants, endpoint contracts, and query validation error envelopes. Phase 23 adds a typed local in-process consumer SDK with request builders, query builders, response parsers, type guards, and 10 deterministic contract fixtures.

**LocalReadOnlyApi is NOT a trading system.** It does not enable or recommend trading. It does not connect to any live data source. It does not expose an external network interface. Query/filter/pagination is fixture-only and in-memory only.

No Solana SDK. No provider SDK. No network calls. No wallet. No execution. No real trade intents.
`FULL_AUTO` and `LIMITED_LIVE` remain locked.
