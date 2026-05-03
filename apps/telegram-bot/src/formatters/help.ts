export function formatHelp(): string {
  return [
    'Sonic Solana Auto-Trader - Help',
    '',
    'Informational commands (anyone):',
    '  /start   - Introduction and system overview',
    '  /help    - This help message',
    '  /status  - Full system status',
    '  /safety  - Safety posture overview',
    '  /version - App and phase version info',
    '',
    'Admin-only control commands:',
    '  /mode [MODE] - View or change operating mode',
    '  /pause       - Pause the system (sets PAUSED mode)',
    '  /kill        - Activate kill switch (requires confirmation)',
    '  /audit       - View recent audit log events',
    '',
    'No trading commands exist. Trading is disabled.',
    'LIMITED_LIVE and FULL_AUTO are locked in Phase 2.',
    '',
    'Phase 2 allowed modes: READ_ONLY, PAPER, MANUAL_CONFIRM, PAUSED, KILL_SWITCH',
  ].join('\n');
}
