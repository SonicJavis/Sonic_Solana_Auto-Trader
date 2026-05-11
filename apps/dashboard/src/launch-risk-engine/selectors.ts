/**
 * Phase 58 — Launch Risk Engine v1: selectors.
 *
 * Pure local selectors over risk fixtures. No runtime request parsing.
 * Non-advisory, synthetic, local-only.
 */

import {
  LAUNCH_RISK_ENGINE_FIXTURE_MAP,
  LAUNCH_RISK_ENGINE_FIXTURES,
} from './fixtures.js';
import type {
  LaunchRiskAssessment,
  LaunchRiskEngineApiSummaryContract,
  LaunchRiskEngineFixture,
  LaunchRiskEngineSelectorQuery,
  LaunchRiskEngineSelectorResult,
  LaunchRiskEngineViewModel,
  LaunchRiskFactorOutput,
} from './types.js';

export function selectLaunchRiskEngineFixture(
  query: LaunchRiskEngineSelectorQuery = {},
): LaunchRiskEngineSelectorResult {
  const fromId = query.fixtureId
    ? (LAUNCH_RISK_ENGINE_FIXTURE_MAP.get(query.fixtureId) ?? null)
    : null;

  const fixture =
    fromId ??
    LAUNCH_RISK_ENGINE_FIXTURES.find(candidate => {
      if (query.fixtureName && candidate.fixtureName !== query.fixtureName) {
        return false;
      }
      if (query.fixtureKind && candidate.fixtureKind !== query.fixtureKind) {
        return false;
      }
      if (query.riskBand && candidate.assessment.riskBand !== query.riskBand) {
        return false;
      }
      if (
        query.assessmentStatus &&
        candidate.assessment.assessmentStatus !== query.assessmentStatus
      ) {
        return false;
      }
      return true;
    }) ??
    LAUNCH_RISK_ENGINE_FIXTURES[0];

  const matched =
    fixture !== undefined &&
    (!query.fixtureId || fixture.fixtureId === query.fixtureId) &&
    (!query.fixtureName || fixture.fixtureName === query.fixtureName) &&
    (!query.fixtureKind || fixture.fixtureKind === query.fixtureKind) &&
    (!query.riskBand || fixture.assessment.riskBand === query.riskBand) &&
    (!query.assessmentStatus ||
      fixture.assessment.assessmentStatus === query.assessmentStatus);

  return {
    selectorId: `phase58-selector-${fixture?.fixtureId ?? 'none'}`,
    selectedFixtureId: fixture?.fixtureId ?? 'phase58-none',
    selectedFixtureKind: fixture?.fixtureKind ?? 'clean_launch_risk',
    matched,
    source: 'synthetic_fixture_only',
  };
}

export function selectLaunchRiskEngineFactorOutputs(
  fixture: LaunchRiskEngineFixture,
): readonly LaunchRiskFactorOutput[] {
  return fixture.factorOutputs;
}

export function selectLaunchRiskEngineAssessment(
  fixture: LaunchRiskEngineFixture,
): LaunchRiskAssessment {
  return fixture.assessment;
}

export function selectLaunchRiskEngineViewModel(
  fixture: LaunchRiskEngineFixture,
): LaunchRiskEngineViewModel {
  return fixture.viewModel;
}

export function selectLaunchRiskEngineApiSummary(
  fixture: LaunchRiskEngineFixture,
): LaunchRiskEngineApiSummaryContract {
  return fixture.apiContracts.summary;
}
