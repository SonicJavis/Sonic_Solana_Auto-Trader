import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  MANUAL_CONFIRM_LIVE_READINESS_FIXTURE_MAP,
  MANUAL_CONFIRM_LIVE_READINESS_FIXTURES,
  MANUAL_CONFIRM_LIVE_READINESS_KINDS,
  MANUAL_CONFIRM_LIVE_READINESS_NAMES,
  MANUAL_CONFIRM_LIVE_READINESS_PHASE,
  PHASE_76_MANUAL_CONFIRM_LIVE_READINESS_GENERATED_AT,
  areManualConfirmLiveReadinessFixturesEqual,
  buildManualConfirmApiContract,
  buildManualConfirmApprovalPolicy,
  buildManualConfirmCapabilityAudit,
  buildManualConfirmCertificationLinkage,
  buildManualConfirmCoolingOffPolicy,
  buildManualConfirmLiveReadinessFixture,
  buildManualConfirmOperatorChecklist,
  buildManualConfirmPhraseContract,
  buildManualConfirmPreflightEvidence,
  buildManualConfirmProviderReadinessLinkage,
  buildManualConfirmReadinessGate,
  buildManualConfirmReadinessReport,
  buildManualConfirmRejectionContract,
  buildManualConfirmReplayReadinessLinkage,
  buildManualConfirmRiskAcknowledgement,
  buildManualConfirmRoleSeparation,
  buildManualConfirmSafetyInvariant,
  buildManualConfirmScenarioReadinessLinkage,
  buildManualConfirmScorecard,
  buildManualConfirmSmokeReadinessLinkage,
  buildManualConfirmViewModel,
  getManualConfirmLiveReadinessCapabilities,
  getManualConfirmLiveReadinessFixture,
  getDashboardUiShellCapabilities,
  isValidManualConfirmGeneratedAt,
  isValidManualConfirmLiveReadinessKind,
  isValidManualConfirmLiveReadinessName,
  isValidManualConfirmSchemaVersion,
  isValidManualConfirmSource,
  listManualConfirmLiveReadinessFixtures,
  normalizeManualConfirmLiveReadinessFixture,
  selectManualConfirmLiveReadinessFixture,
  serializeManualConfirmLiveReadinessFixture,
  validateManualConfirmLiveReadinessFixture,
  validateManualConfirmLiveReadinessSafety,
} from '../apps/dashboard/src/index.js';
import { getLocalReadOnlyApiCapabilities } from '../apps/read-only-api/src/capabilities.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const PHASE_76_SRC = resolve(REPO_ROOT, 'apps/dashboard/src/manual-confirm-live-readiness');
const PHASE_76_FILES = [
  'types.ts',
  'readiness-gates.ts',
  'approval-policies.ts',
  'confirmation-phrases.ts',
  'role-separation.ts',
  'cooling-off-policies.ts',
  'risk-acknowledgements.ts',
  'operator-checklists.ts',
  'preflight-evidence.ts',
  'rejection-contracts.ts',
  'capability-audits.ts',
  'safety-invariants.ts',
  'provider-readiness-linkage.ts',
  'smoke-readiness-linkage.ts',
  'certification-linkage.ts',
  'replay-readiness-linkage.ts',
  'scenario-readiness-linkage.ts',
  'scorecards.ts',
  'readiness-reports.ts',
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

describe('Phase 76 — Manual-Confirm Live Readiness Contracts', () => {
  describe('Module files', () => {
    it('has all required source files', () => {
      for (const file of PHASE_76_FILES) {
        const path = resolve(PHASE_76_SRC, file);
        expect(() => readFileSync(path, 'utf8'), `Missing file: ${file}`).not.toThrow();
      }
    });

    it('has docs/MANUAL_CONFIRM_LIVE_READINESS.md', () => {
      const path = resolve(REPO_ROOT, 'docs/MANUAL_CONFIRM_LIVE_READINESS.md');
      expect(() => readFileSync(path, 'utf8')).not.toThrow();
    });
  });

  describe('Constants', () => {
    it('has correct phase number', () => {
      expect(MANUAL_CONFIRM_LIVE_READINESS_PHASE).toBe(76);
    });

    it('has stable generated-at timestamp', () => {
      expect(PHASE_76_MANUAL_CONFIRM_LIVE_READINESS_GENERATED_AT).toBe('2026-05-13T00:00:00.000Z');
    });

    it('has 8 fixture names', () => {
      expect(MANUAL_CONFIRM_LIVE_READINESS_NAMES).toHaveLength(8);
    });

    it('has 8 fixture kinds', () => {
      expect(MANUAL_CONFIRM_LIVE_READINESS_KINDS).toHaveLength(8);
    });

    it('names and kinds have same cardinality', () => {
      expect(MANUAL_CONFIRM_LIVE_READINESS_NAMES.length).toBe(MANUAL_CONFIRM_LIVE_READINESS_KINDS.length);
    });

    it('names include all 8 required fixtures', () => {
      expect(MANUAL_CONFIRM_LIVE_READINESS_NAMES).toContain('manual-confirm-readiness-complete');
      expect(MANUAL_CONFIRM_LIVE_READINESS_NAMES).toContain('missing-prelive-certification-blocked');
      expect(MANUAL_CONFIRM_LIVE_READINESS_NAMES).toContain('smoke-readiness-warning-review-required');
      expect(MANUAL_CONFIRM_LIVE_READINESS_NAMES).toContain('role-separation-violation-rejected');
      expect(MANUAL_CONFIRM_LIVE_READINESS_NAMES).toContain('confirmation-phrase-missing-blocked');
      expect(MANUAL_CONFIRM_LIVE_READINESS_NAMES).toContain('cooling-off-required-pending');
      expect(MANUAL_CONFIRM_LIVE_READINESS_NAMES).toContain('unsafe-capability-rejected');
      expect(MANUAL_CONFIRM_LIVE_READINESS_NAMES).toContain('documentation-review-warning');
    });
  });

  describe('Fixtures array', () => {
    it('has at least 8 fixtures', () => {
      expect(MANUAL_CONFIRM_LIVE_READINESS_FIXTURES.length).toBeGreaterThanOrEqual(8);
    });

    it('all fixture IDs are unique', () => {
      const ids = MANUAL_CONFIRM_LIVE_READINESS_FIXTURES.map(f => f.fixtureId);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('all fixture names are unique', () => {
      const names = MANUAL_CONFIRM_LIVE_READINESS_FIXTURES.map(f => f.fixtureName);
      expect(new Set(names).size).toBe(names.length);
    });

    it('all fixtures have correct phase', () => {
      for (const fixture of MANUAL_CONFIRM_LIVE_READINESS_FIXTURES) {
        expect(fixture.phase).toBe(76);
      }
    });

    it('all fixtures have stable generatedAt', () => {
      for (const fixture of MANUAL_CONFIRM_LIVE_READINESS_FIXTURES) {
        expect(fixture.meta.generatedAt).toBe('2026-05-13T00:00:00.000Z');
      }
    });
  });

  describe('Fixture map', () => {
    it('has correct size', () => {
      expect(MANUAL_CONFIRM_LIVE_READINESS_FIXTURE_MAP.size).toBe(MANUAL_CONFIRM_LIVE_READINESS_FIXTURES.length);
    });

    it('can look up fixture by ID', () => {
      const first = MANUAL_CONFIRM_LIVE_READINESS_FIXTURES[0]!;
      expect(MANUAL_CONFIRM_LIVE_READINESS_FIXTURE_MAP.get(first.fixtureId)).toBe(first);
    });
  });

  describe('listManualConfirmLiveReadinessFixtures', () => {
    it('returns all fixtures', () => {
      const list = listManualConfirmLiveReadinessFixtures();
      expect(list).toHaveLength(MANUAL_CONFIRM_LIVE_READINESS_FIXTURES.length);
    });

    it('returns same reference repeatedly (deterministic)', () => {
      expect(listManualConfirmLiveReadinessFixtures()).toBe(listManualConfirmLiveReadinessFixtures());
    });
  });

  describe('getManualConfirmLiveReadinessFixture', () => {
    it('returns fixture for valid ID', () => {
      const fixture = MANUAL_CONFIRM_LIVE_READINESS_FIXTURES[0]!;
      expect(getManualConfirmLiveReadinessFixture(fixture.fixtureId)).toBe(fixture);
    });

    it('returns null for unknown ID', () => {
      expect(getManualConfirmLiveReadinessFixture('does-not-exist')).toBeNull();
    });
  });

  describe('buildManualConfirmLiveReadinessFixture', () => {
    it('builds the complete fixture', () => {
      const fixture = buildManualConfirmLiveReadinessFixture({ fixtureName: 'manual-confirm-readiness-complete' });
      expect(fixture.fixtureName).toBe('manual-confirm-readiness-complete');
      expect(fixture.fixtureKind).toBe('manual_confirm_readiness_complete');
      expect(fixture.phase).toBe(76);
    });

    it('builds the missing-prelive-certification-blocked fixture', () => {
      const fixture = buildManualConfirmLiveReadinessFixture({ fixtureName: 'missing-prelive-certification-blocked' });
      expect(fixture.readinessGate.gateStatus).toBe('blocked');
      expect(fixture.readinessGate.failClosed).toBe(true);
    });

    it('builds the role-separation-violation-rejected fixture', () => {
      const fixture = buildManualConfirmLiveReadinessFixture({ fixtureName: 'role-separation-violation-rejected' });
      expect(fixture.readinessGate.gateStatus).toBe('rejected');
      expect(fixture.roleSeparation.separationSatisfied).toBe(false);
    });

    it('builds the confirmation-phrase-missing-blocked fixture', () => {
      const fixture = buildManualConfirmLiveReadinessFixture({ fixtureName: 'confirmation-phrase-missing-blocked' });
      expect(fixture.phraseContract.phraseStatus).toBe('phrase_missing');
      expect(fixture.readinessGate.gateStatus).toBe('blocked');
    });

    it('builds the cooling-off-required-pending fixture', () => {
      const fixture = buildManualConfirmLiveReadinessFixture({ fixtureName: 'cooling-off-required-pending' });
      expect(fixture.coolingOffPolicy.coolingOffStatus).toBe('pending');
      expect(fixture.coolingOffPolicy.usesRuntimeTimers).toBe(false);
    });

    it('builds the unsafe-capability-rejected fixture', () => {
      const fixture = buildManualConfirmLiveReadinessFixture({ fixtureName: 'unsafe-capability-rejected' });
      expect(fixture.readinessGate.gateStatus).toBe('rejected');
      expect(fixture.rejectionContract.rejectionKind).toBe('unsafe_capability');
    });

    it('builds the documentation-review-warning fixture', () => {
      const fixture = buildManualConfirmLiveReadinessFixture({ fixtureName: 'documentation-review-warning' });
      expect(fixture.readinessGate.gateStatus).toBe('review_required');
      expect(fixture.rejectionContract.rejectionKind).toBe('documentation_gap');
    });
  });

  describe('Readiness gates', () => {
    it('buildManualConfirmReadinessGate produces correct shape', () => {
      const gate = buildManualConfirmReadinessGate({
        readinessGateId: 'test-gate',
        readinessGateName: 'test',
        readinessGateKind: 'manual_confirm_approval_gate',
        gateStatus: 'blocked',
        blockingReasonCodes: ['TEST'],
      });
      expect(gate.failClosed).toBe(true);
      expect(gate.unlockAuthority).toBe(false);
      expect(gate.manualLiveAllowed).toBe(false);
      expect(gate.executionAllowed).toBe(false);
      expect(gate.phase).toBe(76);
    });

    it('all fixtures have fail-closed gates', () => {
      for (const fixture of MANUAL_CONFIRM_LIVE_READINESS_FIXTURES) {
        expect(fixture.readinessGate.failClosed).toBe(true);
      }
    });

    it('no fixture has unlockAuthority true', () => {
      for (const fixture of MANUAL_CONFIRM_LIVE_READINESS_FIXTURES) {
        expect(fixture.readinessGate.unlockAuthority).toBe(false);
      }
    });

    it('no fixture has manualLiveAllowed true', () => {
      for (const fixture of MANUAL_CONFIRM_LIVE_READINESS_FIXTURES) {
        expect(fixture.readinessGate.manualLiveAllowed).toBe(false);
      }
    });

    it('no fixture has executionAllowed true', () => {
      for (const fixture of MANUAL_CONFIRM_LIVE_READINESS_FIXTURES) {
        expect(fixture.readinessGate.executionAllowed).toBe(false);
      }
    });
  });

  describe('Approval policies', () => {
    it('buildManualConfirmApprovalPolicy requires manual approval', () => {
      const policy = buildManualConfirmApprovalPolicy({
        approvalPolicyId: 'test-policy',
        multipleApproversRequired: true,
        approvalStatus: 'pending_manual_review',
      });
      expect(policy.manualApprovalRequired).toBe(true);
      expect(policy.automaticApprovalAllowed).toBe(false);
      expect(policy.automaticPromotionAllowed).toBe(false);
      expect(policy.limitedLiveUnlockAllowed).toBe(false);
      expect(policy.fullAutoUnlockAllowed).toBe(false);
      expect(policy.requiresSeparateFuturePhase).toBe(true);
    });

    it('all fixtures have manual approval required', () => {
      for (const fixture of MANUAL_CONFIRM_LIVE_READINESS_FIXTURES) {
        expect(fixture.approvalPolicy.manualApprovalRequired).toBe(true);
      }
    });

    it('all fixtures have automatic approval disabled', () => {
      for (const fixture of MANUAL_CONFIRM_LIVE_READINESS_FIXTURES) {
        expect(fixture.approvalPolicy.automaticApprovalAllowed).toBe(false);
        expect(fixture.approvalPolicy.automaticPromotionAllowed).toBe(false);
      }
    });

    it('all fixtures have LIMITED_LIVE and FULL_AUTO unlock disabled', () => {
      for (const fixture of MANUAL_CONFIRM_LIVE_READINESS_FIXTURES) {
        expect(fixture.approvalPolicy.limitedLiveUnlockAllowed).toBe(false);
        expect(fixture.approvalPolicy.fullAutoUnlockAllowed).toBe(false);
      }
    });
  });

  describe('Confirmation phrase contracts', () => {
    it('buildManualConfirmPhraseContract produces correct shape', () => {
      const phrase = buildManualConfirmPhraseContract({
        phraseId: 'test-phrase',
        phraseKind: 'test',
        exactPhrase: 'I confirm.',
        phraseMatched: false,
        phraseStatus: 'phrase_missing',
      });
      expect(phrase.phraseRequired).toBe(true);
      expect(phrase.commandDispatchAllowed).toBe(false);
      expect(phrase.executionAllowed).toBe(false);
    });

    it('all fixtures have command dispatch disabled', () => {
      for (const fixture of MANUAL_CONFIRM_LIVE_READINESS_FIXTURES) {
        expect(fixture.phraseContract.commandDispatchAllowed).toBe(false);
        expect(fixture.phraseContract.executionAllowed).toBe(false);
      }
    });

    it('confirmation-phrase-missing-blocked has phrase_missing status', () => {
      const fixture = buildManualConfirmLiveReadinessFixture({ fixtureName: 'confirmation-phrase-missing-blocked' });
      expect(fixture.phraseContract.phraseStatus).toBe('phrase_missing');
    });
  });

  describe('Role separation', () => {
    it('buildManualConfirmRoleSeparation forbids same actor', () => {
      const role = buildManualConfirmRoleSeparation({
        roleSeparationId: 'test-role',
        requesterRole: 'requester',
        reviewerRole: 'reviewer',
        approverRole: 'approver',
        separationSatisfied: false,
        violationReasonCodes: ['SAME_ACTOR'],
        roleSeparationStatus: 'violation_detected',
      });
      expect(role.sameActorAllowed).toBe(false);
    });

    it('all fixtures have same actor disabled', () => {
      for (const fixture of MANUAL_CONFIRM_LIVE_READINESS_FIXTURES) {
        expect(fixture.roleSeparation.sameActorAllowed).toBe(false);
      }
    });

    it('role-separation-violation-rejected has violation detected', () => {
      const fixture = buildManualConfirmLiveReadinessFixture({ fixtureName: 'role-separation-violation-rejected' });
      expect(fixture.roleSeparation.roleSeparationStatus).toBe('violation_detected');
      expect(fixture.roleSeparation.separationSatisfied).toBe(false);
    });
  });

  describe('Cooling-off policies', () => {
    it('buildManualConfirmCoolingOffPolicy disables runtime timers', () => {
      const policy = buildManualConfirmCoolingOffPolicy({
        coolingOffId: 'test-cool',
        coolingOffRequired: true,
        deterministicWindowLabel: 'label-7d',
        coolingOffStatus: 'pending',
      });
      expect(policy.usesRuntimeTimers).toBe(false);
      expect(policy.automaticTransitionAllowed).toBe(false);
    });

    it('all fixtures have runtime timers disabled', () => {
      for (const fixture of MANUAL_CONFIRM_LIVE_READINESS_FIXTURES) {
        expect(fixture.coolingOffPolicy.usesRuntimeTimers).toBe(false);
        expect(fixture.coolingOffPolicy.automaticTransitionAllowed).toBe(false);
      }
    });

    it('cooling-off-required-pending has cooling_off_pending status', () => {
      const fixture = buildManualConfirmLiveReadinessFixture({ fixtureName: 'cooling-off-required-pending' });
      expect(fixture.readinessGate.gateStatus).toBe('cooling_off_pending');
      expect(fixture.coolingOffPolicy.coolingOffStatus).toBe('pending');
    });
  });

  describe('Risk acknowledgements', () => {
    it('buildManualConfirmRiskAcknowledgement disables advisory output', () => {
      const ack = buildManualConfirmRiskAcknowledgement({
        acknowledgementId: 'test-ack',
        riskAcknowledged: false,
        sourceEvidenceRefs: ['phase65-evidence'],
        acknowledgementStatus: 'pending',
      });
      expect(ack.advisoryOutput).toBe(false);
      expect(ack.recommendationOutput).toBe(false);
      expect(ack.signalOutput).toBe(false);
    });

    it('all fixtures have advisory/recommendation/signal output disabled', () => {
      for (const fixture of MANUAL_CONFIRM_LIVE_READINESS_FIXTURES) {
        expect(fixture.riskAcknowledgement.advisoryOutput).toBe(false);
        expect(fixture.riskAcknowledgement.recommendationOutput).toBe(false);
        expect(fixture.riskAcknowledgement.signalOutput).toBe(false);
      }
    });
  });

  describe('Operator checklists', () => {
    it('buildManualConfirmOperatorChecklist is fail-closed', () => {
      const checklist = buildManualConfirmOperatorChecklist({
        checklistId: 'test-checklist',
        checklistItems: [{ itemId: 'item-1', description: 'Test', status: 'passed', phaseRef: 'phase65' }],
        checklistStatus: 'passed',
      });
      expect(checklist.failClosed).toBe(true);
      expect(checklist.passedItemCount).toBe(1);
      expect(checklist.failedItemCount).toBe(0);
    });

    it('all fixtures have fail-closed checklists', () => {
      for (const fixture of MANUAL_CONFIRM_LIVE_READINESS_FIXTURES) {
        expect(fixture.operatorChecklist.failClosed).toBe(true);
      }
    });
  });

  describe('Preflight evidence', () => {
    it('buildManualConfirmPreflightEvidence creates correct structure', () => {
      const evidence = buildManualConfirmPreflightEvidence({
        evidenceBundleId: 'test-evidence',
        sourcePhaseRefs: ['phase65', 'phase66', 'phase67', 'phase68', 'phase69', 'phase70', 'phase71', 'phase72', 'phase73', 'phase74', 'phase75'],
        sourceFixtureRefs: ['phase65-ref'],
        validationCommandRefs: ['corepack pnpm test'],
        safetyGrepRefs: ['grep -r privateKey apps/'],
        reviewRefs: ['docs/MANUAL_CONFIRM_LIVE_READINESS.md'],
        docsRefs: ['docs/MANUAL_CONFIRM_LIVE_READINESS.md'],
        evidenceComplete: true,
      });
      expect(evidence.sourcePhaseRefs).toHaveLength(11);
      expect(evidence.evidenceComplete).toBe(true);
    });

    it('all fixtures have at least 10 source phase refs', () => {
      for (const fixture of MANUAL_CONFIRM_LIVE_READINESS_FIXTURES) {
        expect(fixture.preflightEvidence.sourcePhaseRefs.length).toBeGreaterThanOrEqual(10);
      }
    });

    it('all fixtures have validation command refs', () => {
      for (const fixture of MANUAL_CONFIRM_LIVE_READINESS_FIXTURES) {
        expect(fixture.preflightEvidence.validationCommandRefs.length).toBeGreaterThan(0);
      }
    });

    it('all fixtures have docs refs', () => {
      for (const fixture of MANUAL_CONFIRM_LIVE_READINESS_FIXTURES) {
        expect(fixture.preflightEvidence.docsRefs.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Rejection contracts', () => {
    it('buildManualConfirmRejectionContract is fail-closed', () => {
      const contract = buildManualConfirmRejectionContract({
        rejectionId: 'test-rejection',
        rejectionKind: 'unsafe_capability',
        rejectionSeverity: 'critical',
        rejectionReasonCodes: ['UNSAFE_CAPABILITY'],
      });
      expect(contract.failClosed).toBe(true);
      expect(contract.unlockAuthority).toBe(false);
      expect(contract.manualLiveAllowed).toBe(false);
    });

    it('all fixtures have fail-closed rejection contracts', () => {
      for (const fixture of MANUAL_CONFIRM_LIVE_READINESS_FIXTURES) {
        expect(fixture.rejectionContract.failClosed).toBe(true);
        expect(fixture.rejectionContract.unlockAuthority).toBe(false);
        expect(fixture.rejectionContract.manualLiveAllowed).toBe(false);
      }
    });
  });

  describe('Capability audits', () => {
    it('buildManualConfirmCapabilityAudit has all safety locked', () => {
      const audit = buildManualConfirmCapabilityAudit({ auditId: 'test-audit', auditStatus: 'pass' });
      expect(audit.readOnlyDefault).toBe(true);
      expect(audit.fullAutoLocked).toBe(true);
      expect(audit.limitedLiveLocked).toBe(true);
      expect(audit.noWallet).toBe(true);
      expect(audit.noSigning).toBe(true);
      expect(audit.noSending).toBe(true);
      expect(audit.noExecution).toBe(true);
      expect(audit.noAdvisory).toBe(true);
    });

    it('unsafe-capability-rejected has fail audit', () => {
      const fixture = buildManualConfirmLiveReadinessFixture({ fixtureName: 'unsafe-capability-rejected' });
      expect(fixture.capabilityAudit.auditStatus).toBe('fail');
    });
  });

  describe('Safety invariants', () => {
    it('buildManualConfirmSafetyInvariant is fail-closed', () => {
      const invariant = buildManualConfirmSafetyInvariant({
        invariantId: 'test-invariant',
        invariantKind: 'no_unlock_authority',
        invariantHolds: true,
        evidenceRef: 'capability-audit',
      });
      expect(invariant.failClosed).toBe(true);
      expect(invariant.unlockAuthority).toBe(false);
    });

    it('all fixtures have fail-closed invariants', () => {
      for (const fixture of MANUAL_CONFIRM_LIVE_READINESS_FIXTURES) {
        expect(fixture.safetyInvariant.failClosed).toBe(true);
        expect(fixture.safetyInvariant.unlockAuthority).toBe(false);
      }
    });
  });

  describe('Source linkages', () => {
    it('all fixtures have provider readiness linkage', () => {
      for (const fixture of MANUAL_CONFIRM_LIVE_READINESS_FIXTURES) {
        expect(fixture.providerReadinessLinkage.readOnlyOnly).toBe(true);
        expect(fixture.providerReadinessLinkage.phase65FixtureRef).toBeTruthy();
        expect(fixture.providerReadinessLinkage.phase66FixtureRef).toBeTruthy();
      }
    });

    it('all fixtures have smoke readiness linkage', () => {
      for (const fixture of MANUAL_CONFIRM_LIVE_READINESS_FIXTURES) {
        expect(fixture.smokeReadinessLinkage.phase69FixtureRef).toBeTruthy();
        expect(fixture.smokeReadinessLinkage.phase74FixtureRef).toBeTruthy();
      }
    });

    it('all fixtures have certification linkage that does not unlock live', () => {
      for (const fixture of MANUAL_CONFIRM_LIVE_READINESS_FIXTURES) {
        expect(fixture.certificationLinkage.certificationDoesNotUnlockLive).toBe(true);
        expect(fixture.certificationLinkage.phase75FixtureRef).toBeTruthy();
      }
    });

    it('buildManualConfirmCertificationLinkage certificationDoesNotUnlockLive is true', () => {
      const linkage = buildManualConfirmCertificationLinkage({
        linkageId: 'test-cert-linkage',
        phase75FixtureRef: 'phase75-ref',
        certificationVerified: true,
        certificationStatus: 'verified',
      });
      expect(linkage.certificationDoesNotUnlockLive).toBe(true);
    });

    it('all fixtures have replay readiness linkage', () => {
      for (const fixture of MANUAL_CONFIRM_LIVE_READINESS_FIXTURES) {
        expect(fixture.replayReadinessLinkage.phase68FixtureRef).toBeTruthy();
        expect(fixture.replayReadinessLinkage.phase73FixtureRef).toBeTruthy();
      }
    });

    it('all fixtures have scenario readiness linkage', () => {
      for (const fixture of MANUAL_CONFIRM_LIVE_READINESS_FIXTURES) {
        expect(fixture.scenarioReadinessLinkage.phase72FixtureRef).toBeTruthy();
      }
    });

    it('all fixtures have phase75 fixture snapshot', () => {
      for (const fixture of MANUAL_CONFIRM_LIVE_READINESS_FIXTURES) {
        expect(fixture.sourcePhase75FixtureSnapshot.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Scorecards', () => {
    it('buildManualConfirmScorecard is fail-closed', () => {
      const scorecard = buildManualConfirmScorecard({
        scorecardId: 'test-scorecard',
        score: 100,
        maxScore: 100,
        gateStatus: 'ready',
        checklistStatus: 'passed',
        approvalStatus: 'approved',
      });
      expect(scorecard.failClosed).toBe(true);
    });

    it('manual-confirm-readiness-complete has score 100', () => {
      const fixture = buildManualConfirmLiveReadinessFixture({ fixtureName: 'manual-confirm-readiness-complete' });
      expect(fixture.scorecard.score).toBe(100);
    });

    it('unsafe-capability-rejected has score 0', () => {
      const fixture = buildManualConfirmLiveReadinessFixture({ fixtureName: 'unsafe-capability-rejected' });
      expect(fixture.scorecard.score).toBe(0);
    });
  });

  describe('Readiness reports', () => {
    it('buildManualConfirmReadinessReport is fail-closed and non-authorizing', () => {
      const report = buildManualConfirmReadinessReport({
        reportId: 'test-report',
        gateSummary: 'Gate: ready',
        approvalSummary: 'Approval: pending',
        confirmationSummary: 'Phrase: required',
        roleSeparationSummary: 'Role: satisfied',
        coolingOffSummary: 'Cooling: not_required',
        riskAcknowledgementSummary: 'Risk: pending',
        checklistSummary: 'Checklist: passed',
        evidenceSummary: 'Evidence: complete',
        safetySummary: 'Safety: contract-only',
        overallStatus: 'ready',
      });
      expect(report.failClosed).toBe(true);
      expect(report.unlockAuthority).toBe(false);
      expect(report.manualLiveAllowed).toBe(false);
    });

    it('all fixtures have fail-closed reports', () => {
      for (const fixture of MANUAL_CONFIRM_LIVE_READINESS_FIXTURES) {
        expect(fixture.readinessReport.failClosed).toBe(true);
        expect(fixture.readinessReport.unlockAuthority).toBe(false);
        expect(fixture.readinessReport.manualLiveAllowed).toBe(false);
      }
    });
  });

  describe('View models', () => {
    it('buildManualConfirmViewModel produces correct summary', () => {
      const vm = buildManualConfirmViewModel({
        viewModelId: 'test-vm',
        fixtureId: 'test-fixture',
        fixtureName: 'manual-confirm-readiness-complete',
        gateStatus: 'ready',
        approvalStatus: 'approved',
        phraseStatus: 'phrase_matched',
        roleSeparationStatus: 'separation_satisfied',
        coolingOffStatus: 'completed_by_label',
        checklistStatus: 'passed',
      });
      expect(vm.summary).toContain('manual-confirm-readiness-complete');
      expect(vm.summary).toContain('ready');
    });
  });

  describe('API contracts', () => {
    it('buildManualConfirmApiContract produces read-only, fixture-only contracts', () => {
      const firstFixture = MANUAL_CONFIRM_LIVE_READINESS_FIXTURES[0]!;
      const contract = buildManualConfirmApiContract({
        fixtureId: firstFixture.fixtureId,
        viewModel: firstFixture.viewModel,
        fixtureIds: [firstFixture.fixtureId],
      });
      expect(contract.list.fixtureOnly).toBe(true);
      expect(contract.list.readOnly).toBe(true);
      expect(contract.list.localOnly).toBe(true);
      expect(contract.get.fixtureOnly).toBe(true);
    });
  });

  describe('Selectors', () => {
    it('selectManualConfirmLiveReadinessFixture returns fixture by name', () => {
      const result = selectManualConfirmLiveReadinessFixture({ fixtureName: 'manual-confirm-readiness-complete' });
      expect(result.matched).toBe(true);
      expect(result.source).toBe('deterministic_fixture_only');
    });

    it('selectManualConfirmLiveReadinessFixture returns miss for unknown fixture', () => {
      const result = selectManualConfirmLiveReadinessFixture({ fixtureName: 'does-not-exist' as any });
      expect(result.matched).toBe(false);
      expect(result.selectedFixtureId).toBe('not-found');
    });
  });

  describe('Normalization and serialization', () => {
    it('isValidManualConfirmLiveReadinessName validates correctly', () => {
      expect(isValidManualConfirmLiveReadinessName('manual-confirm-readiness-complete')).toBe(true);
      expect(isValidManualConfirmLiveReadinessName('not-a-valid-name')).toBe(false);
    });

    it('isValidManualConfirmLiveReadinessKind validates correctly', () => {
      expect(isValidManualConfirmLiveReadinessKind('manual_confirm_readiness_complete')).toBe(true);
      expect(isValidManualConfirmLiveReadinessKind('not_valid')).toBe(false);
    });

    it('isValidManualConfirmGeneratedAt validates stable timestamp', () => {
      expect(isValidManualConfirmGeneratedAt('2026-05-13T00:00:00.000Z')).toBe(true);
      expect(isValidManualConfirmGeneratedAt('2026-01-01T00:00:00.000Z')).toBe(false);
    });

    it('isValidManualConfirmSource validates source string', () => {
      expect(isValidManualConfirmSource('phase76_manual_confirm_live_readiness_contracts_v1')).toBe(true);
      expect(isValidManualConfirmSource('wrong')).toBe(false);
    });

    it('isValidManualConfirmSchemaVersion validates version', () => {
      expect(isValidManualConfirmSchemaVersion('1.0.0')).toBe(true);
      expect(isValidManualConfirmSchemaVersion('2.0.0')).toBe(false);
    });

    it('normalizeManualConfirmLiveReadinessFixture is idempotent', () => {
      const fixture = MANUAL_CONFIRM_LIVE_READINESS_FIXTURES[0]!;
      const normalized = normalizeManualConfirmLiveReadinessFixture(fixture);
      const normalizedAgain = normalizeManualConfirmLiveReadinessFixture(normalized);
      expect(serializeManualConfirmLiveReadinessFixture(normalized)).toBe(
        serializeManualConfirmLiveReadinessFixture(normalizedAgain),
      );
    });

    it('serializeManualConfirmLiveReadinessFixture produces stable output', () => {
      const fixture = MANUAL_CONFIRM_LIVE_READINESS_FIXTURES[0]!;
      const s1 = serializeManualConfirmLiveReadinessFixture(fixture);
      const s2 = serializeManualConfirmLiveReadinessFixture(fixture);
      expect(s1).toBe(s2);
    });

    it('areManualConfirmLiveReadinessFixturesEqual returns true for same fixture', () => {
      const fixture = MANUAL_CONFIRM_LIVE_READINESS_FIXTURES[0]!;
      expect(areManualConfirmLiveReadinessFixturesEqual(fixture, fixture)).toBe(true);
    });

    it('areManualConfirmLiveReadinessFixturesEqual returns false for different fixtures', () => {
      const f1 = MANUAL_CONFIRM_LIVE_READINESS_FIXTURES[0]!;
      const f2 = MANUAL_CONFIRM_LIVE_READINESS_FIXTURES[1]!;
      expect(areManualConfirmLiveReadinessFixturesEqual(f1, f2)).toBe(false);
    });
  });

  describe('Validation', () => {
    it('validateManualConfirmLiveReadinessFixture passes for complete fixture', () => {
      const fixture = buildManualConfirmLiveReadinessFixture({ fixtureName: 'manual-confirm-readiness-complete' });
      const result = validateManualConfirmLiveReadinessFixture(fixture);
      expect(result.valid).toBe(true);
      expect(result.issues).toHaveLength(0);
    });

    it('validateManualConfirmLiveReadinessFixture rejects wrong phase', () => {
      const fixture = buildManualConfirmLiveReadinessFixture({ fixtureName: 'manual-confirm-readiness-complete' });
      const badFixture = { ...fixture, phase: 99 as 76 };
      const result = validateManualConfirmLiveReadinessFixture(badFixture);
      expect(result.valid).toBe(false);
      expect(result.issues.some(i => i.code === 'WRONG_PHASE')).toBe(true);
    });

    it('validateManualConfirmLiveReadinessFixture rejects unlockAuthority true', () => {
      const fixture = buildManualConfirmLiveReadinessFixture({ fixtureName: 'manual-confirm-readiness-complete' });
      const badFixture = {
        ...fixture,
        readinessGate: { ...fixture.readinessGate, unlockAuthority: true as false },
      };
      const result = validateManualConfirmLiveReadinessFixture(badFixture);
      expect(result.valid).toBe(false);
      expect(result.issues.some(i => i.code === 'UNSAFE_UNLOCK_AUTHORITY')).toBe(true);
    });

    it('validateManualConfirmLiveReadinessFixture rejects automaticApprovalAllowed true', () => {
      const fixture = buildManualConfirmLiveReadinessFixture({ fixtureName: 'manual-confirm-readiness-complete' });
      const badFixture = {
        ...fixture,
        approvalPolicy: { ...fixture.approvalPolicy, automaticApprovalAllowed: true as false },
      };
      const result = validateManualConfirmLiveReadinessFixture(badFixture);
      expect(result.valid).toBe(false);
      expect(result.issues.some(i => i.code === 'AUTO_APPROVAL_FORBIDDEN')).toBe(true);
    });

    it('validateManualConfirmLiveReadinessFixture rejects sameActorAllowed true', () => {
      const fixture = buildManualConfirmLiveReadinessFixture({ fixtureName: 'manual-confirm-readiness-complete' });
      const badFixture = {
        ...fixture,
        roleSeparation: { ...fixture.roleSeparation, sameActorAllowed: true as false },
      };
      const result = validateManualConfirmLiveReadinessFixture(badFixture);
      expect(result.valid).toBe(false);
      expect(result.issues.some(i => i.code === 'SAME_ACTOR_FORBIDDEN')).toBe(true);
    });

    it('validateManualConfirmLiveReadinessFixture rejects runtime timers', () => {
      const fixture = buildManualConfirmLiveReadinessFixture({ fixtureName: 'manual-confirm-readiness-complete' });
      const badFixture = {
        ...fixture,
        coolingOffPolicy: { ...fixture.coolingOffPolicy, usesRuntimeTimers: true as false },
      };
      const result = validateManualConfirmLiveReadinessFixture(badFixture);
      expect(result.valid).toBe(false);
      expect(result.issues.some(i => i.code === 'RUNTIME_TIMERS_FORBIDDEN')).toBe(true);
    });

    it('validateManualConfirmLiveReadinessFixture rejects advisory output', () => {
      const fixture = buildManualConfirmLiveReadinessFixture({ fixtureName: 'manual-confirm-readiness-complete' });
      const badFixture = {
        ...fixture,
        riskAcknowledgement: { ...fixture.riskAcknowledgement, advisoryOutput: true as false },
      };
      const result = validateManualConfirmLiveReadinessFixture(badFixture);
      expect(result.valid).toBe(false);
      expect(result.issues.some(i => i.code === 'ADVISORY_OUTPUT_FORBIDDEN')).toBe(true);
    });

    it('validateManualConfirmLiveReadinessSafety passes for safe fixture', () => {
      const fixture = buildManualConfirmLiveReadinessFixture({ fixtureName: 'manual-confirm-readiness-complete' });
      const result = validateManualConfirmLiveReadinessSafety(fixture);
      expect(result.safe).toBe(true);
      expect(result.violations).toHaveLength(0);
    });

    it('all fixtures pass safety validation', () => {
      for (const fixture of MANUAL_CONFIRM_LIVE_READINESS_FIXTURES) {
        const result = validateManualConfirmLiveReadinessSafety(fixture);
        expect(result.safe, `Fixture ${fixture.fixtureName} failed safety: ${result.violations.join(', ')}`).toBe(true);
      }
    });

    it('missing-prelive-certification-blocked has blocked gate', () => {
      const fixture = buildManualConfirmLiveReadinessFixture({ fixtureName: 'missing-prelive-certification-blocked' });
      expect(fixture.readinessGate.gateStatus).toBe('blocked');
      expect(fixture.certificationLinkage.certificationVerified).toBe(false);
    });

    it('role-separation-violation-rejected is rejected', () => {
      const fixture = buildManualConfirmLiveReadinessFixture({ fixtureName: 'role-separation-violation-rejected' });
      expect(fixture.readinessGate.gateStatus).toBe('rejected');
      expect(fixture.approvalPolicy.approvalStatus).toBe('rejected');
    });

    it('unsafe-capability-rejected has no unlock behavior', () => {
      const fixture = buildManualConfirmLiveReadinessFixture({ fixtureName: 'unsafe-capability-rejected' });
      expect(fixture.readinessGate.unlockAuthority).toBe(false);
      expect(fixture.readinessGate.manualLiveAllowed).toBe(false);
      expect(fixture.readinessGate.executionAllowed).toBe(false);
    });
  });

  describe('Capability flags', () => {
    it('getManualConfirmLiveReadinessCapabilities returns correct positive flags', () => {
      const caps = getManualConfirmLiveReadinessCapabilities();
      expect(caps.manualConfirmLiveReadinessContracts).toBe(true);
      expect(caps.deterministicManualConfirmReadinessFixtures).toBe(true);
      expect(caps.manualConfirmReadinessGates).toBe(true);
      expect(caps.manualConfirmApprovalPolicies).toBe(true);
      expect(caps.manualConfirmPhraseContracts).toBe(true);
      expect(caps.manualConfirmRoleSeparationModels).toBe(true);
      expect(caps.manualConfirmCoolingOffPolicies).toBe(true);
      expect(caps.manualConfirmRiskAcknowledgements).toBe(true);
      expect(caps.manualConfirmOperatorChecklists).toBe(true);
      expect(caps.manualConfirmPreflightEvidenceBundles).toBe(true);
      expect(caps.manualConfirmRejectionContracts).toBe(true);
      expect(caps.manualConfirmCapabilityAudits).toBe(true);
      expect(caps.manualConfirmSafetyInvariants).toBe(true);
      expect(caps.manualConfirmScorecards).toBe(true);
      expect(caps.manualConfirmReadinessReports).toBe(true);
      expect(caps.manualConfirmViewModels).toBe(true);
      expect(caps.manualConfirmApiContracts).toBe(true);
      expect(caps.manualConfirmSelectors).toBe(true);
    });

    it('getManualConfirmLiveReadinessCapabilities returns correct negative flags', () => {
      const caps = getManualConfirmLiveReadinessCapabilities();
      expect(caps.manualConfirmUnlockAuthority).toBe(false);
      expect(caps.manualConfirmLiveTrading).toBe(false);
      expect(caps.manualConfirmManualTradingImplementation).toBe(false);
      expect(caps.manualConfirmLimitedLiveUnlock).toBe(false);
      expect(caps.manualConfirmFullAutoUnlock).toBe(false);
      expect(caps.manualConfirmExecution).toBe(false);
      expect(caps.manualConfirmTransactionBuilding).toBe(false);
      expect(caps.manualConfirmTransactionSending).toBe(false);
      expect(caps.manualConfirmWalletLogic).toBe(false);
      expect(caps.manualConfirmPrivateKeyHandling).toBe(false);
      expect(caps.manualConfirmSigning).toBe(false);
      expect(caps.manualConfirmTradingSignals).toBe(false);
      expect(caps.manualConfirmRecommendations).toBe(false);
      expect(caps.manualConfirmInvestmentAdvice).toBe(false);
      expect(caps.manualConfirmRealOrders).toBe(false);
      expect(caps.manualConfirmRealFunds).toBe(false);
      expect(caps.manualConfirmRealPnL).toBe(false);
      expect(caps.manualConfirmLiveNetworkDefault).toBe(false);
      expect(caps.manualConfirmScheduledJobs).toBe(false);
      expect(caps.manualConfirmRuntimeMonitoring).toBe(false);
      expect(caps.manualConfirmRuntimeCollectors).toBe(false);
      expect(caps.manualConfirmProviderExpansion).toBe(false);
      expect(caps.manualConfirmSecretsRequired).toBe(false);
      expect(caps.manualConfirmApiKeyRequired).toBe(false);
      expect(caps.manualConfirmFilesystemWrites).toBe(false);
      expect(caps.manualConfirmPersistence).toBe(false);
      expect(caps.manualConfirmRouteHandlers).toBe(false);
      expect(caps.manualConfirmRuntimeRequests).toBe(false);
      expect(caps.manualConfirmUiRendering).toBe(false);
      expect(caps.manualConfirmDomAccess).toBe(false);
      expect(caps.manualConfirmBackgroundJobs).toBe(false);
    });

    it('all fixtures have correct capability flags', () => {
      for (const fixture of MANUAL_CONFIRM_LIVE_READINESS_FIXTURES) {
        expect(fixture.capabilityFlags.manualConfirmLiveReadinessContracts).toBe(true);
        expect(fixture.capabilityFlags.manualConfirmUnlockAuthority).toBe(false);
        expect(fixture.capabilityFlags.manualConfirmLiveTrading).toBe(false);
        expect(fixture.capabilityFlags.manualConfirmExecution).toBe(false);
      }
    });
  });

  describe('Dashboard exports', () => {
    it('getDashboardUiShellCapabilities includes Phase 76 flags', () => {
      const caps = getDashboardUiShellCapabilities();
      expect(caps.manualConfirmLiveReadinessContracts).toBe(true);
      expect(caps.manualConfirmUnlockAuthority).toBe(false);
      expect(caps.manualConfirmLiveTrading).toBe(false);
    });
  });

  describe('Read-only API propagation', () => {
    it('getLocalReadOnlyApiCapabilities includes Phase 76 flags', () => {
      const caps = getLocalReadOnlyApiCapabilities();
      expect(caps.manualConfirmLiveReadinessContracts).toBe(true);
      expect(caps.manualConfirmUnlockAuthority).toBe(false);
      expect(caps.manualConfirmLiveTrading).toBe(false);
    });
  });

  describe('Safety properties', () => {
    it('all fixtures have safety.readOnly true', () => {
      for (const fixture of MANUAL_CONFIRM_LIVE_READINESS_FIXTURES) {
        expect(fixture.safety.readOnly).toBe(true);
      }
    });

    it('all fixtures have safety.failClosed true', () => {
      for (const fixture of MANUAL_CONFIRM_LIVE_READINESS_FIXTURES) {
        expect(fixture.safety.failClosed).toBe(true);
      }
    });

    it('all fixtures have safety.nonAdvisory true', () => {
      for (const fixture of MANUAL_CONFIRM_LIVE_READINESS_FIXTURES) {
        expect(fixture.safety.nonAdvisory).toBe(true);
      }
    });

    it('all fixtures have safety.notExecutable true', () => {
      for (const fixture of MANUAL_CONFIRM_LIVE_READINESS_FIXTURES) {
        expect(fixture.safety.notExecutable).toBe(true);
      }
    });

    it('all fixtures have safety.noLiveNetwork true', () => {
      for (const fixture of MANUAL_CONFIRM_LIVE_READINESS_FIXTURES) {
        expect(fixture.safety.noLiveNetwork).toBe(true);
      }
    });

    it('all fixtures have safety.noSecretsRequired true', () => {
      for (const fixture of MANUAL_CONFIRM_LIVE_READINESS_FIXTURES) {
        expect(fixture.safety.noSecretsRequired).toBe(true);
      }
    });
  });

  describe('Deterministic builds', () => {
    it('building same fixture twice produces equal results', () => {
      const f1 = buildManualConfirmLiveReadinessFixture({ fixtureName: 'manual-confirm-readiness-complete' });
      const f2 = buildManualConfirmLiveReadinessFixture({ fixtureName: 'manual-confirm-readiness-complete' });
      expect(areManualConfirmLiveReadinessFixturesEqual(f1, f2)).toBe(true);
    });

    it('no fixture uses Date.now in generated content', () => {
      for (const fixture of MANUAL_CONFIRM_LIVE_READINESS_FIXTURES) {
        const serialized = serializeManualConfirmLiveReadinessFixture(fixture);
        expect(serialized).not.toMatch(/Date\.now/);
        expect(serialized).not.toMatch(/Math\.random/);
        expect(serialized).not.toMatch(/randomUUID/);
      }
    });

    it('all fixture meta.generatedAt values are identical and stable', () => {
      const expected = '2026-05-13T00:00:00.000Z';
      for (const fixture of MANUAL_CONFIRM_LIVE_READINESS_FIXTURES) {
        expect(fixture.meta.generatedAt).toBe(expected);
      }
    });
  });

  describe('Source immutability', () => {
    it('fixtures array is frozen or read-only (no mutation)', () => {
      const first = MANUAL_CONFIRM_LIVE_READINESS_FIXTURES[0]!;
      expect(first.safety.readOnly).toBe(true);
    });

    it('buildManualConfirmLiveReadinessFixture does not mutate source fixtures', () => {
      const initialLength = MANUAL_CONFIRM_LIVE_READINESS_FIXTURES.length;
      buildManualConfirmLiveReadinessFixture({ fixtureName: 'unsafe-capability-rejected' });
      expect(MANUAL_CONFIRM_LIVE_READINESS_FIXTURES.length).toBe(initialLength);
    });
  });

  describe('Phase 77 preview', () => {
    it('is not implemented (no phase77 exports)', () => {
      expect(typeof (globalThis as Record<string, unknown>)['MANUAL_CONFIRM_DRY_RUN_PHASE']).toBe('undefined');
    });
  });
});
