/**
 * packages/evidence-ledger/src/decision-trace.ts
 *
 * Phase 17 — DecisionTrace builder.
 *
 * Creates a safe trace from one or more evidence entries.
 * Includes id, sourceIds, entries, steps, classification, summary,
 * and required safety fields.
 */

import { elOk, elErr } from './errors.js';
import type { ElResult } from './errors.js';
import type {
  DecisionTrace,
  DecisionTraceInput,
  DecisionTraceClassification,
  DecisionTraceStep,
  EvidenceEntry,
} from './types.js';
import { containsUnsafeActionText, containsSecretPattern, containsUrlPattern } from './validation.js';

function checkText(text: string, field: string): ElResult<string> {
  if (containsUnsafeActionText(text))
    return elErr('UNSAFE_ACTION_TEXT_DETECTED', `${field} contains unsafe action text`);
  if (containsSecretPattern(text))
    return elErr('SECRET_PATTERN_DETECTED', `${field} contains secret-like pattern`);
  if (containsUrlPattern(text))
    return elErr('URL_PATTERN_DETECTED', `${field} contains URL/RPC-like pattern`);
  return elOk(text);
}

function deriveClassification(entries: readonly EvidenceEntry[]): DecisionTraceClassification {
  if (entries.length === 0) return 'fixture_only_trace';

  let hasFailure = false;
  let hasRisk = false;
  let hasWarning = false;
  let hasInconclusive = false;

  for (const entry of entries) {
    if (entry.severity === 'failure') hasFailure = true;
    if (entry.severity === 'risk') hasRisk = true;
    if (entry.severity === 'warning') hasWarning = true;
    if (entry.severity === 'inconclusive') hasInconclusive = true;
  }

  if (hasFailure) return 'rejected_by_evidence';
  if (hasRisk) return 'watch_only_by_evidence';
  if (hasInconclusive && !hasWarning) return 'insufficient_evidence';
  if (hasWarning) return 'watch_only_by_evidence';
  return 'analysis_only_by_evidence';
}

function buildSteps(entries: readonly EvidenceEntry[]): readonly DecisionTraceStep[] {
  return entries.map((entry, index) => ({
    stepIndex: index,
    entryId: entry.id,
    description: `${entry.kind}: ${entry.title}`,
    severity: entry.severity,
    safeToDisplay: true as const,
  }));
}

function buildSummaryText(
  id: string,
  classification: DecisionTraceClassification,
  entries: readonly EvidenceEntry[],
): string {
  return (
    `Trace ${id}: ${classification}. ` +
    `${entries.length} evidence entr${entries.length === 1 ? 'y' : 'ies'} analysed. ` +
    `Fixture-only, analysis-only, non-executable, append-only.`
  );
}

/**
 * Builds a safe, deterministic DecisionTrace.
 * Returns elErr if any safety invariant is violated.
 */
export function buildDecisionTrace(input: DecisionTraceInput): ElResult<DecisionTrace> {
  if (!input.id || input.id.trim().length === 0)
    return elErr('INVALID_EVIDENCE_LEDGER_INPUT', 'id must be non-empty');

  if (input.fixtureOnly !== true)
    return elErr('FIXTURE_ONLY_REQUIRED', 'fixtureOnly must be true');

  if (input.liveData !== false)
    return elErr('LIVE_DATA_FORBIDDEN', 'liveData must be false');

  const idCheck = checkText(input.id, 'id');
  if (!idCheck.ok) return elErr(idCheck.code, idCheck.message);

  // Validate entries
  for (let i = 0; i < input.entries.length; i++) {
    const entry = input.entries[i];
    if (!entry) continue;
    if (entry.fixtureOnly !== true)
      return elErr('FIXTURE_ONLY_REQUIRED', `entries[${i}].fixtureOnly must be true`);
    if (entry.liveData !== false)
      return elErr('LIVE_DATA_FORBIDDEN', `entries[${i}].liveData must be false`);
  }

  const classification = input.classification ?? deriveClassification(input.entries);
  const steps = buildSteps(input.entries);
  const sourceIds = [...new Set(input.entries.map(e => e.sourceRef.referenceId))];
  const summary = input.summary ?? buildSummaryText(input.id, classification, input.entries);

  const summaryCheck = checkText(summary, 'summary');
  if (!summaryCheck.ok) return elErr(summaryCheck.code, summaryCheck.message);

  const trace: DecisionTrace = {
    id: input.id,
    sourceIds,
    entries: [...input.entries],
    steps,
    classification,
    summary,
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
    analysisOnly: true,
    nonExecutable: true,
    appendOnly: true,
  };

  return elOk(trace);
}
