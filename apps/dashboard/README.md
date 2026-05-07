# Dashboard — @sonic/dashboard

## Phase 28 — Local Dashboard Report Export Models v1

This package provides the Phase 25/26/27/28 local read-only dashboard UI shell, render snapshots, and report export-model layer for the Sonic Solana Auto-Trader project.

## Safety

**This dashboard is local-only, read-only, fixture-backed, and has no live data, execution, or wallet access.**

| Boundary | Status |
|---|---|
| Local only | ✅ Yes |
| Read only | ✅ Yes |
| Fixture backed | ✅ Yes |
| Deterministic | ✅ Yes |
| Live data | ❌ No |
| Solana RPC | ❌ No |
| External network | ❌ No |
| Wallet integration | ❌ No |
| Trading controls | ❌ No |
| Execution controls | ❌ No |
| Snapshot persistence | ❌ No |
| Snapshot external network | ❌ No |

## What This Package Provides

Phase 25 adds the local read-only dashboard UI shell.  
Phase 26 adds local in-memory interaction state and deterministic filters/selectors on top of that shell.  
Phase 27 adds deterministic render snapshots and regression fixtures.  
Phase 28 adds deterministic local dashboard report export models (type-safe, fixture-backed, and validation-ready).

Components:

- `DashboardShell` — top-level shell component
- `SafetyBanner` — local/read-only/fixture-backed safety notices
- `MetadataPanel` — phase and safety metadata panel
- `HealthPanel` — health view model panel
- `CapabilitiesPanel` — capabilities view model panel
- `OverviewPanel` — dashboard overview panel
- `EvidencePanel` — evidence entries panel
- `SafetyPanel` — safety invariants panel
- `EmptyState`, `LoadingState`, `ErrorState`, `UnavailableState` — safe state components
- `StatusBadge` — typed status badge component
- `buildFixtureDashboardViewModel()` — fixture-backed view model builder
- `getDashboardUiShellCapabilities()` — Phase 25/26/27 capability flags
- Phase 26 state helpers under `src/state/` for active panel, visibility, filters, sort, reset, reducer-style updates, and selectors
- Phase 27 snapshot helpers under `src/snapshots/` for regression fixtures, snapshot builders, normalization, validation, and safety checks
- Phase 28 report helpers under `src/reports/` for report models, report fixtures, normalization, validation, and safety checks

## Phase 28 Report API

```typescript
import {
  buildDefaultDashboardReportModel,
  buildSnapshotInventoryReportModel,
  listDashboardReportFixtures,
  getDashboardReportFixture,
  validateDashboardReportModel,
  validateDashboardReportSafety,
  getDashboardReportCapabilities,
} from '@sonic/dashboard';
```

## Phase 27 Snapshot API

```typescript
import {
  buildDefaultDashboardRenderSnapshot,
  buildPanelRenderSnapshot,
  buildSafetyBannerSnapshot,
  listDashboardRenderSnapshotFixtures,
  getDashboardRenderSnapshotFixture,
  validateDashboardRenderSnapshot,
  validateDashboardRenderSnapshotSafety,
  PHASE_27_FIXTURE_SUITE,
  getDashboardSnapshotCapabilities,
} from '@sonic/dashboard';

// Build a default shell snapshot
const snap = buildDefaultDashboardRenderSnapshot(viewModel);

// Validate a snapshot
const result = validateDashboardRenderSnapshot(snap);

// Get all fixture names
const names = listDashboardRenderSnapshotFixtures();

// Get capabilities
const caps = getDashboardSnapshotCapabilities();
```

## Usage

```typescript
import {
  DashboardShell,
  buildFixtureDashboardViewModel,
} from '@sonic/dashboard';

const viewModel = buildFixtureDashboardViewModel();
const shell = DashboardShell({ viewModel });
```

## Data Source

All data is sourced from Phase 23 read-only API client fixtures only. No HTTP requests. No network calls. Deterministic.

## Documentation

See `docs/LOCAL_READ_ONLY_DASHBOARD_UI.md` and `docs/LOCAL_DASHBOARD_INTERACTION_STATE.md` for full documentation.

## Previous Phases

- Phase 1: Placeholder only
- Phase 24: `@sonic/dashboard-view-models` added as a typed data adapter layer
- Phase 25: Local read-only dashboard UI shell added (this package)
- Phase 26: Local deterministic interaction state and filter selectors added (in-memory only)
