# Dashboard — @sonic/dashboard

## Phase 26 — Local Dashboard Interaction State and Filters v1

This is the Phase 25 local read-only dashboard UI shell for the Sonic Solana Auto-Trader project.

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

## What This Package Provides

Phase 25 adds the local read-only dashboard UI shell.  
Phase 26 adds local in-memory interaction state and deterministic filters/selectors on top of that shell.

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
- `getDashboardUiShellCapabilities()` — Phase 25 capability flags
- Phase 26 state helpers under `src/state/` for active panel, visibility, filters, sort, reset, reducer-style updates, and selectors

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
