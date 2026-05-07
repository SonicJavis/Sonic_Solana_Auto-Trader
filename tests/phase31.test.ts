/**
 * Phase 31 — Wallet Cluster Fixture Models v1
 */

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import {
  BENIGN_LOW_ACTIVITY_CLUSTER_FIXTURE,
  BOT_NOISE_CLUSTER_FIXTURE,
  COORDINATED_SELL_RISK_CLUSTER_FIXTURE,
  CREATOR_LINKED_CLUSTER_FIXTURE,
  FAST_DUMP_RISK_CLUSTER_FIXTURE,
  FRESH_WALLET_FARM_CLUSTER_FIXTURE,
  HIGH_QUALITY_SMART_ACCUMULATOR_CLUSTER_FIXTURE,
  HIGH_RISK_MULTI_SIGNAL_CLUSTER_FIXTURE,
  KNOWN_RUG_CLUSTER_FIXTURE_MODEL,
  LOW_SIGNAL_UNKNOWN_CLUSTER_FIXTURE,
  MALFORMED_INPUT_SAFE_CLUSTER_FIXTURE,
  MIXED_SIGNAL_CLUSTER_FIXTURE,
  PHASE_31_WALLET_CLUSTER_FIXTURES,
  PHASE_31_WALLET_CLUSTER_GENERATED_AT,
  PROFITABLE_LEADER_CLUSTER_FIXTURE,
  SAFETY_BOUNDARY_CLUSTER_FIXTURE,
  SAME_FUNDING_SOURCE_CLUSTER_FIXTURE,
  WALLET_CLUSTER_INTELLIGENCE_FIXTURE_KINDS,
  WALLET_CLUSTER_INTELLIGENCE_FIXTURE_NAMES,
  areWalletClusterIntelligenceFixturesEqual,
  buildWalletClusterIntelligenceFixture,
  buildWalletClusterIntelligenceSummary,
  getWalletClusterFixtureModelCapabilities,
  getWalletClusterIntelligenceFixture,
  isWalletClusterIntelligenceFixtureSerializable,
  listWalletClusterIntelligenceFixtures,
  normalizeWalletClusterIntelligenceFixture,
  serializeWalletClusterIntelligenceFixture,
  validateWalletClusterIntelligenceFixture,
  validateWalletClusterIntelligenceSafety,
} from '@sonic/wallet-intelligence';
import { getDashboardUiShellCapabilities } from '@sonic/dashboard';
import { getLocalReadOnlyApiCapabilities } from '@sonic/read-only-api';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const WALLET_SRC = resolve(REPO_ROOT, 'packages/wallet-intelligence/src');

const PHASE_31_FILES = [
  'cluster-fixture-model-types.ts',
  'cluster-fixture-model-capabilities.ts',
  'cluster-fixture-model-normalization.ts',
  'cluster-fixture-model-validation.ts',
  'cluster-fixture-model-builders.ts',
  'cluster-fixture-model-fixtures.ts',
].map(file => resolve(WALLET_SRC, file));

const NON_VALIDATION_PHASE_31_FILES = PHASE_31_FILES.filter(file => !file.endsWith('validation.ts'));

const FIXTURE_EXPORTS = [
  HIGH_QUALITY_SMART_ACCUMULATOR_CLUSTER_FIXTURE,
  PROFITABLE_LEADER_CLUSTER_FIXTURE,
  FAST_DUMP_RISK_CLUSTER_FIXTURE,
  FRESH_WALLET_FARM_CLUSTER_FIXTURE,
  CREATOR_LINKED_CLUSTER_FIXTURE,
  SAME_FUNDING_SOURCE_CLUSTER_FIXTURE,
  BOT_NOISE_CLUSTER_FIXTURE,
  KNOWN_RUG_CLUSTER_FIXTURE_MODEL,
  LOW_SIGNAL_UNKNOWN_CLUSTER_FIXTURE,
  COORDINATED_SELL_RISK_CLUSTER_FIXTURE,
  MIXED_SIGNAL_CLUSTER_FIXTURE,
  SAFETY_BOUNDARY_CLUSTER_FIXTURE,
  HIGH_RISK_MULTI_SIGNAL_CLUSTER_FIXTURE,
  BENIGN_LOW_ACTIVITY_CLUSTER_FIXTURE,
  MALFORMED_INPUT_SAFE_CLUSTER_FIXTURE,
] as const;

const FIXTURE_BY_NAME = new Map(FIXTURE_EXPORTS.map(fixture => [fixture.name, fixture]));

