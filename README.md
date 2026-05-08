# Sonic_Solana_Auto-Trader

**Phase 40 — Strategy Review Dashboard Fixtures v1**

A defensive intelligence and control foundation for Solana trading. No live trading or execution in any phase up to and including Phase 40.

## Features (Phase 40 — adds to Phase 39)

- Adds `apps/dashboard/src/strategy-review-fixtures/` deterministic strategy review dashboard fixture layer:
  - strict review fixture/matrix-reference/panel/card/table/summary/safety/meta/validation/build/capability types
  - pure deterministic builders, normalization, serialization, equality, validation, and safety-validation helpers
  - 16 deterministic synthetic strategy review dashboard fixtures referencing Phase 39 matrix fixtures
- Adds Phase 40 strategy-review capability flags:
  - `strategyReviewDashboardFixtures: true`
  - `syntheticStrategyReviewDashboards: true`
  - `strategyReviewDashboardBuilders: true`
  - `strategyReviewDashboardSafetyValidation: true`
  - `strategyReviewMatrixReferences: true`
  - `strategyReviewRealUiRendering: false`
  - `strategyReviewRealScoring: false`
  - `strategyReviewRealRanking: false`
  - `strategyReviewRecommendations: false`
  - `strategyReviewTradingSignals: false`
  - `strategyReviewPaperTrading: false`
  - `strategyReviewLiveTrading: false`
  - `strategyReviewExecution: false`
  - `strategyReviewSolanaRpc: false`
  - `strategyReviewExternalNetwork: false`
  - `strategyReviewPersistence: false`
  - `strategyReviewFileExport: false`
  - `strategyReviewInvestmentAdvice: false`
- Extends dashboard/read-only-api capability surfaces with the same Phase 40 flags
- Adds `docs/STRATEGY_REVIEW_DASHBOARD_FIXTURES.md`
- Adds Phase 40 regression and safety tests
- No live data, no real UI rendering, no real scoring/ranking, no recommendations/signals, no replay/backtesting/paper/live trading, no execution, no network, no persistence, no file export/download support

## Features (Phase 38 — adds to Phase 37)

- Extends `packages/offline-intelligence` with deterministic strategy candidate evaluation fixture models:
  - strict strategy candidate profile/evaluation criterion/score-band-reference/summary/meta types
  - pure strategy candidate fixture and summary builders
  - normalization, serializability, validation, and safety-validation helpers
  - 16 deterministic synthetic strategy candidate evaluation fixtures linked to Phase 37 score-band references
- Adds Phase 38 strategy-candidate capability flags:
  - `strategyCandidateEvaluationFixtures: true`
  - `syntheticStrategyCandidates: true`
  - `strategyCandidateBuilders: true`
  - `strategyCandidateSafetyValidation: true`
  - `strategyCandidateScoreBandReferences: true`
  - `strategyCandidateRealScoring: false`
  - `strategyCandidateRealRanking: false`
  - `strategyCandidateRealBacktesting: false`
  - `strategyCandidatePaperTrading: false`
  - `strategyCandidateLiveTrading: false`
  - `strategyCandidateExecution: false`
  - `strategyCandidateSolanaRpc: false`
  - `strategyCandidateExternalNetwork: false`
  - `strategyCandidatePersistence: false`
  - `strategyCandidateFileExport: false`
  - `strategyCandidateInvestmentAdvice: false`
  - `strategyCandidateTradingSignals: false`
  - `strategyCandidateRecommendations: false`
- Extends dashboard/read-only-api compatibility capability surfaces with the same Phase 38 flags
- Adds `docs/STRATEGY_CANDIDATE_EVALUATION_FIXTURES.md`
- Adds Phase 38 strategy-candidate regression and safety tests
- No live data, no real scoring/ranking, no recommendations/signals, no replay/backtesting/paper/live trading, no Solana RPC/provider APIs, no wallets, no execution logic, no external network, no persistence, no file export/download support

## Features (Phase 36 — adds to Phase 35)

- Extends `packages/offline-intelligence` with deterministic replay outcome fixture models:
  - strict replay outcome fixture/observation/summary/reference/meta types
  - pure replay outcome builder and summary helper
  - normalization, serializability, validation, and safety-validation helpers
  - 16 deterministic synthetic replay outcome fixtures linked to Phase 33/34/35 fixture references
- Adds Phase 36 replay outcome capability flags:
  - `replayOutcomeFixtures: true`
  - `syntheticReplayOutcomes: true`
  - `replayOutcomeBuilders: true`
  - `replayOutcomeSafetyValidation: true`
  - `replayOutcomeCompositeEvidenceReferences: true`
  - `replayOutcomeReportReferences: true`
  - `replayOutcomeDashboardReferences: true`
  - `replayOutcomeLiveData: false`
  - `replayOutcomeRealBacktesting: false`
  - `replayOutcomePaperTrading: false`
  - `replayOutcomeLiveTrading: false`
  - `replayOutcomeExecution: false`
  - `replayOutcomeSolanaRpc: false`
  - `replayOutcomeExternalNetwork: false`
  - `replayOutcomePersistence: false`
  - `replayOutcomeFileExport: false`
  - `replayOutcomeInvestmentAdvice: false`
  - `replayOutcomeTradingSignals: false`
- Extends dashboard/read-only-api compatibility capability surfaces with the same Phase 36 flags
- Adds `docs/REPLAY_OUTCOME_FIXTURE_MODELS.md`
- Adds Phase 36 replay outcome regression and safety tests
- No live data, no real replay/backtesting/paper/live trading, no Solana RPC/provider APIs, no wallets, no execution logic, no external network, no persistence, no file export/download support

## Features (Phase 34 — adds to Phase 33)

- Extends `packages/offline-intelligence` with deterministic report-integration models:
  - strict offline intelligence report model/section/meta/summary fixture types
  - pure builders for report models, summaries, and sections from Phase 33 composite fixtures
  - normalization, serializability, validation, and safety-validation helpers
  - 16 deterministic synthetic report integration fixtures
- Adds Phase 34 report-integration capability flags:
  - `offlineIntelligenceReportModels: true`
  - `offlineIntelligenceReportFixtures: true`
  - `offlineIntelligenceCompositeReportIntegration: true`
  - `offlineIntelligenceReportRiskSections: true`
  - `offlineIntelligenceReportQualitySections: true`
  - `offlineIntelligenceReportConfidenceSections: true`
  - `offlineIntelligenceReportSourceReferences: true`
  - `offlineIntelligenceReportSafetyValidation: true`
  - `offlineIntelligenceReportLiveData: false`
  - `offlineIntelligenceReportSolanaRpc: false`
  - `offlineIntelligenceReportProviderApis: false`
  - `offlineIntelligenceReportJitoIntegration: false`
  - `offlineIntelligenceReportMempoolAccess: false`
  - `offlineIntelligenceReportTradingSignals: false`
  - `offlineIntelligenceReportInvestmentAdvice: false`
  - `offlineIntelligenceReportExternalNetwork: false`
  - `offlineIntelligenceReportPersistence: false`
  - `offlineIntelligenceReportExecution: false`
  - `offlineIntelligenceReportFileExport: false`
  - `offlineIntelligenceReportDownloadSupport: false`
