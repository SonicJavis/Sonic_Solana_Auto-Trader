# Sonic_Solana_Auto-Trader

**Phase 7A — Event Engine Core Interfaces + In-Memory Event Bus**

A defensive intelligence and control foundation for Solana trading. No live trading or execution in any phase up to and including Phase 7A.

## Features (Phase 7A)

- New `packages/event-engine` package — local-only, no network dependencies
- `EventEnvelope` — canonical event container with safe payload, safeToPersist, safeToDisplay
- `EventCategory` — system, config, mode, safety, audit, pump_adapter, future_chain (placeholder), future_market (placeholder), unknown
- `EventSourceType` — internal, worker, telegram, audit_repository, state_service, pump_adapter_mock, future_provider_disabled
- `EventSeverity` — debug, info, warn, error, critical
- `EventSourceCapabilities` — all 5 network/execution/wallet flags permanently `false`
- `IEventBus` interface + `InMemoryEventBus` implementation — bounded history (default 1000), handler failure isolation, idempotent unsubscribe
- `DedupeStore` — in-memory TTL deduplication with clock injection for deterministic tests
- `validateEventEnvelope` — full structural and safety validation (rejects functions, class instances, circular refs, raw Errors)
- `EventEngineResult<T>` — safe result/error type with 17 error codes; all errors `safeToDisplay: true`
- `buildEventEngineSystemStatus` — reports liveProviders:disabled, networkEvents:forbidden, executionTriggers:forbidden, solanaRpc:forbidden
- 119 new tests in `tests/phase7a.test.ts` — 667 total, all passing
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

- **NO LIVE TRADING**: All trading functionality is strictly disabled in Phases 6A/6B/6C/7A.
- **NO EXECUTION**: The system has no capability to send transactions to the Solana network.
- **NO WALLET / PRIVATE KEYS**: Private key handling, wallet loading, and transaction signing are NOT implemented.
- **NO SOLANA RPC**: No Solana RPC connections in any phase through 7A.
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
- **EVENT SOURCE CAPABILITIES ARE ALL FALSE**: `canUseNetwork`, `canUseSolanaRpc`, `canEmitLiveEvents`, `canTriggerExecution`, `canAccessWallets` are all permanently `false` in Phase 7A.
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
pnpm test        # run tests (397 tests in Phase 6A)
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

