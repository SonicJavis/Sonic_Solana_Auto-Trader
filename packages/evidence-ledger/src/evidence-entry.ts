/**
 * packages/evidence-ledger/src/evidence-entry.ts
 *
 * Phase 17 — EvidenceEntry builder.
 *
 * Creates one safe entry with id, source, kind, severity, title, summary,
 * reasons, deterministic timestamp where needed, and required safety fields.
 */

import { elOk, elErr } from './errors.js';
import type { ElResult } from './errors.js';
import type { EvidenceEntry, EvidenceEntryInput } from './types.js';
import { containsUnsafeActionText, containsSecretPattern, containsUrlPattern } from './validation.js';

// Deterministic fixed timestamp used when no timestamp is provided (fixture-only)
const FIXTURE_TIMESTAMP = '2024-01-01T00:00:00.000Z';

function checkText(text: string, field: string): ElResult<string> {
  if (containsUnsafeActionText(text))
    return elErr('UNSAFE_ACTION_TEXT_DETECTED', `${field} contains unsafe action text`);
  if (containsSecretPattern(text))
    return elErr('SECRET_PATTERN_DETECTED', `${field} contains secret-like pattern`);
  if (containsUrlPattern(text))
    return elErr('URL_PATTERN_DETECTED', `${field} contains URL/RPC-like pattern`);
  return elOk(text);
}

/**
 * Builds a safe, deterministic EvidenceEntry.
 * Returns elErr if any safety invariant is violated.
 */
export function buildEvidenceEntry(input: EvidenceEntryInput): ElResult<EvidenceEntry> {
  if (!input.id || input.id.trim().length === 0)
    return elErr('INVALID_EVIDENCE_LEDGER_INPUT', 'id must be non-empty');

  if (input.fixtureOnly !== true)
    return elErr('FIXTURE_ONLY_REQUIRED', 'fixtureOnly must be true');

  if (input.liveData !== false)
    return elErr('LIVE_DATA_FORBIDDEN', 'liveData must be false');

  if (!input.title || input.title.trim().length === 0)
    return elErr('INVALID_EVIDENCE_LEDGER_INPUT', 'title must be non-empty');

  if (!input.summary || input.summary.trim().length === 0)
    return elErr('INVALID_EVIDENCE_LEDGER_INPUT', 'summary must be non-empty');

  const idCheck = checkText(input.id, 'id');
  if (!idCheck.ok) return elErr(idCheck.code, idCheck.message);

  const titleCheck = checkText(input.title, 'title');
  if (!titleCheck.ok) return elErr(titleCheck.code, titleCheck.message);

  const summaryCheck = checkText(input.summary, 'summary');
  if (!summaryCheck.ok) return elErr(summaryCheck.code, summaryCheck.message);

  for (let i = 0; i < input.reasons.length; i++) {
    const reason = input.reasons[i];
    if (!reason) continue;
    const reasonCheck = checkText(reason, `reasons[${i}]`);
    if (!reasonCheck.ok) return elErr(reasonCheck.code, reasonCheck.message);
  }

  // Validate source reference
  if (input.sourceRef.fixtureOnly !== true)
    return elErr('FIXTURE_ONLY_REQUIRED', 'sourceRef.fixtureOnly must be true');
  if (input.sourceRef.liveData !== false)
    return elErr('LIVE_DATA_FORBIDDEN', 'sourceRef.liveData must be false');

  const entry: EvidenceEntry = {
    id: input.id,
    sourceRef: input.sourceRef,
    kind: input.kind,
    severity: input.severity,
    title: input.title,
    summary: input.summary,
    reasons: [...input.reasons],
    timestamp: input.timestamp ?? FIXTURE_TIMESTAMP,
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
    analysisOnly: true,
    nonExecutable: true,
    appendOnly: true,
  };

  return elOk(entry);
}
