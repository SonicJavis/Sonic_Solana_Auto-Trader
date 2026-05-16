
### Phase 87 Linkage Note

Phase 87 outcome-to-risk feedback loop contracts consume Phase 58 risk fixture identifiers as immutable source linkage evidence only. No live risk re-scoring, runtime mutation, or automatic gate unlock behavior is introduced by this linkage.

# LAUNCH_RISK_ENGINE.md

## Phase 58 — Launch Risk Engine v1

### Purpose

The Launch Risk Engine is a deterministic, synthetic, local-only, read-only, rule-based risk analysis module for the Sonic Solana Auto-Trader dashboard. It evaluates Phase 56 lifecycle states and Phase 57 replay reports using evidence-backed, non-advisory risk factors and produces structured risk assessments, view models, and API-contract fixtures.

This module is **not** a trading advisor. It does not produce recommendations, signals, or instructions. It classifies observed synthetic fixture data into risk bands for research and analysis purposes only.

---

### Relationship to Phase 56 Lifecycle Fixtures

Each risk fixture references a specific Phase 56 lifecycle stream fixture. The lifecycle fixture provides the simulated on-chain events (metadata, mint/freeze authority, liquidity, holder distribution, creator activity, wallet clusters, volume bursts, bundle-like patterns, safety rejections) that are used as the evidence basis for risk factor outputs.

Phase 56 lifecycle stream names referenced:
- `clean-launch-lifecycle-stream`
- `thin-liquidity-lifecycle-stream`
- `concentrated-holders-lifecycle-stream`
- `suspicious-creator-lifecycle-stream`
- `bundle-cluster-lifecycle-stream`
- `metadata-incomplete-lifecycle-stream`
- `high-early-volume-lifecycle-stream`
- `safety-rejected-lifecycle-stream`

---

### Relationship to Phase 57 Replay Reports

Each risk fixture also references a Phase 57 replay harness scenario fixture. The replay report provides additional evidence about the integrity of the event stream re-execution. Replay pass/fail status is included as the `replay_integrity_risk` factor.

Phase 57 replay scenario names referenced:
- `clean-launch-replay`
- `thin-liquidity-replay`
- `concentrated-holders-replay`
- `suspicious-creator-replay`
- `possible-bundle-cluster-replay`
- `metadata-incomplete-replay`
- `high-early-volume-replay`
- `safety-rejected-replay`

---

### Why Rule-Based Risk Matters

Rule-based risk analysis is deterministic, auditable, and reproducible. Unlike machine-learning approaches, it provides:

- **Transparency**: Each factor has a reason code and evidence references.
- **Reproducibility**: Given the same fixture inputs, the same score is always produced.
- **Auditability**: Every risk band classification is traceable to threshold values and factor outputs.
- **Safety**: No probabilistic or adaptive behavior that could drift into advisory output.

---

### Factor Model

The risk engine evaluates 12 deterministic factor kinds:

| Factor Kind | Weight | Description |
|---|---|---|
| `metadata_completeness_risk` | 0.08 | Observed completeness of on-chain metadata |
| `mint_authority_risk` | 0.10 | Observed mint authority state |
| `freeze_authority_risk` | 0.10 | Observed freeze authority state |
| `thin_liquidity_risk` | 0.12 | Derived liquidity depth classification |
| `liquidity_volatility_risk` | 0.08 | Observed liquidity change variance |
| `holder_concentration_risk` | 0.12 | Derived holder distribution concentration |
| `creator_activity_risk` | 0.10 | Observed creator activity pattern |
| `wallet_cluster_risk` | 0.10 | Observed wallet cluster pattern |
| `early_volume_burst_risk` | 0.10 | Derived early volume burst classification |
| `bundle_like_pattern_risk` | 0.10 | Observed bundle-like pattern |
| `replay_integrity_risk` | 0.05 | Derived from Phase 57 replay report |
| `safety_rejection_risk` | 0.05 | Observed safety rejection status |

Each factor output includes:
- `factorId`, `factorKind`, `severity`, `scoreContribution`, `weight`
- `confidenceLabel`, `reasonCode`, `summary`
- `sourceLifecycleEventIds`, `sourceReplaySnapshotIds`, `evidenceReferenceIds`
- `safetyNotes`

---

### Scoring Model

The total risk score is computed as:

```
totalRiskScore = sum(scoreContribution_i * weight_i) / sum(weight_i)
```

Result is clamped to `[0.0, 1.0]`.

All calculations are deterministic, pure functions with no random or time-dependent inputs.

---

### Threshold Model

