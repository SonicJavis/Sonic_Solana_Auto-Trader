# Local Dashboard Render Snapshots

**Phase 27 — Local Dashboard Render Snapshots and Regression Fixtures v1**

> Phase 28 consumes these deterministic snapshots to build local report export models in `apps/dashboard/src/reports/` without adding file export actions.

## Purpose

Phase 27 adds a deterministic render snapshot and regression fixture layer on top of the Phase 26 local dashboard interaction state system. This layer locks down known-good render outputs for the local read-only dashboard shell, providing a stable foundation for future dashboard development.

Phase 27 snapshots capture the typed output of dashboard components (panels, banners, shell) under specific states and filters, and compare them against stored fixtures to detect regressions.

---

## Safety Boundaries

Phase 27 maintains all existing safety guarantees from Phases 22–26.

**Phase 27 snapshots are:**
- Local-only
- Read-only
- Fixture-backed (Phase 23 fixtures only)
- Deterministic
- Offline
- In-memory
- Non-persistent
- Non-mutating
- External-network-free

**Phase 27 does NOT add:**
- Live data
- Solana RPC
- Provider APIs
- External network calls
- React or DOM rendering
- Browser storage (localStorage, sessionStorage, IndexedDB, cookies)
- Persistence of any kind
- Wallets, keypairs, or private keys
- Transaction signing or sending
- Trading, swaps, or execution controls
- Mutation controls
- Database writes
- Filesystem writes from API handlers
- Timers (setTimeout / setInterval)
- Randomness (Math.random)
- Wall-clock timestamps (Date.now / new Date)

---

## Snapshot Architecture

Phase 27 adds a thin snapshot layer on top of Phases 24–26:

```
Phase 23 fixtures
    ↓
Phase 24 view models (DashboardViewModel)
    ↓
Phase 25 render shell components (DashboardShell, panels, banners)
    ↓
Phase 26 interaction state / filters / selectors
    ↓
Phase 27 render snapshots (deterministic capture of typed render results)
    ↓
Phase 27 regression fixtures (stable stored expected outputs)
```

---

## Implementation Location

```
apps/dashboard/src/snapshots/
  types.ts         — snapshot type definitions
  builders.ts      — pure snapshot builder helpers
  normalization.ts — normalization and comparison helpers
  validation.ts    — validation and safety check helpers
  fixtures.ts      — deterministic regression fixture definitions
  capabilities.ts  — Phase 27 capability flags
  index.ts         — public API barrel
```

---

## Snapshot Fixture Types

### `DashboardRenderSnapshot`

The core snapshot type. Contains:
- `name` — stable snapshot name (e.g. `'default-dashboard-shell'`)
- `kind` — snapshot category (e.g. `'full-shell'`, `'panel'`, `'banner'`)
- `meta` — deterministic metadata (phase, source, fixtureOnly, liveData, etc.)
- `renderResult` — the captured typed render output
- `expectedVisiblePanelIds` — expected visible panels at snapshot time
- `expectedHiddenPanelIds` — expected hidden panels at snapshot time
- `expectedComponentType` — expected component type string
- `expectedSafetyBoundary` — safety flags (all unsafe=false)
- `isErrorState` — whether this snapshot represents an error/unavailable state
- `isEmptyState` — whether this snapshot represents an empty/no-data state
- `isFilteredState` — whether this snapshot was built from filtered state

### `DashboardRenderSnapshotFixture`

A regression fixture pairing a snapshot with a description.

### `DashboardRenderSnapshotSuite`

A named collection of fixtures for a related group of snapshots.

### `DashboardRenderSnapshotMeta`

Immutable metadata:
- `phase: 27`
- `viewModelPhase: 24 | 25 | 26`
- `fixtureOnly: true`
- `liveData: false`
- `externalNetwork: false`
- `deterministic: true`
- `notes` — human-readable fixture purpose
- `source` — stable source tag (no wall-clock timestamps)

### `DashboardRenderSnapshotValidationResult`

Contains `valid: boolean` and `issues: DashboardRenderSnapshotValidationIssue[]`.

### `DashboardRenderSnapshotSafetyResult`

