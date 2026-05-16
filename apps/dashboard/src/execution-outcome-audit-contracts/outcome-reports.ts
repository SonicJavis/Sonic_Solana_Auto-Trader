import type { ExecutionOutcomeAuditReport } from './types.js';

export function buildExecutionOutcomeAuditReport(
  input: ExecutionOutcomeAuditReport,
): ExecutionOutcomeAuditReport {
  return { ...input };
}
