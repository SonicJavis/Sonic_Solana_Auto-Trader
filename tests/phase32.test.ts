/**
 * Phase 32 — Bundle / Manipulation Evidence Fixture Models v1
 */

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import {
  BENIGN_HIGH_ACTIVITY_LAUNCH_PATTERN_EVIDENCE_FIXTURE,
  BOT_NOISE_FALSE_POSITIVE_PATTERN_EVIDENCE_FIXTURE,
  CLEAN_ORGANIC_LAUNCH_EVIDENCE_FIXTURE,
  COORDINATED_EARLY_BUY_PATTERN_EVIDENCE_FIXTURE,
  COORDINATED_EARLY_SELL_PATTERN_EVIDENCE_FIXTURE,
  CREATOR_LINKED_CONCENTRATION_PATTERN_EVIDENCE_FIXTURE,
  FRESH_WALLET_BURST_PATTERN_EVIDENCE_FIXTURE,
  HIGH_RISK_MANIPULATION_EVIDENCE_FIXTURE,
  MALFORMED_INPUT_SAFE_EVIDENCE_FIXTURE,
  MILD_CONCENTRATION_WATCHLIST_EVIDENCE_FIXTURE,
  MANIPULATION_EVIDENCE_FIXTURE_KINDS,
  MANIPULATION_EVIDENCE_FIXTURE_NAMES,
  PHASE_32_MANIPULATION_EVIDENCE_FIXTURES,
  PHASE_32_MANIPULATION_EVIDENCE_GENERATED_AT,
  PHASE_32_MANIPULATION_EVIDENCE_SOURCE,
  SAFETY_BOUNDARY_EVIDENCE_FIXTURE,
  SAME_BLOCK_BUNDLE_LIKE_CONCENTRATION_EVIDENCE_FIXTURE,
  SAME_FUNDING_SOURCE_SYNTHETIC_EVIDENCE_FIXTURE,
  STAGED_LIQUIDITY_PULL_RISK_PATTERN_EVIDENCE_FIXTURE,
  UNKNOWN_INSUFFICIENT_DATA_EVIDENCE_FIXTURE,
  MIXED_SIGNAL_MANIPULATION_EVIDENCE_FIXTURE,
  areManipulationEvidenceFixturesEqual,
  buildManipulationEvidenceCrossReferenceSummary,
  buildManipulationEvidenceFixture,
  buildManipulationEvidenceSummary,
  getManipulationEvidenceFixture,
  getManipulationEvidenceFixtureCapabilities,
  isManipulationEvidenceFixtureSerializable,
  listManipulationEvidenceFixtures,
  normalizeManipulationEvidenceFixture,
  serializeManipulationEvidenceFixture,
  validateManipulationEvidenceFixture,
  validateManipulationEvidenceSafety,
} from '@sonic/manipulation-detector';
import {
  CREATOR_INTELLIGENCE_FIXTURE_NAMES,
  getCreatorIntelligenceFixture,
} from '@sonic/creator-intelligence';
import {
  WALLET_CLUSTER_INTELLIGENCE_FIXTURE_NAMES,
  getWalletClusterIntelligenceFixture,
} from '@sonic/wallet-intelligence';
import { getDashboardUiShellCapabilities } from '@sonic/dashboard';
import { getLocalReadOnlyApiCapabilities } from '@sonic/read-only-api';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const MANIPULATION_SRC = resolve(REPO_ROOT, 'packages/manipulation-detector/src');

const PHASE_32_FILES = [
  'evidence-fixture-model-types.ts',
  'evidence-fixture-model-capabilities.ts',
  'evidence-fixture-model-normalization.ts',
  'evidence-fixture-model-validation.ts',
  'evidence-fixture-model-builders.ts',
  'evidence-fixture-model-fixtures.ts',
].map(file => resolve(MANIPULATION_SRC, file));

const NON_VALIDATION_PHASE_32_FILES = PHASE_32_FILES.filter(file => !file.endsWith('validation.ts'));

const FIXTURE_EXPORTS = [
  CLEAN_ORGANIC_LAUNCH_EVIDENCE_FIXTURE,
  MILD_CONCENTRATION_WATCHLIST_EVIDENCE_FIXTURE,
  SAME_BLOCK_BUNDLE_LIKE_CONCENTRATION_EVIDENCE_FIXTURE,
  COORDINATED_EARLY_BUY_PATTERN_EVIDENCE_FIXTURE,
  COORDINATED_EARLY_SELL_PATTERN_EVIDENCE_FIXTURE,
  FRESH_WALLET_BURST_PATTERN_EVIDENCE_FIXTURE,
  SAME_FUNDING_SOURCE_SYNTHETIC_EVIDENCE_FIXTURE,
  STAGED_LIQUIDITY_PULL_RISK_PATTERN_EVIDENCE_FIXTURE,
  CREATOR_LINKED_CONCENTRATION_PATTERN_EVIDENCE_FIXTURE,
  BOT_NOISE_FALSE_POSITIVE_PATTERN_EVIDENCE_FIXTURE,
  BENIGN_HIGH_ACTIVITY_LAUNCH_PATTERN_EVIDENCE_FIXTURE,
  HIGH_RISK_MANIPULATION_EVIDENCE_FIXTURE,
  MIXED_SIGNAL_MANIPULATION_EVIDENCE_FIXTURE,
  MALFORMED_INPUT_SAFE_EVIDENCE_FIXTURE,
  SAFETY_BOUNDARY_EVIDENCE_FIXTURE,
  UNKNOWN_INSUFFICIENT_DATA_EVIDENCE_FIXTURE,
] as const;

