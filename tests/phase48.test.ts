/**
 * Phase 48 — Strategy Review Export Audit Report Read-Only API Contracts v1 tests.
 */

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODELS,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_MAP,
  listStrategyReviewExportAuditReportViewModels,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_NAMES,
} from '../apps/dashboard/src/strategy-review-export-audit-report-view-models/index.js';
import {
  // Types/constants
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_PHASE,
  PHASE_48_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_GENERATED_AT,
  PHASE_48_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SOURCE,
  PHASE_48_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_VERSION,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_KINDS,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_NAMES,
  // Fixtures
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACTS,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_MAP,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_DETAIL_API_CONTRACTS,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_DETAIL_API_CONTRACT_MAP,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SUMMARY_API_CONTRACT,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_NOT_FOUND_API_CONTRACT,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_INVALID_ID_API_CONTRACT,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_API_CONTRACTS,
  // Helpers
  listStrategyReviewExportAuditReportApiContracts,
  getStrategyReviewExportAuditReportApiContract,
  getStrategyReviewExportAuditReportDetailApiContractByViewModelId,
  // Builders
  buildStrategyReviewExportAuditReportListApiContract,
  buildStrategyReviewExportAuditReportDetailApiContract,
  buildStrategyReviewExportAuditReportSummaryApiContract,
  buildStrategyReviewExportAuditReportErrorApiContract,
  buildStrategyReviewExportAuditReportApiContract,
  // Normalization/serialization/equality
  normalizeStrategyReviewExportAuditReportApiContract,
  serializeStrategyReviewExportAuditReportApiContract,
  areStrategyReviewExportAuditReportApiContractsEqual,
  isValidStrategyReviewExportAuditReportApiContractName,
  isValidStrategyReviewExportAuditReportApiContractKind,
  isValidStrategyReviewExportAuditReportApiContractGeneratedAt,
  isValidStrategyReviewExportAuditReportApiContractSource,
  stableDeterministicContractChecksum,
  // Validation
  validateStrategyReviewExportAuditReportApiContract,
  validateStrategyReviewExportAuditReportApiContractSafety,
  // Capabilities
  getStrategyReviewExportAuditReportApiContractCapabilities,
} from '../apps/dashboard/src/strategy-review-export-audit-report-contracts/index.js';
import { getDashboardUiShellCapabilities } from '../apps/dashboard/src/capabilities.js';
import { getLocalReadOnlyApiCapabilities } from '../apps/read-only-api/src/capabilities.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const PHASE_48_SRC = resolve(
  REPO_ROOT,
  'apps/dashboard/src/strategy-review-export-audit-report-contracts',
);
const PHASE_48_FILES = ['types.ts', 'capabilities.ts', 'normalization.ts', 'builders.ts', 'fixtures.ts', 'validation.ts', 'index.ts'];

// ─── Constants ────────────────────────────────────────────────────────────────

describe('Phase 48 — constants', () => {
  it('STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_PHASE is 48', () => {
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_PHASE).toBe(48);
  });

  it('PHASE_48_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_GENERATED_AT is a deterministic constant', () => {
    expect(PHASE_48_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_GENERATED_AT).toBe(
      '2026-01-04T00:00:00.000Z',
    );
  });

  it('PHASE_48_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SOURCE is a deterministic constant', () => {
    expect(PHASE_48_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SOURCE).toBe(
      'phase48_strategy_review_export_audit_report_api_contracts_v1',
    );
  });

  it('PHASE_48_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_VERSION is 1.0.0', () => {
    expect(PHASE_48_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_VERSION).toBe('1.0.0');
  });

  it('STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_KINDS contains 4 kinds', () => {
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_KINDS).toHaveLength(4);
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_KINDS).toContain('list');
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_KINDS).toContain('detail');
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_KINDS).toContain('summary');
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_KINDS).toContain('error');
  });

  it('STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_NAMES contains 4 static names', () => {
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_NAMES).toHaveLength(4);
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_NAMES).toContain(
      'strategy-review-export-audit-report-list-contract',
    );
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_NAMES).toContain(
      'strategy-review-export-audit-report-summary-contract',
    );
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_NAMES).toContain(
      'strategy-review-export-audit-report-error-not-found-contract',
    );
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_NAMES).toContain(
      'strategy-review-export-audit-report-error-invalid-id-contract',
    );
  });
});

// ─── Source Phase 47 view model linkage ───────────────────────────────────────

