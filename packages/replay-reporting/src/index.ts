/**
 * Phase 14 — @sonic/replay-reporting public API barrel.
 *
 * Exports all Phase 14 Replay Reporting types, models, builders,
 * validation helpers, export utilities, and deterministic fixtures.
 *
 * What this package provides:
 *   - ReplayReportingCapabilities (all unsafe fields false, fixtureOnly true)
 *   - ReplayScenarioIndexEntry, ReplayScenarioIndex — scenario indexing
 *   - ReplayStepReportRow, ReplayRunReport — per-run reports
 *   - ReplaySummaryReport — multi-run summaries
 *   - ReplayComparisonReport — comparison/regression reports
 *   - ReplayDiagnosticFinding, ReplayDiagnosticSeverity, ReplayDiagnostics
 *   - ReplayReportExport — JSON export wrapper
 *   - ReplayReportingErrorCode, ReplayReportingError, RrResult<T>, rrOk, rrErr
 *   - buildScenarioIndex, buildReplayRunReport, buildReplayComparisonReport
 *   - buildReplayDiagnostics
 *   - exportReplayReportJson, exportReplayReportMarkdown
 *   - exportRunReportMarkdown, exportComparisonReportMarkdown
 *   - exportScenarioIndexMarkdown, exportDiagnosticsMarkdown
 *   - validateSafeText, validateCapabilities, validateJsonSafe
 *   - containsUnsafeActionText, containsSecretPattern, containsUrlPattern
 *   - isDisplaySafe
 *   - getReplayReportingCapabilities
 *   - 5 deterministic synthetic fixtures + ALL_REPLAY_REPORT_FIXTURES array
 *
 * What this package does NOT provide:
 *   - No Solana RPC
 *   - No live market data
 *   - No provider API keys or connections
 *   - No wallet / private key handling
 *   - No trade intents or execution plans
 *   - No paper trading
 *   - No trade execution
 *   - No network calls of any kind
 *   - No database writes
 *   - No Telegram alerts
 */

import type { ReplayReportingCapabilities } from './types.js';

export type {
  ReplayDiagnosticSeverity,
  ReplayScenarioIndexEntry,
  ReplayScenarioIndex,
  ReplayStepReportRow,
  ReplayRunReport,
  ReplaySummaryReport,
  ReplayComparisonReport,
  ReplayDiagnosticFinding,
  ReplayDiagnostics,
  ReplayReportExport,
  ReplayReportingCapabilities,
  ReplayReportingErrorCode,
} from './types.js';

export type { ReplayReportingError, RrResult } from './errors.js';
export { rrOk, rrErr } from './errors.js';

export {
  validateSafeText,
  validateCapabilities,
  validateJsonSafe,
  containsUnsafeActionText,
  containsSecretPattern,
  containsUrlPattern,
  isDisplaySafe,
} from './validation.js';

export { buildScenarioIndex } from './scenario-index.js';
export { buildReplayRunReport } from './run-report.js';
export { buildReplayComparisonReport } from './comparison-report.js';
export { buildReplayDiagnostics } from './diagnostics.js';
export { exportReplayReportJson } from './export-json.js';
export {
  exportReplayReportMarkdown,
  exportRunReportMarkdown,
  exportComparisonReportMarkdown,
  exportScenarioIndexMarkdown,
  exportDiagnosticsMarkdown,
} from './export-markdown.js';

export {
  CLEAN_REPLAY_RUN_REPORT_FIXTURE,
  DEGRADED_REPLAY_RUN_REPORT_FIXTURE,
  FAILED_REPLAY_RUN_REPORT_FIXTURE,
  INCONCLUSIVE_REPLAY_RUN_REPORT_FIXTURE,
  REGRESSION_REPLAY_COMPARISON_REPORT_FIXTURE,
  ALL_REPLAY_REPORT_FIXTURES,
} from './fixtures.js';

export function getReplayReportingCapabilities(): ReplayReportingCapabilities {
  return {
    canUseLiveData: false,
    canUseSolanaRpc: false,
    canUseProviderApis: false,
    canAccessPrivateKeys: false,
    canCreateTradeIntents: false,
    canCreateExecutionPlans: false,
    canPaperTrade: false,
    canTrade: false,
    canExecute: false,
    canWriteToDatabase: false,
    canSendTelegramAlerts: false,
    fixtureOnly: true,
  };
}
