/**
 * Phase 53 — Synthetic Launch Intelligence Foundation v1: selectors.
 */

import {
  SYNTHETIC_LAUNCH_INTELLIGENCE_FIXTURES,
  SYNTHETIC_LAUNCH_INTELLIGENCE_FIXTURE_MAP,
} from './fixtures.js';
import type {
  SyntheticLaunchIntelligenceFixture,
  SyntheticLaunchIntelligenceSelectorQuery,
  SyntheticLaunchIntelligenceSelectorResult,
} from './types.js';

const RISK_ORDER = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
} as const;

function matchesMinimumRisk(
  fixture: SyntheticLaunchIntelligenceFixture,
  minimum: SyntheticLaunchIntelligenceSelectorQuery['minimumRiskSeverity'],
): boolean {
  if (!minimum) {
    return true;
  }
  return RISK_ORDER[fixture.viewModel.overallRiskSeverity] >= RISK_ORDER[minimum];
}

export function selectSyntheticLaunchIntelligenceFixture(
  query: SyntheticLaunchIntelligenceSelectorQuery = {},
): SyntheticLaunchIntelligenceSelectorResult {
  const fromId = query.fixtureId
    ? SYNTHETIC_LAUNCH_INTELLIGENCE_FIXTURE_MAP.get(query.fixtureId) ?? null
    : null;

  const fixture =
    fromId ??
    SYNTHETIC_LAUNCH_INTELLIGENCE_FIXTURES.find(candidate => {
      if (query.scenarioKind && candidate.fixtureKind !== query.scenarioKind) {
        return false;
      }
      return matchesMinimumRisk(candidate, query.minimumRiskSeverity);
    }) ??
    SYNTHETIC_LAUNCH_INTELLIGENCE_FIXTURES[0];

  const matched =
    fixture !== undefined &&
    (!query.fixtureId || fixture.fixtureId === query.fixtureId) &&
    (!query.scenarioKind || fixture.fixtureKind === query.scenarioKind) &&
    matchesMinimumRisk(fixture, query.minimumRiskSeverity);

  return {
    selectorId: `phase53-selector-${fixture?.fixtureId ?? 'none'}`,
    selectedFixtureId: fixture?.fixtureId ?? 'phase53-none',
    selectedScenarioKind: fixture?.fixtureKind ?? 'clean_launch',
    matched,
    source: 'synthetic_fixture_only',
  };
}