describe('Phase 48 — Phase 47 view model source linkage', () => {
  it('Phase 47 view models are present', () => {
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODELS.length).toBeGreaterThan(0);
  });

  it('there is one detail contract per Phase 47 view model', () => {
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_DETAIL_API_CONTRACTS).toHaveLength(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODELS.length,
    );
  });

  it('list contract includes all Phase 47 view model IDs', () => {
    const listIds = new Set(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT.sourceViewModelIds);
    for (const vm of STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODELS) {
      expect(listIds.has(vm.viewModelId)).toBe(true);
    }
  });

  it('summary contract includes all Phase 47 view model IDs', () => {
    const summaryIds = new Set(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SUMMARY_API_CONTRACT.sourceViewModelIds,
    );
    for (const vm of STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODELS) {
      expect(summaryIds.has(vm.viewModelId)).toBe(true);
    }
  });

  it('each detail contract references exactly one Phase 47 view model', () => {
    for (const contract of STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_DETAIL_API_CONTRACTS) {
      expect(contract.sourceViewModelIds).toHaveLength(1);
      const vmId = contract.sourceViewModelIds[0];
      expect(typeof vmId).toBe('string');
      const found = STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODELS.some(
        vm => vm.viewModelId === vmId,
      );
      expect(found).toBe(true);
    }
  });

  it('detail contract map keys match Phase 47 view model IDs', () => {
    for (const vm of STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODELS) {
      expect(
        STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_DETAIL_API_CONTRACT_MAP.has(vm.viewModelId),
      ).toBe(true);
    }
  });

  it('each detail contract data preserves Phase 47 view model fields', () => {
    for (const vm of STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODELS) {
      const contract = STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_DETAIL_API_CONTRACT_MAP.get(vm.viewModelId);
      expect(contract).toBeDefined();
      if (!contract) continue;
      expect(contract.data.viewModelId).toBe(vm.viewModelId);
      expect(contract.data.viewModelName).toBe(vm.viewModelName);
      expect(contract.data.viewModelKind).toBe(vm.viewModelKind);
      expect(contract.data.sourceReportId).toBe(vm.sourceReportId);
      expect(contract.data.sourceReportName).toBe(vm.sourceReportName);
      expect(contract.data.sourceAuditId).toBe(vm.sourceAuditId);
      expect(contract.data.sourceAuditName).toBe(vm.sourceAuditName);
      expect(contract.data.displayTitle).toBe(vm.displayTitle);
      expect(contract.data.statusLabel).toBe(vm.statusLabel);
      expect(contract.data.severityLabel).toBe(vm.severityLabel);
    }
  });
});

// ─── Fixtures ─────────────────────────────────────────────────────────────────

describe('Phase 48 — fixtures', () => {
  it('STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACTS is an array', () => {
    expect(Array.isArray(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACTS)).toBe(true);
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACTS.length).toBeGreaterThan(0);
  });

  it('total contract count = 1 list + N detail + 1 summary + 2 error', () => {
    const expectedCount =
      1 +
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODELS.length +
      1 +
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_API_CONTRACTS.length;
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACTS).toHaveLength(expectedCount);
  });

  it('STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_MAP has unique contract names', () => {
    const names = STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACTS.map(c => c.contractName);
    const uniqueNames = new Set(names);
    expect(uniqueNames.size).toBe(names.length);
  });

  it('STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_MAP covers all contracts', () => {
    for (const contract of STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACTS) {
      expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_MAP.has(contract.contractName)).toBe(true);
    }
  });

  it('contract IDs are unique', () => {
    const ids = STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACTS.map(c => c.contractId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('error contracts have empty source arrays', () => {
    for (const contract of STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_API_CONTRACTS) {
      expect(contract.sourceViewModelIds).toHaveLength(0);
      expect(contract.sourceReportIds).toHaveLength(0);
      expect(contract.sourceAuditIds).toHaveLength(0);
    }
  });
});

// ─── List contract ─────────────────────────────────────────────────────────────

describe('Phase 48 — list contract', () => {
  it('has contractKind "list"', () => {
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT.contractKind).toBe('list');
  });

  it('has contractName "strategy-review-export-audit-report-list-contract"', () => {
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT.contractName).toBe(
      'strategy-review-export-audit-report-list-contract',
    );
  });

  it('has statusCode 200 and success true', () => {
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT.statusCode).toBe(200);
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT.success).toBe(true);
  });

  it('has readOnly and fixtureOnly true', () => {
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT.readOnly).toBe(true);
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT.fixtureOnly).toBe(true);
  });

  it('has correct endpointPattern', () => {
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT.endpointPattern).toBe(
      '/api/v1/strategy-review-export-audit-report-contracts',
    );
  });

  it('has method GET', () => {
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT.method).toBe('GET');
  });

  it('data array length equals number of Phase 47 view models', () => {
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT.data).toHaveLength(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODELS.length,
    );
  });

  it('pagination is valid', () => {
    const pg = STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT.pagination;
    expect(pg).not.toBeNull();
    expect(pg.fixtureOnly).toBe(true);
    expect(pg.totalCount).toBe(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODELS.length);
    expect(pg.page).toBe(1);
    expect(pg.pageCount).toBe(1);
  });

  it('has filters and sorts arrays', () => {
    expect(Array.isArray(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT.filters)).toBe(true);
    expect(Array.isArray(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT.sorts)).toBe(true);
  });

  it('error is null', () => {
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT.error).toBeNull();
  });
});

// ─── Detail contracts ──────────────────────────────────────────────────────────

describe('Phase 48 — detail contracts', () => {
  it('each detail contract has contractKind "detail"', () => {
    for (const c of STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_DETAIL_API_CONTRACTS) {
      expect(c.contractKind).toBe('detail');
    }
  });

  it('each detail contract name starts with expected prefix', () => {
    for (const c of STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_DETAIL_API_CONTRACTS) {
      expect(c.contractName).toMatch(/^strategy-review-export-audit-report-detail-contract-/);
    }
  });

  it('each detail contract has statusCode 200 and success true', () => {
    for (const c of STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_DETAIL_API_CONTRACTS) {
      expect(c.statusCode).toBe(200);
      expect(c.success).toBe(true);
    }
  });

  it('each detail contract has phase 48 in data', () => {
    for (const c of STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_DETAIL_API_CONTRACTS) {
      expect(c.data.phase).toBe(48);
    }
  });

  it('each detail contract has summaryCards, detailSections, evidenceItems', () => {
    for (const c of STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_DETAIL_API_CONTRACTS) {
      expect(Array.isArray(c.data.summaryCards)).toBe(true);
      expect(Array.isArray(c.data.detailSections)).toBe(true);
      expect(Array.isArray(c.data.evidenceItems)).toBe(true);
      expect(Array.isArray(c.data.safetyBadges)).toBe(true);
      expect(Array.isArray(c.data.validationBadges)).toBe(true);
      expect(Array.isArray(c.data.limitationItems)).toBe(true);
      expect(Array.isArray(c.data.nextPhaseNotes)).toBe(true);
    }
  });

  it('evidence items have syntheticOnly:true and liveData:false', () => {
    for (const c of STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_DETAIL_API_CONTRACTS) {
      for (const item of c.data.evidenceItems) {
        expect(item.syntheticOnly).toBe(true);
        expect(item.liveData).toBe(false);
      }
    }
  });
});

