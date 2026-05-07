# Offline Intelligence Composite Evidence

**Phase 33 — Offline Intelligence Composite Evidence Models v1**

## 1. Phase 33 Purpose

Phase 33 introduces a new top-level package `packages/offline-intelligence/` containing a deterministic, local-only composite evidence fixture-model layer.

It combines synthetic cross-references to Phase 30 (creator-intelligence), Phase 31 (wallet-intelligence), and Phase 32 (manipulation-detector) fixture outputs into unified composite offline intelligence fixtures. It prepares future offline analysis workflows that aggregate multi-source evidence without accessing any live data, wallets, or external network.

## 2. Safety Boundaries

Phase 33 composite evidence fixtures are:

- local-only
- read-only
- synthetic-only
- deterministic
- serializable
- in-memory
- non-persistent
- external-network-free
- file-write-free
- non-advisory
- non-accusatory

Phase 33 adds **no**:

- live transaction inspection
- live bundle detection
- live wash-trade detection
- Jito / MEV / mempool access
- Solana RPC or provider API calls
- wallet data access or private key handling
- copy trading or execution controls
- investment advice or buy/sell signals
- real identity resolution or accusations against real entities
- browser storage or database writes

## 3. Package Location

```
packages/offline-intelligence/
  src/
    types.ts          — Phase 33 constants, fixture names/kinds arrays, all interfaces
    capabilities.ts   — getOfflineCompositeEvidenceCapabilities()
    normalization.ts  — normalize, serialize, isSerializable, areEqual helpers
    validation.ts     — validateOfflineCompositeEvidenceFixture, validateOfflineCompositeEvidenceSafety
    builders.ts       — buildOfflineCompositeEvidenceFixture, buildOfflineCompositeEvidenceSummary
    fixtures.ts       — 16 deterministic composite evidence fixtures + Map + list/get helpers
    index.ts          — barrel export
```

## 4. Core Types

### `OfflineCompositeEvidenceFixtureName`

16 deterministic fixture names:

| Name | Kind |
|---|---|
| `clean-low-risk-composite` | `clean-low-risk` |
| `creator-credible-wallet-benign-composite` | `creator-credible-wallet-benign` |
| `creator-unknown-wallet-low-signal-composite` | `creator-unknown-wallet-low-signal` |
| `creator-risk-wallet-risk-composite` | `creator-risk-wallet-risk` |
| `manipulation-risk-dominates-composite` | `manipulation-risk-dominates` |
| `wallet-cluster-risk-dominates-composite` | `wallet-cluster-risk-dominates` |
| `creator-risk-dominates-composite` | `creator-risk-dominates` |
| `mixed-signal-watchlist-composite` | `mixed-signal-watchlist` |
| `false-positive-protected-composite` | `false-positive-protected` |
| `insufficient-data-composite` | `insufficient-data` |
| `high-risk-multi-evidence-composite` | `high-risk-multi-evidence` |
| `safety-boundary-composite` | `safety-boundary` |
| `malformed-input-safe-composite` | `malformed-safe` |
| `no-action-non-advisory-composite` | `no-action-non-advisory` |
| `report-ready-composite` | `report-ready` |
| `dashboard-ready-composite` | `dashboard-ready` |

### `OfflineCompositeEvidenceFixture`

Top-level fixture interface combining:

- `sourceReferences: CompositeEvidenceSourceReference` — optional references to Phase 30/31/32 fixture names
- `riskIndicators: CompositeRiskIndicator[]` — multi-source risk indicators
- `qualityIndicators: CompositeQualityIndicator[]` — multi-source quality indicators
- `confidenceIndicators: CompositeConfidenceIndicator[]` — multi-source confidence indicators
- `weighting: CompositeEvidenceWeighting` — per-source weight dominance
- `summary: CompositeEvidenceSummary` — composite overall assessment
- `safeNotes: string[]` — display-safe notes
- `meta: OfflineCompositeEvidenceFixtureMeta` — fixture provenance and safety flags

### `CompositeEvidenceSourceReference`

