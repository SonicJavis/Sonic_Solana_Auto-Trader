# Bundle / Manipulation Evidence Fixtures

**Phase 32 — Bundle / Manipulation Evidence Fixture Models v1**

## 1. Phase 32 Purpose

Phase 32 adds a deterministic, local-only manipulation-evidence fixture-model layer in `packages/manipulation-detector/`.

It prepares future offline market-integrity analysis with typed synthetic bundle-like, launch-structure, liquidity, coordination, concentration, and funding evidence models. It does not inspect live transactions or identify real entities.

## 2. Safety Boundaries

Phase 32 manipulation-evidence fixtures are:

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

Phase 32 adds **no**:

- live transaction inspection
- live bundle detection
- Jito, MEV, or mempool integrations
- Solana RPC or provider API access
- wallet access, key handling, signing, or sending
- execution, trading signals, or investment advice
- identity resolution or accusations against real entities
- persistence or browser storage
- mutation controls

## 3. Synthetic Fixture-Only Architecture

Implementation location:

```text
packages/manipulation-detector/src/
  evidence-fixture-model-types.ts
  evidence-fixture-model-capabilities.ts
  evidence-fixture-model-builders.ts
  evidence-fixture-model-normalization.ts
  evidence-fixture-model-validation.ts
  evidence-fixture-model-fixtures.ts
```

This layer extends the existing manipulation package with offline evidence fixtures only. It reuses Phase 30 creator fixture names and Phase 31 wallet-cluster fixture names only for synthetic cross-reference summaries.

## 4. Supported Evidence Fixture Types

Phase 32 adds:

- `ManipulationEvidenceFixture`
- `ManipulationEvidenceFixtureName`
- `ManipulationEvidenceFixtureKind`
- `BundlePatternFixture`
- `LaunchStructureEvidenceFixture`
- `LiquidityPatternEvidenceFixture`
- `CoordinationEvidenceFixture`
- `DistributionConcentrationFixture`
- `FundingPatternEvidenceFixture`
- `ManipulationRiskIndicator`
- `ManipulationQualityIndicator`
- `ManipulationEvidenceSummary`
- `ManipulationEvidenceCrossReferenceSummary`

## 5. Fixture Coverage

Phase 32 includes 16 deterministic fixtures:

1. clean organic launch evidence
2. mild concentration watchlist
3. same-block bundle-like concentration
4. coordinated early buy pattern
5. coordinated early sell pattern
6. fresh-wallet burst pattern
7. same-funding-source synthetic evidence
8. staged liquidity pull risk pattern
9. creator-linked concentration pattern
10. bot-noise false-positive pattern
11. benign high-activity launch pattern
12. high-risk manipulation evidence
13. mixed-signal manipulation evidence
14. malformed-input-safe evidence
15. safety-boundary evidence
16. unknown-insufficient-data evidence

## 6. Example Evidence Themes

Bundle-like and coordination examples include:

- same-block concentration with elevated synthetic bundle-likelihood
- coordinated early-buy and early-sell timing windows
- fresh-wallet burst and same-funding-source synthetic evidence

Liquidity and distribution examples include:

- stable liquidity support
- staged liquidity-pull risk
- narrow vs broad synthetic distribution
- creator-linked concentration summaries with fixture-name-only references

False-positive and benign examples include:

- bot-noise false-positive context
- benign high-activity launch context
- unknown / insufficient-data fallback coverage

## 7. Validation and Safety Validation

Helpers:

- `buildManipulationEvidenceFixture()`
- `buildManipulationEvidenceSummary()`
- `buildManipulationEvidenceCrossReferenceSummary()`
- `normalizeManipulationEvidenceFixture()`
- `validateManipulationEvidenceFixture()`
- `validateManipulationEvidenceSafety()`
- `listManipulationEvidenceFixtures()`
- `getManipulationEvidenceFixture()`

Validation checks include:

- required supported names and kinds
- deterministic metadata and static generatedAt/source values
- serializability and stable ordering
- summary count and reference consistency
- synthetic-only and fixture-only flags
- safe creator/wallet cross-reference names only

Safety validation rejects content resembling:

- real wallet addresses or transaction hashes
- real bundle IDs
- emails, phone numbers, or street addresses
- secrets, private keys, or seed phrases
- stack traces or local filesystem paths
- live-data, provider, Jito, MEV, or mempool claims
- wallet ownership claims
- trading instructions, investment recommendations, or trading signals
- accusations against real entities

## 8. How Phase 32 Prepares Future Offline Analysis

Phase 32 creates stable typed synthetic evidence inputs for later offline market-integrity analysis, dashboards, and summary layers.

It allows future phases to combine creator, wallet-cluster, and manipulation-evidence fixture summaries without introducing any live chain inspection, identity attribution, or executable behavior.

## 9. What Phase 32 Does NOT Implement

- no live transaction data
- no live bundle reconstruction
- no Jito / MEV / mempool access
- no Solana RPC or provider APIs
- no wallets, signing, or sending
- no execution, orders, swaps, balances, or PnL
- no investment advice or trading signals
- no accusations against real entities
- no external network or persistence
- no browser storage or mutation controls

## 10. Phase 33 Preview Only

Likely next phase:

> Phase 33 — Offline Intelligence Composite Evidence Models v1

Phase 33 is not implemented here.

## 11. Explicit Safety Confirmation

Phase 32 adds no live transaction access, no Jito/MEV/mempool/RPC/provider integration, no wallet/private-key logic, no execution or trading logic, no investment advice, no real accusations, no external network access, no persistence, and no mutation controls.
