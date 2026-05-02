/**
 * WindsurfHooksInstaller - Windsurf IDE integration for claude-mem
 *
 * Handles installation/uninstallation of Cascade Hooks for claude-mem
 * memory system in Windsurf IDE.
 *
 * Windsurf hook events:
 *   pre_user_prompt, post_cascade_response, post_cascade_response_with_transcript
 *   pre_read_code, post_read_code, pre_write_code, post_write_code
 *   pre_run_command, post_run_command, pre_mcp_tool_use, post_mcp_tool_use
 *
 * Hook config locations:
 *   Workspace: .windsurf/hooks.json
 *   User: ~/.codeium/windsurf/hooks.json
 *   System (macOS): /Library/Application Support/Windsurf/hooks.json
 *   System (Linux): /etc/windsurf/hooks.json
 *   System (Windows): C:\ProgramData\Windsurf\hooks.json
 */

import path from 'path';
import { homedir } from 'os';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { logger } from '../../utils/logger.js';
import { findWorkerServicePath, findBunPath } from './CursorHooksInstaller.js';

export type WindsurfInstallTarget = 'project' | 'user' | 'system';

interface WindsurfHookEntry {
  command: string;
  powershell?: string;
  show_output?: boolean;
}

interface WindsurfHooksJson {
  hooks: Record<string, WindsurfHookEntry[]>;
}

// ============================================================================
// Path Finding
// ============================================================================

/**
 * Get the target directory for Windsurf hooks based on install target
 */
export function getWindsurfTargetDir(target: WindsurfInstallTarget): string | null {
  switch (target) {
    case 'project':
      return path.join(process.cwd(), '.windsurf');
    case 'user':
      return path.join(homedir(), '.codeium', 'windsurf');
    case 'system':
      if (process.platform === 'darwin') {
        return '/Library/Application Support/Windsurf';
      } else if (process.platform === 'linux') {
        return '/etc/windsurf';
      } else if (process.platform === 'win32') {
        return path.join(process.env.ProgramData || 'C:\\ProgramData', 'Windsurf');
      }
      return null;
    default:
      return null;
  }
}

// ============================================================================
// Hook Installation
// ============================================================================

/**
 * Install Windsurf Cascade hooks for claude-mem
 */
export function installWindsurfHooks(target: WindsurfInstallTarget): number {
  console.log(`\nInstalling Claude-Mem Windsurf hooks (${target} level)...\n`);

  const validTargets: WindsurfInstallTarget[] = ['project', 'user', 'system'];
  if (!validTargets.includes(target)) {
    console.error(`Invalid target: ${target}. Use: project, user, or system`);
    return 1;
  }

  const targetDir = getWindsurfTargetDir(target);
  if (!targetDir) {
    console.error(`Could not determine target directory for: ${target}`);
    return 1;
  }

  // Find the worker-service.cjs path
  const workerServicePath = findWorkerServicePath();
  if (!workerServicePath) {
    console.error('Could not find worker-service.cjs');
    console.error('   Expected at: ~/.claude/plugins/marketplaces/henyeu247-max/plugin/scripts/worker-service.cjs');
    return 1;
  }

  try {
    // Create target directory
    mkdirSync(targetDir, { recursive: true });

    const hooksJsonPath = path.join(targetDir, 'hooks.json');

    // Find bun executable
    const bunPath = findBunPath();

    // Helper to create hook command for bash (macOS/Linux)
    // NOTE: Do NOT manually escape backslashes — JSON.stringify handles it.
    // Manual escaping causes double-escaping (\\\\ in file → \\ after parse).
    const makeCommand = (command: string) => {
      return `"${bunPath}" "${workerServicePath}" hook windsurf ${command}`;
    };

    // Helper to create PowerShell command for Windows
    const makePowershell = (command: string) => {
      return `& "${bunPath}" "${workerServicePath}" hook windsurf ${command}`;
    };

    console.log(`  Using Bun runtime: ${bunPath}`);

    // Build hooks.json for Windsurf Cascade Hooks
    const hooksJson: WindsurfHooksJson = {
      hooks: {
        // User prompt → session init + context injection
        pre_user_prompt: [
          {
            command: makeCommand('session-init'),
            powershell: makePowershell('session-init'),
          },
          {
            command: makeCommand('context'),
            powershell: makePowershell('context'),
            show_output: true,
          },
        ],
        // Code reads → observation
        post_read_code: [
          {
            command: makeCommand('observation'),
            powershell: makePowershell('observation'),
          },
        ],
        // Code writes → observation + file edit tracking
        post_write_code: [
          {
            command: makeCommand('file-edit'),
            powershell: makePowershell('file-edit'),
          },
        ],
        // Command execution → observation
        post_run_command: [
          {
            command: makeCommand('observation'),
            powershell: makePowershell('observation'),
          },
        ],
        // MCP tool usage → observation
        post_mcp_tool_use: [
          {
            command: makeCommand('observation'),
            powershell: makePowershell('observation'),
          },
        ],
        // Cascade response → summarize session
        post_cascade_response: [
          {
            command: makeCommand('summarize'),
            powershell: makePowershell('summarize'),
          },
        ],
        // Full transcript → detailed session logging
        post_cascade_response_with_transcript: [
          {
            command: makeCommand('transcript'),
            powershell: makePowershell('transcript'),
          },
        ],
      }
    };

    writeFileSync(hooksJsonPath, JSON.stringify(hooksJson, null, 2));
    console.log(`  Created hooks.json (Cascade Hooks mode)`);
    console.log(`  Worker service: ${workerServicePath}`);

    console.log(`
Installation complete!

Hooks installed to: ${targetDir}/hooks.json
Using unified CLI: bun worker-service.cjs hook windsurf <command>

Next steps:
  1. Start claude-mem worker: claude-mem start
  2. Restart Windsurf to load the hooks
  3. Check Windsurf Settings → Hooks to verify

Hook events mapped:
  pre_user_prompt        → session-init + context injection
  post_read_code         → observation (file reads)
  post_write_code        → file-edit tracking
  post_run_command       → observation (terminal commands)
  post_mcp_tool_use     → observation (MCP tool calls)
  post_cascade_response → session summarize
  post_cascade_response_with_transcript → transcript logging
`);

    return 0;
  } catch (error) {
    console.error(`\nInstallation failed: ${(error as Error).message}`);
    if (target === 'system') {
      console.error('   Tip: System installation may require sudo/admin privileges');
    }
    return 1;
  }
}

