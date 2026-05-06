# Dashboard Read Models

## Overview

`@sonic/dashboard-read-models` is a Phase 18 package that provides safe, deterministic, fixture-only, analysis-only, non-executable, read-only data-shaping objects for reviewing Replay Lab, Replay Reporting, Strategy Intent, Strategy Evaluation, and Evidence Ledger outputs.

This package prepares the system for a future dashboard without building any UI. It is read-model and reporting only.

## Phase Scope

Phase 18 creates local-only read models that make the existing safe analysis stack easier to inspect:

```
Replay Lab
→ Replay Reporting
→ Strategy Intent
→ Strategy Evaluation
→ Evidence Ledger
→ Evidence Review Dashboard Read Models  ← this package
```

This phase is read-model/reporting only. It does not build a dashboard UI, React components, or any visual rendering.

## Package Structure

```
packages/dashboard-read-models/
  src/
    types.ts              — All model type definitions
    errors.ts             — DrmResult<T>, drmOk, drmErr
    capabilities.ts       — getDashboardReadModelCapabilities()
    overview-model.ts     — buildDashboardOverviewModel()
    replay-panel-model.ts — buildReplayPanelModel()
    strategy-panel-model.ts — buildStrategyPanelModel()
    evaluation-panel-model.ts — buildEvaluationPanelModel()
    evidence-panel-model.ts — buildEvidencePanelModel()
    safety-panel-model.ts — buildSafetyPanelModel()
    bundle-builder.ts     — buildDashboardReadModelBundle()
    export-json.ts        — exportDashboardReadModelJson()
    export-markdown.ts    — exportDashboardReadModelMarkdown()
    validation.ts         — All validators + text safety helpers
    fixtures.ts           — 6 deterministic synthetic fixtures
    index.ts              — Public barrel
```

## Capability Table

All capabilities that could cause harm are permanently `false`:

| Capability | Value |
|---|---|
| `canUseLiveData` | `false` |
| `canUseSolanaRpc` | `false` |
| `canUseProviderApis` | `false` |
| `canAccessPrivateKeys` | `false` |
| `canCreateTradeIntents` | `false` |
| `canCreateExecutionPlans` | `false` |
| `canPaperTrade` | `false` |
| `canTrade` | `false` |
| `canExecute` | `false` |
| `canWriteToDatabase` | `false` |
| `canSendTelegramAlerts` | `false` |
| `canConstructTransactions` | `false` |
| `canSimulateTransactions` | `false` |
| `canCreateOrders` | `false` |
| `canCreatePositions` | `false` |
| `canCalculateLivePnl` | `false` |
| `canMutatePriorEvidence` | `false` |
| `canRenderUi` | `false` |
| `fixtureOnly` | `true` |
| `analysisOnly` | `true` |
| `nonExecutable` | `true` |
| `readOnly` | `true` |

## Overview Model

`DashboardOverviewModel` — provides a safe summary of all panels:
- `totalFindings` — count of all findings across the input
- `severityCounts` — breakdown by `info / warning / risk / failure / inconclusive`
- `panelsAvailable` — list of panel kinds available in the bundle
- `safetyStatus` — plain-text statement of fixture-only, analysis-only, non-executable, read-only status
- No live data. No trade status claims.

## Replay Panel

`DashboardReplayPanelModel` — shapes Replay Lab / Replay Reporting fixture evidence:
- `panelKind: 'replay_panel'`
- `findings` — `DashboardReadModelFinding[]` (analysis-only, no action labels)
- `severityCounts` — breakdown
- `summaryText` — safe plain-text summary

## Strategy Panel

`DashboardStrategyPanelModel` — shapes Strategy Intent fixture evidence:
- `panelKind: 'strategy_panel'`
- `findings` — analysis-only findings
- No trade intents created. Analysis labels only.

## Evaluation Panel

`DashboardEvaluationPanelModel` — shapes Strategy Evaluation fixture evidence:
- `panelKind: 'evaluation_panel'`
- `findings` — analysis-only findings
- No execution plans created.

## Evidence Panel

`DashboardEvidencePanelModel` — shapes Evidence Ledger / Decision Trace fixture evidence:
- `panelKind: 'evidence_panel'`
- `evidenceLedgerId` — reference to the evidence ledger
- `findings` — analysis-only findings
- Prior evidence is not mutated.

## Safety Panel

`DashboardSafetyPanelModel` — summarises safety invariants and locked capabilities:
- `panelKind: 'safety_panel'`
- `capabilities` — full `DashboardReadModelCapabilities` object (all unsafe fields `false`)
- `lockedCapabilityNames` — list of all 18 permanently locked capability names
- `safetyInvariantsSatisfied: true`
- Shows all unsafe capabilities are `false`. Cannot be overridden.

