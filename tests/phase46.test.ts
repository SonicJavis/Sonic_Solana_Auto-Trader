/**
 * Phase 46 — Strategy Review Export Audit Report Fixtures v1 tests.
 */

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST,
  PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURES,
} from '../apps/dashboard/src/strategy-review-export-audit/index.js';
import {
  areStrategyReviewExportAuditReportFixturesEqual,
  buildStrategyReviewExportAuditReportFixture,
  getStrategyReviewExportAuditReportCapabilities,
  getStrategyReviewExportAuditReportFixture,
  isValidStrategyReviewExportAuditReportFixtureKind,
  isValidStrategyReviewExportAuditReportFixtureName,
  isValidStrategyReviewExportAuditReportGeneratedAt,
  isValidStrategyReviewExportAuditReportSeverity,
  isValidStrategyReviewExportAuditReportSource,
  isValidStrategyReviewExportAuditReportState,
  listStrategyReviewExportAuditReportFixtures,
  normalizeStrategyReviewExportAuditReportFixture,
  PHASE_46_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_GENERATED_AT,
  PHASE_46_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SOURCE,
  serializeStrategyReviewExportAuditReportFixture,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_FIXTURE_KINDS,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_FIXTURE_MAP,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_FIXTURE_NAMES,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_FIXTURES,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_PHASE,
  validateStrategyReviewExportAuditReportFixture,
  validateStrategyReviewExportAuditReportSafety,
} from '../apps/dashboard/src/strategy-review-export-audit-report/index.js';
import { getDashboardUiShellCapabilities } from '../apps/dashboard/src/capabilities.js';
import { getLocalReadOnlyApiCapabilities } from '../apps/read-only-api/src/capabilities.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const PHASE_46_SRC = resolve(REPO_ROOT, 'apps/dashboard/src/strategy-review-export-audit-report');
const PHASE_46_FILES = [
  'types.ts',
  'capabilities.ts',
  'normalization.ts',
  'validation.ts',
  'builders.ts',
  'fixtures.ts',
  'index.ts',
].map(file => resolve(PHASE_46_SRC, file));

