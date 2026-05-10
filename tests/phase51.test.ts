/**
 * Phase 51 — Strategy Review Export Audit Report Selector View Model API Contracts v1 tests.
 */

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_PHASE,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODELS,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_MAP,
  serializeStrategyReviewExportAuditReportSelectorViewModel,
} from '../apps/dashboard/src/strategy-review-export-audit-report-selector-view-models/index.js';
import {
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_API_CONTRACT_PHASE,
  PHASE_51_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_API_CONTRACT_GENERATED_AT,
  PHASE_51_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_API_CONTRACT_SOURCE,
  PHASE_51_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_API_CONTRACT_VERSION,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_API_CONTRACT_KINDS,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_API_CONTRACT_NAMES,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_API_CONTRACTS,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_API_CONTRACT_MAP,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_LIST_API_CONTRACT,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_DETAIL_API_CONTRACTS,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_DETAIL_API_CONTRACT_MAP,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_SUMMARY_API_CONTRACT,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_ERROR_API_CONTRACTS,
  listStrategyReviewExportAuditReportSelectorViewModelApiContracts,
  getStrategyReviewExportAuditReportSelectorViewModelApiContract,
  getStrategyReviewExportAuditReportSelectorViewModelDetailApiContractBySourceViewModelId,
  buildStrategyReviewExportAuditReportSelectorViewModelApiContract,
  buildStrategyReviewExportAuditReportSelectorViewModelListApiContract,
  buildStrategyReviewExportAuditReportSelectorViewModelDetailApiContract,
  buildStrategyReviewExportAuditReportSelectorViewModelSummaryApiContract,
  buildStrategyReviewExportAuditReportSelectorViewModelErrorApiContract,
  validateStrategyReviewExportAuditReportSelectorViewModelApiContract,
  validateStrategyReviewExportAuditReportSelectorViewModelApiContractSafety,
  normalizeStrategyReviewExportAuditReportSelectorViewModelApiContract,
  serializeStrategyReviewExportAuditReportSelectorViewModelApiContract,
  areStrategyReviewExportAuditReportSelectorViewModelApiContractsEqual,
  getStrategyReviewExportAuditReportSelectorViewModelApiContractCapabilities,
  isValidStrategyReviewExportAuditReportSelectorViewModelApiContractName,
  isValidStrategyReviewExportAuditReportSelectorViewModelApiContractKind,
  isValidStrategyReviewExportAuditReportSelectorViewModelApiContractGeneratedAt,
  isValidStrategyReviewExportAuditReportSelectorViewModelApiContractSource,
  stableDeterministicSelectorViewModelApiContractChecksum,
} from '../apps/dashboard/src/strategy-review-export-audit-report-selector-view-model-contracts/index.js';
import {
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_API_CONTRACT_PHASE as ROOT_SELECTOR_VIEW_MODEL_API_CONTRACT_PHASE,
  listStrategyReviewExportAuditReportSelectorViewModelApiContracts as listRootSelectorViewModelApiContracts,
} from '../apps/dashboard/src/index.js';
import { getDashboardUiShellCapabilities } from '../apps/dashboard/src/capabilities.js';
import { getLocalReadOnlyApiCapabilities } from '../apps/read-only-api/src/capabilities.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const PHASE_51_SRC = resolve(
  REPO_ROOT,
  'apps/dashboard/src/strategy-review-export-audit-report-selector-view-model-contracts',
);
const PHASE_51_FILES = [
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

describe('Phase 51 — constants and capabilities', () => {
  it('exports deterministic constants', () => {
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_API_CONTRACT_PHASE).toBe(51);
    expect(ROOT_SELECTOR_VIEW_MODEL_API_CONTRACT_PHASE).toBe(51);
    expect(PHASE_51_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_API_CONTRACT_GENERATED_AT).toBe(
      '2026-01-07T00:00:00.000Z',
    );
    expect(PHASE_51_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_API_CONTRACT_SOURCE).toBe(
      'phase51_strategy_review_export_audit_report_selector_view_model_api_contracts_v1',
    );
    expect(PHASE_51_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_API_CONTRACT_VERSION).toBe(
      '1.0.0',
    );
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_API_CONTRACT_KINDS).toEqual([
      'list',
      'detail',
      'summary',
      'error',
    ]);
  });

  it('module and surface capabilities include required true/false flags', () => {
    const capabilities = getStrategyReviewExportAuditReportSelectorViewModelApiContractCapabilities();
    expect(capabilities.strategyReviewExportAuditReportSelectorViewModelApiContracts).toBe(true);
    expect(capabilities.syntheticStrategyReviewExportAuditReportSelectorViewModelApiContracts).toBe(true);
    expect(capabilities.deterministicStrategyReviewExportAuditReportSelectorViewModelApiContracts).toBe(true);
    expect(capabilities.localOnlyStrategyReviewExportAuditReportSelectorViewModelApiContracts).toBe(true);
    expect(capabilities.readOnlyStrategyReviewExportAuditReportSelectorViewModelApiContracts).toBe(true);
    expect(capabilities.fixtureDerivedStrategyReviewExportAuditReportSelectorViewModelApiContracts).toBe(
      true,
    );
    expect(capabilities.strategyReviewExportAuditReportSelectorViewModelApiContractRuntimeRequests).toBe(
      false,
    );
    expect(capabilities.strategyReviewExportAuditReportSelectorViewModelApiContractExecution).toBe(false);
    expect(capabilities.strategyReviewExportAuditReportSelectorViewModelApiContractRecommendations).toBe(
      false,
    );

    const dashboardCapabilities = getDashboardUiShellCapabilities();
    expect(dashboardCapabilities.strategyReviewExportAuditReportSelectorViewModelApiContracts).toBe(true);
    expect(
      dashboardCapabilities.strategyReviewExportAuditReportSelectorViewModelApiContractRuntimeRequests,
    ).toBe(false);

    const apiCapabilities = getLocalReadOnlyApiCapabilities();
    expect(apiCapabilities.strategyReviewExportAuditReportSelectorViewModelApiContracts).toBe(true);
    expect(apiCapabilities.strategyReviewExportAuditReportSelectorViewModelApiContractNetworkAccess).toBe(
      false,
    );
  });
});

