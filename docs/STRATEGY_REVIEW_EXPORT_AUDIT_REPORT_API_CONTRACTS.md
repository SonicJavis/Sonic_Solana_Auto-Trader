# Strategy Review Export Audit Report Read-Only API Contracts

**Phase 48 — Strategy Review Export Audit Report Read-Only API Contracts v1**

---

## Purpose

This module provides deterministic, synthetic, read-only API contract fixtures derived from Phase 47 strategy review export audit report view models. These contracts represent stable, local-only, fixture-derived API response data structures intended for future local read-only API phases.

**These are fixture-derived read-only API contract data only.**

---

## Non-Goals (Explicit Scope Exclusions)

The following are explicitly **not implemented** in Phase 48:

- No real HTTP endpoints
- No route handlers
- No runtime request handling
- No real reports
- No downloads
- No PDF generation
- No CSV generation
- No HTML generation
- No filesystem writes
- No persistence
- No background jobs
- No scheduled jobs
- No queue workers
- No real audit execution
- No actual audit logs
- No live data
- No network access
- No wallet logic
- No private key or signing
- No execution logic
- No recommendations
- No trading signals
- No investment advice
- No UI rendering
- No DOM access
- No browser APIs

---

## Relationship to Phase 47

Phase 47 provided deterministic synthetic strategy review export audit report view models, each derived from one Phase 46 report fixture. Phase 48 consumes Phase 47 view models as its immutable source and produces API contract fixtures from them.

The dependency chain:

```
Phase 44 (Strategy Review Export Queue)
  → Phase 45 (Strategy Review Export Audit)
    → Phase 46 (Strategy Review Export Audit Report)
      → Phase 47 (Strategy Review Export Audit Report View Models)
        → Phase 48 (Strategy Review Export Audit Report Read-Only API Contracts)
```

---

## Module Location

**Architectural note:** This module is located in `apps/dashboard/src/strategy-review-export-audit-report-contracts/` rather than `apps/read-only-api/src/` as specified in the Phase 48 prompt. This decision was made because:

1. The Phase 47 view model source data lives in the dashboard app.
2. The project's tsconfig references create a `apps/dashboard → apps/read-only-api` dependency.
3. Placing Phase 48 in `apps/read-only-api` and importing Phase 47 view models would require a reverse `apps/read-only-api → apps/dashboard` reference, creating a circular dependency.
4. Phases 40–47 all use the dashboard app as their home.
5. Following the existing repo convention is the safer choice (the prompt states: "If existing repo patterns conflict with this prompt, choose the safer, more restrictive option and document the decision").

The read-only API capability surface (`apps/read-only-api/src/types.ts` and `apps/read-only-api/src/capabilities.ts`) is updated separately without importing from this module.

---

## Contract Structure

Each Phase 48 API contract fixture has the following top-level fields:

| Field | Description |
|---|---|
| `contractId` | Stable deterministic ID derived from a seed string |
| `contractName` | Unique human-readable contract identifier |
| `contractKind` | One of: `list`, `detail`, `summary`, `error` |
| `phase` | Always `48` |
| `endpointPattern` | Canonical URI pattern for this contract (documentation only) |
| `method` | Always `GET` (read-only) |
| `readOnly` | Always `true` |
| `fixtureOnly` | Always `true` |
| `sourceViewModelIds` | Array of Phase 47 view model IDs referenced by this contract |
| `sourceReportIds` | Array of Phase 46 report IDs |
| `sourceAuditIds` | Array of Phase 45 audit IDs |
| `statusCode` | HTTP status code (200 for success, 404/422 for error) |
| `success` | `true` for list/detail/summary; `false` for error |
| `data` | Contract payload (null for error contracts) |
| `error` | Error shape (null for success contracts) |
| `meta` | Metadata/envelope object |
| `pagination` | Pagination metadata (list only; null otherwise) |
| `filters` | Filter metadata (list only; empty otherwise) |
| `sorts` | Sort metadata (list only; empty otherwise) |
| `safety` | Safety envelope object |
| `capabilityFlags` | Capability flag object |

### Metadata Envelope (`meta`)

