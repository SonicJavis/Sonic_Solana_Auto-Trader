import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  PHASE_84_TRANSACTION_SEND_BOUNDARY_SAFETY_GENERATED_AT,
  TRANSACTION_SEND_BOUNDARY_SAFETY_FIXTURE_MAP,
  TRANSACTION_SEND_BOUNDARY_SAFETY_FIXTURES,
  TRANSACTION_SEND_BOUNDARY_SAFETY_KINDS,
  TRANSACTION_SEND_BOUNDARY_SAFETY_NAMES,
  TRANSACTION_SEND_BOUNDARY_SAFETY_PHASE,
  areTransactionSendBoundarySafetyFixturesEqual,
  buildBroadcastDenial,
  buildConfirmationDenialContract,
  buildDispatchDenial,
  buildNetworkSubmitDenial,
  buildPreflightDenialPlaceholder,
  buildRetryDenialContract,
  buildSendAbortContract,
  buildSendBoundaryBlocker,
  buildSendBoundaryGate,
  buildSendCapabilityAudit,
  buildSendConstructionLinkage,
  buildSendExecutionBoundaryLinkage,
  buildSendOperatorApprovalBoundary,
  buildSendRequestDenial,
  buildSendRollbackContract,
  buildSendSafetyInvariants,
  buildSendScorecard,
  buildSendSigningLinkage,
  buildSignedPayloadDenial,
  buildTransactionSendBoundaryApiContract,
  buildTransactionSendBoundaryReport,
  buildTransactionSendBoundarySafetyFixture,
  buildTransactionSendBoundaryViewModel,
  getDashboardUiShellCapabilities,
  getTransactionSendBoundarySafetyCapabilities,
  getTransactionSendBoundarySafetyFixture,
  isValidTransactionSendBoundarySafetyGeneratedAt,
  isValidTransactionSendBoundarySafetyKind,
  isValidTransactionSendBoundarySafetyName,
  isValidTransactionSendBoundarySafetySchemaVersion,
  isValidTransactionSendBoundarySafetySource,
  listTransactionSendBoundarySafetyFixtures,
  normalizeTransactionSendBoundarySafetyFixture,
  selectTransactionSendBoundarySafetyFixture,
  serializeTransactionSendBoundarySafetyFixture,
  validateTransactionSendBoundarySafety,
  validateTransactionSendBoundarySafetyFixture,
} from '../apps/dashboard/src/index.js';
import { getLocalReadOnlyApiCapabilities } from '../apps/read-only-api/src/capabilities.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const PHASE_84_SRC = resolve(REPO_ROOT, 'apps/dashboard/src/transaction-send-boundary-safety');

