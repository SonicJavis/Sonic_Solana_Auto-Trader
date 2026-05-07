/**
 * tests/phase28.test.ts
 *
 * Phase 28 — Local Dashboard Report Export Models v1
 */

import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  DASHBOARD_REPORT_NAMES,
  DASHBOARD_REPORT_KINDS,
  DASHBOARD_REPORT_SECTION_KINDS,
  buildDashboardReportModel,
  buildDefaultDashboardReportModel,
  buildSnapshotInventoryReportModel,
  buildDashboardReportSection,
  buildDashboardSafetyBoundaryReport,
  buildSnapshotBackedReportFromFixture,
  normalizeDashboardReportModel,
  serializeDashboardReportModel,
  isDashboardReportSerializable,
  areDashboardReportsEqual,
  validateDashboardReportModel,
  validateDashboardReportSafety,
  FULL_DASHBOARD_REPORT_FIXTURE,
  HEALTH_REPORT_SECTION_FIXTURE,
  CAPABILITIES_REPORT_SECTION_FIXTURE,
  OVERVIEW_REPORT_SECTION_FIXTURE,
  EVIDENCE_REPORT_SECTION_FIXTURE,
  SAFETY_REPORT_SECTION_FIXTURE,
  METADATA_REPORT_SECTION_FIXTURE,
  INTERACTION_STATE_REPORT_SECTION_FIXTURE,
  FILTERED_EVIDENCE_REPORT_SECTION_FIXTURE,
  FILTERED_SAFETY_REPORT_SECTION_FIXTURE,
  SNAPSHOT_INVENTORY_REPORT_FIXTURE,
  SAFETY_BOUNDARY_REPORT_FIXTURE,
  ERROR_STATE_REPORT_FIXTURE,
  EMPTY_STATE_REPORT_FIXTURE,
  LOADING_STATE_REPORT_FIXTURE,
  UNAVAILABLE_STATE_REPORT_FIXTURE,
  NO_RESULTS_REPORT_FIXTURE,
  MALFORMED_INPUT_SAFE_REPORT_FIXTURE,
  REPORT_VALIDATION_FAILURE_EXAMPLE_FIXTURE,
  EXPORT_DISABLED_SAFETY_REPORT_FIXTURE,
  PHASE_28_REPORT_FIXTURES,
  listDashboardReportFixtures,
  getDashboardReportFixture,
  getDashboardReportCapabilities,
  buildFixtureDashboardViewModel,
  getDashboardUiShellCapabilities,
  createDefaultDashboardInteractionState,
  updateDashboardEvidenceFilters,
  updateDashboardSafetyFilters,
  buildDefaultDashboardRenderSnapshot,
  getDashboardRenderSnapshotFixture,
  listDashboardRenderSnapshotFixtures,
} from '@sonic/dashboard';

import { getLocalReadOnlyApiCapabilities } from '@sonic/read-only-api';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const REPORT_SRC = resolve(REPO_ROOT, 'apps/dashboard/src/reports');

const REPORT_FILES = [
  'types.ts',
  'builders.ts',
  'normalization.ts',
  'validation.ts',
  'fixtures.ts',
  'capabilities.ts',
  'index.ts',
].map(file => resolve(REPORT_SRC, file));

const FIXTURE_EXPORTS = [
  FULL_DASHBOARD_REPORT_FIXTURE,
  HEALTH_REPORT_SECTION_FIXTURE,
  CAPABILITIES_REPORT_SECTION_FIXTURE,
  OVERVIEW_REPORT_SECTION_FIXTURE,
  EVIDENCE_REPORT_SECTION_FIXTURE,
  SAFETY_REPORT_SECTION_FIXTURE,
  METADATA_REPORT_SECTION_FIXTURE,
  INTERACTION_STATE_REPORT_SECTION_FIXTURE,
  FILTERED_EVIDENCE_REPORT_SECTION_FIXTURE,
  FILTERED_SAFETY_REPORT_SECTION_FIXTURE,
  SNAPSHOT_INVENTORY_REPORT_FIXTURE,
  SAFETY_BOUNDARY_REPORT_FIXTURE,
  ERROR_STATE_REPORT_FIXTURE,
  EMPTY_STATE_REPORT_FIXTURE,
  LOADING_STATE_REPORT_FIXTURE,
  UNAVAILABLE_STATE_REPORT_FIXTURE,
  NO_RESULTS_REPORT_FIXTURE,
  MALFORMED_INPUT_SAFE_REPORT_FIXTURE,
  REPORT_VALIDATION_FAILURE_EXAMPLE_FIXTURE,
  EXPORT_DISABLED_SAFETY_REPORT_FIXTURE,
] as const;

const VALID_FIXTURE_NAMES = DASHBOARD_REPORT_NAMES.filter(
  name => name !== 'report-validation-failure-example',
);

