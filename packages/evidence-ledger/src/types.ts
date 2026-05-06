/**
 * packages/evidence-ledger/src/types.ts
 *
 * Phase 17 — Evidence Ledger and Decision Trace types.
 *
 * All output models carry:
 *   fixtureOnly: true
 *   liveData: false
 *   safeToDisplay: true
 *   analysisOnly: true
 *   nonExecutable: true
 *   appendOnly: true
 *
 * IMPORTANT: EvidenceLedger is NOT a trading system.
 * It is a fixture-only, append-only, analysis-only, non-executable
 * audit-style reasoning record. It must never create real trade intents,
 * execution plans, orders, paper trades, live data access,
 * or any actionable output.
 */

// ─── Capabilities ────────────────────────────────────────────────────────────

/** All unsafe capability flags are permanently false. */
export interface EvidenceLedgerCapabilities {
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
  readonly fixtureOnly: true;
  readonly analysisOnly: true;
  readonly nonExecutable: true;
  readonly appendOnly: true;
}

// ─── Source kind ──────────────────────────────────────────────────────────────

/** Identifies what kind of prior-phase output was used as the evidence source. */
export type EvidenceSourceKind =
  | 'replay_run'
  | 'replay_report'
  | 'strategy_intent'
  | 'strategy_evaluation'
  | 'fixture_only_source';

// ─── Source reference ─────────────────────────────────────────────────────────

/**
 * A safe, deterministic reference to a replay/reporting/strategy/evaluation output.
 * No raw URLs, no private data, no live data, no mutable external pointers.
 */
export interface EvidenceSourceReference {
  readonly referenceId: string;
  readonly sourceKind: EvidenceSourceKind;
  readonly label: string;
  readonly description: string;
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly safeToDisplay: true;
}

/** Input for building an EvidenceSourceReference. */
export interface EvidenceSourceReferenceInput {
  readonly referenceId: string;
  readonly sourceKind: EvidenceSourceKind;
  readonly label: string;
  readonly description: string;
  readonly fixtureOnly: true;
  readonly liveData: false;
}

// ─── Entry kind ───────────────────────────────────────────────────────────────

/** The kind of reasoning captured in an evidence entry. */
export type EvidenceEntryKind =
  | 'source_snapshot'
  | 'classification_reason'
  | 'safety_gate_reason'
  | 'evidence_quality_reason'
  | 'rejection_reason'
  | 'warning_reason'
  | 'inconclusive_reason'
  | 'fixture_only_reason';

// ─── Entry severity ───────────────────────────────────────────────────────────

/** Analysis-only severity levels for evidence entries. */
export type EvidenceEntrySeverity = 'info' | 'warning' | 'risk' | 'failure' | 'inconclusive';

// ─── Evidence entry ───────────────────────────────────────────────────────────

/**
 * A single audit-style evidence entry explaining a reasoning step.
 *
 * IMPORTANT SAFETY NOTE:
 * This is NOT a recommendation to act.
 * It is an internal, fixture-only, append-only, analysis-only, non-executable record.
 */
export interface EvidenceEntry {
  readonly id: string;
  readonly sourceRef: EvidenceSourceReference;
  readonly kind: EvidenceEntryKind;
  readonly severity: EvidenceEntrySeverity;
  readonly title: string;
  readonly summary: string;
  readonly reasons: readonly string[];
  readonly timestamp: string;
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly safeToDisplay: true;
  readonly analysisOnly: true;
  readonly nonExecutable: true;
  readonly appendOnly: true;
}

/** Input for building an EvidenceEntry. */
export interface EvidenceEntryInput {
  readonly id: string;
  readonly sourceRef: EvidenceSourceReference;
  readonly kind: EvidenceEntryKind;
  readonly severity: EvidenceEntrySeverity;
  readonly title: string;
  readonly summary: string;
  readonly reasons: readonly string[];
  readonly timestamp?: string;
  readonly fixtureOnly: true;
  readonly liveData: false;
}

// ─── Decision trace classification ────────────────────────────────────────────

/**
 * Non-actionable decision trace classification.
 * These values are analysis-only labels — NOT recommendations to act.
 */
export type DecisionTraceClassification =
  | 'rejected_by_evidence'
  | 'watch_only_by_evidence'
  | 'analysis_only_by_evidence'
  | 'insufficient_evidence'
  | 'fixture_only_trace';

// ─── Decision trace step ──────────────────────────────────────────────────────

/** A single reasoning step within a decision trace. */
export interface DecisionTraceStep {
  readonly stepIndex: number;
  readonly entryId: string;
  readonly description: string;
  readonly severity: EvidenceEntrySeverity;
  readonly safeToDisplay: true;
}

// ─── Decision trace ───────────────────────────────────────────────────────────

/**
 * A safe, fixture-only, append-only trace of reasoning steps derived from
 * one or more evidence entries.
 *
 * IMPORTANT SAFETY NOTE:
 * This is NOT a trade decision or execution plan.
 * It is an internal, fixture-only, analysis-only, non-executable trace.
 */
