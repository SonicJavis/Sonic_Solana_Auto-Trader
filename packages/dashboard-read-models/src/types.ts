/**
 * packages/dashboard-read-models/src/types.ts
 *
 * Phase 18 — Dashboard Read Model types.
 *
 * All output models carry:
 *   fixtureOnly: true
 *   liveData: false
 *   safeToDisplay: true
 *   analysisOnly: true
 *   nonExecutable: true
 *   readOnly: true
 *
 * IMPORTANT: DashboardReadModels are NOT a trading system.
 * They are fixture-only, read-only, analysis-only, non-executable
 * data-shaping objects for future UI review.
 * They must never create real trade intents, execution plans, orders,
 * paper trades, live data access, or any actionable output.
 */

// ─── Capabilities ────────────────────────────────────────────────────────────

/** All unsafe capability flags are permanently false. */
export interface DashboardReadModelCapabilities {
  readonly canUseLiveData: false;
  readonly canUseSolanaRpc: false;
  readonly canUseProviderApis: false;
  readonly canAccessPrivateKeys: false;
  readonly canCreateTradeIntents: false;
  readonly canCreateExecutionPlans: false;
  readonly canPaperTrade: false;
  readonly canTrade: false;
  readonly canExecute: false;
  readonly canWriteToDatabase: false;
  readonly canSendTelegramAlerts: false;
  readonly canConstructTransactions: false;
  readonly canSimulateTransactions: false;
  readonly canCreateOrders: false;
  readonly canCreatePositions: false;
  readonly canCalculateLivePnl: false;
  readonly canMutatePriorEvidence: false;
  readonly canRenderUi: false;
  readonly fixtureOnly: true;
  readonly analysisOnly: true;
  readonly nonExecutable: true;
  readonly readOnly: true;
}

// ─── Severity ─────────────────────────────────────────────────────────────────

/** Analysis-only severity levels for dashboard findings. */
export type DashboardReadModelSeverity = 'info' | 'warning' | 'risk' | 'failure' | 'inconclusive';

// ─── Finding ──────────────────────────────────────────────────────────────────

/** A single analysis-only finding surfaced in a dashboard panel. */
export interface DashboardReadModelFinding {
  readonly findingId: string;
  readonly severity: DashboardReadModelSeverity;
  readonly title: string;
  readonly description: string;
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly safeToDisplay: true;
  readonly analysisOnly: true;
  readonly nonExecutable: true;
  readonly readOnly: true;
}

// ─── Input ───────────────────────────────────────────────────────────────────

/**
 * Input for building dashboard read model panels.
 * Must carry fixtureOnly: true and liveData: false.
 */
export interface DashboardReadModelInput {
  readonly inputId: string;
  readonly evidenceLedgerId?: string;
  readonly findings?: readonly DashboardReadModelFinding[];
  readonly fixtureOnly: true;
  readonly liveData: false;
}

// ─── Overview model ───────────────────────────────────────────────────────────

/**
 * Safe summary overview counts from fixture-only replay/reporting/strategy/evaluation/evidence data.
 * No live status claims.
 */
export interface DashboardOverviewModel {
  readonly overviewId: string;
  readonly totalFindings: number;
  readonly severityCounts: Readonly<Record<DashboardReadModelSeverity, number>>;
  readonly panelsAvailable: readonly string[];
  readonly safetyStatus: string;
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly safeToDisplay: true;
  readonly analysisOnly: true;
  readonly nonExecutable: true;
  readonly readOnly: true;
}

// ─── Replay panel model ───────────────────────────────────────────────────────

/** Shapes Replay Lab / Replay Reporting fixture evidence into read-only panel data. */
export interface DashboardReplayPanelModel {
  readonly panelId: string;
  readonly panelKind: 'replay_panel';
  readonly findings: readonly DashboardReadModelFinding[];
  readonly totalFindings: number;
  readonly severityCounts: Readonly<Record<DashboardReadModelSeverity, number>>;
  readonly summaryText: string;
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly safeToDisplay: true;
  readonly analysisOnly: true;
  readonly nonExecutable: true;
  readonly readOnly: true;
}

// ─── Strategy panel model ─────────────────────────────────────────────────────

/** Shapes Strategy Intent fixture evidence into read-only panel data. */
export interface DashboardStrategyPanelModel {
  readonly panelId: string;
  readonly panelKind: 'strategy_panel';
  readonly findings: readonly DashboardReadModelFinding[];
  readonly totalFindings: number;
  readonly severityCounts: Readonly<Record<DashboardReadModelSeverity, number>>;
  readonly summaryText: string;
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly safeToDisplay: true;
  readonly analysisOnly: true;
  readonly nonExecutable: true;
  readonly readOnly: true;
}