const FORBIDDEN_PAYLOAD_PATTERNS: readonly RegExp[] = [
  /TypeError:\s/,
  /ReferenceError:\s/,
  /SyntaxError:\s/,
  /\/home\//,
  /\/Users\//,
  /C:\\Users\\/,
  /BEGIN PRIVATE KEY/,
  /\bseed phrase\b/i,
  /\bmnemonic\b/i,
  /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
  /\b(?:https?:\/\/|www\.)\S+/i,
  /\b(?:investment advice|recommendation|trading signal|buy now|sell now)\b/i,
];

describe('Phase 31 — module exports', () => {
  const exportedFunctions: Array<[string, unknown]> = [
    ['buildWalletClusterIntelligenceFixture', buildWalletClusterIntelligenceFixture],
    ['buildWalletClusterIntelligenceSummary', buildWalletClusterIntelligenceSummary],
    ['normalizeWalletClusterIntelligenceFixture', normalizeWalletClusterIntelligenceFixture],
    ['serializeWalletClusterIntelligenceFixture', serializeWalletClusterIntelligenceFixture],
    ['isWalletClusterIntelligenceFixtureSerializable', isWalletClusterIntelligenceFixtureSerializable],
    ['areWalletClusterIntelligenceFixturesEqual', areWalletClusterIntelligenceFixturesEqual],
    ['validateWalletClusterIntelligenceFixture', validateWalletClusterIntelligenceFixture],
    ['validateWalletClusterIntelligenceSafety', validateWalletClusterIntelligenceSafety],
    ['listWalletClusterIntelligenceFixtures', listWalletClusterIntelligenceFixtures],
    ['getWalletClusterIntelligenceFixture', getWalletClusterIntelligenceFixture],
    ['getWalletClusterFixtureModelCapabilities', getWalletClusterFixtureModelCapabilities],
  ];

  exportedFunctions.forEach(([name, value]) => {
    it(`${name} is exported`, () => {
      expect(typeof value).toBe('function');
    });
  });

  it('fixture names list has 15 entries', () => {
    expect(WALLET_CLUSTER_INTELLIGENCE_FIXTURE_NAMES.length).toBe(15);
  });

  it('fixture kinds list has 15 entries', () => {
    expect(WALLET_CLUSTER_INTELLIGENCE_FIXTURE_KINDS.length).toBe(15);
  });

  it('phase 31 fixture map has 15 entries', () => {
    expect(PHASE_31_WALLET_CLUSTER_FIXTURES.size).toBe(15);
  });

  it('PHASE_31_WALLET_CLUSTER_GENERATED_AT is a deterministic ISO timestamp', () => {
    expect(PHASE_31_WALLET_CLUSTER_GENERATED_AT).toBe('2026-01-01T00:00:00.000Z');
  });
});

describe('Phase 31 — fixture list and lookup helpers', () => {
  it('listWalletClusterIntelligenceFixtures returns 15 sorted names', () => {
    const names = listWalletClusterIntelligenceFixtures();
    expect(names.length).toBe(15);
    expect(names).toEqual([...names].sort());
  });

  WALLET_CLUSTER_INTELLIGENCE_FIXTURE_NAMES.forEach(name => {
    it(`getWalletClusterIntelligenceFixture resolves ${name}`, () => {
      expect(getWalletClusterIntelligenceFixture(name)?.name).toBe(name);
    });
  });

  it('getWalletClusterIntelligenceFixture returns undefined for an unknown name', () => {
    expect(getWalletClusterIntelligenceFixture('unknown-cluster' as never)).toBeUndefined();
  });
});

describe('Phase 31 — required fixture names exist', () => {
  const requiredNames: readonly string[] = [
    'high-quality-smart-accumulator-cluster',
    'profitable-leader-cluster',
    'fast-dump-risk-cluster',
    'fresh-wallet-farm-cluster',
    'creator-linked-cluster',
    'same-funding-source-cluster',
    'bot-noise-cluster',
    'known-rug-cluster',
    'low-signal-unknown-cluster',
    'coordinated-sell-risk-cluster',
    'mixed-signal-cluster',
    'safety-boundary-cluster',
    'high-risk-multi-signal-cluster',
    'benign-low-activity-cluster',
    'malformed-input-safe-cluster',
  ];

  requiredNames.forEach(name => {
    it(`fixture "${name}" exists in FIXTURE_BY_NAME`, () => {
      expect(FIXTURE_BY_NAME.has(name as never)).toBe(true);
    });
  });
});

