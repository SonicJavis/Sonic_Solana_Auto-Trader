/**
 * Phase 33 — Offline Intelligence Composite Evidence Models v1: capability helpers.
 */

import type { OfflineCompositeEvidenceFixtureCapabilities } from './types.js';

export function getOfflineCompositeEvidenceCapabilities(): OfflineCompositeEvidenceFixtureCapabilities {
  return {
    compositeEvidenceFixtures: true,
    syntheticCompositeEvidence: true,
    compositeCreatorEvidenceRefs: true,
    compositeWalletClusterEvidenceRefs: true,
    compositeManipulationEvidenceRefs: true,
    compositeEvidenceWeighting: true,
    compositeRiskIndicators: true,
    compositeQualityIndicators: true,
    compositeConfidenceIndicators: true,
    compositeEvidenceSafetyValidation: true,
    compositeLiveData: false,
    compositeTradingSignals: false,
    compositeInvestmentAdvice: false,
    compositeExternalNetwork: false,
    compositePersistence: false,
    compositeExecution: false,
  };
}
