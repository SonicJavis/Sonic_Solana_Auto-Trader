# Signing Boundary Safety Design Contracts v1

## Purpose

Phase 83 adds `apps/dashboard/src/signing-boundary-safety-contracts/` deterministic, fixture-backed, fail-closed **signing boundary safety design contracts**.

This phase is contract/model only and does not implement signing.

## Relationship to Prior Phases

Phase 83 links deterministic fixture references from Phase 82/81/80/79/78/77/76/75/74/73/72/70/69/68/67/66/65.

## Phase 79/80/81/82 clean-runner verification outcome

Attempted clean-runner validation before Phase 83 edits:

- `corepack pnpm@10.17.0 install --frozen-lockfile` succeeded but reported ignored build scripts for `better-sqlite3`.
- Full `corepack pnpm@10.17.0 test` remained blocked by environment-native binding error:
  - `Could not locate the bindings file`
  - `better-sqlite3.../better_sqlite3.node`
- Targeted verification passed:
  - `corepack pnpm@10.17.0 test tests/phase79.test.ts tests/phase80.test.ts tests/phase81.test.ts tests/phase82.test.ts`
- `typecheck`, `lint`, dashboard build, and offline-intelligence build passed pre-edit.

## Research summary

Applied patterns from:

- Solana transaction structure guidance emphasizing separation between transaction construction and signing approvals.
- Wallet approval and key-isolation security guidance (no private-key exposure to dApp surfaces).
- GitHub protected environment required-reviewer gates for manual approval boundaries.

## Unsafe Solana/sniper repo patterns rejected

- private key / seed phrase / mnemonic / secret key collection
- required funded-wallet private-key flows and forced endpoint/API-key secrets in deterministic CI paths
- hidden signing/sending/dispatch execution logic
- aggressive profit and advisory marketing claims as safety evidence
- drainer-like or always-on auto-trade behavior

No unsafe external code was copied.

## Signing boundary gate model

`SigningBoundaryGate` includes:

- `signingBoundaryGateId`, `signingBoundaryGateName`, `phase`, `gateStatus`
- `failClosed: true`
- `unlockAuthority: false`
- `signingAllowed: false`
- `walletPromptAllowed: false`
- `signatureOutputAllowed: false`
- `blockingReasonCodes`

## Signing request denial model

`SigningRequestDenial` enforces:

- `signingRequestBlocked: true`
- `signTransactionBlocked: true`
- `signAllTransactionsBlocked: true`
- `signatureOutputProduced: false`

## Wallet prompt denial model

`WalletPromptDenial` enforces:

- `walletPromptBlocked: true`
- `walletAdapterAllowed: false`
- `browserWalletAccessAllowed: false`

## Key-material denial model

`KeyMaterialDenial` enforces:

- `privateKeyAccessAllowed: false`
- `keypairAccessAllowed: false`
- `seedPhraseAccessAllowed: false`
- `mnemonicAccessAllowed: false`
- `secretStorageAllowed: false`

## Signature output denial model

`SignatureOutputDenial` enforces:

- `signatureBytesProduced: false`
- `signedTransactionProduced: false`
- `signedMessageProduced: false`

## Signer identity placeholder model

`SignerIdentityPlaceholder` remains placeholder-only:

- deterministic label only
- `realPublicKeyRequired: false`
- `signerAuthorityGranted: false`

## Approval boundary model

`SigningApprovalBoundary` enforces:

- `manualApprovalRequired: true`
- `approvalAuthorizesSigning: false`
- `separateSigningPhaseRequired: true`

## Abort/rollback model

`SigningAbortContract` and `SigningRollbackContract` enforce:

- modeled abort/rollback only
- `runtimeSideEffectsAllowed: false`
- `scheduledTimersAllowed: false`

## Evidence/blocker/capability audit model

- source phase refs and source fixture refs
- docs refs, validation command refs, safety grep refs
- deterministic blocker taxonomy and capability audit with read-only default + FULL_AUTO/LIMITED_LIVE locked

## Source linkage model

Phase 83 includes deterministic linkage to:

- transaction construction mocks (Phase 82)
- execution boundary (Phase 81)
- dry-run control (Phase 77)
- practical references to Phase 65/66/67/68/69/70/72/73/74/75/76/78/79/80

## Report model

`SigningBoundaryReport` includes deterministic summaries for gate, signing request, wallet prompt, key material, signature output, signer identity, approval, abort/rollback, evidence, and safety.

Reports remain non-advisory and reject profit/signal/recommendation language.

## View/API/selector overview

- view model: deterministic summary lens
- API contract: fixture-only list/get shape
- selector: deterministic fixture lookup by id/name/kind

## Capabilities

Positive Phase 83 flags expose signing-boundary contract surfaces only.

Unsafe flags remain `false` for runtime signing, unlock authority, live/manual unlocks, transaction signing/sending, dispatch, signature generation/output, wallet prompt/adapter/browser access, key material handling, secret storage, execution/order creation, recommendations/signals/advice, real orders/funds/PnL, live network defaults, scheduled/runtime jobs, runtime monitoring/collectors, provider expansion, secrets/API-key requirements, filesystem writes/persistence, route/runtime/UI/DOM/background jobs, and automatic promotion.

## Validation behavior

Validation rejects:

- missing required fields, wrong phase, duplicate IDs/names
- dynamic timestamps
- unsafe enablement of signing/wallet/key-material/signature-output/unlock/approval authorization/runtime side effects/scheduled timers
- advisory/profit language in reports
- missing docs refs, validation command refs, source refs
- unsafe URL/network/secret/provider references
- mutable source snapshots

## Testing summary

`tests/phase83.test.ts` covers constants/surfaces, helper APIs, builders, all 8 required fixtures, fail-closed denials, linkage, abort/rollback, scorecards/reports/view/API/selectors, normalization/serialization/equality, validation rejections, capability propagation, deterministic rebuilds, immutability, clean-runner blocker evidence checks, and Phase 84 (implemented) preview-only docs guidance.

## Non-goals

Phase 83 does **not** implement:

- signing, signature generation, wallet prompts, wallet adapters, private-key/keypair/seed/mnemonic handling
- signed transaction or signed message output
- transaction serialization, sending, dispatch, execution, order routing
- filesystem writes/persistence/runtime capture/runtime replay/live network defaults/scheduled jobs/provider expansion
- recommendations/signals/investment advice
- real orders/funds/PnL

READ_ONLY remains default. FULL_AUTO and LIMITED_LIVE remain locked.

## Next phase guidance

Next recommended phase (**preview only**): **Phase 85 (implemented) — Post-Send Observation Boundary Contracts v1**.

Phase 85 (implemented) is not implemented in this phase.