const FORBIDDEN_RUNTIME_PATTERNS: readonly RegExp[] = [
  /Date\.now\s*\(/,
  /new Date\s*\(/,
  /Math\.random\s*\(/,
  /randomUUID\s*\(/,
  /fetch\s*\(/,
  /new WebSocket\s*\(/,
  /axios\./,
  /writeFile\s*\(/,
  /createWriteStream\s*\(/,
  /setInterval\s*\(/,
  /setTimeout\s*\(/,
  /localStorage/,
  /indexedDB/,
  /signTransaction/,
  /sendTransaction/,
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
    Object.values(value as Record<string, unknown>).forEach(entry => collectStringValues(entry, result));
  }
  return result;
}

describe('Phase 46 constants and basic exports', () => {
  it('exports deterministic phase/source/generatedAt constants', () => {
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_PHASE).toBe(46);
    expect(PHASE_46_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_GENERATED_AT).toBe('2026-01-02T00:00:00.000Z');
    expect(PHASE_46_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SOURCE).toBe(
      'phase46_strategy_review_export_audit_report_fixtures_v1',
    );
  });

  it('exports fixture names and kinds arrays with one-to-one count from Phase 45', () => {
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_FIXTURE_NAMES).toHaveLength(
      PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST.length,
    );
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_FIXTURE_KINDS).toHaveLength(
      PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST.length,
    );
  });

  it('fixture names and kinds are unique', () => {
    expect(new Set(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_FIXTURE_NAMES).size).toBe(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_FIXTURE_NAMES.length,
    );
    expect(new Set(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_FIXTURE_KINDS).size).toBe(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_FIXTURE_KINDS.length,
    );
  });
});

describe('Phase 46 capabilities', () => {
  it('module capabilities have required positive flags', () => {
    const caps = getStrategyReviewExportAuditReportCapabilities();
    expect(caps.strategyReviewExportAuditReportFixtures).toBe(true);
    expect(caps.syntheticStrategyReviewExportAuditReports).toBe(true);
    expect(caps.deterministicStrategyReviewExportAuditReports).toBe(true);
    expect(caps.localOnlyStrategyReviewExportAuditReports).toBe(true);
    expect(caps.readOnlyStrategyReviewExportAuditReports).toBe(true);
  });

  it('module capabilities have required negative flags', () => {
    const caps = getStrategyReviewExportAuditReportCapabilities();
    expect(caps.strategyReviewActualAuditReports).toBe(false);
    expect(caps.strategyReviewReportDownloads).toBe(false);
    expect(caps.strategyReviewReportPdfGeneration).toBe(false);
    expect(caps.strategyReviewReportCsvGeneration).toBe(false);
    expect(caps.strategyReviewReportHtmlGeneration).toBe(false);
    expect(caps.strategyReviewReportFilesystemWrites).toBe(false);
    expect(caps.strategyReviewReportPersistence).toBe(false);
    expect(caps.strategyReviewReportBackgroundJobs).toBe(false);
    expect(caps.strategyReviewReportScheduledJobs).toBe(false);
    expect(caps.strategyReviewReportLiveData).toBe(false);
    expect(caps.strategyReviewReportNetworkAccess).toBe(false);
    expect(caps.strategyReviewReportTradingSignals).toBe(false);
    expect(caps.strategyReviewReportRecommendations).toBe(false);
    expect(caps.strategyReviewReportInvestmentAdvice).toBe(false);
    expect(caps.strategyReviewReportExecution).toBe(false);
  });

  it('dashboard capability surface includes Phase 46 flags', () => {
    const caps = getDashboardUiShellCapabilities();
    expect(caps.strategyReviewExportAuditReportFixtures).toBe(true);
    expect(caps.syntheticStrategyReviewExportAuditReports).toBe(true);
    expect(caps.deterministicStrategyReviewExportAuditReports).toBe(true);
    expect(caps.localOnlyStrategyReviewExportAuditReports).toBe(true);
    expect(caps.readOnlyStrategyReviewExportAuditReports).toBe(true);
    expect(caps.strategyReviewActualAuditReports).toBe(false);
    expect(caps.strategyReviewReportDownloads).toBe(false);
    expect(caps.strategyReviewReportExecution).toBe(false);
  });

  it('read-only-api capability surface includes Phase 46 flags', () => {
    const caps = getLocalReadOnlyApiCapabilities();
    expect(caps.strategyReviewExportAuditReportFixtures).toBe(true);
    expect(caps.syntheticStrategyReviewExportAuditReports).toBe(true);
    expect(caps.deterministicStrategyReviewExportAuditReports).toBe(true);
    expect(caps.localOnlyStrategyReviewExportAuditReports).toBe(true);
    expect(caps.readOnlyStrategyReviewExportAuditReports).toBe(true);
    expect(caps.strategyReviewActualAuditReports).toBe(false);
    expect(caps.strategyReviewReportDownloads).toBe(false);
    expect(caps.strategyReviewReportExecution).toBe(false);
  });
});

describe('Phase 46 fixtures map/list/get and one-to-one linkage', () => {
  it('map and list counts match Phase 45 source fixture count', () => {
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_FIXTURES).toHaveLength(
      PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST.length,
    );
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_FIXTURE_MAP.size).toBe(
      PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURES.size,
    );
    expect(listStrategyReviewExportAuditReportFixtures()).toHaveLength(
      PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST.length,
    );
  });

  it('every Phase 45 fixture has exactly one Phase 46 report fixture', () => {
    for (const sourceFixture of PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST) {
      const reportName = `${sourceFixture.name}-report`;
      const reportFixture = getStrategyReviewExportAuditReportFixture(reportName);
      expect(reportFixture).not.toBeNull();
      expect(reportFixture?.sourceAuditName).toBe(sourceFixture.name);
      expect(reportFixture?.sourceAuditKind).toBe(sourceFixture.kind);
      expect(reportFixture?.sourceAuditId).toBe(sourceFixture.auditItem.auditItemId);
      expect(reportFixture?.sourceQueueReference.sourceQueueFixtureName).toBe(
        sourceFixture.auditItem.queueReference.sourceQueueFixtureName,
      );
    }
  });

  it('report ids and report names are unique and stable', () => {
    const fixtures = listStrategyReviewExportAuditReportFixtures();
    expect(new Set(fixtures.map(fixture => fixture.reportId)).size).toBe(fixtures.length);
    expect(new Set(fixtures.map(fixture => fixture.reportName)).size).toBe(fixtures.length);
  });

  it('get helper returns null for unknown report name', () => {
    expect(getStrategyReviewExportAuditReportFixture('unknown-report-fixture')).toBeNull();
  });
});

describe('Phase 46 fixture structure and deterministic fields', () => {
  it('all fixtures validate and are safe', () => {
    for (const fixture of listStrategyReviewExportAuditReportFixtures()) {
      expect(validateStrategyReviewExportAuditReportFixture(fixture).valid).toBe(true);
      expect(validateStrategyReviewExportAuditReportSafety(fixture).safe).toBe(true);
    }
  });

  it('all fixtures have deterministic generatedAt and deterministicSeed values', () => {
    for (const fixture of listStrategyReviewExportAuditReportFixtures()) {
      expect(fixture.generatedAt).toBe(PHASE_46_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_GENERATED_AT);
      expect(typeof fixture.deterministicSeed).toBe('string');
      expect(fixture.deterministicSeed).toContain(`phase46:${fixture.sourceAuditName}`);
      expect(fixture.deterministicSeed.length).toBeGreaterThan(20);
    }
  });

  it('report sections are non-empty, ordered, and reference evidence ids', () => {
    for (const fixture of listStrategyReviewExportAuditReportFixtures()) {
      expect(fixture.sections.length).toBeGreaterThan(0);
      const orders = fixture.sections.map(section => section.order);
      expect([...orders].sort((a, b) => a - b)).toEqual(orders);
      expect(new Set(orders).size).toBe(orders.length);

      const evidenceIds = new Set(fixture.evidenceReferences.map(evidence => evidence.evidenceReferenceId));
      for (const section of fixture.sections) {
        expect(section.evidenceReferenceIds.length).toBeGreaterThan(0);
        for (const id of section.evidenceReferenceIds) {
          expect(evidenceIds.has(id)).toBe(true);
        }
      }
    }
  });

  it('every evidence reference is linked and non-orphaned', () => {
    for (const fixture of listStrategyReviewExportAuditReportFixtures()) {
      const referenced = new Set(fixture.sections.flatMap(section => section.evidenceReferenceIds));
      for (const evidence of fixture.evidenceReferences) {
        expect(referenced.has(evidence.evidenceReferenceId)).toBe(true);
        expect(evidence.sourceAuditId).toBe(fixture.sourceAuditId);
        expect(evidence.sourceQueueFixtureName).toBe(fixture.sourceQueueReference.sourceQueueFixtureName);
      }
    }
  });

  it('fixtures include limitations and non-goal wording', () => {
    for (const fixture of listStrategyReviewExportAuditReportFixtures()) {
      expect(fixture.limitations.length).toBeGreaterThan(0);
      const joined = fixture.limitations.join(' ').toLowerCase();
      expect(joined).toContain('not a real report');
      expect(joined).toContain('no report downloads');
      expect(joined).toContain('no persistence');
    }
  });

  it('fixtures remain read-only/synthetic/local-only in safety/meta/capability flags', () => {
    for (const fixture of listStrategyReviewExportAuditReportFixtures()) {
      expect(fixture.safety.fixtureOnly).toBe(true);
      expect(fixture.safety.syntheticOnly).toBe(true);
      expect(fixture.safety.deterministic).toBe(true);
      expect(fixture.safety.localOnly).toBe(true);
      expect(fixture.safety.readOnly).toBe(true);
      expect(fixture.meta.liveData).toBe(false);
      expect(fixture.meta.persistence).toBe(false);
      expect(fixture.meta.filesystemWrites).toBe(false);
      expect(fixture.meta.networkAccess).toBe(false);
      expect(fixture.meta.execution).toBe(false);
      expect(fixture.meta.recommendations).toBe(false);
      expect(fixture.meta.tradingSignals).toBe(false);
      expect(fixture.meta.investmentAdvice).toBe(false);
    }
  });
});

describe('Phase 46 builder/normalization/serialization/equality helpers', () => {
  it('builder derives report fixture from source audit fixture deterministically', () => {
    const source = PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST[0]!;
    const first = buildStrategyReviewExportAuditReportFixture({ sourceAuditFixture: source });
    const second = buildStrategyReviewExportAuditReportFixture({ sourceAuditFixture: source });

    expect(first.success).toBe(true);
    expect(second.success).toBe(true);
    expect(first.fixture).not.toBeNull();
    expect(second.fixture).not.toBeNull();
    expect(serializeStrategyReviewExportAuditReportFixture(first.fixture!)).toBe(
      serializeStrategyReviewExportAuditReportFixture(second.fixture!),
    );
  });

  it('normalize helper keeps stable section ordering', () => {
    const fixture = listStrategyReviewExportAuditReportFixtures()[0]!;
    const scrambled = {
      ...fixture,
      sections: [...fixture.sections].reverse(),
    };
    const normalized = normalizeStrategyReviewExportAuditReportFixture(scrambled);
    expect(normalized.sections.map(section => section.order)).toEqual(
      [...fixture.sections].map(section => section.order),
    );
  });

  it('serialization is deterministic and equality helper matches identical fixtures', () => {
    const fixture = listStrategyReviewExportAuditReportFixtures()[1]!;
    const a = serializeStrategyReviewExportAuditReportFixture(fixture);
    const b = serializeStrategyReviewExportAuditReportFixture(fixture);
    expect(a).toBe(b);
    expect(areStrategyReviewExportAuditReportFixturesEqual(fixture, fixture)).toBe(true);
  });

  it('equality helper returns false when fixture differs', () => {
    const fixture = listStrategyReviewExportAuditReportFixtures()[2]!;
    const mutated = {
      ...fixture,
      summary: `${fixture.summary} changed`,
    };
    expect(areStrategyReviewExportAuditReportFixturesEqual(fixture, mutated)).toBe(false);
  });

  it('list helper does not mutate fixture map or fixture ordering across calls', () => {
    const first = listStrategyReviewExportAuditReportFixtures().map(fixture => fixture.reportName);
    const second = listStrategyReviewExportAuditReportFixtures().map(fixture => fixture.reportName);
    expect(first).toEqual(second);
  });
});

describe('Phase 46 validator negative cases', () => {
  it('rejects invalid phase', () => {
    const fixture = listStrategyReviewExportAuditReportFixtures()[0]!;
    const invalid = { ...fixture, phase: 47 };
    const result = validateStrategyReviewExportAuditReportFixture(invalid);
    expect(result.valid).toBe(false);
    expect(result.issues.some(issue => issue.code === 'INVALID_PHASE')).toBe(true);
  });

  it('rejects duplicate section order', () => {
    const fixture = listStrategyReviewExportAuditReportFixtures()[0]!;
    const sections = fixture.sections.map((section, index) =>
      index === 1 ? { ...section, order: fixture.sections[0]!.order } : section,
    );
    const invalid = { ...fixture, sections };
    const result = validateStrategyReviewExportAuditReportFixture(invalid);
    expect(result.valid).toBe(false);
    expect(result.issues.some(issue => issue.code === 'DUPLICATE_SECTION_ORDER')).toBe(true);
  });

  it('rejects orphan evidence references', () => {
    const fixture = listStrategyReviewExportAuditReportFixtures()[0]!;
    const invalid = {
      ...fixture,
      sections: fixture.sections.map((section, index) =>
        index === 0 ? { ...section, evidenceReferenceIds: [] } : section,
      ),
    };
    const result = validateStrategyReviewExportAuditReportFixture(invalid);
    expect(result.valid).toBe(false);
    expect(result.issues.some(issue => issue.code === 'ORPHAN_EVIDENCE_REFERENCE')).toBe(true);
  });

  it('rejects unsafe capability flip', () => {
    const fixture = listStrategyReviewExportAuditReportFixtures()[0]!;
    const invalid = {
      ...fixture,
      capabilityFlags: {
        ...fixture.capabilityFlags,
        strategyReviewReportExecution: true,
      },
    };
    const result = validateStrategyReviewExportAuditReportFixture(invalid);
    expect(result.valid).toBe(false);
    expect(result.issues.some(issue => issue.code === 'CAPABILITY_FALSE_REQUIRED')).toBe(true);
  });

  it('safety validator rejects network/execution/advisory payloads', () => {
    const result = validateStrategyReviewExportAuditReportSafety({
      note: 'fetch(https://example.com) buy now guaranteed return',
    });
    expect(result.safe).toBe(false);
    expect(result.violations.length).toBeGreaterThan(0);
  });
});

describe('Phase 46 guard helpers', () => {
  it('validates known fixture name and kind', () => {
    const fixture = listStrategyReviewExportAuditReportFixtures()[0]!;
    expect(isValidStrategyReviewExportAuditReportFixtureName(fixture.reportName)).toBe(true);
    expect(isValidStrategyReviewExportAuditReportFixtureKind(fixture.reportKind)).toBe(true);
  });

  it('rejects unknown fixture name and kind', () => {
    expect(isValidStrategyReviewExportAuditReportFixtureName('unknown')).toBe(false);
    expect(isValidStrategyReviewExportAuditReportFixtureKind('unknown')).toBe(false);
  });

  it('validates report states and severities', () => {
    expect(isValidStrategyReviewExportAuditReportState('audit-pending')).toBe(true);
    expect(isValidStrategyReviewExportAuditReportState('audit-passed')).toBe(true);
    expect(isValidStrategyReviewExportAuditReportState('bad-state')).toBe(false);

    expect(isValidStrategyReviewExportAuditReportSeverity('info')).toBe(true);
    expect(isValidStrategyReviewExportAuditReportSeverity('critical')).toBe(true);
    expect(isValidStrategyReviewExportAuditReportSeverity('bad-severity')).toBe(false);
  });

  it('validates generatedAt/source constants', () => {
    expect(
      isValidStrategyReviewExportAuditReportGeneratedAt(PHASE_46_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_GENERATED_AT),
    ).toBe(true);
    expect(isValidStrategyReviewExportAuditReportGeneratedAt('2026-01-03T00:00:00.000Z')).toBe(false);

    expect(isValidStrategyReviewExportAuditReportSource(PHASE_46_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SOURCE)).toBe(
      true,
    );
    expect(isValidStrategyReviewExportAuditReportSource('other')).toBe(false);
  });
});

describe('Phase 46 static source safety checks', () => {
  it('phase 46 source files avoid forbidden runtime patterns', () => {
    for (const filePath of PHASE_46_FILES) {
      const content = readFileSync(filePath, 'utf8');
      for (const pattern of FORBIDDEN_RUNTIME_PATTERNS) {
        expect(content).not.toMatch(pattern);
      }
    }
  });

  it('fixture payload strings avoid unsafe operational claims', () => {
    const disallowedPayloadPatterns: readonly RegExp[] = [
      /live trading/i,
      /paper trading/i,
      /backtesting/i,
      /wallet private key/i,
      /seed phrase/i,
      /send transaction/i,
      /buy now/i,
      /sell now/i,
      /investment advice/i,
      /trading signal/i,
    ];

    for (const fixture of listStrategyReviewExportAuditReportFixtures()) {
      const strings = collectStringValues(fixture);
      for (const value of strings) {
        for (const pattern of disallowedPayloadPatterns) {
          expect(value).not.toMatch(pattern);
        }
      }
    }
  });
});