describe('Phase 51 — fixtures and Phase 50 linkage', () => {
  it('has one detail contract per Phase 50 selector view model and all summary/list coverage', () => {
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_PHASE).toBe(50);
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_DETAIL_API_CONTRACTS).toHaveLength(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODELS.length,
    );
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_LIST_API_CONTRACT.data).toHaveLength(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODELS.length,
    );
    expect(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_SUMMARY_API_CONTRACT.data
        .totalSelectorViewModels,
    ).toBe(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODELS.length);
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_ERROR_API_CONTRACTS).toHaveLength(2);
  });

  it('names, IDs, map, and list/get helpers are deterministic and unique', () => {
    const names = STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_API_CONTRACTS.map(
      contract => contract.contractName,
    );
    const ids = STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_API_CONTRACTS.map(
      contract => contract.contractId,
    );

    expect(new Set(names).size).toBe(names.length);
    expect(new Set(ids).size).toBe(ids.length);

    expect(listStrategyReviewExportAuditReportSelectorViewModelApiContracts()).toEqual(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_API_CONTRACTS,
    );
    expect(listRootSelectorViewModelApiContracts()).toEqual(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_API_CONTRACTS,
    );

    const listContract = STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_LIST_API_CONTRACT;
    expect(getStrategyReviewExportAuditReportSelectorViewModelApiContract(listContract.contractName)).toBe(
      listContract,
    );
    expect(getStrategyReviewExportAuditReportSelectorViewModelApiContract('unknown')).toBeNull();

    const firstViewModelId = STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODELS[0]!.viewModelId;
    const detail = getStrategyReviewExportAuditReportSelectorViewModelDetailApiContractBySourceViewModelId(
      firstViewModelId,
    );
    expect(detail).toBeDefined();
    expect(detail?.sourceSelectorViewModelIds[0]).toBe(firstViewModelId);

    for (const contract of STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_API_CONTRACTS) {
      expect(
        STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_API_CONTRACT_MAP.get(contract.contractName),
      ).toBe(contract);
    }
  });

  it('list and summary include all Phase 50 selector view models and source linkage is valid', () => {
    const expectedIds = new Set(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODELS.map(model => model.viewModelId),
    );

    const listSourceIds =
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_LIST_API_CONTRACT.sourceSelectorViewModelIds;
    expect(new Set(listSourceIds)).toEqual(expectedIds);

    const summarySourceIds =
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_SUMMARY_API_CONTRACT.sourceSelectorViewModelIds;
    expect(new Set(summarySourceIds)).toEqual(expectedIds);

    const detailCounts = new Map<string, number>();
    for (const detailContract of STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_DETAIL_API_CONTRACTS) {
      const viewModelId = detailContract.sourceSelectorViewModelIds[0];
      detailCounts.set(viewModelId, (detailCounts.get(viewModelId) ?? 0) + 1);

      const source = STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODELS.find(
        model => model.viewModelId === viewModelId,
      );
      expect(source).toBeDefined();
      expect(detailContract.sourceSelectorIds[0]).toBe(source?.sourceSelectorId);
      expect([...detailContract.sourceContractIds].sort()).toEqual([
        ...(source?.sourceContractIds ?? []),
      ].sort());
    }

    for (const selectorViewModelId of expectedIds) {
      expect(detailCounts.get(selectorViewModelId)).toBe(1);
    }

    for (const item of STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_LIST_API_CONTRACT.data) {
      expect(expectedIds.has(item.selectorViewModelId)).toBe(true);
    }
  });
});

