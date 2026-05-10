/**
 * Phase 52 — Strategy Review Export Audit Report Surface Registry v1 tests.
 */

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST } from '../apps/dashboard/src/strategy-review-export-audit/index.js';
import { STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_FIXTURES } from '../apps/dashboard/src/strategy-review-export-audit-report/index.js';
import { STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODELS } from '../apps/dashboard/src/strategy-review-export-audit-report-view-models/index.js';
import { STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACTS } from '../apps/dashboard/src/strategy-review-export-audit-report-contracts/index.js';
import { STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTORS } from '../apps/dashboard/src/strategy-review-export-audit-report-contract-selectors/index.js';
import { STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODELS } from '../apps/dashboard/src/strategy-review-export-audit-report-selector-view-models/index.js';
import { STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_API_CONTRACTS } from '../apps/dashboard/src/strategy-review-export-audit-report-selector-view-model-contracts/index.js';
import {
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_PHASE,
  PHASE_52_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_GENERATED_AT,
  PHASE_52_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_SOURCE,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_ENTRY_NAMES,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_ENTRY_KINDS,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_ENTRIES,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_MAP,
  listStrategyReviewExportAuditReportSurfaceRegistryEntries,
  getStrategyReviewExportAuditReportSurfaceRegistryEntry,
  buildStrategyReviewExportAuditReportSurfaceRegistry,
  buildStrategyReviewExportAuditReportSurfaceRegistryEntry,
  validateStrategyReviewExportAuditReportSurfaceRegistry,
  validateStrategyReviewExportAuditReportSurfaceRegistrySafety,
  normalizeStrategyReviewExportAuditReportSurfaceRegistry,
  serializeStrategyReviewExportAuditReportSurfaceRegistry,
  areStrategyReviewExportAuditReportSurfaceRegistriesEqual,
  getStrategyReviewExportAuditReportSurfaceRegistryCapabilities,
  isValidStrategyReviewExportAuditReportSurfaceRegistryEntryName,
  isValidStrategyReviewExportAuditReportSurfaceRegistryEntryKind,
  isValidStrategyReviewExportAuditReportSurfaceRegistryGeneratedAt,
  isValidStrategyReviewExportAuditReportSurfaceRegistrySource,
  stableDeterministicStrategyReviewExportAuditReportSurfaceRegistryChecksum,
} from '../apps/dashboard/src/strategy-review-export-audit-report-surface-registry/index.js';
import {
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_PHASE as ROOT_SURFACE_REGISTRY_PHASE,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY as ROOT_SURFACE_REGISTRY,
  listStrategyReviewExportAuditReportSurfaceRegistryEntries as listRootSurfaceRegistryEntries,
} from '../apps/dashboard/src/index.js';
import { getDashboardUiShellCapabilities } from '../apps/dashboard/src/capabilities.js';
import { getLocalReadOnlyApiCapabilities } from '../apps/read-only-api/src/capabilities.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const PHASE_52_SRC = resolve(
  REPO_ROOT,
  'apps/dashboard/src/strategy-review-export-audit-report-surface-registry',
);
const PHASE_52_FILES = [
  'types.ts',
  'builders.ts',
  'fixtures.ts',
  'normalization.ts',
  'validation.ts',
  'capabilities.ts',
  'index.ts',
];

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

describe('Phase 52 — constants, exports, and capability propagation', () => {
  it('exports deterministic constants and root exports', () => {
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_PHASE).toBe(52);
    expect(ROOT_SURFACE_REGISTRY_PHASE).toBe(52);
    expect(PHASE_52_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_GENERATED_AT).toBe(
      '2026-01-08T00:00:00.000Z',
    );
    expect(PHASE_52_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_SOURCE).toBe(
      'phase52_strategy_review_export_audit_report_surface_registry_v1',
    );
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_ENTRY_KINDS).toEqual([
      'audit-fixtures',
      'report-fixtures',
      'view-models',
      'api-contracts',
      'contract-selectors',
      'selector-view-models',
      'selector-view-model-api-contracts',
    ]);
    expect(ROOT_SURFACE_REGISTRY).toEqual(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY);
    expect(listRootSurfaceRegistryEntries()).toEqual(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_ENTRIES);
  });

  it('propagates dashboard and read-only-api capability flags', () => {
    const flags = getStrategyReviewExportAuditReportSurfaceRegistryCapabilities();
    expect(flags.strategyReviewExportAuditReportSurfaceRegistry).toBe(true);
    expect(flags.aggressiveSafePhasePolicy).toBe(true);
    expect(flags.preventsUnnecessaryDerivativeLayers).toBe(true);
    expect(flags.strategyReviewExportAuditReportSurfaceRegistryRuntimeRequests).toBe(false);
    expect(flags.strategyReviewExportAuditReportSurfaceRegistryExecution).toBe(false);
    expect(flags.strategyReviewExportAuditReportSurfaceRegistryRecommendations).toBe(false);

    const dashboardCapabilities = getDashboardUiShellCapabilities();
    expect(dashboardCapabilities.strategyReviewExportAuditReportSurfaceRegistry).toBe(true);
    expect(dashboardCapabilities.aggressiveSafePhasePolicy).toBe(true);
    expect(dashboardCapabilities.strategyReviewExportAuditReportSurfaceRegistryNetworkAccess).toBe(false);

    const apiCapabilities = getLocalReadOnlyApiCapabilities();
    expect(apiCapabilities.strategyReviewExportAuditReportSurfaceRegistry).toBe(true);
    expect(apiCapabilities.preventsUnnecessaryDerivativeLayers).toBe(true);
    expect(apiCapabilities.strategyReviewExportAuditReportSurfaceRegistryHttpServer).toBe(false);
  });
});