Contains `safe: boolean` and `violations: string[]`.

### `DashboardSnapshotCapabilities`

Phase 27 capability flags:
```typescript
{
  dashboardRenderSnapshots: true,
  dashboardRegressionFixtures: true,
  deterministicRenderSnapshots: true,
  snapshotSafetyValidation: true,
  fixtureBackedRenderSnapshots: true,
  dashboardSnapshotPersistence: false,
  dashboardSnapshotExternalNetwork: false,
  dashboardSnapshotLiveData: false,
  dashboardSnapshotMutationControls: false,
}
```

---

## Supported Regression Fixture Cases

Phase 27 ships 20 regression fixtures:

| # | Name | Kind | Description |
|---|------|------|-------------|
| 1 | `default-dashboard-shell` | `full-shell` | Default full dashboard shell |
| 2 | `safety-banner` | `banner` | Safety banner notices |
| 3 | `metadata-panel` | `panel` | Metadata panel |
| 4 | `health-panel` | `panel` | Health panel |
| 5 | `capabilities-panel` | `panel` | Capabilities panel |
| 6 | `overview-panel` | `panel` | Overview panel |
| 7 | `evidence-panel` | `panel` | Evidence panel |
| 8 | `safety-panel` | `panel` | Safety panel |
| 9 | `empty-state` | `empty` | Empty state |
| 10 | `loading-state` | `loading` | Loading state |
| 11 | `error-state` | `error` | Error state |
| 12 | `unavailable-state` | `unavailable` | Unavailable state |
| 13 | `active-panel` | `full-shell` | Shell with active panel selected |
| 14 | `hidden-panel` | `full-shell` | Shell with a panel hidden |
| 15 | `filtered-evidence` | `filter` | Filtered evidence (severity=warning) |
| 16 | `filtered-safety` | `filter` | Filtered safety (status=locked) |
| 17 | `reset-interaction-state` | `state` | Shell after state reset |
| 18 | `no-results-filtered` | `filter` | Filters produce no results |
| 19 | `malformed-input-safe` | `malformed` | Malformed input sanitized to safe state |
| 20 | `safety-boundary` | `safety-boundary` | Safety boundary confirmation |

---

## Snapshot Builder Examples

```typescript
import {
  buildDefaultDashboardRenderSnapshot,
  buildPanelRenderSnapshot,
  buildSafetyBannerSnapshot,
  buildStateRenderSnapshot,
  buildFilteredDashboardRenderSnapshot,
  buildDashboardRenderSnapshot,
} from '@sonic/dashboard';

// Default full shell snapshot
const snap = buildDefaultDashboardRenderSnapshot(viewModel);

// Panel snapshot
const healthSnap = buildPanelRenderSnapshot('health', viewModel, 'Health panel regression test.');

// Safety banner snapshot
const bannerSnap = buildSafetyBannerSnapshot();

// State-based snapshot (with Phase 26 interaction state)
const stateSnap = buildStateRenderSnapshot(
  'active-panel',
  'full-shell',
  viewModel,
  activePanelState,
  'Active panel snapshot.',
);

// Filtered snapshot
const filteredSnap = buildFilteredDashboardRenderSnapshot(
  'filtered-evidence',
  viewModel,
  filteredEvidenceState,
  'Filtered evidence snapshot.',
);

// Generic builder (returns success/failure result)
const result = buildDashboardRenderSnapshot({
  name: 'default-dashboard-shell',
  kind: 'full-shell',
  viewModel,
  notes: 'Default shell test.',
});
if (result.success && result.snapshot) {
  console.log(result.snapshot.name);
}
```

---

## Snapshot Validation Examples

```typescript
import {
  validateDashboardRenderSnapshot,
  validateDashboardRenderSnapshotSafety,
} from '@sonic/dashboard';

// Validate snapshot structure
const validationResult = validateDashboardRenderSnapshot(snapshot);
if (!validationResult.valid) {
  for (const issue of validationResult.issues) {
    console.error(`[${issue.code}] ${issue.field}: ${issue.message}`);
  }
}

// Check snapshot for safety violations
const safetyResult = validateDashboardRenderSnapshotSafety(snapshot);
if (!safetyResult.safe) {
  for (const violation of safetyResult.violations) {
    console.error(`Safety violation: ${violation}`);
  }
}
```

