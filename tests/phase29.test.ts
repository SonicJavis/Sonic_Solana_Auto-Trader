/**
 * tests/phase29.test.ts
 *
 * Phase 29 — Local Dashboard Report Serialization Preview v1
 */

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import {
  DASHBOARD_REPORT_SERIALIZATION_PREVIEW_FORMATS,
  DASHBOARD_REPORT_SERIALIZATION_PREVIEW_KINDS,
  DASHBOARD_REPORT_SERIALIZATION_PREVIEW_NAMES,
  buildDashboardReportSerializationPreview,
  buildJsonReportPreview,
  buildMarkdownReportPreview,
  buildTextReportPreview,
  buildMetadataReportPreview,
  sortKeysDeep,
  stablePrettyJsonStringify,
  stableDeterministicChecksum,
  normalizeDashboardReportSerializationPreview,
  serializeDashboardReportSerializationPreview,
  isDashboardReportSerializationPreviewSerializable,
  areDashboardReportSerializationPreviewsEqual,
  validateDashboardReportSerializationPreview,
  validateDashboardReportSerializationPreviewSafety,
  FULL_DASHBOARD_JSON_PREVIEW_FIXTURE,
  FULL_DASHBOARD_MARKDOWN_PREVIEW_FIXTURE,
  FULL_DASHBOARD_TEXT_PREVIEW_FIXTURE,
  METADATA_ONLY_PREVIEW_FIXTURE,
  HEALTH_SECTION_PREVIEW_FIXTURE,
  CAPABILITIES_SECTION_PREVIEW_FIXTURE,
  OVERVIEW_SECTION_PREVIEW_FIXTURE,
  EVIDENCE_SECTION_PREVIEW_FIXTURE,
  SAFETY_SECTION_PREVIEW_FIXTURE,
  SNAPSHOT_INVENTORY_PREVIEW_FIXTURE,
  SAFETY_BOUNDARY_PREVIEW_FIXTURE,
  EXPORT_DISABLED_PREVIEW_FIXTURE,
  MALFORMED_INPUT_SAFE_PREVIEW_FIXTURE,
  VALIDATION_FAILURE_PREVIEW_FIXTURE,
  NO_RESULTS_PREVIEW_FIXTURE,
  PHASE_29_SERIALIZATION_PREVIEW_FIXTURES,
  listDashboardReportSerializationPreviewFixtures,
  getDashboardReportSerializationPreviewFixture,
  FULL_DASHBOARD_REPORT_FIXTURE,
  SNAPSHOT_INVENTORY_REPORT_FIXTURE,
  NO_RESULTS_REPORT_FIXTURE,
  MALFORMED_INPUT_SAFE_REPORT_FIXTURE,
  REPORT_VALIDATION_FAILURE_EXAMPLE_FIXTURE,
  listDashboardRenderSnapshotFixtures,
  getDashboardUiShellCapabilities,
} from '@sonic/dashboard';
import { getLocalReadOnlyApiCapabilities } from '@sonic/read-only-api';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const SERIALIZATION_SRC = resolve(REPO_ROOT, 'apps/dashboard/src/report-serialization');

const SERIALIZATION_FILES = ['types.ts', 'builders.ts', 'normalization.ts', 'validation.ts', 'fixtures.ts', 'index.ts'].map(file =>
  resolve(SERIALIZATION_SRC, file),
);

const PREVIEW_FIXTURE_EXPORTS = [
  FULL_DASHBOARD_JSON_PREVIEW_FIXTURE,
  FULL_DASHBOARD_MARKDOWN_PREVIEW_FIXTURE,
  FULL_DASHBOARD_TEXT_PREVIEW_FIXTURE,
  METADATA_ONLY_PREVIEW_FIXTURE,
  HEALTH_SECTION_PREVIEW_FIXTURE,
  CAPABILITIES_SECTION_PREVIEW_FIXTURE,
  OVERVIEW_SECTION_PREVIEW_FIXTURE,
  EVIDENCE_SECTION_PREVIEW_FIXTURE,
  SAFETY_SECTION_PREVIEW_FIXTURE,
  SNAPSHOT_INVENTORY_PREVIEW_FIXTURE,
  SAFETY_BOUNDARY_PREVIEW_FIXTURE,
  EXPORT_DISABLED_PREVIEW_FIXTURE,
  MALFORMED_INPUT_SAFE_PREVIEW_FIXTURE,
  VALIDATION_FAILURE_PREVIEW_FIXTURE,
  NO_RESULTS_PREVIEW_FIXTURE,
] as const;