// ─── Summary contract ──────────────────────────────────────────────────────────

describe('Phase 48 — summary contract', () => {
  it('has contractKind "summary"', () => {
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SUMMARY_API_CONTRACT.contractKind).toBe('summary');
  });

  it('has contractName "strategy-review-export-audit-report-summary-contract"', () => {
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SUMMARY_API_CONTRACT.contractName).toBe(
      'strategy-review-export-audit-report-summary-contract',
    );
  });

  it('data.totalViewModels matches Phase 47 view model count', () => {
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SUMMARY_API_CONTRACT.data.totalViewModels).toBe(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODELS.length,
    );
  });

  it('data.byStatus, bySeverity, byKind are sorted arrays', () => {
    const data = STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SUMMARY_API_CONTRACT.data;
    expect(Array.isArray(data.byStatus)).toBe(true);
    expect(Array.isArray(data.bySeverity)).toBe(true);
    expect(Array.isArray(data.byKind)).toBe(true);
  });

  it('data.sourcePhases includes 44, 45, 46, 47, 48', () => {
    const phases = STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SUMMARY_API_CONTRACT.data.sourcePhases;
    expect(phases).toContain(44);
    expect(phases).toContain(45);
    expect(phases).toContain(46);
    expect(phases).toContain(47);
    expect(phases).toContain(48);
  });
});

// ─── Error contracts ───────────────────────────────────────────────────────────

describe('Phase 48 — error contracts', () => {
  it('not-found contract has statusCode 404', () => {
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_NOT_FOUND_API_CONTRACT.statusCode).toBe(404);
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_NOT_FOUND_API_CONTRACT.success).toBe(false);
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_NOT_FOUND_API_CONTRACT.data).toBeNull();
  });

  it('invalid-id contract has statusCode 422', () => {
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_INVALID_ID_API_CONTRACT.statusCode).toBe(422);
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_INVALID_ID_API_CONTRACT.success).toBe(false);
  });

  it('error contracts have fixtureOnly true in error shape', () => {
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_NOT_FOUND_API_CONTRACT.error.fixtureOnly).toBe(
      true,
    );
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_INVALID_ID_API_CONTRACT.error.fixtureOnly).toBe(
      true,
    );
  });

  it('error contracts have contractKind "error"', () => {
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_NOT_FOUND_API_CONTRACT.contractKind).toBe('error');
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_INVALID_ID_API_CONTRACT.contractKind).toBe('error');
  });

  it('there are exactly 2 error contracts', () => {
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_API_CONTRACTS).toHaveLength(2);
  });
});

// ─── Get helpers ───────────────────────────────────────────────────────────────

describe('Phase 48 — get helpers', () => {
  it('listStrategyReviewExportAuditReportApiContracts returns all contracts', () => {
    const list = listStrategyReviewExportAuditReportApiContracts();
    expect(list).toHaveLength(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACTS.length);
  });

  it('getStrategyReviewExportAuditReportApiContract returns correct contract', () => {
    const c = getStrategyReviewExportAuditReportApiContract(
      'strategy-review-export-audit-report-list-contract',
    );
    expect(c).not.toBeNull();
    expect(c?.contractKind).toBe('list');
  });

  it('getStrategyReviewExportAuditReportApiContract returns null for unknown', () => {
    expect(getStrategyReviewExportAuditReportApiContract('nonexistent-contract')).toBeNull();
  });

  it('getStrategyReviewExportAuditReportDetailApiContractByViewModelId returns correct contract', () => {
    const vm = STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODELS[0];
    if (!vm) return;
    const c = getStrategyReviewExportAuditReportDetailApiContractByViewModelId(vm.viewModelId);
    expect(c).not.toBeNull();
    expect(c?.contractKind).toBe('detail');
    expect(c?.data.viewModelId).toBe(vm.viewModelId);
  });

  it('getStrategyReviewExportAuditReportDetailApiContractByViewModelId returns null for unknown', () => {
    expect(getStrategyReviewExportAuditReportDetailApiContractByViewModelId('nonexistent-id')).toBeNull();
  });
});

// ─── Builder helpers ───────────────────────────────────────────────────────────

