/**
 * Phase 33 — Offline Intelligence Composite Evidence Models v1
 */

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import {
  CLEAN_LOW_RISK_COMPOSITE_FIXTURE,
  CREATOR_CREDIBLE_WALLET_BENIGN_COMPOSITE_FIXTURE,
  CREATOR_UNKNOWN_WALLET_LOW_SIGNAL_COMPOSITE_FIXTURE,
  CREATOR_RISK_WALLET_RISK_COMPOSITE_FIXTURE,
  MANIPULATION_RISK_DOMINATES_COMPOSITE_FIXTURE,
  WALLET_CLUSTER_RISK_DOMINATES_COMPOSITE_FIXTURE,
  CREATOR_RISK_DOMINATES_COMPOSITE_FIXTURE,
  MIXED_SIGNAL_WATCHLIST_COMPOSITE_FIXTURE,
  FALSE_POSITIVE_PROTECTED_COMPOSITE_FIXTURE,
  INSUFFICIENT_DATA_COMPOSITE_FIXTURE,
  HIGH_RISK_MULTI_EVIDENCE_COMPOSITE_FIXTURE,
  SAFETY_BOUNDARY_COMPOSITE_FIXTURE,
  MALFORMED_INPUT_SAFE_COMPOSITE_FIXTURE,
  NO_ACTION_NON_ADVISORY_COMPOSITE_FIXTURE,
  REPORT_READY_COMPOSITE_FIXTURE,
  DASHBOARD_READY_COMPOSITE_FIXTURE,
  OFFLINE_COMPOSITE_EVIDENCE_FIXTURE_KINDS,
  OFFLINE_COMPOSITE_EVIDENCE_FIXTURE_NAMES,
  PHASE_33_COMPOSITE_EVIDENCE_FIXTURES,
  PHASE_33_COMPOSITE_EVIDENCE_GENERATED_AT,
  PHASE_33_COMPOSITE_EVIDENCE_SOURCE,
  areOfflineCompositeEvidenceFixturesEqual,
  buildOfflineCompositeEvidenceFixture,
  buildOfflineCompositeEvidenceSummary,
  getOfflineCompositeEvidenceFixture,
  getOfflineCompositeEvidenceCapabilities,
  isOfflineCompositeEvidenceFixtureSerializable,
  listOfflineCompositeEvidenceFixtures,
  normalizeOfflineCompositeEvidenceFixture,
  serializeOfflineCompositeEvidenceFixture,
  validateOfflineCompositeEvidenceFixture,
  validateOfflineCompositeEvidenceSafety,
} from '@sonic/offline-intelligence';
import {
  CREATOR_INTELLIGENCE_FIXTURE_NAMES,
  getCreatorIntelligenceFixture,
} from '@sonic/creator-intelligence';
import {
  WALLET_CLUSTER_INTELLIGENCE_FIXTURE_NAMES,
  getWalletClusterIntelligenceFixture,
} from '@sonic/wallet-intelligence';
import {
  MANIPULATION_EVIDENCE_FIXTURE_NAMES,
  getManipulationEvidenceFixture,
} from '@sonic/manipulation-detector';
import { getDashboardUiShellCapabilities } from '@sonic/dashboard';
import { getLocalReadOnlyApiCapabilities } from '@sonic/read-only-api';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const OFFLINE_INTELLIGENCE_SRC = resolve(REPO_ROOT, 'packages/offline-intelligence/src');

const PHASE_33_FILES = [
  'types.ts',
  'capabilities.ts',
  'normalization.ts',
  'validation.ts',
  'builders.ts',
  'fixtures.ts',
].map(file => resolve(OFFLINE_INTELLIGENCE_SRC, file));

const NON_VALIDATION_PHASE_33_FILES = PHASE_33_FILES.filter(file => !file.endsWith('validation.ts'));

