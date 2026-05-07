/**
 * Phase 30 — Creator Intelligence Fixture Models v1
 */

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import {
  ANONYMOUS_CONSISTENT_CREATOR_FIXTURE,
  BALANCED_MIXED_SIGNAL_CREATOR_FIXTURE,
  BENIGN_LOW_SIGNAL_CREATOR_FIXTURE,
  CREDIBLE_TRANSPARENT_CREATOR_FIXTURE,
  CLEAR_DISCLOSURE_CREATOR_FIXTURE,
  COORDINATED_HYPE_CREATOR_FIXTURE,
  CREATOR_INTELLIGENCE_FIXTURE_KINDS,
  CREATOR_INTELLIGENCE_FIXTURE_NAMES,
  HIGH_RISK_CREATOR_FIXTURE,
  MALFORMED_INPUT_SAFE_CREATOR_FIXTURE,
  NEW_ACCOUNT_RISK_CREATOR_FIXTURE,
  OVERPROMOTIONAL_NARRATIVE_CREATOR_FIXTURE,
  PHASE_30_CREATOR_INTELLIGENCE_FIXTURES,
  PHASE_30_CREATOR_INTELLIGENCE_GENERATED_AT,
  POOR_DISCLOSURE_CREATOR_FIXTURE,
  RECYCLED_NARRATIVE_CREATOR_FIXTURE,
  SAFETY_BOUNDARY_CREATOR_FIXTURE,
  SUSPICIOUS_ENGAGEMENT_CREATOR_FIXTURE,
  UNKNOWN_INSUFFICIENT_DATA_CREATOR_FIXTURE,
  areCreatorIntelligenceFixturesEqual,
  buildCreatorIntelligenceFixture,
  buildCreatorIntelligenceSummary,
  getCreatorFixtureModelCapabilities,
  getCreatorIntelligenceCapabilities,
  getCreatorIntelligenceFixture,
  isCreatorIntelligenceFixtureSerializable,
  listCreatorIntelligenceFixtures,
  normalizeCreatorIntelligenceFixture,
  serializeCreatorIntelligenceFixture,
  validateCreatorIntelligenceFixture,
  validateCreatorIntelligenceSafety,
} from '@sonic/creator-intelligence';
import { getDashboardUiShellCapabilities } from '@sonic/dashboard';
import { getLocalReadOnlyApiCapabilities } from '@sonic/read-only-api';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const CREATOR_SRC = resolve(REPO_ROOT, 'packages/creator-intelligence/src');

const PHASE_30_FILES = [
  'fixture-model-types.ts',
  'fixture-model-capabilities.ts',
  'fixture-model-normalization.ts',
  'fixture-model-validation.ts',
  'fixture-model-builders.ts',
  'fixture-model-fixtures.ts',
].map(file => resolve(CREATOR_SRC, file));

const NON_VALIDATION_PHASE_30_FILES = PHASE_30_FILES.filter(file => !file.endsWith('validation.ts'));