const VALID_FIXTURE_NAMES = DASHBOARD_REPORT_SERIALIZATION_PREVIEW_NAMES.filter(name => name !== 'validation-failure-preview');

describe('Phase 29 — module exports', () => {
  const exportedFunctions: Array<[string, unknown]> = [
    ['buildDashboardReportSerializationPreview', buildDashboardReportSerializationPreview],
    ['buildJsonReportPreview', buildJsonReportPreview],
    ['buildMarkdownReportPreview', buildMarkdownReportPreview],
    ['buildTextReportPreview', buildTextReportPreview],
    ['buildMetadataReportPreview', buildMetadataReportPreview],
    ['sortKeysDeep', sortKeysDeep],
    ['stablePrettyJsonStringify', stablePrettyJsonStringify],
    ['stableDeterministicChecksum', stableDeterministicChecksum],
    ['normalizeDashboardReportSerializationPreview', normalizeDashboardReportSerializationPreview],
    ['serializeDashboardReportSerializationPreview', serializeDashboardReportSerializationPreview],
    ['isDashboardReportSerializationPreviewSerializable', isDashboardReportSerializationPreviewSerializable],
    ['areDashboardReportSerializationPreviewsEqual', areDashboardReportSerializationPreviewsEqual],
    ['validateDashboardReportSerializationPreview', validateDashboardReportSerializationPreview],
    ['validateDashboardReportSerializationPreviewSafety', validateDashboardReportSerializationPreviewSafety],
    ['listDashboardReportSerializationPreviewFixtures', listDashboardReportSerializationPreviewFixtures],
    ['getDashboardReportSerializationPreviewFixture', getDashboardReportSerializationPreviewFixture],
  ];

  exportedFunctions.forEach(([name, value]) => {
    it(`${name} is exported`, () => {
      expect(typeof value).toBe('function');
    });
  });

  it('preview format list has 4 entries', () => {
    expect(DASHBOARD_REPORT_SERIALIZATION_PREVIEW_FORMATS.length).toBe(4);
  });

  it('preview names list has 15 entries', () => {
    expect(DASHBOARD_REPORT_SERIALIZATION_PREVIEW_NAMES.length).toBe(15);
  });

  it('preview kinds list has expected entries', () => {
    expect(DASHBOARD_REPORT_SERIALIZATION_PREVIEW_KINDS).toContain('full');
    expect(DASHBOARD_REPORT_SERIALIZATION_PREVIEW_KINDS).toContain('section');
    expect(DASHBOARD_REPORT_SERIALIZATION_PREVIEW_KINDS).toContain('metadata');
    expect(DASHBOARD_REPORT_SERIALIZATION_PREVIEW_KINDS).toContain('validation');
  });
});

describe('Phase 29 — fixture list and lookup helpers', () => {
  it('listDashboardReportSerializationPreviewFixtures returns 15 names', () => {
    expect(listDashboardReportSerializationPreviewFixtures().length).toBe(15);
  });

  it('listDashboardReportSerializationPreviewFixtures returns sorted names', () => {
    const names = listDashboardReportSerializationPreviewFixtures();
    expect(names).toEqual([...names].sort());
  });

  it('getDashboardReportSerializationPreviewFixture returns each fixture', () => {
    DASHBOARD_REPORT_SERIALIZATION_PREVIEW_NAMES.forEach(name => {
      const fixture = getDashboardReportSerializationPreviewFixture(name);
      expect(fixture).toBeDefined();
      expect(fixture?.name).toBe(name);
    });
  });

  it('getDashboardReportSerializationPreviewFixture returns undefined for unknown fixture names', () => {
    // @ts-expect-error intentional invalid input
    expect(getDashboardReportSerializationPreviewFixture('unknown-preview')).toBeUndefined();
  });

  it('PHASE_29_SERIALIZATION_PREVIEW_FIXTURES has 15 entries', () => {
    expect(PHASE_29_SERIALIZATION_PREVIEW_FIXTURES instanceof Map).toBe(true);
    expect(PHASE_29_SERIALIZATION_PREVIEW_FIXTURES.size).toBe(15);
  });
});

