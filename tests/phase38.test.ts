/**
 * Phase 38 — Strategy Candidate Evaluation Fixtures v1
 */

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import {
  PHASE_38_STRATEGY_CANDIDATES_GENERATED_AT,
  PHASE_38_STRATEGY_CANDIDATES_SOURCE,
  STRATEGY_CANDIDATE_EVALUATION_FIXTURE_NAMES,
  STRATEGY_CANDIDATE_EVALUATION_FIXTURE_KINDS,
  SCORE_BAND_RANGE_CATEGORIES,
  buildStrategyCandidateEvaluationFixture,
  buildStrategyCandidateEvaluationSummary,
  normalizeStrategyCandidateEvaluationFixture,
  serializeStrategyCandidateEvaluationFixture,
  isStrategyCandidateEvaluationFixtureSerializable,
  areStrategyCandidateEvaluationFixturesEqual,
  validateStrategyCandidateEvaluationFixture,
  validateStrategyCandidateSafety,
  getStrategyCandidateFixtureCapabilities,
  PHASE_38_STRATEGY_CANDIDATE_EVALUATION_FIXTURES,
  listStrategyCandidateEvaluationFixtures,
  getStrategyCandidateEvaluationFixture,
  SCORE_BAND_OUTCOME_ANALYSIS_FIXTURE_NAMES,
  SCORE_BAND_OUTCOME_ANALYSIS_FIXTURE_KINDS,
} from '@sonic/offline-intelligence';
import { getDashboardUiShellCapabilities } from '@sonic/dashboard';
import { getLocalReadOnlyApiCapabilities } from '@sonic/read-only-api';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const PHASE_38_SRC = resolve(REPO_ROOT, 'packages/offline-intelligence/src/strategy-candidates');

const PHASE_38_FILES = [
  'types.ts',
  'capabilities.ts',
  'normalization.ts',
  'validation.ts',
  'builders.ts',
  'fixtures.ts',
  'index.ts',
].map(file => resolve(PHASE_38_SRC, file));

const NON_VALIDATION_PHASE_38_FILES = PHASE_38_FILES.filter(file => !file.endsWith('validation.ts'));

const REQUIRED_FIXTURE_NAMES = [
  'defensive-new-launch-candidate',
  'creator-leaderboard-candidate',
  'wallet-leader-copy-candidate',
  'post-bundle-dip-candidate',
  'no-action-safety-candidate',
  'manipulation-avoidance-candidate',
  'insufficient-data-candidate',
  'high-score-positive-candidate',
  'high-score-false-positive-candidate',
  'missed-opportunity-candidate',
  'drawdown-contained-candidate',
  'mixed-signal-watchlist-candidate',
  'malformed-input-safe-candidate',
  'dashboard-ready-strategy-candidate',
  'report-ready-strategy-candidate',
  'safety-boundary-strategy-candidate',
] as const;

const FIXTURE_NAMES = listStrategyCandidateEvaluationFixtures();
const FIXTURES = FIXTURE_NAMES.map(name => {
  const fixture = getStrategyCandidateEvaluationFixture(name);
  if (!fixture) throw new Error(`Missing Phase 38 fixture: ${name}`);
  return fixture;
});

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
  /localStorage/,
  /sessionStorage/,
  /IndexedDB/,
  /document\.cookie/,
];

function collectStringValues(value: unknown, result: string[] = []): readonly string[] {
  if (typeof value === 'string') {
    result.push(value);
    return result;
  }
  if (Array.isArray(value)) {
    value.forEach(entry => collectStringValues(entry, result));
    return result;
  }
  if (value !== null && typeof value === 'object') {
    Object.values(value as Record<string, unknown>).forEach(entry =>
      collectStringValues(entry, result),
    );
  }
  return result;
}

// ─── Module exports ───────────────────────────────────────────────────────────

describe('Phase 38 — module exports', () => {
  const exportedFunctions: Array<[string, unknown]> = [
    ['buildStrategyCandidateEvaluationFixture', buildStrategyCandidateEvaluationFixture],
    ['buildStrategyCandidateEvaluationSummary', buildStrategyCandidateEvaluationSummary],
    ['normalizeStrategyCandidateEvaluationFixture', normalizeStrategyCandidateEvaluationFixture],
    ['serializeStrategyCandidateEvaluationFixture', serializeStrategyCandidateEvaluationFixture],
    ['isStrategyCandidateEvaluationFixtureSerializable', isStrategyCandidateEvaluationFixtureSerializable],
    ['areStrategyCandidateEvaluationFixturesEqual', areStrategyCandidateEvaluationFixturesEqual],
    ['validateStrategyCandidateEvaluationFixture', validateStrategyCandidateEvaluationFixture],
    ['validateStrategyCandidateSafety', validateStrategyCandidateSafety],
    ['listStrategyCandidateEvaluationFixtures', listStrategyCandidateEvaluationFixtures],
    ['getStrategyCandidateEvaluationFixture', getStrategyCandidateEvaluationFixture],
    ['getStrategyCandidateFixtureCapabilities', getStrategyCandidateFixtureCapabilities],
  ];

  exportedFunctions.forEach(([name, value]) => {
    it(`${name} is exported`, () => {
      expect(typeof value).toBe('function');
    });
  });

  it('PHASE_38_STRATEGY_CANDIDATES_GENERATED_AT is deterministic', () => {
    expect(PHASE_38_STRATEGY_CANDIDATES_GENERATED_AT).toBe('2026-01-01T00:00:00.000Z');
  });

  it('PHASE_38_STRATEGY_CANDIDATES_SOURCE is correct', () => {
    expect(PHASE_38_STRATEGY_CANDIDATES_SOURCE).toBe(
      'phase38_strategy_candidate_evaluation_fixtures_v1',
    );
  });

  it('fixture names expose 16 values', () => {
    expect(STRATEGY_CANDIDATE_EVALUATION_FIXTURE_NAMES.length).toBe(16);
  });

  it('fixture kinds expose 16 values', () => {
    expect(STRATEGY_CANDIDATE_EVALUATION_FIXTURE_KINDS.length).toBe(16);
  });

  it('strategy candidate categories expose 4 values', () => {
    expect(SCORE_BAND_RANGE_CATEGORIES.length).toBe(4);
    expect(SCORE_BAND_RANGE_CATEGORIES).toContain('low');
    expect(SCORE_BAND_RANGE_CATEGORIES).toContain('medium');
    expect(SCORE_BAND_RANGE_CATEGORIES).toContain('high');
    expect(SCORE_BAND_RANGE_CATEGORIES).toContain('unknown');
  });

  it('fixture map has 16 entries', () => {
    expect(PHASE_38_STRATEGY_CANDIDATE_EVALUATION_FIXTURES.size).toBe(16);
  });
});