- Extends dashboard/read-only-api compatibility capability surfaces with the same Phase 34 flags
- Adds `docs/OFFLINE_INTELLIGENCE_REPORT_INTEGRATION_MODELS.md`
- Adds Phase 34 report-integration regression and safety tests
- No live data, no Solana RPC/provider APIs, no Jito/MEV/mempool, no wallets, no execution/trading, no investment advice, no real accusations, no external network, no persistence, no file export/download support

## Features (Phase 32 — adds to Phase 31)

- Extends `packages/manipulation-detector` with deterministic manipulation-evidence fixture models:
  - strict bundle-pattern, launch-structure, liquidity-pattern, coordination, concentration, and funding fixture types
  - pure fixture, summary, and synthetic cross-reference builders
  - normalization, serializability, validation, and safety-validation helpers
  - 16 deterministic synthetic manipulation-evidence fixtures
- Adds Phase 32 manipulation-evidence capability flags:
  - `manipulationEvidenceFixtures: true`
  - `syntheticBundleEvidence: true`
  - `syntheticLaunchStructureEvidence: true`
  - `syntheticLiquidityPatternEvidence: true`
  - `syntheticCoordinationEvidence: true`
  - `manipulationRiskIndicators: true`
  - `manipulationQualityIndicators: true`
  - `manipulationEvidenceSafetyValidation: true`
  - `manipulationLiveData: false`
  - `manipulationSolanaRpc: false`
  - `manipulationProviderApis: false`
  - `manipulationJitoIntegration: false`
  - `manipulationMempoolAccess: false`
  - `manipulationTradingSignals: false`
  - `manipulationInvestmentAdvice: false`
  - `manipulationExternalNetwork: false`
  - `manipulationPersistence: false`
  - `manipulationExecution: false`
- Extends dashboard/read-only-api compatibility capability surfaces with the same Phase 32 flags
- Adds `docs/BUNDLE_MANIPULATION_EVIDENCE_FIXTURES.md`
- Adds Phase 32 manipulation-evidence regression and safety tests
- No live transactions, no live bundle detection, no Jito/MEV/mempool, no Solana RPC/provider APIs, no wallets, no execution/trading, no investment advice, no accusations against real entities, no persistence, no external network

## Features (Phase 30 — adds to Phase 29)

- Extends `packages/creator-intelligence` with deterministic creator-intelligence fixture models:
  - strict creator/profile/project/narrative/social/disclosure/engagement fixture types
  - pure fixture builders and summary builders
  - normalization, serializability, validation, and safety-validation helpers
  - 15 deterministic synthetic creator-intelligence fixtures
- Adds Phase 30 creator capability flags:
  - `creatorIntelligenceFixtures: true`
  - `syntheticCreatorProfiles: true`
  - `creatorNarrativeFixtures: true`
  - `creatorRiskIndicators: true`
  - `creatorCredibilityIndicators: true`
  - `creatorFixtureSafetyValidation: true`
  - `creatorLiveData: false`
  - `creatorSocialApiAccess: false`
  - `creatorScraping: false`
  - `creatorIdentityResolution: false`
  - `creatorInvestmentAdvice: false`
  - `creatorTradingSignals: false`
  - `creatorExternalNetwork: false`
  - `creatorPersistence: false`
- Extends dashboard/read-only-api compatibility capability surfaces with the same Phase 30 flags
- Adds `docs/CREATOR_INTELLIGENCE_FIXTURES.md`
- Adds Phase 30 creator-fixture regression and safety tests
- No live social data, no scraping, no APIs, no identity resolution, no wallets, no execution/trading, no persistence, no external network

## Features (Phase 29 — adds to Phase 28)

- Adds `apps/dashboard/src/report-serialization/` local deterministic serialization preview layer:
  - strict preview model types
  - pure preview builders for JSON/Markdown/text/metadata formats
  - normalization/serializability/checksum helpers
  - validation/safety validators
  - 15 deterministic serialization preview fixtures
- Adds serialization preview capability flags:
  - `dashboardReportSerializationPreview: true`
  - `dashboardReportJsonPreview: true`
  - `dashboardReportMarkdownPreview: true`
  - `dashboardReportTextPreview: true`
  - `dashboardReportMetadataPreview: true`
  - `dashboardReportActualFileExport: false`
  - `dashboardReportDownloadSupport: false`
- Adds `docs/LOCAL_DASHBOARD_REPORT_SERIALIZATION_PREVIEW.md`
- Adds Phase 29 serialization preview regression and safety tests
- No file export implementation, no file writes, no browser downloads, no persistence, no live data, no wallets, no execution/trading, no external network

## Features (Phase 28 — adds to Phase 27)

- Adds `apps/dashboard/src/reports/` local deterministic report export-model layer:
  - strict report model types
  - pure report builders from Phase 27 snapshots
  - normalization/serializability helpers
  - validation/safety validators
  - 20 deterministic report fixtures
- Adds report capability flags:
  - `dashboardReportModels: true`
  - `dashboardReportFixtures: true`
  - `deterministicReportModels: true`
  - `reportSafetyValidation: true`
  - `fixtureBackedReports: true`
  - `dashboardReportFileExport: false`
  - `dashboardReportPersistence: false`
  - `dashboardReportExternalNetwork: false`
  - `dashboardReportLiveData: false`
  - `dashboardReportMutationControls: false`
- Adds `docs/LOCAL_DASHBOARD_REPORT_EXPORT_MODELS.md`
- Adds Phase 28 report-model regression and safety tests
- No file export implementation, no file writes, no browser downloads, no persistence, no live data, no wallets, no execution/trading, no external network

## Features (Phase 26 — adds to Phase 25)

- Adds `apps/dashboard/src/state/` local interaction-state layer:
  - deterministic default state builders
  - pure reducer-style update helpers
  - safe reset helpers
  - filter input sanitization/validation
  - evidence/safety filter and sort helpers
  - pure selectors combining Phase 24 view models with Phase 25 shell rendering
- Adds in-memory-only dashboard interaction capabilities:
  - `dashboardInteractionState: true`
  - `localDashboardFilters: true`
  - `inMemoryDashboardState: true`
  - `deterministicDashboardState: true`
  - `dashboardPanelVisibility: true`
  - `dashboardFilterSelectors: true`
  - `dashboardPersistentState: false`
  - `dashboardExternalStateSync: false`
  - `dashboardLiveFilters: false`
- Adds `docs/LOCAL_DASHBOARD_INTERACTION_STATE.md`
- Adds Phase 26 tests with state, filters, selector, capability, and safety regression coverage
- No React/DOM. No browser storage/persistence. No live data. No Solana RPC. No provider APIs. No wallets. No execution/trading. No external network.

## Features (Phase 24 — adds to Phase 23)

- Adds `packages/dashboard-view-models` (`@sonic/dashboard-view-models`) as a local read-only dashboard data adapter and typed view-model layer
- Pure deterministic adapter helpers for Phase 22/23 envelopes:
  - `buildHealthViewModel`
  - `buildCapabilitiesViewModel`
  - `buildDashboardOverviewViewModel`
  - `buildEvidenceViewModel`
  - `buildSafetyViewModel`
  - `buildDashboardViewModel`
  - `adaptReadOnlyApiEnvelopeToViewModel`
  - `validateDashboardViewModel`
