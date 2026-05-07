/**
 * Phase 34 — Offline Intelligence Report Integration Models v1
 */

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import {
  PHASE_34_OFFLINE_INTELLIGENCE_REPORT_GENERATED_AT,
  PHASE_34_OFFLINE_INTELLIGENCE_REPORT_SOURCE,
  OFFLINE_INTELLIGENCE_REPORT_FIXTURE_NAMES,
  OFFLINE_INTELLIGENCE_REPORT_KINDS,
  OFFLINE_INTELLIGENCE_REPORT_SECTION_KINDS,
  buildOfflineIntelligenceReportModel,
  buildOfflineIntelligenceReportSummary,
  buildOfflineIntelligenceReportSection,
  normalizeOfflineIntelligenceReportModel,
  serializeOfflineIntelligenceReportModel,
  isOfflineIntelligenceReportModelSerializable,
  areOfflineIntelligenceReportModelsEqual,
  validateOfflineIntelligenceReportModel,
  validateOfflineIntelligenceReportSafety,
  getOfflineIntelligenceReportCapabilities,
  PHASE_34_OFFLINE_INTELLIGENCE_REPORT_FIXTURES,
  listOfflineIntelligenceReportFixtures,
  getOfflineIntelligenceReportFixture,
  CLEAN_LOW_RISK_INTELLIGENCE_REPORT_FIXTURE,
  CREATOR_CREDIBLE_WALLET_BENIGN_INTELLIGENCE_REPORT_FIXTURE,
  CREATOR_UNKNOWN_WALLET_LOW_SIGNAL_INTELLIGENCE_REPORT_FIXTURE,
  CREATOR_RISK_WALLET_RISK_INTELLIGENCE_REPORT_FIXTURE,
  MANIPULATION_RISK_DOMINATES_INTELLIGENCE_REPORT_FIXTURE,
  WALLET_CLUSTER_RISK_DOMINATES_INTELLIGENCE_REPORT_FIXTURE,
  CREATOR_RISK_DOMINATES_INTELLIGENCE_REPORT_FIXTURE,
  MIXED_SIGNAL_WATCHLIST_INTELLIGENCE_REPORT_FIXTURE,
  FALSE_POSITIVE_PROTECTED_INTELLIGENCE_REPORT_FIXTURE,
  INSUFFICIENT_DATA_INTELLIGENCE_REPORT_FIXTURE,
  HIGH_RISK_MULTI_EVIDENCE_INTELLIGENCE_REPORT_FIXTURE,
  SAFETY_BOUNDARY_INTELLIGENCE_REPORT_FIXTURE,
  MALFORMED_INPUT_SAFE_INTELLIGENCE_REPORT_FIXTURE,
  NO_ACTION_NON_ADVISORY_INTELLIGENCE_REPORT_FIXTURE,
  DASHBOARD_READY_INTELLIGENCE_REPORT_FIXTURE,
  SERIALIZATION_PREVIEW_READY_INTELLIGENCE_REPORT_FIXTURE,
  OFFLINE_COMPOSITE_EVIDENCE_FIXTURE_NAMES,
  OFFLINE_COMPOSITE_EVIDENCE_FIXTURE_KINDS,
  getOfflineCompositeEvidenceFixture,
} from '@sonic/offline-intelligence';
import { getDashboardUiShellCapabilities } from '@sonic/dashboard';
import { getLocalReadOnlyApiCapabilities } from '@sonic/read-only-api';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const PHASE_34_SRC = resolve(REPO_ROOT, 'packages/offline-intelligence/src/report-integration');
const PHASE_34_FILES = [
  'types.ts',
  'capabilities.ts',
  'normalization.ts',
  'validation.ts',
  'builders.ts',
  'fixtures.ts',
  'index.ts',
].map(file => resolve(PHASE_34_SRC, file));

const NON_VALIDATION_PHASE_34_FILES = PHASE_34_FILES.filter(file => !file.endsWith('validation.ts'));

