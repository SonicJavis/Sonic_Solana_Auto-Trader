/**
 * Phase 37 — Score Band Outcome Analysis Models v1
 */

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import {
  PHASE_37_SCORE_BAND_OUTCOMES_GENERATED_AT,
  PHASE_37_SCORE_BAND_OUTCOMES_SOURCE,
  SCORE_BAND_OUTCOME_ANALYSIS_FIXTURE_NAMES,
  SCORE_BAND_OUTCOME_ANALYSIS_FIXTURE_KINDS,
  SCORE_BAND_RANGE_CATEGORIES,
  buildScoreBandOutcomeAnalysisFixture,
  buildScoreBandOutcomeSummary,
  normalizeScoreBandOutcomeAnalysisFixture,
  serializeScoreBandOutcomeAnalysisFixture,
  isScoreBandOutcomeAnalysisFixtureSerializable,
  areScoreBandOutcomeAnalysisFixturesEqual,
  validateScoreBandOutcomeAnalysisFixture,
  validateScoreBandOutcomeSafety,
  getScoreBandOutcomeFixtureCapabilities,
  PHASE_37_SCORE_BAND_OUTCOME_ANALYSIS_FIXTURES,
  listScoreBandOutcomeAnalysisFixtures,
  getScoreBandOutcomeAnalysisFixture,
  REPLAY_OUTCOME_FIXTURE_NAMES,
  REPLAY_OUTCOME_FIXTURE_KINDS,
} from '@sonic/offline-intelligence';
import { getDashboardUiShellCapabilities } from '@sonic/dashboard';
import { getLocalReadOnlyApiCapabilities } from '@sonic/read-only-api';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const PHASE_37_SRC = resolve(REPO_ROOT, 'packages/offline-intelligence/src/score-band-outcomes');

const PHASE_37_FILES = [
  'types.ts',
  'capabilities.ts',
  'normalization.ts',
  'validation.ts',
  'builders.ts',
  'fixtures.ts',
  'index.ts',
].map(file => resolve(PHASE_37_SRC, file));

const NON_VALIDATION_PHASE_37_FILES = PHASE_37_FILES.filter(file => !file.endsWith('validation.ts'));

const REQUIRED_FIXTURE_NAMES = [
  'low-score-safe-skip',
  'low-score-false-negative',
  'medium-score-watchlist-flat',
  'medium-score-mixed-outcome',
  'high-score-positive-outcome',
  'high-score-false-positive',
  'manipulation-risk-avoidance',
  'creator-risk-avoidance',
  'wallet-risk-avoidance',
  'insufficient-data',
  'missed-opportunity',
  'drawdown-contained',
  'no-action-safety',
  'malformed-input-safe',
  'dashboard-ready-score-band',
  'report-ready-score-band',
] as const;

