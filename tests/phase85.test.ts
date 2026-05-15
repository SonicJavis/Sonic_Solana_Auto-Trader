import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  PHASE_85_POST_SEND_OBSERVATION_BOUNDARY_GENERATED_AT,
  POST_SEND_OBSERVATION_BOUNDARY_FIXTURE_MAP,
  POST_SEND_OBSERVATION_BOUNDARY_FIXTURES,
  POST_SEND_OBSERVATION_BOUNDARY_KINDS,
  POST_SEND_OBSERVATION_BOUNDARY_NAMES,
  POST_SEND_OBSERVATION_BOUNDARY_PHASE,
  arePostSendObservationBoundaryFixturesEqual,
  buildConfirmationStatusPlaceholder,
  buildFinalityObservationPlaceholder,
  buildNetworkReadDenial,
  buildObservationAbortContract,
  buildObservationBoundaryBlocker,
  buildObservationBoundaryGate,
  buildObservationCapabilityAudit,
  buildObservationConstructionLinkage,
  buildObservationExecutionBoundaryLinkage,
  buildObservationRequestDenial,
  buildObservationRollbackContract,
  buildObservationSafetyInvariants,
  buildObservationScorecard,
  buildObservationSendBoundaryLinkage,
  buildObservationSigningBoundaryLinkage,
  buildPollingDenialContract,
  buildPostSendObservationBoundaryApiContract,
  buildPostSendObservationBoundaryFixture,
  buildPostSendObservationBoundaryReport,
  buildPostSendObservationBoundaryViewModel,
  buildRetryObservationDenial,
  buildSignatureStatusPlaceholder,
  buildSlotObservationPlaceholder,
  buildSubscriptionDenialContract,
  getDashboardUiShellCapabilities,
  getPostSendObservationBoundaryCapabilities,
  getPostSendObservationBoundaryFixture,
  isValidPostSendObservationBoundaryGeneratedAt,
  isValidPostSendObservationBoundaryKind,
  isValidPostSendObservationBoundaryName,
  isValidPostSendObservationBoundarySchemaVersion,
  isValidPostSendObservationBoundarySource,
  listPostSendObservationBoundaryFixtures,
  normalizePostSendObservationBoundaryFixture,
  selectPostSendObservationBoundaryFixture,
  serializePostSendObservationBoundaryFixture,
  validatePostSendObservationBoundaryFixture,
  validatePostSendObservationBoundarySafety,
} from '../apps/dashboard/src/index.js';
import { getLocalReadOnlyApiCapabilities } from '../apps/read-only-api/src/capabilities.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const PHASE_85_SRC = resolve(REPO_ROOT, 'apps/dashboard/src/post-send-observation-boundary');

