# Strategy Review Export Audit Report View Models

## Phase 47 — Strategy Review Export Audit Report View Models v1

### Purpose

Phase 47 introduces deterministic, synthetic, read-only strategy review export audit report view models in `apps/dashboard/src/strategy-review-export-audit-report-view-models/`.

These view models provide stable fixture-derived display/contract data for future local dashboard and read-only API consumption.

### Relationship to Phase 46

- Source of truth: Phase 46 strategy review export audit report fixtures only
- One Phase 47 view model per Phase 46 report fixture
- No live audit/report system integration
- No new source data outside Phase 46/45/44 references

### Fixture-derived View-model Design

This module is fixture-derived and non-operational:

- No real reports
- No downloads
- No PDF generation
- No CSV generation
- No HTML generation
- No filesystem writes
- No persistence
- No queue workers
- No scheduled/background jobs
- No real audit execution
- No actual audit logs
- No live data
- No network access
- No wallet/signing/sending logic
- No execution behavior
- No recommendations, trading signals, or investment advice
- No UI rendering
- No DOM access
- No API endpoints added in this phase

### View-model Structure

Each view model includes stable deterministic fields:

- `viewModelId`, `viewModelName`, `viewModelKind`, `phase`
- source linkage (`sourceReportId`, `sourceReportName`, `sourceReportKind`, `sourceAuditId`, `sourceAuditName`, `sourceQueueReference`)
- display fields (`displayTitle`, `displaySubtitle`, `statusLabel`, `severityLabel`)
- `summaryCards`
- `detailSections`
- `evidenceItems`
- `safetyBadges`
- `validationBadges`
- `limitationItems`
- `nextPhaseNotes`
- `capabilityFlags`
- `meta`
- `safety`

### View-model List / Overview

- View-model count is derived from Phase 46 fixture list size
- `STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_NAMES` and `...KINDS` are deterministically mapped from Phase 46 names/kinds
- `STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODELS` is a deterministic list
- `STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_MAP` provides stable lookup by view-model name

### Capability Flags

Positive flags:

- `strategyReviewExportAuditReportViewModels: true`
- `syntheticStrategyReviewExportAuditReportViewModels: true`
- `deterministicStrategyReviewExportAuditReportViewModels: true`
- `localOnlyStrategyReviewExportAuditReportViewModels: true`
- `readOnlyStrategyReviewExportAuditReportViewModels: true`
- `fixtureDerivedStrategyReviewExportAuditReportViewModels: true`

Negative flags:

- `strategyReviewExportAuditReportViewModelLiveData: false`
- `strategyReviewExportAuditReportViewModelNetworkAccess: false`
- `strategyReviewExportAuditReportViewModelPersistence: false`
- `strategyReviewExportAuditReportViewModelFilesystemWrites: false`
- `strategyReviewExportAuditReportViewModelDownloads: false`
- `strategyReviewExportAuditReportViewModelPdfGeneration: false`
- `strategyReviewExportAuditReportViewModelCsvGeneration: false`
- `strategyReviewExportAuditReportViewModelHtmlGeneration: false`
- `strategyReviewExportAuditReportViewModelUiRendering: false`
- `strategyReviewExportAuditReportViewModelDomAccess: false`
- `strategyReviewExportAuditReportViewModelBackgroundJobs: false`
- `strategyReviewExportAuditReportViewModelScheduledJobs: false`
- `strategyReviewExportAuditReportViewModelExecution: false`
- `strategyReviewExportAuditReportViewModelTradingSignals: false`
- `strategyReviewExportAuditReportViewModelRecommendations: false`
- `strategyReviewExportAuditReportViewModelInvestmentAdvice: false`

### Safety Constraints

All view models are deterministic, synthetic, local-only, read-only, fixture-derived, and in-memory-only.

Validation rejects unsafe states and broken references, including:

- invalid source report/audit/queue linkage
- unsafe capability flips
- orphan evidence references
- invalid summary-card or detail-section ordering
- non-deterministic metadata values
- network/filesystem/execution/advisory-like payloads

### Validation Behavior

The module exports:

- `validateStrategyReviewExportAuditReportViewModel()` for structural and source-link validation
- `validateStrategyReviewExportAuditReportViewModelSafety()` for safety validation
- normalization/serialization/equality helpers for deterministic comparisons

### Testing Summary

`tests/phase47.test.ts` covers:

- constants and exports
- view-model count/name/kind/map/list/get behavior
- one-to-one Phase 46 linkage
- deterministic build/normalize/serialize/equality behavior
- summary-card, detail-section, and evidence integrity
- validation success and negative failure cases
- capability propagation to dashboard/read-only-api
- source safety scans against forbidden runtime patterns
- source fixture immutability under Phase 47 builders

### Explicit Non-goals

Phase 47 does not implement:

- real reporting systems
- browser downloads
- export files
- PDF/CSV/HTML rendering pipelines
- persistence or database writes
- queue workers or scheduling
- network integrations
- wallet/trading/execution logic
- recommendations/signals/investment advice
- UI rendering or DOM behavior
- API endpoints

### Next Phase Guidance

Future phases may consume these deterministic view models in additional local read-only surfaces while keeping all unsafe capabilities disabled.
