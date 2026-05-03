import type { Context } from 'telegraf';
import type { AppConfig } from '@sonic/config';
import { buildRuntimeSafetyStatus } from '@sonic/shared';
import { PHASE } from '@sonic/shared';
import type { ModeManager } from '@sonic/mode-manager';
import type { IAuditLogger } from '@sonic/db';
import { getTelegramUserInfo, hasConfiguredAdmins } from '../permissions.js';
import { auditTelegramCommand } from '../audit.js';
import { formatStatus } from '../formatters/status.js';

const startTime = Date.now();

export async function handleStatus(
  ctx: Context,
  config: AppConfig,
  modeManager: ModeManager,
  auditLogger: IAuditLogger,
): Promise<void> {
  const info = getTelegramUserInfo(ctx);
  const mode = modeManager.getMode();
  await auditTelegramCommand(auditLogger, {
    info,
    command: '/status',
    accepted: true,
    modeBefore: mode,
    phase: `Phase ${PHASE}`,
  });
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);

  // Detect unsafe flags from config
  const unsafeFlags: string[] = [];
  if (config.ENABLE_LIVE_TRADING) unsafeFlags.push('ENABLE_LIVE_TRADING');
  if (config.ENABLE_AUTO_TRADING) unsafeFlags.push('ENABLE_AUTO_TRADING');
  if (config.ENABLE_TRANSACTION_SIGNING) unsafeFlags.push('ENABLE_TRANSACTION_SIGNING');
  if (config.ENABLE_TRANSACTION_SENDING) unsafeFlags.push('ENABLE_TRANSACTION_SENDING');
  if (config.ENABLE_WALLET_LOADING) unsafeFlags.push('ENABLE_WALLET_LOADING');
  if (config.ENABLE_SOLANA_RPC) unsafeFlags.push('ENABLE_SOLANA_RPC');
  if (config.ENABLE_JITO) unsafeFlags.push('ENABLE_JITO');
  if (config.ENABLE_PUMPFUN_TRADING) unsafeFlags.push('ENABLE_PUMPFUN_TRADING');
  if (config.FULL_AUTO_UNLOCKED) unsafeFlags.push('FULL_AUTO_UNLOCKED');
  if (config.LIMITED_LIVE_UNLOCKED) unsafeFlags.push('LIMITED_LIVE_UNLOCKED');

  const runtimeSafety = buildRuntimeSafetyStatus({
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

  const text = formatStatus({
    mode,
    uptimeSeconds,
    telegramEnabled: !!config.TELEGRAM_BOT_TOKEN,
    adminConfigured: hasConfiguredAdmins(config),
    killSwitchActive: modeManager.isKillSwitchActive(),
    runtimeSafety,
  });
  await ctx.reply(text);
}
