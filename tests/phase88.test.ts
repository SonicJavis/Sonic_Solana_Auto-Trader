import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  PHASE_88_RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_GENERATED_AT,
  PHASE_88_RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_SCHEMA_VERSION,
  PHASE_88_RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_SOURCE,
  RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_FIXTURE_MAP,
  RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_FIXTURES,
  RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_KINDS,
  RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_NAMES,
  RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_PHASE,
  areRiskFeedbackSafetyGateReevaluationFixturesEqual,
  buildBlockerReviewContract,
  buildEscalationContract,
  buildEvidenceReviewBundle,
  buildFeedbackReviewEvent,
  buildGateStatusPlaceholder,
  buildManualReviewPlaceholder,
  buildReevaluationAbortContract,
  buildReevaluationCapabilityAudit,
  buildReevaluationFeedbackLinkage,
  buildReevaluationGate,
  buildReevaluationOutcomeLinkage,
  buildReevaluationRiskLinkage,
  buildReevaluationCertificationLinkage,
  buildReevaluationRollbackContract,
  buildReevaluationSafetyInvariants,
  buildReevaluationScorecard,
  buildRiskFeedbackSafetyGateReevaluationApiContract,
  buildRiskFeedbackSafetyGateReevaluationFixture,
  buildRiskFeedbackSafetyGateReevaluationReport,
  buildRiskFeedbackSafetyGateReevaluationViewModel,
  buildSafetyGateReevaluationLink,
  getDashboardUiShellCapabilities,
  getRiskFeedbackSafetyGateReevaluationCapabilities,
  getRiskFeedbackSafetyGateReevaluationFixture,
  isValidRiskFeedbackSafetyGateReevaluationContractKind,
  isValidRiskFeedbackSafetyGateReevaluationContractName,
  isValidRiskFeedbackSafetyGateReevaluationGeneratedAt,
  isValidRiskFeedbackSafetyGateReevaluationSchemaVersion,
  isValidRiskFeedbackSafetyGateReevaluationSource,
  listRiskFeedbackSafetyGateReevaluationFixtures,
  normalizeRiskFeedbackSafetyGateReevaluationFixture,
  selectRiskFeedbackSafetyGateReevaluationFixture,
  serializeRiskFeedbackSafetyGateReevaluationFixture,
  validateRiskFeedbackSafetyGateReevaluationFixture,
  validateRiskFeedbackSafetyGateReevaluationSafety,
} from '../apps/dashboard/src/index.js';
import { getLocalReadOnlyApiCapabilities } from '../apps/read-only-api/src/capabilities.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const PHASE_88_SRC = resolve(
  REPO_ROOT,
  'apps/dashboard/src/risk-feedback-safety-gate-reevaluation',
);