const FIXTURE_EXPORTS = [
  CLEAN_LOW_RISK_INTELLIGENCE_REPORT_FIXTURE,
  CREATOR_CREDIBLE_WALLET_BENIGN_INTELLIGENCE_REPORT_FIXTURE,
  CREATOR_UNKNOWN_WALLET_LOW_SIGNAL_INTELLIGENCE_REPORT_FIXTURE,
  CREATOR_RISK_WALLET_RISK_INTELLIGENCE_REPORT_FIXTURE,
  MANIPULATION_RISK_DOMINATES_INTELLIGENCE_REPORT_FIXTURE,
  WALLET_CLUSTER_RISK_DOMINATES_INTELLIGENCE_REPORT_FIXTURE,
  CREATOR_RISK_DOMINATES_INTELLIGENCE_REPORT_FIXTURE,
  MIXED_SIGNAL_WATCHLIST_INTELLIGENCE_REPORT_FIXTURE,
  FALSE_POSITIVE_PROTECTED_INTELLIGENCE_REPORT_FIXTURE,
  INSUFFICIENT_DATA_INTELLIGENCE_REPORT_FIXTURE,
  HIGH_RISK_MULTI_EVIDENCE_INTELLIGENCE_REPORT_FIXTURE,
  SAFETY_BOUNDARY_INTELLIGENCE_REPORT_FIXTURE,
  MALFORMED_INPUT_SAFE_INTELLIGENCE_REPORT_FIXTURE,
  NO_ACTION_NON_ADVISORY_INTELLIGENCE_REPORT_FIXTURE,
  DASHBOARD_READY_INTELLIGENCE_REPORT_FIXTURE,
  SERIALIZATION_PREVIEW_READY_INTELLIGENCE_REPORT_FIXTURE,
] as const;

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
  /child_process/,
  /\bexec\s*\(/,
  /\beval\s*\(/,
  /new Function\s*\(/,
  /localStorage/,
  /sessionStorage/,
  /IndexedDB/,
  /document\.cookie/,
];

const REQUIRED_FIXTURE_NAMES = [
  'clean-low-risk-intelligence-report',
  'creator-credible-wallet-benign-intelligence-report',
  'creator-unknown-wallet-low-signal-intelligence-report',
  'creator-risk-wallet-risk-intelligence-report',
  'manipulation-risk-dominates-intelligence-report',
  'wallet-cluster-risk-dominates-intelligence-report',
  'creator-risk-dominates-intelligence-report',
  'mixed-signal-watchlist-intelligence-report',
  'false-positive-protected-intelligence-report',
  'insufficient-data-intelligence-report',
  'high-risk-multi-evidence-intelligence-report',
  'safety-boundary-intelligence-report',
  'malformed-input-safe-intelligence-report',
  'no-action-non-advisory-intelligence-report',
  'dashboard-ready-intelligence-report',
  'serialization-preview-ready-intelligence-report',
] as const;

describe('Phase 34 — module exports', () => {
  const exportedFunctions: Array<[string, unknown]> = [
    ['buildOfflineIntelligenceReportModel', buildOfflineIntelligenceReportModel],
    ['buildOfflineIntelligenceReportSummary', buildOfflineIntelligenceReportSummary],
    ['buildOfflineIntelligenceReportSection', buildOfflineIntelligenceReportSection],
    ['normalizeOfflineIntelligenceReportModel', normalizeOfflineIntelligenceReportModel],
    ['serializeOfflineIntelligenceReportModel', serializeOfflineIntelligenceReportModel],
    ['isOfflineIntelligenceReportModelSerializable', isOfflineIntelligenceReportModelSerializable],
    ['areOfflineIntelligenceReportModelsEqual', areOfflineIntelligenceReportModelsEqual],
    ['validateOfflineIntelligenceReportModel', validateOfflineIntelligenceReportModel],
    ['validateOfflineIntelligenceReportSafety', validateOfflineIntelligenceReportSafety],
    ['listOfflineIntelligenceReportFixtures', listOfflineIntelligenceReportFixtures],
    ['getOfflineIntelligenceReportFixture', getOfflineIntelligenceReportFixture],
    ['getOfflineIntelligenceReportCapabilities', getOfflineIntelligenceReportCapabilities],
  ];

  exportedFunctions.forEach(([name, value]) => {
    it(`${name} is exported`, () => {
      expect(typeof value).toBe('function');
    });
  });

  it('fixture names list has 16 entries', () => {
    expect(OFFLINE_INTELLIGENCE_REPORT_FIXTURE_NAMES.length).toBe(16);
  });

  it('fixture kinds list has 16 entries', () => {
    expect(OFFLINE_INTELLIGENCE_REPORT_KINDS.length).toBe(16);
  });

  it('section kinds list has 7 entries', () => {
    expect(OFFLINE_INTELLIGENCE_REPORT_SECTION_KINDS.length).toBe(7);
  });

  it('phase 34 fixture map has 16 entries', () => {
    expect(PHASE_34_OFFLINE_INTELLIGENCE_REPORT_FIXTURES.size).toBe(16);
  });

  it('PHASE_34_OFFLINE_INTELLIGENCE_REPORT_GENERATED_AT is deterministic', () => {
    expect(PHASE_34_OFFLINE_INTELLIGENCE_REPORT_GENERATED_AT).toBe('2026-01-01T00:00:00.000Z');
  });

  it('PHASE_34_OFFLINE_INTELLIGENCE_REPORT_SOURCE is deterministic', () => {
    expect(PHASE_34_OFFLINE_INTELLIGENCE_REPORT_SOURCE).toBe(
      'phase34_offline_intelligence_report_integration_models_v1',
    );
  });
});

describe('Phase 34 — fixture list and lookup helpers', () => {
  it('listOfflineIntelligenceReportFixtures returns 16 entries', () => {
    expect(listOfflineIntelligenceReportFixtures().length).toBe(16);
  });

  it('listOfflineIntelligenceReportFixtures returns sorted names', () => {
    const names = listOfflineIntelligenceReportFixtures();
    expect(names).toEqual([...names].sort());
  });

  OFFLINE_INTELLIGENCE_REPORT_FIXTURE_NAMES.forEach(name => {
    it(`getOfflineIntelligenceReportFixture resolves ${name}`, () => {
      expect(getOfflineIntelligenceReportFixture(name)?.name).toBe(name);
    });
  });

  it('getOfflineIntelligenceReportFixture returns undefined for unknown names', () => {
    expect(getOfflineIntelligenceReportFixture('unknown-phase34' as never)).toBeUndefined();
  });
});

describe('Phase 34 — required fixture names exist', () => {
  REQUIRED_FIXTURE_NAMES.forEach(name => {
    it(`${name} exists`, () => {
      expect(listOfflineIntelligenceReportFixtures()).toContain(name);
    });

    it(`${name} resolves in map and lookup`, () => {
      expect(PHASE_34_OFFLINE_INTELLIGENCE_REPORT_FIXTURES.has(name)).toBe(true);
      expect(getOfflineIntelligenceReportFixture(name)?.name).toBe(name);
    });
  });
});

describe('Phase 34 — all fixtures pass validation and safety', () => {
  FIXTURE_EXPORTS.forEach(fixture => {
    it(`${fixture.name} passes validateOfflineIntelligenceReportModel`, () => {
      expect(validateOfflineIntelligenceReportModel(fixture.report)).toEqual({ valid: true, issues: [] });
    });

    it(`${fixture.name} passes validateOfflineIntelligenceReportSafety`, () => {
      expect(validateOfflineIntelligenceReportSafety(fixture.report)).toEqual({ safe: true, violations: [] });
    });
  });
});

describe('Phase 34 — fixture invariants', () => {
  FIXTURE_EXPORTS.forEach(fixture => {
    it(`${fixture.name} has deterministic meta`, () => {
      expect(fixture.report.meta.phase).toBe(34);
      expect(fixture.report.meta.generatedAt).toBe(PHASE_34_OFFLINE_INTELLIGENCE_REPORT_GENERATED_AT);
      expect(fixture.report.meta.source).toBe(PHASE_34_OFFLINE_INTELLIGENCE_REPORT_SOURCE);
      expect(fixture.report.meta.fixtureOnly).toBe(true);
      expect(fixture.report.meta.syntheticOnly).toBe(true);
      expect(fixture.report.meta.deterministic).toBe(true);
      expect(fixture.report.meta.readOnly).toBe(true);
      expect(fixture.report.meta.localOnly).toBe(true);
      expect(fixture.report.meta.liveData).toBe(false);
      expect(fixture.report.meta.externalNetwork).toBe(false);
      expect(fixture.report.meta.persistence).toBe(false);
      expect(fixture.report.meta.nonAdvisory).toBe(true);
      expect(fixture.report.meta.nonAccusatory).toBe(true);
      expect(fixture.report.meta.dashboardReportCompatible).toBe(true);
      expect(fixture.report.meta.serializationPreviewCompatible).toBe(true);
    });

    it(`${fixture.name} has deterministic summary`, () => {
      expect(fixture.report.summary.phase).toBe(34);
      expect(fixture.report.summary.reportName).toBe(fixture.name);
      expect(fixture.report.summary.reportKind).toBe(fixture.report.kind);
      expect(fixture.report.summary.generatedAt).toBe(PHASE_34_OFFLINE_INTELLIGENCE_REPORT_GENERATED_AT);
      expect(fixture.report.summary.nonAdvisory).toBe(true);
      expect(fixture.report.summary.nonActionable).toBe(true);
      expect(fixture.report.summary.safeToDisplay).toBe(true);
      expect(fixture.report.summary.sectionCount).toBe(7);
    });

    it(`${fixture.name} is serializable`, () => {
      expect(isOfflineIntelligenceReportModelSerializable(fixture.report)).toBe(true);
      expect(() => JSON.parse(JSON.stringify(fixture.report))).not.toThrow();
    });

    it(`${fixture.name} stays equal after normalization`, () => {
      expect(
        areOfflineIntelligenceReportModelsEqual(
          fixture.report,
          normalizeOfflineIntelligenceReportModel(fixture.report),
        ),
      ).toBe(true);
    });

    it(`${fixture.name} uses deterministic note ordering`, () => {
      expect(fixture.report.safeNotes).toEqual([...fixture.report.safeNotes].sort());
      expect(fixture.report.summary.notes).toEqual([...fixture.report.summary.notes].sort());
      expect(fixture.report.meta.notes).toEqual([...fixture.report.meta.notes].sort());
      expect(fixture.report.meta.sourceCompositeWeighting.notes).toEqual(
        [...fixture.report.meta.sourceCompositeWeighting.notes].sort(),
      );
    });

    it(`${fixture.name} sections are deterministically sorted`, () => {
      const ids = fixture.report.sections.map(section => section.id);
      expect(ids).toEqual([...ids].sort());
    });

    it(`${fixture.name} has all expected section kinds`, () => {
      const kinds = fixture.report.sections.map(section => section.kind);
      OFFLINE_INTELLIGENCE_REPORT_SECTION_KINDS.forEach(kind => {
        expect(kinds).toContain(kind);
      });
    });

    it(`${fixture.name} section summaries are non-empty`, () => {
      fixture.report.sections.forEach(section => {
        expect(typeof section.summary).toBe('string');
        expect(section.summary.length).toBeGreaterThan(0);
      });
    });

    it(`${fixture.name} summary counts match source composite`, () => {
      expect(fixture.report.summary.sourceCount).toBe(
        fixture.report.sourceCompositeFixture.sourceReferences.sourceCount,
      );
      expect(fixture.report.summary.riskCount).toBe(
        fixture.report.sourceCompositeFixture.riskIndicators.length,
      );
      expect(fixture.report.summary.qualityCount).toBe(
        fixture.report.sourceCompositeFixture.qualityIndicators.length,
      );
      expect(fixture.report.summary.confidenceCount).toBe(
        fixture.report.sourceCompositeFixture.confidenceIndicators.length,
      );
    });

    it(`${fixture.name} summary source references match metadata`, () => {
      expect(fixture.report.summary.sourceCompositeFixtureName).toBe(
        fixture.report.meta.sourceCompositeFixtureName,
      );
      expect(fixture.report.summary.sourceCompositeFixtureKind).toBe(
        fixture.report.meta.sourceCompositeFixtureKind,
      );
      expect(fixture.report.sourceCompositeFixture.name).toBe(fixture.report.meta.sourceCompositeFixtureName);
      expect(fixture.report.sourceCompositeFixture.kind).toBe(fixture.report.meta.sourceCompositeFixtureKind);
    });

    it(`${fixture.name} source composite reference is Phase 33 compatible`, () => {
      expect(OFFLINE_COMPOSITE_EVIDENCE_FIXTURE_NAMES).toContain(
        fixture.report.meta.sourceCompositeFixtureName,
      );
      expect(OFFLINE_COMPOSITE_EVIDENCE_FIXTURE_KINDS).toContain(
        fixture.report.meta.sourceCompositeFixtureKind,
      );
      expect(getOfflineCompositeEvidenceFixture(fixture.report.meta.sourceCompositeFixtureName)).toBeDefined();
    });

    it(`${fixture.name} buildOfflineIntelligenceReportSummary returns the report summary`, () => {
      expect(buildOfflineIntelligenceReportSummary(fixture.report)).toEqual(fixture.report.summary);
    });

    it(`${fixture.name} serializeOfflineIntelligenceReportModel returns JSON`, () => {
      const serialized = serializeOfflineIntelligenceReportModel(fixture.report);
      expect(typeof serialized).toBe('string');
      expect(() => JSON.parse(serialized)).not.toThrow();
    });
  });
});

describe('Phase 34 — section builder coverage', () => {
  const sectionKinds: readonly (
    | 'summary'
    | 'risk'
    | 'quality'
    | 'confidence'
    | 'source-references'
    | 'weighting'
    | 'safety-boundary'
  )[] = ['summary', 'risk', 'quality', 'confidence', 'source-references', 'weighting', 'safety-boundary'];

  FIXTURE_EXPORTS.forEach(fixture => {
    sectionKinds.forEach(sectionKind => {
      it(`${fixture.name} builds ${sectionKind} section`, () => {
        const section = buildOfflineIntelligenceReportSection(fixture.report, sectionKind);
        expect(section.kind).toBe(sectionKind);
        expect(section.id.length).toBeGreaterThan(0);
        expect(section.title.length).toBeGreaterThan(0);
      });
    });
  });
});

describe('Phase 34 — builders and invalid inputs', () => {
  it('buildOfflineIntelligenceReportModel rejects unsupported name', () => {
    const composite = getOfflineCompositeEvidenceFixture('clean-low-risk-composite');
    const result = buildOfflineIntelligenceReportModel({
      name: 'invalid-name',
      kind: 'clean-low-risk',
      sourceCompositeFixture: composite,
    });
    expect(result.success).toBe(false);
    expect(result.report).toBeNull();
    expect(result.validation.valid).toBe(false);
  });

  it('buildOfflineIntelligenceReportModel rejects unsupported kind', () => {
    const composite = getOfflineCompositeEvidenceFixture('clean-low-risk-composite');
    const result = buildOfflineIntelligenceReportModel({
      name: 'clean-low-risk-intelligence-report',
      kind: 'invalid-kind',
      sourceCompositeFixture: composite,
    });
    expect(result.success).toBe(false);
    expect(result.report).toBeNull();
    expect(result.validation.valid).toBe(false);
  });

  it('buildOfflineIntelligenceReportModel rejects missing source composite fixture', () => {
    const result = buildOfflineIntelligenceReportModel({
      name: 'clean-low-risk-intelligence-report',
      kind: 'clean-low-risk',
      sourceCompositeFixture: null,
    });
    expect(result.success).toBe(false);
    expect(result.report).toBeNull();
    expect(result.validation.valid).toBe(false);
  });

  it('buildOfflineIntelligenceReportModel creates a valid report from a Phase 33 fixture', () => {
    const composite = getOfflineCompositeEvidenceFixture('clean-low-risk-composite');
    const result = buildOfflineIntelligenceReportModel({
      name: 'clean-low-risk-intelligence-report',
      kind: 'clean-low-risk',
      sourceCompositeFixture: composite,
    });
    expect(result.success).toBe(true);
    expect(result.report).not.toBeNull();
    expect(result.validation.valid).toBe(true);
    expect(result.safety.safe).toBe(true);
  });

  it('buildOfflineIntelligenceReportModel does not mutate safeNotes input', () => {
    const composite = getOfflineCompositeEvidenceFixture('clean-low-risk-composite');
    const safeNotes = ['b-note', 'a-note'];
    const original = [...safeNotes];

    buildOfflineIntelligenceReportModel({
      name: 'clean-low-risk-intelligence-report',
      kind: 'clean-low-risk',
      sourceCompositeFixture: composite,
      safeNotes,
    });

    expect(safeNotes).toEqual(original);
  });
});

describe('Phase 34 — validation failures', () => {
  it('validateOfflineIntelligenceReportModel rejects non-object input', () => {
    expect(validateOfflineIntelligenceReportModel(null)).toEqual({
      valid: false,
      issues: [
        {
          code: 'INVALID_INPUT',
          field: 'root',
          message: 'Input must be a non-null object.',
          severity: 'error',
        },
      ],
    });
  });

  it('validateOfflineIntelligenceReportModel rejects unstable section order', () => {
    const fixture = CLEAN_LOW_RISK_INTELLIGENCE_REPORT_FIXTURE.report;
    const invalid = {
      ...fixture,
      sections: [...fixture.sections].reverse(),
    };

    const validation = validateOfflineIntelligenceReportModel(invalid);
    expect(validation.valid).toBe(false);
    expect(validation.issues.some(issue => issue.code === 'UNSTABLE_ORDERING')).toBe(true);
  });

  it('validateOfflineIntelligenceReportModel rejects non-deterministic generatedAt', () => {
    const fixture = CLEAN_LOW_RISK_INTELLIGENCE_REPORT_FIXTURE.report;
    const invalid = {
      ...fixture,
      meta: {
        ...fixture.meta,
        generatedAt: '2026-02-01T00:00:00.000Z',
      },
    };

    const validation = validateOfflineIntelligenceReportModel(invalid);
    expect(validation.valid).toBe(false);
    expect(validation.issues.some(issue => issue.code === 'NON_DETERMINISTIC_GENERATED_AT')).toBe(true);
  });

  it('validateOfflineIntelligenceReportModel rejects invalid report name', () => {
    const fixture = CLEAN_LOW_RISK_INTELLIGENCE_REPORT_FIXTURE.report;
    const invalid = {
      ...fixture,
      name: 'invalid-name',
    };

    const validation = validateOfflineIntelligenceReportModel(invalid);
    expect(validation.valid).toBe(false);
    expect(validation.issues.some(issue => issue.field === 'name')).toBe(true);
  });

  it('validateOfflineIntelligenceReportModel rejects invalid report kind', () => {
    const fixture = CLEAN_LOW_RISK_INTELLIGENCE_REPORT_FIXTURE.report;
    const invalid = {
      ...fixture,
      kind: 'invalid-kind',
    };

    const validation = validateOfflineIntelligenceReportModel(invalid);
    expect(validation.valid).toBe(false);
    expect(validation.issues.some(issue => issue.field === 'kind')).toBe(true);
  });
});

describe('Phase 34 — safety validator rejects unsafe patterns', () => {
  const unsafeSamples: readonly [string, string][] = [
    ['wallet marker', '3A7bQmVfVf7Q8q9Wc9yYfXg3Xf4j2H7m1s9pQ5wL2N1k'],
    ['tx hash marker', '7Y3q8L9p4m2r6t8w1z5x9v3n7k2j6h4g8f1d3s5a7q9w2e4r6t8y0u1i3o5p7a9'],
    ['bundle id marker', 'bundle-id: a1b2c3d4e5f6a7b8'],
    ['email marker', 'person@example.com'],
    ['phone marker', '+1 (555) 123-4567'],
    ['street marker', '123 Test Street'],
    ['url marker', 'https://unsafe.local/resource'],
    ['stack trace marker', 'TypeError: boom'],
    ['local path marker', '/home/runner/secrets.txt'],
    ['secret marker', 'BEGIN PRIVATE KEY'],
    ['live data marker', 'live data confirmed'],
    ['advice marker', 'investment advice provided'],
    ['execution marker', 'execute trade now'],
    ['accusation marker', 'proven manipulation by person'],
    ['wallet ownership marker', 'wallet ownership confirmed'],
    ['download marker', 'download url available'],
  ];

  unsafeSamples.forEach(([label, value]) => {
    it(`rejects ${label}`, () => {
      const result = validateOfflineIntelligenceReportSafety({ value });
      expect(result.safe).toBe(false);
      expect(result.violations.length).toBeGreaterThan(0);
    });
  });

  it('rejects null input', () => {
    const result = validateOfflineIntelligenceReportSafety(null);
    expect(result.safe).toBe(false);
    expect(result.violations.length).toBeGreaterThan(0);
  });
});

describe('Phase 34 — payload safety and compatibility constraints', () => {
  FIXTURE_EXPORTS.forEach(fixture => {
    it(`${fixture.name} has no forbidden payload patterns`, () => {
      const serialized = JSON.stringify(fixture.report);
      FORBIDDEN_PAYLOAD_PATTERNS.forEach(pattern => {
        expect(serialized).not.toMatch(pattern);
      });
    });

    it(`${fixture.name} uses only Phase 33 composite source references`, () => {
      expect(OFFLINE_COMPOSITE_EVIDENCE_FIXTURE_NAMES).toContain(
        fixture.report.meta.sourceCompositeFixtureName,
      );
      expect(OFFLINE_COMPOSITE_EVIDENCE_FIXTURE_KINDS).toContain(
        fixture.report.meta.sourceCompositeFixtureKind,
      );
    });

    it(`${fixture.name} has non-advisory report-level metadata`, () => {
      expect(fixture.report.summary.nonAdvisory).toBe(true);
      expect(fixture.report.summary.nonActionable).toBe(true);
      expect(fixture.report.meta.nonAdvisory).toBe(true);
      expect(fixture.report.meta.nonAccusatory).toBe(true);
    });

    it(`${fixture.name} has no file export/download support metadata`, () => {
      const capabilities = getOfflineIntelligenceReportCapabilities();
      expect(capabilities.offlineIntelligenceReportFileExport).toBe(false);
      expect(capabilities.offlineIntelligenceReportDownloadSupport).toBe(false);
    });

    it(`${fixture.name} has deterministic source-generated metadata`, () => {
      expect(fixture.report.meta.sourceCompositeGeneratedAt).toBe(
        fixture.report.sourceCompositeFixture.meta.generatedAt,
      );
      expect(fixture.report.meta.sourceCompositeReferenceCount).toBe(
        fixture.report.sourceCompositeFixture.sourceReferences.sourceCount,
      );
    });

    it(`${fixture.name} supports dashboard/report/preview compatibility flags`, () => {
      expect(fixture.report.meta.dashboardReportCompatible).toBe(true);
      expect(fixture.report.meta.serializationPreviewCompatible).toBe(true);
    });
  });
});

describe('Phase 34 — capability flags', () => {
  it('offline intelligence report capability flags match expected values', () => {
    const capabilities = getOfflineIntelligenceReportCapabilities();
    expect(capabilities.offlineIntelligenceReportModels).toBe(true);
    expect(capabilities.offlineIntelligenceReportFixtures).toBe(true);
    expect(capabilities.offlineIntelligenceCompositeReportIntegration).toBe(true);
    expect(capabilities.offlineIntelligenceReportRiskSections).toBe(true);
    expect(capabilities.offlineIntelligenceReportQualitySections).toBe(true);
    expect(capabilities.offlineIntelligenceReportConfidenceSections).toBe(true);
    expect(capabilities.offlineIntelligenceReportSourceReferences).toBe(true);
    expect(capabilities.offlineIntelligenceReportSafetyValidation).toBe(true);
    expect(capabilities.offlineIntelligenceReportLiveData).toBe(false);
    expect(capabilities.offlineIntelligenceReportSolanaRpc).toBe(false);
    expect(capabilities.offlineIntelligenceReportProviderApis).toBe(false);
    expect(capabilities.offlineIntelligenceReportJitoIntegration).toBe(false);
    expect(capabilities.offlineIntelligenceReportMempoolAccess).toBe(false);
    expect(capabilities.offlineIntelligenceReportTradingSignals).toBe(false);
    expect(capabilities.offlineIntelligenceReportInvestmentAdvice).toBe(false);
    expect(capabilities.offlineIntelligenceReportExternalNetwork).toBe(false);
    expect(capabilities.offlineIntelligenceReportPersistence).toBe(false);
    expect(capabilities.offlineIntelligenceReportExecution).toBe(false);
    expect(capabilities.offlineIntelligenceReportFileExport).toBe(false);
    expect(capabilities.offlineIntelligenceReportDownloadSupport).toBe(false);
  });

  it('dashboard capabilities include Phase 34 flags', () => {
    const capabilities = getDashboardUiShellCapabilities();
    expect(capabilities.offlineIntelligenceReportModels).toBe(true);
    expect(capabilities.offlineIntelligenceReportFixtures).toBe(true);
    expect(capabilities.offlineIntelligenceCompositeReportIntegration).toBe(true);
    expect(capabilities.offlineIntelligenceReportRiskSections).toBe(true);
    expect(capabilities.offlineIntelligenceReportQualitySections).toBe(true);
    expect(capabilities.offlineIntelligenceReportConfidenceSections).toBe(true);
    expect(capabilities.offlineIntelligenceReportSourceReferences).toBe(true);
    expect(capabilities.offlineIntelligenceReportSafetyValidation).toBe(true);
    expect(capabilities.offlineIntelligenceReportLiveData).toBe(false);
    expect(capabilities.offlineIntelligenceReportSolanaRpc).toBe(false);
    expect(capabilities.offlineIntelligenceReportProviderApis).toBe(false);
    expect(capabilities.offlineIntelligenceReportJitoIntegration).toBe(false);
    expect(capabilities.offlineIntelligenceReportMempoolAccess).toBe(false);
    expect(capabilities.offlineIntelligenceReportTradingSignals).toBe(false);
    expect(capabilities.offlineIntelligenceReportInvestmentAdvice).toBe(false);
    expect(capabilities.offlineIntelligenceReportExternalNetwork).toBe(false);
    expect(capabilities.offlineIntelligenceReportPersistence).toBe(false);
    expect(capabilities.offlineIntelligenceReportExecution).toBe(false);
    expect(capabilities.offlineIntelligenceReportFileExport).toBe(false);
    expect(capabilities.offlineIntelligenceReportDownloadSupport).toBe(false);
  });

  it('read-only-api capabilities include Phase 34 flags', () => {
    const capabilities = getLocalReadOnlyApiCapabilities();
    expect(capabilities.offlineIntelligenceReportModels).toBe(true);
    expect(capabilities.offlineIntelligenceReportFixtures).toBe(true);
    expect(capabilities.offlineIntelligenceCompositeReportIntegration).toBe(true);
    expect(capabilities.offlineIntelligenceReportRiskSections).toBe(true);
    expect(capabilities.offlineIntelligenceReportQualitySections).toBe(true);
    expect(capabilities.offlineIntelligenceReportConfidenceSections).toBe(true);
    expect(capabilities.offlineIntelligenceReportSourceReferences).toBe(true);
    expect(capabilities.offlineIntelligenceReportSafetyValidation).toBe(true);
    expect(capabilities.offlineIntelligenceReportLiveData).toBe(false);
    expect(capabilities.offlineIntelligenceReportSolanaRpc).toBe(false);
    expect(capabilities.offlineIntelligenceReportProviderApis).toBe(false);
    expect(capabilities.offlineIntelligenceReportJitoIntegration).toBe(false);
    expect(capabilities.offlineIntelligenceReportMempoolAccess).toBe(false);
    expect(capabilities.offlineIntelligenceReportTradingSignals).toBe(false);
    expect(capabilities.offlineIntelligenceReportInvestmentAdvice).toBe(false);
    expect(capabilities.offlineIntelligenceReportExternalNetwork).toBe(false);
    expect(capabilities.offlineIntelligenceReportPersistence).toBe(false);
    expect(capabilities.offlineIntelligenceReportExecution).toBe(false);
    expect(capabilities.offlineIntelligenceReportFileExport).toBe(false);
    expect(capabilities.offlineIntelligenceReportDownloadSupport).toBe(false);
  });
});

describe('Phase 34 — source safety checks', () => {
  PHASE_34_FILES.forEach(file => {
    it(`source file exists and is readable: ${file.replace(REPO_ROOT, '')}`, () => {
      const content = readFileSync(file, 'utf8');
      expect(content.length).toBeGreaterThan(0);
    });
  });

  NON_VALIDATION_PHASE_34_FILES.forEach(file => {
    FORBIDDEN_RUNTIME_PATTERNS.forEach(pattern => {
      it(`runtime file ${file.replace(REPO_ROOT, '')} does not use forbidden pattern ${pattern}`, () => {
        const content = readFileSync(file, 'utf8');
        expect(content).not.toMatch(pattern);
      });
    });
  });
});

describe('Phase 34 — deterministic regression checks', () => {
  FIXTURE_EXPORTS.forEach(fixture => {
    it(`${fixture.name} normalization is idempotent`, () => {
      const once = normalizeOfflineIntelligenceReportModel(fixture.report);
      const twice = normalizeOfflineIntelligenceReportModel(once);
      expect(once).toEqual(twice);
    });

    it(`${fixture.name} serialization is stable`, () => {
      const first = serializeOfflineIntelligenceReportModel(fixture.report);
      const second = serializeOfflineIntelligenceReportModel(
        normalizeOfflineIntelligenceReportModel(fixture.report),
      );
      expect(first).toBe(second);
    });

    it(`${fixture.name} source report can be rebuilt deterministically`, () => {
      const rebuilt = buildOfflineIntelligenceReportModel({
        name: fixture.name,
        kind: fixture.report.kind,
        sourceCompositeFixture: fixture.report.sourceCompositeFixture,
        safeNotes: fixture.report.safeNotes,
      });

      expect(rebuilt.success).toBe(true);
      expect(rebuilt.report).not.toBeNull();
      expect(areOfflineIntelligenceReportModelsEqual(fixture.report, rebuilt.report!)).toBe(true);
    });
  });
});
