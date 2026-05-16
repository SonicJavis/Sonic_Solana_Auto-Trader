import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  OUTCOME_RISK_FEEDBACK_CONTRACTS_FIXTURE_MAP,
  OUTCOME_RISK_FEEDBACK_CONTRACTS_FIXTURES,
  OUTCOME_RISK_FEEDBACK_CONTRACTS_KINDS,
  OUTCOME_RISK_FEEDBACK_CONTRACTS_NAMES,
  OUTCOME_RISK_FEEDBACK_CONTRACTS_PHASE,
  PHASE_87_OUTCOME_RISK_FEEDBACK_CONTRACTS_GENERATED_AT,
  areOutcomeRiskFeedbackFixturesEqual,
  buildConfidenceDeltaPlaceholder,
  buildEvidenceFeedbackBundle,
  buildFeedbackAbortContract,
  buildFeedbackBlocker,
  buildFeedbackCapabilityAudit,
  buildFeedbackEvidenceModelLinkage,
  buildFeedbackLoopGate,
  buildFeedbackObservationBoundaryLinkage,
  buildFeedbackOutcomeAuditLinkage,
  buildFeedbackReplayLinkage,
  buildFeedbackRiskEngineLinkage,
  buildFeedbackRollbackContract,
  buildFeedbackSafetyInvariants,
  buildFeedbackScorecard,
  buildOutcomeFeedbackEvent,
  buildOutcomeRiskFeedbackApiContract,
  buildOutcomeRiskFeedbackFixture,
  buildOutcomeRiskFeedbackReport,
  buildOutcomeRiskFeedbackViewModel,
  buildRiskDeltaPlaceholder,
  buildRiskFeedbackLink,
  buildRiskReassessmentPlaceholder,
  buildSafetyGateFeedbackLink,
  getDashboardUiShellCapabilities,
  getOutcomeRiskFeedbackCapabilities,
  getOutcomeRiskFeedbackFixture,
  isValidOutcomeRiskFeedbackContractKind,
  isValidOutcomeRiskFeedbackContractName,
  isValidOutcomeRiskFeedbackGeneratedAt,
  isValidOutcomeRiskFeedbackSchemaVersion,
  isValidOutcomeRiskFeedbackSource,
  listOutcomeRiskFeedbackFixtures,
  normalizeOutcomeRiskFeedbackFixture,
  selectOutcomeRiskFeedbackFixture,
  serializeOutcomeRiskFeedbackFixture,
  validateOutcomeRiskFeedbackFixture,
  validateOutcomeRiskFeedbackSafety,
} from '../apps/dashboard/src/index.js';
import { getLocalReadOnlyApiCapabilities } from '../apps/read-only-api/src/capabilities.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const PHASE_87_SRC = resolve(REPO_ROOT, 'apps/dashboard/src/outcome-risk-feedback-contracts');

