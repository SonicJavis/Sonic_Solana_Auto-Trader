# Aggressive-Safe Phase Policy

**Introduced in Phase 52**

---

## Why move from micro-phases to milestone phases

The project has completed many safe micro-layers for strategy-review export surfaces (Phase 45–51).

Phase 52 introduces a milestone policy that keeps safety constraints strict while reducing wrapper-on-wrapper layer growth.

---

## What is allowed in a milestone phase

When safe, a milestone phase should bundle a complete vertical slice:

- fixtures
- view models
- contracts
- selectors
- validation and safety checks
- tests
- docs
- capability propagation

Phase 64 follows this policy by shipping a complete read-only Solana provider boundary vertical slice (fixtures, mappings, conformance checks, reports, contracts, selectors, validation, tests, and docs) without enabling any live provider capability.

Phase 66 also follows this policy by shipping a complete multi-provider read-only foundation vertical slice (registry, normalization, health, stale/freshness/cache policies, selection/fallback, conformance, reports, contracts, selectors, validation, tests, and docs) while keeping live/network/write capability locked.

Phase 67 follows this policy by shipping a complete cross-provider data-quality and reconciliation vertical slice (issue taxonomy, comparison, mismatch detection, reconciliation policy/results, confidence scoring, provenance, enrichment contracts, reports, contracts, selectors, validation, tests, and docs) while keeping live/network/write/execution capability locked.

Phase 70 follows this policy by shipping a complete provider reliability telemetry and drift-audit vertical slice (telemetry/freshness/reliability/drift/schema/conformance/linkage/report/contract/selector/validation/test/doc surfaces) while keeping live telemetry/network/runtime monitoring/write/wallet/execution/advisory capability locked.

Phase 71 follows this policy by shipping a complete historical snapshot ingestion contract vertical slice (manifest/source/schema/provenance/normalization/validation/freshness/integrity/import/rejection/linkage/report/contract/selector/validation/test/doc surfaces) while keeping live ingestion/runtime ingestion/network/write/wallet/execution/advisory capability locked.

Phase 72 follows this policy by shipping a complete deterministic historical snapshot scenario generator vertical slice (generation/source-selection/scenario/replay/lineage/rule/integrity/validation/rejection/linkage/report/contract/selector/validation/test/doc surfaces) while keeping live generation/runtime generation/ingestion/replay-import/network/write/wallet/execution/advisory capability locked.

Phase 73 follows this policy by shipping a complete deterministic provider-aware replay import contract vertical slice (candidate/manifest/source/compatibility/gate/import-plan/rejection/normalization/validation/integrity/provenance/linkage/report/contract/selector/validation/test/doc surfaces) while keeping live/runtime import and ingestion/network/filesystem/write/wallet/execution/advisory capability locked.

Phase 75 follows this policy by shipping a complete deterministic pre-live safety review gate and read-only certification vertical slice (gate/checklist/certification/evidence/signoff/approval/rejection/audit/invariant/linkage/scorecard/report/view/API/selector/validation/test/doc surfaces) while keeping unlock authority, live/manual trading, execution, wallet/signing/sending, advisory, and runtime/network capability locked.

Phase 76 follows this policy by shipping a complete deterministic manual-confirm live readiness contract vertical slice (readiness gate/approval/phrase/role-separation/cooling-off/risk/checklist/evidence/rejection/audit/invariant/linkage/scorecard/report/view/API/selector/validation/test/doc surfaces) while keeping unlock authority, manual/live trading, execution, wallet/signing/sending, advisory, and runtime/network capability locked.

Phase 77 follows this policy by shipping a complete deterministic manual-confirm dry-run control contract vertical slice (dry-run gate/operator intent/preflight/control/dispatch-block/abort/cancellation/confirmation/decision/evidence/audit/invariant/linkage/scorecard/report/view/API/selector/validation/test/doc surfaces) while keeping unlock authority, manual/live trading, execution, order/transaction construction, wallet/signing/sending, advisory, and runtime/network capability locked.

Phase 78 follows this policy by shipping a complete deterministic read-only live snapshot capture contract vertical slice (capture gate/request/provider target/scope/bounds/staging/quarantine/normalization/provenance/integrity/schema/promotion/fixture-candidate/certification/report/view/API/selector/validation/test/doc surfaces) while keeping runtime capture, unlock authority, live/manual trading, execution, wallet/signing/sending, advisory, persistence/filesystem, and runtime/network capability locked.

