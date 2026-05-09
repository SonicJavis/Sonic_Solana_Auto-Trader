/**
 * Phase 43 — Strategy Review Report Export Planning Fixtures v1
 */

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  PHASE_42_STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURES,
  PHASE_43_STRATEGY_REVIEW_EXPORT_PLAN_FIXTURES,
  PHASE_43_STRATEGY_REVIEW_EXPORT_PLAN_FIXTURE_LIST,
  PHASE_43_STRATEGY_REVIEW_EXPORT_PLAN_GENERATED_AT,
  PHASE_43_STRATEGY_REVIEW_EXPORT_PLAN_SOURCE,
  STRATEGY_REVIEW_EXPORT_PLAN_FIXTURE_NAMES,
  STRATEGY_REVIEW_EXPORT_PLAN_FIXTURE_KINDS,
  STRATEGY_REVIEW_EXPORT_PLAN_FORMAT_TARGETS,
  getStrategyReviewExportPlanCapabilities,
  buildStrategyReviewExportPlanFixture,
  buildStrategyReviewExportPlanSummary,
  normalizeStrategyReviewExportPlanFixture,
  serializeStrategyReviewExportPlanFixture,
  areStrategyReviewExportPlanFixturesEqual,
  isStrategyReviewExportPlanFixtureSerializable,
  validateStrategyReviewExportPlanFixture,
  validateStrategyReviewExportPlanSafety,
  listStrategyReviewExportPlanFixtures,
  getStrategyReviewExportPlanFixture,
  EXPORT_PLAN_NAME_TO_PREVIEW,
  EXPORT_PLAN_NAME_TO_KIND,
  EXPORT_PLAN_NAME_TO_TARGET,
  JSON_EXPORT_PLAN_DISABLED_FIXTURE,
  MARKDOWN_EXPORT_PLAN_DISABLED_FIXTURE,
  TEXT_EXPORT_PLAN_DISABLED_FIXTURE,
  METADATA_EXPORT_PLAN_DISABLED_FIXTURE,
  DEFENSIVE_VS_AGGRESSIVE_EXPORT_PLAN_FIXTURE,
  CREATOR_LED_EXPORT_PLAN_FIXTURE,
  WALLET_LED_EXPORT_PLAN_FIXTURE,
  MANIPULATION_AVOIDANCE_EXPORT_PLAN_FIXTURE,
  NO_ACTION_SAFETY_EXPORT_PLAN_FIXTURE,
  INSUFFICIENT_DATA_EXPORT_PLAN_FIXTURE,
  HIGH_SCORE_POSITIVE_EXPORT_PLAN_FIXTURE,
  MIXED_SIGNAL_WATCHLIST_EXPORT_PLAN_FIXTURE,
  MALFORMED_INPUT_SAFE_EXPORT_PLAN_FIXTURE,
  DASHBOARD_READY_EXPORT_PLAN_FIXTURE,
  REPORT_READY_EXPORT_PLAN_FIXTURE,
  SAFETY_BOUNDARY_EXPORT_PLAN_FIXTURE,
} from '../apps/dashboard/src/index.js';
import { getDashboardUiShellCapabilities } from '@sonic/dashboard';
import { getLocalReadOnlyApiCapabilities } from '@sonic/read-only-api';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const PHASE_43_SRC = resolve(REPO_ROOT, 'apps/dashboard/src/strategy-review-export-planning');
const PHASE_43_FILES = [
  'types.ts',
  'capabilities.ts',
  'normalization.ts',
  'validation.ts',
  'builders.ts',
  'fixtures.ts',
  'index.ts',
].map(file => resolve(PHASE_43_SRC, file));
const PHASE_43_DOC = resolve(
  REPO_ROOT,
  'docs/STRATEGY_REVIEW_REPORT_EXPORT_PLANNING_FIXTURES.md',
);
const PHASE_43_README = resolve(REPO_ROOT, 'README.md');
const SAFE_RUNTIME_FILES = [
  'types.ts',
  'capabilities.ts',
  'normalization.ts',
  'builders.ts',
  'fixtures.ts',
  'index.ts',
].map(file => resolve(PHASE_43_SRC, file));
const SAFE_RUNTIME_PATTERNS = [
  'fetch',
  'axios',
  'websocket',
  'child_process',
  'createWriteStream',
  'writeFileSync',
  'Blob',
  'URL.createObjectURL',
  'document',
  'window',
  'localStorage',
  'sessionStorage',
  'Date.now',
  'new Date',
  'Math.random',
  'setTimeout',
  'setInterval',
] as const;

