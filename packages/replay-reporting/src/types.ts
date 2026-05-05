/**
 * packages/replay-reporting/src/types.ts
 *
 * Phase 14 — Replay Reporting types.
 *
 * All report models carry:
 *   fixtureOnly: true
 *   liveData: false
 *   safeToDisplay: true
 *
 * No trade intents, no execution plans, no live data, no provider access.
 */

import type { ReplayVerdict, ReplayStepType } from '@sonic/replay-lab';

// ─── Severity ────────────────────────────────────────────────────────────────

/** Analysis-only severity levels. No action-oriented names. */
export type ReplayDiagnosticSeverity = 'info' | 'warning' | 'risk' | 'failure' | 'inconclusive';

// ─── Scenario index ───────────────────────────────────────────────────────────

export interface ReplayScenarioIndexEntry {
  readonly scenarioId: string;
  readonly displayName: string;
  readonly description: string;
  readonly expectedOutcome: ReplayVerdict;
  readonly stepCount: number;
  readonly stepTypes: readonly ReplayStepType[];
  readonly fixtureOnly: true;
  readonly liveData: false;
}

export interface ReplayScenarioIndex {
  readonly scenarioCount: number;
  readonly scenarioIds: readonly string[];
  readonly entries: readonly ReplayScenarioIndexEntry[];
  /** Count of scenarios per expected verdict */
  readonly verdictCounts: Readonly<Record<ReplayVerdict, number>>;
  readonly totalStepCount: number;
  readonly uniqueStepTypes: readonly ReplayStepType[];
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly safeToDisplay: true;
}

// ─── Run report ───────────────────────────────────────────────────────────────

export interface ReplayStepReportRow {
  readonly stepId: string;
  readonly sequence: number;
  readonly stepVerdict: ReplayVerdict;
  readonly warningCount: number;
  readonly warnings: readonly string[];
  readonly riskScore: number | null;
  readonly confidence: number | null;
  readonly safeToDisplay: true;
}

export interface ReplayRunReport {
  readonly reportId: string;
  readonly runId: string;
  readonly scenarioId: string;
  readonly finalVerdict: ReplayVerdict;
  readonly finalRiskScore: number;
  readonly averageConfidence: number;
  readonly stepCount: number;
  readonly stepRows: readonly ReplayStepReportRow[];
  readonly warningCount: number;
  readonly failureCount: number;
  readonly degradedCount: number;
  readonly inconclusiveCount: number;
  /** Safe human-readable summary — no trading instructions */
  readonly summaryText: string;
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly safeToDisplay: true;
}

// ─── Summary report ───────────────────────────────────────────────────────────

export interface ReplaySummaryReport {
  readonly totalRuns: number;
  readonly verdictDistribution: Readonly<Record<ReplayVerdict, number>>;
  readonly averageRiskScore: number;
  readonly averageConfidence: number;
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly safeToDisplay: true;
}

// ─── Comparison report ────────────────────────────────────────────────────────

export interface ReplayComparisonReport {
  readonly comparisonReportId: string;
  readonly baselineRunId: string;
  readonly candidateRunId: string;
  readonly verdictChanged: boolean;
  readonly scoreDelta: number;
  readonly confidenceDelta: number;
  /** True when candidate score is higher (worse) than baseline */
  readonly regression: boolean;
  readonly summaryText: string;
  readonly diagnosticFindings: readonly ReplayDiagnosticFinding[];
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly safeToDisplay: true;
}

// ─── Diagnostics ─────────────────────────────────────────────────────────────

export interface ReplayDiagnosticFinding {
  readonly severity: ReplayDiagnosticSeverity;
  readonly code: string;
  readonly message: string;
  readonly stepId?: string;
  readonly safeToDisplay: true;
}

export interface ReplayDiagnostics {
  readonly diagnosticsId: string;
  readonly sourceRunId: string;
  readonly findingCount: number;
  readonly severityCounts: Readonly<Record<ReplayDiagnosticSeverity, number>>;
  readonly findings: readonly ReplayDiagnosticFinding[];
  readonly degradedReasons: readonly string[];
  readonly failedReasons: readonly string[];
  readonly inconclusiveReasons: readonly string[];
  readonly missingFixtureDataNotes: readonly string[];
  /** Safe plain-text diagnostic summary */
  readonly summaryText: string;
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly safeToDisplay: true;
}

// ─── Export wrappers ─────────────────────────────────────────────────────────

/** Wraps any safe report/index/diagnostics for JSON export */
export interface ReplayReportExport {
  readonly exportId: string;
  readonly exportedAt: string;
  readonly contentType:
    | 'run_report'
    | 'comparison_report'
    | 'scenario_index'
    | 'diagnostics'
    | 'summary_report';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly payload: Record<string, any>;
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly safeToDisplay: true;
}

// ─── Capabilities ─────────────────────────────────────────────────────────────

/** All unsafe capability flags are permanently false. */
export interface ReplayReportingCapabilities {
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
  readonly fixtureOnly: true;
}

// ─── Error codes ──────────────────────────────────────────────────────────────

export type ReplayReportingErrorCode =
  | 'INVALID_REPORT_INPUT'
  | 'INVALID_SCENARIO_INDEX_INPUT'
  | 'INVALID_COMPARISON_INPUT'
  | 'UNSAFE_REPORT_OUTPUT'
  | 'LIVE_DATA_FORBIDDEN'
  | 'FIXTURE_ONLY_REQUIRED'
  | 'UNSAFE_CONTENT_DETECTED'
  | 'UNSAFE_ACTION_TEXT_DETECTED'
  | 'SECRET_PATTERN_DETECTED'
  | 'URL_PATTERN_DETECTED'
  | 'EXPORT_UNSAFE'
  | 'REPLAY_REPORTING_FIXTURE_ONLY';