const FIXTURE_NAMES = listScoreBandOutcomeAnalysisFixtures();
const FIXTURES = FIXTURE_NAMES.map(name => {
  const fixture = getScoreBandOutcomeAnalysisFixture(name);
  if (!fixture) throw new Error(`Missing Phase 37 fixture: ${name}`);
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

describe('Phase 37 — module exports', () => {
  const exportedFunctions: Array<[string, unknown]> = [
    ['buildScoreBandOutcomeAnalysisFixture', buildScoreBandOutcomeAnalysisFixture],
    ['buildScoreBandOutcomeSummary', buildScoreBandOutcomeSummary],
    ['normalizeScoreBandOutcomeAnalysisFixture', normalizeScoreBandOutcomeAnalysisFixture],
    ['serializeScoreBandOutcomeAnalysisFixture', serializeScoreBandOutcomeAnalysisFixture],
    ['isScoreBandOutcomeAnalysisFixtureSerializable', isScoreBandOutcomeAnalysisFixtureSerializable],
    ['areScoreBandOutcomeAnalysisFixturesEqual', areScoreBandOutcomeAnalysisFixturesEqual],
    ['validateScoreBandOutcomeAnalysisFixture', validateScoreBandOutcomeAnalysisFixture],
    ['validateScoreBandOutcomeSafety', validateScoreBandOutcomeSafety],
    ['listScoreBandOutcomeAnalysisFixtures', listScoreBandOutcomeAnalysisFixtures],
    ['getScoreBandOutcomeAnalysisFixture', getScoreBandOutcomeAnalysisFixture],
    ['getScoreBandOutcomeFixtureCapabilities', getScoreBandOutcomeFixtureCapabilities],
  ];

  exportedFunctions.forEach(([name, value]) => {
    it(`${name} is exported`, () => {
      expect(typeof value).toBe('function');
    });
  });

  it('PHASE_37_SCORE_BAND_OUTCOMES_GENERATED_AT is deterministic', () => {
    expect(PHASE_37_SCORE_BAND_OUTCOMES_GENERATED_AT).toBe('2026-01-01T00:00:00.000Z');
  });

  it('PHASE_37_SCORE_BAND_OUTCOMES_SOURCE is correct', () => {
    expect(PHASE_37_SCORE_BAND_OUTCOMES_SOURCE).toBe(
      'phase37_score_band_outcome_analysis_models_v1',
    );
  });

  it('fixture names expose 16 values', () => {
    expect(SCORE_BAND_OUTCOME_ANALYSIS_FIXTURE_NAMES.length).toBe(16);
  });

  it('fixture kinds expose 16 values', () => {
    expect(SCORE_BAND_OUTCOME_ANALYSIS_FIXTURE_KINDS.length).toBe(16);
  });

  it('score band categories expose 4 values', () => {
    expect(SCORE_BAND_RANGE_CATEGORIES.length).toBe(4);
    expect(SCORE_BAND_RANGE_CATEGORIES).toContain('low');
    expect(SCORE_BAND_RANGE_CATEGORIES).toContain('medium');
    expect(SCORE_BAND_RANGE_CATEGORIES).toContain('high');
    expect(SCORE_BAND_RANGE_CATEGORIES).toContain('unknown');
  });

  it('fixture map has 16 entries', () => {
    expect(PHASE_37_SCORE_BAND_OUTCOME_ANALYSIS_FIXTURES.size).toBe(16);
  });
});

// ─── Fixture list and lookup helpers ──────────────────────────────────────────

describe('Phase 37 — fixture list and lookup helpers', () => {
  it('listScoreBandOutcomeAnalysisFixtures returns 16 entries', () => {
    expect(listScoreBandOutcomeAnalysisFixtures().length).toBe(16);
  });

  it('listScoreBandOutcomeAnalysisFixtures returns sorted names', () => {
    const names = listScoreBandOutcomeAnalysisFixtures();
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  it('listScoreBandOutcomeAnalysisFixtures is stable across calls', () => {
    const a = listScoreBandOutcomeAnalysisFixtures();
    const b = listScoreBandOutcomeAnalysisFixtures();
    expect(a).toEqual(b);
  });

  REQUIRED_FIXTURE_NAMES.forEach(name => {
    it(`contains required fixture ${name}`, () => {
      expect(listScoreBandOutcomeAnalysisFixtures()).toContain(name);
    });

    it(`lookup resolves required fixture ${name}`, () => {
      expect(getScoreBandOutcomeAnalysisFixture(name)?.name).toBe(name);
    });
  });

  it('getScoreBandOutcomeAnalysisFixture returns undefined for unknown name', () => {
    expect(getScoreBandOutcomeAnalysisFixture('unknown-phase37' as never)).toBeUndefined();
  });
});

// ─── All 16 required fixtures ─────────────────────────────────────────────────

describe('Phase 37 — all 16 required fixtures exist and are valid', () => {
  REQUIRED_FIXTURE_NAMES.forEach(name => {
    describe(`fixture: ${name}`, () => {
      it('exists', () => {
        expect(getScoreBandOutcomeAnalysisFixture(name)).toBeDefined();
      });

      it('has correct name', () => {
        expect(getScoreBandOutcomeAnalysisFixture(name)?.name).toBe(name);
      });

      it('has phase 37 meta', () => {
        expect(getScoreBandOutcomeAnalysisFixture(name)?.meta.phase).toBe(37);
      });

      it('passes full validation', () => {
        const fixture = getScoreBandOutcomeAnalysisFixture(name)!;
        const result = validateScoreBandOutcomeAnalysisFixture(fixture);
        expect(result.valid).toBe(true);
        expect(result.issues).toHaveLength(0);
      });

      it('passes safety validation', () => {
        const fixture = getScoreBandOutcomeAnalysisFixture(name)!;
        const result = validateScoreBandOutcomeSafety(fixture);
        expect(result.safe).toBe(true);
        expect(result.violations).toHaveLength(0);
      });

      it('is JSON-serializable', () => {
        const fixture = getScoreBandOutcomeAnalysisFixture(name)!;
        expect(isScoreBandOutcomeAnalysisFixtureSerializable(fixture)).toBe(true);
      });

      it('has fixtureOnly=true', () => {
        expect(getScoreBandOutcomeAnalysisFixture(name)?.meta.fixtureOnly).toBe(true);
      });

      it('has syntheticOnly=true', () => {
        expect(getScoreBandOutcomeAnalysisFixture(name)?.meta.syntheticOnly).toBe(true);
      });

      it('has deterministic=true', () => {
        expect(getScoreBandOutcomeAnalysisFixture(name)?.meta.deterministic).toBe(true);
      });

      it('has liveData=false', () => {
        expect(getScoreBandOutcomeAnalysisFixture(name)?.meta.liveData).toBe(false);
      });

      it('has realScoring=false', () => {
        expect(getScoreBandOutcomeAnalysisFixture(name)?.meta.realScoring).toBe(false);
      });

      it('has realBacktesting=false', () => {
        expect(getScoreBandOutcomeAnalysisFixture(name)?.meta.realBacktesting).toBe(false);
      });

      it('has paperTrading=false', () => {
        expect(getScoreBandOutcomeAnalysisFixture(name)?.meta.paperTrading).toBe(false);
      });

      it('has liveTrading=false', () => {
        expect(getScoreBandOutcomeAnalysisFixture(name)?.meta.liveTrading).toBe(false);
      });

      it('has execution=false', () => {
        expect(getScoreBandOutcomeAnalysisFixture(name)?.meta.execution).toBe(false);
      });

      it('has nonAdvisory=true', () => {
        expect(getScoreBandOutcomeAnalysisFixture(name)?.meta.nonAdvisory).toBe(true);
      });

      it('has nonAccusatory=true', () => {
        expect(getScoreBandOutcomeAnalysisFixture(name)?.meta.nonAccusatory).toBe(true);
      });

      it('has summary.safeToDisplay=true', () => {
        expect(getScoreBandOutcomeAnalysisFixture(name)?.summary.safeToDisplay).toBe(true);
      });

      it('summary.name matches fixture.name', () => {
        const fx = getScoreBandOutcomeAnalysisFixture(name)!;
        expect(fx.summary.name).toBe(fx.name);
      });

      it('summary.kind matches fixture.kind', () => {
        const fx = getScoreBandOutcomeAnalysisFixture(name)!;
        expect(fx.summary.kind).toBe(fx.kind);
      });

      it('summary.generatedAt matches constant', () => {
        expect(getScoreBandOutcomeAnalysisFixture(name)?.summary.generatedAt).toBe(
          PHASE_37_SCORE_BAND_OUTCOMES_GENERATED_AT,
        );
      });

      it('meta.generatedAt matches constant', () => {
        expect(getScoreBandOutcomeAnalysisFixture(name)?.meta.generatedAt).toBe(
          PHASE_37_SCORE_BAND_OUTCOMES_GENERATED_AT,
        );
      });

      it('meta.source matches constant', () => {
        expect(getScoreBandOutcomeAnalysisFixture(name)?.meta.source).toBe(
          PHASE_37_SCORE_BAND_OUTCOMES_SOURCE,
        );
      });

      it('outcomeReference references valid Phase 36 fixture', () => {
        const fx = getScoreBandOutcomeAnalysisFixture(name)!;
        expect(
          (REPLAY_OUTCOME_FIXTURE_NAMES as readonly string[]).includes(
            fx.outcomeReference.replayOutcomeFixtureName,
          ),
        ).toBe(true);
      });

      it('outcomeReference has valid fixture kind', () => {
        const fx = getScoreBandOutcomeAnalysisFixture(name)!;
        expect(
          (REPLAY_OUTCOME_FIXTURE_KINDS as readonly string[]).includes(
            fx.outcomeReference.replayOutcomeFixtureKind,
          ),
        ).toBe(true);
      });

      it('has riskIndicators array', () => {
        const fx = getScoreBandOutcomeAnalysisFixture(name)!;
        expect(Array.isArray(fx.riskIndicators)).toBe(true);
        expect(fx.riskIndicators.length).toBeGreaterThan(0);
      });

      it('has qualityIndicators array', () => {
        const fx = getScoreBandOutcomeAnalysisFixture(name)!;
        expect(Array.isArray(fx.qualityIndicators)).toBe(true);
        expect(fx.qualityIndicators.length).toBeGreaterThan(0);
      });

      it('has confidenceIndicators array', () => {
        const fx = getScoreBandOutcomeAnalysisFixture(name)!;
        expect(Array.isArray(fx.confidenceIndicators)).toBe(true);
        expect(fx.confidenceIndicators.length).toBeGreaterThan(0);
      });

      it('has scoreBandRange', () => {
        const fx = getScoreBandOutcomeAnalysisFixture(name)!;
        expect(fx.scoreBandRange).toBeDefined();
        expect(typeof fx.scoreBandRange.lowerLabel).toBe('string');
        expect(typeof fx.scoreBandRange.upperLabel).toBe('string');
        expect(['low', 'medium', 'high', 'unknown']).toContain(fx.scoreBandRange.category);
      });

      it('has outcomeDistribution', () => {
        const fx = getScoreBandOutcomeAnalysisFixture(name)!;
        expect(fx.outcomeDistribution).toBeDefined();
        expect(typeof fx.outcomeDistribution.syntheticOutcomeCount).toBe('number');
      });

      it('has safeNotes array', () => {
        const fx = getScoreBandOutcomeAnalysisFixture(name)!;
        expect(Array.isArray(fx.safeNotes)).toBe(true);
      });

      it('payload contains no forbidden patterns', () => {
        const fx = getScoreBandOutcomeAnalysisFixture(name)!;
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

describe('Phase 37 — buildScoreBandOutcomeSummary', () => {
  it('returns fixture summary', () => {
    const fx = getScoreBandOutcomeAnalysisFixture('high-score-positive-outcome')!;
    const summary = buildScoreBandOutcomeSummary(fx);
    expect(summary).toEqual(fx.summary);
  });

  it('summary.phase is 37', () => {
    const fx = FIXTURES[0]!;
    expect(buildScoreBandOutcomeSummary(fx).phase).toBe(37);
  });

  it('summary is stable when called twice', () => {
    const fx = getScoreBandOutcomeAnalysisFixture('no-action-safety')!;
    expect(buildScoreBandOutcomeSummary(fx)).toEqual(buildScoreBandOutcomeSummary(fx));
  });
});

// ─── Normalization helpers ────────────────────────────────────────────────────

describe('Phase 37 — normalization', () => {
  it('normalizeScoreBandOutcomeAnalysisFixture is idempotent', () => {
    const fx = getScoreBandOutcomeAnalysisFixture('low-score-safe-skip')!;
    const once = normalizeScoreBandOutcomeAnalysisFixture(fx);
    const twice = normalizeScoreBandOutcomeAnalysisFixture(once);
    expect(once).toEqual(twice);
  });

  it('normalizeScoreBandOutcomeAnalysisFixture does not mutate input', () => {
    const fx = getScoreBandOutcomeAnalysisFixture('medium-score-watchlist-flat')!;
    const original = JSON.stringify(fx);
    normalizeScoreBandOutcomeAnalysisFixture(fx);
    expect(JSON.stringify(fx)).toBe(original);
  });

  it('serializeScoreBandOutcomeAnalysisFixture returns stable JSON', () => {
    const fx = getScoreBandOutcomeAnalysisFixture('high-score-positive-outcome')!;
    const a = serializeScoreBandOutcomeAnalysisFixture(fx);
    const b = serializeScoreBandOutcomeAnalysisFixture(fx);
    expect(a).toBe(b);
  });

  it('isScoreBandOutcomeAnalysisFixtureSerializable returns true for valid fixture', () => {
    const fx = FIXTURES[0]!;
    expect(isScoreBandOutcomeAnalysisFixtureSerializable(fx)).toBe(true);
  });

  it('isScoreBandOutcomeAnalysisFixtureSerializable returns false for non-serializable', () => {
    const circular: Record<string, unknown> = {};
    circular['self'] = circular;
    expect(isScoreBandOutcomeAnalysisFixtureSerializable(circular)).toBe(false);
  });

  it('areScoreBandOutcomeAnalysisFixturesEqual returns true for same fixture', () => {
    const fx = getScoreBandOutcomeAnalysisFixture('drawdown-contained')!;
    expect(areScoreBandOutcomeAnalysisFixturesEqual(fx, fx)).toBe(true);
  });

  it('areScoreBandOutcomeAnalysisFixturesEqual returns false for different fixtures', () => {
    const fx1 = getScoreBandOutcomeAnalysisFixture('low-score-safe-skip')!;
    const fx2 = getScoreBandOutcomeAnalysisFixture('high-score-positive-outcome')!;
    expect(areScoreBandOutcomeAnalysisFixturesEqual(fx1, fx2)).toBe(false);
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

describe('Phase 37 — validation success', () => {
  FIXTURES.forEach(fx => {
    it(`validateScoreBandOutcomeAnalysisFixture passes for ${fx.name}`, () => {
      const result = validateScoreBandOutcomeAnalysisFixture(fx);
      expect(result.valid).toBe(true);
      expect(result.issues).toHaveLength(0);
    });
  });
});

// ─── Validation failure paths ─────────────────────────────────────────────────

describe('Phase 37 — validation failure paths', () => {
  it('returns invalid for null input', () => {
    const result = validateScoreBandOutcomeAnalysisFixture(null);
    expect(result.valid).toBe(false);
    expect(result.issues.length).toBeGreaterThan(0);
  });

  it('returns invalid for undefined input', () => {
    const result = validateScoreBandOutcomeAnalysisFixture(undefined);
    expect(result.valid).toBe(false);
  });

  it('returns invalid for empty object', () => {
    const result = validateScoreBandOutcomeAnalysisFixture({});
    expect(result.valid).toBe(false);
  });

  it('returns invalid for unknown fixture name', () => {
    const result = validateScoreBandOutcomeAnalysisFixture({ name: 'not-a-valid-name', kind: 'not-valid' });
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.code === 'INVALID_VALUE' || i.code === 'MISSING_REQUIRED_FIELD')).toBe(true);
  });

  it('returns invalid when meta is missing', () => {
    const fx = getScoreBandOutcomeAnalysisFixture('low-score-safe-skip')!;
    const broken = { ...fx, meta: undefined };
    const result = validateScoreBandOutcomeAnalysisFixture(broken);
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.field === 'meta')).toBe(true);
  });

  it('returns invalid when summary is missing', () => {
    const fx = getScoreBandOutcomeAnalysisFixture('low-score-safe-skip')!;
    const broken = { ...fx, summary: undefined };
    const result = validateScoreBandOutcomeAnalysisFixture(broken);
    expect(result.valid).toBe(false);
  });

  it('returns invalid when meta.phase is wrong', () => {
    const fx = getScoreBandOutcomeAnalysisFixture('low-score-safe-skip')!;
    const broken = { ...fx, meta: { ...fx.meta, phase: 35 } };
    const result = validateScoreBandOutcomeAnalysisFixture(broken);
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.code === 'INVALID_PHASE')).toBe(true);
  });

  it('returns invalid when meta.liveData is true', () => {
    const fx = getScoreBandOutcomeAnalysisFixture('low-score-safe-skip')!;
    const broken = { ...fx, meta: { ...fx.meta, liveData: true } };
    const result = validateScoreBandOutcomeAnalysisFixture(broken);
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.code === 'SAFETY_VIOLATION')).toBe(true);
  });

  it('returns invalid when meta.realScoring is true', () => {
    const fx = getScoreBandOutcomeAnalysisFixture('high-score-positive-outcome')!;
    const broken = { ...fx, meta: { ...fx.meta, realScoring: true } };
    const result = validateScoreBandOutcomeAnalysisFixture(broken);
    expect(result.valid).toBe(false);
  });

  it('returns invalid when meta.execution is true', () => {
    const fx = getScoreBandOutcomeAnalysisFixture('no-action-safety')!;
    const broken = { ...fx, meta: { ...fx.meta, execution: true } };
    const result = validateScoreBandOutcomeAnalysisFixture(broken);
    expect(result.valid).toBe(false);
  });

  it('returns invalid when meta.fixtureOnly is false', () => {
    const fx = getScoreBandOutcomeAnalysisFixture('low-score-safe-skip')!;
    const broken = { ...fx, meta: { ...fx.meta, fixtureOnly: false } };
    const result = validateScoreBandOutcomeAnalysisFixture(broken);
    expect(result.valid).toBe(false);
  });

  it('returns invalid when meta.generatedAt is non-deterministic', () => {
    const fx = getScoreBandOutcomeAnalysisFixture('low-score-safe-skip')!;
    const broken = { ...fx, meta: { ...fx.meta, generatedAt: '2025-01-01T00:00:00.000Z' } };
    const result = validateScoreBandOutcomeAnalysisFixture(broken);
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.code === 'NON_DETERMINISTIC_GENERATED_AT')).toBe(true);
  });

  it('returns invalid when outcomeReference is missing', () => {
    const fx = getScoreBandOutcomeAnalysisFixture('low-score-safe-skip')!;
    const broken = { ...fx, outcomeReference: undefined };
    const result = validateScoreBandOutcomeAnalysisFixture(broken);
    expect(result.valid).toBe(false);
  });

  it('returns invalid when outcomeReference has invalid Phase 36 name', () => {
    const fx = getScoreBandOutcomeAnalysisFixture('low-score-safe-skip')!;
    const broken = {
      ...fx,
      outcomeReference: { ...fx.outcomeReference, replayOutcomeFixtureName: 'not-valid' },
    };
    const result = validateScoreBandOutcomeAnalysisFixture(broken);
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.code === 'INVALID_PHASE36_REF')).toBe(true);
  });

  it('returns invalid when riskIndicators is not an array', () => {
    const fx = getScoreBandOutcomeAnalysisFixture('low-score-safe-skip')!;
    const broken = { ...fx, riskIndicators: null };
    const result = validateScoreBandOutcomeAnalysisFixture(broken);
    expect(result.valid).toBe(false);
  });

  it('returns invalid when summary.name mismatches fixture name', () => {
    const fx = getScoreBandOutcomeAnalysisFixture('low-score-safe-skip')!;
    const broken = {
      ...fx,
      summary: { ...fx.summary, name: 'high-score-positive-outcome' },
    };
    const result = validateScoreBandOutcomeAnalysisFixture(broken);
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.code === 'NAME_MISMATCH')).toBe(true);
  });

  it('returns invalid when safeNotes is not sorted', () => {
    const fx = getScoreBandOutcomeAnalysisFixture('low-score-safe-skip')!;
    const broken = { ...fx, safeNotes: ['Z-note', 'A-note'] };
    const result = validateScoreBandOutcomeAnalysisFixture(broken);
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.code === 'UNSTABLE_ORDERING')).toBe(true);
  });

  it('does not throw for any invalid input type', () => {
    const inputs = [null, undefined, 'string', 42, [], true, {}];
    for (const input of inputs) {
      expect(() => validateScoreBandOutcomeAnalysisFixture(input)).not.toThrow();
    }
  });
});

