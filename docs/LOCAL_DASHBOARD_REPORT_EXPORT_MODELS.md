# Local Dashboard Report Export Models

**Phase 28 — Local Dashboard Report Export Models v1**

> Phase 34 compatibility note: Offline intelligence report-integration models now expose synthetic metadata flags (`dashboardReportCompatible: true`) for future local report-surface alignment. No export behavior changes are introduced.

## 1. Phase 28 Purpose

Phase 28 adds a deterministic, local-only, fixture-backed report export-model layer on top of Phase 27 render snapshots.

This phase prepares typed report payloads for future local export workflows without implementing any runtime export action.

## 2. Safety Boundaries

Phase 28 report models are:

- local-only
- read-only
- fixture-backed
- deterministic
- in-memory
- non-persistent
- external-network-free
- non-mutating
- file-write-free

Phase 28 adds **no**:

- filesystem writes
- browser downloads
- PDF/CSV/HTML file generation
- Blob/URL.createObjectURL export APIs
- browser storage
- persistence
- live data
- Solana RPC
- provider APIs
- wallets/private keys
- signing/sending
- execution/trading controls
- mutation controls

## 3. Report Model Architecture

Data flow for report models:

```
Phase 23 fixtures
  -> Phase 24 view models
    -> Phase 25 render shell
      -> Phase 26 interaction/filter state
        -> Phase 27 deterministic snapshots
          -> Phase 28 report export models
```

Implementation location:

```
apps/dashboard/src/reports/
  types.ts
  builders.ts
  normalization.ts
  validation.ts
  fixtures.ts
  capabilities.ts
  index.ts
```

## 4. Core Types

Phase 28 introduces strict report types:

- `DashboardReportModel`
- `DashboardReportName`
- `DashboardReportKind`
- `DashboardReportSection`
- `DashboardReportSectionKind`
- `DashboardReportMeta`
- `DashboardReportSummary`
- `DashboardReportSafetyBoundary`
- `DashboardReportValidationResult`
- `DashboardReportValidationIssue`
- `DashboardReportBuildInput`
- `DashboardReportBuildResult`
- `DashboardReportSafetyResult`
- `DashboardReportFixture`
- `DashboardReportFixtureName`

## 5. Report Fixture Cases

Phase 28 includes 20 deterministic report fixtures:

1. full dashboard report
2. health report section
3. capabilities report section
4. overview report section
5. evidence report section
6. safety report section
7. metadata report section
8. interaction/filter state report section
9. filtered evidence report section
10. filtered safety report section
11. snapshot inventory report
12. safety boundary report
13. error state report
14. empty state report
15. loading state report
16. unavailable state report
17. no-results report
18. malformed-input-safe report
19. report validation failure example
20. export-disabled safety report

## 6. Builder Examples

```ts
import {
  buildDefaultDashboardReportModel,
  buildSnapshotInventoryReportModel,
  buildSnapshotBackedReportFromFixture,
} from '@sonic/dashboard';

const full = buildDefaultDashboardReportModel();
const inventory = buildSnapshotInventoryReportModel();
const health = buildSnapshotBackedReportFromFixture(
  'health-panel',
  'health-report-section',
  'section',
  'Health Report Section',
  ['Health report fixture.'],
);
```

## 7. Validation Examples

```ts
import {
  validateDashboardReportModel,
  validateDashboardReportSafety,
} from '@sonic/dashboard';

const reportValidation = validateDashboardReportModel(report);
const safetyValidation = validateDashboardReportSafety(report);
```

Validation checks include:

- required fields
- supported report names/kinds
- supported section kinds
- serializability
- deterministic metadata
- stable sorted ordering
- source snapshot compatibility
- stable safety boundary flags
- no stack traces
- no local paths
- no secrets

## 8. How Phase 28 Prepares Future Export Work

Phase 28 adds export-ready, typed, deterministic report payloads only.

It does **not** perform export actions, but it provides stable model contracts future phases can serialize safely.

## 9. What Phase 28 Does NOT Implement

- no file writing
- no browser download behavior
- no PDF/CSV/HTML generation
- no persistence layer
- no network APIs
- no runtime scheduling
- no wallet/trade/execute controls

## 10. Phase 29 Follow-on (Implemented Separately)

Next likely phase:

> Phase 29 — Local Dashboard Report Serialization Preview v1

Phase 29 is implemented in `apps/dashboard/src/report-serialization/` and documented in `docs/LOCAL_DASHBOARD_REPORT_SERIALIZATION_PREVIEW.md`.

## 11. Explicit Safety Confirmation

Phase 28 adds no file writes, live data, Solana RPC, provider APIs, wallets, execution, trading, external network access, persistence, browser storage, or mutation controls.