- Typed safe status models: `ready`, `empty`, `loading`, `error`, `unavailable`
- Deterministic empty/loading/error view-model builders for future UI consumers
- Preserves key contract metadata (`phase`, `method`, `endpoint`, `fixtureOnly`, `mutating`, `externalNetwork`, `generatedAt`, query/filter/sort/pagination where present)
- Extends `LocalReadOnlyApiCapabilities` with Phase 24 flags:
  - `dashboardDataAdapter: true`
  - `dashboardViewModels: true`
  - `fixtureBackedViewModels: true`
  - `uiReadyDataShapes: true`
  - `pureViewModelTransforms: true`
  - `dashboardUi: false`
  - `externalDashboardData: false`
- Adds `docs/LOCAL_READ_ONLY_DASHBOARD_VIEW_MODELS.md`
- Adds Phase 24 tests with deterministic adapter/safety coverage
- No UI, no React, no browser rendering, no live data, no Solana RPC, no provider APIs, no wallets, no execution, no trading, no external network access

## Features (Phase 22 — adds to Phase 21)

- Phase 22 adds a **standard JSON response contract layer** to all existing read-only GET endpoints
- `ReadOnlyApiSuccessEnvelope<T>` — standard success envelope: `ok: true`, `endpoint`, `method`, `data`, `meta`, `generatedAt`
- `ReadOnlyApiErrorEnvelope` — standard error envelope: `ok: false`, `error`, `meta`, `generatedAt`
- `ReadOnlyApiContractMeta` — deterministic meta: `phase: 22`, `apiMode: "local_read_only"`, `deterministic: true`, `mutating: false`, `externalNetwork: false`, `generatedAt: "2026-01-01T00:00:00.000Z"`
- 5 stable error codes: `READ_ONLY_API_INVALID_QUERY`, `READ_ONLY_API_UNSUPPORTED_ENDPOINT`, `READ_ONLY_API_METHOD_NOT_ALLOWED`, `READ_ONLY_API_SAFETY_REJECTION`, `READ_ONLY_API_INTERNAL_CONTRACT_ERROR`
- Field-level `ReadOnlyApiErrorDetail`: `field`, `reason`, sanitized `received` value — no stack traces, no filesystem paths, no secrets
- `buildReadOnlyApiSuccessEnvelope()`, `buildReadOnlyApiErrorEnvelope()`, `buildReadOnlyApiContractMeta()`, `buildReadOnlyApiQueryContractMeta()` — pure, deterministic envelope builders
- `sanitizeReceivedValue()` — redacts secrets, URLs, and truncates long values in error details
- 11 `PHASE_22_ENDPOINT_CONTRACTS` — per-endpoint descriptors with method, queryParams, supportsQuery
- `LocalReadOnlyApiCapabilities` extended: `canServeResponseEnvelopes: true`, `canReturnErrorEnvelopes: true`, `canValidateQueryErrors: true`, `canProvideDeterministicMetadata: true`, `canProvideEndpointContracts: true`
- All Phase 21 query/filter/sort/pagination metadata preserved in `meta` for queryable endpoints
- 446 new Phase 22 tests; **3751 total tests** (28 test files)

## Features (Phase 21 — adds to Phase 20)

- Phase 21 enhances `apps/read-only-api` with safe, deterministic, fixture-only query parsing, filtering, sorting, and pagination helpers
- `parseReadOnlyApiQuery(input)` — safe query parser; accepts unknown input; deterministic defaults; rejects unsafe text, URLs, secrets, action terms, arbitrary fields, SQL patterns
- `buildReadOnlyApiPagination(input)` — validates limit/offset/cursor; enforces max limit (100), default (25); rejects negatives, NaN, Infinity
- `applyReadOnlyApiFilters(items, query)` — in-memory enum-safe filtering by severity, panel, sourceKind, classification, status; does not mutate input arrays
- `applyReadOnlyApiSorting(items, query)` — in-memory sorting by explicit allowed fields only; does not mutate input arrays
- `applyReadOnlyApiPagination(items, pagination)` — safe limit/offset/cursor slicing; does not mutate input arrays
- `buildReadOnlyApiQueryResult(items, query)` — filter→sort→paginate pipeline with full safety metadata
- `LocalReadOnlyApiCapabilities` extended: `canFilterFixtureData: true`, `canPaginateFixtureData: true`, `canSortFixtureData: true`
- `GET /dashboard`, `GET /dashboard/evidence`, `GET /dashboard/safety` now accept optional query params
- Response `queryMeta` with pagination info (totalCount, resultCount, hasMore, nextCursor), applied filters, and sort metadata
- 255 new Phase 21 tests; **3305 total tests** (27 test files)

## Features (Phase 20 — adds to Phase 19)

- New `apps/read-only-api` — localhost-only (`127.0.0.1`), GET-only, fixture-only, read-only, analysis-only, non-executable Fastify API shell (no external bind, no live data, no Solana RPC, no provider APIs, no wallet, no private keys, no trading, no execution, no real trade intents, no execution plans, no orders, no swaps, no positions, no PnL, no transactions, no UI rendering, no database writes, no Telegram alerts, no external network use)
- **IMPORTANT: `LocalReadOnlyApi` is NOT a trading system, live data source, or UI** — it is a localhost-only Fastify API shell serving safe fixture/contract responses for local review only
- `LocalReadOnlyApiCapabilities` — all 19 unsafe flags permanently `false`; `canStartLocalhostServer: true` (127.0.0.1 only), `canServeReadOnlyContracts: true`, `canServeFixtureReadModels: true`; `fixtureOnly: true`, `analysisOnly: true`, `nonExecutable: true`, `readOnly: true`, `localOnly: true`
- `createReadOnlyApiConfig()` — enforces 127.0.0.1 host; rejects 0.0.0.0, ::, localhost, external hosts, URLs, RPC endpoints, unsafe ports
- `createReadOnlyApiApp()` — Fastify app factory; does NOT auto-listen; use inject() for tests
- `startReadOnlyApiServer()` — explicit-only server start; validates config safety before listen; 127.0.0.1-only
- 11 safe GET endpoints: `/health`, `/capabilities`, `/contracts`, `/contracts/openapi-shape`, `/dashboard`, `/dashboard/overview`, `/dashboard/replay`, `/dashboard/strategy`, `/dashboard/evaluation`, `/dashboard/evidence`, `/dashboard/safety`
- All responses include safety metadata: `fixtureOnly: true`, `liveData: false`, `safeToDisplay: true`, `analysisOnly: true`, `nonExecutable: true`, `readOnly: true`, `localOnly: true`
- `apps/read-only-api` depends on `@sonic/read-only-api-contracts` (Phase 19) and `@sonic/dashboard-read-models` (Phase 18)
- 233 new Phase 20 tests; **3050 total tests as of Phase 20** (26 test files)

