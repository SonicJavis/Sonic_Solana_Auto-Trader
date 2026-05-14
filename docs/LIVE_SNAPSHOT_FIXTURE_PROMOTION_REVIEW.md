# Live Snapshot Fixture Promotion Review Contracts v1

## Purpose

Phase 80 adds `apps/dashboard/src/live-snapshot-fixture-promotion-review/` deterministic, fixture-backed, fail-closed contracts for **reviewing live snapshot fixture promotion candidates only**.

These contracts do **not** perform promotion, runtime capture, runtime replay import/execution, persistence, or filesystem writes.

## Relationship to Prior Phases

Phase 80 links deterministic source fixture references from Phase 79/78/77/76/75/74/73/72/70/69/68/67/66/65 surfaces.

## Phase 79 clean-runner verification outcome

Attempted clean-runner validation before Phase 80 edits:

- `corepack pnpm@10.17.0 install --frozen-lockfile` succeeded but reported ignored build scripts for `better-sqlite3`.
- Full `corepack pnpm@10.17.0 test` remained blocked by environment-native binding error:
  - `Could not locate the bindings file`
  - `better-sqlite3.../better_sqlite3.node`
- Targeted Phase 79 verification passed:
  - `corepack pnpm@10.17.0 test tests/phase79.test.ts`
- `typecheck`, `lint`, dashboard build, and offline-intelligence build passed pre-edit.

## Research summary

Applied patterns from GitHub deployment protection and deterministic CI curation guidance:

- protected environment reviewer gates and approval pauses before promotion/deployment
- fail-closed manual gate policy for promotion decisions
- deterministic fixture curation with immutable provenance/integrity evidence bundles
- quarantine-first review and release-disabled defaults

Unsafe Solana/sniper repo patterns reviewed and rejected:

- private-key/seed/mnemonic collection
- hidden signing/sending flows
- obfuscated or malicious postinstall/download behavior
- drainer-like transfer/close-account loops
- forced secrets/API keys and suspicious endpoint claims

No unsafe external code was copied.

## Promotion review gate model

`FixturePromotionReviewGate` includes:

- `reviewGateId`, `reviewGateName`, `phase`, `gateStatus`
- `failClosed: true`
- `unlockAuthority: false`
- `filesystemWriteAllowed: false`
- `automaticPromotionAllowed: false`
- `blockingReasonCodes`

## Fixture candidate model

`FixturePromotionCandidate` includes:

- `candidateId`
- `sourceParityAuditFixtureRef`
- `sourceSnapshotCaptureFixtureRef`
- `candidateStatus`
- `stagedOnly: true`
- `persisted: false`
- `promotionAllowed: false`

## Review policy / decision model

`FixturePromotionReviewPolicy` enforces:

- `manualReviewRequired: true`
- `automaticApprovalAllowed: false`
- `automaticPromotionAllowed: false`
- reviewer cardinality controls

`FixturePromotionReviewerDecision` enforces:

- decision kind/status and reviewer slot
- evidence references
- `approvalDoesNotPromote: true`

## Evidence / manifest model

`FixturePromotionEvidenceBundle` includes source phase refs, source fixture refs, parity refs, validation command refs, safety grep refs, docs refs, and completeness state.

`FixturePromotionManifest` is proposal-only:

- proposed fixture identity/version
- `fileWriteAllowed: false`
- `automaticCommitAllowed: false`

## Blocker / quarantine model

`FixturePromotionBlocker` provides fail-closed blocker taxonomy and severity with explicit `promotionBlocked`.

`FixturePromotionQuarantineReview` enforces:

- quarantined state and reason codes
- `releaseAllowed: false`
- `manualReviewRequired: true`

## Parity/snapshot/provenance/integrity/schema review linkage

Phase 80 models:

- parity review linkage to Phase 79 fixtures
- snapshot capture linkage to Phase 78 fixtures
- provenance review references across prerequisite phases
- deterministic integrity review checksums
- schema review warnings/failures with manual review requirements

## Report model

`FixturePromotionReport` includes:

- gate/candidate/policy/decision/evidence/manifest/blocker/quarantine summaries
- safety summary text constrained to non-advisory wording

## View/API/selector overview

- view model: deterministic summary lens
- API contract: fixture-only list/get contract shapes
- selector: deterministic fixture lookup by id/name/kind

## Capabilities

Positive flags expose promotion review contracts, candidates/policies/decisions/evidence/manifests/blocker/quarantine/linkage/provenance/integrity/schema/scorecard/report/view/API/selector surfaces.

Unsafe flags remain `false` for runtime capture/replay, unlock authority, automatic promotion, filesystem writes, persistence, live trading, LIMITED_LIVE/FULL_AUTO unlock, order/transaction/wallet/signing/sending/dispatch/execution flows, recommendations/signals/advice, real orders/funds/PnL, live-network defaults, scheduled jobs, runtime monitoring/collectors, provider expansion, secrets/API keys required, route/runtime/UI/DOM/background jobs.

## Validation behavior

Validation rejects:

- missing required fields / wrong phase / duplicate IDs/names
- dynamic timestamps and invalid schema/meta markers
- unlock/runtime capture/runtime replay/automatic promotion/filesystem/persistence toggles
- reviewer-decision side-effect promotion semantics
- manifest write/commit semantics
- critical blocker without promotion block
- quarantined release allowance
- parity mismatch marked ready
- advisory/profit language in reports
- missing docs/validation refs
- unsafe URL/network/secret/provider-SDK/wallet references
- mutable source fixture snapshots

## Testing summary

`tests/phase80.test.ts` covers constants/names/kinds/maps/list/get helpers, all model builders, all 8 fixtures, fail-closed blocked/pending/rejected scenarios, validation/safety rejection, normalization/serialization/equality, deterministic rebuilds, source immutability, capabilities and export propagation, and Phase 81 preview-only doc checks.

## Non-goals

Phase 80 does **not** implement:

- automatic promotion or any write path
- filesystem writes or persistence
- runtime capture/replay/import execution
- default live network behavior
- scheduled jobs/runtime monitoring/runtime collectors
- provider expansion/new real providers
- wallet/private key/signing/sending/dispatch/execution
- order creation/transaction building
- recommendations/signals/investment advice
- real orders/funds/PnL
- route handlers/runtime requests/UI rendering/DOM/background jobs

READ_ONLY remains default. FULL_AUTO and LIMITED_LIVE remain locked.

## Next phase guidance

Phase 81 now consumes Phase 80 promotion-review fixture names as deterministic source references for execution-boundary design contracts in `apps/dashboard/src/manual-confirm-execution-boundary/`.

Next recommended phase (**preview only**): **Phase 82 — Transaction Construction Contract Mocks v1**.
