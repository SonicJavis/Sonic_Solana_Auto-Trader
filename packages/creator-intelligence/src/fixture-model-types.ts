/**
 * Phase 30 — Creator Intelligence Fixture Models v1: fixture model types.
 *
 * Local-only, synthetic-only, deterministic fixture contracts for future
 * creator/project/social-signal intelligence work.
 */

export const PHASE_30_CREATOR_INTELLIGENCE_GENERATED_AT = '2026-01-01T00:00:00.000Z';
export const PHASE_30_CREATOR_INTELLIGENCE_SOURCE = 'phase30_creator_intelligence_fixture_models_v1';

export const CREATOR_INTELLIGENCE_FIXTURE_NAMES = [
  'credible-transparent-creator',
  'anonymous-consistent-creator',
  'new-account-risk-creator',
  'overpromotional-narrative-creator',
  'suspicious-engagement-creator',
  'clear-disclosure-creator',
  'poor-disclosure-creator',
  'recycled-narrative-creator',
  'coordinated-hype-creator',
  'benign-low-signal-creator',
  'high-risk-creator',
  'malformed-input-safe-creator',
  'safety-boundary-creator',
  'balanced-mixed-signal-creator',
  'unknown-insufficient-data-creator',
] as const;

export type CreatorIntelligenceFixtureName = (typeof CREATOR_INTELLIGENCE_FIXTURE_NAMES)[number];

export const CREATOR_INTELLIGENCE_FIXTURE_KINDS = [
  'transparent',
  'anonymous-consistent',
  'new-account-risk',
  'narrative-risk',
  'engagement-risk',
  'disclosure-clear',
  'disclosure-poor',
  'narrative-recycled',
  'coordinated-hype',
  'low-signal',
  'high-risk',
  'malformed-safe',
  'safety-boundary',
  'mixed-signal',
  'unknown',
] as const;

export type CreatorIntelligenceFixtureKind = (typeof CREATOR_INTELLIGENCE_FIXTURE_KINDS)[number];

export interface CreatorFixtureModelCapabilities {
  readonly creatorIntelligenceFixtures: true;
  readonly syntheticCreatorProfiles: true;
  readonly creatorNarrativeFixtures: true;
  readonly creatorRiskIndicators: true;
  readonly creatorCredibilityIndicators: true;
  readonly creatorFixtureSafetyValidation: true;
  readonly creatorLiveData: false;
  readonly creatorSocialApiAccess: false;
  readonly creatorScraping: false;
  readonly creatorIdentityResolution: false;
  readonly creatorInvestmentAdvice: false;
  readonly creatorTradingSignals: false;
  readonly creatorExternalNetwork: false;
  readonly creatorPersistence: false;
}

export interface CreatorProfileFixture {
  readonly creatorId: string;
  readonly alias: string;
  readonly presentation: 'transparent_fixture' | 'anonymous_fixture' | 'pseudonymous_fixture' | 'unknown_fixture';
  readonly accountAgeBand: 'new' | 'recent' | 'established' | 'unknown';
  readonly consistencyBand: 'low' | 'moderate' | 'high' | 'unknown';
  readonly transparencyBand: 'low' | 'moderate' | 'high' | 'unknown';
  readonly syntheticPersona: string;
}

export interface CreatorProjectFixture {
  readonly projectId: string;
  readonly projectLabel: string;
  readonly category: 'meme' | 'tooling' | 'education' | 'community' | 'experimental' | 'unknown';
  readonly lifecycle: 'concept' | 'launching' | 'active' | 'cooling' | 'unknown';
}

export interface CreatorNarrativeFixture {
  readonly primaryTheme: string;
  readonly messageStyle: 'balanced' | 'technical' | 'overpromotional' | 'recycled' | 'minimal' | 'mixed' | 'unknown';
  readonly languageQuality: 'clear' | 'vague' | 'recycled' | 'exaggerated' | 'unknown';
  readonly evidenceTags: readonly string[];
}

export interface CreatorSocialSignalFixture {
  readonly platform: 'synthetic_social_graph';
  readonly signalType: 'community-feedback' | 'comment-pattern' | 'account-age' | 'narrative-amplification' | 'disclosure-reference' | 'unknown';
  readonly sentiment: 'supportive' | 'neutral' | 'skeptical' | 'mixed' | 'unknown';
  readonly pattern: 'organic' | 'coordinated' | 'low-signal' | 'consistent' | 'bursty' | 'unknown';
  readonly confidenceBand: 'low' | 'moderate' | 'high';
  readonly notes: readonly string[];
}

export interface CreatorDisclosureSignalFixture {
  readonly disclosureType: 'team-affiliation' | 'paid-promotion' | 'sponsorship' | 'risk-statement' | 'anonymous-status' | 'track-record' | 'unknown';
  readonly clarity: 'clear' | 'partial' | 'poor' | 'absent' | 'unknown';
  readonly present: boolean;
  readonly notes: readonly string[];
}

