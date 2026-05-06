/**
 * packages/evidence-ledger/src/source-reference.ts
 *
 * Phase 17 — EvidenceSourceReference builder.
 *
 * Creates safe, deterministic references to replay/reporting/strategy/evaluation outputs.
 * No raw URLs, no private data, no live data, no mutable external pointers, no unsafe IDs.
 */

import { elOk, elErr } from './errors.js';
import type { ElResult } from './errors.js';
import type { EvidenceSourceReference, EvidenceSourceReferenceInput } from './types.js';
import { containsUnsafeActionText, containsSecretPattern, containsUrlPattern } from './validation.js';

/**
 * Builds a safe, deterministic EvidenceSourceReference.
 * Returns elErr if any safety invariant is violated.
 */
export function buildEvidenceSourceReference(
  input: EvidenceSourceReferenceInput,
): ElResult<EvidenceSourceReference> {
  if (!input.referenceId || input.referenceId.trim().length === 0)
    return elErr('INVALID_EVIDENCE_LEDGER_INPUT', 'referenceId must be non-empty');

  if (!input.label || input.label.trim().length === 0)
    return elErr('INVALID_EVIDENCE_LEDGER_INPUT', 'label must be non-empty');

  if (!input.description || input.description.trim().length === 0)
    return elErr('INVALID_EVIDENCE_LEDGER_INPUT', 'description must be non-empty');

  if (input.fixtureOnly !== true)
    return elErr('FIXTURE_ONLY_REQUIRED', 'fixtureOnly must be true');

  if (input.liveData !== false)
    return elErr('LIVE_DATA_FORBIDDEN', 'liveData must be false');

  if (containsUnsafeActionText(input.referenceId))
    return elErr('UNSAFE_ACTION_TEXT_DETECTED', 'referenceId contains unsafe action text');

  if (containsSecretPattern(input.referenceId))
    return elErr('SECRET_PATTERN_DETECTED', 'referenceId contains secret-like pattern');

  if (containsUrlPattern(input.referenceId))
    return elErr('URL_PATTERN_DETECTED', 'referenceId contains URL/RPC-like pattern');

  if (containsUnsafeActionText(input.label))
    return elErr('UNSAFE_ACTION_TEXT_DETECTED', 'label contains unsafe action text');

  if (containsSecretPattern(input.label))
    return elErr('SECRET_PATTERN_DETECTED', 'label contains secret-like pattern');

  if (containsUrlPattern(input.label))
    return elErr('URL_PATTERN_DETECTED', 'label contains URL/RPC-like pattern');

  if (containsUnsafeActionText(input.description))
    return elErr('UNSAFE_ACTION_TEXT_DETECTED', 'description contains unsafe action text');

  if (containsSecretPattern(input.description))
    return elErr('SECRET_PATTERN_DETECTED', 'description contains secret-like pattern');

  if (containsUrlPattern(input.description))
    return elErr('URL_PATTERN_DETECTED', 'description contains URL/RPC-like pattern');

  const ref: EvidenceSourceReference = {
    referenceId: input.referenceId,
    sourceKind: input.sourceKind,
    label: input.label,
    description: input.description,
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
  };

  return elOk(ref);
}
