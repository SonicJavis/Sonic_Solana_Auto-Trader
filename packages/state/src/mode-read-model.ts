/**
 * Mode read model — Phase 5.
 *
 * Produces a safe ModeStateSnapshot from the current mode and mode constants.
 * Never mutates mode state.
 */

import { LOCKED_MODES, READ_SAFE_MODES, type AppMode } from '@sonic/shared';
import type { ModeStateSnapshot } from './types.js';

/**
 * Build a ModeStateSnapshot.
 * Reports mode status, locked modes, and safety classification.
 * Does not mutate any mode state.
 */
export function buildModeStateSnapshot(currentMode: AppMode, killSwitchActive: boolean): ModeStateSnapshot {
  const fullAutoLocked = LOCKED_MODES.includes('FULL_AUTO');
  const limitedLiveLocked = LOCKED_MODES.includes('LIMITED_LIVE');

  let modeSafetyStatus: ModeStateSnapshot['modeSafetyStatus'];
  if (killSwitchActive) {
    modeSafetyStatus = 'locked';
  } else if ((READ_SAFE_MODES as readonly string[]).includes(currentMode)) {
    modeSafetyStatus = 'safe';
  } else {
    modeSafetyStatus = 'unsafe';
  }

  return {
    currentMode,
    allowedSafeModes: [...READ_SAFE_MODES],
    lockedModes: [...LOCKED_MODES],
    fullAutoLocked,
    limitedLiveLocked,
    modeSafetyStatus,
  };
}