// ─── Fixture list and lookup helpers ──────────────────────────────────────────

describe('Phase 38 — fixture list and lookup helpers', () => {
  it('listStrategyCandidateEvaluationFixtures returns 16 entries', () => {
    expect(listStrategyCandidateEvaluationFixtures().length).toBe(16);
  });

  it('listStrategyCandidateEvaluationFixtures returns sorted names', () => {
    const names = listStrategyCandidateEvaluationFixtures();
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  it('listStrategyCandidateEvaluationFixtures is stable across calls', () => {
    const a = listStrategyCandidateEvaluationFixtures();
    const b = listStrategyCandidateEvaluationFixtures();
    expect(a).toEqual(b);
  });

  REQUIRED_FIXTURE_NAMES.forEach(name => {
    it(`contains required fixture ${name}`, () => {
      expect(listStrategyCandidateEvaluationFixtures()).toContain(name);
    });

    it(`lookup resolves required fixture ${name}`, () => {
      expect(getStrategyCandidateEvaluationFixture(name)?.name).toBe(name);
    });
  });

  it('getStrategyCandidateEvaluationFixture returns undefined for unknown name', () => {
    expect(getStrategyCandidateEvaluationFixture('unknown-phase38' as never)).toBeUndefined();
  });
});

// ─── All 16 required fixtures ─────────────────────────────────────────────────

describe('Phase 38 — all 16 required fixtures exist and are valid', () => {
  REQUIRED_FIXTURE_NAMES.forEach(name => {
    describe(`fixture: ${name}`, () => {
      it('exists', () => {
        expect(getStrategyCandidateEvaluationFixture(name)).toBeDefined();
      });

      it('has correct name', () => {
        expect(getStrategyCandidateEvaluationFixture(name)?.name).toBe(name);
      });

      it('has phase 38 meta', () => {
        expect(getStrategyCandidateEvaluationFixture(name)?.meta.phase).toBe(38);
      });

      it('passes full validation', () => {
        const fixture = getStrategyCandidateEvaluationFixture(name)!;
        const result = validateStrategyCandidateEvaluationFixture(fixture);
        expect(result.valid).toBe(true);
        expect(result.issues).toHaveLength(0);
      });

      it('passes safety validation', () => {
        const fixture = getStrategyCandidateEvaluationFixture(name)!;
        const result = validateStrategyCandidateSafety(fixture);
        expect(result.safe).toBe(true);
        expect(result.violations).toHaveLength(0);
      });

      it('is JSON-serializable', () => {
        const fixture = getStrategyCandidateEvaluationFixture(name)!;
        expect(isStrategyCandidateEvaluationFixtureSerializable(fixture)).toBe(true);
      });

      it('has fixtureOnly=true', () => {
        expect(getStrategyCandidateEvaluationFixture(name)?.meta.fixtureOnly).toBe(true);
      });

      it('has syntheticOnly=true', () => {
        expect(getStrategyCandidateEvaluationFixture(name)?.meta.syntheticOnly).toBe(true);
      });

      it('has deterministic=true', () => {
        expect(getStrategyCandidateEvaluationFixture(name)?.meta.deterministic).toBe(true);
      });

      it('has liveData=false', () => {
        expect(getStrategyCandidateEvaluationFixture(name)?.meta.liveData).toBe(false);
      });

      it('has realScoring=false', () => {
        expect(getStrategyCandidateEvaluationFixture(name)?.meta.realScoring).toBe(false);
      });

      it('has realBacktesting=false', () => {
        expect(getStrategyCandidateEvaluationFixture(name)?.meta.realBacktesting).toBe(false);
      });

      it('has paperTrading=false', () => {
        expect(getStrategyCandidateEvaluationFixture(name)?.meta.paperTrading).toBe(false);
      });

      it('has liveTrading=false', () => {
        expect(getStrategyCandidateEvaluationFixture(name)?.meta.liveTrading).toBe(false);
      });

      it('has execution=false', () => {
        expect(getStrategyCandidateEvaluationFixture(name)?.meta.execution).toBe(false);
      });

      it('has nonAdvisory=true', () => {
        expect(getStrategyCandidateEvaluationFixture(name)?.meta.nonAdvisory).toBe(true);
      });

      it('has nonAccusatory=true', () => {
        expect(getStrategyCandidateEvaluationFixture(name)?.meta.nonAccusatory).toBe(true);
      });

      it('has summary.safeToDisplay=true', () => {
        expect(getStrategyCandidateEvaluationFixture(name)?.summary.safeToDisplay).toBe(true);
      });

      it('summary.name matches fixture.name', () => {
        const fx = getStrategyCandidateEvaluationFixture(name)!;
        expect(fx.summary.name).toBe(fx.name);
      });

      it('summary.kind matches fixture.kind', () => {
        const fx = getStrategyCandidateEvaluationFixture(name)!;
        expect(fx.summary.kind).toBe(fx.kind);
      });

      it('summary.generatedAt matches constant', () => {
        expect(getStrategyCandidateEvaluationFixture(name)?.summary.generatedAt).toBe(
          PHASE_38_STRATEGY_CANDIDATES_GENERATED_AT,
        );
      });

      it('meta.generatedAt matches constant', () => {
        expect(getStrategyCandidateEvaluationFixture(name)?.meta.generatedAt).toBe(
          PHASE_38_STRATEGY_CANDIDATES_GENERATED_AT,
        );
      });

      it('meta.source matches constant', () => {
        expect(getStrategyCandidateEvaluationFixture(name)?.meta.source).toBe(
          PHASE_38_STRATEGY_CANDIDATES_SOURCE,
        );
      });

      it('scoreBandReference references valid Phase 37 fixture', () => {
        const fx = getStrategyCandidateEvaluationFixture(name)!;
        expect(
          (SCORE_BAND_OUTCOME_ANALYSIS_FIXTURE_NAMES as readonly string[]).includes(
            fx.scoreBandReference.scoreBandOutcomeFixtureName,
          ),
        ).toBe(true);
      });

      it('scoreBandReference has valid fixture kind', () => {
        const fx = getStrategyCandidateEvaluationFixture(name)!;
        expect(
          (SCORE_BAND_OUTCOME_ANALYSIS_FIXTURE_KINDS as readonly string[]).includes(
            fx.scoreBandReference.scoreBandOutcomeFixtureKind,
          ),
        ).toBe(true);
      });

      it('has riskIndicators array', () => {
        const fx = getStrategyCandidateEvaluationFixture(name)!;
        expect(Array.isArray(fx.riskIndicators)).toBe(true);
        expect(fx.riskIndicators.length).toBeGreaterThan(0);
      });

      it('has qualityIndicators array', () => {
        const fx = getStrategyCandidateEvaluationFixture(name)!;
        expect(Array.isArray(fx.qualityIndicators)).toBe(true);
        expect(fx.qualityIndicators.length).toBeGreaterThan(0);
      });

      it('has confidenceIndicators array', () => {
        const fx = getStrategyCandidateEvaluationFixture(name)!;
        expect(Array.isArray(fx.confidenceIndicators)).toBe(true);
        expect(fx.confidenceIndicators.length).toBeGreaterThan(0);
      });

      it('has profile', () => {
        const fx = getStrategyCandidateEvaluationFixture(name)!;
        expect(fx.profile).toBeDefined();
        expect(typeof fx.profile.title).toBe('string');
        expect(typeof fx.profile.candidateId).toBe('string');
        expect(typeof fx.profile.objective).toBe('string');
      });

      it('has evaluationCriteria', () => {
        const fx = getStrategyCandidateEvaluationFixture(name)!;
        expect(Array.isArray(fx.evaluationCriteria)).toBe(true);
        expect(fx.evaluationCriteria.length).toBeGreaterThan(0);
      });

      it('has safeNotes array', () => {
        const fx = getStrategyCandidateEvaluationFixture(name)!;
        expect(Array.isArray(fx.safeNotes)).toBe(true);
      });

      it('payload contains no forbidden patterns', () => {
        const fx = getStrategyCandidateEvaluationFixture(name)!;
        const allStrings = collectStringValues(fx);
        for (const str of allStrings) {
          for (const pattern of FORBIDDEN_PAYLOAD_PATTERNS) {
            expect(pattern.test(str)).toBe(false);
          }
        }
      });
    });
  });
});

// ─── Score-band summary builder ───────────────────────────────────────────────

describe('Phase 38 — buildStrategyCandidateEvaluationSummary', () => {
  it('returns fixture summary', () => {
    const fx = getStrategyCandidateEvaluationFixture('high-score-positive-candidate')!;
    const summary = buildStrategyCandidateEvaluationSummary(fx);
    expect(summary).toEqual(fx.summary);
  });

  it('summary.phase is 37', () => {
    const fx = FIXTURES[0]!;
    expect(buildStrategyCandidateEvaluationSummary(fx).phase).toBe(38);
  });

  it('summary is stable when called twice', () => {
    const fx = getStrategyCandidateEvaluationFixture('no-action-safety-candidate')!;
    expect(buildStrategyCandidateEvaluationSummary(fx)).toEqual(buildStrategyCandidateEvaluationSummary(fx));
  });
});

// ─── Normalization helpers ────────────────────────────────────────────────────

describe('Phase 38 — normalization', () => {
  it('normalizeStrategyCandidateEvaluationFixture is idempotent', () => {
    const fx = getStrategyCandidateEvaluationFixture('defensive-new-launch-candidate')!;
    const once = normalizeStrategyCandidateEvaluationFixture(fx);
    const twice = normalizeStrategyCandidateEvaluationFixture(once);
    expect(once).toEqual(twice);
  });

  it('normalizeStrategyCandidateEvaluationFixture does not mutate input', () => {
    const fx = getStrategyCandidateEvaluationFixture('wallet-leader-copy-candidate')!;
    const original = JSON.stringify(fx);
    normalizeStrategyCandidateEvaluationFixture(fx);
    expect(JSON.stringify(fx)).toBe(original);
  });

  it('serializeStrategyCandidateEvaluationFixture returns stable JSON', () => {
    const fx = getStrategyCandidateEvaluationFixture('high-score-positive-candidate')!;
    const a = serializeStrategyCandidateEvaluationFixture(fx);
    const b = serializeStrategyCandidateEvaluationFixture(fx);
    expect(a).toBe(b);
  });

  it('isStrategyCandidateEvaluationFixtureSerializable returns true for valid fixture', () => {
    const fx = FIXTURES[0]!;
    expect(isStrategyCandidateEvaluationFixtureSerializable(fx)).toBe(true);
  });

  it('isStrategyCandidateEvaluationFixtureSerializable returns false for non-serializable', () => {
    const circular: Record<string, unknown> = {};
    circular['self'] = circular;
    expect(isStrategyCandidateEvaluationFixtureSerializable(circular)).toBe(false);
  });

  it('areStrategyCandidateEvaluationFixturesEqual returns true for same fixture', () => {
    const fx = getStrategyCandidateEvaluationFixture('drawdown-contained-candidate')!;
    expect(areStrategyCandidateEvaluationFixturesEqual(fx, fx)).toBe(true);
  });

  it('areStrategyCandidateEvaluationFixturesEqual returns false for different fixtures', () => {
    const fx1 = getStrategyCandidateEvaluationFixture('defensive-new-launch-candidate')!;
    const fx2 = getStrategyCandidateEvaluationFixture('high-score-positive-candidate')!;
    expect(areStrategyCandidateEvaluationFixturesEqual(fx1, fx2)).toBe(false);
  });

  it('riskIndicators are sorted by code', () => {
    for (const fx of FIXTURES) {
      const codes = fx.riskIndicators.map(r => r.code);
      expect(codes).toEqual([...codes].sort((a, b) => a.localeCompare(b)));
    }
  });

  it('qualityIndicators are sorted by code', () => {
    for (const fx of FIXTURES) {
      const codes = fx.qualityIndicators.map(q => q.code);
      expect(codes).toEqual([...codes].sort((a, b) => a.localeCompare(b)));
    }
  });

  it('confidenceIndicators are sorted by code', () => {
    for (const fx of FIXTURES) {
      const codes = fx.confidenceIndicators.map(c => c.code);
      expect(codes).toEqual([...codes].sort((a, b) => a.localeCompare(b)));
    }
  });
});

// ─── Validation success paths ─────────────────────────────────────────────────

describe('Phase 38 — validation success', () => {
  FIXTURES.forEach(fx => {
    it(`validateStrategyCandidateEvaluationFixture passes for ${fx.name}`, () => {
      const result = validateStrategyCandidateEvaluationFixture(fx);
      expect(result.valid).toBe(true);
      expect(result.issues).toHaveLength(0);
    });
  });
});

// ─── Validation failure paths ─────────────────────────────────────────────────

describe('Phase 38 — validation failure paths', () => {
  it('returns invalid for null input', () => {
    const result = validateStrategyCandidateEvaluationFixture(null);
    expect(result.valid).toBe(false);
    expect(result.issues.length).toBeGreaterThan(0);
  });

  it('returns invalid for undefined input', () => {
    const result = validateStrategyCandidateEvaluationFixture(undefined);
    expect(result.valid).toBe(false);
  });

  it('returns invalid for empty object', () => {
    const result = validateStrategyCandidateEvaluationFixture({});
    expect(result.valid).toBe(false);
  });

  it('returns invalid for unknown fixture name', () => {
    const result = validateStrategyCandidateEvaluationFixture({ name: 'not-a-valid-name', kind: 'not-valid' });
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.code === 'INVALID_VALUE' || i.code === 'MISSING_REQUIRED_FIELD')).toBe(true);
  });

  it('returns invalid when meta is missing', () => {
    const fx = getStrategyCandidateEvaluationFixture('defensive-new-launch-candidate')!;
    const broken = { ...fx, meta: undefined };
    const result = validateStrategyCandidateEvaluationFixture(broken);
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.field === 'meta')).toBe(true);
  });

  it('returns invalid when summary is missing', () => {
    const fx = getStrategyCandidateEvaluationFixture('defensive-new-launch-candidate')!;
    const broken = { ...fx, summary: undefined };
    const result = validateStrategyCandidateEvaluationFixture(broken);
    expect(result.valid).toBe(false);
  });

  it('returns invalid when meta.phase is wrong', () => {
    const fx = getStrategyCandidateEvaluationFixture('defensive-new-launch-candidate')!;
    const broken = { ...fx, meta: { ...fx.meta, phase: 35 } };
    const result = validateStrategyCandidateEvaluationFixture(broken);
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.code === 'INVALID_PHASE')).toBe(true);
  });

  it('returns invalid when meta.liveData is true', () => {
    const fx = getStrategyCandidateEvaluationFixture('defensive-new-launch-candidate')!;
    const broken = { ...fx, meta: { ...fx.meta, liveData: true } };
    const result = validateStrategyCandidateEvaluationFixture(broken);
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.code === 'SAFETY_VIOLATION')).toBe(true);
  });

  it('returns invalid when meta.realScoring is true', () => {
    const fx = getStrategyCandidateEvaluationFixture('high-score-positive-candidate')!;
    const broken = { ...fx, meta: { ...fx.meta, realScoring: true } };
    const result = validateStrategyCandidateEvaluationFixture(broken);
    expect(result.valid).toBe(false);
  });

  it('returns invalid when meta.execution is true', () => {
    const fx = getStrategyCandidateEvaluationFixture('no-action-safety-candidate')!;
    const broken = { ...fx, meta: { ...fx.meta, execution: true } };
    const result = validateStrategyCandidateEvaluationFixture(broken);
    expect(result.valid).toBe(false);
  });

  it('returns invalid when meta.fixtureOnly is false', () => {
    const fx = getStrategyCandidateEvaluationFixture('defensive-new-launch-candidate')!;
    const broken = { ...fx, meta: { ...fx.meta, fixtureOnly: false } };
    const result = validateStrategyCandidateEvaluationFixture(broken);
    expect(result.valid).toBe(false);
  });

  it('returns invalid when meta.generatedAt is non-deterministic', () => {
    const fx = getStrategyCandidateEvaluationFixture('defensive-new-launch-candidate')!;
    const broken = { ...fx, meta: { ...fx.meta, generatedAt: '2025-01-01T00:00:00.000Z' } };
    const result = validateStrategyCandidateEvaluationFixture(broken);
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.code === 'NON_DETERMINISTIC_GENERATED_AT')).toBe(true);
  });

  it('returns invalid when scoreBandReference is missing', () => {
    const fx = getStrategyCandidateEvaluationFixture('defensive-new-launch-candidate')!;
    const broken = { ...fx, scoreBandReference: undefined };
    const result = validateStrategyCandidateEvaluationFixture(broken);
    expect(result.valid).toBe(false);
  });

  it('returns invalid when scoreBandReference has invalid Phase 36 name', () => {
    const fx = getStrategyCandidateEvaluationFixture('defensive-new-launch-candidate')!;
    const broken = {
      ...fx,
      scoreBandReference: { ...fx.scoreBandReference, scoreBandOutcomeFixtureName: 'not-valid' },
    };
    const result = validateStrategyCandidateEvaluationFixture(broken);
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.code === 'INVALID_PHASE37_REF')).toBe(true);
  });

  it('returns invalid when riskIndicators is not an array', () => {
    const fx = getStrategyCandidateEvaluationFixture('defensive-new-launch-candidate')!;
    const broken = { ...fx, riskIndicators: null };
    const result = validateStrategyCandidateEvaluationFixture(broken);
    expect(result.valid).toBe(false);
  });

  it('returns invalid when summary.name mismatches fixture name', () => {
    const fx = getStrategyCandidateEvaluationFixture('defensive-new-launch-candidate')!;
    const broken = {
      ...fx,
      summary: { ...fx.summary, name: 'high-score-positive-candidate' },
    };
    const result = validateStrategyCandidateEvaluationFixture(broken);
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.code === 'NAME_MISMATCH')).toBe(true);
  });

  it('returns invalid when safeNotes is not sorted', () => {
    const fx = getStrategyCandidateEvaluationFixture('defensive-new-launch-candidate')!;
    const broken = { ...fx, safeNotes: ['Z-note', 'A-note'] };
    const result = validateStrategyCandidateEvaluationFixture(broken);
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.code === 'UNSTABLE_ORDERING')).toBe(true);
  });

  it('does not throw for any invalid input type', () => {
    const inputs = [null, undefined, 'string', 42, [], true, {}];
    for (const input of inputs) {
      expect(() => validateStrategyCandidateEvaluationFixture(input)).not.toThrow();
    }
  });
});

