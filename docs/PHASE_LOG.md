# Phase Log

## Phase 13 — Replay Lab v1

- New `packages/replay-lab` package: local deterministic replay lab model layer; no Solana SDK, no provider SDK, no network, no wallet, no trading, no execution
- `ReplayVerdict` — 5 safe replay outcome values: `passed`, `failed`, `degraded`, `inconclusive`, `fixture_only` (no buy/sell/execute/trade/live wording)
- `ReplayStepType` — 6 step types: `token_snapshot`, `creator_snapshot`, `wallet_cluster_snapshot`, `manipulation_snapshot`, `risk_assessment`, `aggregate_checkpoint`
- `ReplayErrorCode` — 13 safe error codes covering invalid models, forbidden live/provider/private-key/trade/execution access
- `ReplayLabCapabilities` — all 9 unsafe fields permanently `false`; `fixtureOnly: true`
- `ReplayStep` — single scenario step; `fixtureOnly: true`, `liveData: false`, `safeToDisplay` required
- `ReplayScenario` — ordered collection of steps with `expectedOutcome`; `liveData: false`
- `ReplayRun` — result of executing a scenario; `fixtureOnly: true`, `liveData: false`, `safeToDisplay: true`
- `ReplayComparison` — regression delta between two runs; `safeToDisplay: true`
- Summary types: `TokenReplaySummary`, `CreatorReplaySummary`, `WalletReplaySummary`, `ManipulationReplaySummary`, `RiskReplaySummary`, `ReplaySummary`
- `ReplayStepResult` — per-step outcome with optional summaries; `safeToDisplay: true`
- `RlResult<T>` — safe result/error type (never throws for normal validation errors)
- `rlOk`, `rlErr`, `isSafeErrorMessage` — error helpers; `isSafeErrorMessage` rejects messages with private keys, RPC URLs, API keys, secrets
- `validateVerdict`, `validateReplayStep`, `validateReplayScenario`, `validateReplayStepResult`, `validateReplayRun`, `validateReplayComparison` — structural validation
- `buildReplayStep`, `buildReplayScenario` — builders with built-in validation
- `buildReplayStepResult` — deterministic step verdict engine: no fixtures → inconclusive; reject fixtures → failed; risky/risk fixtures → degraded; warn multi-ref → degraded; clean → fixture_only
- `buildReplaySummary` — final verdict aggregation: failed > degraded > inconclusive > fixture_only/passed
- `runReplayScenario` — full scenario execution returning a validated `ReplayRun`
- `compareReplayRuns` — regression comparison: score delta, confidence delta, verdict change detection
- `getReplayLabCapabilities` — returns all-false capability guard
- 8 deterministic synthetic fixture scenarios + `ALL_REPLAY_FIXTURES` array
- Phase 13 test suite: 85 new tests (1600 total, all passing)
- No Solana RPC. No provider APIs. No live data. No wallet/private key handling. No trade intents. No execution plans. No paper trading. No trade execution.
- FULL_AUTO and LIMITED_LIVE remain locked
- No new Telegram trade commands

## Phase 11 — Bundle / Manipulation Detector v1

- New `packages/manipulation-detector` package (no Solana SDK, no provider SDK, no network, no wallet)
- `BundleSignal` — local bundle/manipulation signal model; `fixtureOnly: true`, `liveData: false`; 9 `BundleSignalType` values (same_slot_participation, same_funding_source, coordinated_entry, coordinated_exit, wash_trade_cycle, creator_linked_wallets, fresh_wallet_farm, bot_noise, unknown_fixture)
- `ManipulationPattern` — local manipulation pattern model; 9 `ManipulationPatternType` values (likely_bundle, possible_bundle, likely_wash_trade, possible_wash_trade, coordinated_dump, creator_linked_manipulation, fresh_wallet_farm_pattern, bot_noise_pattern, unknown_fixture)
- `CoordinatedActivitySnapshot` — coordinated activity counts per token; `fixtureOnly: true`, `liveData: false`
- `BundleRiskScore` — same-slot, same-funding, coordinated-entry, coordinated-exit penalties; 0–100
- `WashTradeScore` — wash-cycle penalty, repeated-counterparty placeholder, volume-symmetry placeholder; 0–100
- `CoordinationScore` — participant quality, coordination penalty, coordinated-dump penalty, bot-noise penalty; 0–100
- `FundingPatternScore` — diversity placeholder, same-funding penalty, suspicious-funding placeholder; 0–100
- `CreatorLinkScore` — creator-linked wallet penalty, creator-history placeholder, relationship-unknown penalty; 0–100
- `ManipulationRiskFlag` — 17 risk flag codes (INSUFFICIENT_MANIPULATION_DATA, SAME_SLOT_PARTICIPATION_PLACEHOLDER, SAME_FUNDING_SOURCE_PLACEHOLDER, COORDINATED_ENTRY_PLACEHOLDER, COORDINATED_EXIT_PLACEHOLDER, WASH_TRADE_CYCLE_PLACEHOLDER, CREATOR_LINKED_WALLETS_PLACEHOLDER, FRESH_WALLET_FARM_PLACEHOLDER, BOT_NOISE_PATTERN, LIKELY_BUNDLE_PATTERN, POSSIBLE_BUNDLE_PATTERN, LIKELY_WASH_TRADE_PATTERN, POSSIBLE_WASH_TRADE_PATTERN, COORDINATED_DUMP_PATTERN, LIVE_DATA_UNAVAILABLE, WALLET_CLUSTER_CONTEXT_UNKNOWN, CREATOR_CONTEXT_UNKNOWN)
- `ManipulationClassification` — 5 safe values: reject, watch_only, analysis_only, insufficient_data, fixture_only (no trade/copy wording)
- `ManipulationDetectorCapabilities` — all unsafe fields false; `canTrade/canExecute/canUseSolanaRpc/canUseProviderApis/canAccessPrivateKeys/canCreateTradeIntents/canCreateEnforcementActions` all false; `fixtureOnly: true`
- `ManipulationDetectionResult` — complete result; `actionAllowed/tradingAllowed/executionAllowed/enforcementAllowed` always false; `liveData: false`; `safeToDisplay: true`
- `buildManipulationDetectionResult()` — validates inputs, scores, classifies, builds result; returns safe MdResult (never throws)
- `buildManipulationRiskFlags()` — deterministic risk flag generation from signals + patterns + activity
- `classifyManipulation()` — safe classification; critical flags → reject; likely bundle/wash/dump → reject; insufficient data → insufficient_data
- `getManipulationDetectorCapabilities()` — static safety capabilities (all unsafe false)
- `validateBundleSignal()`, `validateManipulationPattern()`, `validateCoordinatedActivity()`, `validateSignalId()`, `validatePatternId()`, `validateTokenMint()` — structural validation, no Solana SDK
- `MdResult<T>`, `mdOk()`, `mdErr()` — safe result type (no throws for normal validation failures)
- 8 deterministic synthetic fixture groups: clean_activity, likely_bundle, possible_bundle, likely_wash_trade, coordinated_dump, creator_linked_manipulation, fresh_wallet_farm_manipulation, bot_noise
- Severe fixtures (likely bundle/wash/dump) classify as reject; clean fixture classifies as analysis_only
- All fixture token mints begin with FIXTURE_; all wallet IDs begin with fixture_; no real addresses
- Phase 11 test suite: 84 new tests (1450 total, all passing)
- docs/MANIPULATION_DETECTOR.md added
- No live bundle detector. No live wash-trade detector. No providers. No Solana RPC. No Helius/WebSocket/Yellowstone. No live wallet/funding-source fetching. No enforcement actions. No trade intents. No transaction construction/signing/sending. No wallet/private key handling. No live trading. No Jito.
- FULL_AUTO and LIMITED_LIVE remain locked
- No new Telegram trade commands
- Next phase: Risk Engine v1 model layer (not execution)