describe('Phase 29 — required fixture names exist', () => {
  DASHBOARD_REPORT_SERIALIZATION_PREVIEW_NAMES.forEach(name => {
    it(`${name} exists`, () => {
      expect(listDashboardReportSerializationPreviewFixtures()).toContain(name);
      expect(getDashboardReportSerializationPreviewFixture(name)?.name).toBe(name);
    });
  });
});

describe('Phase 29 — preview fixture shape and deterministic metadata', () => {
  PREVIEW_FIXTURE_EXPORTS.forEach(fixture => {
    it(`${fixture.name} has fixture name/description/preview`, () => {
      expect(typeof fixture.name).toBe('string');
      expect(typeof fixture.description).toBe('string');
      expect(typeof fixture.preview).toBe('object');
      expect(fixture.preview.name).toBe(fixture.name);
    });

    it(`${fixture.name} has deterministic phase metadata`, () => {
      expect(fixture.preview.meta.phase).toBe(29);
      expect(fixture.preview.meta.sourceReportPhase).toBe(28);
      expect(fixture.preview.meta.fixtureOnly).toBe(true);
      expect(fixture.preview.meta.liveData).toBe(false);
      expect(fixture.preview.meta.externalNetwork).toBe(false);
      expect(fixture.preview.meta.deterministic).toBe(true);
    });

    it(`${fixture.name} has deterministic generatedAt from source report`, () => {
      expect(fixture.preview.meta.generatedAt).toBe(fixture.preview.sourceReportMeta.generatedAt);
      expect(typeof fixture.preview.meta.generatedAt).toBe('string');
      expect(fixture.preview.meta.generatedAt.length).toBeGreaterThan(0);
    });

    it(`${fixture.name} has safety boundary with all unsafe flags disabled`, () => {
      const safety = fixture.preview.safetyBoundary;
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
      expect(safety.dashboardReportActualFileExport).toBe(false);
      expect(safety.dashboardReportDownloadSupport).toBe(false);
      expect(safety.dashboardReportPersistence).toBe(false);
      expect(safety.dashboardReportExternalNetwork).toBe(false);
      expect(safety.dashboardReportLiveData).toBe(false);
      expect(safety.dashboardReportMutationControls).toBe(false);
    });

    it(`${fixture.name} has deterministic sorted notes`, () => {
      expect(fixture.preview.safeNotes).toEqual([...fixture.preview.safeNotes].sort());
      expect(fixture.preview.meta.notes).toEqual([...fixture.preview.meta.notes].sort());
    });

    it(`${fixture.name} has deterministic snapshot name ordering`, () => {
      expect(fixture.preview.sourceReportMeta.sourceSnapshotNames).toEqual([...fixture.preview.sourceReportMeta.sourceSnapshotNames].sort());
    });

    it(`${fixture.name} is serializable`, () => {
      expect(isDashboardReportSerializationPreviewSerializable(fixture.preview)).toBe(true);
      expect(() => JSON.parse(JSON.stringify(fixture.preview))).not.toThrow();
    });

    it(`${fixture.name} has deterministic checksum`, () => {
      const normalized = normalizeDashboardReportSerializationPreview(fixture.preview);
      const checksum = normalized.checksum;
      expect(checksum.startsWith('fnv1a32:')).toBe(true);
    });
  });
});