describe('Phase 31 — all fixtures pass validation', () => {
  FIXTURE_EXPORTS.forEach(fixture => {
    it(`${fixture.name} passes validateWalletClusterIntelligenceFixture`, () => {
      const result = validateWalletClusterIntelligenceFixture(fixture);
      expect(result.valid).toBe(true);
      expect(result.issues).toHaveLength(0);
    });
  });
});

describe('Phase 31 — all fixtures pass safety check', () => {
  FIXTURE_EXPORTS.forEach(fixture => {
    it(`${fixture.name} passes validateWalletClusterIntelligenceSafety`, () => {
      const result = validateWalletClusterIntelligenceSafety(fixture);
      expect(result.safe).toBe(true);
      expect(result.violations).toHaveLength(0);
    });
  });
});

describe('Phase 31 — safety invariants on every fixture', () => {
  FIXTURE_EXPORTS.forEach(fixture => {
    it(`${fixture.name} has meta.liveData === false`, () => {
      expect(fixture.meta.liveData).toBe(false);
    });

    it(`${fixture.name} has meta.fixtureOnly === true`, () => {
      expect(fixture.meta.fixtureOnly).toBe(true);
    });

    it(`${fixture.name} has meta.syntheticOnly === true`, () => {
      expect(fixture.meta.syntheticOnly).toBe(true);
    });

    it(`${fixture.name} has meta.externalNetwork === false`, () => {
      expect(fixture.meta.externalNetwork).toBe(false);
    });

    it(`${fixture.name} has meta.persistence === false`, () => {
      expect(fixture.meta.persistence).toBe(false);
    });

    it(`${fixture.name} has meta.readOnly === true`, () => {
      expect(fixture.meta.readOnly).toBe(true);
    });

    it(`${fixture.name} has meta.nonAdvisory === true`, () => {
      expect(fixture.meta.nonAdvisory).toBe(true);
    });

    it(`${fixture.name} has meta.deterministic === true`, () => {
      expect(fixture.meta.deterministic).toBe(true);
    });

    it(`${fixture.name} has meta.phase === 31`, () => {
      expect(fixture.meta.phase).toBe(31);
    });

    it(`${fixture.name} has summary.fixtureOnly === true`, () => {
      expect(fixture.summary.fixtureOnly).toBe(true);
    });

    it(`${fixture.name} has summary.liveData === false`, () => {
      expect(fixture.summary.liveData).toBe(false);
    });

    it(`${fixture.name} has summary.externalNetwork === false`, () => {
      expect(fixture.summary.externalNetwork).toBe(false);
    });

    it(`${fixture.name} has summary.nonAdvisory === true`, () => {
      expect(fixture.summary.nonAdvisory).toBe(true);
    });

    it(`${fixture.name} has summary.safeToDisplay === true`, () => {
      expect(fixture.summary.safeToDisplay).toBe(true);
    });

    it(`${fixture.name} has summary.phase === 31`, () => {
      expect(fixture.summary.phase).toBe(31);
    });
  });
});

describe('Phase 31 — summary consistency', () => {
  FIXTURE_EXPORTS.forEach(fixture => {
    it(`${fixture.name} summary.name matches fixture name`, () => {
      expect(fixture.summary.name).toBe(fixture.name);
    });

    it(`${fixture.name} summary.kind matches fixture kind`, () => {
      expect(fixture.summary.kind).toBe(fixture.kind);
    });

    it(`${fixture.name} summary.clusterId matches profile.clusterId`, () => {
      expect(fixture.summary.clusterId).toBe(fixture.profile.clusterId);
    });

    it(`${fixture.name} summary.generatedAt matches meta.generatedAt`, () => {
      expect(fixture.summary.generatedAt).toBe(fixture.meta.generatedAt);
    });

    it(`${fixture.name} summary.qualityCount matches qualityIndicators length`, () => {
      expect(fixture.summary.qualityCount).toBe(fixture.qualityIndicators.length);
    });

    it(`${fixture.name} summary.riskCount matches riskIndicators length`, () => {
      expect(fixture.summary.riskCount).toBe(fixture.riskIndicators.length);
    });
  });
});

