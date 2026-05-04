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
- Phase 7B may add disabled read-only provider boundaries.

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
- Phase 7C may add controlled mock providers or replayable fixture events — still without live providers.

## Phase 7B: Test count
862 tests (195 new Phase 7B tests + 667 regression tests).
