/**
 * Phase 12 — Risk Engine v1: Component score types.
 */

export interface ComponentScoreEntry {
  readonly score: number; // 0-100
  readonly reasons: readonly string[];
}

export interface RiskComponentScores {
  readonly tokenScore: ComponentScoreEntry;
  readonly creatorScore: ComponentScoreEntry;
  readonly walletClusterScore: ComponentScoreEntry;
  readonly manipulationScore: ComponentScoreEntry;
  readonly confidenceAdjustedScore: ComponentScoreEntry;
  readonly missingDataPenalty: ComponentScoreEntry;
  readonly criticalFlagPenalty: ComponentScoreEntry;
}