describe('Phase 28 — module exports', () => {
  const functionExports: Array<[string, unknown]> = [
    ['buildDashboardReportModel', buildDashboardReportModel],
    ['buildDefaultDashboardReportModel', buildDefaultDashboardReportModel],
    ['buildSnapshotInventoryReportModel', buildSnapshotInventoryReportModel],
    ['buildDashboardReportSection', buildDashboardReportSection],
    ['buildDashboardSafetyBoundaryReport', buildDashboardSafetyBoundaryReport],
    ['buildSnapshotBackedReportFromFixture', buildSnapshotBackedReportFromFixture],
    ['normalizeDashboardReportModel', normalizeDashboardReportModel],
    ['serializeDashboardReportModel', serializeDashboardReportModel],
    ['isDashboardReportSerializable', isDashboardReportSerializable],
    ['areDashboardReportsEqual', areDashboardReportsEqual],
    ['validateDashboardReportModel', validateDashboardReportModel],
    ['validateDashboardReportSafety', validateDashboardReportSafety],
    ['listDashboardReportFixtures', listDashboardReportFixtures],
    ['getDashboardReportFixture', getDashboardReportFixture],
    ['getDashboardReportCapabilities', getDashboardReportCapabilities],
  ];

  functionExports.forEach(([name, value]) => {
    it(`${name} is exported`, () => {
      expect(typeof value).toBe('function');
    });
  });

  it('DASHBOARD_REPORT_NAMES has 20 entries', () => {
    expect(DASHBOARD_REPORT_NAMES.length).toBe(20);
  });

  it('DASHBOARD_REPORT_KINDS has expected kinds', () => {
    expect(DASHBOARD_REPORT_KINDS).toContain('full');
    expect(DASHBOARD_REPORT_KINDS).toContain('section');
    expect(DASHBOARD_REPORT_KINDS).toContain('inventory');
    expect(DASHBOARD_REPORT_KINDS).toContain('safety');
  });

  it('DASHBOARD_REPORT_SECTION_KINDS has expected kinds', () => {
    expect(DASHBOARD_REPORT_SECTION_KINDS).toContain('health');
    expect(DASHBOARD_REPORT_SECTION_KINDS).toContain('interaction');
    expect(DASHBOARD_REPORT_SECTION_KINDS).toContain('snapshot-inventory');
  });
});

describe('Phase 28 — fixture list and lookup helpers', () => {
  it('listDashboardReportFixtures returns all 20 names', () => {
    expect(listDashboardReportFixtures().length).toBe(20);
  });

  it('listDashboardReportFixtures returns alphabetically sorted names', () => {
    const names = listDashboardReportFixtures();
    expect(names).toEqual([...names].sort());
  });

  it('getDashboardReportFixture returns every fixture by name', () => {
    for (const name of DASHBOARD_REPORT_NAMES) {
      const fixture = getDashboardReportFixture(name);
      expect(fixture).toBeDefined();
      expect(fixture?.name).toBe(name);
    }
  });

  it('getDashboardReportFixture returns undefined for unknown names', () => {
    // @ts-expect-error intentional invalid input
    expect(getDashboardReportFixture('not-a-report')).toBeUndefined();
  });

  it('PHASE_28_REPORT_FIXTURES is a map with 20 entries', () => {
    expect(PHASE_28_REPORT_FIXTURES instanceof Map).toBe(true);
    expect(PHASE_28_REPORT_FIXTURES.size).toBe(20);
  });
});

describe('Phase 28 — report fixtures core shape', () => {
  FIXTURE_EXPORTS.forEach(fixture => {
    it(`${fixture.name} has fixture/report/name`, () => {
      expect(typeof fixture.name).toBe('string');
      expect(typeof fixture.description).toBe('string');
      expect(typeof fixture.report).toBe('object');
      expect(fixture.report.name).toBe(fixture.name);
    });

    it(`${fixture.name} has deterministic phase metadata`, () => {
      expect(fixture.report.meta.phase).toBe(28);
      expect(fixture.report.meta.sourceSnapshotPhase).toBe(27);
      expect(fixture.report.meta.fixtureOnly).toBe(true);
      expect(fixture.report.meta.liveData).toBe(false);
      expect(fixture.report.meta.externalNetwork).toBe(false);
      expect(fixture.report.meta.deterministic).toBe(true);
    });

    it(`${fixture.name} has safety boundary flags`, () => {
      const safety = fixture.report.safetyBoundary;
      expect(safety.isReadOnly).toBe(true);
      expect(safety.isLocalOnly).toBe(true);
      expect(safety.isFixtureBacked).toBe(true);
      expect(safety.hasLiveData).toBe(false);
      expect(safety.hasTradingControls).toBe(false);
      expect(safety.hasWalletControls).toBe(false);
      expect(safety.hasMutationControls).toBe(false);
      expect(safety.hasExternalNetwork).toBe(false);
      expect(safety.hasExecutionControls).toBe(false);
      expect(safety.dashboardReportFileExport).toBe(false);
      expect(safety.dashboardReportPersistence).toBe(false);
      expect(safety.dashboardReportExternalNetwork).toBe(false);
      expect(safety.dashboardReportLiveData).toBe(false);
      expect(safety.dashboardReportMutationControls).toBe(false);
    });

    it(`${fixture.name} is serializable`, () => {
      expect(isDashboardReportSerializable(fixture.report)).toBe(true);
      expect(() => JSON.parse(JSON.stringify(fixture.report))).not.toThrow();
    });

    it(`${fixture.name} sections are deterministically sorted`, () => {
      const ids = fixture.report.sections.map(section => section.id);
      expect(ids).toEqual([...ids].sort());
    });

    it(`${fixture.name} source snapshot names are deterministically sorted`, () => {
      const names = fixture.report.meta.sourceSnapshotNames;
      expect(names).toEqual([...names].sort());
    });
  });
});

