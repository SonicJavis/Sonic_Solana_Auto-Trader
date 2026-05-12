# Synthetic Strategy Comparison Lab

## Phase 62 — Synthetic Strategy Comparison Lab v1

### Purpose

Phase 62 adds `apps/dashboard/src/synthetic-strategy-comparison-lab/` as a deterministic, local-only, read-only, fixture-derived, hypothetical comparison lab for synthetic strategy variants.

### Relationship to Phase 61/60/59/58/57/56

Each Phase 62 fixture references:

- one Phase 61 paper execution quality metric fixture
- one Phase 60 paper sniper simulation fixture
- one Phase 59 risk explanation evidence fixture
- one Phase 58 launch risk fixture
- one Phase 57 replay fixture
- one Phase 56 lifecycle fixture

### Why synthetic strategy comparison matters

It provides reproducible, non-actionable comparison outputs under identical fixture inputs across hypothetical variants, with deterministic ranking and sensitivity warnings.

### Strategy variant model

Variants:

- `conservative_safety_first`
- `liquidity_sensitive`
- `latency_sensitive`
- `evidence_weighted`

All variants are synthetic-only, hypothetical-only, non-executable, signal-free, and non-advisory.

### Scenario matrix model

Each fixture has one deterministic scenario case derived from a Phase 61 metric fixture, with shared inputs copied identically for all variants.

### Comparison run model

Comparison runs generate deterministic rows and rank variants within scenario by fixture score only.

### Scorecard model

Each scorecard includes deterministic score components, aggregate fixture score, risk/safety adjustments, quality band, sensitivity warnings, limitations, and non-advisory summary.

### Sensitivity / overfit warnings

Phase 62 warning taxonomy includes:

- `sensitive_to_thin_liquidity`
- `sensitive_to_latency_bucket`
- `sensitive_to_rejection_reason`
- `sensitive_to_risk_band`
- `sensitive_to_evidence_confidence`
- `overfit_warning_small_fixture_set`
- `overfit_warning_single_scenario_dependency`
- `comparison_not_live_predictive`

### Aggregate summary model

Deterministic aggregate summary includes:

- count by variant
- count by scenario kind
- aggregate fixture score distribution
- sensitivity warning counts

Any highest-score statement is explicitly scoped to synthetic fixture scoring only.

### No strategy selection / no wallet / no execution

Phase 62 does not add strategy auto-selection, recommendations, signals, investment advice, wallet logic, signing/sending, transaction execution, real orders, real funds, or real PnL.

### View models / API contracts / selectors

Adds deterministic fixture-derived view models, list/detail/summary/error API contract fixtures, and pure selectors over local fixture data only.

### Capability flags

Phase 62 adds positive capability flags for synthetic comparison fixtures and negative capability flags for all live/network/provider/RPC/socket/persistence/filesystem/routes/server/runtime/UI/DOM/jobs/wallet/signing/sending/execution/signal/advice/selection/real-order/real-fund/real-PnL behaviors.

### Safety constraints

Phase 62 remains synthetic, local-only, read-only, deterministic, fixture-derived, hypothetical-only, non-networked, non-wallet, non-executing, and non-advisory.

### Validation behavior

Validation enforces:

- required structure and deterministic constants
- valid source fixture references to Phases 61/60/59/58/57/56
- valid variant safety shape
- identical scenario inputs across variants
- valid score values/ranks/warning taxonomy
- unsafe advisory/provider/network/wallet/order/transaction text rejection
- unsafe capability flag rejection

### Testing summary

`tests/phase62.test.ts` covers fixtures, linkage, builders, scorecards, runs, aggregates, selectors, normalization/serialization/equality, validation success/failure cases, capability propagation, and deterministic safety scans.

### Explicit non-goals

No live data, provider adapters, Solana RPC, WebSockets/Geyser/Yellowstone, Pump.fun/Jupiter/Raydium/Orca/Meteora/Jito integrations, wallet/private keys/signing/sending, execution, real orders/funds/PnL, recommendations/signals/investment advice, strategy selection, endpoints/routes/handlers/runtime request handling, UI rendering/DOM, persistence, or background jobs.

### Next milestone guidance

**Phase 63 — Read-Only Provider Adapter Gate v1** is the next milestone preview only and is not implemented in Phase 62.
