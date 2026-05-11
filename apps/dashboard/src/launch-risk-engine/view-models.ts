/**
 * Phase 58 — Launch Risk Engine v1: view models.
 *
 * Dashboard-friendly risk summaries. No DOM/rendering.
 * Non-advisory, synthetic, local-only.
 */

import type { LaunchRiskEngineFixture, LaunchRiskEngineViewModel } from './types.js';

export function buildLaunchRiskEngineViewModel(
  fixture: LaunchRiskEngineFixture,
): LaunchRiskEngineViewModel {
  return {
    viewModelId: `phase58-view-${fixture.fixtureId}`,
    assessmentName: fixture.fixtureName,
    assessmentKind: fixture.fixtureKind,
    assessmentStatus: fixture.assessment.assessmentStatus,
    totalRiskScore: fixture.assessment.totalRiskScore,
    riskBand: fixture.assessment.riskBand,
    factorCount: fixture.assessment.factorCount,
    hardRejectionCount: fixture.assessment.hardRejectionReasons.length,
    softWarningCount: fixture.assessment.softWarningReasons.length,
    nonAdvisorySummary:
      'Risk summary is fixture-only, non-actionable, deterministic classification, and not a signal.',
  };
}