| Field | Value |
|---|---|
| `phase` | `48` |
| `contractVersion` | `'1.0.0'` |
| `generatedAt` | `'2026-01-04T00:00:00.000Z'` (deterministic constant) |
| `deterministicSeed` | Stable seed string used to derive `contractId` |
| `source` | `'phase48_strategy_review_export_audit_report_api_contracts_v1'` |
| `fixtureOnly` | `true` |
| `readOnly` | `true` |
| `liveData` | `false` |
| `networkAccess` | `false` |
| `persistence` | `false` |
| `execution` | `false` |
| `recommendations` | `false` |
| `tradingSignals` | `false` |
| `investmentAdvice` | `false` |

---

## Contract Types

### List Response Contract

Represents a deterministic list of all Phase 47 view models. Includes static pagination metadata (total count = number of Phase 47 view models), filter metadata (field/value pairs), and sort metadata.

**Contract name:** `strategy-review-export-audit-report-list-contract`

### Detail Response Contracts

One detail contract per Phase 47 view model. Each references exactly one Phase 47 view model. Includes full view model data (summary cards, detail sections, evidence items, safety badges, validation badges, limitation items, next-phase notes).

**Contract name pattern:** `strategy-review-export-audit-report-detail-contract-{viewModelId}`

### Summary Response Contract

Represents deterministic aggregate summary data derived from all Phase 47 view models. Includes total count and grouped counts by status, severity, and kind.

**Contract name:** `strategy-review-export-audit-report-summary-contract`

### Error Response Contracts

Static deterministic fixtures for invalid contract request states only.

| Name | Status Code | Error Code |
|---|---|---|
| `strategy-review-export-audit-report-error-not-found-contract` | 404 | `STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_CONTRACT_NOT_FOUND` |
| `strategy-review-export-audit-report-error-invalid-id-contract` | 422 | `STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_CONTRACT_INVALID_ID` |

---

## Capability Flags

### Positive (enabled) capabilities

- `strategyReviewExportAuditReportApiContracts: true`
- `syntheticStrategyReviewExportAuditReportApiContracts: true`
- `deterministicStrategyReviewExportAuditReportApiContracts: true`
- `localOnlyStrategyReviewExportAuditReportApiContracts: true`
- `readOnlyStrategyReviewExportAuditReportApiContracts: true`
- `fixtureDerivedStrategyReviewExportAuditReportApiContracts: true`

### Negative (blocked) capabilities

- `strategyReviewExportAuditReportApiContractLiveData: false`
- `strategyReviewExportAuditReportApiContractNetworkAccess: false`
- `strategyReviewExportAuditReportApiContractPersistence: false`
- `strategyReviewExportAuditReportApiContractFilesystemWrites: false`
- `strategyReviewExportAuditReportApiContractDownloads: false`
- `strategyReviewExportAuditReportApiContractPdfGeneration: false`
- `strategyReviewExportAuditReportApiContractCsvGeneration: false`
- `strategyReviewExportAuditReportApiContractHtmlGeneration: false`
- `strategyReviewExportAuditReportApiContractRouteHandlers: false`
- `strategyReviewExportAuditReportApiContractHttpServer: false`
- `strategyReviewExportAuditReportApiContractRuntimeRequests: false`
- `strategyReviewExportAuditReportApiContractUiRendering: false`
- `strategyReviewExportAuditReportApiContractDomAccess: false`
- `strategyReviewExportAuditReportApiContractBackgroundJobs: false`
- `strategyReviewExportAuditReportApiContractScheduledJobs: false`
- `strategyReviewExportAuditReportApiContractExecution: false`
- `strategyReviewExportAuditReportApiContractTradingSignals: false`
- `strategyReviewExportAuditReportApiContractRecommendations: false`
- `strategyReviewExportAuditReportApiContractInvestmentAdvice: false`

---

## Safety Constraints

All Phase 48 data is:

- **Static**: No runtime computation beyond pure deterministic derivation from Phase 47 fixtures.
- **Deterministic**: Same inputs always produce identical outputs.
- **Synthetic**: Derived from synthetic Phase 47 view models, not from live systems.
- **Local-only**: No network access, no external data sources.
- **Read-only**: No mutations, no persistence, no writes.
- **Fixture-derived**: Completely derived from existing phase fixture data.
- **Non-executable**: No trading, no execution, no signal generation.
- **Non-advisory**: No recommendations, no investment advice.

### Forbidden patterns in Phase 48 code

Phase 48 source code does not use:

- `Date.now()` or `new Date()` for fixture generation
- `Math.random()` or `randomUUID()`
- `fetch()`, `axios`, or `WebSocket`
- `fs.writeFile`, `fs.createWriteStream`, or similar
- `localStorage`, `indexedDB`, `document.`, `window.`
- `setInterval`, `setTimeout`, `cron`, workers, or queues
- Route handlers or HTTP server setup
- Private keys, seed phrases, or keypair logic
- Transaction signing or sending

