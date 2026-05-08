/**
 * Phase 36 — Replay Outcome Fixture Models v1
 */

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import {
  PHASE_36_REPLAY_OUTCOMES_GENERATED_AT,
  PHASE_36_REPLAY_OUTCOMES_SOURCE,
  REPLAY_OUTCOME_FIXTURE_NAMES,
  REPLAY_OUTCOME_FIXTURE_KINDS,
  PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_REPORT_FIXTURE_REFERENCE_NAMES,
  buildReplayOutcomeFixture,
  buildReplayOutcomeSummary,
  normalizeReplayOutcomeFixture,
  serializeReplayOutcomeFixture,
  isReplayOutcomeFixtureSerializable,
  areReplayOutcomeFixturesEqual,
  validateReplayOutcomeFixture,
  validateReplayOutcomeSafety,
  getReplayOutcomeFixtureCapabilities,
  PHASE_36_REPLAY_OUTCOME_FIXTURES,
  listReplayOutcomeFixtures,
  getReplayOutcomeFixture,
  OFFLINE_COMPOSITE_EVIDENCE_FIXTURE_NAMES,
  OFFLINE_COMPOSITE_EVIDENCE_FIXTURE_KINDS,
  OFFLINE_INTELLIGENCE_REPORT_FIXTURE_NAMES,
  OFFLINE_INTELLIGENCE_REPORT_KINDS,
} from '@sonic/offline-intelligence';
import { getDashboardUiShellCapabilities } from '@sonic/dashboard';
import { getLocalReadOnlyApiCapabilities } from '@sonic/read-only-api';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const PHASE_36_SRC = resolve(REPO_ROOT, 'packages/offline-intelligence/src/replay-outcomes');

const PHASE_36_FILES = [
  'types.ts',
  'capabilities.ts',
  'normalization.ts',
  'validation.ts',
  'builders.ts',
  'fixtures.ts',
  'index.ts',
].map(file => resolve(PHASE_36_SRC, file));

const NON_VALIDATION_PHASE_36_FILES = PHASE_36_FILES.filter(file => !file.endsWith('validation.ts'));

const REQUIRED_FIXTURE_NAMES = [
  'avoided-high-risk-loss-outcome',
  'clean-low-risk-flat-outcome',
  'clean-low-risk-positive-outcome',
  'mixed-signal-watchlist-flat-outcome',
  'high-risk-false-positive-outcome',
  'high-risk-true-positive-outcome',
  'insufficient-data-skipped-outcome',
  'manipulation-risk-avoided-outcome',
  'wallet-risk-avoided-outcome',
  'creator-risk-avoided-outcome',
  'missed-opportunity-outcome',
  'drawdown-contained-outcome',
  'no-action-safety-outcome',
  'malformed-input-safe-outcome',
  'dashboard-ready-replay-outcome',
  'report-ready-replay-outcome',
] as const;