const REQUIRED_FIXTURE_NAMES = [
  'json-export-plan-disabled',
  'markdown-export-plan-disabled',
  'text-export-plan-disabled',
  'metadata-export-plan-disabled',
  'defensive-vs-aggressive-export-plan',
  'creator-led-export-plan',
  'wallet-led-export-plan',
  'manipulation-avoidance-export-plan',
  'no-action-safety-export-plan',
  'insufficient-data-export-plan',
  'high-score-positive-export-plan',
  'mixed-signal-watchlist-export-plan',
  'malformed-input-safe-export-plan',
  'dashboard-ready-export-plan',
  'report-ready-export-plan',
  'safety-boundary-export-plan',
] as const;

const ALL_FIXTURES = PHASE_43_STRATEGY_REVIEW_EXPORT_PLAN_FIXTURE_LIST;
const NAMED_FIXTURES = {
  'json-export-plan-disabled': JSON_EXPORT_PLAN_DISABLED_FIXTURE,
  'markdown-export-plan-disabled': MARKDOWN_EXPORT_PLAN_DISABLED_FIXTURE,
  'text-export-plan-disabled': TEXT_EXPORT_PLAN_DISABLED_FIXTURE,
  'metadata-export-plan-disabled': METADATA_EXPORT_PLAN_DISABLED_FIXTURE,
  'defensive-vs-aggressive-export-plan': DEFENSIVE_VS_AGGRESSIVE_EXPORT_PLAN_FIXTURE,
  'creator-led-export-plan': CREATOR_LED_EXPORT_PLAN_FIXTURE,
  'wallet-led-export-plan': WALLET_LED_EXPORT_PLAN_FIXTURE,
  'manipulation-avoidance-export-plan': MANIPULATION_AVOIDANCE_EXPORT_PLAN_FIXTURE,
  'no-action-safety-export-plan': NO_ACTION_SAFETY_EXPORT_PLAN_FIXTURE,
  'insufficient-data-export-plan': INSUFFICIENT_DATA_EXPORT_PLAN_FIXTURE,
  'high-score-positive-export-plan': HIGH_SCORE_POSITIVE_EXPORT_PLAN_FIXTURE,
  'mixed-signal-watchlist-export-plan': MIXED_SIGNAL_WATCHLIST_EXPORT_PLAN_FIXTURE,
  'malformed-input-safe-export-plan': MALFORMED_INPUT_SAFE_EXPORT_PLAN_FIXTURE,
  'dashboard-ready-export-plan': DASHBOARD_READY_EXPORT_PLAN_FIXTURE,
  'report-ready-export-plan': REPORT_READY_EXPORT_PLAN_FIXTURE,
  'safety-boundary-export-plan': SAFETY_BOUNDARY_EXPORT_PLAN_FIXTURE,
} as const;

const EXTENSIONS: Record<(typeof STRATEGY_REVIEW_EXPORT_PLAN_FORMAT_TARGETS)[number], string> = {
  json: '.json',
  markdown: '.md',
  text: '.txt',
  metadata: '.metadata.json',
};

describe('Phase 43 — Source files exist', () => {
  for (const filePath of PHASE_43_FILES) {
    it(`${filePath.split('/').pop()} exists`, () => {
      const content = readFileSync(filePath, 'utf8');
      expect(content.length).toBeGreaterThan(0);
    });
  }

  it('documentation exists', () => {
    const content = readFileSync(PHASE_43_DOC, 'utf8');
    expect(content).toContain('Phase 43');
  });
});