// ─── Safety validation success paths ─────────────────────────────────────────

describe('Phase 38 — safety validation success', () => {
  FIXTURES.forEach(fx => {
    it(`validateStrategyCandidateSafety passes for ${fx.name}`, () => {
      const result = validateStrategyCandidateSafety(fx);
      expect(result.safe).toBe(true);
      expect(result.violations).toHaveLength(0);
    });
  });
});

// ─── Safety validation failure paths ─────────────────────────────────────────

describe('Phase 38 — safety validation failure paths', () => {
  it('returns unsafe for null', () => {
    expect(validateStrategyCandidateSafety(null).safe).toBe(false);
  });

  it('returns unsafe for undefined', () => {
    expect(validateStrategyCandidateSafety(undefined).safe).toBe(false);
  });

  it('returns unsafe when string contains possible Solana address', () => {
    const obj = { notes: ['AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'] };
    const result = validateStrategyCandidateSafety(obj);
    expect(result.safe).toBe(false);
    expect(result.violations.some(v => /Solana address/.test(v))).toBe(true);
  });

  it('returns unsafe when string contains stack trace pattern', () => {
    const obj = { notes: ['TypeError: cannot read property'] };
    const result = validateStrategyCandidateSafety(obj);
    expect(result.safe).toBe(false);
  });

  it('returns unsafe when string contains local path', () => {
    const obj = { notes: ['/home/user/path'] };
    const result = validateStrategyCandidateSafety(obj);
    expect(result.safe).toBe(false);
  });

  it('returns unsafe when string contains a secret keyword', () => {
    const obj = { notes: ['private key found here'] };
    const result = validateStrategyCandidateSafety(obj);
    expect(result.safe).toBe(false);
  });

  it('returns unsafe for external URL', () => {
    const obj = { notes: ['see https://example.com'] };
    const result = validateStrategyCandidateSafety(obj);
    expect(result.safe).toBe(false);
  });

  it('does not throw for any input type', () => {
    const inputs = [null, undefined, 'string', 42, [], true, {}];
    for (const input of inputs) {
      expect(() => validateStrategyCandidateSafety(input)).not.toThrow();
    }
  });

  it('violations array is stable-sorted', () => {
    const obj = { a: 'private key found', b: '/home/user/path' };
    const result = validateStrategyCandidateSafety(obj);
    expect(result.violations).toEqual(
      [...result.violations].sort((a, b) => a.localeCompare(b)),
    );
  });
});