const PHASE_87_FILES = [
  'types.ts',
  'feedback-loop-gates.ts',
  'outcome-feedback-events.ts',
  'risk-feedback-links.ts',
  'risk-reassessment-placeholders.ts',
  'safety-gate-feedback-links.ts',
  'evidence-feedback-bundles.ts',
  'risk-delta-placeholders.ts',
  'confidence-delta-placeholders.ts',
  'feedback-blocker-taxonomy.ts',
  'feedback-replay-linkage.ts',
  'outcome-audit-linkage.ts',
  'observation-boundary-linkage.ts',
  'risk-engine-linkage.ts',
  'evidence-model-linkage.ts',
  'abort-contracts.ts',
  'rollback-contracts.ts',
  'safety-invariants.ts',
  'capability-audits.ts',
  'feedback-scorecards.ts',
  'feedback-reports.ts',
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

describe('Phase 87 — Outcome-to-Risk Feedback Loop Contracts v1', () => {
  it('has all required source files and docs', () => {
    for (const file of PHASE_87_FILES) {
      expect(() => readFileSync(resolve(PHASE_87_SRC, file), 'utf8')).not.toThrow();
    }
    expect(() =>
      readFileSync(resolve(REPO_ROOT, 'docs/OUTCOME_RISK_FEEDBACK_CONTRACTS.md'), 'utf8'),
    ).not.toThrow();
  });

  it('has constants and fixture surfaces', () => {
    expect(OUTCOME_RISK_FEEDBACK_CONTRACTS_PHASE).toBe(87);
    expect(PHASE_87_OUTCOME_RISK_FEEDBACK_CONTRACTS_GENERATED_AT).toBe('2026-05-16T00:00:00.000Z');
    expect(OUTCOME_RISK_FEEDBACK_CONTRACTS_NAMES).toHaveLength(8);
    expect(OUTCOME_RISK_FEEDBACK_CONTRACTS_KINDS).toHaveLength(8);
    expect(OUTCOME_RISK_FEEDBACK_CONTRACTS_FIXTURES.length).toBeGreaterThanOrEqual(8);
    expect(OUTCOME_RISK_FEEDBACK_CONTRACTS_FIXTURE_MAP.size).toBe(
      OUTCOME_RISK_FEEDBACK_CONTRACTS_FIXTURES.length,
    );
  });

  it('supports list/get/select/normalize/serialize/equality', () => {
    const fixture = OUTCOME_RISK_FEEDBACK_CONTRACTS_FIXTURES[0]!;
    expect(listOutcomeRiskFeedbackFixtures()).toBe(OUTCOME_RISK_FEEDBACK_CONTRACTS_FIXTURES);
    expect(getOutcomeRiskFeedbackFixture(fixture.fixtureId)).toBe(fixture);
    expect(selectOutcomeRiskFeedbackFixture({ fixtureName: fixture.fixtureName }).matched).toBe(true);
    expect(selectOutcomeRiskFeedbackFixture({ fixtureId: 'missing' }).matched).toBe(false);
    const normalized = normalizeOutcomeRiskFeedbackFixture(fixture);
    expect(serializeOutcomeRiskFeedbackFixture(fixture)).toContain('"fixtureId"');
    expect(areOutcomeRiskFeedbackFixturesEqual(fixture, normalized)).toBe(true);
  });

  it('enforces fail-closed feedback denials', () => {
    for (const fixture of OUTCOME_RISK_FEEDBACK_CONTRACTS_FIXTURES) {
      expect(validateOutcomeRiskFeedbackFixture(fixture).valid).toBe(true);
      expect(validateOutcomeRiskFeedbackSafety(fixture).safe).toBe(true);
      expect(fixture.feedbackLoopGate.unlockAuthority).toBe(false);
      expect(fixture.feedbackLoopGate.liveRiskUpdateAllowed).toBe(false);
      expect(fixture.feedbackLoopGate.automaticRiskMutationAllowed).toBe(false);
      expect(fixture.feedbackLoopGate.safetyGateMutationAllowed).toBe(false);
      expect(fixture.outcomeFeedbackEvent.liveOutcomeLookupAllowed).toBe(false);
      expect(fixture.riskFeedbackLink.liveRiskRefreshAllowed).toBe(false);
      expect(fixture.riskReassessmentPlaceholder.liveReassessmentAllowed).toBe(false);
      expect(fixture.riskReassessmentPlaceholder.reassessmentOutputProduced).toBe(false);
      expect(fixture.safetyGateFeedbackLink.automaticUnlockAllowed).toBe(false);
      expect(fixture.riskDeltaPlaceholder.deltaComputedFromLiveData).toBe(false);
      expect(fixture.riskDeltaPlaceholder.liveDeltaOutputProduced).toBe(false);
      expect(fixture.confidenceDeltaPlaceholder.deltaComputedFromLiveData).toBe(false);
      expect(fixture.confidenceDeltaPlaceholder.liveDeltaOutputProduced).toBe(false);
    }
  });

  it('covers required fixture scenarios', () => {
    expect(buildOutcomeRiskFeedbackFixture({ fixtureName: 'feedback-loop-design-ready' }).feedbackLoopGate.gateStatus).toBe('ready');
    expect(buildOutcomeRiskFeedbackFixture({ fixtureName: 'missing-outcome-audit-blocked' }).feedbackOutcomeAuditLinkage.linkageStatus).toBe('blocked');
    expect(buildOutcomeRiskFeedbackFixture({ fixtureName: 'missing-risk-evidence-blocked' }).feedbackRiskEngineLinkage.linkageStatus).toBe('blocked');
    expect(buildOutcomeRiskFeedbackFixture({ fixtureName: 'live-risk-update-denied' }).feedbackLoopGate.liveRiskUpdateAllowed).toBe(false);
    expect(buildOutcomeRiskFeedbackFixture({ fixtureName: 'safety-gate-mutation-denied' }).safetyGateFeedbackLink.safetyGateMutationAllowed).toBe(false);
    expect(buildOutcomeRiskFeedbackFixture({ fixtureName: 'risk-delta-live-computation-denied' }).riskDeltaPlaceholder.deltaComputedFromLiveData).toBe(false);
    expect(buildOutcomeRiskFeedbackFixture({ fixtureName: 'evidence-feedback-incomplete-blocked' }).evidenceBundle.evidenceComplete).toBe(false);
    expect(buildOutcomeRiskFeedbackFixture({ fixtureName: 'unsafe-capability-rejected' }).feedbackLoopGate.gateStatus).toBe('rejected');
  });

  it('builder wrappers work correctly', () => {
    expect(
      buildFeedbackLoopGate({
        feedbackLoopGateId: 'g',
        feedbackLoopGateName: 'n',
        gateStatus: 'blocked',
        blockingReasonCodes: ['x'],
      }).phase,
    ).toBe(87);
    expect(
      buildOutcomeFeedbackEvent({
        outcomeFeedbackEventId: 'e',
        sourceOutcomeAuditRef: 'phase86-x',
        reasonCodes: ['x'],
      }).liveOutcomeLookupAllowed,
    ).toBe(false);
    expect(
      buildRiskFeedbackLink({
        riskFeedbackLinkId: 'r',
        sourceRiskFixtureRef: 'phase58-x',
        sourceEvidenceFixtureRef: 'phase59-x',
        sourceOutcomeAuditFixtureRef: 'phase86-x',
        linkStatus: 'linked',
      }).liveRiskRefreshAllowed,
    ).toBe(false);
    expect(
      buildRiskReassessmentPlaceholder({
        riskReassessmentPlaceholderId: 'rr',
        reasonCodes: ['x'],
      }).reassessmentOutputProduced,
    ).toBe(false);
    expect(
      buildSafetyGateFeedbackLink({
        safetyGateFeedbackLinkId: 'sg',
        reasonCodes: ['x'],
      }).automaticUnlockAllowed,
    ).toBe(false);
    expect(buildRiskDeltaPlaceholder({ riskDeltaPlaceholderId: 'rd', reasonCodes: ['x'] }).liveDeltaOutputProduced).toBe(false);
    expect(
      buildConfidenceDeltaPlaceholder({ confidenceDeltaPlaceholderId: 'cd', reasonCodes: ['x'] })
        .deltaComputedFromLiveData,
    ).toBe(false);
    expect(
      buildEvidenceFeedbackBundle({
        evidenceBundleId: 'eb',
        sourcePhaseRefs: ['phase86'],
        sourceFixtureRefs: ['phase86-x'],
        outcomeAuditRefs: ['phase86-x'],
        riskEvidenceRefs: ['phase58-x'],
        validationCommandRefs: ['pnpm test'],
        safetyGrepRefs: ['rg privateKey'],
        docsRefs: ['docs/X.md'],
        evidenceComplete: true,
      }).evidenceComplete,
    ).toBe(true);
    expect(
      buildFeedbackReplayLinkage({
        feedbackReplayLinkageId: 'fr',
        sourceReplayFixtureRef: 'phase73-x',
        linkageStatus: 'warning',
      }).linkageStatus,
    ).toBe('warning');
    expect(
      buildFeedbackOutcomeAuditLinkage({
        feedbackOutcomeAuditLinkageId: 'fo',
        sourceOutcomeAuditRef: 'phase86-x',
        linkageStatus: 'linked',
      }).linkageStatus,
    ).toBe('linked');
    expect(
      buildFeedbackObservationBoundaryLinkage({
        feedbackObservationBoundaryLinkageId: 'fb',
        sourceObservationBoundaryRef: 'phase85-x',
        linkageStatus: 'linked',
      }).linkageStatus,
    ).toBe('linked');
    expect(
      buildFeedbackRiskEngineLinkage({
        feedbackRiskEngineLinkageId: 're',
        sourceRiskEngineRef: 'phase58-x',
        linkageStatus: 'linked',
      }).sourceRiskEngineRef,
    ).toBe('phase58-x');
    expect(
      buildFeedbackEvidenceModelLinkage({
        feedbackEvidenceModelLinkageId: 'em',
        sourceEvidenceModelRef: 'phase59-x',
        linkageStatus: 'blocked',
      }).linkageStatus,
    ).toBe('blocked');
    expect(buildFeedbackAbortContract({ abortContractId: 'ab', status: 'ready' }).abortModeled).toBe(true);
    expect(buildFeedbackRollbackContract({ rollbackContractId: 'rb', status: 'ready' }).rollbackModeled).toBe(true);
    expect(buildFeedbackSafetyInvariants({ safetyInvariantId: 'si' }).fullAutoLocked).toBe(true);
    expect(
      buildFeedbackBlocker({
        blockerId: 'bl',
        blockerCode: 'x',
        severity: 'high',
        blocking: true,
        reason: 'r',
      }).blocking,
    ).toBe(true);
    expect(buildFeedbackCapabilityAudit({ capabilityAuditId: 'ca' }).liveFeedbackCapabilityPresent).toBe(false);
    expect(
      buildFeedbackScorecard({
        scorecardId: 'sc',
        auditScore: 80,
        classification: 'warning',
        reviewRequired: true,
      }).auditScore,
    ).toBe(80);
    expect(
      buildOutcomeRiskFeedbackReport({
        reportId: 'r',
        gateSummary: 'g',
        outcomeFeedbackSummary: 'o',
        riskLinkSummary: 'rl',
        reassessmentSummary: 'rs',
        safetyGateFeedbackSummary: 'sg',
        deltaSummary: 'd',
        evidenceSummary: 'e',
        safetySummary: 's',
      }).reportId,
    ).toBe('r');
    expect(
      buildOutcomeRiskFeedbackViewModel({
        viewModelId: 'v',
        fixtureId: 'f',
        fixtureName: 'feedback-loop-design-ready',
        gateStatus: 'ready',
      }).summary,
    ).toContain('feedback-loop-design-ready');
    expect(
      buildOutcomeRiskFeedbackApiContract({ fixtureId: 'f', fixtureIds: ['f'] }).list.data.totalCount,
    ).toBe(1);
    expect(
      isValidOutcomeRiskFeedbackGeneratedAt(PHASE_87_OUTCOME_RISK_FEEDBACK_CONTRACTS_GENERATED_AT),
    ).toBe(true);
    expect(isValidOutcomeRiskFeedbackSchemaVersion('1.0.0')).toBe(true);
    expect(isValidOutcomeRiskFeedbackSource('phase87_outcome_risk_feedback_loop_contracts_v1')).toBe(true);
    expect(isValidOutcomeRiskFeedbackContractName('feedback-loop-design-ready')).toBe(true);
    expect(isValidOutcomeRiskFeedbackContractKind('feedback_loop_design_ready')).toBe(true);
  });

  it('rejects unsafe toggles and advisory language', () => {
    const fixture = buildOutcomeRiskFeedbackFixture({ fixtureName: 'feedback-loop-design-ready' });
    const unsafe = {
      ...fixture,
      feedbackLoopGate: { ...fixture.feedbackLoopGate, liveRiskUpdateAllowed: true as never },
      capabilities: { ...fixture.capabilities, feedbackAutomaticPromotion: true as never },
      report: { ...fixture.report, safetySummary: 'profit signal recommendation output' },
    };
    const codes = new Set(validateOutcomeRiskFeedbackFixture(unsafe as never).issues.map(issue => issue.code));
    expect(codes.has('LIVE_RISK_UPDATE_FORBIDDEN')).toBe(true);
    expect(codes.has('ORDER_EXEC_PROMOTION_FORBIDDEN')).toBe(true);
    expect(codes.has('ADVISORY_LANGUAGE_FORBIDDEN')).toBe(true);
  });

  it('rejects wrong phase', () => {
    const fixture = buildOutcomeRiskFeedbackFixture({ fixtureName: 'feedback-loop-design-ready' });
    const wrongPhase = { ...fixture, phase: 86 as never };
    const result = validateOutcomeRiskFeedbackFixture(wrongPhase as never);
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.code === 'WRONG_PHASE')).toBe(true);
  });

  it('propagates capability flags to dashboard/read-only-api', () => {
    const dashboard = getDashboardUiShellCapabilities();
    const api = getLocalReadOnlyApiCapabilities();
    expect(dashboard.outcomeRiskFeedbackContracts).toBe(true);
    expect(dashboard.feedbackLiveRiskUpdate).toBe(false);
    expect(api.outcomeRiskFeedbackContracts).toBe(true);
    expect(api.feedbackLiveRiskUpdate).toBe(false);
    expect(getOutcomeRiskFeedbackCapabilities().feedbackAutomaticPromotion).toBe(false);
  });

  it('is deterministic and source snapshots are immutable', () => {
    const a = buildOutcomeRiskFeedbackFixture({ fixtureName: 'feedback-loop-design-ready' });
    const b = buildOutcomeRiskFeedbackFixture({ fixtureName: 'feedback-loop-design-ready' });
    expect(areOutcomeRiskFeedbackFixturesEqual(a, b)).toBe(true);
    expect(Object.isFrozen(a.sourcePhase86FixtureSnapshot)).toBe(true);
    expect(Object.isFrozen(a.sourcePhase59FixtureSnapshot)).toBe(true);
    for (const file of PHASE_87_FILES) {
      const source = readFileSync(resolve(PHASE_87_SRC, file), 'utf8');
      expect(source).not.toMatch(/Date\.now\(/);
      expect(source).not.toMatch(/Math\.random\(/);
      expect(source).not.toMatch(/randomUUID\(/);
      expect(source).not.toMatch(/\bfetch\s*\(/);
      expect(source).not.toMatch(/\bsendTransaction\s*\(/);
      expect(source).not.toMatch(/\bsendRawTransaction\s*\(/);
      expect(source).not.toMatch(/\bgetTransaction\s*\(/);
      expect(source).not.toMatch(/\bgetSignatureStatuses\s*\(/);
    }
  });
});