## Phase 10 — Wallet Cluster Intelligence v1

- New `packages/wallet-intelligence` package (no Solana SDK, no provider SDK, no network, no wallet)
- `WalletProfile` — local-only wallet identity model; `fixtureOnly: true`, `liveData: false`; `walletAddress` is a public identifier model only (no wallet access, no signing, no private keys)
- `WalletCluster` — local wallet cluster model; 9 `WalletClusterType` values; `fixtureOnly: true`, `liveData: false`
- `WalletClusterHistoryMetrics` — local cluster history metrics snapshot
- `WalletQualityScore` — wallet age, hold time, entry/exit timing, profitability placeholder, dump/bot penalties; 0–100
- `ClusterQualityScore` — cluster type quality, representative wallet quality, coordination/creator-link penalties; 0–100
- `LeaderFollowerScore` — leader signal quality, follower noise/same-slot/coordinated-sell penalties; 0–100
- `FreshWalletRiskScore` — fresh-wallet/same-funding/low-age/farm penalties; 0–100 (higher = safer)
- `FundingSourceScore` — same-funding penalty, suspicious placeholder penalty, diversity quality; 0–100
- `WalletClusterRiskFlag` — 16 risk flag codes (INSUFFICIENT_WALLET_DATA, INSUFFICIENT_CLUSTER_DATA, LOW_WALLET_AGE, FAST_DUMPER_HISTORY, BOT_NOISE_SIGNALS, FRESH_WALLET_FARM_PLACEHOLDER, SAME_FUNDING_SOURCE_PLACEHOLDER, SAME_SLOT_COORDINATION_PLACEHOLDER, CREATOR_LINKED_WALLET_PLACEHOLDER, COORDINATED_SELL_PLACEHOLDER, LOW_HOLD_TIME, LOW_ENTRY_QUALITY, LOW_EXIT_QUALITY, LIVE_DATA_UNAVAILABLE, BUNDLE_RISK_UNKNOWN, CREATOR_RELATIONSHIP_UNKNOWN)
- `WalletClusterClassification` — 5 safe values: reject, watch_only, analysis_only, insufficient_data, fixture_only (no trade/copy wording)
- `WalletIntelligenceCapabilities` — all unsafe fields false; `canTrade/canExecute/canUseSolanaRpc/canUseProviderApis/canAccessPrivateKeys/canCreateTradeIntents/canCopyTrade` all false; `fixtureOnly: true`
- `WalletClusterIntelligenceResult` — complete result; `actionAllowed/tradingAllowed/executionAllowed/copyTradingAllowed` always false; `liveData: false`; `safeToDisplay: true`
- `buildWalletClusterIntelligenceResult()` — validates inputs, scores, classifies, builds result; returns safe WiResult (never throws)
- `scoreWalletClusterGroup()` — deterministic component scoring + confidence calculation
- `buildWalletClusterRiskFlags()` — deterministic risk flag generation from wallets + cluster
- `classifyWalletCluster()` — safe classification; critical flags → reject; insufficient data → insufficient_data
- `getWalletIntelligenceCapabilities()` — static safety capabilities (all unsafe false)
- `validateWalletProfile()`, `validateWalletCluster()`, `validateWalletId()`, `validateWalletAddress()`, `validateClusterId()` — structural validation, no Solana SDK
- `WiResult<T>`, `wiOk()`, `wiErr()` — safe result type (no throws for normal validation failures)
- 7 fixture cluster pairs: smart_accumulator, profitable_leader, fast_dumper, fresh_wallet_farm, same_funding_source, bot_noise, known_rug_cluster
- All fixture addresses are synthetic — no real wallet addresses
- Phase 10 test suite: 62 new tests (1366 total, all passing)
- docs/WALLET_INTELLIGENCE.md added
- No live provider. No Solana RPC. No Helius/WebSocket/Yellowstone. No live wallet/funding-source fetching. No bundle detector (placeholder only). No creator-wallet graph (placeholder only). No market data ingestion. No wallet/private key handling. No transaction construction/signing/sending. No trade intents. No live trading. No copy trading. No Jito.
- FULL_AUTO and LIMITED_LIVE remain locked
- No new Telegram trade commands; no live wallet lookup command; no copy-trading command
- Next phase: Bundle/Manipulation Detector v1 model infrastructure



