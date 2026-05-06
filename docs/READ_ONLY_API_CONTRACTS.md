# Local Read-Only API Contracts v1

**Phase 19 — @sonic/read-only-api-contracts**

---

## Overview

This document describes the Phase 19 `@sonic/read-only-api-contracts` package.

This package provides **safe, deterministic, fixture-only, analysis-only, non-executable, read-only, contract-only** TypeScript API contract models for a potential future local API layer.

**This is NOT an API server. It does NOT create any HTTP listener, network port, router, handler, or framework integration.**

---

## Phase Scope

Phase 19 defines **API boundary contracts only**.

It does NOT:
- Create an API server, HTTP listener, or network socket
- Use Fastify, Hono, tRPC, Express, or any API framework
- Create a dashboard UI or React UI
- Open network ports
- Access live data, Solana RPC, or provider APIs
- Handle wallets or private keys
- Create trade intents, execution plans, paper trades, orders, fills, routes, swaps, positions, or PnL
- Construct, simulate, sign, or send transactions
- Perform runtime health checks or live dependency checks

---

## Package Structure

```
packages/read-only-api-contracts/
  src/
    types.ts                  — All TypeScript contract types and interfaces
    errors.ts                 — RoacResult<T>, roacOk, roacErr helpers
    capabilities.ts           — getReadOnlyApiCapabilities() (all unsafe flags false)
    endpoint-contracts.ts     — buildReadOnlyApiEndpointContracts() (9 endpoints, contract metadata only)
    request-models.ts         — buildReadOnlyApiRequestModel() (safe request models)
    response-envelope.ts      — buildReadOnlyApiResponseEnvelope() (deterministic response wrapping)
    health-contract.ts        — buildReadOnlyApiHealthContract() (fixture-only health contract)
    dashboard-contract.ts     — buildReadOnlyDashboardContract() (shapes dashboard read models)
    evidence-contract.ts      — buildReadOnlyEvidenceContract() (shapes evidence ledger outputs)
    safety-contract.ts        — buildReadOnlySafetyContract() (locked capability summary)
    bundle-builder.ts         — buildReadOnlyApiContractBundle() (combines all contracts)
    export-json.ts            — exportReadOnlyApiContractJson() (deterministic JSON export)
    export-openapi-shape.ts   — exportReadOnlyApiContractOpenApiShape() (OpenAPI-like documentation shape)
    fixtures.ts               — 6 deterministic synthetic fixture bundles
    validation.ts             — validateReadOnlyApiContractBundle() and all validators
    index.ts                  — Public API barrel
```

---

## Capability Table

All unsafe capabilities are **permanently false**:

| Capability | Value |
|---|---|
| canUseLiveData | false |
| canUseSolanaRpc | false |
| canUseProviderApis | false |
| canAccessPrivateKeys | false |
| canCreateTradeIntents | false |
| canCreateExecutionPlans | false |
| canPaperTrade | false |
| canTrade | false |
| canExecute | false |
| canWriteToDatabase | false |
| canSendTelegramAlerts | false |
| canConstructTransactions | false |
| canSimulateTransactions | false |
| canCreateOrders | false |
| canCreatePositions | false |
| canCalculateLivePnl | false |
| canMutatePriorEvidence | false |
| canRenderUi | false |
| canStartHttpServer | false |
| canOpenNetworkPort | false |
| canUseApiFramework | false |
| fixtureOnly | true |
| analysisOnly | true |
| nonExecutable | true |
| readOnly | true |
| contractOnly | true |

---

## Endpoint Contracts

`buildReadOnlyApiEndpointContracts()` returns a deterministic list of 9 endpoint contract descriptors:

| Endpoint ID | Path Template | Response Type |
|---|---|---|
| health | /api/v1/health | ReadOnlyApiHealthContract |
| capabilities | /api/v1/capabilities | ReadOnlyApiCapabilities |
| dashboard_overview | /api/v1/dashboard/overview | ReadOnlyDashboardContract |
| dashboard_bundle | /api/v1/dashboard/bundle | ReadOnlyApiContractBundle |
| replay_panel | /api/v1/dashboard/replay | ReadOnlyDashboardContract |
| strategy_panel | /api/v1/dashboard/strategy | ReadOnlyDashboardContract |
| evaluation_panel | /api/v1/dashboard/evaluation | ReadOnlyDashboardContract |
| evidence_panel | /api/v1/dashboard/evidence | ReadOnlyEvidenceContract |
| safety_panel | /api/v1/dashboard/safety | ReadOnlySafetyContract |

**These are documentation-shaped contract metadata only.** No HTTP handler, router, server, listener, or framework object is created.

---

## Health Contract

`buildReadOnlyApiHealthContract(input)` produces a `ReadOnlyApiHealthContract`.

- Status is `fixture_only` or `contract_only`
- No runtime health checks are performed
- No network connections are made
- No live dependency status is reported
- All fields carry `fixtureOnly: true`, `contractOnly: true`

---

## Dashboard Contract

`buildReadOnlyDashboardContract(input)` shapes Dashboard Read Models into a safe API response contract model.

- No UI rendering
- No app state
- No live data
- Accepts `fixtureOnly: true` and `liveData: false` inputs only

---

## Evidence Contract

`buildReadOnlyEvidenceContract(input)` shapes Evidence Ledger outputs into a safe API response contract model.

- Append-safe / read-only — no mutation of prior evidence
- Analysis-only output

---

## Safety Contract

`buildReadOnlySafetyContract(input)` summarises locked safety capabilities for future API exposure.

- All unsafe capability flags shown as permanently false
- Includes `lockedCapabilityNames` (sorted list of all unsafe capability keys)
- Includes `canStartHttpServer`, `canOpenNetworkPort`, `canUseApiFramework` in locked names