describe('Phase 51 — builders, normalization, serialization, and equality', () => {
  it('builds deterministic list/detail/summary/error API contracts', () => {
    const listA = buildStrategyReviewExportAuditReportSelectorViewModelListApiContract(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODELS,
    );
    const listB = buildStrategyReviewExportAuditReportSelectorViewModelListApiContract(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODELS,
    );
    expect(listA).toEqual(listB);
    expect(listA.contractKind).toBe('list');

    const firstViewModel = STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODELS[0]!;
    const detailA = buildStrategyReviewExportAuditReportSelectorViewModelDetailApiContract(firstViewModel);
    const detailB = buildStrategyReviewExportAuditReportSelectorViewModelDetailApiContract(firstViewModel);
    expect(detailA).toEqual(detailB);
    expect(detailA.contractKind).toBe('detail');

    const summary = buildStrategyReviewExportAuditReportSelectorViewModelSummaryApiContract(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODELS,
    );
    expect(summary.contractKind).toBe('summary');
    expect(summary.data.totalSelectorViewModels).toBe(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODELS.length,
    );

    const error = buildStrategyReviewExportAuditReportSelectorViewModelErrorApiContract({
      contractName:
        'strategy-review-export-audit-report-selector-view-model-error-invalid-id-api-contract',
      statusCode: 422,
      errorCode: 'SAMPLE_ERROR_CODE',
      errorMessage: 'Deterministic fixture error only.',
      endpointPattern:
        '/api/v1/strategy-review-export-audit-report-selector-view-model-contracts/:selectorViewModelId',
      details: 'No runtime request handling is performed.',
    });
    expect(error.contractKind).toBe('error');
    expect(error.statusCode).toBe(422);

    const generic = buildStrategyReviewExportAuditReportSelectorViewModelApiContract({
      kind: 'detail',
      selectorViewModel: firstViewModel,
    });
    expect(generic.contractKind).toBe('detail');
  });

  it('normalization, serialization, equality, and guard helpers are stable', () => {
    const base = STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_LIST_API_CONTRACT;
    const scrambled = {
      ...clone(base),
      sourceSelectorViewModelIds: [...base.sourceSelectorViewModelIds].reverse(),
      sourceSelectorIds: [...base.sourceSelectorIds].reverse(),
      sourceContractIds: [...base.sourceContractIds].reverse(),
      data: [...base.data].reverse(),
      filters: [...base.filters].reverse(),
      sorts: [...base.sorts].reverse(),
    };

    expect(normalizeStrategyReviewExportAuditReportSelectorViewModelApiContract(scrambled)).toEqual(
      normalizeStrategyReviewExportAuditReportSelectorViewModelApiContract(base),
    );
    expect(areStrategyReviewExportAuditReportSelectorViewModelApiContractsEqual(scrambled, base)).toBe(
      true,
    );
    expect(serializeStrategyReviewExportAuditReportSelectorViewModelApiContract(scrambled)).toBe(
      serializeStrategyReviewExportAuditReportSelectorViewModelApiContract(base),
    );

    expect(isValidStrategyReviewExportAuditReportSelectorViewModelApiContractName(base.contractName)).toBe(
      true,
    );
    expect(isValidStrategyReviewExportAuditReportSelectorViewModelApiContractName('bad')).toBe(false);
    expect(isValidStrategyReviewExportAuditReportSelectorViewModelApiContractKind(base.contractKind)).toBe(
      true,
    );
    expect(isValidStrategyReviewExportAuditReportSelectorViewModelApiContractKind('bad')).toBe(false);
    expect(
      isValidStrategyReviewExportAuditReportSelectorViewModelApiContractGeneratedAt(
        PHASE_51_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_API_CONTRACT_GENERATED_AT,
      ),
    ).toBe(true);
    expect(
      isValidStrategyReviewExportAuditReportSelectorViewModelApiContractSource(
        PHASE_51_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_API_CONTRACT_SOURCE,
      ),
    ).toBe(true);
    expect(stableDeterministicSelectorViewModelApiContractChecksum('phase51')).toBe(
      stableDeterministicSelectorViewModelApiContractChecksum('phase51'),
    );
  });
});

