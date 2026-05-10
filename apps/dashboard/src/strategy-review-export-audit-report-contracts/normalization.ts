/**
 * Phase 48 — Strategy Review Export Audit Report Read-Only API Contracts v1: normalization.
 *
 * Stable normalization, serialization, and equality helpers for Phase 48
 * API contract fixtures.
 */

import type {
  StrategyReviewExportAuditReportApiContract,
  StrategyReviewExportAuditReportApiContractKind,
  StrategyReviewExportAuditReportApiContractName,
} from './types.js';
import {
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_KINDS,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_NAMES,
} from './types.js';

// ─── Deterministic checksum ────────────────────────────────────────────────────

export function stableDeterministicContractChecksum(content: string): string {
  let hash = 2166136261;
  for (let i = 0; i < content.length; i += 1) {
    hash ^= content.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv1a32:${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

// ─── Deep key sort ─────────────────────────────────────────────────────────────

function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortKeysDeep);
  }
  if (value !== null && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>)
      .sort(([a], [b]) => a.localeCompare(b))
      .reduce<Record<string, unknown>>((acc, [key, next]) => {
        acc[key] = sortKeysDeep(next);
        return acc;
      }, {});
  }
  return value;
}

function stablePrettyJsonStringify(value: unknown): string {
  return `${JSON.stringify(sortKeysDeep(value), null, 2)}\n`;
}

// ─── Validation guards ─────────────────────────────────────────────────────────

export function isValidStrategyReviewExportAuditReportApiContractName(
  value: unknown,
): value is StrategyReviewExportAuditReportApiContractName {
  if (typeof value !== 'string') return false;
  if ((STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_NAMES as readonly string[]).includes(value)) {
    return true;
  }
  return value.startsWith('strategy-review-export-audit-report-detail-contract-');
}

export function isValidStrategyReviewExportAuditReportApiContractKind(
  value: unknown,
): value is StrategyReviewExportAuditReportApiContractKind {
  return (
    typeof value === 'string' &&
    (STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_KINDS as readonly string[]).includes(value)
  );
}

export function isValidStrategyReviewExportAuditReportApiContractGeneratedAt(value: unknown): boolean {
  return typeof value === 'string' && value === '2026-01-04T00:00:00.000Z';
}

export function isValidStrategyReviewExportAuditReportApiContractSource(value: unknown): boolean {
  return (
    typeof value === 'string' &&
    value === 'phase48_strategy_review_export_audit_report_api_contracts_v1'
  );
}

// ─── Normalization ─────────────────────────────────────────────────────────────

export function normalizeStrategyReviewExportAuditReportApiContract(
  contract: StrategyReviewExportAuditReportApiContract,
): StrategyReviewExportAuditReportApiContract {
  if (contract.contractKind === 'list') {
    return {
      ...contract,
      data: [...contract.data].sort((a, b) => a.viewModelName.localeCompare(b.viewModelName)),
      filters: [...contract.filters].sort((a, b) => a.field.localeCompare(b.field)),
      sorts: [...contract.sorts].sort((a, b) => a.field.localeCompare(b.field)),
    } as StrategyReviewExportAuditReportApiContract;
  }
  if (contract.contractKind === 'detail') {
    return {
      ...contract,
      data: {
        ...contract.data,
        summaryCards: [...contract.data.summaryCards].sort((a, b) => a.order - b.order),
        detailSections: [...contract.data.detailSections].sort((a, b) => a.order - b.order),
        evidenceItems: [...contract.data.evidenceItems].sort((a, b) => a.order - b.order),
        safetyBadges: [...contract.data.safetyBadges].sort((a, b) => a.order - b.order),
        validationBadges: [...contract.data.validationBadges].sort((a, b) => a.order - b.order),
      },
    } as StrategyReviewExportAuditReportApiContract;
  }
  if (contract.contractKind === 'summary') {
    return {
      ...contract,
      data: {
        ...contract.data,
        byStatus: [...contract.data.byStatus].sort((a, b) => a.status.localeCompare(b.status)),
        bySeverity: [...contract.data.bySeverity].sort((a, b) =>
          a.severity.localeCompare(b.severity),
        ),
        byKind: [...contract.data.byKind].sort((a, b) => a.kind.localeCompare(b.kind)),
      },
    } as StrategyReviewExportAuditReportApiContract;
  }
  return contract;
}

// ─── Serialization ─────────────────────────────────────────────────────────────

export function serializeStrategyReviewExportAuditReportApiContract(
  contract: StrategyReviewExportAuditReportApiContract,
): string {
  return stablePrettyJsonStringify(normalizeStrategyReviewExportAuditReportApiContract(contract));
}

// ─── Equality ──────────────────────────────────────────────────────────────────

export function areStrategyReviewExportAuditReportApiContractsEqual(
  a: StrategyReviewExportAuditReportApiContract,
  b: StrategyReviewExportAuditReportApiContract,
): boolean {
  return (
    serializeStrategyReviewExportAuditReportApiContract(a) ===
    serializeStrategyReviewExportAuditReportApiContract(b)
  );
}