describe('Phase 29 — format-specific fixture expectations', () => {
  it('full-dashboard-json-preview has json format content', () => {
    expect(FULL_DASHBOARD_JSON_PREVIEW_FIXTURE.preview.format).toBe('json');
    expect(FULL_DASHBOARD_JSON_PREVIEW_FIXTURE.preview.content?.startsWith('{')).toBe(true);
    expect(FULL_DASHBOARD_JSON_PREVIEW_FIXTURE.preview.metadataPayload).toBeNull();
  });

  it('full-dashboard-markdown-preview has markdown headings', () => {
    expect(FULL_DASHBOARD_MARKDOWN_PREVIEW_FIXTURE.preview.format).toBe('markdown');
    expect(FULL_DASHBOARD_MARKDOWN_PREVIEW_FIXTURE.preview.content?.includes('# ')).toBe(true);
    expect(FULL_DASHBOARD_MARKDOWN_PREVIEW_FIXTURE.preview.metadataPayload).toBeNull();
  });

  it('full-dashboard-text-preview has text summary lines', () => {
    expect(FULL_DASHBOARD_TEXT_PREVIEW_FIXTURE.preview.format).toBe('text');
    expect(FULL_DASHBOARD_TEXT_PREVIEW_FIXTURE.preview.content?.includes('Serialization Preview')).toBe(true);
    expect(FULL_DASHBOARD_TEXT_PREVIEW_FIXTURE.preview.metadataPayload).toBeNull();
  });

  it('metadata-only-preview has metadata payload and null content', () => {
    expect(METADATA_ONLY_PREVIEW_FIXTURE.preview.format).toBe('metadata');
    expect(METADATA_ONLY_PREVIEW_FIXTURE.preview.content).toBeNull();
    expect(METADATA_ONLY_PREVIEW_FIXTURE.preview.metadataPayload).not.toBeNull();
  });
});

describe('Phase 29 — builder helpers', () => {
  it('buildJsonReportPreview builds json preview', () => {
    const preview = buildJsonReportPreview({
      name: 'full-dashboard-json-preview',
      format: 'json',
      report: FULL_DASHBOARD_REPORT_FIXTURE.report,
    });
    expect(preview.format).toBe('json');
    expect(preview.content).not.toBeNull();
  });

  it('buildMarkdownReportPreview builds markdown preview', () => {
    const preview = buildMarkdownReportPreview({
      name: 'full-dashboard-markdown-preview',
      format: 'markdown',
      report: FULL_DASHBOARD_REPORT_FIXTURE.report,
    });
    expect(preview.format).toBe('markdown');
    expect(preview.content?.includes('## Sections')).toBe(true);
  });

  it('buildTextReportPreview builds text preview', () => {
    const preview = buildTextReportPreview({
      name: 'full-dashboard-text-preview',
      format: 'text',
      report: FULL_DASHBOARD_REPORT_FIXTURE.report,
    });
    expect(preview.format).toBe('text');
    expect(preview.content?.includes('Report=')).toBe(true);
  });

  it('buildMetadataReportPreview builds metadata preview', () => {
    const preview = buildMetadataReportPreview({
      name: 'metadata-only-preview',
      format: 'metadata',
      report: FULL_DASHBOARD_REPORT_FIXTURE.report,
    });
    expect(preview.format).toBe('metadata');
    expect(preview.content).toBeNull();
    expect(preview.metadataPayload).not.toBeNull();
  });

  it('buildDashboardReportSerializationPreview succeeds for each format', () => {
    DASHBOARD_REPORT_SERIALIZATION_PREVIEW_FORMATS.forEach(format => {
      const result = buildDashboardReportSerializationPreview({
        name:
          format === 'json'
            ? 'full-dashboard-json-preview'
            : format === 'markdown'
              ? 'full-dashboard-markdown-preview'
              : format === 'text'
                ? 'full-dashboard-text-preview'
                : 'metadata-only-preview',
        format,
        report: FULL_DASHBOARD_REPORT_FIXTURE.report,
      });
      expect(result.success).toBe(true);
      expect(result.preview?.format).toBe(format);
    });
  });

  it('buildDashboardReportSerializationPreview returns deterministic safe failure for invalid name', () => {
    const result = buildDashboardReportSerializationPreview({
      // @ts-expect-error intentional invalid input
      name: 'invalid-preview-name',
      format: 'json',
      report: FULL_DASHBOARD_REPORT_FIXTURE.report,
    });
    expect(result.success).toBe(false);
    expect(result.preview).toBeNull();
    expect(result.issues.length).toBeGreaterThan(0);
  });

  it('buildDashboardReportSerializationPreview returns deterministic safe failure for invalid format', () => {
    const result = buildDashboardReportSerializationPreview({
      name: 'full-dashboard-json-preview',
      // @ts-expect-error intentional invalid input
      format: 'pdf',
      report: FULL_DASHBOARD_REPORT_FIXTURE.report,
    });
    expect(result.success).toBe(false);
    expect(result.preview).toBeNull();
  });

  it('buildDashboardReportSerializationPreview does not throw for malformed input', () => {
    expect(() =>
      buildDashboardReportSerializationPreview({
        // @ts-expect-error intentional invalid input
        name: null,
        // @ts-expect-error intentional invalid input
        format: null,
        // @ts-expect-error intentional invalid input
        report: null,
      }),
    ).not.toThrow();
  });
});

