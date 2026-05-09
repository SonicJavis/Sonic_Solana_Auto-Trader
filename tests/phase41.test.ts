/**
 * Phase 41 — Strategy Review Report Fixtures v1
 */

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  PHASE_40_STRATEGY_REVIEW_DASHBOARD_FIXTURES,
  STRATEGY_REVIEW_DASHBOARD_FIXTURE_NAMES,
} from '../apps/dashboard/src/strategy-review-fixtures/index.js';
import {
  PHASE_41_STRATEGY_REVIEW_REPORT_GENERATED_AT,
  PHASE_41_STRATEGY_REVIEW_REPORT_SOURCE,
  STRATEGY_REVIEW_REPORT_FIXTURE_NAMES,
  STRATEGY_REVIEW_REPORT_FIXTURE_KINDS,
  buildStrategyReviewReportFixture,
  buildStrategyReviewReportSummary,
  normalizeStrategyReviewReportFixture,
  serializeStrategyReviewReportFixture,
  areStrategyReviewReportFixturesEqual,
  isStrategyReviewReportFixtureSerializable,
  validateStrategyReviewReportFixture,
  validateStrategyReviewReportSafety,
  listStrategyReviewReportFixtures,
  getStrategyReviewReportFixture,
  getStrategyReviewReportFixtureCapabilities,
  PHASE_41_STRATEGY_REVIEW_REPORT_FIXTURES,
} from '../apps/dashboard/src/strategy-review-reports/index.js';
import { getDashboardUiShellCapabilities } from '@sonic/dashboard';
import { getLocalReadOnlyApiCapabilities } from '@sonic/read-only-api';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const PHASE_41_SRC = resolve(REPO_ROOT, 'apps/dashboard/src/strategy-review-reports');
const PHASE_41_FILES = [
  'types.ts',
  'capabilities.ts',
  'normalization.ts',
  'validation.ts',
  'builders.ts',
  'fixtures.ts',
  'index.ts',
].map(file => resolve(PHASE_41_SRC, file));

const REQUIRED_FIXTURE_NAMES = [
  'defensive-vs-aggressive-review-report',
  'creator-led-review-report',
  'wallet-led-review-report',
  'manipulation-avoidance-review-report',
  'no-action-safety-review-report',
  'insufficient-data-review-report',
  'high-score-positive-review-report',
  'high-score-false-positive-review-report',
  'missed-opportunity-review-report',
  'drawdown-contained-review-report',
  'mixed-signal-watchlist-review-report',
  'false-positive-protection-review-report',
  'malformed-input-safe-review-report',
  'dashboard-ready-strategy-review-report',
  'serialization-ready-strategy-review-report',
  'safety-boundary-strategy-review-report',
] as const;