---

## Response Envelope

`buildReadOnlyApiResponseEnvelope(input)` wraps any safe data in a deterministic response envelope.

- Includes `status`, `data`, `warnings`, `errors`, `metadata`
- No stack traces, no raw Error objects in output
- All metadata fields carry fixture/analysis/contract safety flags

---

## OpenAPI-like Shape

`exportReadOnlyApiContractOpenApiShape(bundle)` produces a deterministic OpenAPI-like shape object.

- **For future documentation planning only**
- No OpenAPI library imports
- No live server config
- No real server URLs
- All paths marked `contractOnly: true`, `nonExecutable: true`, `readOnly: true`
- `note` field explicitly states: **FUTURE ONLY**
- Fastify, Hono, tRPC, and Express integration is marked **future only** — not implemented in this phase

---

## Example Usage

```typescript
import {
  getReadOnlyApiCapabilities,
  buildReadOnlyApiContractBundle,
  exportReadOnlyApiContractJson,
  exportReadOnlyApiContractOpenApiShape,
  validateReadOnlyApiContractBundle,
  CLEAN_READ_ONLY_API_CONTRACT_FIXTURE,
} from '@sonic/read-only-api-contracts';

// Get permanently-locked capabilities
const caps = getReadOnlyApiCapabilities();
console.log(caps.canTrade);           // false
console.log(caps.canStartHttpServer); // false
console.log(caps.fixtureOnly);        // true
console.log(caps.contractOnly);       // true

// Build a contract bundle from fixture inputs
const bundleResult = buildReadOnlyApiContractBundle({
  bundleId: 'my_bundle',
  health: { healthId: 'my_health', fixtureOnly: true, liveData: false },
  dashboard: {
    dashboardContractId: 'my_dashboard',
    severity: 'info',
    summaryText: 'Fixture dashboard analysis complete.',
    panelsAvailable: ['replay_panel', 'safety_panel'],
    totalFindings: 2,
    evidenceLedgerId: 'my_evidence_ledger',
    fixtureOnly: true,
    liveData: false,
  },
  evidence: {
    evidenceContractId: 'my_evidence',
    evidenceLedgerId: 'my_evidence_ledger',
    severity: 'info',
    summaryText: 'Fixture evidence analysis complete.',
    entryCount: 2,
    fixtureOnly: true,
    liveData: false,
  },
  safety: { safetyContractId: 'my_safety', fixtureOnly: true, liveData: false },
  fixtureOnly: true,
  liveData: false,
});

if (bundleResult.ok) {
  // Validate all invariants
  const valid = validateReadOnlyApiContractBundle(bundleResult.value);

  // Export as deterministic JSON
  const json = exportReadOnlyApiContractJson(bundleResult.value);

  // Export as OpenAPI-like documentation shape
  const openApiShape = exportReadOnlyApiContractOpenApiShape(bundleResult.value);
}

// Use pre-built fixtures
console.log(CLEAN_READ_ONLY_API_CONTRACT_FIXTURE.fixtureId);
```

---

## Safety Invariants

All outputs must satisfy:

- `fixtureOnly: true`
- `liveData: false`
- `safeToDisplay: true`
- `analysisOnly: true`
- `nonExecutable: true`
- `readOnly: true`
- `contractOnly: true`

Validation rejects:

- `liveData: true`
- `fixtureOnly: false`
- `safeToDisplay: false`
- `analysisOnly: false`
- `nonExecutable: false`
- `readOnly: false`
- `contractOnly: false`
- Any unsafe capability flag set to `true`
- Text containing unsafe action patterns (buy, sell, execute, snipe, etc.)
- Text containing secret-like patterns (private_key, seed phrase, api_key, etc.)
- Text containing URL/RPC-like patterns (wss://, helius.dev, etc.)
- Text containing server/listener/port patterns (http listener, open port, fastify(), etc.)

---

## Fixture-Only / Analysis-Only / Non-Executable / Read-Only / Contract-Only Statement

This package is:

- **Fixture-only**: All data is synthetic. No live, real, or market data.
- **Analysis-only**: Outputs describe analysis findings only. No action recommendations.
- **Non-executable**: No code in this package produces any trade, order, execution, transaction, or action.
- **Read-only**: No mutations. No database writes. No state changes.
- **Contract-only**: This package defines API boundary contracts only. No runtime API framework.

---

## Not an API Server

This package does NOT include:

- No HTTP server
- No Fastify app
- No Hono app
- No tRPC router
- No Express app
- No WebSocket server
- No network listener
- No open network port
- No runtime API framework integration
- No deployment config

---

## Not a Dashboard UI

This package does NOT include:

- No React UI
- No dashboard rendering
- No UI components
- No browser code

---

## Not Trading Advice

This package does NOT:

- Create real trade intents
- Create execution plans
- Produce paper trades
- Produce live trading signals
- Recommend trading actions
- Create orders, fills, routes, swaps, positions, or PnL

---

## Future Notes (FUTURE ONLY)

> These are planning notes only. Nothing below is implemented in Phase 19.

In a future phase, a real API server framework (Fastify, Hono, tRPC, or Express) may be evaluated to serve these contracts over a local HTTP endpoint, **only after**:

- Replay, paper trading, and manual review gates pass
- Safety evidence and audit evidence are provided
- Strict mode and risk gates prove an edge
- Full safety review is completed

---

## Phase Stack

```
Replay Lab (Phase 13)
→ Replay Reporting (Phase 14)
→ Strategy Intent (Phase 15)
→ Strategy Evaluation (Phase 16)
→ Evidence Ledger (Phase 17)
→ Dashboard Read Models (Phase 18)
→ Local Read-Only API Contracts (Phase 19) ← CURRENT
```
