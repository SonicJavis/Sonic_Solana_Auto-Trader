/**
 * Phase 33 — Offline Intelligence Composite Evidence Models v1: builders.
 */

import {
  PHASE_33_COMPOSITE_EVIDENCE_GENERATED_AT,
  PHASE_33_COMPOSITE_EVIDENCE_SOURCE,
  type CompositeConfidenceIndicator,
  type CompositeEvidenceBuildInput,
  type CompositeEvidenceBuildResult,
  type CompositeEvidenceSourceReference,
  type CompositeEvidenceWeighting,
  type CompositeQualityIndicator,
  type CompositeRiskIndicator,
  type CompositeEvidenceSummary,
  type OfflineCompositeEvidenceFixture,
  type OfflineCompositeEvidenceFixtureKind,
  type OfflineCompositeEvidenceFixtureName,
  OFFLINE_COMPOSITE_EVIDENCE_FIXTURE_KINDS,
  OFFLINE_COMPOSITE_EVIDENCE_FIXTURE_NAMES,
} from './types.js';
import { normalizeOfflineCompositeEvidenceFixture } from './normalization.js';
import {
  validateOfflineCompositeEvidenceFixture,
  validateOfflineCompositeEvidenceSafety,
} from './validation.js';

function sortStrings(values: readonly string[] | null | undefined): readonly string[] {
  return [...new Set((values ?? []).map(value => value.trim()).filter(Boolean))].sort((left, right) =>
    left.localeCompare(right),
  );
}

function topCodes<T extends { readonly code: string }>(values: readonly T[], limit: number): readonly string[] {
  return values.map(value => value.code).sort((left, right) => left.localeCompare(right)).slice(0, limit);
}

function getOverallRiskBand(
  riskIndicators: readonly CompositeRiskIndicator[],
): CompositeEvidenceSummary['overallRiskBand'] {
  if (riskIndicators.length === 0) return 'unknown';
  if (riskIndicators.some(r => r.level === 'critical')) return 'critical';
  if (riskIndicators.some(r => r.level === 'high')) return 'high';
  if (riskIndicators.filter(r => r.level === 'medium').length >= 2) return 'elevated';
  if (riskIndicators.some(r => r.level === 'medium')) return 'moderate';
  return 'low';
}

function getOverallQualityBand(
  qualityIndicators: readonly CompositeQualityIndicator[],
): CompositeEvidenceSummary['overallQualityBand'] {
  if (qualityIndicators.length === 0) return 'unknown';
  if (qualityIndicators.some(q => q.level === 'high')) return 'high';
  if (qualityIndicators.some(q => q.level === 'moderate')) return 'moderate';
  return 'low';
}

function getOverallConfidenceBand(
  confidenceIndicators: readonly CompositeConfidenceIndicator[],
  sourceCount: number,
): CompositeEvidenceSummary['overallConfidenceBand'] {
  if (sourceCount === 0 || confidenceIndicators.length === 0) return 'none';
  if (confidenceIndicators.some(c => c.confidenceBand === 'high' && c.evidenceCount >= 2)) return 'high';
  if (confidenceIndicators.some(c => c.confidenceBand === 'moderate')) return 'moderate';
  if (confidenceIndicators.some(c => c.confidenceBand === 'low')) return 'low';
  return 'none';
}

function getSignalBalance(
  riskCount: number,
  qualityCount: number,
  sourceCount: number,
): CompositeEvidenceSummary['signalBalance'] {
  if (sourceCount === 0) return 'insufficient-data';
  if (riskCount === 0 && qualityCount === 0) return 'insufficient-data';
  if (riskCount > qualityCount * 2) return 'risk-dominant';
  if (qualityCount > riskCount * 2) return 'quality-dominant';
  return 'balanced';
}

function getCreatorAssessment(
  ref: CompositeEvidenceSourceReference,
): CompositeEvidenceSummary['creatorAssessment'] {
  if (!ref.creator) return 'not-referenced';
  if (ref.creator.creatorRiskLevel === 'high') return 'risk';
  if (ref.creator.credibilityBand === 'credible') return 'credible';
  if (ref.creator.credibilityBand === 'moderate') return 'moderate';
  if (ref.creator.creatorRiskLevel === 'medium') return 'moderate';
  if (ref.creator.creatorRiskLevel === 'unknown') return 'unknown';
  return 'credible';
}

function getWalletClusterAssessment(
  ref: CompositeEvidenceSourceReference,
): CompositeEvidenceSummary['walletClusterAssessment'] {
  if (!ref.walletCluster) return 'not-referenced';
  if (ref.walletCluster.clusterRiskLevel === 'critical' || ref.walletCluster.clusterRiskLevel === 'high') return 'risk';
  if (ref.walletCluster.clusterRiskLevel === 'medium') return 'watchlist';
  if (ref.walletCluster.clusterRiskLevel === 'unknown') return 'unknown';
  return 'benign';
}

