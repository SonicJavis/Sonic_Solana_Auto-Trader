# Local Read-Only Dashboard View Models

> Phase 29 preserves this layer as the report-model and serialization-preview metadata source (via Phase 25/27/28 integration) and adds no live/network/export behavior.

**Phase 24 — Local Read-Only Dashboard Data Adapter and View Models v1**

---

## 1. Phase 24 Purpose

Phase 24 adds a local, read-only, fixture-backed adapter layer that transforms Phase 22/23 response envelopes into stable, typed, UI-ready dashboard view models.

This phase is data-shaping only. It does not build or render a dashboard UI.

---

## 2. Safety Boundaries

Phase 24 is strictly:

- local-only
- read-only
- fixture-only
- deterministic
- in-memory
- non-mutating
- external-network-free

Phase 24 adds **no**:

- UI/frontend rendering
- React/browser code
- live data
- Solana RPC
- provider APIs
- wallet/private-key logic
- transaction signing/sending
- execution/trading logic
- mutation endpoints
- filesystem writes from API handlers

---

## 3. Adapter Architecture

```
Phase 22 contracts/envelopes
  -> Phase 23 SDK fixtures/parsers
    -> Phase 24 adapter helpers (@sonic/dashboard-view-models)
      -> typed dashboard view models (future UI consumers)
```

Package layout:

```
packages/dashboard-view-models/
  src/types.ts
  src/errors.ts
  src/view-models.ts
  src/adapter.ts
  src/index.ts
```

All helpers are pure and deterministic.

---

## 4. View-Model Types Overview

Phase 24 adds typed models for:

- `DashboardViewModel`
- `DashboardHealthViewModel`
- `DashboardCapabilitiesViewModel`
- `DashboardOverviewViewModel`
- `DashboardEvidenceViewModel`
- `DashboardSafetyViewModel`
- `DashboardPanelViewModel`
- `DashboardSummaryViewModel`
- `DashboardStatusViewModel`
- `DashboardEmptyStateViewModel`
- `DashboardLoadingStateViewModel`
- `DashboardErrorStateViewModel`
- `DashboardWarningViewModel`
- `DashboardAdapterInput`
- `DashboardAdapterResult`
- `DashboardAdapterOptions`

Statuses used: `ready`, `empty`, `loading`, `error`, `unavailable`.

---

## 5. Supported Source Envelopes / Fixtures

Phase 24 uses Phase 23 fixtures/contracts for:

- `GET /health`
- `GET /capabilities`
- `GET /dashboard`
- `GET /dashboard/evidence`
- `GET /dashboard/safety`

Error fixtures are also supported and converted into safe error view models.

---

## 6. Transformation Examples

- `buildHealthViewModel(...)` maps `/health` envelope data into a health panel model.
- `buildCapabilitiesViewModel(...)` maps capability booleans and unavailable capability names.
- `buildDashboardOverviewViewModel(...)` maps dashboard summary and panel availability.
- `buildEvidenceViewModel(...)` maps entries plus deterministic empty state.
- `buildSafetyViewModel(...)` maps locked capabilities and safety invariant status.
- `buildDashboardViewModel(...)` combines all panel models into a single dashboard aggregate model.
- `adaptReadOnlyApiEnvelopeToViewModel(...)` routes envelope-to-view-model by endpoint.

---

## 7. Error / Empty / Loading State Examples

- Invalid/malformed envelope -> `DashboardErrorStateViewModel` with stable safe code/message.
- Unsupported endpoint -> `DASHBOARD_UNSUPPORTED_ENDPOINT` error model, or loading placeholder if configured.
- Empty evidence list -> `DashboardEmptyStateViewModel`.
- Future placeholder loading state -> `DashboardLoadingStateViewModel` (no async behavior).

All error outputs are sanitized and deterministic.

---

## 8. Future UI Consumption Guidance

Future dashboard UI work should consume only Phase 24 view-model outputs, not raw envelope internals.

Recommended pattern:

1. Adapt envelope(s) with Phase 24 helpers.
2. Render by `status` (`ready`, `empty`, `loading`, `error`, `unavailable`).
3. Use `summary` and `panels` for deterministic panel-level rendering.
4. Treat `meta` as contract metadata only.

---

## 9. What Phase 24 Does Not Implement

Phase 24 does not implement:

- dashboard UI shell
- React components
- browser rendering
- charts or styling
- live polling/streaming
- network clients
- wallet execution flows
- trading/execution features

---

## 10. Phase 25/26 Consumption

**Phase 25 — Local Read-Only Dashboard UI Shell v1** is now implemented in `apps/dashboard/src/`.

Phase 24 view models are consumed by Phase 25 dashboard UI shell components. See `docs/LOCAL_READ_ONLY_DASHBOARD_UI.md` for full Phase 25 documentation.

The data flow is:

```
Phase 23 Fixtures → buildFixtureDashboardViewModel() → DashboardViewModel → DashboardShell
```

Phase 26 is implemented with local dashboard interaction state and filters in `apps/dashboard/src/state/`.  
It remains local-only, read-only, deterministic, in-memory-only, and external-network-free.

---

## 11. Explicit Safety Confirmation

Phase 24 adds no UI, live data, Solana RPC, provider APIs, wallets, execution, trading, or external network access.

It remains local-only, read-only, fixture-only, deterministic, and non-mutating.