describe('Phase 29 — normalization, serialization and equality helpers', () => {
  const preview = FULL_DASHBOARD_JSON_PREVIEW_FIXTURE.preview;

  it('normalizeDashboardReportSerializationPreview preserves identity fields', () => {
    const normalized = normalizeDashboardReportSerializationPreview(preview);
    expect(normalized.name).toBe(preview.name);
    expect(normalized.format).toBe(preview.format);
    expect(normalized.sourceReportName).toBe(preview.sourceReportName);
  });

  it('normalizeDashboardReportSerializationPreview is idempotent', () => {
    const once = normalizeDashboardReportSerializationPreview(preview);
    const twice = normalizeDashboardReportSerializationPreview(once);
    expect(JSON.stringify(once)).toBe(JSON.stringify(twice));
  });

  it('normalizeDashboardReportSerializationPreview does not mutate input', () => {
    const before = JSON.stringify(preview);
    normalizeDashboardReportSerializationPreview(preview);
    expect(JSON.stringify(preview)).toBe(before);
  });

  it('serializeDashboardReportSerializationPreview returns plain object', () => {
    const serialized = serializeDashboardReportSerializationPreview(preview);
    expect(typeof serialized).toBe('object');
    expect(serialized).not.toBeNull();
  });

  it('areDashboardReportSerializationPreviewsEqual returns true for equivalent previews', () => {
    const a = normalizeDashboardReportSerializationPreview(preview);
    const b = normalizeDashboardReportSerializationPreview(preview);
    expect(areDashboardReportSerializationPreviewsEqual(a, b)).toBe(true);
  });

  it('areDashboardReportSerializationPreviewsEqual returns false for different previews', () => {
    expect(areDashboardReportSerializationPreviewsEqual(FULL_DASHBOARD_JSON_PREVIEW_FIXTURE.preview, NO_RESULTS_PREVIEW_FIXTURE.preview)).toBe(
      false,
    );
  });

  it('stablePrettyJsonStringify produces deterministic key ordering', () => {
    const data = { z: 1, a: { d: 1, c: 2 }, b: 3 };
    const json = stablePrettyJsonStringify(data);
    expect(json.indexOf('"a"')).toBeLessThan(json.indexOf('"b"'));
    expect(json.indexOf('"b"')).toBeLessThan(json.indexOf('"z"'));
  });

  it('sortKeysDeep sorts object keys recursively', () => {
    const sorted = sortKeysDeep({ c: 1, a: { z: 1, b: 2 } }) as Record<string, unknown>;
    expect(Object.keys(sorted)).toEqual(['a', 'c']);
    expect(Object.keys(sorted['a'] as Record<string, unknown>)).toEqual(['b', 'z']);
  });

  it('stableDeterministicChecksum returns same output for same content', () => {
    const a = stableDeterministicChecksum('abc');
    const b = stableDeterministicChecksum('abc');
    expect(a).toBe(b);
  });
});

