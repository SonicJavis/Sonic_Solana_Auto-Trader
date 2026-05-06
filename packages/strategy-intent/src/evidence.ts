/**
 * packages/strategy-intent/src/evidence.ts
 *
 * Phase 15 — Strategy evidence quality assessment.
 *
 * Maps fixture-only replay evidence to StrategyEvidenceQuality values.
 * This is analysis-only — no actionable output is produced.
 */

import type { StrategyEvidenceQuality, StrategyIntentInput } from './types.js';

export interface EvidenceAssessment {
  readonly quality: StrategyEvidenceQuality;
  readonly confidence: number;
  readonly notes: readonly string[];
}

/**
 * Assesses the evidence quality from a fixture-only StrategyIntentInput.
 *
 * Rules:
 * - failed final verdict → failed_fixture_evidence
 * - degraded final verdict → degraded_fixture_evidence
 * - inconclusive final verdict → inconclusive_fixture_evidence
 * - fixture_only or passed with confidence >= 0.6 → strong_fixture_evidence
 * - fixture_only or passed with confidence >= 0.4 → moderate_fixture_evidence
 * - missing or near-zero data → weak_fixture_evidence or inconclusive_fixture_evidence
 */
export function assessStrategyEvidence(input: StrategyIntentInput): EvidenceAssessment {
  const verdict = input.finalVerdict ?? '';
  const confidence = input.averageConfidence ?? 0;
  const riskScore = input.finalRiskScore ?? 0;
  const failureCount = input.failureCount ?? 0;
  const degradedCount = input.degradedCount ?? 0;
  const inconclusiveCount = input.inconclusiveCount ?? 0;

  const notes: string[] = [];

  // Verdict-driven quality
  if (verdict === 'failed' || failureCount > 0) {
    notes.push('Fixture evidence shows failed verdict — not eligible for progression.');
    return {
      quality: 'failed_fixture_evidence',
      confidence: Math.max(0, Math.min(1, confidence)),
      notes,
    };
  }

  if (verdict === 'degraded' || degradedCount > 0) {
    notes.push('Fixture evidence shows degraded outcome — review required before any progression.');
    return {
      quality: 'degraded_fixture_evidence',
      confidence: Math.max(0, Math.min(1, confidence)),
      notes,
    };
  }

  if (verdict === 'inconclusive' || inconclusiveCount > 0) {
    notes.push('Fixture evidence is inconclusive — insufficient data to classify quality.');
    return {
      quality: 'inconclusive_fixture_evidence',
      confidence: Math.max(0, Math.min(1, confidence)),
      notes,
    };
  }

  // Confidence and risk-driven quality for passed/fixture_only
  if (verdict === 'passed' || verdict === 'fixture_only' || verdict === '') {
    if (confidence <= 0 && riskScore <= 0) {
      notes.push('No confidence or risk score data available — evidence quality is weak.');
      return {
        quality: 'weak_fixture_evidence',
        confidence: 0,
        notes,
      };
    }

    if (confidence >= 0.6 && riskScore < 0.4) {
      notes.push('Fixture evidence shows strong signals with sufficient confidence.');
      return {
        quality: 'strong_fixture_evidence',
        confidence: Math.max(0, Math.min(1, confidence)),
        notes,
      };
    }

    if (confidence >= 0.4) {
      notes.push('Fixture evidence shows moderate signals with adequate confidence.');
      return {
        quality: 'moderate_fixture_evidence',
        confidence: Math.max(0, Math.min(1, confidence)),
        notes,
      };
    }

    notes.push('Low confidence in fixture evidence — quality is weak.');
    return {
      quality: 'weak_fixture_evidence',
      confidence: Math.max(0, Math.min(1, confidence)),
      notes,
    };
  }

  // Fallback
  notes.push('Unable to determine evidence quality from available fixture data.');
  return {
    quality: 'inconclusive_fixture_evidence',
    confidence: 0,
    notes,
  };
}
