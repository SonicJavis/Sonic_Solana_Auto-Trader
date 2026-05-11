/**
 * Phase 59 — Risk Explanation and Evidence Models v1: view models.
 */

import { LAUNCH_RISK_ENGINE_FIXTURES } from '../launch-risk-engine/index.js';
import type {
  RiskExplanationEvidenceFixture,
  RiskExplanationEvidenceViewModel,
} from './types.js';

export function buildRiskExplanationEvidenceViewModel(
  fixture: RiskExplanationEvidenceFixture,
): RiskExplanationEvidenceViewModel {
  const confidenceLabel =
    fixture.explanationOutput.factorExplanations.find(
      factor => factor.confidenceLabel === 'high_confidence',
    )?.confidenceLabel ??
    fixture.explanationOutput.factorExplanations[0]?.confidenceLabel ??
    'insufficient_evidence';

  const sourceRisk = LAUNCH_RISK_ENGINE_FIXTURES.find(
    candidate => candidate.fixtureName === fixture.sourceRiskFixtureName,
  );

  return {
    viewModelId: `phase59-view-${fixture.fixtureId}`,
    fixtureId: fixture.fixtureId,
    explanationName: fixture.fixtureName,
    explanationKind: fixture.fixtureKind,
    sourceRiskFixtureName: fixture.sourceRiskFixtureName,
    riskBand: sourceRisk?.assessment.riskBand ?? 'low',
    confidenceLabel,
    nodeCount: fixture.evidenceGraph.nodeCount,
    edgeCount: fixture.evidenceGraph.edgeCount,
    nonAdvisorySummary:
      'Explanation summary is fixture-only, non-actionable, deterministic, and not a signal.',
  };
}
