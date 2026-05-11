# Paper Sniper Simulation

## Phase 60 — Paper Sniper Simulation Foundation v1

Phase 60 introduces deterministic, fixture-derived, local-only, read-only paper sniper simulation models in `apps/dashboard/src/paper-sniper-simulation/`.

## Scope

- 8 deterministic fixtures mapped 1:1 to Phase 59 explanation/evidence fixtures
- each fixture preserves practical linkage to:
  - Phase 58 launch risk fixture name
  - Phase 57 replay fixture name
  - Phase 56 lifecycle fixture name
- deterministic market, latency, slippage, and failure bucket models
- deterministic simulation runner with fixed step sequence (`quote`, `submit`, `finalize`)
- deterministic outcomes summary, view models, API contracts, selectors, normalization, validation, and capability flags

## Safety

Phase 60 is synthetic-only and non-executable:

- no live data
- no network/provider/RPC/socket usage
- no wallet/order/transaction execution path
- no signing/sending
- no recommendations/signals/investment advice
- no timers or nondeterministic runtime primitives
- no persistence/filesystem writes/background jobs/routes/runtime handlers/UI rendering

Validation rejects:

- unsafe text (URLs, network/runtime/filesystem/timer references)
- real-order/wallet/transaction/provider references
- advisory/execution language
- invalid market/latency/slippage/failure bucket values

## Validation Commands

- `pnpm typecheck`
- `pnpm lint`
- `pnpm test`
- `pnpm --filter @sonic/dashboard build`
- `pnpm --filter @sonic/offline-intelligence build`
