import type {
  SyntheticStrategySensitivityWarningKind,
  SyntheticStrategyScenarioCase,
  SyntheticStrategyVariantId,
} from './types.js';

export function deriveSyntheticStrategySensitivityWarnings(
  variantId: SyntheticStrategyVariantId,
  scenario: SyntheticStrategyScenarioCase,
): readonly SyntheticStrategySensitivityWarningKind[] {
  const warnings = new Set<SyntheticStrategySensitivityWarningKind>();

  if (
    scenario.sharedInputs.rejectionTaxonomyKind !== 'quality_no_rejection' ||
    scenario.sharedInputs.sourceQualityBand === 'quality_rejected'
  ) {
    warnings.add('sensitive_to_rejection_reason');
  }

  if (scenario.sharedInputs.sourceRiskBand !== 'low') {
    warnings.add('sensitive_to_risk_band');
  }

  if (
    scenario.sourceMetricFixtureName.includes('thin-liquidity') ||
    scenario.sharedInputs.slippageBucket === 'high' ||
    scenario.sharedInputs.slippageBucket === 'extreme'
  ) {
    warnings.add('sensitive_to_thin_liquidity');
  }

  if (
    variantId === 'latency_sensitive' ||
    scenario.sharedInputs.latencyQualityLabel === 'quality_degraded'
  ) {
    warnings.add('sensitive_to_latency_bucket');
  }

  if (variantId === 'evidence_weighted') {
    warnings.add('sensitive_to_evidence_confidence');
  }

  warnings.add('overfit_warning_small_fixture_set');
  warnings.add('overfit_warning_single_scenario_dependency');
  warnings.add('comparison_not_live_predictive');

  return [...warnings];
}