- New `packages/read-only-api-contracts` — safe, fixture-only, read-only, analysis-only, non-executable, contract-only local API boundary contract models (no API server, no HTTP listener, no network port, no Fastify/Hono/tRPC/Express, no Solana SDK, no provider SDK, no network, no wallet, no private keys, no trading, no execution, no real trade intents, no execution plans, no evidence mutation, no UI rendering)
- **IMPORTANT: `ReadOnlyApiContracts` are NOT an API server, HTTP listener, UI, or trading system** — they are fixture-only, contract-only TypeScript models describing future API boundary contracts
- `ReadOnlyApiCapabilities` — all 21 unsafe flags permanently `false`; `fixtureOnly: true`, `analysisOnly: true`, `nonExecutable: true`, `readOnly: true`, `contractOnly: true`; `canStartHttpServer: false`, `canOpenNetworkPort: false`, `canUseApiFramework: false` permanently
- `buildReadOnlyApiEndpointContracts()` — 9 documentation-shaped endpoint contracts (health, capabilities, dashboard panels, evidence, safety); no router, no handler, no server
- `buildReadOnlyApiHealthContract()` — fixture-only health contract; no runtime checks
- `buildReadOnlyDashboardContract()` — shapes dashboard inputs into safe API contract model
- `buildReadOnlyEvidenceContract()` — shapes evidence inputs into safe API contract model
- `buildReadOnlySafetyContract()` — locked capabilities summary; includes HTTP server/port/framework locks
- `buildReadOnlyApiContractBundle()` — combines all contracts into one safe bundle
- `exportReadOnlyApiContractOpenApiShape()` — deterministic OpenAPI-like documentation shape; future only, no live server
- `validateReadOnlyApiContractBundle()` — validates all safety invariants; rejects unsafe text, secrets, URLs, server patterns, unsafe capability flags
- 6 deterministic synthetic fixtures: CLEAN, DEGRADED, FAILED, INCONCLUSIVE, MIXED, REGRESSION
- 226 new tests in `tests/phase19.test.ts` — **2817 passing** (25 test files)
- **Fixture-only, analysis-only, non-executable, read-only, contract-only** — cannot start HTTP server, cannot open port, cannot use API framework, cannot trade, cannot execute
- See [docs/READ_ONLY_API_CONTRACTS.md](./docs/READ_ONLY_API_CONTRACTS.md) for full details

## Features (Phase 18 — adds to Phase 17)

- New `packages/dashboard-read-models` — safe, fixture-only, read-only, analysis-only, non-executable dashboard read model layer above Evidence Ledger (no Solana SDK, no provider SDK, no network, no wallet, no private keys, no trading, no execution, no real trade intents, no execution plans, no evidence mutation, no UI rendering)
- **IMPORTANT: `DashboardReadModels` are NOT a trading system** — they are fixture-only, read-only data-shaping objects for future UI review only
- `DashboardReadModelCapabilities` — all 18 unsafe flags permanently `false`; `fixtureOnly: true`, `analysisOnly: true`, `nonExecutable: true`, `readOnly: true`; `canRenderUi: false` permanently
- `DashboardOverviewModel` — safe summary with totalFindings, severityCounts, panelsAvailable, safetyStatus
- `DashboardReplayPanelModel` — shapes Replay Lab / Replay Reporting fixture evidence into read-only panel
- `DashboardStrategyPanelModel` — shapes Strategy Intent fixture evidence into read-only panel
- `DashboardEvaluationPanelModel` — shapes Strategy Evaluation fixture evidence into read-only panel
- `DashboardEvidencePanelModel` — shapes Evidence Ledger / Decision Trace fixture evidence into read-only panel
- `DashboardSafetyPanelModel` — summarises all 18 locked capabilities; `safetyInvariantsSatisfied: true` permanently
- `buildDashboardReadModelBundle()` — combines all 5 panels + overview into one safe bundle
- `validateDashboardReadModelBundle()` — validates all safety invariants; rejects unsafe text, secrets, URLs, unsafe capability flags
- 6 deterministic synthetic fixtures: CLEAN, DEGRADED, FAILED, INCONCLUSIVE, MIXED, REGRESSION
- 270 new tests in `tests/phase18.test.ts` — **2591 passing** (24 test files)
- **Fixture-only, analysis-only, non-executable, read-only** — cannot render UI, cannot trade, cannot execute
- See [docs/DASHBOARD_READ_MODELS.md](./docs/DASHBOARD_READ_MODELS.md) for full details

## Features (Phase 17 — adds to Phase 16)

- New `packages/evidence-ledger` — safe, fixture-only, append-only, analysis-only, non-executable Evidence Ledger and Decision Trace layer above Strategy Evaluation (no Solana SDK, no provider SDK, no network, no wallet, no private keys, no trading, no execution, no real trade intents, no execution plans, no evidence mutation)
- **IMPORTANT: `EvidenceLedger` is NOT a trading ledger** — it is a fixture-only, append-only, audit-style reasoning record for human review
- `EvidenceLedgerCapabilities` — all 17 unsafe flags permanently `false`; `fixtureOnly: true`, `analysisOnly: true`, `nonExecutable: true`, `appendOnly: true`; `canMutatePriorEvidence: false` permanently
- `EvidenceSourceReference` — safe deterministic reference to prior-phase outputs; no raw URLs, no private data
- `EvidenceEntry` — single audit-style evidence record with kind, severity, title, summary, reasons
- `DecisionTrace` — safe trace of reasoning steps derived from evidence entries; auto-derives classification
- `DecisionTraceSummary` — aggregate statistics across a trace
- `checkEvidenceIntegrity()` — detects duplicate IDs, unsafe text, liveData violations, secret/URL patterns, mutation capability markers
- `buildEvidenceLedger()` — builds safe ledger from traces and entries with integrated integrity check
- `validateEvidenceLedger()` — validates all safety invariants; rejects unsafe text, secrets, URLs, appendOnly violations
- 6 deterministic synthetic fixtures: CLEAN, DEGRADED, FAILED, INCONCLUSIVE, MIXED, REGRESSION
- 195 new tests in `tests/phase17.test.ts` — **2321 passing** (23 test files)
- **Fixture-only, analysis-only, non-executable, append-only** — prior evidence cannot be mutated
- See [docs/EVIDENCE_LEDGER.md](./docs/EVIDENCE_LEDGER.md) for full details

## Features (Phase 15 — adds to Phase 14)

- New `packages/strategy-intent` — fixture-only, analysis-only, non-executable strategy intent model layer above Replay Lab and Replay Reporting (no Solana SDK, no provider SDK, no network, no wallet, no private keys, no trading, no execution, no real trade intents, no execution plans)
- **IMPORTANT: `StrategyIntent` is NOT a real trade intent** — it is an internal analysis model only for human review
- `StrategyIntentCapabilities` — all 13 unsafe flags permanently `false`; `fixtureOnly: true`, `analysisOnly: true`, `nonExecutable: true`
- `StrategyFamily` — 7 analysis-only family classification labels (no buy/sell/execute wording)
- `StrategyEvidenceQuality` — 6 fixture evidence quality levels: strong/moderate/weak/degraded/failed/inconclusive
- `StrategyIntentClassification` — 5 non-actionable analysis labels: `reject`, `watch_only`, `analysis_only`, `insufficient_evidence`, `fixture_only`
- `buildStrategySafetyGates()` — 9 analysis-only safety gates (none trigger actions)
- `buildStrategyIntentRationale()` — non-actionable rationale with evidence, safety, limitation, and review notes
- `buildStrategyIntent()` — full fixture-only intent builder; rejects liveData=true and fixtureOnly=false
- `validateStrategyIntent()` — validates all safety invariants; rejects unsafe text, secrets, URLs
- 6 deterministic synthetic fixtures: CLEAN, DEGRADED_CREATOR, DEGRADED_WALLET, FAILED_MANIPULATION, INCONCLUSIVE, REGRESSION
- 206 new tests in `tests/phase15.test.ts` — **1956 passing** (21 test files)
- **Analysis-only, non-executable** — StrategyIntent outputs never recommend or enable trading
- See [docs/STRATEGY_INTENT.md](./docs/STRATEGY_INTENT.md) for full details

