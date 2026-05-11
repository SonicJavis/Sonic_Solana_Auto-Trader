/**
 * Phase 58 — Launch Risk Engine v1: fixtures.
 *
 * 8 deterministic risk assessment fixtures, one per Phase 57 replay scenario.
 * Non-advisory, synthetic, local-only.
 */

import { buildLaunchRiskEngineFixture } from './builders.js';
import {
  LAUNCH_RISK_ENGINE_ASSESSMENT_KINDS,
  LAUNCH_RISK_ENGINE_ASSESSMENT_NAMES,
  type LaunchRiskEngineAssessmentKind,
  type LaunchRiskEngineAssessmentName,
  type LaunchRiskEngineFixture,
} from './types.js';

export const LAUNCH_RISK_ENGINE_FIXTURES =
  LAUNCH_RISK_ENGINE_ASSESSMENT_NAMES.map(fixtureName =>
    buildLaunchRiskEngineFixture({ fixtureName }),
  ) satisfies readonly LaunchRiskEngineFixture[];

export const LAUNCH_RISK_ENGINE_FIXTURE_MAP: ReadonlyMap<
  string,
  LaunchRiskEngineFixture
> = new Map(LAUNCH_RISK_ENGINE_FIXTURES.map(fixture => [fixture.fixtureId, fixture]));

if (LAUNCH_RISK_ENGINE_FIXTURES.length < 8) {
  throw new Error(
    `Phase 58 fixture count mismatch: expected >= 8, received ${LAUNCH_RISK_ENGINE_FIXTURES.length}`,
  );
}

if (
  LAUNCH_RISK_ENGINE_ASSESSMENT_NAMES.length !==
  LAUNCH_RISK_ENGINE_ASSESSMENT_KINDS.length
) {
  throw new Error('Phase 58 assessment name/kind cardinality mismatch');
}

export function listLaunchRiskEngineFixtures(): readonly LaunchRiskEngineFixture[] {
  return LAUNCH_RISK_ENGINE_FIXTURES;
}

export function getLaunchRiskEngineFixture(
  fixtureId: string,
): LaunchRiskEngineFixture | null {
  return LAUNCH_RISK_ENGINE_FIXTURE_MAP.get(fixtureId) ?? null;
}

export {
  LAUNCH_RISK_ENGINE_ASSESSMENT_NAMES,
  LAUNCH_RISK_ENGINE_ASSESSMENT_KINDS,
};

export type {
  LaunchRiskEngineAssessmentName,
  LaunchRiskEngineAssessmentKind,
};