- New `packages/creator-intelligence` package (no Solana SDK, no provider SDK, no network, no wallet)
- `CreatorProfile` — local-only creator identity model; `fixtureOnly: true`, `liveData: false`; `creatorAddress` is a public identifier model only (no wallet access, no signing, no private keys)
- `CreatorLaunchHistorySnapshot` — local launch history metrics snapshot; `fixtureOnly: true`, `liveData: false`
- `CreatorSuccessScore` — launch count quality, migration rate quality, peak quality, failure penalty; 0–100
- `CreatorLaunchQualityScore` — holder quality, liquidity quality, metadata/momentum placeholders; 0–100
- `CreatorConsistencyScore` — repeatability quality, positive history consistency, negative history penalty; 0–100
- `CreatorSuspiciousPatternScore` — suspicious funding/metadata/bundle/rug/dump penalties; 0–100 where **higher = safer**
- `CreatorRiskFlag` — 14 risk flag codes (INSUFFICIENT_CREATOR_DATA, LOW_LAUNCH_COUNT, HIGH_FAILURE_RATE, LOW_MIGRATION_RATE, FAST_DUMP_HISTORY, LOW_HOLDER_QUALITY, LOW_LIQUIDITY_QUALITY, SUSPICIOUS_FUNDING_PLACEHOLDER, REPEATED_METADATA_PLACEHOLDER, BUNDLE_ABUSE_PLACEHOLDER, RUG_LIKE_HISTORY, LIVE_DATA_UNAVAILABLE, WALLET_CLUSTER_UNKNOWN, BUNDLE_RISK_UNKNOWN)
- `CreatorClassification` — 5 safe values: reject, watch_only, analysis_only, insufficient_data, fixture_only (no trade wording)
- `CreatorIntelligenceCapabilities` — all unsafe fields false; `canTrade/canExecute/canUseSolanaRpc/canUseProviderApis/canUseWalletData/canCreateTradeIntents` all false; `fixtureOnly: true`
- `CreatorIntelligenceResult` — complete result; `actionAllowed/tradingAllowed/executionAllowed` always false; `liveData: false`; `safeToDisplay: true`
- `buildCreatorIntelligenceResult()` — validates inputs, scores, classifies, builds result; returns safe CiResult (never throws)
- `scoreCreatorProfile()` — deterministic component scoring + confidence calculation
- `buildCreatorRiskFlags()` — deterministic risk flag generation from profile + history
- `classifyCreator()` — safe classification; critical flags → reject; insufficient data → insufficient_data
- `getCreatorIntelligenceCapabilities()` — static safety capabilities (all unsafe false)
- `validateCreatorProfile()`, `validateCreatorHistory()`, `validateCreatorId()`, `validateCreatorAddress()` — structural validation, no Solana SDK
- `CiResult<T>`, `ciOk()`, `ciErr()` — safe result type (no throws for normal validation failures)
- 6 fixture creator pairs: strong, new, fast_dump, repeated_metadata, suspicious_funding, rug_like
- All fixture addresses are synthetic — no real wallet addresses
- Phase 9 test suite: 73 new tests (1304 total, all passing)
- docs/CREATOR_INTELLIGENCE.md added
- No live provider. No Solana RPC. No Helius/WebSocket/Yellowstone. No live creator/wallet/funding-source fetching. No wallet cluster intelligence (placeholder only). No bundle detector (placeholder only). No market data ingestion. No wallet/private key handling. No transaction construction/signing/sending. No trade intents. No live trading. No Jito.
- FULL_AUTO and LIMITED_LIVE remain locked
- No new Telegram trade commands; no live creator lookup command
- Next phase: Wallet Cluster Intelligence v1 or Bundle/Manipulation Placeholder Models

## Phase 8 — Token Intelligence v1

- New `packages/token-intelligence` package (no Solana SDK, no provider SDK, no network, no wallet)
- `TokenProfile` — local-only token identity model; boolean social/image presence (no raw URLs); `fixtureOnly: true`, `liveData: false`
- `TokenMetricSnapshot` — local quantitative metrics snapshot; `fixtureOnly: true`, `liveData: false`
- `MetadataQualityScore` — metadata completeness, name/symbol quality, image/social presence; 0–100
- `CurveQualityScore` — curve progress quality, reserve quality, too-early/too-late penalty; 0–100
- `HolderConcentrationScore` — top-holder penalty, holder count quality, concentration risk; 0–100
- `LiquidityQualityScore` — virtual liquidity and reserve quality; 0–100
- `OrganicMomentumScore` — buy/sell balance, unique buyer quality, volume trend; 0–100
- `TokenRiskFlag` — 13 risk flag codes (MISSING_METADATA, HIGH_TOP_HOLDER_CONCENTRATION, LOW_LIQUIDITY, SELL_PRESSURE_HIGH, CURVE_TOO_EARLY/ADVANCED, placeholder flags, etc.)
- `TokenClassification` — 5 safe values: reject, watch_only, analysis_only, insufficient_data, fixture_only (no trade wording)
- `TokenIntelligenceCapabilities` — all unsafe fields false; `canTrade/canExecute/canUseSolanaRpc/canUseProviderApis` all false; `fixtureOnly: true`
- `TokenIntelligenceResult` — complete result; `actionAllowed/tradingAllowed/executionAllowed` always false; `liveData: false`; `safeToDisplay: true`
- `buildTokenIntelligenceResult()` — validates inputs, scores, classifies, builds result; returns safe TiResult (never throws)
- `scoreTokenProfile()` — deterministic component scoring + confidence calculation
- `buildTokenRiskFlags()` — deterministic risk flag generation from profile + metrics
- `classifyToken()` — safe classification; critical flags → reject; low confidence → insufficient_data
- `getTokenIntelligenceCapabilities()` — returns static capabilities object (all unsafe false)
- 5 deterministic synthetic fixture profiles: good, missing_metadata, concentrated_holder, low_liquidity, high_sell_pressure
- Validation helpers: `validateTokenProfile`, `validateTokenMetrics`, `validateTokenMint`, `validateScoreBounds`, `validateConfidenceBounds`
- Error codes: INVALID_TOKEN_PROFILE, INVALID_TOKEN_METRICS, INVALID_TOKEN_MINT, LIVE_DATA_FORBIDDEN, TOKEN_INTELLIGENCE_FIXTURE_ONLY, TOKEN_SCORE_OUT_OF_RANGE, TOKEN_CONFIDENCE_OUT_OF_RANGE, UNSAFE_TOKEN_OUTPUT, PROVIDER_DATA_FORBIDDEN
- `@sonic/state` extended with `TokenIntelligenceStatusSnapshot`, `PHASE_8_TOKEN_INTELLIGENCE_STATUS`, `buildTokenIntelligenceStatusSnapshot()` (static, safe, no import of token-intelligence package)
- docs/TOKEN_INTELLIGENCE.md added
- Phase 8 test suite: 83 new tests (1231 total passing, 14 test files)
- No live providers. No network access. No Solana RPC. No WebSocket. No API key usage. No wallet. No signing. No sending. No execution. No Jito.
- FULL_AUTO and LIMITED_LIVE remain locked
- Token Intelligence outputs are analysis-only; no classification implies permission to trade
- Next phase: Phase 9 may add creator/wallet/bundle intelligence or controlled read-only ingestion — not execution