describe('Phase 28 — per-required fixture names exist', () => {
  const requiredNames = [
    'full-dashboard-report',
    'health-report-section',
    'capabilities-report-section',
    'overview-report-section',
    'evidence-report-section',
    'safety-report-section',
    'metadata-report-section',
    'interaction-state-report-section',
    'filtered-evidence-report-section',
    'filtered-safety-report-section',
    'snapshot-inventory-report',
    'safety-boundary-report',
    'error-state-report',
    'empty-state-report',
    'loading-state-report',
    'unavailable-state-report',
    'no-results-report',
    'malformed-input-safe-report',
    'report-validation-failure-example',
    'export-disabled-safety-report',
  ] as const;

  requiredNames.forEach(name => {
    it(`${name} exists`, () => {
      expect(listDashboardReportFixtures()).toContain(name);
      expect(getDashboardReportFixture(name)?.name).toBe(name);
    });
  });
});

describe('Phase 28 — report builders', () => {
  const viewModel = buildFixtureDashboardViewModel();
  const defaultSnapshot = buildDefaultDashboardRenderSnapshot(viewModel);

  it('buildDefaultDashboardReportModel returns full-dashboard-report', () => {
    const report = buildDefaultDashboardReportModel();
    expect(report.name).toBe('full-dashboard-report');
    expect(report.kind).toBe('full');
  });

  it('buildSnapshotInventoryReportModel returns inventory report', () => {
    const report = buildSnapshotInventoryReportModel();
    expect(report.name).toBe('snapshot-inventory-report');
    expect(report.kind).toBe('inventory');
  });

  it('buildDashboardReportSection builds deterministic section', () => {
    const section = buildDashboardReportSection(defaultSnapshot);
    expect(section.sourceSnapshotName).toBe('default-dashboard-shell');
    expect(section.componentType).toBe('DashboardShell');
  });

  it('buildDashboardSafetyBoundaryReport returns all report safety flags', () => {
    const safety = buildDashboardSafetyBoundaryReport();
    expect(safety.dashboardReportModels).toBe(true);
    expect(safety.dashboardReportFixtures).toBe(true);
    expect(safety.deterministicReportModels).toBe(true);
    expect(safety.reportSafetyValidation).toBe(true);
    expect(safety.fixtureBackedReports).toBe(true);
    expect(safety.dashboardReportFileExport).toBe(false);
  });

  it('buildDashboardReportModel succeeds for valid input', () => {
    const result = buildDashboardReportModel({
      name: 'full-dashboard-report',
      kind: 'full',
      primarySnapshot: defaultSnapshot,
      sourceViewModelMeta: {
        phase: viewModel.health.meta.phase,
        apiMode: viewModel.health.meta.apiMode,
        fixtureOnly: viewModel.health.meta.fixtureOnly,
        liveData: viewModel.health.meta.liveData,
        readOnly: viewModel.health.meta.readOnly,
        localOnly: viewModel.health.meta.localOnly,
        generatedAt: viewModel.health.meta.generatedAt,
      },
      title: 'Full Report',
      safeNotes: ['Safe deterministic report.'],
    });

    expect(result.success).toBe(true);
    expect(result.report?.name).toBe('full-dashboard-report');
  });

  it('buildDashboardReportModel returns failure for invalid name', () => {
    const result = buildDashboardReportModel({
      // @ts-expect-error intentional invalid input
      name: 'invalid-name',
      kind: 'full',
      primarySnapshot: defaultSnapshot,
      sourceViewModelMeta: {
        phase: viewModel.health.meta.phase,
        apiMode: viewModel.health.meta.apiMode,
        fixtureOnly: viewModel.health.meta.fixtureOnly,
        liveData: viewModel.health.meta.liveData,
        readOnly: viewModel.health.meta.readOnly,
        localOnly: viewModel.health.meta.localOnly,
        generatedAt: viewModel.health.meta.generatedAt,
      },
      title: 'Bad Report',
      safeNotes: ['Safe note'],
    });

    expect(result.success).toBe(false);
    expect(result.report).toBeNull();
    expect(result.issues.length).toBeGreaterThan(0);
  });

  it('buildDashboardReportModel returns failure for invalid kind', () => {
    const result = buildDashboardReportModel({
      name: 'full-dashboard-report',
      // @ts-expect-error intentional invalid input
      kind: 'unknown-kind',
      primarySnapshot: defaultSnapshot,
      sourceViewModelMeta: {
        phase: viewModel.health.meta.phase,
        apiMode: viewModel.health.meta.apiMode,
        fixtureOnly: viewModel.health.meta.fixtureOnly,
        liveData: viewModel.health.meta.liveData,
        readOnly: viewModel.health.meta.readOnly,
        localOnly: viewModel.health.meta.localOnly,
        generatedAt: viewModel.health.meta.generatedAt,
      },
      title: 'Bad Kind',
      safeNotes: ['Safe note'],
    });

    expect(result.success).toBe(false);
    expect(result.report).toBeNull();
  });

  it('buildDashboardReportModel does not throw for malformed input', () => {
    expect(() => {
      buildDashboardReportModel({
        // @ts-expect-error intentional invalid input
        name: null,
        // @ts-expect-error intentional invalid input
        kind: null,
        // @ts-expect-error intentional invalid input
        primarySnapshot: null,
        // @ts-expect-error intentional invalid input
        sourceViewModelMeta: null,
        // @ts-expect-error intentional invalid input
        title: null,
        // @ts-expect-error intentional invalid input
        safeNotes: null,
      });
    }).not.toThrow();
  });

  it('buildSnapshotBackedReportFromFixture builds a fixture-backed section report', () => {
    const report = buildSnapshotBackedReportFromFixture(
      'health-panel',
      'health-report-section',
      'section',
      'Health Section Report',
      ['Health safe notes'],
    );
    expect(report.name).toBe('health-report-section');
    expect(report.sections.length).toBeGreaterThan(0);
  });
});

