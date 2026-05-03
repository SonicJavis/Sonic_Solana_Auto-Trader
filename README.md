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