describe('Phase 48 — builder helpers', () => {
  it('buildStrategyReviewExportAuditReportListApiContract produces a list contract', () => {
    const built = buildStrategyReviewExportAuditReportListApiContract(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODELS,
    );
    expect(built.contractKind).toBe('list');
    expect(built.phase).toBe(48);
    expect(built.readOnly).toBe(true);
    expect(built.fixtureOnly).toBe(true);
    expect(built.data).toHaveLength(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODELS.length);
  });

  it('buildStrategyReviewExportAuditReportDetailApiContract produces a detail contract', () => {
    const vm = STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODELS[0];
    if (!vm) return;
    const built = buildStrategyReviewExportAuditReportDetailApiContract(vm);
    expect(built.contractKind).toBe('detail');
    expect(built.data.viewModelId).toBe(vm.viewModelId);
    expect(built.sourceViewModelIds).toHaveLength(1);
  });

  it('buildStrategyReviewExportAuditReportSummaryApiContract produces a summary contract', () => {
    const built = buildStrategyReviewExportAuditReportSummaryApiContract(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODELS,
    );
    expect(built.contractKind).toBe('summary');
    expect(built.data.totalViewModels).toBe(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODELS.length);
  });

  it('buildStrategyReviewExportAuditReportErrorApiContract produces an error contract', () => {
    const built = buildStrategyReviewExportAuditReportErrorApiContract({
      contractName: 'strategy-review-export-audit-report-error-not-found-contract',
      statusCode: 404,
      errorCode: 'TEST_NOT_FOUND',
      errorMessage: 'Not found in test',
      endpointPattern: '/test',
    });
    expect(built.contractKind).toBe('error');
    expect(built.statusCode).toBe(404);
    expect(built.success).toBe(false);
    expect(built.error.fixtureOnly).toBe(true);
  });

  it('buildStrategyReviewExportAuditReportApiContract dispatches correctly for list', () => {
    const result = buildStrategyReviewExportAuditReportApiContract({
      kind: 'list',
      viewModels: STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODELS,
    });
    expect(result.contractKind).toBe('list');
  });

  it('buildStrategyReviewExportAuditReportApiContract dispatches correctly for detail', () => {
    const vm = STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODELS[0];
    if (!vm) return;
    const result = buildStrategyReviewExportAuditReportApiContract({ kind: 'detail', viewModel: vm });
    expect(result.contractKind).toBe('detail');
  });

  it('buildStrategyReviewExportAuditReportApiContract dispatches correctly for summary', () => {
    const result = buildStrategyReviewExportAuditReportApiContract({
      kind: 'summary',
      viewModels: STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODELS,
    });
    expect(result.contractKind).toBe('summary');
  });

  it('buildStrategyReviewExportAuditReportApiContract dispatches correctly for error', () => {
    const result = buildStrategyReviewExportAuditReportApiContract({
      kind: 'error',
      contractName: 'strategy-review-export-audit-report-error-not-found-contract',
      statusCode: 404,
      errorCode: 'NOT_FOUND',
      errorMessage: 'Not found',
      endpointPattern: '/test',
    });
    expect(result.contractKind).toBe('error');
  });

  it('builders are deterministic (same input → same output)', () => {
    const vm = STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODELS[0];
    if (!vm) return;
    const a = buildStrategyReviewExportAuditReportDetailApiContract(vm);
    const b = buildStrategyReviewExportAuditReportDetailApiContract(vm);
    expect(areStrategyReviewExportAuditReportApiContractsEqual(a, b)).toBe(true);
  });

  it('builders do not mutate source view models', () => {
    const vm = STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODELS[0];
    if (!vm) return;
    const vmId = vm.viewModelId;
    buildStrategyReviewExportAuditReportDetailApiContract(vm);
    expect(vm.viewModelId).toBe(vmId);
  });
});

// ─── Normalization ─────────────────────────────────────────────────────────────

describe('Phase 48 — normalization helpers', () => {
  it('normalizeStrategyReviewExportAuditReportApiContract returns a contract', () => {
    const normalized = normalizeStrategyReviewExportAuditReportApiContract(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT,
    );
    expect(normalized.contractKind).toBe('list');
  });

  it('normalizeStrategyReviewExportAuditReportApiContract sorts list data by viewModelName', () => {
    const normalized = normalizeStrategyReviewExportAuditReportApiContract(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT,
    );
    if (normalized.contractKind === 'list' && normalized.data.length > 1) {
      for (let i = 1; i < normalized.data.length; i++) {
        const prev = normalized.data[i - 1]!.viewModelName;
        const curr = normalized.data[i]!.viewModelName;
        expect(prev.localeCompare(curr) <= 0).toBe(true);
      }
    }
  });

  it('stableDeterministicContractChecksum is stable for same input', () => {
    const seed = 'test-seed';
    expect(stableDeterministicContractChecksum(seed)).toBe(stableDeterministicContractChecksum(seed));
  });

  it('stableDeterministicContractChecksum produces different outputs for different inputs', () => {
    expect(stableDeterministicContractChecksum('a')).not.toBe(
      stableDeterministicContractChecksum('b'),
    );
  });
});

// ─── Serialization ─────────────────────────────────────────────────────────────

describe('Phase 48 — serialization helpers', () => {
  it('serializeStrategyReviewExportAuditReportApiContract returns a string', () => {
    const s = serializeStrategyReviewExportAuditReportApiContract(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT,
    );
    expect(typeof s).toBe('string');
    expect(s.length).toBeGreaterThan(0);
  });

  it('serialization is stable (same input → same output)', () => {
    const a = serializeStrategyReviewExportAuditReportApiContract(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SUMMARY_API_CONTRACT,
    );
    const b = serializeStrategyReviewExportAuditReportApiContract(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SUMMARY_API_CONTRACT,
    );
    expect(a).toBe(b);
  });

  it('serialized output is valid JSON', () => {
    const s = serializeStrategyReviewExportAuditReportApiContract(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_NOT_FOUND_API_CONTRACT,
    );
    expect(() => JSON.parse(s)).not.toThrow();
  });
});

// ─── Equality ──────────────────────────────────────────────────────────────────

describe('Phase 48 — equality helpers', () => {
  it('same contract equals itself', () => {
    expect(
      areStrategyReviewExportAuditReportApiContractsEqual(
        STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT,
        STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT,
      ),
    ).toBe(true);
  });

  it('list contract does not equal summary contract', () => {
    expect(
      areStrategyReviewExportAuditReportApiContractsEqual(
        STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT,
        STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SUMMARY_API_CONTRACT,
      ),
    ).toBe(false);
  });
});

