# Local Read-Only Dashboard UI — Phase 25

## Purpose

Phase 25 adds a local read-only dashboard UI shell on top of the Phase 24 dashboard view model layer.

The dashboard UI shell is a purely local, read-only, fixture-backed TypeScript rendering system that displays Phase 24 view model data in a safe, deterministic, accessible format for local inspection.

**This is not a production dashboard. It is not a live monitoring system. It has no trading controls, no wallet integration, no execution controls, and no external network access.**

---

## Safety Boundaries

The Phase 25 dashboard UI shell maintains all existing safety guarantees:

| Boundary | Status |
|---|---|
| Local only | ✅ Yes |
| Read only | ✅ Yes |
| Fixture backed | ✅ Yes |
| Deterministic | ✅ Yes |
| Live data | ❌ No |
| Solana RPC | ❌ No |
| Provider APIs | ❌ No |
| External network | ❌ No |
| Wallet integration | ❌ No |
| Private keys | ❌ No |
| Execution controls | ❌ No |
| Trading controls | ❌ No |
| Mutation controls | ❌ No |
| Database writes | ❌ No |
| Real-time updates | ❌ No |
| Wallet connection UI | ❌ No |

---

## UI Shell Architecture

```
Phase 22 Contract Layer
  ↓ Response envelopes, metadata
Phase 23 SDK/Fixture Layer
  ↓ Local fixtures, envelope parsing
Phase 24 Dashboard View-Model Layer
  ↓ Typed, UI-ready data shapes
Phase 25 Dashboard UI Shell  ← THIS PHASE
  - Renders view models only
  - Read-only, fixture-backed
  - No real network
  - No mutation
  - No wallet/trading/execution controls
```

---

## Components

The following TypeScript presentational components are provided in `apps/dashboard/src/components/`:

| Component | Purpose |
|---|---|
| `DashboardShell` | Top-level shell: composes all panels with safety banner, navigation, and footer |
| `SafetyBanner` | Displays read-only/local-only/fixture-backed safety notices |
| `MetadataPanel` | Renders Phase 22/24 view model metadata (phase, apiMode, safety flags) |
| `HealthPanel` | Renders health view model from `/health` endpoint fixture |
| `CapabilitiesPanel` | Renders capabilities view model from `/capabilities` endpoint fixture |
| `OverviewPanel` | Renders overview view model from `/dashboard` endpoint fixture |
| `EvidencePanel` | Renders evidence view model from `/dashboard/evidence` endpoint fixture |
| `SafetyPanel` | Renders safety view model from `/dashboard/safety` endpoint fixture |
| `EmptyState` | Safe empty state placeholder |
| `LoadingState` | Safe loading state placeholder (fixture-backed, never truly async) |
| `ErrorState` | Sanitized error state — never exposes stack traces, paths, or secrets |
| `UnavailableState` | Unavailable feature placeholder for future phases |
| `StatusBadge` | Typed status badge for ready/empty/loading/error/unavailable values |

All components are pure TypeScript functions. They return typed `DashboardRenderResult` or similar objects. No DOM. No React. No browser APIs. Fully testable in Node.

---

## Data Flow

```
Phase 23 Fixtures
  (HEALTH_SUCCESS_FIXTURE, CAPABILITIES_SUCCESS_FIXTURE, etc.)
  ↓
buildFixtureDashboardViewModel() [view-model-source.ts]
  ↓ uses buildDashboardViewModel() from @sonic/dashboard-view-models
DashboardViewModel
  ↓
DashboardShell({ viewModel })
  ↓
DashboardShellResult
  (safety banner + navigation + health/capabilities/overview/evidence/safety/metadata panels + footer)
```

All data flows from static fixtures. No runtime network calls. No dynamic data sources.

---

## Local Usage

The dashboard UI shell is exposed via `apps/dashboard/src/index.ts` and is aliased as `@sonic/dashboard` in the vitest configuration for test use.

