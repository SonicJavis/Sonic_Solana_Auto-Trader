# Local Dashboard Interaction State — Phase 26

> Phase 28 reuses this interaction/filter state to produce deterministic report section and filtered-state report models. No persistence or export behavior is added.

## 1. Phase 26 Purpose

Phase 26 adds a local-only, in-memory interaction-state layer for the Phase 25 read-only dashboard shell.

It introduces deterministic state for:

- active panel selection
- panel visibility
- evidence filters
- safety filters
- deterministic sort settings
- safe reset behavior
- selector helpers that combine Phase 24 view models with Phase 25 render results

## 2. Safety Boundaries

Phase 26 remains:

- local-only
- read-only
- fixture-backed
- deterministic
- in-memory
- non-persistent
- caller-owned
- external-network-free

Phase 26 adds **no**:

- live data
- Solana RPC
- provider APIs
- wallets/private keys
- signing/sending
- execution/trading controls
- mutation controls
- browser storage (`localStorage`, `sessionStorage`, `IndexedDB`, cookies)
- filesystem/database persistence

## 3. Local State Architecture

Data flow now is:

```
Phase 23 fixtures
  -> Phase 24 dashboard view models
    -> Phase 25 dashboard shell render components
      -> Phase 26 local interaction state + selectors
```

All state is passed in and returned by pure functions. No global mutable store is introduced.

## 4. Supported State Fields

`DashboardInteractionState` includes:

- `phase: 26`
- `activePanelId`
- `panelVisibility`
- `filters.evidence`
- `filters.safety`
- `sort.evidence`
- `sort.safety`

## 5. Supported Filters

Evidence filters (where source fields exist):

- panel
- severity
- status
- classification
- sourceKind
- text query
- maxItems

Safety filters (where source fields exist):

- panel
- severity
- status (`locked`/`unlocked`)
- classification
- sourceKind
- text query
- includeSummary

## 6. Unsupported / Future-only Filters

Phase 26 does not add filters for:

- wallets
- balances
- PnL
- orders/fills/routes/swaps/positions
- execution/runtime trading state
- live market/provider state

These remain future-only and out of scope.

## 7. Example State Transitions

- `SET_ACTIVE_PANEL` changes active panel when value is valid.
- `TOGGLE_PANEL_VISIBILITY` flips a single panel visibility flag.
- `UPDATE_EVIDENCE_FILTERS` sanitizes incoming text/enum values.
- `UPDATE_SAFETY_FILTERS` sanitizes and applies safe local filters.
- `UPDATE_SORT_STATE` applies deterministic sort fields/direction.
- `RESET_STATE` resets all or selected state slices to defaults.

Invalid values are rejected or sanitized without unsafe throws.

## 8. Example Selectors

- `selectVisibleDashboardPanels(state)`
- `selectActiveDashboardPanel(state)`
- `selectFilteredEvidenceItems(viewModel, state)`
- `selectFilteredSafetyItems(viewModel, state)`
- `selectDashboardRenderModel(viewModel, state)`
- `applyDashboardInteractionState(viewModel, state)`

Selectors are deterministic and return safe empty outputs when filters match nothing.

## 9. Reset Behavior

`resetDashboardInteractionState(state, mode)` supports:

- `all`
- `activePanel`
- `panelVisibility`
- `filters`
- `sort`

## 10. Explicit Scope Confirmation

Phase 26 adds local state/filter/selectors only.

It does **not** add live UI event wiring, browser persistence, external state sync, live data, Solana RPC, provider APIs, wallets, execution, trading, external network access, or mutation controls.

## 11. Phase 28 Follow-on

Phase 27 snapshots and Phase 28 report export models are implemented.\nPhase 28 consumes this state layer for deterministic interaction/filter report sections.
