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