// ─── Validation — success cases ────────────────────────────────────────────────

describe('Phase 48 — validation success cases', () => {
  it('list contract passes validation', () => {
    const result = validateStrategyReviewExportAuditReportApiContract(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT,
    );
    expect(result.valid).toBe(true);
    expect(result.issues).toHaveLength(0);
  });

  it('summary contract passes validation', () => {
    const result = validateStrategyReviewExportAuditReportApiContract(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SUMMARY_API_CONTRACT,
    );
    expect(result.valid).toBe(true);
  });

  it('error not-found contract passes validation', () => {
    const result = validateStrategyReviewExportAuditReportApiContract(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_NOT_FOUND_API_CONTRACT,
    );
    expect(result.valid).toBe(true);
  });

  it('error invalid-id contract passes validation', () => {
    const result = validateStrategyReviewExportAuditReportApiContract(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_INVALID_ID_API_CONTRACT,
    );
    expect(result.valid).toBe(true);
  });

  it('all detail contracts pass validation', () => {
    for (const contract of STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_DETAIL_API_CONTRACTS) {
      const result = validateStrategyReviewExportAuditReportApiContract(contract);
      expect(result.valid).toBe(true);
    }
  });
});

// ─── Validation — failure cases ────────────────────────────────────────────────

describe('Phase 48 — validation failure cases', () => {
  it('rejects null input', () => {
    const result = validateStrategyReviewExportAuditReportApiContract(null);
    expect(result.valid).toBe(false);
  });

  it('rejects non-object input', () => {
    const result = validateStrategyReviewExportAuditReportApiContract('bad');
    expect(result.valid).toBe(false);
  });

  it('rejects contract with wrong phase', () => {
    const corrupted = { ...STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT, phase: 99 };
    const result = validateStrategyReviewExportAuditReportApiContract(corrupted);
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.code === 'INVALID_PHASE')).toBe(true);
  });

  it('rejects contract with readOnly:false', () => {
    const corrupted = { ...STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT, readOnly: false };
    const result = validateStrategyReviewExportAuditReportApiContract(corrupted);
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.code === 'INVALID_READ_ONLY')).toBe(true);
  });

  it('rejects contract with fixtureOnly:false', () => {
    const corrupted = {
      ...STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT,
      fixtureOnly: false,
    };
    const result = validateStrategyReviewExportAuditReportApiContract(corrupted);
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.code === 'INVALID_FIXTURE_ONLY')).toBe(true);
  });

  it('rejects contract with invalid contractKind', () => {
    const corrupted = { ...STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT, contractKind: 'live' };
    const result = validateStrategyReviewExportAuditReportApiContract(corrupted);
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.code === 'INVALID_CONTRACT_KIND')).toBe(true);
  });

  it('rejects contract with invalid contractId', () => {
    const corrupted = { ...STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT, contractId: '' };
    const result = validateStrategyReviewExportAuditReportApiContract(corrupted);
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.code === 'INVALID_CONTRACT_ID')).toBe(true);
  });

  it('rejects contract with method POST', () => {
    const corrupted = { ...STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT, method: 'POST' };
    const result = validateStrategyReviewExportAuditReportApiContract(corrupted);
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.code === 'INVALID_METHOD')).toBe(true);
  });

  it('rejects list contract with success:false', () => {
    const corrupted = { ...STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT, success: false };
    const result = validateStrategyReviewExportAuditReportApiContract(corrupted);
    expect(result.valid).toBe(false);
  });

  it('rejects error contract with non-null data', () => {
    const corrupted = {
      ...STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_ERROR_NOT_FOUND_API_CONTRACT,
      data: { some: 'data' },
    };
    const result = validateStrategyReviewExportAuditReportApiContract(corrupted);
    expect(result.valid).toBe(false);
  });

  it('rejects contract with liveData:true in meta', () => {
    const corrupted = {
      ...STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT,
      meta: { ...STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT.meta, liveData: true },
    };
    const result = validateStrategyReviewExportAuditReportApiContract(corrupted);
    expect(result.valid).toBe(false);
  });
});

// ─── Safety validation ─────────────────────────────────────────────────────────

describe('Phase 48 — safety validation', () => {
  it('list contract passes safety validation', () => {
    const result = validateStrategyReviewExportAuditReportApiContractSafety(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT,
    );
    expect(result.safe).toBe(true);
    expect(result.violations).toHaveLength(0);
  });

  it('all contracts pass safety validation', () => {
    for (const contract of STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACTS) {
      const result = validateStrategyReviewExportAuditReportApiContractSafety(contract);
      expect(result.safe).toBe(true);
    }
  });
});

// ─── Normalization guard helpers ───────────────────────────────────────────────