describe('Phase 43 — Constants', () => {
  it('uses the deterministic generatedAt timestamp', () => {
    expect(PHASE_43_STRATEGY_REVIEW_EXPORT_PLAN_GENERATED_AT).toBe('2026-01-01T00:00:00.000Z');
  });

  it('uses the correct source string', () => {
    expect(PHASE_43_STRATEGY_REVIEW_EXPORT_PLAN_SOURCE).toBe(
      'phase43_strategy_review_report_export_planning_fixtures_v1',
    );
  });

  it('has 16 required fixture names', () => {
    expect(STRATEGY_REVIEW_EXPORT_PLAN_FIXTURE_NAMES).toHaveLength(16);
  });

  it('includes every required fixture name', () => {
    for (const name of REQUIRED_FIXTURE_NAMES) {
      expect(STRATEGY_REVIEW_EXPORT_PLAN_FIXTURE_NAMES).toContain(name);
    }
  });

  it('has at least one fixture kind', () => {
    expect(STRATEGY_REVIEW_EXPORT_PLAN_FIXTURE_KINDS.length).toBeGreaterThan(0);
  });

  it('has exactly four format targets', () => {
    expect(STRATEGY_REVIEW_EXPORT_PLAN_FORMAT_TARGETS).toHaveLength(4);
  });

  it('supports json, markdown, text, and metadata targets', () => {
    expect([...STRATEGY_REVIEW_EXPORT_PLAN_FORMAT_TARGETS].sort()).toEqual([
      'json',
      'markdown',
      'metadata',
      'text',
    ]);
  });

  it('mapping objects cover all fixtures', () => {
    for (const name of STRATEGY_REVIEW_EXPORT_PLAN_FIXTURE_NAMES) {
      expect(EXPORT_PLAN_NAME_TO_PREVIEW[name]).toBeDefined();
      expect(EXPORT_PLAN_NAME_TO_KIND[name]).toBeDefined();
      expect(EXPORT_PLAN_NAME_TO_TARGET[name]).toBeDefined();
    }
  });
});

describe('Phase 43 — Fixture map and list', () => {
  it('fixture map is a ReadonlyMap', () => {
    expect(PHASE_43_STRATEGY_REVIEW_EXPORT_PLAN_FIXTURES).toBeInstanceOf(Map);
  });

  it('fixture map has 16 entries', () => {
    expect(PHASE_43_STRATEGY_REVIEW_EXPORT_PLAN_FIXTURES.size).toBe(16);
  });

  it('fixture list has 16 entries', () => {
    expect(PHASE_43_STRATEGY_REVIEW_EXPORT_PLAN_FIXTURE_LIST).toHaveLength(16);
  });

  it('fixture list order is stable', () => {
    expect(ALL_FIXTURES.map(fixture => fixture.name)).toEqual([
      ...STRATEGY_REVIEW_EXPORT_PLAN_FIXTURE_NAMES,
    ]);
  });

  it('all map entries exist for the ordered fixture names', () => {
    for (const name of STRATEGY_REVIEW_EXPORT_PLAN_FIXTURE_NAMES) {
      expect(PHASE_43_STRATEGY_REVIEW_EXPORT_PLAN_FIXTURES.has(name)).toBe(true);
    }
  });
});

describe('Phase 43 — list/get helpers', () => {
  const listed = listStrategyReviewExportPlanFixtures(PHASE_43_STRATEGY_REVIEW_EXPORT_PLAN_FIXTURES);

  it('list helper returns 16 fixtures', () => {
    expect(listed).toHaveLength(16);
  });

  it('list helper preserves stable ordering', () => {
    expect(listed.map(fixture => fixture.name)).toEqual([...STRATEGY_REVIEW_EXPORT_PLAN_FIXTURE_NAMES]);
  });

  it('get helper returns every fixture by name', () => {
    for (const name of STRATEGY_REVIEW_EXPORT_PLAN_FIXTURE_NAMES) {
      expect(getStrategyReviewExportPlanFixture(PHASE_43_STRATEGY_REVIEW_EXPORT_PLAN_FIXTURES, name)?.name).toBe(name);
    }
  });

  it('get helper returns undefined for unknown names', () => {
    expect(
      getStrategyReviewExportPlanFixture(
        PHASE_43_STRATEGY_REVIEW_EXPORT_PLAN_FIXTURES,
        'unknown-export-plan' as never,
      ),
    ).toBeUndefined();
  });
});

describe('Phase 43 — Named fixture exports', () => {
  for (const [name, fixture] of Object.entries(NAMED_FIXTURES)) {
    it(`${name} export has the correct name`, () => {
      expect(fixture.name).toBe(name);
    });
  }
});

