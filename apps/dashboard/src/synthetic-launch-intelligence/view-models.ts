/**
 * Phase 53 — Synthetic Launch Intelligence Foundation v1: view models.
 */

import type {
  SyntheticLaunchIntelligenceFixture,
  SyntheticLaunchIntelligenceViewModel,
  SyntheticRiskSeverity,
} from './types.js';

const RISK_WEIGHT: Readonly<Record<SyntheticRiskSeverity, number>> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

function maxRiskSeverity(fixture: SyntheticLaunchIntelligenceFixture): SyntheticRiskSeverity {
  const highest = fixture.riskFactorSummaries.reduce<SyntheticRiskSeverity>(
    (current, next) => (RISK_WEIGHT[next.severity] > RISK_WEIGHT[current] ? next.severity : current),
    'low',
  );
  return highest;
}

export function buildSyntheticLaunchIntelligenceViewModel(
  fixture: SyntheticLaunchIntelligenceFixture,
): SyntheticLaunchIntelligenceViewModel {
  const overallRiskSeverity = maxRiskSeverity(fixture);
  const holderConcentration = fixture.holderDistributionSnapshots[0]?.topHolderConcentrationPct ?? 0;
  const creatorFlagCount = fixture.creatorProfile.riskFlags.length;
  const clusterCount = fixture.walletClusterIndicators.length;
  const liquidity = fixture.poolLiquiditySnapshots[0]?.syntheticLiquidityUsd ?? 0;

  return {
    viewModelId: `phase53-view-${fixture.fixtureId}`,
    displayTitle: `${fixture.tokenProfile.symbol} synthetic launch intelligence`,
    displaySubtitle: 'Synthetic fixture-only launch review data',
    scenarioLabel: fixture.scenarioLabel,
    scenarioKind: fixture.fixtureKind,
    launchEventCount: fixture.launchEvents.length,
    liquidityLabel: liquidity >= 150000 ? 'synthetic liquidity stable' : 'synthetic liquidity limited',
    holderRiskLabel:
      holderConcentration >= 70 ? 'holder concentration risk observed' : 'holder concentration within synthetic tolerance',
    creatorRiskLabel:
      creatorFlagCount > 1 ? 'creator history risk observed' : 'creator history requires routine synthetic review',
    clusterRiskLabel:
      clusterCount > 0 ? 'wallet cluster pattern observed' : 'wallet cluster pattern not observed',
    overallRiskSeverity,
    nonAdvisorySummary: 'Synthetic fixture-only intelligence summary; not actionable and not advisory.',
  };
}
