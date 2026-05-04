# Architecture

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
- `testing`: Shared test utilities

## Apps
- `telegram-bot`: Telegram command interface (uses `SqliteAuditRepository`)
- `worker`: Safe heartbeat loop (DB init + retention on startup)
- `dashboard`: Placeholder

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

## Phase 7A/7B/7C/7D: Event Engine Core + Disabled Providers + Mock Providers + Provider Config/Readiness

Phase 7A adds the local in-memory event engine package. Phase 7B adds disabled provider boundaries. Phase 7C adds controlled mock providers and replayable fixture events. Phase 7D adds disabled provider configuration models and readiness checks. See [docs/EVENT_ENGINE.md](./EVENT_ENGINE.md) for full details.

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