describe('Phase 48 — normalization guard helpers', () => {
  it('isValidStrategyReviewExportAuditReportApiContractName accepts valid names', () => {
    expect(
      isValidStrategyReviewExportAuditReportApiContractName(
        'strategy-review-export-audit-report-list-contract',
      ),
    ).toBe(true);
    expect(
      isValidStrategyReviewExportAuditReportApiContractName(
        'strategy-review-export-audit-report-detail-contract-some-id',
      ),
    ).toBe(true);
  });

  it('isValidStrategyReviewExportAuditReportApiContractName rejects invalid names', () => {
    expect(isValidStrategyReviewExportAuditReportApiContractName('')).toBe(false);
    expect(isValidStrategyReviewExportAuditReportApiContractName(42)).toBe(false);
    expect(isValidStrategyReviewExportAuditReportApiContractName('random-name')).toBe(false);
  });

  it('isValidStrategyReviewExportAuditReportApiContractKind accepts valid kinds', () => {
    expect(isValidStrategyReviewExportAuditReportApiContractKind('list')).toBe(true);
    expect(isValidStrategyReviewExportAuditReportApiContractKind('detail')).toBe(true);
    expect(isValidStrategyReviewExportAuditReportApiContractKind('summary')).toBe(true);
    expect(isValidStrategyReviewExportAuditReportApiContractKind('error')).toBe(true);
  });

  it('isValidStrategyReviewExportAuditReportApiContractKind rejects invalid kinds', () => {
    expect(isValidStrategyReviewExportAuditReportApiContractKind('live')).toBe(false);
    expect(isValidStrategyReviewExportAuditReportApiContractKind('')).toBe(false);
    expect(isValidStrategyReviewExportAuditReportApiContractKind(null)).toBe(false);
  });

  it('isValidStrategyReviewExportAuditReportApiContractGeneratedAt accepts constant', () => {
    expect(
      isValidStrategyReviewExportAuditReportApiContractGeneratedAt('2026-01-04T00:00:00.000Z'),
    ).toBe(true);
  });

  it('isValidStrategyReviewExportAuditReportApiContractGeneratedAt rejects dynamic values', () => {
    expect(isValidStrategyReviewExportAuditReportApiContractGeneratedAt('2026-01-05T00:00:00.000Z')).toBe(
      false,
    );
    expect(isValidStrategyReviewExportAuditReportApiContractGeneratedAt(null)).toBe(false);
  });

  it('isValidStrategyReviewExportAuditReportApiContractSource accepts constant', () => {
    expect(
      isValidStrategyReviewExportAuditReportApiContractSource(
        'phase48_strategy_review_export_audit_report_api_contracts_v1',
      ),
    ).toBe(true);
  });
});

// ─── Capability flags ──────────────────────────────────────────────────────────

describe('Phase 48 — capability flags', () => {
  it('getStrategyReviewExportAuditReportApiContractCapabilities returns correct positive flags', () => {
    const caps = getStrategyReviewExportAuditReportApiContractCapabilities();
    expect(caps.strategyReviewExportAuditReportApiContracts).toBe(true);
    expect(caps.syntheticStrategyReviewExportAuditReportApiContracts).toBe(true);
    expect(caps.deterministicStrategyReviewExportAuditReportApiContracts).toBe(true);
    expect(caps.localOnlyStrategyReviewExportAuditReportApiContracts).toBe(true);
    expect(caps.readOnlyStrategyReviewExportAuditReportApiContracts).toBe(true);
    expect(caps.fixtureDerivedStrategyReviewExportAuditReportApiContracts).toBe(true);
  });

  it('getStrategyReviewExportAuditReportApiContractCapabilities returns correct negative flags', () => {
    const caps = getStrategyReviewExportAuditReportApiContractCapabilities();
    expect(caps.strategyReviewExportAuditReportApiContractLiveData).toBe(false);
    expect(caps.strategyReviewExportAuditReportApiContractNetworkAccess).toBe(false);
    expect(caps.strategyReviewExportAuditReportApiContractPersistence).toBe(false);
    expect(caps.strategyReviewExportAuditReportApiContractFilesystemWrites).toBe(false);
    expect(caps.strategyReviewExportAuditReportApiContractDownloads).toBe(false);
    expect(caps.strategyReviewExportAuditReportApiContractPdfGeneration).toBe(false);
    expect(caps.strategyReviewExportAuditReportApiContractCsvGeneration).toBe(false);
    expect(caps.strategyReviewExportAuditReportApiContractHtmlGeneration).toBe(false);
    expect(caps.strategyReviewExportAuditReportApiContractRouteHandlers).toBe(false);
    expect(caps.strategyReviewExportAuditReportApiContractHttpServer).toBe(false);
    expect(caps.strategyReviewExportAuditReportApiContractRuntimeRequests).toBe(false);
    expect(caps.strategyReviewExportAuditReportApiContractUiRendering).toBe(false);
    expect(caps.strategyReviewExportAuditReportApiContractDomAccess).toBe(false);
    expect(caps.strategyReviewExportAuditReportApiContractBackgroundJobs).toBe(false);
    expect(caps.strategyReviewExportAuditReportApiContractScheduledJobs).toBe(false);
    expect(caps.strategyReviewExportAuditReportApiContractExecution).toBe(false);
    expect(caps.strategyReviewExportAuditReportApiContractTradingSignals).toBe(false);
    expect(caps.strategyReviewExportAuditReportApiContractRecommendations).toBe(false);
    expect(caps.strategyReviewExportAuditReportApiContractInvestmentAdvice).toBe(false);
  });
});

// ─── Dashboard capability propagation ─────────────────────────────────────────