```typescript
import {
  DashboardShell,
  buildFixtureDashboardViewModel,
  getDashboardUiShellCapabilities,
  PHASE_25_SAFETY_BOUNDARY,
} from '@sonic/dashboard';

const viewModel = buildFixtureDashboardViewModel();
const shell = DashboardShell({ viewModel });

console.log(shell.safetyBanner.notices);
console.log(shell.panels.health.sections);
```

---

## What Phase 25 Displays

The dashboard shell renders:

1. **Safety Banner** — 7 local/read-only/fixture-backed notices
2. **Navigation** — links for Health, Capabilities, Overview, Evidence, Safety sections
3. **Health Panel** — health status, phase label, message from `/health` fixture
4. **Capabilities Panel** — enabled/disabled capability flags from `/capabilities` fixture
5. **Overview Panel** — severity, summary text, findings count from `/dashboard` fixture
6. **Evidence Panel** — evidence entries from `/dashboard/evidence` fixture
7. **Safety Panel** — invariants, locked capabilities from `/dashboard/safety` fixture
8. **Metadata Panel** — phase, apiMode, all safety flags from view model meta
9. **Footer** — phase/safety metadata, Phase 25 confirmation
10. **State Panels** — safe empty, loading, error, unavailable states as appropriate

---

## What Phase 25 Does NOT Implement

Phase 25 does not implement:

- Live data of any kind
- Solana RPC connections
- Provider API connections (Jupiter, Birdeye, DexScreener, etc.)
- HTTP fetch or WebSocket clients
- Wallet connection UI
- Private key handling
- Transaction signing or sending
- Swap execution
- Order creation
- Position tracking
- Balance display from live sources
- PnL calculation from live sources
- Trading controls
- Kill-switch controls beyond read-only display
- Real-time updates or polling
- Database writes
- Filesystem writes from API handlers
- Background or scheduled jobs
- Authentication or user accounts
- Production hosting or deployment
- Notification systems
- POST/PUT/PATCH/DELETE behaviour
- Any mutation controls

---

## Phase 25 Capability Flags

The following Phase 25 capability flags are added to `LocalReadOnlyApiCapabilities`:

```typescript
dashboardUiShell: true          // Local read-only dashboard UI shell is available
localReadOnlyDashboard: true    // Dashboard is local-only
fixtureBackedDashboardUi: true  // All UI data comes from fixtures
dashboardUsesViewModels: true   // UI is driven by Phase 24 view models
dashboardExternalNetwork: false // Dashboard has no external network access
dashboardLiveData: false        // Dashboard has no live data
dashboardTradingControls: false // Dashboard has no trading controls
dashboardWalletControls: false  // Dashboard has no wallet controls
dashboardMutationControls: false // Dashboard has no mutation controls
dashboardExecutionControls: false // Dashboard has no execution controls
dashboardWalletConnection: false  // Dashboard has no wallet connection
dashboardRealTimeUpdates: false   // Dashboard has no real-time updates
```

The `getDashboardUiShellCapabilities()` function from `@sonic/dashboard` returns these flags.

---

## Accessibility

All components include:

- `role` — semantic landmark roles (`main`, `region`, `banner`, `contentinfo`, `group`)
- `ariaLabel` — accessible labels for all panels and sections
- `hasHeading` — indicates whether a visible heading is present
- `hasLandmark` — indicates whether a landmark role is present
- `sectionId` — unique section identifiers
- `key`/`label` — labelled key-value items for all data

---

## Phase 26 Preview (Future)

Phase 26 — Local Dashboard Interaction State and Filters v1 — may add local-only filter state, panel toggle state, or simple in-memory navigation. This is for local inspection only and must remain fixture-backed, read-only, and external-network-free.

**Phase 26 is not implemented in Phase 25.**

---

## Explicit Safety Confirmation

> Phase 25 adds no live data, Solana RPC, provider APIs, wallets, execution, trading, external network access, or mutation controls.
>
> All data is deterministic and sourced exclusively from Phase 23 read-only API client fixtures.
>
> The dashboard UI shell is local-only, read-only, fixture-only, deterministic, offline, non-mutating, and external-network-free.