describe('Phase 43 — Capability flags', () => {
  const localCapabilities = getStrategyReviewExportPlanCapabilities();
  const dashboardCapabilities = getDashboardUiShellCapabilities();
  const apiCapabilities = getLocalReadOnlyApiCapabilities();
  const expectedEntries = {
    strategyReviewExportPlanningFixtures: true,
    syntheticStrategyReviewExportPlans: true,
    strategyReviewExportPlanBuilders: true,
    strategyReviewExportPlanSafetyValidation: true,
    strategyReviewSerializationPreviewReferences: true,
    strategyReviewActualFileExport: false,
    strategyReviewFilesystemWrites: false,
    strategyReviewDownloadSupport: false,
    strategyReviewPdfGeneration: false,
    strategyReviewCsvGeneration: false,
    strategyReviewHtmlGeneration: false,
    strategyReviewExportExternalNetwork: false,
    strategyReviewExportPersistence: false,
    strategyReviewExportExecution: false,
    strategyReviewExportTradingSignals: false,
    strategyReviewExportInvestmentAdvice: false,
  } as const;

  for (const [key, value] of Object.entries(expectedEntries)) {
    it(`local capabilities expose ${key}=${String(value)}`, () => {
      expect(localCapabilities[key as keyof typeof expectedEntries]).toBe(value);
    });

    it(`dashboard package capabilities expose ${key}=${String(value)}`, () => {
      expect(dashboardCapabilities[key as keyof typeof expectedEntries]).toBe(value);
    });

    it(`read-only api capabilities expose ${key}=${String(value)}`, () => {
      expect(apiCapabilities[key as keyof typeof expectedEntries]).toBe(value);
    });
  }
});

