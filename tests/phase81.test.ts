import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  MANUAL_CONFIRM_EXECUTION_BOUNDARY_FIXTURE_MAP,
  MANUAL_CONFIRM_EXECUTION_BOUNDARY_FIXTURES,
  MANUAL_CONFIRM_EXECUTION_BOUNDARY_KINDS,
  MANUAL_CONFIRM_EXECUTION_BOUNDARY_NAMES,
  MANUAL_CONFIRM_EXECUTION_BOUNDARY_PHASE,
  PHASE_81_MANUAL_CONFIRM_EXECUTION_BOUNDARY_GENERATED_AT,
  areManualConfirmExecutionBoundaryFixturesEqual,
  buildExecutionAbortContract,
  buildExecutionApprovalBoundary,
  buildExecutionBoundaryApiContract,
  buildExecutionBoundaryBlocker,
  buildExecutionBoundaryCapabilityAudit,
  buildExecutionBoundaryEvidence,
  buildExecutionBoundaryGate,
  buildExecutionBoundaryReport,
  buildExecutionBoundaryScorecard,
  buildExecutionBoundaryState,
  buildExecutionBoundaryViewModel,
  buildExecutionConstructionDenial,
  buildExecutionDispatchDenial,
  buildExecutionDryRunLinkage,
  buildExecutionOperatorIntentLinkage,
  buildExecutionPromotionReviewLinkage,
  buildExecutionReadinessLinkage,
  buildExecutionRiskAcknowledgementLinkage,
  buildExecutionRollbackContract,
  buildExecutionSigningDenial,
  buildExecutionWalletDenial,
  buildManualConfirmExecutionBoundaryFixture,
  getDashboardUiShellCapabilities,
  getManualConfirmExecutionBoundaryCapabilities,
  getManualConfirmExecutionBoundaryFixture,
  isValidManualConfirmExecutionBoundaryGeneratedAt,
  isValidManualConfirmExecutionBoundaryKind,
  isValidManualConfirmExecutionBoundaryName,
  isValidManualConfirmExecutionBoundarySchemaVersion,
  isValidManualConfirmExecutionBoundarySource,
  listManualConfirmExecutionBoundaryFixtures,
  normalizeManualConfirmExecutionBoundaryFixture,
  selectManualConfirmExecutionBoundaryFixture,
  serializeManualConfirmExecutionBoundaryFixture,
  validateManualConfirmExecutionBoundaryFixture,
  validateManualConfirmExecutionBoundarySafety,
} from '../apps/dashboard/src/index.js';
import { getLocalReadOnlyApiCapabilities } from '../apps/read-only-api/src/capabilities.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const PHASE_81_SRC = resolve(REPO_ROOT, 'apps/dashboard/src/manual-confirm-execution-boundary');

const PHASE_81_FILES = [
  'types.ts',
  'boundary-gates.ts',
  'execution-boundary-states.ts',
  'construction-denial.ts',
  'signing-denial.ts',
  'dispatch-denial.ts',
  'wallet-denial.ts',
  'approval-boundaries.ts',
  'operator-intent-linkage.ts',
  'dry-run-linkage.ts',
  'readiness-linkage.ts',
  'promotion-review-linkage.ts',
  'abort-contracts.ts',
  'rollback-contracts.ts',
  'risk-acknowledgement-linkage.ts',
  'boundary-evidence.ts',
  'blocker-taxonomy.ts',
  'capability-audits.ts',
  'boundary-scorecards.ts',
  'boundary-reports.ts',
  'reports.ts',
  'builders.ts',
  'fixtures.ts',
  'view-models.ts',
  'contracts.ts',
  'selectors.ts',
  'normalization.ts',
  'validation.ts',
  'capabilities.ts',
  'index.ts',
];