// ─── Source-reference compatibility with Phase 37 ─────────────────────────────

describe('Phase 38 — Phase 37 source-reference compatibility', () => {
  FIXTURES.forEach(fx => {
    it(`${fx.name}: scoreBandOutcomeFixtureName is a valid Phase 37 fixture name`, () => {
      expect(
        (SCORE_BAND_OUTCOME_ANALYSIS_FIXTURE_NAMES as readonly string[]).includes(
          fx.scoreBandReference.scoreBandOutcomeFixtureName,
        ),
      ).toBe(true);
    });

    it(`${fx.name}: scoreBandOutcomeFixtureKind is a valid Phase 37 fixture kind`, () => {
      expect(
        (SCORE_BAND_OUTCOME_ANALYSIS_FIXTURE_KINDS as readonly string[]).includes(
          fx.scoreBandReference.scoreBandOutcomeFixtureKind,
        ),
      ).toBe(true);
    });

    it(`${fx.name}: summary.referencedScoreBandOutcomeFixtureName matches scoreBandReference`, () => {
      expect(fx.summary.referencedScoreBandOutcomeFixtureName).toBe(
        fx.scoreBandReference.scoreBandOutcomeFixtureName,
      );
    });
  });
});

// ─── No input mutation ────────────────────────────────────────────────────────

