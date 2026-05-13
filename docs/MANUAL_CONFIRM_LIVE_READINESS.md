# Manual-Confirm Live Readiness Contracts v1

## Purpose

Phase 76 adds `apps/dashboard/src/manual-confirm-live-readiness/` as deterministic, fixture-backed, fail-closed contracts for **manual-confirm live readiness modeling only**.

This phase does **not** unlock live trading, authorize execution, or implement manual-live workflows.

## Relationship to Prior Phases

Phase 76 links deterministic fixture snapshots from:

- Phase 75 pre-live safety certification
- Phase 74 controlled live smoke harness
- Phase 73 provider-aware replay import contracts
- Phase 72 historical snapshot scenario generator
- Phase 70 provider reliability drift audit
- Phase 69 live smoke safety certification
- Phase 68 provider-aware replay scenarios
- Phase 67 cross-provider data quality
- Phase 66 multi-provider read-only foundation
- Phase 65 first read-only provider adapter

## Research Summary

Reference patterns used:

- GitHub Actions environment protection rules and required reviewers for fail-closed manual approvals.
- Two-step maker/checker approval with role separation and cooling-off labeling.
- OWASP-style segregation-of-duties and release hardening guidance.

Unsafe Solana repo patterns rejected:

- private key / seed phrase / mnemonic collection
- hidden signing/sending/execution paths
- obfuscated payloads and suspicious install-time behavior
- forced secret/API-key gates in deterministic CI paths
- drainer-like transfer behavior and unrealistic profit claims

No unsafe code was copied.

## Readiness Models

Phase 76 includes deterministic models for:

- readiness gate
- approval policy
- confirmation phrase contract
- role separation contract
- cooling-off policy
- risk acknowledgement
- operator checklist
- preflight evidence bundle
- rejection contract
- capability audit
- safety invariant
- provider/smoke/certification/replay/scenario readiness linkages
- scorecard
- readiness report
- view model / API contract / selector
- normalization / serialization / equality
- validation and capability flags

## Fixtures

Phase 76 includes 8 deterministic fixtures:

1. `manual-confirm-readiness-complete`
2. `missing-prelive-certification-blocked`
3. `smoke-readiness-warning-review-required`
4. `role-separation-violation-rejected`
5. `confirmation-phrase-missing-blocked`
6. `cooling-off-required-pending`
7. `unsafe-capability-rejected`
8. `documentation-review-warning`

## Capabilities

Positive flags expose manual-confirm readiness modeling surfaces (gates/policies/phrase/role/cooling-off/risk/checklists/evidence/rejections/audits/invariants/linkages/scorecards/reports/view/API/selectors).

Unsafe capability flags remain false for unlock authority, live trading, manual-live implementation, LIMITED_LIVE/FULL_AUTO unlock, execution, transaction building/sending, wallet/private-key/signing handling, advisory outputs, real orders/funds/PnL, live network default, scheduled jobs, runtime monitoring/collectors, provider expansion, secrets requirements, filesystem/persistence, route/runtime/UI/DOM/background jobs.

## Validation Behavior

Validation rejects:

- wrong phase/name/kind/schema/meta
- duplicate fixture IDs/names
- unsafe unlock/manual-live/execution states
- automatic approval/promotion or unlock toggles
- role separation violations in ready state
- phrase dispatch/execution enablement
- runtime timers/randomness in deterministic paths
- advisory/recommendation/signal output
- missing evidence/docs/validation/safety-grep references
- unsafe network/secret/wallet/execution text references

## Testing Summary

`tests/phase76.test.ts` covers:

- constants, names, kinds, fixtures/map/list/get
- builders for all model surfaces
- validation success/failure/safety checks
- fail-closed behavior and blocked/rejected scenarios
- deterministic normalization/serialization/equality
- capability propagation to dashboard/read-only-api roots

## Non-Goals

Phase 76 does **not** implement:

- manual live trading execution
- order creation / routing
- transaction building / signing / sending
- wallet/private-key/keypair logic
- recommendations/signals/investment advice
- real orders/funds/PnL
- live network defaults in standard CI
- scheduled jobs/runtime monitoring
- provider expansion
- secrets/API-key requirements in deterministic CI paths
- persistence/filesystem writes
- route handlers/runtime requests
- UI/DOM/background jobs

READ_ONLY remains default. FULL_AUTO and LIMITED_LIVE remain locked.

## Next Phase Guidance

Next recommended phase (implemented): **Phase 77 — Manual-Confirm Live Dry-Run Control Contracts v1**.

Next recommended preview-only phase: **Phase 78 — Read-Only Live Snapshot Capture Contracts v1** (implemented in this phase).

Next recommended preview-only phase after Phase 78: **Phase 79 — Live Snapshot to Replay Parity Audit Contracts v1**.
