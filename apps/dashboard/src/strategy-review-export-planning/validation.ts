/**
 * Phase 43 — Strategy Review Report Export Planning Fixtures v1: validation.
 *
 * Pure, deterministic validation and safety-validation helpers.
 * No thrown errors for expected invalid input, no timers, no network, no filesystem.
 */

import type {
  StrategyReviewExportPlanSafetyResult,
  StrategyReviewExportPlanValidationIssue,
  StrategyReviewExportPlanValidationResult,
} from './types.js';
import {
  isValidStrategyReviewExportPlanFixtureKind,
  isValidStrategyReviewExportPlanFixtureName,
  isValidStrategyReviewExportPlanGeneratedAt,
  isValidStrategyReviewExportPlanSource,
  isValidStrategyReviewExportPlanTarget,
} from './normalization.js';

const URL_PATTERN = /\b(?:https?:\/\/|www\.)\S+/i;
const LOCAL_PATH_PATTERN = /(?:\/home\/|\/Users\/|C:\\Users\\|file:\/\/)/;
const SECRET_PATTERN =
  /\b(?:private key|seed phrase|mnemonic|api key|secret token|access token|BEGIN PRIVATE KEY)\b/i;
const EXECUTION_PATTERN =
  /\b(?:signTransaction|sendTransaction|sendRawTransaction|swap|order fill|buy now|sell now)\b/i;
