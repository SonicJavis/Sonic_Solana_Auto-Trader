/**
 * Phase 17 — @sonic/evidence-ledger public API barrel.
 *
 * Exports all Phase 17 Evidence Ledger and Decision Trace types, models,
 * builders, validation helpers, fixtures, and capabilities guard.
 *
 * What this package provides:
 *   - EvidenceLedgerCapabilities (all unsafe fields false, fixtureOnly/analysisOnly/nonExecutable/appendOnly true)
 *   - EvidenceSourceKind, EvidenceEntryKind, EvidenceEntrySeverity type unions
 *   - DecisionTraceClassification type union
 *   - EvidenceSourceReference, EvidenceSourceReferenceInput types
 *   - EvidenceEntry, EvidenceEntryInput types
 *   - DecisionTrace, DecisionTraceInput, DecisionTraceStep types
 *   - DecisionTraceSummary, EvidenceIntegrityCheck types
 *   - EvidenceLedger, EvidenceLedgerInput, EvidenceLedgerExport, EvidenceLedgerFixture types
 *   - EvidenceLedgerErrorCode, EvidenceLedgerError, ElResult<T>, elOk, elErr
 *   - getEvidenceLedgerCapabilities — permanently-safe capabilities
 *   - buildEvidenceSourceReference — safe deterministic source reference builder
 *   - buildEvidenceEntry — safe evidence entry builder
 *   - buildDecisionTrace — safe decision trace builder
 *   - buildDecisionTraceSummary — trace summary builder
 *   - checkEvidenceIntegrity — integrity check for ledgers/traces
 *   - buildEvidenceLedger — safe ledger builder
 *   - exportEvidenceLedgerJson — deterministic JSON export
 *   - exportEvidenceLedgerMarkdown — deterministic Markdown export with safety footer
 *   - validateEvidenceEntry, validateEvidenceLedger, validateEvidenceLedgerCapabilities
 *   - containsUnsafeActionText, containsSecretPattern, containsUrlPattern, isDisplaySafe
 *   - 6 deterministic synthetic fixtures + ALL_EVIDENCE_LEDGER_FIXTURES
 *
 * What this package does NOT provide:
 *   - No real trade intents
 *   - No execution plans
 *   - No order, fill, route, swap models
 *   - No Solana RPC
 *   - No live market data
 *   - No provider API keys or connections
 *   - No wallet / private key handling
 *   - No paper trading
 *   - No trade execution
 *   - No network calls of any kind
 *   - No database writes
 *   - No Telegram alerts
 *   - No transaction construction, simulation, signing, or sending
 *   - No orders or positions
 *   - No live PnL calculation
 *   - No mutation of prior evidence
 *
 * IMPORTANT: EvidenceLedger is NOT a trading system.
 * It is a fixture-only, append-only, analysis-only, non-executable
 * audit-style reasoning record.
 */

export type {
  EvidenceLedgerCapabilities,
  EvidenceSourceKind,
  EvidenceSourceReference,
  EvidenceSourceReferenceInput,
  EvidenceEntryKind,
  EvidenceEntrySeverity,
  EvidenceEntry,
  EvidenceEntryInput,
  DecisionTraceClassification,
  DecisionTraceStep,
  DecisionTrace,
  DecisionTraceInput,
  DecisionTraceSummary,
  EvidenceIntegrityCheck,
  EvidenceLedger,
  EvidenceLedgerInput,
  EvidenceLedgerExport,
  EvidenceLedgerFixture,
  EvidenceLedgerErrorCode,
} from './types.js';

export type { EvidenceLedgerError, ElResult } from './errors.js';
export { elOk, elErr } from './errors.js';

export { getEvidenceLedgerCapabilities } from './capabilities.js';

export { buildEvidenceSourceReference } from './source-reference.js';

export { buildEvidenceEntry } from './evidence-entry.js';

export { buildDecisionTrace } from './decision-trace.js';

export { buildDecisionTraceSummary } from './trace-summary.js';

export { checkEvidenceIntegrity } from './integrity.js';

export { buildEvidenceLedger } from './ledger-builder.js';

export { exportEvidenceLedgerJson } from './export-json.js';

export { exportEvidenceLedgerMarkdown } from './export-markdown.js';

export {
  validateEvidenceEntry,
  validateEvidenceLedger,
  validateEvidenceLedgerCapabilities,
  containsUnsafeActionText,
  containsSecretPattern,
  containsUrlPattern,
  isDisplaySafe,
} from './validation.js';

export {
  CLEAN_EVIDENCE_LEDGER_FIXTURE,
  DEGRADED_EVIDENCE_LEDGER_FIXTURE,
  FAILED_EVIDENCE_LEDGER_FIXTURE,
  INCONCLUSIVE_EVIDENCE_LEDGER_FIXTURE,
  MIXED_EVIDENCE_LEDGER_FIXTURE,
  REGRESSION_EVIDENCE_LEDGER_FIXTURE,
  ALL_EVIDENCE_LEDGER_FIXTURES,
} from './fixtures.js';