function getManipulationAssessment(
  ref: CompositeEvidenceSourceReference,
): CompositeEvidenceSummary['manipulationAssessment'] {
  if (!ref.manipulation) return 'not-referenced';
  if (ref.manipulation.manipulationRiskLevel === 'critical') return 'high-risk';
  if (ref.manipulation.manipulationRiskLevel === 'high') return 'elevated';
  if (ref.manipulation.manipulationRiskLevel === 'medium') return 'watchlist';
  if (ref.manipulation.manipulationRiskLevel === 'unknown') return 'unknown';
  return 'clean';
}

function getDataCompleteness(
  sourceCount: number,
  riskCount: number,
  qualityCount: number,
): CompositeEvidenceSummary['dataCompleteness'] {
  if (sourceCount === 0) return 'insufficient';
  if (riskCount === 0 && qualityCount === 0) return 'insufficient';
  if (sourceCount < 2) return 'partial';
  return 'complete';
}

function getFalsePositiveRisk(
  riskIndicators: readonly CompositeRiskIndicator[],
  qualityIndicators: readonly CompositeQualityIndicator[],
): CompositeEvidenceSummary['falsePositiveRisk'] {
  const highRisks = riskIndicators.filter(r => r.level === 'high' || r.level === 'critical');
  const highQuality = qualityIndicators.filter(q => q.level === 'high');
  if (highRisks.length > 0 && highQuality.length > 0) return 'high';
  if (highRisks.length === 0 && qualityIndicators.length > 0) return 'moderate';
  return 'low';
}

function buildDefaultWeighting(
  sourceReferences: CompositeEvidenceSourceReference,
): CompositeEvidenceWeighting {
  const creatorWeight: CompositeEvidenceWeighting['creatorWeight'] = sourceReferences.creator
    ? (sourceReferences.creator.creatorRiskLevel === 'high' ? 'high' : 'moderate')
    : 'none';
  const walletWeight: CompositeEvidenceWeighting['walletClusterWeight'] = sourceReferences.walletCluster
    ? (sourceReferences.walletCluster.clusterRiskLevel === 'critical' || sourceReferences.walletCluster.clusterRiskLevel === 'high' ? 'high' : 'moderate')
    : 'none';
  const manipulationWeight: CompositeEvidenceWeighting['manipulationWeight'] = sourceReferences.manipulation
    ? (sourceReferences.manipulation.manipulationRiskLevel === 'critical' || sourceReferences.manipulation.manipulationRiskLevel === 'high' ? 'high' : 'moderate')
    : 'none';

  const weights = [
    { cat: 'creator' as const, val: creatorWeight },
    { cat: 'wallet-cluster' as const, val: walletWeight },
    { cat: 'manipulation' as const, val: manipulationWeight },
  ].filter(w => w.val !== 'none');

  let dominantCategory: CompositeEvidenceWeighting['dominantCategory'] = 'none';
  if (weights.length === 1 && weights[0]) {
    dominantCategory = weights[0].cat;
  } else if (weights.length > 1) {
    const highWeights = weights.filter(w => w.val === 'high');
    if (highWeights.length === 1 && highWeights[0]) {
      dominantCategory = highWeights[0].cat;
    } else {
      dominantCategory = 'balanced';
    }
  }

  return { creatorWeight, walletClusterWeight: walletWeight, manipulationWeight, dominantCategory, notes: [] };
}

function buildSummary(
  name: OfflineCompositeEvidenceFixtureName,
  kind: OfflineCompositeEvidenceFixtureKind,
  sourceReferences: CompositeEvidenceSourceReference,
  riskIndicators: readonly CompositeRiskIndicator[],
  qualityIndicators: readonly CompositeQualityIndicator[],
  confidenceIndicators: readonly CompositeConfidenceIndicator[],
  safeNotes: readonly string[],
): CompositeEvidenceSummary {
  const riskCount = riskIndicators.length;
  const qualityCount = qualityIndicators.length;
  const confidenceCount = confidenceIndicators.length;
  return {
    phase: 33,
    name,
    kind,
    overallRiskBand: getOverallRiskBand(riskIndicators),
    overallQualityBand: getOverallQualityBand(qualityIndicators),
    overallConfidenceBand: getOverallConfidenceBand(confidenceIndicators, sourceReferences.sourceCount),
    signalBalance: getSignalBalance(riskCount, qualityCount, sourceReferences.sourceCount),
    creatorAssessment: getCreatorAssessment(sourceReferences),
    walletClusterAssessment: getWalletClusterAssessment(sourceReferences),
    manipulationAssessment: getManipulationAssessment(sourceReferences),
    falsePositiveRisk: getFalsePositiveRisk(riskIndicators, qualityIndicators),
    dataCompleteness: getDataCompleteness(sourceReferences.sourceCount, riskCount, qualityCount),
    riskCount,
    qualityCount,
    confidenceCount,
    topRiskCodes: topCodes(riskIndicators, 5),
    topQualityCodes: topCodes(qualityIndicators, 5),
    ...(sourceReferences.creator !== null ? { referencedCreatorFixtureName: sourceReferences.creator.creatorFixtureName } : {}),
    ...(sourceReferences.walletCluster !== null ? { referencedWalletClusterFixtureName: sourceReferences.walletCluster.walletClusterFixtureName } : {}),
    ...(sourceReferences.manipulation !== null ? { referencedManipulationFixtureName: sourceReferences.manipulation.manipulationEvidenceFixtureName } : {}),
    generatedAt: PHASE_33_COMPOSITE_EVIDENCE_GENERATED_AT,
    fixtureOnly: true,
    liveData: false,
    externalNetwork: false,
    nonAdvisory: true,
    safeToDisplay: true,
    notes: sortStrings(safeNotes),
  };
}