describe('Phase 31 — normalization and determinism', () => {
  FIXTURE_EXPORTS.forEach(fixture => {
    it(`${fixture.name} is already normalized`, () => {
      const normalized = normalizeWalletClusterIntelligenceFixture(fixture);
      expect(JSON.stringify(fixture)).toBe(JSON.stringify(normalized));
    });

    it(`${fixture.name} serializes deterministically`, () => {
      const s1 = serializeWalletClusterIntelligenceFixture(fixture);
      const s2 = serializeWalletClusterIntelligenceFixture(fixture);
      expect(s1).toBe(s2);
    });

    it(`${fixture.name} is serializable`, () => {
      expect(isWalletClusterIntelligenceFixtureSerializable(fixture)).toBe(true);
    });
  });

  it('areWalletClusterIntelligenceFixturesEqual returns true for same fixture', () => {
    expect(
      areWalletClusterIntelligenceFixturesEqual(
        HIGH_QUALITY_SMART_ACCUMULATOR_CLUSTER_FIXTURE,
        HIGH_QUALITY_SMART_ACCUMULATOR_CLUSTER_FIXTURE,
      ),
    ).toBe(true);
  });

  it('areWalletClusterIntelligenceFixturesEqual returns false for different fixtures', () => {
    expect(
      areWalletClusterIntelligenceFixturesEqual(
        HIGH_QUALITY_SMART_ACCUMULATOR_CLUSTER_FIXTURE,
        KNOWN_RUG_CLUSTER_FIXTURE_MODEL,
      ),
    ).toBe(false);
  });
});

describe('Phase 31 — payload forbidden content', () => {
  FIXTURE_EXPORTS.forEach(fixture => {
    FORBIDDEN_PAYLOAD_PATTERNS.forEach(pattern => {
      it(`${fixture.name} payload does not match ${pattern}`, () => {
        const payloadStr = JSON.stringify(fixture);
        expect(pattern.test(payloadStr)).toBe(false);
      });
    });
  });
});

describe('Phase 31 — specific fixture properties', () => {
  it('high-quality-smart-accumulator-cluster has smart_accumulators cluster type', () => {
    expect(HIGH_QUALITY_SMART_ACCUMULATOR_CLUSTER_FIXTURE.profile.clusterType).toBe('smart_accumulators');
  });

  it('known-rug-cluster has critical risk assessment', () => {
    expect(KNOWN_RUG_CLUSTER_FIXTURE_MODEL.summary.riskAssessment).toBe('critical');
  });

  it('bot-noise-cluster has high coordination assessment', () => {
    expect(BOT_NOISE_CLUSTER_FIXTURE.summary.coordinationAssessment).toBe('high');
  });

  it('low-signal-unknown-cluster has risk-dominant signal balance due to INSUFFICIENT_DATA indicator', () => {
    expect(LOW_SIGNAL_UNKNOWN_CLUSTER_FIXTURE.summary.signalBalance).toBe('risk-dominant');
  });

  it('fresh-wallet-farm-cluster has high coordination band', () => {
    expect(FRESH_WALLET_FARM_CLUSTER_FIXTURE.profile.coordinationBand).toBe('high');
  });

  it('safety-boundary-cluster passes validation', () => {
    expect(validateWalletClusterIntelligenceFixture(SAFETY_BOUNDARY_CLUSTER_FIXTURE).valid).toBe(true);
    expect(validateWalletClusterIntelligenceSafety(SAFETY_BOUNDARY_CLUSTER_FIXTURE).safe).toBe(true);
  });

  it('high-risk-multi-signal-cluster has risk-dominant signal balance', () => {
    expect(HIGH_RISK_MULTI_SIGNAL_CLUSTER_FIXTURE.summary.signalBalance).toBe('risk-dominant');
  });

  it('high-quality-smart-accumulator-cluster has quality-dominant signal balance', () => {
    expect(HIGH_QUALITY_SMART_ACCUMULATOR_CLUSTER_FIXTURE.summary.signalBalance).toBe('quality-dominant');
  });

  it('malformed-input-safe-cluster passes validation', () => {
    expect(validateWalletClusterIntelligenceFixture(MALFORMED_INPUT_SAFE_CLUSTER_FIXTURE).valid).toBe(true);
  });

  it('fast-dump-risk-cluster has high dump risk assessment', () => {
    expect(FAST_DUMP_RISK_CLUSTER_FIXTURE.summary.dumpRiskAssessment).toBe('high');
  });
});

