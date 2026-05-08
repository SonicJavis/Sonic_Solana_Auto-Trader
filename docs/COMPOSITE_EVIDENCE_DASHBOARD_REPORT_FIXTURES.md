# Composite Evidence Dashboard/Report Fixtures

**Phase 35 — Composite Evidence Dashboard/Report Fixtures v1**

This document describes the composite evidence dashboard/report fixture layer introduced in Phase 35. It bridges the Phase 33 composite evidence models and Phase 34 report integration models into the existing local dashboard/report fixture ecosystem. In Phase 36, these synthetic outputs are additionally referenced by replay outcome fixtures (`docs/REPLAY_OUTCOME_FIXTURE_MODELS.md`).

---

## Purpose

Phase 35 provides a set of deterministic, synthetic, serializable fixture structures that make Phase 33/34 composite intelligence visible to future dashboard, report, and replay workflows through safe typed fixtures.

These fixtures are:

- Synthetic-only — no real wallets, transactions, or live data
- Local-only — no external network access
- Read-only — no mutation controls
- Deterministic — no randomness, timers, or wall-clock timestamps
- In-memory — no persistence or file writes
- Non-advisory — no investment advice or trading signals
- Non-accusatory — no accusations against real entities
- Execution-free — no trading or wallet execution logic

---

## Location

```
apps/dashboard/src/composite-evidence-fixtures/
  types.ts          — strict TypeScript types and constants
  builders.ts       — pure fixture builder functions
  fixtures.ts       — 16 deterministic fixture definitions
  normalization.ts  — normalization helpers
  validation.ts     — validation and safety validation helpers
  capabilities.ts   — Phase 35 capability flags
  index.ts          — public API barrel
```

---

## Fixture Architecture

Phase 35 adds three fixture categories:

### Dashboard Fixtures (`kind: 'dashboard'`)

Fixture structures with panel data, risk/quality/confidence bands, and source evidence references, suitable for dashboard panel display.

**9 dashboard fixtures:**

| Name | Risk Band | Confidence Band |
|---|---|---|
| `clean-low-risk-dashboard` | low | high |
| `creator-credible-wallet-benign-dashboard` | low | high |
| `creator-risk-wallet-risk-dashboard` | high | moderate |
| `manipulation-risk-dominates-dashboard` | elevated | moderate |
| `mixed-signal-watchlist-dashboard` | moderate | low |
| `insufficient-data-dashboard` | unknown | none |
| `high-risk-multi-evidence-dashboard` | critical | high |
| `safety-boundary-dashboard` | unknown | none |
| `malformed-input-safe-dashboard` | unknown | none |

### Report Fixtures (`kind: 'report'`)

Fixture structures with named report sections (summary, risk, quality, confidence, safety-boundary), suitable for report rendering.

**4 report fixtures:**

| Name | Risk Band | Phase 34 Source |
|---|---|---|
| `clean-low-risk-report` | low | `clean-low-risk-intelligence-report` |
| `mixed-signal-watchlist-report` | moderate | `mixed-signal-watchlist-intelligence-report` |
| `high-risk-multi-evidence-report` | critical | `high-risk-multi-evidence-intelligence-report` |
| `safety-boundary-report` | unknown | `safety-boundary-intelligence-report` |

### Combined Fixtures (`kind: 'combined'`)

Fixture structures containing both a dashboard sub-fixture and a report sub-fixture, suitable for future replay workflows that need both representations.

**3 combined fixtures:**

| Name | Phase 33 Source | Phase 34 Source |
|---|---|---|
| `dashboard-ready-combined` | `dashboard-ready-composite` | `dashboard-ready-intelligence-report` |
| `report-ready-combined` | `report-ready-composite` | `serialization-preview-ready-intelligence-report` |
| `serialization-preview-ready-combined` | `dashboard-ready-composite` | `serialization-preview-ready-intelligence-report` |

---

## Source Evidence References

Each fixture carries `meta.sourceCompositeFixtureName` (from Phase 33) and `meta.sourceReportFixtureName` (from Phase 34) for traceability into the offline intelligence layers.

```typescript
meta.sourceCompositeFixtureName: OfflineCompositeEvidenceFixtureName | null
meta.sourceCompositeFixtureKind: OfflineCompositeEvidenceFixtureKind | null
meta.sourceReportFixtureName: OfflineIntelligenceReportFixtureName | null
meta.sourceReportFixtureKind: OfflineIntelligenceReportKind | null
```

---

## Types

```typescript
CompositeEvidenceDashboardReportFixture    // combined fixture (dashboard + report)
CompositeEvidenceDashboardFixture          // dashboard-only fixture
CompositeEvidenceReportFixture             // report-only fixture
CompositeEvidencePanelFixture              // panel inside a dashboard fixture
CompositeEvidenceReportSectionFixture      // section inside a report fixture
CompositeEvidenceFixtureMeta              // fixture metadata
CompositeEvidenceFixtureSummary           // fixture summary
CompositeEvidenceFixtureValidationResult  // validation output
CompositeEvidenceFixtureValidationIssue   // individual validation issue
CompositeEvidenceFixtureSafetyResult      // safety check output
CompositeEvidenceFixtureBuildInput        // builder input
CompositeEvidenceFixtureBuildResult       // builder result
CompositeEvidenceDashboardReportFixtureName  // union of all 16 fixture names
CompositeEvidenceDashboardReportFixtureKind  // 'dashboard' | 'report' | 'combined'
```

---

## Helpers