describe('Phase 38 — no input mutation', () => {
  it('buildStrategyCandidateEvaluationFixture does not mutate input', () => {
    const input = {
      name: 'defensive-new-launch-candidate' as const,
      kind: 'defensive-new-launch' as const,
      profile: {
        candidateId: 'test-id',
        title: 'test-title',
        family: 'defensive' as const,
        objective: 'test-objective',
        horizon: 'short' as const,
        evaluationMode: 'analysis-only' as const,
        fixtureOnly: true as const,
        syntheticOnly: true as const,
        notes: ['note'],
      },
      scoreBandReference: {
        scoreBandOutcomeFixtureName: 'low-score-safe-skip' as const,
        scoreBandOutcomeFixtureKind: 'low-score-safe-skip' as const,
        scoreBandCategory: 'low' as const,
        referencedReplayOutcomeFixtureName: 'avoided-high-risk-loss-outcome' as const,
        notes: ['note'],
      },
      riskIndicators: [
        {
          code: 'SB-RISK-LOW-SAFE-SKIP',
          label: 'low',
          level: 'low' as const,
          category: 'strategy-candidate' as const,
          rationale: 'r',
        },
      ],
      qualityIndicators: [
        {
          code: 'SB-QUAL-LOW-SAFE',
          label: 'q',
          level: 'moderate' as const,
          category: 'strategy-candidate' as const,
          rationale: 'r',
        },
      ],
      confidenceIndicators: [
        {
          code: 'SB-CONF-LOW-SKIP',
          label: 'c',
          confidenceBand: 'moderate' as const,
          referenceCount: 1,
          rationale: 'r',
        },
      ],
      safeNotes: ['Fixture-only.', 'No execution.', 'Synthetic-only.'],
    };
    const copy = JSON.stringify(input);
    buildStrategyCandidateEvaluationFixture(input);
    expect(JSON.stringify(input)).toBe(copy);
  });

  it('normalizeStrategyCandidateEvaluationFixture does not mutate input', () => {
    const fx = getStrategyCandidateEvaluationFixture('high-score-positive-candidate')!;
    const copy = JSON.stringify(fx);
    normalizeStrategyCandidateEvaluationFixture(fx);
    expect(JSON.stringify(fx)).toBe(copy);
  });

  it('validateStrategyCandidateEvaluationFixture does not mutate input', () => {
    const fx = getStrategyCandidateEvaluationFixture('no-action-safety-candidate')!;
    const copy = JSON.stringify(fx);
    validateStrategyCandidateEvaluationFixture(fx);
    expect(JSON.stringify(fx)).toBe(copy);
  });

  it('validateStrategyCandidateSafety does not mutate input', () => {
    const fx = getStrategyCandidateEvaluationFixture('drawdown-contained-candidate')!;
    const copy = JSON.stringify(fx);
    validateStrategyCandidateSafety(fx);
    expect(JSON.stringify(fx)).toBe(copy);
  });
});

// ─── Serializability ──────────────────────────────────────────────────────────

describe('Phase 38 — serializability', () => {
  FIXTURES.forEach(fx => {
    it(`${fx.name} round-trips through JSON`, () => {
      const serialized = serializeStrategyCandidateEvaluationFixture(fx);
      const parsed = JSON.parse(serialized);
      expect(parsed.name).toBe(fx.name);
      expect(parsed.meta.phase).toBe(38);
    });
  });

  it('serialized output is identical across calls', () => {
    const fx = getStrategyCandidateEvaluationFixture('manipulation-avoidance-candidate')!;
    expect(serializeStrategyCandidateEvaluationFixture(fx)).toBe(
      serializeStrategyCandidateEvaluationFixture(fx),
    );
  });
});

// ─── Deterministic ordering and generatedAt ───────────────────────────────────

