# Sonic_Solana_Auto-Trader

**Phase 4 — Database + Persistent Audit Logs**

A defensive intelligence and control foundation for Solana trading. No live trading or execution in Phase 4.

## Features (Phase 4)

- SQLite + Drizzle ORM persistent audit log (`audit_events` table)
- All audit events persist across restarts
- Database init is idempotent — missing directories created automatically
- Worker fails closed if DB initialisation fails
- Retention/rotation policy: delete events older than `AUDIT_RETENTION_DAYS`, cap at `AUDIT_MAX_EVENTS`
- Telegram `/audit` enhanced: recent, page, severity, type, source, stats sub-commands
- All audit output is secret-safe (no raw credentials in Telegram messages)
- Telegram bot, admin allowlist enforcement (fail-closed)
- Full command suite: `/start`, `/help`, `/status`, `/mode`, `/pause`, `/kill`, `/audit`, `/safety`, `/version`
- Kill switch requires two-step inline keyboard confirmation
- `FULL_AUTO` and `LIMITED_LIVE` modes remain locked
- TypeScript pnpm monorepo with strict settings

## Safety Notice

- **NO LIVE TRADING**: All trading functionality is strictly disabled in Phase 4.
- **NO EXECUTION**: The system has no capability to send transactions to the Solana network.
- **NO WALLET / PRIVATE KEYS**: Private key handling, wallet loading, and transaction signing are NOT implemented.
- **NO SOLANA RPC**: No Solana RPC connections in Phase 4.
- **NO JITO / PUMP.FUN**: Not implemented in any phase.
- **READ-ONLY FIRST**: The foundation is built for infrastructure only.
- **FULL_AUTO and LIMITED_LIVE remain locked**.

## Workspace packages

- `packages/shared` — constants, modes, types
- `packages/config` — environment schema and loader
- `packages/db` — SQLite/Drizzle persistent audit repository + in-memory fallback
- `packages/mode-manager` — mode state machine
- `packages/observability` — logger
- `packages/risk-engine` — risk checks
- `apps/telegram-bot` — Telegram control interface
- `apps/worker` — safe heartbeat loop

## Commands

```sh
pnpm test        # run tests (201 tests in Phase 4)
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