describe('Phase 51 — validation, safety rejection, and immutability', () => {
  it('all prebuilt contracts validate and pass safety checks', () => {
    for (const contract of STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_API_CONTRACTS) {
      expect(validateStrategyReviewExportAuditReportSelectorViewModelApiContract(contract).valid).toBe(true);
      expect(validateStrategyReviewExportAuditReportSelectorViewModelApiContractSafety(contract).safe).toBe(
        true,
      );
    }
  });

  it('rejects structural corruption and unsafe capability flips', () => {
    const invalidPhase = {
      ...clone(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_LIST_API_CONTRACT),
      phase: 999,
    };
    expect(validateStrategyReviewExportAuditReportSelectorViewModelApiContract(invalidPhase).valid).toBe(
      false,
    );

    const missingSource = {
      ...clone(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_LIST_API_CONTRACT),
      sourceSelectorViewModelIds:
        STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_LIST_API_CONTRACT.sourceSelectorViewModelIds.slice(
          1,
        ),
    };
    expect(validateStrategyReviewExportAuditReportSelectorViewModelApiContract(missingSource).valid).toBe(
      false,
    );

    const invalidCapabilities = {
      ...clone(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_SUMMARY_API_CONTRACT),
      capabilityFlags: {
        ...clone(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_SUMMARY_API_CONTRACT.capabilityFlags),
        strategyReviewExportAuditReportSelectorViewModelApiContractExecution: true,
      },
    };
    expect(
      validateStrategyReviewExportAuditReportSelectorViewModelApiContract(invalidCapabilities).valid,
    ).toBe(false);
  });

  it('rejects unsafe content and does not mutate Phase 50 selector view-model sources', () => {
    const unsafe = {
      ...clone(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_LIST_API_CONTRACT),
      unsafeText: 'https://unsafe.example privateKey signTransaction fetch( )',
    };
    const safety = validateStrategyReviewExportAuditReportSelectorViewModelApiContractSafety(unsafe);
    expect(safety.safe).toBe(false);
    expect(safety.violations.length).toBeGreaterThan(0);
    expect(validateStrategyReviewExportAuditReportSelectorViewModelApiContract(unsafe).valid).toBe(false);

    const source = STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODELS[0]!;
    const before = serializeStrategyReviewExportAuditReportSelectorViewModel(source);
    buildStrategyReviewExportAuditReportSelectorViewModelDetailApiContract(source);
    const after = serializeStrategyReviewExportAuditReportSelectorViewModel(source);
    expect(after).toBe(before);
  });

  it('detail contracts reference exactly one valid source selector view model', () => {
    for (const detailContract of STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_DETAIL_API_CONTRACTS) {
      expect(detailContract.sourceSelectorViewModelIds).toHaveLength(1);
      const sourceId = detailContract.sourceSelectorViewModelIds[0];
      const sourceName = detailContract.data.selectorViewModel.viewModelName;
      expect(sourceId).toBe(detailContract.data.selectorViewModel.viewModelId);
      expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_MAP.get(sourceName)).toBeDefined();
    }
  });

  it('summary and error contracts maintain envelope and limitation/non-goal semantics', () => {
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_SUMMARY_API_CONTRACT.success).toBe(true);
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_SUMMARY_API_CONTRACT.error).toBeNull();

    for (const detailContract of STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_DETAIL_API_CONTRACTS) {
      expect(detailContract.data.limitationItems.length).toBeGreaterThan(0);
      expect(detailContract.data.nextPhaseNotes.length).toBeGreaterThan(0);
      expect(detailContract.data.limitationItems.join(' ')).toMatch(/No route handlers|No runtime requests|No real endpoints/i);
    }

    for (const errorContract of STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_ERROR_API_CONTRACTS) {
      expect(errorContract.success).toBe(false);
      expect(errorContract.data).toBeNull();
      expect([404, 422]).toContain(errorContract.statusCode);
      expect(errorContract.error.fixtureOnly).toBe(true);
    }
  });
});