const PHASE_88_FILES = [
  'types.ts',
  'reevaluation-gates.ts',
  'feedback-review-events.ts',
  'safety-gate-reevaluation-links.ts',
  'manual-review-placeholders.ts',
  'gate-status-placeholders.ts',
  'blocker-review-contracts.ts',
  'escalation-contracts.ts',
  'evidence-review-bundles.ts',
  'policy-check-placeholders.ts',
  'readiness-impact-placeholders.ts',
  'feedback-linkage.ts',
  'risk-linkage.ts',
  'outcome-linkage.ts',
  'certification-linkage.ts',
  'abort-contracts.ts',
  'rollback-contracts.ts',
  'safety-invariants.ts',
  'capability-audits.ts',
  'reevaluation-scorecards.ts',
  'reevaluation-reports.ts',
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

describe('Phase 88 — Risk Feedback Safety Gate Re-Evaluation Contracts v1', () => {
  it('has all required source files and docs', () => {
    for (const file of PHASE_88_FILES) {
      expect(() => readFileSync(resolve(PHASE_88_SRC, file), 'utf8')).not.toThrow();
    }
    expect(() =>
      readFileSync(
        resolve(REPO_ROOT, 'docs/RISK_FEEDBACK_SAFETY_GATE_REEVALUATION.md'),
        'utf8',
      ),
    ).not.toThrow();
  });

  it('has constants and fixture surfaces', () => {
    expect(RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_PHASE).toBe(88);
    expect(PHASE_88_RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_GENERATED_AT).toBe(
      '2026-05-16T00:00:00.000Z',
    );
    expect(RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_NAMES).toHaveLength(8);
    expect(RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_KINDS).toHaveLength(8);
    expect(RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_FIXTURES.length).toBeGreaterThanOrEqual(8);
    expect(RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_FIXTURE_MAP.size).toBe(
      RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_FIXTURES.length,
    );
  });

  it('supports list/get/select/normalize/serialize/equality', () => {
    const fixture = RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_FIXTURES[0]!;
    expect(listRiskFeedbackSafetyGateReevaluationFixtures()).toBe(
      RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_FIXTURES,
    );
    expect(getRiskFeedbackSafetyGateReevaluationFixture(fixture.fixtureId)).toBe(fixture);
    expect(
      selectRiskFeedbackSafetyGateReevaluationFixture({ fixtureName: fixture.fixtureName })
        .matched,
    ).toBe(true);
    expect(
      selectRiskFeedbackSafetyGateReevaluationFixture({ fixtureId: 'missing' }).matched,
    ).toBe(false);
    const normalized = normalizeRiskFeedbackSafetyGateReevaluationFixture(fixture);
    expect(serializeRiskFeedbackSafetyGateReevaluationFixture(fixture)).toContain('"fixtureId"');
    expect(areRiskFeedbackSafetyGateReevaluationFixturesEqual(fixture, normalized)).toBe(true);
    expect(areRiskFeedbackSafetyGateReevaluationFixturesEqual(fixture, RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_FIXTURES[1]!)).toBe(false);
  });

  it('validates all 8 fixtures as valid', () => {
    for (const fixture of RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_FIXTURES) {
      const result = validateRiskFeedbackSafetyGateReevaluationFixture(fixture);
      const errors = result.issues.filter(i => i.severity === 'error');
      expect(errors, `fixture=${fixture.fixtureName} errors=${JSON.stringify(errors)}`).toHaveLength(0);
    }
  });

  it('passes safety check for all 8 fixtures', () => {
    for (const fixture of RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_FIXTURES) {
      const result = validateRiskFeedbackSafetyGateReevaluationSafety(fixture);
      expect(result.safe, `fixture=${fixture.fixtureName} issues=${JSON.stringify(result.issues)}`).toBe(true);
    }
  });

  it('has correct fixture names and kinds', () => {
    const names = RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_FIXTURES.map(f => f.fixtureName);
    expect(names).toContain('reevaluation-design-ready');
    expect(names).toContain('missing-feedback-loop-blocked');
    expect(names).toContain('missing-safety-gate-ref-blocked');
    expect(names).toContain('automatic-gate-mutation-denied');
    expect(names).toContain('automatic-unlock-denied');
    expect(names).toContain('manual-review-required');
    expect(names).toContain('evidence-review-incomplete-blocked');
    expect(names).toContain('unsafe-capability-rejected');
  });

  it('each fixture has correct phase', () => {
    for (const fixture of RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_FIXTURES) {
      expect(fixture.phase).toBe(88);
    }
  });

  it('each fixture has stable meta', () => {
    for (const fixture of RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_FIXTURES) {
      expect(fixture.meta.generatedAt).toBe('2026-05-16T00:00:00.000Z');
      expect(fixture.meta.source).toBe('phase88_risk_feedback_safety_gate_reevaluation_contracts_v1');
      expect(fixture.meta.phase).toBe(88);
    }
  });

  it('each fixture has schemaVersion', () => {
    for (const fixture of RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_FIXTURES) {
      expect(fixture.schemaVersion).toBe('1.0.0');
    }
  });

  it('each fixture has stable checksum', () => {
    for (const fixture of RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_FIXTURES) {
      expect(fixture.checksum).toMatch(/^ph88-chk-[0-9a-f]{8}$/);
    }
  });

  it('each fixture has unique IDs', () => {
    const ids = RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_FIXTURES.map(f => f.fixtureId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('reevaluation-design-ready gate is ready/linked', () => {
    const fixture = RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_FIXTURES.find(
      f => f.fixtureName === 'reevaluation-design-ready',
    )!;
    expect(fixture.reevaluationGate.gateStatus).toBe('ready');
    expect(fixture.safetyGateReevaluationLink.linkStatus).toBe('linked');
    expect(fixture.capabilityAudit.auditPassed).toBe(true);
    expect(fixture.scorecard.classification).toBe('ready');
  });

  it('denied/blocked fixtures have correct gate status', () => {
    const blocked = RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_FIXTURES.filter(
      f => f.reevaluationGate.gateStatus === 'blocked',
    );
    expect(blocked.length).toBeGreaterThanOrEqual(3);

    const rejected = RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_FIXTURES.filter(
      f => f.reevaluationGate.gateStatus === 'rejected',
    );
    expect(rejected.length).toBeGreaterThanOrEqual(1);
  });

  it('all fixtures deny automatic gate mutation', () => {
    for (const fixture of RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_FIXTURES) {
      expect(fixture.reevaluationGate.automaticGateMutationAllowed).toBe(false);
      expect(fixture.safetyGateReevaluationLink.gateMutationAllowed).toBe(false);
    }
  });

  it('all fixtures deny automatic unlock', () => {
    for (const fixture of RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_FIXTURES) {
      expect(fixture.reevaluationGate.automaticUnlockAllowed).toBe(false);
      expect(fixture.reevaluationGate.unlockAuthority).toBe(false);
      expect(fixture.manualReviewPlaceholder.reviewAuthorizesUnlock).toBe(false);
    }
  });

  it('all fixtures deny live risk update', () => {
    for (const fixture of RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_FIXTURES) {
      expect(fixture.reevaluationGate.liveRiskUpdateAllowed).toBe(false);
      expect(fixture.feedbackLinkage.liveFeedbackUpdateAllowed).toBe(false);
      expect(fixture.riskLinkage.liveRiskUpdateAllowed).toBe(false);
    }
  });

  it('all fixtures deny live feedback lookup', () => {
    for (const fixture of RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_FIXTURES) {
      expect(fixture.feedbackReviewEvent.liveFeedbackLookupAllowed).toBe(false);
    }
  });

  it('all fixtures deny live gate status fetch', () => {
    for (const fixture of RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_FIXTURES) {
      expect(fixture.gateStatusPlaceholder.liveGateStatusFetched).toBe(false);
      expect(fixture.gateStatusPlaceholder.gateStatusMutationProduced).toBe(false);
    }
  });

  it('all fixtures require manual review', () => {
    for (const fixture of RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_FIXTURES) {
      expect(fixture.feedbackReviewEvent.manualReviewRequired).toBe(true);
      expect(fixture.manualReviewPlaceholder.manualReviewRequired).toBe(true);
      expect(fixture.manualReviewPlaceholder.separateFuturePhaseRequired).toBe(true);
    }
  });

  it('all fixtures are fail-closed', () => {
    for (const fixture of RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_FIXTURES) {
      expect(fixture.reevaluationGate.failClosed).toBe(true);
      expect(fixture.safety.failClosed).toBe(true);
    }
  });

  it('all fixtures deny automatic escalation', () => {
    for (const fixture of RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_FIXTURES) {
      expect(fixture.blockerReviewContract.automaticEscalationAllowed).toBe(false);
      expect(fixture.escalationContract.automaticEscalationAllowed).toBe(false);
    }
  });

  it('all fixtures preserve blockers', () => {
    for (const fixture of RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_FIXTURES) {
      expect(fixture.blockerReviewContract.blockersPreserved).toBe(true);
    }
  });

  it('all safety invariants are enforced', () => {
    for (const fixture of RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_FIXTURES) {
      expect(fixture.safetyInvariants.failClosed).toBe(true);
      expect(fixture.safetyInvariants.unlockAuthority).toBe(false);
      expect(fixture.safetyInvariants.networkReadAllowed).toBe(false);
      expect(fixture.safetyInvariants.sendingAllowed).toBe(false);
      expect(fixture.safetyInvariants.signingAllowed).toBe(false);
      expect(fixture.safetyInvariants.persistenceAllowed).toBe(false);
      expect(fixture.safetyInvariants.invariantsEnforced).toBe(true);
    }
  });

  it('all safety blocks are set', () => {
    for (const fixture of RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_FIXTURES) {
      expect(fixture.safety.fixtureOnly).toBe(true);
      expect(fixture.safety.readOnly).toBe(true);
      expect(fixture.safety.failClosed).toBe(true);
      expect(fixture.safety.noAutomaticGateMutation).toBe(true);
      expect(fixture.safety.noAutomaticUnlock).toBe(true);
      expect(fixture.safety.noLiveRiskUpdate).toBe(true);
      expect(fixture.safety.noNetworkRead).toBe(true);
      expect(fixture.safety.noSendingDispatchSigningExecution).toBe(true);
      expect(fixture.safety.nonAdvisory).toBe(true);
    }
  });

  it('all fixtures have Phase 87 feedback linkage', () => {
    for (const fixture of RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_FIXTURES) {
      expect(fixture.feedbackLinkage.sourceFeedbackPhase).toBe(87);
      expect(fixture.feedbackLinkage.sourceFeedbackFixtureRefs.length).toBeGreaterThanOrEqual(1);
      expect(fixture.feedbackLinkage.liveFeedbackUpdateAllowed).toBe(false);
    }
  });

  it('all fixtures have Phase 86 outcome linkage', () => {
    for (const fixture of RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_FIXTURES) {
      expect(fixture.outcomeLinkage.sourceOutcomePhase).toBe(86);
      expect(fixture.outcomeLinkage.liveOutcomeLookupAllowed).toBe(false);
    }
  });

  it('all fixtures have Phase 58/59 risk linkage', () => {
    for (const fixture of RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_FIXTURES) {
      expect(fixture.riskLinkage.sourceRiskPhases).toContain(58);
      expect(fixture.riskLinkage.sourceRiskPhases).toContain(59);
      expect(fixture.riskLinkage.liveRiskUpdateAllowed).toBe(false);
    }
  });

  it('all fixtures have Phase 75/69 certification linkage', () => {
    for (const fixture of RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_FIXTURES) {
      expect(fixture.certificationLinkage.sourceCertPhases).toContain(75);
      expect(fixture.certificationLinkage.sourceCertPhases).toContain(69);
      expect(fixture.certificationLinkage.liveCertFetchAllowed).toBe(false);
    }
  });

  it('all fixtures have source snapshots for phases 58-87', () => {
    for (const fixture of RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_FIXTURES) {
      expect(fixture.sourcePhase58FixtureSnapshot.length).toBeGreaterThanOrEqual(1);
      expect(fixture.sourcePhase59FixtureSnapshot.length).toBeGreaterThanOrEqual(1);
      expect(fixture.sourcePhase65FixtureSnapshot.length).toBeGreaterThanOrEqual(1);
      expect(fixture.sourcePhase66FixtureSnapshot.length).toBeGreaterThanOrEqual(1);
      expect(fixture.sourcePhase67FixtureSnapshot.length).toBeGreaterThanOrEqual(1);
      expect(fixture.sourcePhase86FixtureSnapshot.length).toBeGreaterThanOrEqual(1);
      expect(fixture.sourcePhase87FixtureSnapshot.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('source snapshots are immutable (frozen)', () => {
    const fixture = RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_FIXTURES[0]!;
    expect(Object.isFrozen(fixture.sourcePhase87FixtureSnapshot)).toBe(true);
    expect(Object.isFrozen(fixture.sourcePhase86FixtureSnapshot)).toBe(true);
    expect(Object.isFrozen(fixture.sourcePhase58FixtureSnapshot)).toBe(true);
  });

  it('all fixtures have sourceRefs for all phases', () => {
    for (const fixture of RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_FIXTURES) {
      expect(typeof fixture.sourceRefs.phase87FixtureId).toBe('string');
      expect(typeof fixture.sourceRefs.phase86FixtureId).toBe('string');
      expect(typeof fixture.sourceRefs.phase85FixtureId).toBe('string');
      expect(typeof fixture.sourceRefs.phase58FixtureId).toBe('string');
    }
  });

  it('evidence review bundle references phases 58-87', () => {
    for (const fixture of RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_FIXTURES) {
      expect(fixture.evidenceReviewBundle.sourcePhaseRefs).toContain('phase87');
      expect(fixture.evidenceReviewBundle.sourcePhaseRefs).toContain('phase86');
      expect(fixture.evidenceReviewBundle.sourcePhaseRefs).toContain('phase58');
    }
  });

  it('reevaluation-design-ready has complete evidence', () => {
    const fixture = RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_FIXTURES.find(
      f => f.fixtureName === 'reevaluation-design-ready',
    )!;
    expect(fixture.evidenceReviewBundle.evidenceComplete).toBe(true);
  });

  it('evidence-review-incomplete-blocked has incomplete evidence', () => {
    const fixture = RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_FIXTURES.find(
      f => f.fixtureName === 'evidence-review-incomplete-blocked',
    )!;
    expect(fixture.evidenceReviewBundle.evidenceComplete).toBe(false);
    expect(fixture.reevaluationGate.gateStatus).toBe('blocked');
  });

  it('unsafe-capability-rejected has failed capability audit', () => {
    const fixture = RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_FIXTURES.find(
      f => f.fixtureName === 'unsafe-capability-rejected',
    )!;
    expect(fixture.capabilityAudit.auditPassed).toBe(false);
    expect(fixture.capabilityAudit.failedChecks).toContain('unsafe-capability-detected');
    expect(fixture.reevaluationGate.gateStatus).toBe('rejected');
    expect(fixture.scorecard.classification).toBe('rejected');
  });

  it('builders produce correct types', () => {
    const gate = buildReevaluationGate({
      id: 'test-gate',
      name: 'Test Gate',
      gateStatus: 'ready',
    });
    expect(gate.unlockAuthority).toBe(false);
    expect(gate.automaticGateMutationAllowed).toBe(false);
    expect(gate.automaticUnlockAllowed).toBe(false);
    expect(gate.liveRiskUpdateAllowed).toBe(false);
    expect(gate.failClosed).toBe(true);

    const feedbackEvent = buildFeedbackReviewEvent({
      id: 'test-event',
      sourceFeedbackFixtureRef: 'phase87-feedback-loop-design-ready',
    });
    expect(feedbackEvent.placeholderOnly).toBe(true);
    expect(feedbackEvent.liveFeedbackLookupAllowed).toBe(false);
    expect(feedbackEvent.manualReviewRequired).toBe(true);

    const link = buildSafetyGateReevaluationLink({
      id: 'test-link',
      sourceSafetyGateRef: 'gate-ref',
      sourceFeedbackFixtureRef: 'feedback-ref',
      linkStatus: 'linked',
    });
    expect(link.gateMutationAllowed).toBe(false);
    expect(link.automaticStatusChangeAllowed).toBe(false);

    const manualReview = buildManualReviewPlaceholder({ id: 'test-manual' });
    expect(manualReview.manualReviewRequired).toBe(true);
    expect(manualReview.reviewAuthorizesUnlock).toBe(false);
    expect(manualReview.separateFuturePhaseRequired).toBe(true);

    const gateStatus = buildGateStatusPlaceholder({ id: 'test-gate-status' });
    expect(gateStatus.deterministicLabelOnly).toBe(true);
    expect(gateStatus.liveGateStatusFetched).toBe(false);
    expect(gateStatus.gateStatusMutationProduced).toBe(false);

    const blocker = buildBlockerReviewContract({ id: 'test-blocker' });
    expect(blocker.blockersPreserved).toBe(true);
    expect(blocker.automaticEscalationAllowed).toBe(false);

    const escalation = buildEscalationContract({ id: 'test-escalation' });
    expect(escalation.escalationModeled).toBe(true);
    expect(escalation.automaticEscalationAllowed).toBe(false);

    const evidenceBundle = buildEvidenceReviewBundle({ id: 'test-evidence' });
    expect(evidenceBundle.evidenceComplete).toBe(false);

    const abort = buildReevaluationAbortContract({ id: 'test-abort' });
    expect(abort.reevaluationAbortRequired).toBe(true);
    expect(abort.scheduledTimersAllowed).toBe(false);

    const rollback = buildReevaluationRollbackContract({ id: 'test-rollback' });
    expect(rollback.reevaluationRollbackRequired).toBe(true);
    expect(rollback.scheduledTimersAllowed).toBe(false);

    const invariants = buildReevaluationSafetyInvariants({ id: 'test-invariants' });
    expect(invariants.failClosed).toBe(true);
    expect(invariants.invariantsEnforced).toBe(true);

    const scorecard = buildReevaluationScorecard({
      id: 'test-scorecard',
      score: 90,
      classification: 'ready',
    });
    expect(scorecard.safetyConfirmed).toBe(true);
    expect(scorecard.deterministicOnly).toBe(true);

    const report = buildRiskFeedbackSafetyGateReevaluationReport({
      reportId: 'test-report',
      gateSummary: 'gate=ready',
      feedbackReviewSummary: 'feedback=placeholder',
      safetyGateLinkSummary: 'link=linked',
      manualReviewSummary: 'review=pending',
      gateStatusSummary: 'status=deterministic',
      blockerEscalationSummary: 'blockers=preserved',
      evidenceSummary: 'evidence=complete',
      safetySummary: 'safe',
    });
    expect(report.phase).toBe(88);
    expect(typeof report.gateSummary).toBe('string');
  });

  it('buildRiskFeedbackSafetyGateReevaluationFixture is deterministic', () => {
    const a = buildRiskFeedbackSafetyGateReevaluationFixture({
      fixtureName: 'reevaluation-design-ready',
    });
    const b = buildRiskFeedbackSafetyGateReevaluationFixture({
      fixtureName: 'reevaluation-design-ready',
    });
    expect(areRiskFeedbackSafetyGateReevaluationFixturesEqual(a, b)).toBe(true);
    expect(a.checksum).toBe(b.checksum);
    expect(a.meta.generatedAt).toBe(b.meta.generatedAt);
  });

  it('buildRiskFeedbackSafetyGateReevaluationViewModel returns correct shape', () => {
    const fixture = RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_FIXTURES[0]!;
    const vm = buildRiskFeedbackSafetyGateReevaluationViewModel(fixture);
    expect(vm.phase).toBe(88);
    expect(vm.fixtureName).toBe(fixture.fixtureName);
    expect(vm.gateStatus).toBe(fixture.reevaluationGate.gateStatus);
    expect(vm.safetyConfirmed).toBe(true);
    expect(vm.deterministicOnly).toBe(true);
    expect(vm.failClosed).toBe(true);
  });

  it('buildRiskFeedbackSafetyGateReevaluationApiContract returns correct shape', () => {
    const contract = buildRiskFeedbackSafetyGateReevaluationApiContract({
      fixtureId: 'phase88-reevaluation-design-ready',
      fixtureIds: ['phase88-reevaluation-design-ready'],
    });
    expect(contract.list.contractKind).toBe('list');
    expect(contract.list.fixtureOnly).toBe(true);
    expect(contract.list.readOnly).toBe(true);
    expect(contract.list.localOnly).toBe(true);
    expect(contract.get.contractKind).toBe('get');
    expect(contract.get.statusCode).toBe(200);
  });

  it('selectors work correctly', () => {
    const fixture = RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_FIXTURES[0]!;
    const byName = selectRiskFeedbackSafetyGateReevaluationFixture({
      fixtureName: fixture.fixtureName,
    });
    expect(byName.matched).toBe(true);
    expect(byName.selectedFixtureId).toBe(fixture.fixtureId);

    const byId = selectRiskFeedbackSafetyGateReevaluationFixture({
      fixtureId: fixture.fixtureId,
    });
    expect(byId.matched).toBe(true);

    const missing = selectRiskFeedbackSafetyGateReevaluationFixture({ fixtureId: 'nonexistent' });
    expect(missing.matched).toBe(false);
  });

  it('normalization validators work', () => {
    expect(isValidRiskFeedbackSafetyGateReevaluationContractName('reevaluation-design-ready')).toBe(true);
    expect(isValidRiskFeedbackSafetyGateReevaluationContractName('invalid-name')).toBe(false);
    expect(isValidRiskFeedbackSafetyGateReevaluationContractKind('reevaluation_design_ready')).toBe(true);
    expect(isValidRiskFeedbackSafetyGateReevaluationContractKind('bad_kind')).toBe(false);
    expect(isValidRiskFeedbackSafetyGateReevaluationGeneratedAt('2026-05-16T00:00:00.000Z')).toBe(true);
    expect(isValidRiskFeedbackSafetyGateReevaluationGeneratedAt('bad-ts')).toBe(false);
    expect(
      isValidRiskFeedbackSafetyGateReevaluationSchemaVersion(
        PHASE_88_RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_SCHEMA_VERSION,
      ),
    ).toBe(true);
    expect(
      isValidRiskFeedbackSafetyGateReevaluationSource(
        PHASE_88_RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_SOURCE,
      ),
    ).toBe(true);
  });

  it('capabilities have correct positive flags', () => {
    const caps = getRiskFeedbackSafetyGateReevaluationCapabilities();
    expect(caps.riskFeedbackSafetyGateReevaluationContracts).toBe(true);
    expect(caps.deterministicRiskFeedbackReevaluationFixtures).toBe(true);
    expect(caps.reevaluationGates).toBe(true);
    expect(caps.feedbackReviewEvents).toBe(true);
    expect(caps.safetyGateReevaluationLinks).toBe(true);
    expect(caps.manualReviewPlaceholders).toBe(true);
    expect(caps.gateStatusPlaceholders).toBe(true);
    expect(caps.blockerReviewContracts).toBe(true);
    expect(caps.escalationContracts).toBe(true);
    expect(caps.evidenceReviewBundles).toBe(true);
    expect(caps.reevaluationFeedbackLinkage).toBe(true);
    expect(caps.reevaluationRiskLinkage).toBe(true);
    expect(caps.reevaluationOutcomeLinkage).toBe(true);
    expect(caps.reevaluationCertificationLinkage).toBe(true);
    expect(caps.reevaluationAbortContracts).toBe(true);
    expect(caps.reevaluationRollbackContracts).toBe(true);
    expect(caps.reevaluationSafetyInvariants).toBe(true);
    expect(caps.reevaluationSelectors).toBe(true);
  });

  it('capabilities have correct negative flags', () => {
    const caps = getRiskFeedbackSafetyGateReevaluationCapabilities();
    expect(caps.reevaluationRuntimeReevaluation).toBe(false);
    expect(caps.reevaluationLiveGateMutation).toBe(false);
    expect(caps.reevaluationAutomaticGateMutation).toBe(false);
    expect(caps.reevaluationAutomaticUnlock).toBe(false);
    expect(caps.reevaluationLiveRiskUpdate).toBe(false);
    expect(caps.reevaluationLiveFeedbackLookup).toBe(false);
    expect(caps.reevaluationLiveGateStatusFetch).toBe(false);
    expect(caps.reevaluationNetworkRead).toBe(false);
    expect(caps.reevaluationPollingRuntime).toBe(false);
    expect(caps.reevaluationSubscriptionRuntime).toBe(false);
    expect(caps.reevaluationRetryRuntime).toBe(false);
    expect(caps.reevaluationScheduledTimers).toBe(false);
    expect(caps.reevaluationUnlockAuthority).toBe(false);
    expect(caps.reevaluationLiveTrading).toBe(false);
    expect(caps.reevaluationLimitedLiveUnlock).toBe(false);
    expect(caps.reevaluationFullAutoUnlock).toBe(false);
    expect(caps.reevaluationSending).toBe(false);
    expect(caps.reevaluationDispatch).toBe(false);
    expect(caps.reevaluationSigning).toBe(false);
    expect(caps.reevaluationWalletLogic).toBe(false);
    expect(caps.reevaluationPrivateKeyHandling).toBe(false);
    expect(caps.reevaluationKeypairHandling).toBe(false);
    expect(caps.reevaluationSeedPhraseHandling).toBe(false);
    expect(caps.reevaluationMnemonicHandling).toBe(false);
    expect(caps.reevaluationOrderCreation).toBe(false);
    expect(caps.reevaluationRuntimeExecution).toBe(false);
    expect(caps.reevaluationTradingSignals).toBe(false);
    expect(caps.reevaluationRecommendations).toBe(false);
    expect(caps.reevaluationInvestmentAdvice).toBe(false);
    expect(caps.reevaluationRealOrders).toBe(false);
    expect(caps.reevaluationRealFunds).toBe(false);
    expect(caps.reevaluationRealPnL).toBe(false);
    expect(caps.reevaluationFilesystemWrites).toBe(false);
    expect(caps.reevaluationPersistence).toBe(false);
    expect(caps.reevaluationProviderExpansion).toBe(false);
    expect(caps.reevaluationSecretsRequired).toBe(false);
  });

  it('no capability key contains apikey substring', () => {
    const caps = getRiskFeedbackSafetyGateReevaluationCapabilities();
    for (const key of Object.keys(caps)) {
      expect(key.toLowerCase()).not.toContain('apikey');
    }
  });

  it('dashboard root capabilities include Phase 88 entries', () => {
    const caps = getDashboardUiShellCapabilities();
    expect(caps.riskFeedbackSafetyGateReevaluationContracts).toBe(true);
    expect(caps.deterministicRiskFeedbackReevaluationFixtures).toBe(true);
    expect(caps.reevaluationAutomaticGateMutation).toBe(false);
    expect(caps.reevaluationAutomaticUnlock).toBe(false);
    expect(caps.reevaluationLiveRiskUpdate).toBe(false);
  });

  it('no Phase 88 dashboard capability key contains apikey substring', () => {
    const caps = getDashboardUiShellCapabilities();
    const phase88Keys = Object.keys(caps).filter(k => k.startsWith('reevaluation') || k === 'riskFeedbackSafetyGateReevaluationContracts' || k === 'deterministicRiskFeedbackReevaluationFixtures');
    for (const key of phase88Keys) {
      expect(key.toLowerCase()).not.toContain('apikey');
    }
  });

  it('read-only-api capabilities include Phase 88 entries', () => {
    const caps = getLocalReadOnlyApiCapabilities();
    expect(
      (caps as Record<string, unknown>).deterministicRiskFeedbackReevaluationFixtures,
    ).toBe(true);
    expect(
      (caps as Record<string, unknown>).riskFeedbackSafetyGateReevaluationContracts,
    ).toBe(true);
    expect((caps as Record<string, unknown>).reevaluationAutomaticGateMutation).toBe(false);
  });

  it('no Phase 88 read-only-api capability key contains apikey substring', () => {
    const caps = getLocalReadOnlyApiCapabilities();
    const phase88Keys = Object.keys(caps).filter(k => k.startsWith('reevaluation') || k === 'riskFeedbackSafetyGateReevaluationContracts' || k === 'deterministicRiskFeedbackReevaluationFixtures');
    for (const key of phase88Keys) {
      expect(key.toLowerCase()).not.toContain('apikey');
    }
  });

  it('validation rejects wrong phase', () => {
    const fixture = { ...RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_FIXTURES[0]!, phase: 99 as 88 };
    const result = validateRiskFeedbackSafetyGateReevaluationFixture(fixture);
    expect(result.valid).toBe(false);
    const codes = result.issues.map(i => i.code);
    expect(codes).toContain('WRONG_PHASE');
  });

  it('safety check rejects fixture with unlockAuthority=true', () => {
    const base = RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_FIXTURES[0]!;
    const unsafe = {
      ...base,
      reevaluationGate: { ...base.reevaluationGate, unlockAuthority: true as unknown as false },
    };
    const result = validateRiskFeedbackSafetyGateReevaluationSafety(unsafe);
    expect(result.safe).toBe(false);
  });

  it('safety check rejects fixture with automaticGateMutationAllowed=true', () => {
    const base = RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_FIXTURES[0]!;
    const unsafe = {
      ...base,
      reevaluationGate: {
        ...base.reevaluationGate,
        automaticGateMutationAllowed: true as unknown as false,
      },
    };
    const result = validateRiskFeedbackSafetyGateReevaluationSafety(unsafe);
    expect(result.safe).toBe(false);
  });

  it('safety check rejects fixture with automaticUnlockAllowed=true', () => {
    const base = RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_FIXTURES[0]!;
    const unsafe = {
      ...base,
      reevaluationGate: {
        ...base.reevaluationGate,
        automaticUnlockAllowed: true as unknown as false,
      },
    };
    const result = validateRiskFeedbackSafetyGateReevaluationSafety(unsafe);
    expect(result.safe).toBe(false);
  });

  it('safety check rejects fixture with gateMutationAllowed=true', () => {
    const base = RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_FIXTURES[0]!;
    const unsafe = {
      ...base,
      safetyGateReevaluationLink: {
        ...base.safetyGateReevaluationLink,
        gateMutationAllowed: true as unknown as false,
      },
    };
    const result = validateRiskFeedbackSafetyGateReevaluationSafety(unsafe);
    expect(result.safe).toBe(false);
  });

  it('safety check rejects fixture with sendingAllowed=true', () => {
    const base = RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_FIXTURES[0]!;
    const unsafe = {
      ...base,
      safetyInvariants: { ...base.safetyInvariants, sendingAllowed: true as unknown as false },
    };
    const result = validateRiskFeedbackSafetyGateReevaluationSafety(unsafe);
    expect(result.safe).toBe(false);
  });

  it('safety check rejects fixture with signingAllowed=true', () => {
    const base = RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_FIXTURES[0]!;
    const unsafe = {
      ...base,
      safetyInvariants: { ...base.safetyInvariants, signingAllowed: true as unknown as false },
    };
    const result = validateRiskFeedbackSafetyGateReevaluationSafety(unsafe);
    expect(result.safe).toBe(false);
  });

  it('feedback linkage builder returns correct shape', () => {
    const linkage = buildReevaluationFeedbackLinkage({
      id: 'test-fb-link',
      sourceFeedbackFixtureRefs: ['feedback-loop-design-ready'],
      feedbackLinkStatus: 'linked',
    });
    expect(linkage.sourceFeedbackPhase).toBe(87);
    expect(linkage.liveFeedbackUpdateAllowed).toBe(false);
  });

  it('risk linkage builder returns correct shape', () => {
    const linkage = buildReevaluationRiskLinkage({
      id: 'test-risk-link',
      sourceRiskPhases: [58, 59],
      sourceRiskRefs: ['risk-surface-v1'],
      riskLinkStatus: 'linked',
    });
    expect(linkage.liveRiskUpdateAllowed).toBe(false);
    expect(linkage.sourceRiskPhases).toContain(58);
  });

  it('outcome linkage builder returns correct shape', () => {
    const linkage = buildReevaluationOutcomeLinkage({
      id: 'test-outcome-link',
      sourceOutcomeRefs: ['outcome-audit-design-ready'],
      outcomeLinkStatus: 'linked',
    });
    expect(linkage.sourceOutcomePhase).toBe(86);
    expect(linkage.liveOutcomeLookupAllowed).toBe(false);
  });

  it('certification linkage builder returns correct shape', () => {
    const linkage = buildReevaluationCertificationLinkage({
      id: 'test-cert-link',
      sourceCertPhases: [75, 69],
      sourceCertRefs: ['pre-live-safety-all-clear', 'live-smoke-safety-all-clear'],
      certLinkStatus: 'linked',
    });
    expect(linkage.liveCertFetchAllowed).toBe(false);
    expect(linkage.sourceCertPhases).toContain(75);
  });

  it('capability audit builder passes/fails correctly', () => {
    const passed = buildReevaluationCapabilityAudit({
      id: 'test-audit-pass',
      auditScore: 90,
      passedChecks: ['check1', 'check2'],
      failedChecks: [],
    });
    expect(passed.auditPassed).toBe(true);

    const failed = buildReevaluationCapabilityAudit({
      id: 'test-audit-fail',
      auditScore: 0,
      passedChecks: [],
      failedChecks: ['unsafe-capability'],
    });
    expect(failed.auditPassed).toBe(false);
  });
});