describe('Phase 29 — validation and safety validation', () => {
  VALID_FIXTURE_NAMES.forEach(name => {
    it(`${name} passes model validation`, () => {
      const fixture = getDashboardReportSerializationPreviewFixture(name);
      expect(fixture).toBeDefined();
      if (fixture) {
        const result = validateDashboardReportSerializationPreview(fixture.preview);
        expect(result.valid).toBe(true);
        expect(result.issues.length).toBe(0);
      }
    });

    it(`${name} passes safety validation`, () => {
      const fixture = getDashboardReportSerializationPreviewFixture(name);
      expect(fixture).toBeDefined();
      if (fixture) {
        const result = validateDashboardReportSerializationPreviewSafety(fixture.preview);
        expect(result.safe).toBe(true);
      }
    });
  });

  it('validation-failure-preview fails validation because source report name is intentionally incompatible', () => {
    const result = validateDashboardReportSerializationPreview(VALIDATION_FAILURE_PREVIEW_FIXTURE.preview);
    expect(result.valid).toBe(false);
    expect(result.issues.length).toBeGreaterThan(0);
  });

  it('validateDashboardReportSerializationPreview fails for null', () => {
    const result = validateDashboardReportSerializationPreview(null);
    expect(result.valid).toBe(false);
  });

  it('validateDashboardReportSerializationPreview fails for undefined', () => {
    const result = validateDashboardReportSerializationPreview(undefined);
    expect(result.valid).toBe(false);
  });

  it('validateDashboardReportSerializationPreview fails for empty object', () => {
    const result = validateDashboardReportSerializationPreview({});
    expect(result.valid).toBe(false);
  });

  it('validateDashboardReportSerializationPreviewSafety fails for null', () => {
    const result = validateDashboardReportSerializationPreviewSafety(null);
    expect(result.safe).toBe(false);
  });

  it('validateDashboardReportSerializationPreviewSafety detects stack trace strings', () => {
    const broken = { ...FULL_DASHBOARD_TEXT_PREVIEW_FIXTURE.preview, title: 'TypeError: stack trace leak' };
    const result = validateDashboardReportSerializationPreviewSafety(broken);
    expect(result.safe).toBe(false);
    expect(result.violations.length).toBeGreaterThan(0);
  });

  it('validateDashboardReportSerializationPreviewSafety detects local path strings', () => {
    const broken = { ...FULL_DASHBOARD_TEXT_PREVIEW_FIXTURE.preview, title: '/home/runner/unsafe/path' };
    const result = validateDashboardReportSerializationPreviewSafety(broken);
    expect(result.safe).toBe(false);
  });
});