const FIXTURE_NAMES = listReplayOutcomeFixtures();
const FIXTURES = FIXTURE_NAMES.map(name => {
  const fixture = getReplayOutcomeFixture(name);
  if (!fixture) {
    throw new Error(`Missing Phase 36 fixture: ${name}`);
  }
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

describe('Phase 36 — module exports', () => {
  const exportedFunctions: Array<[string, unknown]> = [
    ['buildReplayOutcomeFixture', buildReplayOutcomeFixture],
    ['buildReplayOutcomeSummary', buildReplayOutcomeSummary],
    ['normalizeReplayOutcomeFixture', normalizeReplayOutcomeFixture],
    ['serializeReplayOutcomeFixture', serializeReplayOutcomeFixture],
    ['isReplayOutcomeFixtureSerializable', isReplayOutcomeFixtureSerializable],
    ['areReplayOutcomeFixturesEqual', areReplayOutcomeFixturesEqual],
    ['validateReplayOutcomeFixture', validateReplayOutcomeFixture],
    ['validateReplayOutcomeSafety', validateReplayOutcomeSafety],
    ['listReplayOutcomeFixtures', listReplayOutcomeFixtures],
    ['getReplayOutcomeFixture', getReplayOutcomeFixture],
    ['getReplayOutcomeFixtureCapabilities', getReplayOutcomeFixtureCapabilities],
  ];

  exportedFunctions.forEach(([name, value]) => {
    it(`${name} is exported`, () => {
      expect(typeof value).toBe('function');
    });
  });

  it('phase constants are deterministic', () => {
    expect(PHASE_36_REPLAY_OUTCOMES_GENERATED_AT).toBe('2026-01-01T00:00:00.000Z');
    expect(PHASE_36_REPLAY_OUTCOMES_SOURCE).toBe('phase36_replay_outcome_fixture_models_v1');
  });

  it('fixture names and kinds expose 16 values', () => {
    expect(REPLAY_OUTCOME_FIXTURE_NAMES.length).toBe(16);
    expect(REPLAY_OUTCOME_FIXTURE_KINDS.length).toBe(16);
  });

  it('phase 35 reference names expose 16 values', () => {
    expect(PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_REPORT_FIXTURE_REFERENCE_NAMES.length).toBe(16);
  });

  it('fixture map has 16 entries', () => {
    expect(PHASE_36_REPLAY_OUTCOME_FIXTURES.size).toBe(16);
  });
});

describe('Phase 36 — fixture list and lookup helpers', () => {
  it('listReplayOutcomeFixtures returns 16 entries', () => {
    expect(listReplayOutcomeFixtures().length).toBe(16);
  });

  it('listReplayOutcomeFixtures returns sorted names', () => {
    const names = listReplayOutcomeFixtures();
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  it('listReplayOutcomeFixtures is stable across calls', () => {
    const a = listReplayOutcomeFixtures();
    const b = listReplayOutcomeFixtures();
    expect(a).toEqual(b);
  });

  REQUIRED_FIXTURE_NAMES.forEach(name => {
    it(`contains required fixture ${name}`, () => {
      expect(listReplayOutcomeFixtures()).toContain(name);
    });

    it(`lookup resolves required fixture ${name}`, () => {
      expect(getReplayOutcomeFixture(name)?.name).toBe(name);
    });
  });

  it('getReplayOutcomeFixture returns undefined for unknown name', () => {
    expect(getReplayOutcomeFixture('unknown-phase36' as never)).toBeUndefined();
  });
});

describe('Phase 36 — all fixtures pass validation and safety', () => {
  FIXTURES.forEach(fixture => {
    it(`${fixture.name} passes validateReplayOutcomeFixture`, () => {
      expect(validateReplayOutcomeFixture(fixture)).toEqual({ valid: true, issues: [] });
    });

    it(`${fixture.name} passes validateReplayOutcomeSafety`, () => {
      expect(validateReplayOutcomeSafety(fixture)).toEqual({ safe: true, violations: [] });
    });

    it(`${fixture.name} is serializable`, () => {
      expect(isReplayOutcomeFixtureSerializable(fixture)).toBe(true);
      expect(() => JSON.stringify(fixture)).not.toThrow();
    });
  });
});

describe('Phase 36 — fixture invariants and safety boundaries', () => {
  FIXTURES.forEach(fixture => {
    it(`${fixture.name} has deterministic meta`, () => {
      expect(fixture.meta.phase).toBe(36);
      expect(fixture.meta.generatedAt).toBe(PHASE_36_REPLAY_OUTCOMES_GENERATED_AT);
      expect(fixture.meta.source).toBe(PHASE_36_REPLAY_OUTCOMES_SOURCE);
      expect(fixture.meta.deterministic).toBe(true);
    });

    it(`${fixture.name} has synthetic safety flags`, () => {
      expect(fixture.meta.fixtureOnly).toBe(true);
      expect(fixture.meta.syntheticOnly).toBe(true);
      expect(fixture.meta.readOnly).toBe(true);
      expect(fixture.meta.localOnly).toBe(true);
      expect(fixture.meta.inMemoryOnly).toBe(true);
    });

    it(`${fixture.name} has all unsafe runtime flags disabled`, () => {
      expect(fixture.meta.liveData).toBe(false);
      expect(fixture.meta.realReplay).toBe(false);
      expect(fixture.meta.realBacktesting).toBe(false);
      expect(fixture.meta.paperTrading).toBe(false);
      expect(fixture.meta.liveTrading).toBe(false);
      expect(fixture.meta.execution).toBe(false);
      expect(fixture.meta.externalNetwork).toBe(false);
      expect(fixture.meta.persistence).toBe(false);
      expect(fixture.meta.fileExport).toBe(false);
    });

    it(`${fixture.name} summary mirrors fixture identity`, () => {
      expect(fixture.summary.name).toBe(fixture.name);
      expect(fixture.summary.kind).toBe(fixture.kind);
      expect(fixture.summary.phase).toBe(36);
      expect(fixture.summary.generatedAt).toBe(PHASE_36_REPLAY_OUTCOMES_GENERATED_AT);
    });

    it(`${fixture.name} summary has non-advisory non-accusatory flags`, () => {
      expect(fixture.summary.nonAdvisory).toBe(true);
      expect(fixture.summary.nonAccusatory).toBe(true);
      expect(fixture.summary.safeToDisplay).toBe(true);
      expect(fixture.summary.execution).toBe(false);
    });

    it(`${fixture.name} references Phase 33 fixtures safely`, () => {
      expect(OFFLINE_COMPOSITE_EVIDENCE_FIXTURE_NAMES).toContain(
        fixture.scenarioReference.phase33CompositeFixtureName,
      );
      expect(OFFLINE_COMPOSITE_EVIDENCE_FIXTURE_KINDS).toContain(
        fixture.scenarioReference.phase33CompositeFixtureKind,
      );
    });

    it(`${fixture.name} references Phase 34 fixtures safely`, () => {
      expect(OFFLINE_INTELLIGENCE_REPORT_FIXTURE_NAMES).toContain(
        fixture.scenarioReference.phase34ReportFixtureName,
      );
      expect(OFFLINE_INTELLIGENCE_REPORT_KINDS).toContain(
        fixture.scenarioReference.phase34ReportFixtureKind,
      );
    });

    it(`${fixture.name} references Phase 35 fixtures safely`, () => {
      expect(PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_REPORT_FIXTURE_REFERENCE_NAMES).toContain(
        fixture.scenarioReference.phase35DashboardReportFixtureName,
      );
      expect(PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_REPORT_FIXTURE_REFERENCE_NAMES).toContain(
        fixture.summary.referencedPhase35DashboardReportFixtureName,
      );
    });

    it(`${fixture.name} keeps deterministic source count`, () => {
      expect(fixture.scenarioReference.sourceCount).toBe(3);
      expect(fixture.summary.sourceCount).toBe(3);
    });

    it(`${fixture.name} keeps indicator counts aligned with summary`, () => {
      expect(fixture.summary.riskCount).toBe(fixture.riskIndicators.length);
      expect(fixture.summary.qualityCount).toBe(fixture.qualityIndicators.length);
      expect(fixture.summary.topRiskCodes).toEqual(
        [...fixture.summary.topRiskCodes].sort((a, b) => a.localeCompare(b)),
      );
      expect(fixture.summary.topQualityCodes).toEqual(
        [...fixture.summary.topQualityCodes].sort((a, b) => a.localeCompare(b)),
      );
    });

    it(`${fixture.name} normalized version is equal`, () => {
      const normalized = normalizeReplayOutcomeFixture(fixture);
      expect(areReplayOutcomeFixturesEqual(fixture, normalized)).toBe(true);
      expect(normalized).toEqual(fixture);
    });

    it(`${fixture.name} buildReplayOutcomeSummary returns fixture.summary`, () => {
      expect(buildReplayOutcomeSummary(fixture)).toEqual(fixture.summary);
    });

    it(`${fixture.name} has sorted note arrays`, () => {
      const sortedSafeNotes = [...fixture.safeNotes].sort((a, b) => a.localeCompare(b));
      const sortedMetaNotes = [...fixture.meta.notes].sort((a, b) => a.localeCompare(b));
      const sortedScenarioNotes = [...fixture.scenarioReference.notes].sort((a, b) =>
        a.localeCompare(b),
      );
      expect(fixture.safeNotes).toEqual(sortedSafeNotes);
      expect(fixture.meta.notes).toEqual(sortedMetaNotes);
      expect(fixture.scenarioReference.notes).toEqual(sortedScenarioNotes);
    });
  });
});

describe('Phase 36 — builder behavior and no input mutation', () => {
  const baseInput = {
    name: 'clean-low-risk-positive-outcome' as const,
    kind: 'clean-low-risk-positive' as const,
    scenarioReference: {
      phase33CompositeFixtureName: 'clean-low-risk-composite' as const,
      phase33CompositeFixtureKind: 'clean-low-risk' as const,
      phase34ReportFixtureName: 'clean-low-risk-intelligence-report' as const,
      phase34ReportFixtureKind: 'clean-low-risk' as const,
      phase35DashboardReportFixtureName: 'clean-low-risk-dashboard' as const,
      sourceCount: 3 as const,
      notes: ['b-note', 'a-note'],
    },
    observation: {
      outcomeCategory: 'positive' as const,
      entry: {
        observationId: 'entry',
        syntheticDecision: 'observe' as const,
        safetyGateStatus: 'passed' as const,
        confidenceBand: 'high' as const,
        notes: ['b-note', 'a-note'],
      },
      exit: {
        observationId: 'exit',
        syntheticResult: 'positive' as const,
        durationBucket: 'short' as const,
        closureReason: 'quality-confirmed' as const,
        notes: ['b-note', 'a-note'],
      },
      notes: ['b-note', 'a-note'],
    },
    riskIndicators: [{ code: 'z-risk', label: 'z', level: 'low' as const, category: 'outcome' as const, rationale: 'r' }],
    qualityIndicators: [{ code: 'z-quality', label: 'z', level: 'high' as const, category: 'outcome' as const, rationale: 'r' }],
    safeNotes: ['b-note', 'a-note'],
  };

  it('buildReplayOutcomeFixture succeeds for valid input', () => {
    const built = buildReplayOutcomeFixture(baseInput);
    expect(built.success).toBe(true);
    expect(built.fixture).not.toBeNull();
    expect(built.validation.valid).toBe(true);
    expect(built.safety.safe).toBe(true);
  });

  it('buildReplayOutcomeFixture sorts note arrays and indicators', () => {
    const built = buildReplayOutcomeFixture(baseInput);
    const fixture = built.fixture!;
    expect(fixture.safeNotes).toEqual(['a-note', 'b-note']);
    expect(fixture.scenarioReference.notes).toEqual(['a-note', 'b-note']);
    expect(fixture.observation.notes).toEqual(['a-note', 'b-note']);
    expect(fixture.riskIndicators[0]?.code).toBe('z-risk');
    expect(fixture.qualityIndicators[0]?.code).toBe('z-quality');
  });

  it('buildReplayOutcomeFixture rejects invalid name', () => {
    const built = buildReplayOutcomeFixture({ ...baseInput, name: 'invalid-name' });
    expect(built.success).toBe(false);
    expect(built.fixture).toBeNull();
    expect(built.validation.valid).toBe(false);
  });

  it('buildReplayOutcomeFixture rejects invalid kind', () => {
    const built = buildReplayOutcomeFixture({ ...baseInput, kind: 'invalid-kind' });
    expect(built.success).toBe(false);
    expect(built.fixture).toBeNull();
    expect(built.validation.valid).toBe(false);
  });

  it('buildReplayOutcomeFixture does not mutate input', () => {
    const before = JSON.parse(JSON.stringify(baseInput));
    buildReplayOutcomeFixture(baseInput);
    expect(baseInput).toEqual(before);
  });

  it('serializeReplayOutcomeFixture produces deterministic string', () => {
    const fixture = buildReplayOutcomeFixture(baseInput).fixture!;
    const a = serializeReplayOutcomeFixture(fixture);
    const b = serializeReplayOutcomeFixture(fixture);
    expect(a).toBe(b);
    expect(a).toContain('clean-low-risk-positive-outcome');
  });
});

describe('Phase 36 — validation negative and safety negative cases', () => {
  it('validateReplayOutcomeFixture rejects null', () => {
    const result = validateReplayOutcomeFixture(null);
    expect(result.valid).toBe(false);
    expect(result.issues.some(issue => issue.code === 'INVALID_INPUT')).toBe(true);
  });

  it('validateReplayOutcomeFixture rejects missing fields', () => {
    const result = validateReplayOutcomeFixture({});
    expect(result.valid).toBe(false);
    expect(result.issues.length).toBeGreaterThan(0);
  });

  it('validateReplayOutcomeFixture rejects bad source references', () => {
    const fixture = structuredClone(FIXTURES[0]!);
    (
      fixture as {
        scenarioReference: { phase33CompositeFixtureName: string };
      }
    ).scenarioReference.phase33CompositeFixtureName = 'bad-ref';
    const result = validateReplayOutcomeFixture(fixture);
    expect(result.valid).toBe(false);
    expect(result.issues.some(issue => issue.code.includes('PHASE33'))).toBe(true);
  });

  it('validateReplayOutcomeSafety rejects wallet-like strings', () => {
    const result = validateReplayOutcomeSafety({ value: '11111111111111111111111111111111' });
    expect(result.safe).toBe(false);
    expect(result.violations.length).toBeGreaterThan(0);
  });

  it('validateReplayOutcomeSafety rejects transaction hash-like strings', () => {
    const result = validateReplayOutcomeSafety({ value: '1111111111111111111111111111111111111111111111111111111111111111' });
    expect(result.safe).toBe(false);
  });

  it('validateReplayOutcomeSafety rejects URL text', () => {
    const result = validateReplayOutcomeSafety({ value: 'https://unsafe.example' });
    expect(result.safe).toBe(false);
  });

  it('validateReplayOutcomeSafety rejects secret wording', () => {
    const result = validateReplayOutcomeSafety({ value: 'seed phrase test' });
    expect(result.safe).toBe(false);
  });

  it('validateReplayOutcomeSafety rejects live-data wording', () => {
    const result = validateReplayOutcomeSafety({ value: 'live data from websocket' });
    expect(result.safe).toBe(false);
  });

  it('validateReplayOutcomeSafety rejects execution wording', () => {
    const result = validateReplayOutcomeSafety({ value: 'execute order and fill position' });
    expect(result.safe).toBe(false);
  });

  it('validateReplayOutcomeSafety rejects advisory wording', () => {
    const result = validateReplayOutcomeSafety({ value: 'investment advice and trading signal' });
    expect(result.safe).toBe(false);
  });

  it('validateReplayOutcomeSafety rejects PnL/order wording', () => {
    const result = validateReplayOutcomeSafety({ value: 'real pnl from filled order' });
    expect(result.safe).toBe(false);
  });

  it('validateReplayOutcomeSafety rejects null input', () => {
    const result = validateReplayOutcomeSafety(null);
    expect(result.safe).toBe(false);
    expect(result.violations.length).toBeGreaterThan(0);
  });
});

describe('Phase 36 — capabilities and compatibility surfaces', () => {
  it('offline-intelligence phase 36 capabilities are wired', () => {
    const caps = getReplayOutcomeFixtureCapabilities();
    expect(caps.replayOutcomeFixtures).toBe(true);
    expect(caps.syntheticReplayOutcomes).toBe(true);
    expect(caps.replayOutcomeBuilders).toBe(true);
    expect(caps.replayOutcomeSafetyValidation).toBe(true);
    expect(caps.replayOutcomeCompositeEvidenceReferences).toBe(true);
    expect(caps.replayOutcomeReportReferences).toBe(true);
    expect(caps.replayOutcomeDashboardReferences).toBe(true);
    expect(caps.replayOutcomeLiveData).toBe(false);
    expect(caps.replayOutcomeRealBacktesting).toBe(false);
    expect(caps.replayOutcomePaperTrading).toBe(false);
    expect(caps.replayOutcomeLiveTrading).toBe(false);
    expect(caps.replayOutcomeExecution).toBe(false);
    expect(caps.replayOutcomeSolanaRpc).toBe(false);
    expect(caps.replayOutcomeExternalNetwork).toBe(false);
    expect(caps.replayOutcomePersistence).toBe(false);
    expect(caps.replayOutcomeFileExport).toBe(false);
    expect(caps.replayOutcomeInvestmentAdvice).toBe(false);
    expect(caps.replayOutcomeTradingSignals).toBe(false);
  });

  it('dashboard capabilities include phase 36 fields', () => {
    const caps = getDashboardUiShellCapabilities();
    expect(caps.replayOutcomeFixtures).toBe(true);
    expect(caps.syntheticReplayOutcomes).toBe(true);
    expect(caps.replayOutcomeBuilders).toBe(true);
    expect(caps.replayOutcomeSafetyValidation).toBe(true);
    expect(caps.replayOutcomeCompositeEvidenceReferences).toBe(true);
    expect(caps.replayOutcomeReportReferences).toBe(true);
    expect(caps.replayOutcomeDashboardReferences).toBe(true);
    expect(caps.replayOutcomeLiveData).toBe(false);
    expect(caps.replayOutcomeRealBacktesting).toBe(false);
    expect(caps.replayOutcomePaperTrading).toBe(false);
    expect(caps.replayOutcomeLiveTrading).toBe(false);
    expect(caps.replayOutcomeExecution).toBe(false);
    expect(caps.replayOutcomeSolanaRpc).toBe(false);
    expect(caps.replayOutcomeExternalNetwork).toBe(false);
    expect(caps.replayOutcomePersistence).toBe(false);
    expect(caps.replayOutcomeFileExport).toBe(false);
    expect(caps.replayOutcomeInvestmentAdvice).toBe(false);
    expect(caps.replayOutcomeTradingSignals).toBe(false);
  });

  it('read-only-api capabilities include phase 36 fields', () => {
    const caps = getLocalReadOnlyApiCapabilities();
    expect(caps.replayOutcomeFixtures).toBe(true);
    expect(caps.syntheticReplayOutcomes).toBe(true);
    expect(caps.replayOutcomeBuilders).toBe(true);
    expect(caps.replayOutcomeSafetyValidation).toBe(true);
    expect(caps.replayOutcomeCompositeEvidenceReferences).toBe(true);
    expect(caps.replayOutcomeReportReferences).toBe(true);
    expect(caps.replayOutcomeDashboardReferences).toBe(true);
    expect(caps.replayOutcomeLiveData).toBe(false);
    expect(caps.replayOutcomeRealBacktesting).toBe(false);
    expect(caps.replayOutcomePaperTrading).toBe(false);
    expect(caps.replayOutcomeLiveTrading).toBe(false);
    expect(caps.replayOutcomeExecution).toBe(false);
    expect(caps.replayOutcomeSolanaRpc).toBe(false);
    expect(caps.replayOutcomeExternalNetwork).toBe(false);
    expect(caps.replayOutcomePersistence).toBe(false);
    expect(caps.replayOutcomeFileExport).toBe(false);
    expect(caps.replayOutcomeInvestmentAdvice).toBe(false);
    expect(caps.replayOutcomeTradingSignals).toBe(false);
  });
});

describe('Phase 36 — runtime safety source checks', () => {
  NON_VALIDATION_PHASE_36_FILES.forEach(file => {
    FORBIDDEN_RUNTIME_PATTERNS.forEach(pattern => {
      it(`${file.replace(REPO_ROOT, '')} does not contain ${pattern}`, () => {
        const content = readFileSync(file, 'utf8');
        expect(pattern.test(content)).toBe(false);
      });
    });
  });
});

describe('Phase 36 — payload safety source checks', () => {
  FIXTURES.forEach(fixture => {
    const payloadValues = collectStringValues(fixture);
    FORBIDDEN_PAYLOAD_PATTERNS.forEach(pattern => {
      it(`${fixture.name} payload does not contain ${pattern}`, () => {
        expect(payloadValues.some(value => pattern.test(value))).toBe(false);
      });
    });
  });
});

describe('Phase 36 — deterministic ordering and generatedAt stability', () => {
  it('fixture list order is deterministic', () => {
    const a = listReplayOutcomeFixtures();
    const b = listReplayOutcomeFixtures();
    expect(a).toEqual(b);
  });

  it('fixture map iteration is deterministic after sorting', () => {
    const fromMap = [...PHASE_36_REPLAY_OUTCOME_FIXTURES.keys()].sort((a, b) => a.localeCompare(b));
    expect(fromMap).toEqual(listReplayOutcomeFixtures());
  });

  FIXTURES.forEach(fixture => {
    it(`${fixture.name} generatedAt is deterministic and constant`, () => {
      expect(fixture.meta.generatedAt).toBe(PHASE_36_REPLAY_OUTCOMES_GENERATED_AT);
      expect(fixture.summary.generatedAt).toBe(PHASE_36_REPLAY_OUTCOMES_GENERATED_AT);
    });

    it(`${fixture.name} serialize output is deterministic`, () => {
      const one = serializeReplayOutcomeFixture(fixture);
      const two = serializeReplayOutcomeFixture(fixture);
      expect(one).toBe(two);
    });
  });
});