describe('Phase 48 — dashboard capability propagation', () => {
  it('getDashboardUiShellCapabilities includes Phase 48 positive flags', () => {
    const caps = getDashboardUiShellCapabilities();
    expect(caps.strategyReviewExportAuditReportApiContracts).toBe(true);
    expect(caps.syntheticStrategyReviewExportAuditReportApiContracts).toBe(true);
    expect(caps.deterministicStrategyReviewExportAuditReportApiContracts).toBe(true);
    expect(caps.localOnlyStrategyReviewExportAuditReportApiContracts).toBe(true);
    expect(caps.readOnlyStrategyReviewExportAuditReportApiContracts).toBe(true);
    expect(caps.fixtureDerivedStrategyReviewExportAuditReportApiContracts).toBe(true);
  });

  it('getDashboardUiShellCapabilities includes Phase 48 negative flags', () => {
    const caps = getDashboardUiShellCapabilities();
    expect(caps.strategyReviewExportAuditReportApiContractLiveData).toBe(false);
    expect(caps.strategyReviewExportAuditReportApiContractNetworkAccess).toBe(false);
    expect(caps.strategyReviewExportAuditReportApiContractPersistence).toBe(false);
    expect(caps.strategyReviewExportAuditReportApiContractFilesystemWrites).toBe(false);
    expect(caps.strategyReviewExportAuditReportApiContractDownloads).toBe(false);
    expect(caps.strategyReviewExportAuditReportApiContractRouteHandlers).toBe(false);
    expect(caps.strategyReviewExportAuditReportApiContractHttpServer).toBe(false);
    expect(caps.strategyReviewExportAuditReportApiContractExecution).toBe(false);
    expect(caps.strategyReviewExportAuditReportApiContractTradingSignals).toBe(false);
    expect(caps.strategyReviewExportAuditReportApiContractRecommendations).toBe(false);
    expect(caps.strategyReviewExportAuditReportApiContractInvestmentAdvice).toBe(false);
  });
});

// ─── Read-only API capability propagation ─────────────────────────────────────

describe('Phase 48 — read-only API capability propagation', () => {
  it('getLocalReadOnlyApiCapabilities includes Phase 48 positive flags', () => {
    const caps = getLocalReadOnlyApiCapabilities();
    expect(caps.strategyReviewExportAuditReportApiContracts).toBe(true);
    expect(caps.syntheticStrategyReviewExportAuditReportApiContracts).toBe(true);
    expect(caps.deterministicStrategyReviewExportAuditReportApiContracts).toBe(true);
    expect(caps.localOnlyStrategyReviewExportAuditReportApiContracts).toBe(true);
    expect(caps.readOnlyStrategyReviewExportAuditReportApiContracts).toBe(true);
    expect(caps.fixtureDerivedStrategyReviewExportAuditReportApiContracts).toBe(true);
  });

  it('getLocalReadOnlyApiCapabilities includes Phase 48 negative flags', () => {
    const caps = getLocalReadOnlyApiCapabilities();
    expect(caps.strategyReviewExportAuditReportApiContractLiveData).toBe(false);
    expect(caps.strategyReviewExportAuditReportApiContractNetworkAccess).toBe(false);
    expect(caps.strategyReviewExportAuditReportApiContractPersistence).toBe(false);
    expect(caps.strategyReviewExportAuditReportApiContractExecution).toBe(false);
    expect(caps.strategyReviewExportAuditReportApiContractTradingSignals).toBe(false);
    expect(caps.strategyReviewExportAuditReportApiContractRecommendations).toBe(false);
    expect(caps.strategyReviewExportAuditReportApiContractInvestmentAdvice).toBe(false);
  });
});

// ─── Source file structure ─────────────────────────────────────────────────────

describe('Phase 48 — source file structure', () => {
  it('all Phase 48 source files exist', () => {
    for (const file of PHASE_48_FILES) {
      const content = readFileSync(resolve(PHASE_48_SRC, file), 'utf-8');
      expect(content.length).toBeGreaterThan(0);
    }
  });

  it('index.ts re-exports all required modules', () => {
    const content = readFileSync(resolve(PHASE_48_SRC, 'index.ts'), 'utf-8');
    expect(content).toContain("from './types.js'");
    expect(content).toContain("from './capabilities.js'");
    expect(content).toContain("from './normalization.js'");
    expect(content).toContain("from './builders.js'");
    expect(content).toContain("from './fixtures.js'");
    expect(content).toContain("from './validation.js'");
  });
});

// ─── Metadata/envelope integrity ──────────────────────────────────────────────

describe('Phase 48 — metadata/envelope integrity', () => {
  it('all contracts have correct meta.phase', () => {
    for (const c of STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACTS) {
      expect(c.meta.phase).toBe(48);
    }
  });

  it('all contracts have deterministic meta.generatedAt', () => {
    for (const c of STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACTS) {
      expect(c.meta.generatedAt).toBe('2026-01-04T00:00:00.000Z');
    }
  });

  it('all contracts have correct meta.source', () => {
    for (const c of STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACTS) {
      expect(c.meta.source).toBe('phase48_strategy_review_export_audit_report_api_contracts_v1');
    }
  });

  it('all contracts have meta.fixtureOnly:true, meta.readOnly:true', () => {
    for (const c of STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACTS) {
      expect(c.meta.fixtureOnly).toBe(true);
      expect(c.meta.readOnly).toBe(true);
    }
  });

  it('all contracts have meta safety flags as false', () => {
    for (const c of STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACTS) {
      expect(c.meta.liveData).toBe(false);
      expect(c.meta.networkAccess).toBe(false);
      expect(c.meta.persistence).toBe(false);
      expect(c.meta.execution).toBe(false);
      expect(c.meta.recommendations).toBe(false);
      expect(c.meta.tradingSignals).toBe(false);
      expect(c.meta.investmentAdvice).toBe(false);
    }
  });
});

// ─── Safety envelope integrity ─────────────────────────────────────────────────