describe('Phase 28 — report normalization and equality', () => {
  const report = FULL_DASHBOARD_REPORT_FIXTURE.report;

  it('normalizeDashboardReportModel preserves key identity fields', () => {
    const normalized = normalizeDashboardReportModel(report);
    expect(normalized.name).toBe(report.name);
    expect(normalized.kind).toBe(report.kind);
    expect(normalized.title).toBe(report.title);
  });

  it('normalizeDashboardReportModel is idempotent', () => {
    const once = normalizeDashboardReportModel(report);
    const twice = normalizeDashboardReportModel(once);
    expect(JSON.stringify(once)).toBe(JSON.stringify(twice));
  });

  it('normalizeDashboardReportModel does not mutate input', () => {
    const before = JSON.stringify(report);
    normalizeDashboardReportModel(report);
    expect(JSON.stringify(report)).toBe(before);
  });

  it('serializeDashboardReportModel returns plain object', () => {
    const serialized = serializeDashboardReportModel(report);
    expect(typeof serialized).toBe('object');
    expect(serialized).not.toBeNull();
  });

  it('areDashboardReportsEqual returns true for equivalent reports', () => {
    const a = normalizeDashboardReportModel(report);
    const b = normalizeDashboardReportModel(report);
    expect(areDashboardReportsEqual(a, b)).toBe(true);
  });

  it('areDashboardReportsEqual returns false for different reports', () => {
    const a = FULL_DASHBOARD_REPORT_FIXTURE.report;
    const b = ERROR_STATE_REPORT_FIXTURE.report;
    expect(areDashboardReportsEqual(a, b)).toBe(false);
  });
});

describe('Phase 28 — report validation', () => {
  VALID_FIXTURE_NAMES.forEach(name => {
    it(`${name} validates successfully`, () => {
      const fixture = getDashboardReportFixture(name);
      expect(fixture).toBeDefined();
      if (fixture) {
        const result = validateDashboardReportModel(fixture.report);
        expect(result.valid).toBe(true);
        expect(result.issues.length).toBe(0);
      }
    });

    it(`${name} passes safety validation`, () => {
      const fixture = getDashboardReportFixture(name);
      expect(fixture).toBeDefined();
      if (fixture) {
        const result = validateDashboardReportSafety(fixture.report);
        expect(result.safe).toBe(true);
      }
    });
  });

  it('report-validation-failure-example fails model validation', () => {
    const result = validateDashboardReportModel(REPORT_VALIDATION_FAILURE_EXAMPLE_FIXTURE.report);
    expect(result.valid).toBe(false);
    expect(result.issues.some(issue => issue.code === 'UNSUPPORTED_SNAPSHOT_NAME')).toBe(true);
  });

  it('validation returns failure for null input', () => {
    const result = validateDashboardReportModel(null);
    expect(result.valid).toBe(false);
    expect(result.issues.length).toBeGreaterThan(0);
  });

  it('validation returns failure for undefined input', () => {
    const result = validateDashboardReportModel(undefined);
    expect(result.valid).toBe(false);
    expect(result.issues.length).toBeGreaterThan(0);
  });

  it('validation returns failure for empty object', () => {
    const result = validateDashboardReportModel({});
    expect(result.valid).toBe(false);
    expect(result.issues.length).toBeGreaterThan(0);
  });

  it('safety validation returns unsafe for stack trace pattern', () => {
    const broken = {
      ...FULL_DASHBOARD_REPORT_FIXTURE.report,
      title: 'TypeError: unsafe stack trace content',
    };
    const result = validateDashboardReportSafety(broken);
    expect(result.safe).toBe(false);
    expect(result.violations.length).toBeGreaterThan(0);
  });

  it('safety validation returns unsafe for local path pattern', () => {
    const broken = {
      ...FULL_DASHBOARD_REPORT_FIXTURE.report,
      title: '/home/runner/unsafe/path',
    };
    const result = validateDashboardReportSafety(broken);
    expect(result.safe).toBe(false);
  });

  it('safety validation returns unsafe for null', () => {
    const result = validateDashboardReportSafety(null);
    expect(result.safe).toBe(false);
  });
});