// ─── Evaluation panel model ───────────────────────────────────────────────────

/** Shapes Strategy Evaluation fixture evidence into read-only panel data. */
export interface DashboardEvaluationPanelModel {
  readonly panelId: string;
  readonly panelKind: 'evaluation_panel';
  readonly findings: readonly DashboardReadModelFinding[];
  readonly totalFindings: number;
  readonly severityCounts: Readonly<Record<DashboardReadModelSeverity, number>>;
  readonly summaryText: string;
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly safeToDisplay: true;
  readonly analysisOnly: true;
  readonly nonExecutable: true;
  readonly readOnly: true;
}

// ─── Evidence panel model ─────────────────────────────────────────────────────

/** Shapes Evidence Ledger / Decision Trace fixture evidence into read-only panel data. */
export interface DashboardEvidencePanelModel {
  readonly panelId: string;
  readonly panelKind: 'evidence_panel';
  readonly findings: readonly DashboardReadModelFinding[];
  readonly totalFindings: number;
  readonly severityCounts: Readonly<Record<DashboardReadModelSeverity, number>>;
  readonly summaryText: string;
  readonly evidenceLedgerId: string;
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly safeToDisplay: true;
  readonly analysisOnly: true;
  readonly nonExecutable: true;
  readonly readOnly: true;
}

// ─── Safety panel model ───────────────────────────────────────────────────────

/**
 * Summarises safety invariants and locked capabilities.
 * All unsafe capabilities are false.
 */
export interface DashboardSafetyPanelModel {
  readonly panelId: string;
  readonly panelKind: 'safety_panel';
  readonly capabilities: DashboardReadModelCapabilities;
  readonly lockedCapabilityNames: readonly string[];
  readonly safetyInvariantsSatisfied: boolean;
  readonly summaryText: string;
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly safeToDisplay: true;
  readonly analysisOnly: true;
  readonly nonExecutable: true;
  readonly readOnly: true;
}

// ─── Bundle ───────────────────────────────────────────────────────────────────

/**
 * A safe, combined bundle of all dashboard panel read models.
 * Fixture-only, analysis-only, non-executable, read-only.
 */
export interface DashboardReadModelBundle {
  readonly bundleId: string;
  readonly overview: DashboardOverviewModel;
  readonly replayPanel: DashboardReplayPanelModel;
  readonly strategyPanel: DashboardStrategyPanelModel;
  readonly evaluationPanel: DashboardEvaluationPanelModel;
  readonly evidencePanel: DashboardEvidencePanelModel;
  readonly safetyPanel: DashboardSafetyPanelModel;
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly safeToDisplay: true;
  readonly analysisOnly: true;
  readonly nonExecutable: true;
  readonly readOnly: true;
}

// ─── Export ───────────────────────────────────────────────────────────────────

/** Deterministic JSON-safe export of a DashboardReadModelBundle. */
export interface DashboardReadModelExport {
  readonly exportKind: 'dashboard_read_model_export';
  readonly bundle: DashboardReadModelBundle;
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly safeToDisplay: true;
  readonly analysisOnly: true;
  readonly nonExecutable: true;
  readonly readOnly: true;
}

// ─── Fixture ──────────────────────────────────────────────────────────────────

/** A named, deterministic DashboardReadModelBundle fixture for test/review use. */
export interface DashboardReadModelFixture {
  readonly fixtureId: string;
  readonly displayName: string;
  readonly description: string;
  readonly bundle: DashboardReadModelBundle;
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly safeToDisplay: true;
  readonly analysisOnly: true;
  readonly nonExecutable: true;
  readonly readOnly: true;
}

// ─── Error codes ──────────────────────────────────────────────────────────────

export type DashboardReadModelErrorCode =
  | 'INVALID_DASHBOARD_READ_MODEL_INPUT'
  | 'INVALID_DASHBOARD_READ_MODEL_BUNDLE'
  | 'UNSAFE_DASHBOARD_READ_MODEL_OUTPUT'
  | 'LIVE_DATA_FORBIDDEN'
  | 'FIXTURE_ONLY_REQUIRED'
  | 'ANALYSIS_ONLY_REQUIRED'
  | 'NON_EXECUTABLE_REQUIRED'
  | 'SAFE_TO_DISPLAY_REQUIRED'
  | 'READ_ONLY_REQUIRED'
  | 'UNSAFE_CONTENT_DETECTED'
  | 'UNSAFE_ACTION_TEXT_DETECTED'
  | 'SECRET_PATTERN_DETECTED'
  | 'URL_PATTERN_DETECTED'
  | 'UNSAFE_CAPABILITY_DETECTED'
  | 'DASHBOARD_READ_MODEL_FIXTURE_ONLY';
