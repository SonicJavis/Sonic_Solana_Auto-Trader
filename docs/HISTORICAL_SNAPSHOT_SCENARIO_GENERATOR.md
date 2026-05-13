# Historical Snapshot Scenario Generator

## Phase 72 — Deterministic Scenario Generator from Historical Snapshots v1

### Purpose

Phase 72 adds `apps/dashboard/src/historical-snapshot-scenario-generator/` as a deterministic, fixture-derived, local-only, read-only scenario-generation contract layer built from Phase 71 historical snapshot ingestion fixtures.

### Relationship to Phase 71/70/68/67/66/65

- **Phase 71** supplies source historical snapshot ingestion contracts used as immutable scenario-generation inputs.
- **Phase 70** supplies reliability/drift references used for source selection and drift/risk linkage.
- **Phase 68** supplies replay linkage used for replay-ready descriptors.
- **Phase 67** supplies quality/conflict linkage used for quality/risk linkage.
- **Phase 66** supplies read-only provider posture references.
- **Phase 65** supplies first adapter source references.

### Phase 71 hardening summary (preflight gate)

Before Phase 72 implementation, Phase 71 was hardened in this PR:

- normalization now preserves source snapshot array order (no implicit resorting)
- source snapshot arrays are copied and frozen per fixture (no shared by-reference arrays)
- `validateHistoricalSnapshotIngestionContractSafety()` now rejects every unsafe capability flag independently
- Phase 71 regressions added for normalized fixtures validity, source array immutability, and full unsafe-flag safety rejection coverage

### GitHub/source research summary and decisions

Useful references reviewed:

- `https://json-schema.org/understanding-json-schema/reference/object`
  - relevance: required fields, strict object validation, `additionalProperties` controls
  - adapted pattern: explicit required-field checks and fail-closed validation contracts
  - not copied: runtime schema tooling
- `https://json-schema.org/understanding-json-schema/reference/conditionals`
  - relevance: conditional rejection rules (`dependentRequired`, `if/then/else`)
  - adapted pattern: fixture-state dependent rejection/fail-closed logic
  - not copied: generic runtime schema engines
- `https://raw.githubusercontent.com/OpenLineage/OpenLineage/main/README.md`
  - relevance: lineage model framing around source entities and generated entities
  - adapted pattern: explicit snapshot/manifest/reliability/replay-to-scenario lineage references
  - not copied: runtime instrumentation or event transport
- `https://raw.githubusercontent.com/in-toto/specification/master/in-toto-spec.md`
  - relevance: integrity/hash chain concepts for deterministic artifact provenance
  - adapted pattern: deterministic source/generation hashes and checksums in integrity contracts
  - not copied: signing/key workflows or supply-chain runtime integration
- `https://raw.githubusercontent.com/TauriccResearch/Solana-Trading-Bot/master/README.md`
- `https://raw.githubusercontent.com/web3batman/Solana_Memecoin_Sniper_Bot/main/README.md`
- `https://raw.githubusercontent.com/machenxi/meteora-sniper-bot/main/README.md`
  - relevance: representative unsafe Solana sniper/trading bot scopes
  - adapted pattern: none (anti-pattern references only)
  - not copied: private-key ingestion, live network listeners, signing/sending/execution logic, auto-trading/profit flows

### Unsafe/scam patterns explicitly rejected

- private key / seed phrase / mnemonic / multi-wallet import flows
- hidden signing/sending/transaction execution paths
- runtime websocket/GRPC/live RPC listeners in deterministic paths
- postinstall/binary/obfuscated script behavior
- pay-to-unlock Telegram/Discord gating and profit-marketing language
- runtime handlers/routes/UI/DOM/persistence/filesystem/background jobs

### Generation plan model

`SnapshotScenarioGenerationPlan` includes:

- `generationPlanId`, `generationPlanName`, `generationPlanKind`, `phase`
- `sourceSnapshotFixtureName`, `generatorMode`, `deterministicSeedLabel`
- `fixtureOnly: true`, `liveData: false`
- `requiresNetwork: false`, `requiresFilesystem: false`
- `failClosed`

### Source selection model

`SnapshotSourceSelection` includes:

- `sourceSelectionId`
- `selectedSnapshotIds`, `selectedProviderIds`, `selectedReliabilityRefs`
- `selectionReasonCode`, `selectionWarnings`

### Generated scenario descriptor model

`GeneratedSnapshotScenarioDescriptor` includes:

- `scenarioId`, `scenarioName`, `scenarioKind`
- `sourceSnapshotId`
- `generatedFromSnapshot: true`, `deterministic: true`
- `replayReady`, `advisory: false`

### Replay descriptor model

`SnapshotReplayDescriptor` includes:

- `replayDescriptorId`, `replayKind`
- `expectedStepCount`, `expectedSnapshotCount`, `expectedFinalStateKind`
- `replayImportMode: deterministic_fixture_only`
- `liveReplayImport: false`

### Lineage model

`SnapshotScenarioLineage` includes:

- `lineageId`
- `sourceSnapshotRefs`, `sourceManifestRefs`, `sourceReliabilityRefs`, `sourceReplayRefs`
- `generatedScenarioRefs`, `lineageSummary`

### Integrity/checksum model

`SnapshotScenarioIntegrityContract` includes:

- `integrityId`, `checksum`, `checksumAlgorithm`
- `sourceHash`, `generatedScenarioHash`
- `deterministic: true`

### Validation/rejection model

- `SnapshotScenarioValidationContract` defines rules/rejections/critical reasons/warnings with fail-closed behavior.
- `SnapshotScenarioRejectionContract` defines rejection kind/severity/reason/fail-closed/safety notes.
- validation rejects unsafe live/runtime/network/filesystem/persistence/wallet/signing/sending/execution/advisory/order/funds/PnL/route/UI/DOM drift.

### Quality/reliability/risk linkage models

- `SnapshotScenarioQualityLinkage` references Phase 67 quality fixtures.
- `SnapshotScenarioReliabilityLinkage` references Phase 70 reliability fixtures.
- `SnapshotScenarioRiskLinkage` captures deterministic risk posture and fail-closed state.

### Audit report model

`SnapshotScenarioGenerationAuditReport` includes:

- `reportId`
- `planSummary`, `sourceSelectionSummary`, `scenarioSummary`, `replaySummary`
- `lineageSummary`, `integritySummary`, `validationSummary`, `safetySummary`

### View model / API contract / selector overview

Phase 72 includes deterministic:

- `HistoricalSnapshotScenarioGeneratorViewModel`
- list/detail/summary/error API contract fixtures
- pure selector helpers over fixture tables

No routes, handlers, runtime requests, rendering, networking, persistence, or filesystem writes are added.

### Capability flags

Positive flags expose deterministic historical snapshot scenario generation surfaces.

Negative flags remain fixed `false` for live generation/runtime generation/live ingestion/runtime ingestion/live replay import/live network/runtime collectors/secrets/API-key requirement/write/wallet/private-key/signing/sending/execution/recommendations/signals/investment advice/routes/runtime/UI/DOM/persistence/filesystem/background/scheduled jobs/real orders/real funds/real PnL/provider expansion.

### Safety constraints

Phase 72 remains:

- read-only
- local-only by default
- deterministic in standard CI
- fixture-backed
- fail-closed
- non-wallet / non-signing / non-sending / non-executing
- non-advisory

And explicitly does **not** add:

- live generation or runtime generation
- live ingestion/runtime ingestion/runtime collectors
- live replay import or default live network access
- secrets/API keys requirement
- provider expansion or live reconciliation
- filesystem writes/persistence/background jobs
- write methods or transaction building/signing/sending
- execution/live trading
- recommendations/signals/investment advice
- real orders/funds/PnL
- route handlers/runtime requests/UI/DOM

### Testing summary

`tests/phase72.test.ts` covers:

- source/docs existence
- constants, names/kinds/count/map/list/get and root export propagation
- all generation/source/scenario/replay/lineage/integrity/validation/rejection/linkage/report/view/API/selectors builders
- normalization/serialization/equality/checksum determinism
- validation/safety success and rejection cases
- required 8 fixture scenarios and linkage to Phase 71/70/68/67/66/65
- blocked/quarantined/replay-ready behavior
- capability propagation to dashboard/read-only-api surfaces
- deterministic primitive scan checks
- Phase 73 preview-only documentation guard

### Explicit non-goals

Phase 72 does not implement live generation, runtime generation, live ingestion, runtime ingestion, live replay import, runtime collectors, persistence/filesystem writes, provider expansion, wallet logic, signing/sending/execution, recommendations/signals/advice, real orders/funds/PnL, route handlers/runtime requests, UI/DOM, or background jobs.

### Next phase guidance

**Phase 73 — Optional Provider-Aware Replay Import Contracts v1** is preview only and **not implemented** in Phase 72.