describe('Phase 28 — generatedAt and metadata determinism', () => {
  it('generatedAt is deterministic across repeated builds', () => {
    const a = buildDefaultDashboardReportModel();
    const b = buildDefaultDashboardReportModel();
    expect(a.meta.generatedAt).toBe(b.meta.generatedAt);
  });

  it('generatedAt comes from deterministic source metadata', () => {
    const report = buildDefaultDashboardReportModel();
    const viewModel = buildFixtureDashboardViewModel();
    expect(report.meta.generatedAt).toBe(viewModel.health.meta.generatedAt);
  });

  it('meta.source is stable across repeated builds', () => {
    const a = buildDefaultDashboardReportModel();
    const b = buildDefaultDashboardReportModel();
    expect(a.meta.source).toBe(b.meta.source);
  });

  it('meta.sourceSnapshotNames are stable across repeated builds', () => {
    const a = buildSnapshotInventoryReportModel();
    const b = buildSnapshotInventoryReportModel();
    expect(a.meta.sourceSnapshotNames).toEqual(b.meta.sourceSnapshotNames);
  });
});

describe('Phase 28 — compatibility with Phase 24/25/26/27', () => {
  it('uses Phase 24 view-model metadata fields', () => {
    const report = buildDefaultDashboardReportModel();
    expect(report.meta.sourceViewModelMeta.phase).toBe(22);
    expect(report.meta.sourceViewModelMeta.fixtureOnly).toBe(true);
    expect(report.meta.sourceViewModelMeta.liveData).toBe(false);
  });

  it('uses Phase 25 safety boundary semantics', () => {
    const report = buildDefaultDashboardReportModel();
    expect(report.safetyBoundary.isReadOnly).toBe(true);
    expect(report.safetyBoundary.hasExecutionControls).toBe(false);
  });

  it('uses Phase 26 interaction state snapshots for interaction reports', () => {
    const report = INTERACTION_STATE_REPORT_SECTION_FIXTURE.report;
    expect(report.sections.some(section => section.kind === 'interaction')).toBe(true);
  });

  it('uses Phase 27 snapshot fixture names in metadata inventory', () => {
    const report = buildSnapshotInventoryReportModel();
    const snapshotNames = listDashboardRenderSnapshotFixtures();
    snapshotNames.forEach(name => {
      expect(report.meta.sourceSnapshotNames).toContain(name);
    });
  });

  it('buildSnapshotBackedReportFromFixture consumes Phase 27 snapshot fixture', () => {
    const snap = getDashboardRenderSnapshotFixture('health-panel');
    expect(snap).toBeDefined();
    const report = buildSnapshotBackedReportFromFixture('health-panel', 'health-report-section', 'section', 'x', ['y']);
    expect(report.sections[0]?.sourceSnapshotName).toBe('health-panel');
  });

  it('filtered evidence and safety report fixtures remain deterministic', () => {
    const evidenceA = FILTERED_EVIDENCE_REPORT_SECTION_FIXTURE.report;
    const evidenceB = normalizeDashboardReportModel(FILTERED_EVIDENCE_REPORT_SECTION_FIXTURE.report);
    expect(areDashboardReportsEqual(evidenceA, evidenceB)).toBe(true);

    const safetyA = FILTERED_SAFETY_REPORT_SECTION_FIXTURE.report;
    const safetyB = normalizeDashboardReportModel(FILTERED_SAFETY_REPORT_SECTION_FIXTURE.report);
    expect(areDashboardReportsEqual(safetyA, safetyB)).toBe(true);
  });

  it('no-results report aligns with filtered evidence interaction semantics', () => {
    const report = NO_RESULTS_REPORT_FIXTURE.report;
    expect(report.summary.isFilteredState).toBe(true);
    expect(report.expectedStatus).toBe('empty');
  });
});