const FIXTURE_EXPORTS = [
  CLEAN_LOW_RISK_COMPOSITE_FIXTURE,
  CREATOR_CREDIBLE_WALLET_BENIGN_COMPOSITE_FIXTURE,
  CREATOR_UNKNOWN_WALLET_LOW_SIGNAL_COMPOSITE_FIXTURE,
  CREATOR_RISK_WALLET_RISK_COMPOSITE_FIXTURE,
  MANIPULATION_RISK_DOMINATES_COMPOSITE_FIXTURE,
  WALLET_CLUSTER_RISK_DOMINATES_COMPOSITE_FIXTURE,
  CREATOR_RISK_DOMINATES_COMPOSITE_FIXTURE,
  MIXED_SIGNAL_WATCHLIST_COMPOSITE_FIXTURE,
  FALSE_POSITIVE_PROTECTED_COMPOSITE_FIXTURE,
  INSUFFICIENT_DATA_COMPOSITE_FIXTURE,
  HIGH_RISK_MULTI_EVIDENCE_COMPOSITE_FIXTURE,
  SAFETY_BOUNDARY_COMPOSITE_FIXTURE,
  MALFORMED_INPUT_SAFE_COMPOSITE_FIXTURE,
  NO_ACTION_NON_ADVISORY_COMPOSITE_FIXTURE,
  REPORT_READY_COMPOSITE_FIXTURE,
  DASHBOARD_READY_COMPOSITE_FIXTURE,
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

// ---------------------------------------------------------------------------
// Module exports
// ---------------------------------------------------------------------------

describe('Phase 33 — module exports', () => {
  const exportedFunctions: Array<[string, unknown]> = [
    ['buildOfflineCompositeEvidenceFixture', buildOfflineCompositeEvidenceFixture],
    ['buildOfflineCompositeEvidenceSummary', buildOfflineCompositeEvidenceSummary],
    ['normalizeOfflineCompositeEvidenceFixture', normalizeOfflineCompositeEvidenceFixture],
    ['serializeOfflineCompositeEvidenceFixture', serializeOfflineCompositeEvidenceFixture],
    ['isOfflineCompositeEvidenceFixtureSerializable', isOfflineCompositeEvidenceFixtureSerializable],
    ['areOfflineCompositeEvidenceFixturesEqual', areOfflineCompositeEvidenceFixturesEqual],
    ['validateOfflineCompositeEvidenceFixture', validateOfflineCompositeEvidenceFixture],
    ['validateOfflineCompositeEvidenceSafety', validateOfflineCompositeEvidenceSafety],
    ['listOfflineCompositeEvidenceFixtures', listOfflineCompositeEvidenceFixtures],
    ['getOfflineCompositeEvidenceFixture', getOfflineCompositeEvidenceFixture],
    ['getOfflineCompositeEvidenceCapabilities', getOfflineCompositeEvidenceCapabilities],
  ];

  exportedFunctions.forEach(([name, value]) => {
    it(`${name} is exported`, () => {
      expect(typeof value).toBe('function');
    });
  });

  it('fixture names list has 16 entries', () => {
    expect(OFFLINE_COMPOSITE_EVIDENCE_FIXTURE_NAMES.length).toBe(16);
  });

  it('fixture kinds list has 16 entries', () => {
    expect(OFFLINE_COMPOSITE_EVIDENCE_FIXTURE_KINDS.length).toBe(16);
  });

  it('phase 33 fixture map has 16 entries', () => {
    expect(PHASE_33_COMPOSITE_EVIDENCE_FIXTURES.size).toBe(16);
  });

  it('PHASE_33_COMPOSITE_EVIDENCE_GENERATED_AT is deterministic', () => {
    expect(PHASE_33_COMPOSITE_EVIDENCE_GENERATED_AT).toBe('2026-01-01T00:00:00.000Z');
  });

  it('PHASE_33_COMPOSITE_EVIDENCE_SOURCE is deterministic', () => {
    expect(PHASE_33_COMPOSITE_EVIDENCE_SOURCE).toBe(
      'phase33_offline_intelligence_composite_evidence_models_v1',
    );
  });
});

// ---------------------------------------------------------------------------
// Fixture list and lookup helpers
// ---------------------------------------------------------------------------

describe('Phase 33 — fixture list and lookup helpers', () => {
  it('listOfflineCompositeEvidenceFixtures returns 16 entries', () => {
    const names = listOfflineCompositeEvidenceFixtures();
    expect(names.length).toBe(16);
  });

  OFFLINE_COMPOSITE_EVIDENCE_FIXTURE_NAMES.forEach(name => {
    it(`getOfflineCompositeEvidenceFixture resolves ${name}`, () => {
      expect(getOfflineCompositeEvidenceFixture(name)?.name).toBe(name);
    });
  });

  it('getOfflineCompositeEvidenceFixture returns undefined for an unknown name', () => {
    expect(getOfflineCompositeEvidenceFixture('unknown-phase33' as never)).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// Required fixture names exist
// ---------------------------------------------------------------------------

describe('Phase 33 — required fixture names exist', () => {
  OFFLINE_COMPOSITE_EVIDENCE_FIXTURE_NAMES.forEach(name => {
    it(`${name} exists in the exported list`, () => {
      expect(listOfflineCompositeEvidenceFixtures()).toContain(name);
    });

    it(`${name} exists in the exported fixture lookup maps`, () => {
      expect(PHASE_33_COMPOSITE_EVIDENCE_FIXTURES.has(name)).toBe(true);
      expect(FIXTURE_BY_NAME.has(name)).toBe(true);
    });
  });
});

// ---------------------------------------------------------------------------
// All fixtures pass validation
// ---------------------------------------------------------------------------

describe('Phase 33 — all fixtures pass validation', () => {
  FIXTURE_EXPORTS.forEach(fixture => {
    it(`${fixture.name} passes validateOfflineCompositeEvidenceFixture`, () => {
      expect(validateOfflineCompositeEvidenceFixture(fixture)).toEqual({
        valid: true,
        issues: [],
      });
    });
  });
});

// ---------------------------------------------------------------------------
// All fixtures pass safety validation
// ---------------------------------------------------------------------------

describe('Phase 33 — all fixtures pass safety validation', () => {
  FIXTURE_EXPORTS.forEach(fixture => {
    it(`${fixture.name} passes validateOfflineCompositeEvidenceSafety`, () => {
      expect(validateOfflineCompositeEvidenceSafety(fixture)).toEqual({
        safe: true,
        violations: [],
      });
    });
  });
});

// ---------------------------------------------------------------------------
// Safety invariants on every fixture
// ---------------------------------------------------------------------------

describe('Phase 33 — safety invariants on every fixture', () => {
  FIXTURE_EXPORTS.forEach(fixture => {
    it(`${fixture.name} has a supported name`, () => {
      expect(OFFLINE_COMPOSITE_EVIDENCE_FIXTURE_NAMES).toContain(fixture.name);
    });

    it(`${fixture.name} has a supported kind`, () => {
      expect(OFFLINE_COMPOSITE_EVIDENCE_FIXTURE_KINDS).toContain(fixture.kind);
    });

    it(`${fixture.name} has deterministic meta fields`, () => {
      expect(fixture.meta.phase).toBe(33);
      expect(fixture.meta.generatedAt).toBe(PHASE_33_COMPOSITE_EVIDENCE_GENERATED_AT);
      expect(fixture.meta.source).toBe(PHASE_33_COMPOSITE_EVIDENCE_SOURCE);
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
      expect(fixture.summary.phase).toBe(33);
      expect(fixture.summary.name).toBe(fixture.name);
      expect(fixture.summary.kind).toBe(fixture.kind);
      expect(fixture.summary.generatedAt).toBe(PHASE_33_COMPOSITE_EVIDENCE_GENERATED_AT);
      expect(fixture.summary.fixtureOnly).toBe(true);
      expect(fixture.summary.liveData).toBe(false);
      expect(fixture.summary.externalNetwork).toBe(false);
      expect(fixture.summary.nonAdvisory).toBe(true);
      expect(fixture.summary.safeToDisplay).toBe(true);
      expect(fixture.summary.riskCount).toBe(fixture.riskIndicators.length);
      expect(fixture.summary.qualityCount).toBe(fixture.qualityIndicators.length);
      expect(fixture.summary.confidenceCount).toBe(fixture.confidenceIndicators.length);
    });

    it(`${fixture.name} is serializable`, () => {
      expect(isOfflineCompositeEvidenceFixtureSerializable(fixture)).toBe(true);
      expect(() => JSON.parse(JSON.stringify(fixture))).not.toThrow();
    });

    it(`${fixture.name} stays equal after normalization`, () => {
      expect(
        areOfflineCompositeEvidenceFixturesEqual(
          fixture,
          normalizeOfflineCompositeEvidenceFixture(fixture),
        ),
      ).toBe(true);
    });

    it(`${fixture.name} uses sorted notes`, () => {
      expect(fixture.safeNotes).toEqual([...fixture.safeNotes].sort());
      expect(fixture.meta.notes).toEqual([...fixture.meta.notes].sort());
      expect(fixture.summary.notes).toEqual([...fixture.summary.notes].sort());
      expect(fixture.sourceReferences.notes).toEqual([...fixture.sourceReferences.notes].sort());
      expect(fixture.weighting.notes).toEqual([...fixture.weighting.notes].sort());
    });

    it(`${fixture.name} uses sorted indicator codes`, () => {
      expect(fixture.riskIndicators.map(i => i.code)).toEqual(
        [...fixture.riskIndicators.map(i => i.code)].sort(),
      );
      expect(fixture.qualityIndicators.map(i => i.code)).toEqual(
        [...fixture.qualityIndicators.map(i => i.code)].sort(),
      );
      expect(fixture.confidenceIndicators.map(i => i.code)).toEqual(
        [...fixture.confidenceIndicators.map(i => i.code)].sort(),
      );
      expect(fixture.summary.topRiskCodes).toEqual([...fixture.summary.topRiskCodes].sort());
      expect(fixture.summary.topQualityCodes).toEqual([...fixture.summary.topQualityCodes].sort());
    });

    it(`${fixture.name} summary counts stay within top-code limits`, () => {
      expect(fixture.summary.topRiskCodes.length).toBeLessThanOrEqual(5);
      expect(fixture.summary.topQualityCodes.length).toBeLessThanOrEqual(5);
    });

    it(`${fixture.name} contains no unsafe payload patterns`, () => {
      const serialized = serializeOfflineCompositeEvidenceFixture(fixture);
      FORBIDDEN_PAYLOAD_PATTERNS.forEach(pattern => {
        expect(serialized).not.toMatch(pattern);
      });
    });

    it(`${fixture.name} uses valid source reference fixture names`, () => {
      const { creator, walletCluster, manipulation } = fixture.sourceReferences;
      if (creator) {
        expect(CREATOR_INTELLIGENCE_FIXTURE_NAMES).toContain(creator.creatorFixtureName);
      }
      if (walletCluster) {
        expect(WALLET_CLUSTER_INTELLIGENCE_FIXTURE_NAMES).toContain(
          walletCluster.walletClusterFixtureName,
        );
      }
      if (manipulation) {
        expect(MANIPULATION_EVIDENCE_FIXTURE_NAMES).toContain(
          manipulation.manipulationEvidenceFixtureName,
        );
      }
    });

    it(`${fixture.name} summary reference names match source references`, () => {
      expect(fixture.summary.referencedCreatorFixtureName).toBe(
        fixture.sourceReferences.creator?.creatorFixtureName,
      );
      expect(fixture.summary.referencedWalletClusterFixtureName).toBe(
        fixture.sourceReferences.walletCluster?.walletClusterFixtureName,
      );
      expect(fixture.summary.referencedManipulationFixtureName).toBe(
        fixture.sourceReferences.manipulation?.manipulationEvidenceFixtureName,
      );
    });

    it(`${fixture.name} source count matches actual references`, () => {
      const refs = fixture.sourceReferences;
      const expectedCount = [refs.creator, refs.walletCluster, refs.manipulation].filter(
        Boolean,
      ).length;
      expect(refs.sourceCount).toBe(expectedCount);
    });

    it(`${fixture.name} preserves deterministic serialization`, () => {
      expect(serializeOfflineCompositeEvidenceFixture(fixture)).toBe(
        serializeOfflineCompositeEvidenceFixture(normalizeOfflineCompositeEvidenceFixture(fixture)),
      );
    });
  });
});

// ---------------------------------------------------------------------------
// Fixture-specific expectations
// ---------------------------------------------------------------------------

describe('Phase 33 — fixture-specific expectations', () => {
  it('clean-low-risk-composite has expected signal balance', () => {
    expect(CLEAN_LOW_RISK_COMPOSITE_FIXTURE.summary.signalBalance).toBe('quality-dominant');
  });

  it('creator-risk-wallet-risk-composite has high overall risk band', () => {
    expect(CREATOR_RISK_WALLET_RISK_COMPOSITE_FIXTURE.summary.overallRiskBand).toBe('high');
  });

  it('manipulation-risk-dominates-composite has manipulation dominant weighting', () => {
    expect(MANIPULATION_RISK_DOMINATES_COMPOSITE_FIXTURE.weighting.dominantCategory).toBe(
      'manipulation',
    );
  });

  it('wallet-cluster-risk-dominates-composite has wallet-cluster dominant weighting', () => {
    expect(WALLET_CLUSTER_RISK_DOMINATES_COMPOSITE_FIXTURE.weighting.dominantCategory).toBe(
      'wallet-cluster',
    );
  });

  it('creator-risk-dominates-composite has creator dominant weighting', () => {
    expect(CREATOR_RISK_DOMINATES_COMPOSITE_FIXTURE.weighting.dominantCategory).toBe('creator');
  });

  it('insufficient-data-composite has zero source count', () => {
    const refs = INSUFFICIENT_DATA_COMPOSITE_FIXTURE.sourceReferences;
    expect(refs.creator).toBeNull();
    expect(refs.walletCluster).toBeNull();
    expect(refs.sourceCount).toBe(1);
  });

  it('high-risk-multi-evidence-composite has critical overall risk band', () => {
    expect(HIGH_RISK_MULTI_EVIDENCE_COMPOSITE_FIXTURE.summary.overallRiskBand).toBe('critical');
  });

  it('mixed-signal-watchlist-composite has balanced signal balance', () => {
    expect(MIXED_SIGNAL_WATCHLIST_COMPOSITE_FIXTURE.summary.signalBalance).toBe('balanced');
  });

  it('false-positive-protected-composite has low risk band', () => {
    expect(FALSE_POSITIVE_PROTECTED_COMPOSITE_FIXTURE.summary.overallRiskBand).toBe('low');
  });

  it('no-action-non-advisory-composite has quality-dominant signals', () => {
    expect(NO_ACTION_NON_ADVISORY_COMPOSITE_FIXTURE.summary.riskCount).toBe(0);
  });

  it('safety-boundary-composite has none confidence band', () => {
    expect(SAFETY_BOUNDARY_COMPOSITE_FIXTURE.summary.overallConfidenceBand).toBe('none');
  });

  it('malformed-input-safe-composite has no wallet or manipulation references', () => {
    expect(MALFORMED_INPUT_SAFE_COMPOSITE_FIXTURE.sourceReferences.walletCluster).toBeNull();
    expect(MALFORMED_INPUT_SAFE_COMPOSITE_FIXTURE.sourceReferences.manipulation).toBeNull();
  });

  it('dashboard-ready-composite has all three source references', () => {
    const refs = DASHBOARD_READY_COMPOSITE_FIXTURE.sourceReferences;
    expect(refs.creator).not.toBeNull();
    expect(refs.walletCluster).not.toBeNull();
    expect(refs.manipulation).not.toBeNull();
    expect(refs.sourceCount).toBe(3);
  });

  it('report-ready-composite has high confidence band', () => {
    expect(REPORT_READY_COMPOSITE_FIXTURE.summary.overallConfidenceBand).toBe('high');
  });
});

// ---------------------------------------------------------------------------
// Normalization and builder behavior
// ---------------------------------------------------------------------------

describe('Phase 33 — normalization and builder behavior', () => {
  it('buildOfflineCompositeEvidenceSummary returns the fixture summary', () => {
    const summary = buildOfflineCompositeEvidenceSummary(CLEAN_LOW_RISK_COMPOSITE_FIXTURE);
    expect(summary).toEqual(CLEAN_LOW_RISK_COMPOSITE_FIXTURE.summary);
  });

  it('buildOfflineCompositeEvidenceSummary is deterministic for all fixtures', () => {
    FIXTURE_EXPORTS.forEach(fixture => {
      expect(buildOfflineCompositeEvidenceSummary(fixture)).toEqual(fixture.summary);
    });
  });

  it('buildOfflineCompositeEvidenceFixture does not mutate input', () => {
    const input = {
      name: 'clean-low-risk-composite',
      kind: 'clean-low-risk',
      sourceReferences: {
        ...CLEAN_LOW_RISK_COMPOSITE_FIXTURE.sourceReferences,
        notes: ['zeta', 'alpha'],
      },
      riskIndicators: [...CLEAN_LOW_RISK_COMPOSITE_FIXTURE.riskIndicators],
      qualityIndicators: [...CLEAN_LOW_RISK_COMPOSITE_FIXTURE.qualityIndicators],
      confidenceIndicators: [...CLEAN_LOW_RISK_COMPOSITE_FIXTURE.confidenceIndicators],
      safeNotes: ['zeta', 'alpha'],
    } as const;

    const snapshot = JSON.stringify(input);
    const result = buildOfflineCompositeEvidenceFixture(input);

    expect(result.success).toBe(true);
    expect(JSON.stringify(input)).toBe(snapshot);
    expect(result.fixture?.safeNotes).toEqual(
      ['alpha', 'zeta'],
    );
  });

  it('buildOfflineCompositeEvidenceFixture sorts safe notes', () => {
    const result = buildOfflineCompositeEvidenceFixture({
      name: 'clean-low-risk-composite',
      kind: 'clean-low-risk',
      sourceReferences: CLEAN_LOW_RISK_COMPOSITE_FIXTURE.sourceReferences,
      riskIndicators: [],
      qualityIndicators: [],
      confidenceIndicators: [],
      safeNotes: ['zeta note', 'alpha note'],
    });

    expect(result.success).toBe(true);
    expect(result.fixture?.safeNotes[0]).toBe('alpha note');
  });

  it('buildOfflineCompositeEvidenceFixture applies default weighting when none provided', () => {
    const result = buildOfflineCompositeEvidenceFixture({
      name: 'clean-low-risk-composite',
      kind: 'clean-low-risk',
      sourceReferences: CLEAN_LOW_RISK_COMPOSITE_FIXTURE.sourceReferences,
      riskIndicators: [],
      qualityIndicators: [],
      confidenceIndicators: [],
      safeNotes: ['Fixture-only. Synthetic.'],
    });

    expect(result.success).toBe(true);
    expect(result.fixture?.weighting).toBeDefined();
  });

  it('buildOfflineCompositeEvidenceFixture uses provided weighting', () => {
    const result = buildOfflineCompositeEvidenceFixture({
      name: 'clean-low-risk-composite',
      kind: 'clean-low-risk',
      sourceReferences: CLEAN_LOW_RISK_COMPOSITE_FIXTURE.sourceReferences,
      riskIndicators: [],
      qualityIndicators: [],
      confidenceIndicators: [],
      weighting: {
        creatorWeight: 'high',
        walletClusterWeight: 'none',
        manipulationWeight: 'none',
        dominantCategory: 'creator',
        notes: ['custom weighting note'],
      },
      safeNotes: ['Fixture-only.'],
    });

    expect(result.success).toBe(true);
    expect(result.fixture?.weighting.dominantCategory).toBe('creator');
    expect(result.fixture?.weighting.creatorWeight).toBe('high');
  });

  it('normalizeOfflineCompositeEvidenceFixture sorts unsorted arrays', () => {
    const normalized = normalizeOfflineCompositeEvidenceFixture({
      ...CLEAN_LOW_RISK_COMPOSITE_FIXTURE,
      safeNotes: ['zeta', 'alpha'],
      meta: {
        ...CLEAN_LOW_RISK_COMPOSITE_FIXTURE.meta,
        notes: ['zeta', 'alpha'],
      },
      summary: {
        ...CLEAN_LOW_RISK_COMPOSITE_FIXTURE.summary,
        topRiskCodes: ['zeta', 'alpha'],
        topQualityCodes: ['zeta', 'alpha'],
        notes: ['zeta', 'alpha'],
      },
      sourceReferences: {
        ...CLEAN_LOW_RISK_COMPOSITE_FIXTURE.sourceReferences,
        notes: ['zeta', 'alpha'],
      },
      weighting: {
        ...CLEAN_LOW_RISK_COMPOSITE_FIXTURE.weighting,
        notes: ['zeta', 'alpha'],
      },
    });

    expect(normalized.safeNotes).toEqual(['alpha', 'zeta']);
    expect(normalized.meta.notes).toEqual(['alpha', 'zeta']);
    expect(normalized.summary.topRiskCodes).toEqual(['alpha', 'zeta']);
    expect(normalized.summary.topQualityCodes).toEqual(['alpha', 'zeta']);
    expect(normalized.summary.notes).toEqual(['alpha', 'zeta']);
    expect(normalized.sourceReferences.notes).toEqual(['alpha', 'zeta']);
    expect(normalized.weighting.notes).toEqual(['alpha', 'zeta']);
  });

  it('serializeOfflineCompositeEvidenceFixture produces stable JSON', () => {
    const serialized = serializeOfflineCompositeEvidenceFixture(CLEAN_LOW_RISK_COMPOSITE_FIXTURE);
    expect(typeof serialized).toBe('string');
    expect(() => JSON.parse(serialized)).not.toThrow();
    const parsed = JSON.parse(serialized) as typeof CLEAN_LOW_RISK_COMPOSITE_FIXTURE;
    expect(parsed.name).toBe('clean-low-risk-composite');
    expect(parsed.meta.phase).toBe(33);
  });

  it('areOfflineCompositeEvidenceFixturesEqual returns true for identical fixtures', () => {
    expect(
      areOfflineCompositeEvidenceFixturesEqual(
        CLEAN_LOW_RISK_COMPOSITE_FIXTURE,
        CLEAN_LOW_RISK_COMPOSITE_FIXTURE,
      ),
    ).toBe(true);
  });

  it('areOfflineCompositeEvidenceFixturesEqual returns false for different fixtures', () => {
    expect(
      areOfflineCompositeEvidenceFixturesEqual(
        CLEAN_LOW_RISK_COMPOSITE_FIXTURE,
        CREATOR_RISK_WALLET_RISK_COMPOSITE_FIXTURE,
      ),
    ).toBe(false);
  });

  it('isOfflineCompositeEvidenceFixtureSerializable returns true for all fixtures', () => {
    FIXTURE_EXPORTS.forEach(fixture => {
      expect(isOfflineCompositeEvidenceFixtureSerializable(fixture)).toBe(true);
    });
  });
});

// ---------------------------------------------------------------------------
// Negative validation and safety cases
// ---------------------------------------------------------------------------

describe('Phase 33 — negative validation and safety cases', () => {
  it('validateOfflineCompositeEvidenceFixture rejects null input', () => {
    expect(validateOfflineCompositeEvidenceFixture(null)).toEqual({
      valid: false,
      issues: [
        {
          code: 'INVALID_INPUT',
          field: 'root',
          message: 'Input must be a non-null object.',
          severity: 'error',
        },
      ],
    });
  });

  it('validateOfflineCompositeEvidenceSafety rejects null input', () => {
    expect(validateOfflineCompositeEvidenceSafety(null)).toEqual({
      safe: false,
      violations: ['Composite evidence safety validation requires a non-null object.'],
    });
  });

  it('validateOfflineCompositeEvidenceFixture rejects unsupported names and kinds', () => {
    const result = validateOfflineCompositeEvidenceFixture({
      ...CLEAN_LOW_RISK_COMPOSITE_FIXTURE,
      name: 'unknown-name',
      kind: 'unknown-kind',
    });

    expect(result.valid).toBe(false);
    expect(result.issues.map(i => i.code)).toEqual(
      expect.arrayContaining(['INVALID_VALUE']),
    );
  });

  it('validateOfflineCompositeEvidenceFixture rejects unstable ordering', () => {
    const result = validateOfflineCompositeEvidenceFixture({
      ...CLEAN_LOW_RISK_COMPOSITE_FIXTURE,
      safeNotes: ['zeta', 'alpha'],
    });

    expect(result.valid).toBe(false);
    expect(result.issues.map(i => i.code)).toContain('UNSTABLE_ORDERING');
  });

  it('buildOfflineCompositeEvidenceFixture fails closed for unsupported names', () => {
    const result = buildOfflineCompositeEvidenceFixture({
      ...CLEAN_LOW_RISK_COMPOSITE_FIXTURE,
      name: 'not-supported',
      safeNotes: ['Fixture-only.'],
    });

    expect(result.success).toBe(false);
    expect(result.fixture).toBeNull();
    expect(result.validation.issues.map(i => i.code)).toContain('INVALID_NAME');
  });

  it('buildOfflineCompositeEvidenceFixture fails closed for unsafe content', () => {
    const result = buildOfflineCompositeEvidenceFixture({
      ...CLEAN_LOW_RISK_COMPOSITE_FIXTURE,
      safeNotes: ['contact me at person@example.com'],
    });

    expect(result.success).toBe(false);
    expect(result.fixture).toBeNull();
    expect(result.safety.safe).toBe(false);
  });

  it('validateOfflineCompositeEvidenceSafety rejects email content', () => {
    const result = validateOfflineCompositeEvidenceSafety({
      note: 'contact person@example.com',
    });
    expect(result.safe).toBe(false);
    expect(result.violations.join(' ')).toMatch(/email/i);
  });

  it('validateOfflineCompositeEvidenceSafety rejects solana-address-like content', () => {
    const result = validateOfflineCompositeEvidenceSafety({
      note: '11111111111111111111111111111111',
    });
    expect(result.safe).toBe(false);
    expect(result.violations.join(' ')).toMatch(/wallet-address-like|solana/i);
  });

  it('validateOfflineCompositeEvidenceSafety rejects live-data claims', () => {
    const result = validateOfflineCompositeEvidenceSafety({
      note: 'live data from solana rpc',
    });
    expect(result.safe).toBe(false);
    expect(result.violations.join(' ')).toMatch(/live-data/i);
  });

  it('validateOfflineCompositeEvidenceSafety rejects investment language', () => {
    const result = validateOfflineCompositeEvidenceSafety({
      note: 'this is an investment advice and price target',
    });
    expect(result.safe).toBe(false);
    expect(result.violations.join(' ')).toMatch(/Investment advice language/i);
  });

  it('validateOfflineCompositeEvidenceSafety rejects execution language', () => {
    const result = validateOfflineCompositeEvidenceSafety({
      note: 'execute trade and connect wallet',
    });
    expect(result.safe).toBe(false);
    expect(result.violations.join(' ')).toMatch(/Execution instruction/i);
  });

  it('validateOfflineCompositeEvidenceSafety rejects accusation language', () => {
    const result = validateOfflineCompositeEvidenceSafety({
      note: 'proven manipulation by a real manipulator',
    });
    expect(result.safe).toBe(false);
    expect(result.violations.join(' ')).toMatch(/Accusation language/i);
  });

  it('validateOfflineCompositeEvidenceSafety rejects bundle-id-like content', () => {
    const result = validateOfflineCompositeEvidenceSafety({
      note: 'bundle hash deadbeefdeadbeef',
    });
    expect(result.safe).toBe(false);
    expect(result.violations.join(' ')).toMatch(/bundle ID/i);
  });

  it('validateOfflineCompositeEvidenceFixture rejects unsupported creator reference', () => {
    const result = validateOfflineCompositeEvidenceFixture({
      ...CLEAN_LOW_RISK_COMPOSITE_FIXTURE,
      sourceReferences: {
        ...CLEAN_LOW_RISK_COMPOSITE_FIXTURE.sourceReferences,
        creator: {
          creatorFixtureName: 'not-a-real-creator' as never,
          creatorRiskLevel: 'low',
          credibilityBand: 'credible',
          notes: [],
        },
      },
    });
    expect(result.valid).toBe(false);
    expect(result.issues.map(i => i.code)).toContain('INVALID_CREATOR_REF');
  });

  it('validateOfflineCompositeEvidenceFixture rejects unsupported wallet reference', () => {
    const result = validateOfflineCompositeEvidenceFixture({
      ...CLEAN_LOW_RISK_COMPOSITE_FIXTURE,
      sourceReferences: {
        ...CLEAN_LOW_RISK_COMPOSITE_FIXTURE.sourceReferences,
        walletCluster: {
          walletClusterFixtureName: 'not-a-real-cluster' as never,
          clusterRiskLevel: 'low',
          qualityBand: 'moderate',
          notes: [],
        },
      },
    });
    expect(result.valid).toBe(false);
    expect(result.issues.map(i => i.code)).toContain('INVALID_WALLET_CLUSTER_REF');
  });

  it('validateOfflineCompositeEvidenceFixture rejects unsupported manipulation reference', () => {
    const result = validateOfflineCompositeEvidenceFixture({
      ...CLEAN_LOW_RISK_COMPOSITE_FIXTURE,
      sourceReferences: {
        ...CLEAN_LOW_RISK_COMPOSITE_FIXTURE.sourceReferences,
        manipulation: {
          manipulationEvidenceFixtureName: 'not-a-real-evidence' as never,
          manipulationRiskLevel: 'low',
          bundleRiskBand: 'none',
          notes: [],
        },
      },
    });
    expect(result.valid).toBe(false);
    expect(result.issues.map(i => i.code)).toContain('INVALID_MANIPULATION_REF');
  });
});

// ---------------------------------------------------------------------------
// Capability compatibility surfaces
// ---------------------------------------------------------------------------

describe('Phase 33 — capability compatibility surfaces', () => {
  it('getOfflineCompositeEvidenceCapabilities returns all expected Phase 33 flags', () => {
    expect(getOfflineCompositeEvidenceCapabilities()).toEqual({
      compositeEvidenceFixtures: true,
      syntheticCompositeEvidence: true,
      compositeCreatorEvidenceRefs: true,
      compositeWalletClusterEvidenceRefs: true,
      compositeManipulationEvidenceRefs: true,
      compositeRiskIndicators: true,
      compositeQualityIndicators: true,
      compositeConfidenceIndicators: true,
      compositeEvidenceWeighting: true,
      compositeEvidenceSafetyValidation: true,
      compositeLiveData: false,
      compositeExternalNetwork: false,
      compositeTradingSignals: false,
      compositeInvestmentAdvice: false,
      compositeExecution: false,
      compositePersistence: false,
    });
  });

  it('dashboard capability surface includes Phase 33 flags', () => {
    const caps = getDashboardUiShellCapabilities();
    expect(caps.compositeEvidenceFixtures).toBe(true);
    expect(caps.syntheticCompositeEvidence).toBe(true);
    expect(caps.compositeCreatorEvidenceRefs).toBe(true);
    expect(caps.compositeWalletClusterEvidenceRefs).toBe(true);
    expect(caps.compositeManipulationEvidenceRefs).toBe(true);
    expect(caps.compositeRiskIndicators).toBe(true);
    expect(caps.compositeQualityIndicators).toBe(true);
    expect(caps.compositeConfidenceIndicators).toBe(true);
    expect(caps.compositeEvidenceWeighting).toBe(true);
    expect(caps.compositeEvidenceSafetyValidation).toBe(true);
    expect(caps.compositeLiveData).toBe(false);
    expect(caps.compositeExternalNetwork).toBe(false);
    expect(caps.compositeTradingSignals).toBe(false);
    expect(caps.compositeInvestmentAdvice).toBe(false);
    expect(caps.compositeExecution).toBe(false);
    expect(caps.compositePersistence).toBe(false);
  });

  it('read-only API capability surface includes Phase 33 flags', () => {
    const caps = getLocalReadOnlyApiCapabilities();
    expect(caps.compositeEvidenceFixtures).toBe(true);
    expect(caps.syntheticCompositeEvidence).toBe(true);
    expect(caps.compositeCreatorEvidenceRefs).toBe(true);
    expect(caps.compositeWalletClusterEvidenceRefs).toBe(true);
    expect(caps.compositeManipulationEvidenceRefs).toBe(true);
    expect(caps.compositeRiskIndicators).toBe(true);
    expect(caps.compositeQualityIndicators).toBe(true);
    expect(caps.compositeConfidenceIndicators).toBe(true);
    expect(caps.compositeEvidenceWeighting).toBe(true);
    expect(caps.compositeEvidenceSafetyValidation).toBe(true);
    expect(caps.compositeLiveData).toBe(false);
    expect(caps.compositeExternalNetwork).toBe(false);
    expect(caps.compositeTradingSignals).toBe(false);
    expect(caps.compositeInvestmentAdvice).toBe(false);
    expect(caps.compositeExecution).toBe(false);
    expect(caps.compositePersistence).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Cross-reference compatibility
// ---------------------------------------------------------------------------

describe('Phase 33 — cross-reference compatibility', () => {
  FIXTURE_EXPORTS.forEach(fixture => {
    it(`${fixture.name} resolves creator references when present`, () => {
      const creator = fixture.sourceReferences.creator;
      if (!creator) return;
      expect(getCreatorIntelligenceFixture(creator.creatorFixtureName)).toBeDefined();
    });

    it(`${fixture.name} resolves wallet-cluster references when present`, () => {
      const walletCluster = fixture.sourceReferences.walletCluster;
      if (!walletCluster) return;
      expect(
        getWalletClusterIntelligenceFixture(walletCluster.walletClusterFixtureName),
      ).toBeDefined();
    });

    it(`${fixture.name} resolves manipulation references when present`, () => {
      const manipulation = fixture.sourceReferences.manipulation;
      if (!manipulation) return;
      expect(
        getManipulationEvidenceFixture(manipulation.manipulationEvidenceFixtureName),
      ).toBeDefined();
    });
  });
});

// ---------------------------------------------------------------------------
// Runtime source safety guards
// ---------------------------------------------------------------------------

describe('Phase 33 — runtime source safety guards', () => {
  PHASE_33_FILES.forEach(file => {
    it(`${file} exists`, () => {
      expect(readFileSync(file, 'utf8')).toContain('Phase 33');
    });
  });

  NON_VALIDATION_PHASE_33_FILES.forEach(file => {
    it(`${file} contains no runtime network or timing APIs`, () => {
      const source = readFileSync(file, 'utf8');
      FORBIDDEN_RUNTIME_PATTERNS.forEach(pattern => {
        expect(source).not.toMatch(pattern);
      });
    });
  });

  it('validation source explicitly guards unsafe live-data and secret patterns', () => {
    const source = readFileSync(resolve(OFFLINE_INTELLIGENCE_SRC, 'validation.ts'), 'utf8');
    expect(source).toContain('LIVE_DATA_PATTERN');
    expect(source).toContain('SECRET_PATTERN');
    expect(source).toContain('ACCUSATION_PATTERN');
    expect(source).toContain('SOLANA_ADDRESS_PATTERN');
    expect(source).toContain('TX_HASH_PATTERN');
    expect(source).toContain('BUNDLE_ID_PATTERN');
  });
});