// ============================================================================
// Hook Uninstallation
// ============================================================================

/**
 * Uninstall Windsurf Cascade hooks
 */
export function uninstallWindsurfHooks(target: WindsurfInstallTarget): number {
  console.log(`\nUninstalling Claude-Mem Windsurf hooks (${target} level)...\n`);

  const targetDir = getWindsurfTargetDir(target);
  if (!targetDir) {
    console.error(`Invalid target: ${target}`);
    return 1;
  }

  const hooksJsonPath = path.join(targetDir, 'hooks.json');

  if (!existsSync(hooksJsonPath)) {
    console.log(`  No hooks.json found at ${hooksJsonPath}`);
    return 0;
  }

  try {
    const raw = readFileSync(hooksJsonPath, 'utf-8');
    const config: WindsurfHooksJson = JSON.parse(raw);

    // Remove claude-mem hooks (those containing 'windsurf' in the command)
    let removed = 0;
    for (const [event, entries] of Object.entries(config.hooks)) {
      const filtered = entries.filter(entry => {
        const cmd = entry.command || '';
        const isOurs = cmd.includes('worker-service') && cmd.includes('windsurf');
        if (isOurs) removed++;
        return !isOurs;
      });
      if (filtered.length > 0) {
        config.hooks[event] = filtered;
      } else {
        delete config.hooks[event];
      }
    }

    if (removed > 0) {
      writeFileSync(hooksJsonPath, JSON.stringify(config, null, 2));
      console.log(`  Removed ${removed} claude-mem hook(s) from ${hooksJsonPath}`);
    } else {
      console.log(`  No claude-mem hooks found in ${hooksJsonPath}`);
    }

    return 0;
  } catch (error) {
    console.error(`Failed to uninstall: ${(error as Error).message}`);
    return 1;
  }
}

// ============================================================================
// Status Check
// ============================================================================

/**
 * Check Windsurf hooks installation status
 */
export function checkWindsurfHooksStatus(): number {
  console.log('\nClaude-Mem Windsurf Integration Status\n');

  const targets: [string, WindsurfInstallTarget][] = [
    ['Project', 'project'],
    ['User', 'user'],
    ['System', 'system'],
  ];

  let anyInstalled = false;

  for (const [label, target] of targets) {
    const targetDir = getWindsurfTargetDir(target);
    if (!targetDir) continue;

    const hooksJsonPath = path.join(targetDir, 'hooks.json');
    const exists = existsSync(hooksJsonPath);

    if (!exists) {
      console.log(`  ${label}: Not installed (${hooksJsonPath})`);
      continue;
    }

    try {
      const raw = readFileSync(hooksJsonPath, 'utf-8');
      const config: WindsurfHooksJson = JSON.parse(raw);
      const ourHooks = Object.entries(config.hooks).filter(([, entries]) =>
        entries.some(e => (e.command || '').includes('worker-service') && e.command.includes('windsurf'))
      );

      if (ourHooks.length > 0) {
        console.log(`  ${label}: ✅ Installed (${ourHooks.length} hook events)`);
        for (const [event] of ourHooks) {
          console.log(`    - ${event}`);
        }
        anyInstalled = true;
      } else {
        console.log(`  ${label}: ❌ hooks.json exists but no claude-mem hooks`);
      }
    } catch {
      console.log(`  ${label}: ⚠️ hooks.json exists but is corrupt`);
    }
  }

  if (!anyInstalled) {
    console.log('\nNo hooks installed. Run: claude-mem windsurf install\n');
  }

  return 0;
}

// ============================================================================
// CLI Handler
// ============================================================================

/**
 * Handle windsurf subcommand for hooks installation
 */
export function handleWindsurfCommand(subcommand: string, args: string[]): number {
  switch (subcommand) {
    case 'install': {
      const target = (args[0] || 'project') as WindsurfInstallTarget;
      return installWindsurfHooks(target);
    }

    case 'uninstall': {
      const target = (args[0] || 'project') as WindsurfInstallTarget;
      return uninstallWindsurfHooks(target);
    }

    case 'status': {
      return checkWindsurfHooksStatus();
    }

    default: {
      console.log(`
Claude-Mem Windsurf Integration

Usage: claude-mem windsurf <command> [options]

Commands:
  install [target]    Install Windsurf Cascade hooks
                      target: project (default), user, or system

  uninstall [target]  Remove Windsurf Cascade hooks
                      target: project (default), user, or system

  status              Check installation status

Examples:
  claude-mem windsurf install           # Install for current project
  claude-mem windsurf install user      # Install globally for user
  claude-mem windsurf uninstall         # Remove from current project
  claude-mem windsurf status            # Check if hooks are installed

Hook Events:
  pre_user_prompt        → Session init + context injection
  post_read_code         → File read observation
  post_write_code        → File edit tracking
  post_run_command       → Command execution observation
  post_mcp_tool_use      → MCP tool usage observation
  post_cascade_response  → Session summarize

For more info: https://docs.windsurf.com/windsurf/cascade/hooks
      `);
      return 0;
    }
  }
}