describe('Phase 28 — capabilities include report flags', () => {
  it('getDashboardReportCapabilities includes Phase 28 flags', () => {
    const caps = getDashboardReportCapabilities();
    expect(caps.dashboardReportModels).toBe(true);
    expect(caps.dashboardReportFixtures).toBe(true);
    expect(caps.deterministicReportModels).toBe(true);
    expect(caps.reportSafetyValidation).toBe(true);
    expect(caps.fixtureBackedReports).toBe(true);
    expect(caps.dashboardReportFileExport).toBe(false);
    expect(caps.dashboardReportPersistence).toBe(false);
    expect(caps.dashboardReportExternalNetwork).toBe(false);
    expect(caps.dashboardReportLiveData).toBe(false);
    expect(caps.dashboardReportMutationControls).toBe(false);
  });

  it('getDashboardUiShellCapabilities includes Phase 28 flags', () => {
    const caps = getDashboardUiShellCapabilities();
    expect(caps.dashboardReportModels).toBe(true);
    expect(caps.dashboardReportFixtures).toBe(true);
    expect(caps.deterministicReportModels).toBe(true);
    expect(caps.reportSafetyValidation).toBe(true);
    expect(caps.fixtureBackedReports).toBe(true);
    expect(caps.dashboardReportFileExport).toBe(false);
    expect(caps.dashboardReportPersistence).toBe(false);
    expect(caps.dashboardReportExternalNetwork).toBe(false);
    expect(caps.dashboardReportLiveData).toBe(false);
    expect(caps.dashboardReportMutationControls).toBe(false);
  });

  it('read-only-api capabilities include Phase 28 report flags', () => {
    const caps = getLocalReadOnlyApiCapabilities();
    expect(caps.dashboardReportModels).toBe(true);
    expect(caps.dashboardReportFixtures).toBe(true);
    expect(caps.deterministicReportModels).toBe(true);
    expect(caps.reportSafetyValidation).toBe(true);
    expect(caps.fixtureBackedReports).toBe(true);
    expect(caps.dashboardReportFileExport).toBe(false);
    expect(caps.dashboardReportPersistence).toBe(false);
    expect(caps.dashboardReportExternalNetwork).toBe(false);
    expect(caps.dashboardReportLiveData).toBe(false);
    expect(caps.dashboardReportMutationControls).toBe(false);
  });
});

describe('Phase 28 — no persistence/browser/network/export behavior in source', () => {
  const NON_VALIDATOR_REPORT_FILES = REPORT_FILES.filter(file => !file.endsWith('validation.ts'));

  it('all report source files exist and are non-empty', () => {
    REPORT_FILES.forEach(file => {
      const content = readFileSync(file, 'utf-8');
      expect(content.length).toBeGreaterThan(0);
    });
  });

  const forbiddenInRuntime: readonly string[] = [
    'localStorage',
    'sessionStorage',
    'IndexedDB',
    'document.cookie',
    'fetch(',
    'axios',
    'WebSocket',
    'XMLHttpRequest',
    'fs.writeFile',
    'writeFileSync',
    'createWriteStream',
    'Blob',
    'URL.createObjectURL',
    'Date.now',
    'new Date()',
    'Math.random',
    'setTimeout',
    'setInterval',
    'signTransaction',
    'sendTransaction',
    'wallet',
    'trade',
    'execute',
  ];

  forbiddenInRuntime.forEach(term => {
    it(`non-validator report runtime files do not contain ${term}`, () => {
      NON_VALIDATOR_REPORT_FILES.forEach(file => {
        const content = readFileSync(file, 'utf-8');
        expect(content).not.toContain(term);
      });
    });
  });

  it('report source files do not import http or https modules', () => {
    REPORT_FILES.forEach(file => {
      const content = readFileSync(file, 'utf-8');
      expect(content).not.toContain("from 'http'");
      expect(content).not.toContain('from \"http\"');
      expect(content).not.toContain("from 'https'");
      expect(content).not.toContain('from \"https\"');
    });
  });

  it('report source files do not use child_process/exec/eval/Function', () => {
    REPORT_FILES.forEach(file => {
      const content = readFileSync(file, 'utf-8');
      expect(content).not.toContain('child_process');
      expect(content).not.toContain('exec(');
      expect(content).not.toContain('eval(');
      expect(content).not.toContain('new Function');
    });
  });
});

describe('Phase 28 — fixture safety content checks', () => {
  const forbiddenPayloadPatterns: readonly RegExp[] = [
    /TypeError:\s/,/ReferenceError:\s/,/SyntaxError:\s/,/\bat Object\.</,/\/home\//,/\/Users\//,/C:\\Users\\/,/BEGIN PRIVATE KEY/,/seed phrase/i,/mnemonic/i,
  ];

  VALID_FIXTURE_NAMES.forEach(name => {
    it(`${name} report payload contains no stack traces/paths/secrets`, () => {
      const fixture = getDashboardReportFixture(name);
      expect(fixture).toBeDefined();
      if (fixture) {
        const payload = JSON.stringify(fixture.report);
        forbiddenPayloadPatterns.forEach(pattern => {
          expect(payload).not.toMatch(pattern);
        });
      }
    });

    it(`${name} report contains no live-data true claims`, () => {
      const fixture = getDashboardReportFixture(name);
      expect(fixture).toBeDefined();
      if (fixture) {
        expect(fixture.report.meta.liveData).toBe(false);
        expect(fixture.report.safetyBoundary.dashboardReportLiveData).toBe(false);
      }
    });

    it(`${name} report has no wallet/trading/execution/mutation controls enabled`, () => {
      const fixture = getDashboardReportFixture(name);
      expect(fixture).toBeDefined();
      if (fixture) {
        const safety = fixture.report.safetyBoundary;
        expect(safety.hasWalletControls).toBe(false);
        expect(safety.hasTradingControls).toBe(false);
        expect(safety.hasExecutionControls).toBe(false);
        expect(safety.hasMutationControls).toBe(false);
        expect(safety.dashboardReportMutationControls).toBe(false);
      }
    });

    it(`${name} report has export/persistence/network controls disabled`, () => {
      const fixture = getDashboardReportFixture(name);
      expect(fixture).toBeDefined();
      if (fixture) {
        const safety = fixture.report.safetyBoundary;
        expect(safety.dashboardReportFileExport).toBe(false);
        expect(safety.dashboardReportPersistence).toBe(false);
        expect(safety.dashboardReportExternalNetwork).toBe(false);
      }
    });
  });
});