## Features (Phase 14 — adds to Phase 13)

- New `packages/replay-reporting` — read-only, fixture-only, analysis-only reporting and diagnostics layer on top of Phase 13 Replay Lab (no Solana SDK, no provider SDK, no network, no wallet, no private keys, no trading, no execution)
- `ReplayReportingCapabilities` — all 11 unsafe flags permanently `false`; `fixtureOnly: true`
- `buildScenarioIndex()` — deterministic scenario index with verdict distribution, step counts, and unique step types; rejects liveData=true, fixtureOnly=false, unsafe text
- `buildReplayRunReport()` — converts `ReplayRun` to `ReplayRunReport` with step-level detail, warning/failure/degraded/inconclusive counts
- `buildReplayComparisonReport()` — regression detection between baseline and candidate runs; adds diagnostic findings
- `buildReplayDiagnostics()` — structured diagnostic findings with severity counts (info/warning/risk/failure/inconclusive); no action-oriented severity names
- `exportReplayReportJson()` — deterministic JSON export with stable key ordering; validates all string content for safety
- `exportReplayReportMarkdown()` — safe Markdown export; mandatory safety footer on all outputs; no trading instructions
- 5 deterministic synthetic fixtures: CLEAN, DEGRADED, FAILED, INCONCLUSIVE, REGRESSION
- 150 new tests in `tests/phase14.test.ts` — **1750 passing** (20 test files)
- **Evidence-review only** — reports describe analysis outcomes only; no live data, no trade intents, no execution plans, no paper trading
- See [docs/REPLAY_REPORTING.md](./docs/REPLAY_REPORTING.md) for full details

## Features (Phase 13 — adds to Phase 11)

- New `packages/replay-lab` — local deterministic replay lab model layer (no Solana SDK, no provider SDK, no network, no wallet, no private keys, no trading, no execution)
- `ReplayVerdict` — 5 safe outcome values: `passed`, `failed`, `degraded`, `inconclusive`, `fixture_only` (no buy/sell/execute/trade/live wording)
- `ReplayLabCapabilities` — all 9 unsafe flags permanently `false`; `fixtureOnly: true`
- `ReplayStep`, `ReplayScenario`, `ReplayRun`, `ReplayComparison` — complete model types; all with `liveData: false`, `fixtureOnly: true`, `safeToDisplay: true`
- `buildReplayStepResult()` — deterministic step verdict engine (no fixtures → inconclusive; reject → failed; risky/risk → degraded; multi-warn → degraded; clean → fixture_only)
- `runReplayScenario()` — execute a full scenario, returning a validated `ReplayRun`
- `compareReplayRuns()` — regression comparison: score delta, confidence delta, verdict change detection
- `getReplayLabCapabilities()` — all-false capability guard
- 8 deterministic synthetic fixture scenarios: clean_token, risky_creator, wallet_cluster_risk, manipulation_reject, mixed_warning, missing_data, regression_baseline, regression_candidate
- 85 new tests in `tests/phase13.test.ts`
- **Fixture/local replay only** — no live data, no Solana RPC, no provider APIs, no trade intents, no execution plans, no paper trading
- See [docs/REPLAY_LAB.md](./docs/REPLAY_LAB.md) for full details

## Features (Phase 11 — adds to Phase 10)

- New `packages/manipulation-detector` — local bundle/manipulation detector layer (no Solana SDK, no provider SDK, no network, no wallet, no private keys, no enforcement)
- `BundleSignal` — local bundle/manipulation signal model; 9 `BundleSignalType` values; `fixtureOnly: true`, `liveData: false`
- `ManipulationPattern` — local manipulation pattern model; 9 `ManipulationPatternType` values; `fixtureOnly: true`, `liveData: false`
- `CoordinatedActivitySnapshot` — coordinated activity counts per token; `fixtureOnly: true`, `liveData: false`
- `BundleRiskScore`, `WashTradeScore`, `CoordinationScore`, `FundingPatternScore`, `CreatorLinkScore` — deterministic component scores (0–100)
- 17 `ManipulationRiskFlag` codes (LIKELY_BUNDLE_PATTERN, LIKELY_WASH_TRADE_PATTERN, COORDINATED_DUMP_PATTERN, placeholder flags, etc.)
- `ManipulationClassification` — 5 safe values: `reject`, `watch_only`, `analysis_only`, `insufficient_data`, `fixture_only` (no trade/copy wording)
- `ManipulationDetectorCapabilities` — all unsafe flags `false`: `canTrade`, `canExecute`, `canUseSolanaRpc`, `canUseProviderApis`, `canAccessPrivateKeys`, `canCreateTradeIntents`, `canCreateEnforcementActions`
- `ManipulationDetectionResult` — `actionAllowed/tradingAllowed/executionAllowed/enforcementAllowed` always `false`; `liveData: false`; `safeToDisplay: true`
- `buildManipulationDetectionResult()` — validates inputs, scores, classifies, returns safe result (never throws)
- 8 deterministic synthetic fixture groups: clean_activity, likely_bundle, possible_bundle, likely_wash_trade, coordinated_dump, creator_linked_manipulation, fresh_wallet_farm_manipulation, bot_noise
- 84 new tests in `tests/phase11.test.ts` — **1450 passing** (17 test files)
- **Fixture/local detection only** — no live bundle detection, no live wash-trade detection, no Solana RPC, no provider APIs, no enforcement actions, no trade intents
- See [docs/MANIPULATION_DETECTOR.md](./docs/MANIPULATION_DETECTOR.md) for full details

## Features (Phase 10 — adds to Phase 9)

