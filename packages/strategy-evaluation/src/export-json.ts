/**
 * packages/strategy-evaluation/src/export-json.ts
 *
 * Phase 16 — Strategy evaluation JSON export.
 *
 * Returns a deterministic, JSON-safe export of a StrategyEvaluation.
 * No undefined, no functions, no circular refs, no secrets.
 * Stable key ordering.
 */

import type { StrategyEvaluation, StrategyEvaluationExport } from './types.js';

/**
 * Exports a StrategyEvaluation as a deterministic JSON-safe object.
 * Analysis-only — no trade signals, no action labels.
 */
export function exportStrategyEvaluationJson(evaluation: StrategyEvaluation): StrategyEvaluationExport {
  return {
    exportKind: 'strategy_evaluation_export',
    evaluation: {
      id: evaluation.id,
      sourceKind: evaluation.sourceKind,
      intentCount: evaluation.intentCount,
      classification: evaluation.classification,
      scoreBandSummary: {
        excellent: evaluation.scoreBandSummary.excellent,
        strong: evaluation.scoreBandSummary.strong,
        moderate: evaluation.scoreBandSummary.moderate,
        weak: evaluation.scoreBandSummary.weak,
        degraded: evaluation.scoreBandSummary.degraded,
        failed: evaluation.scoreBandSummary.failed,
        inconclusive: evaluation.scoreBandSummary.inconclusive,
        total: evaluation.scoreBandSummary.total,
        summaryText: evaluation.scoreBandSummary.summaryText,
      },
      evidenceDistribution: {
        total: evaluation.evidenceDistribution.total,
        strongCount: evaluation.evidenceDistribution.strongCount,
        moderateCount: evaluation.evidenceDistribution.moderateCount,
        weakCount: evaluation.evidenceDistribution.weakCount,
        degradedCount: evaluation.evidenceDistribution.degradedCount,
        failedCount: evaluation.evidenceDistribution.failedCount,
        inconclusiveCount: evaluation.evidenceDistribution.inconclusiveCount,
        classificationCounts: { ...evaluation.evidenceDistribution.classificationCounts },
        familyCounts: { ...evaluation.evidenceDistribution.familyCounts },
        summaryText: evaluation.evidenceDistribution.summaryText,
      },
      safetyGateSummary: {
        total: evaluation.safetyGateSummary.total,
        passed: evaluation.safetyGateSummary.passed,
        warning: evaluation.safetyGateSummary.warning,
        blocked: evaluation.safetyGateSummary.blocked,
        inconclusive: evaluation.safetyGateSummary.inconclusive,
        mostCommonBlockedGateIds: [...evaluation.safetyGateSummary.mostCommonBlockedGateIds],
        summaryText: evaluation.safetyGateSummary.summaryText,
      },
      familyComparisons: evaluation.familyComparisons.map(fc => ({
        familyName: fc.familyName,
        intentCount: fc.intentCount,
        averageConfidence: fc.averageConfidence,
        evidenceQualityCounts: { ...fc.evidenceQualityCounts },
        gateStatusCounts: { ...fc.gateStatusCounts },
        summaryText: fc.summaryText,
      })),
      findings: evaluation.findings.map(f => ({
        severity: f.severity,
        code: f.code,
        message: f.message,
        safeToDisplay: f.safeToDisplay,
      })),
      fixtureOnly: true,
      liveData: false,
      safeToDisplay: true,
      analysisOnly: true,
      nonExecutable: true,
    },
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
    analysisOnly: true,
    nonExecutable: true,
  };
}
