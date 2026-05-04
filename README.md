# Sonic_Solana_Auto-Trader

**Phase 6A — Pump Adapter Interfaces + Safe Quote Models**

A defensive intelligence and control foundation for Solana trading. No live trading or execution in Phase 6A.

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

- **NO LIVE TRADING**: All trading functionality is strictly disabled in Phase 6A.
- **NO EXECUTION**: The system has no capability to send transactions to the Solana network.
- **NO WALLET / PRIVATE KEYS**: Private key handling, wallet loading, and transaction signing are NOT implemented.
- **NO SOLANA RPC**: No Solana RPC connections in Phase 6A.
- **NO JITO / PUMP.FUN TRADING**: No Pump.fun buying/selling. No PumpSwap buying/selling. No Jito.
- **NO TRANSACTION BUILDING**: No transaction instruction building or construction.
- **NO SIMULATION**: No transaction simulation.
- **NO MARKET DATA**: Not yet implemented.
- **PUMP ADAPTER IS INERT**: `packages/pump-adapter` is model-only — no live RPC, no execution, no signing, no sending.
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