const NETWORK_PATTERN = /\b(?:fetch|axios|websocket|XMLHttpRequest|Solana RPC)\b/i;
const DYNAMIC_CODE_PATTERN = /(?:child_process|exec\(|eval\(|Function\()/;
const DOWNLOAD_PATTERN = /\b(?:Blob|URL\.createObjectURL|download\(|createWriteStream|writeFileSync|fs\.writeFile)\b/;
const TIMER_PATTERN = /\b(?:Date\.now|new Date|Math\.random|setTimeout|setInterval)\b/;
const DOM_PATTERN = /\b(?:document|window|localStorage|sessionStorage)\b/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function issue(
  code: string,
  field: string,
  message: string,
  severity: 'error' | 'warning' = 'error',
): StrategyReviewExportPlanValidationIssue {
  return { code, field, message, severity };
}

function collectStrings(value: unknown, out: string[] = []): readonly string[] {
  if (typeof value === 'string') {
    out.push(value);
  } else if (Array.isArray(value)) {
    value.forEach(entry => collectStrings(entry, out));
  } else if (isRecord(value)) {
    Object.values(value).forEach(entry => collectStrings(entry, out));
  }
  return out;
}

export function validateStrategyReviewExportPlanFixture(
  input: unknown,
): StrategyReviewExportPlanValidationResult {
  const issues: StrategyReviewExportPlanValidationIssue[] = [];

  if (!isRecord(input)) {
    return {
      valid: false,
      issues: [issue('INVALID_INPUT', 'fixture', 'Fixture must be a non-null object.')],
    };
  }

  if (!isValidStrategyReviewExportPlanFixtureName(input['name'])) {
    issues.push(issue('INVALID_NAME', 'name', `Unsupported fixture name: ${String(input['name'])}.`));
  }

  if (!isValidStrategyReviewExportPlanFixtureKind(input['kind'])) {
    issues.push(issue('INVALID_KIND', 'kind', `Unsupported fixture kind: ${String(input['kind'])}.`));
  }

  if (!isValidStrategyReviewExportPlanTarget(input['targetFormat'])) {
    issues.push(
      issue('INVALID_TARGET_FORMAT', 'targetFormat', `Unsupported target format: ${String(input['targetFormat'])}.`),
    );
  }

  if (typeof input['title'] !== 'string' || input['title'].trim() === '') {
    issues.push(issue('MISSING_TITLE', 'title', 'title must be a non-empty string.'));
  }

  if (typeof input['description'] !== 'string' || input['description'].trim() === '') {
    issues.push(
      issue('MISSING_DESCRIPTION', 'description', 'description must be a non-empty string.'),
    );
  }

  if (!isRecord(input['previewReference'])) {
    issues.push(
      issue('INVALID_PREVIEW_REFERENCE', 'previewReference', 'previewReference must be a non-null object.'),
    );
  } else {
    const reference = input['previewReference'];
    if (reference['sourcePhase'] !== 42) {
      issues.push(
        issue(
          'INVALID_PREVIEW_REFERENCE_PHASE',
          'previewReference.sourcePhase',
          'previewReference.sourcePhase must be 42.',
        ),
      );
    }
    if (reference['fixtureOnly'] !== true) {
      issues.push(
        issue(
          'INVALID_PREVIEW_REFERENCE_FIXTURE_ONLY',
          'previewReference.fixtureOnly',
          'previewReference.fixtureOnly must be true.',
        ),
      );
    }
    if (reference['syntheticOnly'] !== true) {
      issues.push(
        issue(
          'INVALID_PREVIEW_REFERENCE_SYNTHETIC_ONLY',
          'previewReference.syntheticOnly',
          'previewReference.syntheticOnly must be true.',
        ),
      );
    }
  }

  if (!isRecord(input['exportPlan'])) {
    issues.push(issue('INVALID_EXPORT_PLAN', 'exportPlan', 'exportPlan must be a non-null object.'));
  } else {
    const exportPlan = input['exportPlan'];
    if (exportPlan['exportMode'] !== 'planning-only-disabled') {
      issues.push(
        issue(
          'INVALID_EXPORT_MODE',
          'exportPlan.exportMode',
          'exportPlan.exportMode must be planning-only-disabled.',
        ),
      );
    }
    if (exportPlan['enabled'] !== false) {
      issues.push(issue('INVALID_EXPORT_ENABLED', 'exportPlan.enabled', 'exportPlan.enabled must be false.'));
    }
    if (exportPlan['destination'] !== 'disabled') {
      issues.push(
        issue('INVALID_EXPORT_DESTINATION', 'exportPlan.destination', 'exportPlan.destination must be disabled.'),
      );
    }
    if (exportPlan['filePath'] !== null) {
      issues.push(issue('INVALID_EXPORT_FILE_PATH', 'exportPlan.filePath', 'exportPlan.filePath must be null.'));
    }
    if (exportPlan['downloadName'] !== null) {
      issues.push(
        issue('INVALID_EXPORT_DOWNLOAD_NAME', 'exportPlan.downloadName', 'exportPlan.downloadName must be null.'),
      );
    }
  }

  if (!isRecord(input['meta'])) {
    issues.push(issue('INVALID_META', 'meta', 'meta must be a non-null object.'));
  } else {
    const meta = input['meta'];
    if (meta['phase'] !== 43) {
      issues.push(issue('INVALID_META_PHASE', 'meta.phase', 'meta.phase must be 43.'));
    }
    if (!isValidStrategyReviewExportPlanGeneratedAt(meta['generatedAt'])) {
      issues.push(
        issue(
          'INVALID_META_GENERATED_AT',
          'meta.generatedAt',
          'meta.generatedAt must be the deterministic Phase 43 timestamp.',
        ),
      );
    }
    if (!isValidStrategyReviewExportPlanSource(meta['source'])) {
      issues.push(
        issue('INVALID_META_SOURCE', 'meta.source', 'meta.source must be the Phase 43 source string.'),
      );
    }
    if (meta['exportDisabled'] !== true) {
      issues.push(issue('INVALID_META_EXPORT_DISABLED', 'meta.exportDisabled', 'meta.exportDisabled must be true.'));
    }
    if (meta['actualFileExport'] !== false) {
      issues.push(
        issue('INVALID_META_ACTUAL_FILE_EXPORT', 'meta.actualFileExport', 'meta.actualFileExport must be false.'),
      );
    }
    if (meta['filesystemWrites'] !== false) {
      issues.push(
        issue('INVALID_META_FILESYSTEM_WRITES', 'meta.filesystemWrites', 'meta.filesystemWrites must be false.'),
      );
    }
    if (meta['downloadSupport'] !== false) {
      issues.push(
        issue('INVALID_META_DOWNLOAD_SUPPORT', 'meta.downloadSupport', 'meta.downloadSupport must be false.'),
      );
    }
  }

  if (!isRecord(input['safetyBoundary'])) {
    issues.push(
      issue('INVALID_SAFETY_BOUNDARY', 'safetyBoundary', 'safetyBoundary must be a non-null object.'),
    );
  } else {
    const safetyBoundary = input['safetyBoundary'];
    if (safetyBoundary['noActualFileExport'] !== true) {
      issues.push(
        issue(
          'INVALID_SAFETY_BOUNDARY_FILE_EXPORT',
          'safetyBoundary.noActualFileExport',
          'safetyBoundary.noActualFileExport must be true.',
        ),
      );
    }
    if (safetyBoundary['strategyReviewActualFileExport'] !== false) {
      issues.push(
        issue(
          'INVALID_SAFETY_BOUNDARY_ACTUAL_FILE_EXPORT',
          'safetyBoundary.strategyReviewActualFileExport',
          'strategyReviewActualFileExport must be false.',
        ),
      );
    }
    if (safetyBoundary['strategyReviewFilesystemWrites'] !== false) {
      issues.push(
        issue(
          'INVALID_SAFETY_BOUNDARY_FILESYSTEM_WRITES',
          'safetyBoundary.strategyReviewFilesystemWrites',
          'strategyReviewFilesystemWrites must be false.',
        ),
      );
    }
  }

  try {
    const serialized = JSON.stringify(input);
    if (typeof serialized !== 'string' || serialized.length === 0) {
      issues.push(issue('NOT_SERIALIZABLE', 'fixture', 'Fixture must be JSON serializable.'));
    }
  } catch {
    issues.push(issue('NOT_SERIALIZABLE', 'fixture', 'Fixture must be JSON serializable.'));
  }

  return { valid: issues.length === 0, issues };
}

export function validateStrategyReviewExportPlanSafety(
  input: unknown,
): StrategyReviewExportPlanSafetyResult {
  const violations: string[] = [];
  const strings = collectStrings(input);

  for (const value of strings) {
    if (URL_PATTERN.test(value)) {
      violations.push(`External URL detected: "${value.slice(0, 60)}"`);
    }
    if (LOCAL_PATH_PATTERN.test(value)) {
      violations.push(`Local filesystem path detected: "${value.slice(0, 60)}"`);
    }
    if (SECRET_PATTERN.test(value)) {
      violations.push(`Secret/credential pattern detected: "${value.slice(0, 60)}"`);
    }
    if (EXECUTION_PATTERN.test(value)) {
      violations.push(`Execution logic reference detected: "${value.slice(0, 60)}"`);
    }
    if (NETWORK_PATTERN.test(value)) {
      violations.push(`External/network reference detected: "${value.slice(0, 60)}"`);
    }
    if (DYNAMIC_CODE_PATTERN.test(value)) {
      violations.push(`Dynamic code execution pattern detected: "${value.slice(0, 60)}"`);
    }
    if (DOWNLOAD_PATTERN.test(value)) {
      violations.push(`Download/export API pattern detected: "${value.slice(0, 60)}"`);
    }
    if (TIMER_PATTERN.test(value)) {
      violations.push(`Timer/randomness pattern detected: "${value.slice(0, 60)}"`);
    }
    if (DOM_PATTERN.test(value)) {
      violations.push(`Browser runtime API detected: "${value.slice(0, 60)}"`);
    }
  }

  return {
    safe: violations.length === 0,
    violations: [...new Set(violations)].sort((a, b) => a.localeCompare(b)),
  };
}