Risk bands are classified from thresholds:

| Band | Score Range |
|---|---|
| `low` | score < 0.20 |
| `moderate` | 0.20 ≤ score < 0.40 |
| `elevated` | 0.40 ≤ score < 0.60 |
| `high` | 0.60 ≤ score < 1.00 |
| `rejected` | score ≥ 1.00 |

Default threshold constants: `{ low: 0.20, moderate: 0.20, elevated: 0.40, high: 0.60, rejected: 1.00 }`

**Important**: "rejected" is a safety/risk classification only. It is NOT a trading instruction. It means the simulated lifecycle data showed a safety rejection pattern that maps to the rejected risk band.

---

### Assessment Model

Each `LaunchRiskAssessment` includes:
- `assessmentId`, `assessmentStatus` (assessed | safety_rejected | insufficient_evidence)
- `sourceLifecycleFixtureName`, `sourceReplayFixtureName`
- `totalRiskScore`, `riskBand`
- `hardRejectionReasons` (list of classification reasons for rejected status)
- `softWarningReasons` (list of non-hard warnings)
- `factorCount`, `evidenceCount`
- `summary`, `validationSummary`, `safetySummary`
- `meta` (deterministic timestamps, source, schemaVersion)

---

### Evidence / Reference Model

Every factor output must include:
- `sourceLifecycleEventIds`: references to specific Phase 56 lifecycle events
- `sourceReplaySnapshotIds`: references to specific Phase 57 replay snapshots
- `evidenceReferenceIds`: unique evidence reference IDs

Validation rejects any factor output with empty `evidenceReferenceIds`.

---

### Rejection vs Recommendation Distinction

The risk engine uses "rejection" exclusively as a **risk classification** derived from synthetic fixture data. It does not:
- Recommend entering or exiting a position
- Produce trading signals
- Provide investment advice
- Trigger paper or live execution

Language used in the risk engine follows neutral-only conventions:
- ✅ "observed", "derived", "risk factor", "risk band", "risk classification", "safety rejection", "non-actionable", "not a signal", "requires review"
- ❌ "buy", "sell", "enter", "exit", "ape", "snipe now", "profit opportunity", "recommendation", "investment advice"

---

### View Model / API Contract / Selector Overview

**View Models** (`LaunchRiskEngineViewModel`): Dashboard-friendly summaries. No DOM/rendering. Fields: assessmentName, assessmentKind, assessmentStatus, totalRiskScore, riskBand, factorCount, counts, nonAdvisorySummary.

**API Contract Fixtures** (`LaunchRiskEngineApiContracts`): Fixture-only shapes for list, detail, summary, and error contracts. No endpoints, handlers, or routes. All marked `fixtureOnly: true`, `readOnly: true`, `localOnly: true`.

**Selectors**: Pure local selectors over fixture arrays. Accept optional query parameters (fixtureId, fixtureName, fixtureKind, riskBand, assessmentStatus). No runtime request parsing.

---

### Capability Flags

Positive flags (all `true`):
`launchRiskEngine`, `launchRiskEngineFixtures`, `deterministicLaunchRiskEngine`, `localOnlyLaunchRiskEngine`, `readOnlyLaunchRiskEngine`, `fixtureDerivedLaunchRiskEngine`, `ruleBasedLaunchRiskEngine`, `launchRiskFactorOutputs`, `launchRiskAssessments`, `launchRiskThresholds`, `launchRiskViewModels`, `launchRiskApiContracts`, `launchRiskSelectors`

Negative flags (all `false`):
`launchRiskLiveData`, `launchRiskNetworkAccess`, `launchRiskRealProviders`, `launchRiskProviderAdapters`, `launchRiskSolanaRpc`, `launchRiskWebSocketAccess`, `launchRiskGeyserYellowstone`, `launchRiskPumpFunIntegration`, `launchRiskDexIntegration`, `launchRiskJitoIntegration`, `launchRiskPersistence`, `launchRiskFilesystemWrites`, `launchRiskDownloads`, `launchRiskRouteHandlers`, `launchRiskHttpServer`, `launchRiskRuntimeRequests`, `launchRiskUiRendering`, `launchRiskDomAccess`, `launchRiskBackgroundJobs`, `launchRiskScheduledJobs`, `launchRiskWalletLogic`, `launchRiskPrivateKeyHandling`, `launchRiskSigning`, `launchRiskTransactionSending`, `launchRiskExecution`, `launchRiskTradingSignals`, `launchRiskRecommendations`, `launchRiskInvestmentAdvice`, `launchRiskPaperSimulation`, `launchRiskLiveExecution`, `launchRiskStrategySelection`