export function buildOfflineCompositeEvidenceFixture(
  input: CompositeEvidenceBuildInput,
): CompositeEvidenceBuildResult {
  const nameParsed = OFFLINE_COMPOSITE_EVIDENCE_FIXTURE_NAMES.includes(
    input.name as OfflineCompositeEvidenceFixtureName,
  );
  const kindParsed = OFFLINE_COMPOSITE_EVIDENCE_FIXTURE_KINDS.includes(
    input.kind as OfflineCompositeEvidenceFixtureKind,
  );

  if (!nameParsed || !kindParsed) {
    return {
      success: false,
      fixture: null,
      validation: {
        valid: false,
        issues: [
          ...(!nameParsed ? [{ code: 'INVALID_NAME', field: 'name', message: `Unsupported fixture name: ${input.name}`, severity: 'error' as const }] : []),
          ...(!kindParsed ? [{ code: 'INVALID_KIND', field: 'kind', message: `Unsupported fixture kind: ${input.kind}`, severity: 'error' as const }] : []),
        ],
      },
      safety: { safe: true, violations: [] },
    };
  }

  const name = input.name as OfflineCompositeEvidenceFixtureName;
  const kind = input.kind as OfflineCompositeEvidenceFixtureKind;
  const riskIndicators = [...(input.riskIndicators ?? [])].sort((a, b) => a.code.localeCompare(b.code));
  const qualityIndicators = [...(input.qualityIndicators ?? [])].sort((a, b) => a.code.localeCompare(b.code));
  const confidenceIndicators = [...(input.confidenceIndicators ?? [])].sort((a, b) => a.code.localeCompare(b.code));
  const safeNotes = sortStrings(input.safeNotes);
  const weighting = input.weighting ?? buildDefaultWeighting(input.sourceReferences);

  const summary = buildSummary(name, kind, input.sourceReferences, riskIndicators, qualityIndicators, confidenceIndicators, safeNotes);

  const fixture: OfflineCompositeEvidenceFixture = {
    name,
    kind,
    sourceReferences: {
      ...input.sourceReferences,
      creator: input.sourceReferences.creator
        ? { ...input.sourceReferences.creator, notes: sortStrings(input.sourceReferences.creator.notes) }
        : input.sourceReferences.creator,
      walletCluster: input.sourceReferences.walletCluster
        ? { ...input.sourceReferences.walletCluster, notes: sortStrings(input.sourceReferences.walletCluster.notes) }
        : input.sourceReferences.walletCluster,
      manipulation: input.sourceReferences.manipulation
        ? { ...input.sourceReferences.manipulation, notes: sortStrings(input.sourceReferences.manipulation.notes) }
        : input.sourceReferences.manipulation,
      notes: sortStrings(input.sourceReferences.notes),
    },
    riskIndicators,
    qualityIndicators,
    confidenceIndicators,
    weighting: { ...weighting, notes: sortStrings(weighting.notes) },
    summary,
    safeNotes,
    meta: {
      phase: 33,
      generatedAt: PHASE_33_COMPOSITE_EVIDENCE_GENERATED_AT,
      source: PHASE_33_COMPOSITE_EVIDENCE_SOURCE,
      fixtureOnly: true,
      syntheticOnly: true,
      liveData: false,
      externalNetwork: false,
      persistence: false,
      deterministic: true,
      readOnly: true,
      nonAdvisory: true,
      nonAccusatory: true,
      notes: sortStrings(safeNotes),
    },
  };

  const normalized = normalizeOfflineCompositeEvidenceFixture(fixture);
  const safety = validateOfflineCompositeEvidenceSafety(normalized);

  if (!safety.safe) {
    return {
      success: false,
      fixture: null,
      validation: { valid: false, issues: [{ code: 'SAFETY_VIOLATION', field: 'root', message: 'Fixture failed safety validation.', severity: 'error' }] },
      safety,
    };
  }

  const validation = validateOfflineCompositeEvidenceFixture(normalized);

  return {
    success: validation.valid && safety.safe,
    fixture: validation.valid ? normalized : null,
    validation,
    safety,
  };
}

export function buildOfflineCompositeEvidenceSummary(
  fixture: OfflineCompositeEvidenceFixture,
): CompositeEvidenceSummary {
  return fixture.summary;
}
