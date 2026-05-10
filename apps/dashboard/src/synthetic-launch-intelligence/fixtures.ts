/**
 * Phase 53 — Synthetic Launch Intelligence Foundation v1: fixtures.
 */

import { buildSyntheticLaunchIntelligenceFixture } from './builders.js';
import {
  SYNTHETIC_LAUNCH_INTELLIGENCE_SCENARIO_KINDS,
  SYNTHETIC_LAUNCH_INTELLIGENCE_SCENARIO_NAMES,
  type SyntheticLaunchIntelligenceFixture,
  type SyntheticLaunchIntelligenceScenarioKind,
  type SyntheticLaunchIntelligenceScenarioName,
} from './types.js';

export const SYNTHETIC_LAUNCH_INTELLIGENCE_FIXTURES =
  SYNTHETIC_LAUNCH_INTELLIGENCE_SCENARIO_NAMES.map(fixtureName =>
    buildSyntheticLaunchIntelligenceFixture({ fixtureName }),
  ) satisfies readonly SyntheticLaunchIntelligenceFixture[];

export const SYNTHETIC_LAUNCH_INTELLIGENCE_FIXTURE_MAP: ReadonlyMap<
  string,
  SyntheticLaunchIntelligenceFixture
> = new Map(SYNTHETIC_LAUNCH_INTELLIGENCE_FIXTURES.map(fixture => [fixture.fixtureId, fixture]));

if (SYNTHETIC_LAUNCH_INTELLIGENCE_FIXTURES.length < 8) {
  throw new Error(
    `Phase 53 fixture count mismatch: expected >= 8, received ${SYNTHETIC_LAUNCH_INTELLIGENCE_FIXTURES.length}`,
  );
}

if (SYNTHETIC_LAUNCH_INTELLIGENCE_SCENARIO_NAMES.length !== SYNTHETIC_LAUNCH_INTELLIGENCE_SCENARIO_KINDS.length) {
  throw new Error('Phase 53 scenario name/kind cardinality mismatch');
}

export function listSyntheticLaunchIntelligenceFixtures(): readonly SyntheticLaunchIntelligenceFixture[] {
  return SYNTHETIC_LAUNCH_INTELLIGENCE_FIXTURES;
}

export function getSyntheticLaunchIntelligenceFixture(
  fixtureId: string,
): SyntheticLaunchIntelligenceFixture | null {
  return SYNTHETIC_LAUNCH_INTELLIGENCE_FIXTURE_MAP.get(fixtureId) ?? null;
}

export {
  SYNTHETIC_LAUNCH_INTELLIGENCE_SCENARIO_NAMES,
  SYNTHETIC_LAUNCH_INTELLIGENCE_SCENARIO_KINDS,
};

export type {
  SyntheticLaunchIntelligenceScenarioName,
  SyntheticLaunchIntelligenceScenarioKind,
};