describe('Phase 81 — Manual-Confirm Execution Boundary Design Contracts', () => {
  it('has all required source files and docs', () => {
    for (const file of PHASE_81_FILES) {
      expect(() => readFileSync(resolve(PHASE_81_SRC, file), 'utf8')).not.toThrow();
    }
    expect(() => readFileSync(resolve(REPO_ROOT, 'docs/MANUAL_CONFIRM_EXECUTION_BOUNDARY.md'), 'utf8')).not.toThrow();
  });

  it('has constants and deterministic generated timestamp', () => {
    expect(MANUAL_CONFIRM_EXECUTION_BOUNDARY_PHASE).toBe(81);
    expect(PHASE_81_MANUAL_CONFIRM_EXECUTION_BOUNDARY_GENERATED_AT).toBe('2026-05-14T00:00:00.000Z');
    expect(isValidManualConfirmExecutionBoundaryGeneratedAt(PHASE_81_MANUAL_CONFIRM_EXECUTION_BOUNDARY_GENERATED_AT)).toBe(true);
    expect(isValidManualConfirmExecutionBoundarySchemaVersion('1.0.0')).toBe(true);
    expect(isValidManualConfirmExecutionBoundarySource('phase81_manual_confirm_execution_boundary_design_contracts_v1')).toBe(true);
  });

  it('defines names/kinds and fixture list surfaces', () => {
    expect(MANUAL_CONFIRM_EXECUTION_BOUNDARY_NAMES).toHaveLength(8);
    expect(MANUAL_CONFIRM_EXECUTION_BOUNDARY_KINDS).toHaveLength(8);
    expect(MANUAL_CONFIRM_EXECUTION_BOUNDARY_FIXTURES.length).toBeGreaterThanOrEqual(8);
    expect(MANUAL_CONFIRM_EXECUTION_BOUNDARY_FIXTURE_MAP.size).toBe(MANUAL_CONFIRM_EXECUTION_BOUNDARY_FIXTURES.length);
    expect(listManualConfirmExecutionBoundaryFixtures()).toBe(MANUAL_CONFIRM_EXECUTION_BOUNDARY_FIXTURES);
  });

  it('supports get/select/normalize/serialize/equality', () => {
    const fixture = MANUAL_CONFIRM_EXECUTION_BOUNDARY_FIXTURES[0]!;
    expect(getManualConfirmExecutionBoundaryFixture(fixture.fixtureId)).toBe(fixture);
    expect(getManualConfirmExecutionBoundaryFixture('unknown')).toBeNull();
    expect(selectManualConfirmExecutionBoundaryFixture({ fixtureName: fixture.fixtureName }).matched).toBe(true);
    expect(selectManualConfirmExecutionBoundaryFixture({ fixtureId: 'missing' }).matched).toBe(false);
    const normalized = normalizeManualConfirmExecutionBoundaryFixture(fixture);
    expect(serializeManualConfirmExecutionBoundaryFixture(fixture)).toContain('"fixtureId"');
    expect(areManualConfirmExecutionBoundaryFixturesEqual(fixture, normalized)).toBe(true);
  });

  it('validates fixtures and enforces safety and non-execution', () => {
    for (const fixture of MANUAL_CONFIRM_EXECUTION_BOUNDARY_FIXTURES) {
      expect(validateManualConfirmExecutionBoundaryFixture(fixture).valid).toBe(true);
      expect(validateManualConfirmExecutionBoundarySafety(fixture).safe).toBe(true);
      expect(fixture.boundaryGate.failClosed).toBe(true);
      expect(fixture.boundaryGate.unlockAuthority).toBe(false);
      expect(fixture.boundaryGate.executionAllowed).toBe(false);
      expect(fixture.boundaryGate.transactionConstructionAllowed).toBe(false);
      expect(fixture.boundaryGate.signingAllowed).toBe(false);
      expect(fixture.boundaryGate.dispatchAllowed).toBe(false);
      expect(fixture.boundaryGate.sendAllowed).toBe(false);
      expect(fixture.approvalBoundary.approvalAuthorizesExecution).toBe(false);
      expect(fixture.constructionDenial.transactionConstructionBlocked).toBe(true);
      expect(fixture.signingDenial.signingBlocked).toBe(true);
      expect(fixture.dispatchDenial.sendBlocked).toBe(true);
      expect(fixture.walletDenial.walletLogicAllowed).toBe(false);
      expect(fixture.walletDenial.privateKeyHandlingAllowed).toBe(false);
      expect(fixture.walletDenial.keypairHandlingAllowed).toBe(false);
      expect(fixture.abortContract.runtimeSideEffectsAllowed).toBe(false);
      expect(fixture.rollbackContract.runtimeSideEffectsAllowed).toBe(false);
      expect(fixture.abortContract.scheduledTimersAllowed).toBe(false);
      expect(fixture.rollbackContract.scheduledTimersAllowed).toBe(false);
      expect(fixture.safety.noExecution).toBe(true);
    }
  });

  it('covers required blocked/denied scenarios', () => {
    expect(buildManualConfirmExecutionBoundaryFixture({ fixtureName: 'execution-boundary-design-ready' }).boundaryGate.gateStatus).toBe('ready');
    expect(buildManualConfirmExecutionBoundaryFixture({ fixtureName: 'missing-dry-run-control-blocked' }).dryRunLinkage.linkageStatus).toBe('blocked');
    expect(buildManualConfirmExecutionBoundaryFixture({ fixtureName: 'missing-manual-readiness-blocked' }).readinessLinkage.linkageStatus).toBe('blocked');
    expect(buildManualConfirmExecutionBoundaryFixture({ fixtureName: 'construction-request-denied' }).constructionDenial.transactionConstructionBlocked).toBe(true);
    expect(buildManualConfirmExecutionBoundaryFixture({ fixtureName: 'signing-request-denied' }).signingDenial.signingBlocked).toBe(true);
    expect(buildManualConfirmExecutionBoundaryFixture({ fixtureName: 'dispatch-request-denied' }).dispatchDenial.dispatchBlocked).toBe(true);
    expect(buildManualConfirmExecutionBoundaryFixture({ fixtureName: 'approval-does-not-authorize-execution' }).approvalBoundary.approvalStatus).toBe('recorded');
    expect(buildManualConfirmExecutionBoundaryFixture({ fixtureName: 'unsafe-capability-rejected' }).boundaryGate.gateStatus).toBe('rejected');
  });

  it('rejects unsafe toggles and advisory language', () => {
    const fixture = buildManualConfirmExecutionBoundaryFixture({ fixtureName: 'execution-boundary-design-ready' });
    const unsafe = {
      ...fixture,
      boundaryGate: { ...fixture.boundaryGate, executionAllowed: true as const },
      approvalBoundary: { ...fixture.approvalBoundary, approvalAuthorizesExecution: true as const },
      report: { ...fixture.report, safetySummary: 'profit signal recommendation output' },
    };
    const codes = new Set(validateManualConfirmExecutionBoundaryFixture(unsafe as never).issues.map(issue => issue.code));
    expect(codes.has('EXECUTION_FORBIDDEN')).toBe(true);
    expect(codes.has('APPROVAL_AUTHORIZES_EXECUTION_FORBIDDEN')).toBe(true);
    expect(codes.has('ADVISORY_LANGUAGE_FORBIDDEN')).toBe(true);
  });

  it('builder helpers work and capabilities propagate', () => {
    expect(buildExecutionBoundaryGate({ boundaryGateId: 'g', boundaryGateName: 'n', gateStatus: 'blocked', blockingReasonCodes: ['x'] }).phase).toBe(81);
    expect(buildExecutionBoundaryState({ boundaryStateId: 's', boundaryStateKind: 'design_only', stateStatus: 'design_ready' }).designOnly).toBe(true);
    expect(buildExecutionConstructionDenial({ constructionDenialId: 'c', reasonCodes: ['x'] }).serializationBlocked).toBe(true);
    expect(buildExecutionSigningDenial({ signingDenialId: 's', reasonCodes: ['x'] }).walletPromptBlocked).toBe(true);
    expect(buildExecutionDispatchDenial({ dispatchDenialId: 'd', reasonCodes: ['x'] }).networkSubmitBlocked).toBe(true);
    expect(buildExecutionWalletDenial({ walletDenialId: 'w', reasonCodes: ['x'] }).keypairHandlingAllowed).toBe(false);
    expect(buildExecutionApprovalBoundary({ approvalBoundaryId: 'a', approvalStatus: 'required' }).separateExecutionPhaseRequired).toBe(true);
    expect(buildExecutionOperatorIntentLinkage({ operatorIntentLinkageId: 'o', sourceDryRunIntentRef: 'x', linkageStatus: 'linked' }).intentSupportsExecution).toBe(false);
    expect(buildExecutionDryRunLinkage({ dryRunLinkageId: 'd', sourceDryRunControlRef: 'x', linkageStatus: 'linked' }).sourceDryRunControlRef).toBe('x');
    expect(buildExecutionReadinessLinkage({ readinessLinkageId: 'r', sourceManualReadinessRef: 'x', linkageStatus: 'warning' }).linkageStatus).toBe('warning');
    expect(buildExecutionPromotionReviewLinkage({ promotionReviewLinkageId: 'p', sourcePromotionReviewRef: 'x', linkageStatus: 'blocked' }).linkageStatus).toBe('blocked');
    expect(buildExecutionAbortContract({ abortContractId: 'a', status: 'ready' }).abortModeled).toBe(true);
    expect(buildExecutionRollbackContract({ rollbackContractId: 'r', status: 'ready' }).rollbackModeled).toBe(true);
    expect(buildExecutionRiskAcknowledgementLinkage({ riskAcknowledgementLinkageId: 'r', sourceRiskAcknowledgementRef: 'x', linkageStatus: 'linked' }).linkageStatus).toBe('linked');
    expect(buildExecutionBoundaryEvidence({ evidenceBundleId: 'e', sourcePhaseRefs: ['p'], sourceFixtureRefs: ['f'], validationCommandRefs: ['v'], safetyGrepRefs: ['g'], docsRefs: ['d'], evidenceComplete: true }).evidenceComplete).toBe(true);
    expect(buildExecutionBoundaryBlocker({ blockerId: 'b', blockerCode: 'x', severity: 'high', blocking: true, reason: 'r' }).blocking).toBe(true);
    expect(buildExecutionBoundaryCapabilityAudit({ capabilityAuditId: 'c' }).fullAutoLocked).toBe(true);
    expect(buildExecutionBoundaryScorecard({ scorecardId: 's', boundaryScore: 80, classification: 'warning', reviewRequired: true }).boundaryScore).toBe(80);
    expect(buildExecutionBoundaryReport({ reportId: 'r', gateSummary: 'g', stateSummary: 's', constructionSummary: 'c', signingSummary: 'sg', dispatchSummary: 'd', walletSummary: 'w', approvalSummary: 'a', abortRollbackSummary: 'ar', evidenceSummary: 'e', safetySummary: 'safe' }).reportId).toBe('r');
    expect(buildExecutionBoundaryViewModel({ viewModelId: 'v', fixtureId: 'f', fixtureName: 'execution-boundary-design-ready', gateStatus: 'ready', stateStatus: 'design_ready', approvalStatus: 'required' }).summary).toContain('execution-boundary-design-ready');
    expect(buildExecutionBoundaryApiContract({ fixtureId: 'f', fixtureIds: ['f'] }).list.data.totalCount).toBe(1);

    const dashboard = getDashboardUiShellCapabilities();
    const api = getLocalReadOnlyApiCapabilities();
    expect(dashboard.manualConfirmExecutionBoundaryContracts).toBe(true);
    expect(dashboard.executionBoundaryRuntimeExecution).toBe(false);
    expect(api.manualConfirmExecutionBoundaryContracts).toBe(true);
    expect(api.executionBoundaryRuntimeExecution).toBe(false);
    expect(getManualConfirmExecutionBoundaryCapabilities().executionBoundaryAutomaticPromotion).toBe(false);
  });

  it('is deterministic, immutable, and avoids randomness/network helpers', () => {
    const a = buildManualConfirmExecutionBoundaryFixture({ fixtureName: 'execution-boundary-design-ready' });
    const b = buildManualConfirmExecutionBoundaryFixture({ fixtureName: 'execution-boundary-design-ready' });
    expect(areManualConfirmExecutionBoundaryFixturesEqual(a, b)).toBe(true);
    expect(Object.isFrozen(a.sourcePhase80FixtureSnapshot)).toBe(true);
    for (const file of PHASE_81_FILES) {
      const source = readFileSync(resolve(PHASE_81_SRC, file), 'utf8');
      expect(source).not.toMatch(/Date\.now\(/);
      expect(source).not.toMatch(/Math\.random\(/);
      expect(source).not.toMatch(/randomUUID\(/);
      expect(source).not.toMatch(/\bfetch\(/);
    }
  });

  it('documents phase79/80 clean-runner blocker evidence and phase82 preview-only guidance', () => {
    const doc = readFileSync(resolve(REPO_ROOT, 'docs/MANUAL_CONFIRM_EXECUTION_BOUNDARY.md'), 'utf8');
    expect(doc).toContain('better-sqlite3');
    expect(doc).toContain('Could not locate the bindings file');
    expect(doc).toContain('Phase 82');
    expect(doc.toLowerCase()).toContain('preview only');
    expect(isValidManualConfirmExecutionBoundaryName('execution-boundary-design-ready')).toBe(true);
    expect(isValidManualConfirmExecutionBoundaryName('unknown')).toBe(false);
    expect(isValidManualConfirmExecutionBoundaryKind('execution_boundary_design_ready')).toBe(true);
    expect(isValidManualConfirmExecutionBoundaryKind('unknown')).toBe(false);
  });
});