describe('Phase 48 — safety envelope integrity', () => {
  it('all contracts have safety envelope with required true flags', () => {
    const requiredTrue = [
      'fixtureOnly', 'syntheticOnly', 'deterministic', 'localOnly', 'readOnly',
      'nonExecutable', 'nonAdvisory', 'noLiveData', 'noNetworkAccess', 'noPersistence',
      'noFilesystemWrites', 'noDownloads', 'noPdfGeneration', 'noCsvGeneration',
      'noHtmlGeneration', 'noUiRendering', 'noDomAccess', 'noBackgroundJobs',
      'noScheduledJobs', 'noRouteHandlers', 'noHttpServer', 'noRuntimeRequests',
    ] as const;
    for (const c of STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACTS) {
      for (const key of requiredTrue) {
        expect(c.safety[key]).toBe(true);
      }
    }
  });
});

// ─── Determinism ───────────────────────────────────────────────────────────────

describe('Phase 48 — determinism', () => {
  it('building list contract twice produces identical results', () => {
    const a = buildStrategyReviewExportAuditReportListApiContract(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODELS,
    );
    const b = buildStrategyReviewExportAuditReportListApiContract(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODELS,
    );
    expect(areStrategyReviewExportAuditReportApiContractsEqual(a, b)).toBe(true);
  });

  it('building summary contract twice produces identical results', () => {
    const a = buildStrategyReviewExportAuditReportSummaryApiContract(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODELS,
    );
    const b = buildStrategyReviewExportAuditReportSummaryApiContract(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODELS,
    );
    expect(areStrategyReviewExportAuditReportApiContractsEqual(a, b)).toBe(true);
  });

  it('prebuilt fixture matches freshly built contract', () => {
    const fresh = buildStrategyReviewExportAuditReportListApiContract(
      listStrategyReviewExportAuditReportViewModels(),
    );
    expect(
      areStrategyReviewExportAuditReportApiContractsEqual(
        STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_LIST_API_CONTRACT,
        fresh,
      ),
    ).toBe(true);
  });
});

// ─── No unsafe behavior ────────────────────────────────────────────────────────

describe('Phase 48 — no unsafe behavior', () => {
  it('does not use Date.now or new Date for fixture generation', () => {
    for (const file of PHASE_48_FILES) {
      const content = readFileSync(resolve(PHASE_48_SRC, file), 'utf-8');
      expect(content).not.toMatch(/Date\.now\(\)/);
      expect(content).not.toMatch(/new Date\(\)/);
    }
  });

  it('does not use Math.random', () => {
    for (const file of PHASE_48_FILES) {
      const content = readFileSync(resolve(PHASE_48_SRC, file), 'utf-8');
      expect(content).not.toMatch(/Math\.random\(\)/);
    }
  });

  it('does not use randomUUID', () => {
    for (const file of PHASE_48_FILES) {
      if (file === 'validation.ts') continue; // validation.ts legitimately references these in safety regex patterns
      const content = readFileSync(resolve(PHASE_48_SRC, file), 'utf-8');
      expect(content).not.toMatch(/randomUUID\(/);
    }
  });

  it('does not contain network fetch calls in fixture files', () => {
    const fixtureContent = readFileSync(resolve(PHASE_48_SRC, 'fixtures.ts'), 'utf-8');
    expect(fixtureContent).not.toMatch(/\bfetch\(/);
    expect(fixtureContent).not.toMatch(/\baxios\b/);
    expect(fixtureContent).not.toMatch(/\bWebSocket\b/);
  });

  it('does not contain filesystem write calls', () => {
    for (const file of PHASE_48_FILES) {
      if (file === 'validation.ts') continue; // validation.ts legitimately references these in safety regex patterns
      const content = readFileSync(resolve(PHASE_48_SRC, file), 'utf-8');
      expect(content).not.toMatch(/\bfs\.(write|append|create)/);
      expect(content).not.toMatch(/\bwriteFile\b/);
      expect(content).not.toMatch(/\bcreateWriteStream\b/);
    }
  });

  it('does not contain route handler or server patterns', () => {
    for (const file of PHASE_48_FILES) {
      const content = readFileSync(resolve(PHASE_48_SRC, file), 'utf-8');
      expect(content).not.toMatch(/\bfastify\b/);
      expect(content).not.toMatch(/app\.(get|post|put|delete|patch)\(/);
    }
  });
});

// ─── Limitation/non-goal text ──────────────────────────────────────────────────

describe('Phase 48 — limitation text in source files', () => {
  it('types.ts contains architectural/safety note', () => {
    const content = readFileSync(resolve(PHASE_48_SRC, 'types.ts'), 'utf-8');
    expect(content.toLowerCase()).toMatch(
      /no real endpoint|fixture.derived|read.only|no route handler/i,
    );
  });

  it('builders.ts contains safety notes', () => {
    const content = readFileSync(resolve(PHASE_48_SRC, 'builders.ts'), 'utf-8');
    expect(content.toLowerCase()).toMatch(/no side effect|no network|no filesystem/i);
  });
});

// ─── View model name linkage ───────────────────────────────────────────────────

describe('Phase 48 — view model name linkage', () => {
  it('STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_NAMES count matches detail contract count', () => {
    expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_NAMES.length).toBe(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_DETAIL_API_CONTRACTS.length,
    );
  });

  it('each view model name from Phase 47 appears in a detail contract', () => {
    const contractViewModelIds = new Set(
      STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_DETAIL_API_CONTRACTS.map(c => c.data.viewModelId),
    );
    for (const vm of STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODELS) {
      expect(contractViewModelIds.has(vm.viewModelId)).toBe(true);
    }
  });

  it('all Phase 47 view models can be looked up in view model map', () => {
    for (const vm of STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODELS) {
      expect(STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_MAP.has(vm.viewModelName)).toBe(true);
    }
  });
});