const FIXTURE_BY_NAME = new Map(FIXTURE_EXPORTS.map(fixture => [fixture.name, fixture]));
const CROSS_REFERENCED_FIXTURES = FIXTURE_EXPORTS.filter(
  fixture => fixture.crossReferenceSummary.referenceStatus !== 'none',
);

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
  /\b[1-9A-HJ-NP-Za-km-z]{32,44}\b/,
  /\b[1-9A-HJ-NP-Za-km-z]{64,88}\b/,
];

const FORBIDDEN_RUNTIME_PATTERNS: readonly RegExp[] = [
  /\bfetch\s*\(/,
  /\baxios\b/,
  /\bWebSocket\b/,
  /Date\.now\s*\(/,
  /new Date\s*\(/,
  /Math\.random\s*\(/,
  /setTimeout\s*\(/,
  /setInterval\s*\(/,
  /writeFileSync\s*\(/,
  /fs\.writeFile\s*\(/,
  /createWriteStream\s*\(/,
  /child_process/,
  /\bexec\s*\(/,
  /\beval\s*\(/,
  /new Function\s*\(/,
  /localStorage/,
  /sessionStorage/,
  /IndexedDB/,
  /document\.cookie/,
];

describe('Phase 32 — module exports', () => {
  const exportedFunctions: Array<[string, unknown]> = [
    ['buildManipulationEvidenceFixture', buildManipulationEvidenceFixture],
    ['buildManipulationEvidenceSummary', buildManipulationEvidenceSummary],
    ['buildManipulationEvidenceCrossReferenceSummary', buildManipulationEvidenceCrossReferenceSummary],
    ['normalizeManipulationEvidenceFixture', normalizeManipulationEvidenceFixture],
    ['serializeManipulationEvidenceFixture', serializeManipulationEvidenceFixture],
    ['isManipulationEvidenceFixtureSerializable', isManipulationEvidenceFixtureSerializable],
    ['areManipulationEvidenceFixturesEqual', areManipulationEvidenceFixturesEqual],
    ['validateManipulationEvidenceFixture', validateManipulationEvidenceFixture],
    ['validateManipulationEvidenceSafety', validateManipulationEvidenceSafety],
    ['listManipulationEvidenceFixtures', listManipulationEvidenceFixtures],
    ['getManipulationEvidenceFixture', getManipulationEvidenceFixture],
    ['getManipulationEvidenceFixtureCapabilities', getManipulationEvidenceFixtureCapabilities],
  ];

  exportedFunctions.forEach(([name, value]) => {
    it(`${name} is exported`, () => {
      expect(typeof value).toBe('function');
    });
  });

  it('fixture names list has 16 entries', () => {
    expect(MANIPULATION_EVIDENCE_FIXTURE_NAMES.length).toBe(16);
  });

  it('fixture kinds list has 16 entries', () => {
    expect(MANIPULATION_EVIDENCE_FIXTURE_KINDS.length).toBe(16);
  });

  it('phase 32 fixture map has 16 entries', () => {
    expect(PHASE_32_MANIPULATION_EVIDENCE_FIXTURES.size).toBe(16);
  });

  it('PHASE_32_MANIPULATION_EVIDENCE_GENERATED_AT is deterministic', () => {
    expect(PHASE_32_MANIPULATION_EVIDENCE_GENERATED_AT).toBe('2026-01-01T00:00:00.000Z');
  });

  it('PHASE_32_MANIPULATION_EVIDENCE_SOURCE is deterministic', () => {
    expect(PHASE_32_MANIPULATION_EVIDENCE_SOURCE).toBe(
      'phase32_bundle_manipulation_evidence_fixture_models_v1',
    );
  });
});

describe('Phase 32 — fixture list and lookup helpers', () => {
  it('listManipulationEvidenceFixtures returns 16 sorted names', () => {
    const names = listManipulationEvidenceFixtures();
    expect(names.length).toBe(16);
    expect(names).toEqual([...names].sort());
  });

  MANIPULATION_EVIDENCE_FIXTURE_NAMES.forEach(name => {
    it(`getManipulationEvidenceFixture resolves ${name}`, () => {
      expect(getManipulationEvidenceFixture(name)?.name).toBe(name);
    });
  });

  it('getManipulationEvidenceFixture returns undefined for an unknown name', () => {
    expect(getManipulationEvidenceFixture('unknown-phase32' as never)).toBeUndefined();
  });
});

describe('Phase 32 — required fixture names exist', () => {
  MANIPULATION_EVIDENCE_FIXTURE_NAMES.forEach(name => {
    it(`${name} exists in the exported list`, () => {
      expect(listManipulationEvidenceFixtures()).toContain(name);
    });

    it(`${name} exists in the exported fixture lookup maps`, () => {
      expect(PHASE_32_MANIPULATION_EVIDENCE_FIXTURES.has(name)).toBe(true);
      expect(FIXTURE_BY_NAME.has(name)).toBe(true);
    });
  });
});

describe('Phase 32 — all fixtures pass validation', () => {
  FIXTURE_EXPORTS.forEach(fixture => {
    it(`${fixture.name} passes validateManipulationEvidenceFixture`, () => {
      expect(validateManipulationEvidenceFixture(fixture)).toEqual({
        valid: true,
        issues: [],
      });
    });
  });
});

describe('Phase 32 — all fixtures pass safety validation', () => {
  FIXTURE_EXPORTS.forEach(fixture => {
    it(`${fixture.name} passes validateManipulationEvidenceSafety`, () => {
      expect(validateManipulationEvidenceSafety(fixture)).toEqual({
        safe: true,
        violations: [],
      });
    });
  });
});

describe('Phase 32 — safety invariants on every fixture', () => {
  FIXTURE_EXPORTS.forEach(fixture => {
    it(`${fixture.name} has a supported name`, () => {
      expect(MANIPULATION_EVIDENCE_FIXTURE_NAMES).toContain(fixture.name);
    });

    it(`${fixture.name} has a supported kind`, () => {
      expect(MANIPULATION_EVIDENCE_FIXTURE_KINDS).toContain(fixture.kind);
    });

    it(`${fixture.name} has deterministic meta fields`, () => {
      expect(fixture.meta.phase).toBe(32);
      expect(fixture.meta.generatedAt).toBe(PHASE_32_MANIPULATION_EVIDENCE_GENERATED_AT);
      expect(fixture.meta.source).toBe(PHASE_32_MANIPULATION_EVIDENCE_SOURCE);
      expect(fixture.meta.fixtureOnly).toBe(true);
      expect(fixture.meta.syntheticOnly).toBe(true);
      expect(fixture.meta.liveData).toBe(false);
      expect(fixture.meta.externalNetwork).toBe(false);
      expect(fixture.meta.persistence).toBe(false);
      expect(fixture.meta.deterministic).toBe(true);
      expect(fixture.meta.readOnly).toBe(true);
      expect(fixture.meta.nonAdvisory).toBe(true);
      expect(fixture.meta.nonAccusatory).toBe(true);
    });

    it(`${fixture.name} has deterministic summary fields`, () => {
      expect(fixture.summary.phase).toBe(32);
      expect(fixture.summary.name).toBe(fixture.name);
      expect(fixture.summary.kind).toBe(fixture.kind);
      expect(fixture.summary.generatedAt).toBe(PHASE_32_MANIPULATION_EVIDENCE_GENERATED_AT);
      expect(fixture.summary.fixtureOnly).toBe(true);
      expect(fixture.summary.liveData).toBe(false);
      expect(fixture.summary.externalNetwork).toBe(false);
      expect(fixture.summary.nonAdvisory).toBe(true);
      expect(fixture.summary.safeToDisplay).toBe(true);
      expect(fixture.summary.riskCount).toBe(fixture.riskIndicators.length);
      expect(fixture.summary.qualityCount).toBe(fixture.qualityIndicators.length);
    });

    it(`${fixture.name} has deterministic cross-reference summary fields`, () => {
      expect(fixture.crossReferenceSummary.generatedAt).toBe(
        PHASE_32_MANIPULATION_EVIDENCE_GENERATED_AT,
      );
      expect(fixture.crossReferenceSummary.fixtureOnly).toBe(true);
      expect(fixture.crossReferenceSummary.syntheticOnly).toBe(true);
      expect(fixture.crossReferenceSummary.nonAdvisory).toBe(true);
    });

    it(`${fixture.name} is serializable`, () => {
      expect(isManipulationEvidenceFixtureSerializable(fixture)).toBe(true);
      expect(() => JSON.parse(JSON.stringify(fixture))).not.toThrow();
    });

    it(`${fixture.name} stays equal after normalization`, () => {
      expect(
        areManipulationEvidenceFixturesEqual(
          fixture,
          normalizeManipulationEvidenceFixture(fixture),
        ),
      ).toBe(true);
    });

    it(`${fixture.name} uses sorted notes`, () => {
      expect(fixture.safeNotes).toEqual([...fixture.safeNotes].sort());
      expect(fixture.meta.notes).toEqual([...fixture.meta.notes].sort());
      expect(fixture.summary.notes).toEqual([...fixture.summary.notes].sort());
      expect(fixture.bundlePattern.notes).toEqual([...fixture.bundlePattern.notes].sort());
      expect(fixture.launchStructure.notes).toEqual([...fixture.launchStructure.notes].sort());
      expect(fixture.liquidityPattern.notes).toEqual([...fixture.liquidityPattern.notes].sort());
      expect(fixture.coordination.notes).toEqual([...fixture.coordination.notes].sort());
      expect(fixture.distribution.notes).toEqual([...fixture.distribution.notes].sort());
      expect(fixture.fundingPattern.notes).toEqual([...fixture.fundingPattern.notes].sort());
      expect(fixture.crossReferenceSummary.sharedSignals).toEqual([
        ...fixture.crossReferenceSummary.sharedSignals,
      ].sort());
      expect(fixture.crossReferenceSummary.cautionNotes).toEqual([
        ...fixture.crossReferenceSummary.cautionNotes,
      ].sort());
    });

    it(`${fixture.name} uses sorted indicator codes`, () => {
      expect(fixture.riskIndicators.map(indicator => indicator.code)).toEqual(
        [...fixture.riskIndicators.map(indicator => indicator.code)].sort(),
      );
      expect(fixture.qualityIndicators.map(indicator => indicator.code)).toEqual(
        [...fixture.qualityIndicators.map(indicator => indicator.code)].sort(),
      );
      expect(fixture.summary.topRiskCodes).toEqual([...fixture.summary.topRiskCodes].sort());
      expect(fixture.summary.topQualityCodes).toEqual([...fixture.summary.topQualityCodes].sort());
    });

    it(`${fixture.name} summary counts stay within top-code limits`, () => {
      expect(fixture.summary.topRiskCodes.length).toBeLessThanOrEqual(3);
      expect(fixture.summary.topQualityCodes.length).toBeLessThanOrEqual(3);
    });

    it(`${fixture.name} contains no unsafe payload patterns`, () => {
      const serialized = serializeManipulationEvidenceFixture(fixture);
      FORBIDDEN_PAYLOAD_PATTERNS.forEach(pattern => {
        expect(serialized).not.toMatch(pattern);
      });
    });

    it(`${fixture.name} uses fixture-only cross-reference names when present`, () => {
      if (fixture.crossReferenceSummary.creatorFixtureName) {
        expect(CREATOR_INTELLIGENCE_FIXTURE_NAMES).toContain(
          fixture.crossReferenceSummary.creatorFixtureName,
        );
      }
      if (fixture.crossReferenceSummary.walletClusterFixtureName) {
        expect(WALLET_CLUSTER_INTELLIGENCE_FIXTURE_NAMES).toContain(
          fixture.crossReferenceSummary.walletClusterFixtureName,
        );
      }
    });

    it(`${fixture.name} summary reference names match cross-reference summary`, () => {
      expect(fixture.summary.referencedCreatorFixtureName).toBe(
        fixture.crossReferenceSummary.creatorFixtureName,
      );
      expect(fixture.summary.referencedWalletClusterFixtureName).toBe(
        fixture.crossReferenceSummary.walletClusterFixtureName,
      );
    });

    it(`${fixture.name} preserves deterministic serialization`, () => {
      expect(serializeManipulationEvidenceFixture(fixture)).toBe(
        serializeManipulationEvidenceFixture(normalizeManipulationEvidenceFixture(fixture)),
      );
    });

    it(`${fixture.name} safe notes include phase-safe defaults`, () => {
      expect(fixture.safeNotes).toContain('Deterministic synthetic evidence only.');
      expect(fixture.safeNotes).toContain('Fixture-only local offline analysis support.');
      expect(fixture.safeNotes).toContain('Non-advisory and non-accusatory synthetic evidence.');
    });
  });
});

describe('Phase 32 — fixture-specific expectations', () => {
  const expectations = [
    ['clean', CLEAN_ORGANIC_LAUNCH_EVIDENCE_FIXTURE, 'none', 'stable', 'diverse', 'quality-dominant'],
    ['watchlist', MILD_CONCENTRATION_WATCHLIST_EVIDENCE_FIXTURE, 'watchlist', 'watchlist', 'diverse', 'balanced'],
    ['bundle-like', SAME_BLOCK_BUNDLE_LIKE_CONCENTRATION_EVIDENCE_FIXTURE, 'high', 'watchlist', 'linked', 'risk-dominant'],
    ['high-risk', HIGH_RISK_MANIPULATION_EVIDENCE_FIXTURE, 'high', 'high-risk', 'linked', 'risk-dominant'],
    ['mixed', MIXED_SIGNAL_MANIPULATION_EVIDENCE_FIXTURE, 'watchlist', 'watchlist', 'diverse', 'balanced'],
    ['unknown', UNKNOWN_INSUFFICIENT_DATA_EVIDENCE_FIXTURE, 'unknown', 'unknown', 'unknown', 'insufficient-data'],
  ] as const;

  expectations.forEach(([label, fixture, bundle, liquidity, funding, balance]) => {
    it(`${label} fixture has expected bundle assessment`, () => {
      expect(fixture.summary.bundleRiskAssessment).toBe(bundle);
    });

    it(`${label} fixture has expected liquidity assessment`, () => {
      expect(fixture.summary.liquidityAssessment).toBe(liquidity);
    });

    it(`${label} fixture has expected funding assessment`, () => {
      expect(fixture.summary.fundingAssessment).toBe(funding);
    });

    it(`${label} fixture has expected signal balance`, () => {
      expect(fixture.summary.signalBalance).toBe(balance);
    });
  });
});

describe('Phase 32 — normalization and builder behavior', () => {
  it('buildManipulationEvidenceSummary is deterministic', () => {
    const fixtureWithoutSummary = {
      name: CLEAN_ORGANIC_LAUNCH_EVIDENCE_FIXTURE.name,
      kind: CLEAN_ORGANIC_LAUNCH_EVIDENCE_FIXTURE.kind,
      bundlePattern: CLEAN_ORGANIC_LAUNCH_EVIDENCE_FIXTURE.bundlePattern,
      launchStructure: CLEAN_ORGANIC_LAUNCH_EVIDENCE_FIXTURE.launchStructure,
      liquidityPattern: CLEAN_ORGANIC_LAUNCH_EVIDENCE_FIXTURE.liquidityPattern,
      coordination: CLEAN_ORGANIC_LAUNCH_EVIDENCE_FIXTURE.coordination,
      distribution: CLEAN_ORGANIC_LAUNCH_EVIDENCE_FIXTURE.distribution,
      fundingPattern: CLEAN_ORGANIC_LAUNCH_EVIDENCE_FIXTURE.fundingPattern,
      riskIndicators: CLEAN_ORGANIC_LAUNCH_EVIDENCE_FIXTURE.riskIndicators,
      qualityIndicators: CLEAN_ORGANIC_LAUNCH_EVIDENCE_FIXTURE.qualityIndicators,
      crossReferenceSummary: CLEAN_ORGANIC_LAUNCH_EVIDENCE_FIXTURE.crossReferenceSummary,
      safeNotes: CLEAN_ORGANIC_LAUNCH_EVIDENCE_FIXTURE.safeNotes,
      meta: CLEAN_ORGANIC_LAUNCH_EVIDENCE_FIXTURE.meta,
    } as const;
    const summary = buildManipulationEvidenceSummary(fixtureWithoutSummary);
    expect(summary).toEqual(CLEAN_ORGANIC_LAUNCH_EVIDENCE_FIXTURE.summary);
  });

  it('buildManipulationEvidenceCrossReferenceSummary sorts shared signals and caution notes', () => {
    const summary = buildManipulationEvidenceCrossReferenceSummary({
      creatorFixtureName: 'coordinated-hype-creator',
      walletClusterFixtureName: 'creator-linked-cluster',
      sharedSignals: ['zeta', 'alpha', 'alpha'],
      cautionNotes: ['later', 'earlier'],
    });

    expect(summary).toMatchObject({
      creatorFixtureName: 'coordinated-hype-creator',
      walletClusterFixtureName: 'creator-linked-cluster',
      referenceStatus: 'creator-and-wallet',
      fixtureOnly: true,
      syntheticOnly: true,
      nonAdvisory: true,
      generatedAt: PHASE_32_MANIPULATION_EVIDENCE_GENERATED_AT,
    });
    expect(summary.sharedSignals).toEqual(['alpha', 'zeta']);
    expect(summary.cautionNotes).toEqual(['earlier', 'later']);
  });

  it('buildManipulationEvidenceCrossReferenceSummary supports creator-only references', () => {
    expect(
      buildManipulationEvidenceCrossReferenceSummary({
        creatorFixtureName: 'poor-disclosure-creator',
      }).referenceStatus,
    ).toBe('creator-only');
  });

  it('buildManipulationEvidenceCrossReferenceSummary supports wallet-only references', () => {
    expect(
      buildManipulationEvidenceCrossReferenceSummary({
        walletClusterFixtureName: 'same-funding-source-cluster',
      }).referenceStatus,
    ).toBe('wallet-only');
  });

  it('buildManipulationEvidenceCrossReferenceSummary supports empty references', () => {
    expect(buildManipulationEvidenceCrossReferenceSummary().referenceStatus).toBe('none');
  });

  it('buildManipulationEvidenceFixture does not mutate input', () => {
    const input = {
      name: 'clean-organic-launch-evidence',
      kind: 'organic-launch',
      bundlePattern: {
        ...CLEAN_ORGANIC_LAUNCH_EVIDENCE_FIXTURE.bundlePattern,
        notes: ['zeta', 'alpha'],
      },
      launchStructure: {
        ...CLEAN_ORGANIC_LAUNCH_EVIDENCE_FIXTURE.launchStructure,
        notes: ['beta', 'alpha'],
      },
      liquidityPattern: {
        ...CLEAN_ORGANIC_LAUNCH_EVIDENCE_FIXTURE.liquidityPattern,
        notes: ['beta', 'alpha'],
      },
      coordination: {
        ...CLEAN_ORGANIC_LAUNCH_EVIDENCE_FIXTURE.coordination,
        notes: ['beta', 'alpha'],
      },
      distribution: {
        ...CLEAN_ORGANIC_LAUNCH_EVIDENCE_FIXTURE.distribution,
        notes: ['beta', 'alpha'],
      },
      fundingPattern: {
        ...CLEAN_ORGANIC_LAUNCH_EVIDENCE_FIXTURE.fundingPattern,
        notes: ['beta', 'alpha'],
      },
      riskIndicators: [...CLEAN_ORGANIC_LAUNCH_EVIDENCE_FIXTURE.riskIndicators],
      qualityIndicators: [...CLEAN_ORGANIC_LAUNCH_EVIDENCE_FIXTURE.qualityIndicators],
      crossReferences: {
        creatorFixtureName: 'coordinated-hype-creator',
        sharedSignals: ['zeta', 'alpha'],
      },
      safeNotes: ['zeta', 'alpha'],
    } as const;

    const snapshot = JSON.stringify(input);
    const result = buildManipulationEvidenceFixture(input);

    expect(result.success).toBe(true);
    expect(JSON.stringify(input)).toBe(snapshot);
    expect(result.fixture?.safeNotes).toEqual(
      [
        'Deterministic synthetic evidence only.',
        'Fixture-only local offline analysis support.',
        'Non-advisory and non-accusatory synthetic evidence.',
        'alpha',
        'zeta',
      ].sort((left, right) => left.localeCompare(right)),
    );
  });

  it('normalizeManipulationEvidenceFixture sorts unsorted arrays', () => {
    const normalized = normalizeManipulationEvidenceFixture({
      ...CLEAN_ORGANIC_LAUNCH_EVIDENCE_FIXTURE,
      safeNotes: ['zeta', 'alpha'],
      meta: {
        ...CLEAN_ORGANIC_LAUNCH_EVIDENCE_FIXTURE.meta,
        notes: ['zeta', 'alpha'],
      },
      summary: {
        ...CLEAN_ORGANIC_LAUNCH_EVIDENCE_FIXTURE.summary,
        topRiskCodes: ['zeta', 'alpha'],
        topQualityCodes: ['zeta', 'alpha'],
        notes: ['zeta', 'alpha'],
      },
      crossReferenceSummary: {
        ...CLEAN_ORGANIC_LAUNCH_EVIDENCE_FIXTURE.crossReferenceSummary,
        sharedSignals: ['zeta', 'alpha'],
        cautionNotes: ['zeta', 'alpha'],
      },
    });

    expect(normalized.safeNotes).toEqual(['alpha', 'zeta']);
    expect(normalized.meta.notes).toEqual(['alpha', 'zeta']);
    expect(normalized.summary.topRiskCodes).toEqual(['alpha', 'zeta']);
    expect(normalized.summary.topQualityCodes).toEqual(['alpha', 'zeta']);
    expect(normalized.summary.notes).toEqual(['alpha', 'zeta']);
    expect(normalized.crossReferenceSummary.sharedSignals).toEqual(['alpha', 'zeta']);
    expect(normalized.crossReferenceSummary.cautionNotes).toEqual(['alpha', 'zeta']);
  });
});

describe('Phase 32 — negative validation and safety cases', () => {
  it('validateManipulationEvidenceFixture rejects null input', () => {
    expect(validateManipulationEvidenceFixture(null)).toEqual({
      valid: false,
      issues: [
        {
          code: 'INVALID_FIXTURE_OBJECT',
          field: 'fixture',
          message: 'Manipulation evidence fixture must be a non-null object.',
          severity: 'error',
        },
      ],
    });
  });

  it('validateManipulationEvidenceSafety rejects null input', () => {
    expect(validateManipulationEvidenceSafety(null)).toEqual({
      safe: false,
      violations: ['Manipulation evidence safety validation requires a non-null object.'],
    });
  });

  it('validateManipulationEvidenceFixture rejects unsupported names and kinds', () => {
    const result = validateManipulationEvidenceFixture({
      ...CLEAN_ORGANIC_LAUNCH_EVIDENCE_FIXTURE,
      name: 'unknown-name',
      kind: 'unknown-kind',
    });

    expect(result.valid).toBe(false);
    expect(result.issues.map(issue => issue.code)).toEqual(
      expect.arrayContaining(['UNSUPPORTED_FIXTURE_NAME', 'UNSUPPORTED_FIXTURE_KIND']),
    );
  });

  it('validateManipulationEvidenceFixture rejects unstable ordering', () => {
    const result = validateManipulationEvidenceFixture({
      ...CLEAN_ORGANIC_LAUNCH_EVIDENCE_FIXTURE,
      safeNotes: ['zeta', 'alpha'],
    });

    expect(result.valid).toBe(false);
    expect(result.issues.map(issue => issue.code)).toContain('UNSTABLE_ORDERING');
  });

  it('validateManipulationEvidenceFixture rejects invalid cross-reference status', () => {
    const result = validateManipulationEvidenceFixture({
      ...COORDINATED_EARLY_SELL_PATTERN_EVIDENCE_FIXTURE,
      crossReferenceSummary: {
        ...COORDINATED_EARLY_SELL_PATTERN_EVIDENCE_FIXTURE.crossReferenceSummary,
        referenceStatus: 'creator-and-wallet',
      },
    });

    expect(result.valid).toBe(false);
    expect(result.issues.map(issue => issue.code)).toContain('CROSS_REFERENCE_STATUS_MISMATCH');
  });

  it('validateManipulationEvidenceFixture rejects unsupported creator references', () => {
    const result = validateManipulationEvidenceFixture({
      ...COORDINATED_EARLY_SELL_PATTERN_EVIDENCE_FIXTURE,
      crossReferenceSummary: {
        ...COORDINATED_EARLY_SELL_PATTERN_EVIDENCE_FIXTURE.crossReferenceSummary,
        creatorFixtureName: 'not-a-creator' as never,
        referenceStatus: 'creator-and-wallet',
      },
    });

    expect(result.valid).toBe(false);
    expect(result.issues.map(issue => issue.code)).toContain('UNSUPPORTED_CROSS_REFERENCE_CREATOR');
  });

  it('validateManipulationEvidenceFixture rejects unsupported wallet references', () => {
    const result = validateManipulationEvidenceFixture({
      ...COORDINATED_EARLY_SELL_PATTERN_EVIDENCE_FIXTURE,
      crossReferenceSummary: {
        ...COORDINATED_EARLY_SELL_PATTERN_EVIDENCE_FIXTURE.crossReferenceSummary,
        walletClusterFixtureName: 'not-a-wallet-cluster' as never,
      },
    });

    expect(result.valid).toBe(false);
    expect(result.issues.map(issue => issue.code)).toContain('UNSUPPORTED_CROSS_REFERENCE_WALLET');
  });

  it('buildManipulationEvidenceFixture fails closed for unsupported names', () => {
    const result = buildManipulationEvidenceFixture({
      ...CLEAN_ORGANIC_LAUNCH_EVIDENCE_FIXTURE,
      name: 'not-supported',
      safeNotes: ['still safe'],
    });

    expect(result.success).toBe(false);
    expect(result.fixture).toBeNull();
    expect(result.validation.issues.map(issue => issue.code)).toContain('UNSUPPORTED_FIXTURE_NAME');
  });

  it('buildManipulationEvidenceFixture fails closed for unsafe content', () => {
    const result = buildManipulationEvidenceFixture({
      ...CLEAN_ORGANIC_LAUNCH_EVIDENCE_FIXTURE,
      safeNotes: ['contact me at person@example.com'],
    });

    expect(result.success).toBe(false);
    expect(result.fixture).toBeNull();
    expect(result.safety.safe).toBe(false);
  });

  it('validateManipulationEvidenceSafety rejects transaction-hash-like content', () => {
    const result = validateManipulationEvidenceSafety({
      note: '11111111111111111111111111111111',
    });

    expect(result.safe).toBe(false);
    expect(result.violations.join(' ')).toMatch(/wallet-address-like/i);
  });

  it('validateManipulationEvidenceSafety rejects bundle-id-like content', () => {
    const result = validateManipulationEvidenceSafety({
      note: 'bundle hash deadbeefdeadbeef',
    });

    expect(result.safe).toBe(false);
    expect(result.violations.join(' ')).toMatch(/bundle-id-like/i);
  });

  it('validateManipulationEvidenceSafety rejects live-data claims', () => {
    const result = validateManipulationEvidenceSafety({
      note: 'live data from jito mempool websocket',
    });

    expect(result.safe).toBe(false);
    expect(result.violations.join(' ')).toMatch(/live-data/i);
  });

  it('validateManipulationEvidenceSafety rejects investment language', () => {
    const result = validateManipulationEvidenceSafety({
      note: 'buy now with a price target',
    });

    expect(result.safe).toBe(false);
    expect(result.violations.join(' ')).toMatch(/investment-advice/i);
  });

  it('validateManipulationEvidenceSafety rejects execution language', () => {
    const result = validateManipulationEvidenceSafety({
      note: 'execute trade and connect wallet',
    });

    expect(result.safe).toBe(false);
    expect(result.violations.join(' ')).toMatch(/execution/i);
  });

  it('validateManipulationEvidenceSafety rejects accusation language', () => {
    const result = validateManipulationEvidenceSafety({
      note: 'proven manipulation by a real manipulator',
    });

    expect(result.safe).toBe(false);
    expect(result.violations.join(' ')).toMatch(/accusatory/i);
  });
});

describe('Phase 32 — capability compatibility surfaces', () => {
  it('getManipulationEvidenceFixtureCapabilities returns all expected Phase 32 flags', () => {
    expect(getManipulationEvidenceFixtureCapabilities()).toEqual({
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
    });
  });

  it('dashboard capability surface includes Phase 32 flags', () => {
    const caps = getDashboardUiShellCapabilities();
    expect(caps.manipulationEvidenceFixtures).toBe(true);
    expect(caps.syntheticBundleEvidence).toBe(true);
    expect(caps.syntheticLaunchStructureEvidence).toBe(true);
    expect(caps.syntheticLiquidityPatternEvidence).toBe(true);
    expect(caps.syntheticCoordinationEvidence).toBe(true);
    expect(caps.manipulationRiskIndicators).toBe(true);
    expect(caps.manipulationQualityIndicators).toBe(true);
    expect(caps.manipulationEvidenceSafetyValidation).toBe(true);
    expect(caps.manipulationLiveData).toBe(false);
    expect(caps.manipulationSolanaRpc).toBe(false);
    expect(caps.manipulationProviderApis).toBe(false);
    expect(caps.manipulationJitoIntegration).toBe(false);
    expect(caps.manipulationMempoolAccess).toBe(false);
    expect(caps.manipulationTradingSignals).toBe(false);
    expect(caps.manipulationInvestmentAdvice).toBe(false);
    expect(caps.manipulationExternalNetwork).toBe(false);
    expect(caps.manipulationPersistence).toBe(false);
    expect(caps.manipulationExecution).toBe(false);
  });

  it('read-only API capability surface includes Phase 32 flags', () => {
    const caps = getLocalReadOnlyApiCapabilities();
    expect(caps.manipulationEvidenceFixtures).toBe(true);
    expect(caps.syntheticBundleEvidence).toBe(true);
    expect(caps.syntheticLaunchStructureEvidence).toBe(true);
    expect(caps.syntheticLiquidityPatternEvidence).toBe(true);
    expect(caps.syntheticCoordinationEvidence).toBe(true);
    expect(caps.manipulationRiskIndicators).toBe(true);
    expect(caps.manipulationQualityIndicators).toBe(true);
    expect(caps.manipulationEvidenceSafetyValidation).toBe(true);
    expect(caps.manipulationLiveData).toBe(false);
    expect(caps.manipulationSolanaRpc).toBe(false);
    expect(caps.manipulationProviderApis).toBe(false);
    expect(caps.manipulationJitoIntegration).toBe(false);
    expect(caps.manipulationMempoolAccess).toBe(false);
    expect(caps.manipulationTradingSignals).toBe(false);
    expect(caps.manipulationInvestmentAdvice).toBe(false);
    expect(caps.manipulationExternalNetwork).toBe(false);
    expect(caps.manipulationPersistence).toBe(false);
    expect(caps.manipulationExecution).toBe(false);
  });
});

describe('Phase 32 — cross-reference compatibility', () => {
  CROSS_REFERENCED_FIXTURES.forEach(fixture => {
    it(`${fixture.name} resolves creator fixture references when present`, () => {
      if (!fixture.crossReferenceSummary.creatorFixtureName) {
        expect(fixture.crossReferenceSummary.referenceStatus === 'wallet-only').toBe(true);
        return;
      }
      expect(getCreatorIntelligenceFixture(fixture.crossReferenceSummary.creatorFixtureName)).toBeDefined();
    });

    it(`${fixture.name} resolves wallet-cluster references when present`, () => {
      if (!fixture.crossReferenceSummary.walletClusterFixtureName) {
        expect(fixture.crossReferenceSummary.referenceStatus === 'creator-only').toBe(true);
        return;
      }
      expect(getWalletClusterIntelligenceFixture(fixture.crossReferenceSummary.walletClusterFixtureName)).toBeDefined();
    });
  });
});

describe('Phase 32 — runtime source safety guards', () => {
  PHASE_32_FILES.forEach(file => {
    it(`${file} exists`, () => {
      expect(readFileSync(file, 'utf8')).toContain('Phase 32');
    });
  });

  NON_VALIDATION_PHASE_32_FILES.forEach(file => {
    it(`${file} contains no runtime network or timing APIs`, () => {
      const source = readFileSync(file, 'utf8');
      FORBIDDEN_RUNTIME_PATTERNS.forEach(pattern => {
        expect(source).not.toMatch(pattern);
      });
    });
  });

  it('validation source explicitly guards unsafe live-data and secret patterns', () => {
    const source = readFileSync(resolve(MANIPULATION_SRC, 'evidence-fixture-model-validation.ts'), 'utf8');
    expect(source).toContain('LIVE_DATA_PATTERN');
    expect(source).toContain('SECRET_PATTERN');
    expect(source).toContain('ACCUSATION_PATTERN');
    expect(source).toContain('SOLANA_ADDRESS_PATTERN');
    expect(source).toContain('TX_HASH_PATTERN');
    expect(source).toContain('BUNDLE_ID_PATTERN');
  });
});