Phase 80 follows this policy by shipping a complete deterministic live snapshot fixture promotion review contract vertical slice (review gate/candidate/policy/decision/evidence/manifest/blocker/quarantine/parity+snapshot/provenance/integrity/schema linkage/scorecard/report/view/API/selector/validation/test/doc surfaces) while keeping automatic promotion, filesystem/persistence writes, runtime capture/replay, unlock authority, live/manual trading, execution, wallet/signing/sending, advisory, and runtime/network capability locked.

Phase 81 follows this policy by shipping a complete deterministic manual-confirm execution boundary design contract vertical slice (boundary gate/state/construction+signing+dispatch+wallet denial/approval/linkage/abort+rollback/evidence/blocker/audit/scorecard/report/view/API/selector/validation/test/doc surfaces) while keeping transaction construction/signing/sending/dispatch/execution, unlock authority, live/manual trading, advisory outputs, runtime capture/replay, persistence/filesystem writes, and runtime/network capability locked.

Phase 83 follows this policy by shipping a complete deterministic signing-boundary safety design contract vertical slice (signing-boundary gate/signing+wallet+key-material+signature-output denial/placeholder+approval+acknowledgement/linkage/abort+rollback/invariant/evidence/blocker/audit/scorecard/report/view/API/selector/validation/test/doc surfaces) while keeping signing runtime, signature output, wallet prompts/adapters, key material handling, sending/dispatch/execution, unlock authority, live/manual trading, advisory outputs, runtime capture/replay, persistence/filesystem writes, and runtime/network capability locked.

---

## What remains forbidden

Milestone policy does not relax safety locks.

Still forbidden without explicit future gate unlocks:

- live data and external network calls
- real endpoints/routes/handlers/runtime request handling
- filesystem writes/download/report generation
- persistence/queues/background or scheduled jobs
- wallet/private-key/signing/transaction send logic
- execution/trading/recommendations/signals/investment advice
- real UI rendering or DOM access where out-of-scope

---

## Avoiding derivative-layer bloat

Rules:

1. Prefer complete vertical slices over micro-phase wrapper layering.
2. Do not create wrapper-on-wrapper derivatives unless a real consumer requires the new layer.
3. If no real consumer exists, consolidate or stop at the current stable surface.
4. Registry/catalog phases should improve consumption and governance, not add recursive abstraction for its own sake.

---

## Sniper-bot blueprint alignment

This policy keeps implementation speed aggressive while preserving strict safety boundaries.

It keeps the roadmap aligned with a controlled path from synthetic/local/read-only intelligence toward future gated execution readiness, without prematurely enabling live behavior.

---

## Required future live-trading gates

Any future live-trading capability must pass these ordered gates:

1. synthetic fixtures
2. read-only provider contracts
3. read-only provider adapters
4. replay
5. paper simulation
6. manual-confirmed tiny live execution
7. limited-live only after explicit unlock
8. full-auto remains locked until explicitly authorized

## Phase 82 — Transaction Construction Contract Mocks v1

Adds deterministic fixture-backed transaction-construction contract mocks only; no real Transaction/VersionedTransaction creation, serialization, signing, sending, wallet/keypair handling, dispatch, execution, persistence, or live network defaults. READ_ONLY remains default and FULL_AUTO/LIMITED_LIVE stay locked.

## Phase 83 — Signing Boundary Safety Design Contracts v1

Adds deterministic fixture-backed signing-boundary safety design contracts only; no signing, no signature generation/output, no wallet prompt/adapter, no key material handling, no sending/dispatch/execution, no persistence/filesystem writes, and no live network defaults. READ_ONLY remains default and FULL_AUTO/LIMITED_LIVE stay locked.


## Phase 84 — Transaction Send Boundary Safety Contracts v1

Adds deterministic fixture-backed transaction send boundary safety contracts only; no sendTransaction/sendRawTransaction, no network submit/broadcast/dispatch, no retry runtime, no confirmation polling, no live preflight simulation, no signing/wallet/key handling, no execution, no persistence/filesystem writes, and no advisory outputs. READ_ONLY remains default and FULL_AUTO/LIMITED_LIVE stay locked.

## Phase 85 — Post-Send Observation Boundary Contracts v1

Adds deterministic fixture-backed post-send observation boundary contracts only; no live observation, no confirmation polling, no getSignatureStatuses/getTransaction runtime lookups, no network reads/subscriptions, no retry runtime, no sending/dispatch/signing/execution, no persistence/filesystem writes, and no advisory outputs. READ_ONLY remains default and FULL_AUTO/LIMITED_LIVE stay locked.