describe('Phase 43 — Fixture invariants', () => {
  for (const fixture of ALL_FIXTURES) {
    const preview = PHASE_42_STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURES.get(
      EXPORT_PLAN_NAME_TO_PREVIEW[fixture.name],
    );

    it(`${fixture.name} validates successfully`, () => {
      expect(validateStrategyReviewExportPlanFixture(fixture).valid).toBe(true);
    });

    it(`${fixture.name} passes safety validation`, () => {
      expect(validateStrategyReviewExportPlanSafety(fixture)).toEqual({ safe: true, violations: [] });
    });

    it(`${fixture.name} references the expected Phase 42 preview`, () => {
      expect(fixture.previewReference.sourcePhase).toBe(42);
      expect(fixture.previewReference.sourcePreviewFixtureName).toBe(EXPORT_PLAN_NAME_TO_PREVIEW[fixture.name]);
    });

    it(`${fixture.name} uses the expected fixture kind`, () => {
      expect(fixture.kind).toBe(EXPORT_PLAN_NAME_TO_KIND[fixture.name]);
    });

    it(`${fixture.name} uses the expected target format`, () => {
      expect(fixture.targetFormat).toBe(EXPORT_PLAN_NAME_TO_TARGET[fixture.name]);
    });

    it(`${fixture.name} stays compatible with the referenced Phase 42 preview format`, () => {
      expect(preview).toBeDefined();
      expect(fixture.previewReference.sourcePreviewFormat).toBe(preview?.format);
      expect(fixture.targetFormat).toBe(preview?.format);
    });

    it(`${fixture.name} copies preview checksum and content length from Phase 42`, () => {
      expect(fixture.previewReference.checksum).toBe(preview?.checksum);
      expect(fixture.previewReference.contentLength).toBe(preview?.contentLength);
    });

    it(`${fixture.name} keeps the source report reference aligned with Phase 42`, () => {
      expect(fixture.previewReference.sourceReportFixtureName).toBe(
        preview?.reportReference.sourceReportFixtureName,
      );
      expect(fixture.previewReference.sourceReportFixtureKind).toBe(
        preview?.reportReference.sourceReportFixtureKind,
      );
    });

    it(`${fixture.name} keeps export disabled with no file path or download name`, () => {
      expect(fixture.exportPlan.exportMode).toBe('planning-only-disabled');
      expect(fixture.exportPlan.enabled).toBe(false);
      expect(fixture.exportPlan.destination).toBe('disabled');
      expect(fixture.exportPlan.filePath).toBeNull();
      expect(fixture.exportPlan.downloadName).toBeNull();
    });

    it(`${fixture.name} uses a deterministic file extension and file name`, () => {
      expect(fixture.exportPlan.fileExtension).toBe(EXTENSIONS[fixture.targetFormat]);
      expect(fixture.exportPlan.fileName).toBe(
        `${fixture.previewReference.sourcePreviewFixtureName}${EXTENSIONS[fixture.targetFormat]}`,
      );
    });

    it(`${fixture.name} includes deterministic plan steps and disabled reasons`, () => {
      expect(fixture.exportPlan.planSteps.length).toBeGreaterThanOrEqual(4);
      expect(fixture.exportPlan.disabledReasons.length).toBeGreaterThanOrEqual(4);
      expect([...fixture.exportPlan.planSteps]).toEqual([...fixture.exportPlan.planSteps].sort());
      expect([...fixture.exportPlan.disabledReasons]).toEqual(
        [...fixture.exportPlan.disabledReasons].sort(),
      );
    });

    it(`${fixture.name} carries deterministic Phase 43 meta`, () => {
      expect(fixture.meta.phase).toBe(43);
      expect(fixture.meta.sourcePreviewPhase).toBe(42);
      expect(fixture.meta.sourceReportPhase).toBe(41);
      expect(fixture.meta.generatedAt).toBe(PHASE_43_STRATEGY_REVIEW_EXPORT_PLAN_GENERATED_AT);
      expect(fixture.meta.source).toBe(PHASE_43_STRATEGY_REVIEW_EXPORT_PLAN_SOURCE);
      expect(fixture.meta.sourcePhases).toEqual([40, 41, 42, 43]);
    });

    it(`${fixture.name} keeps all meta safety flags disabled`, () => {
      expect(fixture.meta.exportDisabled).toBe(true);
      expect(fixture.meta.actualFileExport).toBe(false);
      expect(fixture.meta.filesystemWrites).toBe(false);
      expect(fixture.meta.downloadSupport).toBe(false);
      expect(fixture.meta.pdfGeneration).toBe(false);
      expect(fixture.meta.csvGeneration).toBe(false);
      expect(fixture.meta.htmlGeneration).toBe(false);
      expect(fixture.meta.externalNetwork).toBe(false);
      expect(fixture.meta.persistence).toBe(false);
      expect(fixture.meta.execution).toBe(false);
      expect(fixture.meta.tradingSignals).toBe(false);
      expect(fixture.meta.investmentAdvice).toBe(false);
    });

    it(`${fixture.name} keeps all Phase 43 safety boundary flags correct`, () => {
      expect(fixture.safetyBoundary.strategyReviewExportPlanningFixtures).toBe(true);
      expect(fixture.safetyBoundary.syntheticStrategyReviewExportPlans).toBe(true);
      expect(fixture.safetyBoundary.strategyReviewExportPlanBuilders).toBe(true);
      expect(fixture.safetyBoundary.strategyReviewExportPlanSafetyValidation).toBe(true);
      expect(fixture.safetyBoundary.strategyReviewSerializationPreviewReferences).toBe(true);
      expect(fixture.safetyBoundary.strategyReviewActualFileExport).toBe(false);
      expect(fixture.safetyBoundary.strategyReviewFilesystemWrites).toBe(false);
      expect(fixture.safetyBoundary.strategyReviewDownloadSupport).toBe(false);
      expect(fixture.safetyBoundary.strategyReviewPdfGeneration).toBe(false);
      expect(fixture.safetyBoundary.strategyReviewCsvGeneration).toBe(false);
      expect(fixture.safetyBoundary.strategyReviewHtmlGeneration).toBe(false);
      expect(fixture.safetyBoundary.strategyReviewExportExternalNetwork).toBe(false);
      expect(fixture.safetyBoundary.strategyReviewExportPersistence).toBe(false);
      expect(fixture.safetyBoundary.strategyReviewExportExecution).toBe(false);
      expect(fixture.safetyBoundary.strategyReviewExportTradingSignals).toBe(false);
      expect(fixture.safetyBoundary.strategyReviewExportInvestmentAdvice).toBe(false);
    });

    it(`${fixture.name} remains serializable and equal after round-trip serialization`, () => {
      expect(isStrategyReviewExportPlanFixtureSerializable(fixture)).toBe(true);
      const serialized = serializeStrategyReviewExportPlanFixture(fixture);
      const roundTrip = JSON.parse(JSON.stringify(serialized));
      expect(areStrategyReviewExportPlanFixturesEqual(fixture, roundTrip as typeof fixture)).toBe(true);
    });

    it(`${fixture.name} normalization is idempotent`, () => {
      expect(normalizeStrategyReviewExportPlanFixture(fixture)).toEqual(fixture);
    });

    it(`${fixture.name} summary helper is deterministic`, () => {
      expect(buildStrategyReviewExportPlanSummary(fixture)).toEqual(fixture.summary);
      expect(fixture.summary.sourcePreviewFixtureName).toBe(fixture.previewReference.sourcePreviewFixtureName);
      expect(fixture.summary.sourceReportFixtureName).toBe(fixture.previewReference.sourceReportFixtureName);
      expect(fixture.summary.fileName).toBe(fixture.exportPlan.fileName);
      expect(fixture.summary.exportDisabled).toBe(true);
      expect(fixture.summary.generatedAt).toBe(PHASE_43_STRATEGY_REVIEW_EXPORT_PLAN_GENERATED_AT);
    });

    it(`${fixture.name} safe notes are sorted and unique`, () => {
      expect([...fixture.safeNotes]).toEqual([...fixture.safeNotes].sort());
      expect(new Set(fixture.safeNotes).size).toBe(fixture.safeNotes.length);
    });
  }
});