export interface DecisionTrace {
  readonly id: string;
  readonly sourceIds: readonly string[];
  readonly entries: readonly EvidenceEntry[];
  readonly steps: readonly DecisionTraceStep[];
  readonly classification: DecisionTraceClassification;
  readonly summary: string;
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly safeToDisplay: true;
  readonly analysisOnly: true;
  readonly nonExecutable: true;
  readonly appendOnly: true;
}

/** Input for building a DecisionTrace. */
export interface DecisionTraceInput {
  readonly id: string;
  readonly entries: readonly EvidenceEntry[];
  readonly classification?: DecisionTraceClassification;
  readonly summary?: string;
  readonly fixtureOnly: true;
  readonly liveData: false;
}

// ─── Trace summary ────────────────────────────────────────────────────────────

/** Summary statistics for a DecisionTrace. */
export interface DecisionTraceSummary {
  readonly traceId: string;
  readonly totalEntries: number;
  readonly totalSteps: number;
  readonly severityCounts: Readonly<Record<EvidenceEntrySeverity, number>>;
  readonly sourceKindCounts: Readonly<Record<EvidenceSourceKind, number>>;
  readonly blockedReasonCount: number;
  readonly warningReasonCount: number;
  readonly inconclusiveReasonCount: number;
  readonly classification: DecisionTraceClassification;
  readonly summaryText: string;
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly safeToDisplay: true;
  readonly analysisOnly: true;
  readonly nonExecutable: true;
  readonly appendOnly: true;
}

// ─── Integrity check ─────────────────────────────────────────────────────────

/** Result of an evidence integrity check. */
export interface EvidenceIntegrityCheck {
  readonly valid: boolean;
  readonly duplicateIds: readonly string[];
  readonly unsafeTextFields: readonly string[];
  readonly liveDataViolations: readonly string[];
  readonly unsafeSourceRefs: readonly string[];
  readonly secretPatterns: readonly string[];
  readonly urlPatterns: readonly string[];
  readonly mutationCapabilities: readonly string[];
  readonly summaryText: string;
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly safeToDisplay: true;
  readonly analysisOnly: true;
  readonly nonExecutable: true;
  readonly appendOnly: true;
}

// ─── Evidence ledger ──────────────────────────────────────────────────────────

/**
 * A safe, fixture-only, append-only ledger of evidence traces and entries.
 *
 * IMPORTANT SAFETY NOTE:
 * This is NOT a trading ledger.
 * It is a fixture-only, append-only, analysis-only, non-executable audit record.
 * Prior evidence cannot be mutated.
 */
export interface EvidenceLedger {
  readonly id: string;
  readonly traces: readonly DecisionTrace[];
  readonly entries: readonly EvidenceEntry[];
  readonly summary: DecisionTraceSummary;
  readonly integrity: EvidenceIntegrityCheck;
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly safeToDisplay: true;
  readonly analysisOnly: true;
  readonly nonExecutable: true;
  readonly appendOnly: true;
}

/** Input for building an EvidenceLedger. */
export interface EvidenceLedgerInput {
  readonly id: string;
  readonly traces?: readonly DecisionTrace[];
  readonly entries?: readonly EvidenceEntry[];
  readonly fixtureOnly: true;
  readonly liveData: false;
}

// ─── Export ───────────────────────────────────────────────────────────────────

/** Deterministic JSON-safe export of an EvidenceLedger. */
export interface EvidenceLedgerExport {
  readonly exportKind: 'evidence_ledger_export';
  readonly ledger: EvidenceLedger;
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly safeToDisplay: true;
  readonly analysisOnly: true;
  readonly nonExecutable: true;
  readonly appendOnly: true;
}

// ─── Fixture ─────────────────────────────────────────────────────────────────

/** A named, deterministic EvidenceLedger fixture for test/review use. */
export interface EvidenceLedgerFixture {
  readonly fixtureId: string;
  readonly displayName: string;
  readonly description: string;
  readonly ledger: EvidenceLedger;
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly safeToDisplay: true;
  readonly analysisOnly: true;
  readonly nonExecutable: true;
  readonly appendOnly: true;
}

// ─── Error codes ──────────────────────────────────────────────────────────────

export type EvidenceLedgerErrorCode =
  | 'INVALID_EVIDENCE_LEDGER_INPUT'
  | 'INVALID_EVIDENCE_LEDGER'
  | 'UNSAFE_EVIDENCE_LEDGER_OUTPUT'
  | 'LIVE_DATA_FORBIDDEN'
  | 'FIXTURE_ONLY_REQUIRED'
  | 'ANALYSIS_ONLY_REQUIRED'
  | 'NON_EXECUTABLE_REQUIRED'
  | 'SAFE_TO_DISPLAY_REQUIRED'
  | 'APPEND_ONLY_REQUIRED'
  | 'UNSAFE_CONTENT_DETECTED'
  | 'UNSAFE_ACTION_TEXT_DETECTED'
  | 'SECRET_PATTERN_DETECTED'
  | 'URL_PATTERN_DETECTED'
  | 'DUPLICATE_ID_DETECTED'
  | 'MUTATION_CAPABILITY_DETECTED'
  | 'EVIDENCE_LEDGER_FIXTURE_ONLY'
  | 'INTEGRITY_CHECK_FAILED';