### Builders

```typescript
buildCompositeEvidenceDashboardFixture(input)         // → CompositeEvidenceDashboardFixture
buildCompositeEvidenceReportFixture(input)             // → CompositeEvidenceReportFixture
buildCompositeEvidenceDashboardReportFixture(input)    // → CompositeEvidenceDashboardReportFixture
buildCompositeEvidenceFixture(input)                   // → CompositeEvidenceFixtureBuildResult
```

### Normalization

```typescript
normalizeCompositeEvidenceDashboardReportFixture(fixture)
normalizeCompositeEvidenceDashboardFixture(fixture)
normalizeCompositeEvidenceReportFixture(fixture)
isCompositeEvidenceDashboardReportFixtureSerializable(fixture)
areCompositeEvidenceDashboardReportFixturesEqual(a, b)
isValidCompositeEvidenceFixtureName(name)
isValidCompositeEvidenceFixtureKind(kind)
```

### Validation

```typescript
validateCompositeEvidenceDashboardReportFixture(fixture)  // → CompositeEvidenceFixtureValidationResult
validateCompositeEvidenceDashboardReportSafety(fixture)   // → CompositeEvidenceFixtureSafetyResult
```

### List/Get

```typescript
listCompositeEvidenceDashboardReportFixtures()              // → readonly name[]
getCompositeEvidenceDashboardReportFixture(name)            // → fixture | null
```

### Capabilities

```typescript
getCompositeEvidenceDashboardReportFixtureCapabilities()   // → capability flags
```

---

## Validation

### Structural validation

`validateCompositeEvidenceDashboardReportFixture` checks:

- Fixture name must be a recognized Phase 35 fixture name
- Fixture kind must be `'dashboard'`, `'report'`, or `'combined'`
- Title and description must be non-empty strings
- `meta.generatedAt` must equal the Phase 35 deterministic constant
- `meta.source` must equal the Phase 35 source constant
- `meta.liveData`, `meta.externalNetwork`, `meta.persistence` must be `false`
- `meta.nonAdvisory`, `meta.nonAccusatory` must be `true`
- `summary.nonAdvisory`, `summary.safeToDisplay` must be `true`

### Safety validation

`validateCompositeEvidenceDashboardReportSafety` scans all string values in the fixture tree for:

- PII (email, phone, postal address)
- URLs
- Stack traces
- Local filesystem paths
- Secrets (private keys, seed phrases, API keys)
- Live data language
- Investment advice or trading signal language
- Execution language (trade, swap, sign, send)
- Accusation language (criminal, fraudster, proven manipulation)
- Solana wallet addresses (base58, 32–44 chars)
- Transaction hashes (base58, 64–88 chars)

All Phase 35 fixtures pass both structural and safety validation.

---

## Safety Boundaries

The following capabilities are permanently `false` in Phase 35:

| Capability | Value |
|---|---|
| `compositeEvidenceFixtureLiveData` | `false` |
| `compositeEvidenceFixtureSolanaRpc` | `false` |
| `compositeEvidenceFixtureExternalNetwork` | `false` |
| `compositeEvidenceFixtureTradingSignals` | `false` |
| `compositeEvidenceFixtureInvestmentAdvice` | `false` |
| `compositeEvidenceFixtureExecution` | `false` |
| `compositeEvidenceFixturePersistence` | `false` |
| `compositeEvidenceFixtureFileExport` | `false` |
| `compositeEvidenceFixtureDownloadSupport` | `false` |

The following are permanently `true`:

| Capability | Value |
|---|---|
| `compositeEvidenceDashboardFixtures` | `true` |
| `compositeEvidenceReportFixtures` | `true` |
| `compositeEvidenceDashboardReportFixtures` | `true` |
| `compositeEvidenceFixtureBuilders` | `true` |
| `compositeEvidenceFixtureSafetyValidation` | `true` |

---

## What Phase 35 Does NOT Implement

- No live data or Solana RPC access
- No Jito, MEV, mempool, or Yellowstone/Geyser integration
- No wallet access, private keys, or signing
- No trading, execution, or order logic
- No investment advice or trading signals
- No external network calls
- No filesystem writes, file export, or download APIs
- No browser storage or persistence
- No UI framework work (no React/Vue components)
- No real accusations against entities
- No real wallet addresses or transaction hashes

---

## Future Direction (Phase 36 Preview Only)

Phase 36 is expected to add **Replay Outcome Fixture Models**, enabling structured replay of fixture-backed composite intelligence through deterministic outcome simulation. Phase 35 fixtures will serve as the source inputs for Phase 36 replay structures.

Phase 36 is NOT implemented in this phase.

---

## Tests

`tests/phase35.test.ts` provides 317 tests covering:

- Type shapes and exports
- Fixture list/get helpers
- All 16 required fixtures
- Dashboard fixture builders
- Report fixture builders
- Combined fixture builders
- Normalization (including idempotency)
- Validation success and failure cases
- Safety validation success and failure cases
- Phase 33/34 source reference compatibility
- Compatibility with existing dashboard/report/serialization fixtures
- No input mutation
- Serializability
- Deterministic ordering and generatedAt
- No real wallet addresses, transaction hashes, or personal data
- No secrets, stack traces, or local paths
- No live-data claims
- No RPC/Jito/MEV/mempool integration
- No wallet/trading/execution logic
- No investment advice or trading signals
- No accusations against real entities
- No external network, filesystem writes, or download APIs
- Phase 35 capability flags
- Safety boundary regression