describe('Phase 38 — deterministic ordering and generatedAt', () => {
  it('all fixtures have same deterministic generatedAt', () => {
    for (const fx of FIXTURES) {
      expect(fx.meta.generatedAt).toBe(PHASE_38_STRATEGY_CANDIDATES_GENERATED_AT);
      expect(fx.summary.generatedAt).toBe(PHASE_38_STRATEGY_CANDIDATES_GENERATED_AT);
    }
  });

  it('fixture list is deterministically sorted', () => {
    const names = listStrategyCandidateEvaluationFixtures();
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });

  it('all safeNotes are sorted', () => {
    for (const fx of FIXTURES) {
      const sorted = [...fx.safeNotes].sort((a, b) => a.localeCompare(b));
      expect(fx.safeNotes).toEqual(sorted);
    }
  });

  it('all meta.notes are sorted', () => {
    for (const fx of FIXTURES) {
      const sorted = [...fx.meta.notes].sort((a, b) => a.localeCompare(b));
      expect(fx.meta.notes).toEqual(sorted);
    }
  });

  it('all summary.notes are sorted', () => {
    for (const fx of FIXTURES) {
      const sorted = [...fx.summary.notes].sort((a, b) => a.localeCompare(b));
      expect(fx.summary.notes).toEqual(sorted);
    }
  });

  it('all summary.topRiskCodes are sorted', () => {
    for (const fx of FIXTURES) {
      const sorted = [...fx.summary.topRiskCodes].sort((a, b) => a.localeCompare(b));
      expect(fx.summary.topRiskCodes).toEqual(sorted);
    }
  });

  it('all summary.topQualityCodes are sorted', () => {
    for (const fx of FIXTURES) {
      const sorted = [...fx.summary.topQualityCodes].sort((a, b) => a.localeCompare(b));
      expect(fx.summary.topQualityCodes).toEqual(sorted);
    }
  });
});

// ─── No real wallet addresses / transaction hashes / personal data ─────────────

describe('Phase 38 — no real wallet addresses, transaction hashes, or personal data', () => {
  FIXTURES.forEach(fx => {
    it(`${fx.name}: no Solana address in payload`, () => {
      const allStrings = collectStringValues(fx);
      for (const str of allStrings) {
        expect(/\b[1-9A-HJ-NP-Za-km-z]{32,44}\b/.test(str)).toBe(false);
      }
    });

    it(`${fx.name}: no transaction hash in payload`, () => {
      const allStrings = collectStringValues(fx);
      for (const str of allStrings) {
        expect(/\b[1-9A-HJ-NP-Za-km-z]{64,88}\b/.test(str)).toBe(false);
      }
    });

    it(`${fx.name}: no email addresses in payload`, () => {
      const allStrings = collectStringValues(fx);
      for (const str of allStrings) {
        expect(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(str)).toBe(false);
      }
    });
  });
});

// ─── No secrets / stack traces / local paths ──────────────────────────────────