## Phase 7E — Event Engine Final Gate + Provider Readiness Surface

- Extends `packages/state` with a Phase 7E Event Engine readiness read model
- `EventEngineReadinessSnapshot` — safe top-level snapshot of Event Engine state; all live/network/execution fields are 'forbidden'
- `ProviderReadinessSummary` — safe summary of provider readiness counts and state (no raw URLs/API keys)
- `Phase8ReadinessGate` — static Phase 8 readiness checklist; readyForTokenIntelligence is true only when all Phase 0–7 local foundations are represented and all safety conditions hold
- `buildEventEngineReadinessSnapshot()` — builds complete snapshot using Phase 7D provider readiness report
- `buildProviderReadinessSummary()` — derives safe summary from ProviderReadinessReport
- `buildPhase8ReadinessGate()` — evaluates Phase 8 readiness gate from provider summary + lock flags
- `PHASE_7E_EVENT_ENGINE_SUMMARY` — static constant safe for /system output
- `EVENT_ENGINE_READINESS_CODES` — 6 safe error/readiness codes
- `PHASE_8_REQUIRED_FOUNDATIONS` — 9 required Phase 0–7E local foundations
- `PHASE_8_REQUIRED_SAFETY_CONDITIONS` — 9 required safety conditions
- Telegram `/system engine` — Event Engine readiness output (local-only status, provider summary, Phase 8 gate)
- Telegram `/system phase8` — Phase 8 Token Intelligence readiness gate output
- `PHASE_NAME` updated to 'Event Engine Final Gate + Provider Readiness Surface'
- Phase 7E test suite: 107 new tests (1148 total passing, 13 test files)
- No live providers. No network access. No Solana RPC. No WebSocket. No API key usage. No wallet. No signing. No sending. No execution. No Jito.
- FULL_AUTO and LIMITED_LIVE remain locked
- Phase 8 readiness means readiness for Token Intelligence model work only — NOT live data, trading, or execution
- Next phase: Phase 8 Token Intelligence v1

## Phase 7D - Disabled Provider Config + Readiness Checks
- Extends `packages/event-engine` (Phase 7A/7B/7C) with disabled provider configuration models and readiness checks
- `ProviderConfigMode` — disabled, mock_only, future_live_not_available
- `ProviderConfigInput` — raw input shape; unsafe flags captured, never honoured
- `ProviderConfigSafe` — validated safe config; all live/network/API-key permissions always false
- `ProviderConfigErrorCode` — 9 safe error codes (PROVIDER_CONFIG_DISABLED, _UNSAFE_REQUESTED, _NETWORK_FORBIDDEN, _SOLANA_RPC_FORBIDDEN, _WEBSOCKET_FORBIDDEN, _POLLING_FORBIDDEN, _STREAMING_FORBIDDEN, _LIVE_EVENTS_FORBIDDEN, _API_KEY_FORBIDDEN)
- `DEFAULT_PROVIDER_CONFIG_SAFE`, `PHASE_7D_PROVIDER_TYPES` — authoritative constants
- `validateProviderConfig()` — fail-closed: captures all unsafe flag attempts as unsafeRequested + reasons; raw URLs/API keys never stored
- `createDisabledProviderConfig()` — creates a named disabled safe config
- `ProviderReadiness` — disabled_safe, mock_only_ready, unsafe_requested, unavailable, unknown
- `ProviderReadinessEntry` — per-provider readiness; canConnect/canEmitLiveEvents/canTriggerExecution always false
- `ProviderReadinessReport` — aggregated report; enabledProviderCount/liveProviderCount/networkProviderCount always 0 for safe state
- `ProviderReadinessErrorCode` — PROVIDER_READINESS_UNSAFE, PROVIDER_READINESS_UNKNOWN
- `evaluateProviderReadiness()` — derives readiness from safe config; unsafe requests fail-closed to unsafe_requested
- `buildProviderReadinessEntry()` — builds per-provider entry with safe status strings
- `buildProviderReadinessReport()` — aggregates all providers; generates notes safe to display
- `assertAllProvidersSafe()` — throws safe error if any unsafe provider is present
- `PHASE_7D_READINESS_SUMMARY` — static summary constant safe for /system output
- Phase 7D test suite: 81 new tests (798 total passing, 3 pre-existing failures due to missing telegraf/drizzle-orm packages)
- No live providers. No network access. No Solana RPC. No WebSocket. No API key usage. No wallet. No signing. No sending. No execution. No Jito.
- FULL_AUTO and LIMITED_LIVE remain locked
- Phase 7E may add controlled read-only configuration or replay integration — still without execution


- pnpm workspaces TypeScript monorepo
- Strict TypeScript with NodeNext module resolution
- All execution paths blocked
- Telegram bot command shell
- 10 unit tests passing

## Phase 2 - Telegram Control Layer Hardening
- Admin allowlist enforced (fail-closed: empty list locks all control commands)
- Security fix: `isAdmin` returns `false` when admin list is empty
- Full command handlers: `/start`, `/help`, `/status`, `/mode`, `/pause`, `/kill`, `/audit`, `/safety`, `/version`
- Kill switch requires two-step inline keyboard confirmation
- All commands and callbacks fully audit logged
- Formatters extracted: status, help, safety, audit, version
- `FULL_AUTO` and `LIMITED_LIVE` locked at Phase 2 level
- vitest resolve aliases added for workspace packages
- Phase 2 test suite passing