```typescript
interface CompositeEvidenceSourceReference {
  creator: CompositeCreatorEvidenceReference | null;
  walletCluster: CompositeWalletClusterEvidenceReference | null;
  manipulation: CompositeManipulationEvidenceReference | null;
}
```

All three source fields are required (non-optional) but may be `null` when that source is not referenced.

## 5. Capability Flags

`getOfflineCompositeEvidenceCapabilities()` returns an `OfflineCompositeEvidenceFixtureCapabilities` object:

```typescript
{
  compositeEvidenceFixtures: true,
  syntheticCompositeEvidence: true,
  compositeCreatorEvidenceRefs: true,
  compositeWalletClusterEvidenceRefs: true,
  compositeManipulationEvidenceRefs: true,
  compositeEvidenceWeighting: true,
  compositeRiskIndicators: true,
  compositeQualityIndicators: true,
  compositeConfidenceIndicators: true,
  compositeEvidenceSafetyValidation: true,
  compositeLiveData: false,
  compositeTradingSignals: false,
  compositeInvestmentAdvice: false,
  compositeExternalNetwork: false,
  compositePersistence: false,
  compositeExecution: false,
}
```

The same flags are registered in:
- `apps/dashboard/src/types.ts` and `capabilities.ts`
- `apps/read-only-api/src/types.ts` and `capabilities.ts`

## 6. Validation

### `validateOfflineCompositeEvidenceFixture(fixture: unknown)`

Validates structural correctness, required fields, allowed values, and cross-reference lookup:

- Returns `{ valid: true, issues: [] }` for all 16 built-in fixtures
- Returns errors with codes: `INVALID_INPUT`, `INVALID_VALUE`, `NAME_MISMATCH`, `KIND_MISMATCH`, `INVALID_CREATOR_REF`, `INVALID_WALLET_CLUSTER_REF`, `INVALID_MANIPULATION_REF`

### `validateOfflineCompositeEvidenceSafety(fixture: unknown)`

Checks for safety violations: real Solana addresses, transaction hashes, bundle IDs, email addresses, phone numbers, street addresses, external URLs, stack traces, local file paths, secrets/credentials, live-data claims, investment advice language, execution instructions, accusation language, and wallet ownership claims.

- Returns `{ safe: true, violations: [] }` for all 16 built-in fixtures
- Returns `{ safe: false, violations: [...] }` if any pattern matches

## 7. Builders

### `buildOfflineCompositeEvidenceFixture(input)`

Validates + safety-checks the input, then returns a fully normalized `OfflineCompositeEvidenceFixture`. Returns `null` if safety or validation fails.

### `buildOfflineCompositeEvidenceSummary(input)`

Constructs a `CompositeEvidenceSummary` from normalized inputs. Returns `null` on any validation failure.

## 8. Fixture Lookup

```typescript
import {
  listOfflineCompositeEvidenceFixtures,
  getOfflineCompositeEvidenceFixture,
} from '@sonic/offline-intelligence';

const all = listOfflineCompositeEvidenceFixtures(); // OfflineCompositeEvidenceFixture[]
const f = getOfflineCompositeEvidenceFixture('clean-low-risk-composite'); // or undefined
```

## 9. Safety Notes

- `PHASE_33_COMPOSITE_EVIDENCE_GENERATED_AT` is always `'2026-01-01T00:00:00.000Z'` — never `Date.now()`
- All arrays are deterministically sorted: strings via `localeCompare`, indicators by `.code`
- All 16 fixtures pass both `validateOfflineCompositeEvidenceFixture` and `validateOfflineCompositeEvidenceSafety`
- The builders run safety checks **before** validation checks
- This package has no dependencies on Solana SDKs, Jito, MEV tools, provider APIs, or network clients

## 10. Cross-Package Dependencies

```
packages/offline-intelligence
  ├── @sonic/creator-intelligence  (Phase 30 fixture names)
  ├── @sonic/wallet-intelligence   (Phase 31 fixture names)
  └── @sonic/manipulation-detector (Phase 32 fixture names)
```

All three are used only for fixture-name type imports — no runtime logic from those packages is invoked.
