/**
 * packages/evidence-ledger/src/export-json.ts
 *
 * Phase 17 — EvidenceLedger JSON export.
 *
 * Returns a deterministic, JSON-safe export of an EvidenceLedger.
 * No undefined, no functions, no circular refs, no secrets.
 * Stable key ordering.
 */

import type { EvidenceLedger, EvidenceLedgerExport } from './types.js';

/**
 * Exports an EvidenceLedger as a deterministic JSON-safe object.
 * Analysis-only — no trade signals, no action labels.
 */
export function exportEvidenceLedgerJson(ledger: EvidenceLedger): EvidenceLedgerExport {
  return {
    exportKind: 'evidence_ledger_export',
    ledger: {
      id: ledger.id,
      traces: ledger.traces.map(trace => ({
        id: trace.id,
        sourceIds: [...trace.sourceIds].sort(),
        entries: trace.entries.map(entry => ({
          id: entry.id,
          sourceRef: {
            referenceId: entry.sourceRef.referenceId,
            sourceKind: entry.sourceRef.sourceKind,
            label: entry.sourceRef.label,
            description: entry.sourceRef.description,
            fixtureOnly: true as const,
            liveData: false as const,
            safeToDisplay: true as const,
          },
          kind: entry.kind,
          severity: entry.severity,
          title: entry.title,
          summary: entry.summary,
          reasons: [...entry.reasons],
          timestamp: entry.timestamp,
          fixtureOnly: true as const,
          liveData: false as const,
          safeToDisplay: true as const,
          analysisOnly: true as const,
          nonExecutable: true as const,
          appendOnly: true as const,
        })),
        steps: trace.steps.map(step => ({
          stepIndex: step.stepIndex,
          entryId: step.entryId,
          description: step.description,
          severity: step.severity,
          safeToDisplay: true as const,
        })),
        classification: trace.classification,
        summary: trace.summary,
        fixtureOnly: true as const,
        liveData: false as const,
        safeToDisplay: true as const,
        analysisOnly: true as const,
        nonExecutable: true as const,
        appendOnly: true as const,
      })),
      entries: ledger.entries.map(entry => ({
        id: entry.id,
        sourceRef: {
          referenceId: entry.sourceRef.referenceId,
          sourceKind: entry.sourceRef.sourceKind,
          label: entry.sourceRef.label,
          description: entry.sourceRef.description,
          fixtureOnly: true as const,
          liveData: false as const,
          safeToDisplay: true as const,
        },
        kind: entry.kind,
        severity: entry.severity,
        title: entry.title,
        summary: entry.summary,
        reasons: [...entry.reasons],
        timestamp: entry.timestamp,
        fixtureOnly: true as const,
        liveData: false as const,
        safeToDisplay: true as const,
        analysisOnly: true as const,
        nonExecutable: true as const,
        appendOnly: true as const,
      })),
      summary: {
        traceId: ledger.summary.traceId,
        totalEntries: ledger.summary.totalEntries,
        totalSteps: ledger.summary.totalSteps,
        severityCounts: { ...ledger.summary.severityCounts },
        sourceKindCounts: { ...ledger.summary.sourceKindCounts },
        blockedReasonCount: ledger.summary.blockedReasonCount,
        warningReasonCount: ledger.summary.warningReasonCount,
        inconclusiveReasonCount: ledger.summary.inconclusiveReasonCount,
        classification: ledger.summary.classification,
        summaryText: ledger.summary.summaryText,
        fixtureOnly: true as const,
        liveData: false as const,
        safeToDisplay: true as const,
        analysisOnly: true as const,
        nonExecutable: true as const,
        appendOnly: true as const,
      },
      integrity: {
        valid: ledger.integrity.valid,
        duplicateIds: [...ledger.integrity.duplicateIds],
        unsafeTextFields: [...ledger.integrity.unsafeTextFields],
        liveDataViolations: [...ledger.integrity.liveDataViolations],
        unsafeSourceRefs: [...ledger.integrity.unsafeSourceRefs],
        secretPatterns: [...ledger.integrity.secretPatterns],
        urlPatterns: [...ledger.integrity.urlPatterns],
        mutationCapabilities: [...ledger.integrity.mutationCapabilities],
        summaryText: ledger.integrity.summaryText,
        fixtureOnly: true as const,
        liveData: false as const,
        safeToDisplay: true as const,
        analysisOnly: true as const,
        nonExecutable: true as const,
        appendOnly: true as const,
      },
      fixtureOnly: true,
      liveData: false,
      safeToDisplay: true,
      analysisOnly: true,
      nonExecutable: true,
      appendOnly: true,
    },
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
    analysisOnly: true,
    nonExecutable: true,
    appendOnly: true,
  };
}