describe('Phase 43 — Builder behavior', () => {
  for (const fixture of ALL_FIXTURES) {
    it(`builder recreates ${fixture.name} successfully`, () => {
      const result = buildStrategyReviewExportPlanFixture({
        name: fixture.name,
        kind: EXPORT_PLAN_NAME_TO_KIND[fixture.name],
        targetFormat: EXPORT_PLAN_NAME_TO_TARGET[fixture.name],
        sourcePreviewFixtureName: EXPORT_PLAN_NAME_TO_PREVIEW[fixture.name],
      });
      expect(result.success).toBe(true);
      expect(result.validation.valid).toBe(true);
      expect(result.safety.safe).toBe(true);
      expect(result.fixture).toEqual(fixture);
    });

    it(`builder is deterministic for ${fixture.name}`, () => {
      const first = buildStrategyReviewExportPlanFixture({
        name: fixture.name,
        kind: EXPORT_PLAN_NAME_TO_KIND[fixture.name],
        targetFormat: EXPORT_PLAN_NAME_TO_TARGET[fixture.name],
        sourcePreviewFixtureName: EXPORT_PLAN_NAME_TO_PREVIEW[fixture.name],
      });
      const second = buildStrategyReviewExportPlanFixture({
        name: fixture.name,
        kind: EXPORT_PLAN_NAME_TO_KIND[fixture.name],
        targetFormat: EXPORT_PLAN_NAME_TO_TARGET[fixture.name],
        sourcePreviewFixtureName: EXPORT_PLAN_NAME_TO_PREVIEW[fixture.name],
      });
      expect(first.fixture).toEqual(second.fixture);
    });

    it(`builder does not mutate input for ${fixture.name}`, () => {
      const input = {
        name: fixture.name,
        kind: EXPORT_PLAN_NAME_TO_KIND[fixture.name],
        targetFormat: EXPORT_PLAN_NAME_TO_TARGET[fixture.name],
        sourcePreviewFixtureName: EXPORT_PLAN_NAME_TO_PREVIEW[fixture.name],
        safeNotes: ['z-note', 'a-note', 'a-note'],
      } as const;
      const snapshot = JSON.stringify(input);
      buildStrategyReviewExportPlanFixture(input);
      expect(JSON.stringify(input)).toBe(snapshot);
    });
  }

  it('builder falls back to the first fixture name for invalid names', () => {
    const result = buildStrategyReviewExportPlanFixture({
      name: 'invalid-export-plan' as never,
      kind: 'invalid-kind' as never,
      targetFormat: 'json',
      sourcePreviewFixtureName: 'defensive-vs-aggressive-json-preview',
    });
    expect(result.fixture?.name).toBe('json-export-plan-disabled');
    expect(result.fixture?.kind).toBe(EXPORT_PLAN_NAME_TO_KIND['json-export-plan-disabled']);
  });

  it('builder falls back to mapped target format for invalid targets', () => {
    const result = buildStrategyReviewExportPlanFixture({
      name: 'creator-led-export-plan',
      kind: EXPORT_PLAN_NAME_TO_KIND['creator-led-export-plan'],
      targetFormat: 'invalid-target' as never,
      sourcePreviewFixtureName: 'creator-led-markdown-preview',
    });
    expect(result.fixture?.targetFormat).toBe('markdown');
  });

  it('builder falls back to the mapped preview when the preview name is invalid', () => {
    const result = buildStrategyReviewExportPlanFixture({
      name: 'json-export-plan-disabled',
      kind: EXPORT_PLAN_NAME_TO_KIND['json-export-plan-disabled'],
      targetFormat: 'json',
      sourcePreviewFixtureName: 'missing-preview' as never,
    });
    expect(result.success).toBe(true);
    expect(result.fixture?.previewReference.sourcePreviewFixtureName).toBe(
      EXPORT_PLAN_NAME_TO_PREVIEW['json-export-plan-disabled'],
    );
  });
});