const FIXTURE_NAMES = listStrategyReviewReportFixtures();
const FIXTURES = FIXTURE_NAMES.map(name => {
  const fixture = getStrategyReviewReportFixture(name);
  if (!fixture) throw new Error(`Missing Phase 41 fixture: ${name}`);
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
  /\baxios\.\w+/,
  /\bnew WebSocket\s*\(/,
  /Date\.now\s*\(/,
  /new Date\s*\(/,
  /Math\.random\s*\(/,
  /setTimeout\s*\(/,
  /setInterval\s*\(/,
  /writeFileSync\s*\(/,
  /fs\.writeFile\s*\(/,
  /createWriteStream\s*\(/,
  /Blob\s*\(/,
  /URL\.createObjectURL\s*\(/,
  /document\./,
  /window\./,
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

describe('Phase 41 — module exports and constants', () => {
  const exportedFunctions: Array<[string, unknown]> = [
    ['buildStrategyReviewReportFixture', buildStrategyReviewReportFixture],
    ['buildStrategyReviewReportSummary', buildStrategyReviewReportSummary],
    ['normalizeStrategyReviewReportFixture', normalizeStrategyReviewReportFixture],
    ['serializeStrategyReviewReportFixture', serializeStrategyReviewReportFixture],
    ['areStrategyReviewReportFixturesEqual', areStrategyReviewReportFixturesEqual],
    ['isStrategyReviewReportFixtureSerializable', isStrategyReviewReportFixtureSerializable],
    ['validateStrategyReviewReportFixture', validateStrategyReviewReportFixture],
    ['validateStrategyReviewReportSafety', validateStrategyReviewReportSafety],
    ['listStrategyReviewReportFixtures', listStrategyReviewReportFixtures],
    ['getStrategyReviewReportFixture', getStrategyReviewReportFixture],
    ['getStrategyReviewReportFixtureCapabilities', getStrategyReviewReportFixtureCapabilities],
  ];

  exportedFunctions.forEach(([name, value]) => {
    it(`${name} is exported`, () => {
      expect(typeof value).toBe('function');
    });
  });

  it('phase generatedAt is deterministic', () => {
    expect(PHASE_41_STRATEGY_REVIEW_REPORT_GENERATED_AT).toBe('2026-01-01T00:00:00.000Z');
  });

  it('phase source is deterministic', () => {
    expect(PHASE_41_STRATEGY_REVIEW_REPORT_SOURCE).toBe(
      'phase41_strategy_review_report_fixtures_v1',
    );
  });

  it('fixture names expose 16 entries', () => {
    expect(STRATEGY_REVIEW_REPORT_FIXTURE_NAMES).toHaveLength(16);
  });

  it('fixture kinds expose 16 entries', () => {
    expect(STRATEGY_REVIEW_REPORT_FIXTURE_KINDS).toHaveLength(16);
  });

  it('fixture map exposes 16 entries', () => {
    expect(PHASE_41_STRATEGY_REVIEW_REPORT_FIXTURES.size).toBe(16);
  });
});

describe('Phase 41 — capability flags', () => {
  const caps = getStrategyReviewReportFixtureCapabilities();

  it('all expected true/false values are fixed', () => {
    expect(caps).toEqual({
      strategyReviewReportFixtures: true,
      syntheticStrategyReviewReports: true,
      strategyReviewReportBuilders: true,
      strategyReviewReportSafetyValidation: true,
      strategyReviewDashboardReferences: true,
      strategyReviewReportActualFileExport: false,
      strategyReviewReportDownloadSupport: false,
      strategyReviewReportRealUiRendering: false,
      strategyReviewReportRealScoring: false,
      strategyReviewReportRealRanking: false,
      strategyReviewReportRecommendations: false,
      strategyReviewReportTradingSignals: false,
      strategyReviewReportPaperTrading: false,
      strategyReviewReportLiveTrading: false,
      strategyReviewReportExecution: false,
      strategyReviewReportSolanaRpc: false,
      strategyReviewReportExternalNetwork: false,
      strategyReviewReportPersistence: false,
      strategyReviewReportInvestmentAdvice: false,
    });
  });

  it('dashboard capability surface includes phase 41 flags', () => {
    const dashboardCaps = getDashboardUiShellCapabilities();
    expect(dashboardCaps.strategyReviewReportFixtures).toBe(true);
    expect(dashboardCaps.strategyReviewReportDownloadSupport).toBe(false);
    expect(dashboardCaps.strategyReviewReportExecution).toBe(false);
  });

  it('read-only-api capability surface includes phase 41 flags', () => {
    const apiCaps = getLocalReadOnlyApiCapabilities();
    expect(apiCaps.strategyReviewReportFixtures).toBe(true);
    expect(apiCaps.strategyReviewReportExternalNetwork).toBe(false);
    expect(apiCaps.strategyReviewReportInvestmentAdvice).toBe(false);
  });
});

describe('Phase 41 — fixture list/get helpers', () => {
  it('list returns 16 entries', () => {
    expect(listStrategyReviewReportFixtures()).toHaveLength(16);
  });

  it('list returns sorted stable names', () => {
    const names = listStrategyReviewReportFixtures();
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
    expect(listStrategyReviewReportFixtures()).toEqual(names);
  });

  REQUIRED_FIXTURE_NAMES.forEach(name => {
    it(`contains required name ${name}`, () => {
      expect(listStrategyReviewReportFixtures()).toContain(name);
    });

    it(`lookup resolves ${name}`, () => {
      expect(getStrategyReviewReportFixture(name)?.name).toBe(name);
    });
  });

  it('returns undefined for unknown fixture', () => {
    expect(getStrategyReviewReportFixture('unknown' as never)).toBeUndefined();
  });
});

describe('Phase 41 — all fixture safety and shape', () => {
  REQUIRED_FIXTURE_NAMES.forEach(name => {
    const fixture = getStrategyReviewReportFixture(name)!;

    describe(`fixture ${name}`, () => {
      it('exists', () => {
        expect(fixture).toBeDefined();
      });

      it('phase is 41', () => {
        expect(fixture.meta.phase).toBe(41);
      });

      it('has deterministic generatedAt/source', () => {
        expect(fixture.meta.generatedAt).toBe(PHASE_41_STRATEGY_REVIEW_REPORT_GENERATED_AT);
        expect(fixture.meta.source).toBe(PHASE_41_STRATEGY_REVIEW_REPORT_SOURCE);
      });

      it('has non-empty title/description', () => {
        expect(fixture.title.length).toBeGreaterThan(0);
        expect(fixture.description.length).toBeGreaterThan(0);
      });

      it('contains dashboard references', () => {
        expect(fixture.dashboardReferences.length).toBeGreaterThan(0);
      });

      it('dashboard reference is phase40 compatible', () => {
        for (const reference of fixture.dashboardReferences) {
          expect(reference.sourcePhase).toBe(40);
          expect(STRATEGY_REVIEW_DASHBOARD_FIXTURE_NAMES).toContain(
            reference.sourceDashboardFixtureName,
          );
          expect(
            PHASE_40_STRATEGY_REVIEW_DASHBOARD_FIXTURES.get(reference.sourceDashboardFixtureName),
          ).toBeDefined();
        }
      });

      it('contains sections/cards/tables', () => {
        expect(fixture.sections.length).toBeGreaterThan(0);
        expect(fixture.sections[0].cards.length).toBeGreaterThan(0);
        expect(fixture.sections[0].tables.length).toBeGreaterThan(0);
      });

      it('table rows/columns are present', () => {
        const table = fixture.sections[0].tables[0];
        expect(table.columns.length).toBeGreaterThan(0);
        expect(table.rows.length).toBeGreaterThan(0);
      });

      it('summary counts are non-negative', () => {
        expect(fixture.summary.sectionCount).toBeGreaterThanOrEqual(1);
        expect(fixture.summary.cardCount).toBeGreaterThanOrEqual(1);
        expect(fixture.summary.tableCount).toBeGreaterThanOrEqual(1);
        expect(fixture.summary.rowCount).toBeGreaterThanOrEqual(1);
      });

      it('summary safety flags are fixed', () => {
        expect(fixture.summary.fixtureOnly).toBe(true);
        expect(fixture.summary.syntheticOnly).toBe(true);
        expect(fixture.summary.localOnly).toBe(true);
        expect(fixture.summary.readOnly).toBe(true);
        expect(fixture.summary.serializable).toBe(true);
        expect(fixture.summary.nonAdvisory).toBe(true);
      });

      it('meta safety flags are fixed', () => {
        expect(fixture.meta.strategyReviewReportActualFileExport).toBe(false);
        expect(fixture.meta.strategyReviewReportDownloadSupport).toBe(false);
        expect(fixture.meta.strategyReviewReportRealUiRendering).toBe(false);
        expect(fixture.meta.strategyReviewReportRealScoring).toBe(false);
        expect(fixture.meta.strategyReviewReportRealRanking).toBe(false);
        expect(fixture.meta.strategyReviewReportRecommendations).toBe(false);
        expect(fixture.meta.strategyReviewReportTradingSignals).toBe(false);
        expect(fixture.meta.strategyReviewReportExecution).toBe(false);
      });

      it('safety boundary flags are fixed', () => {
        expect(fixture.safetyBoundary.noActualFileExport).toBe(true);
        expect(fixture.safetyBoundary.noDownloadSupport).toBe(true);
        expect(fixture.safetyBoundary.noRealUiRendering).toBe(true);
        expect(fixture.safetyBoundary.noRealScoring).toBe(true);
        expect(fixture.safetyBoundary.noRealRanking).toBe(true);
        expect(fixture.safetyBoundary.noRecommendations).toBe(true);
        expect(fixture.safetyBoundary.noTradingSignals).toBe(true);
        expect(fixture.safetyBoundary.noExecution).toBe(true);
      });

      it('validation passes', () => {
        const validation = validateStrategyReviewReportFixture(fixture);
        expect(validation.valid).toBe(true);
        expect(validation.issues).toHaveLength(0);
      });

      it('safety validation passes', () => {
        const safety = validateStrategyReviewReportSafety(fixture);
        expect(safety.safe).toBe(true);
        expect(safety.violations).toHaveLength(0);
      });

      it('is serializable', () => {
        expect(isStrategyReviewReportFixtureSerializable(fixture)).toBe(true);
      });

      it('normalization is stable', () => {
        expect(normalizeStrategyReviewReportFixture(fixture)).toEqual(
          normalizeStrategyReviewReportFixture(fixture),
        );
      });

      it('serialization is stable', () => {
        const a = serializeStrategyReviewReportFixture(fixture);
        const b = serializeStrategyReviewReportFixture(fixture);
        expect(a).toBe(b);
      });

      it('equality helper returns true for same fixture', () => {
        expect(areStrategyReviewReportFixturesEqual(fixture, fixture)).toBe(true);
      });

      it('build summary helper aligns fixture metadata', () => {
        const summary = buildStrategyReviewReportSummary(fixture);
        expect(summary.fixtureName).toBe(fixture.name);
        expect(summary.fixtureKind).toBe(fixture.kind);
      });

      it('has deterministic section ordering', () => {
        const sectionIds = fixture.sections.map(section => section.sectionId);
        expect(sectionIds).toEqual([...sectionIds].sort((a, b) => a.localeCompare(b)));
      });

      it('has deterministic card ordering within each section', () => {
        fixture.sections.forEach(section => {
          const cardIds = section.cards.map(card => card.cardId);
          expect(cardIds).toEqual([...cardIds].sort((a, b) => a.localeCompare(b)));
        });
      });

      it('has deterministic table ordering within each section', () => {
        fixture.sections.forEach(section => {
          const tableIds = section.tables.map(table => table.tableId);
          expect(tableIds).toEqual([...tableIds].sort((a, b) => a.localeCompare(b)));
        });
      });

      it('no forbidden payload patterns', () => {
        const strings = collectStringValues(fixture);
        FORBIDDEN_PAYLOAD_PATTERNS.forEach(pattern => {
          strings.forEach(value => expect(pattern.test(value)).toBe(false));
        });
      });

      it('no live-data or networking claims in payload', () => {
        const strings = collectStringValues(fixture);
        strings.forEach(value => {
          expect(/\blive data\b/i.test(value)).toBe(false);
          expect(/\bsolana rpc\b/i.test(value)).toBe(false);
          expect(/\bfetch\b/i.test(value)).toBe(false);
          expect(/\baxios\b/i.test(value)).toBe(false);
          expect(/\bwebsocket\b/i.test(value)).toBe(false);
        });
      });

      it('no real wallet addresses or transaction hashes', () => {
        const strings = collectStringValues(fixture);
        strings.forEach(value => {
          expect(/\b[1-9A-HJ-NP-Za-km-z]{32,44}\b/.test(value)).toBe(false);
          expect(/\b[1-9A-HJ-NP-Za-km-z]{64,88}\b/.test(value)).toBe(false);
        });
      });

      it('no local paths or stack traces in payload', () => {
        const strings = collectStringValues(fixture);
        strings.forEach(value => {
          expect(/\/home\//.test(value)).toBe(false);
          expect(/\/Users\//.test(value)).toBe(false);
          expect(/C:\\Users\\/.test(value)).toBe(false);
          expect(/TypeError:/.test(value)).toBe(false);
        });
      });
    });
  });
});

describe('Phase 41 — builders and validation failures', () => {
  it('builder returns success for valid input', () => {
    const result = buildStrategyReviewReportFixture({
      name: 'defensive-vs-aggressive-review-report',
      kind: 'defensive-vs-aggressive-review-report',
    });
    expect(result.success).toBe(true);
    expect(result.fixture?.name).toBe('defensive-vs-aggressive-review-report');
  });

  it('builder is deterministic', () => {
    const a = buildStrategyReviewReportFixture({
      name: 'serialization-ready-strategy-review-report',
      kind: 'serialization-ready-strategy-review-report',
    });
    const b = buildStrategyReviewReportFixture({
      name: 'serialization-ready-strategy-review-report',
      kind: 'serialization-ready-strategy-review-report',
    });
    expect(a.success).toBe(true);
    expect(b.success).toBe(true);
    expect(a.fixture && b.fixture && areStrategyReviewReportFixturesEqual(a.fixture, b.fixture)).toBe(true);
  });

  it('builder falls back from unknown name/kind safely', () => {
    const result = buildStrategyReviewReportFixture({
      name: 'unknown-name',
      kind: 'unknown-kind',
    });
    expect(result.success).toBe(true);
    expect(result.fixture?.name).toBe('defensive-vs-aggressive-review-report');
  });

  it('validation fails for null', () => {
    const invalid = validateStrategyReviewReportFixture(null);
    expect(invalid.valid).toBe(false);
    expect(invalid.issues.length).toBeGreaterThan(0);
  });

  it('validation fails for missing fields', () => {
    const invalid = validateStrategyReviewReportFixture({});
    expect(invalid.valid).toBe(false);
    expect(invalid.issues.length).toBeGreaterThan(0);
  });

  it('safety fails for null', () => {
    const safety = validateStrategyReviewReportSafety(null);
    expect(safety.safe).toBe(false);
  });

  it('safety detects injected execution text', () => {
    const fixture = getStrategyReviewReportFixture('defensive-vs-aggressive-review-report')!;
    const unsafe = validateStrategyReviewReportSafety({
      ...fixture,
      safeNotes: ['buy now'],
    });
    expect(unsafe.safe).toBe(false);
    expect(unsafe.violations.some(v => v.includes('EXECUTION_PATTERN'))).toBe(true);
  });

  it('safety detects injected url', () => {
    const fixture = getStrategyReviewReportFixture('defensive-vs-aggressive-review-report')!;
    const unsafe = validateStrategyReviewReportSafety({
      ...fixture,
      safeNotes: ['https://unsafe.local'],
    });
    expect(unsafe.safe).toBe(false);
    expect(unsafe.violations.some(v => v.includes('URL_PRESENT'))).toBe(true);
  });

  it('safety detects injected pii', () => {
    const fixture = getStrategyReviewReportFixture('defensive-vs-aggressive-review-report')!;
    const unsafe = validateStrategyReviewReportSafety({
      ...fixture,
      safeNotes: ['contact at somebody@example.com'],
    });
    expect(unsafe.safe).toBe(false);
    expect(unsafe.violations.some(v => v.includes('PII_EMAIL'))).toBe(true);
  });

  it('safety detects advisory text', () => {
    const fixture = getStrategyReviewReportFixture('defensive-vs-aggressive-review-report')!;
    const unsafe = validateStrategyReviewReportSafety({
      ...fixture,
      safeNotes: ['recommend this now'],
    });
    expect(unsafe.safe).toBe(false);
    expect(unsafe.violations.some(v => v.includes('ADVICE_PATTERN'))).toBe(true);
  });
});

describe('Phase 41 — no input mutation and serializability', () => {
  it('normalize does not mutate input fixture', () => {
    const fixture = getStrategyReviewReportFixture('creator-led-review-report')!;
    const before = JSON.stringify(fixture);
    normalizeStrategyReviewReportFixture(fixture);
    const after = JSON.stringify(fixture);
    expect(after).toBe(before);
  });

  it('serialize does not mutate input fixture', () => {
    const fixture = getStrategyReviewReportFixture('wallet-led-review-report')!;
    const before = JSON.stringify(fixture);
    serializeStrategyReviewReportFixture(fixture);
    const after = JSON.stringify(fixture);
    expect(after).toBe(before);
  });

  it('fixtures round-trip through json', () => {
    FIXTURES.forEach(fixture => {
      const encoded = serializeStrategyReviewReportFixture(fixture);
      const decoded = JSON.parse(encoded) as unknown;
      expect(decoded).toBeTruthy();
    });
  });
});

describe('Phase 41 — runtime source safety checks', () => {
  PHASE_41_FILES.forEach(file => {
    it(`runtime source avoids forbidden runtime patterns: ${file}`, () => {
      const content = readFileSync(file, 'utf8');
      FORBIDDEN_RUNTIME_PATTERNS.forEach(pattern => {
        expect(pattern.test(content)).toBe(false);
      });
    });
  });

  it('fixture source does not include external network clients', () => {
    const content = readFileSync(resolve(PHASE_41_SRC, 'fixtures.ts'), 'utf8');
    expect(/\bfetch\b/i.test(content)).toBe(false);
    expect(/\baxios\b/i.test(content)).toBe(false);
    expect(/\bWebSocket\b/.test(content)).toBe(false);
  });

  it('builder source does not include timers/randomness', () => {
    const content = readFileSync(resolve(PHASE_41_SRC, 'builders.ts'), 'utf8');
    expect(/Date\.now\s*\(/.test(content)).toBe(false);
    expect(/new Date\s*\(/.test(content)).toBe(false);
    expect(/Math\.random\s*\(/.test(content)).toBe(false);
    expect(/setTimeout\s*\(/.test(content)).toBe(false);
    expect(/setInterval\s*\(/.test(content)).toBe(false);
  });

  it('validation source avoids browser-download APIs', () => {
    const content = readFileSync(resolve(PHASE_41_SRC, 'validation.ts'), 'utf8');
    expect(/Blob\s*\(/.test(content)).toBe(false);
    expect(/URL\.createObjectURL\s*\(/.test(content)).toBe(false);
  });
});