describe('Phase 28 — deterministic and no-mutation behavior', () => {
  it('building default report twice yields same JSON', () => {
    const a = buildDefaultDashboardReportModel();
    const b = buildDefaultDashboardReportModel();
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  it('building snapshot inventory report twice yields same JSON', () => {
    const a = buildSnapshotInventoryReportModel();
    const b = buildSnapshotInventoryReportModel();
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  it('buildSnapshotBackedReportFromFixture does not mutate source snapshot fixture', () => {
    const fixture = getDashboardRenderSnapshotFixture('health-panel');
    expect(fixture).toBeDefined();
    if (fixture) {
      const before = JSON.stringify(fixture.snapshot);
      buildSnapshotBackedReportFromFixture('health-panel', 'health-report-section', 'section', 'x', ['y']);
      expect(JSON.stringify(fixture.snapshot)).toBe(before);
    }
  });

  it('normalizeDashboardReportModel does not mutate input report', () => {
    const report = FULL_DASHBOARD_REPORT_FIXTURE.report;
    const before = JSON.stringify(report);
    normalizeDashboardReportModel(report);
    expect(JSON.stringify(report)).toBe(before);
  });

  it('validateDashboardReportModel does not mutate input report', () => {
    const report = FULL_DASHBOARD_REPORT_FIXTURE.report;
    const before = JSON.stringify(report);
    validateDashboardReportModel(report);
    expect(JSON.stringify(report)).toBe(before);
  });

  it('validateDashboardReportSafety does not mutate input report', () => {
    const report = FULL_DASHBOARD_REPORT_FIXTURE.report;
    const before = JSON.stringify(report);
    validateDashboardReportSafety(report);
    expect(JSON.stringify(report)).toBe(before);
  });
});

describe('Phase 28 — source structure and docs', () => {
  it('reports/index.ts exports key symbols', () => {
    const content = readFileSync(resolve(REPORT_SRC, 'index.ts'), 'utf-8');
    expect(content).toContain('buildDashboardReportModel');
    expect(content).toContain('validateDashboardReportModel');
    expect(content).toContain('PHASE_28_REPORT_FIXTURES');
    expect(content).toContain('getDashboardReportCapabilities');
  });

  it('reports/types.ts defines report name constants', () => {
    const content = readFileSync(resolve(REPORT_SRC, 'types.ts'), 'utf-8');
    expect(content).toContain('DASHBOARD_REPORT_NAMES');
    expect(content).toContain('DashboardReportModel');
  });

  it('reports/fixtures.ts defines all 20 fixtures map', () => {
    const content = readFileSync(resolve(REPORT_SRC, 'fixtures.ts'), 'utf-8');
    expect(content).toContain('PHASE_28_REPORT_FIXTURES');
    expect(content).toContain('REPORT_VALIDATION_FAILURE_EXAMPLE_FIXTURE');
    expect(content).toContain('EXPORT_DISABLED_SAFETY_REPORT_FIXTURE');
  });

  it('docs/LOCAL_DASHBOARD_REPORT_EXPORT_MODELS.md exists', () => {
    const content = readFileSync(resolve(REPO_ROOT, 'docs/LOCAL_DASHBOARD_REPORT_EXPORT_MODELS.md'), 'utf-8');
    expect(content.length).toBeGreaterThan(200);
  });

  it('phase log mentions Phase 28', () => {
    const content = readFileSync(resolve(REPO_ROOT, 'docs/PHASE_LOG.md'), 'utf-8');
    expect(content).toContain('Phase 28');
  });
});

describe('Phase 28 — additional generated tests for fixture/state/snapshot regressions', () => {
  DASHBOARD_REPORT_NAMES.forEach(name => {
    it(`${name} fixture map consistency`, () => {
      const mapFixture = PHASE_28_REPORT_FIXTURES.get(name);
      const directFixture = getDashboardReportFixture(name);
      expect(mapFixture).toBeDefined();
      expect(directFixture).toBeDefined();
      expect(mapFixture?.name).toBe(name);
      expect(directFixture?.name).toBe(name);
    });

    it(`${name} fixture serializes without throwing`, () => {
      const fixture = getDashboardReportFixture(name);
      expect(fixture).toBeDefined();
      if (fixture) {
        expect(() => JSON.stringify(fixture.report)).not.toThrow();
      }
    });

    it(`${name} fixture has non-empty safe notes`, () => {
      const fixture = getDashboardReportFixture(name);
      expect(fixture).toBeDefined();
      if (fixture) {
        expect(fixture.report.safeNotes.length).toBeGreaterThan(0);
      }
    });

    it(`${name} fixture has non-empty title`, () => {
      const fixture = getDashboardReportFixture(name);
      expect(fixture).toBeDefined();
      if (fixture) {
        expect(fixture.report.title.length).toBeGreaterThan(0);
      }
    });

    it(`${name} fixture has at least one section`, () => {
      const fixture = getDashboardReportFixture(name);
      expect(fixture).toBeDefined();
      if (fixture) {
        expect(fixture.report.sections.length).toBeGreaterThan(0);
      }
    });

    it(`${name} fixture has summary counts >= 0`, () => {
      const fixture = getDashboardReportFixture(name);
      expect(fixture).toBeDefined();
      if (fixture) {
        const summary = fixture.report.summary;
        expect(summary.sectionCount).toBeGreaterThanOrEqual(0);
        expect(summary.snapshotCount).toBeGreaterThanOrEqual(0);
        expect(summary.visiblePanelCount).toBeGreaterThanOrEqual(0);
        expect(summary.hiddenPanelCount).toBeGreaterThanOrEqual(0);
      }
    });

    it(`${name} fixture has sourceViewModelMeta safety booleans`, () => {
      const fixture = getDashboardReportFixture(name);
      expect(fixture).toBeDefined();
      if (fixture) {
        expect(fixture.report.meta.sourceViewModelMeta.fixtureOnly).toBe(true);
        expect(fixture.report.meta.sourceViewModelMeta.liveData).toBe(false);
        expect(fixture.report.meta.sourceViewModelMeta.readOnly).toBe(true);
        expect(fixture.report.meta.sourceViewModelMeta.localOnly).toBe(true);
      }
    });

    it(`${name} fixture has sorted safe notes`, () => {
      const fixture = getDashboardReportFixture(name);
      expect(fixture).toBeDefined();
      if (fixture) {
        expect(fixture.report.safeNotes).toEqual([...fixture.report.safeNotes].sort());
      }
    });

    it(`${name} fixture has sorted section note arrays`, () => {
      const fixture = getDashboardReportFixture(name);
      expect(fixture).toBeDefined();
      if (fixture) {
        fixture.report.sections.forEach(section => {
          expect(section.notes).toEqual([...section.notes].sort());
        });
      }
    });

    it(`${name} fixture section source snapshots are valid Phase 27 names or expected invalid example`, () => {
      const fixture = getDashboardReportFixture(name);
      expect(fixture).toBeDefined();
      if (fixture) {
        fixture.report.sections.forEach(section => {
          if (name === 'report-validation-failure-example') {
            expect(typeof section.sourceSnapshotName).toBe('string');
          } else {
            expect(listDashboardRenderSnapshotFixtures()).toContain(section.sourceSnapshotName);
          }
        });
      }
    });

    it(`${name} fixture summary reportName matches fixture name`, () => {
      const fixture = getDashboardReportFixture(name);
      expect(fixture).toBeDefined();
      if (fixture) {
        expect(fixture.report.summary.reportName).toBe(name);
      }
    });

    it(`${name} fixture report kind is supported`, () => {
      const fixture = getDashboardReportFixture(name);
      expect(fixture).toBeDefined();
      if (fixture) {
        expect(DASHBOARD_REPORT_KINDS).toContain(fixture.report.kind);
      }
    });
  });
});

describe('Phase 28 — interaction/filter state report specifics', () => {
  it('interaction state fixture references interaction section kind', () => {
    const report = INTERACTION_STATE_REPORT_SECTION_FIXTURE.report;
    expect(report.sections.some(section => section.kind === 'interaction')).toBe(true);
  });

  it('filtered evidence fixture references filtered-evidence section kind', () => {
    const report = FILTERED_EVIDENCE_REPORT_SECTION_FIXTURE.report;
    expect(report.sections.some(section => section.kind === 'filtered-evidence')).toBe(true);
  });

  it('filtered safety fixture references filtered-safety section kind', () => {
    const report = FILTERED_SAFETY_REPORT_SECTION_FIXTURE.report;
    expect(report.sections.some(section => section.kind === 'filtered-safety')).toBe(true);
  });

  it('updating Phase 26 evidence filters still yields deterministic report build', () => {
    const stateA = updateDashboardEvidenceFilters(createDefaultDashboardInteractionState(), { severity: 'warning' }).state;
    const stateB = updateDashboardEvidenceFilters(createDefaultDashboardInteractionState(), { severity: 'warning' }).state;
    expect(JSON.stringify(stateA)).toBe(JSON.stringify(stateB));
  });

  it('updating Phase 26 safety filters still yields deterministic report build', () => {
    const stateA = updateDashboardSafetyFilters(createDefaultDashboardInteractionState(), { status: 'locked' }).state;
    const stateB = updateDashboardSafetyFilters(createDefaultDashboardInteractionState(), { status: 'locked' }).state;
    expect(JSON.stringify(stateA)).toBe(JSON.stringify(stateB));
  });
});