- New `packages/wallet-intelligence` — local wallet cluster intelligence layer (no Solana SDK, no provider SDK, no network, no wallet, no private keys, no copy trading)
- `WalletProfile` — local-only wallet identity model; `fixtureOnly: true`, `liveData: false`; `walletAddress` is a public identifier model only
- `WalletCluster` — local wallet cluster model; 9 `WalletClusterType` values; `fixtureOnly: true`, `liveData: false`
- `WalletQualityScore`, `ClusterQualityScore`, `LeaderFollowerScore`, `FreshWalletRiskScore`, `FundingSourceScore` — deterministic component scores (0–100)
- 16 `WalletClusterRiskFlag` codes (INSUFFICIENT_WALLET_DATA, FAST_DUMPER_HISTORY, BOT_NOISE_SIGNALS, FRESH_WALLET_FARM_PLACEHOLDER, COORDINATED_SELL_PLACEHOLDER, placeholder flags, etc.)
- `WalletClusterClassification` — 5 safe values: `reject`, `watch_only`, `analysis_only`, `insufficient_data`, `fixture_only` (no trade/copy wording)
- `WalletIntelligenceCapabilities` — all unsafe flags `false`: `canTrade`, `canExecute`, `canCopyTrade`, `canUseSolanaRpc`, `canUseProviderApis`, `canAccessPrivateKeys`, `canCreateTradeIntents`
- `WalletClusterIntelligenceResult` — `actionAllowed/tradingAllowed/executionAllowed/copyTradingAllowed` always `false`; `liveData: false`; `safeToDisplay: true`
- `buildWalletClusterIntelligenceResult()` — validates inputs, scores, classifies, returns safe result (never throws)
- 7 deterministic synthetic fixture clusters: smart_accumulator, profitable_leader, fast_dumper, fresh_wallet_farm, same_funding_source, bot_noise, known_rug_cluster
- 62 new tests in `tests/phase10.test.ts` — **1366 passing** (16 test files)
- **Fixture/local scoring only** — no live data, no Solana RPC, no provider APIs, no wallet data, no trade actions, no copy trading
- See [docs/WALLET_INTELLIGENCE.md](./docs/WALLET_INTELLIGENCE.md) for full details

## Features (Phase 9 — adds to Phase 8)

- New `packages/creator-intelligence` — local creator intelligence layer (no Solana SDK, no provider SDK, no network, no wallet)
- `CreatorProfile` — local-only creator identity model; `fixtureOnly: true`, `liveData: false`; `creatorAddress` is a public identifier model only
- `CreatorLaunchHistorySnapshot` — local launch history metrics snapshot; `fixtureOnly: true`, `liveData: false`
- `CreatorSuccessScore`, `CreatorLaunchQualityScore`, `CreatorConsistencyScore`, `CreatorSuspiciousPatternScore` — deterministic component scores (0–100)
- 14 `CreatorRiskFlag` codes (INSUFFICIENT_CREATOR_DATA, HIGH_FAILURE_RATE, RUG_LIKE_HISTORY, placeholder flags, etc.)
- `CreatorClassification` — 5 safe values: `reject`, `watch_only`, `analysis_only`, `insufficient_data`, `fixture_only` (no trade wording)
- `CreatorIntelligenceCapabilities` — all unsafe flags `false`: `canTrade`, `canExecute`, `canUseSolanaRpc`, `canUseProviderApis`, `canUseWalletData`, `canCreateTradeIntents`
- `CreatorIntelligenceResult` — `actionAllowed/tradingAllowed/executionAllowed` always `false`; `liveData: false`; `safeToDisplay: true`
- `buildCreatorIntelligenceResult()` — validates inputs, scores, classifies, returns safe result (never throws)
- 6 deterministic synthetic fixtures: strong, new, fast_dump, repeated_metadata, suspicious_funding, rug_like
- 73 new tests in `tests/phase9.test.ts` — **1304 passing** (15 test files)
- **Fixture/local scoring only** — no live data, no Solana RPC, no provider APIs, no wallet data, no trade actions
- See [docs/CREATOR_INTELLIGENCE.md](./docs/CREATOR_INTELLIGENCE.md) for full details

## Features (Phase 8 — adds to Phase 7A/7B/7C/7D/7E)

- New `packages/token-intelligence` — local token intelligence layer (no Solana SDK, no provider SDK, no network, no wallet)
- `TokenProfile` — local-only token identity model; boolean social/image presence; `fixtureOnly: true`, `liveData: false`
- `TokenMetricSnapshot` — local quantitative metrics snapshot; `fixtureOnly: true`, `liveData: false`
- `MetadataQualityScore`, `CurveQualityScore`, `HolderConcentrationScore`, `LiquidityQualityScore`, `OrganicMomentumScore` — deterministic component scores (0–100)
- 13 `TokenRiskFlag` codes (MISSING_METADATA, HIGH_TOP_HOLDER_CONCENTRATION, LOW_LIQUIDITY, SELL_PRESSURE_HIGH, CURVE_TOO_EARLY/ADVANCED, placeholder flags, etc.)
- `TokenClassification` — 5 safe values: `reject`, `watch_only`, `analysis_only`, `insufficient_data`, `fixture_only` (no trade wording)
- `TokenIntelligenceCapabilities` — all unsafe flags `false`: `canTrade`, `canExecute`, `canUseSolanaRpc`, `canUseProviderApis`, etc.
- `TokenIntelligenceResult` — `actionAllowed/tradingAllowed/executionAllowed` always `false`; `liveData: false`; `safeToDisplay: true`
- `buildTokenIntelligenceResult()` — validates inputs, scores, classifies, returns safe result (never throws)
- 5 deterministic synthetic fixtures: good, missing_metadata, concentrated_holder, low_liquidity, high_sell_pressure
- `PHASE_8_TOKEN_INTELLIGENCE_STATUS` (in `@sonic/state`) — static safe status snapshot
- 83 new tests in `tests/phase8.test.ts` — **1231 passing** (14 test files)
- **Fixture/local scoring only** — no live data, no Solana RPC, no provider APIs, no trade actions

## Features (Phase 7E — adds to Phase 7A/7B/7C/7D)

- `EventEngineReadinessSnapshot` (in `@sonic/state`) — safe top-level snapshot; all live/network/execution fields always `'forbidden'`
- `ProviderReadinessSummary` (in `@sonic/state`) — safe provider readiness counts and overall state; no raw URLs/API keys
- `Phase8ReadinessGate` (in `@sonic/state`) — static Phase 8 Token Intelligence readiness checklist
- `buildEventEngineReadinessSnapshot()` — builds complete snapshot using Phase 7D provider readiness
- `buildPhase8ReadinessGate()` — evaluates Phase 8 readiness; `readyForTokenIntelligence: true` only when all local foundations and safety conditions hold
- `PHASE_7E_EVENT_ENGINE_SUMMARY` — static constant safe for `/system` output
- `EVENT_ENGINE_READINESS_CODES` — 6 safe error/readiness codes
- Telegram `/system engine` — Event Engine local-only status and provider readiness summary
- Telegram `/system phase8` — Phase 8 Token Intelligence readiness gate
- 107 new tests in `tests/phase7e.test.ts` — **1148 passing** (13 test files)
- **Phase 8 readiness means ready to build Token Intelligence models locally only** — NOT live data, trading, or execution

## Features (Phase 7D — adds to Phase 7A/7B/7C)

