# Sonic_Solana_Auto-Trader

**Phase 7D — Disabled Provider Config + Readiness Checks**

A defensive intelligence and control foundation for Solana trading. No live trading or execution in any phase up to and including Phase 7D.

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
- 81 new tests in `tests/phase7d.test.ts` — 798+ passing

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
pnpm test        # run tests (798+ passing as of Phase 7D)
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

