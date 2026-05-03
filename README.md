# Sonic_Solana_Auto-Trader

**Phase 2 — Telegram Control Layer Hardening**

A defensive intelligence and control foundation for Solana trading. No live trading or execution in Phase 2.

## Features (Phase 2)

- Telegram bot with admin allowlist enforcement (fail-closed)
- Full command suite: `/start`, `/help`, `/status`, `/mode`, `/pause`, `/kill`, `/audit`, `/safety`, `/version`
- Kill switch requires two-step inline keyboard confirmation
- All commands and callbacks are audit logged
- `FULL_AUTO` and `LIMITED_LIVE` modes locked
- TypeScript pnpm monorepo with strict settings

## Safety Notice

- **NO LIVE TRADING**: All trading functionality is strictly disabled in this phase.
- **NO EXECUTION**: The system has no capability to send transactions to the Solana network.
- **NO WALLET / PRIVATE KEYS**: Private key handling, wallet loading, and transaction signing are NOT implemented. The system is physically incapable of moving funds.
- **READ-ONLY FIRST**: The foundation is built for read-only market data and control visibility.

## Workspace packages

- `packages/shared` — constants, modes, types
- `packages/config` — environment schema and loader
- `packages/db` — audit logger
- `packages/mode-manager` — mode state machine
- `packages/observability` — logger
- `packages/risk-engine` — risk checks
- `apps/telegram-bot` — Telegram control interface

## Commands

```sh
pnpm test        # run tests
pnpm lint        # lint all packages
pnpm typecheck   # type check all packages
pnpm build       # build all packages
```
