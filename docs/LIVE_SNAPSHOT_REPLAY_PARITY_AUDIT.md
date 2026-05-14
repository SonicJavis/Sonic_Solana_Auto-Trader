# Live Snapshot Replay Parity Audit Contracts v1

## Purpose

Phase 79 adds `apps/dashboard/src/live-snapshot-replay-parity-audit/` deterministic, fixture-backed, fail-closed contracts for **live snapshot to replay parity auditing only**.

## Scope

This phase adds parity gates, snapshot inputs, replay/scenario expectation linkage, parity comparisons, mismatch taxonomy, drift classification, provenance/schema/integrity parity audits, promotion gates, quarantine contracts, audit evidence, scorecards, reports, view/API/selectors, normalization, validation, capabilities, and 8 deterministic fixtures.

## Safety

All fixtures remain contract-only, local-only, read-only, deterministic, fail-closed, and non-advisory. Runtime replay, network calls, provider expansion, wallet/signing/sending/execution, recommendations/signals/advice, real orders/funds/PnL, persistence/filesystem writes, route/runtime handlers, UI/DOM/background jobs, and automatic promotion remain disabled.

Validation rejects unsafe toggles, missing evidence/source refs, advisory/profit language in report summaries, and any automatic promotion enablement.

## Fixture Set

- snapshot-replay-parity-clean
- snapshot-schema-mismatch-quarantined
- snapshot-provenance-mismatch-blocked
- snapshot-integrity-mismatch-blocked
- replay-expectation-missing-blocked
- scenario-expectation-warning-review-required
- promotion-gate-manual-review-required
- unsafe-capability-rejected

## Lineage

Fixtures include deterministic source references to Phase 65/66/67/68/69/70/72/73/74/75/76/77/78 fixture name arrays.

## Next Phase Guidance

Phase 80 now consumes these parity audit fixtures for promotion-review candidate contracts in `apps/dashboard/src/live-snapshot-fixture-promotion-review/`.

Next recommended phase (**preview only**): **Phase 81 — Manual-Confirm Execution Boundary Design Contracts v1**.
