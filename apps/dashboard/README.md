# Dashboard — @sonic/dashboard

## Phase 25 — Local Read-Only Dashboard UI Shell v1

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

Phase 25 adds a local read-only dashboard UI shell that renders Phase 24 view models from fixture-backed data.

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

See `docs/LOCAL_READ_ONLY_DASHBOARD_UI.md` for full documentation.

## Previous Phases

- Phase 1: Placeholder only
- Phase 24: `@sonic/dashboard-view-models` added as a typed data adapter layer
- Phase 25: Local read-only dashboard UI shell added (this package)

