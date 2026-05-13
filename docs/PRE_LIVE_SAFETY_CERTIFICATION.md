# Pre-Live Safety Review Gate and Read-Only Certification v1

## Purpose

Phase 75 adds `apps/dashboard/src/pre-live-safety-certification/` as a deterministic, fixture-backed, fail-closed pre-live safety review and read-only certification contract layer.

This phase models readiness review artifacts only. It does **not** unlock live/manual trading, execution, transaction building, wallet/signing/sending, recommendations/signals/advice, or profitability claims.

## Relationship to Prior Phases

Phase 75 links deterministic fixture snapshots from:

- Phase 74 controlled live smoke harness
- Phase 73 provider-aware replay import contracts
- Phase 72 historical snapshot scenario generator
- Phase 71 historical snapshot ingestion contracts
- Phase 70 provider reliability drift audit
- Phase 69 live smoke safety certification
- Phase 68 provider-aware replay scenarios
- Phase 67 cross-provider data quality
- Phase 66 multi-provider read-only foundation
- Phase 65 first read-only provider adapter

## Research Summary and Unsafe Patterns Rejected

Useful patterns adapted:

- GitHub environment protection and required reviewer gates for manual approval modeling:
  - https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment
- OWASP-style deployment hardening/checklist framing for fail-closed readiness criteria:
  - OWASP deployment/go-live checklist guidance (accessed via web research summaries)
- Read-only Solana posture:
  - only model read-only safety contracts, no signing/sending, no runtime network default.

Unsafe/scam patterns explicitly rejected:

- private key / seed phrase / mnemonic collection
- hidden transaction signing/sending/execution
- obfuscated/minified payloads and suspicious install-time behavior
- pay-to-unlock Telegram/Discord funnels and unrealistic profit claims
- forced secrets/API keys in deterministic CI paths

No external source code was copied.

## Contract Models

Phase 75 includes deterministic models for:

- safety gate
- readiness checklist
- certification contract
- evidence bundle
- signoff model
- approval policy
- rejection contract
- capability audit
- safety invariant
- provider/replay/scenario/smoke/risk readiness linkages
- scorecard
- certification report
- view model, API contract, selectors
- normalization/serialization/equality
- validation and capability flags

## Capability Flags

Positive flags expose pre-live certification surfaces (gates/checklists/contracts/evidence/signoff/approval/rejection/audit/invariants/linkage/scorecards/reports/view/API/selectors).

Negative flags remain false for unlock authority, live/manual trading, LIMITED_LIVE/FULL_AUTO unlock, execution, transaction building/sending, wallet/private-key/signing, recommendations/signals/advice, real orders/funds/PnL, live network default, scheduled jobs, runtime monitoring/collectors, provider expansion, secrets requirements, persistence/filesystem writes, route/runtime/UI/DOM/background jobs.

## Validation Behavior

Validation rejects:

- wrong phase/name/kind/schema/meta
- duplicate fixture IDs/names
- unsafe unlock/trading/execution states
- automatic approval/promotion enablement
- ready gate state missing smoke certification
- ready gate state with replay-import-incomplete linkage
- missing evidence/validation/docs/review/safety-grep references
- unsafe advisory/profit/wallet/network/secret text patterns

## Testing Summary

`tests/phase75.test.ts` covers:

- module files, constants, names/kinds, fixture list/map/get
- all model builders and helper surfaces
- selectors/normalization/serialization/equality
- validation success and safety rejection paths
- all 8 required fixtures
- blocked/rejected/manual-pending scenarios
- Phase 65–74 linkage validation where practical
- capability propagation to dashboard/read-only-api roots
- deterministic primitive scans and Phase 76 preview-only guard

## Safety Constraints and Non-Goals

Phase 75 remains:

- READ_ONLY by default
- deterministic in standard CI
- fixture-backed
- fail-closed
- non-wallet / non-signing / non-sending / non-executing
- non-advisory

Phase 75 does **not** implement:

- live/manual trading
- execution engines or order routing
- transaction building/signing/sending
- recommendations/signals/investment advice
- real orders/funds/PnL
- live network calls in standard CI
- scheduled jobs/runtime monitoring/runtime collectors
- provider expansion
- secrets/API key requirements in deterministic paths
- filesystem writes/persistence
- route handlers/runtime requests
- UI/DOM
- background jobs

Certification does not authorize live trading or execution.

## Next Phase Guidance

Next recommended phase (implemented): **Phase 76 — Manual-Confirm Live Readiness Contracts v1**.

Next recommended preview-only phase: **Phase 77 — Manual-Confirm Live Dry-Run Control Contracts v1**.