## Phase 3 - Config, Modes, Secrets, and Safety Foundation Hardening
- PHASE constant updated to 3
- `RuntimeSafetyStatus` interface and `buildRuntimeSafetyStatus` function added to `@sonic/shared`
- Config schema expanded: `APP_VERSION`, `SAFETY_PROFILE`, 10 unsafe capability flags, 2 unlock flags
- `APP_MODE` limited to Phase 3 allowed modes at schema level — `LIMITED_LIVE` and `FULL_AUTO` rejected at parse time
- Unsafe flags default `false`; even if set `true`, capabilities remain disabled (fail-closed)
- `loadConfigWithResult` returns full result with `valid`, `unsafeFlagsDetected`, `unsafeFlags`, `warnings`
- `safeConfigSummary` provides redacted config summary safe to log
- `packages/config/src/redact.ts` replaced with comprehensive redaction (key patterns, value patterns, circular ref handling)
- `packages/config/src/provenance.ts` new — tracks field source (env vs default) with safe display
- `ModeManager.setMode` returns `TransitionResult` with `accepted`, `success`, `previousMode`, `resultingMode`, `lockedMode`, `error`, `rejectionReason`, `timestamp`
- Worker performs startup safety check — exits with code 1 if any invariant is violated
- `logSafetyStatus`, `logUnsafeFlagsDetected`, `logWorkerSafetyCheckPassed/Failed` added to observability
- Telegram `/status` and `/safety` commands include `RuntimeSafetyStatus` context
- Phase 3 test suite: 58 new tests covering config, redaction, provenance, safety status, mode manager, formatters
- All 119 tests passing

## Phase 4 - Database + Persistent Audit Logs
- SQLite + Drizzle ORM (`drizzle-orm@0.45.2`, `better-sqlite3@12.9.0`) persistent audit log
- `packages/db`: schema, client, migrate, `SqliteAuditRepository`, `InMemoryAuditLogger`, retention, types, exports
- `audit_events` table: id, timestamp, phase, event_type, severity, source, mode, message, details_json, safe_summary, created_at
- Indexes on: timestamp, event_type, severity, source, mode
- DB init idempotent — `CREATE TABLE IF NOT EXISTS`, `CREATE INDEX IF NOT EXISTS`
- Missing data directory created automatically on startup
- Worker fails closed if DB init fails (exits with code 1)
- Retention policy: `AUDIT_ROTATION_ENABLED`, `AUDIT_RETENTION_DAYS` (1–365), `AUDIT_MAX_EVENTS` (100–1,000,000)
- `applyRetention()` records `RETENTION_APPLIED` or `RETENTION_FAILED`; failure is warn, not fatal
- Worker boot sequence: load config → init DB → apply retention → init mode manager → safety check → persist startup events
- New config fields: `DATABASE_PATH`, `AUDIT_RETENTION_DAYS`, `AUDIT_MAX_EVENTS`, `AUDIT_ROTATION_ENABLED`
- `DATABASE_URL` and `TELEGRAM_BOT_TOKEN` raw values never persisted (new `SENSITIVE_KEY_EXACT` list in redact.ts)
- `details` and `safeSummary` redacted before DB insertion via `redactObject` / `redactString`
- Circular references in `details` are handled safely (no crash)
- Telegram `/audit` enhanced: `recent`, `page N`, `severity X`, `type X`, `source X`, `stats` sub-commands
- `formatAuditRecords`, `formatPersistentAuditRecord`, `formatAuditStats`, `formatAuditHelp` added to formatter
- Legacy `formatAuditLog` / `formatAuditRecord` preserved for backward compat (Phase 2 tests)
- `SqliteAuditRepository` implements `IAuditRepository` (extends `IAuditLogger`) — fully backward-compatible
- `InMemoryAuditLogger` now also implements `IAuditRepository` — tests use in-memory without file I/O
- All ModeManager transitions persisted to SQLite
- Phase 4 test suite: 82 new tests covering config, DB init, repository, redaction, retention, worker events, mode manager, Telegram formatter, regression
- All 201 tests passing (82 new + 119 regression)


## Phase 5 - State Store and Safe Read Models
- PHASE constant updated to 5; PHASE_NAME updated to "State Store and Safe Read Models"
- New `packages/state` package: safe read-only state/read-model layer
- `SystemStateSnapshot`, `ConfigStateSnapshot`, `ModeStateSnapshot`, `RuntimeSafetyStateSnapshot`, `AuditStateSnapshot`, `WorkerStateSnapshot`, `DatabaseStateSnapshot`, `UnsafeFlagStateSnapshot`, `SystemReadiness` types
- `buildAuditStateSnapshot()` — derives audit stats, last startup/heartbeat/unsafe-flags timestamps from IAuditRepository
- `buildConfigStateSnapshot()` — safe config summary (no raw DATABASE_URL, TELEGRAM_BOT_TOKEN, or credentials)
- `buildModeStateSnapshot()` — reports current mode, locked modes (FULL_AUTO/LIMITED_LIVE), mode safety status
- `buildWorkerStateSnapshot()` — worker health (healthy/degraded/unknown) derived from audit heartbeat age
- `calculateReadiness()` — SystemReadiness: ready/degraded/unsafe/unknown (rules documented and tested)
- `buildSystemStateSnapshot()` — aggregates all read models into a single safe snapshot
- Telegram `/system` command added with subcommands: health, safety, audit, worker, config, help
- `/system` formatters: `formatSystemOverview`, `formatSystemHealth`, `formatSystemSafety`, `formatSystemAudit`, `formatSystemWorker`, `formatSystemConfig`, `formatSystemHelp`, `formatSystemUnknown`
- Telegram output: no raw secrets, no raw detailsJson, never exposes DATABASE_URL or TELEGRAM_BOT_TOKEN
- `packages/state` depends on shared/config/db/mode-manager — no dependency on apps/telegram-bot or apps/worker
- Phase 5 test suite: 88 new tests covering types, read models, readiness, redaction, worker events, Telegram formatters, regression
- All 291 tests passing (88 new + 203 regression)
- FULL_AUTO and LIMITED_LIVE remain locked
- No Solana RPC, market data, wallets, signing, sending, Jito, Pump.fun, or execution code added