export interface CreatorEngagementPatternFixture {
  readonly pattern: 'organic' | 'coordinated-hype' | 'suspicious-burst' | 'consistent-low-volume' | 'unknown';
  readonly cadence: 'steady' | 'bursty' | 'sporadic' | 'unknown';
  readonly accountDiversity: 'diverse' | 'narrow' | 'unknown';
  readonly evidenceTags: readonly string[];
}

export interface CreatorRiskIndicator {
  readonly code: string;
  readonly label: string;
  readonly level: 'low' | 'medium' | 'high' | 'critical';
  readonly rationale: string;
}

export interface CreatorCredibilityIndicator {
  readonly code: string;
  readonly label: string;
  readonly level: 'low' | 'moderate' | 'high';
  readonly rationale: string;
}

export interface CreatorIntelligenceFixtureMeta {
  readonly phase: 30;
  readonly generatedAt: string;
  readonly source: typeof PHASE_30_CREATOR_INTELLIGENCE_SOURCE;
  readonly fixtureOnly: true;
  readonly syntheticOnly: true;
  readonly liveData: false;
  readonly externalNetwork: false;
  readonly persistence: false;
  readonly deterministic: true;
  readonly readOnly: true;
  readonly nonAdvisory: true;
  readonly notes: readonly string[];
}

export interface CreatorIntelligenceSummary {
  readonly phase: 30;
  readonly name: CreatorIntelligenceFixtureName;
  readonly kind: CreatorIntelligenceFixtureKind;
  readonly creatorId: string;
  readonly projectId: string;
  readonly signalBalance: 'credibility-dominant' | 'risk-dominant' | 'balanced' | 'insufficient-data';
  readonly disclosureAssessment: 'clear' | 'mixed' | 'poor' | 'unknown';
  readonly engagementAssessment: 'organic' | 'mixed' | 'suspicious' | 'low-signal' | 'unknown';
  readonly narrativeAssessment: 'balanced' | 'promotional-risk' | 'recycled' | 'mixed' | 'unknown';
  readonly dataCompleteness: 'complete' | 'partial' | 'insufficient';
  readonly credibilityCount: number;
  readonly riskCount: number;
  readonly topCredibilityCodes: readonly string[];
  readonly topRiskCodes: readonly string[];
  readonly generatedAt: string;
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly externalNetwork: false;
  readonly nonAdvisory: true;
  readonly safeToDisplay: true;
  readonly notes: readonly string[];
}

export interface CreatorIntelligenceFixture {
  readonly name: CreatorIntelligenceFixtureName;
  readonly kind: CreatorIntelligenceFixtureKind;
  readonly profile: CreatorProfileFixture;
  readonly project: CreatorProjectFixture;
  readonly narrative: CreatorNarrativeFixture;
  readonly socialSignals: readonly CreatorSocialSignalFixture[];
  readonly disclosureSignals: readonly CreatorDisclosureSignalFixture[];
  readonly engagementPatterns: readonly CreatorEngagementPatternFixture[];
  readonly riskIndicators: readonly CreatorRiskIndicator[];
  readonly credibilityIndicators: readonly CreatorCredibilityIndicator[];
  readonly summary: CreatorIntelligenceSummary;
  readonly safeNotes: readonly string[];
  readonly meta: CreatorIntelligenceFixtureMeta;
}

export interface CreatorIntelligenceValidationIssue {
  readonly code: string;
  readonly field: string;
  readonly message: string;
  readonly severity: 'error' | 'warning';
}

export interface CreatorIntelligenceValidationResult {
  readonly valid: boolean;
  readonly issues: readonly CreatorIntelligenceValidationIssue[];
}

export interface CreatorIntelligenceSafetyResult {
  readonly safe: boolean;
  readonly violations: readonly string[];
}

export interface CreatorIntelligenceBuildInput {
  readonly name: string;
  readonly kind: string;
  readonly profile: CreatorProfileFixture;
  readonly project: CreatorProjectFixture;
  readonly narrative: CreatorNarrativeFixture;
  readonly socialSignals?: readonly CreatorSocialSignalFixture[] | null;
  readonly disclosureSignals?: readonly CreatorDisclosureSignalFixture[] | null;
  readonly engagementPatterns?: readonly CreatorEngagementPatternFixture[] | null;
  readonly riskIndicators?: readonly CreatorRiskIndicator[] | null;
  readonly credibilityIndicators?: readonly CreatorCredibilityIndicator[] | null;
  readonly safeNotes?: readonly string[] | null;
}

export interface CreatorIntelligenceBuildResult {
  readonly success: boolean;
  readonly fixture: CreatorIntelligenceFixture | null;
  readonly validation: CreatorIntelligenceValidationResult;
  readonly safety: CreatorIntelligenceSafetyResult;
}