---

## Validation Behavior

The `validateStrategyReviewExportAuditReportApiContract` function:

- Accepts any `unknown` input
- Returns a typed `StrategyReviewExportAuditReportApiContractValidationResult`
- Does not throw for normal validation failures (returns `valid: false` with issues array)
- Validates: required fields, phase value, contract kinds, safety envelope, capability flags, meta envelope, source view model references, success/error shape consistency, status codes

The `validateStrategyReviewExportAuditReportApiContractSafety` function:

- Scans string values in contracts for forbidden live-data patterns
- Excludes documentation/identifier fields to avoid false positives from fixture names
- Returns a typed `StrategyReviewExportAuditReportApiContractSafetyResult`

---

## Testing Summary

Phase 48 tests are in `tests/phase48.test.ts` and cover:

- Constants and versions
- Phase 47 source view model linkage
- Fixture counts and uniqueness
- List, detail, summary, and error contract structure
- Get/list helper functions
- All builder functions (list, detail, summary, error, generic)
- Builder determinism
- Normalization helpers
- Serialization helpers
- Equality helpers
- Validation success cases (all prebuilt contracts pass)
- Validation failure cases (corrupted contracts rejected)
- Safety validation
- Normalization guard helpers
- Capability flags (positive and negative)
- Dashboard capability propagation
- Read-only API capability propagation
- Source file structure
- Metadata/envelope integrity
- Safety envelope integrity
- Determinism across repeated builds
- Absence of unsafe patterns in source files

---

## Public API

The module exports from `apps/dashboard/src/strategy-review-export-audit-report-contracts/index.ts`:

### Constants

- `STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_PHASE` (48)
- `PHASE_48_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_GENERATED_AT`
- `PHASE_48_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SOURCE`
- `PHASE_48_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_VERSION`
- `STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_KINDS`
- `STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_NAMES`
- `STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACTS`
- `STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_MAP`
- `STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT`
- `STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_DETAIL_API_CONTRACTS`
- `STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_DETAIL_API_CONTRACT_MAP`
- `STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SUMMARY_API_CONTRACT`
- `STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_NOT_FOUND_API_CONTRACT`
- `STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_INVALID_ID_API_CONTRACT`
- `STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_API_CONTRACTS`

### Functions

- `listStrategyReviewExportAuditReportApiContracts()`
- `getStrategyReviewExportAuditReportApiContract(contractName)`
- `getStrategyReviewExportAuditReportDetailApiContractByViewModelId(viewModelId)`
- `buildStrategyReviewExportAuditReportListApiContract(viewModels)`
- `buildStrategyReviewExportAuditReportDetailApiContract(viewModel)`
- `buildStrategyReviewExportAuditReportSummaryApiContract(viewModels)`
- `buildStrategyReviewExportAuditReportErrorApiContract(input)`
- `buildStrategyReviewExportAuditReportApiContract(input)`
- `validateStrategyReviewExportAuditReportApiContract(input)`
- `validateStrategyReviewExportAuditReportApiContractSafety(input)`
- `normalizeStrategyReviewExportAuditReportApiContract(contract)`
- `serializeStrategyReviewExportAuditReportApiContract(contract)`
- `areStrategyReviewExportAuditReportApiContractsEqual(a, b)`
- `getStrategyReviewExportAuditReportApiContractCapabilities()`
- `isValidStrategyReviewExportAuditReportApiContractName(value)`
- `isValidStrategyReviewExportAuditReportApiContractKind(value)`
- `isValidStrategyReviewExportAuditReportApiContractGeneratedAt(value)`
- `isValidStrategyReviewExportAuditReportApiContractSource(value)`
- `stableDeterministicContractChecksum(content)`

---

## Next Phase Guidance

Future phases (Phase 49+) may:

- Expose Phase 48 contracts through a local read-only API server using the fixture data
- Add more contract types for other Phase 47-derived data
- Add local query/filter helpers that operate on the prebuilt fixture data

Future phases must:

- Preserve all existing safety boundaries
- Not unlock `FULL_AUTO` or `LIMITED_LIVE` modes
- Not add real HTTP endpoints, live data, execution, or advisory content
- Maintain the fixture-derived, local-only, non-advisory posture
