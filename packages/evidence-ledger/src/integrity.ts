/**
 * packages/evidence-ledger/src/integrity.ts
 *
 * Phase 17 — Evidence integrity check.
 *
 * Detects: duplicate IDs, unsafe text, liveData=true, unsafe source references,
 * secret-like strings, raw URL/RPC-like strings, mutable states, mutation capabilities.
 */

import type {
  EvidenceLedger,
  EvidenceEntry,
  DecisionTrace,
  EvidenceIntegrityCheck,
} from './types.js';
import { containsUnsafeActionText, containsSecretPattern, containsUrlPattern } from './validation.js';

function checkFieldText(text: string, path: string, issues: string[]): void {
  if (containsUnsafeActionText(text)) issues.push(`${path}: unsafe action text`);
  else if (containsSecretPattern(text)) issues.push(`${path}: secret-like pattern`);
  else if (containsUrlPattern(text)) issues.push(`${path}: URL/RPC-like pattern`);
}

function checkEntry(entry: EvidenceEntry, path: string, unsafeTextFields: string[], liveDataViolations: string[]): void {
  if (entry.liveData !== false) liveDataViolations.push(`${path}.liveData is not false`);
  if (entry.fixtureOnly !== true) liveDataViolations.push(`${path}.fixtureOnly is not true`);
  checkFieldText(entry.title, `${path}.title`, unsafeTextFields);
  checkFieldText(entry.summary, `${path}.summary`, unsafeTextFields);
  for (let i = 0; i < entry.reasons.length; i++) {
    const r = entry.reasons[i];
    if (r) checkFieldText(r, `${path}.reasons[${i}]`, unsafeTextFields);
  }
  if (entry.sourceRef.liveData !== false) liveDataViolations.push(`${path}.sourceRef.liveData is not false`);
  checkFieldText(entry.sourceRef.label, `${path}.sourceRef.label`, unsafeTextFields);
  checkFieldText(entry.sourceRef.description, `${path}.sourceRef.description`, unsafeTextFields);
}

/**
 * Runs a comprehensive integrity check on an EvidenceLedger.
 * Returns an EvidenceIntegrityCheck with all detected issues.
 */
export function checkEvidenceIntegrity(ledger: EvidenceLedger | DecisionTrace): EvidenceIntegrityCheck {
  const seenIds = new Set<string>();
  const duplicateIds: string[] = [];
  const unsafeTextFields: string[] = [];
  const liveDataViolations: string[] = [];
  const unsafeSourceRefs: string[] = [];
  const secretPatterns: string[] = [];
  const urlPatterns: string[] = [];
  const mutationCapabilities: string[] = [];

  // Check ledger-level safety
  if (ledger.liveData !== false) liveDataViolations.push('ledger.liveData is not false');
  if (ledger.fixtureOnly !== true) liveDataViolations.push('ledger.fixtureOnly is not true');

  // Check for mutation capability markers in the object
  const ledgerStr = JSON.stringify(ledger);
  if (ledgerStr.includes('"canMutatePriorEvidence":true'))
    mutationCapabilities.push('canMutatePriorEvidence:true detected');
  if (ledgerStr.includes('"canTrade":true'))
    mutationCapabilities.push('canTrade:true detected');
  if (ledgerStr.includes('"canExecute":true'))
    mutationCapabilities.push('canExecute:true detected');
  if (ledgerStr.includes('"canUseLiveData":true'))
    mutationCapabilities.push('canUseLiveData:true detected');

  function processEntry(entry: EvidenceEntry, path: string): void {
    if (seenIds.has(entry.id)) {
      duplicateIds.push(entry.id);
    } else {
      seenIds.add(entry.id);
    }
    checkEntry(entry, path, unsafeTextFields, liveDataViolations);

    // separate secret/url checks per field
    const allTexts = [entry.title, entry.summary, ...entry.reasons, entry.sourceRef.label, entry.sourceRef.description];
    for (const text of allTexts) {
      if (containsSecretPattern(text)) secretPatterns.push(`${path}: secret-like pattern in text`);
      if (containsUrlPattern(text)) urlPatterns.push(`${path}: URL/RPC-like pattern in text`);
    }

    // Source ref unsafe check
    if (!entry.sourceRef.referenceId || entry.sourceRef.referenceId.trim().length === 0)
      unsafeSourceRefs.push(`${path}.sourceRef.referenceId is empty`);
    if (containsSecretPattern(entry.sourceRef.referenceId))
      unsafeSourceRefs.push(`${path}.sourceRef.referenceId contains secret-like pattern`);
    if (containsUrlPattern(entry.sourceRef.referenceId))
      unsafeSourceRefs.push(`${path}.sourceRef.referenceId contains URL/RPC-like pattern`);
  }

  const isLedger = 'entries' in ledger && 'traces' in ledger;

  if (isLedger) {
    const l = ledger as EvidenceLedger;
    // Process top-level entries
    for (let i = 0; i < l.entries.length; i++) {
      const entry = l.entries[i];
      if (entry) processEntry(entry, `entries[${i}]`);
    }

    // Process trace entries
    for (let i = 0; i < l.traces.length; i++) {
      const trace = l.traces[i];
      if (!trace) continue;

      if (seenIds.has(trace.id)) {
        duplicateIds.push(trace.id);
      } else {
        seenIds.add(trace.id);
      }

      if (trace.liveData !== false) liveDataViolations.push(`traces[${i}].liveData is not false`);
      if (trace.fixtureOnly !== true) liveDataViolations.push(`traces[${i}].fixtureOnly is not true`);
      checkFieldText(trace.summary, `traces[${i}].summary`, unsafeTextFields);

      for (let j = 0; j < trace.entries.length; j++) {
        const entry = trace.entries[j];
        if (entry) processEntry(entry, `traces[${i}].entries[${j}]`);
      }
    }
  } else {
    // It's a DecisionTrace
    const t = ledger as DecisionTrace;
    if (seenIds.has(t.id)) {
      duplicateIds.push(t.id);
    }
    checkFieldText(t.summary, 'trace.summary', unsafeTextFields);
    for (let i = 0; i < t.entries.length; i++) {
      const entry = t.entries[i];
      if (entry) processEntry(entry, `entries[${i}]`);
    }
  }

  const allIssues = [
    ...duplicateIds.map(id => `duplicate id: ${id}`),
    ...unsafeTextFields,
    ...liveDataViolations,
    ...unsafeSourceRefs,
    ...secretPatterns,
    ...urlPatterns,
    ...mutationCapabilities,
  ];

  const valid = allIssues.length === 0;
  const summaryText = valid
    ? 'Integrity check passed. All evidence fields are safe, unique, and fixture-only.'
    : `Integrity check failed with ${allIssues.length} issue(s): ${allIssues.slice(0, 3).join('; ')}${allIssues.length > 3 ? '...' : ''}.`;

  return {
    valid,
    duplicateIds,
    unsafeTextFields,
    liveDataViolations,
    unsafeSourceRefs,
    secretPatterns,
    urlPatterns,
    mutationCapabilities,
    summaryText,
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
    analysisOnly: true,
    nonExecutable: true,
    appendOnly: true,
  };
}
