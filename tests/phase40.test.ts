/**
 * Phase 40 — Strategy Review Dashboard Fixtures v1
 */

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  PHASE_39_STRATEGY_COMPARISON_MATRIX_FIXTURES,
  STRATEGY_COMPARISON_MATRIX_FIXTURE_NAMES,
} from '@sonic/offline-intelligence';
import {
  PHASE_40_STRATEGY_REVIEW_DASHBOARD_GENERATED_AT,
  PHASE_40_STRATEGY_REVIEW_DASHBOARD_SOURCE,
  STRATEGY_REVIEW_DASHBOARD_FIXTURE_NAMES,
  STRATEGY_REVIEW_DASHBOARD_FIXTURE_KINDS,
  buildStrategyReviewDashboardFixture,
  buildStrategyReviewSummary,
  normalizeStrategyReviewDashboardFixture,
  serializeStrategyReviewDashboardFixture,
  areStrategyReviewDashboardFixturesEqual,
  isStrategyReviewDashboardFixtureSerializable,
  validateStrategyReviewDashboardFixture,
  validateStrategyReviewDashboardSafety,
  listStrategyReviewDashboardFixtures,
  getStrategyReviewDashboardFixture,
  getStrategyReviewDashboardFixtureCapabilities,
  PHASE_40_STRATEGY_REVIEW_DASHBOARD_FIXTURES,
} from '../apps/dashboard/src/strategy-review-fixtures/index.js';
import { getDashboardUiShellCapabilities } from '@sonic/dashboard';
import { getLocalReadOnlyApiCapabilities } from '@sonic/read-only-api';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const PHASE_40_SRC = resolve(REPO_ROOT, 'apps/dashboard/src/strategy-review-fixtures');
const PHASE_40_FILES = [
  'types.ts',
  'capabilities.ts',
  'normalization.ts',
  'validation.ts',
  'builders.ts',
  'fixtures.ts',
  'index.ts',
].map(file => resolve(PHASE_40_SRC, file));

const REQUIRED_FIXTURE_NAMES = [
  'defensive-vs-aggressive-review-dashboard',
  'creator-led-review-dashboard',
  'wallet-led-review-dashboard',
  'manipulation-avoidance-review-dashboard',
  'no-action-safety-review-dashboard',
  'insufficient-data-review-dashboard',
  'high-score-positive-review-dashboard',
  'high-score-false-positive-review-dashboard',
  'missed-opportunity-review-dashboard',
  'drawdown-contained-review-dashboard',
  'mixed-signal-watchlist-review-dashboard',
  'false-positive-protection-review-dashboard',
  'malformed-input-safe-review-dashboard',
  'dashboard-ready-strategy-review',
  'report-ready-strategy-review',
  'safety-boundary-strategy-review',
] as const;