// ─── Safety validation success paths ─────────────────────────────────────────

describe('Phase 37 — safety validation success', () => {
  FIXTURES.forEach(fx => {
    it(`validateScoreBandOutcomeSafety passes for ${fx.name}`, () => {
      const result = validateScoreBandOutcomeSafety(fx);
      expect(result.safe).toBe(true);
      expect(result.violations).toHaveLength(0);
    });
  });
});

// ─── Safety validation failure paths ─────────────────────────────────────────

describe('Phase 37 — safety validation failure paths', () => {
  it('returns unsafe for null', () => {
    expect(validateScoreBandOutcomeSafety(null).safe).toBe(false);
  });

  it('returns unsafe for undefined', () => {
    expect(validateScoreBandOutcomeSafety(undefined).safe).toBe(false);
  });

  it('returns unsafe when string contains possible Solana address', () => {
    const obj = { notes: ['AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'] };
    const result = validateScoreBandOutcomeSafety(obj);
    expect(result.safe).toBe(false);
    expect(result.violations.some(v => /Solana address/.test(v))).toBe(true);
  });

  it('returns unsafe when string contains stack trace pattern', () => {
    const obj = { notes: ['TypeError: cannot read property'] };
    const result = validateScoreBandOutcomeSafety(obj);
    expect(result.safe).toBe(false);
  });

  it('returns unsafe when string contains local path', () => {
    const obj = { notes: ['/home/user/path'] };
    const result = validateScoreBandOutcomeSafety(obj);
    expect(result.safe).toBe(false);
  });

  it('returns unsafe when string contains a secret keyword', () => {
    const obj = { notes: ['private key found here'] };
    const result = validateScoreBandOutcomeSafety(obj);
    expect(result.safe).toBe(false);
  });

  it('returns unsafe for external URL', () => {
    const obj = { notes: ['see https://example.com'] };
    const result = validateScoreBandOutcomeSafety(obj);
    expect(result.safe).toBe(false);
  });

  it('does not throw for any input type', () => {
    const inputs = [null, undefined, 'string', 42, [], true, {}];
    for (const input of inputs) {
      expect(() => validateScoreBandOutcomeSafety(input)).not.toThrow();
    }
  });

  it('violations array is stable-sorted', () => {
    const obj = { a: 'private key found', b: '/home/user/path' };
    const result = validateScoreBandOutcomeSafety(obj);
    expect(result.violations).toEqual(
      [...result.violations].sort((a, b) => a.localeCompare(b)),
    );
  });
});

