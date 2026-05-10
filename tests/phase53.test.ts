/**
 * Phase 53 — Synthetic Launch Intelligence Foundation v1 tests.
 */

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  SYNTHETIC_LAUNCH_INTELLIGENCE_PHASE,
  SYNTHETIC_LAUNCH_INTELLIGENCE_SCENARIO_NAMES,
  SYNTHETIC_LAUNCH_INTELLIGENCE_SCENARIO_KINDS,
  SYNTHETIC_LAUNCH_INTELLIGENCE_FIXTURES,
  SYNTHETIC_LAUNCH_INTELLIGENCE_FIXTURE_MAP,
  buildSyntheticLaunchIntelligenceFixture,
  buildSyntheticLaunchIntelligenceViewModel,
  buildSyntheticLaunchIntelligenceApiContract,
  listSyntheticLaunchIntelligenceFixtures,
  getSyntheticLaunchIntelligenceFixture,
  selectSyntheticLaunchIntelligenceFixture,
  normalizeSyntheticLaunchIntelligenceFixture,
  serializeSyntheticLaunchIntelligenceFixture,
  areSyntheticLaunchIntelligenceFixturesEqual,
  validateSyntheticLaunchIntelligenceFixture,
  validateSyntheticLaunchIntelligenceSafety,
  getSyntheticLaunchIntelligenceCapabilities,
} from '../apps/dashboard/src/synthetic-launch-intelligence/index.js';
import {
  SYNTHETIC_LAUNCH_INTELLIGENCE_PHASE as ROOT_SYNTHETIC_LAUNCH_INTELLIGENCE_PHASE,
  SYNTHETIC_LAUNCH_INTELLIGENCE_FIXTURES as ROOT_SYNTHETIC_LAUNCH_INTELLIGENCE_FIXTURES,
  listSyntheticLaunchIntelligenceFixtures as listRootSyntheticLaunchIntelligenceFixtures,
} from '../apps/dashboard/src/index.js';
import { getDashboardUiShellCapabilities } from '../apps/dashboard/src/capabilities.js';
import { getLocalReadOnlyApiCapabilities } from '../apps/read-only-api/src/capabilities.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const PHASE_53_SRC = resolve(REPO_ROOT, 'apps/dashboard/src/synthetic-launch-intelligence');
const PHASE_53_FILES = [
  'types.ts',
  'builders.ts',
  'fixtures.ts',
  'view-models.ts',
  'contracts.ts',
  'selectors.ts',
  'normalization.ts',
  'validation.ts',
  'capabilities.ts',
  'index.ts',
] as const;

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

describe('Phase 53 — constants, list/map helpers, and exports', () => {
  it('exposes expected phase constants and root exports', () => {
    expect(SYNTHETIC_LAUNCH_INTELLIGENCE_PHASE).toBe(53);
    expect(ROOT_SYNTHETIC_LAUNCH_INTELLIGENCE_PHASE).toBe(53);
    expect(SYNTHETIC_LAUNCH_INTELLIGENCE_SCENARIO_NAMES).toHaveLength(8);
    expect(SYNTHETIC_LAUNCH_INTELLIGENCE_SCENARIO_KINDS).toHaveLength(8);
    expect(listRootSyntheticLaunchIntelligenceFixtures()).toEqual(SYNTHETIC_LAUNCH_INTELLIGENCE_FIXTURES);
    expect(ROOT_SYNTHETIC_LAUNCH_INTELLIGENCE_FIXTURES).toEqual(SYNTHETIC_LAUNCH_INTELLIGENCE_FIXTURES);
  });

  it('has deterministic fixture map/list/get helpers', () => {
    expect(SYNTHETIC_LAUNCH_INTELLIGENCE_FIXTURES.length).toBeGreaterThanOrEqual(8);
    expect(listSyntheticLaunchIntelligenceFixtures()).toEqual(SYNTHETIC_LAUNCH_INTELLIGENCE_FIXTURES);

    for (const fixture of SYNTHETIC_LAUNCH_INTELLIGENCE_FIXTURES) {
      expect(SYNTHETIC_LAUNCH_INTELLIGENCE_FIXTURE_MAP.get(fixture.fixtureId)).toBe(fixture);
      expect(getSyntheticLaunchIntelligenceFixture(fixture.fixtureId)).toBe(fixture);
    }

    expect(getSyntheticLaunchIntelligenceFixture('unknown')).toBeNull();
  });
});

