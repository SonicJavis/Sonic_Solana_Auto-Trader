# Offline Intelligence Report Integration Models

**Phase 34 — Offline Intelligence Report Integration Models v1**

## 1. Phase 34 Purpose

Phase 34 adds deterministic offline intelligence report integration models in `packages/offline-intelligence/src/report-integration/`.

This layer transforms synthetic Phase 33 composite evidence fixtures into report-ready local models for future dashboard, report, replay, and serialization workflows.

## 2. Safety Boundaries

Phase 34 report integration models are:

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

Phase 34 adds **no**:

- live data ingestion
- Solana RPC/provider APIs
- Jito/MEV/mempool integration
- wallet/private key handling
- transaction signing/sending
- trading/execution logic
- investment recommendations/trading signals
- identity resolution or accusations against real entities
- persistence/browser storage
- file export/download behavior

## 3. Architecture

Implementation location:

```
packages/offline-intelligence/src/report-integration/
  types.ts
  builders.ts
  normalization.ts
  validation.ts
  fixtures.ts
  capabilities.ts
  index.ts
```

Data flow:

```
Phase 30 creator fixtures
  + Phase 31 wallet-cluster fixtures
  + Phase 32 manipulation fixtures
    -> Phase 33 composite evidence fixtures
      -> Phase 34 offline intelligence report integration fixtures
```

## 4. Supported Report Sections

Each report model includes deterministic sections:

- `summary`
- `risk`
- `quality`
- `confidence`
- `source-references`
- `weighting`
- `safety-boundary`

## 5. Source Evidence References

Every Phase 34 report includes metadata preserving the synthetic Phase 33 source fixture:

- `sourceCompositeFixtureName`
- `sourceCompositeFixtureKind`
- `sourceCompositeGeneratedAt`
- `sourceCompositeWeighting`
- `sourceCompositeReferenceCount`

## 6. Risk / Quality / Confidence Sections

Phase 34 sections are derived from Phase 33 composite outputs:

- Risk section: deterministic risk band + sorted indicator codes
- Quality section: deterministic quality band + sorted indicator codes
- Confidence section: deterministic confidence band + sorted indicator codes

All sections remain non-advisory and non-actionable.

## 7. Validation and Safety Validation

### `validateOfflineIntelligenceReportModel(report)`

Validates:

- required fields
- supported fixture names/kinds/section kinds
- deterministic metadata constants
- Phase 33 source compatibility
- stable ordering of sections and notes
- JSON serializability

### `validateOfflineIntelligenceReportSafety(report)`

Rejects content containing:

- possible real wallet addresses/transaction hashes/bundle IDs
- personal data markers (email/phone/street)
- secrets/credentials
- stack traces/local paths
- live-data/network claims
- execution/advice language
- accusation language
- file-export/download language

## 8. Deterministic Fixture Set

Phase 34 provides 16 required fixtures:

1. clean low-risk intelligence report
2. creator-credible wallet-benign report
3. creator-unknown wallet-low-signal report
4. creator-risk wallet-risk report
5. manipulation-risk dominates report
6. wallet-cluster-risk dominates report
7. creator-risk dominates report
8. mixed-signal watchlist report
9. false-positive-protected report
10. insufficient-data report
11. high-risk multi-evidence report
12. safety-boundary report
13. malformed-input-safe report
14. no-action non-advisory report
15. dashboard-ready intelligence report
16. serialization-preview-ready report

## 9. Compatibility Intent

Phase 34 report metadata includes compatibility flags for downstream local flows:

- `dashboardReportCompatible: true`
- `serializationPreviewCompatible: true`

This is model compatibility metadata only; no export/download behavior is implemented.

## 10. What Phase 34 Does Not Implement

- no live intelligence
- no real scoring/attribution of real entities
- no recommendations/signals/actions
- no file exports/downloads
- no persistence
- no external network behavior

## 11. Phase 35 and Phase 36 Follow-on

Implemented follow-on phases:

- Phase 35 — Composite Evidence Dashboard/Report Fixtures v1
- Phase 36 — Replay Outcome Fixture Models v1