## Phase 7B - Disabled Read-Only Provider Boundaries
- Extends `packages/event-engine` (Phase 7A) with disabled read-only provider boundary models
- `EventProviderType` — 6 disabled provider type values: helius_disabled / websocket_disabled / yellowstone_disabled / polling_disabled / mock_disabled / unknown_disabled
- `EventProviderStatus` — disabled / unavailable / unsupported / mock_only / future_not_available
- `EventProviderConfig` — all 8 live/network/execution permission fields permanently `false`: enabled, allowNetwork, allowSolanaRpc, allowWebSocket, allowLiveEvents, allowPolling, allowStreaming, allowExecutionTriggers
- `EventProviderCapabilities` — all 12 capability flags permanently `false`: hasRuntimeDependency, canUseNetwork, canUseSolanaRpc, canUseWebSocket, canUseYellowstone, canUseGeyser, canPoll, canStream, canEmitLiveEvents, canTriggerExecution, canAccessWallets, canAccessPrivateKeys
- `DISABLED_PROVIDER_CONFIG`, `DISABLED_PROVIDER_CAPABILITIES`, `PHASE_7B_PROVIDER_CAPABILITIES` — authoritative constants
- `ProviderErrorCode` — 13 safe error codes: PROVIDER_DISABLED, PROVIDER_RUNTIME_NOT_INSTALLED, PROVIDER_NETWORK_FORBIDDEN, SOLANA_RPC_FORBIDDEN, WEBSOCKET_FORBIDDEN, YELLOWSTONE_FORBIDDEN, GEYSER_FORBIDDEN, LIVE_EVENTS_FORBIDDEN, POLLING_FORBIDDEN, STREAMING_FORBIDDEN, EXECUTION_TRIGGER_FORBIDDEN, WALLET_ACCESS_FORBIDDEN, API_KEY_USAGE_FORBIDDEN
- `ProviderError` / `ProviderResult<T>` / `providerOk` / `providerErr` / `isProviderOk` / `isProviderErr` — safe result/error pattern; all errors carry `safeToDisplay: true`
- `EventProviderBoundary` interface — getType, getStatus, getCapabilities, getConfig, explainDisabledReason, assertDisabled, plus optional lifecycle methods (connect, disconnect, poll, subscribe, start, stop)
- `DisabledEventProvider` — only implementation; returns disabled status + all caps false + safe human-readable reason; lifecycle methods return disabled/forbidden results; never connects, streams, polls, or triggers execution
- `createDisabledEventProvider(type, input?)` — factory that always returns disabled provider; all unsafe enable/live/network fields in input are coerced to disabled (fail-closed)
- `createDisabledHeliusProvider`, `createDisabledWebSocketProvider`, `createDisabledYellowstoneProvider`, `createDisabledPollingProvider` — named factory helpers
- `EventProviderRegistry` / `getEventProviderRegistry` — registry of disabled providers; all entries disabled; no provider startup
- Phase 7B test suite: 195 new tests (862 total, all passing)
- No Helius SDK. No WebSocket client. No Yellowstone or Geyser packages. No `@solana/web3.js`. No wallet/private keys. No market data ingestion. No transaction construction. No simulation. No signing. No sending. No live trading. No Jito.
- FULL_AUTO and LIMITED_LIVE remain locked
- No new Telegram event-stream or trade commands
- Phase 7C may add controlled mock providers or replayable fixture events — still without live providers, no network, no Solana RPC, no execution

