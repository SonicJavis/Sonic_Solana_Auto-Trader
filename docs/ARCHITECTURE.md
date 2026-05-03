# Architecture

Monorepo with pnpm workspaces.

## Packages
- shared: Types, constants, utilities
- config: Zod env validation
- observability: Pino structured logging
- db: InMemoryAuditLogger
- mode-manager: Mode state machine
- risk-engine: Safety gates
- testing: Shared test utilities

## Apps
- telegram-bot: Telegram command interface
- worker: Heartbeat loop
- dashboard: Placeholder