describe('Phase 53 — fixture structure and deterministic builders', () => {
  it('provides required synthetic scenario surfaces', () => {
    const ids = SYNTHETIC_LAUNCH_INTELLIGENCE_FIXTURES.map(fixture => fixture.fixtureId);
    const names = SYNTHETIC_LAUNCH_INTELLIGENCE_FIXTURES.map(fixture => fixture.fixtureName);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(names).size).toBe(names.length);

    for (const fixture of SYNTHETIC_LAUNCH_INTELLIGENCE_FIXTURES) {
      expect(fixture.tokenProfile.source).toBe('synthetic_fixture_only');
      expect(fixture.launchEvents.length).toBeGreaterThanOrEqual(8);
      expect(fixture.poolLiquiditySnapshots.length).toBeGreaterThan(0);
      expect(fixture.holderDistributionSnapshots.length).toBeGreaterThan(0);
      expect(Array.isArray(fixture.walletClusterIndicators)).toBe(true);
      expect(fixture.riskFactorSummaries.length).toBeGreaterThan(0);
      expect(fixture.viewModel.nonAdvisorySummary).toContain('not advisory');
      expect(fixture.apiContracts.list.contractKind).toBe('list');
      expect(fixture.apiContracts.detail.contractKind).toBe('detail');
      expect(fixture.apiContracts.summary.contractKind).toBe('summary');
      expect(fixture.apiContracts.errors).toHaveLength(2);
      expect(fixture.selectorExamples.length).toBeGreaterThan(0);
      expect(fixture.capabilityFlags.syntheticLaunchExecution).toBe(false);
      expect(fixture.safety.nonAdvisory).toBe(true);
    }
  });

  it('build helpers are deterministic', () => {
    const fixtureA = buildSyntheticLaunchIntelligenceFixture({ fixtureName: 'clean-launch-baseline' });
    const fixtureB = buildSyntheticLaunchIntelligenceFixture({ fixtureName: 'clean-launch-baseline' });
    expect(fixtureA).toEqual(fixtureB);

    const viewModelA = buildSyntheticLaunchIntelligenceViewModel(fixtureA);
    const viewModelB = buildSyntheticLaunchIntelligenceViewModel(fixtureB);
    expect(viewModelA).toEqual(viewModelB);

    const contractsA = buildSyntheticLaunchIntelligenceApiContract({ ...fixtureA, viewModel: viewModelA });
    const contractsB = buildSyntheticLaunchIntelligenceApiContract({ ...fixtureB, viewModel: viewModelB });
    expect(contractsA).toEqual(contractsB);
  });

  it('selectors return deterministic local-only results', () => {
    const fixture = SYNTHETIC_LAUNCH_INTELLIGENCE_FIXTURES[0];
    const selectedById = selectSyntheticLaunchIntelligenceFixture({ fixtureId: fixture?.fixtureId });
    expect(selectedById.matched).toBe(true);
    expect(selectedById.selectedFixtureId).toBe(fixture?.fixtureId);

    const selectedByKind = selectSyntheticLaunchIntelligenceFixture({ scenarioKind: 'safety_rejected' });
    expect(selectedByKind.selectedScenarioKind).toBe('safety_rejected');

    const unmatched = selectSyntheticLaunchIntelligenceFixture({
      fixtureId: 'phase53-missing',
      scenarioKind: 'safety_rejected',
    });
    expect(unmatched.matched).toBe(false);
  });
});

describe('Phase 53 — normalization, serialization, equality, and validation', () => {
  it('normalization and serialization are stable and equality is deterministic', () => {
    const base = clone(SYNTHETIC_LAUNCH_INTELLIGENCE_FIXTURES[0]);
    const scrambled = {
      ...clone(base),
      launchEvents: [...base.launchEvents].reverse(),
      poolLiquiditySnapshots: [...base.poolLiquiditySnapshots].reverse(),
      walletClusterIndicators: [...base.walletClusterIndicators].reverse(),
      riskFactorSummaries: [...base.riskFactorSummaries].reverse(),
      selectorExamples: [...base.selectorExamples].reverse(),
    };

    expect(normalizeSyntheticLaunchIntelligenceFixture(scrambled)).toEqual(
      normalizeSyntheticLaunchIntelligenceFixture(base),
    );
    expect(serializeSyntheticLaunchIntelligenceFixture(scrambled)).toBe(
      serializeSyntheticLaunchIntelligenceFixture(base),
    );
    expect(areSyntheticLaunchIntelligenceFixturesEqual(scrambled, base)).toBe(true);
  });

  it('validation passes for baseline fixtures and rejects corruption', () => {
    const fixture = clone(SYNTHETIC_LAUNCH_INTELLIGENCE_FIXTURES[0]);
    const validation = validateSyntheticLaunchIntelligenceFixture(fixture);
    expect(validation.issues).toEqual([]);
    expect(validation.valid).toBe(true);
    expect(validateSyntheticLaunchIntelligenceSafety(fixture)).toEqual({
      safe: true,
      violations: [],
    });

    const badPhase = { ...clone(fixture), phase: 999 };
    expect(validateSyntheticLaunchIntelligenceFixture(badPhase).valid).toBe(false);

    const badName = { ...clone(fixture), fixtureName: 'unsafe' };
    expect(validateSyntheticLaunchIntelligenceFixture(badName).valid).toBe(false);

    const badEvents = { ...clone(fixture), launchEvents: [{ eventOrder: 2 }, { eventOrder: 1 }] };
    expect(validateSyntheticLaunchIntelligenceFixture(badEvents).valid).toBe(false);

    const badCapabilities = {
      ...clone(fixture),
      capabilityFlags: {
        ...clone(fixture.capabilityFlags),
        syntheticLaunchNetworkAccess: true,
      },
    };
    expect(validateSyntheticLaunchIntelligenceFixture(badCapabilities).valid).toBe(false);

    const unsafeContent = {
      ...clone(fixture),
      unsafeText: 'https://unsafe.example fetch( wallet buy signTransaction',
    };
    const safety = validateSyntheticLaunchIntelligenceSafety(unsafeContent);
    expect(safety.safe).toBe(false);
    expect(safety.violations.length).toBeGreaterThan(0);
    expect(validateSyntheticLaunchIntelligenceFixture(unsafeContent).valid).toBe(false);
  });
});

