/**
 * Telegram /system command handler — Phase 5.
 *
 * Provides read-only safe system state snapshots to authorized admins.
 * Never exposes raw secrets, tokens, DATABASE_URL, or detailsJson.
 * Does not mutate any state or unlock any modes.
 */

import type { Context } from 'telegraf';
import type { AppConfig } from '@sonic/config';
import { collectUnsafeFlags } from '@sonic/config';
import type { ModeManager } from '@sonic/mode-manager';
import type { IAuditRepository } from '@sonic/db';
import { buildRuntimeSafetyStatus, PHASE } from '@sonic/shared';
import {
  buildSystemStateSnapshot,
  buildConfigStateSnapshot,
} from '@sonic/state';
import { getTelegramUserInfo, hasConfiguredAdmins, requireAdmin } from '../permissions.js';
import { auditTelegramCommand } from '../audit.js';
import {
  formatSystemOverview,
  formatSystemHealth,
  formatSystemSafety,
  formatSystemAudit,
  formatSystemWorker,
  formatSystemConfig,
  formatSystemHelp,
  formatSystemUnknown,
} from '../formatters/system.js';

/** Parse the text after /system into a subcommand */
function parseSystemSub(text: string | undefined): string {
  if (!text) return '';
  const body = text.replace(/^\/system\s*/, '').trim();
  if (!body) return '';
  return body.split(/\s+/)[0]?.toLowerCase() ?? '';
}

export async function handleSystem(
  ctx: Context,
  config: AppConfig,
  modeManager: ModeManager,
  auditLogger: IAuditRepository,
): Promise<void> {
  const info = getTelegramUserInfo(ctx);
  const mode = modeManager.getMode();

  const allowed = await requireAdmin(ctx, config, '/system', async (uInfo, action, accepted, reason) => {
    await auditTelegramCommand(auditLogger, { info: uInfo, command: action, accepted, reason });
  });
  if (!allowed) return;

  const msgText = 'text' in (ctx.message ?? {})
    ? (ctx.message as { text?: string }).text
    : undefined;

  const sub = parseSystemSub(msgText);

  // Audit the command
  auditLogger.record({
    eventType: 'TELEGRAM_SYSTEM_REQUESTED',
    severity: 'info',
    source: 'telegram',
    phase: `Phase ${PHASE}`,
    message: `/system ${sub} requested by user ${info.userId}`,
    details: {
      userId: info.userId,
      username: info.username,
      chatId: info.chatId,
      subcommand: sub || 'overview',
    },
  });

  // For all subcommands that need the full snapshot
  if (sub === '' || sub === 'health' || sub === 'safety' || sub === 'worker' || sub === 'audit') {
    const unsafeFlags = collectUnsafeFlags(config);
    const runtimeSafetyStatus = buildRuntimeSafetyStatus({
      currentPhase: PHASE,
      currentMode: mode,
      configValid: true,
      unsafeFlagsDetected: unsafeFlags.length > 0,
      unsafeFlags,
      warnings: unsafeFlags.length > 0
        ? [`Unsafe flags detected: ${unsafeFlags.join(', ')} — capabilities remain disabled`]
        : [],
      killSwitchActive: modeManager.isKillSwitchActive(),
      adminAllowlistConfigured: hasConfiguredAdmins(config),
      telegramEnabled: config.TELEGRAM_BOT_TOKEN !== undefined,
      databaseConfigured: config.DATABASE_URL !== '',
    });

    const snapshot = buildSystemStateSnapshot({
      auditRepo: auditLogger,
      config,
      currentMode: mode,
      runtimeSafetyStatus,
      killSwitchActive: modeManager.isKillSwitchActive(),
    });

    switch (sub) {
      case '':
        await ctx.reply(formatSystemOverview(snapshot));
        break;
      case 'health':
        await ctx.reply(formatSystemHealth(snapshot));
        break;
      case 'safety':
        await ctx.reply(formatSystemSafety(snapshot));
        break;
      case 'audit':
        await ctx.reply(formatSystemAudit(snapshot.auditStats));
        break;
      case 'worker':
        await ctx.reply(formatSystemWorker(snapshot.workerStatus));
        break;
    }
    return;
  }

  switch (sub) {
    case 'config': {
      const configSnapshot = buildConfigStateSnapshot(config);
      await ctx.reply(formatSystemConfig(configSnapshot));
      break;
    }
    case 'help':
      await ctx.reply(formatSystemHelp());
      break;
    default:
      await ctx.reply(formatSystemUnknown(sub));
  }
}