const FIXTURE_EXPORTS = [
  CREDIBLE_TRANSPARENT_CREATOR_FIXTURE,
  ANONYMOUS_CONSISTENT_CREATOR_FIXTURE,
  NEW_ACCOUNT_RISK_CREATOR_FIXTURE,
  OVERPROMOTIONAL_NARRATIVE_CREATOR_FIXTURE,
  SUSPICIOUS_ENGAGEMENT_CREATOR_FIXTURE,
  CLEAR_DISCLOSURE_CREATOR_FIXTURE,
  POOR_DISCLOSURE_CREATOR_FIXTURE,
  RECYCLED_NARRATIVE_CREATOR_FIXTURE,
  COORDINATED_HYPE_CREATOR_FIXTURE,
  BENIGN_LOW_SIGNAL_CREATOR_FIXTURE,
  HIGH_RISK_CREATOR_FIXTURE,
  MALFORMED_INPUT_SAFE_CREATOR_FIXTURE,
  SAFETY_BOUNDARY_CREATOR_FIXTURE,
  BALANCED_MIXED_SIGNAL_CREATOR_FIXTURE,
  UNKNOWN_INSUFFICIENT_DATA_CREATOR_FIXTURE,
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

describe('Phase 30 — module exports', () => {
  const exportedFunctions: Array<[string, unknown]> = [
    ['buildCreatorIntelligenceFixture', buildCreatorIntelligenceFixture],
    ['buildCreatorIntelligenceSummary', buildCreatorIntelligenceSummary],
    ['normalizeCreatorIntelligenceFixture', normalizeCreatorIntelligenceFixture],
    ['serializeCreatorIntelligenceFixture', serializeCreatorIntelligenceFixture],
    ['isCreatorIntelligenceFixtureSerializable', isCreatorIntelligenceFixtureSerializable],
    ['areCreatorIntelligenceFixturesEqual', areCreatorIntelligenceFixturesEqual],
    ['validateCreatorIntelligenceFixture', validateCreatorIntelligenceFixture],
    ['validateCreatorIntelligenceSafety', validateCreatorIntelligenceSafety],
    ['listCreatorIntelligenceFixtures', listCreatorIntelligenceFixtures],
    ['getCreatorIntelligenceFixture', getCreatorIntelligenceFixture],
    ['getCreatorIntelligenceCapabilities', getCreatorIntelligenceCapabilities],
    ['getCreatorFixtureModelCapabilities', getCreatorFixtureModelCapabilities],
  ];

  exportedFunctions.forEach(([name, value]) => {
    it(`${name} is exported`, () => {
      expect(typeof value).toBe('function');
    });
  });

  it('fixture names list has 15 entries', () => {
    expect(CREATOR_INTELLIGENCE_FIXTURE_NAMES.length).toBe(15);
  });

  it('fixture kinds list has 15 entries', () => {
    expect(CREATOR_INTELLIGENCE_FIXTURE_KINDS.length).toBe(15);
  });

  it('phase 30 fixture map has 15 entries', () => {
    expect(PHASE_30_CREATOR_INTELLIGENCE_FIXTURES.size).toBe(15);
  });
});

describe('Phase 30 — fixture list and lookup helpers', () => {
  it('listCreatorIntelligenceFixtures returns 15 sorted names', () => {
    const names = listCreatorIntelligenceFixtures();
    expect(names.length).toBe(15);
    expect(names).toEqual([...names].sort());
  });

  CREATOR_INTELLIGENCE_FIXTURE_NAMES.forEach(name => {
    it(`getCreatorIntelligenceFixture resolves ${name}`, () => {
      expect(getCreatorIntelligenceFixture(name)?.name).toBe(name);
    });
  });

  it('getCreatorIntelligenceFixture returns undefined for an unknown name', () => {
    expect(getCreatorIntelligenceFixture('unknown-creator' as never)).toBeUndefined();
  });
});

describe('Phase 30 — required fixture names exist', () => {
  CREATOR_INTELLIGENCE_FIXTURE_NAMES.forEach(name => {
    it(`${name} exists in the exported list`, () => {
      expect(listCreatorIntelligenceFixtures()).toContain(name);
    });

    it(`${name} exists in the exported map`, () => {
      expect(PHASE_30_CREATOR_INTELLIGENCE_FIXTURES.has(name)).toBe(true);
    });
  });
});

describe('Phase 30 — fixture shape, determinism, and safety', () => {
  FIXTURE_EXPORTS.forEach(fixture => {
    it(`${fixture.name} has a supported name`, () => {
      expect(CREATOR_INTELLIGENCE_FIXTURE_NAMES).toContain(fixture.name);
    });

    it(`${fixture.name} has a supported kind`, () => {
      expect(CREATOR_INTELLIGENCE_FIXTURE_KINDS).toContain(fixture.kind);
    });

    it(`${fixture.name} has deterministic metadata`, () => {
      expect(fixture.meta.phase).toBe(30);
      expect(fixture.meta.generatedAt).toBe(PHASE_30_CREATOR_INTELLIGENCE_GENERATED_AT);
      expect(fixture.meta.fixtureOnly).toBe(true);
      expect(fixture.meta.syntheticOnly).toBe(true);
      expect(fixture.meta.liveData).toBe(false);
      expect(fixture.meta.externalNetwork).toBe(false);
      expect(fixture.meta.persistence).toBe(false);
      expect(fixture.meta.deterministic).toBe(true);
      expect(fixture.meta.readOnly).toBe(true);
      expect(fixture.meta.nonAdvisory).toBe(true);
    });

    it(`${fixture.name} has deterministic generatedAt in summary`, () => {
      expect(fixture.summary.generatedAt).toBe(PHASE_30_CREATOR_INTELLIGENCE_GENERATED_AT);
      expect(fixture.summary.generatedAt).toBe(fixture.meta.generatedAt);
    });

    it(`${fixture.name} is serializable`, () => {
      expect(isCreatorIntelligenceFixtureSerializable(fixture)).toBe(true);
      expect(() => JSON.parse(JSON.stringify(fixture))).not.toThrow();
    });

    it(`${fixture.name} validates successfully`, () => {
      expect(validateCreatorIntelligenceFixture(fixture)).toEqual({
        valid: true,
        issues: [],
      });
    });

    it(`${fixture.name} passes safety validation`, () => {
      expect(validateCreatorIntelligenceSafety(fixture)).toEqual({
        safe: true,
        violations: [],
      });
    });

    it(`${fixture.name} stays equal after normalization`, () => {
      expect(areCreatorIntelligenceFixturesEqual(fixture, normalizeCreatorIntelligenceFixture(fixture))).toBe(true);
    });

    it(`${fixture.name} uses sorted notes`, () => {
      expect(fixture.safeNotes).toEqual([...fixture.safeNotes].sort());
      expect(fixture.meta.notes).toEqual([...fixture.meta.notes].sort());
      expect(fixture.summary.notes).toEqual([...fixture.summary.notes].sort());
    });

    it(`${fixture.name} uses sorted indicator codes`, () => {
      expect(fixture.riskIndicators.map(indicator => indicator.code)).toEqual(
        [...fixture.riskIndicators.map(indicator => indicator.code)].sort(),
      );
      expect(fixture.credibilityIndicators.map(indicator => indicator.code)).toEqual(
        [...fixture.credibilityIndicators.map(indicator => indicator.code)].sort(),
      );
    });

    it(`${fixture.name} uses sorted nested narrative and summary arrays`, () => {
      expect(fixture.narrative.evidenceTags).toEqual([...fixture.narrative.evidenceTags].sort());
      expect(fixture.summary.topRiskCodes).toEqual([...fixture.summary.topRiskCodes].sort());
      expect(fixture.summary.topCredibilityCodes).toEqual([...fixture.summary.topCredibilityCodes].sort());
    });

    it(`${fixture.name} retains summary linkage`, () => {
      expect(fixture.summary.name).toBe(fixture.name);
      expect(fixture.summary.kind).toBe(fixture.kind);
      expect(fixture.summary.creatorId).toBe(fixture.profile.creatorId);
      expect(fixture.summary.projectId).toBe(fixture.project.projectId);
    });

    it(`${fixture.name} keeps summary safety flags disabled`, () => {
      expect(fixture.summary.phase).toBe(30);
      expect(fixture.summary.fixtureOnly).toBe(true);
      expect(fixture.summary.liveData).toBe(false);
      expect(fixture.summary.externalNetwork).toBe(false);
      expect(fixture.summary.nonAdvisory).toBe(true);
      expect(fixture.summary.safeToDisplay).toBe(true);
    });

    it(`${fixture.name} has no forbidden payload content`, () => {
      const payload = JSON.stringify(fixture);
      FORBIDDEN_PAYLOAD_PATTERNS.forEach(pattern => {
        expect(payload).not.toMatch(pattern);
      });
    });
  });
});

describe('Phase 30 — fixture-specific expectations', () => {
  const cases = [
    ['credible transparent creator fixture', CREDIBLE_TRANSPARENT_CREATOR_FIXTURE, 'credibility-dominant', 'clear', 'organic'],
    ['anonymous consistent creator fixture', ANONYMOUS_CONSISTENT_CREATOR_FIXTURE, 'credibility-dominant', 'mixed', 'low-signal'],
    ['new account risk fixture', NEW_ACCOUNT_RISK_CREATOR_FIXTURE, 'risk-dominant', 'poor', 'low-signal'],
    ['overpromotional narrative fixture', OVERPROMOTIONAL_NARRATIVE_CREATOR_FIXTURE, 'risk-dominant', 'poor', 'suspicious'],
    ['suspicious engagement fixture', SUSPICIOUS_ENGAGEMENT_CREATOR_FIXTURE, 'risk-dominant', 'mixed', 'suspicious'],
    ['clear disclosure fixture', CLEAR_DISCLOSURE_CREATOR_FIXTURE, 'credibility-dominant', 'clear', 'organic'],
    ['poor disclosure fixture', POOR_DISCLOSURE_CREATOR_FIXTURE, 'risk-dominant', 'poor', 'low-signal'],
    ['recycled narrative fixture', RECYCLED_NARRATIVE_CREATOR_FIXTURE, 'balanced', 'mixed', 'low-signal'],
    ['coordinated hype fixture', COORDINATED_HYPE_CREATOR_FIXTURE, 'risk-dominant', 'poor', 'suspicious'],
    ['benign low-signal fixture', BENIGN_LOW_SIGNAL_CREATOR_FIXTURE, 'balanced', 'mixed', 'low-signal'],
    ['high-risk fixture', HIGH_RISK_CREATOR_FIXTURE, 'risk-dominant', 'poor', 'suspicious'],
    ['malformed-input-safe fixture', MALFORMED_INPUT_SAFE_CREATOR_FIXTURE, 'risk-dominant', 'unknown', 'unknown'],
    ['safety-boundary fixture', SAFETY_BOUNDARY_CREATOR_FIXTURE, 'credibility-dominant', 'clear', 'organic'],
    ['balanced mixed-signal fixture', BALANCED_MIXED_SIGNAL_CREATOR_FIXTURE, 'credibility-dominant', 'mixed', 'low-signal'],
    ['unknown insufficient-data fixture', UNKNOWN_INSUFFICIENT_DATA_CREATOR_FIXTURE, 'insufficient-data', 'unknown', 'unknown'],
  ] as const;

  cases.forEach(([label, fixture, signalBalance, disclosure, engagement]) => {
    it(`${label} has expected signal balance`, () => {
      expect(fixture.summary.signalBalance).toBe(signalBalance);
    });

    it(`${label} has expected disclosure assessment`, () => {
      expect(fixture.summary.disclosureAssessment).toBe(disclosure);
    });

    it(`${label} has expected engagement assessment`, () => {
      expect(fixture.summary.engagementAssessment).toBe(engagement);
    });
  });

  it('credible transparent creator has more credibility than risk indicators', () => {
    expect(CREDIBLE_TRANSPARENT_CREATOR_FIXTURE.credibilityIndicators.length).toBeGreaterThan(
      CREDIBLE_TRANSPARENT_CREATOR_FIXTURE.riskIndicators.length,
    );
  });

  it('high-risk creator includes a critical risk indicator', () => {
    expect(HIGH_RISK_CREATOR_FIXTURE.riskIndicators.some(indicator => indicator.level === 'critical')).toBe(true);
  });

  it('malformed-input-safe creator demonstrates sanitized unknown fields', () => {
    expect(MALFORMED_INPUT_SAFE_CREATOR_FIXTURE.profile.accountAgeBand).toBe('unknown');
    expect(MALFORMED_INPUT_SAFE_CREATOR_FIXTURE.project.category).toBe('unknown');
    expect(MALFORMED_INPUT_SAFE_CREATOR_FIXTURE.narrative.messageStyle).toBe('unknown');
  });

  it('safety-boundary creator explicitly carries local-only notes', () => {
    expect(SAFETY_BOUNDARY_CREATOR_FIXTURE.safeNotes.join(' ')).toMatch(/local-only/i);
  });
});

describe('Phase 30 — builder helpers', () => {
  it('buildCreatorIntelligenceSummary rebuilds a fixture summary deterministically', () => {
    const { summary, ...fixtureWithoutSummary } = CREDIBLE_TRANSPARENT_CREATOR_FIXTURE;
    expect(buildCreatorIntelligenceSummary(fixtureWithoutSummary)).toEqual(summary);
  });

  it('buildCreatorIntelligenceFixture builds a valid fixture from a valid input', () => {
    const result = buildCreatorIntelligenceFixture({
      name: 'credible-transparent-creator',
      kind: 'transparent',
      profile: CREDIBLE_TRANSPARENT_CREATOR_FIXTURE.profile,
      project: CREDIBLE_TRANSPARENT_CREATOR_FIXTURE.project,
      narrative: CREDIBLE_TRANSPARENT_CREATOR_FIXTURE.narrative,
      socialSignals: CREDIBLE_TRANSPARENT_CREATOR_FIXTURE.socialSignals,
      disclosureSignals: CREDIBLE_TRANSPARENT_CREATOR_FIXTURE.disclosureSignals,
      engagementPatterns: CREDIBLE_TRANSPARENT_CREATOR_FIXTURE.engagementPatterns,
      riskIndicators: CREDIBLE_TRANSPARENT_CREATOR_FIXTURE.riskIndicators,
      credibilityIndicators: CREDIBLE_TRANSPARENT_CREATOR_FIXTURE.credibilityIndicators,
      safeNotes: CREDIBLE_TRANSPARENT_CREATOR_FIXTURE.safeNotes,
    });

    expect(result.success).toBe(true);
    expect(result.fixture?.name).toBe('credible-transparent-creator');
    expect(result.validation.valid).toBe(true);
    expect(result.safety.safe).toBe(true);
  });

  it('buildCreatorIntelligenceFixture does not mutate its input', () => {
    const input = {
      name: 'credible-transparent-creator',
      kind: 'transparent',
      profile: CREDIBLE_TRANSPARENT_CREATOR_FIXTURE.profile,
      project: CREDIBLE_TRANSPARENT_CREATOR_FIXTURE.project,
      narrative: CREDIBLE_TRANSPARENT_CREATOR_FIXTURE.narrative,
      socialSignals: CREDIBLE_TRANSPARENT_CREATOR_FIXTURE.socialSignals,
      disclosureSignals: CREDIBLE_TRANSPARENT_CREATOR_FIXTURE.disclosureSignals,
      engagementPatterns: CREDIBLE_TRANSPARENT_CREATOR_FIXTURE.engagementPatterns,
      riskIndicators: CREDIBLE_TRANSPARENT_CREATOR_FIXTURE.riskIndicators,
      credibilityIndicators: CREDIBLE_TRANSPARENT_CREATOR_FIXTURE.credibilityIndicators,
      safeNotes: CREDIBLE_TRANSPARENT_CREATOR_FIXTURE.safeNotes,
    };
    const before = JSON.stringify(input);
    buildCreatorIntelligenceFixture(input);
    expect(JSON.stringify(input)).toBe(before);
  });

  it('buildCreatorIntelligenceFixture returns a deterministic safe failure for invalid input', () => {
    const result = buildCreatorIntelligenceFixture({
      name: 'unsupported-name',
      kind: 'unsupported-kind',
      profile: CREDIBLE_TRANSPARENT_CREATOR_FIXTURE.profile,
      project: CREDIBLE_TRANSPARENT_CREATOR_FIXTURE.project,
      narrative: CREDIBLE_TRANSPARENT_CREATOR_FIXTURE.narrative,
    } as never);

    expect(result.success).toBe(false);
    expect(result.fixture).toBeNull();
    expect(result.validation.valid).toBe(false);
    expect(result.validation.issues.some(issue => issue.code === 'UNSUPPORTED_FIXTURE_NAME')).toBe(true);
  });
});

describe('Phase 30 — normalization and serialization helpers', () => {
  it('normalizeCreatorIntelligenceFixture sorts unsorted arrays deterministically', () => {
    const unsorted = {
      ...CREDIBLE_TRANSPARENT_CREATOR_FIXTURE,
      safeNotes: ['zeta', 'alpha'],
      narrative: {
        ...CREDIBLE_TRANSPARENT_CREATOR_FIXTURE.narrative,
        evidenceTags: ['zeta', 'alpha'],
      },
      riskIndicators: [...CREDIBLE_TRANSPARENT_CREATOR_FIXTURE.riskIndicators].reverse(),
      credibilityIndicators: [...CREDIBLE_TRANSPARENT_CREATOR_FIXTURE.credibilityIndicators].reverse(),
      summary: {
        ...CREDIBLE_TRANSPARENT_CREATOR_FIXTURE.summary,
        topRiskCodes: [...CREDIBLE_TRANSPARENT_CREATOR_FIXTURE.summary.topRiskCodes].reverse(),
        topCredibilityCodes: [...CREDIBLE_TRANSPARENT_CREATOR_FIXTURE.summary.topCredibilityCodes].reverse(),
        notes: ['zeta', 'alpha'],
      },
      meta: {
        ...CREDIBLE_TRANSPARENT_CREATOR_FIXTURE.meta,
        notes: ['zeta', 'alpha'],
      },
    };

    const normalized = normalizeCreatorIntelligenceFixture(unsorted);
    expect(normalized.safeNotes).toEqual(['alpha', 'zeta']);
    expect(normalized.narrative.evidenceTags).toEqual(['alpha', 'zeta']);
    expect(normalized.summary.notes).toEqual(['alpha', 'zeta']);
    expect(normalized.meta.notes).toEqual(['alpha', 'zeta']);
  });

  it('serializeCreatorIntelligenceFixture is deterministic', () => {
    const serializedA = serializeCreatorIntelligenceFixture(CREDIBLE_TRANSPARENT_CREATOR_FIXTURE);
    const serializedB = serializeCreatorIntelligenceFixture(CREDIBLE_TRANSPARENT_CREATOR_FIXTURE);
    expect(serializedA).toBe(serializedB);
  });

  it('areCreatorIntelligenceFixturesEqual detects identical fixtures', () => {
    expect(
      areCreatorIntelligenceFixturesEqual(
        CREDIBLE_TRANSPARENT_CREATOR_FIXTURE,
        normalizeCreatorIntelligenceFixture(CREDIBLE_TRANSPARENT_CREATOR_FIXTURE),
      ),
    ).toBe(true);
  });

  it('areCreatorIntelligenceFixturesEqual detects non-identical fixtures', () => {
    expect(
      areCreatorIntelligenceFixturesEqual(CREDIBLE_TRANSPARENT_CREATOR_FIXTURE, HIGH_RISK_CREATOR_FIXTURE),
    ).toBe(false);
  });
});

describe('Phase 30 — validation and safety failures', () => {
  it('validateCreatorIntelligenceFixture rejects null input', () => {
    expect(validateCreatorIntelligenceFixture(null).valid).toBe(false);
  });

  it('validateCreatorIntelligenceFixture rejects unsupported names and kinds', () => {
    const invalidFixture = {
      ...CREDIBLE_TRANSPARENT_CREATOR_FIXTURE,
      name: 'unsupported-name',
      kind: 'unsupported-kind',
    } as never;

    const result = validateCreatorIntelligenceFixture(invalidFixture);
    expect(result.valid).toBe(false);
    expect(result.issues.some(issue => issue.code === 'UNSUPPORTED_FIXTURE_NAME')).toBe(true);
    expect(result.issues.some(issue => issue.code === 'UNSUPPORTED_FIXTURE_KIND')).toBe(true);
  });

  it('validateCreatorIntelligenceFixture rejects unstable ordering', () => {
    const invalidFixture = {
      ...CREDIBLE_TRANSPARENT_CREATOR_FIXTURE,
      safeNotes: [...CREDIBLE_TRANSPARENT_CREATOR_FIXTURE.safeNotes].reverse(),
    };
    const result = validateCreatorIntelligenceFixture(invalidFixture);
    expect(result.valid).toBe(false);
    expect(result.issues.some(issue => issue.code === 'UNSTABLE_ORDERING')).toBe(true);
  });

  it('validateCreatorIntelligenceFixture rejects invalid deterministic metadata', () => {
    const invalidFixture = {
      ...CREDIBLE_TRANSPARENT_CREATOR_FIXTURE,
      meta: {
        ...CREDIBLE_TRANSPARENT_CREATOR_FIXTURE.meta,
        generatedAt: '2026-02-01T00:00:00.000Z',
      },
    };
    const result = validateCreatorIntelligenceFixture(invalidFixture);
    expect(result.valid).toBe(false);
    expect(result.issues.some(issue => issue.code === 'INVALID_GENERATED_AT')).toBe(true);
  });

  it('validateCreatorIntelligenceSafety rejects unsafe payloads', () => {
    const result = validateCreatorIntelligenceSafety({
      note: 'Contact fixture@example.com or visit https://example.com right now.',
    });
    expect(result.safe).toBe(false);
    expect(result.violations.length).toBeGreaterThan(0);
  });

  it('validateCreatorIntelligenceSafety rejects stack traces and local paths', () => {
    const result = validateCreatorIntelligenceSafety({
      note: 'TypeError: example at Object.<anonymous> (/home/runner/file.ts:1:1)',
    });
    expect(result.safe).toBe(false);
    expect(result.violations.length).toBeGreaterThan(0);
  });
});

describe('Phase 30 — capability metadata includes Phase 30 flags', () => {
  it('creator package capabilities include Phase 30 flags', () => {
    const caps = getCreatorIntelligenceCapabilities();
    expect(caps.creatorIntelligenceFixtures).toBe(true);
    expect(caps.syntheticCreatorProfiles).toBe(true);
    expect(caps.creatorNarrativeFixtures).toBe(true);
    expect(caps.creatorRiskIndicators).toBe(true);
    expect(caps.creatorCredibilityIndicators).toBe(true);
    expect(caps.creatorFixtureSafetyValidation).toBe(true);
    expect(caps.creatorLiveData).toBe(false);
    expect(caps.creatorSocialApiAccess).toBe(false);
    expect(caps.creatorScraping).toBe(false);
    expect(caps.creatorIdentityResolution).toBe(false);
    expect(caps.creatorInvestmentAdvice).toBe(false);
    expect(caps.creatorTradingSignals).toBe(false);
    expect(caps.creatorExternalNetwork).toBe(false);
    expect(caps.creatorPersistence).toBe(false);
  });

  it('creator fixture capability helper returns the same Phase 30 flags', () => {
    expect(getCreatorFixtureModelCapabilities()).toEqual({
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
    });
  });

  it('dashboard capabilities include Phase 30 flags', () => {
    const caps = getDashboardUiShellCapabilities();
    expect(caps.creatorIntelligenceFixtures).toBe(true);
    expect(caps.syntheticCreatorProfiles).toBe(true);
    expect(caps.creatorNarrativeFixtures).toBe(true);
    expect(caps.creatorRiskIndicators).toBe(true);
    expect(caps.creatorCredibilityIndicators).toBe(true);
    expect(caps.creatorFixtureSafetyValidation).toBe(true);
    expect(caps.creatorLiveData).toBe(false);
    expect(caps.creatorExternalNetwork).toBe(false);
    expect(caps.creatorPersistence).toBe(false);
  });

  it('read-only-api capabilities include Phase 30 flags', () => {
    const caps = getLocalReadOnlyApiCapabilities();
    expect(caps.creatorIntelligenceFixtures).toBe(true);
    expect(caps.syntheticCreatorProfiles).toBe(true);
    expect(caps.creatorNarrativeFixtures).toBe(true);
    expect(caps.creatorRiskIndicators).toBe(true);
    expect(caps.creatorCredibilityIndicators).toBe(true);
    expect(caps.creatorFixtureSafetyValidation).toBe(true);
    expect(caps.creatorLiveData).toBe(false);
    expect(caps.creatorExternalNetwork).toBe(false);
    expect(caps.creatorPersistence).toBe(false);
  });
});

describe('Phase 30 — runtime source safety checks', () => {
  it('all phase30 source files exist and are non-empty', () => {
    PHASE_30_FILES.forEach(file => {
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
    it(`non-validation phase30 runtime files do not contain ${term}`, () => {
      NON_VALIDATION_PHASE_30_FILES.forEach(file => {
        expect(readFileSync(file, 'utf-8')).not.toContain(term);
      });
    });
  });

  it('phase30 runtime files do not import http/https/fs modules', () => {
    PHASE_30_FILES.forEach(file => {
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

describe('Phase 30 — compatibility and regression checks', () => {
  it('fixture exports are reachable through the package root', () => {
    expect(FIXTURE_BY_NAME.get('credible-transparent-creator')).toBe(CREDIBLE_TRANSPARENT_CREATOR_FIXTURE);
  });

  it('summary builder is compatible with all exported fixtures', () => {
    FIXTURE_EXPORTS.forEach(fixture => {
      const { summary, ...fixtureWithoutSummary } = fixture;
      expect(buildCreatorIntelligenceSummary(fixtureWithoutSummary)).toEqual(summary);
    });
  });

  it('safety-boundary fixture remains safe and valid', () => {
    expect(validateCreatorIntelligenceFixture(SAFETY_BOUNDARY_CREATOR_FIXTURE).valid).toBe(true);
    expect(validateCreatorIntelligenceSafety(SAFETY_BOUNDARY_CREATOR_FIXTURE).safe).toBe(true);
  });
});