describe('Phase 52 — fixture structure and source linkage', () => {
  it('contains expected entry names and deterministic map/list access', () => {
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_ENTRIES).toHaveLength(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_ENTRY_NAMES.length,
    );

    const names = STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_ENTRIES.map(entry => entry.entryName);
    const ids = STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_ENTRIES.map(entry => entry.entryId);

    expect(new Set(names).size).toBe(names.length);
    expect(new Set(ids).size).toBe(ids.length);
    expect(names).toEqual(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_ENTRY_NAMES);

    expect(listStrategyReviewExportAuditReportSurfaceRegistryEntries()).toEqual(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_ENTRIES,
    );

    for (const entry of STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_ENTRIES) {
      expect(getStrategyReviewExportAuditReportSurfaceRegistryEntry(entry.entryName)).toBe(entry);
      expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_MAP.get(entry.entryName)).toBe(entry);
    }

    expect(getStrategyReviewExportAuditReportSurfaceRegistryEntry('unknown')).toBeNull();
  });

  it('links to Phase 45–51 source surfaces and deterministic relationship map', () => {
    const byName = new Map(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY.entries.map(entry => [entry.entryName, entry]),
    );

    expect(
      byName.get('strategy-review-export-audit-fixtures')?.sourceEntryCount,
    ).toBe(PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_LIST.length);
    expect(
      byName.get('strategy-review-export-audit-report-fixtures')?.sourceEntryCount,
    ).toBe(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_FIXTURES.length);
    expect(
      byName.get('strategy-review-export-audit-report-view-models')?.sourceEntryCount,
    ).toBe(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODELS.length);
    expect(
      byName.get('strategy-review-export-audit-report-api-contracts')?.sourceEntryCount,
    ).toBe(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACTS.length);
    expect(
      byName.get('strategy-review-export-audit-report-contract-selectors')?.sourceEntryCount,
    ).toBe(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SELECTORS.length);
    expect(
      byName.get('strategy-review-export-audit-report-selector-view-models')?.sourceEntryCount,
    ).toBe(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODELS.length);
    expect(
      byName.get('strategy-review-export-audit-report-selector-view-model-api-contracts')?.sourceEntryCount,
    ).toBe(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_API_CONTRACTS.length);

    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY.relationships.phaseChain).toEqual([
      45, 46, 47, 48, 49, 50, 51, 52,
    ]);
    expect(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY.relationships.dependencies[
        'strategy-review-export-audit-report-selector-view-model-api-contracts'
      ],
    ).toEqual(['strategy-review-export-audit-report-selector-view-models']);
    expect(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY.relationships.blocksRecursiveDerivativeLayers,
    ).toBe(true);
  });

  it('captures policy, safety summary, and next milestone gate while keeping Phase 53 unimplemented', () => {
    expect(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY.aggressiveSafePolicy
        .preferVerticalSlicesOverMicroPhases,
    ).toBe(true);
    expect(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY.aggressiveSafePolicy
        .disallowWrapperOnWrapperWithoutRealConsumer,
    ).toBe(true);
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY.safetySummary.nonRuntimeRequest).toBe(true);
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY.safetySummary.nonExecutable).toBe(true);
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY.nextMilestone.nextPhase).toBe(53);
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY.nextMilestone.implemented).toBe(false);
  });
});