describe('Phase 31 — validation edge cases', () => {
  it('validateWalletClusterIntelligenceFixture rejects null', () => {
    const result = validateWalletClusterIntelligenceFixture(null);
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.code === 'INVALID_FIXTURE_OBJECT')).toBe(true);
  });

  it('validateWalletClusterIntelligenceFixture rejects non-object', () => {
    const result = validateWalletClusterIntelligenceFixture('not-an-object');
    expect(result.valid).toBe(false);
  });

  it('validateWalletClusterIntelligenceSafety rejects null', () => {
    const result = validateWalletClusterIntelligenceSafety(null);
    expect(result.safe).toBe(false);
    expect(result.violations.length).toBeGreaterThan(0);
  });

  it('validateWalletClusterIntelligenceFixture rejects wrong phase', () => {
    const bad = { ...SAFETY_BOUNDARY_CLUSTER_FIXTURE, meta: { ...SAFETY_BOUNDARY_CLUSTER_FIXTURE.meta, phase: 30 } };
    const result = validateWalletClusterIntelligenceFixture(bad as never);
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.code === 'INVALID_PHASE')).toBe(true);
  });

  it('validateWalletClusterIntelligenceFixture rejects liveData true', () => {
    const bad = { ...SAFETY_BOUNDARY_CLUSTER_FIXTURE, meta: { ...SAFETY_BOUNDARY_CLUSTER_FIXTURE.meta, liveData: true } };
    const result = validateWalletClusterIntelligenceFixture(bad as never);
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.code === 'LIVE_DATA_FORBIDDEN')).toBe(true);
  });

  it('validateWalletClusterIntelligenceFixture rejects unsupported name', () => {
    const bad = { ...SAFETY_BOUNDARY_CLUSTER_FIXTURE, name: 'not-a-valid-name' };
    const result = validateWalletClusterIntelligenceFixture(bad as never);
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.code === 'UNSUPPORTED_FIXTURE_NAME')).toBe(true);
  });

  it('buildWalletClusterIntelligenceFixture fails with invalid name', () => {
    const result = buildWalletClusterIntelligenceFixture({
      name: 'not-a-valid-name',
      kind: 'unknown',
      profile: {
        clusterId: 'test_cluster',
        clusterType: 'unknown_fixture',
        displayLabel: 'Test',
        sizeBand: 'unknown',
        ageBand: 'unknown',
        coordinationBand: 'unknown',
      },
      history: {
        observedLaunchCount: 0,
        averageHoldTimeBand: 'unknown',
        profitabilityBand: 'unknown',
        dumpSpeedBand: 'unknown',
        notes: [],
      },
    });
    expect(result.success).toBe(false);
    expect(result.fixture).toBeNull();
    expect(result.validation.valid).toBe(false);
  });
});

describe('Phase 31 — builder summary rebuild', () => {
  it('summary builder is compatible with all exported fixtures', () => {
    FIXTURE_EXPORTS.forEach(fixture => {
      const { summary, ...fixtureWithoutSummary } = fixture;
      expect(buildWalletClusterIntelligenceSummary(fixtureWithoutSummary)).toEqual(summary);
    });
  });
});

describe('Phase 31 — capabilities', () => {
  it('getWalletClusterFixtureModelCapabilities returns correct shape', () => {
    const caps = getWalletClusterFixtureModelCapabilities();
    expect(caps.walletClusterIntelligenceFixtures).toBe(true);
    expect(caps.syntheticWalletClusters).toBe(true);
    expect(caps.walletClusterSignalFixtures).toBe(true);
    expect(caps.walletClusterRiskIndicators).toBe(true);
    expect(caps.walletClusterQualityIndicators).toBe(true);
    expect(caps.walletClusterFixtureSafetyValidation).toBe(true);
    expect(caps.walletClusterLiveData).toBe(false);
    expect(caps.walletClusterChainAccess).toBe(false);
    expect(caps.walletClusterRpcAccess).toBe(false);
    expect(caps.walletClusterIdentityResolution).toBe(false);
    expect(caps.walletClusterInvestmentAdvice).toBe(false);
    expect(caps.walletClusterTradingSignals).toBe(false);
    expect(caps.walletClusterExternalNetwork).toBe(false);
    expect(caps.walletClusterPersistence).toBe(false);
  });

  it('dashboard capabilities include Phase 31 wallet cluster flags', () => {
    const caps = getDashboardUiShellCapabilities();
    expect(caps.walletClusterIntelligenceFixtures).toBe(true);
    expect(caps.syntheticWalletClusters).toBe(true);
    expect(caps.walletClusterSignalFixtures).toBe(true);
    expect(caps.walletClusterRiskIndicators).toBe(true);
    expect(caps.walletClusterQualityIndicators).toBe(true);
    expect(caps.walletClusterFixtureSafetyValidation).toBe(true);
    expect(caps.walletClusterLiveData).toBe(false);
    expect(caps.walletClusterExternalNetwork).toBe(false);
    expect(caps.walletClusterPersistence).toBe(false);
  });

  it('read-only-api capabilities include Phase 31 wallet cluster flags', () => {
    const caps = getLocalReadOnlyApiCapabilities();
    expect(caps.walletClusterIntelligenceFixtures).toBe(true);
    expect(caps.syntheticWalletClusters).toBe(true);
    expect(caps.walletClusterSignalFixtures).toBe(true);
    expect(caps.walletClusterRiskIndicators).toBe(true);
    expect(caps.walletClusterQualityIndicators).toBe(true);
    expect(caps.walletClusterFixtureSafetyValidation).toBe(true);
    expect(caps.walletClusterLiveData).toBe(false);
    expect(caps.walletClusterExternalNetwork).toBe(false);
    expect(caps.walletClusterPersistence).toBe(false);
  });
});