---

### Safety Constraints

- **Synthetic only**: All data derived from fixtures, never from live networks.
- **Local-only**: No network calls, RPC, WebSockets, Geyser/Yellowstone.
- **Read-only**: No persistence, filesystem writes, downloads, or exports.
- **Non-networked**: No Solana RPC, Pump.fun, Jupiter, Raydium, Orca, Meteora, or Jito.
- **Non-wallet**: No wallet logic, private keys, seed phrases, key pairs, signing, or sending.
- **Non-executing**: No execution, paper trading, or live trading.
- **Non-advisory**: No trading signals, recommendations, or investment advice.
- **Deterministic**: No `Date.now()`, `Math.random()`, `crypto.randomUUID()`, locale-dependent formatting, or process.env fixture behavior.
- **No background jobs**: No timers, workers, cron jobs, queues, or scheduled tasks.
- **No UI/DOM**: No React, DOM APIs, browser storage.

---

### Validation Behavior

`validateLaunchRiskEngineFixture` checks:
- Required fields (fixtureId, fixtureName, fixtureKind, phase, schemaVersion)
- Source fixture references (lifecycle and replay)
- Risk identity (assessmentId, generatedAt constant, deterministicSeed)
- Factor outputs (at least one; valid factorKind, severity, confidenceLabel; non-empty evidenceReferenceIds; reasonCode required; scoreContribution in [0,1])
- Assessment (totalRiskScore in [0,1]; riskBand derived from thresholds; score/band consistency)
- Meta and safety fields (constant generatedAt, correct source)
- Capability flags (positive flags true, negative flags false)
- Deep safety scan (no live URLs, network references, filesystem, runtime, wallet, execution, advisory language, provider references)

`validateLaunchRiskEngineSafety` checks all negative capability flags are false and safety fields are true.

`validateLaunchRiskEngineFixtureTable` checks unique IDs/names and all assessment names covered.

---

### Testing Summary

`tests/phase58.test.ts` covers:
- Source file existence (14 files + docs)
- Constants, names, kinds, factor kinds, severity values, confidence labels, risk bands
- Fixture structure (≥8 fixtures, unique IDs/names, phase, schemaVersion, lifecycle and replay linkage)
- getLaunchRiskEngineFixture (by ID, not found)
- buildLaunchRiskEngineFixture (all 8 scenarios, determinism)
- Risk identity fields
- Factor outputs (required fields, buildLaunchRiskFactorOutput)
- Threshold classification (all 5 bands)
- Score calculation (empty array, [0,1] range, consistency with assessment)
- Assessments (required fields, safety_rejected status, soft warnings, band/score consistency, buildLaunchRiskAssessment)
- View models (buildLaunchRiskEngineViewModel, selectLaunchRiskEngineViewModel)
- API contracts (list/detail/summary/error shapes, selectLaunchRiskEngineApiSummary)
- Selectors (by ID, name, riskBand, unmatched)
- Normalization (normalize, serialize, equality, checksum)
- Validation success (all 8 fixtures)
- Validation failure cases (missing evidence, invalid score, band mismatch, unsafe advisory text, missing reason code, unsafe capability flag)
- Normalization helpers (isValid* functions)
- Capability flags (positive and negative)
- Dashboard root exports
- Read-only API capability propagation
- Source file safety scan (excluding validation.ts which legitimately defines regex patterns)
- Determinism across repeated builds
- Safety fields
- No forbidden behaviors (paper simulation, strategy selection, live execution, wallet, signals)
- Phase 59 preview only (not implemented)

---

### Explicit Non-Goals

Phase 58 does NOT include:
- Live data ingestion or real provider adapters
- Solana RPC, WebSockets, Geyser, or Yellowstone integration
- Pump.fun, Jupiter, Raydium, Orca, Meteora, or Jito integration
- Wallet logic, private keys, seed phrases, signing, or sending
- Execution of any kind (paper trading, live trading, or replay trading)
- Trading signals, recommendations, or investment advice
- Strategy selection or ML-based classification
- HTTP endpoints, Fastify routes, or runtime request handling
- React components, DOM rendering, or browser APIs
- Filesystem writes, downloads, persistence, or background jobs
- Phase 59 implementation (Risk Explanation and Evidence Models)

---

### Next Milestone Guidance

**Phase 59 — Risk Explanation and Evidence Models v1** is implemented in the current repository revision.

Next milestone preview: **Phase 60 — Paper Sniper Simulation Foundation v1** (not implemented in this document).
