# Historical Snapshot Ingestion Contracts

## Phase 71 — Read-Only Historical Snapshot Ingestion Contracts v1

### Purpose

Phase 71 adds `apps/dashboard/src/historical-snapshot-ingestion-contracts/` as a deterministic, fixture-derived, local-only, read-only historical snapshot ingestion contract layer for manifest, schema, provenance, normalization, validation, freshness, integrity, import-plan, rejection, linkage, report, and API/selectors surfaces.

### Relationship to Phase 70/69/68/67/66/65

- **Phase 70** supplies provider reliability telemetry/drift fixture linkage.
- **Phase 69** supplies live-smoke safety certification fixture linkage.
- **Phase 68** supplies provider-aware replay scenario linkage.
- **Phase 67** supplies cross-provider data quality linkage.
- **Phase 66** supplies multi-provider read-only source posture linkage.
- **Phase 65** supplies first read-only provider adapter source linkage.

### GitHub/source research summary and decisions

Useful references reviewed:

- `https://json-schema.org/understanding-json-schema/reference/object`
  - relevance: strict object schema field contracts and required-field validation.
  - adapted pattern: explicit required/optional/critical fields with fail-closed behavior for critical drift.
  - not copied: runtime validators or schema engines.
- `https://json-schema.org/understanding-json-schema/reference/conditionals`
  - relevance: conditional required field patterns.
  - adapted pattern: deterministic rejection and fail-closed handling for missing critical field states.
  - not copied: direct schema implementation code.
- `https://raw.githubusercontent.com/openlineage/OpenLineage/main/README.md`
  - relevance: lineage/provenance metadata modeling concepts.
  - adapted pattern: explicit provenance references and lineage summary fields in fixture contracts.
  - not copied: event transport/runtime lineage collectors.
- `https://raw.githubusercontent.com/in-toto/specification/master/in-toto-spec.md`
  - relevance: immutable artifact hash/metadata chain concepts.
  - adapted pattern: deterministic manifest/source/checksum hash fields and integrity contract structure.
  - not copied: signing, key management, or supply-chain runtime tooling.
- `https://raw.githubusercontent.com/TauriccResearch/Solana-Trading-Bot/master/README.md`
- `https://raw.githubusercontent.com/web3batman/Solana_Memecoin_Sniper_Bot/main/README.md`
- `https://raw.githubusercontent.com/machenxi/meteora-sniper-bot/main/README.md`
  - relevance: representative unsafe execution-focused Solana bot patterns.
  - adapted pattern: none; used only as anti-pattern references.
  - not copied: private key collection, live RPC/websocket defaults, transaction building/signing/sending, buy/sell execution logic.

### Unsafe/scam patterns explicitly rejected

- private key / seed phrase / mnemonic / wallet import or registration flows
- hidden or explicit signing/sending/execution logic
- forced live RPC/network runtime ingestion in deterministic paths
- obfuscated/minified runtime scripts and postinstall/drainer behavior
- Telegram/Discord pay-to-unlock behavior and unrealistic profit claims
- route handlers/runtime requests/UI/DOM/persistence/background jobs

### Snapshot manifest model

`SnapshotManifest` includes:

- `snapshotId`, `snapshotName`, `snapshotKind`, `phase`, `schemaVersion`
- `capturedAt` deterministic timestamp
- `fixtureOnly: true`, `liveData: false`
- `sourceProviderId`, `sourceReliabilityFixtureName`

### Source metadata model

`SnapshotSourceMetadata` includes:

- `sourceMetadataId`, `sourceKind`
- `providerId`, `providerName`
- `reliabilityBand`, `freshnessBand`
- `observationWindow`, `sourceRefs`

### Schema/version contract model

`SnapshotSchemaContract` includes:

- `schemaContractId`, `expectedSchemaVersion`
- `compatibilityLevel`
- `requiredFields`, `optionalFields`, `criticalFields`
- `failClosedOnCriticalDrift`

### Provenance contract model

`SnapshotProvenanceContract` includes:

- `provenanceId`
- `sourcePhaseRefs` (65–70)
- `sourceFixtureRefs`
- `providerReliabilityRefs`, `replayScenarioRefs`, `dataQualityRefs`
- `lineageSummary`

### Normalization contract model

`SnapshotNormalizationContract` includes deterministic guarantees:

- `normalizationContractId`, `normalizationMode`
- `stableOrdering`, `deterministicChecksum`
- `localeIndependent`, `mutationFree`

### Validation contract model

`SnapshotValidationContract` includes:

- `validationContractId`
- `rules`, `rejectionReasons`
- `criticalFailureReasons`, `warningReasons`
- `failClosed`

### Freshness/staleness contract model

`SnapshotFreshnessContract` includes:

- `freshnessContractId`
- `snapshotAgeBucket`, `stale`, `staleReasonCode`
- `freshnessWindow`, `sourceTelemetryRefs`

### Integrity/checksum contract model

`SnapshotIntegrityContract` includes:

- `integrityContractId`
- `checksum`, `checksumAlgorithm`
- `manifestHash`, `sourceHash`
- `deterministic`

### Import plan contract model

`SnapshotImportPlan` remains contract-only:

- `importPlanId`, `planMode`
- `disabledRuntimeImport: true`
- `requiresNetwork: false`
- `requiresFilesystem: false`
- `requiresSecrets: false`
- `plannedSteps`, `expectedOutcome`

### Rejection/failure contract model

`SnapshotRejectionContract` includes:

- `rejectionId`, `rejectionKind`, `severity`
- `reasonCode`, `failClosed`
- `safetyNotes`

### Replay/reliability linkage models

- `SnapshotReplayLinkage` links snapshots to Phase 68 replay fixtures.
- `SnapshotReliabilityLinkage` links snapshots to Phase 70 reliability fixtures.

### Report model

`HistoricalSnapshotAuditReport` includes:

- `reportId`
- `manifestSummary`, `schemaSummary`, `provenanceSummary`
- `freshnessSummary`, `integritySummary`, `validationSummary`
- `linkageSummary`, `safetySummary`

### View model / API contract / selector overview

Phase 71 includes deterministic:

- `HistoricalSnapshotIngestionContractViewModel`
- list/detail/summary/error API contract fixtures
- pure selector helpers over fixture tables

No routes, handlers, runtime requests, rendering, networking, or persistence are added.

### Capability flags

Positive flags expose deterministic historical snapshot ingestion contract surfaces.

Negative flags remain fixed `false` for live ingestion/runtime ingestion/live network/runtime collectors/secrets/API key requirements/write/wallet/private-key/signing/sending/execution/recommendations/signals/investment advice/routes/runtime/UI/DOM/persistence/filesystem/background/scheduled jobs/real orders/real funds/real PnL/provider expansion.

### Safety constraints

Phase 71 remains:

- read-only
- local-only by default
- deterministic in standard CI
- fixture-backed
- contract-only / import-model-only
- fail-closed
- non-wallet / non-signing / non-sending / non-executing
- non-advisory

And explicitly does **not** add:

- live ingestion
- runtime ingestion/collectors
- default live network access
- secrets/API keys requirement
- provider expansion
- live reconciliation/live replay import
- filesystem writes/persistence
- write methods or transaction building
- wallet/signing/sending/execution
- recommendations/signals/investment advice
- real orders/funds/PnL
- route handlers/runtime requests/UI/DOM
- background jobs

### Validation behavior

Validation rejects:

- missing required fields and wrong phase/schema/meta
- duplicate IDs/names and low fixture count
- non-deterministic timestamps
- live ingestion/runtime ingestion/live network/runtime collector drift
- import plan requiring network/filesystem/secrets
- critical drift without fail-closed
- partial snapshot not quarantined
- missing integrity/provenance refs
- unsafe capability drift
- unsafe URL/network/wallet/execution/secret/advisory text patterns
- source Phase 65/66/67/68/69/70 snapshot mutation

### Testing summary

`tests/phase71.test.ts` covers:

- source/docs existence
- constants, names, kinds, fixture map/list/get and root exports
- all builder surfaces (manifest/source/schema/provenance/normalization/validation/freshness/integrity/import/rejection/replay/reliability/report/view/API)
- selectors/normalization/serialization/equality/checksum determinism
- validation/safety success and rejection paths
- practical linkage to Phase 65/66/67/68/69/70 fixture snapshots
- required 8 fixture scenarios
- capability propagation to dashboard/read-only-api surfaces
- deterministic primitive scan checks
- Phase 72 preview-only documentation guard

### Explicit non-goals

Phase 71 does not implement live ingestion, runtime collectors, persistence/filesystem writes, provider expansion, wallet logic, signing/sending/execution, recommendations/signals/advice, real orders/funds/PnL, route handlers/runtime requests, UI/DOM, or background jobs.

### Next phase guidance

**Phase 72 — Deterministic Scenario Generator from Historical Snapshots v1** is preview only and **not implemented** in Phase 71.