describe('Phase 31 — runtime source safety checks', () => {
  it('all phase31 source files exist and are non-empty', () => {
    PHASE_31_FILES.forEach(file => {
      expect(readFileSync(file, 'utf-8').length).toBeGreaterThan(0);
    });
  });

  const forbiddenRuntimeTerms: readonly string[] = [
    'fetch(',
    'axios',
    'WebSocket',
    'child_process',
    'exec(',
    'eval(',
    'new Function',
    'localStorage',
    'sessionStorage',
    'IndexedDB',
    'document.cookie',
    'Date.now',
    'new Date(',
    'Math.random',
    'setTimeout',
    'setInterval',
    'fs.writeFile',
    'writeFileSync',
    'createWriteStream',
    'signTransaction',
    'sendTransaction',
    'swap',
    'wallet.connect',
  ];

  forbiddenRuntimeTerms.forEach(term => {
    it(`non-validation phase31 runtime files do not contain ${term}`, () => {
      NON_VALIDATION_PHASE_31_FILES.forEach(file => {
        expect(readFileSync(file, 'utf-8')).not.toContain(term);
      });
    });
  });

  it('phase31 runtime files do not import http/https/fs modules', () => {
    PHASE_31_FILES.forEach(file => {
      const content = readFileSync(file, 'utf-8');
      expect(content).not.toContain("from 'http'");
      expect(content).not.toContain('from "http"');
      expect(content).not.toContain("from 'https'");
      expect(content).not.toContain('from "https"');
      expect(content).not.toContain("from 'node:http'");
      expect(content).not.toContain("from 'node:https'");
      expect(content).not.toContain("from 'node:fs'");
    });
  });
});

describe('Phase 31 — compatibility and regression checks', () => {
  it('fixture exports are reachable through the package root', () => {
    expect(FIXTURE_BY_NAME.get('high-quality-smart-accumulator-cluster')).toBe(
      HIGH_QUALITY_SMART_ACCUMULATOR_CLUSTER_FIXTURE,
    );
  });

  it('safety-boundary fixture remains safe and valid', () => {
    expect(validateWalletClusterIntelligenceFixture(SAFETY_BOUNDARY_CLUSTER_FIXTURE).valid).toBe(true);
    expect(validateWalletClusterIntelligenceSafety(SAFETY_BOUNDARY_CLUSTER_FIXTURE).safe).toBe(true);
  });

  it('all 15 fixtures are unique by name', () => {
    const names = FIXTURE_EXPORTS.map(f => f.name);
    expect(new Set(names).size).toBe(15);
  });

  it('all 15 fixtures are unique by clusterId', () => {
    const ids = FIXTURE_EXPORTS.map(f => f.profile.clusterId);
    expect(new Set(ids).size).toBe(15);
  });

  it('fixture names array is sorted', () => {
    const names = [...WALLET_CLUSTER_INTELLIGENCE_FIXTURE_NAMES];
    expect(names).toEqual([...names].sort());
  });

  it('listWalletClusterIntelligenceFixtures returns sorted names matching WALLET_CLUSTER_INTELLIGENCE_FIXTURE_NAMES', () => {
    const listed = listWalletClusterIntelligenceFixtures();
    const sorted = [...WALLET_CLUSTER_INTELLIGENCE_FIXTURE_NAMES].sort();
    expect([...listed]).toEqual(sorted);
  });
});