## JSON Export

`exportDashboardReadModelJson(bundle)` — produces a deterministic JSON-safe export:
- No `undefined`, no functions, no circular data, no secrets
- Sorted `panelsAvailable` and `lockedCapabilityNames` for stable ordering
- Returns `DashboardReadModelExport` with `exportKind: 'dashboard_read_model_export'`

## Markdown Export

`exportDashboardReadModelMarkdown(bundle)` — produces safe, deterministic Markdown for human review:
- Includes all panel summaries and findings
- Includes a Safety Flags section
- Includes a mandatory safety footer stating:
  - fixture-only
  - analysis-only
  - non-executable
  - read-only
  - does not recommend or enable trading
  - does not create trade intents, execution plans, orders, or actionable output
  - cannot access live data, wallets, private keys, Solana RPC, provider APIs, or render UI

## Example Usage

```typescript
import {
  getDashboardReadModelCapabilities,
  buildDashboardReadModelBundle,
  exportDashboardReadModelJson,
  exportDashboardReadModelMarkdown,
  validateDashboardReadModelBundle,
  CLEAN_DASHBOARD_READ_MODEL_FIXTURE,
} from '@sonic/dashboard-read-models';

// Get capabilities
const caps = getDashboardReadModelCapabilities();
// caps.canTrade === false, caps.fixtureOnly === true, etc.

// Build a bundle from fixture-only input
const input = {
  inputId: 'my_review_input',
  evidenceLedgerId: 'my_ledger_id',
  findings: [
    {
      findingId: 'finding_001',
      severity: 'info' as const,
      title: 'Analysis complete',
      description: 'Fixture analysis shows clean results.',
      fixtureOnly: true as const,
      liveData: false as const,
      safeToDisplay: true as const,
      analysisOnly: true as const,
      nonExecutable: true as const,
      readOnly: true as const,
    },
  ],
  fixtureOnly: true as const,
  liveData: false as const,
};

const result = buildDashboardReadModelBundle(input);
if (result.ok) {
  // Validate
  const validation = validateDashboardReadModelBundle(result.value);

  // Export as JSON
  const jsonExport = exportDashboardReadModelJson(result.value);

  // Export as Markdown
  const mdExport = exportDashboardReadModelMarkdown(result.value);
}

// Use a pre-built fixture
const { bundle } = CLEAN_DASHBOARD_READ_MODEL_FIXTURE;
```

## Safety Invariants

All models must carry and validate:

| Field | Required value |
|---|---|
| `fixtureOnly` | `true` |
| `liveData` | `false` |
| `safeToDisplay` | `true` |
| `analysisOnly` | `true` |
| `nonExecutable` | `true` |
| `readOnly` | `true` |

Validation (`validateDashboardReadModelBundle`) will reject any bundle that violates these invariants.

Validation also rejects text containing:
- Unsafe action terms (buy, sell, execute, snipe, etc.)
- Secret-like patterns (private_key, seed phrase, api_key, mnemonic, etc.)
- URL/RPC-like patterns (wss://, helius.dev, yellowstone, etc.)

## Fixture-Only / Analysis-Only / Non-Executable / Read-Only Statement

`@sonic/dashboard-read-models` is:

- **fixture-only**: all data is synthetic, deterministic test/review data; no live market data
- **analysis-only**: outputs are labels and summaries for human review; not recommendations to act
- **non-executable**: no code path leads to execution of any kind
- **read-only**: nothing is written, mutated, stored, or sent

## Not a Dashboard UI

This package does NOT include:
- React components
- Any UI framework
- Any rendering logic
- Any web server
- Any HTTP endpoints

Future dashboard UI work (if any) would be a separate package/app that consumes these read models.

## Not Trading Advice

Outputs from this package are NOT:
- Trading advice
- Trading signals
- Trade recommendations
- Live candidates
- Executable actions
- Permission to trade

## Does Not Create Real Trade Intents

This package cannot create real trade intents, execution plans, orders, positions, fills, routes, swaps, or any actionable trading output.

## Outputs Do Not Recommend or Enable Trading

All findings and panel summaries are analysis-only labels for human review. They cannot be used as direct inputs to any trading or execution system.

## Future UI / Dashboard Notes

> **Future only**: A future safe dashboard UI package may consume these read models to display them visually. That would require a separate explicit phase with its own safety review. This package only provides the read model data shapes.

> **Future only**: Additional panel types, cross-phase correlation panels, or richer summary models may be added in future phases. This phase only covers the core 5 panels.