const PHASE_85_FILES = [
  'types.ts',
  'observation-boundary-gates.ts',
  'observation-request-denials.ts',
  'confirmation-status-placeholders.ts',
  'signature-status-placeholders.ts',
  'slot-observation-placeholders.ts',
  'finality-observation-placeholders.ts',
  'retry-observation-denials.ts',
  'polling-denial-contracts.ts',
  'subscription-denial-contracts.ts',
  'network-read-denials.ts',
  'send-boundary-linkage.ts',
  'signing-boundary-linkage.ts',
  'construction-linkage.ts',
  'execution-boundary-linkage.ts',
  'abort-contracts.ts',
  'rollback-contracts.ts',
  'safety-invariants.ts',
  'blocker-taxonomy.ts',
  'capability-audits.ts',
  'observation-scorecards.ts',
  'observation-reports.ts',
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

describe('Phase 85 — Post-Send Observation Boundary Contracts v1', () => {
  it('has all required source files and docs', () => {
    for (const file of PHASE_85_FILES) {
      expect(() => readFileSync(resolve(PHASE_85_SRC, file), 'utf8')).not.toThrow();
    }
    expect(() => readFileSync(resolve(REPO_ROOT, 'docs/POST_SEND_OBSERVATION_BOUNDARY.md'), 'utf8')).not.toThrow();
  });

  it('has constants and fixture surfaces', () => {
    expect(POST_SEND_OBSERVATION_BOUNDARY_PHASE).toBe(85);
    expect(PHASE_85_POST_SEND_OBSERVATION_BOUNDARY_GENERATED_AT).toBe('2026-05-15T00:00:00.000Z');
    expect(POST_SEND_OBSERVATION_BOUNDARY_NAMES).toHaveLength(8);
    expect(POST_SEND_OBSERVATION_BOUNDARY_KINDS).toHaveLength(8);
    expect(POST_SEND_OBSERVATION_BOUNDARY_FIXTURES.length).toBeGreaterThanOrEqual(8);
    expect(POST_SEND_OBSERVATION_BOUNDARY_FIXTURE_MAP.size).toBe(POST_SEND_OBSERVATION_BOUNDARY_FIXTURES.length);
  });

  it('supports list/get/select/normalize/serialize/equality', () => {
    const fixture = POST_SEND_OBSERVATION_BOUNDARY_FIXTURES[0]!;
    expect(listPostSendObservationBoundaryFixtures()).toBe(POST_SEND_OBSERVATION_BOUNDARY_FIXTURES);
    expect(getPostSendObservationBoundaryFixture(fixture.fixtureId)).toBe(fixture);
    expect(selectPostSendObservationBoundaryFixture({ fixtureName: fixture.fixtureName }).matched).toBe(true);
    expect(selectPostSendObservationBoundaryFixture({ fixtureId: 'missing' }).matched).toBe(false);
    const normalized = normalizePostSendObservationBoundaryFixture(fixture);
    expect(serializePostSendObservationBoundaryFixture(fixture)).toContain('"fixtureId"');
    expect(arePostSendObservationBoundaryFixturesEqual(fixture, normalized)).toBe(true);
  });

  it('enforces fail-closed observation denials', () => {
    for (const fixture of POST_SEND_OBSERVATION_BOUNDARY_FIXTURES) {
      expect(validatePostSendObservationBoundaryFixture(fixture).valid).toBe(true);
      expect(validatePostSendObservationBoundarySafety(fixture).safe).toBe(true);
      expect(fixture.boundaryGate.unlockAuthority).toBe(false);
      expect(fixture.boundaryGate.liveObservationAllowed).toBe(false);
      expect(fixture.boundaryGate.pollingAllowed).toBe(false);
      expect(fixture.boundaryGate.subscriptionAllowed).toBe(false);
      expect(fixture.boundaryGate.networkReadAllowed).toBe(false);
      expect(fixture.observationRequestDenial.observationRequestBlocked).toBe(true);
      expect(fixture.observationRequestDenial.confirmationLookupBlocked).toBe(true);
      expect(fixture.confirmationStatusPlaceholder.liveConfirmationFetched).toBe(false);
      expect(fixture.signatureStatusPlaceholder.liveSignatureLookupAllowed).toBe(false);
      expect(fixture.slotObservationPlaceholder.liveSlotFetchAllowed).toBe(false);
      expect(fixture.finalityObservationPlaceholder.liveFinalityFetchAllowed).toBe(false);
      expect(fixture.retryObservationDenial.retryRuntimeAllowed).toBe(false);
      expect(fixture.pollingDenialContract.pollingRuntimeAllowed).toBe(false);
      expect(fixture.subscriptionDenialContract.subscriptionRuntimeAllowed).toBe(false);
      expect(fixture.networkReadDenial.networkReadRuntimeAllowed).toBe(false);
    }
  });

  it('covers required fixture scenarios', () => {
    expect(buildPostSendObservationBoundaryFixture({ fixtureName: 'observation-boundary-design-ready' }).boundaryGate.gateStatus).toBe('ready');
    expect(buildPostSendObservationBoundaryFixture({ fixtureName: 'missing-send-boundary-blocked' }).sendBoundaryLinkage.linkageStatus).toBe('blocked');
    expect(buildPostSendObservationBoundaryFixture({ fixtureName: 'confirmation-lookup-denied' }).observationRequestDenial.confirmationLookupBlocked).toBe(true);
    expect(buildPostSendObservationBoundaryFixture({ fixtureName: 'signature-status-lookup-denied' }).signatureStatusPlaceholder.liveSignatureLookupAllowed).toBe(false);
    expect(buildPostSendObservationBoundaryFixture({ fixtureName: 'slot-finality-observation-denied' }).finalityObservationPlaceholder.liveFinalityFetchAllowed).toBe(false);
    expect(buildPostSendObservationBoundaryFixture({ fixtureName: 'polling-subscription-denied' }).subscriptionDenialContract.subscriptionRuntimeAllowed).toBe(false);
    expect(buildPostSendObservationBoundaryFixture({ fixtureName: 'retry-observation-denied' }).retryObservationDenial.retryRuntimeAllowed).toBe(false);
    expect(buildPostSendObservationBoundaryFixture({ fixtureName: 'unsafe-capability-rejected' }).boundaryGate.gateStatus).toBe('rejected');
  });

  it('builder wrappers and validators work', () => {
    expect(buildObservationBoundaryGate({ observationBoundaryGateId: 'g', observationBoundaryGateName: 'n', gateStatus: 'blocked', blockingReasonCodes: ['x'] }).phase).toBe(85);
    expect(buildObservationRequestDenial({ observationRequestDenialId: 'o', reasonCodes: ['x'] }).transactionLookupBlocked).toBe(true);
    expect(buildConfirmationStatusPlaceholder({ confirmationStatusPlaceholderId: 'c', reasonCodes: ['x'] }).confirmationStatusProduced).toBe(false);
    expect(buildSignatureStatusPlaceholder({ signatureStatusPlaceholderId: 's', reasonCodes: ['x'] }).realSignatureRequired).toBe(false);
    expect(buildSlotObservationPlaceholder({ slotObservationPlaceholderId: 'sl', reasonCodes: ['x'] }).liveSlotFetchAllowed).toBe(false);
    expect(buildFinalityObservationPlaceholder({ finalityObservationPlaceholderId: 'f', reasonCodes: ['x'] }).liveFinalityFetchAllowed).toBe(false);
    expect(buildRetryObservationDenial({ retryObservationDenialId: 'r', reasonCodes: ['x'] }).retryRuntimeAllowed).toBe(false);
    expect(buildPollingDenialContract({ pollingDenialId: 'p', reasonCodes: ['x'] }).pollingRuntimeAllowed).toBe(false);
    expect(buildSubscriptionDenialContract({ subscriptionDenialId: 'su', reasonCodes: ['x'] }).subscriptionRuntimeAllowed).toBe(false);
    expect(buildNetworkReadDenial({ networkReadDenialId: 'n', reasonCodes: ['x'] }).networkReadRuntimeAllowed).toBe(false);
    expect(buildObservationSendBoundaryLinkage({ sendBoundaryLinkageId: 'sl', sourceSendBoundaryRef: 'phase84-x', linkageStatus: 'linked' }).linkageStatus).toBe('linked');
    expect(buildObservationSigningBoundaryLinkage({ signingBoundaryLinkageId: 'sg', sourceSigningBoundaryRef: 'phase83-x', linkageStatus: 'warning' }).linkageStatus).toBe('warning');
    expect(buildObservationConstructionLinkage({ constructionLinkageId: 'cl', sourceTransactionConstructionMockRef: 'phase82-x', linkageStatus: 'blocked' }).linkageStatus).toBe('blocked');
    expect(buildObservationExecutionBoundaryLinkage({ executionBoundaryLinkageId: 'el', sourceExecutionBoundaryRef: 'phase81-x', linkageStatus: 'linked' }).linkageStatus).toBe('linked');
    expect(buildObservationAbortContract({ abortContractId: 'ab', status: 'ready' }).abortModeled).toBe(true);
    expect(buildObservationRollbackContract({ rollbackContractId: 'rb', status: 'ready' }).rollbackModeled).toBe(true);
    expect(buildObservationSafetyInvariants({ safetyInvariantId: 'si' }).fullAutoLocked).toBe(true);
    expect(buildObservationBoundaryBlocker({ blockerId: 'bl', blockerCode: 'x', severity: 'high', blocking: true, reason: 'r' }).blocking).toBe(true);
    expect(buildObservationCapabilityAudit({ capabilityAuditId: 'ca' }).liveObservationCapabilityPresent).toBe(false);
    expect(buildObservationScorecard({ scorecardId: 'sc', boundaryScore: 80, classification: 'warning', reviewRequired: true }).boundaryScore).toBe(80);
    expect(buildPostSendObservationBoundaryReport({ reportId: 'r', gateSummary: 'g', requestSummary: 'rq', confirmationSummary: 'c', signatureStatusSummary: 's', slotFinalitySummary: 'sf', retryPollingSubscriptionSummary: 'rp', linkageSummary: 'l', safetySummary: 'safe' }).reportId).toBe('r');
    expect(buildPostSendObservationBoundaryViewModel({ viewModelId: 'v', fixtureId: 'f', fixtureName: 'observation-boundary-design-ready', gateStatus: 'ready' }).summary).toContain('observation-boundary-design-ready');
    expect(buildPostSendObservationBoundaryApiContract({ fixtureId: 'f', fixtureIds: ['f'] }).list.data.totalCount).toBe(1);
    expect(isValidPostSendObservationBoundaryGeneratedAt(PHASE_85_POST_SEND_OBSERVATION_BOUNDARY_GENERATED_AT)).toBe(true);
    expect(isValidPostSendObservationBoundarySchemaVersion('1.0.0')).toBe(true);
    expect(isValidPostSendObservationBoundarySource('phase85_post_send_observation_boundary_contracts_v1')).toBe(true);
    expect(isValidPostSendObservationBoundaryName('observation-boundary-design-ready')).toBe(true);
    expect(isValidPostSendObservationBoundaryKind('observation_boundary_design_ready')).toBe(true);
  });

  it('rejects unsafe toggles and advisory language', () => {
    const fixture = buildPostSendObservationBoundaryFixture({ fixtureName: 'observation-boundary-design-ready' });
    const unsafe = {
      ...fixture,
      boundaryGate: { ...fixture.boundaryGate, liveObservationAllowed: true as const },
      capabilities: { ...fixture.capabilities, observationAutomaticPromotion: true as const },
      report: { ...fixture.report, safetySummary: 'profit signal recommendation output' },
    };
    const codes = new Set(validatePostSendObservationBoundaryFixture(unsafe as never).issues.map(issue => issue.code));
    expect(codes.has('LIVE_OBSERVATION_ALLOWED_FORBIDDEN')).toBe(true);
    expect(codes.has('AUTO_PROMOTION_FORBIDDEN')).toBe(true);
    expect(codes.has('ADVISORY_LANGUAGE_FORBIDDEN')).toBe(true);
  });

  it('propagates capability flags to dashboard/read-only-api', () => {
    const dashboard = getDashboardUiShellCapabilities();
    const api = getLocalReadOnlyApiCapabilities();
    expect(dashboard.postSendObservationBoundaryContracts).toBe(true);
    expect(dashboard.observationRuntimeObservation).toBe(false);
    expect(api.postSendObservationBoundaryContracts).toBe(true);
    expect(api.observationRuntimeObservation).toBe(false);
    expect(getPostSendObservationBoundaryCapabilities().observationAutomaticPromotion).toBe(false);
  });

  it('is deterministic and source snapshots are immutable', () => {
    const a = buildPostSendObservationBoundaryFixture({ fixtureName: 'observation-boundary-design-ready' });
    const b = buildPostSendObservationBoundaryFixture({ fixtureName: 'observation-boundary-design-ready' });
    expect(arePostSendObservationBoundaryFixturesEqual(a, b)).toBe(true);
    expect(Object.isFrozen(a.sourcePhase84FixtureSnapshot)).toBe(true);
    for (const file of PHASE_85_FILES) {
      const source = readFileSync(resolve(PHASE_85_SRC, file), 'utf8');
      expect(source).not.toMatch(/Date\.now\(/);
      expect(source).not.toMatch(/Math\.random\(/);
      expect(source).not.toMatch(/randomUUID\(/);
      expect(source).not.toMatch(/\bfetch\(/);
    }
  });
});