const PHASE_84_FILES = [
  'types.ts',
  'send-boundary-gates.ts',
  'send-request-denials.ts',
  'network-submit-denials.ts',
  'broadcast-denials.ts',
  'dispatch-denials.ts',
  'preflight-denial-placeholders.ts',
  'signed-payload-denials.ts',
  'retry-denial-contracts.ts',
  'confirmation-denial-contracts.ts',
  'operator-approval-boundaries.ts',
  'signing-linkage.ts',
  'construction-linkage.ts',
  'execution-boundary-linkage.ts',
  'abort-contracts.ts',
  'rollback-contracts.ts',
  'safety-invariants.ts',
  'blocker-taxonomy.ts',
  'capability-audits.ts',
  'send-scorecards.ts',
  'send-reports.ts',
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

describe('Phase 84 — Transaction Send Boundary Safety Contracts v1', () => {
  it('has all required source files and docs', () => {
    for (const file of PHASE_84_FILES) {
      expect(() => readFileSync(resolve(PHASE_84_SRC, file), 'utf8')).not.toThrow();
    }
    expect(() => readFileSync(resolve(REPO_ROOT, 'docs/TRANSACTION_SEND_BOUNDARY_SAFETY.md'), 'utf8')).not.toThrow();
  });

  it('has constants and fixture surfaces', () => {
    expect(TRANSACTION_SEND_BOUNDARY_SAFETY_PHASE).toBe(84);
    expect(PHASE_84_TRANSACTION_SEND_BOUNDARY_SAFETY_GENERATED_AT).toBe('2026-05-15T00:00:00.000Z');
    expect(TRANSACTION_SEND_BOUNDARY_SAFETY_NAMES).toHaveLength(8);
    expect(TRANSACTION_SEND_BOUNDARY_SAFETY_KINDS).toHaveLength(8);
    expect(TRANSACTION_SEND_BOUNDARY_SAFETY_FIXTURES.length).toBeGreaterThanOrEqual(8);
    expect(TRANSACTION_SEND_BOUNDARY_SAFETY_FIXTURE_MAP.size).toBe(TRANSACTION_SEND_BOUNDARY_SAFETY_FIXTURES.length);
  });

  it('supports list/get/select/normalize/serialize/equality', () => {
    const fixture = TRANSACTION_SEND_BOUNDARY_SAFETY_FIXTURES[0]!;
    expect(listTransactionSendBoundarySafetyFixtures()).toBe(TRANSACTION_SEND_BOUNDARY_SAFETY_FIXTURES);
    expect(getTransactionSendBoundarySafetyFixture(fixture.fixtureId)).toBe(fixture);
    expect(selectTransactionSendBoundarySafetyFixture({ fixtureName: fixture.fixtureName }).matched).toBe(true);
    expect(selectTransactionSendBoundarySafetyFixture({ fixtureId: 'missing' }).matched).toBe(false);
    const normalized = normalizeTransactionSendBoundarySafetyFixture(fixture);
    expect(serializeTransactionSendBoundarySafetyFixture(fixture)).toContain('"fixtureId"');
    expect(areTransactionSendBoundarySafetyFixturesEqual(fixture, normalized)).toBe(true);
  });

  it('enforces fail-closed send-boundary denials', () => {
    for (const fixture of TRANSACTION_SEND_BOUNDARY_SAFETY_FIXTURES) {
      expect(validateTransactionSendBoundarySafetyFixture(fixture).valid).toBe(true);
      expect(validateTransactionSendBoundarySafety(fixture).safe).toBe(true);
      expect(fixture.boundaryGate.unlockAuthority).toBe(false);
      expect(fixture.boundaryGate.sendingAllowed).toBe(false);
      expect(fixture.boundaryGate.networkSubmitAllowed).toBe(false);
      expect(fixture.sendRequestDenial.sendTransactionBlocked).toBe(true);
      expect(fixture.sendRequestDenial.transactionIdProduced).toBe(false);
      expect(fixture.networkSubmitDenial.rpcWriteBlocked).toBe(true);
      expect(fixture.broadcastDenial.broadcastBlocked).toBe(true);
      expect(fixture.dispatchDenial.routeDispatchAllowed).toBe(false);
      expect(fixture.preflightDenialPlaceholder.livePreflightAllowed).toBe(false);
      expect(fixture.retryDenialContract.retryRuntimeAllowed).toBe(false);
      expect(fixture.confirmationDenialContract.confirmationPollingAllowed).toBe(false);
      expect(fixture.approvalBoundary.approvalAuthorizesSending).toBe(false);
      expect(fixture.abortContract.runtimeSideEffectsAllowed).toBe(false);
      expect(fixture.rollbackContract.runtimeSideEffectsAllowed).toBe(false);
    }
  });

  it('covers required fixture scenarios', () => {
    expect(buildTransactionSendBoundarySafetyFixture({ fixtureName: 'send-boundary-design-ready' }).boundaryGate.gateStatus).toBe('ready');
    expect(
      buildTransactionSendBoundarySafetyFixture({ fixtureName: 'missing-signing-boundary-blocked' }).signingLinkage
        .linkageStatus,
    ).toBe('blocked');
    expect(
      buildTransactionSendBoundarySafetyFixture({ fixtureName: 'send-request-denied' }).sendRequestDenial
        .sendRawTransactionBlocked,
    ).toBe(true);
    expect(
      buildTransactionSendBoundarySafetyFixture({ fixtureName: 'network-submit-denied' }).networkSubmitDenial
        .endpointSubmitBlocked,
    ).toBe(true);
    expect(
      buildTransactionSendBoundarySafetyFixture({ fixtureName: 'broadcast-denied' }).broadcastDenial.bundleSubmitAllowed,
    ).toBe(false);
    expect(
      buildTransactionSendBoundarySafetyFixture({ fixtureName: 'dispatch-denied' }).dispatchDenial.workerDispatchAllowed,
    ).toBe(false);
    expect(
      buildTransactionSendBoundarySafetyFixture({ fixtureName: 'preflight-retry-confirmation-denied' }).confirmationDenialContract
        .confirmationPollingAllowed,
    ).toBe(false);
    expect(buildTransactionSendBoundarySafetyFixture({ fixtureName: 'unsafe-capability-rejected' }).boundaryGate.gateStatus).toBe('rejected');
  });

  it('builder wrappers and validators work', () => {
    expect(buildSendBoundaryGate({ sendBoundaryGateId: 'g', sendBoundaryGateName: 'n', gateStatus: 'blocked', blockingReasonCodes: ['x'] }).phase).toBe(84);
    expect(buildSendRequestDenial({ sendRequestDenialId: 's', reasonCodes: ['x'] }).transactionIdProduced).toBe(false);
    expect(buildNetworkSubmitDenial({ networkSubmitDenialId: 'n', reasonCodes: ['x'] }).networkSubmitBlocked).toBe(true);
    expect(buildBroadcastDenial({ broadcastDenialId: 'b', reasonCodes: ['x'] }).broadcastBlocked).toBe(true);
    expect(buildDispatchDenial({ dispatchDenialId: 'd', reasonCodes: ['x'] }).dispatchBlocked).toBe(true);
    expect(buildPreflightDenialPlaceholder({ preflightDenialId: 'p', reasonCodes: ['x'] }).preflightResultProduced).toBe(false);
    expect(buildSignedPayloadDenial({ signedPayloadDenialId: 'sp', reasonCodes: ['x'] }).signedPayloadProduced).toBe(false);
    expect(buildRetryDenialContract({ retryDenialId: 'r', reasonCodes: ['x'] }).retryRuntimeAllowed).toBe(false);
    expect(buildConfirmationDenialContract({ confirmationDenialId: 'c', reasonCodes: ['x'] }).confirmationPollingAllowed).toBe(false);
    expect(buildSendOperatorApprovalBoundary({ approvalBoundaryId: 'a', approvalStatus: 'required' }).separateSendingPhaseRequired).toBe(true);
    expect(buildSendSigningLinkage({ signingLinkageId: 'sl', sourceSigningBoundaryRef: 'phase83-x', linkageStatus: 'linked' }).linkageStatus).toBe('linked');
    expect(buildSendConstructionLinkage({ constructionLinkageId: 'cl', sourceTransactionConstructionMockRef: 'phase82-x', linkageStatus: 'warning' }).linkageStatus).toBe('warning');
    expect(buildSendExecutionBoundaryLinkage({ executionBoundaryLinkageId: 'el', sourceExecutionBoundaryRef: 'phase81-x', linkageStatus: 'blocked' }).linkageStatus).toBe('blocked');
    expect(buildSendAbortContract({ abortContractId: 'ab', status: 'ready' }).abortModeled).toBe(true);
    expect(buildSendRollbackContract({ rollbackContractId: 'rb', status: 'ready' }).rollbackModeled).toBe(true);
    expect(buildSendSafetyInvariants({ safetyInvariantId: 'si' }).fullAutoLocked).toBe(true);
    expect(buildSendBoundaryBlocker({ blockerId: 'bl', blockerCode: 'x', severity: 'high', blocking: true, reason: 'r' }).blocking).toBe(true);
    expect(buildSendCapabilityAudit({ capabilityAuditId: 'ca' }).sendingCapabilityPresent).toBe(false);
    expect(buildSendScorecard({ scorecardId: 'sc', boundaryScore: 80, classification: 'warning', reviewRequired: true }).boundaryScore).toBe(80);
    expect(buildTransactionSendBoundaryReport({ reportId: 'r', gateSummary: 'g', sendRequestSummary: 's', networkSubmitSummary: 'n', broadcastSummary: 'b', dispatchSummary: 'd', preflightSummary: 'p', retryConfirmationSummary: 'rc', approvalSummary: 'a', abortRollbackSummary: 'ar', evidenceSummary: 'e', safetySummary: 'safe' }).reportId).toBe('r');
    expect(buildTransactionSendBoundaryViewModel({ viewModelId: 'v', fixtureId: 'f', fixtureName: 'send-boundary-design-ready', gateStatus: 'ready', approvalStatus: 'required' }).summary).toContain('send-boundary-design-ready');
    expect(buildTransactionSendBoundaryApiContract({ fixtureId: 'f', fixtureIds: ['f'] }).list.data.totalCount).toBe(1);

    expect(isValidTransactionSendBoundarySafetyGeneratedAt(PHASE_84_TRANSACTION_SEND_BOUNDARY_SAFETY_GENERATED_AT)).toBe(true);
    expect(isValidTransactionSendBoundarySafetySchemaVersion('1.0.0')).toBe(true);
    expect(isValidTransactionSendBoundarySafetySource('phase84_transaction_send_boundary_safety_contracts_v1')).toBe(true);
    expect(isValidTransactionSendBoundarySafetyName('send-boundary-design-ready')).toBe(true);
    expect(isValidTransactionSendBoundarySafetyKind('send_boundary_design_ready')).toBe(true);
  });

  it('rejects unsafe toggles and advisory language', () => {
    const fixture = buildTransactionSendBoundarySafetyFixture({ fixtureName: 'send-boundary-design-ready' });
    const unsafe = {
      ...fixture,
      boundaryGate: { ...fixture.boundaryGate, sendingAllowed: true as const },
      approvalBoundary: { ...fixture.approvalBoundary, approvalAuthorizesSending: true as const },
      report: { ...fixture.report, safetySummary: 'profit signal recommendation output' },
    };
    const codes = new Set(validateTransactionSendBoundarySafetyFixture(unsafe as never).issues.map(issue => issue.code));
    expect(codes.has('SENDING_ALLOWED_FORBIDDEN')).toBe(true);
    expect(codes.has('APPROVAL_BOUNDARY_INVALID')).toBe(true);
    expect(codes.has('ADVISORY_LANGUAGE_FORBIDDEN')).toBe(true);
  });

  it('propagates capability flags to dashboard/read-only-api', () => {
    const dashboard = getDashboardUiShellCapabilities();
    const api = getLocalReadOnlyApiCapabilities();
    expect(dashboard.transactionSendBoundarySafetyContracts).toBe(true);
    expect(dashboard.sendRuntimeSending).toBe(false);
    expect(api.transactionSendBoundarySafetyContracts).toBe(true);
    expect(api.sendRuntimeSending).toBe(false);
    expect(getTransactionSendBoundarySafetyCapabilities().sendAutomaticPromotion).toBe(false);
  });

  it('is deterministic and source snapshots are immutable', () => {
    const a = buildTransactionSendBoundarySafetyFixture({ fixtureName: 'send-boundary-design-ready' });
    const b = buildTransactionSendBoundarySafetyFixture({ fixtureName: 'send-boundary-design-ready' });
    expect(areTransactionSendBoundarySafetyFixturesEqual(a, b)).toBe(true);
    expect(Object.isFrozen(a.sourcePhase83FixtureSnapshot)).toBe(true);
    for (const file of PHASE_84_FILES) {
      const source = readFileSync(resolve(PHASE_84_SRC, file), 'utf8');
      expect(source).not.toMatch(/Date\.now\(/);
      expect(source).not.toMatch(/Math\.random\(/);
      expect(source).not.toMatch(/randomUUID\(/);
      expect(source).not.toMatch(/\bfetch\(/);
    }
  });
});