- `ProviderConfigMode` — `disabled`, `mock_only`, `future_live_not_available`
- `ProviderConfigInput` — raw input shape; all unsafe live/network/API-key flags are captured, never honoured
- `ProviderConfigSafe` — validated safe config; all permissions always `false`; raw URLs/API keys never stored
- `ProviderConfigErrorCode` — 9 safe error codes for validation failures
- `validateProviderConfig()` — fail-closed validation; unsafe attempts produce `unsafeRequested=true` + reasons
- `createDisabledProviderConfig()` — creates a named disabled safe config for any provider type
- `ProviderReadiness` — `disabled_safe`, `mock_only_ready`, `unsafe_requested`, `unavailable`, `unknown`
- `ProviderReadinessEntry` — per-provider entry; `canConnect`/`canEmitLiveEvents`/`canTriggerExecution` always `false`
- `ProviderReadinessReport` — aggregated readiness report; counts all 0 for safe Phase 7D state
- `evaluateProviderReadiness()` — derives readiness from safe config
- `buildProviderReadinessReport()` — generates report with safe-to-display notes
- `assertAllProvidersSafe()` — throws safe error if any provider requested unsafe permissions
- `PHASE_7D_READINESS_SUMMARY` — static summary constant safe for `/system` output
- 81 new tests in `tests/phase7d.test.ts` — 1041+ passing

## Features (Phase 7B — adds to Phase 7A)

- Disabled read-only provider boundaries (`packages/event-engine`) — defines where future event providers could plug in
- `EventProviderType` — 6 disabled provider types (helius_disabled, websocket_disabled, yellowstone_disabled, polling_disabled, mock_disabled, unknown_disabled)
- `EventProviderStatus` — disabled / unavailable / unsupported / mock_only / future_not_available
- `EventProviderConfig` — all 8 live/network/execution permission fields permanently `false`
- `EventProviderCapabilities` — all 12 capability flags permanently `false` (including hasRuntimeDependency, canUseNetwork, canUseSolanaRpc, canUseWebSocket, canUseYellowstone, canUseGeyser, canEmitLiveEvents, canTriggerExecution, canAccessWallets, canAccessPrivateKeys)
- `ProviderErrorCode` — 13 safe error codes (PROVIDER_DISABLED, SOLANA_RPC_FORBIDDEN, WEBSOCKET_FORBIDDEN, etc.)
- `EventProviderBoundary` interface + `DisabledEventProvider` — always disabled; lifecycle methods return safe forbidden results
- `createDisabledEventProvider` factory — fail-closed; all unsafe enable/live/network attempts coerced to disabled
- Named helpers: `createDisabledHeliusProvider`, `createDisabledWebSocketProvider`, `createDisabledYellowstoneProvider`, `createDisabledPollingProvider`
- `EventProviderRegistry` — registry of disabled providers; all entries disabled; no provider startup
- 195 new tests in `tests/phase7b.test.ts` — 862 total, all passing

## Features (Phase 7C — adds to Phase 7A)

- `mock_provider` added to `EventSourceType` — valid source for mock/fixture events
- `EventProviderType` — 6 disabled provider boundaries (Phase 7B): helius_disabled, websocket_disabled, yellowstone_disabled, quicknode_disabled, triton_disabled, alchemy_disabled
- `EventProviderCapabilities` — 12 capability flags all false for disabled providers
- `createDisabledEventProvider()` — fail-closed factory; connect/disconnect always return LIVE_PROVIDER_FORBIDDEN
- `buildDisabledProviderRegistry()` — registry of all 6 disabled provider boundaries
- `MockProviderStatus` — idle / loaded / replaying / completed / failed / stopped
- `MockProviderCapabilities` — 12 flags; only `canReplayFixtureEvents: true`, all others false
- `createControlledMockProvider()` — stateful mock provider for deterministic local replay
- `FixtureEvent` — fixture wrapper with `mock: true`, `replay: true`, `live: false`, `offsetMs`
- `validateFixtureEvent()` — validates ID, flags, offset bounds, envelope validity
- Built-in synthetic fixtures: `FIXTURE_SYSTEM_STARTUP`, `FIXTURE_PUMP_ADAPTER_STATUS`, `FIXTURE_FUTURE_CHAIN_PLACEHOLDER`, `FIXTURE_SAFETY_EVENT`
- `FixtureSequence` — ordered sequence of fixtures; max 1,000 events; optional `maxReplayEvents` cap
- `buildFixtureSequence()` — sorts by `offsetMs`, validates, returns safe result
- `BUILTIN_SEQUENCE_ALL` — pre-built sequence of all 4 built-in fixtures
- `replayFixtureSequence()` — stateless deterministic synchronous replay into `InMemoryEventBus`
- `ReplayStats` — eventsPlanned, eventsPublished, eventsRejected, startedAt, completedAt, status
- 11 new Phase 7C error codes (INVALID_FIXTURE_ID, FIXTURE_SEQUENCE_TOO_LARGE, LIVE_EVENT_FORBIDDEN, etc.)
- 98 new tests in `tests/phase7c.test.ts` — 765 total, all passing

## Features (Phase 7A — event engine core)

- New `packages/event-engine` package — local-only, no network dependencies
- `EventEnvelope` — canonical event container with safe payload, safeToPersist, safeToDisplay
- `EventCategory` — system, config, mode, safety, audit, pump_adapter, future_chain (placeholder), future_market (placeholder), unknown
- `EventSourceType` — internal, worker, telegram, audit_repository, state_service, pump_adapter_mock, mock_provider, future_provider_disabled
- `EventSeverity` — debug, info, warn, error, critical
- `EventSourceCapabilities` — all 5 network/execution/wallet flags permanently `false`
- `IEventBus` interface + `InMemoryEventBus` implementation — bounded history (default 1000), handler failure isolation, idempotent unsubscribe
- `DedupeStore` — in-memory TTL deduplication with clock injection for deterministic tests
- `validateEventEnvelope` — full structural and safety validation (rejects functions, class instances, circular refs, raw Errors)
- `EventEngineResult<T>` — safe result/error type with 28 error codes; all errors `safeToDisplay: true`
- `buildEventEngineSystemStatus` — reports liveProviders:disabled, networkEvents:forbidden, executionTriggers:forbidden, solanaRpc:forbidden
- PHASE constant updated to 7

## Features (Phase 6C — adds to Phase 6A/6B)

- Disabled Pump SDK wrapper boundary (`packages/pump-adapter`) — defines where a future Pump SDK could plug in
- `PumpSdkWrapperMode` type: disabled / mock / future_live_not_available
- `PumpSdkWrapperStatus` type: disabled / unavailable / unsupported / mock_only
- `PumpSdkWrapperConfig` — all live/executable permission fields permanently false
- `PumpSdkWrapperCapabilities` — 12 capability flags, all permanently false (including hasPumpSdkRuntime, hasSolanaSdkRuntime)
- `PumpSdkWrapperErrorCode` — 11 safe error codes (SDK_WRAPPER_DISABLED, LIVE_RPC_FORBIDDEN, etc.)
- `PumpSdkWrapper` interface — getStatus, getCapabilities, getConfig, assertDisabled, explainDisabledReason, boundary placeholders for future live methods (all return forbidden results)
- `DisabledPumpSdkWrapper` — the only implementation; always returns disabled/forbidden results; never imports SDK
- `createPumpSdkWrapper` factory — always returns disabled wrapper; unsafe enable/live/executable attempts are coerced to disabled (fail-closed)
- 73 new tests in `tests/phase6c.test.ts` — 548 total, all passing

## Features (Phase 6B — adds to Phase 6A)

