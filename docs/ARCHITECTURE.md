# Architecture

Monorepo with pnpm workspaces.

## Packages
- `shared`: Types, constants, utilities, `RuntimeSafetyStatus`
- `config`: Zod env validation, secret redaction, config provenance
- `observability`: Pino structured logging
- `db`: SQLite + Drizzle ORM persistent audit repository; `InMemoryAuditLogger` fallback
- `mode-manager`: Mode state machine (transitions persisted to audit DB in Phase 4)
- `risk-engine`: Safety gates
- `testing`: Shared test utilities

## Apps
- `telegram-bot`: Telegram command interface (uses `SqliteAuditRepository`)
- `worker`: Safe heartbeat loop (DB init + retention on startup)
- `dashboard`: Placeholder

## Phase 4: Database Layer

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
