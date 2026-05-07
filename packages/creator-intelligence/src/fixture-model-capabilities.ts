/**
 * Phase 30 — Creator Intelligence Fixture Models v1: capability helpers.
 */

import type { CreatorFixtureModelCapabilities } from './fixture-model-types.js';

export function getCreatorFixtureModelCapabilities(): CreatorFixtureModelCapabilities {
  return {
    creatorIntelligenceFixtures: true,
    syntheticCreatorProfiles: true,
    creatorNarrativeFixtures: true,
    creatorRiskIndicators: true,
    creatorCredibilityIndicators: true,
    creatorFixtureSafetyValidation: true,
    creatorLiveData: false,
    creatorSocialApiAccess: false,
    creatorScraping: false,
    creatorIdentityResolution: false,
    creatorInvestmentAdvice: false,
    creatorTradingSignals: false,
    creatorExternalNetwork: false,
    creatorPersistence: false,
  };
}
