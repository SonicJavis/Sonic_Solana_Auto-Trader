/**
 * Config read model — Phase 5.
 *
 * Produces a secret-safe ConfigStateSnapshot from the loaded config.
 * Never exposes raw TELEGRAM_BOT_TOKEN, DATABASE_URL, or credential-like values.
 */

import type { AppConfig } from '@sonic/config';
import { PHASE } from '@sonic/shared';
import type { ConfigStateSnapshot } from './types.js';

/**
 * Build a ConfigStateSnapshot from the loaded config.
 * DATABASE_URL and TELEGRAM_BOT_TOKEN are never included.
 * DATABASE_PATH is included as a safe local filesystem path.
 */
export function buildConfigStateSnapshot(config: AppConfig): ConfigStateSnapshot {
  return {
    appVersion: config.APP_VERSION,
    appMode: config.APP_MODE,
    safetyProfile: config.SAFETY_PROFILE,
    phase: PHASE,
    databasePathStatus: config.DATABASE_PATH.length > 0 ? config.DATABASE_PATH : 'not configured',
    auditRetentionDays: config.AUDIT_RETENTION_DAYS,
    auditMaxEvents: config.AUDIT_MAX_EVENTS,
    auditRotationEnabled: config.AUDIT_ROTATION_ENABLED,
    adminCount: config.TELEGRAM_ADMIN_IDS.length,
    telegramConfigured: config.TELEGRAM_BOT_TOKEN !== undefined,
  };
}