describe('Phase 38 — no secrets, stack traces, or local paths', () => {
  FIXTURES.forEach(fx => {
    it(`${fx.name}: no secret patterns`, () => {
      const allStrings = collectStringValues(fx);
      for (const str of allStrings) {
        expect(/\b(?:private key|seed phrase|mnemonic|api key|secret token|BEGIN PRIVATE KEY)\b/i.test(str)).toBe(false);
      }
    });

    it(`${fx.name}: no stack trace patterns`, () => {
      const allStrings = collectStringValues(fx);
      for (const str of allStrings) {
        expect(/(?:TypeError:|ReferenceError:|SyntaxError:|\bat\s+\S+\s+\()/.test(str)).toBe(false);
      }
    });

    it(`${fx.name}: no local paths`, () => {
      const allStrings = collectStringValues(fx);
      for (const str of allStrings) {
        expect(/(?:\/home\/|\/Users\/|C:\\Users\\|file:\/\/)/.test(str)).toBe(false);
      }
    });
  });
});

// ─── No live-data claims ──────────────────────────────────────────────────────

describe('Phase 38 — no live-data claims', () => {
  FIXTURES.forEach(fx => {
    it(`${fx.name}: no live-data language in payload`, () => {
      const allStrings = collectStringValues(fx);
      for (const str of allStrings) {
        expect(/\b(?:live data|real-time|solana rpc|provider api|jito|mev|mempool|yellowstone|geyser|helius|websocket|fetch|axios)\b/i.test(str)).toBe(false);
      }
    });
  });
});

// ─── No real scoring / replay / trading ───────────────────────────────────────

describe('Phase 38 — no real scoring, replay, or trading', () => {
  FIXTURES.forEach(fx => {
    it(`${fx.name}: meta.realScoring=false`, () => {
      expect(fx.meta.realScoring).toBe(false);
    });

    it(`${fx.name}: meta.realBacktesting=false`, () => {
      expect(fx.meta.realBacktesting).toBe(false);
    });

    it(`${fx.name}: meta.paperTrading=false`, () => {
      expect(fx.meta.paperTrading).toBe(false);
    });

    it(`${fx.name}: meta.liveTrading=false`, () => {
      expect(fx.meta.liveTrading).toBe(false);
    });

    it(`${fx.name}: meta.execution=false`, () => {
      expect(fx.meta.execution).toBe(false);
    });

    it(`${fx.name}: summary.realScoring=false`, () => {
      expect(fx.summary.realScoring).toBe(false);
    });

    it(`${fx.name}: summary.execution=false`, () => {
      expect(fx.summary.execution).toBe(false);
    });
  });
});

// ─── No RPC / Jito / MEV / external network ───────────────────────────────────

describe('Phase 38 — no RPC, Jito, MEV, mempool, or external network', () => {
  FIXTURES.forEach(fx => {
    it(`${fx.name}: meta.externalNetwork=false`, () => {
      expect(fx.meta.externalNetwork).toBe(false);
    });
  });
});

// ─── No wallet / trading / execution logic ────────────────────────────────────

describe('Phase 38 — no wallet, trading, or execution logic', () => {
  FIXTURES.forEach(fx => {
    it(`${fx.name}: meta.execution=false`, () => {
      expect(fx.meta.execution).toBe(false);
    });

    it(`${fx.name}: no execution wording in payload`, () => {
      const allStrings = collectStringValues(fx);
      for (const str of allStrings) {
        expect(/\b(?:sign transaction|send transaction|sendRawTransaction|swap|buy|sell)\b/i.test(str)).toBe(false);
      }
    });
  });
});

// ─── No investment advice / trading signals ───────────────────────────────────

describe('Phase 38 — no investment advice or trading signals', () => {
  FIXTURES.forEach(fx => {
    it(`${fx.name}: no advice/signal wording in payload`, () => {
      const allStrings = collectStringValues(fx);
      for (const str of allStrings) {
        expect(/\b(?:investment advice|recommendation|trading signal|entry point|exit target|price target)\b/i.test(str)).toBe(false);
      }
    });
  });
});

// ─── No real PnL / balance / order / fill claims ──────────────────────────────

describe('Phase 38 — no real PnL, balance, order, or fill claims', () => {
  FIXTURES.forEach(fx => {
    it(`${fx.name}: no real PnL language`, () => {
      const allStrings = collectStringValues(fx);
      for (const str of allStrings) {
        expect(/\b(?:real pnl|live pnl|balance|order fill|filled order|paper trade|live trade)\b/i.test(str)).toBe(false);
      }
    });
  });
});

// ─── No external network / fetch / axios / websocket ─────────────────────────

describe('Phase 38 — no external network calls in runtime source', () => {
  NON_VALIDATION_PHASE_38_FILES.forEach(filePath => {
    it(`${filePath.split('/').pop()} contains no forbidden runtime patterns`, () => {
      const content = readFileSync(filePath, 'utf8');
      for (const pattern of FORBIDDEN_RUNTIME_PATTERNS) {
        expect(pattern.test(content)).toBe(false);
      }
    });
  });
});

// ─── No filesystem writes / file export / download APIs ──────────────────────

describe('Phase 38 — no filesystem writes or file export', () => {
  PHASE_38_FILES.forEach(filePath => {
    it(`${filePath.split('/').pop()} has no filesystem write patterns`, () => {
      const content = readFileSync(filePath, 'utf8');
      expect(/writeFileSync\s*\(/.test(content)).toBe(false);
      expect(/fs\.writeFile\s*\(/.test(content)).toBe(false);
      expect(/createWriteStream\s*\(/.test(content)).toBe(false);
      expect(/URL\.createObjectURL/.test(content)).toBe(false);
      expect(/document\.createElement\(['"]a['"]\)/.test(content)).toBe(false);
    });
  });
});

// ─── No Date.now / new Date / Math.random / timers ───────────────────────────

describe('Phase 38 — no Date.now, new Date, Math.random, or timers in runtime source', () => {
  NON_VALIDATION_PHASE_38_FILES.forEach(filePath => {
    it(`${filePath.split('/').pop()} contains no nondeterministic patterns`, () => {
      const content = readFileSync(filePath, 'utf8');
      expect(/Date\.now\s*\(/.test(content)).toBe(false);
      expect(/new Date\s*\(/.test(content)).toBe(false);
      expect(/Math\.random\s*\(/.test(content)).toBe(false);
      expect(/setTimeout\s*\(/.test(content)).toBe(false);
      expect(/setInterval\s*\(/.test(content)).toBe(false);
    });
  });
});

// ─── Phase 38 capability flags ────────────────────────────────────────────────

describe('Phase 38 — capability flags', () => {
  const caps = getStrategyCandidateFixtureCapabilities();

  it('strategyCandidateEvaluationFixtures is true', () => {
    expect(caps.strategyCandidateEvaluationFixtures).toBe(true);
  });

  it('syntheticStrategyCandidates is true', () => {
    expect(caps.syntheticStrategyCandidates).toBe(true);
  });

  it('strategyCandidateBuilders is true', () => {
    expect(caps.strategyCandidateBuilders).toBe(true);
  });

  it('strategyCandidateSafetyValidation is true', () => {
    expect(caps.strategyCandidateSafetyValidation).toBe(true);
  });

  it('strategyCandidateScoreBandReferences is true', () => {
    expect(caps.strategyCandidateScoreBandReferences).toBe(true);
  });

  it('strategyCandidateRealScoring is false', () => {
    expect(caps.strategyCandidateRealScoring).toBe(false);
  });

  it('strategyCandidateRealBacktesting is false', () => {
    expect(caps.strategyCandidateRealBacktesting).toBe(false);
  });

  it('strategyCandidatePaperTrading is false', () => {
    expect(caps.strategyCandidatePaperTrading).toBe(false);
  });

  it('strategyCandidateLiveTrading is false', () => {
    expect(caps.strategyCandidateLiveTrading).toBe(false);
  });

  it('strategyCandidateExecution is false', () => {
    expect(caps.strategyCandidateExecution).toBe(false);
  });

  it('strategyCandidateSolanaRpc is false', () => {
    expect(caps.strategyCandidateSolanaRpc).toBe(false);
  });

  it('strategyCandidateExternalNetwork is false', () => {
    expect(caps.strategyCandidateExternalNetwork).toBe(false);
  });

  it('strategyCandidatePersistence is false', () => {
    expect(caps.strategyCandidatePersistence).toBe(false);
  });

  it('strategyCandidateFileExport is false', () => {
    expect(caps.strategyCandidateFileExport).toBe(false);
  });

  it('strategyCandidateInvestmentAdvice is false', () => {
    expect(caps.strategyCandidateInvestmentAdvice).toBe(false);
  });

  it('strategyCandidateTradingSignals is false', () => {
    expect(caps.strategyCandidateTradingSignals).toBe(false);
  });

  it('getStrategyCandidateFixtureCapabilities returns stable result', () => {
    expect(getStrategyCandidateFixtureCapabilities()).toEqual(
      getStrategyCandidateFixtureCapabilities(),
    );
  });
});

// ─── Builder negative tests ───────────────────────────────────────────────────

describe('Phase 38 — builder negative tests', () => {
  it('rejects unknown fixture name', () => {
    const result = buildStrategyCandidateEvaluationFixture({
      name: 'totally-invalid-name',
      kind: 'defensive-new-launch',
      profile: {
        candidateId: 'id',
        title: 'title',
        family: 'defensive',
        objective: 'objective',
        horizon: 'short',
        evaluationMode: 'analysis-only',
        fixtureOnly: true,
        syntheticOnly: true,
        notes: [],
      },
      scoreBandReference: {
        scoreBandOutcomeFixtureName: 'low-score-safe-skip',
        scoreBandOutcomeFixtureKind: 'low-score-safe-skip',
        scoreBandCategory: 'low',
        referencedReplayOutcomeFixtureName: 'avoided-high-risk-loss-outcome',
        notes: [],
      },
    });
    expect(result.success).toBe(false);
    expect(result.fixture).toBeNull();
    expect(result.validation.issues).toBeDefined();
  });

  it('rejects unknown fixture kind', () => {
    const result = buildStrategyCandidateEvaluationFixture({
      name: 'defensive-new-launch-candidate',
      kind: 'completely-unknown-kind',
      profile: {
        candidateId: 'id',
        title: 'title',
        family: 'defensive',
        objective: 'objective',
        horizon: 'short',
        evaluationMode: 'analysis-only',
        fixtureOnly: true,
        syntheticOnly: true,
        notes: [],
      },
      scoreBandReference: {
        scoreBandOutcomeFixtureName: 'low-score-safe-skip',
        scoreBandOutcomeFixtureKind: 'low-score-safe-skip',
        scoreBandCategory: 'low',
        referencedReplayOutcomeFixtureName: 'avoided-high-risk-loss-outcome',
        notes: [],
      },
    });
    expect(result.success).toBe(false);
    expect(result.fixture).toBeNull();
  });

  it('returns validation error codes for invalid name', () => {
    const result = buildStrategyCandidateEvaluationFixture({
      name: 'bad-name',
      kind: 'bad-kind',
      profile: {
        candidateId: 'id',
        title: 'title',
        family: 'defensive',
        objective: 'objective',
        horizon: 'short',
        evaluationMode: 'analysis-only',
        fixtureOnly: true,
        syntheticOnly: true,
        notes: [],
      },
      scoreBandReference: {
        scoreBandOutcomeFixtureName: 'low-score-safe-skip',
        scoreBandOutcomeFixtureKind: 'low-score-safe-skip',
        scoreBandCategory: 'low',
        referencedReplayOutcomeFixtureName: 'avoided-high-risk-loss-outcome',
        notes: [],
      },
    });
    expect(result.validation.issues.some(i => i.code === 'INVALID_NAME')).toBe(true);
  });

  it('does not throw for null-like inputs', () => {
    expect(() =>
      buildStrategyCandidateEvaluationFixture({
        name: '',
        kind: '',
        profile: {
          candidateId: '',
          title: '',
          family: 'defensive',
          objective: '',
          horizon: 'unknown',
          evaluationMode: 'analysis-only',
          fixtureOnly: true,
          syntheticOnly: true,
          notes: [],
        },
        scoreBandReference: {
          scoreBandOutcomeFixtureName: 'low-score-safe-skip',
          scoreBandOutcomeFixtureKind: 'low-score-safe-skip',
          scoreBandCategory: 'low',
          referencedReplayOutcomeFixtureName: 'avoided-high-risk-loss-outcome',
          notes: [],
        },
      }),
    ).not.toThrow();
  });
});

// ─── Dashboard/API compatibility ──────────────────────────────────────────────

describe('Phase 38 — dashboard and read-only-api capability compatibility', () => {
  it('getDashboardUiShellCapabilities returns expected structure', () => {
    const caps = getDashboardUiShellCapabilities();
    expect(caps).toBeDefined();
    expect(typeof caps).toBe('object');
  });

  it('getLocalReadOnlyApiCapabilities returns expected structure', () => {
    const caps = getLocalReadOnlyApiCapabilities();
    expect(caps).toBeDefined();
    expect(typeof caps).toBe('object');
  });
});

// ─── Safety boundary regression ───────────────────────────────────────────────

describe('Phase 38 — safety boundary regression', () => {
  it('no fixture declares liveData as true', () => {
    for (const fx of FIXTURES) {
      expect(fx.meta.liveData).toBe(false);
      expect(fx.summary.liveData).toBe(false);
    }
  });

  it('no fixture declares execution as true', () => {
    for (const fx of FIXTURES) {
      expect(fx.meta.execution).toBe(false);
      expect(fx.summary.execution).toBe(false);
    }
  });

  it('no fixture declares persistence as true', () => {
    for (const fx of FIXTURES) {
      expect(fx.meta.persistence).toBe(false);
    }
  });

  it('no fixture declares fileExport as true', () => {
    for (const fx of FIXTURES) {
      expect(fx.meta.fileExport).toBe(false);
    }
  });

  it('no fixture declares externalNetwork as true', () => {
    for (const fx of FIXTURES) {
      expect(fx.meta.externalNetwork).toBe(false);
    }
  });

  it('no fixture declares nonAdvisory as false', () => {
    for (const fx of FIXTURES) {
      expect(fx.meta.nonAdvisory).toBe(true);
      expect(fx.summary.nonAdvisory).toBe(true);
    }
  });

  it('no fixture declares nonAccusatory as false', () => {
    for (const fx of FIXTURES) {
      expect(fx.meta.nonAccusatory).toBe(true);
      expect(fx.summary.nonAccusatory).toBe(true);
    }
  });

  it('all fixtures are safe-to-display', () => {
    for (const fx of FIXTURES) {
      expect(fx.summary.safeToDisplay).toBe(true);
    }
  });

  it('all fixtures are read-only', () => {
    for (const fx of FIXTURES) {
      expect(fx.meta.readOnly).toBe(true);
    }
  });

  it('all fixtures are local-only', () => {
    for (const fx of FIXTURES) {
      expect(fx.meta.localOnly).toBe(true);
      expect(fx.summary.localOnly).toBe(true);
    }
  });

  it('all fixtures are inMemoryOnly', () => {
    for (const fx of FIXTURES) {
      expect(fx.meta.inMemoryOnly).toBe(true);
    }
  });

  it('capabilities have all false safety flags', () => {
    const caps = getStrategyCandidateFixtureCapabilities();
    expect(caps.strategyCandidateRealScoring).toBe(false);
    expect(caps.strategyCandidateRealBacktesting).toBe(false);
    expect(caps.strategyCandidatePaperTrading).toBe(false);
    expect(caps.strategyCandidateLiveTrading).toBe(false);
    expect(caps.strategyCandidateExecution).toBe(false);
    expect(caps.strategyCandidateSolanaRpc).toBe(false);
    expect(caps.strategyCandidateExternalNetwork).toBe(false);
    expect(caps.strategyCandidatePersistence).toBe(false);
    expect(caps.strategyCandidateFileExport).toBe(false);
    expect(caps.strategyCandidateInvestmentAdvice).toBe(false);
    expect(caps.strategyCandidateTradingSignals).toBe(false);
  });
});

// ─── docs exist ───────────────────────────────────────────────────────────────

describe('Phase 38 — documentation exists', () => {
  it('docs/SCORE_BAND_OUTCOME_ANALYSIS_MODELS.md exists', () => {
    const docPath = resolve(REPO_ROOT, 'docs/SCORE_BAND_OUTCOME_ANALYSIS_MODELS.md');
    expect(() => readFileSync(docPath, 'utf8')).not.toThrow();
  });

  it('docs/PHASE_LOG.md mentions Phase 38', () => {
    const content = readFileSync(resolve(REPO_ROOT, 'docs/PHASE_LOG.md'), 'utf8');
    expect(content).toMatch(/Phase 38/);
  });
});