- Instruction intent models: `PumpInstructionIntent` (local planning model, not executable)
- Transaction plan placeholder models: `PumpTransactionPlan` (local placeholder, not a transaction)
- Builder request/result types: `PumpInstructionBuilderRequest`, `PumpInstructionBuilderResult`
- Warning codes: MODEL_ONLY, EXECUTION_FORBIDDEN, SIGNING_FORBIDDEN, SENDING_FORBIDDEN, LIVE_RPC_FORBIDDEN, REAL_INSTRUCTIONS_FORBIDDEN
- Error codes: 12 forbidden-operation codes (INSTRUCTION_BUILDING_FORBIDDEN, EXECUTABLE_INSTRUCTIONS_FORBIDDEN, etc.)
- Phase 6B safety capability guard: `PHASE_6B_BUILDER_CAPABILITIES` — all 12 prohibited capabilities permanently false
- Mock instruction builder: `MockInstructionBuilder`, `createMockInstructionBuilder`
- Input validation helpers: allowExecutableInstructions guard, quote success, venue allow-list, positive amounts, slippage bounds

## Features (Phase 6A)

- Pump adapter boundary package (`packages/pump-adapter`) — pure TypeScript models, inert
- Venue types: `PumpVenueType` (pump_curve, pumpswap, unknown, unsupported)
- Adapter status types: `PumpAdapterStatus` (available, unavailable, disabled, unsupported)
- Safe quote request/result models: `PumpQuoteRequest`, `PumpBuyQuoteRequest`, `PumpSellQuoteRequest`, `PumpQuoteResult`
- Bonding curve state model: `BondingCurveState` (mock-safe, not fetched from chain)
- Safe error/result types: `PumpAdapterResult`, `PumpAdapterError`, all error codes
- Input validation helpers: validateTokenMint, validateInputAmount, validateSlippageBps, validateRequestedAt, validateQuoteRequest
- Safety capability guard: `PUMP_ADAPTER_CAPABILITIES` — all prohibited capabilities permanently false
- Mock adapter: `MockPumpAdapter`, `createDisabledMockAdapter`, `createAvailableMockAdapter`
- Safe read-only state/read-model layer (`packages/state`)
- `SystemStateSnapshot` — aggregated system state: phase, mode, readiness, DB, audit, worker, safety
- Readiness calculation: `ready` / `degraded` / `unsafe` / `unknown` with documented rules
- Audit read model: stats, last startup/heartbeat/unsafe-flags timestamps
- Config read model: safe summary (no raw tokens, DATABASE_URL, or credentials)
- Mode read model: current mode, locked modes, mode safety status
- Worker read model: health derived from heartbeat age
- Telegram `/system` command with subcommands: health, safety, audit, worker, config, help
- All `/system` output is secret-safe (no raw credentials, no detailsJson)
- SQLite + Drizzle ORM persistent audit log (`audit_events` table)
- Telegram bot, admin allowlist enforcement (fail-closed)
- Full command suite: `/start`, `/help`, `/status`, `/mode`, `/pause`, `/kill`, `/audit`, `/safety`, `/version`, `/system`
- `FULL_AUTO` and `LIMITED_LIVE` modes remain locked
- TypeScript pnpm monorepo with strict settings

## Safety Notice

- **NO LIVE TRADING**: All trading functionality is strictly disabled in Phases 6A/6B/6C/7A/7B/7C.
- **NO EXECUTION**: The system has no capability to send transactions to the Solana network.
- **NO WALLET / PRIVATE KEYS**: Private key handling, wallet loading, and transaction signing are NOT implemented.
- **NO SOLANA RPC**: No Solana RPC connections in any phase through 7C.
- **NO JITO / PUMP.FUN TRADING**: No Pump.fun buying/selling. No PumpSwap buying/selling. No Jito.
- **NO TRANSACTION BUILDING**: No real transaction instruction building or construction.
- **NO ACCOUNT METAS**: No AccountMeta objects are returned.
- **NO BINARY INSTRUCTION DATA**: No binary instruction data is returned.
- **NO SIMULATION**: No transaction simulation.
- **PUMP ADAPTER IS INERT**: `packages/pump-adapter` is model-only — no live RPC, no execution, no signing, no sending.
- **PUMP SDK WRAPPER IS DISABLED**: `DisabledPumpSdkWrapper` defines only the boundary where a future Pump SDK could plug in. No real Pump SDK runtime. No Solana SDK. All wrapper capabilities are false.
- **INSTRUCTION INTENTS ARE LOCAL MODELS ONLY**: `PumpInstructionIntent` is a planning model, not an executable instruction.
- **TRANSACTION PLANS ARE PLACEHOLDERS ONLY**: `PumpTransactionPlan` is a placeholder, not a Solana transaction.
- **EVENT ENGINE IS LOCAL ONLY**: `packages/event-engine` is in-memory infrastructure only — no network, no Solana RPC, no live providers, no execution triggers, no wallet access.
- **EVENT SOURCE CAPABILITIES ARE ALL FALSE**: All network/execution/wallet capability flags are permanently `false` for disabled and source providers.
- **MOCK PROVIDER IS FIXTURE-ONLY**: `ControlledMockProvider` can only replay synthetic fixture events locally — no live events, no network, no execution triggers.
- **DISABLED PROVIDERS ARE INERT**: All 6 Phase 7B disabled provider boundaries (Helius, WebSocket, Yellowstone, etc.) always return LIVE_PROVIDER_FORBIDDEN — no connections possible.
- **NO LIVE PROVIDERS**: No Helius, WebSocket, Yellowstone, Geyser, QuickNode, Triton, or Alchemy integration.
- **NO MARKET DATA INGESTION**: No live token launch detection or market data.
- **READ-ONLY FIRST**: The foundation is built for infrastructure only.
- **FULL_AUTO and LIMITED_LIVE remain locked**.

## Workspace packages

- `packages/shared` — constants, modes, types
- `packages/config` — environment schema and loader
- `packages/db` — SQLite/Drizzle persistent audit repository + in-memory fallback
- `packages/mode-manager` — mode state machine
- `packages/state` — safe read-only state/read-model layer (Phase 5)
- `packages/pump-adapter` — pump adapter interfaces and quote models (Phase 6A, inert)
- `packages/observability` — logger
- `packages/risk-engine` — risk checks
- `packages/testing` — shared test utilities
- `packages/strategy-evaluation` — fixture-only, analysis-only, non-executable strategy evaluation reports (Phase 16, inert)
- `packages/evidence-ledger` — safe, fixture-only, append-only, analysis-only, non-executable Evidence Ledger and Decision Trace layer (Phase 17, inert)
- `apps/telegram-bot` — Telegram control interface
- `apps/worker` — safe heartbeat loop

## Commands

```sh
pnpm test        # run tests (3751 passing as of Phase 22)
pnpm lint        # lint all packages
pnpm typecheck   # type check all packages
pnpm build       # build all packages
```

## Environment Variables (Phase 4 additions)

```
DATABASE_PATH=./data/sonic-solana-autotrader.sqlite  # local SQLite file (not a secret)
AUDIT_RETENTION_DAYS=30                              # 1–365, default 30
AUDIT_MAX_EVENTS=10000                               # 100–1000000, default 10000
AUDIT_ROTATION_ENABLED=true                          # default true
```