describe('Phase 29 — deterministic behavior and no input mutation', () => {
  it('full dashboard json preview is deterministic across repeated builds', () => {
    const a = buildJsonReportPreview({
      name: 'full-dashboard-json-preview',
      format: 'json',
      report: FULL_DASHBOARD_REPORT_FIXTURE.report,
    });
    const b = buildJsonReportPreview({
      name: 'full-dashboard-json-preview',
      format: 'json',
      report: FULL_DASHBOARD_REPORT_FIXTURE.report,
    });
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  it('generatedAt is deterministic from report metadata for no-results preview', () => {
    const preview = buildTextReportPreview({
      name: 'no-results-preview',
      format: 'text',
      report: NO_RESULTS_REPORT_FIXTURE.report,
    });
    expect(preview.meta.generatedAt).toBe(NO_RESULTS_REPORT_FIXTURE.report.meta.generatedAt);
  });

  it('buildJsonReportPreview does not mutate source report input', () => {
    const report = FULL_DASHBOARD_REPORT_FIXTURE.report;
    const before = JSON.stringify(report);
    buildJsonReportPreview({
      name: 'full-dashboard-json-preview',
      format: 'json',
      report,
    });
    expect(JSON.stringify(report)).toBe(before);
  });

  it('buildTextReportPreview preserves source report metadata fields', () => {
    const preview = buildTextReportPreview({
      name: 'snapshot-inventory-preview',
      format: 'text',
      report: SNAPSHOT_INVENTORY_REPORT_FIXTURE.report,
    });
    expect(preview.sourceReportName).toBe(SNAPSHOT_INVENTORY_REPORT_FIXTURE.report.name);
    expect(preview.sourceReportKind).toBe(SNAPSHOT_INVENTORY_REPORT_FIXTURE.report.kind);
  });
});

describe('Phase 29 — compatibility checks with phase 28 report models and phase 27 snapshots', () => {
  it('snapshot inventory preview references phase 27 snapshot inventory report source names', () => {
    const preview = SNAPSHOT_INVENTORY_PREVIEW_FIXTURE.preview;
    const snapshotNames = listDashboardRenderSnapshotFixtures();
    snapshotNames.forEach(name => {
      expect(preview.sourceReportMeta.sourceSnapshotNames).toContain(name);
    });
  });

  it('malformed input safe preview uses malformed report fixture metadata', () => {
    const preview = MALFORMED_INPUT_SAFE_PREVIEW_FIXTURE.preview;
    expect(preview.sourceReportName).toBe(MALFORMED_INPUT_SAFE_REPORT_FIXTURE.report.name);
  });

  it('validation failure preview is built from validation-failure report fixture', () => {
    const preview = VALIDATION_FAILURE_PREVIEW_FIXTURE.preview;
    expect(preview.sourceReportName).toBe(REPORT_VALIDATION_FAILURE_EXAMPLE_FIXTURE.report.name);
  });

  it('no-results preview source report indicates filtered/no-results state', () => {
    const preview = NO_RESULTS_PREVIEW_FIXTURE.preview;
    expect(preview.sourceReportName).toBe('no-results-report');
    expect(preview.sourceReportKind).toBe(NO_RESULTS_REPORT_FIXTURE.report.kind);
  });
});

describe('Phase 29 — capabilities include serialization preview flags', () => {
  it('dashboard UI shell capabilities include Phase 29 flags', () => {
    const caps = getDashboardUiShellCapabilities();
    expect(caps.dashboardReportSerializationPreview).toBe(true);
    expect(caps.dashboardReportJsonPreview).toBe(true);
    expect(caps.dashboardReportMarkdownPreview).toBe(true);
    expect(caps.dashboardReportTextPreview).toBe(true);
    expect(caps.dashboardReportMetadataPreview).toBe(true);
    expect(caps.dashboardReportActualFileExport).toBe(false);
    expect(caps.dashboardReportDownloadSupport).toBe(false);
    expect(caps.dashboardReportPersistence).toBe(false);
    expect(caps.dashboardReportExternalNetwork).toBe(false);
    expect(caps.dashboardReportLiveData).toBe(false);
    expect(caps.dashboardReportMutationControls).toBe(false);
  });

  it('read-only-api capabilities include Phase 29 flags', () => {
    const caps = getLocalReadOnlyApiCapabilities();
    expect(caps.dashboardReportSerializationPreview).toBe(true);
    expect(caps.dashboardReportJsonPreview).toBe(true);
    expect(caps.dashboardReportMarkdownPreview).toBe(true);
    expect(caps.dashboardReportTextPreview).toBe(true);
    expect(caps.dashboardReportMetadataPreview).toBe(true);
    expect(caps.dashboardReportActualFileExport).toBe(false);
    expect(caps.dashboardReportDownloadSupport).toBe(false);
    expect(caps.dashboardReportPersistence).toBe(false);
    expect(caps.dashboardReportExternalNetwork).toBe(false);
    expect(caps.dashboardReportLiveData).toBe(false);
    expect(caps.dashboardReportMutationControls).toBe(false);
  });
});

describe('Phase 29 — runtime source safety checks', () => {
  const NON_VALIDATION_FILES = SERIALIZATION_FILES.filter(file => !file.endsWith('validation.ts'));

  it('all phase29 serialization files exist and are non-empty', () => {
    SERIALIZATION_FILES.forEach(file => {
      expect(readFileSync(file, 'utf-8').length).toBeGreaterThan(0);
    });
  });

  const forbiddenRuntimeTerms: readonly string[] = [
    'private key',
    'seed phrase',
    'mnemonic',
    'keypair',
    'signTransaction',
    'sendTransaction',
    'swap',
    'route',
    'order',
    'fill',
    'position',
    'balance',
    'PnL',
    'Pump.fun',
    'Jito',
    'Solana RPC',
    'fetch(',
    'axios',
    'websocket',
    'child_process',
    'exec(',
    'eval(',
    'new Function',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'connect wallet',
    'trade',
    'execute',
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
    'Blob',
    'URL.createObjectURL',
    'download',
  ];

  forbiddenRuntimeTerms.forEach(term => {
    it(`non-validation phase29 runtime files do not contain ${term}`, () => {
      NON_VALIDATION_FILES.forEach(file => {
        const content = readFileSync(file, 'utf-8');
        expect(content).not.toContain(term);
      });
    });
  });

  it('phase29 files do not import http/https modules', () => {
    SERIALIZATION_FILES.forEach(file => {
      const content = readFileSync(file, 'utf-8');
      expect(content).not.toContain("from 'http'");
      expect(content).not.toContain('from "http"');
      expect(content).not.toContain("from 'https'");
      expect(content).not.toContain('from "https"');
    });
  });
});

describe('Phase 29 — preview payload safety content checks', () => {
  const forbiddenPayloadPatterns: readonly RegExp[] = [
    /TypeError:\s/,
    /ReferenceError:\s/,
    /SyntaxError:\s/,
    /\bat Object\.</,
    /\/home\//,
    /\/Users\//,
    /C:\\Users\\/,
    /BEGIN PRIVATE KEY/,
    /seed phrase/i,
    /mnemonic/i,
  ];

  VALID_FIXTURE_NAMES.forEach(name => {
    it(`${name} contains no stack traces/paths/secrets`, () => {
      const fixture = getDashboardReportSerializationPreviewFixture(name);
      expect(fixture).toBeDefined();
      if (fixture) {
        const payload = JSON.stringify(fixture.preview);
        forbiddenPayloadPatterns.forEach(pattern => {
          expect(payload).not.toMatch(pattern);
        });
      }
    });

    it(`${name} has no live-data claims`, () => {
      const fixture = getDashboardReportSerializationPreviewFixture(name);
      expect(fixture).toBeDefined();
      if (fixture) {
        expect(fixture.preview.meta.liveData).toBe(false);
        expect(fixture.preview.safetyBoundary.dashboardReportLiveData).toBe(false);
      }
    });

    it(`${name} has no wallet/trading/execution/mutation controls enabled`, () => {
      const fixture = getDashboardReportSerializationPreviewFixture(name);
      expect(fixture).toBeDefined();
      if (fixture) {
        const safety = fixture.preview.safetyBoundary;
        expect(safety.hasWalletControls).toBe(false);
        expect(safety.hasTradingControls).toBe(false);
        expect(safety.hasExecutionControls).toBe(false);
        expect(safety.hasMutationControls).toBe(false);
        expect(safety.dashboardReportMutationControls).toBe(false);
      }
    });

    it(`${name} has export/download/persistence/network disabled`, () => {
      const fixture = getDashboardReportSerializationPreviewFixture(name);
      expect(fixture).toBeDefined();
      if (fixture) {
        const safety = fixture.preview.safetyBoundary;
        expect(safety.dashboardReportActualFileExport).toBe(false);
        expect(safety.dashboardReportDownloadSupport).toBe(false);
        expect(safety.dashboardReportPersistence).toBe(false);
        expect(safety.dashboardReportExternalNetwork).toBe(false);
      }
    });
  });
});