const FIXTURE_NAMES = listStrategyReviewDashboardFixtures();
const FIXTURES = FIXTURE_NAMES.map(name => {
  const fixture = getStrategyReviewDashboardFixture(name);
  if (!fixture) throw new Error(`Missing Phase 40 fixture: ${name}`);
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
  /\bReact\b/,
  /\bdocument\b/,
  /\bwindow\b/,
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

describe('Phase 40 — module exports and constants', () => {
  const exportedFunctions: Array<[string, unknown]> = [
    ['buildStrategyReviewDashboardFixture', buildStrategyReviewDashboardFixture],
    ['buildStrategyReviewSummary', buildStrategyReviewSummary],
    ['normalizeStrategyReviewDashboardFixture', normalizeStrategyReviewDashboardFixture],
    ['serializeStrategyReviewDashboardFixture', serializeStrategyReviewDashboardFixture],
    ['areStrategyReviewDashboardFixturesEqual', areStrategyReviewDashboardFixturesEqual],
    ['isStrategyReviewDashboardFixtureSerializable', isStrategyReviewDashboardFixtureSerializable],
    ['validateStrategyReviewDashboardFixture', validateStrategyReviewDashboardFixture],
    ['validateStrategyReviewDashboardSafety', validateStrategyReviewDashboardSafety],
    ['listStrategyReviewDashboardFixtures', listStrategyReviewDashboardFixtures],
    ['getStrategyReviewDashboardFixture', getStrategyReviewDashboardFixture],
    ['getStrategyReviewDashboardFixtureCapabilities', getStrategyReviewDashboardFixtureCapabilities],
  ];
  exportedFunctions.forEach(([name, value]) => {
    it(`${name} is exported`, () => {
      expect(typeof value).toBe('function');
    });
  });
  it('phase generatedAt is deterministic', () => {
    expect(PHASE_40_STRATEGY_REVIEW_DASHBOARD_GENERATED_AT).toBe('2026-01-01T00:00:00.000Z');
  });
  it('phase source is deterministic', () => {
    expect(PHASE_40_STRATEGY_REVIEW_DASHBOARD_SOURCE).toBe(
      'phase40_strategy_review_dashboard_fixtures_v1',
    );
  });
  it('fixture names expose 16 entries', () => {
    expect(STRATEGY_REVIEW_DASHBOARD_FIXTURE_NAMES).toHaveLength(16);
  });
  it('fixture kinds expose 16 entries', () => {
    expect(STRATEGY_REVIEW_DASHBOARD_FIXTURE_KINDS).toHaveLength(16);
  });
  it('fixture map exposes 16 entries', () => {
    expect(PHASE_40_STRATEGY_REVIEW_DASHBOARD_FIXTURES.size).toBe(16);
  });
});

describe('Phase 40 — capability flags', () => {
  const caps = getStrategyReviewDashboardFixtureCapabilities();
  it('all expected true/false values are fixed', () => {
    expect(caps).toEqual({
      strategyReviewDashboardFixtures: true,
      syntheticStrategyReviewDashboards: true,
      strategyReviewDashboardBuilders: true,
      strategyReviewDashboardSafetyValidation: true,
      strategyReviewMatrixReferences: true,
      strategyReviewRealUiRendering: false,
      strategyReviewRealScoring: false,
      strategyReviewRealRanking: false,
      strategyReviewRecommendations: false,
      strategyReviewTradingSignals: false,
      strategyReviewPaperTrading: false,
      strategyReviewLiveTrading: false,
      strategyReviewExecution: false,
      strategyReviewSolanaRpc: false,
      strategyReviewExternalNetwork: false,
      strategyReviewPersistence: false,
      strategyReviewFileExport: false,
      strategyReviewInvestmentAdvice: false,
    });
  });
  it('dashboard surface includes phase 40 flags', () => {
    const dashboardCaps = getDashboardUiShellCapabilities();
    expect(dashboardCaps.strategyReviewDashboardFixtures).toBe(true);
    expect(dashboardCaps.strategyReviewRealScoring).toBe(false);
    expect(dashboardCaps.strategyReviewExecution).toBe(false);
  });
  it('read-only-api surface includes phase 40 flags', () => {
    const apiCaps = getLocalReadOnlyApiCapabilities();
    expect(apiCaps.strategyReviewDashboardFixtures).toBe(true);
    expect(apiCaps.strategyReviewExternalNetwork).toBe(false);
    expect(apiCaps.strategyReviewInvestmentAdvice).toBe(false);
  });
});

describe('Phase 40 — fixture list/get', () => {
  it('list returns 16 entries', () => {
    expect(listStrategyReviewDashboardFixtures()).toHaveLength(16);
  });
  it('list returns sorted stable names', () => {
    const names = listStrategyReviewDashboardFixtures();
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
    expect(listStrategyReviewDashboardFixtures()).toEqual(names);
  });
  REQUIRED_FIXTURE_NAMES.forEach(name => {
    it(`contains required name ${name}`, () => {
      expect(listStrategyReviewDashboardFixtures()).toContain(name);
    });
    it(`lookup resolves ${name}`, () => {
      expect(getStrategyReviewDashboardFixture(name)?.name).toBe(name);
    });
  });
  it('returns undefined for unknown fixture', () => {
    expect(getStrategyReviewDashboardFixture('unknown' as never)).toBeUndefined();
  });
});

describe('Phase 40 — all fixture safety and shape', () => {
  REQUIRED_FIXTURE_NAMES.forEach(name => {
    const fixture = getStrategyReviewDashboardFixture(name)!;
    describe(`fixture ${name}`, () => {
      it('exists', () => {
        expect(fixture).toBeDefined();
      });
      it('phase is 40', () => {
        expect(fixture.meta.phase).toBe(40);
      });
      it('has deterministic generatedAt/source', () => {
        expect(fixture.meta.generatedAt).toBe(PHASE_40_STRATEGY_REVIEW_DASHBOARD_GENERATED_AT);
        expect(fixture.meta.source).toBe(PHASE_40_STRATEGY_REVIEW_DASHBOARD_SOURCE);
      });
      it('has non-empty title/description', () => {
        expect(fixture.title.length).toBeGreaterThan(0);
        expect(fixture.description.length).toBeGreaterThan(0);
      });
      it('contains one matrix reference', () => {
        expect(fixture.matrixReferences.length).toBeGreaterThan(0);
      });
      it('matrix reference is phase39 compatible', () => {
        for (const reference of fixture.matrixReferences) {
          expect(reference.sourcePhase).toBe(39);
          expect(STRATEGY_COMPARISON_MATRIX_FIXTURE_NAMES).toContain(reference.sourceMatrixFixtureName);
          expect(PHASE_39_STRATEGY_COMPARISON_MATRIX_FIXTURES.get(reference.sourceMatrixFixtureName)).toBeDefined();
        }
      });
      it('contains panels/cards/tables', () => {
        expect(fixture.panels.length).toBeGreaterThan(0);
        expect(fixture.panels[0].cards.length).toBeGreaterThan(0);
        expect(fixture.panels[0].tables.length).toBeGreaterThan(0);
      });
      it('table rows/columns are present', () => {
        const table = fixture.panels[0].tables[0];
        expect(table.columns.length).toBe(3);
        expect(table.rows.length).toBeGreaterThan(0);
      });
      it('summary counts are non-negative', () => {
        expect(fixture.summary.panelCount).toBeGreaterThanOrEqual(1);
        expect(fixture.summary.cardCount).toBeGreaterThanOrEqual(1);
        expect(fixture.summary.tableCount).toBeGreaterThanOrEqual(1);
        expect(fixture.summary.rowCount).toBeGreaterThanOrEqual(1);
      });
      it('summary safety flags are fixed', () => {
        expect(fixture.summary.fixtureOnly).toBe(true);
        expect(fixture.summary.syntheticOnly).toBe(true);
        expect(fixture.summary.localOnly).toBe(true);
        expect(fixture.summary.readOnly).toBe(true);
        expect(fixture.summary.safeToDisplay).toBe(true);
      });
      it('meta safety flags are fixed', () => {
        expect(fixture.meta.liveData).toBe(false);
        expect(fixture.meta.realUiRendering).toBe(false);
        expect(fixture.meta.realScoring).toBe(false);
        expect(fixture.meta.realRanking).toBe(false);
        expect(fixture.meta.recommendations).toBe(false);
        expect(fixture.meta.tradingSignals).toBe(false);
        expect(fixture.meta.execution).toBe(false);
      });
      it('safety boundary flags are fixed', () => {
        expect(fixture.safetyBoundary.noRealUiRendering).toBe(true);
        expect(fixture.safetyBoundary.noRealScoring).toBe(true);
        expect(fixture.safetyBoundary.noRealRanking).toBe(true);
        expect(fixture.safetyBoundary.noRecommendations).toBe(true);
        expect(fixture.safetyBoundary.noTradingSignals).toBe(true);
        expect(fixture.safetyBoundary.noExecution).toBe(true);
      });
      it('validates successfully', () => {
        const validation = validateStrategyReviewDashboardFixture(fixture);
        expect(validation.valid).toBe(true);
        expect(validation.issues).toHaveLength(0);
      });
      it('passes safety validation', () => {
        const safety = validateStrategyReviewDashboardSafety(fixture);
        expect(safety.safe).toBe(true);
        expect(safety.violations).toHaveLength(0);
      });
      it('is serializable', () => {
        expect(isStrategyReviewDashboardFixtureSerializable(fixture)).toBe(true);
      });
      it('normalization is stable', () => {
        expect(normalizeStrategyReviewDashboardFixture(fixture)).toEqual(
          normalizeStrategyReviewDashboardFixture(fixture),
        );
      });
      it('serialization is stable', () => {
        const a = serializeStrategyReviewDashboardFixture(fixture);
        const b = serializeStrategyReviewDashboardFixture(fixture);
        expect(a).toBe(b);
      });
      it('equality helper returns true for same fixture', () => {
        expect(areStrategyReviewDashboardFixturesEqual(fixture, fixture)).toBe(true);
      });
      it('build summary helper aligns fixture metadata', () => {
        const summary = buildStrategyReviewSummary(fixture);
        expect(summary.fixtureName).toBe(fixture.name);
        expect(summary.fixtureKind).toBe(fixture.kind);
      });
      it('no forbidden payload patterns', () => {
        const strings = collectStringValues(fixture);
        FORBIDDEN_PAYLOAD_PATTERNS.forEach(pattern => {
          strings.forEach(value => expect(pattern.test(value)).toBe(false));
        });
      });
      it('references no live or network claims in payload text', () => {
        const strings = collectStringValues(fixture);
        strings.forEach(value => {
          expect(/\blive data\b/i.test(value)).toBe(false);
          expect(/\bsolana rpc\b/i.test(value)).toBe(false);
          expect(/\bfetch\b/i.test(value)).toBe(false);
          expect(/\baxios\b/i.test(value)).toBe(false);
          expect(/\bwebsocket\b/i.test(value)).toBe(false);
        });
      });
    });
  });
});

describe('Phase 40 — builders and validation failures', () => {
  it('builder returns success for a valid input', () => {
    const result = buildStrategyReviewDashboardFixture({
      name: 'defensive-vs-aggressive-review-dashboard',
      kind: 'defensive-vs-aggressive-review',
    });
    expect(result.success).toBe(true);
    expect(result.fixture?.name).toBe('defensive-vs-aggressive-review-dashboard');
  });
  it('builder is deterministic', () => {
    const a = buildStrategyReviewDashboardFixture({
      name: 'report-ready-strategy-review',
      kind: 'report-ready-strategy-review',
    });
    const b = buildStrategyReviewDashboardFixture({
      name: 'report-ready-strategy-review',
      kind: 'report-ready-strategy-review',
    });
    expect(a.success).toBe(true);
    expect(b.success).toBe(true);
    expect(a.fixture && b.fixture && areStrategyReviewDashboardFixturesEqual(a.fixture, b.fixture)).toBe(true);
  });
  it('validation fails for null', () => {
    const invalid = validateStrategyReviewDashboardFixture(null);
    expect(invalid.valid).toBe(false);
    expect(invalid.issues.length).toBeGreaterThan(0);
  });
  it('validation fails for missing fields', () => {
    const invalid = validateStrategyReviewDashboardFixture({});
    expect(invalid.valid).toBe(false);
    expect(invalid.issues.length).toBeGreaterThan(0);
  });
  it('safety fails for null', () => {
    const safety = validateStrategyReviewDashboardSafety(null);
    expect(safety.safe).toBe(false);
  });
  it('safety detects injected execution text', () => {
    const fixture = getStrategyReviewDashboardFixture('defensive-vs-aggressive-review-dashboard')!;
    const unsafe = validateStrategyReviewDashboardSafety({
      ...fixture,
      safeNotes: ['buy now execute order'],
    });
    expect(unsafe.safe).toBe(false);
    expect(unsafe.violations.some(v => v.includes('EXECUTION_PATTERN'))).toBe(true);
  });
  it('safety detects injected url', () => {
    const fixture = getStrategyReviewDashboardFixture('defensive-vs-aggressive-review-dashboard')!;
    const unsafe = validateStrategyReviewDashboardSafety({
      ...fixture,
      safeNotes: ['https://unsafe.local'],
    });
    expect(unsafe.safe).toBe(false);
    expect(unsafe.violations.some(v => v.includes('URL_PRESENT'))).toBe(true);
  });
  it('safety detects injected pii', () => {
    const fixture = getStrategyReviewDashboardFixture('defensive-vs-aggressive-review-dashboard')!;
    const unsafe = validateStrategyReviewDashboardSafety({
      ...fixture,
      safeNotes: ['contact me at somebody@example.com'],
    });
    expect(unsafe.safe).toBe(false);
    expect(unsafe.violations.some(v => v.includes('PII_EMAIL'))).toBe(true);
  });
});

describe('Phase 40 — no input mutation and serializability', () => {
  it('normalize does not mutate input fixture', () => {
    const fixture = getStrategyReviewDashboardFixture('creator-led-review-dashboard')!;
    const before = JSON.stringify(fixture);
    normalizeStrategyReviewDashboardFixture(fixture);
    const after = JSON.stringify(fixture);
    expect(after).toBe(before);
  });
  it('serialize does not mutate input fixture', () => {
    const fixture = getStrategyReviewDashboardFixture('wallet-led-review-dashboard')!;
    const before = JSON.stringify(fixture);
    serializeStrategyReviewDashboardFixture(fixture);
    const after = JSON.stringify(fixture);
    expect(after).toBe(before);
  });
  it('fixtures round-trip through json', () => {
    FIXTURES.forEach(fixture => {
      const encoded = serializeStrategyReviewDashboardFixture(fixture);
      const decoded = JSON.parse(encoded) as unknown;
      expect(decoded).toBeTruthy();
    });
  });
});

describe('Phase 40 — runtime source safety checks', () => {
  PHASE_40_FILES.forEach(file => {
    it(`runtime source avoids forbidden runtime patterns: ${file}`, () => {
      const content = readFileSync(file, 'utf8');
      FORBIDDEN_RUNTIME_PATTERNS.forEach(pattern => {
        expect(pattern.test(content)).toBe(false);
      });
    });
  });
  it('fixtures source does not include external network clients', () => {
    const content = readFileSync(resolve(PHASE_40_SRC, 'fixtures.ts'), 'utf8');
    expect(/\bfetch\b/i.test(content)).toBe(false);
    expect(/\baxios\b/i.test(content)).toBe(false);
    expect(/\bWebSocket\b/.test(content)).toBe(false);
  });
  it('builder source does not include timers/randomness', () => {
    const content = readFileSync(resolve(PHASE_40_SRC, 'builders.ts'), 'utf8');
    expect(/Date\.now\s*\(/.test(content)).toBe(false);
    expect(/new Date\s*\(/.test(content)).toBe(false);
    expect(/Math\.random\s*\(/.test(content)).toBe(false);
    expect(/setTimeout\s*\(/.test(content)).toBe(false);
    expect(/setInterval\s*\(/.test(content)).toBe(false);
  });
});

