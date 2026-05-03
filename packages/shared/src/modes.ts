export const ALL_MODES = [
  'READ_ONLY',
  'PAPER',
  'MANUAL_CONFIRM',
  'LIMITED_LIVE',
  'FULL_AUTO',
  'PAUSED',
  'KILL_SWITCH',
] as const;

export type AppMode = (typeof ALL_MODES)[number];

export const LOCKED_MODES: AppMode[] = ['FULL_AUTO', 'LIMITED_LIVE'];

export const READ_SAFE_MODES: AppMode[] = ['READ_ONLY', 'PAPER', 'MANUAL_CONFIRM', 'PAUSED', 'KILL_SWITCH'];

export const DEFAULT_MODE: AppMode = 'READ_ONLY';

export function isModeAllowed(mode: AppMode): mode is Exclude<AppMode, 'FULL_AUTO' | 'LIMITED_LIVE'> {
  return !LOCKED_MODES.includes(mode);
}