describe('Phase 51 — source structure and unsafe implementation pattern absence', () => {
  it('all Phase 51 source files exist', () => {
    for (const file of PHASE_51_FILES) {
      const content = readFileSync(resolve(PHASE_51_SRC, file), 'utf-8');
      expect(content.length).toBeGreaterThan(0);
    }
  });

  it('does not use Date.now, new Date, Math.random, random UUID, env, or timers', () => {
    for (const file of PHASE_51_FILES) {
      const content = readFileSync(resolve(PHASE_51_SRC, file), 'utf-8');
      expect(content).not.toMatch(/Date\.now\(/);
      expect(content).not.toMatch(/new Date\(/);
      expect(content).not.toMatch(/Math\.random\(/);
      expect(content).not.toMatch(/randomUUID\(/);
      expect(content).not.toMatch(/process\.env/);
      expect(content).not.toMatch(/setInterval\(/);
      expect(content).not.toMatch(/setTimeout\(/);
    }
  });

  it('does not contain runtime network/filesystem/server/rendering implementation calls', () => {
    for (const file of PHASE_51_FILES) {
      const content = readFileSync(resolve(PHASE_51_SRC, file), 'utf-8');
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

  it('constants list and map exports stay consistent', () => {
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_API_CONTRACT_NAMES).toEqual(
      expect.arrayContaining([
        'strategy-review-export-audit-report-selector-view-model-list-api-contract',
        'strategy-review-export-audit-report-selector-view-model-summary-api-contract',
        'strategy-review-export-audit-report-selector-view-model-error-not-found-api-contract',
        'strategy-review-export-audit-report-selector-view-model-error-invalid-id-api-contract',
      ]),
    );
    expect(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_DETAIL_API_CONTRACT_MAP.size,
    ).toBe(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SELECTOR_VIEW_MODEL_DETAIL_API_CONTRACTS.length);
  });
});