describe('Phase 53 — capability propagation', () => {
  it('returns expected phase capabilities and propagates to dashboard/read-only-api surfaces', () => {
    const phaseCapabilities = getSyntheticLaunchIntelligenceCapabilities();
    expect(phaseCapabilities.syntheticLaunchIntelligence).toBe(true);
    expect(phaseCapabilities.syntheticLaunchApiContracts).toBe(true);
    expect(phaseCapabilities.syntheticLaunchExecution).toBe(false);
    expect(phaseCapabilities.syntheticLaunchRecommendations).toBe(false);

    const dashboardCapabilities = getDashboardUiShellCapabilities();
    expect(dashboardCapabilities.syntheticLaunchIntelligence).toBe(true);
    expect(dashboardCapabilities.syntheticLaunchNetworkAccess).toBe(false);

    const apiCapabilities = getLocalReadOnlyApiCapabilities();
    expect(apiCapabilities.syntheticLaunchIntelligence).toBe(true);
    expect(apiCapabilities.syntheticLaunchExecution).toBe(false);
  });
});

describe('Phase 53 — safety posture and source immutability checks', () => {
  it('does not mutate source fixtures when cloning and modifying test copy', () => {
    const source = SYNTHETIC_LAUNCH_INTELLIGENCE_FIXTURES[0];
    const cloneFixture = clone(source);
    cloneFixture.riskReview.rejectionReasons = ['mutated test clone'];
    expect(source.riskReview.rejectionReasons).not.toContain('mutated test clone');
  });

  it('all phase files exist and avoid nondeterministic primitives', () => {
    for (const file of PHASE_53_FILES) {
      const content = readFileSync(resolve(PHASE_53_SRC, file), 'utf-8');
      expect(content.length).toBeGreaterThan(0);
      expect(content).not.toMatch(/Date\.now\(/);
      expect(content).not.toMatch(/new Date\(/);
      expect(content).not.toMatch(/Math\.random\(/);
      expect(content).not.toMatch(/randomUUID\(/);
      expect(content).not.toMatch(/process\.env/);
      expect(content).not.toMatch(/setInterval\(/);
      expect(content).not.toMatch(/setTimeout\(/);
    }
  });

  it('does not contain runtime network/wallet/filesystem/DOM/server behavior', () => {
    for (const file of PHASE_53_FILES) {
      const content = readFileSync(resolve(PHASE_53_SRC, file), 'utf-8');
      if (file !== 'validation.ts') {
        expect(content).not.toMatch(/fetch\(/);
        expect(content).not.toMatch(/writeFile\(/);
        expect(content).not.toMatch(/createWriteStream\(/);
        expect(content).not.toMatch(/document\./);
        expect(content).not.toMatch(/window\./);
        expect(content).not.toMatch(/localStorage\./);
        expect(content).not.toMatch(/indexedDB\./);
        expect(content).not.toMatch(/\bfastify\b/i);
        expect(content).not.toMatch(/\bexpress\b/i);
        expect(content).not.toMatch(/listen\(/);
      }
    }
  });

  it('keeps synthetic-only identifiers and no real-looking token/wallet/creator addresses', () => {
    for (const fixture of SYNTHETIC_LAUNCH_INTELLIGENCE_FIXTURES) {
      expect(fixture.tokenProfile.tokenMintPlaceholderId).toMatch(/^synthetic-/);
      expect(fixture.creatorProfile.creatorFixtureId).toMatch(/^synthetic-/);
      for (const cluster of fixture.walletClusterIndicators) {
        expect(cluster.clusterId).toContain('phase53-fixture-');
      }
    }
  });
});