describe('Phase 52 — builders, normalization, serialization, and validation', () => {
  it('builders are deterministic and generic entry builder works', () => {
    const registryA = buildStrategyReviewExportAuditReportSurfaceRegistry();
    const registryB = buildStrategyReviewExportAuditReportSurfaceRegistry();
    expect(registryA).toEqual(registryB);

    const entry = buildStrategyReviewExportAuditReportSurfaceRegistryEntry({
      entryName: 'strategy-review-export-audit-report-api-contracts',
    });
    expect(entry.phase).toBe(48);
    expect(entry.entryKind).toBe('api-contracts');
  });

  it('normalization, serialization, equality, and guard helpers are stable', () => {
    const base = STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY;
    const scrambled = {
      ...clone(base),
      entries: [...base.entries].reverse(),
      relationships: {
        ...base.relationships,
        dependencies: {
          ...base.relationships.dependencies,
          'strategy-review-export-audit-report-selector-view-models': [
            ...base.relationships.dependencies['strategy-review-export-audit-report-selector-view-models'],
          ].reverse(),
        },
      },
    };

    expect(normalizeStrategyReviewExportAuditReportSurfaceRegistry(scrambled)).toEqual(
      normalizeStrategyReviewExportAuditReportSurfaceRegistry(base),
    );
    expect(areStrategyReviewExportAuditReportSurfaceRegistriesEqual(scrambled, base)).toBe(true);
    expect(serializeStrategyReviewExportAuditReportSurfaceRegistry(scrambled)).toBe(
      serializeStrategyReviewExportAuditReportSurfaceRegistry(base),
    );

    expect(isValidStrategyReviewExportAuditReportSurfaceRegistryEntryName(base.entries[0]?.entryName)).toBe(
      true,
    );
    expect(isValidStrategyReviewExportAuditReportSurfaceRegistryEntryName('bad')).toBe(false);
    expect(isValidStrategyReviewExportAuditReportSurfaceRegistryEntryKind(base.entries[0]?.entryKind)).toBe(
      true,
    );
    expect(isValidStrategyReviewExportAuditReportSurfaceRegistryEntryKind('bad')).toBe(false);
    expect(
      isValidStrategyReviewExportAuditReportSurfaceRegistryGeneratedAt(
        PHASE_52_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_GENERATED_AT,
      ),
    ).toBe(true);
    expect(
      isValidStrategyReviewExportAuditReportSurfaceRegistrySource(
        PHASE_52_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY_SOURCE,
      ),
    ).toBe(true);
    expect(stableDeterministicStrategyReviewExportAuditReportSurfaceRegistryChecksum('phase52')).toBe(
      stableDeterministicStrategyReviewExportAuditReportSurfaceRegistryChecksum('phase52'),
    );
  });

  it('validation passes for fixture and rejects structural/safety corruption', () => {
    expect(validateStrategyReviewExportAuditReportSurfaceRegistry(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY).valid).toBe(true);
    expect(validateStrategyReviewExportAuditReportSurfaceRegistrySafety(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY).safe).toBe(true);

    const invalidPhase = {
      ...clone(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY),
      phase: 999,
    };
    expect(validateStrategyReviewExportAuditReportSurfaceRegistry(invalidPhase).valid).toBe(false);

    const invalidEntry = {
      ...clone(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY),
      entries: [
        {
          ...clone(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY.entries[0]),
          shouldCreateFurtherDerivativeLayer: true,
        },
        ...clone(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY.entries.slice(1)),
      ],
    };
    expect(validateStrategyReviewExportAuditReportSurfaceRegistry(invalidEntry).valid).toBe(false);

    const unsafe = {
      ...clone(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SURFACE_REGISTRY),
      unsafeText: 'https://unsafe.example privateKey signTransaction fetch(',
    };
    const safety = validateStrategyReviewExportAuditReportSurfaceRegistrySafety(unsafe);
    expect(safety.safe).toBe(false);
    expect(safety.violations.length).toBeGreaterThan(0);
    expect(validateStrategyReviewExportAuditReportSurfaceRegistry(unsafe).valid).toBe(false);
  });
});

describe('Phase 52 — source structure and unsafe implementation pattern absence', () => {
  it('all Phase 52 source files exist and are non-empty', () => {
    for (const file of PHASE_52_FILES) {
      const content = readFileSync(resolve(PHASE_52_SRC, file), 'utf-8');
      expect(content.length).toBeGreaterThan(0);
    }
  });

  it('does not use Date.now, new Date, Math.random, randomUUID, env, or timers', () => {
    for (const file of PHASE_52_FILES) {
      const content = readFileSync(resolve(PHASE_52_SRC, file), 'utf-8');
      expect(content).not.toMatch(/Date\.now\(/);
      expect(content).not.toMatch(/new Date\(/);
      expect(content).not.toMatch(/Math\.random\(/);
      expect(content).not.toMatch(/randomUUID\(/);
      expect(content).not.toMatch(/process\.env/);
      expect(content).not.toMatch(/setInterval\(/);
      expect(content).not.toMatch(/setTimeout\(/);
    }
  });

  it('does not contain network/filesystem/server/rendering/runtime implementations', () => {
    for (const file of PHASE_52_FILES) {
      const content = readFileSync(resolve(PHASE_52_SRC, file), 'utf-8');
      if (file !== 'validation.ts') {
        expect(content).not.toMatch(/fetch\(/);
        expect(content).not.toMatch(/writeFile\(/);
        expect(content).not.toMatch(/createWriteStream\(/);
        expect(content).not.toMatch(/document\./);
        expect(content).not.toMatch(/window\./);
        expect(content).not.toMatch(/localStorage\./);
        expect(content).not.toMatch(/indexedDB\./);
        expect(content).not.toMatch(/\bfastify\b/i);
        expect(content).not.toMatch(/\bexpress\b/i);
      }
      expect(content).not.toMatch(/listen\(/);
      expect(content).not.toMatch(/createServer\(/);
    }
  });
});
