import {
  STRATEGY_REVIEW_DASHBOARD_FIXTURE_KINDS,
  STRATEGY_REVIEW_DASHBOARD_FIXTURE_NAMES,
} from '../strategy-review-fixtures/index.js';
import type {
  StrategyReviewReportFixture,
  StrategyReviewReportSafetyResult,
  StrategyReviewReportValidationIssue,
  StrategyReviewReportValidationResult,
} from './types.js';
import {
  isStrategyReviewReportFixtureSerializable,
  isValidStrategyReviewReportFixtureKind,
  isValidStrategyReviewReportFixtureName,
  isValidStrategyReviewReportGeneratedAt,
  isValidStrategyReviewReportSource,
} from './normalization.js';
import { PHASE_41_STRATEGY_REVIEW_REPORT_GENERATED_AT } from './types.js';

const EMAIL_PATTERN = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
const PHONE_PATTERN = /\b(?:\+?\d{1,2}\s*)?(?:\(?\d{3}\)?[-.\s]*)\d{3}[-.\s]*\d{4}\b/;
const STREET_PATTERN =
  /\b\d{1,5}\s+[A-Za-z0-9.'-]+\s(?:street|st|road|rd|avenue|ave|lane|ln|drive|dr)\b/i;
const URL_PATTERN = /\b(?:https?:\/\/|www\.)\S+/i;
const STACK_TRACE_PATTERN =
  /(?:TypeError:|ReferenceError:|SyntaxError:|\bat\s+\S+\s+\()|(?:\bat Object\.)/;
const LOCAL_PATH_PATTERN = /(?:\/home\/|\/Users\/|C:\\Users\\|file:\/\/)/;
const SECRET_PATTERN =
  /\b(?:private key|seed phrase|mnemonic|api key|secret token|access token|BEGIN PRIVATE KEY)\b/i;
const LIVE_DATA_PATTERN =
  /\b(?:live data|real-time|solana rpc|provider api|jito|mev|mempool|yellowstone|geyser|websocket|fetch|axios)\b/i;
const EXECUTION_PATTERN =
  /\b(?:execute|execution control|sign transaction|send transaction|swap|buy|sell|order|fill|position|wallet connect|trade)\b/i;
const ADVICE_PATTERN = /\b(?:recommend|investment advice|trading signal|alpha|price target)\b/i;
const WALLET_ADDRESS_PATTERN = /\b[1-9A-HJ-NP-Za-km-z]{32,44}\b/;
const TX_HASH_PATTERN = /\b[1-9A-HJ-NP-Za-km-z]{64,88}\b/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function issue(
  code: string,
  field: string,
  message: string,
  severity: 'error' | 'warning' = 'error',
): StrategyReviewReportValidationIssue {
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

export function validateStrategyReviewReportFixture(input: unknown): StrategyReviewReportValidationResult {
  const issues: StrategyReviewReportValidationIssue[] = [];

  if (!isRecord(input)) {
    return {
      valid: false,
      issues: [issue('INVALID_INPUT', 'fixture', 'Fixture must be a non-null object.')],
    };
  }

  if (!isValidStrategyReviewReportFixtureName(input['name'])) {
    issues.push(issue('INVALID_NAME', 'name', `Unsupported fixture name: ${String(input['name'])}.`));
  }
  if (!isValidStrategyReviewReportFixtureKind(input['kind'])) {
    issues.push(issue('INVALID_KIND', 'kind', `Unsupported fixture kind: ${String(input['kind'])}.`));
  }
  if (typeof input['title'] !== 'string' || input['title'].trim() === '') {
    issues.push(issue('MISSING_TITLE', 'title', 'title must be a non-empty string.'));
  }
  if (typeof input['description'] !== 'string' || input['description'].trim() === '') {
    issues.push(issue('MISSING_DESCRIPTION', 'description', 'description must be a non-empty string.'));
  }

  if (!Array.isArray(input['dashboardReferences']) || input['dashboardReferences'].length === 0) {
    issues.push(
      issue(
        'MISSING_DASHBOARD_REFERENCES',
        'dashboardReferences',
        'dashboardReferences must be a non-empty array.',
      ),
    );
  } else {
    for (const reference of input['dashboardReferences'] as unknown[]) {
      if (!isRecord(reference)) {
        issues.push(
          issue(
            'INVALID_DASHBOARD_REFERENCE',
            'dashboardReferences',
            'Each dashboard reference must be an object.',
          ),
        );
        continue;
      }
      if (
        !STRATEGY_REVIEW_DASHBOARD_FIXTURE_NAMES.includes(
          reference['sourceDashboardFixtureName'] as never,
        )
      ) {
        issues.push(
          issue(
            'INVALID_SOURCE_DASHBOARD_NAME',
            'dashboardReferences.sourceDashboardFixtureName',
            `Unsupported Phase 40 dashboard reference: ${String(reference['sourceDashboardFixtureName'])}.`,
          ),
        );
      }
      if (
        !STRATEGY_REVIEW_DASHBOARD_FIXTURE_KINDS.includes(
          reference['sourceDashboardFixtureKind'] as never,
        )
      ) {
        issues.push(
          issue(
            'INVALID_SOURCE_DASHBOARD_KIND',
            'dashboardReferences.sourceDashboardFixtureKind',
            `Unsupported Phase 40 dashboard kind: ${String(reference['sourceDashboardFixtureKind'])}.`,
          ),
        );
      }
      if (reference['sourcePhase'] !== 40) {
        issues.push(issue('INVALID_SOURCE_PHASE', 'dashboardReferences.sourcePhase', 'sourcePhase must be 40.'));
      }
    }
  }

  if (!Array.isArray(input['sections']) || input['sections'].length === 0) {
    issues.push(issue('MISSING_SECTIONS', 'sections', 'sections must be a non-empty array.'));
  }

  if (!isRecord(input['summary'])) {
    issues.push(issue('MISSING_SUMMARY', 'summary', 'summary must be a non-null object.'));
  } else {
    const summary = input['summary'] as Record<string, unknown>;
    if (summary['phase'] !== 41) {
      issues.push(issue('INVALID_SUMMARY_PHASE', 'summary.phase', 'summary.phase must be 41.'));
    }
    if (summary['serializable'] !== true) {
      issues.push(issue('INVALID_SUMMARY_SERIALIZABLE', 'summary.serializable', 'summary.serializable must be true.'));
    }
    if (summary['nonAdvisory'] !== true) {
      issues.push(issue('INVALID_SUMMARY_NON_ADVISORY', 'summary.nonAdvisory', 'summary.nonAdvisory must be true.'));
    }
    if (summary['generatedAt'] !== PHASE_41_STRATEGY_REVIEW_REPORT_GENERATED_AT) {
      issues.push(issue('INVALID_SUMMARY_GENERATED_AT', 'summary.generatedAt', 'summary.generatedAt is invalid.'));
    }
  }

  if (!isRecord(input['meta'])) {
    issues.push(issue('MISSING_META', 'meta', 'meta must be a non-null object.'));
  } else {
    const meta = input['meta'] as Record<string, unknown>;
    if (meta['phase'] !== 41) issues.push(issue('INVALID_META_PHASE', 'meta.phase', 'meta.phase must be 41.'));
    if (!isValidStrategyReviewReportGeneratedAt(meta['generatedAt'])) {
      issues.push(issue('INVALID_META_GENERATED_AT', 'meta.generatedAt', 'meta.generatedAt is invalid.'));
    }
    if (!isValidStrategyReviewReportSource(meta['source'])) {
      issues.push(issue('INVALID_META_SOURCE', 'meta.source', 'meta.source is invalid.'));
    }
    if (meta['strategyReviewReportActualFileExport'] !== false) {
      issues.push(issue('META_FILE_EXPORT', 'meta.strategyReviewReportActualFileExport', 'meta.strategyReviewReportActualFileExport must be false.'));
    }
    if (meta['strategyReviewReportDownloadSupport'] !== false) {
      issues.push(issue('META_DOWNLOAD', 'meta.strategyReviewReportDownloadSupport', 'meta.strategyReviewReportDownloadSupport must be false.'));
    }
    if (meta['strategyReviewReportRealUiRendering'] !== false) {
      issues.push(issue('META_REAL_UI_RENDERING', 'meta.strategyReviewReportRealUiRendering', 'meta.strategyReviewReportRealUiRendering must be false.'));
    }
    if (meta['strategyReviewReportRealScoring'] !== false) {
      issues.push(issue('META_REAL_SCORING', 'meta.strategyReviewReportRealScoring', 'meta.strategyReviewReportRealScoring must be false.'));
    }
    if (meta['strategyReviewReportRealRanking'] !== false) {
      issues.push(issue('META_REAL_RANKING', 'meta.strategyReviewReportRealRanking', 'meta.strategyReviewReportRealRanking must be false.'));
    }
    if (meta['strategyReviewReportRecommendations'] !== false) {
      issues.push(issue('META_RECOMMENDATIONS', 'meta.strategyReviewReportRecommendations', 'meta.strategyReviewReportRecommendations must be false.'));
    }
    if (meta['strategyReviewReportTradingSignals'] !== false) {
      issues.push(issue('META_TRADING_SIGNALS', 'meta.strategyReviewReportTradingSignals', 'meta.strategyReviewReportTradingSignals must be false.'));
    }
    if (meta['strategyReviewReportExecution'] !== false) {
      issues.push(issue('META_EXECUTION', 'meta.strategyReviewReportExecution', 'meta.strategyReviewReportExecution must be false.'));
    }
    if (meta['strategyReviewReportSolanaRpc'] !== false) {
      issues.push(issue('META_SOLANA_RPC', 'meta.strategyReviewReportSolanaRpc', 'meta.strategyReviewReportSolanaRpc must be false.'));
    }
    if (meta['strategyReviewReportExternalNetwork'] !== false) {
      issues.push(issue('META_EXTERNAL_NETWORK', 'meta.strategyReviewReportExternalNetwork', 'meta.strategyReviewReportExternalNetwork must be false.'));
    }
    if (meta['strategyReviewReportPersistence'] !== false) {
      issues.push(issue('META_PERSISTENCE', 'meta.strategyReviewReportPersistence', 'meta.strategyReviewReportPersistence must be false.'));
    }
    if (meta['strategyReviewReportInvestmentAdvice'] !== false) {
      issues.push(issue('META_INVESTMENT_ADVICE', 'meta.strategyReviewReportInvestmentAdvice', 'meta.strategyReviewReportInvestmentAdvice must be false.'));
    }
  }

  if (!isRecord(input['safetyBoundary'])) {
    issues.push(issue('MISSING_SAFETY_BOUNDARY', 'safetyBoundary', 'safetyBoundary must be a non-null object.'));
  }

  if (!isStrategyReviewReportFixtureSerializable(input)) {
    issues.push(issue('NOT_SERIALIZABLE', 'fixture', 'Fixture must be JSON serializable.'));
  }

  return { valid: issues.length === 0, issues };
}

export function validateStrategyReviewReportSafety(input: unknown): StrategyReviewReportSafetyResult {
  if (!isRecord(input)) {
    return { safe: false, violations: ['Input must be a non-null object.'] };
  }

  const fixture = input as Partial<StrategyReviewReportFixture>;
  const violations: string[] = [];

  collectStrings(input).forEach(text => {
    if (EMAIL_PATTERN.test(text)) violations.push(`PII_EMAIL: ${text}`);
    if (PHONE_PATTERN.test(text)) violations.push(`PII_PHONE: ${text}`);
    if (STREET_PATTERN.test(text)) violations.push(`PII_ADDRESS: ${text}`);
    if (URL_PATTERN.test(text)) violations.push(`URL_PRESENT: ${text}`);
    if (STACK_TRACE_PATTERN.test(text)) violations.push(`STACK_TRACE: ${text}`);
    if (LOCAL_PATH_PATTERN.test(text)) violations.push(`LOCAL_PATH: ${text}`);
    if (SECRET_PATTERN.test(text)) violations.push(`SECRET_PATTERN: ${text}`);
    if (LIVE_DATA_PATTERN.test(text)) violations.push(`LIVE_DATA_PATTERN: ${text}`);
    if (EXECUTION_PATTERN.test(text)) violations.push(`EXECUTION_PATTERN: ${text}`);
    if (ADVICE_PATTERN.test(text)) violations.push(`ADVICE_PATTERN: ${text}`);
    if (WALLET_ADDRESS_PATTERN.test(text)) violations.push(`WALLET_ADDRESS_PATTERN: ${text}`);
    if (TX_HASH_PATTERN.test(text)) violations.push(`TX_HASH_PATTERN: ${text}`);
  });

  const meta = fixture.meta;
  if (!meta) {
    violations.push('Missing meta.');
  } else {
    if (meta.strategyReviewReportActualFileExport !== false) {
      violations.push('meta.strategyReviewReportActualFileExport must be false.');
    }
    if (meta.strategyReviewReportDownloadSupport !== false) {
      violations.push('meta.strategyReviewReportDownloadSupport must be false.');
    }
    if (meta.strategyReviewReportRealUiRendering !== false) {
      violations.push('meta.strategyReviewReportRealUiRendering must be false.');
    }
    if (meta.strategyReviewReportRealScoring !== false) {
      violations.push('meta.strategyReviewReportRealScoring must be false.');
    }
    if (meta.strategyReviewReportRealRanking !== false) {
      violations.push('meta.strategyReviewReportRealRanking must be false.');
    }
    if (meta.strategyReviewReportRecommendations !== false) {
      violations.push('meta.strategyReviewReportRecommendations must be false.');
    }
    if (meta.strategyReviewReportTradingSignals !== false) {
      violations.push('meta.strategyReviewReportTradingSignals must be false.');
    }
    if (meta.strategyReviewReportExecution !== false) {
      violations.push('meta.strategyReviewReportExecution must be false.');
    }
    if (meta.strategyReviewReportSolanaRpc !== false) {
      violations.push('meta.strategyReviewReportSolanaRpc must be false.');
    }
    if (meta.strategyReviewReportExternalNetwork !== false) {
      violations.push('meta.strategyReviewReportExternalNetwork must be false.');
    }
    if (meta.strategyReviewReportPersistence !== false) {
      violations.push('meta.strategyReviewReportPersistence must be false.');
    }
    if (meta.strategyReviewReportInvestmentAdvice !== false) {
      violations.push('meta.strategyReviewReportInvestmentAdvice must be false.');
    }
  }

  const safety = fixture.safetyBoundary;
  if (!safety) {
    violations.push('Missing safetyBoundary.');
  } else {
    if (safety.noActualFileExport !== true) violations.push('safetyBoundary.noActualFileExport must be true.');
    if (safety.noDownloadSupport !== true) violations.push('safetyBoundary.noDownloadSupport must be true.');
    if (safety.noRealUiRendering !== true) violations.push('safetyBoundary.noRealUiRendering must be true.');
    if (safety.noRealScoring !== true) violations.push('safetyBoundary.noRealScoring must be true.');
    if (safety.noRealRanking !== true) violations.push('safetyBoundary.noRealRanking must be true.');
    if (safety.noRecommendations !== true) violations.push('safetyBoundary.noRecommendations must be true.');
    if (safety.noTradingSignals !== true) violations.push('safetyBoundary.noTradingSignals must be true.');
    if (safety.noExecution !== true) violations.push('safetyBoundary.noExecution must be true.');
    if (safety.noExternalNetwork !== true) violations.push('safetyBoundary.noExternalNetwork must be true.');
    if (safety.noPersistence !== true) violations.push('safetyBoundary.noPersistence must be true.');
    if (safety.noInvestmentAdvice !== true) violations.push('safetyBoundary.noInvestmentAdvice must be true.');
  }

  return { safe: violations.length === 0, violations: [...new Set(violations)] };
}
