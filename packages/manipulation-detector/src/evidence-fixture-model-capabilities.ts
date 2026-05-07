/**
 * Phase 32 — Bundle / Manipulation Evidence Fixture Models v1: capability helpers.
 */

import type { ManipulationEvidenceFixtureCapabilities } from './evidence-fixture-model-types.js';

export function getManipulationEvidenceFixtureCapabilities(): ManipulationEvidenceFixtureCapabilities {
  return {
    manipulationEvidenceFixtures: true,
    syntheticBundleEvidence: true,
    syntheticLaunchStructureEvidence: true,
    syntheticLiquidityPatternEvidence: true,
    syntheticCoordinationEvidence: true,
    manipulationRiskIndicators: true,
    manipulationQualityIndicators: true,
    manipulationEvidenceSafetyValidation: true,
    manipulationLiveData: false,
    manipulationSolanaRpc: false,
    manipulationProviderApis: false,
    manipulationJitoIntegration: false,
    manipulationMempoolAccess: false,
    manipulationTradingSignals: false,
    manipulationInvestmentAdvice: false,
    manipulationExternalNetwork: false,
    manipulationPersistence: false,
    manipulationExecution: false,
  };
}