---

## Snapshot Normalization Examples

```typescript
import {
  normalizeDashboardRenderSnapshot,
  areDashboardRenderSnapshotsEqual,
  isDashboardRenderSnapshotSerializable,
  getDashboardRenderSnapshotSummary,
} from '@sonic/dashboard';

// Normalize for stable comparison
const normalized = normalizeDashboardRenderSnapshot(snapshot);

// Compare two snapshots
const areEqual = areDashboardRenderSnapshotsEqual(snapshotA, snapshotB);

// Check serializability
const isSerializable = isDashboardRenderSnapshotSerializable(snapshot);

// Get summary
const summary = getDashboardRenderSnapshotSummary(snapshot);
console.log(summary.name, summary.visiblePanelCount);
```

---

## Fixture Lookup Examples

```typescript
import {
  listDashboardRenderSnapshotFixtures,
  getDashboardRenderSnapshotFixture,
  PHASE_27_FIXTURE_SUITE,
  PHASE_27_REGRESSION_FIXTURES,
} from '@sonic/dashboard';

// List all fixture names
const names = listDashboardRenderSnapshotFixtures();

// Look up a specific fixture
const fixture = getDashboardRenderSnapshotFixture('default-dashboard-shell');

// Access the complete suite
console.log(PHASE_27_FIXTURE_SUITE.suiteName);
console.log(PHASE_27_FIXTURE_SUITE.fixtures.length);

// Iterate all fixtures
for (const [name, fixture] of PHASE_27_REGRESSION_FIXTURES) {
  console.log(name, fixture.description);
}
```

---

## How Snapshots Protect Future Dashboard Work

Phase 27 snapshots lock down the known-good shape of dashboard render output for every meaningful state. By comparing future render results against stored fixtures, regressions in:

- panel structure
- section/item ordering
- safety boundary flags
- component types
- panel visibility logic
- filter behavior
- state reset behavior

...can be detected immediately when running `pnpm test`.

This gives Phase 28+ a stable regression safety net.

---

## Data Flow

```
Phase 23 fixtures (HEALTH_SUCCESS_FIXTURE, etc.)
    ↓  buildDashboardViewModel()
Phase 24 DashboardViewModel
    ↓  DashboardShell(), HealthPanel(), etc.
Phase 25 typed render results (DashboardShellResult, DashboardRenderResult)
    ↓  setDashboardActivePanel(), updateDashboardEvidenceFilters(), etc.
Phase 26 DashboardInteractionState, selectDashboardRenderModel()
    ↓  buildDefaultDashboardRenderSnapshot(), buildStateRenderSnapshot(), etc.
Phase 27 DashboardRenderSnapshot
    ↓  normalizeDashboardRenderSnapshot(), validateDashboardRenderSnapshot()
Regression fixtures (stable expected outputs for comparison)
```

---

## What Phase 27 Does NOT Implement

- No React or DOM rendering
- No visual screenshot testing
- No browser-based snapshot tools (Jest snapshots, Playwright visual regression, etc.)
- No persisted snapshot files on disk
- No runtime snapshot generation scripts
- No filesystem writes during tests
- No live data sources
- No external network calls
- No Solana RPC
- No provider APIs
- No wallets, keypairs, or private keys
- No trading, execution, or mutation controls
- No timers, randomness, or wall-clock timestamps

---

## Phase 28 Follow-on

Phase 28 is now implemented and consumes these snapshot fixtures to build deterministic local report export models in `apps/dashboard/src/reports/`.

No runtime report export actions are implemented in Phase 28.

## Future Phase 29 Preview

Likely next phase:

> Phase 29 — Local Dashboard Report Serialization Preview v1

---

## Explicit Safety Confirmation

Phase 27 adds no live data, Solana RPC, provider APIs, wallets, execution, trading, external network access, persistence, browser storage, or mutation controls.

All snapshot and fixture data is derived exclusively from Phase 23 local fixtures via Phase 24 view model adapters, Phase 25 render components, and Phase 26 interaction state helpers.