## Phase 7A - Event Engine Core Interfaces + In-Memory Event Bus
- PHASE constant updated to 7; PHASE_NAME updated to "Event Engine Core Interfaces + In-Memory Event Bus"
- New `packages/event-engine` package: local-only, no dependencies on other @sonic/* packages
- `EventCategory` — system / config / mode / safety / audit / pump_adapter / future_chain / future_market / unknown
- `EventSourceType` — internal / worker / telegram / audit_repository / state_service / pump_adapter_mock / future_provider_disabled
- `EventSeverity` — debug / info / warn / error / critical
- `EventEnvelope` — canonical event container: id, category, type, source, severity, timestamp, optional dedupeKey/ttlMs, payload, safeToPersist, safeToDisplay
- `EventPayload` — serializable plain-object type; no functions, class instances, circular refs, or raw Errors
- `EventSourceCapabilities` — all 5 network/execution/wallet flags permanently `false`: canUseNetwork, canUseSolanaRpc, canEmitLiveEvents, canTriggerExecution, canAccessWallets
- `PHASE_7A_SOURCE_CAPABILITIES` constant — all capability flags false
- `EventSourceHealth` — named source status + capabilities + lastUpdated
- `EventEngineSystemStatus` — coreEventBus:available, liveProviders:disabled, networkEvents:forbidden, executionTriggers:forbidden, solanaRpc:forbidden
- `EventEngineErrorCode` — 17 safe error codes (INVALID_EVENT_ID, UNSAFE_EVENT_PAYLOAD, NETWORK_EVENTS_FORBIDDEN, EXECUTION_TRIGGER_FORBIDDEN, etc.)
- `EventEngineResult<T>` — safe result/error type; all errors have safeToDisplay:true
- `IEventBus` interface — publish, subscribe, unsubscribe, getRecent, getStats, clear
- `InMemoryEventBus` — bounded history (default 1000, configurable 1–10,000), handler failure isolation, idempotent unsubscribe, full stats tracking
- `DedupeStore` — in-memory TTL deduplication with clock injection for deterministic tests
- `isEventExpired` — TTL expiry check with injected clock support
- `buildDedupeKey` — deterministic key generation from category + type + optional extra
- `validateEventEnvelope` — full structural and safety validation (id, category, type, source, severity, timestamp, payload, dedupeKey, ttlMs, safeToPersist, safeToDisplay)
- `isSafePayload` — recursive check for plain objects (no functions, class instances, circular refs); uses visited-set to avoid stack overflow on circular refs
- `isPayloadWithinSizeLimit` — max 10,240 character serialized payload limit
- `buildTestEvent` — test utility for creating minimal valid envelopes
- Phase 7A test suite: 119 new tests (667 total, all passing)
- No Solana RPC. No Helius. No QuickNode. No WebSocket providers. No Yellowstone. No Geyser. No Pump SDK runtime. No @solana/web3.js. No wallet/private keys. No market data ingestion. No transaction construction. No simulation. No signing. No sending. No live trading. No Jito.
- FULL_AUTO and LIMITED_LIVE remain locked
- No new Telegram trade/event-stream commands
- future_chain and future_market categories are model-only placeholders — no provider logic
- Phase 7B may add disabled read-only provider boundaries (Helius, Yellowstone, etc.)


## Phase 7B - Disabled Event Provider Boundaries (included in Phase 7C branch)
- Extends `packages/event-engine` (Phase 7A) with disabled provider boundaries
- `EventProviderType` — 6 disabled variants: helius_disabled, websocket_disabled, yellowstone_disabled, quicknode_disabled, triton_disabled, alchemy_disabled
- `EventProviderCapabilities` — 12 capability flags all false: canUseNetwork, canUseSolanaRpc, canUseWebSocket, canUseYellowstone, canUseGeyser, canEmitLiveEvents, canReplayFixtureEvents, canTriggerExecution, canAccessWallets, canAccessPrivateKeys, canFetchMarketData, canSubscribeToChainEvents
- `PHASE_7B_PROVIDER_CAPABILITIES` constant — all 12 flags false
- `DisabledEventProvider` interface — providerType, capabilities, disabled:true, connect() (fail-closed), disconnect() (fail-closed), getStatus() → 'disabled'
- `createDisabledEventProvider(type)` — fail-closed factory; connect/disconnect always return LIVE_PROVIDER_FORBIDDEN error
- `EventProviderBoundary` interface — providerType, capabilities, disabled:true, reason string
- `EventProviderRegistry` interface — providers Map, getProvider(), getAllProviders()
- `buildDisabledProviderRegistry()` — builds registry with all 6 disabled provider boundaries
- No network calls. No live providers. No RPC. No WebSocket. No wallet. No execution.
- FULL_AUTO and LIMITED_LIVE remain locked


## Phase 7C - Controlled Mock Providers + Replayable Fixture Events
- Extends `packages/event-engine` (Phase 7A/7B) with mock providers and fixture replay
- `EventSourceType` updated: `mock_provider` added as valid source for mock/fixture events
- `EventEngineErrorCode` extended with 11 Phase 7C codes: INVALID_FIXTURE_ID, INVALID_FIXTURE_SEQUENCE, INVALID_FIXTURE_EVENT, FIXTURE_SEQUENCE_TOO_LARGE, INVALID_REPLAY_OFFSET, MOCK_PROVIDER_DISABLED, MOCK_PROVIDER_NOT_LOADED, MOCK_REPLAY_FAILED, LIVE_EVENT_FORBIDDEN, NETWORK_REPLAY_FORBIDDEN, UNSAFE_FIXTURE_PAYLOAD
- `MockProviderStatus` — idle / loaded / replaying / completed / failed / stopped
- `MockProviderCapabilities` — 12 flags; only canReplayFixtureEvents:true, all others false
- `MOCK_PROVIDER_CAPABILITIES` constant — authoritative mock provider capability constant
- `ControlledMockProvider` interface — getStatus(), getCapabilities(), loadFixtureSequence(), clearFixtureSequence(), replay(), stop(), getStats()
- `createControlledMockProvider()` — stateful mock provider factory; replay is synchronous, deterministic, local-only
- `FixtureEvent` — wrapper: fixtureId, event (EventEnvelope), offsetMs, mock:true, replay:true, live:false
- `validateFixtureEvent()` — validates fixture ID, mock/replay/live flags, offset bounds, envelope validity
- Built-in synthetic fixtures: FIXTURE_SYSTEM_STARTUP, FIXTURE_PUMP_ADAPTER_STATUS, FIXTURE_FUTURE_CHAIN_PLACEHOLDER, FIXTURE_SAFETY_EVENT; BUILTIN_FIXTURE_EVENTS[]
- `FixtureSequence` — sequenceId, name, description, events, createdAt, maxReplayEvents, safeToDisplay
- `validateFixtureSequence()` — validates ID/name lengths, event array, per-event validation, sequence length bounds (max 1000)
- `buildFixtureSequence(options)` — sorts events by offsetMs, validates, returns sequence or error
- `BUILTIN_SEQUENCE_ALL` — pre-built sequence of all 4 built-in fixture events
- `ReplayStatus` — idle / running / completed / failed / stopped
- `ReplayStats` — sequenceId, eventsPlanned, eventsPublished, eventsRejected, startedAt, completedAt, status
- `ReplayResult` — EventEngineResult<ReplayStats>
- `replayFixtureSequence(sequence, bus, options?)` — stateless replay function; validates sequence, publishes events synchronously, returns stats
- `replayAndCollect(sequence, bus, options?)` — convenience alias for replayFixtureSequence
- `ReplayOptions` — optional maxEvents cap
- MAX_FIXTURE_OFFSET_MS: 600,000ms (10 minutes). MAX_FIXTURE_SEQUENCE_LENGTH: 1,000. MAX_FIXTURE_ID_LENGTH: 128.
- Phase 7C test suite: 98 new tests (765 total, all passing)
- No live providers. No Solana RPC. No Helius. No WebSocket. No Yellowstone. No Geyser. No Pump SDK runtime. No @solana/web3.js. No wallet/private keys. No market data ingestion. No transaction construction. No simulation. No signing. No sending. No live trading. No Jito.
- FULL_AUTO and LIMITED_LIVE remain locked
- No new Telegram trade/event-stream commands
- Phase 7D may add disabled provider config/readiness checks (still without live providers)

## Phase 6C - Disabled Pump SDK Wrapper Boundary
- Extends `packages/pump-adapter` (Phase 6A/6B) with a disabled wrapper boundary
- `PumpSdkWrapperMode` — disabled / mock / future_live_not_available
- `PumpSdkWrapperStatus` — disabled / unavailable / unsupported / mock_only
- `PumpSdkWrapperConfig` — all 7 live/executable permission fields permanently `false`
- `PumpSdkWrapperCapabilities` — all 12 capability flags permanently `false` (including hasPumpSdkRuntime, hasSolanaSdkRuntime)
- `PumpSdkWrapperErrorCode` — 11 safe error codes (SDK_WRAPPER_DISABLED, LIVE_RPC_FORBIDDEN, etc.)
- `PumpSdkWrapperDisabledResult` — safe disabled/forbidden result type; always `safeToDisplay: true`
- `PumpSdkWrapper` interface — getStatus, getCapabilities, getConfig, assertDisabled, explainDisabledReason, boundary placeholders for live methods
- `DisabledPumpSdkWrapper` — only implementation; always returns disabled/forbidden results; no SDK imported
- `DISABLED_PUMP_SDK_WRAPPER` — shared disabled instance
- `createDisabledSdkWrapper` — convenience factory
- `createPumpSdkWrapper(config?)` — factory that always returns disabled wrapper; unsafe enable/live/executable attempts coerced to disabled (fail-closed); accepts `PumpSdkWrapperFactoryInput`
- `DISABLED_WRAPPER_CONFIG`, `PUMP_SDK_WRAPPER_CAPABILITIES` constants
- Optional live methods return forbidden results: getLiveQuote, getLiveBondingCurveState, buildRealInstruction
- Phase 6C test suite: 73 new tests (548 total, all passing)
- No Solana RPC. No Pump SDK runtime. No @solana/web3.js. No wallet/private keys. No account metas. No binary instruction data. No transaction construction. No simulation. No signing. No sending. No live trading. No Jito.
- FULL_AUTO and LIMITED_LIVE remain locked
- No new Telegram trade/quote commands
- Phase 7 should be read-only event engine or further disabled wrapper hardening — not execution


## Phase 6B - Instruction Intent and Transaction Plan Placeholder Models
- Extends `packages/pump-adapter` (Phase 6A) with local-only planning model types
- `PumpInstructionIntentType` (buy_intent, sell_intent, approve_intent, close_intent, unknown_intent)
- `PumpTradeSide` (buy, sell)
- `PumpInstructionIntent` — local planning model; `executionForbidden: true`, `isExecutable: false` always; no account metas, no binary data, no wallet/signer fields
- `PumpTransactionPlanType` (buy_plan, sell_plan, unknown_plan)
- `PumpTransactionPlan` — local placeholder; `executionForbidden: true`, `isExecutable: false`, `requiresWallet: false`, `requiresSignature: false`, `requiresRpc: false` always; no blockhash, no fee payer, no signatures, no transaction bytes
- `PumpInstructionBuilderRequest` — `allowExecutableInstructions: false` (literal type + runtime guard)
- `PumpInstructionBuilderResult` — plan | null, warnings, safety snapshot, optional error
- `Phase6BWarningCode` — MODEL_ONLY, EXECUTION_FORBIDDEN, SIGNING_FORBIDDEN, SENDING_FORBIDDEN, LIVE_RPC_FORBIDDEN, REAL_INSTRUCTIONS_FORBIDDEN
- `Phase6BErrorCode` — 12 forbidden-operation error codes
- `PumpInstructionIntentBuilder` interface — buildBuyIntent(), buildSellIntent(), buildPlanFromQuote(), getCapabilities()
- `PHASE_6B_BUILDER_CAPABILITIES` safety guard — all 12 prohibited capability flags permanently false
- `MockInstructionBuilder` — accepts successful Phase 6A quotes, rejects failed quotes/bad venues/executable flag
- `phase6bError`, validation helpers — allowExecutableInstructions, quote success, venue allow-list, positive amounts, slippage bounds
- Phase 6B test suite: 78 new tests (475 total, all passing)
- No Solana RPC. No Pump SDK. No @solana/web3.js. No wallet/private keys. No account metas. No binary instruction data. No transaction construction. No simulation. No signing. No sending. No live trading. No Jito.
- FULL_AUTO and LIMITED_LIVE remain locked
- No new Telegram trade/quote commands
- Phase 6C may add a disabled Pump SDK wrapper boundary (still without signing/sending)


- New `packages/pump-adapter` package: pure TypeScript adapter boundary, inert, no Solana dependency
- `PumpVenueType` (pump_curve, pumpswap, unknown, unsupported)
- `PumpAdapterStatus` (available, unavailable, disabled, unsupported)
- `PumpAdapterStatusReport` — status, isLiveCapable: false, hasLiveRpc: false, executionForbidden: true
- `PumpQuoteRequest`, `PumpBuyQuoteRequest`, `PumpSellQuoteRequest`, `PumpQuoteResult`
- `BondingCurveState` — model only, isMockState: true, not fetched from chain
- `PumpAdapterResult<T>` — safe result/error type (no throws for normal adapter errors)
- Error codes: ADAPTER_DISABLED, ADAPTER_UNAVAILABLE, UNSUPPORTED_VENUE, INVALID_TOKEN_MINT, INVALID_AMOUNT, INVALID_SLIPPAGE, QUOTE_UNAVAILABLE, NETWORK_NOT_IMPLEMENTED, EXECUTION_FORBIDDEN, SIGNING_FORBIDDEN, SENDING_FORBIDDEN, WALLET_ACCESS_FORBIDDEN
- `PumpAdapter` interface — getStatus(), detectVenue(), getBondingCurveState(), getBuyQuote(), getSellQuote()
- `PUMP_ADAPTER_CAPABILITIES` safety guard — all 8 prohibited capability flags permanently false
- `validateTokenMint`, `validateInputAmount`, `validateSlippageBps`, `validateRequestedAt`, `validateQuoteRequest` — structural validation only, no Solana library
- `MockPumpAdapter` — inert mock implementation for tests; `createDisabledMockAdapter()`, `createAvailableMockAdapter()`
- Phase 6A test suite: 106 new tests covering types, validation, mock adapter, safety guard, redaction/safety, regression
- All 397 tests passing (106 new Phase 6A + 291 regression)
- PHASE constant updated to 6 in packages/shared/src/constants.ts
- No Solana RPC. No Pump SDK runtime integration. No transaction instruction building. No transaction construction. No simulation. No signing. No sending. No wallet/private key handling. No live trading. No Jito.
- FULL_AUTO and LIMITED_LIVE remain locked
- No new Telegram trade/quote commands