// ─── Source-reference compatibility with Phase 36 ─────────────────────────────

describe('Phase 37 — Phase 36 source-reference compatibility', () => {
  FIXTURES.forEach(fx => {
    it(`${fx.name}: replayOutcomeFixtureName is a valid Phase 36 fixture name`, () => {
      expect(
        (REPLAY_OUTCOME_FIXTURE_NAMES as readonly string[]).includes(
          fx.outcomeReference.replayOutcomeFixtureName,
        ),
      ).toBe(true);
    });

    it(`${fx.name}: replayOutcomeFixtureKind is a valid Phase 36 fixture kind`, () => {
      expect(
        (REPLAY_OUTCOME_FIXTURE_KINDS as readonly string[]).includes(
          fx.outcomeReference.replayOutcomeFixtureKind,
        ),
      ).toBe(true);
    });

    it(`${fx.name}: summary.referencedReplayOutcomeFixtureName matches outcomeReference`, () => {
      expect(fx.summary.referencedReplayOutcomeFixtureName).toBe(
        fx.outcomeReference.replayOutcomeFixtureName,
      );
    });
  });
});

// ─── No input mutation ────────────────────────────────────────────────────────

describe('Phase 37 — no input mutation', () => {
  it('buildScoreBandOutcomeAnalysisFixture does not mutate input', () => {
    const input = {
      name: 'low-score-safe-skip' as const,
      kind: 'low-score-safe-skip' as const,
      scoreBandRange: {
        lowerLabel: 'a',
        upperLabel: 'b',
        category: 'low' as const,
        notes: ['note'],
      },
      outcomeReference: {
        replayOutcomeFixtureName: 'avoided-high-risk-loss-outcome' as const,
        replayOutcomeFixtureKind: 'avoided-high-risk-loss' as const,
        scoreBandCategory: 'low' as const,
        notes: ['note'],
      },
      riskIndicators: [
        {
          code: 'SB-RISK-LOW-SAFE-SKIP',
          label: 'low',
          level: 'low' as const,
          category: 'score-band' as const,
          rationale: 'r',
        },
      ],
      qualityIndicators: [
        {
          code: 'SB-QUAL-LOW-SAFE',
          label: 'q',
          level: 'moderate' as const,
          category: 'score-band' as const,
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
    buildScoreBandOutcomeAnalysisFixture(input);
    expect(JSON.stringify(input)).toBe(copy);
  });

  it('normalizeScoreBandOutcomeAnalysisFixture does not mutate input', () => {
    const fx = getScoreBandOutcomeAnalysisFixture('high-score-positive-outcome')!;
    const copy = JSON.stringify(fx);
    normalizeScoreBandOutcomeAnalysisFixture(fx);
    expect(JSON.stringify(fx)).toBe(copy);
  });

  it('validateScoreBandOutcomeAnalysisFixture does not mutate input', () => {
    const fx = getScoreBandOutcomeAnalysisFixture('no-action-safety')!;
    const copy = JSON.stringify(fx);
    validateScoreBandOutcomeAnalysisFixture(fx);
    expect(JSON.stringify(fx)).toBe(copy);
  });

  it('validateScoreBandOutcomeSafety does not mutate input', () => {
    const fx = getScoreBandOutcomeAnalysisFixture('drawdown-contained')!;
    const copy = JSON.stringify(fx);
    validateScoreBandOutcomeSafety(fx);
    expect(JSON.stringify(fx)).toBe(copy);
  });
});

// ─── Serializability ──────────────────────────────────────────────────────────

describe('Phase 37 — serializability', () => {
  FIXTURES.forEach(fx => {
    it(`${fx.name} round-trips through JSON`, () => {
      const serialized = serializeScoreBandOutcomeAnalysisFixture(fx);
      const parsed = JSON.parse(serialized);
      expect(parsed.name).toBe(fx.name);
      expect(parsed.meta.phase).toBe(37);
    });
  });

  it('serialized output is identical across calls', () => {
    const fx = getScoreBandOutcomeAnalysisFixture('manipulation-risk-avoidance')!;
    expect(serializeScoreBandOutcomeAnalysisFixture(fx)).toBe(
      serializeScoreBandOutcomeAnalysisFixture(fx),
    );
  });
});

// ─── Deterministic ordering and generatedAt ───────────────────────────────────

describe('Phase 37 — deterministic ordering and generatedAt', () => {
  it('all fixtures have same deterministic generatedAt', () => {
    for (const fx of FIXTURES) {
      expect(fx.meta.generatedAt).toBe(PHASE_37_SCORE_BAND_OUTCOMES_GENERATED_AT);
      expect(fx.summary.generatedAt).toBe(PHASE_37_SCORE_BAND_OUTCOMES_GENERATED_AT);
    }
  });

  it('fixture list is deterministically sorted', () => {
    const names = listScoreBandOutcomeAnalysisFixtures();
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

describe('Phase 37 — no real wallet addresses, transaction hashes, or personal data', () => {
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

describe('Phase 37 — no secrets, stack traces, or local paths', () => {
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

describe('Phase 37 — no live-data claims', () => {
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

describe('Phase 37 — no real scoring, replay, or trading', () => {
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

describe('Phase 37 — no RPC, Jito, MEV, mempool, or external network', () => {
  FIXTURES.forEach(fx => {
    it(`${fx.name}: meta.externalNetwork=false`, () => {
      expect(fx.meta.externalNetwork).toBe(false);
    });
  });
});

// ─── No wallet / trading / execution logic ────────────────────────────────────

describe('Phase 37 — no wallet, trading, or execution logic', () => {
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

describe('Phase 37 — no investment advice or trading signals', () => {
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

describe('Phase 37 — no real PnL, balance, order, or fill claims', () => {
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

describe('Phase 37 — no external network calls in runtime source', () => {
  NON_VALIDATION_PHASE_37_FILES.forEach(filePath => {
    it(`${filePath.split('/').pop()} contains no forbidden runtime patterns`, () => {
      const content = readFileSync(filePath, 'utf8');
      for (const pattern of FORBIDDEN_RUNTIME_PATTERNS) {
        expect(pattern.test(content)).toBe(false);
      }
    });
  });
});

// ─── No filesystem writes / file export / download APIs ──────────────────────

describe('Phase 37 — no filesystem writes or file export', () => {
  PHASE_37_FILES.forEach(filePath => {
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

describe('Phase 37 — no Date.now, new Date, Math.random, or timers in runtime source', () => {
  NON_VALIDATION_PHASE_37_FILES.forEach(filePath => {
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

// ─── Phase 37 capability flags ────────────────────────────────────────────────

describe('Phase 37 — capability flags', () => {
  const caps = getScoreBandOutcomeFixtureCapabilities();

  it('scoreBandOutcomeAnalysisFixtures is true', () => {
    expect(caps.scoreBandOutcomeAnalysisFixtures).toBe(true);
  });

  it('syntheticScoreBandOutcomes is true', () => {
    expect(caps.syntheticScoreBandOutcomes).toBe(true);
  });

  it('scoreBandOutcomeBuilders is true', () => {
    expect(caps.scoreBandOutcomeBuilders).toBe(true);
  });

  it('scoreBandOutcomeSafetyValidation is true', () => {
    expect(caps.scoreBandOutcomeSafetyValidation).toBe(true);
  });

  it('scoreBandReplayOutcomeReferences is true', () => {
    expect(caps.scoreBandReplayOutcomeReferences).toBe(true);
  });

  it('scoreBandRealScoring is false', () => {
    expect(caps.scoreBandRealScoring).toBe(false);
  });

  it('scoreBandRealBacktesting is false', () => {
    expect(caps.scoreBandRealBacktesting).toBe(false);
  });

  it('scoreBandPaperTrading is false', () => {
    expect(caps.scoreBandPaperTrading).toBe(false);
  });

  it('scoreBandLiveTrading is false', () => {
    expect(caps.scoreBandLiveTrading).toBe(false);
  });

  it('scoreBandExecution is false', () => {
    expect(caps.scoreBandExecution).toBe(false);
  });

  it('scoreBandSolanaRpc is false', () => {
    expect(caps.scoreBandSolanaRpc).toBe(false);
  });

  it('scoreBandExternalNetwork is false', () => {
    expect(caps.scoreBandExternalNetwork).toBe(false);
  });

  it('scoreBandPersistence is false', () => {
    expect(caps.scoreBandPersistence).toBe(false);
  });

  it('scoreBandFileExport is false', () => {
    expect(caps.scoreBandFileExport).toBe(false);
  });

  it('scoreBandInvestmentAdvice is false', () => {
    expect(caps.scoreBandInvestmentAdvice).toBe(false);
  });

  it('scoreBandTradingSignals is false', () => {
    expect(caps.scoreBandTradingSignals).toBe(false);
  });

  it('getScoreBandOutcomeFixtureCapabilities returns stable result', () => {
    expect(getScoreBandOutcomeFixtureCapabilities()).toEqual(
      getScoreBandOutcomeFixtureCapabilities(),
    );
  });
});

// ─── Builder negative tests ───────────────────────────────────────────────────

describe('Phase 37 — builder negative tests', () => {
  it('rejects unknown fixture name', () => {
    const result = buildScoreBandOutcomeAnalysisFixture({
      name: 'totally-invalid-name',
      kind: 'low-score-safe-skip',
      scoreBandRange: { lowerLabel: 'a', upperLabel: 'b', category: 'low', notes: [] },
      outcomeReference: {
        replayOutcomeFixtureName: 'avoided-high-risk-loss-outcome',
        replayOutcomeFixtureKind: 'avoided-high-risk-loss',
        scoreBandCategory: 'low',
        notes: [],
      },
    });
    expect(result.success).toBe(false);
    expect(result.fixture).toBeNull();
    expect(result.issues ?? result.validation.issues).toBeDefined();
  });

  it('rejects unknown fixture kind', () => {
    const result = buildScoreBandOutcomeAnalysisFixture({
      name: 'low-score-safe-skip',
      kind: 'completely-unknown-kind',
      scoreBandRange: { lowerLabel: 'a', upperLabel: 'b', category: 'low', notes: [] },
      outcomeReference: {
        replayOutcomeFixtureName: 'avoided-high-risk-loss-outcome',
        replayOutcomeFixtureKind: 'avoided-high-risk-loss',
        scoreBandCategory: 'low',
        notes: [],
      },
    });
    expect(result.success).toBe(false);
    expect(result.fixture).toBeNull();
  });

  it('returns validation error codes for invalid name', () => {
    const result = buildScoreBandOutcomeAnalysisFixture({
      name: 'bad-name',
      kind: 'bad-kind',
      scoreBandRange: { lowerLabel: 'a', upperLabel: 'b', category: 'low', notes: [] },
      outcomeReference: {
        replayOutcomeFixtureName: 'avoided-high-risk-loss-outcome',
        replayOutcomeFixtureKind: 'avoided-high-risk-loss',
        scoreBandCategory: 'low',
        notes: [],
      },
    });
    expect(result.validation.issues.some(i => i.code === 'INVALID_NAME')).toBe(true);
  });

  it('does not throw for null-like inputs', () => {
    expect(() =>
      buildScoreBandOutcomeAnalysisFixture({
        name: '',
        kind: '',
        scoreBandRange: { lowerLabel: '', upperLabel: '', category: 'low', notes: [] },
        outcomeReference: {
          replayOutcomeFixtureName: 'avoided-high-risk-loss-outcome',
          replayOutcomeFixtureKind: 'avoided-high-risk-loss',
          scoreBandCategory: 'low',
          notes: [],
        },
      }),
    ).not.toThrow();
  });
});

// ─── Dashboard/API compatibility ──────────────────────────────────────────────

describe('Phase 37 — dashboard and read-only-api capability compatibility', () => {
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

describe('Phase 37 — safety boundary regression', () => {
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
    const caps = getScoreBandOutcomeFixtureCapabilities();
    expect(caps.scoreBandRealScoring).toBe(false);
    expect(caps.scoreBandRealBacktesting).toBe(false);
    expect(caps.scoreBandPaperTrading).toBe(false);
    expect(caps.scoreBandLiveTrading).toBe(false);
    expect(caps.scoreBandExecution).toBe(false);
    expect(caps.scoreBandSolanaRpc).toBe(false);
    expect(caps.scoreBandExternalNetwork).toBe(false);
    expect(caps.scoreBandPersistence).toBe(false);
    expect(caps.scoreBandFileExport).toBe(false);
    expect(caps.scoreBandInvestmentAdvice).toBe(false);
    expect(caps.scoreBandTradingSignals).toBe(false);
  });
});

// ─── docs exist ───────────────────────────────────────────────────────────────

describe('Phase 37 — documentation exists', () => {
  it('docs/SCORE_BAND_OUTCOME_ANALYSIS_MODELS.md exists', () => {
    const docPath = resolve(REPO_ROOT, 'docs/SCORE_BAND_OUTCOME_ANALYSIS_MODELS.md');
    expect(() => readFileSync(docPath, 'utf8')).not.toThrow();
  });

  it('docs/PHASE_LOG.md mentions Phase 37', () => {
    const content = readFileSync(resolve(REPO_ROOT, 'docs/PHASE_LOG.md'), 'utf8');
    expect(content).toMatch(/Phase 37/);
  });
});