describe('Phase 43 — Safety validation catches unsafe content', () => {
  const cases = [
    { label: 'external URL', value: 'https://example.com/export' },
    { label: 'local path', value: '/home/user/export.json' },
    { label: 'secret', value: 'private key material' },
    { label: 'execution api', value: 'signTransaction(payload)' },
    { label: 'network api', value: 'fetch("/export")' },
    { label: 'dynamic code', value: 'eval("danger")' },
    { label: 'download api', value: 'URL.createObjectURL(blob)' },
    { label: 'timer api', value: 'setTimeout(run, 1000)' },
    { label: 'browser runtime', value: 'window.localStorage' },
  ] as const;

  for (const testCase of cases) {
    it(`flags ${testCase.label}`, () => {
      const result = validateStrategyReviewExportPlanSafety({ notes: [testCase.value] });
      expect(result.safe).toBe(false);
      expect(result.violations.length).toBeGreaterThan(0);
    });
  }
});

describe('Phase 43 — Validation catches malformed export plans', () => {
  it('rejects non-object inputs', () => {
    expect(validateStrategyReviewExportPlanFixture(null).valid).toBe(false);
  });

  it('rejects wrong preview phase', () => {
    const badFixture = {
      ...JSON_EXPORT_PLAN_DISABLED_FIXTURE,
      previewReference: {
        ...JSON_EXPORT_PLAN_DISABLED_FIXTURE.previewReference,
        sourcePhase: 41,
      },
    };
    expect(validateStrategyReviewExportPlanFixture(badFixture).valid).toBe(false);
  });

  it('rejects enabled export plans', () => {
    const badFixture = {
      ...JSON_EXPORT_PLAN_DISABLED_FIXTURE,
      exportPlan: {
        ...JSON_EXPORT_PLAN_DISABLED_FIXTURE.exportPlan,
        enabled: true,
      },
    };
    expect(validateStrategyReviewExportPlanFixture(badFixture).valid).toBe(false);
  });

  it('rejects file paths in export plans', () => {
    const badFixture = {
      ...JSON_EXPORT_PLAN_DISABLED_FIXTURE,
      exportPlan: {
        ...JSON_EXPORT_PLAN_DISABLED_FIXTURE.exportPlan,
        filePath: '/tmp/out.json',
      },
    };
    expect(validateStrategyReviewExportPlanFixture(badFixture).valid).toBe(false);
  });

  it('rejects non-deterministic generatedAt values', () => {
    const badFixture = {
      ...JSON_EXPORT_PLAN_DISABLED_FIXTURE,
      meta: {
        ...JSON_EXPORT_PLAN_DISABLED_FIXTURE.meta,
        generatedAt: '2026-02-02T00:00:00.000Z',
      },
    };
    expect(validateStrategyReviewExportPlanFixture(badFixture).valid).toBe(false);
  });
});

describe('Phase 43 — Documentation updates', () => {
  it('README advertises Phase 43', () => {
    const readme = readFileSync(PHASE_43_README, 'utf8');
    expect(readme).toContain('Phase 43 — Strategy Review Report Export Planning Fixtures v1');
    expect(readme).toContain('docs/STRATEGY_REVIEW_REPORT_EXPORT_PLANNING_FIXTURES.md');
  });

  it('Phase 43 doc previews Phase 44 only', () => {
    const doc = readFileSync(PHASE_43_DOC, 'utf8');
    expect(doc).toContain('Phase 44 (Strategy Review Export Queue Fixtures — future, not implemented)');
    expect(doc).toContain('planning-only');
  });
});

describe('Phase 43 — Operational source avoids unsafe runtime APIs', () => {
  for (const filePath of SAFE_RUNTIME_FILES) {
    const content = readFileSync(filePath, 'utf8');
    for (const pattern of SAFE_RUNTIME_PATTERNS) {
      it(`${filePath.split('/').pop()} does not contain ${pattern}`, () => {
        expect(content.includes(pattern)).toBe(false);
      });
    }
  }
});
